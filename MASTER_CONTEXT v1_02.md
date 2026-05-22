# MASTER_CONTEXT.md
# Глобальный контекст для агентной разработки интернет-магазина (каталога)
# Версия: 1.3 | Стек: Next.js 16 + TypeScript + PostgreSQL + Prisma 7 + Tailwind CSS
# ⚠️ ОБЯЗАТЕЛЕН К ПРОЧТЕНИЮ ПЕРЕД ЛЮБЫМ ДЕЙСТВИЕМ. ОТКЛОНЕНИЯ ЗАПРЕЩЕНЫ.

---

## СОДЕРЖАНИЕ

1. [Идентификация проекта](#1-идентификация-проекта)
2. [Технический стек — жёсткие требования](#2-технический-стек)
3. [Абсолютные запреты](#3-абсолютные-запреты)
4. [Файловая структура проекта](#4-файловая-структура-проекта)
5. [Соглашения по именованию](#5-соглашения-по-именованию)
6. [Схема базы данных (Prisma)](#6-схема-базы-данных)
7. [Стратегия рендеринга по типам страниц](#7-стратегия-рендеринга)
8. [Компонентная архитектура](#8-компонентная-архитектура)
9. [Работа с данными — серверные действия и API](#9-работа-с-данными)
10. [Стилизация (Tailwind CSS)](#10-стилизация)
11. [SEO и микроразметка](#11-seo-и-микроразметка)
12. [Мультиязычность (i18n)](#12-мультиязычность)
13. [Аутентификация и авторизация](#13-аутентификация)
14. [Корзина и заказы](#14-корзина-и-заказы)
15. [Обработка ошибок](#15-обработка-ошибок)
16. [Переменные окружения](#16-переменные-окружения)
17. [Производительность и Core Web Vitals](#17-производительность)
18. [Тестирование](#18-тестирование)
19. [Правила для агентов при написании кода](#19-правила-для-агентов)
20. [Поиск — Algolia](#20-поиск-algolia)

---

## 1. ИДЕНТИФИКАЦИЯ ПРОЕКТА

```
Тип:          Интернет-магазин / каталог товаров
Архитектура:  Monorepo, Next.js App Router
Язык:         TypeScript (строгий режим, strict: true)
Локали:       uk (основная), ru (вторичная)
Валюта:       UAH (₴)
```

**Что строим:** Сайт-каталог с карточками товаров, категориями, фильтрами,
корзиной, оформлением заказа, личным кабинетом и админ-панелью.

**Чего НЕТ в этом проекте:**
- Нет React Native / мобильного приложения
- Нет GraphQL (только REST через Route Handlers и Server Actions)
- Нет Redux / MobX (только Zustand для клиентского состояния)
- Нет CSS Modules / styled-components (только Tailwind CSS)
- Нет Pages Router (только App Router)

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

### ОБЯЗАТЕЛЬНЫЙ СТЕК — не обсуждается, не заменяется

| Слой | Технология | Версия | Запрещённые альтернативы |
|------|-----------|--------|--------------------------|
| Фреймворк | Next.js | 16.x | Remix, Nuxt, Vite SPA |
| Язык | TypeScript | 5.x | JavaScript (*.js файлы запрещены) |
| БД | PostgreSQL | 16.x | MySQL, MongoDB, SQLite |
| ORM | Prisma | 7.x | TypeORM, Drizzle, raw SQL |
| Стили | Tailwind CSS | 4.x | Bootstrap, MUI, Ant Design, CSS Modules |
| Состояние (клиент) | Zustand | 5.x | Redux, MobX, Jotai, Context для глобального стейта |
| Формы | React Hook Form + Zod | latest | Formik, yup |
| Изображения | next/image | встроен | <img> без next/image |
| Шрифты | next/font | встроен | Google Fonts через <link> в <head> |
| Аутентификация | NextAuth.js v5 | 5.x | Clerk, Auth0, самописная JWT |
| Email | Resend | latest | Nodemailer, SendGrid |
| Поиск (опционально) | Algolia | latest | Elasticsearch (только если > 50k SKU) |
| i18n | next-intl | latest | next-i18next, react-i18next |
| Тесты | Vitest + Playwright | latest | Jest, Cypress |

### Prisma 7 — обязательные правила проекта

Этот проект использует **Prisma 7.x**. Не откатывать на Prisma 5.x без отдельного решения и обновления этого документа.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

```typescript
// prisma.config.ts — обязателен для Prisma 7 CLI
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

Правила:
- Prisma Client импортируется из сгенерированного клиента: `@/generated/prisma/client`.
- Для PostgreSQL используется driver adapter `@prisma/adapter-pg`.
- Единственный runtime singleton находится в `src/lib/prisma.ts`.
- `new PrismaClient()` разрешён только в `src/lib/prisma.ts` и технических скриптах вроде `prisma/seed.ts`.
- Сгенерированный каталог `src/generated/prisma` не редактировать руками и не коммитить, если он игнорируется `.gitignore`.
- ID по умолчанию — `cuid2()`, не `cuid()`.

### Конфигурация TypeScript (tsconfig.json) — не изменять

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Конфигурация Next.js (next.config.ts) — базовая, не сокращать

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ Next.js 16: cacheComponents заменяет experimental.ppr из Next.js 15
  // Включает явное кэширование через 'use cache' + PPR
  // ⛔ experimental.ppr УДАЛЁН в Next.js 16 — не использовать
  cacheComponents: true,

  // ✅ React Compiler — стабилен в Next.js 16, автоматическая мемоизация
  reactCompiler: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Добавлять только реальные домены изображений
      {
        protocol: 'https',
        hostname: 'images.prom.ua',
        pathname: '**',
      },
    ],
  },

  // ✅ Next.js 16.2: пробрасывает console.error браузера в терминал
  // Полезно для агентов и отладки
  logging: {
    fetches: { fullUrl: true },
    browserToTerminal: 'error',
  },

  // ✅ Turbopack стабилен в Next.js 16 и используется по умолчанию
  // Не нужно флага --turbopack в scripts
  // typedRoutes остался
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
```

> ⚠️ **Turbopack по умолчанию:** в Next.js 16 Turbopack стабилен и используется
> для `next dev` и `next build` без дополнительных флагов. Удали `--turbopack`
> из `package.json` если он там есть — он больше не нужен.

---

## 3. АБСОЛЮТНЫЕ ЗАПРЕТЫ

> ⛔ Нарушение любого из этих правил требует немедленной остановки и пересмотра.

### 3.1 Запреты TypeScript

```typescript
// ⛔ ЗАПРЕЩЕНО — использование any
const data: any = await fetch(...)
function process(item: any) {}

// ✅ ПРАВИЛЬНО — явные типы или unknown с сужением
const data: Product = await fetch(...)
function process(item: unknown) {
  if (isProduct(item)) { ... }
}

// ⛔ ЗАПРЕЩЕНО — type assertion без проверки
const user = response as User

// ✅ ПРАВИЛЬНО — Zod парсинг
const user = UserSchema.parse(response)

// ⛔ ЗАПРЕЩЕНО — non-null assertion без гарантии
const name = user!.name

// ✅ ПРАВИЛЬНО — явная проверка
if (!user) throw new Error('User not found')
const name = user.name

// ⛔ ЗАПРЕЩЕНО — @ts-ignore и @ts-expect-error без объяснения
// @ts-ignore
someCall()

// ✅ ДОПУСТИМО только с комментарием причины
// @ts-expect-error: библиотека X не экспортирует тип Y, issue #1234
someCall()
```

### 3.2 Запреты компонентов

```typescript
// ⛔ ЗАПРЕЩЕНО — 'use client' на корневых layout и page файлах
// app/layout.tsx — НИКОГДА не добавлять 'use client'
// app/page.tsx — НИКОГДА не добавлять 'use client' без крайней необходимости

// ⛔ ЗАПРЕЩЕНО — fetch данных в Client Components
'use client'
export default function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(...) // ⛔ ЗАПРЕЩЕНО
  }, [])
}

// ✅ ПРАВИЛЬНО — данные в Server Component, передача вниз
// app/products/page.tsx (Server Component)
export default async function ProductsPage() {
  const products = await getProducts() // серверный вызов
  return <ProductList products={products} />
}

// ⛔ ЗАПРЕЩЕНО — прямые запросы к БД в Client Components
'use client'
import { prisma } from '@/lib/prisma' // ⛔ prisma нельзя импортировать в клиент

// ⛔ ЗАПРЕЩЕНО — useState/useEffect для данных, которые можно получить на сервере
```

### 3.3 Запреты работы с БД

```typescript
// ⛔ ЗАПРЕЩЕНО — прямые SQL запросы через $queryRaw без крайней нужды
await prisma.$queryRaw`SELECT * FROM products`

// ⛔ ЗАПРЕЩЕНО — запросы к БД без limit (N+1 и OOM)
const products = await prisma.product.findMany() // без take — ЗАПРЕЩЕНО

// ✅ ПРАВИЛЬНО — всегда с лимитом
const products = await prisma.product.findMany({ take: 24, skip: offset })

// ⛔ ЗАПРЕЩЕНО — вложенные include без select (утечка данных)
const product = await prisma.product.findUnique({
  where: { id },
  include: { category: true, images: true } // возвращает ВСЕ поля
})

// ✅ ПРАВИЛЬНО — select только нужных полей
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    id: true, name: true, slug: true, price: true,
    category: { select: { name: true, slug: true } },
    images: { select: { url: true, alt: true }, take: 5 }
  }
})

// ⛔ ЗАПРЕЩЕНО — создание нового экземпляра Prisma в runtime-коде приложения
const prisma = new PrismaClient() // ⛔ только в src/lib/prisma.ts; исключение — технические scripts/seed

// ⛔ ЗАПРЕЩЕНО — мутации БД в GET-обработчиках
```

### 3.4 Запреты безопасности

```typescript
// ⛔ ЗАПРЕЩЕНО — передавать данные из БД напрямую в ответ без select
export async function GET() {
  const user = await prisma.user.findUnique({ where: { id } })
  return Response.json(user) // ⛔ утечка passwordHash, email и т.д.
}

// ✅ ПРАВИЛЬНО — явный select или DTO
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, avatar: true }
})

// ⛔ ЗАПРЕЩЕНО — секреты в коде или .env файлах в репозитории
const SECRET = 'my-secret-key' // ⛔ ЗАПРЕЩЕНО в коде

// ⛔ ЗАПРЕЩЕНО — отсутствие проверки авторизации в Server Actions
async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } }) // ⛔ без проверки роли
}

// ✅ ПРАВИЛЬНО
async function deleteProduct(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')
  await prisma.product.delete({ where: { id } })
}

// ⛔ ЗАПРЕЩЕНО — принимать id из URL без валидации типа
const id = params.id // может быть undefined или невалидной строкой
await prisma.product.findUnique({ where: { id } }) // ⛔

// ✅ ПРАВИЛЬНО
const id = z.string().min(1).parse(params.id)
```

### 3.5 Запреты стилизации

```typescript
// ⛔ ЗАПРЕЩЕНО — inline стили через style={{}}
<div style={{ marginTop: '16px', color: 'red' }}>

// ✅ ПРАВИЛЬНО — Tailwind классы
<div className="mt-4 text-red-500">

// ⛔ ЗАПРЕЩЕНО — магические числа в Tailwind
<div className="mt-[17px] text-[13.5px]">  // ⛔ если есть стандартное значение

// ✅ ПРАВИЛЬНО — стандартные Tailwind токены
<div className="mt-4 text-sm">

// ⛔ ЗАПРЕЩЕНО — импорт сторонних CSS фреймворков
import 'bootstrap/dist/css/bootstrap.min.css'

// ⛔ ЗАПРЕЩЕНО — использование тегов <style> в компонентах
```

---

## 4. ФАЙЛОВАЯ СТРУКТУРА ПРОЕКТА

> ⚠️ Эта структура обязательна. Создавать файлы вне неё — запрещено без явного согласования.

```
project-root/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Языковой сегмент (uk, ru)
│   │   │   ├── layout.tsx            # Корневой layout с locale
│   │   │   ├── page.tsx              # Главная страница
│   │   │   ├── (shop)/               # Route group — магазин
│   │   │   │   ├── catalog/
│   │   │   │   │   ├── page.tsx      # Каталог (SSG)
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Категория (SSG/ISR)
│   │   │   │   ├── product/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Карточка товара (ISR)
│   │   │   │   ├── cart/
│   │   │   │   │   └── page.tsx      # Корзина (SSR)
│   │   │   │   └── checkout/
│   │   │   │       └── page.tsx      # Оформление заказа (SSR)
│   │   │   ├── (account)/            # Route group — личный кабинет
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   └── (auth)/               # Route group — авторизация
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── (admin)/                  # Админка — без locale prefix
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   ├── api/                      # Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── payment/
│   │   │           └── route.ts
│   │   ├── sitemap.ts                # Авто-генерация sitemap
│   │   ├── robots.ts                 # robots.txt
│   │   ├── not-found.tsx             # Глобальный 404
│   │   ├── error.tsx                 # Глобальный error boundary
│   │   └── global-error.tsx          # Root error boundary
│   │
│   ├── components/                   # Компоненты
│   │   ├── ui/                       # Атомарные UI-компоненты (shadcn/ui или свои)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Компоненты лейаута
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── breadcrumbs.tsx
│   │   ├── product/                  # Компоненты товаров
│   │   │   ├── product-card.tsx
│   │   │   ├── product-gallery.tsx
│   │   │   ├── product-filters.tsx
│   │   │   └── product-list.tsx
│   │   ├── cart/                     # Компоненты корзины
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-item.tsx
│   │   │   └── add-to-cart-button.tsx
│   │   └── shared/                   # Переиспользуемые компоненты
│   │       ├── error-boundary.tsx
│   │       ├── loading-skeleton.tsx
│   │       └── pagination.tsx
│   │
│   ├── lib/                          # Утилиты и конфигурация
│   │   ├── prisma.ts                 # Singleton Prisma client — ЕДИНСТВЕННЫЙ
│   │   ├── auth.ts                   # NextAuth конфигурация
│   │   ├── validations/              # Zod схемы
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   └── utils.ts                  # Утилиты (cn, formatPrice и т.д.)
│   │
│   ├── actions/                      # Server Actions (мутации)
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── product.ts                # Только для админки
│   │   └── user.ts
│   │
│   ├── queries/                      # Серверные функции чтения данных
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── orders.ts
│   │
│   ├── store/                        # Zustand сторы (только клиентское состояние)
│   │   ├── cart-store.ts
│   │   └── ui-store.ts
│   │
│   ├── hooks/                        # ← НОВАЯ ПАПКА — кастомные React хуки
│   │   ├── use-debounce.ts
│   │   ├── use-cart.ts
│   │   └── use-media-query.ts
│   │
│   ├── types/                        # TypeScript типы и интерфейсы
│   │   ├── index.ts                  # Реэкспорт всех типов
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── api.ts
│   │
│   ├── i18n/                         # Локализация
│   │   ├── request.ts                # next-intl конфигурация
│   │   └── messages/
│   │       ├── uk.json
│   │       └── ru.json
│   │
│   └── proxy.ts                     # ← Next.js 16: заменяет middleware.ts (i18n + auth)
│                                     # middleware.ts deprecated, удалить после миграции
│
├── instrumentation.ts                # ← НОВЫЙ — мониторинг (Sentry, OpenTelemetry)
├── AGENTS.md                         # ← Next.js 16.2: инструкции для AI-агентов
├── prisma/
│   ├── schema.prisma                 # Схема БД — источник истины
│   ├── migrations/                   # Автогенерируемые миграции
│   └── seed.ts                       # Сид данные
│
├── public/
│   ├── images/                       # Только статические изображения
│   └── icons/
│
├── tests/
│   ├── unit/                         # Vitest unit тесты
│   ├── integration/                  # Vitest integration тесты
│   └── e2e/                          # Playwright e2e тесты
│
├── .env                              # ⛔ В .gitignore — локальные секреты
├── .env.example                      # ✅ В репозитории — шаблон без значений
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── MASTER_CONTEXT.md                 # Этот файл
```

---

## 5. СОГЛАШЕНИЯ ПО ИМЕНОВАНИЮ

### Файлы и папки

```
✅ kebab-case для файлов и папок:
   product-card.tsx
   use-cart.ts
   product-filters.tsx

⛔ ЗАПРЕЩЕНО:
   ProductCard.tsx      (PascalCase для файлов)
   productCard.tsx      (camelCase для файлов)
   product_card.tsx     (snake_case для файлов)

✅ Исключения — Next.js системные файлы:
   page.tsx, layout.tsx, loading.tsx, error.tsx,
   not-found.tsx, route.ts, proxy.ts
   (middleware.ts — deprecated в Next.js 16, заменён на proxy.ts)
```

### Компоненты и функции

```typescript
// ✅ PascalCase для React компонентов
export function ProductCard() {}
export default function ProductPage() {}

// ✅ camelCase для функций, переменных, хуков
export function getProducts() {}
export function useCart() {}
const productSlug = 'nike-air-max'

// ✅ UPPER_SNAKE_CASE для констант
const MAX_CART_ITEMS = 99
const DEFAULT_PAGE_SIZE = 24

// ✅ PascalCase для типов и интерфейсов
type Product = { ... }
interface CartItem { ... }

// ✅ SCREAMING_SNAKE_CASE для enum значений
enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

### Именование переменных БД

```
✅ camelCase в Prisma схеме (автоматически маппится на snake_case в PostgreSQL):
   createdAt → created_at
   productId → product_id

✅ Таблицы — существительные в единственном числе:
   Product, Category, Order, User (не Products, Categories)

✅ ID поля — cuid2 (cuid deprecated, используем cuid2):
   id String @id @default(cuid2())
```

---

## 6. СХЕМА БАЗЫ ДАННЫХ

> ⚠️ Это единственная истина о структуре данных. Агенты не создают таблицы и поля вне этой схемы без явного изменения этого документа.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ПОЛЬЗОВАТЕЛИ ───────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid2())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  phone         String?
  avatar        String?
  passwordHash  String?   // null если OAuth
  role          UserRole  @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  orders    Order[]
  addresses Address[]
  reviews   Review[]
  wishlist  WishlistItem[]

  @@index([email])
  @@map("users")
}

enum UserRole {
  CUSTOMER
  MANAGER
  ADMIN
}

model Account {
  id                String  @id @default(cuid2())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid2())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Address {
  id         String  @id @default(cuid2())
  userId     String
  label      String? // "Дом", "Работа"
  firstName  String
  lastName   String
  phone      String
  city       String
  street     String
  building   String
  apartment  String?
  isDefault  Boolean @default(false)

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]

  @@index([userId])
  @@map("addresses")
}

// ─── КАТАЛОГ ────────────────────────────────────────────────────────────────

model Category {
  id          String    @id @default(cuid2())
  slug        String    @unique
  parentId    String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Переводы через отдельную таблицу (мультиязычность)
  translations CategoryTranslation[]

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products Product[]

  @@index([parentId])
  @@index([slug])
  @@map("categories")
}

model CategoryTranslation {
  id          String @id @default(cuid2())
  categoryId  String
  locale      String // 'uk' | 'ru'
  name        String
  description String? @db.Text
  metaTitle   String?
  metaDesc    String?

  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([categoryId, locale])
  @@map("category_translations")
}

model Product {
  id          String        @id @default(cuid2())
  slug        String        @unique
  sku         String        @unique
  categoryId  String
  brandId     String?
  price       Decimal       @db.Decimal(10, 2)
  comparePrice Decimal?     @db.Decimal(10, 2) // зачёркнутая цена
  costPrice   Decimal?      @db.Decimal(10, 2) // себестоимость (только для ADMIN)
  stock       Int           @default(0)
  isActive    Boolean       @default(true)
  isFeatured  Boolean       @default(false)
  attributes  Json          @default("{}") // JSONB: { "color": "red", "size": "XL" }
  sortOrder   Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  translations  ProductTranslation[]
  images        ProductImage[]
  category      Category      @relation(fields: [categoryId], references: [id])
  brand         Brand?        @relation(fields: [brandId], references: [id])
  orderItems    OrderItem[]
  reviews       Review[]
  wishlist      WishlistItem[]

  // GIN индекс для быстрой фильтрации по JSONB атрибутам
  @@index([categoryId])
  @@index([slug])
  @@index([sku])
  @@index([isActive, isFeatured])
  @@index([price])
  @@map("products")
}

// После создания таблицы выполнить вручную:
// CREATE INDEX products_attributes_gin ON products USING GIN (attributes jsonb_path_ops);

model ProductTranslation {
  id          String  @id @default(cuid2())
  productId   String
  locale      String  // 'uk' | 'ru'
  name        String
  description String? @db.Text
  metaTitle   String?
  metaDesc    String?

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, locale])
  @@map("product_translations")
}

model ProductImage {
  id        String  @id @default(cuid2())
  productId String
  url       String
  alt       String?
  sortOrder Int     @default(0)
  isMain    Boolean @default(false)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_images")
}

model Brand {
  id        String    @id @default(cuid2())
  slug      String    @unique
  name      String
  logo      String?
  isActive  Boolean   @default(true)
  products  Product[]

  @@map("brands")
}

model Review {
  id        String   @id @default(cuid2())
  productId String
  userId    String
  rating    Int      // 1–5
  comment   String?  @db.Text
  isVisible Boolean  @default(false) // модерация
  createdAt DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([productId, userId]) // один отзыв на товар от пользователя
  @@index([productId, isVisible])
  @@map("reviews")
}

model WishlistItem {
  id        String   @id @default(cuid2())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// ─── ЗАКАЗЫ ─────────────────────────────────────────────────────────────────

model Order {
  id            String      @id @default(cuid2())
  number        String      @unique // ORD-2024-00001
  userId        String?     // null для гостевых заказов
  addressId     String?
  status        OrderStatus @default(PENDING)
  paymentStatus PaymentStatus @default(UNPAID)
  paymentMethod String?
  subtotal      Decimal     @db.Decimal(10, 2)
  discount      Decimal     @default(0) @db.Decimal(10, 2)
  shipping      Decimal     @default(0) @db.Decimal(10, 2)
  total         Decimal     @db.Decimal(10, 2)
  notes         String?     @db.Text
  // Снимок данных покупателя на момент заказа (не FK — данные могут меняться)
  customerData  Json        // { firstName, lastName, email, phone }
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user     User?      @relation(fields: [userId], references: [id])
  address  Address?   @relation(fields: [addressId], references: [id])
  items    OrderItem[]

  @@index([userId])
  @@index([number])
  @@index([status])
  @@map("orders")
}

enum OrderStatus {
  PENDING     // ожидает подтверждения
  CONFIRMED   // подтверждён
  PROCESSING  // комплектуется
  SHIPPED     // отправлен
  DELIVERED   // доставлен
  CANCELLED   // отменён
  REFUNDED    // возврат
}

enum PaymentStatus {
  UNPAID
  PAID
  PARTIAL
  REFUNDED
}

model OrderItem {
  id        String  @id @default(cuid2())
  orderId   String
  productId String?  // null если товар удалён
  // Снимок данных товара на момент заказа
  snapshot  Json    // { name, sku, price, image }
  quantity  Int
  price     Decimal @db.Decimal(10, 2) // цена на момент заказа

  order   Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@map("order_items")
}
```

### Правила работы с БД

```typescript
// ✅ ОБЯЗАТЕЛЬНО — singleton Prisma client
// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ ОБЯЗАТЕЛЬНО — select только нужных полей в каждом запросе
// ✅ ОБЯЗАТЕЛЬНО — take/skip при возврате коллекций
// ✅ ОБЯЗАТЕЛЬНО — транзакции при мутации нескольких таблиц

// Пример транзакции создания заказа:
const order = await prisma.$transaction(async (tx) => {
  // 1. Создать заказ
  const newOrder = await tx.order.create({ data: orderData })
  // 2. Создать позиции
  await tx.orderItem.createMany({ data: itemsData })
  // 3. Уменьшить остатки (защищённо от race conditions)
  for (const item of items) {
    const updated = await tx.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } }
    })
    if (updated.count === 0) {
      throw new Error(`Товар ${item.productId} закінчився`)
    }
  }
  return newOrder
})
```


---

## 7. СТРАТЕГИЯ РЕНДЕРИНГА

> ⚠️ **Next.js 16 breaking change:** `export const revalidate` и `export const dynamic`
> **deprecated** при включённом `cacheComponents: true`.
> Вместо них используй `'use cache'` + `cacheLife()` на уровне функции данных или компонента.
> Route segment config (`revalidate`, `dynamic`) работает без `cacheComponents`,
> но при его включении — мигрировать обязательно.

### Таблица решений

| Страница | Стратегия Next.js 16 | Было в Next.js 15 | Причина |
|----------|---------------------|-------------------|---------|
| Главная | PPR + `<Suspense>` | PPR + ISR | SEO + динамические блоки |
| Каталог (список категорий) | `'use cache'` + `cacheLife('max')` | SSG | Меняется редко |
| Категория (список товаров) | `'use cache'` + `cacheLife('minutes')` | ISR 300s | Товары меняются |
| Карточка товара | `'use cache'` + `cacheLife('seconds')` | ISR 60s | Цена/остаток меняются |
| Страница бренда | `'use cache'` + `cacheLife('hours')` | ISR 3600s | Редко меняется |
| Результаты поиска | без `'use cache'` (динамика) | SSR | Всегда уникальный запрос |
| Корзина | без `'use cache'` (динамика) | SSR | Персонализирована |
| Оформление заказа | без `'use cache'` (динамика) | SSR | Критически важна актуальность |
| Личный кабинет | без `'use cache'` (динамика) | SSR | Персональные данные |
| История заказов | без `'use cache'` (динамика) | SSR | Персональные данные |
| Страница заказа | без `'use cache'` (динамика) | SSR | Статус в реальном времени |
| Страница входа / регистрации | `'use cache'` + `cacheLife('max')` | SSG | Статичная форма |
| 404 | `'use cache'` + `cacheLife('max')` | SSG | Статичная |
| Страницы CMS | `'use cache'` + `cacheLife('days')` | ISR 86400s | Редко меняются |
| Админка (все страницы) | без `'use cache'` (динамика) | SSR | Всегда актуальные данные |

> **Встроенные профили cacheLife:**
> `'seconds'` (~1 мин) · `'minutes'` (~5 мин) · `'hours'` (~1 ч)
> `'days'` (~1 д) · `'weeks'` (~7 д) · `'max'` (∞ до ревалидации)

### Реализация в коде

```typescript
// ✅ Next.js 16: кэширование через 'use cache' на уровне функции данных
// queries/products.ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getProductBySlug(slug: string, locale: string) {
  'use cache'
  cacheLife('seconds')           // ~60 сек — цена/остаток меняются
  cacheTag(`product-${slug}`)   // тег для точечной инвалидации

  return prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { ... }
  })
}

export async function getCategories(locale: string) {
  'use cache'
  cacheLife('days')
  cacheTag('categories')

  return prisma.category.findMany({ ... })
}

// ✅ Страница товара — generateStaticParams остался
// app/[locale]/(shop)/product/[slug]/page.tsx
// ⛔ НЕТ export const revalidate — кэш управляется в getProductBySlug
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { updatedAt: 'desc' },
    take: 1000,
  })
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug, locale) // кэш внутри функции
  if (!product) notFound()
  return <ProductView product={product} />
}

// ✅ Динамические страницы (корзина, кабинет) — просто не используй 'use cache'
// app/[locale]/(shop)/cart/page.tsx
// ⛔ НЕТ export const dynamic = 'force-dynamic' — это deprecated
export default async function CartPage() {
  const session = await auth()
  const cart = session ? await getServerCart(session.user.id) : null
  return <CartView serverCart={cart} />
}

// ✅ PPR — главная страница
// Статичная оболочка + <Suspense> для динамики
export default function HomePage() {
  return (
    <>
      <HeroBanner />                          {/* статика — без Suspense */}
      <Suspense fallback={<ProductSkeletons count={8} />}>
        <FeaturedProducts />                  {/* динамика — без 'use cache' */}
      </Suspense>
      <Suspense fallback={<CategorySkeleton />}>
        <PopularCategories />                 {/* 'use cache' внутри компонента */}
      </Suspense>
    </>
  )
}

// ✅ Инвалидация кэша — revalidateTag работает с cacheTag
// actions/product.ts
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: ProductUpdateInput) {
  await requireAdmin()
  const product = await prisma.product.update({ where: { id }, data })
  revalidateTag(`product-${product.slug}`) // ✅ точечная инвалидация
  revalidateTag('products')
  return { success: true }
}

// ✅ generateMetadata — ОБЯЗАТЕЛЕН для всех page.tsx
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug, locale) // переиспользует кэш
  if (!product) return {}
  return {
    title: `${product.name} | Магазин`,
    description: product.metaDesc ?? product.description?.slice(0, 160),
    alternates: {
      canonical: `/${locale}/product/${slug}`,
      languages: {
        'uk': `/uk/product/${slug}`,
        'ru': `/ru/product/${slug}`,
        'x-default': `/uk/product/${slug}`,
      }
    },
    openGraph: {
      images: [{ url: product.images[0]?.url ?? '/og-default.jpg' }]
    }
  }
}
```

## 8. КОМПОНЕНТНАЯ АРХИТЕКТУРА

### Правило Server / Client разделения

```
ПРИНЦИП: "Тяни вниз 'use client' как можно глубже"

Server Component (по умолчанию):         Client Component (только с 'use client'):
─────────────────────────────────         ────────────────────────────────────────
✅ Запросы к БД                           ✅ useState / useReducer
✅ Чтение файлов, ENV                     ✅ useEffect
✅ Тяжёлые зависимости (без отправки      ✅ onClick, onChange, onSubmit
   в браузер)                             ✅ Browser APIs (localStorage, window)
✅ generateMetadata                       ✅ Анимации
✅ Async/await компоненты                 ✅ Реальное время (WebSocket)
```

### Шаблон Server + Client разделения

```typescript
// ✅ ПРАВИЛЬНЫЙ ПАТТЕРН для страницы с фильтрами

// queries/products.ts — серверная функция
export async function getFilteredProducts(filters: ProductFilters) {
  return prisma.product.findMany({
    where: buildProductWhereClause(filters),
    select: productCardSelect, // предопределённый select
    take: filters.limit ?? 24,
    skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 24),
    orderBy: buildOrderBy(filters.sort),
  })
}

// Предопределённый select — не менять без крайней нужды
export const productCardSelect = {
  id: true,
  slug: true,
  price: true,
  comparePrice: true,
  stock: true,
  translations: {
    select: { locale: true, name: true },
  },
  images: {
    select: { url: true, alt: true },
    where: { isMain: true },
    take: 1,
  },
} satisfies Prisma.ProductSelect

// app/[locale]/(shop)/catalog/[slug]/page.tsx — Server Component
export default async function CategoryPage({
  params, searchParams
}: {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { slug, locale } = await params
  const sp = await searchParams

  const [category, products, totalCount] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getFilteredProducts({ categorySlug: slug, ...parseSearchParams(sp) }),
    getProductsCount({ categorySlug: slug, ...parseSearchParams(sp) }),
  ])

  if (!category) notFound()

  return (
    <div className="flex gap-6">
      {/* ProductFilters — Client Component (взаимодействие) */}
      <ProductFilters
        categorySlug={slug}
        initialFilters={parseSearchParams(sp)}
      />
      {/* ProductGrid — Server Component (просто рендер) */}
      <ProductGrid
        products={products}
        total={totalCount}
        locale={locale}
      />
    </div>
  )
}

// components/product/product-filters.tsx — Client Component
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function ProductFilters({
  categorySlug,
  initialFilters
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function updateFilter(key: string, value: string) {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page') // сброс на первую страницу
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <aside className={cn('w-64 shrink-0', isPending && 'opacity-50')}>
      {/* Фильтры */}
    </aside>
  )
}
```

### Карточка товара — эталонный компонент

```typescript
// components/product/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { formatPrice } from '@/lib/utils'
import type { ProductCardData } from '@/types/product'

// ✅ Server Component — нет 'use client'
export function ProductCard({
  product,
  locale,
}: {
  product: ProductCardData
  locale: string
}) {
  const translation = product.translations.find(t => t.locale === locale)
  const name = translation?.name ?? product.translations[0]?.name ?? ''
  const image = product.images[0]

  return (
    <article className="group relative flex flex-col rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-t-lg"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">Фото відсутнє</span>
          </div>
        )}
        {product.comparePrice && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            -{getDiscountPercent(product.price, product.comparePrice)}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/${locale}/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-blue-600"
        >
          {name}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          {/* AddToCartButton — Client Component */}
          <AddToCartButton
            productId={product.id}
            disabled={product.stock === 0}
          />
        </div>
      </div>
    </article>
  )
}
```


---

## 9. РАБОТА С ДАННЫМИ

### Server Actions — только для мутаций

```typescript
// actions/cart.ts
'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ✅ Схема валидации — всегда перед действием
const AddToCartSchema = z.object({
  // ⛔ z.string().cuid() — НЕ ИСПОЛЬЗОВАТЬ: валидирует старый cuid-формат (c...), а БД использует cuid2
  // ✅ z.string().min(1) — правильно для cuid2
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
})

// ✅ Server Action — возвращает { success, error } — никогда не бросает в UI
export async function addToCart(
  input: z.infer<typeof AddToCartSchema>
): Promise<{ success: boolean; error?: string }> {
  // 1. Валидация
  const parsed = AddToCartSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Невалідні дані' }
  }

  // 2. Сессия (опционально — гостевая корзина в cookie)
  const session = await auth()

  try {
    // 3. Проверка существования товара и остатка
    const product = await prisma.product.findUnique({
      where: { id: parsed.data.productId, isActive: true },
      select: { id: true, stock: true, price: true },
    })

    if (!product) return { success: false, error: 'Товар не знайдено' }
    if (product.stock < parsed.data.quantity) {
      return { success: false, error: 'Недостатньо товару на складі' }
    }

    if (session?.user?.id) {
      // Серверная корзина для авторизованных
      // ... логика
    }

    // ✅ Next.js 16: revalidateTag требует второй аргумент — cacheLife профиль
    // 'max' = stale-while-revalidate: пользователи видят старые данные пока грузятся новые
    revalidateTag('cart', 'max')
    return { success: true }
  } catch (error) {
    console.error('[addToCart]', error)
    return { success: false, error: 'Помилка сервера' }
  }
}
```

### Серверные функции чтения данных

```typescript
// ✅ Серверные функции чтения — используют 'use cache' (Next.js 16)
// queries/products.ts
import { cacheLife, cacheTag } from 'next/cache'

// ✅ 'use cache' внутри функции — дедупликация и кэш автоматически
export async function getProductBySlug(
  slug: string,
  locale: string
): Promise<ProductDetail | null> {
  'use cache'
  cacheLife('seconds')
  cacheTag(`product-${slug}`)

  return prisma.product.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      slug: true,
      sku: true,
      price: true,
      comparePrice: true,
      stock: true,
      attributes: true,
      translations: {
        where: { locale },
        select: {
          name: true,
          description: true,
          metaTitle: true,
          metaDesc: true,
        },
      },
      images: {
        select: { url: true, alt: true, isMain: true },
        orderBy: { sortOrder: 'asc' },
        take: 10,
      },
      category: {
        select: {
          slug: true,
          translations: {
            where: { locale },
            select: { name: true },
          },
        },
      },
      brand: {
        select: { name: true, slug: true },
      },
      // ⛔ ЗАПРЕЩЕНО — НЕ включать: costPrice, passwordHash или другие приватные поля
    },
  })
}

// ✅ Fetch с тегами кэша для точечной инвалидации
// Next.js 16: cacheTag и cacheLife стабильны (без unstable_ префикса)
export async function getCategories(locale: string) {
  'use cache'
  cacheTag('categories')
  cacheLife('hours') // профиль: hours = revalidate через ~1 час

  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    select: {
      slug: true,
      translations: {
        where: { locale },
        select: { name: true },
      },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  })
}
```

### Route Handlers — только для внешних интеграций

```typescript
// ✅ Route Handlers используются ТОЛЬКО для:
// - Вебхуков от платёжных систем
// - NextAuth endpoints
// - Публичного API для мобильного приложения (если есть)
// ⛔ Не использовать Route Handlers для внутренних операций — используй Server Actions

// app/api/webhooks/payment/route.ts
import { NextRequest } from 'next/server'
import { verifyWebhookSignature } from '@/lib/payment'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  // ✅ ВСЕГДА верифицировать подпись вебхука
  if (!verifyWebhookSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)
  // ... обработка события

  return new Response('OK', { status: 200 })
}
```


---

## 10. СТИЛИЗАЦИЯ (TAILWIND CSS)

### Обязательные утилиты

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ✅ ВСЕГДА использовать cn() для условных классов
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ Форматирование цены — единственная функция для этого
export function formatPrice(price: number | Prisma.Decimal): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price))
}
```

### Токены дизайн-системы (Tailwind v4 — через CSS, не JS)

```css
/* src/app/globals.css — Tailwind v4: конфигурация через CSS @theme */
@import "tailwindcss";

@theme {
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-500: #3b82f6;  /* основной цвет бренда */
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-900: #1e3a8a;

  --font-sans: 'Inter', sans-serif;

  --container-padding: 1rem;
  --container-padding-sm: 1.5rem;
  --container-padding-lg: 2rem;
}

/* ⛔ ЗАПРЕЩЕНО — tailwind.config.ts для новых проектов на Tailwind v4 */
/* Tailwind v4 не требует tailwind.config.ts — вся конфигурация здесь */
```

### Правила применения классов

```typescript
// ✅ ПРАВИЛЬНО — мобильный first, потом breakpoints
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// ✅ ПРАВИЛЬНО — cn() для условных классов
<button
  className={cn(
    'rounded-lg px-4 py-2 font-medium transition-colors',
    'bg-brand-500 text-white hover:bg-brand-600',
    isLoading && 'cursor-not-allowed opacity-50',
    variant === 'outline' && 'border border-brand-500 bg-transparent text-brand-500',
  )}
>

// ⛔ ЗАПРЕЩЕНО — конкатенация строк для классов
<div className={'flex ' + (isOpen ? 'block' : 'hidden')}>

// ⛔ ЗАПРЕЩЕНО — inline styles
<div style={{ color: '#3b82f6' }}>

// ⛔ ЗАПРЕЩЕНО — произвольные hex-цвета без токена
<div className="text-[#3b82f6]">  // использовать text-brand-500

// ✅ ПРАВИЛЬНО — произвольные значения только если нет токена
<div className="h-[1px]">  // разделитель толщиной 1px — ок, токена нет
```

### Доступность (a11y) — обязательно

```typescript
// ✅ ВСЕГДА — aria-label для кнопок без текста
<button aria-label="Додати до кошика" onClick={...}>
  <ShoppingCartIcon />
</button>

// ✅ ВСЕГДА — alt для изображений
<Image alt={product.name} ... />  // не alt=""  если изображение несёт смысл

// ✅ ВСЕГДА — focus-visible стили
className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"

// ✅ ВСЕГДА — достаточный контраст (WCAG AA: 4.5:1 для текста)
// Проверяй: серый текст на белом фоне text-gray-400 — НЕ ПРОЙДЁТ
// Минимум: text-gray-600 на белом фоне

// ✅ ВСЕГДА — semantic HTML
<nav>, <main>, <article>, <section>, <header>, <footer>, <aside>
// вместо <div> для всего
```

---

## 11. SEO И МИКРОРАЗМЕТКА

### Обязательная микроразметка для каждого типа страницы

```typescript
// ✅ Карточка товара — JSON-LD
// components/product/product-schema.tsx
export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const translation = product.translations.find(t => t.locale === locale)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: translation?.name,
    description: translation?.description,
    sku: product.sku,
    image: product.images.map(img => `${baseUrl}${img.url}`),
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: 'UAH',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/${locale}/product/${product.slug}`,
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.avgRating,
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.brand && {
      brand: { '@type': 'Brand', name: product.brand.name },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ✅ BreadcrumbList — обязателен на всех внутренних страницах
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### Формула title-тегов — не отклоняться

```
Главная:       {Название магазину} — {Слоган}
Категория:     {Назва категорії} — купити в {Місто} | {Магазин}
Товар:         {Назва товару} {Ключова характеристика} — купити | {Магазин}
Бренд:         {Бренд} — офіційний магазин | {Магазин}
Результати:    {Запит} — пошук | {Магазин}
Кабінет:       Мій кабінет | {Магазин}
404:           Сторінку не знайдено | {Магазин}

⛔ ЗАПРЕЩЕНО в title:
   - SKU / артикул товара
   - Длиннее 60 символов
   - Одинаковый title на разных страницах
   - Заглавные буквы в каждом слове (TITLE CASE)
```

### Sitemap — автогенерация

```typescript
// app/sitemap.ts
// Next.js 16: id параметр в generateSitemaps теперь Promise
import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!
const LOCALES = ['uk', 'ru'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const productUrls = products.flatMap(p =>
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const categoryUrls = categories.flatMap(c =>
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}/catalog/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  )

  return [
    ...LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}`,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    })),
    ...categoryUrls,
    ...productUrls,
  ]
}

// Next.js 16: если используешь generateSitemaps — id теперь Promise
// export default async function sitemap({ id }: { id: Promise<string> }) {
//   const resolvedId = await id  // ← обязательно await
//   const start = Number(resolvedId) * 50000
// }
```


---

## 12. МУЛЬТИЯЗЫЧНОСТЬ (i18n)

### Конфигурация next-intl

```typescript
// ✅ Next.js 16: middleware.ts → proxy.ts (middleware.ts deprecated)
// src/proxy.ts
import createMiddleware from 'next-intl/middleware'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['uk', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'always',  // ВСЕГДА /uk/... и /ru/...
})

// ✅ proxy — единственный экспорт (не middleware)
export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Защита личного кабинета
  if (pathname.includes('/account') && !session) {
    return NextResponse.redirect(new URL('/uk/login', req.url))
  }

  // Защита админки
  if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return intlMiddleware(req)
})

// ✅ matcher — правильный для i18n + auth + Next.js 16
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// src/i18n/request.ts — без изменений
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const validLocale = ['uk', 'ru'].includes(locale!) ? locale! : 'uk'
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})
```

### Структура переводов

```json
// i18n/messages/uk.json
{
  "common": {
    "addToCart": "Додати до кошика",
    "buyNow": "Купити зараз",
    "outOfStock": "Немає в наявності",
    "inStock": "В наявності",
    "pieces": "{count, plural, one {# штука} few {# штуки} many {# штук} other {# штуки}}",
    "loading": "Завантаження...",
    "error": "Сталася помилка",
    "retry": "Спробувати знову"
  },
  "product": {
    "characteristics": "Характеристики",
    "description": "Опис",
    "reviews": "Відгуки",
    "similar": "Схожі товари"
  },
  "cart": {
    "title": "Кошик",
    "empty": "Кошик порожній",
    "total": "Разом",
    "checkout": "Оформити замовлення",
    "continue": "Продовжити покупки"
  },
  "nav": {
    "catalog": "Каталог",
    "cart": "Кошик",
    "account": "Мій кабінет",
    "wishlist": "Обране"
  }
}
```

### Использование в компонентах

```typescript
// ✅ Server Component — через getTranslations
import { getTranslations } from 'next-intl/server'

export default async function ProductPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'product' })

  return <h1>{t('characteristics')}</h1>
}

// ✅ Client Component — через useTranslations
'use client'
import { useTranslations } from 'next-intl'

export function AddToCartButton({ productId }: Props) {
  const t = useTranslations('common')
  return <button>{t('addToCart')}</button>
}

// ⛔ ЗАПРЕЩЕНО — хардкод текстов в компонентах
<button>Додати до кошика</button>  // ⛔ без t()
```

### Правила i18n

```
✅ Каждая строка интерфейса — через t()
✅ uk — основная локаль, uk.json — источник истины
✅ ru.json — должен иметь все ключи что и uk.json
✅ Даты — через Intl.DateTimeFormat с locale
✅ Числа/цены — через Intl.NumberFormat с locale
✅ <html lang="uk"> или <html lang="ru"> — обязательно в корневом layout
⛔ Не использовать locale 'ua' — правильный ISO код: 'uk'
⛔ Не хардкодить тексты в компонентах
⛔ Не использовать одни переводы для обоих языков
```

---

## 13. АУТЕНТИФИКАЦИЯ

### Конфигурация NextAuth v5

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/uk/login',
    error: '/uk/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, role: true, passwordHash: true },
        })

        if (!user?.passwordHash) return null

        const isValid = await compare(parsed.data.password, user.passwordHash)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: UserRole }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as UserRole
      return session
    },
  },
})

// ✅ Проверка авторизации и роли в Server Actions и Route Handlers
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== 'ADMIN') throw new Error('Forbidden')
  return session
}
```

### Защита маршрутов

> Логика защиты маршрутов перенесена в `src/proxy.ts` (§12) —
> единый файл для i18n + auth в Next.js 16.


---

## 14. КОРЗИНА И ЗАКАЗЫ

### Архитектура корзины

```
Гостевая корзина:    cookie "cart" (JSON, зашифрованный, max 4KB)
Авторизованная:      серверная БД — модель CartItem (см. схему ниже)
При логине:          merge гостевой корзины с серверной

Zustand store — только для UI-состояния корзины (открыт ли drawer, анимации)
Реальные данные корзины — из Server Action / cookie, не в Zustand
```

> ⚠️ Модель `CartItem` **обязательна** в `prisma/schema.prisma`:
> ```prisma
> model CartItem {
>   id        String   @id @default(cuid2())
>   userId    String
>   productId String
>   quantity  Int      @default(1)
>   createdAt DateTime @default(now())
>   updatedAt DateTime @updatedAt
>
>   user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
>   product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
>
>   @@unique([userId, productId])
>   @@index([userId])
>   @@map("cart_items")
> }
> ```
> Не забудь добавить `cart CartItem[]` в модель `User` и `Product`.

### Zustand — правила использования

> ⚠️ **Разделение сторов (важно):**
> - `store/cart-store.ts` — **только** `isDrawerOpen / openDrawer / closeDrawer`
> - `store/ui-store.ts` — **только** `isMobileMenuOpen / isSearchOpen`
> - Реальные данные корзины (товары) — в БД (CartItem) или cookie, **не в Zustand**

```typescript
// src/store/cart-store.ts
// ✅ Zustand только для UI-состояния корзины (drawer)

import { create } from 'zustand'

interface CartUIStore {
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const useCartUIStore = create<CartUIStore>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}))

// src/store/ui-store.ts
// ✅ Zustand для прочего UI-состояния
import { create } from 'zustand'

interface UIStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}))

// ⛔ ЗАПРЕЩЕНО — хранить товары корзины в Zustand (потеряются при перезагрузке)
// ⛔ ЗАПРЕЩЕНО — fetch данных внутри Zustand (бизнес-логика вне стора)
```

### Оформление заказа — Server Action

```typescript
// actions/order.ts
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmation } from '@/lib/email'

const CheckoutSchema = z.object({
  items: z.array(z.object({
    // ⛔ z.string().cuid() — НЕ ИСПОЛЬЗОВАТЬ: валидирует старый cuid, а БД использует cuid2
    // ✅ z.string().min(1) — правильно для cuid2
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  })).min(1),
  customer: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().regex(/^\+380\d{9}$/),
  }),
  address: z.object({
    city: z.string().min(2),
    street: z.string().min(2),
    building: z.string().min(1),
    apartment: z.string().optional(),
  }),
  paymentMethod: z.enum(['card', 'cod', 'liqpay']),
})

export async function createOrder(
  input: z.infer<typeof CheckoutSchema>
): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  const parsed = CheckoutSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Невалідні дані' }

  const session = await auth()

  try {
    // ✅ Транзакция — всё или ничего
    const order = await prisma.$transaction(async (tx) => {
      // 1. Актуальные цены и остатки из БД (не доверяем клиенту)
      const productIds = parsed.data.items.map(i => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: {
          id: true, price: true, stock: true, sku: true,
          translations: { select: { locale: true, name: true } },
          images: { where: { isMain: true }, select: { url: true }, take: 1 },
        },
      })

      // 2. Проверка остатков
      for (const item of parsed.data.items) {
        const product = products.find(p => p.id === item.productId)
        if (!product) throw new Error(`Товар ${item.productId} не знайдено`)
        if (product.stock < item.quantity) {
          throw new Error(`Недостатньо "${product.translations[0]?.name}"`)
        }
      }

      // 3. Подсчёт суммы на стороне сервера
      const subtotal = parsed.data.items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId)!
        return sum + Number(product.price) * item.quantity
      }, 0)

      // 4. Создание заказа
      const newOrder = await tx.order.create({
        data: {
          number: await generateOrderNumber(tx),
          userId: session?.user?.id ?? null,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          paymentMethod: parsed.data.paymentMethod,
          subtotal,
          total: subtotal, // + shipping если нужно
          customerData: parsed.data.customer,
          items: {
            create: parsed.data.items.map(item => {
              const product = products.find(p => p.id === item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                snapshot: {
                  name: product.translations[0]?.name,
                  sku: product.sku,
                  price: Number(product.price),
                  image: product.images[0]?.url,
                },
              }
            }),
          },
        },
        select: { id: true, number: true },
      })

      // 5. Уменьшение остатков (защищённо от concurrent заказов)
      const decrements = await Promise.all(
        parsed.data.items.map(item =>
          tx.product.updateMany({
            // ✅ where: stock >= quantity — защита от race condition:
            // если два заказа одновременно купили последний товар — updateMany вернёт count=0
            // … и тогда мы бросаем ошибку вместо того чтобы stock ушёл в минус
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          })
        )
      )
      // ✅ Проверка: если хоть один updateMany обновил 0 строк — товар уже купили до нас
      for (let i = 0; i < decrements.length; i++) {
        if (decrements[i].count === 0) {
          const item = parsed.data.items[i]!
          const product = products.find(p => p.id === item.productId)
          throw new Error(`Товар "${product?.translations[0]?.name}" вже розпродан`)
        }
      }

      return newOrder
    })

    // 6. Отправка email (вне транзакции)
    await sendOrderConfirmation({
      email: parsed.data.customer.email,
      orderNumber: order.number,
    }).catch(err => console.error('[email]', err)) // не падаем из-за email

    // Next.js 16: updateTag для read-your-writes — пользователь сразу видит свой заказ
    updateTag(`orders-${session?.user?.id}`)

    return { success: true, orderNumber: order.number }
  } catch (error) {
    console.error('[createOrder]', error)
    const message = error instanceof Error ? error.message : 'Помилка сервера'
    return { success: false, error: message }
  }
}
```

---

## 15. ОБРАБОТКА ОШИБОК

### Иерархия error boundaries

```typescript
// ✅ app/[locale]/error.tsx — ловит ошибки внутри locale layout
'use client'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Логируем в сервис мониторинга (Sentry и т.д.)
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Щось пішло не так</h2>
      <button
        onClick={reset}
        className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
      >
        Спробувати знову
      </button>
    </main>
  )
}

