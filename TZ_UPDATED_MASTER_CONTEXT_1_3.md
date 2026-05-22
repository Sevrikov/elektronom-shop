# ТЕХНИЧЕСКОЕ ЗАДАНИЕ — ELEKTRONOM SHOP

Версия ТЗ: 1.1  
Дата обновления: 2026-05-21  
Базовый протокол: `MASTER_CONTEXT v1_02.md` версия `1.3`  
Стек: Next.js 16 + TypeScript + PostgreSQL + Prisma 7 + Zustand 5 + Tailwind CSS v4

## Статус документа

Этот файл актуализирует исходное ТЗ из папки:

`C:\Users\sevri\.gemini\antigravity\brain\5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a\`

Исходное ТЗ остаётся полезной дорожной картой, но оно ссылалось на `MASTER_CONTEXT v1.2` и частично устарело. Дальше разработка должна идти по этому обновлённому статусу и по `MASTER_CONTEXT v1_02.md` версии `1.3`.

## Ключевые изменения относительно старого ТЗ

- Официальный стек обновлён: **Prisma 7.x**, не Prisma 5.x.
- Официальный клиентский state manager: **Zustand 5.x**, не Zustand 4.x.
- Prisma 7 требует:
  - `prisma.config.ts`;
  - generated client `@/generated/prisma/client`;
  - adapter `@prisma/adapter-pg`;
  - singleton в `src/lib/prisma.ts`;
  - `cuid2()` в Prisma schema.
- Next.js 16 требует аккуратной работы с `cacheComponents`, `Suspense` и uncached data.
- Старую таблицу готовности нужно считать устаревшей.

## Текущий фактический статус

Проверено после последних правок:

```powershell
npm run lint
npm run build
npx tsc --noEmit
```

Текущий результат:

- `npm run lint` — проходит.
- `npm run build` — проходит.
- `npx tsc --noEmit` — проходит.

Это означает, что технические build/lint блокеры сняты. Но это не означает полного соответствия ТЗ: значительная часть функционала магазина ещё отсутствует.

## Фактическая готовность по областям

| Область | Было в старом ТЗ | Сейчас по факту | Комментарий |
|---|---:|---:|---|
| Инфраструктура/конфиг | 60% | 80% | Next 16, strict TS, Prisma 7, proxy.ts, build проходит |
| Layout и навигация | 85% | 85% | Header/Footer/MobileNav есть, но нужен cleanup по стилям/i18n |
| Главная страница UI | 90% | 85% | Есть, но часть UI на inline styles и hardcoded text |
| Catalog Hub / категории UI | 80% | 80% | Есть, но часть данных/фильтров ещё смешана со статикой |
| Категория / product grid | 30% | 65% | Реальные queries есть, фильтры частично есть |
| Карточка товара | 5% | 60% | Product page, gallery, schema, similar products есть, но reviews/form не завершены |
| Корзина | 0% | 55% | Cart page/actions/drawer/add button есть, checkout отсутствует |
| Оформление заказа | 0% | 0% | Checkout и order action отсутствуют |
| Авторизация / кабинет | 0% | 20% | Auth config/route есть, login/register/account pages отсутствуют |
| Поиск | 0% | 10% | Prisma fallback query есть, Algolia layer/UI отсутствуют |
| Backend DB/actions/API | 0% | 50% | Prisma schema/auth/queries/cart actions есть, order/product/search/user actions нет |
| SEO / schema | 10% | 25% | Product schema частично есть, sitemap/robots/error pages отсутствуют |
| Admin | 0% | 0% | Админ-панель отсутствует |
| Тесты | 0% | 0% | Vitest/Playwright infrastructure отсутствует |
| **Итого** | **~25%** | **~45-50%** | Проект уже собирается, но до production-ready далеко |

## Что уже реализовано

### Инфраструктура

- Next.js 16.2.3.
- TypeScript strict.
- Tailwind CSS v4.
- `next-intl` с локалями `uk` и `ru`.
- `proxy.ts` вместо `middleware.ts`.
- `cacheComponents: true`.
- `typedRoutes: true`.
- `reactCompiler: true`.
- `images.prom.ua` в `remotePatterns`.
- `AGENTS.md`.
- `instrumentation.ts`.
- `.env.example`.
- `.gitignore` игнорирует `.env*`, `ga4-key.json`, `*-key.json`, generated Prisma client.

### Prisma / DB

- `prisma/schema.prisma` создан.
- Используется Prisma 7.
- Generated client: `src/generated/prisma`.
- `prisma.config.ts` создан.
- `src/lib/prisma.ts` singleton есть.
- Используется `@prisma/adapter-pg`.
- ID должны быть `cuid2()` согласно обновлённому MASTER_CONTEXT.
- Seed script есть.

### Auth

- `src/lib/auth.ts` есть.
- NextAuth v5 config есть.
- Credentials provider есть.
- Google provider условно подключён через ENV.
- `src/app/api/auth/[...nextauth]/route.ts` есть.

### Queries

- `src/queries/products.ts`.
- `src/queries/categories.ts`.
- `src/queries/brands.ts`.
- `src/queries/orders.ts`.
- `src/queries/search.ts`.

### Cart / Product

- `src/actions/cart.ts`.
- `src/app/[locale]/(shop)/cart/page.tsx`.
- `src/components/cart/cart-drawer.tsx`.
- `src/components/cart/cart-item.tsx`.
- `src/components/cart/add-to-cart-button.tsx`.
- `src/components/cart/cart-page-client.tsx`.
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`.
- `src/components/product/product-gallery.tsx`.
- `src/components/product/product-schema.tsx`.
- `src/components/product/product-attributes.tsx`.
- `src/components/product/similar-products.tsx`.
- `src/components/product/product-card.tsx` переведён в Server Component, интерактивность вынесена в `AddToCartButton`.

