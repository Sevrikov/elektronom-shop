# Final Recheck: реактивные фасеты каталога после второго исправления

Дата: 2026-05-29  
Основание: проверка ответа разработчика после `REVIEW_CATEGORY_DYNAMIC_FACETS_RECHECK_2026-05-29.md`.

## Проверки

Запущено:

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

Результат:

- `npx tsc --noEmit` — pass.
- `npm run lint` — pass.
- `npm run build` — pass.

Остался только инфраструктурный PostgreSQL SSL warning в build output. К текущей задаче фасетов он не относится.

## Что закрыто

### 1. JSONB-фильтрация в `products.ts` структурно синхронизирована с counts

Файл: `src/queries/products.ts`.

`buildAttributeWhere()` теперь строит OR-условия не только для строк:

- `equals: val`
- `array_contains: val`
- `equals: Number(val)`, если значение числовое
- `array_contains: Number(val)`
- `equals: boolean`, если значение `true/false`
- `array_contains: boolean`

Это закрывает главный архитектурный разрыв прошлого ревью: раньше `categories.ts` мог посчитать numeric/boolean/array фасет, но `products.ts` после клика мог вернуть пустую выдачу.

Статически решение выглядит правильным.

Остаточное требование: добавить интеграционный тест на реальной БД/seed, потому что JSONB-фильтры Prisma/PostgreSQL легко проходят TypeScript, но могут отличаться по runtime-семантике.

Минимальный тест:

1. Создать/посеять 3 товара в тестовой категории:
   - `attributes: { poles: 2 }`
   - `attributes: { wifi: true }`
   - `attributes: { standards: ["ip20", "din"] }`
2. Проверить, что `getCategoryFacets()` показывает count по `poles=2`, `wifi=true`, `standards=din`.
3. Проверить, что `getFilteredProducts()` с теми же URL-значениями возвращает те же товары.

### 2. Масштабируемость честно задокументирована

Файл: `src/queries/categories.ts`.

Появился комментарий, что in-memory расчет на `take: 50000` — это MVP-ограничение, а для production/enterprise нужны SQL aggregation или поисковый движок с facet aggregation.

Это не делает решение enterprise-ready, но снимает проблему ложного заявления “масштабируемость полностью решена”.

### 3. Blur для price inputs исправлен лучше

Файл: `src/components/catalog/price-range-filter.tsx`.

`handleMinBlur()` и `handleMaxBlur()` теперь вычисляют следующее значение локально и вызывают `onChange()` без ожидания асинхронного state update.

Остаточный P3-риск: каждый handler сейчас надежно нормализует только редактируемую сторону. Для полной защиты можно в обоих handlers нормализовать пару целиком:

```ts
const nextMin = Math.max(min, Math.min(inputMin, inputMax))
const nextMax = Math.min(max, Math.max(inputMax, nextMin))
onChange(nextMin, nextMax)
```

Это не блокер, но стоит сделать при следующей чистке.

### 4. Общие типы фасетов вынесены

Файл: `src/types/index.ts`.

Добавлены:

- `BrandFacetItem`
- `AttributeFacetItem`

Они используются в:

- `catalog-filters.tsx`
- `catalog-toolbar.tsx`
- `mobile-filter-drawer.tsx`
- `page.tsx`

Это закрывает риск потери `logo`, `disabled`, `selected` при передаче данных через toolbar/drawer.

### 5. Ручная DOM-стилизация range track задокументирована как исключение

Файл: `src/components/catalog/price-range-filter.tsx`.

JSX `style={{ ... }}` не используется. Позиции треков задаются через refs:

```ts
trackRef.current.style.left = ...
trackRef.current.style.right = ...
```

Это остается неидеальным с точки зрения строгого “no dynamic inline styling”, но теперь заявлено как осознанное техническое исключение. Для текущего уровня проекта можно принять как временное решение.

Долгосрочно лучше заменить на bucket-based подсветку без ручного DOM style.

## Что проверить вручную

1. Открыть категорию с товарами, где есть несколько брендов и разные цены.
2. Выбрать узкий диапазон цены.
3. Убедиться, что недоступные бренды стали disabled.
4. Снять цену и проверить, что бренды снова активны.
5. Выбрать бренд + атрибут + цену, убедиться, что counts пересчитались по всем остальным фильтрам.
6. Проверить mobile drawer: disabled, selected, logo, count должны совпадать с desktop.
7. Проверить, что выбранная опция с 0 товаров остается видимой и ее можно снять.
8. Проверить JSONB cases: строка, число, boolean, массив.

## Решение по приемке

Текущую доработку можно считать принятой для MVP/staging.

Для production-ready приемки маркетплейс-категорий остаются два условия:

1. Добавить интеграционный тест, подтверждающий совпадение `getCategoryFacets()` и `getFilteredProducts()` для JSONB string/number/boolean/array.
2. Вынести `take: 50000` из статуса “решено” в backlog production scaling: SQL aggregation / Algolia facets / Meilisearch / Elasticsearch / отдельная facet table.

Блокеров уровня P0/P1 после второго исправления в статическом ревью не найдено, но без JSONB integration test остается риск runtime-расхождения.

