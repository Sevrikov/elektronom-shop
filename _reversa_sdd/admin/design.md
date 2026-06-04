# Дизайн — модуль `admin`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `actions/admin.ts` (~1540 строк, ~30 экшенов под `requireAdmin`).
- `app/api/admin/upload/route.ts` (POST/DELETE с zod + anti-traversal).
- `components/admin/*` (+`products/`), страница `(locale)/admin`.

## Группы операций (см. `flowcharts/admin.md`)
- Товары: `getProductsAdmin`, `getProductAdminStats`, `saveProductAdmin`($tx), `toggle/updateStock/delete`($tx), `duplicate`, bulk(toggle/algolia/category/brand).
- Content Factory: `launch/getStatuses/getRunResult` — `fetch(CONTENT_FACTORY_API_URL, token)`.
- Заказы: `getOrdersAdmin`, `updateOrderStatusAdmin`, `updateOrderNotesAdmin`.
- Категории/бренды: `getCategoriesBrandsAdmin`, `saveCategoryAdmin`, `saveBrandAdmin`.
- Отзывы: `getReviewsAdmin`, `toggleReviewVisibilityAdmin`, `deleteReviewAdmin`.

## Загрузка
POST: тип/размер; `uploadProductImage` (Cloudinary/local). DELETE: zod union; LOCAL — startsWith `uploads/` + без `..`/`\`/`\0`.

## Решения
RBAC (`permissions.md`), `revalidateTag` инвалидация; статусы заказа — `state-machines.md` §1 (нет guard'ов переходов 🔴).

## Риски
🟡 AD-4 CF localhost; 🟡 AD-5 MANAGER; 🟡 AD-6 god-файл; 🔴 нет валидации переходов статуса; 🔴 нет аудита.
