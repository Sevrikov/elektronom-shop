# REVIEW_SPRINT2_PHASE2A_CATALOG_BINDING_RECHECK_2026-05-31

## Статус

Sprint 2 Phase 2A реализован частично.

Новые модули `catalog-binding.ts` и `bom.ts` появились, тесты проходят, bulk-добавление в корзину добавлено. Но принимать Phase 2A как полностью интегрированную фазу пока нельзя: новый catalog binding/BOM engine используется в тестах и модульно существует, но текущий инженерный UI продолжает работать через старую связку `buildEngineeringProject()` / `buildBom()` из `calculators.ts`.

Рекомендация: принять как module draft, но вернуть на интеграционный hardening перед переходом к Scheme Builder UI.

## Проверенные команды

```powershell
npm run test:engineering
npx tsc --noEmit
npm run lint
```

Результат:

- `npm run test:engineering` — PASS.
- `npx tsc --noEmit` — PASS.
- `npm run lint` — PASS, exit code 0.

Lint по-прежнему показывает 7 старых warning'ов вне текущей задачи. Это не блокирует Phase 2A.

## Что сделано хорошо

### 1. ProductQualityGate появился

Файл:

- `src/lib/engineering/catalog-binding.ts`

Проверяются:

- изображение;
- цена;
- stock;
- бренд;
- name;
- `engineeringRole`;
- safety certification/source для breaker/rcd/voltage_relay.

Это правильное направление: инженерный подбор не должен использовать товар только потому, что он похож названием.

### 2. Compatibility scoring появился

Файл:

- `src/lib/engineering/catalog-binding.ts`

Реализованы проверки совместимости для:

- breaker / main_breaker;
- rcd;
- cable_line;
- distribution_panel;
- voltage_relay;
- ats;
- terminal.

Есть hard block на несовместимые критичные параметры: полюса, ток, материал, сечение, leakage, neutral switching.

### 3. Новый BOM/totals module появился

Файл:

- `src/lib/engineering/bom.ts`

Реализовано:

- подбор совместимых товаров по node;
- расчет количества кабеля с 10% запасом;
- расчет occupied DIN modules;
- расчет panel snapshots;
- расчет totalPowerW / totalCurrentA / estimatedCost.

### 4. SourceRef действительно стал discriminated union

Файл:

- `src/lib/engineering/normguard/types.ts`

Теперь `confidence: 'exact'` требует:

- `documentId`;
- `section`;
- `verifiedAt`.

Это закрывает замечание предыдущего ревью.

### 5. Bulk add-to-cart добавлен

Файлы:

- `src/actions/cart.ts`
- `src/components/engineering/engineering-workspace.tsx`

Появился `addMultipleToCart()`, UI больше не должен добавлять BOM-позиции последовательным циклом.

## Блокирующие замечания

### P1. Новый `computeBOMAndTotals()` не интегрирован в текущий инженерный workspace

Файлы:

- `src/lib/engineering/bom.ts`
- `src/lib/engineering/catalog-binding.ts`
- `src/lib/engineering/calculators.ts`
- `src/components/engineering/engineering-workspace.tsx`

Проверка использования показала:

```text
computeBOMAndTotals -> используется только в scripts/test-engineering.ts
findCompatibleProductsForNode -> используется в bom.ts и tests
passesQualityGate -> используется в catalog-binding.ts и tests
```

Текущий UI продолжает строить проект так:

```ts
const project = useMemo(() => buildEngineeringProject(input, products), [input, products])
```

А `buildEngineeringProject()` внутри `calculators.ts` продолжает использовать старые:

- `scoreProduct`;
- `matchProduct`;
- `buildRecommendations`;
- `buildBom`.

Следствие:

- ProductQualityGate не влияет на реальный UI;
- новый compatibility scoring не влияет на реальный UI;
- новый BOM/totals engine не влияет на реальный UI;
- Phase 2A пока не является продуктовой интеграцией, а только параллельным модулем.

Что нужно исправить:

1. Либо переподключить `buildEngineeringProject()` на новый `computeBOMAndTotals()` и `catalog-binding.ts`.
2. Либо создать отдельный adapter:

```ts
buildEngineeringGraphFromInput(input, products)
computeEngineeringProjectFromGraph(graph, products)
```

3. UI должен получать BOM/compatibility уже из нового Phase 2A pipeline.

Без этого нельзя переходить к Scheme Builder UI, потому что он будет строиться поверх старой логики.

### P1. `computeBOMAndTotals()` добавляет placeholder BOM-позиции без продукта

Файл:

- `src/lib/engineering/bom.ts`

Сейчас если товар не найден, создается BOM item:

```ts
sku: `PLACEHOLDER-${node.id.toUpperCase()}`
unitPrice: 0
total: 0
```

В новом `EngineeringBOMItemSnapshot` нет поля `missing`, поэтому downstream-слой не видит, что это не реальный товар.

Риск:

- UI может показать позицию как реальную спецификацию;
- AI может объяснять placeholder как подобранный компонент;
- при будущей интеграции корзины можно случайно попытаться добавить неполную позицию;
- estimatedCost будет занижен до 0 по отсутствующим критичным компонентам.

Что нужно исправить:

Добавить явные поля:

```ts
productId?: string
missing: boolean
qualityGateReasons?: string[]
compatibilityReasons?: string[]
blocksCheckout: boolean
```

