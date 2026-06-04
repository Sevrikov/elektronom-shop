# Инвентаризация — Elektronom

> Артефакт агента **Scout** (Фаза 1 — Распознавание) · Reversa
> Дата: 2026-05-30 · Язык: Русский
> Источник истины — код. Уровни уверенности: 🟢 подтверждено · 🟡 выведено · 🔴 пробел.

---

## 1. Идентификация проекта

| Поле | Значение |
|------|----------|
| Имя | **Elektronom** (`package.json` → `elektronom`, v0.1.0) 🟢 |
| Тип | Каталог интернет-магазина (e-commerce, украинский рынок) 🟢 |
| Репозиторий | `github.com/Sevrikov/elektronom-shop` 🟢 |
| Деплой | Vercel (есть `.vercel/`, нет Docker/CI) 🟢 |
| Корень | `C:\Users\sevri\Сайт\elektronom` |

## 2. Технологический стек

**Язык:** TypeScript (основной) — 47 `.ts` + 101 `.tsx` рукописных файлов; +30 сгенерированных (`src/generated/prisma`). 🟢

**Фреймворк и ключевые библиотеки** (из `package.json`):

| Категория | Технология | Версия |
|-----------|-----------|--------|
| Фреймворк | Next.js (App Router) | 16.2.3 |
| UI-рантайм | React + React DOM | 19.2.4 |
| Компилятор | babel-plugin-react-compiler | 1.0.0 |
| ORM | Prisma + `@prisma/client` + адаптер `@prisma/adapter-pg` | 7.8.0 |
| Аутентификация | next-auth (Auth.js) | 5.0.0-beta.31 |
| Поиск | algoliasearch | 5.52.1 |
| Изображения | cloudinary | 2.10.0 |
| Email | resend | 6.12.3 |
| i18n | next-intl | 4.9.1 |
| State | zustand | 5.0.13 |
| UI-кит | shadcn + @base-ui/react + lucide-react + Tailwind 4 | — |
| Валидация | zod | 4.4.3 |
| Хеш паролей | bcryptjs | 3.0.3 |

**Менеджер пакетов:** npm (`package-lock.json`). 🟢

> ⚠️ Стек на «бета/bleeding edge»: Next 16, React 19, NextAuth 5 beta, Prisma 7. Возможны нестандартные паттерны и временные обходы — Archaeologist должен это учитывать.

## 3. Точки входа

| Путь | Тип | Назначение |
|------|-----|-----------|
| `src/app/layout.tsx` | app_entry (root) | Корневой layout |
| `src/app/[locale]/layout.tsx` | app_entry (locale) | Layout с локалью (next-intl) |
| `src/app/[locale]/page.tsx` | page | Главная |
| `instrumentation.ts` | observability | Хук инструментирования Next.js |
| `src/i18n/request.ts` | i18n config | Конфиг next-intl |
| `next.config.ts`, `prisma.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json` | config | Конфигурация |
| `.env.example` | config | Шаблон переменных окружения |

> 🔴 **Пробел:** middleware-файл next-intl не обнаружен (`middleware.ts` отсутствует в корне и `src/`). Локализация маршрутов, вероятно, через `[locale]`-сегмент без middleware — уточнить в Archaeologist.

## 4. Карта маршрутов (App Router, `src/app/[locale]/`)

**Группа `(shop)`:** `catalog`, `catalog/[slug]`, `product/[slug]`, `brands`, `brands/[slug]`, `cart`, `checkout`, `order-success`, `search`
**Группа `(account)`:** `orders`, `orders/[number]`, `profile`, `wishlist`
**Группа `(auth)`:** `login`, `register`
**Группа `(info)`:** `about`, `contacts`, `delivery`
**Прочее:** `/` (главная), `admin`, `assistant`

**API-маршруты (`src/app/api/`):**
- `api/admin/upload/route.ts` — загрузка изображений (Cloudinary)
- `api/assistant/chat/route.ts` — чат AI-ассистента
- `api/auth/[...nextauth]/route.ts` — NextAuth handler

## 5. Модули (предварительно)

| Модуль | Компоненты | Расположение логики |
|--------|-----------|---------------------|
| **catalog** | 14 | `components/catalog`, `lib/catalog-*`, `queries/categories`, `queries/brands` |
| **product** | 8 | `components/product`, `queries/products` |
| **cart** | 5 | `components/cart`, `actions/cart`, `store/cart-store`, `hooks/use-cart` |
| **checkout/orders** | — | `actions/order`, `queries/orders`, модель `Order`/`OrderCounter` |
| **auth/account** | — | `actions/auth`, `actions/user`, `lib/auth`, `(account)/*` |
| **assistant** | 7 | `components/assistant`, `lib/assistant`, `api/assistant/chat`, модели `Technical*`/`Assistant*` |
| **search** | 1 | `components/search`, `lib/algolia`, `queries/search`, `actions/search` |
| **admin** | 9 (+products) | `components/admin`, `actions/admin`, `api/admin/upload` |
| **suppliers** | — | `actions/get-asko-products`, `actions/analyze-products`, модель `SupplierInventory` |
| **home** | 7 | `components/home` |
| **layout/shared/ui** | 14 | `components/layout`, `components/shared`, `components/ui` |
| **core-infra** | — | `lib/*`, `i18n`, `config`, `prisma`, `types`, `store` |

