# ТЗ — Закрытие критических ошибок + массовый косметический ремонт

> ⚠️ **ЗАМЕНЕНО НА `TZ_FIXES_MASTER_2026-05-31.md`** (v2 — единый операционный план с anti-regression guard и реконсиляцией с роадмапом v1.3). Использовать v2; этот файл оставлен для истории.

> Дата: 2026-05-30 · Источник: реверс-инжиниринг Reversa (`_reversa_sdd/gaps.md`, `confidence-report.md`)
> Кодовая база: Next.js 16 / React 19 / Prisma 7 / Postgres. Ссылки `file:line` — на момент анализа, сверять с актуальным кодом.

## Легенда приоритетов и оценок
- **P0** — критично, блокирует прод/безопасность. **P2** — мелкий долг/консистентность. **P3** — косметика.
- Оценка: **S** ≤ полудня, **M** ≈ 1–2 дня, **L** ≈ 3–5 дней. ⛔ = есть предусловие (продуктовое решение).

## 0. Сводка задач

| ID | Задача | Приоритет | Оценка | Предусловие |
|----|--------|-----------|--------|-------------|
| A-1 | Онлайн-оплата + webhook | P0 | L | ⛔ Q1 (провайдер) |
| A-2 | Санитайз HTML описания (XSS) | P0 | S | — |
| A-3 | Каркас тестов + CI | P0 | M→L | — |
| A-4 | Масштабирование фасетов + синхронизация SQL/in-memory | P0 | L | — |
| A-5 | Полнота валидации ENV | P0 | S | — |
| B-1 | Унификация бренда Electronom→Elektronom | P3 | S | Q10 |
| B-2 | search: categoryName = переведённое имя | P3 | S | — |
| B-3 | Удалить мёртвый код / вынести dev-скрипты | P2 | S | — |
| B-4 | Дедупликация `getUserOrders` | P2 | S | — |
| B-5 | Локаль-зависимый редирект логина (`/uk/login`) | P2 | S | — |
| B-6 | Синхронизация `.env.example` ↔ `env.ts` | P2 | S | — |
| B-7 | Доставка/скидки: явная конфигурация вместо `0` | P2 | M | связано с A-1 |
| B-8 | Единый источник конфигурации фильтров | P2 | M | — |
| B-9 | Аудит прочих `dangerouslySetInnerHTML` | P2 | S | — |

> Рекомендованный порядок: **A-2, A-5, B-* (одним батчем)** → быстрые победы; затем **A-3** (тесты как страховка) → **A-4** → **A-1** (после решения по провайдеру).

---

# ЧАСТЬ A — Критические (P0)

## A-1. Онлайн-оплата и обработка webhook ⛔

**Проблема (G-1).** `createOrder` не инициирует платёж; `paymentStatus` всегда `PENDING`. Переменные `PAYMENT_SECRET_KEY`/`PAYMENT_WEBHOOK_SECRET` не используются в рантайме. Платёжного SDK в зависимостях нет.

**Доказательство.** `src/actions/order.ts` (заказ создаётся со `paymentStatus` default PENDING, без вызова провайдера); `src/app/[locale]/(shop)/checkout/checkout-form.tsx` (только выбор `paymentMethod`); статус меняется вручную `admin.ts:updateOrderStatusAdmin`.

**Предусловие (Q1).** Утвердить провайдера: **LiqPay / Fondy(Flutterwave) / WayForPay / Monobank Acquiring / Portmone**. Для `MONOBANK_PARTS`/`PRIVAT_PARTS` — оплата частями (Monobank/ПриватБанк).

**Решение (провайдер-независимый контракт).**
1. Новый модуль `src/lib/payment.ts`:
   - `createPayment(order): { redirectUrl | widgetData, providerOrderId }` — формирует подпись (`PAYMENT_SECRET_KEY`), сумма = `order.total`, `merchantOrderId = order.number`.
   - `verifyWebhook(payload, signature): boolean` — проверка подписи `PAYMENT_WEBHOOK_SECRET`.
   - `mapProviderStatus(providerStatus): PaymentStatus`.
2. В `createOrder` (после COMMIT транзакции): если `paymentMethod === 'CARD_ONLINE'` (и parts-методы) → вызвать `createPayment`, вернуть `redirectUrl` в ответе; для `CASH_ON_DELIVERY` — без изменений.
3. Новый роут `src/app/api/payment/webhook/route.ts` (POST): `verifyWebhook` → найти заказ по `merchantOrderId` (`number`) → обновить `paymentStatus` (PAID/FAILED/REFUNDED) идемпотентно (по providerOrderId/повтору) → при PAID опц. перевести `status` PENDING→CONFIRMED → `revalidateTag`.
4. Checkout: при `redirectUrl` — редирект/виджет; страница `order-success` показывает статус оплаты.
5. ENV: добавить `PAYMENT_PROVIDER`, `PAYMENT_PUBLIC_KEY` (если нужно) в `env.ts` и `.env.example`.