// ✅ app/[locale]/(shop)/product/[slug]/loading.tsx — скелетон при загрузке
export default function ProductLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-96 rounded-lg bg-gray-200" />
      <div className="mt-4 h-8 w-2/3 rounded bg-gray-200" />
      <div className="mt-2 h-6 w-1/3 rounded bg-gray-200" />
    </div>
  )
}

// ✅ notFound() — для несуществующих ресурсов
import { notFound } from 'next/navigation'

const product = await getProductBySlug(slug, locale)
if (!product) notFound() // рендерит app/not-found.tsx

// ⛔ ЗАПРЕЩЕНО — кидать 404 через Response
return new Response('Not found', { status: 404 }) // в page.tsx — ЗАПРЕЩЕНО
```

### Логирование ошибок

```typescript
// ✅ Структурированное логирование (не console.log в продакшне)
// lib/logger.ts
export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(JSON.stringify({ level: 'error', message, ...meta, ts: new Date().toISOString() }))
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(JSON.stringify({ level: 'warn', message, ...meta }))
    }
  },
}

// Использование:
logger.error('[createOrder] Transaction failed', { userId, orderId, error: err.message })
```

---

## 16. ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Обязательный .env.example (все переменные без значений)

```bash
# .env.example — КОММИТИТЬ В РЕПОЗИТОРИЙ
# Node.js >= 20.9.0 обязателен (Next.js 16 минимум)

