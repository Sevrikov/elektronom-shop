# REVIEW: Admin Products Management, Prom-style recheck

Дата: 2026-05-27  
Проект: `C:\Users\sevri\Сайт\elektronom`  
Проверяемый блок: админка товаров по мотивам Prom.ua, вкладка Products / управление товарами.

## Статус

Автоматические проверки проходят, но вкладку товаров нельзя считать готовой к приемке из-за P0/P1 замечаний ниже.

Проверено локально:

```powershell
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

Результат:

- `npx tsc --noEmit`: pass.
- `npm run lint`: pass.
- `npm run build`: pass.
- Build warning: PostgreSQL SSL warning по `sslmode`, не блокирует сборку, но остается инфраструктурным backlog.

## P0: В админке сломана кириллица

Во многих новых и существующих админских файлах UI-тексты отображаются mojibake-строками вида `Р—Р°Р»РёС€РѕРє`, `Р¦С–РЅР°`, `в‚ґ`, `рџ“ё`.

Примеры:

- `src/components/admin/products/admin-products-tab.tsx:171` - toast обновления остатка.
- `src/components/admin/products/admin-products-tab.tsx:197` - toast сохранения товара.
- `src/components/admin/products/product-admin-table.tsx:101` - заголовок колонки фото.
- `src/components/admin/products/product-admin-table.tsx:231` - валюта выводится как `в‚ґ` вместо `₴`.
- `src/components/admin/products/product-admin-table.tsx:278-280` - иконка фото выводится как битая строка.
- `src/components/admin/products/product-edit-modal.tsx:205-220` - названия вкладок и заголовок модалки.
- `src/components/admin/products/product-admin-bulk-actions.tsx:68-122` - подписи bulk-панели.
- `src/app/[locale]/admin/page.tsx:13` - title metadata админки.

Почему это критично:

- Менеджер не сможет пользоваться интерфейсом.
- Нельзя проверять UX, если подписи, подтверждения и системные сообщения нечитаемы.
- Автотесты это не ловят, потому что TypeScript и ESLint видят валидные строки.

Как исправить:

1. Убрать кириллические literals из `.tsx` в админке.
2. Перенести все UI-тексты админки в `src/i18n/messages/uk.json` и `src/i18n/messages/ru.json`, например namespace `admin.products`.
3. В компонентах использовать `useTranslations('admin.products')`.
4. Для символов валюты использовать нормальный Unicode `₴` из locale JSON либо общий formatter.
5. После исправления выполнить поиск:

```powershell
rg -n "Р|СЊ|С–|в‚|вЂ|рџ" src/app/[locale]/admin src/components/admin src/actions/admin.ts
```

Ожидаемый результат: 0 совпадений, кроме осознанных тестовых фикстур, если такие есть.

## P1: После мутаций список товаров может не обновляться надежно

В `src/components/admin/products/admin-products-tab.tsx:78-121` данные грузятся в client state через `useEffect`, зависящий от `searchParams`.

После мутаций вызывается:

```typescript
router.refresh()
router.replace(`${pathname}?${current.toString()}` as Route, { scroll: false })
```

Проблема: данные таблицы не приходят из Server Component props, а лежат в локальном client state. `router.refresh()` не обязан заново выполнить `fetchAll()` внутри client state. `router.replace()` на тот же URL тоже может не изменить `searchParams`, значит `useEffect` может не сработать.

Риск:

- Изменили остаток, активность, бренд, категорию, сохранили товар, а таблица/статистика остаются старыми до ручного обновления страницы.

Как исправить:

- Вынести `fetchAll()` в `useCallback`, например `loadProductsAndStats()`.
- После успешных `save/toggle/stock/bulk/delete/duplicate` вызывать `await loadProductsAndStats()` напрямую.
- `router.refresh()` оставить только если реально нужны server-side cache/UI обновления вокруг вкладки.

## P1: Дублирование товара копирует `publicId` Cloudinary

В `src/actions/admin.ts:546-557` при `duplicateProductAdmin()` изображения нового товара создаются с тем же `publicId`, что и у исходного товара.

Риск:

- Два товара начинают ссылаться на один Cloudinary resource.
- При удалении одного товара `deleteProductAdmin()` удалит физический файл по `publicId`.
- Второй товар останется с битой картинкой.

Как исправить:

Варианты:

- При дублировании не копировать Cloudinary `publicId`, а копировать только URL как external/reference image и не считать его owned media.
- Или выполнять Cloudinary copy/upload нового asset и сохранять новый `publicId`.
- Или добавить модель ownership/reference-count для медиа, чтобы `deleteProductAdmin()` не удалял shared resource.

Минимальный безопасный вариант для MVP: при duplicate поставить `publicId: null` и `provider: 'EXTERNAL'`/отдельный безопасный provider, который не удаляется через `deleteProductImage`.

## P1: Удаление товара сначала чистит Algolia/Storage, потом удаляет БД

В `src/actions/admin.ts:746-765` порядок такой:

1. `removeProductFromIndex(productId)`.
2. Получение и удаление файлов из storage.
3. `prisma.product.delete()`.

Риск:

- Если удаление из БД упадет после удаления картинок или Algolia-записи, товар останется в базе, но уже без медиа/поиска.
- При общем `publicId` после duplicate риск усиливается.

Как исправить:

- Лучше для админки товаров использовать soft delete / archived state.
- Если нужен hard delete: сначала получить список images, удалить товар в БД транзакционно, потом после успешного commit выполнять best-effort cleanup storage/Algolia с логированием.
- Если cleanup падает, создавать запись в cleanup queue / audit log, а не оставлять операцию в неопределенном состоянии.

## P1: Серверная валидация остатков недостаточная

`src/actions/admin.ts:728-735`:

```typescript
export async function updateProductStockAdmin(productId: string, stock: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { stock },
  })
}
```

Проблема:

- UI ставит `min={0}`, но это клиентская защита.
- Server Action принимает любой `number`, включая отрицательные, дробные, `NaN` после ручного вызова/подмены запроса.

Как исправить:

- Добавить Zod schema:

```typescript
const UpdateStockSchema = z.object({
  productId: z.string().min(1),
  stock: z.number().int().nonnegative().max(1_000_000),
})
```

- Аналогично завести схемы для `toggleProductActiveAdmin`, `deleteProductAdmin`, `duplicateProductAdmin`, bulk category/brand actions.

## P1: Комбинация поиска и quality-фильтра по описанию работает неверно

В `src/actions/admin.ts:211-217` поиск записывает `where.OR`.

Далее `quality === 'no-desc-uk'` и `quality === 'no-desc-ru'` в `src/actions/admin.ts:251-260` снова записывают `where.OR`, перетирая поисковое условие.

Риск:

- Менеджер вводит search + фильтр "без UA описания", но search фактически теряется.
- В таблицу попадают все товары без описания, а не только совпавшие по поиску.

Как исправить:

- Собирайте условия в массив `AND`.
- Search OR и quality OR должны быть отдельными элементами `AND`.

Пример:

```typescript
const and: Prisma.ProductWhereInput[] = []

