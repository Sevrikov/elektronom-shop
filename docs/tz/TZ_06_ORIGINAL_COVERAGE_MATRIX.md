# ТЗ 06. Сверка покрытия исходных ТЗ

Дата: 2026-05-21  
Назначение: показать, что пункты из первоначальных файлов перенесены, исправлены или осознанно переприоритезированы.

## Итог проверки

Первый перенос был корректен по смыслу, но слишком сжат по деталям. После повторной сверки недостающие подробные пункты добавлены в `TZ_00`-`TZ_05`.

Статусы:

- `перенесено` — требование сохранено в новом ТЗ;
- `исправлено` — требование сохранено, но обновлено под MASTER v1.3;
- `переприоритезировано` — требование не потеряно, но перенесено в P1/P2;
- `оригинал` — оставлено только в `docs/tz/original/` как исторический текст.

## ТЗ_СВОДНОЕ.md

| Исходный блок | Новый файл | Статус |
|---|---|---|
| Поточный стан проекта | `TZ_00_SUMMARY.md`, `TZ_01_STATUS_AND_SCOPE.md` | исправлено: старый процент готовности заменён текущим состоянием |
| Sprint 1 Backend foundation | `TZ_00_SUMMARY.md`, `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Sprint 2 Product + Cart | `TZ_00_SUMMARY.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | исправлено: product/cart частично уже есть, оставлены проверки и недостающие сценарии |
| Sprint 3 Checkout + Auth + Account | `TZ_00_SUMMARY.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено как P0/P1 |
| Sprint 4 SEO, Search, Content, Tests | `TZ_00_SUMMARY.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md`, `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено |
| Критические правила: no JS, no any, use client only when needed, proxy.ts, Prisma singleton, findMany take, Algolia key, next-intl, next/image | `TZ_00_SUMMARY.md`, `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено и исправлено под Prisma 7 |

## ТЗ_часть1.md

| Исходный блок | Новый файл | Статус |
|---|---|---|
| Реализованная инфраструктура, роутинг, layout, главная, каталог | `TZ_01_STATUS_AND_SCOPE.md` | исправлено под фактический текущий статус |
| Отсутствующие страницы: product, cart, checkout, search, brands, info, auth, account, admin, SEO/system pages | `TZ_01_STATUS_AND_SCOPE.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено, product/cart/system pages отмечены как частично созданные |
| Отсутствующие компоненты: product, cart, search, checkout, account, shared | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Backend/infrastructure gaps | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Оценка готовности | `TZ_00_SUMMARY.md`, `TZ_01_STATUS_AND_SCOPE.md` | исправлено: старые проценты не используются |
| Legacy pages elektronon.com.ua | `TZ_01_STATUS_AND_SCOPE.md` | перенесено как список legacy/nedостающих страниц |

## ТЗ_часть2.md

| Исходный блок | Новый файл | Статус |
|---|---|---|
| Prisma schema models | `TZ_02_BACKEND_PROTOCOL.md` | перенесено и исправлено под Prisma 7 |
| DB tasks: schema, seed, env, migrate, seed, GIN index | `TZ_02_BACKEND_PROTOCOL.md`, `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено |
| `lib/prisma.ts` | `TZ_02_BACKEND_PROTOCOL.md` | исправлено под generator `prisma-client`, output `src/generated/prisma`, adapter-pg |
| `lib/auth.ts` | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| `lib/algolia.ts` | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| `lib/env.ts`, `lib/logger.ts`, `lib/email.ts`, `lib/payment.ts`, `lib/utils.ts` | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Product/category/brand/order/search queries | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Cart/order/product/user/search/review/wishlist actions | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| API route handlers auth/payment/products | `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| `.env.example` | `TZ_02_BACKEND_PROTOCOL.md`, `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено |
| Static data → Prisma migration | `TZ_02_BACKEND_PROTOCOL.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |

## ТЗ_часть3.md

| Исходный блок | Новый файл | Статус |
|---|---|---|
| Home page tasks | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Catalog hub tasks | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Category page tasks | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Product page tasks and product components | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | исправлено: страница уже создана, оставлены требования к доводке |
| Search page/header search | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md`, `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Cart page/components | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md`, `TZ_02_BACKEND_PROTOCOL.md` | исправлено: cart уже есть, оставлены проверки |
| Checkout page/form/order success | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено как P0 |
| Brands pages | `TZ_01_STATUS_AND_SCOPE.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | переприоритезировано P1/P2 |
| Auth pages | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md`, `TZ_02_BACKEND_PROTOCOL.md` | перенесено |
| Account pages/components | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Content pages about/delivery/contacts | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| System pages | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Shared/UI/layout components | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md`, `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Zustand stores and hooks | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | исправлено под Zustand 5 |
| SEO/microdata | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| I18N keys | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Unit/integration/e2e tests | `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено |
| Admin panel | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Performance | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Additional features: promocodes, blog, compare, recently viewed, newsletter, Nova Poshta, LiqPay, GA4, Sentry | `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | переприоритезировано P2/owner decision |

## ТЗ_часть4_дизайн.md

| Исходный блок | Новый файл | Статус |
|---|---|---|
| CSS tokens / `@theme` | `TZ_04_DESIGN_SYSTEM.md` | перенесено как требование проверки и сохранения визуального смысла |
| Typography | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Button | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| ProductCard | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Qty Stepper | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Category Sidebar | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Hybrid Catalog Drawer | `TZ_04_DESIGN_SYSTEM.md` | перенесено с условием актуальности паттерна |
| Value Props Strip | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Stock Badge | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Search Bar | `TZ_04_DESIGN_SYSTEM.md`, `TZ_03_FRONTEND_ROUTES_COMPONENTS.md` | перенесено |
| Header 3-line structure | `TZ_04_DESIGN_SYSTEM.md` | перенесено с проверкой актуальности дизайна |
| Footer | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Mobile Tab Bar | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Grids/layout | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Quantity breaks | `TZ_04_DESIGN_SYSTEM.md` | переприоритезировано, зависит от бизнес-решения |
| Animations/transitions | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Branding/logo | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Icons | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Pre-footer B2B CTA | `TZ_04_DESIGN_SYSTEM.md` | перенесено |
| Design checklist | `TZ_04_DESIGN_SYSTEM.md`, `TZ_05_ACCEPTANCE_CHECKLIST.md` | перенесено |

## Что было исправлено, а не скопировано буквально

- MASTER v1.2 заменён на MASTER v1.3.
- Prisma обновлена до Prisma 7 protocol.
- Zustand обновлён до Zustand 5.
- `.cuid()` в Zod не возвращается, потому что Cuid2 не обязан проходить старую проверку.
- `updateTag` из старых формулировок трактуется как актуальный `revalidateTag`/Next.js 16 cache API после проверки локальных docs.
- Старые статусы “не создано” для product/cart/system pages заменены текущим “создано, но требует проверки/доработки”.
- Дизайн-требование “никаких inline styles вообще” уточнено: inline styles запрещены как обычный способ верстки, но редкие dynamic values допустимы, если Tailwind/CSS variable не подходит.
