# ТЗ для разработчика — по реальной структуре сайта и состоянию фич

> Дата: 2026-05-31 · Источник истины: реверс-инжиниринг Reversa (`_reversa_sdd/`).
> Это **навигационный план фича-за-фичей**: фактическое состояние + что доделать. Дополняет `TZ_FIXES_MASTER_2026-05-31.md` (фиксы по приоритету) и `_reversa_sdd/vision-next-level.md` (ставки роста).
> ⚠️ Перед работой прочитать `§0 ANTI-REGRESSION` в `TZ_FIXES_MASTER` — НЕ пересоздавать готовое, НЕ выравнивать схему под §6 вслепую.
> Легенда состояния: ✅ работает · 🟡 частично · 🔴 нет/демо · ⚠️ долг/риск.

---

## 0. Реальная карта сайта (факт)

**Маршруты `src/app/[locale]/`:**
- `(shop)`: `catalog`, `catalog/[slug]`, `product/[slug]`, `brands`, `brands/[slug]`, `cart`, `checkout`, `order-success`, `search`
- `(account)`: `orders`, `orders/[number]`, `profile`, `wishlist`
- `(auth)`: `login`, `register`
- `(info)`: `about`, `contacts`, `delivery`
- корень: `/` (home), `admin`, `assistant`

**API `src/app/api/`:** `admin/upload`, `assistant/chat`, `auth/[...nextauth]`
**Server actions:** `cart`, `order`, `auth`, `user`, `admin`, `search`, `analyze-products`*, `get-asko-products`* (*— dev-скрипты, не экшены)
**Queries:** `products`, `categories`, `brands`, `orders`, `search`, `workload`
**Lib:** `prisma`, `env`, `auth`, `storage`/`images`, `algolia`, `assistant/*`, `catalog-*`, `logger`, `utils`, `constants`
**Инфра:** `proxy.ts` ✅, `instrumentation.ts` ✅, `sitemap.ts`/`robots.ts` ✅, `error/not-found/global-error` ✅, `loading` (catalog/product) ✅

**Матрица состояния (сводка §3 ниже):** каталог/товар/корзина/auth/аккаунт/поиск/админка — ✅/🟡 рабочие; checkout-оплата, AI-RAG, B2B, поставщики, тесты — 🔴/🟡 главный остаток.

---

## 1. Глобальные предпосылки (gate)

Перед фиче-задачами **Фазы роста** должен быть закрыт фундамент (детали — в `TZ_FIXES_MASTER`):
- **A-8** — согласовать схему ↔ `MASTER_CONTEXT §6` (разблокирует безопасные изменения данных).
- **A-3** — тесты + CI (страховка перед правками фасетов/заказа).
- **A-6** — connection pooling (Vercel).
- **A-2/A-5** — XSS-санитайз, полнота env.

---

## 2. Фичи по областям

### 2.1 Каталог и фасеты — ✅ работает, ⚠️ масштаб
**Файлы:** `(shop)/catalog[/slug]`, `queries/products.ts`+`categories.ts`+`brands.ts`, `lib/catalog-*`, `components/catalog/*` (14).
**Работает:** дерево категорий, динамические фасеты (JSONB), реактивные счётчики, пагинация/сортировка, URL-состояние, гистограмма цен.
**Долг/доделать:**
- T-CAT-A: фасеты вне in-memory (Algolia-фасеты предпочт., §20 / либо `$queryRaw` как крайняя нужда) — снять `take:50000`. *(=A-4)*
- T-CAT-B: единый источник конфигов фильтров (`catalog-data.ts` ↔ `catalog-filter-config.ts`). *(=B-8)*
- T-CAT-C: тест паритета SQL-выдача ↔ in-memory счётчики. *(в A-3)*
**Приёмка:** категория >50k товаров без OOM; счётчик фасета = числу товаров при его применении.
**Не ломать:** контракт `ActiveFilters` и канонические URL (SEO).

### 2.2 Карточка товара — ✅ работает, ⚠️ безопасность/чистота
**Файлы:** `(shop)/product/[slug]/page.tsx`, `queries/products.ts`, `components/product/*` (8), `actions/user.ts:submitProductReview`.
**Работает:** галерея, характеристики, цена/скидка/наличие, qty-breaks, отзывы (премодерация, verifiedPurchase), SEO (hreflang/JSON-LD/ISR).
**Долг/доделать:**
- T-PROD-A: **санитайз описания** (`page.tsx:390`, `dangerouslySetInnerHTML`). *(=A-2)* 🔴
- T-PROD-B: унифицировать `qty_breaks` (реальный `{min,discount}` ↔ mock `{minQty,unitPrice}`) + довести до схемы. *(=B-…, A-8)*
- T-PROD-C: убрать inline `style{{}}` → Tailwind/токены; хардкод-строки → `t()`. *(=B-13)*
**Приёмка:** XSS-payload вырезается; характеристики/опт-цены корректны; нет inline-стилей в ключевых блоках.

