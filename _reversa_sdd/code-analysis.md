# Анализ кода — Elektronom

> Артефакт агента **Archaeologist** (Фаза 2) · Reversa · `doc_level=completo` · Язык: Русский
> Консолидированный технический разбор по модулям. Уверенность: 🟢 подтверждено · 🟡 выведено · 🔴 пробел.
> Связанные артефакты: [data-dictionary.md](data-dictionary.md) · [flowcharts/](flowcharts/) · [inventory.md](inventory.md)

**Прогресс по модулям:** `catalog` ✅ · `product` ✅ · `cart-checkout-orders` ✅ · `auth-account` ✅ · `assistant` ✅ · `search` ✅ · `admin` ✅ · `suppliers` ✅ · `core-infra` ✅ — **Фаза 2 завершена**

---

## Модуль: `catalog` 🟢

**Назначение:** просмотр каталога — дерево категорий, страница категории с динамическими фасетными фильтрами и реактивными счётчиками, листинг товаров, бренды. Ядро магазина (электрика и автотовары: автоматы, розетки, кабель, масла, АКБ, LED).

**Ключевые файлы:**
- `src/queries/products.ts` — Prisma-запросы товаров, **SQL-фильтрация по JSONB**, facet-where
- `src/queries/categories.ts` — категории, дерево, **in-memory расчёт фасетов**
- `src/queries/brands.ts` — бренды
- `src/lib/catalog-filter-url.ts` — сериализация фильтров ↔ URL
- `src/lib/catalog-filter-config.ts` — per-category конфиг фильтров (порядок, лейблы, единицы, quickLinks)
- `src/lib/catalog-data.ts` — определения фильтров + **mock-каталог** (24 товара) + хелперы
- `src/lib/catalog-tree.ts`, `src/lib/catalog-hub-data.ts`, `src/config/catalog-mega-menu.ts` — навигация/мегаменю
- `src/components/catalog/*` (14 компонентов) — UI фильтров, листинга, пагинации
- Страницы: `(shop)/catalog`, `(shop)/catalog/[slug]`, `(shop)/brands`, `(shop)/brands/[slug]`

### 1. Поток управления

**Тип:** `ActiveFilters` (`@/types`) — `{ brand?: string[]; priceMin?; priceMax?; inStock?; sort?; page?; [attrKey]: string[] }`. Зарезервированные ключи (`brand/priceMin/priceMax/inStock/sort/page`) отделены от динамических атрибутов.

**URL ↔ State** (`catalog-filter-url.ts`):
- `parseCatalogSearchParams(sp)` 🟢 — парсит searchParams: brand comma-separated multi; price→Number с валидацией; `inStock` принимает `'1'`/`'true'`; page — положительный int; sort — белый список (`popular|price-asc|price-desc|new|rating`); всё остальное → динамические атрибуты (comma-separated). **Нормализация:** если `priceMin>priceMax` — меняет местами (`products.ts` строки 46–52).
- `buildCatalogHref(pathname, filters)` 🟢 — обратная сериализация в **канонический** стабильный порядок параметров (для одинаковых URL → кэш/SEO).
- `toggleMultiValueFilter` / `removeFilter` / `clearFiltersPreserveSort` 🟢 — мутации; **каждое изменение фильтра сбрасывает `page`** (строка 134).

### 2. Алгоритмы и логика

**(A) SQL-фильтрация товаров** — `buildProductWhere` + `buildAttributeWhere` (`products.ts`):
- JSONB-фильтр: **AND между разными ключами, OR внутри одного ключа**.
- Для каждого значения генерирует до 4 условий: `equals`/`array_contains` × (строка + число, если `Number(val)` валиден) (+ boolean для `'true'/'false'`). 🟡 **Риск производительности:** при множестве выбранных значений получается большой OR-блок; полагается на GIN-индекс.
- `excludeFacetKey` — исключение одной группы из WHERE (для счётчиков «как если бы этот фасет не был выбран»).

