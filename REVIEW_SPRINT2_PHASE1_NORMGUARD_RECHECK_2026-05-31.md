# REVIEW_SPRINT2_PHASE1_NORMGUARD_RECHECK_2026-05-31

## Статус

Phase 1 реализована технически и проходит автоматические проверки, но принимать ее как полностью закрытую пока рано.

Причина: ядро NormGuard v2 появилось, правила и тесты есть, однако в текущей реализации остались архитектурные замечания, которые лучше исправить до перехода к визуальному Scheme Builder UI. Иначе UI и AI начнут опираться на неполный контракт графа и на плохо локализуемые rule outputs.

Рекомендация: принять как working draft / technical preview, но вернуть разработчику на короткий hardening pass перед Phase 2.

## Проверенные команды

```powershell
npm run test:engineering
npx tsc --noEmit
npm run lint
```

Результат:

- `npm run test:engineering` — PASS, 22 проверки пройдены.
- `npx tsc --noEmit` — PASS.
- `npm run lint` — PASS, exit code 0.

Примечание по lint: остались 7 warning'ов в старых модулях проекта, не относящихся напрямую к NormGuard v2:

- `src/app/[locale]/(shop)/blog/[slug]/page.tsx`
- `src/app/[locale]/(shop)/blog/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/catalog/catalog-hub-blocks.tsx`
- `src/components/layout/header.tsx`
- `src/lib/assistant/claude.ts`

## Что сделано хорошо

### 1. Появился отдельный NormGuard registry

Файлы:

- `src/lib/engineering/normguard/index.ts`
- `src/lib/engineering/normguard/registry.ts`
- `src/lib/engineering/normguard/types.ts`
- `src/lib/engineering/normguard/utils.ts`

Реестр правил вынесен отдельно, `runNormGuard(graph)` запускает все правила и возвращает массив `NormIssue[]`.

Это правильная архитектура: safety-логика больше не должна жить в UI.

### 2. Реализованы 7 правил

Файлы:

- `wet-zone-rcd.ts`
- `ats-neutral.ts`
- `cable-breaker.ts`
- `al-cu-compatibility.ts`
- `terminal-compatibility.ts`
- `voltage-drop.ts`
- `panel-capacity.ts`

Покрыты основные направления из ТЗ:

- влажные зоны и УЗО;
- АВР/нейтраль/резерв;
- автомат и допустимый ток кабеля;
- Al/Cu совместимость;
- клеммы/сечение/тип жил;
- падение напряжения;
- вместимость щитка.

### 3. Тесты реально расширены

Файл:

- `scripts/test-engineering.ts`

Теперь проверяется не только старый Sprint 1, но и NormGuard v2. Всего проходит 22 проверки.

## Замечания

### P1. Rule outputs содержат hardcoded human-readable текст внутри ядра

Файлы:

- `src/lib/engineering/normguard/rules/wet-zone-rcd.ts`
- `src/lib/engineering/normguard/rules/ats-neutral.ts`
- `src/lib/engineering/normguard/rules/cable-breaker.ts`
- `src/lib/engineering/normguard/rules/al-cu-compatibility.ts`
- `src/lib/engineering/normguard/rules/terminal-compatibility.ts`
- `src/lib/engineering/normguard/rules/voltage-drop.ts`
- `src/lib/engineering/normguard/rules/panel-capacity.ts`

Проблема:

`NormIssue` уже использует `titleKey` и `messageKey`, но `FixSuggestion.description` и часть `SourceRef.title` хранят человекочитаемые строки прямо в rule-engine.

Примеры:

- `description: 'Додати ПЗВ або диференційний автомат...'`
- `description: 'Замініть АВР на версію...'`
- `description: 'Збільшіть перетин жили кабелю...'`
- `title: 'ПУЕ-2017 Глава 7.1...'`

Файлы фактически читаются как UTF-8, то есть это не обязательно повреждение файла. Но архитектурно это снова смешивает расчетное ядро, локализацию и пользовательский текст.

Риск:

- RU-интерфейс получит украинские fix suggestions;
- AI будет цитировать строки не на языке пользователя;
- следующие правки снова могут породить encoding/mojibake-проблемы;
- невозможно нормально версионировать тексты правил отдельно от логики.

Как исправить:

1. Изменить `FixSuggestion`:

```ts
type FixSuggestion = {
  actionCode: string
  descriptionKey: string
  params?: Record<string, string | number | boolean>
}
```

2. Вынести тексты в `uk.json` и `ru.json`:

```json
{
  "normguard": {
    "fixes": {
      "addRcdProtection": "...",
      "upgradeAtsPoles": "..."
    }
  }
}
```

3. В rule-engine оставлять только:

- `code`;
- `titleKey`;
- `messageKey`;
- `actionCode`;
- `descriptionKey`;
- `params`;
- `sourceRefs`.

### P1. `EngineeringGraph` неполный относительно мастер-ТЗ

Файл:

- `src/lib/engineering/graph.ts`

Текущее состояние:

```ts
export interface EngineeringGraph {
  id: string
  version: number
  locale: 'uk' | 'ru'
  network: NetworkConfig
  nodes: EngineeringNode[]
  edges: EngineeringEdge[]
  catalogBindings: CatalogBinding[]
  normIssues: NormIssue[]
}
```