# База данных
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"

# NextAuth
AUTH_SECRET="generate: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# OAuth провайдеры
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Сайт
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@yourstore.com"

# Платёжная система
PAYMENT_SECRET_KEY=""
PAYMENT_WEBHOOK_SECRET=""

# Algolia — два разных ключа с разными правами (см. §20)
ALGOLIA_APP_ID=""
ALGOLIA_ADMIN_KEY=""                  # ⛔ только сервер, никогда не в NEXT_PUBLIC_
NEXT_PUBLIC_ALGOLIA_APP_ID=""         # ✅ дублируется для клиента (только App ID)
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=""     # ✅ Search-Only ключ — только чтение
```

### Правила ENV переменных

> ⚠️ **Vercel / Serverless деплой — connection pooling обязателен**
>
> В serverless окружении каждый вызов функции открывает **новое** соединение с PostgreSQL.
> При нагрузке PostgreSQL исчерпает пул соединений (`too many connections`) и сайт упадёт.
>
> **Решение (выбрать одно):**
> - [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) — встроенный пулинг, рекомендован для Vercel
> - PgBouncer — внешний пулер (Supabase, Railway включают по умолчанию)
> - Параметр строки подключения: `?connection_limit=1&pool_timeout=20`
>
> ```bash
> # .env — для Vercel + Prisma Accelerate:
> DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
> DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"  # для миграций
> ```
>
> ```prisma
> // prisma/schema.prisma — при использовании Accelerate/PgBouncer
> datasource db {
>   provider  = "postgresql"
>   url       = env("DATABASE_URL")
>   directUrl = env("DIRECT_URL")  // ✅ для prisma migrate
> }
> ```
>
> 🛑 **СТОП-СИГНАЛ:** Если деплой на Vercel/serverless — CONNECTION POOLING НЕ ОПЦИОНАЛЕН.

```typescript
// ✅ NEXT_PUBLIC_ — только для клиентского кода (видны в браузере)
// Никогда не класть секреты в NEXT_PUBLIC_*