**(B) In-memory расчёт фасетов** — `getCategoryFacets` (`categories.ts`):
- Загружает товары категории через `getCategoryProductsForFacets` — **`take: 50000`** 🔴 (явно помечено как MVP-лимит; рекомендации в комментарии: `$queryRaw` + `jsonb_each_text` или вынос в Algolia).
- `matchProduct(p, excludeKey?)` — зеркалит SQL-логику в JS: inStock, price-диапазон, brand (OR), атрибуты (AND-keys/OR-values).
- **Реактивные счётчики:** для каждой опции бренда/атрибута считает count, применяя все фильтры КРОМЕ своей группы (`matchProduct(p, key)`).
- **Диапазоны цен:** absolute (по всем) + available (по отфильтрованным без price) + **32 бакета** гистограммы (строки 335–349).
- `disabled = count===0 && !selected` — опция гасится, но выбранная остаётся видимой (можно снять).
- Сортировка: `localeCompare(locale, {numeric:true})` — корректный числовой порядок («2.5» < «10»).

### 3. Структуры данных
`CategoryFacets` = `{ total, price:{absoluteMin/Max, availableMin/Max, selectedMin/Max, buckets[32]}, brands:FacetOption[], attributes:Record<key,FacetOption[]> }`. `FacetOption` = `{ value, label, count, selected, disabled, logo? }`. `FilterDefinition` = `{ key, type:'checkbox'|'pill'|'range', label:{uk,ru}, options?, searchable? }`.

### 4. Кэширование (Next.js 16 `'use cache'`)
- `getCategories`/`getCategoryTree`/`getCategoryBySlug` — `cacheLife("hours")`, tag `categories`.
- `getCategoryProductsForFacets` — `cacheLife("minutes")`, tag `category-products-facets-{slug}` + `products`.
- `getProductBySlug` — `cacheLife("seconds")`, tag `product-{slug}`.
- `getFilteredProducts` — **НЕ кэшируется** (динамика по URL).
- Гранулярная инвалидация по тегам (см. модуль admin — `revalidateTag`).

### Находки и риски модуля catalog
| # | Уровень | Находка |
|---|---------|---------|
| C-1 | 🔴 | `getCategoryProductsForFacets` грузит до 50 000 товаров в память на каждый расчёт фасетов — узкое место при росте каталога. |
| C-2 | 🟡 | **Две независимые реализации фасет-логики** (SQL в `products.ts` vs in-memory в `categories.ts`) должны оставаться синхронными — риск расхождения счётчиков и выдачи. |
| C-3 | 🟡 | **Дублирование конфигурации фильтров:** `categoryFilters` (`catalog-data.ts`) и `categoryFilterConfig` (`catalog-filter-config.ts`) описывают фильтры категорий по-разному. Единый источник истины отсутствует. |
| C-4 | 🔴 | `qtyBreaks` (оптовые цены) в mock-данных, но нет в схеме Product. |
| C-5 | 🟡 | Mock-массив `catalogProducts` (24 товара) живёт рядом с реальными Prisma-запросами — легаси MVP; нужно убедиться, что прод не использует его. |
| C-6 | 🟡 | Типобезопасность JSONB `attributes` только на уровне приложения; числа/строки в значениях смешиваются (в SQL coercion есть, в in-memory — `String()`), что и порождает риск C-2. |

**Сложность модуля:** высокая (фасетная система — самая сложная логика проекта).

---

## Модуль: `product` 🟢

**Назначение:** карточка товара — галерея, характеристики, цена/скидка/наличие, оптовые цены (qty breaks), отзывы с премодерацией, похожие товары и «та же серия», SEO (JSON-LD, hreflang).

**Ключевые файлы:**
- `src/app/[locale]/(shop)/product/[slug]/page.tsx` — серверная страница (426 строк, композиция данных)
- `src/queries/products.ts` — `getProductBySlug`, `getSimilarProducts`, `getSameSeriesProducts`
- `src/actions/user.ts` — `submitProductReview` (серверное действие)
- `src/components/product/*` — `product-gallery`, `product-attributes`, `product-reviews` (20 КБ), `product-schema` (JSON-LD), `same-series-products`, `similar-products`, `related-products-section`, `product-card`

