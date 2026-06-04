# Машины состояний — Elektronom

> Артефакт агента **Detective** (`completo`) · Reversa · Mermaid.
> 🟢 значения статусов — из enum (схема); 🟡 переходы — выведены (явной машины переходов в коде нет, статусы меняет `updateOrderStatusAdmin` без ограничений).

## 1. Заказ — `OrderStatus`

Значения (🟢): `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.

```mermaid
stateDiagram-v2
  [*] --> PENDING: createOrder
  PENDING --> CONFIRMED: подтверждение (admin)
  PENDING --> CANCELLED: отмена
  CONFIRMED --> PROCESSING: сборка
  CONFIRMED --> CANCELLED
  PROCESSING --> SHIPPED: отправка
  PROCESSING --> CANCELLED
  SHIPPED --> DELIVERED: вручено
  DELIVERED --> REFUNDED: возврат
  CANCELLED --> [*]
  REFUNDED --> [*]
  DELIVERED --> [*]
```

> 🔴 **Лакуна:** `updateOrderStatusAdmin(orderId, status)` принимает **любой** `OrderStatus` без проверки допустимости перехода. Диаграмма — рекомендуемая модель, а не реализованное ограничение. Также `DELIVERED` влияет на `verifiedPurchase` отзывов (BR-PR-4).

## 2. Оплата — `PaymentStatus`

Значения (🟢): `PENDING`, `PAID`, `FAILED`, `REFUNDED`.

```mermaid
stateDiagram-v2
  [*] --> PENDING: createOrder
  PENDING --> PAID: успешная оплата
  PENDING --> FAILED: ошибка оплаты
  FAILED --> PENDING: повтор
  PAID --> REFUNDED: возврат средств
  PAID --> [*]
```

> 🔴 В рантайме переходы `PaymentStatus` **не инициируются** (нет интеграции онлайн-оплаты/webhook). Остаётся `PENDING` (BR-ORD-7).

## 3. Видимость отзыва — `Review.isVisible`

```mermaid
stateDiagram-v2
  [*] --> Hidden: submitProductReview (isVisible=false)
  Hidden --> Visible: toggleReviewVisibilityAdmin (одобрение)
  Visible --> Hidden: toggleReviewVisibilityAdmin
  Hidden --> [*]: deleteReviewAdmin
  Visible --> [*]: deleteReviewAdmin
```

## 4. Активность товара — `Product.isActive`

```mermaid
stateDiagram-v2
  [*] --> Active: создание (saveProductAdmin)
  Active --> Inactive: toggleProductActiveAdmin → revalidate + удаление из Algolia
  Inactive --> Active: toggleProductActiveAdmin → апсерт в Algolia
```

> 🟢 Переход в `Inactive` синхронно удаляет товар из поискового индекса; обратно — апсертит (BR-IDX-1).

## 5. Жизненный цикл корзины (гость ↔ авторизованный)

```mermaid
stateDiagram-v2
  [*] --> Cookie: гость (httpOnly cookie 30д)
  Cookie --> DB: вход → mergeCartIfNeeded → CartItem, очистка cookie
  DB --> Ordered: createOrder (очистка в транзакции)
  Cookie --> Ordered: createOrder (очистка cookie)
  Ordered --> [*]
```

## Методические замечания
- Машины 1–2 описывают **домен enum**; их переходы не закодированы как guard'ы — это риск (несогласованные статусы возможны вручную).
- Рекомендация Architect/Writer: вынести допустимые переходы `OrderStatus` в явную таблицу/функцию-guard.
