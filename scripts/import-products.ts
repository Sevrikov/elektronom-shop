import "dotenv/config";
import * as XLSX from "xlsx";
import * as path from "path";
import * as crypto from "crypto";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/utils";

// Bypass Next.js cache calls in standalone script context
(global as any).cacheLife = () => { };
(global as any).cacheTag = () => { };

async function main() {
  console.log("🚀 Starting HIGH-SPEED BATCH import of products from Excel...");

  const filePath = path.join(__dirname, "..", "export-products-31-05-26_02-51-11.xlsx");
  console.log("Reading file:", filePath);

  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  if (!sheetNames.includes("Export Products Sheet") || !sheetNames.includes("Export Groups Sheet")) {
    throw new Error("Missing expected sheets in workbook.");
  }

  // --- 1. RESOLVE OR CREATE CATEGORIES ---
  console.log("📦 Loading categories...");
  const groupsSheet = workbook.Sheets["Export Groups Sheet"];
  const groupsData = XLSX.utils.sheet_to_json(groupsSheet) as any[];

  // Get all existing categories to avoid recreating them
  const existingCategories = await prisma.category.findMany({
    include: { translations: true }
  });

  const groupMap = new Map<string, string>(); // Номер_группы -> Category DB ID
  const categorySlugMap = new Map<string, string>(); // slugify(nameUk) -> Category DB ID

  for (const cat of existingCategories) {
    const transUk = cat.translations.find(t => t.locale === "uk")?.name || "";
    if (transUk) {
      categorySlugMap.set(slugify(transUk), cat.id);
    }
  }

  // Find or create categories
  let newCategoriesCount = 0;
  for (const row of groupsData) {
    const groupNum = String(row["Номер_группы"] || "").trim();
    const groupNameRu = String(row["Название_группы"] || "").trim();
    const groupNameUk = String(row["Название_группы_укр"] || "").trim();
    const groupImage = String(row["Ссылка_изображения_группы"] || "").trim();

    if (!groupNum || (!groupNameRu && !groupNameUk)) continue;

    const nameUk = groupNameUk || groupNameRu;
    const nameRu = groupNameRu || groupNameUk;
    const cleanKey = slugify(nameUk);

    let catId = categorySlugMap.get(cleanKey);
    if (!catId) {
      // Create it
      let slug = cleanKey;
      let counter = 1;
      while (true) {
        const ext = await prisma.category.findUnique({ where: { slug } });
        if (!ext) break;
        slug = `${cleanKey}-${counter++}`;
      }

      const newCat = await prisma.category.create({
        data: {
          slug,
          image: groupImage || null,
          translations: {
            createMany: {
              data: [
                { locale: "uk", name: nameUk },
                { locale: "ru", name: nameRu }
              ]
            }
          }
        }
      });
      catId = newCat.id;
      categorySlugMap.set(cleanKey, catId);
      newCategoriesCount++;
    }
    groupMap.set(groupNum, catId);
  }
  console.log(`... Loaded categories. Created ${newCategoriesCount} new categories.`);

  // Link parents if needed
  let parentLinksCount = 0;
  for (const row of groupsData) {
    const groupNum = String(row["Номер_группы"] || "").trim();
    const parentGroupNum = String(row["Номер_родителя"] || "").trim();
    if (groupNum && parentGroupNum && parentGroupNum !== "0") {
      const catId = groupMap.get(groupNum);
      const parentId = groupMap.get(parentGroupNum);
      if (catId && parentId) {
        const cat = existingCategories.find(c => c.id === catId);
        if (cat && !cat.parentId) {
          await prisma.category.update({
            where: { id: catId },
            data: { parentId }
          });
          parentLinksCount++;
        }
      }
    }
  }
  if (parentLinksCount > 0) {
    console.log(`... Linked ${parentLinksCount} parent categories.`);
  }

  // Create fallback category
  let fallbackCategoryId = "";
  const fallbackSlug = "other-products";
  const existingFallback = await prisma.category.findUnique({ where: { slug: fallbackSlug } });
  if (existingFallback) {
    fallbackCategoryId = existingFallback.id;
  } else {
    const fallback = await prisma.category.create({
      data: {
        slug: fallbackSlug,
        translations: {
          createMany: {
            data: [
              { locale: "uk", name: "Інші товари" },
              { locale: "ru", name: "Другие товары" }
            ]
          }
        }
      }
    });
    fallbackCategoryId = fallback.id;
  }

  // --- 2. LOAD EXISTING PRODUCTS SKUS AND SLUGS ---
  console.log("📦 Loading existing products from database...");
  const dbProducts = await prisma.product.findMany({
    select: { sku: true, slug: true }
  });
  const existingSkus = new Set(dbProducts.map(p => p.sku));
  const existingSlugs = new Set(dbProducts.map(p => p.slug));
  console.log(`Loaded ${existingSkus.size} existing products.`);

  // --- 3. RESOLVE BRANDS ---
  console.log("📦 Loading brands...");
  const dbBrands = await prisma.brand.findMany();
  const brandMap = new Map<string, string>(); // slugify(name) -> Brand ID
  dbBrands.forEach(b => brandMap.set(slugify(b.name), b.id));

  // --- 4. PARSE PRODUCTS SHEET ---
  console.log("📦 Parsing 'Export Products Sheet'...");
  const productsSheet = workbook.Sheets["Export Products Sheet"];
  const rawProducts = XLSX.utils.sheet_to_json(productsSheet, { header: 1 }) as any[][];

  if (rawProducts.length < 2) {
    console.log("No product rows found.");
    return;
  }

  const headers = rawProducts[0].map(h => String(h || "").trim());
  const rows = rawProducts.slice(1);
  console.log(`Total rows to process: ${rows.length}`);

  // Locate repeating characteristic headers
  const charHeaderIndices: number[] = [];
  headers.forEach((header, idx) => {
    if (header.startsWith("Название_Характеристики")) {
      charHeaderIndices.push(idx);
    }
  });

  const productsToCreate: any[] = [];
  const translationsToCreate: any[] = [];
  const imagesToCreate: any[] = [];
  const brandsToCreate = new Map<string, string>(); // Brand Slug -> Brand Name (deduplicated by slug)

  // Pre-scan for new brands
  for (const row of rows) {
    const manufacturer = String(row[headers.indexOf("Производитель")] || "").trim();
    if (manufacturer) {
      const bSlug = slugify(manufacturer);
      if (!brandMap.has(bSlug) && !brandsToCreate.has(bSlug)) {
        brandsToCreate.set(bSlug, manufacturer);
      }
    }
  }

  if (brandsToCreate.size > 0) {
    console.log(`Creating ${brandsToCreate.size} new Brands in batch...`);
    for (const [slug, name] of brandsToCreate.entries()) {
      const newBrand = await prisma.brand.create({
        data: { name, slug }
      });
      brandMap.set(slug, newBrand.id);
    }
  }

  console.log("Processing product rows and building batch payloads...");
  let skipCount = 0;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const code = String(row[headers.indexOf("Код_товара")] || "").trim();
    const nameRu = String(row[headers.indexOf("Название_позиции")] || "").trim();
    const nameUk = String(row[headers.indexOf("Название_позиции_укр")] || "").trim();
    const descRu = String(row[headers.indexOf("Описание")] || "").trim();
    const descUk = String(row[headers.indexOf("Описание_укр")] || "").trim();
    const priceRaw = row[headers.indexOf("Цена")];
    const qtyRaw = row[headers.indexOf("Количество")];
    const availability = String(row[headers.indexOf("Наличие")] || "").trim();
    const groupNum = String(row[headers.indexOf("Номер_группы")] || "").trim();
    const manufacturer = String(row[headers.indexOf("Производитель")] || "").trim();
    const imageUrlsRaw = String(row[headers.indexOf("Ссылка_изображения")] || "").trim();
    const mpn = String(row[headers.indexOf("Номер_устройства_(MPN)")] || "").trim();

    if (!nameRu && !nameUk) {
      continue;
    }

    const sku = code || mpn || `GEN-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    // Skip if already in DB
    if (existingSkus.has(sku)) {
      skipCount++;
      continue;
    }

    const titleUk = nameUk || nameRu;
    const titleRu = nameRu || nameUk;

    let baseSlug = slugify(titleUk);
    let slug = baseSlug;
    let slugCounter = 1;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${slugCounter++}`;
    }
    existingSlugs.add(slug);
    existingSkus.add(sku);

    const price = Number(String(priceRaw).replace(/,/g, ".").replace(/[^\d.]/g, "")) || 0;
    const stock = parseInt(String(qtyRaw || "0"), 10) || 0;
    const isActive = availability === "+" || availability.toLowerCase().includes("наличи") || stock > 0;
    const categoryId = groupMap.get(groupNum) || fallbackCategoryId;

    const brandSlug = manufacturer ? slugify(manufacturer) : "";
    const brandId = brandSlug ? (brandMap.get(brandSlug) || null) : null;

    // Build characteristics attributes JSON
    const attributes: Record<string, any> = {};
    for (const charIdx of charHeaderIndices) {
      const charName = String(row[charIdx] || "").trim();
      const charVal = String(row[charIdx + 2] || "").trim(); // charIdx + 2 is Значение_Характеристики

      if (charName && charVal) {
        const key = slugify(charName).replace(/-/g, "_");
        let typedVal: any = charVal;
        if (charVal === "Да" || charVal === "да" || charVal === "true") {
          typedVal = true;
        } else if (charVal === "Нет" || charVal === "нет" || charVal === "false") {
          typedVal = false;
        } else {
          const num = Number(charVal);
          if (!isNaN(num) && charVal !== "") {
            typedVal = num;
          }
        }

        if (typeof typedVal === "string" && (typedVal.includes(",") || typedVal.includes(";"))) {
          const separator = typedVal.includes(";") ? ";" : ",";
          typedVal = typedVal.split(separator).map(s => s.trim()).filter(Boolean);
        }

        attributes[key] = typedVal;
      }
    }

    const productId = crypto.randomUUID();

    // Push into arrays
    productsToCreate.push({
      id: productId,
      slug,
      sku,
      categoryId,
      brandId,
      price,
      stock,
      isActive,
      attributes,
      sortOrder: index
    });

    translationsToCreate.push({
      id: crypto.randomUUID(),
      productId,
      locale: "uk",
      name: titleUk,
      description: descUk || null
    }, {
      id: crypto.randomUUID(),
      productId,
      locale: "ru",
      name: titleRu,
      description: descRu || null
    });

    if (imageUrlsRaw) {
      const imageUrls = imageUrlsRaw.split(",").map(url => url.trim()).filter(Boolean);
      imageUrls.forEach((url, idx) => {
        imagesToCreate.push({
          id: crypto.randomUUID(),
          productId,
          provider: "EXTERNAL",
          url,
          sortOrder: idx
        });
      });
    }
  }

  console.log(`Deduplicated: skipped ${skipCount} products already in database.`);
  console.log(`Ready to batch insert ${productsToCreate.length} products, ${translationsToCreate.length} translations, and ${imagesToCreate.length} images.`);

  // --- 5. BATCH WRITES ---
  const BATCH_SIZE = 1000;

  // 5.1 Create Products
  console.log("\n📥 Inserting products in batches of 1000...");
  for (let i = 0; i < productsToCreate.length; i += BATCH_SIZE) {
    const batch = productsToCreate.slice(i, i + BATCH_SIZE);
    await prisma.product.createMany({ data: batch });
    console.log(`Created products batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(productsToCreate.length / BATCH_SIZE)}`);
  }

  // 5.2 Create Translations
  console.log("\n📥 Inserting translations in batches of 2000...");
  const TRANSLATIONS_BATCH_SIZE = BATCH_SIZE * 2;
  for (let i = 0; i < translationsToCreate.length; i += TRANSLATIONS_BATCH_SIZE) {
    const batch = translationsToCreate.slice(i, i + TRANSLATIONS_BATCH_SIZE);
    await prisma.productTranslation.createMany({ data: batch });
    console.log(`Created translations batch ${Math.floor(i / TRANSLATIONS_BATCH_SIZE) + 1}/${Math.ceil(translationsToCreate.length / TRANSLATIONS_BATCH_SIZE)}`);
  }

  // 5.3 Create Images
  console.log("\n📥 Inserting images in batches of 1000...");
  for (let i = 0; i < imagesToCreate.length; i += BATCH_SIZE) {
    const batch = imagesToCreate.slice(i, i + BATCH_SIZE);
    await prisma.productImage.createMany({ data: batch });
    console.log(`Created images batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imagesToCreate.length / BATCH_SIZE)}`);
  }

  console.log(`\n🎉 HIGH-SPEED BATCH IMPORT COMPLETED!`);
  console.log(`Successfully added ${productsToCreate.length} products to database.`);
}

main()
  .catch((err) => {
    console.error("❌ Critical error during batch import:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
