# Мастер-ТЗ для разработчика: инженерный схемостроитель, калькуляторы, NormGuard, AI-агенты и RAG/vector memory

Дата: 2026-05-31  
Проект: Elektronom  
Назначение документа: единая точка входа для разработчика. Здесь собраны ссылки на начальные ТЗ, текущую реализацию, последние исследования и полный список дальнейших задач.

## 1. Что строим

Нужно развить текущий сайт Elektronom из обычного каталога/магазина в инженерный commerce-инструмент:

1. Пользователь описывает объект: квартира, дом, гараж, мастерская, офис.
2. Пользователь добавляет реальные потребители: бойлер, варочная поверхность, насос, тёплый пол, генератор, инвертор, видеонаблюдение, станки и т.д.
3. Система рассчитывает линии, токи, кабели, автоматы, УЗО/дифы, щит, резерв модулей.
4. `NormGuard` проверяет недопустимые решения и блокирует опасные компоненты.
5. Каталог подбирает только инженерно допустимые товары, подтверждённые datasheet/manual/catalog производителя.
6. AI-помощник объясняет проблемы, предлагает уточнения и безопасные альтернативы, но не имеет права обходить `NormGuard`.
7. RAG/vector memory хранит нормативную базу, datasheets, инструкции производителей, историю решений и проектную память.
8. Итог: схема + BOM + товары из каталога + корзина + PDF/PNG/коммерческое предложение.

## 2. Начальные документы проекта

### Базовый контекст сайта

- [MASTER_CONTEXT v1_02.md](</c:/Users/sevri/Сайт/elektronom/MASTER_CONTEXT v1_02.md>)  
  Исходный мастер-контекст проекта. Использовать как историческую базу, но учитывать, что часть требований уже обновлена.

- [TZ_UPDATED_MASTER_CONTEXT_1_3.md](</c:/Users/sevri/Сайт/elektronom/TZ_UPDATED_MASTER_CONTEXT_1_3.md>)  
  Обновлённый протокол разработки и контекст после перехода на современный стек.

- [MESSAGE_TO_DEVELOPERS_MASTER_CONTEXT_1_3.md](</c:/Users/sevri/Сайт/elektronom/MESSAGE_TO_DEVELOPERS_MASTER_CONTEXT_1_3.md>)  
  Сообщение разработчикам по обновлённому протоколу.

### Первичные ТЗ из исходной папки

- [ТЗ_СВОДНОЕ.md](</c:/Users/sevri/.gemini/antigravity/brain/5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a/ТЗ_СВОДНОЕ.md>)
- [ТЗ_часть1.md](</c:/Users/sevri/.gemini/antigravity/brain/5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a/ТЗ_часть1.md>)
- [ТЗ_часть2.md](</c:/Users/sevri/.gemini/antigravity/brain/5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a/ТЗ_часть2.md>)
- [ТЗ_часть3.md](</c:/Users/sevri/.gemini/antigravity/brain/5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a/ТЗ_часть3.md>)
- [ТЗ_часть4_дизайн.md](</c:/Users/sevri/.gemini/antigravity/brain/5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a/ТЗ_часть4_дизайн.md>)

Эти документы считать “первичным замыслом”. При конфликте с новыми документами ниже приоритет имеют новые ТЗ и `AGENTS.md`.

## 3. Текущая реализация инженерного MVP

### Страница

- [src/app/[locale]/calculators/page.tsx](</c:/Users/sevri/Сайт/elektronom/src/app/[locale]/calculators/page.tsx>)  
  Роут `/uk/calculators` и `/ru/calculators`.

### Расчётное ядро

- [src/lib/engineering/types.ts](</c:/Users/sevri/Сайт/elektronom/src/lib/engineering/types.ts>)  
  Типы инженерного проекта, линий, нагрузок, BOM, рекомендаций.

- [src/lib/engineering/calculators.ts](</c:/Users/sevri/Сайт/elektronom/src/lib/engineering/calculators.ts>)  
  Текущее MVP-ядро: нагрузки, токи, кабель, автомат, УЗО/диф, щит, BOM.

- [src/lib/engineering/catalog.ts](</c:/Users/sevri/Сайт/elektronom/src/lib/engineering/catalog.ts>)  
  Серверная выборка товаров из реального каталога для инженерного подбора.

