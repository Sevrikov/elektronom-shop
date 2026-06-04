# REVIEW_SPRINT2_PHASE2A_INTEGRATION_ACCEPTANCE_2026-05-31

## Статус

Sprint 2 Phase 2A integration pass принят.

Блокеры из предыдущего recheck устранены: TypeScript проходит, ESLint проходит без ошибок, engineering tests проходят, новый graph-first / NormGuard / BOM путь подключен к `buildEngineeringProject()`.

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

Lint по-прежнему показывает 7 старых warning'ов вне текущей Phase 2A:

- `src/app/[locale]/(shop)/blog/[slug]/page.tsx`
- `src/app/[locale]/(shop)/blog/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/catalog/catalog-hub-blocks.tsx`
- `src/components/layout/header.tsx`
- `src/lib/assistant/claude.ts`

Это не блокирует приемку Phase 2A.

## Что подтверждено

### 1. Graph-first pipeline подключен к `buildEngineeringProject()`

Файл:

- `src/lib/engineering/calculators.ts`

Подтверждено:

- `buildEngineeringProject()` вызывает `buildEngineeringGraph(input)`;
- затем запускает `runNormGuard(graph)`;
- затем рассчитывает BOM через `computeBOMAndTotals(graph, products)`;
- UI получает BOM, panel modules/reserve и missing blockers из нового graph/BOM pipeline.

Это закрывает главный интеграционный разрыв предыдущего ревью.

### 2. TypeScript blockers исправлены

Подтверждено:

- `EngineeringLoadSnapshot` больше не ломает `exactOptionalPropertyTypes`;
- конфликт старого и нового `NormIssue` устранен;
- `npx tsc --noEmit` завершился успешно.

### 3. ESLint blockers исправлены

Файл:

- `src/lib/engineering/calculators.ts`

Подтверждено:

- `any` в измененных местах убраны;
- unused imports/functions из новой интеграции убраны;
- `npm run lint` не возвращает ошибок.

### 4. Missing safety components блокируют checkout

Файлы:

- `src/lib/engineering/bom.ts`
- `src/components/engineering/engineering-workspace.tsx`

Подтверждено:

- BOM item без найденного productId получает `missing`;
- safety-critical roles получают `blocksCheckout`;
- UI вычисляет `hasMissingSafetyComponent`;
- кнопка добавления в корзину блокируется, если есть missing safety component;
- добавлены переводы `missingSafetyComponents`.

### 5. Bulk add-to-cart усилен

Файл:

- `src/actions/cart.ts`

Подтверждено:

- `AddMultipleToCartSchema` ограничен `.max(120)`;
- quantity для bulk addition разрешен до `999`;
- `addMultipleToCart()` возвращает `skippedItems`;
- UI показывает статус `addedWithSkipped`.

### 6. Runtime mojibake в graph labels исправлен

Файл:

- `src/lib/engineering/calculators.ts`

Предыдущая строка с поврежденным runtime label кабеля устранена. В измененных местах больше не обнаружены старые `Рљ.../РјРј...` маркеры.

## Остаточные замечания не блокирующие

### P2. Legacy adapter остается внутри `buildEngineeringProject()`

`buildEngineeringProject()` все еще вызывает legacy:

- `buildLoads`;
- `buildLines`;
- `buildPanel`;
- `buildRecommendations`;

Это сейчас допустимо как compatibility layer для существующего UI, но в Phase 2B/3 нужно постепенно убрать дублирование, чтобы source of truth был один:

```text
EngineeringGraph -> NormGuard -> CatalogBinding -> BOM -> UI/Cart/AI
```

### P2. `skippedItems` желательно обогатить

Сейчас `skippedItems` возвращает:

```ts
{ productId, reason }
```

Для инженерного BOM лучше добавить:

```ts
requested: number
available?: number
sku?: string
name?: string
```

Тогда UI сможет сказать не просто “пропущено 2”, а “кабеля нужно 135 м, доступно 80 м”.

### P3. PowerShell может отображать UTF-8 строки в `cart.ts` как mojibake

При чтении через PowerShell некоторые украинские строки ошибок могут отображаться как `Р...`, но Node читает файл как корректный UTF-8. Это не блокер, однако для server actions лучше постепенно перейти на error codes:

```ts
errorCode: 'invalid_input' | 'server_error' | 'insufficient_stock'
```

А пользовательские тексты форматировать в UI через i18n.

## Рекомендация

Phase 2A можно закрывать.

Следующий правильный шаг:

1. Phase 2B — server-side compatible product query:
   - искать совместимые товары не только среди первых 120;
   - фильтровать по `attributes.engineeringRole`;
   - возвращать quality gate status и compatibility score;
   - готовить данные для replacement UI.
2. Потом Phase 3 — Scheme Builder UI:
   - React Flow/canvas;
   - node inspector;
   - badges для NormGuard issues;
   - comparison panel для замены компонента;
   - BOM/cart sync.

Не начинать визуальный конструктор, пока Phase 2B не даст надежный источник совместимых товаров.
