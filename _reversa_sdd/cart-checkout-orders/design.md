# Дизайн — модуль `cart-checkout-orders`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `actions/cart.ts` — cookie/DB корзина, `mergeCartIfNeeded`, `getCart`, `getCartCount`, `addToCart`, `updateCartQuantity`, `removeFromCart`, `clearCart`.
- `actions/order.ts` — `createOrder` (транзакция), `getUserOrders`.
- `queries/orders.ts` — `getOrderByNumber` (ownership), `getUserOrders` (пагинация).
- `store/cart-store.ts` — Zustand UI (drawer, cartVersion).
- `components/cart/*`, страницы `(shop)/cart|checkout|order-success`, `(account)/orders[/[number]]`.

## Поток `createOrder` (см. `flowcharts/cart-checkout-orders.md`)
zod → idempotency-guard → источник позиций (cookie/DB) → проверка наличия → **$transaction**{ условное списание стока → `OrderCounter.upsert` → `Order`+`OrderItem` снапшоты → очистка DB-корзины } → очистка cookie → `revalidateTag('cart')` → cookie `last_created_order`.

## Алгоритмы
- **Оптимистичная блокировка стока:** `updateMany where {id, stock≥qty} decrement`; `count===0` → throw → rollback.
- **Нумерация:** `OrderCounter.upsert({year})` increment → pad5.
- **Merge корзины:** `qty=min(existing+new, stock, 99)`.

## Структуры
`CartCookieItem {productId,quantity}`, `CartItem` (обогащённый), `CreateOrderSchema` (контакты+адрес+`paymentMethod`+`idempotencyKey?`), снапшоты `customerData`/`OrderItem.snapshot`.

## Решения
[ADR-0004](../adrs/0004-atomic-order-creation.md), [ADR-0006](../adrs/0006-dual-cart-cookie-db.md), [ADR-0007](../adrs/0007-order-snapshots.md). Статусы — `state-machines.md` §1–2.

## Риски
🔴 оплата/доставка; 🟡 O-5 addressId; 🟡 O-6 гостевые заказы; 🟡 O-7 дубль getUserOrders.
