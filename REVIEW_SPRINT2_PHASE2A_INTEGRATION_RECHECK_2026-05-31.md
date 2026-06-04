# REVIEW_SPRINT2_PHASE2A_INTEGRATION_RECHECK_2026-05-31

## Статус

Sprint 2 Phase 2A integration pass не принят.

Разработчик действительно начал интеграцию нового graph-first pipeline в `buildEngineeringProject()`, добавил missing safety blocker и расширил `addMultipleToCart()`. Но текущая кодовая база не проходит обязательные проверки TypeScript и ESLint, поэтому переходить к следующей фазе нельзя.

## Проверенные команды

```powershell
npm run test:engineering
npx tsc --noEmit
npm run lint
```

Результат:

- `npm run test:engineering` — PASS.
- `npx tsc --noEmit` — FAIL.
- `npm run lint` — FAIL.

## Блокеры

### P0. TypeScript не проходит

Файл:

- `src/lib/engineering/calculators.ts`

Ошибка 1:

```text
src/lib/engineering/calculators.ts(655,5): error TS2322:
Type ... is not assignable to type 'EngineeringLoadSnapshot[]'
with 'exactOptionalPropertyTypes: true'.
Types of property 'areaZone' are incompatible.
Type 'string | undefined' is not assignable to type 'string'.
```

Причина:

В `loadSnapshots` поля `areaZone` и `room` передаются как `undefined`, а в `EngineeringLoadSnapshot` они optional. При `exactOptionalPropertyTypes: true` нельзя передавать свойство со значением `undefined`; нужно либо не добавлять поле, либо явно разрешить `string | undefined`.

Фрагмент:

```ts
const loadSnapshots = loads.map((load) => ({
  ...
  areaZone: load.areaZone,
  room: load.room,
  ...
}))
```

Как исправить:

Собирать объект условно:

```ts
const snapshot: EngineeringLoadSnapshot = { ... }
if (load.areaZone !== undefined) snapshot.areaZone = load.areaZone
if (load.room !== undefined) snapshot.room = load.room
return snapshot
```

Ошибка 2:

```text
src/lib/engineering/calculators.ts(748,5): error TS2322:
Type NormIssue[] from normguard/types is not assignable to type NormIssue[] from engineering/types.
Property 'level' is missing.
```

Причина:

В проекте сейчас есть два разных типа `NormIssue`:

- старый `src/lib/engineering/types.ts` с `level`;
- новый `src/lib/engineering/normguard/types.ts` с `severity`.

`buildEngineeringProject()` возвращает старый `EngineeringProject`, где `normIssues` ожидает старый тип, но в него кладется результат `runNormGuard(graph)` нового типа.

Как исправить:

Нужно выбрать один контракт:

1. Предпочтительно: мигрировать UI на новый `NormIssue` и заменить `issue.level` на `issue.severity`.
2. Или временно добавить adapter:

```ts
function mapNormGuardIssueToLegacy(issue: NormGuardIssue): LegacyNormIssue
```

Но лучше не плодить два NormIssue дальше.

### P0. ESLint не проходит

Файл:

- `src/lib/engineering/calculators.ts`

Ошибки:

```text
609:21  error  Unexpected any
620:38  error  Unexpected any
695:26  error  Unexpected any
```

Проблемные места:

```ts
let nodeType: any = 'load'
areaZone: load.areaZone as any
role: item.role as any
```

Как исправить:

- `nodeType` типизировать как `EngineeringNodeType`;
- `areaZone` передавать только если входит в допустимый union;
- `role` маппить через type guard/mapper в `EngineeringProductRole`.

Также есть предупреждения:

```text
20:10  warning  validateEngineeringGraph is defined but never used
376:10 warning  buildBom is defined but never used
465:10 warning  checkNorms is defined but never used
```

Это признак незавершенной миграции со старого pipeline на новый.

## Существенные замечания после исправления P0

### P1. Graph-first pipeline подключен, но старый pipeline еще живет рядом

Файл:

- `src/lib/engineering/calculators.ts`

Сейчас `buildEngineeringProject()` делает:

```ts
const graph = buildEngineeringGraph(input)
const normIssues = runNormGuard(graph)
const bomResult = computeBOMAndTotals(graph, products)

const loads = buildLoads(input)
const lines = buildLines(input, loads)
const panel = buildPanel(lines)
const recommendations = buildRecommendations(lines, panel, products)
```

То есть graph/BOM уже используются, но legacy `buildRecommendations()` все еще нужен для UI links и warnings.

Это допустимо как временный adapter, но нужно явно зафиксировать:

- какие поля теперь source of truth;
- какие поля legacy только для UI compatibility;
- когда старый `buildBom`, `checkNorms`, `matchProduct` будут удалены.

### P1. В `calculators.ts` снова есть mojibake в runtime label

Файл:

- `src/lib/engineering/calculators.ts`

Строка:

```ts
label: `РљР°Р±РµР»СЊ ${line.cable.cores}x${line.cable.sectionMm2}РјРјВІ`,
```

Это runtime label для graph node. Нужно заменить на ASCII-safe:

```ts
label: `Cable ${line.cable.cores}x${line.cable.sectionMm2}mm2`
```

Локализованный label должен формироваться в UI/i18n, а не в расчетном ядре.

### P1. `addMultipleToCart()` still uses `take: 120` without schema max array length

Файл:

- `src/actions/cart.ts`

Схема массива:

```ts
const AddMultipleToCartSchema = z.array(...)
```

Но query:

```ts
take: 120
```

Если input > 120, часть товаров может не попасть в `products` и будет помечена как `not_found`.

Нужно:

- добавить `.max(120)` на schema;
- или убрать arbitrary `take: 120` и валидировать через input limit;
- дедуплицировать productIds перед запросом.

### P2. `addMultipleToCart()` skips entire item when stock < quantity

Файл:

- `src/actions/cart.ts`

Сейчас:

```ts
if (product.stock < item.quantity) {
  skippedItems.push({ productId, reason: 'insufficient_stock' })
  continue
}
```

Для инженерного BOM это корректно как safety-поведение, но UI должен показывать конкретные skipped items и требуемое/доступное количество. Сейчас возвращается только `productId` и reason.

Рекомендуемый контракт:

```ts
skippedItems: Array<{
  productId: string
  requested: number
  available: number
  reason: 'not_found' | 'insufficient_stock' | 'inactive'
}>
```

### P2. Tests не ловят TypeScript/lint ошибки

`npm run test:engineering` проходит, но `tsc` и `lint` падают. Это нормальная ситуация для script-tests, но отчет разработчика не должен говорить “всё верифицировано”, если обязательные команды не прошли.

## Что исправить разработчику

Минимальный список для повторной приемки:

1. Исправить `EngineeringLoadSnapshot` под `exactOptionalPropertyTypes`.
2. Убрать конфликт старого/нового `NormIssue`:
   - либо мигрировать на новый `severity`;
   - либо временно сделать adapter.
3. Убрать все `any` из `calculators.ts`.
4. Убрать mojibake runtime label в `calculators.ts`.
5. Убрать unused imports/functions или явно оставить с TODO, но без lint warning.
6. Добавить `.max(120)` или другой явный лимит для `AddMultipleToCartSchema`.
7. Повторно прогнать:

```powershell
npm run test:engineering
npx tsc --noEmit
npm run lint
```

## Итог

Интеграция идет в правильном направлении, но текущий статус — broken build.

До исправления P0 нельзя переходить ни к Phase 2B, ни к Scheme Builder UI.
