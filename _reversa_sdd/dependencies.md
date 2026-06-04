# Зависимости — Elektronom

> Артефакт агента **Scout** · Reversa · Дата: 2026-05-30
> Источник: `package.json`. Менеджер: **npm** (`package-lock.json`).

## Runtime-зависимости

| Пакет | Версия | Роль | Заметки по риску |
|-------|--------|------|------------------|
| `next` | 16.2.3 | Фреймворк (App Router, RSC) | Очень свежий мажор |
| `react` / `react-dom` | 19.2.4 | UI-рантайм | React 19 (новый) |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler (авто-мемоизация) | Влияет на поведение ре-рендеров |
| `@prisma/client` | 7.8.0 | Клиент ORM | Prisma 7 (новый мажор) |
| `@prisma/adapter-pg` | 7.8.0 | Драйверный адаптер Postgres | Driver adapters |
| `prisma` | 7.8.0 | CLI/генератор (в deps, не devDeps) | — |
| `@auth/prisma-adapter` | 2.11.2 | Адаптер сессий NextAuth↔Prisma | — |
| `next-auth` | 5.0.0-beta.31 | Аутентификация | ⚠️ **beta** — API нестабилен |
| `algoliasearch` | 5.52.1 | Поиск | Внешний сервис |
| `cloudinary` | 2.10.0 | Изображения | Внешний сервис |
| `resend` | 6.12.3 | Email | Внешний сервис |
| `next-intl` | 4.9.1 | i18n | Маршруты `[locale]` |
| `zustand` | 5.0.13 | Клиентский state (cart, ui) | — |
| `zod` | 4.4.3 | Валидация схем | Zod 4 |
| `bcryptjs` | 3.0.3 | Хеш паролей | Credentials-логин |
| `@base-ui/react` | 1.4.0 | Безстилевые примитивы UI | — |
| `shadcn` | 4.2.0 | Генератор UI-компонентов | Обычно dev-инструмент |
| `lucide-react` | 1.8.0 | Иконки | — |
| `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` | — | Утилиты стилей | — |

## Dev-зависимости

| Пакет | Версия | Роль |
|-------|--------|------|
| `typescript` | ^5 | Компилятор |
| `tailwindcss` + `@tailwindcss/postcss` | ^4 | Стили (Tailwind 4) |
| `eslint` + `eslint-config-next` | 9 / 16.2.3 | Линтинг |
| `tsx` | 4.22.0 | Запуск TS-скриптов (seed, тесты) |
| `dotenv` | 17.4.2 | Загрузка env в скриптах |
| `@types/*` | — | Типы (node, react, react-dom, bcryptjs) |

## NPM-скрипты

| Скрипт | Команда | Назначение |
|--------|---------|-----------|
| `dev` | `next dev` | Локальная разработка |
| `build` | `next build` | Прод-сборка |
| `start` | `next start` | Прод-сервер |
| `lint` | `eslint` | Линтинг |
| `test` | `tsx scripts/test-helpers.ts` | Ad-hoc проверка хелперов |
| `test:jsonb` | `tsx scripts/test-jsonb-facets.ts` | Проверка JSONB-фасетов |
| `db:generate` | `prisma generate` | Генерация клиента |
| `db:migrate` | `prisma migrate dev` | Миграции (dev) |
| `db:push` | `prisma db push` | Синхронизация схемы без миграции |
| `db:seed` | `tsx prisma/seed.ts` | Заполнение БД |
| `db:studio` | `prisma studio` | UI БД |

## Наблюдения и риски

- 🟡 **Bleeding edge по всему стеку:** Next 16 + React 19 + Prisma 7 + NextAuth 5-beta. Главный системный риск — нестабильность API и нехватка community-практик. Beta NextAuth особенно чувствителен.
- 🟡 `prisma` и `shadcn` находятся в `dependencies`, хотя обычно это dev-инструменты — раздувает прод-бандл/установку.
- 🔴 **Нет тест-раннера** (jest/vitest/playwright) — при таком свежем стеке отсутствие тестов повышает риск регрессий.
- 🟢 Платёжный SDK в зависимостях не виден — оплата, вероятно, через прямые HTTP-вызовы к провайдеру (см. `PAYMENT_*`). Уточнить в Archaeologist.
- 🟢 LLM/embeddings-SDK для ассистента в зависимостях не виден — RAG, возможно, проксируется через `Content Factory` API или прямые fetch-вызовы. 🔴 Требует подтверждения.