В мастер-ТЗ граф должен стать общей моделью для схемы, BOM, корзины, AI и UI. Там ожидаются, как минимум:

- `loads`;
- `panels`;
- `bom`;
- `totals`.

При этом `EngineeringTotals` уже объявлен в `graph.ts`, но не используется в `EngineeringGraph`.

Риск:

- Scheme Builder UI начнет строиться поверх неполного контракта;
- BOM и цена будут жить отдельно от графа;
- AI-помощник получит часть данных из графа, часть из sessionStorage/других структур;
- появится рассинхронизация между схемой, расчетом, товарами и корзиной.

Как исправить:

Добавить в граф хотя бы MVP-поля:

```ts
loads: EngineeringLoadSnapshot[]
panels: EngineeringPanelSnapshot[]
bom: EngineeringBOMItemSnapshot[]
totals: EngineeringTotals
```

Если разработчик считает, что Phase 1 должен иметь минимальный graph-contract, это нужно явно зафиксировать как `EngineeringGraphV1Draft`, чтобы не считать его финальным контрактом для UI.

### P2. `SourceRef` пока не является проверяемой ссылкой на источник

Файлы:

- все rules в `src/lib/engineering/normguard/rules/`

Проблема:

В `SourceRef` часто указаны только `type`, `title`, `confidence`. Но для `confidence: 'exact'` нет обязательных:

- `url`;
- `documentId`;
- `section`;
- `clause`;
- `verifiedAt`.

Риск:

- AI будет показывать пользователю “точную” ссылку без проверяемой привязки;
- разработчики могут случайно ссылаться на неправильный пункт нормы;
- нельзя будет построить нормальную RAG/citation систему.

Как исправить:

Для `confidence: 'exact'` сделать обязательным минимум:

```ts
documentId: string
section: string
verifiedAt: string
```

Желательно добавить:

```ts
url?: string
clause?: string
quoteHash?: string
```

Если точная ссылка не подтверждена, ставить `confidence: 'needs_review'`, а не `exact`.

### P2. Недостаточно проверяется структура `NormIssue`

Файл:

- `scripts/test-engineering.ts`

Сейчас тесты в основном проверяют:

- issue code;
- severity;
- иногда отсутствие issue.

Нужно добавить проверки:

- `blocksCheckout === true` для `danger/blocker`;
- `targetId` указывает на правильный node/edge;
- `sourceRefs.length > 0`;
- `fixSuggestions.length > 0`;
- `titleKey` и `messageKey` существуют;
- `params` содержат нужные значения;
- warning не блокирует checkout;
- safe graph не создает ложных warning/danger для каждого правила.

Иначе можно сломать UI/AI-контракт, а тесты все равно останутся зелеными.

### P2. Нет отдельной валидации входящего EngineeringGraph

Файлы:

- `src/lib/engineering/graph.ts`
- `src/lib/engineering/normguard/index.ts`
- `src/lib/engineering/normguard/rules/*.ts`

Правила читают `properties` через приведения:

- `as string[]`;
- `as [number, number]`;
- `Number(...)`;
- fallback-значения.

Для MVP это допустимо, но перед UI нужно добавить `validateEngineeringGraph(graph)`, чтобы:

- находить edge, ведущий в несуществующий node;
- проверять типы properties;
- проверять дублирующиеся node ids;
- проверять диапазоны токов/сечений/модулей;
- возвращать `NormIssue` или `GraphValidationIssue`;
- не давать malformed graph попасть в Scheme Builder/AI.

### P3. Производительность utils O(N*E)

Файл:

- `src/lib/engineering/normguard/utils.ts`

`getAncestors` и `getDescendants` на каждом шаге фильтруют `graph.edges` и ищут `graph.nodes.find`.

Для MVP и малых схем нормально. Но перед сложными объектами лучше сделать `GraphIndex`:

```ts
type GraphIndex = {
  nodesById: Map<string, EngineeringNode>
  incomingByTarget: Map<string, EngineeringEdge[]>
  outgoingBySource: Map<string, EngineeringEdge[]>
}
```

И передавать его правилам, чтобы не пересчитывать одно и то же.

## Рекомендация разработчику

Перед переходом к визуальному Scheme Builder UI сделать короткий Phase 1 hardening:

1. Вынести `FixSuggestion.description` в i18n через `descriptionKey`.
2. Привести `SourceRef` к проверяемому формату: `documentId`, `section`, `verifiedAt`, `confidence`.
3. Расширить `EngineeringGraph` до MVP-контракта, включающего `loads`, `panels`, `bom`, `totals`, либо явно назвать текущий тип `Draft`.
4. Добавить `validateEngineeringGraph`.
5. Ужесточить тесты `NormIssue` contract.

После этого можно переходить к Phase 2:

- визуальный canvas;
- node inspector;
- warning icons на схеме;
- подбор товаров из каталога;
- AI explanations через server tools.

## Итог

Phase 1 хорошая по направлению: ядро, registry и первые правила реально появились.

Но принимать как “готово к UI” пока рискованно. Нужно сначала стабилизировать контракт данных и убрать человекочитаемые строки из rule-engine. Это короткая доработка, зато она защитит от больших переделок, когда поверх этого начнут строить схемостроитель и AI/RAG.