### 1. Поток управления / рендеринг
- **ISR:** `generateStaticParams` пре-рендерит топ-1000 товаров (по `updatedAt`) × 2 локали = **~2000 страниц** на сборке (строки 30–41) 🟡 — учитывать время сборки при росте.
- `getProductBySlug` (`'use cache'`, `cacheLife('seconds')`) грузит товар + переводы(locale) + изображения + бренд + категорию + видимые отзывы (take 10).
- `generateMetadata`: canonical + **hreflang** (uk/ru/x-default) + OpenGraph (строки 65–84) 🟢 — корректная мультиязычная SEO-разметка.
- `auth()` → `currentUser` прокидывается в форму отзывов.

### 2. Бизнес-логика
- **Цена/скидка:** `getDiscountPercent(price, comparePrice)`; `comparePrice` показывается только если `> price`. `Decimal` → `Number(product.price.toString())`.
- **Наличие:** `inStock = stock > 0`; лейбл локализован.
- **Qty breaks (опт):** читаются из `attributes.qty_breaks` как `{min, discount}[]` (строки 175–183), исключаются из отображаемых характеристик. Таблица считает `basePrice * (1 - discount/100)`.
- **Отзывы — `submitProductReview` (`actions/user.ts:216`)** 🟢:
  - auth обязателен; zod: rating int 1–5, comment 1–1000, advantages/disadvantages ≤500.
  - **1 отзыв на пользователя+товар** (проверка `findUnique productId_userId`).
  - **`verifiedPurchase`** = есть ли у юзера заказ со статусом `DELIVERED`, содержащий товар.
  - **`isVisible: false`** при создании → **премодерация** (показ только после одобрения админом).

### 3. Структуры данных
Использует `Product` (+`images`, `translations`, `reviews`, `brand`, `category`). Отзыв на форме: `{productId, rating, comment, advantages?, disadvantages?}`. `qty_breaks` в JSONB: `{min:number, discount:number}`.

### Находки и риски модуля product
| # | Уровень | Находка |
|---|---------|---------|
| P-1 | 🔴 | **Описание рендерится через `dangerouslySetInnerHTML`** (page.tsx:390). Если HTML описания приходит из админки/импорта без санитайза — XSS. Требуется проверка очистки на входе (см. admin/Detective). |
| P-2 | 🟡 | **Несогласованность qty breaks:** реальный код — `attributes.qty_breaks` `{min, discount%}`; mock `catalog-data.ts` — `qtyBreaks` `{minQty, unitPrice}`. Уточняет C-4: две разные модели опт-цен. |
| P-3 | 🟢 | Премодерация отзывов (`isVisible=false`) + автоматический `verifiedPurchase` по DELIVERED-заказу — добротная логика доверия. |
| P-4 | 🟡 | `generateStaticParams` пре-рендерит ~2000 страниц на билде — рост каталога удлинит сборку (рассмотреть on-demand ISR). |
| P-5 | 🟡 | Бренд `Electronom` в title/OG (page.tsx:66,77), при этом домен/логотип — `Elektronom`. Разнобой в написании бренда. |

**Сложность модуля:** средняя (логика отзывов + SEO + композиция).

---

## Модуль: `cart-checkout-orders` 🟢 ⭐ (транзакционное ядро)

**Назначение:** корзина (гость/авторизованный), оформление заказа, заказы пользователя. Самая ответственная за консистентность часть.

**Ключевые файлы:** `src/actions/cart.ts`, `src/actions/order.ts`, `src/queries/orders.ts`, `src/store/cart-store.ts`, `src/hooks/use-cart.ts`, `src/components/cart/*`, страницы `(shop)/cart`, `(shop)/checkout`, `(shop)/order-success`, `(account)/orders[/[number]]`.

### 1. Архитектура корзины (двухрежимная) 🟢
- **Гость:** httpOnly-cookie `cart` (`sameSite=lax`, 30 дней, JSON `[{productId, quantity}]`), валидируется при чтении.
- **Авторизованный:** таблица `CartItem` в БД.
- **`mergeCartIfNeeded(userId)`** — при первом обращении авторизованного сливает cookie-корзину в БД: `qty = min(existing+new, stock, 99)`, затем удаляет cookie. Вызывается в `getCart`/`getCartCount`/`addToCart`.
- **Zustand `useCartUIStore`** — ТОЛЬКО UI: `isDrawerOpen` + `cartVersion` (счётчик для триггера ре-фетча). **Не** хранит данные корзины (источник истины — сервер). 🟢 чистое разделение.
- Везде клэмпинг количества: `≤ min(stock, 99)`; `getCart` ограничивает отображаемое qty остатком.
- Все мутации → `revalidateTag('cart','max')`. Валидация zod (qty 1–99; update допускает 0 → удаление).

