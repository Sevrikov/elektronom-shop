# Flowcharts — модуль `cart-checkout-orders`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. `createOrder` — оформление с атомарной транзакцией

```mermaid
flowchart TD
  A[createOrder data] --> B[zod валидация]
  B -- invalid --> E0[error Некоректні дані]
  B --> C{idempotencyKey есть<br/>и заказ найден?}
  C -- да --> R0[return existing orderNumber]
  C -- нет --> D{авторизован?}
  D -- да --> D1[cartItems из БД take 50]
  D -- нет --> D2[cartItems из cookie]
  D1 & D2 --> F{корзина пуста?}
  F -- да --> E1[error Кошик порожній]
  F --> G[Загрузка isActive товаров]
  G --> H{count == productIds?}
  H -- нет --> E2[error Деякі товари недоступні]
  H --> T[BEGIN $transaction]
  T --> T1[Для каждой позиции:<br/>updateMany where stock>=qty decrement]
  T1 --> T2{count==0?}
  T2 -- да --> RB[throw Недостатньо товару → ROLLBACK]
  T2 -- нет --> T3[orderCounter.upsert year increment]
  T3 --> T4[number = ORD-YYYY-NNNNN]
  T4 --> T5[order.create + items snapshot + customerData]
  T5 --> T6{авторизован?}
  T6 -- да --> T7[cartItem.deleteMany — очистка корзины]
  T6 -- нет --> T8[skip]
  T7 & T8 --> CT[COMMIT]
  CT --> U[гость: clearCartCookie]
  U --> V[revalidateTag cart + cookie last_created_order 5мин]
  V --> S[success orderNumber]
```

## 2. Жизненный цикл корзины (гость ↔ авторизованный)

```mermaid
stateDiagram-v2
  [*] --> Guest: нет сессии
  Guest --> Guest: addToCart → cookie (qty≤min(stock,99))
  Guest --> Merge: вход в аккаунт
  Merge --> DB: mergeCartIfNeeded (cookie→CartItem, clear cookie)
  DB --> DB: add/update/remove → таблица CartItem
  DB --> Order: createOrder (очистка в транзакции)
  Guest --> Order: createOrder (очистка cookie)
  Order --> [*]
```

## 3. Статусы заказа и оплаты (enum-домен)

```mermaid
flowchart LR
  subgraph OrderStatus
    P[PENDING] --> CF[CONFIRMED] --> PR[PROCESSING] --> SH[SHIPPED] --> DE[DELIVERED]
    P -.-> CA[CANCELLED]
    CF -.-> CA
    DE -.-> RE[REFUNDED]
  end
  subgraph PaymentStatus
    PP[PENDING] --> PD[PAID]
    PP --> PF[FAILED]
    PD --> PRf[REFUNDED]
  end
```

## Примечания
- Переходы статусов (диаграмма 3) выведены из enum — фактические переходы задаются в admin (модуль admin), здесь показан логичный домен 🟡.
- `paymentStatus` остаётся PENDING (онлайн-оплата в `createOrder` не инициируется, находка O-8).