### UI

- [src/components/engineering/engineering-workspace.tsx](</c:/Users/sevri/Сайт/elektronom/src/components/engineering/engineering-workspace.tsx>)  
  Текущий клиентский интерфейс: ввод данных, карточная схема, BOM, добавление найденных товаров в корзину.

Важно: текущий UI не является полноценным схемостроителем. Это MVP-калькулятор, который нужно развить в визуальный редактор щита и линий.

## 4. Последние ТЗ и исследования по инженерному модулю

Читать в таком порядке:

1. [REVIEW_SITE_GAPS_AND_TZ_REAL_CALCULATORS_SCHEME_BUILDER_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/REVIEW_SITE_GAPS_AND_TZ_REAL_CALCULATORS_SCHEME_BUILDER_2026-05-31.md>)  
   Беглая инспекция сайта: чего не хватало по калькуляторам и схемам.

2. [TZ_INTEGRATED_ENGINEERING_CALCULATORS_SCHEME_CATALOG_AI_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/TZ_INTEGRATED_ENGINEERING_CALCULATORS_SCHEME_CATALOG_AI_2026-05-31.md>)  
   Базовая архитектура связки: калькулятор -> схема -> каталог -> BOM -> корзина -> AI.

3. [REVIEW_ENGINEERING_NORM_GUARDRAILS_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/REVIEW_ENGINEERING_NORM_GUARDRAILS_2026-05-31.md>)  
   Исследование по `NormGuard`: что блокировать, какие статусы показывать, какие проверки обязательны.

4. [RESEARCH_AL_CU_ATS_NORM_GUARD_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/RESEARCH_AL_CU_ATS_NORM_GUARD_2026-05-31.md>)  
   Детальное исследование Al/Cu совместимости, наконечников, клемм, АВР 3P/4P, нейтрали и fact-check по производителям.

5. [TZ_ENGINEERING_SCHEME_BUILDER_CUSTOM_LOADS_AI_ASSIST_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/TZ_ENGINEERING_SCHEME_BUILDER_CUSTOM_LOADS_AI_ASSIST_2026-05-31.md>)  
   Пользовательские потребители, сложные схемы, AI-помощь, project complexity score.

Этот документ является сводным над ними.

## 5. Другие важные ТЗ проекта

Эти документы не про схемостроитель напрямую, но влияют на архитектуру сайта:

- [TZ_ADMIN_PRODUCTS_PROM_STYLE_2026-05-27.md](</c:/Users/sevri/Сайт/elektronom/TZ_ADMIN_PRODUCTS_PROM_STYLE_2026-05-27.md>)  
  Админка товаров. Нужно расширить её `EngineeringSpec`-редактором.

- [admin_products_acceptance_report.md](</c:/Users/sevri/Сайт/elektronom/admin_products_acceptance_report.md>)  
  Текущий статус админки товаров.

- [TZ_CATEGORY_FILTERS_ROZETKA_STYLE_2026-05-26.md](</c:/Users/sevri/Сайт/elektronom/TZ_CATEGORY_FILTERS_ROZETKA_STYLE_2026-05-26.md>)  
  Категории и фильтры. Для инженерного каталога нужны фасеты по техническим атрибутам.

- [TZ_CATEGORY_DYNAMIC_FACETS_REACTIVE_COUNTS_2026-05-29.md](</c:/Users/sevri/Сайт/elektronom/TZ_CATEGORY_DYNAMIC_FACETS_REACTIVE_COUNTS_2026-05-29.md>)  
  Реактивные фасеты. Использовать для фильтрации инженерных товаров по `poles`, `ratedCurrentA`, `breakingCapacityKa`, `neutralSwitching`, `allowedMaterials`.

- [TZ_CONTENT_FACTORY_ADMIN_INTEGRATION_2026-05-27.md](</c:/Users/sevri/Сайт/elektronom/TZ_CONTENT_FACTORY_ADMIN_INTEGRATION_2026-05-27.md>)  
  Фабрика контента. В будущем может генерировать статьи, карточки, инфографику и видео по инженерным схемам.

