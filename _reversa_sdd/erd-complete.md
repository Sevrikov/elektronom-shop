# ERD — полная модель данных (Elektronom)

> Артефакт **Architect** (`completo`) · Mermaid `erDiagram` · 🟢 из `schema.prisma`.

```mermaid
erDiagram
  User ||--o{ Account : "OAuth"
  User ||--o{ Session : ""
  User ||--o{ Address : ""
  User ||--o{ CartItem : ""
  User ||--o{ WishlistItem : ""
  User ||--o{ Order : "(SetNull)"
  User ||--o{ Review : ""
  User ||--o{ AssistantSession : "(SetNull)"

  Category ||--o{ Category : "parent/children"
  Category ||--o{ CategoryTranslation : ""
  Category ||--o{ Product : ""
  Category ||--o{ TechnicalDocument : "(SetNull)"

  Brand ||--o{ Product : "(optional)"
  Brand ||--o{ TechnicalDocument : "(SetNull)"

  Product ||--o{ ProductTranslation : ""
  Product ||--o{ ProductImage : ""
  Product ||--o{ CartItem : ""
  Product ||--o{ WishlistItem : ""
  Product ||--o{ Review : ""
  Product ||--o{ OrderItem : "(SetNull)"

  Order ||--o{ OrderItem : ""
  Address ||--o{ Order : "(SetNull, не заполняется)"

  TechnicalDocument ||--o{ DocumentChunk : ""
  AssistantSession ||--o{ AssistantMessage : ""

  User {
    string id PK
    string email UK
    string passwordHash "nullable (OAuth)"
    UserRole role "CUSTOMER|MANAGER|ADMIN"
  }
  Category {
    string id PK
    string slug UK
    string parentId FK "self"
    boolean isActive
    int sortOrder
  }
  CategoryTranslation {
    string categoryId FK
    string locale "uk|ru"
    string name
  }
  Brand {
    string id PK
    string slug UK
    string name
  }
  Product {
    string id PK
    string slug UK
    string sku UK
    string categoryId FK
    string brandId FK "nullable"
    decimal price "12,2"
    decimal comparePrice "nullable"
    int stock
    json attributes "JSONB facets"
    boolean isActive
    boolean isFeatured
  }
  ProductTranslation {
    string productId FK
    string locale
    string name
  }
  ProductImage {
    string productId FK
    string provider "CLOUDINARY|LOCAL|EXTERNAL"
    string url
  }
  Review {
    string productId FK
    string userId FK
    int rating "1-5"
    boolean verifiedPurchase
    boolean isVisible "премодерация"
  }
  WishlistItem {
    string userId FK
    string productId FK
  }
  CartItem {
    string userId FK
    string productId FK
    int quantity
  }
  Order {
    string id PK
    string number UK "ORD-YYYY-NNNNN"
    string userId FK "nullable"
    string addressId FK "nullable"
    OrderStatus status
    PaymentStatus paymentStatus
    PaymentMethod paymentMethod
    decimal total "12,2"
    json customerData "snapshot"
    string idempotencyKey UK
  }
  OrderItem {
    string orderId FK
    string productId FK "nullable"
    json snapshot
    int quantity
    decimal price
  }
  OrderCounter {
    int year PK
    int value
  }
  TechnicalDocument {
    string id PK
    string title
    string categoryId FK "nullable"
    string brandId FK "nullable"
  }
  DocumentChunk {
    string documentId FK
    string content
    string embedding "JSON-текст, не pgvector"
  }
  AssistantSession {
    string id PK
    string userId FK "nullable"
  }
  AssistantMessage {
    string sessionId FK
    string role "USER|ASSISTANT"
    json structured "products/sources/costLog/ip"
  }
  SupplierInventory {
    string id PK
    string sku UK
    int stock
    decimal price
    string supplierName
  }
```

## Кардинальности и заметки
- **Category** — самоссылка (дерево). Переводы 1:N (по locale, уникально `[categoryId, locale]`).
- **Product** N:1 Category, N:0..1 Brand; переводы/изображения/отзывы/позиции — 1:N.
- **Order** N:0..1 User (гостевые заказы), N:0..1 Address (**фактически null**, O-5). `OrderItem.productId` SetNull — заказ переживает удаление товара.
- **SupplierInventory** — **изолирована** (нет FK), связь с Product только по `sku` на уровне внешних процессов (🟡 SU-1).
- **DocumentChunk.embedding** — текст (JSON-массив), не векторный тип (🔴 AS-1).
- Уникальные связки: `Review[productId,userId]`, `WishlistItem[userId,productId]`, `CartItem[userId,productId]`, `Account[provider,providerAccountId]`.