**Критерии приёмки.**
- Дано: заказ с `CARD_ONLINE`; Когда: `createOrder`; Тогда: возвращается `redirectUrl`, заказ `paymentStatus=PENDING`.
- Дано: валидный webhook `success`; Когда: POST `/api/payment/webhook`; Тогда: `paymentStatus=PAID` (идемпотентно при повторе).
- Дано: невалидная подпись webhook; Тогда: 400, статус не меняется.
- Дано: `CASH_ON_DELIVERY`; Тогда: онлайн-платёж не инициируется.

**Риски.** Идемпотентность webhook (повторные доставки), расхождение сумм, таймауты. Логировать все колбэки.

---

## A-2. Санитайз HTML описания товара (XSS) — **быстрая победа**

**Проблема (G-2).** Описание рендерится «как есть»: `src/app/[locale]/(shop)/product/[slug]/page.tsx:390` → `dangerouslySetInnerHTML={{ __html: description }}`. Если HTML описания приходит из админки/импорта без очистки — хранимый XSS.

**Охват (уточнено).** Опасен только этот один кейс. Остальные 4 `dangerouslySetInnerHTML` — JSON-LD (`breadcrumbs.tsx:32`, `product-schema.tsx:79`), `<style>` (`assistant-character.tsx:240`) и тема в `layout.tsx:80` — безопасны (`JSON.stringify`/статичный CSS), но см. B-9.

**Решение (defense-in-depth, обе стороны).**
1. Зависимость: `isomorphic-dompurify` (работает в RSC/Node) или `sanitize-html`.
2. `src/lib/sanitize.ts`: `sanitizeHtml(html): string` — белый список тегов (p, br, ul/ol/li, strong, em, a[href], h2-h4, table…), запрет `script`/`on*`/`style`/`iframe`.
3. **На записи:** в `admin.ts:saveProductAdmin` очищать `description` (uk/ru) перед сохранением.
4. **На выводе:** в `page.tsx:390` оборачивать `sanitizeHtml(description)` (страховка для старых данных).
5. Миграция данных: одноразовый скрипт прогнать существующие `ProductTranslation.description` через `sanitizeHtml`.

**Критерии приёмки.**
- Дано: описание с `<script>alert(1)</script><img onerror=...>`; Когда: сохранение и рендер; Тогда: вредоносные узлы/атрибуты удалены, легальная разметка сохранена.
- `npm run build` и typecheck зелёные.

**Оценка.** S. **Делать первой** — низкая стоимость, высокий риск.

---

## A-3. Каркас автотестов + CI

**Проблема (G-3).** Нет тест-раннера и CI при bleeding-edge стеке (Next 16 / React 19 / Prisma 7 / NextAuth 5-beta).

**Решение.**
1. **Unit/integration:** Vitest + `@testing-library/react`. `vitest.config.ts` (alias `@/`), окружение node для серверной логики.
2. **E2E:** Playwright (`@playwright/test`) — smoke ключевых маршрутов (каталог→товар→корзина→checkout, логин).
3. **Приоритетные тесты (критическая бизнес-логика):**
   - `createOrder`: транзакция, идемпотентность (`idempotencyKey`), отказ при нехватке стока (`count===0`), нумерация `ORD-YYYY-NNNNN`.
   - **Паритет фасетов:** `buildAttributeWhere` (SQL) vs `matchProduct` (in-memory) на одном наборе данных → одинаковые наборы (закрывает C-2).
   - `mergeCartIfNeeded`: клэмпинг `min(existing+new, stock, 99)`.
   - RBAC: `requireAdmin`/`requireManager` бросают FORBIDDEN.
   - `submitProductReview`: уникальность, `verifiedPurchase`, `isVisible=false`.
4. **CI** `.github/workflows/ci.yml`: на PR/push — `install → lint → tsc --noEmit → vitest → next build` (+ опц. Playwright на ephemeral Postgres через service container).
5. `package.json`: `"test": "vitest"`, `"test:e2e": "playwright test"`, `"typecheck": "tsc --noEmit"`.

**Критерии приёмки.**
- `npm test` запускает Vitest; ≥ покрыты 5 приоритетных сценариев выше.
- CI падает при провале lint/typecheck/test/build.

**Оценка.** M (каркас) → L (наполнение покрытия). Делать **до** A-4/A-1 как страховку.

---

