# ТЗ — Стадия 2: Масштаб + доведённая коммерция (спринт-уровень)

> Дата: 2026-06-01. Развёртка Стадии 2 из `TZ_ENTERPRISE_ROADMAP_2026-06-01.md`.
> **Предусловие:** закрыта Стадия 1 (тесты/CI/пулинг/observability) — она страхует эти изменения. Решение **Q1** (платёжный провайдер) принято.
> Правила: `MASTER_CONTEXT`+addendum, §0 anti-regression (**расширять `createOrder`, не переписывать**), без `any`, `select`+`take`, `lint`/`tsc`/`build` зелёные.
> **Цель/Exit-SLA:** онлайн-продажи end-to-end; поиск/фасеты держат масштаб; тяжёлые задачи async; доступность ≥99.9%.
> Порядок: **E2.6 (очереди) → E2.7 (Redis) → E2.1 (платежи) ∥ E2.2 (доставка) → E2.4 (письма) → E2.5 (Algolia) ∥ E2.8 (OMS) → E2.3 (RMA)**. Очереди раньше — они разблокируют async для платежей/писем/reindex/эмбеддингов.

---

## E2.6 — Очереди фоновых задач 🔴 (делать первой — разблокирует остальное)
**Выбор:** **Inngest** (serverless-friendly, ретраи/шаги/наблюдаемость «из коробки») ИЛИ Upstash QStash ИЛИ BullMQ+Redis. Рекомендация для Vercel — **Inngest**.

### Задачи
- `src/lib/jobs/` + `app/api/inngest/route.ts` (обработчик). Зарегистрировать функции:
  - `feed/regenerate` (Merchant-фид по локали), `algolia/reindex`, `supplier/sync`, `assistant/embed-docs` (RAG-эмбеддинги), `email/send`, `image/process`.
- Каждая задача: **идемпотентна**, ретраи с backoff, dead-letter, таймауты; не дублировать побочки.
- Триггеры: события (`order.created`→email, `product.updated`→algolia/feed), cron (supplier sync, feed refresh).
- Псевдокод:
```ts
export const onOrderCreated = inngest.createFunction(
  { id: 'order-created-emails', retries: 4 },
  { event: 'order/created' },
  async ({ event, step }) => {
    await step.run('send-confirmation', () => sendOrderConfirmation(event.data.orderId))
  }
)
```
### Приёмка
- Тяжёлые операции не блокируют HTTP-запрос; ретраи/DLQ работают; дашборд очереди виден.

---

## E2.7 — Redis / Upstash (точечно) 🟡
### Задачи
- `@upstash/ratelimit` + `@upstash/redis`; env `UPSTASH_REDIS_REST_URL/TOKEN` (в `env.ts`/`.env.example`).
- **Заменить DB-скан rate-limit** в `app/api/assistant/chat/route.ts` на sliding-window:
```ts
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1, '2 s') })
const { success } = await ratelimit.limit(`assistant:${ipHash}`)
if (!success) return NextResponse.json({ error: '...' }, { status: 429 })
```
- Хешировать IP (без «голого» PII — связка с E1.4).
- (Опц.) кэш общих вычислений между инстансами, если понадобится.
### Приёмка
- Rate-limit без обращения к БД; нет PII; 429 корректен.

---

## E2.1 — Платежи 🔴 (см. `TZ_FIXES_MASTER` A-1) ⛔Q1
**Не переписывать `createOrder`** — расширить поверх существующей транзакции.

### Задачи
- `src/lib/payment.ts` (провайдер-независимый контракт):
  - `createPayment(order): { redirectUrl | widgetData, providerOrderId }` (подпись `PAYMENT_SECRET_KEY`, сумма `order.total`, `merchantOrderId = order.number`).
  - `verifyWebhook(payload, signature): boolean` (`PAYMENT_WEBHOOK_SECRET`).
  - `mapProviderStatus(s): PaymentStatus`.
  - Адаптер под выбранного провайдера (LiqPay/Mono/WayForPay); **рассрочки** `MONOBANK_PARTS`/`PRIVAT_PARTS`.
- `app/api/webhooks/payment/route.ts` (POST, по §9): `verifyWebhook` → найти заказ по `number` → **идемпотентно** обновить `paymentStatus` (защита от повторной доставки по `providerOrderId`) → при PAID опц. `status: PENDING→CONFIRMED` → `revalidateTag`.
- В `createOrder` ПОСЛЕ commit: для `CARD_ONLINE`/parts → `createPayment`, вернуть `redirectUrl`; для `CASH_ON_DELIVERY` — без изменений.
- Checkout: при `redirectUrl` — редирект/виджет; `order-success` показывает статус оплаты.
- **Возвраты:** `refundPayment(order)` (связь с RMA E2.3).
- ENV: `PAYMENT_PROVIDER`, ключи — в `env.ts`/`.env.example`.
- 🔒 **PCI:** только hosted/redirect/widget — НЕ принимать данные карт на своём бэке.
### Приёмка
- `CARD_ONLINE`/рассрочка проходят; webhook идемпотентен (повтор не двоит); невалидная подпись → 400; `CASH_ON_DELIVERY` не инициирует онлайн-оплату; суммы сходятся.

---

