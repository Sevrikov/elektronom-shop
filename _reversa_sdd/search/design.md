# Дизайн — модуль `search`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `lib/algolia.ts` — `getAlgoliaAdminClient`, `getAlgoliaSearchClient` (null при отсутствии env).
- `actions/search.ts` — `searchProducts`, `syncProductIndex`, `removeProductFromIndex`.
- `queries/search.ts` — `searchProductsFallback` (Prisma).
- `components/search/*`, страница `(shop)/search`.

## Поток (см. `flowcharts/search.md`)
- Поиск: search-клиент? → `searchSingleIndex(products_{locale})` (12) → map; иначе/ошибка → Prisma fallback → map.
- Sync: admin-клиент? → для uk/ru: `!isActive` → `deleteObject`; иначе `saveObjects`.

## Структуры
`SearchResultProduct {objectID,slug,sku,name,description,price,comparePrice,inStock,categorySlug,categoryName,brandName,image,locale}`.

## Решения
Per-locale индексы; единый record для индекса и fallback. Связь с admin (bulk sync — `bulkSyncProductsAlgoliaAdmin`).

## Риски
🟡 SE-2 нет bulk reindex; 🟡 SE-3 categoryName=slug; 🟡 SE-4 консистентность индекса.
