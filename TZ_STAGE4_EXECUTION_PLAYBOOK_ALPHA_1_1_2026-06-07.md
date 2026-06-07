# Playbook выполнения Stage 4 Authority без поломки Alpha Project V1.1

Дата: 2026-06-07
Связанные документы:

- `TZ_STAGE4_AUTHORITY_2026-06-01.md`
- `TZ_ALPHA_1_1_AI_SEO_OPTIMIZATION_2026-06-07.md`
- `TZ_SEO_TOP10_2026-05-31.md`
- `TZ_GOOGLE_SHOPPING_2026-05-31.md`
- `TZ_ENTERPRISE_ROADMAP_2026-06-01.md`
- `00_INDEX_DOCS_2026-05-31.md`

## 1. Короткий ответ

Stage 4 совместим с Alpha Project V1.1 и не должен ломать проект, если выполнять его не как один большой релиз, а как серию независимых эпиков с контрольными воротами.

Главное правило: Stage 4 не перепрыгивает Stage 1-3. Он зависит от:

- E1.1/E1.3: тесты, CI, observability, GA4;
- E2.6: очереди и фоновые задачи;
- E3.1: RAG, эмбеддинги, AI-советник;
- стабильного SEO/Shopping слоя из `TZ_SEO_TOP10` и `TZ_GOOGLE_SHOPPING`.

Если эти зависимости не закрыты, Stage 4 можно начинать только в безопасном режиме: контент, schema, trust pages, аналитика и подготовительные модели. Рекомендации, AI-рекомендации, A/B и тяжелый BI запускать позже и за feature flags.

## 2. Что может сломать Alpha V1.1

Риски не в самой идее Stage 4, а в способе внедрения:

1. Одновременная миграция контента, RAG, рекомендаций, BI и A/B.
2. Изменение product/category templates без контроля конверсии.
3. Добавление тяжелых Prisma-агрегаций прямо в server render.
4. Индексация произвольных фильтров и дублей.
5. Schema для невидимого или фейкового контента.
6. Персонализация внутри кэшируемых Server Components без разделения cache / user state.
7. A/B эксперименты без GA4/PostHog/GrowthBook baseline.
8. Непроверенные миграции Prisma для Author/Article/Guide/Recommendation/Experiment.
9. Массовый AI-generated контент без редакторской проверки.
10. Изменения checkout/cart/search во время SEO-релиза.

## 3. Принцип безопасного выполнения

Каждый эпик Stage 4 должен быть:

- отдельной веткой;
- отдельным PR;
- с маленьким blast radius;
- с feature flag, если влияет на UX, рекомендации, персонализацию или аналитику;
- с rollback-планом;
- с проверками `npm run lint`, `npx tsc --noEmit`, `npm run build`;
- с ручной QA на product, category, blog, cart и checkout.

Нельзя релизить Stage 4 как "один большой authority update".

## 4. Рекомендуемый порядок выполнения

### Фаза 0: Readiness Gate

Цель: понять, можно ли начинать Stage 4 полностью или только частично.

Проверить:

- Stage 1: тесты и CI работают.
- Stage 1: observability/GA4 события работают.
- Stage 2: очереди/фоновые задачи есть или выбран безопасный временный механизм.
- Stage 3: RAG/эмбеддинги товаров готовы или есть план их внедрения.
- Product/category SEO не имеет критичных проблем.
- Merchant feed валиден.
- GSC baseline снят.

Решение:

- если зависимости закрыты: выполнять Stage 4 полностью;
- если зависимости не закрыты: выполнять только безопасные блоки E4.1/E4.2 и подготовку E4.4/E4.5.

### Фаза 1: E4.1 Content Hub / Guides

Это самый безопасный старт Stage 4.

Сначала делать:

- Article/Guide модель или аккуратное расширение текущего `src/lib/articles.ts`;
- author/reviewer поля;
- status draft/published;
- canonical/hreflang;
- Article schema;
- AEO-структуру: Direct Answer, FAQ, таблицы, внутренние ссылки;
- sitemap включение только published pages.

Потом подключать RAG:

- publication event;
- background job `assistant/embed-docs`;
- сохранение embeddings;
- ассистент цитирует только published guide;
- удаление/обновление гайда обновляет embedding.

Безопасный режим, если RAG еще не готов:

- публикуем guides как SEO/content hub;
- добавляем поля для будущего RAG;
- не подключаем ассистента к новым гайдам до готовности E3.1.

Что нельзя:

- массово публиковать AI-тексты без редактора;
- добавлять FAQ schema без видимого FAQ;
- делать гайды единственным источником ответа ассистента без fallback.

### Фаза 2: E4.2 SEO Authority

Делать после или параллельно с E4.1, но маленькими PR.

Порядок:

1. Organization/NAP audit.
2. Trust pages: about, contacts, delivery, payment, returns, warranty.
3. Person/Author schema.
4. Article schema.
5. FAQPage/HowTo только для видимых FAQ/how-to блоков.
6. Quick-link landings: только whitelist.
7. Direct answers для топовых категорий.
8. Merchant/Rich Results validation.
9. Local SEO/GBP/Wikidata - вне кода, но фиксируется в задачах.

Безопасный режим:

- schema и trust pages можно делать до полной Stage 3;
- AI-SEO трактовать как улучшение цитируемого контента, не как отдельные магические файлы.

Что нельзя:

- открывать в индекс произвольные фильтры;
- ставить `nosnippet` на важные страницы;
- добавлять fake reviews;
- менять домен/бренд без отдельного решения.

### Фаза 3: E4.4 BI Analytics

Делать до E4.3 и E4.5, потому что рекомендации и эксперименты требуют метрик.

Порядок:

1. GA4 события и воронки.
2. SEO/Merchant dashboard.
3. Admin BI read-only dashboard.
4. Batch jobs для тяжелых расчетов.
5. ABC, velocity, dead stock, supplier efficiency.

Правило безопасности:

- тяжелые агрегаты не выполнять на запросе страницы;
- использовать jobs/scheduled tasks;
- в Prisma всегда `select`;
- коллекции всегда с `take`/`skip`;
- BI не должен замедлять storefront.

Если E2.6 еще не готов:

- делать экспорт/ручной отчет;
- не встраивать тяжелые расчеты в пользовательские страницы.

### Фаза 4: E4.3 Recommendations / Personalization

Делать только после BI baseline.

Порядок:

1. Recently viewed:
   - localStorage/cookie;
   - небольшой client component;
   - не влияет на SEO/canonical.
2. Similar/same series:
   - использовать существующие похожие товары;
   - не ломать текущий PDP.
3. "С этим покупают":
   - batch job по `OrderItem`;
   - read-only recommendation table;
   - виджет за feature flag.
4. AI recommendations:
   - только после готовности product embeddings;
   - fallback на обычные similar products;
   - A/B замер.

Правило кэша:

- персональные блоки не помещать в общий `'use cache'`;
- public recommendations можно кэшировать;
- user-specific recommendations выводить leaf client component или через некэшируемый endpoint/action.

Что нельзя:

- считать ко-покупки на лету в PDP;
- доверять клиенту цены/скидки/наличие;
- показывать AI-рекомендации без fallback.

### Фаза 5: E4.5 A/B Culture

Делать после GA4/BI baseline.

Порядок:

1. Выбрать платформу: PostHog, GrowthBook, Statsig или Vercel Flags.
2. Ввести feature flag abstraction.
3. Начать с низкорисковых экспериментов:
   - порядок SEO-блоков на PDP;
   - видимость FAQ;
   - recommendation widget placement;
   - category answer block;
   - CTA copy, если не ломает дизайн.
4. Установить правила значимости.
5. Вести experiment registry.

