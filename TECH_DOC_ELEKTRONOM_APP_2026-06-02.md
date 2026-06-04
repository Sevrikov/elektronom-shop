# Elektronom — техническая документация приложения

Дата: 2026-06-02  
Проект: `C:\Users\sevri\Сайт\elektronom`  
Статус документа: актуальный паспорт текущего приложения по состоянию кода и последних ревью.

## 1. Назначение продукта

Elektronom — многостраничный интернет-магазин электротехнических товаров, автохимии и сопутствующего оборудования с уклоном в технический подбор. Проект уже выходит за рамки обычного каталога: в нем есть storefront, админка, реактивные фильтры, AI-помощник, инженерные калькуляторы, NormGuard, зачатки RAG-памяти и Google Shopping/Merchant-инфраструктура.

Целевой вектор:

- B2C: быстрый поиск, фильтры, карточки товара, корзина, оформление заказа.
- B2B: прайс-запросы, подбор комплектов, счет с НДС, работа с проектами.
- Engineering commerce: расчет схем, подбор совместимых компонентов, предупреждения по нормам, BOM и добавление комплекта в корзину.
- SEO/Shopping: органический трафик, Merchant feed, структурированные данные.

## 2. Технологический стек

| Слой | Технологии |
| --- | --- |
| Frontend / SSR | Next.js 16.2.3 App Router, React 19.2.4, React Compiler |
| Стили | Tailwind CSS v4 через `src/app/globals.css`, без `tailwind.config.ts` |
| UI | собственные компоненты, Base UI, lucide-react, shadcn scaffold |
| i18n | `next-intl`, локали `uk` и `ru` |
| Backend | Server Components, Server Actions, Route Handlers |
| DB | PostgreSQL, Prisma 7.8, `@prisma/adapter-pg` |
| Auth | NextAuth v5 beta + Prisma adapter |
| Search | Algolia v5 |
| Media | Cloudinary + local development fallback |
| AI | Claude/Anthropic API через `src/lib/assistant/claude.ts` |
| Email | Resend |
| Validation | Zod v4 |
| State | Zustand, локальные client-state hooks |
| Docs/analysis | Reversa SDD, review/TZ markdown corpus |

Критичные проектные правила зафиксированы в `AGENTS.md`:

- не использовать `middleware.ts`, маршрутизация/auth guard через `src/proxy.ts`;
- не использовать route config `dynamic`/`revalidate`;
- кэшировать server queries через `'use cache'`, `cacheLife()`, `cacheTag()`;
- все мутации делать через Server Actions;
- Prisma-запросы коллекций должны иметь `take`/`skip`, а выборки — `select`;
- не использовать `z.string().cuid()`, потому что БД использует `cuid2`;
- не использовать inline styles в JSX, стили через Tailwind v4 tokens.

## 3. Структура приложения

Ключевые директории:

```text
src/app/                 App Router, страницы, route handlers, sitemap/robots/feed
src/actions/             Server Actions для мутаций
src/queries/             Server queries с cacheLife/cacheTag
src/components/          UI и доменные компоненты
src/lib/                 доменная логика, env, auth, storage, AI, engineering
src/store/               Zustand stores
src/i18n/messages/       uk/ru JSON-переводы
prisma/schema.prisma     модели БД
scripts/                 тесты и сервисные скрипты
tools/                   локальные инструменты, например image-bg-removal
_reversa_sdd/            SDD-документация после reverse analysis
delivery/                visual QA, прототипы, результаты доставки
```

## 4. Маршруты и страницы

Основные App Router маршруты:

