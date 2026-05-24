// prisma/seed.ts
// Задача 1.2 — Seed-данные (категории, бренды, товары uk+ru)
// MASTER_CONTEXT v1.2

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"],
});
const prisma = new PrismaClient({ adapter });

type CategoryTranslationSeed = {
  locale: string;
  name: string;
  description?: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
};

type CategorySeed = {
  slug: string;
  sortOrder: number;
  image: string | null;
  translations: CategoryTranslationSeed[];
  children?: CategorySeed[];
};

// ─── КАТЕГОРИИ ───────────────────────────────────────────────────────────────

const CATEGORIES: CategorySeed[] = [
  {
    slug: "masla-dlya-avto",
    sortOrder: 1,
    image: null as string | null,
    translations: [
      {
        locale: "uk",
        name: "Масла для авто",
        description: "Моторні, трансмісійні та інші мастила для автомобілів",
        metaTitle: "Масла для авто — купити в Електроном",
        metaDesc: "Великий вибір моторних і трансмісійних масел для авто. Доставка по Україні.",
      },
      {
        locale: "ru",
        name: "Масла для авто",
        description: "Моторные, трансмиссионные и другие масла для автомобилей",
        metaTitle: "Масла для авто — купить в Электроном",
        metaDesc: "Большой выбор моторных и трансмиссионных масел для авто. Доставка по Украине.",
      },
    ],
    children: [
      {
        slug: "motornye-masla",
        sortOrder: 1,
        image: null as string | null,
        translations: [
          { locale: "uk", name: "Моторні мастила", metaTitle: "Моторні мастила", metaDesc: "Купити моторне масло в Україні" },
          { locale: "ru", name: "Моторные масла", metaTitle: "Моторные масла", metaDesc: "Купить моторное масло на Украине" },
        ],
      },
      {
        slug: "transmissionnye-masla",
        sortOrder: 2,
        image: null as string | null,
        translations: [
          { locale: "uk", name: "Трансмісійні мастила", metaTitle: "Трансмісійні мастила", metaDesc: null },
          { locale: "ru", name: "Трансмиссионные масла", metaTitle: "Трансмиссионные масла", metaDesc: null },
        ],
      },
      {
        slug: "gidravlicheskie-masla",
        sortOrder: 3,
        image: null as string | null,
        translations: [
          { locale: "uk", name: "Гідравлічні мастила", metaTitle: "Гідравлічні мастила", metaDesc: null },
          { locale: "ru", name: "Гидравлические масла", metaTitle: "Гидравлические масла", metaDesc: null },
        ],
      },
    ],
  },
  {
    slug: "aksesuari",
    sortOrder: 2,
    image: null as string | null,
    translations: [
      { locale: "uk", name: "Автоаксесуари", metaTitle: "Автоаксесуари", metaDesc: "Аксесуари для авто в Україні" },
      { locale: "ru", name: "Автоаксессуары", metaTitle: "Автоаксессуары", metaDesc: "Аксессуары для авто в Украине" },
    ],
    children: [
      {
        slug: "filtry",
        sortOrder: 1,
        image: null as string | null,
        translations: [
          { locale: "uk", name: "Фільтри", metaTitle: "Фільтри для авто", metaDesc: null },
          { locale: "ru", name: "Фильтры", metaTitle: "Фильтры для авто", metaDesc: null },
        ],
      },
      {
        slug: "zhidkosti",
        sortOrder: 2,
        image: null as string | null,
        translations: [
          { locale: "uk", name: "Рідини та присадки", metaTitle: "Рідини та присадки", metaDesc: null },
          { locale: "ru", name: "Жидкости и присадки", metaTitle: "Жидкости и присадки", metaDesc: null },
        ],
      },
    ],
  },
];

// ─── БРЕНДЫ ───────────────────────────────────────────────────────────────────

const BRANDS = [
  { slug: "castrol", name: "Castrol", logo: null as string | null },
  { slug: "shell", name: "Shell", logo: null as string | null },
  { slug: "mobil", name: "Mobil 1", logo: null as string | null },
  { slug: "total", name: "TotalEnergies", logo: null as string | null },
  { slug: "liqui-moly", name: "Liqui Moly", logo: null as string | null },
  { slug: "mannol", name: "Mannol", logo: null as string | null },
];

// ─── ТОВАРИ ───────────────────────────────────────────────────────────────────

type ProductSeed = {
  slug: string;
  sku: string;
  categorySlug: string;
  brandSlug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  attributes: Record<string, string>;
  translations: { locale: string; name: string; description: string; metaTitle: string; metaDesc: string }[];
  images: { url: string; alt: string; sortOrder: number }[];
};

