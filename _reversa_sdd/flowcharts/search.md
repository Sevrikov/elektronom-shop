# Flowcharts — модуль `search`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Поиск с деградацией

```mermaid
flowchart TD
  A[searchProducts query, locale] --> B{Algolia search-клиент?}
  B -- нет --> F[searchProductsFallback Prisma take 12]
  B -- да --> C[searchSingleIndex products_locale, hitsPerPage 12]
  C -- ошибка --> F
  C -- ok --> D[map hits → SearchResultProduct]
  F --> E[map Prisma → SearchResultProduct]
  D & E --> G[results]
```

## 2. Синхронизация индекса (из admin)

```mermaid
flowchart TD
  A[syncProductIndex productId] --> B{admin-клиент?}
  B -- нет --> S[skip success]
  B -- да --> C[Prisma: товар + переводы + категория + бренд]
  C --> D{для locale в uk,ru}
  D --> E{isActive?}
  E -- нет --> R[deleteObject products_locale]
  E -- да --> U[saveObjects products_locale]
```

## Примечания
- Дрейф индекса возможен, если `syncProductIndex` не вызывается при каждом изменении товара (SE-4).