| Маршрут | Назначение |
| --- | --- |
| `/[locale]` | главная страница, hero carousel, категории, подборки товаров |
| `/[locale]/catalog` | каталог-хаб |
| `/[locale]/catalog/[slug]` | категория с фильтрами, фасетами, сортировкой, grid/list |
| `/[locale]/product/[slug]` | карточка товара Concept 6, галерея, характеристики, отзывы, серия, сопутствующие |
| `/[locale]/search` | поиск |
| `/[locale]/cart` | корзина |
| `/[locale]/checkout` | оформление заказа |
| `/[locale]/order-success` | успешный заказ |
| `/[locale]/brands`, `/brands/[slug]` | бренды |
| `/[locale]/blog`, `/blog/[slug]` | контентные страницы |
| `/[locale]/login`, `/register` | auth |
| `/[locale]/profile`, `/orders`, `/wishlist` | личный кабинет |
| `/[locale]/admin` | админ-панель |
| `/[locale]/assistant` | полноэкранный AI-помощник |
| `/[locale]/calculators` | инженерный workspace/calculators |
| `/api/assistant/chat` | AI chat endpoint |
| `/api/admin/upload` | загрузка/удаление медиа |
| `/feed/[locale]` | merchant/product feed |

## 5. Доменные модули

### 5.1 Storefront

Основные компоненты:

- `src/components/layout/header.tsx`, `mobile-nav.tsx`, `catalog-mega-menu-client.tsx`;
- `src/components/home/hero-carousel.tsx`, `product-carousel.tsx`, `categories-section.tsx`;
- `src/components/catalog/*` — фильтры, toolbar, active chips, price range, mobile drawer, product grid;
- `src/components/product/*` — карточка товара, галерея, schema.org, отзывы, похожие/серийные товары;
- `src/components/cart/*` — корзина, drawer, add-to-cart.

Текущее состояние:

- Главная имеет интерактивную промо-карусель.
- Категория реализована в стиле marketplace: дерево категорий, фильтры, быстрые SEO-сценарии, сортировка, grid/list, mobile drawer.
- Реактивные фасеты считают доступность вариантов с учетом выбранных фильтров, а недоступные варианты disabled.
- На фильтре цены есть гистограмма и доступный ценовой коридор.
- Карточки товара переиспользуют общий `ProductCard`, а не отдельную несовместимую верстку.

Ограничение:

- Фасеты сейчас имеют MVP-ограничения масштабирования. Для enterprise-объема рекомендуется переносить тяжелые агрегации в SQL/Algolia/Meilisearch.

### 5.2 Product page

Карточка товара переработана под Concept 6:

- 3-колоночный hero layout: галерея, товарные данные, trust sidebar;
- quantity stepper;
- характеристики с dotted separators;
- полноэкранная lightbox-галерея;
- блоки: характеристики, описание, отзывы, товары серии, сопутствующие товары;
- JSON-LD Product/Breadcrumb schema.

Ограничения:

- Данные отзывов и части блоков еще требуют production-модели модерации/реальных данных.
- Источники изображений должны постепенно уходить от placeholder/mock к Cloudinary/каталожным ассетам.

### 5.3 Админка

Админка находится в `/[locale]/admin`.

Реализованные зоны:

- overview;
- orders;
- products;
- reviews;
- categories;
- brands.

Product admin module:

- KPI strip: всего товаров, без фото, без цены, без бренда, без описаний, featured;
- фильтры: поиск, категория, бренд, stock, status, quality checklist, featured;
- таблица товаров с inline stock editing;
- bulk actions: publish/hide/sync/move/export;
- modal edit/create с вкладками general/descriptions/prices/stock/media/attributes;
- Cloudinary/local upload через `image-uploader.tsx`;
- AI content factory modals: `product-ai-factory-modal.tsx`, `product-ai-factory-result-modal.tsx`.

Текущее качество:

- Есть отдельный acceptance report по product admin.
- Нужно продолжить развитие orders/CRM/logistics/payment/admin audit.

### 5.4 Корзина и заказы

Модели:

- `CartItem`;
- `Order`;
- `OrderItem`;
- `OrderCounter`;
- snapshots в заказах.

Особенности:

- Server Actions в `src/actions/cart.ts` и `src/actions/order.ts`;
- защита от отрицательного стока должна делаться через `updateMany` с `stock >= quantity`;
- добавлен `addMultipleToCart` для инженерных BOM-комплектов.

Ограничения:

- Онлайн-оплата и реальные интеграции доставки еще не доведены до production.
- Нужны Nova Poshta/Ukrposhta, платежный провайдер, webhooks, RMA.