// ✅ Валидация ENV при старте приложения
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  RESEND_API_KEY: z.string().startsWith('re_'),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

export const env = envSchema.parse(process.env)
// Если переменная отсутствует — приложение не запустится с понятной ошибкой
```

---

## 17. ПРОИЗВОДИТЕЛЬНОСТЬ И CORE WEB VITALS

### Цели метрик (обязательные пороги)

| Метрика | Цель | Критично |
|---------|------|---------|
| LCP | ≤ 2.5 сек | > 4 сек |
| INP | ≤ 200 мс | > 500 мс |
| CLS | ≤ 0.1 | > 0.25 |
| TTFB | ≤ 800 мс | > 1800 мс |
| FCP | ≤ 1.8 сек | > 3 сек |

### Обязательные практики

```typescript
// ✅ next/image — ОБЯЗАТЕЛЬНО для всех изображений
import Image from 'next/image'

// Главное изображение товара — priority
<Image
  src={product.images[0].url}
  alt={product.name}
  width={600}
  height={600}
  priority  // ← только для above-the-fold изображений
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Изображения ниже fold — без priority (lazy по умолчанию)
<Image
  src={img.url}
  alt={img.alt}
  fill
  sizes="(max-width: 640px) 50vw, 25vw"
/>

// ✅ next/font — ОБЯЗАТЕЛЬНО, никаких <link> на Google Fonts
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

