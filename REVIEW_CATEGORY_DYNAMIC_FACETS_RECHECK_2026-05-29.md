# Recheck: реактивные фасеты после исправлений разработчика

Дата: 2026-05-29  
Основание: повторная проверка после ответа разработчика на `REVIEW_CATEGORY_DYNAMIC_FACETS_REACTIVE_COUNTS_2026-05-29.md`.

## Проверки

Запущены команды:

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

Результат:

- `npx tsc --noEmit` — pass.
- `npm run lint` — pass.
- `npm run build` — pass.

Build проходит успешно. Остался только инфраструктурный PostgreSQL SSL warning, он не относится к текущей задаче фасетов.

## Что действительно исправлено

1. В `src/queries/categories.ts` добавлен `cacheTag("products")`. Теперь существующие `revalidateTag('products', 'max')` в админских product mutations должны сбрасывать и кэш фасетов.
2. В `getCategoryProductsForFacets()` добавлен `orderBy: { id: "asc" }`, поведение стало детерминированнее.
3. Лимит изменен с `take: 2000` на `take: 50000`.
4. `availableMin` и `availableMax` проброшены до UI.
5. В `PriceRangeFilter` удалены JSX-атрибуты `style={{ ... }}`.
6. Старый `setState` во время render убран.
7. В `categories.ts` фасетный подсчет теперь умеет приводить значения `attributes` к строкам и учитывать массивы.

## Findings

### P1. Поддержка numeric/boolean/array атрибутов исправлена только для counts, но не для реальной выдачи товаров

Фасеты теперь собирают значения в `src/queries/categories.ts` через `String(...)` и учитывают массивы. Но фактическая выдача товаров продолжает фильтровать JSONB в `src/queries/products.ts` так:

```ts
attributes: {
  path: [key],
  equals: val,
}
```

где `val` приходит из URL как строка.

Проблема: если в `Product.attributes` значение хранится как число, boolean или массив, фасет может показать такой вариант и посчитать count, но после клика product grid может вернуть 0 товаров, потому что PostgreSQL JSONB `5` не равно строке `"5"`, `true` не равно `"true"`, а массив требует отдельной логики поиска элемента.

Почему это критично: пользователь увидит доступный фильтр с count, нажмет его и получит пустую выдачу. Это ровно тот UX-дефект, который мы пытались убрать.

Как исправить:

1. Либо нормализовать все `Product.attributes` при импорте/seed к строкам и официально закрепить это правило.
2. Либо доработать `buildAttributeWhere()` в `src/queries/products.ts`, чтобы он повторял ту же нормализацию, что и `getCategoryFacets()`:
   - строковое сравнение;
   - числовое сравнение, если `Number(value)` валиден;
   - boolean сравнение для `true/false`;
   - проверка вхождения в JSON array.
3. Лучшее долгосрочное решение: вынести технические атрибуты в нормализованную таблицу `ProductAttribute` / `ProductAttributeValue` для честных фасетов, индексов и агрегатов.

### P1. `take: 50000` не является полноценным исправлением масштабируемости

Файл: `src/queries/categories.ts`  
Место: `getCategoryProductsForFacets()`.

Замена `take: 2000` на `take: 50000` снижает риск на текущей базе, но не решает архитектурную проблему. Counts, disabled-состояния и price buckets по-прежнему считаются in-memory по ограниченной выборке.

Риски:

- категория может вырасти больше 50000 товаров;
- запрос тащит `attributes` всех товаров категории в память;
- на больших категориях это будет тяжелый серверный рендер;
- фасеты все еще не являются агрегирующей моделью уровня маркетплейса.

Как исправить:

1. Для MVP можно оставить `50000`, но явно документировать как временный потолок.
2. Для production-ready версии сделать агрегирующие SQL-запросы по брендам, цене и JSONB attributes.
3. Для enterprise-уровня вынести фасеты в отдельный индекс/таблицу или поисковый движок: Algolia facets, Meilisearch, Elasticsearch/OpenSearch, либо собственная facet table в Postgres.