## A-4. Масштабирование фасетов + синхронизация двух реализаций

**Проблема (G-4 + C-2).** `getCategoryProductsForFacets` грузит **до 50 000** товаров в память на каждый расчёт фасетов (`src/queries/categories.ts`). Параллельно список товаров фильтруется в SQL (`buildProductWhere` в `products.ts`) — две реализации логики, риск расхождения счётчиков и выдачи.

**Решение (поэтапно).**
- **Этап 1 (быстро):** SQL-агрегация фасетов через `$queryRaw` + `jsonb_each_text`/`jsonb_array_elements_text` для счётчиков атрибутов и `GROUP BY` для брендов; ценовые бакеты — `width_bucket`. Убрать `take: 50000`.
- **Этап 2 (надёжно):** перенести фасеты в **Algolia** (уже подключён) — нативные `facets`/`facetFilters`, реактивные счётчики из движка.
- **Снять дублирование (C-2):** один источник правды для матчинга — счётчики и выдача должны опираться на одинаковый предикат. Тест-паритет из A-3 закрепить регрессией.

**Критерии приёмки.**
- Категория с >50k товаров отдаёт фасеты без полной загрузки в память (проверка по плану запроса/времени).
- Счётчики фасетов = фактическому числу товаров при применении соответствующего фильтра (тест паритета зелёный).

**Оценка.** L. **Зависимость:** желательно после A-3 (есть тест паритета).

---

## A-5. Полнота валидации переменных окружения — **быстрая победа**

**Проблема (G-5 + CI-3/CI-4).** `ANTHROPIC_API_KEY`, `CONTENT_FACTORY_API_URL`, `CONTENT_FACTORY_TOKEN` читаются сырым `process.env`, **минуя** `src/lib/env.ts`. Плюс рассинхрон: Cloudinary-ключи валидируются в `env.ts`, но отсутствуют в `.env.example`.

**Решение.**
1. В `env.ts` добавить (все `optional`, т.к. ассистент/контент деградируют):
   `ANTHROPIC_API_KEY`, `CONTENT_FACTORY_API_URL` (url), `CONTENT_FACTORY_TOKEN`, и при необходимости `CLOUDINARY_URL`/`PAYMENT_PROVIDER`.
2. Обновить чтение в `lib/assistant/claude.ts` и `actions/admin.ts` на `env.*` вместо `process.env.*`.
3. Убрать дефолт `http://127.0.0.1:8028` для Content Factory в проде (или вынести в env с явной ошибкой при отсутствии в production).
4. Синхронизировать `.env.example` ↔ `env.ts` (см. B-6 — выполнить вместе).

**Критерии приёмки.**
- В проде отсутствие критичного env → понятная ошибка при старте; опциональные — корректная деградация.
- `.env.example` содержит ровно те ключи, что валидируются в `env.ts`.

**Оценка.** S.

---

# ЧАСТЬ B — Массовый косметический и мелкий ремонт (батч)

> Рекомендация: **один PR «chore: cosmetic & minor cleanup»**, по коммиту на задачу. Все — низкий риск. После — `tsc --noEmit` + `next build` + ручной smoke.

## B-1. Унификация бренда `Electronom` → `Elektronom` (Q10)
- **Проблема (G-20).** Вперемешку: домен `elektronom.com.ua`, дизайн-система `ELEKTRONOM`, но `product/[slug]/page.tsx` title/OG «Electronom», логотипы `public/.../electronom*.png`.
- **Решение.** Утвердить каноническое написание (рекоменд. **`Elektronom`** под домен). Заменить в пользовательских строках: `product/[slug]/page.tsx` (title/OG), `lib/constants.ts`, `components/layout/footer.tsx`, `env.ts` (`RESEND_FROM_EMAIL` default), i18n `messages/uk.json|ru.json`. Не трогать `src/generated/*`.
- **Поиск:** grep по `Electronom` и `Elektronom` отдельно → список под замену.
- **Критерий.** Один вариант написания во всех видимых пользователю местах.

## B-2. search: `categoryName` = переведённое имя
- **Проблема (G-22).** В Prisma-fallback поиска `categoryName = category.slug` (не имя) — `src/actions/search.ts`.
- **Решение.** В fallback выбирать `category.translations[locale].name`, как в Algolia-record.
- **Критерий.** Имя категории в выдаче fallback совпадает с Algolia.

## B-3. Удалить мёртвый код / вынести dev-скрипты
- **Проблема (G-16 / SU-2,3).** `src/actions/get-asko-products.ts` — недостижимый код после `return;` (строки 38–105), запускает `main()` при импорте. `src/actions/analyze-products.ts` — скрипт Google Ads с хардкод-путями.
- **Решение.** Удалить мёртвый блок; перенести оба файла из `src/actions/` в `scripts/` (или удалить, если не нужны). `src/actions/` оставить только под `'use server'` экшены.
- **Критерий.** `src/actions/` не содержит скриптов с побочными эффектами при импорте; `next build` зелёный.