### 2. Оформление заказа — `createOrder` (`order.ts:55`) ⭐
Поток (см. flowchart):
1. **Идемпотентность:** если передан `idempotencyKey` и заказ с ним есть → вернуть существующий `number` (защита от двойного сабмита). 🟢
2. Источник позиций: авторизованный → `CartItem` (take 50); гость → cookie.
3. Валидация наличия: загрузка `isActive` товаров; при несовпадении кол-ва → «Деякі товари більше не доступні».
4. **Атомарная транзакция `$transaction`:**
   - **Гонко-безопасное списание стока:** `updateMany where {id, stock>=qty} decrement` → если `count===0` → throw «Недостатньо товару» (условный апдейт = оптимистичная блокировка, не даёт уйти в минус). 🟢🟢
   - **Номер заказа:** `orderCounter.upsert({year})` increment → `ORD-YYYY-NNNNN` (pad 5). Внутри транзакции → без коллизий. 🟢
   - Создание `Order` + `OrderItem[]` со **снапшотами** (`customerData`, `snapshot`).
   - Очистка DB-корзины внутри транзакции (атомарно).
5. Очистка cookie-корзины (гость) вне транзакции; cookie `last_created_order` (5 мин, httpOnly) для страницы успеха.

### 3. Запросы заказов (`queries/orders.ts`) — без кэша (персональные данные) 🟢
- `getOrderByNumber(number, userId)` — грузит заказ, затем **проверка владения** в `.then()`: `order.userId !== userId → null`.
- `getUserOrders(userId, page)` — пагинация по 10.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| O-1 | 🟢 | Идемпотентность заказа по `idempotencyKey`. |
| O-2 | 🟢 | Гонко-безопасное списание стока (условный `updateMany`, throw при недостатке) — предотвращает отрицательный остаток и oversell. |
| O-3 | 🟢 | Коллизийно-безопасная нумерация через `OrderCounter.upsert` внутри транзакции. |
| O-4 | 🟡 | **`shipping=0`, `discount=0` захардкожены** — нет расчёта доставки и промокодов. |
| O-5 | 🟡 | **`addressId` не привязывается** при создании заказа (используется только `customerData`-снапшот) → `Order.address` всегда null, хотя выборка его запрашивает. |
| O-6 | 🟡 | **Видимость гостевых заказов ограничена:** `getOrderByNumber` требует совпадения `userId`; у гостя `userId=null` → доступ только по 5-мин cookie. Нет «гостевого трекинга по номеру+email». |
| O-7 | 🟡 | **Дублирование `getUserOrders`** — в `actions/order.ts` (без пагинации) и `queries/orders.ts` (с пагинацией). Риск рассинхрона. |
| O-8 | 🟡 | Платёжный провайдер (`PAYMENT_*`) в потоке `createOrder` не задействован — `paymentStatus` остаётся PENDING; онлайн-оплата (`CARD_ONLINE`) не инициируется здесь (см. интеграции). |

**Сложность модуля:** высокая (конкурентность, транзакции, идемпотентность).

---

## Модуль: `auth-account` 🟢

**Назначение:** аутентификация (credentials + OAuth), RBAC, профиль, смена пароля, список желаний. Адреса — частично.

**Ключевые файлы:** `src/lib/auth.ts` (конфиг NextAuth v5), `src/actions/auth.ts` (регистрация), `src/actions/user.ts` (профиль/пароль/wishlist/отзыв), `src/app/api/auth/[...nextauth]/route.ts`, страницы `(auth)/login`, `(auth)/register`, `(account)/profile|orders|wishlist`.

### 1. NextAuth v5 (`lib/auth.ts`) 🟢
- **Адаптер:** `PrismaAdapter`; **стратегия сессии: JWT**.
- **Провайдеры:** Google + Facebook (подключаются только при наличии env-ключей) + **Credentials** (email/password, zod email + password ≥6, `bcryptjs.compare`).
- **Callbacks:** `jwt` кладёт `id`+`role` в токен; `session` пробрасывает их в `session.user`.
- **RBAC-хелперы:** `requireAuth()` (throw `UNAUTHORIZED`), `requireAdmin()` (role ADMIN), `requireManager()` (ADMIN|MANAGER).
- **pages:** `signIn`/`error` → `/uk/login`.

