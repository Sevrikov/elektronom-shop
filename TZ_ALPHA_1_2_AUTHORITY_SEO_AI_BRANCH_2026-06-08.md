# ТЗ Alpha 1.2: отдельная ветвь Authority / SEO / AI без изменения Alpha 1.1 и 1.0

Дата: 2026-06-08
Проект: Elektronom
Версия: Alpha 1.2
Тип работ: отдельная ветвь развития поверх стабильной Alpha 1.1
Связанные документы:

- `TZ_STAGE4_AUTHORITY_2026-06-01.md`
- `TZ_ALPHA_1_1_AI_SEO_OPTIMIZATION_2026-06-07.md`
- `TZ_STAGE4_EXECUTION_PLAYBOOK_ALPHA_1_1_2026-06-07.md`
- `TZ_SEO_TOP10_2026-05-31.md`
- `TZ_GOOGLE_SHOPPING_2026-05-31.md`
- `TZ_ENTERPRISE_ROADMAP_2026-06-01.md`
- `00_INDEX_DOCS_2026-05-31.md`

## 1. Главная установка

Alpha 1.2 создается как отдельная ветвь Authority / SEO / AI. Она не является переписыванием Alpha 1.1 и не должна менять Alpha 1.0.

Alpha 1.0 и Alpha 1.1 считаются стабильными базовыми линиями. Все доработки Stage 4, SEO, AI, контент-хаба, RAG, рекомендаций, BI и A/B культуры выполняются в отдельной ветке Alpha 1.2, с feature flags, миграциями без обратной поломки и возможностью отключить новый функционал без отката всего проекта.

## 2. Цель Alpha 1.2

Создать надстройку авторитета над существующим интернет-магазином:

- экспертный контент-хаб и гайды;
- SEO / AI / GEO усиление;
- RAG-корпус для ассистента;
- Schema-граф и E-E-A-T;
- Merchant / Shopping контроль;
- рекомендации и персонализация;
- BI-аналитика;
- A/B культура;
- мониторинг AI Overviews / AI Mode, где отчеты доступны.

Alpha 1.2 должна повысить органический трафик, доверие, цитируемость, качество рекомендаций и повторные продажи, не ломая текущую коммерческую работу сайта.

## 3. Жесткие границы

### 3.1. Что нельзя

- Нельзя переписывать Alpha 1.1 как часть Alpha 1.2.
- Нельзя менять Alpha 1.0.
- Нельзя внедрять все эпики Stage 4 одним релизом.
- Нельзя трогать checkout/cart/payment без отдельного разрешения и A/B/rollback плана.
- Нельзя менять домен, бренд, URL-структуру стабильных страниц без отдельного SEO-migration плана.
- Нельзя индексировать произвольные фильтры.
- Нельзя добавлять fake FAQ, fake reviews, hidden text, doorway pages.
- Нельзя добавлять schema для контента, которого нет видимо на странице.
- Нельзя делать тяжелые BI-агрегации в render storefront-страниц.
- Нельзя помещать персонализацию в общий кэш `'use cache'`.

### 3.2. Что можно

- Создавать новые компоненты, модели, сервисы и routes для Alpha 1.2.
- Расширять SEO/AI слой через feature flags.
- Добавлять контент-хаб и гайды.
- Добавлять schema только для видимого контента.
- Расширять direct answers и quick-link landings.
- Добавлять read-only BI dashboard.
- Подключать рекомендации поэтапно.
- Подключать RAG-гайды только после готовности очередей и embedding-пайплайна.

## 4. Ветка и стратегия разработки

Рабочая ветка:

```text
codex/alpha-1-2-authority-seo-ai
```

Правила ветки:

- Alpha 1.2 развивается отдельной веткой.
- Alpha 1.1 остается базовой стабильной версией.
- Alpha 1.0 не трогается.
- Все новые функции включаются через feature flags.
- Каждый эпик Stage 4 идет отдельным PR или отдельным блоком работ.
- Любой блок должен иметь rollback через выключение флага.

Минимальные feature flags:

