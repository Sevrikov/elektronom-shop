# Дизайн — модуль `catalog`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Компоненты и файлы
- `queries/products.ts` — `getFilteredProducts`, `buildProductWhere`, `buildAttributeWhere`, `productCardSelect`.
- `queries/categories.ts` — `getCategories`, `getCategoryBySlug`, `getCategoryTree`, `getCategoryProductsForFacets`, `getCategoryFacets`.
- `queries/brands.ts` — список/бренд по slug.
- `lib/catalog-filter-url.ts` — `parseCatalogSearchParams`, `buildCatalogHref`, `toggleMultiValueFilter`, `removeFilter`, `clearFiltersPreserveSort`, `extractAttributeFilters`.
- `lib/catalog-filter-config.ts`, `lib/catalog-data.ts` — конфиги фильтров (🟡 дублирование).
- `components/catalog/*` (14), `config/catalog-mega-menu.ts`.

## Поток (страница категории)
1. `parseCatalogSearchParams(searchParams)` → `ActiveFilters` (+нормализация цены).
2. Параллельно: `getCategoryBySlug` (cache hours), `getFilteredProducts` (SQL, без кэша), `getCategoryFacets` (in-memory, cache minutes).
3. Рендер: H1 + дерево + quickLinks, сетка товаров + пагинация, сайдбар фасетов.
(Диаграммы — `flowcharts/catalog.md`.)

## Алгоритмы
- **SQL JSONB-фильтр** (`buildAttributeWhere`): на значение — до 4 условий (`equals`/`array_contains` × строка/число[/bool]); AND ключей, OR значений; `excludeFacetKey` для счётчиков.
- **In-memory фасеты** (`getCategoryFacets`): `matchProduct(p, excludeKey)`, реактивные count'ы, диапазоны absolute/available, 32 бакета; сортировка `localeCompare(numeric)`.
- **Дерево** (`getCategoryTree`): Map + `parentId` → roots/children.

## Структуры данных
`ActiveFilters`, `CategoryFacets {total, price{absoluteMin/Max,availableMin/Max,selectedMin/Max,buckets[32]}, brands:FacetOption[], attributes:Record<key,FacetOption[]>}`, `FacetOption {value,label,count,selected,disabled,logo?}`, `FilterDefinition`, `CategoryTreeNode`.

## Кэш/инвалидация
Теги: `categories`, `category-{slug}`, `products`, `category-products-facets-{slug}`. Инвалидация — из admin (`revalidateTag`).

## Технические решения
См. [ADR-0001](../adrs/0001-jsonb-product-attributes.md), [ADR-0002](../adrs/0002-in-memory-reactive-facets.md).

## Риски
- 🔴 C-1: 50k in-memory лимит. 🟡 C-2: рассинхрон SQL↔in-memory. 🟡 C-3: дублирование конфигов. 🟡 C-6: типобезопасность JSONB.