И правило:

- если safety-critical node не имеет продукта, BOM должен блокировать checkout;
- placeholder не должен выглядеть как товар;
- estimatedCost должен иметь статус `partial`, а не просто 0.

### P1. Bulk add-to-cart обрезает инженерные количества до 99

Файлы:

- `src/actions/cart.ts`
- `src/components/engineering/engineering-workspace.tsx`

Схема:

```ts
quantity: z.number().int().min(1).max(99)
```

UI:

```ts
quantity: Math.min(item.qty, 99)
```

Для обычного товара это нормально, но для кабеля в инженерном BOM количество может быть больше 99 метров. Сейчас оно будет тихо обрезано.

Риск:

- расчет просит 125 м кабеля;
- корзина получает 99 м;
- пользователь не видит, что заказ неполный.

Что нужно исправить:

Варианты:

1. Для engineering cart разрешить `max(999)` или отдельный лимит по типу товара.
2. Передавать quantity как рассчитано, без `Math.min`.
3. Если товарная корзина не поддерживает больше 99, показывать blocking warning: “кабель требуется 125 м, корзина поддерживает максимум 99, разделите позицию/оформите заявку”.

## Существенные замечания

### P2. `ProductQualityGate` и scoring конфликтуют по stock

Файл:

- `src/lib/engineering/catalog-binding.ts`

`passesQualityGate()` добавляет `missing_stock`, если `stock <= 0`, и тогда `scoreProductCompatibility()` сразу возвращает score 0.

Ниже в scoring есть логика:

```ts
// Penalize out of stock slightly, but don't prevent selection
if (product.stock <= 0) {
  score -= 15
}
```

Она фактически недостижима, потому что quality gate уже заблокировал товар.

Нужно выбрать стратегию:

- либо out-of-stock полностью запрещен для engineering BOM;
- либо out-of-stock разрешен как compatible alternative, но не addable to cart.

Рекомендация:

- для checkout: stock обязателен;
- для “показать альтернативу/под заказ”: можно показывать, но с `availabilityStatus: out_of_stock` и `blocksCart: true`.

### P2. Catalog selection ограничен первыми 120 товарами

Файл:

- `src/lib/engineering/catalog.ts`

Сейчас:

```ts
take: 120
orderBy: stock desc, sortOrder asc, createdAt desc
```

Для MVP допустимо, но реальный совместимый товар может не попасть в эти 120.

Рекомендация:

- Phase 2A/B должен иметь server query “find compatible products by engineering spec”, а не загружать топ-120 и матчить in-memory.
- минимум: фильтровать на DB уровне по `attributes.engineeringRole`, stock, category/brand.

### P2. `addMultipleToCart()` не ограничивает размер входного массива

Файл:

- `src/actions/cart.ts`

`AddMultipleToCartSchema` — массив без `.max(...)`.

При этом DB query берет `take: 120`, а input может быть больше 120. Лишние товары будут тихо проигнорированы, потому что не попадут в `products`.

Нужно:

- добавить `.max(120)` или меньше;
- дедуплицировать `productId` перед запросом;
- возвращать список skipped items/reasons.

### P2. `addMultipleToCart()` возвращает только addedCount

Файл:

- `src/actions/cart.ts`

Сейчас если часть товаров пропущена из-за stock/product missing, пользователь получает только `addedCount`.

Для engineering BOM это недостаточно.

Нужно вернуть:

```ts
{
  success: boolean
  added: Array<{ productId, quantity }>
  skipped: Array<{ productId, quantity, reason }>
}
```

Причины:

- product_not_found;
- inactive;
- insufficient_stock;
- quantity_limit;
- duplicate_merged;

### P2. `addMultipleToCart()` не является “single transaction” для guest cart

Файл:

- `src/actions/cart.ts`

Для авторизованного пользователя используется Prisma transaction. Для guest cart это cookie update, транзакции БД там нет. Это нормально технически, но в отчете не стоит формулировать как “single database transaction/guest cookie update” без уточнения.

Важно: для guest cart операция не атомарна относительно конкурентных вкладок.

## Проверки, которые стоит добавить

В `scripts/test-engineering.ts` добавить:

1. `computeBOMAndTotals` не должен создавать addable item без productId.
2. Missing safety-critical node должен давать `blocksCheckout`.
3. Cable qty > 99 не должен тихо обрезаться при подготовке к корзине.
4. ProductQualityGate: out-of-stock strategy должна быть явно проверена.
5. `addMultipleToCart` должен тестироваться на:
   - duplicate product ids;
   - partial stock;
   - skipped items;
   - max input length.

## Итоговая рекомендация

Phase 2A пока не закрывать как интегрированную фазу.

Разработчику нужно выполнить короткий integration pass:

1. Подключить новый `catalog-binding.ts` / `bom.ts` к реальному `buildEngineeringProject()` или заменить pipeline на graph-first.
2. Убрать silent placeholder BOM или сделать его явно `missing + blocksCheckout`.
3. Исправить лимит 99 для кабелей/engineering quantities.
4. Расширить `addMultipleToCart()` результатом `added/skipped`.
5. Добавить тесты на partial/missing/quantity-limit сценарии.

После этого можно переходить к Phase 2B: server-side compatible product query и подготовке данных для Scheme Builder UI.