### 2.3 Корзина — ✅ работает
**Файлы:** `actions/cart.ts`, `(shop)/cart`, `store/cart-store.ts`, `components/cart/*` (5), `hooks/use-cart.ts`.
**Работает:** cookie (гость) + БД (авториз.) + merge при входе; клэмпинг qty; Zustand только UI.
**Долг:** мелочи; TTL-очистка брошенных серверных корзин (опц.).
**Не ломать:** `mergeCartIfNeeded`, httpOnly-cookie контракт.

### 2.4 Checkout + Заказы — 🟡 ядро есть, петля НЕ закрыта ⭐
**Файлы:** `(shop)/checkout`+`checkout-form.tsx`, `order-success`, `actions/order.ts`, `queries/orders.ts`.
**Работает:** `createOrder` (транзакция, идемпотентность, гонко-безопасный сток, нумерация `ORD-YYYY-NNNNN`, снапшоты, очистка корзины); история/детали заказа с проверкой владения.
**Долг/доделать (РАСШИРЯТЬ, не переписывать):**
- T-ORD-A: **онлайн-оплата** — `lib/payment.ts` + `api/webhooks/payment/route.ts` + инициация в `createOrder` для `CARD_ONLINE`/parts. *(=A-1, ⛔Q1 провайдер)* 🔴
- T-ORD-B: **доставка Нова Пошта** — расчёт/выбор отделения; заменить `shipping=0`. 🔴
- T-ORD-C: **письмо-подтверждение** — `lib/email.ts`+`sendOrderConfirmation` (Resend), после транзакции. *(=A-7)* 🔴
- T-ORD-D: дедуп `getUserOrders` (actions vs queries). *(=B-4)*; привязать `addressId` (см. 2.5).
**Приёмка:** `CARD_ONLINE`→оплата→webhook→`paymentStatus=PAID`; доставка считается; письмо уходит; повтор `idempotencyKey` не дублирует.

### 2.5 Аккаунт — ✅ частично, 🔴 адреса
**Файлы:** `(account)/orders[/number]|profile|wishlist`, `actions/user.ts`.
**Работает:** профиль (имя), смена пароля (блок для OAuth), wishlist CRUD, заказы.
**Долг/доделать:**
- T-ACC-A: **CRUD сохранённых адресов** (`Address`) + выбор при checkout + `Order.addressId`. 🔴
- T-ACC-B: профиль — добавить `phone`/`avatar` (сейчас только name).
**Приёмка:** пользователь сохраняет адрес и выбирает его в checkout; заказ ссылается на адрес.

### 2.6 Auth — ✅ работает, ⚠️ соответствие спеке
**Файлы:** `lib/auth.ts`, `actions/auth.ts`, `api/auth/[...nextauth]`, `proxy.ts` (защита маршрутов).
**Работает:** Credentials + Google/Facebook (env-gated), JWT, RBAC-хелперы, proxy защищает `/account`,`/admin`.
**Долг/доделать:**
- T-AUTH-A: пароль `min(8)` (§13, сейчас 6). *(=B-10)*
- T-AUTH-B: **верификация email + авто-логин** (`VerificationToken`+Resend сейчас не используются). 🔴
- T-AUTH-C: локаль-зависимый логин-редирект (`/uk/login` хардкод). *(=B-5)*
**Приёмка:** регистрация требует подтверждения email; ru-юзер идёт на ru-логин.

### 2.7 Поиск — ✅ частично
**Файлы:** `lib/algolia.ts`, `actions/search.ts`, `queries/search.ts`, `(shop)/search`, `components/search/*`.
**Работает:** Algolia `products_{locale}` + graceful Prisma fallback; per-product sync.
**Долг/доделать:**
- T-SRCH-A: **полная переиндексация** (bulk) + гарантия sync на каждое изменение товара. *(=B, SE-2/SE-4)*
- T-SRCH-B: инстант-поиск, синонимы электротерминов, поиск по SKU/MPN, опечатки. *(Ставка 4/6)*
- T-SRCH-C: миграция фасетов в Algolia (см. 2.1 T-CAT-A).
**Приёмка:** новый товар ищется без ручного reindex; поиск по артикулу работает.

