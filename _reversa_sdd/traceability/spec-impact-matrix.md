# Матрица влияния компонентов (Spec Impact Matrix) — Elektronom

> Артефакт **Architect** (`completo`) · Reversa. Связь «компонент → что затрагивает при изменении».

## Компонент → затрагиваемые области

| Компонент | Модули/области, зависящие от него | Риск изменения |
|-----------|-----------------------------------|----------------|
| `lib/prisma.ts` | ВСЕ запросы/действия | 🔴 критический |
| `prisma/schema.prisma` | data-dictionary, queries, actions, миграции | 🔴 критический |
| `lib/env.ts` | core-infra, все интеграции | 🟡 высокий |
| `types/ActiveFilters` + `catalog-filter-url.ts` | catalog (список+фасеты), URL, SEO | 🟡 высокий |
| `queries/products.ts` (`buildProductWhere`) | catalog список, **должен совпадать** с `getCategoryFacets` | 🟡 высокий (C-2) |
| `queries/categories.ts` (`getCategoryFacets`) | фасеты категории, гистограмма | 🟡 высокий (C-2) |
| `actions/order.ts` (`createOrder`) | checkout, сток, нумерация, корзина | 🔴 критический |
| `actions/cart.ts` | cart drawer, checkout, header badge | 🟡 высокий |
| `lib/auth.ts` (RBAC) | все защищённые действия/роуты, admin | 🔴 критический |
| `lib/assistant/claude.ts` | ассистент, формат ответа (zod), стоимость | 🟡 средний |
| `actions/admin.ts` | товары/категории/бренды/заказы/отзывы/контент | 🟡 высокий (god-файл) |
| `lib/algolia.ts` + `actions/search.ts` | поиск, синхронизация индекса | 🟡 средний |
| `lib/storage.ts` | загрузка изображений (admin/upload) | 🟡 средний |
| `i18n/request.ts` + `messages/*` | весь UI-текст, маршрутизация локали | 🟡 высокий |

## Кросс-модульные инварианты (менять синхронно)

| Инвариант | Затрагиваемые файлы |
|-----------|---------------------|
| Логика фильтра атрибутов (AND/OR) | `products.ts:buildAttributeWhere` ↔ `categories.ts:matchProduct` |
| Конфиг фильтров категории | `catalog-data.ts:categoryFilters` ↔ `catalog-filter-config.ts:categoryFilterConfig` |
| Список заказов пользователя | `actions/order.ts:getUserOrders` ↔ `queries/orders.ts:getUserOrders` |
| Форма `qty breaks` | `product/[slug]/page.tsx` (attributes.qty_breaks) ↔ mock `catalog-data.ts` (qtyBreaks) |
| Защита path traversal | `api/admin/upload/route.ts` ↔ `lib/storage.ts:deleteProductImage` |
| Переменные окружения | `.env.example` ↔ `lib/env.ts` (+ сырой `process.env` в assistant/admin) |

## Влияние внешних сервисов на функции

| Сервис недоступен | Поведение |
|-------------------|-----------|
| Algolia | 🟢 fallback на Prisma-поиск |
| Anthropic (нет ключа) | 🟡 «[Демо-режим]» ответы |
| Cloudinary (прод) | 🔴 загрузка изображений падает (по дизайну) |
| Content Factory | 🟡 генерация контента недоступна |
| PostgreSQL | 🔴 приложение нерабочее |
