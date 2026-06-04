# FINAL RECHECK: Admin Products Management

Дата: 2026-05-27  
Проект: `C:\Users\sevri\Сайт\elektronom`  
Проверка: повторная проверка после исправлений по `REVIEW_ADMIN_PRODUCTS_PROM_STYLE_RECHECK_2026-05-27.md`.

## Вердикт

Большая часть критичных замечаний по вкладке товаров закрыта. Блокеры из прошлого отчета по product module в основном исправлены: product tab уже можно отдавать на ручной QA, но перед production-приемкой желательно закрыть остаточные P2/P3 ниже.

## Проверки

Выполнено:

```powershell
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

Результат:

- `npx tsc --noEmit`: pass.
- `npm run lint`: pass.
- `npm run build`: pass.
- Build warning остается прежний: PostgreSQL SSL mode warning. Это не блокирует product admin, но должно быть вынесено в инфраструктурный backlog.

## Что исправлено корректно

### 1. Product delete confirm

Нативный `confirm()` в таблице товаров убран.  
`ProductAdminTable` теперь передает весь товар в `onDelete(prod)`, а `AdminProductsTab` открывает кастомную modal confirmation.

Проверенные места:

- `src/components/admin/products/product-admin-table.tsx:27`
- `src/components/admin/products/product-admin-table.tsx:386-390`
- `src/components/admin/products/admin-products-tab.tsx:425`
- `src/components/admin/products/admin-products-tab.tsx:469-501`

Статус: pass.

### 2. Refetch таблицы после мутаций

Логика загрузки вынесена в `loadProductsAndStats`, и после основных мутаций вызывается прямой reload client-state.

Проверенные места:

- `src/components/admin/products/admin-products-tab.tsx:85-123`
- вызовы reload после stock/toggle/save/duplicate/delete/bulk: `src/components/admin/products/admin-products-tab.tsx:171`, `186`, `197`, `207`, `229`, `241`, `253`, `276`, `288`.

Статус: pass.

### 3. CSV export

CSV больше не формируется через data URI. Используется `Blob`, URL отзывается через `URL.revokeObjectURL`.

Также добавлена защита от spreadsheet formula injection для значений, начинающихся с `=`, `+`, `-`, `@`.

Проверенное место:

- `src/components/admin/products/admin-products-tab.tsx:302-335`

Статус: pass.

### 4. Search + quality filters

`getProductsAdmin()` больше не перетирает `where.OR`. Условия собираются через `conditions` и `where.AND`.

Проверенное место:

- `src/actions/admin.ts:209-262`

Статус: pass.

### 5. Duplicate product media ownership

При дублировании товара картинки клона получают:

```typescript
provider: 'EXTERNAL'
publicId: null
```

Это убирает риск удаления общего Cloudinary asset при удалении клона/оригинала.

Проверенное место:

- `src/actions/admin.ts:546-557`

Статус: pass.

### 6. Delete sequence

Удаление товара теперь сначала удаляет записи в БД внутри транзакции, затем best-effort чистит storage и Algolia.

Проверенное место:

- `src/actions/admin.ts:780-827`

Статус: pass относительно прошлого замечания.

### 7. Server-side validation для single/bulk mutations

Добавлены Zod-проверки для:

- `bulkToggleProductsActiveAdmin`
- `bulkUpdateProductsCategoryAdmin`
- `bulkUpdateProductsBrandAdmin`
- `duplicateProductAdmin`
- `toggleProductActiveAdmin`
- `updateProductStockAdmin`
- `deleteProductAdmin`

Проверенные места:

- `src/actions/admin.ts:413-426`
- `src/actions/admin.ts:460-466`
- `src/actions/admin.ts:482-486`
- `src/actions/admin.ts:502-506`
- `src/actions/admin.ts:725-729`
- `src/actions/admin.ts:757-764`
- `src/actions/admin.ts:780-784`

Статус: pass.

### 8. Product module localization

Новые product-admin компоненты переведены на `next-intl` namespace `admin.productsTab`.

Проверенные компоненты:

- `admin-products-tab.tsx`
- `product-admin-table.tsx`
- `product-admin-stats.tsx`
- `product-admin-filters.tsx`
- `product-admin-bulk-actions.tsx`
- `product-edit-modal.tsx`

Статус: pass для product module.

## Остаточные замечания

### P2: Stock в `SaveProductSchema` лучше сделать целым числом

В `src/actions/admin.ts:157`:

```typescript
stock: z.number().nonnegative()
```

В Prisma `Product.stock` имеет тип `Int`, а inline stock update уже валидируется как integer. Для консистентности форма создания/редактирования тоже должна требовать integer:

```typescript
stock: z.number().int().nonnegative()
```

Это не блокирует сборку, но защищает от дробного остатка через edit modal payload.

### P2: `ProductImageInputSchema.provider` слишком свободный

В `src/actions/admin.ts:138`:

```typescript
provider: z.string().default('LOCAL')
```

Сейчас в коде уже используется `EXTERNAL`, а schema comment в Prisma перечисляет только `CLOUDINARY | VERCEL_BLOB | LOCAL`.

Рекомендация:

1. Обновить комментарий в `prisma/schema.prisma`.
2. Заменить schema на enum:

```typescript
provider: z.enum(['LOCAL', 'CLOUDINARY', 'VERCEL_BLOB', 'EXTERNAL']).default('LOCAL')
```

Это снизит риск случайного provider вроде `cloudinary`/`Cloudinary`, который потом не будет корректно чиститься.

### P2: Product hard delete остается опасной бизнес-операцией

Технически порядок удаления улучшен, но hard delete товара все еще каскадно удаляет:

- `ProductTranslation`
- `ProductImage`
- `Review`
- `CartItem`
- `WishlistItem`

А в `OrderItem` связь с товаром станет `null`.

Это видно в `prisma/schema.prisma:190-195`, `216`, `236`, `258`, `274`, `294`, `367`.

Для реального магазина безопаснее:

- по умолчанию делать archive/hidden (`isActive=false` + `archivedAt`);
- hard delete оставить только для товаров без заказов/корзин/reviews или для superadmin.

Не блокер текущего product tab MVP, но важный backlog до production.

### P2: Остаточная mojibake вне product module

Product module в целом очищен, но в админке рядом остались старые битые строки:

- `src/app/[locale]/admin/page.tsx:16` - metadata title.
- `src/app/[locale]/admin/admin-panel-client.tsx:224` - старый native `confirm()` для reviews/categories area.
- В `prisma/schema.prisma` есть битые комментарии, например `1вЂ“5` и разделители.

Это не ломает вкладку товаров напрямую, но лучше почистить, чтобы проект не возвращался к той же проблеме кодировки.

## Рекомендация по приемке

Можно передавать product module на ручной QA по сценариям:

1. Поиск + quality filter вместе.
2. Inline stock update.
3. Create/edit product с фото, ценой, брендом, описаниями UK/RU.
4. Duplicate product и последующее удаление клона.
5. Delete product через custom modal.
6. Bulk publish/hide/sync/category/brand/export.
7. Проверка карточки товара на storefront после сохранения.
8. Проверка Algolia после update/delete/duplicate.

Перед production желательно закрыть P2 выше, особенно integer stock и политику hard delete.
