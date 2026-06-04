import "dotenv/config";
import * as XLSX from "xlsx";
import * as path from "path";
import { prisma } from "../src/lib/prisma";
import { sanitizeHtml } from "../src/lib/sanitize";

// Bypass Next.js cache calls in standalone script context
(global as any).cacheLife = () => {};
(global as any).cacheTag = () => {};

function norm_sku(sku: string): string {
  if (!sku) return "";
  const CYRILLIC_TO_LATIN: Record<string, string> = {
    'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Х': 'X',
    'а': 'A', 'в': 'B', 'е': 'E', 'к': 'K', 'м': 'M', 'н': 'H', 'о': 'O', 'р': 'P', 'с': 'C', 'т': 'T', 'у': 'Y', 'х': 'X',
    'І': 'I', 'і': 'I', 'Ѕ': 'S', 'ѕ': 'S', 'Ј': 'J', 'ј': 'J',
  };
  
  return sku.trim().toUpperCase().split('').map(char => CYRILLIC_TO_LATIN[char] || char).join('');
}

async function main() {
  console.log("🚀 Starting RESTORE of original product descriptions from Excel...");

  const filePath = path.join(__dirname, "..", "export-products-31-05-26_02-51-11.xlsx");
  console.log("Reading Excel file:", filePath);

  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  if (!sheetNames.includes("Export Products Sheet")) {
    throw new Error("Missing 'Export Products Sheet' in workbook.");
  }

  // --- 1. LOAD PRODUCT SKU TO ID MAPPING ---
  console.log("📦 Loading products and their translations from database...");
  const dbProducts = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      translations: {
        select: {
          locale: true,
          description: true,
        },
      },
    },
  });

  const skuToProductMap = new Map<string, typeof dbProducts[0]>();
  for (const p of dbProducts) {
    if (p.sku) {
      const normalizedSku = norm_sku(p.sku);
      if (normalizedSku) {
        skuToProductMap.set(normalizedSku, p);
      }
    }
  }
  console.log(`Loaded ${dbProducts.length} products from the database.`);

  // --- 2. PARSE EXCEL PRODUCTS SHEET ---
  console.log("📦 Parsing 'Export Products Sheet'...");
  const productsSheet = workbook.Sheets["Export Products Sheet"];
  const rawProducts = XLSX.utils.sheet_to_json(productsSheet, { header: 1 }) as any[][];

  if (rawProducts.length < 2) {
    console.log("No product rows found.");
    return;
  }

  const headers = rawProducts[0].map((h) => String(h || "").trim());
  const rows = rawProducts.slice(1);
  console.log(`Excel sheet contains ${rows.length} product rows.`);

  const codeIndex = headers.indexOf("Код_товара");
  const mpnIndex = headers.indexOf("Номер_устройства_(MPN)");
  const descRuIndex = headers.indexOf("Описание");
  const descUkIndex = headers.indexOf("Описание_укр");

  if (codeIndex === -1 && mpnIndex === -1) {
    throw new Error("Excel sheet is missing SKU columns ('Код_товара' or 'Номер_устройства_(MPN)').");
  }

  // --- 3. COMPARE AND GENERATE UPDATE QUEUE ---
  console.log("🔍 Comparing database records with original Excel values...");
  const updateQueue: { productId: string; locale: string; newDescription: string }[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const code = codeIndex !== -1 ? String(row[codeIndex] || "").trim() : "";
    const mpn = mpnIndex !== -1 ? String(row[mpnIndex] || "").trim() : "";
    const sku = code || mpn;

    if (!sku) continue;

    const normalizedSku = norm_sku(sku);
    const dbProduct = skuToProductMap.get(normalizedSku);
    if (!dbProduct) continue;

    // Original descriptions from Excel
    const descRuExcel = descRuIndex !== -1 ? String(row[descRuIndex] || "").trim() : "";
    const descUkExcel = descUkIndex !== -1 ? String(row[descUkIndex] || "").trim() : "";

    // Sanitize using our new expanded whitelist
    const cleanDescRu = sanitizeHtml(descRuExcel);
    const cleanDescUk = sanitizeHtml(descUkExcel);

    // Get current DB descriptions
    const currentUk = dbProduct.translations.find((t) => t.locale === "uk")?.description || "";
    const currentRu = dbProduct.translations.find((t) => t.locale === "ru")?.description || "";

    // If Excel has value and it differs from DB, queue for update
    if (cleanDescUk && cleanDescUk !== currentUk) {
      updateQueue.push({
        productId: dbProduct.id,
        locale: "uk",
        newDescription: cleanDescUk,
      });
    }

    if (cleanDescRu && cleanDescRu !== currentRu) {
      updateQueue.push({
        productId: dbProduct.id,
        locale: "ru",
        newDescription: cleanDescRu,
      });
    }
  }

  console.log(`Found ${updateQueue.length} translations that need to be restored/updated.`);

  if (updateQueue.length === 0) {
    console.log("✅ All product descriptions are already in sync. No updates needed.");
    return;
  }

  // --- 4. EXECUTE BATCH UPDATES ---
  const BATCH_SIZE = 20;
  console.log(`\n📥 Restoring descriptions in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < updateQueue.length; i += BATCH_SIZE) {
    const batch = updateQueue.slice(i, i + BATCH_SIZE);
    
    // Execute updates in parallel for this batch
    await Promise.all(
      batch.map(async (item) => {
        try {
          await prisma.productTranslation.updateMany({
            where: {
              productId: item.productId,
              locale: item.locale,
            },
            data: {
              description: item.newDescription,
            },
          });
        } catch (err) {
          console.error(`Failed to update product translation: productId=${item.productId}, locale=${item.locale}`, err);
        }
      })
    );

    if ((i + BATCH_SIZE) % 200 === 0 || i + BATCH_SIZE >= updateQueue.length) {
      const progress = Math.min(i + BATCH_SIZE, updateQueue.length);
      console.log(`Progress: ${progress}/${updateQueue.length} updates completed...`);
    }
  }

  console.log("🎉 Successfully restored product descriptions from Excel!");
}

main()
  .catch((e) => {
    console.error("Fatal error running restore script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
