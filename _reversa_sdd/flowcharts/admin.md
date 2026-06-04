# Flowcharts — модуль `admin`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Сохранение товара (admin)

```mermaid
flowchart TD
  A[saveProductAdmin data] --> B[requireAdmin]
  B -- throw FORBIDDEN/UNAUTHORIZED --> X[ошибка 403/401]
  B --> C[zod SaveProductSchema]
  C --> D[$transaction: upsert Product + переводы + изображения]
  D --> E[revalidateTag products, product-slug]
  E --> F[syncProductIndex → Algolia]
```

## 2. Content Factory (AI-генерация контента)

```mermaid
flowchart TD
  A[launchContentFactoryForProductAdmin] --> B[requireAdmin]
  B --> C[fetch CONTENT_FACTORY_API_URL + token]
  C --> D[runId]
  D --> E[getContentFactoryProductStatusesAdmin / getRunResult — polling]
  E --> F[применение сгенерированного контента к товару]
```

## 3. Модерация отзыва (закрытие цикла премодерации)

```mermaid
flowchart LR
  A[Отзыв isVisible=false] --> B[getReviewsAdmin фильтр isVisible]
  B --> C{одобрить?}
  C -- да --> D[toggleReviewVisibilityAdmin → isVisible=true]
  C -- нет --> E[deleteReviewAdmin]
  D --> F[revalidateTag product-slug]
```

## Примечания
- Content Factory по умолчанию `127.0.0.1:8028` (локальный сервис) — находка AD-4.
- Все действия — только роль ADMIN (MANAGER не задействован, AD-5).