### 2.8 AI-ассистент — 🔴 демо-уровень → главная ставка роста ⭐
**Файлы:** `lib/assistant/claude.ts`, `api/assistant/chat/route.ts`, `lib/assistant/{prompts,draft-order,types}.ts`, `components/assistant/*` (7), `(locale)/assistant`. Модели: `TechnicalDocument`, `DocumentChunk`, `AssistantSession`, `AssistantMessage`.
**Работает:** диалог через Claude (raw fetch), keyword-подбор товаров, регидратация из БД (анти-галлюцинации), черновик заказа/сравнение, rate-limit, prompt-injection фильтр, учёт стоимости.
**Долг/доделать (Ставка 1 — детально):**
- T-AI-A: **`ANTHROPIC_API_KEY` в `env.ts`/`.env.example`**; перевести на официальный `@anthropic-ai/sdk`. *(=A-5/B-12)* 🔴
- T-AI-B: **Векторный RAG** — pgvector (расширение + поле `vector` вместо `embedding String`), пайплайн: загрузка `TechnicalDocument` → чанкинг → эмбеддинги → поиск по косинусу; **реальные `sources`** вместо плейсхолдеров. 🔴
- T-AI-C: **Tool-use** — инструменты `searchProducts`/`getStock`/`getCompatible` вместо дампа каталога в промпт.
- T-AI-D: **Сборка комплекта (BOM)** — сценарий «щит на N групп» → автоматы/УЗО/бокс + расчёт + «добавить всё в корзину».
- T-AI-E: **Калькуляторы** (сечение кабеля по мощности/длине, номинал автомата, автономия ИБП) — как standalone-инструменты и как функции ассистента.
- T-AI-F: вынести IP из открытого лога (PII); rate-limit на индексируемом хранилище. *(=AS-5/AS-7)*
**Приёмка:** ответ ссылается на реальные документы (RAG); «собрать щит» формирует валидный комплект в корзину; калькулятор даёт корректное сечение.
**Не ломать:** регидратацию из БД (ключевая защита).

### 2.9 Админка — ✅ частично, ⚠️ долг
**Файлы:** `(locale)/admin`, `actions/admin.ts` (~1540 строк), `api/admin/upload`, `components/admin/*` (9+products).
**Работает:** CRUD товаров/категорий/брендов (транзакции), заказы (статус/заметки), модерация отзывов, загрузка изображений (валидация+anti-traversal), Content Factory.
**Долг/доделать:**
- T-ADM-A: **guard переходов `OrderStatus`** (сейчас принимается любой статус). 🔴
- T-ADM-B: ввести доступ **MANAGER** (сейчас всё `requireAdmin`) + **аудит админ-действий**. 🔴
- T-ADM-C: Content Factory — убрать localhost-дефолт в проде, env-валидация. *(=A-5)*
- T-ADM-D: разбить god-файл `admin.ts` по доменам (рефактор). *(=B/AD-6)*
**Приёмка:** недопустимый переход статуса отклоняется; действия админа логируются в аудит.

### 2.10 Поставщики (ASKO) — 🔴 рудимент → Ставка 3
**Файлы:** модель `SupplierInventory`; `actions/get-asko-products.ts`* (мёртвый код), `analyze-products.ts`* (Google Ads). Синк — во внешних скриптах `C:\робот`.
**Долг/доделать:**
- T-SUP-A: вынести dev-скрипты из `src/actions/` в `scripts/`; удалить мёртвый код. *(=B-3)*
- T-SUP-B: узаконить синк остатков/цен в приложении/сервисе (мульти-поставщик), маппинг `SupplierInventory.sku ↔ Product.sku`. 🔴
- T-SUP-C: **честная доступность** «в наявності / під замовлення N днів» из supplier feed вместо бинарного `stock>0`.
**Приёмка:** остатки ASKO обновляются процессом приложения; карточка показывает срок поставки.

