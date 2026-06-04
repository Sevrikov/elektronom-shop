# C4 — Уровень 2: Контейнеры (Elektronom)

> Артефакт **Architect** (`completo`) · Mermaid · 🟢/🟡.

```mermaid
flowchart TB
  browser[Браузер<br/>RSC + Client Components, Zustand UI, Tailwind 4]

  subgraph vercel[Vercel — Next.js 16]
    web[Web-приложение<br/>App Router, RSC, Server Actions]
    api[Route Handlers<br/>/api/assistant/chat, /api/admin/upload, /api/auth]
    inst[instrumentation.ts<br/>наблюдаемость]
  end

  db[(PostgreSQL 16<br/>Prisma 7 + adapter-pg)]
  algolia[[Algolia<br/>products_uk / products_ru]]
  cloud[[Cloudinary<br/>media]]
  claude[[Anthropic API]]
  cf[[Content Factory API]]
  resend[[Resend]]

  browser -->|HTTP / RSC payload| web
  browser -->|fetch JSON| api
  browser -->|server action| web
  web -->|Prisma| db
  api -->|Prisma| db
  web -->|search / sync| algolia
  api -->|upload/delete| cloud
  web -->|upload| cloud
  api -->|/v1/messages| claude
  web -->|REST + token| cf
  web -.->|email 🟡| resend
```

## Контейнеры

| Контейнер | Технология | Ответственность |
|-----------|-----------|-----------------|
| Web-приложение | Next.js 16 RSC + Server Actions | Страницы, доменная логика, команды/запросы |
| Route Handlers | Next.js API routes | AI-чат, загрузка изображений, NextAuth |
| PostgreSQL | Postgres 16 + Prisma 7 (adapter-pg) | Хранилище данных |
| Поисковый индекс | Algolia (2 индекса по локали) | Полнотекстовый поиск (fallback — Prisma) |
| Медиа | Cloudinary (+ локальный `public/uploads` в dev) | Хранение/обработка изображений |
| AI | Anthropic Claude (raw fetch) | Технический ассистент |
| Content Factory | Внешний REST-сервис | AI-генерация описаний |
| Email | Resend | Транзакционные письма (🟡 точки вызова не подтверждены) |

> Нет отдельных контейнеров очередей/кэша/воркеров — кэш данных реализован средствами Next.js (`'use cache'`), фоновых задач нет.