// ✅ dynamic import для тяжёлых клиентских компонентов
import dynamic from 'next/dynamic'
const ProductGallery = dynamic(
  () => import('@/components/product/product-gallery'),
  { loading: () => <GallerySkeleton /> }
)

// ✅ Suspense для стриминга
<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews productId={product.id} />
</Suspense>

// ⛔ ЗАПРЕЩЕНО — блокирующие скрипты в <head>
// ⛔ ЗАПРЕЩЕНО — @import в CSS (блокирует рендер)
// ⛔ ЗАПРЕЩЕНО — изображения без width/height или fill+sizes
```

---

## 18. ТЕСТИРОВАНИЕ

### Стратегия тестирования

```
Unit тесты (Vitest):
  ✅ Утилиты (formatPrice, cn, generateOrderNumber)
  ✅ Zod схемы валидации
  ✅ Бизнес-логика (подсчёт корзины, скидки)
  ⛔ Не тестировать React компоненты unit-тестами (слишком хрупко)

Integration тесты (Vitest + Prisma test DB):
  ✅ Server Actions (addToCart, createOrder)
  ✅ Query функции (getProductBySlug, getFilteredProducts)
  ✅ Auth флоу

E2E тесты (Playwright):
  ✅ Критический путь: главная → категория → товар → корзина → оформление
  ✅ Авторизация (login / register)
  ✅ Мобильная версия (viewport 375x812)