## E2.2 — Доставка (Нова Пошта) 🔴
### Задачи
- `src/lib/shipping/novaposhta.ts`: `searchCities(q)`, `getWarehouses(cityRef)`, `calculateCost({cityRef, weight, cost})` (NP API, ключ в env).
- Кэш справочников городов/отделений (через очередь/cron refresh — E2.6; не дёргать NP на каждый рендер).
- Checkout (`checkout-form.tsx`): выбор города/отделения/почтомата, расчёт стоимости/срока; заменить `shipping=0` в `createOrder` на реальную стоимость.
- Данные доставки → `shippingDetails` в `product-schema`/фиде (заменить хардкод 80₴).
- (Опц.) Укрпошта вторым методом; создание ТТН при отгрузке (admin).
### Приёмка
- Реальная стоимость/срок; выбор отделения; `Order.shipping` корректен; schema/фид используют реальные данные.

---

## E2.4 — Транзакционные письма 🟡 (база `lib/email.ts` есть)
### Задачи
- Lifecycle через очередь (E2.6): `order.created`→подтверждение; `order.status.changed`→уведомление; `order.shipped`→ТТН/трек; `return.*`→RMA.
- Шаблоны (React Email или HTML) в `lib/email/templates/`; локализация uk/ru; бренд `Electronom`.
- Resend; не падать из-за письма (try/catch + ретрай в очереди).
### Приёмка
- Письма уходят на ключевые события; локализованы; сбой почты не валит заказ; в очереди есть ретраи.

---

## E2.5 — Фасеты → Algolia 🔴 (снимает потолок №1)
### Задачи
- **Индекс:** в `syncProductIndex` добавить в record `attributes` как Algolia-атрибуты для facetFilters; настроить `attributesForFaceting` (brand, inStock, price, динамические атрибуты), `customRanking`.
- **Заменить in-memory фасеты:** вместо `getCategoryFacets` (`take:50000`) — запрос Algolia с `facets:['*']` + `facetFilters` → реактивные счётчики из движка. Цена — через `numericFilters`/facets stats.
- **Instant-search** UI (algoliasearch v5 / InstantSearch) для `/search` и фасет-сайдбара (debounce; синонимы электротерминов; опечатки).
- **Полная переиндексация** (bulk) как job (E2.6); пересинк на `product.updated`.
- Сохранить **Prisma-fallback** на случай недоступности Algolia.
- Убедиться: канонические URL фасетов (контракт `catalog-filter-url`) не сломаны; whitelisted quick-links/индексация (WP-2) работают на новых данных.
### Приёмка
- Категория >50k товаров без OOM; счётчики из Algolia = факту; мгновенный поиск; reindex по событию; fallback работает.

---

## E2.8 — Order Management (admin) 🟡
### Задачи
- **Guard переходов `OrderStatus`** — таблица/функция допустимых переходов:
```ts
const ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED','CANCELLED'], CONFIRMED: ['PROCESSING','CANCELLED'],
  PROCESSING: ['SHIPPED','CANCELLED'], SHIPPED: ['DELIVERED'], DELIVERED: ['REFUNDED'],
  CANCELLED: [], REFUNDED: [],
}
```
  В `updateOrderStatusAdmin`: проверять переход, иначе ошибка.
- **Аудит** (модель `AuditLog` из E1.4) на смену статуса/правки.
- Массовые операции (статус, экспорт CSV), фильтры; уведомления клиенту (E2.4) на смену.
### Приёмка
- Недопустимый переход отклоняется; история/аудит ведётся; bulk-операции и экспорт работают.

---

## E2.3 — Возвраты / RMA 🟡
### Задачи
- Модель: `ReturnRequest { id, orderId, userId?, items Json, reason, status ReturnStatus, createdAt }`, enum `ReturnStatus { REQUESTED, APPROVED, REJECTED, REFUNDED }`.
- Действия: клиент создаёт заявку (из заказа), админ одобряет/отклоняет → `refundPayment` (E2.1) при возврате средств; статусы; письма (E2.4).
- Связь с `MerchantReturnPolicy` (14 дней) — окно возврата.
### Приёмка
- Клиент оформляет возврат в окне; админ обрабатывает; возврат средств инициируется; статус и письма корректны.

---

## Definition of Done (Стадия 2)
- [ ] Очереди: тяжёлые задачи async, ретраи/DLQ, мониторинг.
- [ ] Платежи: онлайн+рассрочка end-to-end, идемпотентный webhook, возвраты.
- [ ] Доставка НП: расчёт/выбор отделения, реальный `shipping`.
- [ ] Письма: lifecycle через очередь, локализованы.
- [ ] Фасеты в Algolia: нет in-memory 50k, instant-search, fallback.
- [ ] OMS: guard переходов, аудит, bulk; RMA работает.
- [ ] Нагрузка (k6) держится; доступность ≥99.9%; `lint`/`tsc`/`test`/`build` зелёные.

## Зависимости / трассировка
- E2.6 раньше E2.1/E2.4/E2.5 (async). E2.7 — после Redis/Upstash. Платежи ↔ Q1; shippingDetails ↔ E2.2; RMA ↔ платежи.
- Связано: `TZ_FIXES_MASTER` (A-1), `ADDENDUM_GOOGLE_SHOPPING` (фид/availability/shipping), `TZ_GOOGLE_SHOPPING`, `TZ_SEO_TOP10` (фасет-лендинги при миграции в Algolia), `_reversa_sdd/architecture.md`.