### 2. Действия аккаунта
- `registerUser` (`actions/auth.ts`): zod (name/email/password≥6), проверка существующего email, `bcryptjs.hash(…,10)`, создание User. 🟢
- `updateProfile`: обновляет **только `name`** (≤100). `changePassword`: проверка текущего (bcrypt), **запрет для OAuth-аккаунтов** (нет `passwordHash`), хеш нового. 🟢
- Wishlist: `toggleWishlist` (идемпотентно add/remove), `getWishlistProductIds` (take 200), `getWishlist` (take 100 + данные товара), `removeFromWishlist`.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| A-1 | 🟡 | **`Address` без CRUD-действия:** модель есть, но управление сохранёнными адресами не реализовано; checkout использует `customerData`-снапшот, а не `Address`. Согласуется с O-5. |
| A-2 | 🟡 | **Нет верификации email** при регистрации: `VerificationToken` не используется, Resend при регистрации не вызывается; авто-логин после регистрации отсутствует. |
| A-3 | 🟡 | `signIn`/`error` захардкожены на `/uk/login` — ru-пользователь попадает на uk-страницу логина. |
| A-4 | 🟡 | Профиль редактирует только `name` (схема имеет `phone`, `avatar` — без UI/действия). |
| A-5 | 🟢 | Корректная защита: смена пароля заблокирована для OAuth, проверка текущего пароля, bcrypt cost 10, RBAC-хелперы. |
| A-6 | 🟡 | JWT-стратегия при наличии `Session`-таблицы (PrismaAdapter) — таблица сессий фактически не используется для хранения сессий (только Account для OAuth-линковки). |

**Сложность модуля:** средняя.

---

## Модуль: `assistant` 🟢 ⭐ (AI-консультант)

**Назначение:** диалоговый технический ассистент — подбор оборудования, расчёт ИБП/автоматики, сравнение/замена товаров, черновик заказа. Позиционируется как «RAG по техдокументации».

**Ключевые файлы:** `src/lib/assistant/claude.ts` (ядро LLM, 460 строк), `src/app/api/assistant/chat/route.ts` (API), `src/lib/assistant/prompts.ts` (системный промпт), `src/lib/assistant/draft-order.ts` (расчёт черновика/сравнения), `src/lib/assistant/types.ts`, `src/components/assistant/*`, страница `(locale)/assistant`.

### 1. Реальная архитектура (важно — расходится с «RAG»)
1. Из сообщения извлекаются **ключевые слова** (regex, кириллица, len>2).
2. **Поиск товаров** в Prisma по ключам (`sku/slug/translations` contains, insensitive), `take 12`.
3. Каталог товаров **подставляется в системный промпт** (JSON).
4. **Прямой `fetch`** к `https://api.anthropic.com/v1/messages`, модель `claude-3-5-sonnet-20241022`, `max_tokens 4000`, ключ `ANTHROPIC_API_KEY`.
5. Ответ Claude → `extractAndParseJson` (срезает markdown-фенсы, fallback по границам `{}`) → **zod-валидация** (`ModelResponseSchema`).
6. **Регидратация из БД** 🟢: рекомендованные товары/позиции черновика/сравнения берут цену/имя/сток **из `dbProducts`** по `id`/`sku` — данные от LLM не доверяются.
7. Если ключа нет/ошибка → **локальный fallback-матчер** с захардкоженными «[Демо-режим]» ответами по ключам (дбж/ибп, замена/аналог, автомат).

