# Задачи — модуль `cart-checkout-orders`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-ORD-1** Двухрежимная корзина + merge при входе.
  - Легаси: `actions/cart.ts`. Готово: cookie↔DB, `mergeCartIfNeeded`, клэмпинг qty. 🟢
- [ ] **T-ORD-2** `createOrder` — атомарная транзакция.
  - Легаси: `actions/order.ts:createOrder`. Готово: идемпотентность, списание стока, нумерация, снапшоты, очистка корзины. 🟢
- [ ] **T-ORD-3** Гонко-безопасное списание стока.
  - Легаси: `order.ts:147-165`. Готово: условный `updateMany`, throw при недостатке. 🟢
- [ ] **T-ORD-4** Нумерация заказа.
  - Легаси: `order.ts:170`, модель `OrderCounter`. Готово: `ORD-YYYY-NNNNN` без коллизий. 🟢
- [ ] **T-ORD-5** Запросы заказов с проверкой владения + пагинация.
  - Легаси: `queries/orders.ts`. Готово: ownership-guard; убрать дубль с `actions/order.ts:getUserOrders` (O-7). 🟡
- [ ] **T-ORD-6** Zustand UI (drawer/version) + компоненты корзины/чекаута.
  - Легаси: `store/cart-store.ts`, `components/cart/*`. Готово: drawer, чек-аут форма. 🟢
- [ ] **T-ORD-7** (Долг) Интеграция онлайн-оплаты + webhook (`PAYMENT_*`).
  - Легаси: env `PAYMENT_*` (нет рантайма). Готово: инициация платежа, обновление `paymentStatus`. 🔴
- [ ] **T-ORD-8** (Долг) Расчёт доставки/промокодов; привязка `Address`.
  - Легаси: `order.ts` (`shipping=0`,`discount=0`,addressId null). Готово: реальная доставка/скидки. 🔴