## B-4. Дедупликация `getUserOrders`
- **Проблема (G-13 / O-7).** Две реализации: `src/actions/order.ts:getUserOrders` (без пагинации) и `src/queries/orders.ts:getUserOrders` (с пагинацией).
- **Решение.** Оставить пагинированную в `queries/orders.ts`, удалить из `actions/order.ts`, поправить импорты вызывающих.
- **Критерий.** Один источник; страница `(account)/orders` работает с пагинацией.

## B-5. Локаль-зависимый редирект логина
- **Проблема (A-3 finding).** `lib/auth.ts` → `pages.signIn/error = '/uk/login'` (хардкод локали).
- **Решение.** Использовать middleware/относительный путь, чтобы `ru`-пользователь попадал на `/ru/login`. Минимум — задокументировать, оптимум — формировать по текущей локали.
- **Критерий.** Незалогиненный `ru`-пользователь редиректится на `ru`-логин.

## B-6. Синхронизация `.env.example` ↔ `env.ts`
- **Проблема (G-15).** Cloudinary-ключи валидируются, но нет в примере; Anthropic/Content Factory в примере, но не валидируются.
- **Решение.** Свести единый список (выполнять с A-5). Добавить недостающие в `.env.example` с комментариями.
- **Критерий.** Набор ключей в `.env.example` = в `env.ts`.

## B-7. Доставка/скидки: явная конфигурация вместо `0`
- **Проблема (G-21).** В `createOrder` захардкожены `shipping=0`, `discount=0`.
- **Решение.** Вынести в конфиг/настройку (бесплатная доставка от суммы, фикс-тариф) и/или связать с A-1 (промокоды). Минимум — явная константа с TODO и местом расчёта.
- **Критерий.** Стоимость доставки берётся из конфигурации, а не магического `0`.

## B-8. Единый источник конфигурации фильтров
- **Проблема (G-7 / C-3).** Дублирование: `lib/catalog-data.ts:categoryFilters` и `lib/catalog-filter-config.ts:categoryFilterConfig` описывают фильтры по-разному.
- **Решение.** Свести в один конфиг (тип/порядок/лейблы/единицы/quickLinks), остальное — производные. Обновить потребителей.
- **Критерий.** Один источник конфигурации фильтров; поведение каталога не изменилось.

## B-9. Аудит прочих `dangerouslySetInnerHTML`
- **Проблема (B-9).** Кроме описания товара (A-2) есть 4 использования.
- **Решение.** Подтвердить безопасность: `breadcrumbs.tsx:32` и `product-schema.tsx:79` — JSON-LD (`JSON.stringify`, ок), `assistant-character.tsx:240` — `<style>` (статичный CSS, ок), `layout.tsx:80` — проверить, что инъекция темы из контролируемого источника (не из пользовательского ввода).
- **Критерий.** Зафиксировано, что ни одно из 4 не принимает пользовательский HTML.

---

# ЧАСТЬ C — Как вести «массово»

1. **Ветки:** `fix/critical-*` по каждой P0; один `chore/cosmetic-cleanup` на весь Часть B.
2. **Порядок:** A-2 → A-5+B-6 → весь Часть B (батч) → A-3 → A-4 → A-1.
3. **Регрессия без тестов (пока A-3 не готов):** обязательны `npm run lint`, `tsc --noEmit`, `next build`, ручной smoke ключевых страниц (каталог/товар/корзина/checkout/admin) — можно `/gstack` или `/browse`.
4. **После A-3:** прогон Vitest + Playwright в CI на каждый PR.
5. **Связь с продуктовыми решениями:** A-1 (Q1), B-1 (Q10), B-7 (доставка) — закрыть вопросы из `_reversa_sdd/questions.md` перед стартом соответствующих задач.

## Приложение — трассировка к находкам
| Задача | Находки (`gaps.md`) |
|--------|---------------------|
| A-1 | G-1 |
| A-2 | G-2 |
| A-3 | G-3 |
| A-4 | G-4, G-6 (C-2) |
| A-5 | G-5, G-15 (CI-3/CI-4) |
| B-1 | G-20 |
| B-2 | G-22 |
| B-3 | G-16 (SU-2/SU-3) |
| B-4 | G-13 (O-7) |
| B-5 | A-3 (auth) |
| B-7 | G-21 |
| B-8 | G-7 (C-3) |
| B-9 | — (аудит к G-2) |