```

### Пример unit-теста

```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, getDiscountPercent } from '@/lib/utils'

describe('formatPrice', () => {
  it('форматирует цену в гривнах', () => {
    expect(formatPrice(1000)).toBe('1\u202f000\u00a0₴')
  })
  it('обрабатывает Prisma Decimal', () => {
    const decimal = { toNumber: () => 999.99 } as Prisma.Decimal
    expect(formatPrice(decimal)).toContain('999')
  })
})

describe('getDiscountPercent', () => {
  it('считает процент скидки', () => {
    expect(getDiscountPercent(800, 1000)).toBe(20)
  })
  it('округляет до целого', () => {
    expect(getDiscountPercent(750, 1000)).toBe(25)
  })
})
```

---

## 19. ПРАВИЛА ДЛЯ АГЕНТОВ ПРИ НАПИСАНИИ КОДА

> Это финальный чеклист. Перед отправкой любого кода — проверь каждый пункт.

### Перед написанием кода

```
□ Определил тип страницы → выбрал стратегию рендеринга из таблицы §7
□ Проверил — нужен ли 'use client'? (нужен только если: useState/useEffect/события)
□ Определил — откуда берутся данные? (queries/ для чтения, actions/ для записи)
□ Проверил схему БД §6 — есть ли нужные поля?
□ Знаю какие файлы создаю и куда они ложатся по структуре §4
```

### При написании компонента

```
□ Server Component — нет 'use client', нет useState, нет useEffect
□ Client Component — минимально возможный, только там где нужна интерактивность
□ Все изображения — через next/image с alt, width/height или fill+sizes
□ Все ссылки — через next/link, не через <a>
□ Все тексты интерфейса — через t() из next-intl
□ Классы — через cn(), не конкатенация строк
□ Semantic HTML: nav, main, article, section, button (не div для кликабельного)
□ aria-label для кнопок без видимого текста
□ generateMetadata — экспортирован из каждого page.tsx
```

### При работе с данными

```
□ Запрос к БД — только с select нужных полей (не include без select)
□ Коллекции — только с take/skip
□ Мутации нескольких таблиц — в $transaction
□ Server Action возвращает { success, error? } — не бросает исключения в UI
□ Входные данные Server Action — валидируются через Zod перед обработкой
□ Проверка авторизации — в начале каждого Server Action
□ prisma в runtime-коде импортируется ТОЛЬКО из @/lib/prisma — новый экземпляр разрешён только в src/lib/prisma.ts и технических scripts/seed
```

### При написании TypeScript

```
□ Нет any — везде явные типы или unknown
□ Нет non-null assertion (!) — везде явные проверки
□ Нет @ts-ignore без объяснения
□ Типы данных — из @/types/, не дублировать
□ Zod схемы — для валидации внешних данных (формы, API, params)
```

### СТОП-СИГНАЛЫ — немедленно остановиться и пересмотреть решение

```
🛑 Пишу fetch() в useEffect Client Component → нужен Server Component
🛑 Импортирую prisma в файл с 'use client' → разделить на server/client
🛑 Создаю новый PrismaClient() в app/components/actions/queries/lib → использовать @/lib/prisma
🛑 Использую any → найти или описать правильный тип
🛑 Пишу style={{}} → использовать Tailwind классы
🛑 Хардкожу текст кнопки/лейбла → использовать t()
🛑 Делаю findMany() без take → добавить лимит
🛑 Делаю мутацию в GET handler → только POST/PATCH/DELETE
🛑 Возвращаю полный объект User из API → select только публичные поля
🛑 Пишу getStaticProps / getServerSideProps → только App Router паттерны
🛑 Импортирую из 'react-dom' напрямую → только через React
🛑 Создаю файл .js вместо .ts/.tsx → только TypeScript