const PRODUCTS: ProductSeed[] = [
  // CASTROL
  {
    slug: "castrol-edge-5w30-4l",
    sku: "CAST-EDGE-5W30-4L",
    categorySlug: "motornye-masla",
    brandSlug: "castrol",
    price: 1890,
    comparePrice: 2100,
    stock: 45,
    isActive: true,
    isFeatured: true,
    attributes: { viscosity: "5W-30", volume: "4L", type: "synthetic", api: "SN PLUS", acea: "C3" },
    translations: [
      {
        locale: "uk",
        name: "Castrol EDGE 5W-30 4 л",
        description: "Повністю синтетична олива для двигунів сучасних автомобілів. Забезпечує максимальний захист двигуна в умовах екстремального навантаження.",
        metaTitle: "Castrol EDGE 5W-30 4 л — купити в Електроном",
        metaDesc: "Castrol EDGE 5W-30 4 л — синтетична олива. Ціна ₴1890. Доставка по Україні.",
      },
      {
        locale: "ru",
        name: "Castrol EDGE 5W-30 4 л",
        description: "Полностью синтетическое масло для двигателей современных автомобилей. Обеспечивает максимальную защиту двигателя.",
        metaTitle: "Castrol EDGE 5W-30 4 л — купить в Электроном",
        metaDesc: "Castrol EDGE 5W-30 4 л — синтетическое масло. Цена ₴1890. Доставка по Украине.",
      },
    ],
    images: [
      { url: "/images/products/castrol_edge_5w30.png", alt: "Castrol EDGE 5W-30 4L", sortOrder: 0 },
      { url: "/images/products/castrol_edge_5w30_spec.png", alt: "Castrol EDGE 5W-30 4L Specifications", sortOrder: 1 },
      { url: "/images/products/castrol_edge_pour.png", alt: "Castrol EDGE 5W-30 4L Pour Detail", sortOrder: 2 },
    ],
  },
  {
    slug: "castrol-edge-5w40-4l",
    sku: "CAST-EDGE-5W40-4L",
    categorySlug: "motornye-masla",
    brandSlug: "castrol",
    price: 1950,
    comparePrice: null,
    stock: 30,
    isActive: true,
    isFeatured: false,
    attributes: { viscosity: "5W-40", volume: "4L", type: "synthetic", api: "SN", acea: "A3/B4" },
    translations: [
      {
        locale: "uk",
        name: "Castrol EDGE 5W-40 4 л",
        description: "Синтетична олива для потужних двигунів з турбонаддувом.",
        metaTitle: "Castrol EDGE 5W-40 4 л — купити",
        metaDesc: "Castrol EDGE 5W-40 4 л. Ціна ₴1950.",
      },
      {
        locale: "ru",
        name: "Castrol EDGE 5W-40 4 л",
        description: "Синтетическое масло для мощных двигателей с турбонаддувом.",
        metaTitle: "Castrol EDGE 5W-40 4 л — купить",
        metaDesc: "Castrol EDGE 5W-40 4 л. Цена ₴1950.",
      },
    ],
    images: [
      { url: "/images/products/castrol_edge_5w30.png", alt: "Castrol EDGE 5W-40 4L", sortOrder: 0 },
    ],
  },
  // SHELL
  {
    slug: "shell-helix-ultra-5w30-4l",
    sku: "SHELL-HU-5W30-4L",
    categorySlug: "motornye-masla",
    brandSlug: "shell",
    price: 1750,
    comparePrice: 1980,
    stock: 60,
    isActive: true,
    isFeatured: true,
    attributes: { viscosity: "5W-30", volume: "4L", type: "synthetic", api: "SN", acea: "A3/B3/B4" },
    translations: [
      {
        locale: "uk",
        name: "Shell Helix Ultra 5W-30 4 л",
        description: "Провідна синтетична олива Shell на основі природного газу (Gas-to-Liquid). Перевищує вимоги провідних виробників авто.",
        metaTitle: "Shell Helix Ultra 5W-30 4 л — Електроном",
        metaDesc: "Shell Helix Ultra 5W-30 4 л. Купити за ₴1750. Швидка доставка.",
      },
      {
        locale: "ru",
        name: "Shell Helix Ultra 5W-30 4 л",
        description: "Ведущее синтетическое масло Shell на основе природного газа. Превышает требования ведущих производителей авто.",
        metaTitle: "Shell Helix Ultra 5W-30 4 л — Электроном",
        metaDesc: "Shell Helix Ultra 5W-30 4 л. Купить за ₴1750. Быстрая доставка.",
      },
    ],
    images: [
      { url: "/images/products/shell_helix_ultra.png", alt: "Shell Helix Ultra 5W-30 4L", sortOrder: 0 },
    ],
  },
  // MOBIL
  {
    slug: "mobil-1-esp-5w30-4l",
    sku: "MOB1-ESP-5W30-4L",
    categorySlug: "motornye-masla",
    brandSlug: "mobil",
    price: 2100,
    comparePrice: 2350,
    stock: 25,
    isActive: true,
    isFeatured: true,
    attributes: { viscosity: "5W-30", volume: "4L", type: "synthetic", api: "SN", acea: "C2/C3" },
    translations: [
      {
        locale: "uk",
        name: "Mobil 1 ESP 5W-30 4 л",
        description: "Розширений захист двигуна для автомобілів з сажовими фільтрами (DPF). Відповідає специфікаціям MB, VW, GM.",
        metaTitle: "Mobil 1 ESP 5W-30 4 л — купити в Україні",
        metaDesc: "Mobil 1 ESP 5W-30 4 л. Ціна ₴2100. Для авто з DPF.",
      },
      {
        locale: "ru",
        name: "Mobil 1 ESP 5W-30 4 л",
        description: "Расширенная защита двигателя для автомобилей с сажевыми фильтрами (DPF).",
        metaTitle: "Mobil 1 ESP 5W-30 4 л — купить в Украине",
        metaDesc: "Mobil 1 ESP 5W-30 4 л. Цена ₴2100. Для авто с DPF.",
      },
    ],
    images: [
      { url: "/images/products/mobil1_esp.png", alt: "Mobil 1 ESP 5W-30 4L", sortOrder: 0 },
    ],
  },
  // LIQUI MOLY
  {
    slug: "liqui-moly-top-tec-4200-5w30-4l",
    sku: "LM-TT4200-5W30-4L",
    categorySlug: "motornye-masla",
    brandSlug: "liqui-moly",
    price: 2250,
    comparePrice: null,
    stock: 20,
    isActive: true,
    isFeatured: false,
    attributes: { viscosity: "5W-30", volume: "4L", type: "synthetic", api: "SN", acea: "C3" },
    translations: [
      {
        locale: "uk",
        name: "Liqui Moly Top Tec 4200 5W-30 4 л",
        description: "Виробляється в Германії. Підходить для двигунів з системами нейтралізації відпрацьованих газів.",
        metaTitle: "Liqui Moly Top Tec 4200 5W-30 4 л",
        metaDesc: "Liqui Moly 5W-30 4 л. Ціна ₴2250. Зроблено в Германії.",
      },
      {
        locale: "ru",
        name: "Liqui Moly Top Tec 4200 5W-30 4 л",
        description: "Производится в Германии. Подходит для двигателей с системами нейтрализации выхлопных газов.",
        metaTitle: "Liqui Moly Top Tec 4200 5W-30 4 л",
        metaDesc: "Liqui Moly 5W-30 4 л. Цена ₴2250. Сделано в Германии.",
      },
    ],
    images: [
      { url: "/images/products/liqui_moly.png", alt: "Liqui Moly Top Tec 4200 5W-30 4L", sortOrder: 0 },
    ],
  },
  // MANNOL
  {
    slug: "mannol-energy-5w30-4l",
    sku: "MANN-EN-5W30-4L",
    categorySlug: "motornye-masla",
    brandSlug: "mannol",
    price: 890,
    comparePrice: 1050,
    stock: 100,
    isActive: true,
    isFeatured: false,
    attributes: { viscosity: "5W-30", volume: "4L", type: "synthetic", api: "SN/CF", acea: "A3/B4" },
    translations: [
      {
        locale: "uk",
        name: "Mannol Energy 5W-30 4 л",
        description: "Синтетична олива для бензинових і дизельних двигунів. Оптимальне співвідношення ціна/якість.",
        metaTitle: "Mannol Energy 5W-30 4 л — дешево",
        metaDesc: "Mannol Energy 5W-30 4 л. Вигідна ціна ₴890. Доставка по Україні.",
      },
      {
        locale: "ru",
        name: "Mannol Energy 5W-30 4 л",
        description: "Синтетическое масло для бензиновых и дизельных двигателей. Оптимальное соотношение цена/качество.",
        metaTitle: "Mannol Energy 5W-30 4 л — дёшево",
        metaDesc: "Mannol Energy 5W-30 4 л. Выгодная цена ₴890. Доставка по Украине.",
      },
    ],
    images: [
      { url: "/images/products/mannol_energy.png", alt: "Mannol Energy 5W-30 4L", sortOrder: 0 },
    ],
  },
  // TOTAL — трансмиссия
  {
    slug: "total-transmission-tm-8-75w90-1l",
    sku: "TOTAL-TM8-75W90-1L",
    categorySlug: "transmissionnye-masla",
    brandSlug: "total",
    price: 780,
    comparePrice: null,
    stock: 35,
    isActive: true,
    isFeatured: false,
    attributes: { viscosity: "75W-90", volume: "1L", type: "synthetic", api: "GL-5" },
    translations: [
      {
        locale: "uk",
        name: "Total Transmission TM 8 75W-90 1 л",
        description: "Синтетична трансмісійна олива для мостів і коробок передач. Забезпечує надійний захист передавальних механізмів.",
        metaTitle: "Total Transmission TM 8 75W-90 1 л",
        metaDesc: "Total трансмісійна олива 75W-90. Ціна ₴780.",
      },
      {
        locale: "ru",
        name: "Total Transmission TM 8 75W-90 1 л",
        description: "Синтетическое трансмиссионное масло для мостов и коробок передач.",
        metaTitle: "Total Transmission TM 8 75W-90 1 л",
        metaDesc: "Total трансмиссионное масло 75W-90. Цена ₴780.",
      },
    ],
    images: [
      { url: "/images/products/total_transmission.png", alt: "Total Transmission TM 8 75W-90 1L", sortOrder: 0 },
    ],
  },
  // Фильтры
  {
    slug: "bosch-filtry-maslyanyy-0451103079",
    sku: "BSH-OF-0451103079",
    categorySlug: "filtry",
    brandSlug: "mannol",
    price: 145,
    comparePrice: 180,
    stock: 200,
    isActive: true,
    isFeatured: false,
    attributes: { type: "oil-filter", brand_compatibility: "VW,Audi,Skoda,Seat" },
    translations: [
      {
        locale: "uk",
        name: "Фільтр масляний Bosch 0451103079",
        description: "Масляний фільтр для автомобілів VW, Audi, Skoda, Seat. OEM якість.",
        metaTitle: "Фільтр масляний Bosch 0451103079",
        metaDesc: "Масляний фільтр Bosch. Ціна ₴145.",
      },
      {
        locale: "ru",
        name: "Фильтр масляный Bosch 0451103079",
        description: "Масляный фильтр для автомобилей VW, Audi, Skoda, Seat. OEM качество.",
        metaTitle: "Фильтр масляный Bosch 0451103079",
        metaDesc: "Масляный фильтр Bosch. Цена ₴145.",
      },
    ],
    images: [
      { url: "/images/products/bosch_filter.png", alt: "Bosch Oil Filter 0451103079", sortOrder: 0 },
    ],
  },
];



// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // Бренды
  console.log("  → Seeding brands...");
  const brandMap = new Map<string, string>();
  for (const brand of BRANDS) {
    const b = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, logo: brand.logo, isActive: true },
      create: { slug: brand.slug, name: brand.name, logo: brand.logo, isActive: true },
      select: { id: true, slug: true },
    });
    brandMap.set(b.slug, b.id);
  }
  console.log(`    ✓ ${BRANDS.length} brands`);

  // Категории (сначала родители, потом дети)
  console.log("  → Seeding categories...");
  const catMap = new Map<string, string>();
  let catCount = 0;

  for (const cat of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { sortOrder: cat.sortOrder, isActive: true },
      create: { slug: cat.slug, sortOrder: cat.sortOrder, isActive: true, image: cat.image },
      select: { id: true },
    });
    catMap.set(cat.slug, parent.id);
    catCount++;

    // Переводы родителя
    for (const t of cat.translations) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: parent.id, locale: t.locale } },
        update: { name: t.name, description: t.description ?? null, metaTitle: t.metaTitle ?? null, metaDesc: t.metaDesc ?? null },
        create: { categoryId: parent.id, locale: t.locale, name: t.name, description: t.description ?? null, metaTitle: t.metaTitle ?? null, metaDesc: t.metaDesc ?? null },
      });
    }

    // Дочерние категории
    for (const child of cat.children ?? []) {
      const c = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { sortOrder: child.sortOrder, parentId: parent.id, isActive: true },
        create: { slug: child.slug, sortOrder: child.sortOrder, parentId: parent.id, isActive: true, image: child.image },
        select: { id: true },
      });
      catMap.set(child.slug, c.id);
      catCount++;

      for (const t of child.translations) {
        await prisma.categoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: c.id, locale: t.locale } },
          update: { name: t.name, metaTitle: t.metaTitle ?? null, metaDesc: t.metaDesc ?? null },
          create: { categoryId: c.id, locale: t.locale, name: t.name, metaTitle: t.metaTitle ?? null, metaDesc: t.metaDesc ?? null },
        });
      }
    }
  }
  console.log(`    ✓ ${catCount} categories`);

  // Товары
  console.log("  → Seeding products...");
  let prodCount = 0;

  for (const prod of PRODUCTS) {
    const categoryId = catMap.get(prod.categorySlug);
    const brandId = brandMap.get(prod.brandSlug);

    if (!categoryId) {
      console.warn(`    ⚠️ Category not found: ${prod.categorySlug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        sku: prod.sku,
        categoryId,
        brandId: brandId ?? null,
        price: prod.price,
        comparePrice: prod.comparePrice,
        stock: prod.stock,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        attributes: prod.attributes,
      },
      create: {
        slug: prod.slug,
        sku: prod.sku,
        categoryId,
        brandId: brandId ?? null,
        price: prod.price,
        comparePrice: prod.comparePrice,
        stock: prod.stock,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        attributes: prod.attributes,
      },
      select: { id: true },
    });
    prodCount++;

    // Переводы
    for (const t of prod.translations) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale: t.locale } },
        update: { name: t.name, description: t.description, metaTitle: t.metaTitle, metaDesc: t.metaDesc },
        create: { productId: product.id, locale: t.locale, name: t.name, description: t.description, metaTitle: t.metaTitle, metaDesc: t.metaDesc },
      });
    }

    // Изображения
    for (const img of prod.images) {
      const imgId = `${product.id}-img-${img.sortOrder}`;
      await prisma.productImage.upsert({
        where: { id: imgId },
        update: { url: img.url, alt: img.alt, sortOrder: img.sortOrder },
        create: { id: imgId, productId: product.id, url: img.url, alt: img.alt, sortOrder: img.sortOrder },
      });
    }
  }
  console.log(`    ✓ ${prodCount} products`);

  // ─── ALGOLIA INDEXING ──────────────────────────────────────────────────────────
  if (process.env["ALGOLIA_APP_ID"] && process.env["ALGOLIA_ADMIN_KEY"]) {
    console.log("  → Syncing seeded products with Algolia...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let algoliasearchModule: any;
      try {
        algoliasearchModule = await import("algoliasearch");
      } catch {
        console.log("    Algolia package 'algoliasearch' not installed, skipping index sync.");
        return;
      }
      const algoliasearch = algoliasearchModule.default || algoliasearchModule;

      const client = algoliasearch(
        process.env["ALGOLIA_APP_ID"]!,
        process.env["ALGOLIA_ADMIN_KEY"]!
      );

      const locales = ["uk", "ru"] as const;

      for (const locale of locales) {
        const indexName = `products_${locale}`;
        console.log(`    Indexing to Algolia index: ${indexName}...`);

        const activeProducts = await prisma.product.findMany({
          where: { isActive: true },
          select: {
            id: true,
            slug: true,
            sku: true,
            price: true,
            comparePrice: true,
            stock: true,
            translations: {
              where: { locale },
              select: { name: true, description: true }
            },
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
              select: { url: true }
            },
            category: {
              select: {
                slug: true,
                translations: {
                  where: { locale },
                  select: { name: true }
                }
              }
            },
            brand: {
              select: { name: true }
            }
          }
        });

        const records = activeProducts.map((p) => ({
          objectID: p.id,
          slug: p.slug,
          sku: p.sku,
          name: p.translations[0]?.name ?? "",
          description: p.translations[0]?.description ?? "",
          price: Number(p.price),
          comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
          inStock: p.stock > 0,
          categorySlug: p.category.slug,
          categoryName: p.category.translations[0]?.name ?? "",
          brandName: p.brand?.name ?? null,
          image: p.images[0]?.url ?? null,
          locale,
        }));

        if (records.length > 0) {
          await client.saveObjects({
            indexName,
            objects: records,
          });
          console.log(`    ✓ Indexed ${records.length} records in ${indexName}`);
        }
      }
    } catch (err) {
      console.warn("    ⚠️ Failed to sync with Algolia:", err);
    }
  } else {
    console.log("  → Algolia credentials not found in env, skipping index sync.");
  }

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