### P2. Inline styles убраны из JSX, но заменены прямой мутацией DOM styles

Файл: `src/components/catalog/price-range-filter.tsx`  
Места: `trackRef.current.style.left/right`, `availTrackRef.current.style.left/right`.

Формально `style={{ ... }}` из разметки убрали. Но динамическое позиционирование теперь делается так:

```ts
trackRef.current.style.left = `${leftPct}%`
trackRef.current.style.right = `${100 - rightPct}%`
```

Это лучше для ESLint, но по смыслу все еще ручная динамическая стилизация DOM. Для проекта с правилом “Tailwind CSS v4 / no inline styles” это спорный обход, а не чистое исправление.

Как исправить:

1. Упростить slider: подсвечивать выбранные bucket-сегменты вместо отдельной absolute-полосы.
2. Для active/available range использовать CSS classes с квантованием по bucket index, а не проценты.
3. Если нужен точный range track, можно оставить текущий вариант как временное техническое исключение, но записать его в backlog и не заявлять как “полное удаление inline-стилей”.

### P2. Price input blur может применять старое значение после clamp

Файл: `src/components/catalog/price-range-filter.tsx`  
Места: `handleMinBlur()`, `handleMaxBlur()`.

Сейчас при blur сначала вызывается `setLocalMin()` / `setLocalMax()`, а затем `handleApply()`. React state обновляется асинхронно, поэтому `handleApply()` может использовать старые значения из текущего render.

Сценарий: пользователь вводит min больше max, blur делает clamp, но apply может отправить в URL еще не нормализованную пару.

Как исправить:

1. В `handleMinBlur()` и `handleMaxBlur()` вычислять `nextMin/nextMax` локальными переменными.
2. Сначала вызвать `setLocalMin(nextMin)` / `setLocalMax(nextMax)`.
3. Затем вызвать `onChange(nextMin, nextMax)` напрямую, без чтения старого state.

### P3. Типы `CatalogToolbarProps` теряют часть данных фасетов

Файл: `src/components/catalog/catalog-toolbar.tsx`.

`MobileFilterDrawer` ожидает:

```ts
brandCounts: { brand; label?; count; disabled?; selected?; logo? }[]
attributeCounts: { value; count; disabled?; selected? }[]
```

Но `CatalogToolbarProps` сужает типы до:

```ts
brandCounts: { brand: string; count: number }[]
attributeCounts: Record<string, { value: string; count: number }[]>
```

Runtime-данные сейчас проходят, потому что объект содержит больше полей. Но TypeScript-контракт компонента затирает смысл: toolbar как будто не знает про disabled/logo/selected и может легко потерять эти поля при будущей переработке.

Как исправить: вынести общий тип для facet items и использовать его в `CatalogToolbar`, `MobileFilterDrawer`, `CatalogFilters`.

## Что можно принять

Можно считать исправленными:

- кэш-инвалидацию через общий `products` tag;
- детерминированность выборки;
- проброс `availableMin/availableMax`;
- удаление `setState` во время render;
- базовое отображение disabled counts;
- базовую визуализацию price histogram.

## Что не закрыто

Нельзя считать полностью закрытыми:

- масштабируемость counts: `take: 50000` не равно production facet aggregation;
- поддержка numeric/boolean/array attributes: counts и product grid сейчас могут расходиться;
- полное соблюдение “no dynamic inline styling”: DOM style mutation осталась;
- edge case price blur/clamp.

## Решение по приемке

Для текущего демо/локального тестирования реализация стала заметно лучше и может быть временно использована.

Для финальной приемки маркетплейс-категории нужно обязательно закрыть P1:

1. синхронизировать логику attribute filters между `categories.ts` и `products.ts`;
2. заменить или хотя бы официально ограничить in-memory модель `take: 50000`;
3. добавить ручной/автотест: numeric attribute в фасете показывает count и после клика product grid возвращает тот же набор товаров.