- [TZ_TEST_CONTENT_FACTORY_ADMIN_INTEGRATION_2026-05-27.md](</c:/Users/sevri/Сайт/elektronom/TZ_TEST_CONTENT_FACTORY_ADMIN_INTEGRATION_2026-05-27.md>)  
  Тестирование фабрики контента.

- [TZ_SEO_TOP10_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/TZ_SEO_TOP10_2026-05-31.md>)  
  SEO. Инженерные калькуляторы должны давать SEO-страницы: “расчёт щита квартиры”, “подбор АВР генератора”, “Al/Cu соединение”.

- [TZ_DEV_FEATURE_SPEC_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/TZ_DEV_FEATURE_SPEC_2026-05-31.md>)  
  Технические задания по доработкам сайта.

## 6. Что нужно сделать дальше

### 6.1 Исправить базовое качество текущего MVP

1. Убрать mojibake/кракозябры в `src/lib/engineering/calculators.ts` и `src/components/engineering/engineering-workspace.tsx`.
2. Вынести все UI-строки в `src/i18n/messages/uk.json` и `src/i18n/messages/ru.json`.
3. Разделить расчётное ядро и локализацию: ядро должно возвращать коды и структурированные данные, а не русские/украинские строки.
4. Уточнить статус страницы: сейчас это “черновой инженерный калькулятор”, не “готовый проект щита”.

### 6.2 Добавить пользовательские потребители

Реализовать:

- добавить потребитель;
- редактировать потребитель;
- удалить потребитель;
- шаблоны потребителей;
- пользовательская мощность;
- фаза;
- помещение;
- влажная зона;
- длина трассы;
- критическая нагрузка;
- резервное питание.

См. [TZ_ENGINEERING_SCHEME_BUILDER_CUSTOM_LOADS_AI_ASSIST_2026-05-31.md](</c:/Users/sevri/Сайт/elektronom/TZ_ENGINEERING_SCHEME_BUILDER_CUSTOM_LOADS_AI_ASSIST_2026-05-31.md>).

### 6.3 Сделать визуальный схемостроитель

Текущие карточки линий заменить/дополнить реальной визуализацией:

- ввод;
- реле напряжения;
- УЗИП;
- АВР;
- инвертор/UPS;
- УЗО/диф;
- автоматы;
- линии;
- потребители;
- DIN-щит с рядами и модулями.

Каждый компонент должен иметь статус:

- `OK`;
- `WARNING`;
- `BLOCKED`;
- `UNKNOWN_DATA`;
- `VERIFIED`.

### 6.4 Реализовать NormGuard

Создать модули:

- `src/lib/engineering/norms/types.ts`
- `src/lib/engineering/norms/rules.ts`
- `src/lib/engineering/norms/validate-project.ts`
- `src/lib/engineering/norms/validate-line.ts`
- `src/lib/engineering/norms/validate-component.ts`
- `src/lib/engineering/norms/profiles/ua-dbn-pue-2017.ts`
- `src/lib/engineering/norms/profiles/iec-60364-base.ts`

Минимальные блокировки:

- автомат больше допустимого тока кабеля;
- розеточная/мокрая линия без УЗО/дифа `<= 30 mA`;
- ванная/душ без зоны и IP;
- неправильная фазность/полюса;
- отсутствие PE;
- TN-C внутри новых групп квартиры/дома;
- недостаточная отключающая способность автомата;
- 3P АВР там, где требуется switched neutral/4P;
- Al/Cu соединение без допустимой клеммы/наконечника;
- критический товар без datasheet/manual/source verification.

### 6.5 Добавить EngineeringSpec в каталог

В админке товара должен появиться инженерный паспорт.

Минимально:

```ts
interface EngineeringSpecBase {
  engineeringRole:
    | 'wire'
    | 'cable'
    | 'connector'
    | 'terminalBlock'
    | 'lug'
    | 'sleeve'
    | 'breaker'
    | 'rcd'
    | 'rcbo'
    | 'ats'
    | 'voltageRelay'
    | 'panel'
    | 'busbar'
    | 'spd'
  manufacturer: string
  manufacturerPartNumber: string
  datasheetUrl: string
  catalogUrl?: string
  manualUrl?: string
  sourceVerifiedAt: string
  sourceConfidence: 'manufacturer' | 'distributor' | 'manual-review' | 'unknown'
}
```

Для критических товаров без `EngineeringSpec`:

- показывать `UNKNOWN_DATA`;
- не разрешать финальный инженерный заказ;
- не позволять AI утверждать, что товар подходит.

### 6.6 Fact-check характеристик

Нужно реализовать pipeline:

1. Админ добавляет товар или импортирует товар.
2. Система ищет datasheet/manual/catalog производителя.
3. AI/RAG извлекает характеристики в черновик.
4. Человек подтверждает.
5. Только после подтверждения товар получает `sourceConfidence = manufacturer/manual-review`.

Источники доверия:

1. Datasheet производителя.
2. Каталог производителя.
3. Инструкция производителя.
4. Официальный дистрибьютор.
5. Текст продавца — низкое доверие.
6. AI extraction — только черновик.

## 7. AI-агенты и границы ответственности

### 7.1 Какие агенты нужны

1. `EngineeringAssistantAgent`  
   Общается с пользователем, задаёт вопросы, объясняет ошибки.

2. `NormGuardAgent`  
   Не LLM-агент, а детерминированный модуль правил. AI может только читать его вывод.

3. `CatalogMatcherAgent`  
   Подбирает товары по `EngineeringSpec`, но финальное разрешение получает от `NormGuard`.

4. `DatasheetResearchAgent`  
   Ищет и извлекает характеристики из datasheet/manual/catalog.

5. `ContentFactoryAgent`  
   Создаёт статьи, инфографику, видео, SEO-блоки на основе проверенных схем и товаров.

6. `QAReviewAgent`  
   Проверяет проект на регрессии: нормы, UI, каталог, RAG-источники.

### 7.2 Что AI может

- объяснять блокировку;
- задавать уточняющие вопросы;
- предлагать безопасные альтернативы;
- сравнивать старое/новое решение;
- подсказать, какие данные не хватает;
- подготовить черновик BOM;
- подготовить статью/инфографику.

### 7.3 Что AI не может

- снять `P0_BLOCK`;
- добавить заблокированный товар в корзину;
- выдумать характеристику товара;
- считать товар допустимым без source verification;
- заменить норму “по просьбе пользователя”;
- рекомендовать опасный Al/Cu переход;
- рекомендовать 3P АВР, если `NormGuard` требует switched neutral/4P.

## 8. RAG и vector memory

### 8.1 Что хранить в RAG

1. Нормативные документы:
   - ПУЕ;
   - ДБН;
   - IEC/EN references;
   - локальные правила проекта.

2. Datasheets производителей:
   - автоматы;
   - УЗО;
   - дифавтоматы;
   - АВР;
   - клеммы;
   - кабели;
   - наконечники;
   - щиты;
   - реле напряжения;
   - УЗИП.

3. Инструкции монтажа:
   - моменты затяжки;
   - допустимые материалы;
   - Al/Cu условия;
   - пасты/смазки;
   - обжимные матрицы;
   - IP/температура.

4. История проектных решений:
   - почему компонент был заблокирован;
   - какая альтернатива выбрана;
   - какие вопросы задавал AI;
   - какой статус подтвердил электрик/админ.

5. Карточки товаров:
   - `EngineeringSpec`;
   - source URLs;
   - verified fields;
   - confidence.

### 8.2 Структура памяти

```ts
interface RagDocument {
  id: string
  sourceType: 'norm' | 'datasheet' | 'manual' | 'catalog' | 'project-memory' | 'admin-note'
  title: string
  url?: string
  manufacturer?: string
  productSku?: string
  productId?: string
  normProfile?: string
  language: 'uk' | 'ru' | 'en' | 'de' | 'pl'
  version?: string
  effectiveDate?: string
  verifiedBy?: string
  verifiedAt?: string
  chunks: RagChunk[]
}

interface RagChunk {
  id: string
  documentId: string
  text: string
  embedding: number[]
  section: string
  page?: number
  tags: string[]
  confidence: 'high' | 'medium' | 'low'
}
```

### 8.3 Как AI должен использовать RAG

AI отвечает только с опорой на:

- `NormGuard` output;
- проверенные `EngineeringSpec`;
- найденные RAG chunks;
- ссылки на источники.

Если источник не найден:

```text
Я не могу подтвердить эту характеристику по datasheet производителя. Нужно ручное подтверждение.
```

### 8.4 Векторная память проектов

