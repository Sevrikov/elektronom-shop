# Flowcharts — модуль `product`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Рендер карточки товара `(shop)/product/[slug]`

```mermaid
flowchart TD
  A[Запрос /product/:slug] --> B[isValidLocale?]
  B -- нет --> N[notFound]
  B -- да --> C[getProductBySlug slug, locale — cache seconds]
  C -- null --> N
  C --> D[auth → currentUser]
  C --> E[Парсинг attributes:<br/>qty_breaks vs displayAttrs]
  D & E --> F[Hero: галерея + цена/скидка/наличие + AddToCart]
  F --> G{qty_breaks.length>0?}
  G -- да --> H[QtyBreaksTable: base×(1−discount/100)]
  C --> I[ProductSchema JSON-LD]
  C --> J[ProductReviews initial=видимые отзывы]
  C --> K[Suspense: SameSeriesProducts]
  C --> L[Suspense: RelatedProductsSection]
```

## 2. Отправка отзыва `submitProductReview`

```mermaid
flowchart TD
  A[submitProductReview data] --> B{auth?}
  B -- нет --> E1[error Неавторизовано]
  B -- да --> C[zod: rating 1-5, comment 1-1000]
  C -- invalid --> E2[error Некоректні дані]
  C -- ok --> D{уже есть отзыв<br/>productId+userId?}
  D -- да --> E3[error Ви вже залишили відгук]
  D -- нет --> F[Поиск заказа DELIVERED с этим товаром]
  F --> G[verifiedPurchase = !!order]
  G --> H[review.create isVisible=false ПРЕМОДЕРАЦИЯ]
  H --> I[success]
```

## Примечания
- `isVisible=false` ⇒ отзыв не появится в выдаче, пока админ не одобрит (модуль admin).
- `qty_breaks` берётся из JSONB `attributes`, не из отдельной таблицы (находка P-2/C-4).
