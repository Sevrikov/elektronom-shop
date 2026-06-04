# Flowcharts — модуль `catalog`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢 (из кода).

## 1. Рендер страницы категории `(shop)/catalog/[slug]`

```mermaid
flowchart TD
  A[Запрос /catalog/:slug?filters] --> B[parseCatalogSearchParams searchParams]
  B --> C{priceMin > priceMax?}
  C -- да --> C1[swap priceMin/priceMax]
  C -- нет --> D[ActiveFilters]
  C1 --> D
  D --> E[getCategoryBySlug slug, locale — cache hours]
  D --> F[getFilteredProducts — SQL, не кэш]
  D --> G[getCategoryFacets — in-memory]
  F --> F1[buildProductWhere → buildAttributeWhere<br/>AND keys / OR values + GIN]
  F1 --> F2[(Postgres products)]
  F2 --> H[products + total + totalPages]
  G --> G1[getCategoryProductsForFacets take 50000 — cache minutes]
  G1 --> G2[matchProduct по каждой опции<br/>excludeKey = своя группа]
  G2 --> I[CategoryFacets: brands, attributes, price buckets×32]
  E --> J[Рендер: H1 + дерево + quickLinks]
  H --> K[Сетка товаров + пагинация]
  I --> L[Сайдбар фильтров реактивные счётчики]
```

## 2. Реактивный счётчик фасета (приём «exclude self»)

```mermaid
flowchart LR
  A[Опция фасета key=val] --> B{Для каждого товара p}
  B --> C[p.attributes key содержит val?]
  C -- нет --> B
  C -- да --> D[matchProduct p, excludeKey=key]
  D -- проходит все ДРУГИЕ фильтры --> E[count++]
  D -- нет --> B
  E --> F[FacetOption.count]
  F --> G{count==0 и не выбрана?}
  G -- да --> H[disabled = true]
  G -- нет --> I[активна/выбрана]
```

## 3. Жизненный цикл состояния фильтров (URL — источник истины)

```mermaid
stateDiagram-v2
  [*] --> URL
  URL --> Parsed: parseCatalogSearchParams
  Parsed --> Toggle: клик чекбокс/пилюля
  Toggle --> NewState: toggleMultiValueFilter (page→1)
  Parsed --> Remove: снять чип
  Remove --> NewState: removeFilter (page→1)
  Parsed --> Clear: «Очистить»
  Clear --> NewState: clearFiltersPreserveSort (sort сохраняется)
  NewState --> NewURL: buildCatalogHref (каноничный порядок)
  NewURL --> URL: router.push
```

## Примечания
- Пути списка (SQL) и счётчиков (in-memory) расходятся по реализации — диаграмма 1 показывает оба; синхронность логики критична (находка C-2).
- `page` сбрасывается при любой мутации фильтра (диаграмма 3).
