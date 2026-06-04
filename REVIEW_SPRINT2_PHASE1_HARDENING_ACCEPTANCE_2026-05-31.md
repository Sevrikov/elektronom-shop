# REVIEW_SPRINT2_PHASE1_HARDENING_ACCEPTANCE_2026-05-31

## Статус

Hardening pass по Sprint 2 Phase 1 проверен и принят.

Теперь ядро EngineeringGraph + NormGuard v2 можно считать достаточно стабильной основой для перехода к следующему этапу: интеграции каталога и проектированию Scheme Builder UI.

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

Примечание: lint по-прежнему показывает 7 warning'ов в старых модулях, не связанных с текущим hardening:

- `src/app/[locale]/(shop)/blog/[slug]/page.tsx`
- `src/app/[locale]/(shop)/blog/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/catalog/catalog-hub-blocks.tsx`
- `src/components/layout/header.tsx`
- `src/lib/assistant/claude.ts`

Это не блокирует приемку NormGuard v2.

## Что исправлено

### 1. Human-readable тексты убраны из rule outputs

Файлы:

- `src/lib/engineering/normguard/types.ts`
- `src/lib/engineering/normguard/rules/*.ts`
- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

Подтверждено:

- `FixSuggestion.description` заменен на `descriptionKey`;
- `SourceRef.title` заменен на `titleKey`;
- rule-файлы теперь используют ключи вида:
  - `normguard.rules.*`;
  - `normguard.fixes.*`;
  - `normguard.sources.*`.

Это закрывает главный риск предыдущего ревью: UI, AI и RAG больше не должны получать украинские/русские тексты напрямую из расчетного ядра.

### 2. SourceRef усилен

Файл:

- `src/lib/engineering/normguard/types.ts`

Подтверждено:

- `SourceRef` теперь содержит `titleKey`;
- для точных источников в правилах заполнены:
  - `documentId`;
  - `section`;
  - `verifiedAt`.

Тесты дополнительно проверяют, что для `confidence: 'exact'` эти поля присутствуют.

Оговорка:

На уровне TypeScript это пока не дискриминированный union, а обычный interface с optional-полями и тестовой проверкой. Для MVP это приемлемо, но позже лучше усилить тип:

```ts
type ExactSourceRef = {
  confidence: 'exact'
  documentId: string
  section: string
  verifiedAt: string
  ...
}

type NonExactSourceRef = {
  confidence: 'derived' | 'needs_review'
  documentId?: string
  section?: string
  verifiedAt?: string
  ...
}

type SourceRef = ExactSourceRef | NonExactSourceRef
```

### 3. EngineeringGraph расширен до MVP-контракта

Файл:

- `src/lib/engineering/graph.ts`

Подтверждено, в `EngineeringGraph` добавлены:

- `loads`;
- `panels`;
- `bom`;
- `totals`.

`buildDefaultGraph()` инициализирует эти поля, что важно для будущей связки:

- схемостроитель;
- BOM;
- корзина;
- AI context;
- RAG explanations.

### 4. Добавлена структурная валидация графа

Файл:

- `src/lib/engineering/graph-validation.ts`
- `src/lib/engineering/normguard/index.ts`

Подтверждено:

- `validateEngineeringGraph(graph)` вызывается в начале `runNormGuard()`;
- при структурных ошибках выполнение правил прерывается;
- возвращаются `NormIssue` с блокировкой checkout.

Проверяются:

- невалидная структура;
- отсутствие `nodes`/`edges`;
- дубликаты node id;
- invalid edge к несуществующим узлам;
- невалидные свойства `powerW`, `phase`, `voltageV`.

### 5. Усилены unit-тесты контракта NormIssue

Файл:

- `scripts/test-engineering.ts`

Подтверждено:

- добавлен `assertNormIssueContract`;
- проверяется `blocksCheckout` в зависимости от severity;
- проверяются `targetId`, `titleKey`, `messageKey`;
- проверяются `sourceRefs`;
- проверяются `documentId`, `section`, `verifiedAt` для `confidence: exact`;
- проверяются `fixSuggestions` и `descriptionKey`;
- добавлены тесты структурной валидации графа;
- добавлен тест safe graph без issues.

Это уже нормальный базовый safety-контур для следующей фазы.

## Остаточные замечания не блокирующие

### P3. SourceRef лучше сделать discriminated union

Сейчас обязательность `documentId/section/verifiedAt` для `exact` обеспечивается тестами. Лучше позже закрепить это TypeScript-типом.

### P3. Validation issues можно позже обогатить source/fix contract

Структурные `graph-*` issues сейчас возвращаются без `sourceRefs` и `fixSuggestions`. Это нормально для системных ошибок графа, но для UI желательно позже добавить отдельную группу ключей и fix suggestions:

- `normguard.validation.fixes.removeBrokenEdge`;
- `normguard.validation.fixes.renameDuplicateNode`;
- `normguard.validation.fixes.fixNodeProperty`.

### P3. Rule metadata все еще содержит English `name/description`

В `NormRule` остались `name` и `description` на английском. Это не пользовательский output issue, но если эти поля будут показываться в UI/admin, их тоже лучше заменить на `nameKey`/`descriptionKey`.

## Итоговая рекомендация

Sprint 2 Phase 1 hardening принят.

Можно переходить к следующей фазе, но в правильном порядке:

1. Phase 2A — интеграция каталога товаров с EngineeringGraph и NormGuard.
2. Phase 2B — подготовка product compatibility/query layer.
3. Phase 3 — Scheme Builder UI на React Flow/canvas.
4. Phase 4 — AI/RAG integration поверх уже стабильных server tools.

Не начинать с декоративного UI. Сначала нужно связать graph node -> engineering spec -> compatible products -> BOM -> cart draft.

## Следующее задание разработчику

Перейти к Phase 2A:

- описать инженерные атрибуты товаров;
- сделать `CatalogBinding` resolver;
- сделать server query для поиска совместимых товаров по spec;
- добавить ProductQualityGate для инженерного подбора;
- покрыть это unit/integration тестами;
- только после этого начинать визуальную замену товаров в Scheme Builder UI.
