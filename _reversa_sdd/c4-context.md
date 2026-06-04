# C4 — Уровень 1: Контекст системы (Elektronom)

> Артефакт **Architect** (`completo`) · Mermaid · 🟢/🟡.

```mermaid
flowchart TB
  customer([👤 Покупатель<br/>гость / CUSTOMER])
  admin([👤 Администратор<br/>ADMIN])

  subgraph s[Elektronom]
    sys[Интернет-магазин электротехники<br/>Next.js 16 · мультиязычный uk/ru]
  end

  db[(PostgreSQL)]
  algolia[Algolia<br/>поиск]
  cloud[Cloudinary<br/>изображения]
  claude[Anthropic Claude<br/>AI-ассистент]
  cf[Content Factory<br/>генерация контента]
  resend[Resend<br/>email]
  oauth[Google / Facebook<br/>OAuth]
  pay[Платёжный провайдер<br/>🔴 не интегрирован]
  asko[ASKO / поставщики<br/>внешние скрипты]

  customer -->|просмотр, заказ, чат| sys
  admin -->|управление, модерация| sys
  sys --> db
  sys -->|search / index| algolia
  sys -->|upload / delete| cloud
  sys -->|/v1/messages| claude
  sys -->|REST + token| cf
  sys -.->|транзакц. письма 🟡| resend
  customer -->|вход| oauth
  oauth --> sys
  sys -.->|🔴 webhook| pay
  asko -.->|остатки/цены (вне приложения)| db
```

## Персоны
- **Гость** — каталог, поиск, гостевая корзина (cookie), оформление заказа, AI-чат.
- **CUSTOMER** — то же + аккаунт, заказы, wishlist, отзывы.
- **ADMIN** — админка (товары/категории/бренды/заказы/модерация/контент).
- *(MANAGER — определён, но не задействован.)*

## Внешние системы
PostgreSQL, Algolia, Cloudinary, Anthropic, Content Factory, Resend, Google/Facebook OAuth; платёжный провайдер и ASKO — на уровне намерения/внешних процессов (🔴/🟡).