## Что остаётся сделать

### P0 — обязательно для минимального магазина

1. Checkout:
   - `src/app/[locale]/(shop)/checkout/page.tsx`
   - `src/components/checkout/checkout-form.tsx`
   - React Hook Form + Zod
   - валидация данных клиента
   - выбор доставки/оплаты

2. Order backend:
   - `src/actions/order.ts`
   - `createOrder`
   - transaction
   - snapshot товаров
   - decrement stock через `updateMany` с проверкой `stock >= quantity`
   - очистка cart после успешного заказа

3. Order success:
   - `src/app/[locale]/(shop)/order-success/page.tsx`

4. Auth pages:
   - `src/app/[locale]/(auth)/login/page.tsx`
   - `src/app/[locale]/(auth)/register/page.tsx`
   - `src/components/auth/login-form.tsx`
   - `src/components/auth/register-form.tsx`

5. Account:
   - `src/app/[locale]/(account)/orders/page.tsx`
   - `src/app/[locale]/(account)/orders/[number]/page.tsx`
   - `src/app/[locale]/(account)/profile/page.tsx`
   - `src/app/[locale]/(account)/wishlist/page.tsx`

6. User actions:
   - `src/actions/user.ts`

7. Guest cart merge:
   - merge cookie cart into DB cart after login.

### P1 — production readiness

1. Search:
   - `src/lib/algolia.ts`
   - `src/actions/search.ts`
   - `src/components/search/search-box.tsx`
   - `src/app/[locale]/(shop)/search/page.tsx`
   - two indexes: `products_uk`, `products_ru`
   - admin key only server-side
   - search-only key only client-side

2. Product admin actions:
   - `src/actions/product.ts`
   - create/update/delete/toggle active
   - mandatory Algolia sync on product mutations

3. Admin panel:
   - `src/app/(admin)/layout.tsx`
   - `src/app/(admin)/dashboard/page.tsx`
   - products
   - orders
   - categories
   - brands