### 2.11 B2B (сквозная фича) — 🔴 в основном нет → Ставка 2
**Опора:** `costPrice`, `qty_breaks`, enum `MONOBANK_PARTS/PRIVAT_PARTS`, персона «Олена» (редизайн).
**Доделать:**
- T-B2B-A: **счёт с ПДВ / оплата по рахунку**, профиль юр.лица (ЄДРПОУ/реквизиты).
- T-B2B-B: **RFQ «Запрос прайса»** — отдельная воронка/форма + статус.
- T-B2B-C: **заказ списком/CSV по артикулам** + быстрый ре-ордер.
- T-B2B-D: оптовые цены (`qty_breaks`) в прайс-листах + рассрочки.
**Приёмка:** юр.лицо получает счёт с ПДВ; заказ по списку SKU формирует корзину.

### 2.12 SEO / Контент — 🟡 база есть → Ставка 4
**Работает:** sitemap/robots/JSON-LD (Product/Breadcrumb), hreflang.
**Доделать:**
- T-SEO-A: **программные лендинги** по фасетам (URL-схема уже есть) + Organization JSON-LD.
- T-SEO-B: **техгайды** через Content Factory (двойное назначение: SEO + корпус RAG для 2.8).
- T-SEO-C: AI-SEO (цитируемость в AI-ответах).

### 2.13 Core-infra / Инфра — ✅, ⚠️ долг
**Доделать:** env-валидация (`ANTHROPIC`/`CONTENT_FACTORY`, `RESEND startsWith re_`) *(=A-5)*; connection pooling *(=A-6)*; `.env.example`↔`env.ts` *(=B-6)*; вынести zod в `lib/validations/` *(§4)*.

### 2.14 Качество — 🔴 нет → фундамент
**Доделать:** Vitest+Playwright+`tests/{unit,integration,e2e}`, CI (lint→tsc→test→build), аудит, статус-вебхуки, наблюдаемость. *(=A-3, Ставка 6)*

---

## 3. Сводная матрица фич

| Область | Состояние | Приоритет | Ключевые задачи |
|---|---|---|---|
| Каталог/фасеты | ✅ ⚠️масштаб | P1 | T-CAT-A/B/C |
| Карточка товара | ✅ ⚠️XSS | **P0** | T-PROD-A |
| Корзина | ✅ | — | — |
| Checkout/Заказы | 🟡 петля открыта | **P0** | T-ORD-A/B/C |
| Аккаунт | ✅ 🔴адреса | P1 | T-ACC-A |
| Auth | ✅ ⚠️ | P1 | T-AUTH-A/B/C |
| Поиск | ✅ частично | P1 | T-SRCH-A/B |
| **AI-ассистент** | 🔴 демо | **P1 (ставка)** | T-AI-A..F |
| Админка | ✅ частично | P1 | T-ADM-A/B |
| Поставщики | 🔴 рудимент | P2 | T-SUP-A/B/C |
| **B2B** | 🔴 | **P1 (ставка)** | T-B2B-A..D |
| SEO/Контент | 🟡 | P2 | T-SEO-A/B |
| Core-infra | ✅ ⚠️ | P0/P1 | A-5/A-6/B-6 |
| Качество | 🔴 | **P0** | A-3 |

---

## 4. Спринты (увязка с фазами видения)
- **Спринт 0 — фундамент:** A-8 (схема), A-3 (тесты/CI), A-6 (пулинг), A-2 (XSS), A-5 (env). Gate ко всему.
- **Спринт 1 — петля продаж:** T-ORD-A/B/C (оплата+НП+письма), T-ACC-A (адреса), финал дизайна.
- **Спринт 2 — дифференциация:** T-AI-A..E (RAG/tool-use/BOM/калькуляторы) + T-B2B-A..D (счёт ПДВ/RFQ/CSV).
- **Спринт 3 — масштаб:** T-CAT-A + T-SRCH (Algolia-фасеты/инстант), T-SUP (поставщики), T-SEO (контент).
- **Спринт 4 — зрелость:** T-ADM-A/B (статусы/аудит/MANAGER), наблюдаемость, дашборды.

## 5. Чек-лист приёмки каждого этапа
`npm run lint` · `npx tsc --noEmit` · `npm run build` (+ после A-3: `vitest`+`playwright`). Плюс инварианты v1.3: нет `.js`, нет `@default(cuid())`/`z.string().cuid()`, `proxy.ts`, `next/image`, `select`+`take`, тексты через `next-intl`.

## 6. Трассировка
Состояние фич — `_reversa_sdd/code-analysis.md`; пробелы — `gaps.md`; соответствие мастеру — `master-context-compliance.md`; фиксы — `TZ_FIXES_MASTER_2026-05-31.md`; рост — `vision-next-level.md`.