### 2. API-маршрут (`chat/route.ts`)
- **Анти-инъекция:** regex-фильтры («ignore prior instructions», «system prompt», …) → 400. 🟢
- **Rate limit (DB):** сканирует `assistantMessage` за 5с, если тот же IP в пределах 2с → 429. 🟡 (скан до 100 строк/запрос, IP в неиндексируемом `structured`).
- Zod: `message ≤800`, locale uk/ru. **История обрезается до 10** (контроль токенов).
- **Сессии:** find/create `AssistantSession`; логирование USER и ASSISTANT в `AssistantMessage` (`structured` = products/draftOrder/sources/costLog).
- **Учёт стоимости:** оценка input/output токенов (chars/3.5), тарифы Sonnet $3/$15 за M → `costUsd` в лог. 🟢

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| AS-1 | 🔴 | **«RAG» не векторный:** `TechnicalDocument`/`DocumentChunk`/`embedding` в этом потоке **не используются**. Реальный retrieval — keyword-поиск по товарам + prompt-stuffing. Заявленная RAG-функциональность — задел/MVP. |
| AS-2 | 🔴 | **`ANTHROPIC_API_KEY` отсутствует в `.env.example`** — недокументированная критическая переменная. |
| AS-3 | 🟢 | **Регидратация из БД** цен/наличия — защита от галлюцинаций/манипуляции ценами со стороны LLM. Сильная сторона. |
| AS-4 | 🟢 | Фильтры prompt-injection + zod (`message ≤800`) + усечение истории. |
| AS-5 | 🟡 | **Rate limit на скане БД** (IP в JSON, без индекса, гонки) — неэффективно и ненадёжно; нужен индексируемый столбец/Redis. |
| AS-6 | 🟡 | Прямой `fetch` вместо официального SDK: нет ретраев/стриминга, `anthropic-version` и модель захардкожены (можно перейти на новее). |
| AS-7 | 🟡 | **IP хранится в открытом виде** в `AssistantMessage.structured` (и в `costLog`) — приватность/PII. |
| AS-8 | 🟡 | **`sources` захардкожены** (ДСТУ/datasheet-плейсхолдеры) — выдаются как «база техдокументации», хотя реального цитирования документов нет. |
| AS-9 | 🟡 | Fallback «[Демо-режим]» с шаблонными ответами при отсутствии ключа. |

**Сложность модуля:** высокая (LLM-интеграция, валидация, безопасность).

---

## Модуль: `search` 🟢

**Назначение:** полнотекстовый поиск товаров через Algolia с деградацией на Prisma.

**Ключевые файлы:** `src/lib/algolia.ts` (клиенты), `src/actions/search.ts` (поиск + синхронизация индекса), `src/queries/search.ts` (`searchProductsFallback`), `src/components/search/*`, страница `(shop)/search`.

### Логика
- **Два клиента:** admin (`ALGOLIA_ADMIN_KEY`, синхронизация) и публичный поисковый (`NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`). Оба возвращают `null`, если env не настроены.
- `searchProducts(query, locale)`: индекс **`products_{locale}`** (отдельные индексы uk/ru), `hitsPerPage 12`. **Graceful fallback** на `searchProductsFallback` (Prisma) при отсутствии клиента **или** ошибке Algolia. 🟢
- `syncProductIndex(productId)`: апсертит товар в оба локальных индекса; если `!isActive` → `deleteObject`; пропуск, если Algolia не настроен. `removeProductFromIndex`: удаляет из обоих индексов.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| SE-1 | 🟢 | Грациозная деградация Algolia → Prisma — устойчиво к недоступности внешнего сервиса. |
| SE-2 | 🟡 | Синхронизация только по одному товару (on-demand); **нет команды полной переиндексации** — первичное наполнение/восстановление индекса неочевидно. |
| SE-3 | 🟡 | В fallback `categoryName = category.slug` (не переведённое имя) — мелкая несогласованность отображения. |
| SE-4 | 🟡 | Консистентность индекса зависит от вызова `syncProductIndex` на каждое изменение товара в admin; пропуск → дрейф индекса. |

**Сложность модуля:** низкая-средняя.

---

## Модуль: `admin` 🟢

**Назначение:** административная панель — управление товарами/категориями/брендами, заказами, модерация отзывов, загрузка изображений, интеграция с Content Factory (AI-генерация контента).

**Ключевые файлы:** `src/actions/admin.ts` (~1540 строк, ~30 server actions), `src/app/api/admin/upload/route.ts`, `src/components/admin/*` (9 + `products/`), страница `(locale)/admin`.