4. Payment webhook:
   - `src/app/api/webhooks/payment/route.ts`
   - LiqPay/Monobank integration if required.

5. SEO:
   - `src/app/sitemap.ts`
   - `src/app/robots.ts`
   - `src/app/not-found.tsx`
   - `src/app/error.tsx`
   - `src/app/global-error.tsx`
   - BreadcrumbList JSON-LD
   - Organization JSON-LD
   - canonical/alternate URLs on all important pages.

6. Brands:
   - `src/app/[locale]/(shop)/brands/page.tsx`
   - `src/app/[locale]/(shop)/brands/[slug]/page.tsx`

7. Info pages:
   - `src/app/[locale]/(info)/about/page.tsx`
   - `src/app/[locale]/(info)/delivery/page.tsx`
   - `src/app/[locale]/(info)/contacts/page.tsx`

### P2 — качество и поддерживаемость

1. Tests:
   - Vitest unit tests.
   - Vitest integration tests.
   - Playwright e2e tests.
   - Critical path: home -> category -> product -> cart -> checkout.

2. UI cleanup:
   - постепенно убрать массовые `style={{...}}`;
   - оставить inline style только для реально динамических значений, если Tailwind/CSS token невозможен;
   - привести компоненты к design tokens из `globals.css`.

3. i18n cleanup:
   - убрать hardcoded UI texts;
   - перенести строки в `src/i18n/messages/uk.json` и `src/i18n/messages/ru.json`.

4. Client component cleanup:
   - проверить все `'use client'`;
   - оставить client только там, где есть интерактивность, события, browser APIs или Zustand.

## Обновлённый план спринтов

### Sprint 1 — закрыть минимальный commerce flow

Цель: пользователь может пройти путь товар -> корзина -> checkout -> заказ.

Задачи:

- `actions/order.ts`
- checkout page
- checkout form
- order success page
- stock decrement transaction
- cart clear after order
- guest cart merge при логине, если auth будет готов к этому спринту.

### Sprint 2 — auth/account

Цель: пользователь может войти, зарегистрироваться и видеть свои заказы.

Задачи:

- login page
- register page
- account layout
- orders page
- order details page
- profile page
- wishlist page
- `actions/user.ts`
- route protection in `proxy.ts`.

### Sprint 3 — search/SEO/content

Цель: сайт готов к индексации и удобному поиску.

Задачи:

- Algolia server layer
- search UI
- search page
- sitemap
- robots
- error pages
- info pages
- brands pages
- Organization/Breadcrumb JSON-LD.

### Sprint 4 — admin/tests/production hardening

Цель: поддержка каталога, заказов и базовые гарантии качества.

Задачи:

- admin dashboard
- product CRUD
- order management
- category/brand management
- Vitest
- Playwright
- cleanup inline styles
- cleanup hardcoded texts
- review Core Web Vitals.

## Чеклист приёмки

Перед сдачей каждого этапа обязательно:

```powershell
npm run lint
npm run build
npx tsc --noEmit
```

Все три команды должны проходить.

Также проверить:

- нет `.js` файлов в проектном коде;
- нет секретов в репозитории;
- нет `@default(cuid())`;
- нет `z.string().cuid()`;
- Prisma runtime импортируется через `@/lib/prisma`;
- generated Prisma client не редактируется руками;
- `typedRoutes: true`;
- `proxy.ts`, не `middleware.ts`;
- Server Components по умолчанию;
- Client Components только при необходимости;
- все изображения через `next/image`;
- UI-тексты через `next-intl`;
- DB queries используют `select` и `take`.

## Важное уточнение по старому ТЗ

Старые проценты готовности и упоминания Prisma 5 / Zustand 4 считать устаревшими.

Актуальный источник правил:

`C:\Users\sevri\Сайт\elektronom\MASTER_CONTEXT v1_02.md` версия `1.3`.