🛑 Next.js 16 специфичные:
🛑 Пишу export const revalidate = N → заменить на 'use cache' + cacheLife()
   ✅ НЕ путать с revalidateTag(...) — revalidateTag разрешён и используется в actions/
🛑 Пишу export const dynamic = 'force-dynamic' → просто не используй 'use cache'
🛑 Использую experimental.ppr в next.config → удалить, использовать cacheComponents
🛑 Создаю/редактирую middleware.ts → файл называется proxy.ts в Next.js 16
🛑 Использую unstable_cache → заменить на 'use cache' + cacheTag()
🛑 Использую cache() из 'react' для дедупликации → заменить на 'use cache'
🛑 Пишу @default(cuid()) в Prisma схеме → cuid deprecated, использовать cuid2()
🛑 Пишу --turbopack в scripts → Turbopack по умолчанию в Next.js 16, флаг не нужен
```

---

## ВЕРСИОНИРОВАНИЕ ЭТОГО ДОКУМЕНТА

При изменении любого раздела:
1. Обновить версию в шапке файла
2. Добавить запись в CHANGELOG ниже
3. Уведомить всех агентов о смене контекста

## CHANGELOG

| Версия | Дата | Изменение |
|--------|------|-----------|
| 1.0 | 2025-04 | Первоначальная версия |
| 1.1 | 2026-04 | Патч Algolia: §20, двухключевая архитектура, ALGOLIA_ADMIN_KEY, мультиязычные индексы |
| 1.2 | 2026-04 | Миграция на Next.js 16: cacheComponents/'use cache' вместо PPR/revalidate, proxy.ts вместо middleware.ts, Turbopack stable, React Compiler stable, cuid→cuid2, CartItem в схеме, hooks/ папка, instrumentation.ts, AGENTS.md, обновлён §7/§12/§13/§14/§16/§19 |
| 1.3 | 2026-05 | Актуализация обязательного стека: Prisma 7.x и Zustand 5.x; добавлены правила Prisma 7 (`prisma.config.ts`, `prisma-client`, `@prisma/adapter-pg`, generated client `src/generated/prisma`); уточнено исключение для `new PrismaClient()` в технических scripts/seed |

---
*MASTER_CONTEXT.md — единственный источник истины для агентной разработки.*
*Любые отклонения от этого документа требуют явного согласования и обновления документа.*

---

## 20. ПОИСК — ALGOLIA

> ⚠️ Этот раздел обязателен к прочтению перед любой работой с поиском.
> Algolia имеет особую двухключевую архитектуру, которая не вписывается
> в стандартные правила §3.2 — исключения явно описаны здесь.

### Когда использовать Algolia

```
✅ Каталог до 50 000 SKU           → Algolia (free tier до 10K записей)
✅ Команда без DevOps опыта        → Algolia (нет инфраструктуры для поддержки)
✅ Быстрый старт                   → Algolia
⚠️ Каталог > 50 000 SKU           → рассмотреть Elasticsearch
⚠️ > 10 000 поисковых запросов/мес → нужен платный план Algolia
```

### Двухключевая архитектура — КРИТИЧНО

```
ALGOLIA_ADMIN_KEY               — запись, удаление, настройка индексов
                                  ТОЛЬКО серверный код ('use server', lib/, scripts/)
                                  НИКОГДА не в NEXT_PUBLIC_*
                                  НИКОГДА не в Client Components