### 5.5 AI-помощник

Компоненты:

- `assistant-widget.tsx` — плавающий виджет;
- `assistant-panel.tsx` — основной чат/workspace;
- `assistant-character.tsx` — анимированный персонаж;
- `assistant-draft-order.tsx` — живой черновик заказа;
- `assistant-order-comparison.tsx` — сравнение замены товаров;
- `assistant-message.tsx`, `assistant-product-card.tsx`.

Backend:

- `/api/assistant/chat/route.ts`;
- `src/lib/assistant/claude.ts`;
- `src/lib/assistant/prompts.ts`;
- `src/lib/assistant/prompts/engineering.ts`;
- `AssistantSession`, `AssistantMessage` в Prisma.

Возможности:

- чат;
- голосовой ввод/озвучка через Web Speech API;
- draft order;
- comparison panel;
- engineering scenario через `sessionStorage` и параметр `scenario=engineering`.

Ограничения:

- RAG пока не полноценный production vector search.
- AI не должен обходить NormGuard. Детерминированные safety-блокировки имеют приоритет.
- Нужно развести mock/preview citations и реальные источники TechnicalDocument.

### 5.6 Инженерный модуль

Ключевые файлы:

```text
src/components/engineering/engineering-workspace.tsx
src/lib/engineering/calculators.ts
src/lib/engineering/validation.ts
src/lib/engineering/graph.ts
src/lib/engineering/graph-validation.ts
src/lib/engineering/normguard/*
src/lib/engineering/catalog-binding.ts
src/lib/engineering/bom.ts
src/actions/engineering.ts
scripts/test-engineering.ts
```

Текущее состояние:

- есть custom loads CRUD в workspace;
- есть `EngineeringGraph` как JSON-модель схемы;
- есть `NormGuard v2 Registry`;
- реализованы правила:
  - wet zone RCD;
  - ATS neutral switching;
  - cable-breaker compatibility;
  - Al/Cu compatibility;
  - terminal compatibility;
  - voltage drop;
  - panel capacity/reserve;
- есть BOM/totals расчет;
- есть catalog binding and compatibility scoring;
- есть связка engineering context -> AI assistant.

Открытый статус:

- Phase 2A принята после hardening.
- Phase 2B `findCompatibleProducts` требует безопасной DB-test изоляции. Последний recheck: `npm run test:engineering` падал из-за DB write permissions (`EACCES`) при попытке сидить данные в текущую БД. До исправления нельзя считать DB-backed compatible-products action полностью принятым.
- Phase 2C Scheme Builder UI еще предстоит.
- Отдельный важный gap: пока нет полноценного поля чертежа проекта. Сейчас инженерный модуль умеет работать с расчетами, custom loads, graph-моделью, NormGuard и BOM, но пользователю не предоставлен рабочий canvas/лист проекта, где можно размещать электротехнические элементы, соединять их линиями, видеть схему щита/линий/потребителей и сохранять чертеж как проект.

### 5.7 SEO / Merchant / Google Shopping

Файлы:

- `src/app/sitemap.ts`;
- `src/app/robots.ts`;
- `src/app/feed/[locale]/route.ts`;
- `src/lib/merchant/feed-builder.ts`;
- `src/lib/merchant/taxonomy.ts`;
- `src/lib/validations/product-feed.ts`;
- `src/components/product/product-schema.tsx`.

Текущее состояние:

- есть Merchant feed infrastructure;
- добавлены Google Shopping поля в `Product`;
- есть canonical/alternate/schema работа после Sprint 1;
- есть отдельные TZ по SEO, Shopping и round2 fixes.

Ограничения:

- Требуются production QA после каждого деплоя: canonical, hreflang, sitemap, feed validation, structured data.
- Нужен мониторинг Merchant Center ошибок.

### 5.8 Медиа и изображения

Media stack:

- Cloudinary production;
- local fallback в `public/uploads` для development;
- `src/lib/storage.ts`;
- `src/lib/images.ts`;
- `/api/admin/upload`.