Для каждого проекта пользователя хранить:

- объект;
- нагрузки;
- линии;
- выбранные товары;
- norm issues;
- решения пользователя;
- AI-вопросы;
- экспортированные версии.

Нужны версии:

```ts
interface EngineeringProjectVersion {
  id: string
  projectId: string
  version: number
  createdAt: string
  createdBy: 'user' | 'assistant' | 'admin'
  inputSnapshot: unknown
  schemeSnapshot: unknown
  bomSnapshot: unknown
  normIssuesSnapshot: unknown
  changeSummary: string
}
```

## 9. Совместимость с корзиной и сайтом

Текущий модуль уже использует:

- `addToCart` из [src/actions/cart.ts](</c:/Users/sevri/Сайт/elektronom/src/actions/cart.ts>);
- Zustand cart UI из [src/store/cart-store.ts](</c:/Users/sevri/Сайт/elektronom/src/store/cart-store.ts>);
- товары из Prisma через [src/lib/engineering/catalog.ts](</c:/Users/sevri/Сайт/elektronom/src/lib/engineering/catalog.ts>).

Дальше нужно:

1. Разрешать добавлять в корзину только safe BOM items.
2. Показывать заблокированные позиции отдельно.
3. Давать кнопку “подобрать безопасную альтернативу”.
4. Сохранять проект в аккаунте пользователя.
5. Давать экспорт PDF/PNG/Excel.
6. Связать с админкой товаров и `EngineeringSpec`.

## 10. Дорожная карта

### Sprint 1: стабилизация MVP

- Исправить кодировку текстов.
- Вынести строки в i18n.
- Добавить пользовательские потребители.
- Добавить первый `ComplexityResult`.
- Добавить AI trigger panel без подключения полного RAG.
- Добавить базовые `NormIssue`.

### Sprint 2: NormGuard

- Реализовать `NormGuard` rules.
- Добавить статусы на линии и BOM.
- Блокировать unsafe cart add.
- Добавить тесты на P0/P1/P2.
- Добавить `NormIssuePanel`.

### Sprint 3: EngineeringSpec в админке

- Расширить Prisma schema.
- Добавить редактор инженерных характеристик товара.
- Добавить quality checks в админке: товары без datasheet, без poles, без material compatibility.
- Добавить source verification workflow.

### Sprint 4: визуальный схемостроитель

- DIN-щит.
- Линии и потребители.
- Ручная замена компонентов.
- Сравнение старое/новое.
- Экспорт PDF/PNG.

### Sprint 5: AI + RAG

- Подключить RAG хранилище.
- Индексировать datasheets/manuals/norms.
- Подключить AI к `NormGuard` context.
- Запретить AI bypass.
- Добавить проектную память и версии.

### Sprint 6: production

- Staging QA.
- Manual verification.
- Security review.
- Юридический disclaimer.
- Режим “требуется проверка электрика”.
- Мониторинг ошибок AI и NormGuard.

## 11. Acceptance Criteria итогового продукта

1. Пользователь может создать проект электрики квартиры/дома.
2. Пользователь может добавлять свои потребители.
3. Система строит схему линий и щита.
4. Система считает BOM.
5. Все критические компоненты проверяются `NormGuard`.
6. Опасные решения блокируются красным статусом.
7. AI объясняет проблему и предлагает безопасные варианты.
8. AI не может снять блокировку.
9. Каталог не предлагает товары без инженерного паспорта как безопасные.
10. Al/Cu переходы проверяются по datasheet производителя.
11. АВР 3P/4P проверяется по нейтрали и источникам.
12. Пользователь видит ссылки на источники характеристик.
13. Проект сохраняется и версионируется.
14. BOM можно добавить в корзину только в безопасной части.
15. Есть экспорт PDF/PNG/Excel.

## 12. Важное предупреждение для разработчика

Не пытаться “быстро улучшить AI”, пока нет `NormGuard` и `EngineeringSpec`.

Правильный порядок:

1. Данные.
2. Нормы.
3. Проверка совместимости.
4. Каталог.
5. UI.
6. AI объяснения.
7. RAG и память.

AI без проверенных данных и правил будет создавать рискованные рекомендации. В этом проекте AI — интерфейс и помощник, а не источник инженерной истины.