### Состав (всё под `requireAdmin()`)
- **Товары:** `getProductsAdmin`, `getProductAdminStats`, `saveProductAdmin` (create/update в `$transaction`), `toggleProductActiveAdmin`, `updateProductStockAdmin`, `deleteProductAdmin` (`$transaction`), `duplicateProductAdmin`; **bulk:** active-toggle, Algolia-sync, смена категории/бренда.
- **Content Factory:** `launchContentFactoryForProductAdmin`, `getContentFactoryProductStatusesAdmin`, `getContentFactoryRunResultAdmin` — `fetch` к внешнему сервису (`CONTENT_FACTORY_API_URL`, default **`http://127.0.0.1:8028`**, токен `CONTENT_FACTORY_TOKEN`).
- **Заказы:** `getOrdersAdmin` (пагинация + фильтр статуса), `updateOrderStatusAdmin`, `updateOrderNotesAdmin`.
- **Категории/бренды:** `getCategoriesBrandsAdmin`, `saveCategoryAdmin`, `saveBrandAdmin`.
- **Модерация отзывов:** `getReviewsAdmin` (фильтр `isVisible`), `toggleReviewVisibilityAdmin`, `deleteReviewAdmin` (закрывает цикл премодерации из `product`).
- Все мутации → гранулярный `revalidateTag` (`products`/`categories`/`brands`/`product-{slug}`).

