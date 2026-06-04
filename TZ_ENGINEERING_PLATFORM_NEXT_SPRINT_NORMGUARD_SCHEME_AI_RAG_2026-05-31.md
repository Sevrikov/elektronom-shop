# ТЗ: инженерная платформа Elektronom — NormGuard v2, схемостроитель, каталог, AI и RAG

Дата: 2026-05-31  
Проект: `Elektronom`  
Статус: техническое задание для следующего этапа после закрытия Sprint 1 инженерного MVP

## 1. Цель

Разработать связанную инженерную платформу внутри сайта Elektronom, где калькуляторы, визуальный схемостроитель, каталог товаров, AI-помощник и RAG-база технической документации работают как единая система.

Платформа должна помогать пользователю:

- описать объект: квартира, дом, мастерская, серверная, резервное питание;
- добавить реальные потребители;
- получить расчет линий, автоматов, УЗО/дифов, кабелей, щитка и резерва;
- построить понятную схему электропитания;
- увидеть предупреждения о несовместимости и нарушениях;
- подобрать реальные товары из каталога;
- получить объяснение от AI-помощника с опорой на NormGuard, каталог и техническую документацию;
- сформировать BOM/черновик заказа/корзину.

Главный принцип: AI не заменяет инженерное ядро и не отменяет safety-решения. AI объясняет, уточняет, помогает подобрать замену и ссылается на документы.

## 2. Обязательные источники норм и документации

Перед реализацией правил разработчик должен собрать локальную нормативно-техническую базу проекта.

Минимальные источники:

- ПУЕ Украины, приказ №476 от 21.07.2017, действующий документ на `zakon.rada.gov.ua`:  
  https://zakon.rada.gov.ua/laws/show/v0476732-17
- IEC 60364, низковольтные электроустановки зданий, официальная страница IEC:  
  https://webstore.iec.ch/en/publication/63699/
- Актуальный ДБН по электрооборудованию зданий. Проверить актуальность редакции перед использованием, не опираться только на пересказы.
- Технические паспорта производителей для автоматов, УЗО/дифов, кабелей, АВР, клемм, шин, щитков, реле напряжения, инверторов, аккумуляторов.
- Внутренние правила Elektronom: что можно рекомендовать, что требует консультации специалиста, какие сценарии блокируются.

Важно: если нормативный текст недоступен в открытом виде, в RAG можно загружать только легально полученные документы. В UI и AI-ответах давать краткую ссылку/указание источника, без перепубликации больших фрагментов.

## 3. Архитектурный принцип

Система делится на 5 слоев:

1. `Engineering Core` — расчеты и модель схемы.
2. `NormGuard v2` — детерминированные правила безопасности и совместимости.
3. `Catalog Binding` — связь расчетных элементов с реальными товарами.
4. `Scheme Builder UI` — визуальное проектирование схемы и щитка.
5. `AI + RAG Assistant` — консультации, объяснения, подбор, уточнения.

Запрещено смешивать эти слои так, чтобы UI или AI напрямую принимали safety-решения.

## 4. NormGuard v2

### 4.1. Назначение

NormGuard v2 должен стать отдельным rule-engine, который получает инженерный проект и возвращает список issues:

```ts
type NormIssue = {
  code: string
  severity: 'info' | 'warning' | 'danger' | 'blocker'
  scope: 'project' | 'source' | 'panel' | 'line' | 'load' | 'component' | 'catalog-item'
  targetId?: string
  titleKey: string
  messageKey: string
  params?: Record<string, string | number | boolean>
  sourceRefs: SourceRef[]
  fixSuggestions: FixSuggestion[]
  blocksCheckout: boolean
}
```

`danger` и `blocker` должны блокировать добавление проекта в корзину до исправления.

### 4.2. Минимальные правила Sprint 2

Реализовать правила:

- влажные зоны требуют корректной дифференциальной защиты;
- 3-фазная нагрузка не может быть 230 В без явного обоснования;
- резервный источник требует проверки схемы нейтрали, PE/N, заземления и bonding;
- АВР 3P/4P: если резерв/сеть требует коммутации нейтрали, 3P АВР должен выдавать `danger/blocker`;
- несовместимость алюминиевых и медных проводников без специальных клемм/переходников/пасты;
- клемма/наконечник должен поддерживать материал, сечение и тип проводника;
- сечение кабеля должно соответствовать расчетному току и длине трассы;
- падение напряжения выше допустимого порога должно давать warning/danger;
- номинал автомата не должен превышать допустимый ток кабеля;
- УЗО/диф должен соответствовать току линии и типу нагрузки;
- щиток должен иметь достаточный запас модулей;
- нельзя рекомендовать товар без ключевых технических атрибутов, если он участвует в safety-расчете.