Что нельзя:

- экспериментировать с checkout без Stage 1/2 страховки;
- менять цены/наличие через A/B;
- одновременно запускать много экспериментов на одной воронке.

## 5. Feature flags

Минимальный набор флагов:

- `content_guides_enabled`
- `guide_rag_citations_enabled`
- `seo_answer_blocks_v2_enabled`
- `schema_article_enabled`
- `schema_faq_howto_enabled`
- `recently_viewed_enabled`
- `co_purchase_recommendations_enabled`
- `ai_recommendations_enabled`
- `bi_admin_dashboard_enabled`
- `ab_experiments_enabled`

Флаги должны позволять отключить новый слой без отката всего релиза.

## 6. Миграции базы

Перед добавлением новых моделей:

- проверить текущую Prisma schema;
- подготовить addendum к master context, если меняются сущности Author/Article/Guide/Embedding/Experiment;
- не удалять старые поля сразу;
- миграции делать backward-compatible;
- сначала deploy schema, потом код, потом включение флагов.

Рекомендуемый порядок моделей:

1. `Author` / `Reviewer`
2. `Article` / `Guide`
3. `GuideEmbedding` или связь с существующим embedding-хранилищем
4. `RecommendationSnapshot`
5. `Experiment` / `FeatureFlag` при собственной реализации
6. `AnalyticsSnapshot` / BI aggregates

## 7. Контрольные проверки перед каждым релизом

Технические:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- smoke test product page
- smoke test category page
- smoke test blog/guide page
- smoke test cart/checkout
- проверка sitemap/robots/canonical
- Rich Results Test для samples

SEO:

- нет случайного `noindex`;
- нет `nosnippet` на целевых страницах;
- canonical корректный;
- hreflang корректный;
- schema соответствует видимому контенту;
- sitemap не содержит черновики и произвольные фильтры.

Commerce:

- цена/наличие не ломаются;
- add to cart работает;
- checkout работает;
- Merchant feed не ухудшен;
- Algolia sync не нарушен.

Performance:

- LCP не ухудшен на product/category;
- INP не ухудшен;
- нет layout shift от новых блоков;
- recommendations/BI не добавляют тяжелые запросы на storefront.

## 8. Rollback-план

Для каждого Stage 4 PR должен быть простой rollback:

- выключить feature flag;
- скрыть новый блок;
- исключить guide из sitemap, если проблема индексации;
- отключить schema-компонент;
- отключить recommendation widget;
- отключить BI dashboard route;
- откатить миграцию только если она не backward-compatible и это заранее предусмотрено.

Лучший rollback - не удаление кода, а отключение флага.

## 9. Что можно начинать прямо сейчас

Если Alpha 1.1 сейчас еще не закрыл Stage 1-3 полностью, можно безопасно начать:

- расширение direct answers;
- Article schema для существующего blog;
- trust/NAP audit;
- author/reviewer контентную модель в draft;
- SEO dashboard baseline;
- Merchant feed QA;
- контент-карту гайдов;
- quick-link content для whitelist страниц;
- подготовку feature flag abstraction.

Что отложить:

- AI-рекомендации;
- ко-покупки на основе OrderItem в проде;
- полноценный RAG для гайдов;
- A/B на checkout;
- тяжелые BI-агрегации внутри приложения без очередей.

## 10. Итоговая схема выполнения

Правильная последовательность:

1. Readiness Gate.
2. E4.1 content hub как SEO-first.
3. E4.2 schema/trust/authority.
4. E4.4 analytics baseline.
5. E4.3 recommendations за флагами.
6. E4.5 A/B только после baseline.
7. RAG-связка гайдов после готовности E3.1/E2.6.

Так Stage 4 не ломает Alpha Project V1.1, а наращивает его поверх существующей архитектуры. Опасность появляется только при попытке внедрить все пять эпиков одним релизом или без предварительных Stage 1-3 страховок.