- `alpha12_content_guides_enabled`
- `alpha12_guide_rag_citations_enabled`
- `alpha12_seo_answer_blocks_enabled`
- `alpha12_article_schema_enabled`
- `alpha12_faq_howto_schema_enabled`
- `alpha12_trust_entity_enabled`
- `alpha12_recently_viewed_enabled`
- `alpha12_co_purchase_recommendations_enabled`
- `alpha12_ai_recommendations_enabled`
- `alpha12_bi_dashboard_enabled`
- `alpha12_ab_experiments_enabled`

## 5. Архитектурные правила

В Alpha 1.2 обязательно соблюдать правила проекта:

- Next.js 16: не добавлять `export const revalidate`, `export const dynamic`.
- Не использовать `unstable_cache` и React `cache()`.
- Для серверного кэша использовать `'use cache'`, `cacheLife()`, `cacheTag()`.
- Не создавать `middleware.ts`; routing/auth остаются в `src/proxy.ts`.
- Не добавлять Edge runtime на routes/pages, где используется Prisma.
- Pages оставлять Server Components.
- Интерактив выносить в маленькие leaf Client Components.
- В Prisma всегда использовать `select`.
- Для коллекций всегда использовать `take` / `skip`.
- Не создавать новые Prisma instances; импорт только из `@/lib/prisma`.
- Не использовать `z.string().cuid()` для cuid2 identifiers.
- Не добавлять inline styles; использовать Tailwind CSS v4 через классы и `globals.css`.
- Product mutations должны сохранять Algolia sync.
- LiqPay/webhook body читать как `await req.text()`.

## 6. Обязательные SEO / AI пункты Alpha 1.2

Эти пункты обязательны и входят в Definition of Done Alpha 1.2.

### 6.1. Crawl, Indexing, Snippet Readiness

Задачи:

- Проверить `robots.ts`, sitemap, canonical, hreflang.
- Убедиться, что product/category/guide/quick-link страницы не имеют случайного `noindex`.
- Не использовать `nosnippet` и `max-snippet:0` на целевых страницах.
- Оставить внутренний поиск и произвольные фильтры закрытыми от индексации.
- Подготовить split sitemap design при приближении к лимиту 50 000 URL.

Приемка:

- GSC принимает sitemap.
- Нет массовых дублей фильтров.
- Важные страницы доступны для сниппетов и AI features.

### 6.2. Product Page SEO / AI

Задачи:

- Добавить видимый блок короткого ответа для топовых SKU.
- Добавить "подойдет / не подойдет".
- Добавить FAQ только для реальных частых вопросов.
- Добавить таблицы совместимости.
- Добавить документы: datasheet, инструкция, сертификаты, гарантия, если есть.
- Усилить фото/alt/video для топовых SKU.
- Проверить Product schema: sku, mpn, gtin, brand, offer, price, availability, shipping, return policy, reviews.

Приемка:

- Product schema проходит Rich Results Test.
- Schema соответствует видимому контенту.
- Конверсия product page не ухудшается.

### 6.3. Category и Quick-link Landing Pages

Задачи:

- Расширить direct answers для топовых категорий.
- Для quick-link страниц добавить уникальный intro и self-canonical.
- Индексировать только whitelisted quick links.
- Произвольные фильтры оставить `noindex` и canonical на категорию.
- Добавить внутренние ссылки category -> quick links -> guides -> products.

Приемка:

- Топовые категории имеют AnswerBlock.
- Quick links не создают дублей.
- В sitemap только полезные индексируемые URL.

### 6.4. Content Hub / Guides / AEO / RAG

Задачи:

- Создать или расширить модель `Article` / `Guide` или безопасно переиспользовать существующий контентный слой.
- Ввести draft/published workflow.
- Добавить author/reviewer.
- Добавить AEO-формат: Direct Answer, H2/H3 вопросы, FAQ, таблицы, инструкции, ошибки выбора.
- Добавить Article schema.
- Подготовить публикацию гайда как будущий RAG event.
- После готовности E2.6/E3.1: публикация гайда запускает embedding job.
- Ассистент цитирует только опубликованные и проверенные гайды.