### 4.3. SourceRefs

Каждое правило должно иметь ссылку на источник:

```ts
type SourceRef = {
  type: 'norm' | 'manufacturer_doc' | 'internal_policy' | 'catalog_attribute'
  title: string
  url?: string
  documentId?: string
  section?: string
  confidence: 'exact' | 'derived' | 'needs_review'
}
```

Если источник не подтвержден, issue должен иметь пометку `needs_review`, а AI обязан сказать, что требуется проверка инженером.

## 5. EngineeringGraph

### 5.1. Цель

Схема должна храниться не как картинка, а как JSON-граф.

Пример структуры:

```ts
type EngineeringGraph = {
  id: string
  version: number
  locale: 'uk' | 'ru'
  network: NetworkConfig
  nodes: EngineeringNode[]
  edges: EngineeringEdge[]
  loads: EngineeringLoad[]
  panels: EngineeringPanel[]
  catalogBindings: CatalogBinding[]
  normIssues: NormIssue[]
  bom: EngineeringBOMItem[]
  totals: EngineeringTotals
}
```

### 5.2. Типы узлов

Минимальные узлы:

- grid input;
- meter;
- main breaker;
- voltage relay;
- surge protection;
- busbar N/PE;
- RCD/diff;
- MCB breaker;
- cable line;
- load/consumer;
- generator;
- inverter;
- battery;
- ATS;
- distribution panel;
- terminal/clamp.

### 5.3. Валидация графа

Граф должен проходить проверки:

- все линии имеют источник и нагрузку;
- нет висящих узлов без связи;
- PE/N не смешиваются без явного допустимого сценария;
- резервный источник подключен через валидную схему;
- компоненты не превышают номиналы;
- каждый safety-компонент имеет либо выбранный товар, либо расчетную спецификацию.

## 6. Каталог и технические атрибуты

### 6.1. Требование

Каталог должен стать технической базой подбора, а не просто витриной.

Для товаров, участвующих в инженерном подборе, нужно добавить нормализованные атрибуты.

### 6.2. Примеры атрибутов

Автомат:

```json
{
  "engineeringRole": "breaker",
  "poles": "1P|2P|3P|4P",
  "ratedCurrentA": 16,
  "curve": "B|C|D",
  "breakingCapacityKa": 6,
  "voltageV": 230,
  "standard": "IEC 60898-1"
}
```

УЗО/диф:

```json
{
  "engineeringRole": "rcd",
  "poles": "2P|4P",
  "ratedCurrentA": 40,
  "leakageMa": 30,
  "rcdType": "AC|A|F|B",
  "selective": false
}
```

Кабель:

```json
{
  "engineeringRole": "cable",
  "material": "Cu|Al",
  "cores": 3,
  "sectionMm2": 2.5,
  "insulation": "PVC|XLPE",
  "installationMethod": "wall|pipe|tray|ground",
  "ratedCurrentA": 21
}
```

АВР:

```json
{
  "engineeringRole": "ats",
  "poles": "3P|4P",
  "switchesNeutral": true,
  "ratedCurrentA": 63,
  "sourceTypes": ["grid", "generator", "inverter"]
}
```

Клеммы:

```json
{
  "engineeringRole": "terminal",
  "materialsSupported": ["Cu", "Al"],
  "requiresPasteForAl": true,
  "sectionRangeMm2": [1.5, 16],
  "strandTypes": ["solid", "stranded", "flexible"],
  "requiresFerruleForFlexible": true
}
```

### 6.3. ProductQualityGate

Товар нельзя использовать в инженерной рекомендации, если:

- нет фото;
- нет цены;
- нет наличия;
- нет ключевых инженерных атрибутов;
- нет бренда;
- нет технического описания;
- нет источника характеристик, если товар влияет на безопасность.

UI должен показывать причину: “товар виден в каталоге, но не может быть использован в инженерном подборе”.

## 7. Схемостроитель UI

### 7.1. Основной экран

Сделать отдельный workspace:

`/[locale]/engineering`

Структура:

- левая панель: параметры объекта, сеть, потребители, шаблоны нагрузок;
- центр: canvas/diagram схемы;
- правая панель: inspector выбранного узла;
- нижняя панель: BOM, цена, корзина, warnings;
- плавающий AI-помощник: контекстный инженерный консультант.

### 7.2. Canvas

MVP можно сделать на `React Flow` или аналогичной библиотеке графов.

Требования:

- zoom/pan;
- автолэйаут;
- выбор узла;
- подсветка ошибок;
- связи между узлами;
- экспорт JSON;
- экспорт PNG/PDF позже;
- responsive режим: на mobile открывать схему как fullscreen viewer.

### 7.3. Визуальные состояния элементов

Каждый элемент схемы должен иметь статусы:

- normal;
- selected;
- missing data;
- warning;
- danger;
- blocked;
- replaced/suggested.

Иконки:

- `info` — синий;
- `warning` — желтый;
- `danger` — красный;
- `blocker` — красный с замком;
- `AI suggestion` — accent/blue.

Клик по значку открывает объяснение NormGuard.

### 7.4. UX исправлений

Если найдено нарушение:

1. Пользователь видит значок на схеме.
2. В правой панели видит причину.
3. Видит варианты исправления.
4. Может нажать “подобрать совместимый товар”.
5. Открывается сравнение: текущий элемент → предложенная замена.
6. Пользователь принимает/отклоняет замену.
7. BOM и цена пересчитываются.

## 8. AI-помощник

### 8.1. Роль AI

AI-помощник не принимает safety-решения. Он:

- задает уточняющие вопросы;
- объясняет сработавшие правила;
- предлагает безопасные варианты;
- подбирает товары из каталога;
- сравнивает старый и новый вариант;
- формирует черновик заказа;
- готовит список вопросов для электрика/инженера.

### 8.2. Tools/API для AI

AI должен работать только через серверные tools:

```ts
analyzeEngineeringGraph(graphId)
checkNorms(graph)
findCompatibleProducts(spec)
compareProducts(oldProductId, newProductId, context)
suggestSchemeFix(issueCode, graph)
retrieveTechnicalDocs(query, filters)
explainNormIssue(issueId, locale)
updateDraftOrder(changeSet)
```

Запрещено:

- отправлять AI скрытые себестоимости;
- давать AI прямой доступ к Prisma без лимитов;
- позволять AI менять корзину без подтверждения пользователя;
- позволять AI снимать блокировку NormGuard.

### 8.3. Память сессии

AI должен помнить:

- параметры проекта;
- выбранные потребители;
- текущие ошибки;
- предложенные замены;
- принятые/отклоненные решения;
- какие документы использовались.

Хранить это как `engineering_assistant_sessions` и `engineering_assistant_messages`.

Каждый tool-call должен логироваться.

## 9. RAG-база

### 9.1. Назначение

RAG нужен не для “болтовни”, а для подтвержденных объяснений:

- почему сработало правило;
- что говорит производитель;
- какие параметры товара важны;
- чем отличаются 3P и 4P АВР;
- когда нужны наконечники/клеммы для Al/Cu;
- какой тип УЗО нужен под нагрузку.

### 9.2. Документы

Минимальные типы документов:

- нормы;
- паспорта товаров;
- инструкции производителей;
- внутренние политики;
- типовые схемы;
- FAQ инженера.

### 9.3. Метаданные chunks

```ts
type RagChunk = {
  id: string
  documentId: string
  title: string
  sourceType: 'norm' | 'manufacturer' | 'internal' | 'faq' | 'scheme'
  brand?: string
  productId?: string
  engineeringRoles?: string[]
  locale: 'uk' | 'ru' | 'en'
  text: string
  embedding: number[]
  page?: number
  section?: string
  verifiedAt?: string
}
```

### 9.4. Требования к ответу AI

AI-ответ по инженерной теме должен содержать:

- краткий вывод;
- предупреждение, если есть risk/danger;
- ссылку на NormGuard issue;
- ссылки на документы/даташиты;
- список уточняющих вопросов, если данных не хватает;
- запрет на категоричные утверждения без источника.

## 10. API и серверные модули

### 10.1. Новые модули

Предлагаемая структура:

```text
src/lib/engineering/
  graph.ts
  graph-validation.ts
  calculators.ts
  normguard/
    index.ts
    types.ts
    registry.ts
    rules/
      wet-zone-rcd.ts
      ats-neutral.ts
      cable-breaker.ts
      al-cu-compatibility.ts
      terminal-compatibility.ts
      voltage-drop.ts
      panel-capacity.ts
  catalog-binding.ts
  bom.ts
  explain.ts

src/components/engineering/
  engineering-workspace.tsx
  scheme-canvas.tsx
  scheme-node.tsx
  node-inspector.tsx
  norm-issues-panel.tsx
  bom-panel.tsx
  product-replacement-panel.tsx

src/app/[locale]/(shop)/engineering/
  page.tsx

src/app/api/assistant/engineering/
  route.ts
```

### 10.2. Next.js rules

Соблюдать правила проекта:

- не добавлять route configs;
- не использовать `unstable_cache`;
- серверные query-функции с коллекциями должны иметь `take/skip`;
- Prisma только через `@/lib/prisma`;
- no inline styles;
- AI route не должен использовать Edge runtime, если внутри Prisma.

## 11. Database schema MVP

Добавить модели после отдельного review миграции:

```prisma
model EngineeringProject {
  id        String   @id @default(cuid())
  userId    String?
  locale    String
  name      String
  graph     Json
  status    String   @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model EngineeringAssistantSession {
  id          String   @id @default(cuid())
  projectId   String?
  userId      String?
  locale      String
  summary     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EngineeringAssistantMessage {
  id        String   @id @default(cuid())
  sessionId String
  role      String
  content   String
  structured Json?
  toolCalls Json?
  createdAt DateTime @default(now())
}

model TechnicalDocument {
  id        String   @id @default(cuid())
  title     String
  sourceType String
  url       String?
  productId String?
  brandId   String?
  locale    String
  status    String @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TechnicalDocumentChunk {
  id         String @id @default(cuid())
  documentId String
  text       String
  metadata   Json?
  embedding  Unsupported("vector")?
}
```

Если pgvector пока не подключен, `embedding` можно отложить, но API документов и chunks нужно спроектировать сразу.

## 12. Acceptance criteria Sprint 2

Sprint 2 считается выполненным, если:

1. Есть `EngineeringGraph` JSON-модель.
2. Есть `NormGuard v2` registry минимум с 7 правилами.
3. Все правила покрыты unit-тестами.
4. Схемостроитель показывает граф и подсвечивает issues.
5. Инспектор узла показывает параметры и совместимость.
6. Каталог умеет отдавать совместимые товары по инженерной спецификации.
7. AI-помощник может объяснить issue и предложить замену через server tools.
8. AI не может снять блокировку NormGuard.
9. BOM пересчитывается после принятой замены.
10. `npm run lint`, `npx tsc --noEmit`, `npm run test:engineering` проходят.

## 13. Риски

### Риск 1: ложное ощущение безопасности

Нельзя писать в UI “схема безопасна”, если нет полной проверки. Формулировка должна быть:

> “Критические проблемы по доступным данным не обнаружены. Финальную проверку должен выполнить квалифицированный специалист.”

### Риск 2: AI галлюцинирует нормы

AI должен отвечать только с опорой на NormGuard/RAG. Если источника нет — говорить “нужно уточнить”.

### Риск 3: каталог неполный

Если у товара нет атрибутов, его нельзя использовать в safety-подборе. Не надо подбирать “похожий по названию” автомат в критичной части схемы.

### Риск 4: юридическая ответственность

Добавить disclaimers:

- расчеты предварительные;
- монтаж выполняет квалифицированный специалист;
- нормы и производитель имеют приоритет над рекомендацией сайта;
- проект требует проверки на объекте.

## 14. Что не делать в Sprint 2

Не делать:

- полноценный CAD;
- автоматический “проект под ключ” без инженера;
- генерацию финальной проектной документации;
- расчет молниезащиты;
- расчет короткого замыкания промышленного уровня;
- сложные селективные карты защит;
- продажу опасной схемы при `danger/blocker`.

Сначала нужен надежный MVP: граф, правила, подсветка, объяснение, подбор, BOM.

## 15. Итоговая формулировка для разработчика

Нужно разработать не отдельный калькулятор, а инженерную подсистему сайта:

- расчетное ядро строит модель проекта;
- NormGuard проверяет безопасность и совместимость;
- схемостроитель визуализирует проект;
- каталог дает реальные совместимые товары;
- AI объясняет и помогает исправить;
- RAG дает документальные источники;
- корзина получает только проект без блокирующих ошибок.

Ключевой критерий качества: пользователь должен понимать, почему элемент схемы недопустим, чем его заменить, сколько это будет стоить и на основании какого правила/документа система дала предупреждение.