NEXT_PUBLIC_ALGOLIA_SEARCH_KEY  — только чтение (поиск)
                                  безопасно передавать в браузер
                                  не может изменить или удалить данные в индексе
```

### Singleton клиент — lib/algolia.ts

```typescript
// src/lib/algolia.ts
import algoliasearch from 'algoliasearch'
import type { SearchIndex } from 'algoliasearch'

const globalForAlgolia = globalThis as unknown as {
  algoliaAdmin: ReturnType<typeof algoliasearch>
}

export const algoliaAdmin =
  globalForAlgolia.algoliaAdmin ??
  algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!   // ⛔ только серверный код
  )

if (process.env.NODE_ENV !== 'production') {
  globalForAlgolia.algoliaAdmin = algoliaAdmin
}

export const ALGOLIA_LOCALES = ['uk', 'ru'] as const
export type AlgoliaLocale = typeof ALGOLIA_LOCALES[number]

export function getProductIndex(locale: AlgoliaLocale): SearchIndex {
  return algoliaAdmin.initIndex(`products_${locale}`)
}

export interface AlgoliaProductRecord {
  objectID: string        // = product.id из Prisma
  slug: string
  sku: string
  name: string
  description: string
  price: number           // Number(Decimal) — Algolia не понимает Prisma Decimal
  comparePrice: number | null
  inStock: boolean        // stock > 0
  categorySlug: string
  categoryName: string
  brandName: string | null
  image: string | null
  locale: AlgoliaLocale
}
```

### Индексация — actions/search.ts

```typescript
// src/actions/search.ts
'use server'

import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getProductIndex, ALGOLIA_LOCALES } from '@/lib/algolia'
import type { AlgoliaProductRecord, AlgoliaLocale } from '@/lib/algolia'
import { requireAdmin } from '@/lib/auth'

async function buildAlgoliaRecord(
  productId: string,
  locale: AlgoliaLocale
): Promise<AlgoliaProductRecord | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: {
      id: true, slug: true, sku: true, price: true,
      comparePrice: true, stock: true,
      translations: { where: { locale }, select: { name: true, description: true } },
      images: { where: { isMain: true }, select: { url: true }, take: 1 },
      category: { select: { slug: true, translations: { where: { locale }, select: { name: true } } } },
      brand: { select: { name: true } },
    },
  })
  if (!product) return null
  return {
    objectID: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.translations[0]?.name ?? '',
    description: product.translations[0]?.description ?? '',
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    inStock: product.stock > 0,
    categorySlug: product.category.slug,
    categoryName: product.category.translations[0]?.name ?? '',
    brandName: product.brand?.name ?? null,
    image: product.images[0]?.url ?? null,
    locale,
  }
}

export async function indexProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    for (const locale of ALGOLIA_LOCALES) {
      const record = await buildAlgoliaRecord(productId, locale)
      if (record) await getProductIndex(locale).saveObject(record)
    }
    revalidateTag('search')
    return { success: true }
  } catch (error) {
    console.error('[indexProduct]', error)
    return { success: false, error: 'Помилка індексації' }
  }
}

export async function syncProductPrice(productId: string, price: number, stock: number): Promise<void> {
  for (const locale of ALGOLIA_LOCALES) {
    await getProductIndex(locale).partialUpdateObject({ objectID: productId, price, inStock: stock > 0 })
  }
}

export async function removeProductFromIndex(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    for (const locale of ALGOLIA_LOCALES) {
      await getProductIndex(locale).deleteObject(productId)
    }
    revalidateTag('search')
    return { success: true }
  } catch (error) {
    console.error('[removeProductFromIndex]', error)
    return { success: false, error: 'Помилка видалення з індексу' }
  }
}
```

### Синхронизация при мутациях — ОБЯЗАТЕЛЬНО

```typescript
// src/actions/product.ts — каждая мутация товара синхронизирует Algolia
export async function createProduct(data: ProductCreateInput) {
  await requireAdmin()
  const product = await prisma.product.create({ data })
  await indexProduct(product.id)          // ✅ ОБЯЗАТЕЛЬНО
  revalidateTag('products')
  return { success: true, productId: product.id }
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  await requireAdmin()
  const product = await prisma.product.update({ where: { id }, data })
  if (data.price !== undefined || data.stock !== undefined) {
    await syncProductPrice(id, Number(product.price), product.stock) // ✅ быстрее
  } else {
    await indexProduct(id)                // ✅ полное переиндексирование
  }
  revalidateTag('products')
  revalidateTag(`product-${product.slug}`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await removeProductFromIndex(id)        // ✅ сначала из индекса
  await prisma.product.delete({ where: { id } })
  revalidateTag('products')
  return { success: true }
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAdmin()
  const product = await prisma.product.update({ where: { id }, data: { isActive } })
  if (!isActive) {
    await removeProductFromIndex(id)      // ✅ деактивация = удалить из поиска
  } else {
    await indexProduct(id)               // ✅ активация = добавить в поиск
  }
  revalidateTag('products')
  revalidateTag(`product-${product.slug}`)
  return { success: true }
}
```

### Поисковый UI — Client Component (исключение из §3.2)

```typescript
// src/components/search/search-box.tsx
// ✅ ИСКЛЮЧЕНИЕ из §3.2 — InstantSearch использует Search-Only ключ
// Поиск идёт браузер → Algolia напрямую, минуя Next.js сервер (~5ms).
'use client'

import Image from 'next/image'
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch'
import algoliasearch from 'algoliasearch/lite'
import { useLocale } from 'next-intl'
import type { AlgoliaLocale, AlgoliaProductRecord } from '@/lib/algolia'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!  // ✅ Search-Only
)

export function ProductSearch() {
  const locale = useLocale() as AlgoliaLocale
  return (
    <InstantSearch searchClient={searchClient} indexName={`products_${locale}`}>
      <Configure hitsPerPage={8} filters="inStock:true" />
      <SearchBox
        placeholder={locale === 'uk' ? 'Пошук товарів...' : 'Поиск товаров...'}
        classNames={{
          root: 'relative',
          input: 'w-full rounded-lg border border-gray-200 px-4 py-2 text-sm',
          submit: 'hidden',
          reset: 'hidden',
        }}
      />
      <Hits hitComponent={ProductSearchHit} />
    </InstantSearch>
  )
}

function ProductSearchHit({ hit }: { hit: AlgoliaProductRecord }) {
  return (
    <article className="flex items-center gap-3 p-2 hover:bg-gray-50">
      {hit.image && (
        // ✅ next/image обязателен даже в Client Components
        <Image
          src={hit.image}
          alt={hit.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded object-cover"
        />
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{hit.name}</p>
        <p className="text-sm text-gray-500">{hit.price} ₴</p>
      </div>
    </article>
  )
}
```

### Fallback поиск — queries/search.ts

```typescript
// src/queries/search.ts — если Algolia недоступна
import { prisma } from '@/lib/prisma'

export async function searchProductsFallback(query: string, locale: string, take = 10) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      translations: { some: { locale, name: { contains: query, mode: 'insensitive' } } },
    },
    select: {
      id: true, slug: true, price: true,
      translations: { where: { locale }, select: { name: true } },
      images: { where: { isMain: true }, select: { url: true }, take: 1 },
    },
    take,
  })
}
```

### Правила для агентов — поиск

```
□ НИКОГДА не использовать ALGOLIA_ADMIN_KEY в клиентском коде или NEXT_PUBLIC_*
□ НИКОГДА не создавать algoliasearch() вне lib/algolia.ts
□ ВСЕГДА создавать два индекса: products_uk и products_ru
□ ВСЕГДА синхронизировать Algolia при create/update/delete/toggleActive товара
□ InstantSearch в Client Component — РАЗРЕШЕНО (исключение из §3.2)
□ При удалении товара — сначала removeProductFromIndex(), потом prisma.delete()
□ AlgoliaProductRecord.price — Number(), не Prisma.Decimal
□ Если Algolia недоступна — использовать searchProductsFallback из queries/search.ts
```
