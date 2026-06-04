# Словарь данных — Elektronom

> Артефакт агента **Archaeologist** (Фаза 2) · Reversa · `doc_level=completo`
> Источник: `prisma/schema.prisma` (PostgreSQL 16 + Prisma 7). Уверенность 🟢 — напрямую из схемы.
> Все таблицы используют `cuid(2)` как PK, `@@map` на snake_case имена таблиц.

## Сводка моделей

| Домен | Модели |
|-------|--------|
| Auth | `User`, `Account`, `Session`, `VerificationToken` |
| User data | `Address` |
| Catalog | `Category`, `CategoryTranslation`, `Brand`, `Product`, `ProductTranslation`, `ProductImage` |
| Social | `Review`, `WishlistItem` |
| Cart | `CartItem` |
| Orders | `Order`, `OrderItem`, `OrderCounter` |
| Assistant/RAG | `TechnicalDocument`, `DocumentChunk`, `AssistantSession`, `AssistantMessage` |
| Suppliers | `SupplierInventory` |

Enum: `UserRole`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`.

---

## Перечисления (enums)

| Enum | Значения | Использование |
|------|----------|---------------|
| `UserRole` | `CUSTOMER` (default), `MANAGER`, `ADMIN` | `User.role` — RBAC |
| `OrderStatus` | `PENDING`→`CONFIRMED`→`PROCESSING`→`SHIPPED`→`DELIVERED`, `CANCELLED`, `REFUNDED` | `Order.status` (жизненный цикл заказа) |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` | `Order.paymentStatus` |
| `PaymentMethod` | `CARD_ONLINE`, `CASH_ON_DELIVERY` (default), `MONOBANK_PARTS`, `PRIVAT_PARTS` | `Order.paymentMethod` (укр. рассрочки Monobank/Privat) |

---

## Catalog

### Category — `categories`
Самореферентное дерево (parent/children), мультиязычные названия в отдельной таблице.

| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| id | String(cuid2) | ✓ | — | PK |
| slug | String | ✓ | — | `@unique`, URL-сегмент |
| parentId | String? | — | — | self-FK `CategoryTree` (дерево) |
| sortOrder | Int | ✓ | 0 | порядок вывода |
| isActive | Boolean | ✓ | true | мягкое скрытие |
| image | String? | — | — | URL картинки категории |
| createdAt/updatedAt | DateTime | ✓ | now/auto | — |

Связи: `parent`/`children` (self), `translations[]`, `products[]`, `technicalDocuments[]`. Индексы: `parentId`, `slug`.

### CategoryTranslation — `category_translations`
| Поле | Тип | Обяз. | Примечания |
|------|-----|:-----:|-----------|
| categoryId | String | ✓ | FK→Category (cascade) |
| locale | String | ✓ | `uk` \| `ru` |
| name | String | ✓ | — |
| description | Text? | — | — |
| metaTitle / metaDesc | String? | — | SEO |

Уникальность: `[categoryId, locale]`.

### Brand — `brands`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| id | String | ✓ | — | PK |
| slug | String | ✓ | — | `@unique` |
| name | String | ✓ | — | бренд **не** переведён (одно имя) |
| logo | String? | — | — | URL |
| isActive | Boolean | ✓ | true | — |

Связи: `products[]`, `technicalDocuments[]`. Индекс: `slug`.

### Product — `products` ⭐ центральная сущность
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| id | String | ✓ | — | PK |
| slug | String | ✓ | — | `@unique` |
| sku | String | ✓ | — | `@unique`, артикул |
| categoryId | String | ✓ | — | FK→Category |
| brandId | String? | — | — | FK→Brand (nullable) |
| price | Decimal(12,2) | ✓ | — | текущая цена |
| comparePrice | Decimal(12,2)? | — | — | «старая» цена (скидка) |
| costPrice | Decimal(12,2)? | — | — | себестоимость (внутр.) |
| stock | Int | ✓ | 0 | остаток |
| isActive | Boolean | ✓ | true | — |
| isFeatured | Boolean | ✓ | false | витрина |
| **attributes** | **Json** | ✓ | `{}` | **JSONB фасеты** (poles, section, viscosity…) |
| sortOrder | Int | ✓ | 0 | — |
| createdAt/updatedAt | DateTime | ✓ | now/auto | — |

Связи: `category`, `brand?`, `translations[]`, `images[]`, `cartItems[]`, `wishlist[]`, `reviews[]`, `orderItems[]`.
Индексы: `categoryId`, `brandId`, `slug`, `sku`, `[isActive,isFeatured]`, `[isActive,createdAt desc]`, `[isActive,sortOrder]`. Доп. GIN-индекс на `attributes` (миграция `add_product_attributes_gin_index`) 🟢.

> 🔴 **Гап:** `qtyBreaks` (оптовые ценовые пороги) есть в mock-данных `catalog-data.ts`, но **отсутствует** в модели Product. Либо фича не доведена до БД, либо хранится в `attributes`. Требует решения.

### ProductTranslation — `product_translations`
Аналогично CategoryTranslation: `productId`+`locale` уникальны; `name`, `description?`, `metaTitle?`, `metaDesc?`.

### ProductImage — `product_images`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| productId | String | ✓ | — | FK→Product (cascade) |
| provider | String | ✓ | `LOCAL` | `CLOUDINARY` \| `LOCAL` \| `EXTERNAL` |
| publicId | String? | — | — | id в Cloudinary |
| url | String | ✓ | — | — |
| width/height/size | Int? | — | — | метаданные (миграция `add_product_image_metadata`) |
| format | String? | — | — | — |
| alt | String? | — | — | — |
| sortOrder | Int | ✓ | 0 | — |