### Загрузка изображений (`api/admin/upload`)
- **POST:** `requireAdmin`, валидация типа (jpeg/png/webp/avif) и размера (≤10 МБ), `uploadProductImage` (Cloudinary/локально).
- **DELETE:** zod discriminated union по `provider`; для `LOCAL` — **защита от path traversal** (путь обязан начинаться с `uploads/`, отвергаются `..`, `\`, `\0`). 🟢
- Маппинг ошибок: `UNAUTHORIZED→401`, `FORBIDDEN→403`.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| AD-1 | 🟢 | Единообразный RBAC (`requireAdmin` на всех действиях и в upload-роуте). |
| AD-2 | 🟢 | Гранулярная инвалидация кэша `revalidateTag` после мутаций. |
| AD-3 | 🟢 | Upload: валидация типа/размера + защита от path traversal при удалении локальных файлов. |
| AD-4 | 🟡 | Content Factory default `http://127.0.0.1:8028` — при незаданном env в проде вызовы уйдут на localhost. Жёсткая связка с локальным Python-сервисом. |
| AD-5 | 🟡 | **Роль `MANAGER` не используется** в admin — везде `requireAdmin` (хотя `requireManager` существует). Гранулярность ролей не задействована. |
| AD-6 | 🟡 | `admin.ts` — «god-файл» (~1540 строк, 6 доменов в одном модуле); кандидат на разбиение. |
| AD-7 | 🟢 | `saveProductAdmin`/`deleteProductAdmin` в транзакциях (консистентность переводов/изображений). |

**Сложность модуля:** высокая по объёму (CRUD + интеграции), средняя по логике.

---

## Модуль: `suppliers` 🔴 (преимущественно рудиментарный)

**Назначение (заявленное):** интеграция остатков/цен поставщиков (ASKO) через `SupplierInventory`.

**Реальность по коду:**
- **`SupplierInventory`** (модель есть в схеме, `sku @unique`, `mpn`, `stock`, `price`, `supplierName`) — **не имеет runtime-кода** в приложении: ни server action, ни запрос её не читает/не пишет. Наполнение происходит **извне** (Python-скрипты пользователя в `C:\робот`: `asko_stock_sync.py` и т.п.), не в этом репозитории.
- **`src/actions/get-asko-products.ts`** — это **не** server action, а tsx-скрипт (`main()` + `dotenv`), запускаемый вручную. Печатает счётчик/сэмплы товаров и **`return;` на строке 36 → весь анализ ASKO (маржа/продажи/топ-50, строки 38–105) — мёртвый код**. К `SupplierInventory` не обращается (читает `Product`).
- **`src/actions/analyze-products.ts`** — **скрипт построения групп Google Ads**: читает локальный CSV (`C:\Users\sevri\Сайт\Отчет о товаре.csv`), категоризирует, считает `valueScore`, формирует 25 групп ставок, пишет в `scratch/groups_*.{csv,txt}`. Маркетинговый инструмент, не код магазина.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| SU-1 | 🔴 | `SupplierInventory` не используется в runtime приложения — наполняется внешними скриптами; в репозитории нет sync-логики. Связь с `Product` только по `sku` на уровне внешних процессов. |
| SU-2 | 🔴 | `actions/get-asko-products.ts` — dev-скрипт с **мёртвым кодом после `return;`**; неуместен в `src/actions/` (нет `'use server'`, исполняет `main()` при импорте). |
| SU-3 | 🟡 | `actions/analyze-products.ts` — скрипт Google Ads с **захардкоженными абсолютными путями** Windows; пишет в `scratch/`. Не относится к рантайму, засоряет `src/actions/`. |
| SU-4 | 🟡 | Смешение dev-скриптов и `'use server'`-экшенов в одной папке — риск случайного импорта и побочных эффектов на сборке. |

**Сложность модуля:** низкая (как рантайм-функция фактически отсутствует; присутствует как намерение + внешняя интеграция).

---

## Модуль: `core-infra` 🟢

**Назначение:** инфраструктурный слой — клиент БД, валидация окружения, хранилище изображений, i18n, логирование, утилиты.

**Ключевые файлы:** `src/lib/prisma.ts`, `src/lib/env.ts`, `src/lib/storage.ts` + `src/lib/images.ts`, `src/i18n/request.ts`, `src/lib/logger.ts`, `src/lib/utils.ts` (`formatPrice`, `getDiscountPercent`, `getSiteUrl`, `parseSearchParams`), `src/lib/constants.ts`, `src/config/*`.

### 1. Prisma (`prisma.ts`) 🟢
Singleton `PrismaClient` с адаптером `@prisma/adapter-pg` (Prisma 7 driver adapters, `DATABASE_URL`). Глобальный кэш в dev (HMR-safe), логирование запросов в dev. Корректно.

### 2. Валидация окружения (`env.ts`) 🟢/🟡
Zod-схема на старте: `DATABASE_URL` (url), `AUTH_SECRET` (≥32), `NEXT_PUBLIC_SITE_URL` (url, обязателен), OAuth/Resend/Payment/Algolia — optional, **Cloudinary** — cross-field refine (всё-или-ничего). В **production** невалидный env → `throw` (fail-fast); в dev — лог и продолжение.

### 3. Хранилище изображений (`storage.ts`) 🟢
`uploadProductImage(File|base64)`: Cloudinary, если настроен; иначе **локально только в dev** (в проде без Cloudinary → throw). `deleteProductImage`: Cloudinary `destroy` или локально с **двойной защитой от path traversal** (`startsWith('uploads/')` + realpath внутри `uploadsDir`). 🟢

### 4. i18n (`i18n/request.ts`) 🟢
`locales = ['uk','ru']`, `defaultLocale='uk'`, `isValidLocale` guard, next-intl `getRequestConfig` грузит `messages/{locale}.json`, `notFound()` на невалидной локали.

### Находки и риски модуля
| # | Уровень | Находка |
|---|---------|---------|
| CI-1 | 🟢 | Prisma singleton + adapter-pg — корректная HMR-safe настройка под Prisma 7. |
| CI-2 | 🟢 | Zod-валидация env с fail-fast в проде. |
| CI-3 | 🟡 | **Валидация env неполная:** `ANTHROPIC_API_KEY` и `CONTENT_FACTORY_*` читаются через сырой `process.env` и **отсутствуют в `env.ts`** — расходится с принципом «валидировать всё окружение» (см. AS-2, AD-4). |
| CI-4 | 🟡 | **Рассинхрон `.env.example` ↔ `env.ts`:** Cloudinary-ключи валидируются в `env.ts`, но **отсутствуют в `.env.example`**; а `ANTHROPIC_API_KEY`/`CONTENT_FACTORY_*` есть в примере, но не в схеме. Документация и валидация разъезжаются. |
| CI-5 | 🟢 | `storage.ts`: запрет локального хранилища в проде + двойная защита от path traversal (дублирует проверку upload-роута). |
| CI-6 | 🟢 | Чистая i18n-конфигурация uk/ru с `notFound` на невалидной локали. |
| CI-7 | 🟡 | Разнобой бренда: `RESEND_FROM_EMAIL` default `noreply@elektronom.com.ua` vs `Electronom` в title/OG (повтор P-5). |

**Сложность модуля:** средняя (инфраструктура, безопасность загрузок).