## 6. База данных (поверхностно)

- **ORM:** Prisma 7, адаптер Postgres (`@prisma/adapter-pg`). 🟢
- **Схема:** `prisma/schema.prisma` (~25 моделей + 4 enum).
- **Миграции:** 4 (`init`, `add_product_attributes_gin_index`, `add_order_counter`, `add_product_image_metadata`) + `migration_lock.toml`.
- **Сид:** `prisma/seed.ts` (~26 КБ).
- **Сгенерированный клиент:** `src/generated/prisma/` (30 файлов — НЕ анализировать, артефакт генерации).

Модели: `User`, `Account`, `Session`, `VerificationToken`, `Address`, `Category`, `CategoryTranslation`, `Brand`, `Product`, `ProductTranslation`, `ProductImage`, `Review`, `WishlistItem`, `CartItem`, `Order`, `OrderItem`, `OrderCounter`, `TechnicalDocument`, `DocumentChunk`, `AssistantSession`, `AssistantMessage`, `SupplierInventory`. Enum: `UserRole`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`.

> Детальный разбор — у агента **Data Master / Archaeologist**.

## 7. Тесты

| Параметр | Значение |
|----------|----------|
| Тест-раннер | 🔴 **Отсутствует** в `package.json` (нет jest/vitest/playwright в зависимостях) |
| Что есть | 2 ad-hoc tsx-скрипта: `scripts/test-helpers.ts`, `scripts/test-jsonb-facets.ts` |
| Намёки на E2E | `E2E_TEST_SECRET` в env + отчёты `e2e_checkout_and_auth_report.md` — гарнес E2E существовал, но в зависимостях не закреплён 🟡 |
| Оценка покрытия | Близко к нулю по автотестам; качество контролируется ручными review-отчётами |

## 8. Внешние интеграции (по `.env.example` + зависимостям)

| Интеграция | Назначение | Источник |
|-----------|-----------|----------|
| **PostgreSQL** | Основная БД | `DATABASE_URL`, Prisma |
| **NextAuth / Auth.js** | Аутентификация | `AUTH_SECRET`, `AUTH_URL` |
| **Google OAuth** | Соц-логин | `GOOGLE_CLIENT_ID/SECRET` |
| **Facebook OAuth** | Соц-логин | `FACEBOOK_CLIENT_ID/SECRET` |
| **Algolia** | Поиск | `ALGOLIA_ADMIN_KEY`, `*_APP_ID`, `*_SEARCH_KEY` |
| **Cloudinary** | Хранение/обработка изображений | пакет `cloudinary`, `lib/storage`, `lib/images` 🟡 |
| **Resend** | Транзакционный email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| **Платёжный провайдер** | Оплата (webhook) | `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET` 🟡 (провайдер не назван) |
| **Content Factory** | Внешний сервис генерации контента (админка) | `CONTENT_FACTORY_API_URL`, `CONTENT_FACTORY_TOKEN` |
| **Поставщик ASKO** | Импорт товаров/остатков | `actions/get-asko-products`, `SupplierInventory` 🟡 |
| **LLM/эмбеддинги ассистента** | RAG-ассистент (`DocumentChunk`) | 🔴 провайдер не виден в `.env.example` — уточнить |

## 9. Прочие материалы в репозитории (не код)

- **Десятки** review/ТЗ-отчётов в корне (`REVERSA_FINAL_PROJECT_REVIEW_*`, `PROJECT_AUDIT.md`, `MASTER_CONTEXT*`, `TZ_*`, `REVIEW_*`) — ценный вторичный контекст.
- `docs/tz/`, `delivery/` (баннеры, bg-removal, prom-admin-research), `tools/` (`image-bg-removal`, `reversa`), `scratch/`.
- MHTML-снимки конкурентов (Rozetka) — артефакты исследований.

## 10. Итог Scout

- **Язык:** TypeScript · **Фреймворк:** Next.js 16 (App Router) + React 19 · **ORM:** Prisma 7 / Postgres.
- **~14 модулей**, ~25 моделей данных, 21 страница, 3 API-маршрута.
- **11 внешних интеграций** (2 — с пробелами 🔴).
- **CI/CD и Docker отсутствуют**; деплой — Vercel. Автотестов практически нет.
- Рекомендуемая организация спецификаций: **по модулям (module)**.