if (search) {
  and.push({
    OR: [
      { sku: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
      { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
    ],
  })
}

if (quality === 'no-desc-uk') {
  and.push({
    OR: [
      { translations: { none: { locale: 'uk' } } },
      { translations: { some: { locale: 'uk', OR: [{ description: null }, { description: '' }] } } },
    ],
  })
}

const where: Prisma.ProductWhereInput = and.length ? { AND: and } : {}
```

## P2: CSV export уязвим для spreadsheet formula injection

В `src/components/admin/products/admin-products-tab.tsx` CSV формируется из пользовательских/товарных строк. Экранирование кавычек есть, но нет защиты от Excel/Google Sheets формул.

Риск:

- Значение SKU/названия, начинающееся с `=`, `+`, `-`, `@`, может выполниться как формула при открытии CSV.

Как исправить:

- Перед записью CSV, если поле начинается с `=`, `+`, `-`, `@`, префиксовать апострофом `'`.
- Желательно вынести в helper `escapeCsvCell()`.

## P2: Используется нативный `confirm()`

В `src/components/admin/products/product-admin-table.tsx:390-394` удаление товара подтверждается через `confirm()`.

Почему лучше заменить:

- Нативное окно не стилизуется и плохо вписывается в админку.
- С учетом риска hard delete нужен нормальный modal с названием/SKU товара и явным действием.

Как исправить:

- Заменить на проектный confirmation dialog.
- Для удаления товара показывать SKU, название, число изображений и предупреждение о последствиях.

## P2: Product attributes сохраняются только строками

`SaveProductSchema.attributes` сейчас `z.record(z.string(), z.string()).optional()`.

Это работает для простого key-value MVP, но ограничивает JSONB:

- нельзя сохранять числовые значения как числа;
- нельзя хранить массивы значений для мульти-фильтров;
- нельзя отличить `4L` строкой от числового объема.

Как исправить позже:

- Для текущего MVP можно оставить строки.
- Для полноценной Rozetka-style фильтрации лучше добавить типизированные attribute definitions: key, label, type, unit, allowed values.
- В форме характеристик выбирать attribute definition, а не вводить произвольный ключ руками.

## P2: Пром-структура админки пока покрыта частично

По исследованию Prom.ua уже нужно планировать следующие вкладки:

- импорт товаров;
- удаленные/архивные товары и восстановление;
- группы/категории/структура сайта;
- управление характеристиками;
- массовое редактирование через импорт/экспорт;
- качество карточек и SEO не только как KPI, но как список задач.

Текущая вкладка товаров - хороший старт, но это не вся Prom-style админка.

## Что обязательно сделать перед приемкой

1. Исправить mojibake во всех admin/product компонентах и metadata.
2. Сделать надежный refetch таблицы и KPI после каждой мутации.
3. Исправить duplicate media ownership / Cloudinary `publicId`.
4. Исправить порядок удаления товара или перейти на soft delete.
5. Добавить серверную Zod-валидацию для stock/id/action payload.
6. Исправить композицию `search + quality` через `AND`.
7. Повторно выполнить:

```powershell
rg -n "Р|СЊ|С–|в‚|вЂ|рџ" src/app/[locale]/admin src/components/admin src/actions/admin.ts
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

## Резюме для разработчика

Код компилируется, но это не равняется готовности. Главный блокер - нечитаемая админка из-за кодировки. Главные технические риски - ненадежное обновление client-state после мутаций, дублирование Cloudinary `publicId`, небезопасный порядок удаления товара и недостаточная серверная валидация stock/id. После исправления этих пунктов вкладку товаров можно будет отдавать на ручной QA по сценариям Prom-style управления товарами.
