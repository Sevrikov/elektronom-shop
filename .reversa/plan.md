# План реверс-инжиниринга — Elektronom

> Проект: **Elektronom** — каталог интернет-магазина (Next.js 16 / React 19 / Prisma 7 / Postgres)
> Сгенерировано: Reversa · Язык спецификаций: Русский
> Папка артефактов: `_reversa_sdd/`

## Обзор (предварительное распознавание)

- **Стек:** Next.js 16 (App Router), React 19 + React Compiler, TypeScript, Prisma 7 (адаптер `pg`), NextAuth v5, Algolia, Cloudinary, next-intl, Zustand, shadcn/Tailwind 4, Resend, Zod.
- **Объём:** ~68 700 строк в `src/`, 5 миграций БД, ~25 моделей Prisma.
- **i18n:** маршруты под `[locale]`, модели с переводами (`CategoryTranslation`, `ProductTranslation`).

---

## Фаза 1 — Распознавание (Scout) 🔍

- [x] ✅ **Scout** — карта структуры, модулей, зависимостей, внешних интеграций → `surface.json`, `inventory.md`, `dependencies.md` *(завершено 2026-05-30)*

## Фаза 2 — Раскопки (Archaeologist) ⛏️
*(перечень уточняется после Scout — предварительно по модулям)*

- [x] ✅ **Archaeologist** — `catalog` (категории, бренды, товары, фасеты/фильтры) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `product` (страница товара, изображения, отзывы) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `cart-checkout-orders` (корзина, оформление, заказы, OrderCounter) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `auth-account` (NextAuth, профиль, адреса, wishlist) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `assistant` (AI-ассистент, RAG: TechnicalDocument/DocumentChunk) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `search` (Algolia) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `admin` (управление товарами, загрузки, content-factory) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `suppliers` (SupplierInventory, ASKO, analyze-products) *(2026-05-30)*
- [x] ✅ **Archaeologist** — `core-infra` (Prisma-схема, i18n, storage/Cloudinary, env, logger) *(2026-05-30)*

## Фаза 3 — Интерпретация (Detective + Architect) 🕵️🏛️

- [x] ✅ **Detective** — бизнес-правила, домен, инварианты (цены, наличие, статусы заказов) *(2026-05-30)*
- [x] ✅ **Architect** — архитектура, границы модулей, потоки данных, решения (ADR), диаграммы *(2026-05-30)*

## Фаза 4 — Генерация (Writer) ✍️

- [x] ✅ **Writer** — исполняемые спецификации SDD (`_reversa_sdd/`): 9 модулей × {requirements,design,tasks} + globals (code-spec-matrix, openapi, user-stories) *(2026-05-30)*

## Фаза 5 — Ревизия (Reviewer) ✅

- [x] ✅ **Reviewer** — перекрёстная проверка, матрица трассировки, перечень пробелов (🔴) для валидации человеком *(2026-05-30)*

---

## Примечания

- В корне уже есть многочисленные прежние отчёты (`REVERSA_FINAL_PROJECT_REVIEW_*`, `PROJECT_AUDIT.md`, `REVIEW_*`, `TZ_*`). Агенты могут опираться на них как на вторичный источник, но первоисточник — **код**.
- Reversa пишет **исключительно** в `.reversa/` и `_reversa_sdd/`. Существующие файлы проекта не изменяются.