Дополнительный tool:

- `tools/image-bg-removal` — гибридная очистка фона: BFS/NumPy + optional neural fallback (`rembg` отдельно).

Ограничения:

- Media delete должен оставаться DB-first, storage cleanup best-effort.
- Нужен контроль orphan files и audit log.

## 6. Модель данных

Ключевые домены Prisma:

| Домен | Модели |
| --- | --- |
| Auth | `User`, `Account`, `Session`, `VerificationToken` |
| User data | `Address` |
| Catalog | `Category`, `CategoryTranslation`, `Brand`, `Product`, `ProductTranslation`, `ProductImage` |
| Commerce | `CartItem`, `Order`, `OrderItem`, `OrderCounter` |
| Social | `Review`, `WishlistItem` |
| Assistant/RAG | `TechnicalDocument`, `DocumentChunk`, `AssistantSession`, `AssistantMessage` |

Особенности:

- `Product.attributes` — JSONB-центр для динамических характеристик, фасетов и engineering metadata.
- Google Shopping fields добавлены в `Product`: `gtin`, `mpn`, `condition`, `googleProductCategory`, `itemGroupId`, `salePrice`, dates.
- `DocumentChunk.embedding` сейчас хранится как JSON-serialized string, а не native vector. Для production RAG нужен pgvector/отдельный vector store.

## 7. Кэширование и data fetching

Архитектурное правило:

- Server queries в `src/queries/*`;
- мутации в `src/actions/*`;
- cached queries используют `'use cache'`, `cacheLife()`, `cacheTag()`;
- после мутаций делать `revalidateTag(...)` для связанных тегов;
- не использовать `unstable_cache` или React `cache()`.

Критичные cache tags:

- products;
- categories;
- cart/order-related tags, если добавлены;
- search/Algolia sync после product mutations.

## 8. Интеграции

| Интеграция | Статус |
| --- | --- |
| Cloudinary | реализовано для product images |
| Algolia | используется для search/index sync, требует строгого невыноса admin key на клиент |
| Claude/Anthropic | AI assistant backend |
| Resend | email layer |
| NextAuth OAuth | Google/Facebook optional |
| Google Shopping feed | инфраструктура есть |
| Payments | env предусмотрен, production integration не закрыт |
| Nova Poshta/Ukrposhta | planned |
| BigQuery/GA4 BI | planned |
| Content Factory | planned/partially scaffolded через admin AI factory modals |

## 9. Команды разработки

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
npm run test
npm run test:jsonb
npm run test:engineering
npm run db:generate
npm run db:migrate
npm run db:seed
```

Важно:

- `npm run test:engineering` сейчас содержит DB-backed часть. Ее нужно изолировать через `TEST_DATABASE_URL` или explicit flag до того, как считать обычный test run безопасным.

## 10. Качество и текущие риски

Главные риски:

1. Нет полноценного CI gate на все проверки и e2e.
2. DB-backed тесты могут пытаться писать в текущую БД.
3. Инженерный модуль имеет сильное ядро, но еще без удобного поля чертежа проекта: canvas/scheme builder UI, библиотека элементов, связи, слои, сохранение/экспорт схемы.
4. RAG пока не production-grade.
5. Payment/logistics не закрыты.
6. Старые MD/комментарии местами отображаются с mojibake в консоли; новые документы и UI-строки нужно держать UTF-8/i18n-safe.
7. In-memory facets и части поиска требуют масштабирования.

## 11. Текущий уровень зрелости

Оценка:

- архитектура: сильная MVP+/pre-enterprise база;
- storefront/catalog: близко к production MVP, требует polish и QA;
- product/admin: сильная база, нужно расширять CRM/orders/logistics;
- engineering/AI: стратегически самый ценный ров, но требует отдельной дисциплины тестов, источников норм и UX;
- operations: нужно усилить CI, мониторинг, test isolation, security audit.

Короткий вывод: проект не нужно переписывать. Его нужно стабилизировать, связать инженерный модуль с реальным каталогом и довести коммерческую инфраструктуру до production.