Приемка:

- Гайды индексируются.
- У гайдов есть canonical/hreflang.
- У гайдов есть Article schema.
- RAG-связка включается только через feature flag.

### 6.5. Schema Graph

Задачи:

- Проверить Product, Offer, BreadcrumbList, Organization.
- Добавить Article schema для гайдов.
- Добавить Person/Author schema.
- Добавить FAQPage только для видимого FAQ.
- Добавить HowTo только для реальных пошаговых инструкций.
- Добавить ItemList для категорий, если список товаров виден.
- Проверить Organization/NAP, убрать placeholder-данные.

Приемка:

- Rich Results Test зеленый для sample-набора.
- Нет fake schema.
- Organization данные подтверждены бизнесом.

### 6.6. Merchant / Shopping

Задачи:

- Проверить feed XML.
- Проверить price/availability match.
- Проверить identifiers: brand, MPN, GTIN.
- Проверить shipping и return policy.
- Проверить Google product category.
- Настроить Merchant Center diagnostics monitoring.

Приемка:

- Merchant feed принят.
- Нет критичных item errors.
- Price/availability mismatch ниже целевого порога.

### 6.7. E-E-A-T / Trust / Brand Entity

Задачи:

- Обновить About, Contacts, Delivery, Payment, Return, Warranty.
- Добавить авторов и проверяющих для гайдов.
- Подтвердить NAP.
- Подготовить Google Business Profile.
- Подготовить Wikidata/Knowledge Panel стратегию.
- Добавить реальные sameAs профили.

Приемка:

- Trust pages доступны из футера.
- NAP совпадает на сайте и внешних профилях.
- У экспертных материалов есть author/reviewer.

### 6.8. Image / Video SEO

Задачи:

- Реальные изображения топовых SKU.
- Alt для главных product images.
- Фото маркировки, упаковки, применения.
- Видео обзоры для важных категорий/SKU.
- Рассмотреть image sitemap при росте медиа-канала.

Приемка:

- Главные изображения не имеют пустой alt.
- Медиа не ухудшает LCP.
- Нет layout shift от галереи.

### 6.9. Performance / UX

Задачи:

- Проверить LCP/INP/CLS после добавления SEO-блоков.
- Не блокировать CTA контентом.
- Lazy-load вторичные блоки.
- Не грузить тяжелые рекомендации выше fold.
- Не добавлять inline styles.

Приемка:

- Product/category UX не ухудшен.
- Add to cart и checkout работают как раньше.
- SEO-контент не ломает путь покупки.

### 6.10. Analytics / AI Visibility

Задачи:

- GSC baseline.
- GA4 события: product_view, category_view, add_to_cart, begin_checkout, purchase.
- Guide to product clicks.
- FAQ expand.
- Recommendation click.
- Merchant diagnostics.
- Gen AI reports в GSC, если доступны: AI Overviews, AI Mode, Discover.

Приемка:

- Есть monthly SEO / AI / Merchant dashboard.
- Есть baseline до включения Alpha 1.2 флагов.
- A/B решения принимаются по данным.

### 6.11. `llms.txt`

Задачи:

- Поддерживать `public/llms.txt` актуальным.
- Не считать его главным SEO-фактором.
- Не заменять им sitemap/schema/HTML.
- Добавить только важные ссылки: categories, guides, policies, sitemap.

Приемка:

- Нет staging/закрытых URL.
- Нет промо-текста без подтверждения на сайте.

### 6.12. Off-site / Links / Brand Mentions

Задачи:

- Партнерские упоминания.
- Профильные статьи.
- Локальные бизнес-каталоги.
- Брендовые linkless mentions.
- Digital PR.
- Не использовать PBN, массовые покупные ссылки, автоматические прогоны.

Приемка:

- Ссылочный профиль выглядит естественно.
- Брендовые запросы растут.

## 7. Stage 4 эпики в Alpha 1.2

### E4.1 Content Hub / Guides