---

## Auth

### User — `users`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| id | String | ✓ | — | PK |
| email | String | ✓ | — | `@unique` |
| name/phone/avatar | String? | — | — | — |
| passwordHash | String? | — | — | null для OAuth-юзеров (bcrypt) |
| role | UserRole | ✓ | CUSTOMER | RBAC |
| createdAt/updatedAt | DateTime | ✓ | now/auto | — |

Связи: accounts, sessions, addresses, cartItems, wishlist, orders, reviews, assistantSessions.

### Account / Session / VerificationToken
Стандартные модели Auth.js (NextAuth). `Account` — OAuth-провайдеры (`@@unique[provider, providerAccountId]`, токены в `@db.Text`). `Session` — `sessionToken @unique`. `VerificationToken` — `@@unique[identifier, token]`. Все каскадно удаляются с User.

### Address — `addresses`
`userId` FK (cascade), `label` (home/work/other), firstName, lastName, phone, city, street, building, apartment?, `isDefault` (Boolean). Связь с `orders[]`.

---

## Social

### Review — `reviews`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| productId/userId | String | ✓ | — | FK (cascade) |
| rating | Int | ✓ | — | 1–5 (валидация в коде) |
| comment/advantages/disadvantages | Text? | — | — | — |
| verifiedPurchase | Boolean | ✓ | false | — |
| isVisible | Boolean | ✓ | false | **премодерация** (по умолчанию скрыт) |

Уникальность `[productId, userId]` — один отзыв на товар от юзера.

### WishlistItem — `wishlist_items`
`[userId, productId]` уникальны; каскад. Просто связка.

---

## Cart

### CartItem — `cart_items`
`userId`+`productId` уникальны (cascade), `quantity` (default 1). **Серверная корзина только для авторизованных** (есть `userId`, нет анонимной). Гостевая корзина — клиентская (zustand, см. модуль cart).

---

## Orders

### Order — `orders`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| number | String | ✓ | — | `@unique`, формат `ORD-YYYY-NNNNN` |
| userId | String? | — | — | FK SetNull (гостевые заказы) |
| addressId | String? | — | — | FK SetNull |
| status | OrderStatus | ✓ | PENDING | — |
| paymentStatus | PaymentStatus | ✓ | PENDING | — |
| paymentMethod | PaymentMethod | ✓ | CASH_ON_DELIVERY | — |
| subtotal/discount/shipping/total | Decimal(12,2) | ✓/0 | — | денежные суммы |
| customerData | Json | ✓ | — | **снапшот** name/email/phone |
| notes | Text? | — | — | — |
| idempotencyKey | String? | — | — | `@unique` — защита от дублей |

### OrderItem — `order_items`
`orderId` FK (cascade), `productId?` FK SetNull, `snapshot` Json (**снапшот** name/sku/image/price на момент заказа), `quantity`, `price` Decimal. → товар можно удалить, заказ сохранит снапшот.

### OrderCounter — `order_counters`
`year` (Int) — PK, `value` (Int) — счётчик. Генерация последовательных номеров заказов по годам (миграция `add_order_counter`). См. бизнес-правило нумерации в модуле orders.

---

## Assistant & RAG

### TechnicalDocument — `technical_documents`
`title`, `fileUrl?`, `fileType?` (PDF/TXT/DOCX), `content?` (Text), `categoryId?`/`brandId?` (SetNull). Источник техдокументации для RAG.

### DocumentChunk — `document_chunks`
`documentId` FK (cascade), `content` (Text), **`embedding` String? (Text)** — *JSON-сериализованный массив float* (эмбеддинг). 🟡 Эмбеддинги хранятся как текст, **не** pgvector → косинусная близость считается в приложении (см. модуль assistant). Индекс только по `documentId`.

### AssistantSession / AssistantMessage
`AssistantSession`: `userId?` (SetNull), messages[]. `AssistantMessage`: `sessionId` (cascade), `role` (USER/ASSISTANT — строка, не enum), `content` (Text), `structured` Json? (рекоменд. товары, предупреждения, источники), `feedback` String? (HELPFUL/UNHELPFUL).

---

## Suppliers

### SupplierInventory — `supplier_inventory`
| Поле | Тип | Обяз. | Default | Примечания |
|------|-----|:-----:|---------|-----------|
| sku | String | ✓ | — | `@unique` — ключ сопоставления с Product.sku |
| mpn | String? | — | — | Manufacturer Part Number |
| supplierSku | String? | — | — | артикул поставщика |
| name | String | ✓ | — | — |
| stock | Int | ✓ | 0 | остаток у поставщика |
| price | Decimal(12,2) | ✓ | — | цена поставщика |
| supplierName | String | ✓ | — | напр. ASKO |

> 🟡 Изолированная таблица (нет FK на Product) — связь по `sku` на уровне приложения (импорт ASKO). См. модуль suppliers.

---

## Сквозные наблюдения по данным

- 🟢 **Денежные суммы** — `Decimal(12,2)` (корректно, не float).
- 🟢 **Снапшоты** в `Order.customerData` и `OrderItem.snapshot` — заказ неизменен при изменении/удалении товара.
- 🟡 **i18n-стратегия:** переводимые сущности (Category, Product) выносят локализуемые поля в `*Translation` таблицы (locale uk/ru); Brand — не переводится.
- 🟡 **JSONB `Product.attributes`** — динамические характеристики (ядро фасетной системы), типобезопасность только на уровне приложения.
- 🔴 **Embedding без pgvector** — потенциальная проблема масштабирования RAG.
- 🔴 **`qtyBreaks`** — расхождение mock ↔ схема.