Стартовый эпик Alpha 1.2. Можно делать до полной AI-интеграции, если RAG-функции выключены флагом.

Результат:

- published guides;
- Article schema;
- author/reviewer;
- AEO-формат;
- internal linking;
- RAG-ready структура.

### E4.2 SEO Authority

Выполняется параллельно E4.1.

Результат:

- schema graph;
- E-E-A-T;
- trust pages;
- brand entity;
- local SEO;
- Merchant/Rich Results validation;
- AI citation readiness.

### E4.3 Recommendations / Personalization

Выполняется после analytics baseline.

Результат:

- recently viewed;
- same series / similar products;
- co-purchase recommendations from `OrderItem`;
- AI recommendations from product embeddings;
- all recommendation widgets behind flags.

### E4.4 BI Analytics

Выполняется до E4.3 и E4.5 как измерительный фундамент.

Результат:

- SEO/Merchant dashboard;
- GA4 funnels;
- margin, velocity, dead stock, ABC;
- supplier efficiency;
- тяжелые расчеты только через jobs/exports.

### E4.5 A/B Culture

Запускается последним.

Результат:

- feature flag abstraction;
- experiment registry;
- controlled experiments;
- no checkout experiments without separate approval;
- decisions by data, not taste.

## 8. Порядок релиза Alpha 1.2

### Release 1.2.0: Foundation

- feature flags;
- analytics baseline;
- schema audit;
- robots/sitemap/canonical audit;
- Merchant feed QA;
- trust/NAP audit.

### Release 1.2.1: Content and SEO

- content hub MVP;
- Article schema;
- author/reviewer;
- top guides;
- direct answers for top categories;
- quick-link content.

### Release 1.2.2: RAG-ready Guides

- guide embedding pipeline behind flag;
- published-only citations;
- assistant source citations;
- fallback if RAG unavailable.

### Release 1.2.3: BI

- read-only BI dashboard;
- SEO/AI/Merchant reporting;
- product velocity, margin, dead stock;
- supplier efficiency.

### Release 1.2.4: Recommendations

- recently viewed;
- same series / similar;
- co-purchase snapshots;
- AI recommendations behind flag.

### Release 1.2.5: A/B Culture

- experiments platform;
- experiment registry;
- first low-risk experiments;
- rollback process.

## 9. Контроль, чтобы не затронуть 1.1 и 1.0

Перед каждым merge в Alpha 1.2:

- проверить, что изменения не требуют деплоя в 1.1;
- проверить, что 1.0 не изменяется;
- проверить feature flags default off для рискованных блоков;
- проверить backward-compatible миграции;
- проверить отсутствие изменения checkout/payment/cart без отдельного решения;
- проверить sitemap не включает draft/experiment pages;
- проверить build/lint/typecheck;
- проверить smoke flow: home, category, product, cart, checkout.

## 10. Definition of Done Alpha 1.2

Alpha 1.2 считается выполненной, если:

- 1.0 и 1.1 не переписаны и не нарушены;
- все новые risky features за feature flags;
- content hub публикует проверенные гайды;
- guide pages индексируются и имеют Article schema;
- schema graph расширен без fake markup;
- direct answers покрывают топовые категории;
- quick links индексируются только по whitelist;
- Product schema и Merchant feed валидны;
- trust/NAP/author/reviewer слой подтвержден;
- SEO/AI/Merchant dashboard работает;
- рекомендации работают через snapshots/fallback и не тормозят PDP;
- A/B эксперименты запускаются только после baseline;
- rollback возможен выключением флагов;
- `npm run lint`, `npx tsc --noEmit`, `npm run build` проходят перед релизом.

## 11. Итог

Alpha 1.2 - это отдельная ветвь авторитета, а не перепись Alpha 1.1. Она должна развивать сайт как экспертный e-commerce: гайды, RAG, SEO/AI цитируемость, Merchant, trust, рекомендации, BI и A/B. Стабильные Alpha 1.0 и Alpha 1.1 остаются нетронутыми, а все новые возможности включаются поэтапно, измеримо и обратимо.
