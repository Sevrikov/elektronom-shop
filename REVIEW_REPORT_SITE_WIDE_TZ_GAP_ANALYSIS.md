# REVIEW REPORT: Site-wide TZ Gap Analysis

Дата проверки: 2026-05-22  
Проект: Elektronom  
Проверяемый live URL: https://elektronom.vercel.app  
Основание: `MASTER_CONTEXT v1_02.md`, `docs/tz/TZ_00_SUMMARY.md` - `docs/tz/TZ_06_ORIGINAL_COVERAGE_MATRIX.md`, `AGENTS.md`, production HTML страницы товара, исходный код проекта.

## Краткий вывод

Сайт уже не пустой прототип: есть главная, каталог, категории, бренды, карточка товара, корзина, checkout, login/register, account, admin dashboard, info-страницы, sitemap/robots, Prisma 7, Next.js 16, Zustand 5.

Но по ТЗ сайт пока нельзя считать готовым production-магазином. Текущий статус ближе к `staging/demo`: можно смотреть и частично кликать, но есть блокеры по SEO, платежам, формам, мок-данным, тестам, стилям и админке.

## Что уже есть

- Next.js 16 / App Router / локали `uk` и `ru`.
- Prisma 7, PostgreSQL, модели товаров, корзины, заказов, пользователей, отзывов, wishlist.
- Каталог, категории, брендовые страницы, товарная страница.
- Корзина и checkout с созданием заказа.
- Auth.js / NextAuth credentials, Google/Facebook providers при наличии env.
- Account pages: orders, profile, wishlist.
- Admin dashboard с базовой статистикой.
- Search через Algolia с Prisma fallback.
- Sitemap, robots, metadata, JSON-LD для товара.
- Отдельные ТЗ уже перенесены в `docs/tz`.

## P0. Блокеры до production-приемки

### 1. Production SEO сломан: `localhost:3000` в canonical, OpenGraph и JSON-LD

В присланном production HTML страницы товара есть:

```html
<link rel="canonical" href="http://localhost:3000/uk/product/castrol-edge-5w30-4l"/>
<meta property="og:url" content="http://localhost:3000/uk/product/castrol-edge-5w30-4l"/>
```

И в Product JSON-LD:

```json
"url":"http://localhost:3000/uk/product/castrol-edge-5w30-4l"
```

Связанные файлы:
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`;
- `src/components/product/product-schema.tsx`;
- `src/lib/env.ts`;
- `.env.example`.

Что исправить:
- на Vercel выставить `NEXT_PUBLIC_SITE_URL=https://elektronom.vercel.app` или реальный домен;
- лучше добавить server-only `SITE_URL` для metadata/JSON-LD;
- добавить acceptance-проверку: production HTML не содержит `localhost`.

### 2. Breadcrumbs строятся с дублем локали `/uk/uk`

В production HTML:

```html
href="/uk/uk"
href="/uk/uk/catalog"
href="/uk/uk/catalog/motornye-masla"
```

Файл: `src/components/layout/breadcrumbs.tsx`.

Проблема: компонент добавляет `/${locale}` к `item.url`, хотя часть `item.url` уже содержит локаль.

Что исправить:
- нормализовать `BreadcrumbItem.url`: либо всегда без локали, либо всегда готовый href;
- использовать единый helper `localizedHref(locale, path)`;
- проверить JSON-LD BreadcrumbList: не должно быть `/uk/uk` и `/ru/ru`.

### 3. Платежи отображаются как доступные, но реальный payment flow не реализован

В checkout есть методы:
- `CARD_ONLINE`;
- `CASH_ON_DELIVERY`;
- `MONOBANK_PARTS`;
- `PRIVAT_PARTS`.

Но в `src/actions/order.ts` `createOrder()` просто создает заказ с выбранным `paymentMethod`. Нет LiqPay/Monobank redirect, payment session, webhook route, проверки подписи, обновления `paymentStatus`.

В `src/app/[locale]/(info)/delivery/page.tsx` при этом заявлен LiqPay.

Что исправить:
- либо временно оставить только `CASH_ON_DELIVERY` на staging/production;
- либо реализовать полноценный payment flow:
  - создание платежа;
  - redirect/checkout URL;
  - webhook `await req.text()` для подписи;
  - обновление `paymentStatus`;
  - обработка failed/cancelled/refunded.

### 4. Формы заявок выглядят рабочими, но не отправляют данные

Найдены формы/CTA без backend-действия:

- `src/app/[locale]/(info)/contacts/page.tsx` - `<form>` без `action` / `onSubmit`;
- `src/components/home/prefooter-cta.tsx` - поля и кнопка без отправки;
- `src/components/catalog/prefooter-b2b-cta.tsx` - поля и кнопка без отправки.

По ТЗ нельзя оставлять пользовательские сценарии как декоративные кнопки.

Что исправить:
- реализовать Server Action для заявки;
- валидировать через Zod;
- отправлять письмо через Resend или сохранять заявку в БД;
- показывать success/error state;
- если backend не готов, явно отключить форму и текстом не обещать отправку.

### 5. Отзывы на production остаются небезопасным demo-сценарием

Файл: `src/components/product/product-reviews.tsx`.

Проблемы:
- `SEED_REVIEWS` включаются при hostname `vercel.app`;
- кнопка `Написати відгук` открывает client-only форму без сохранения в БД;
- success state может создать ощущение, что отзыв реально отправлен;
- бейдж `Підтверджена покупка` нельзя показывать без проверки заказа.

Что исправить:
- убрать `vercel.app` из условия seed-отзывов;
- оставить seed только через явный `NEXT_PUBLIC_ENABLE_REVIEW_SEEDS=true` на dev/staging;
- либо скрыть форму отзывов на production, либо реализовать backend отзывов, модерацию и verified purchase.

## P1. Существенные несоответствия ТЗ

### 6. Нет тестовой инфраструктуры из acceptance checklist

В `package.json` нет:

- `npm test`;
- `npm run test:e2e`;
- Vitest/Jest;
- Playwright.

Поиск проектных `*.test.ts`, `*.spec.ts`, e2e-файлов вне `node_modules` не дал результатов.

По `TZ_05_ACCEPTANCE_CHECKLIST.md` нужны минимум:
- unit: `formatPrice`, `getDiscountPercent`, `generateOrderNumber`;
- unit: Zod-схемы checkout/cart;
- integration: cart actions, createOrder, product queries;
- e2e: главная -> категория -> товар -> корзина -> checkout;
- e2e: register/login/logout/redirect;
- e2e: mobile viewport.

### 7. Очень большой долг по inline styles

Автоматический подсчет нашел около 347 вхождений `style=` / `style?:` в `src/app` и `src/components`.

Самые заметные файлы:
- `src/components/catalog/catalog-hub-tabs.tsx`;
- `src/components/cart/cart-page-client.tsx`;
- `src/components/home/hero-section.tsx`;
- `src/components/catalog/catalog-hub-blocks.tsx`;
- `src/components/cart/cart-drawer.tsx`;
- `src/components/layout/header.tsx`;
- `src/app/[locale]/(shop)/catalog/page.tsx`;
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`;
- `src/components/product/product-reviews.tsx`.

По `AGENTS.md` и Tailwind v4 protocol это надо привести к `@theme` tokens и Tailwind classes.

### 8. Каталог частично опирается на mock/static data

Найдены mock/static источники:

- `src/lib/catalog-data.ts` - `Mock catalog products`;
- `src/lib/catalog-hub-data.ts` - `Project lists (mock)`;
- `src/app/[locale]/(shop)/catalog/[slug]/page.tsx` импортирует фильтры из `catalog-data`;
- catalog hub использует mock chips/project lists.

Что исправить:
- оставить декоративные справочники только там, где они действительно UI-only;
- фильтры, счетчики, бренды, категории, товары и проектные списки должны идти из Prisma или быть явно помечены как demo-only;
- пользовательские сценарии типа project lists/BOM/AI подбор не должны выглядеть как работающие, если они не сохраняются.

### 9. Admin реализован только как dashboard, не как рабочая админка

Файл: `src/app/[locale]/admin/page.tsx`.

Есть:
- счетчики заказов/пользователей/товаров;
- последние заказы;
- защита через `requireAdmin()`.

Нет по ТЗ:
- управление товарами;
- управление категориями;
- управление заказами;
- смена статусов заказа;
- управление остатками/ценами;
- синхронизация Algolia при create/update/delete/toggleActive;
- роли и рабочие маршруты manager/admin.

Что исправить:
- добавить хотя бы admin minimum:
  - `/admin/orders`;
  - `/admin/products`;
  - `/admin/categories`;
  - update order status;
  - update stock/price;
  - Algolia sync после мутаций.

### 10. Социальный вход может отображаться даже если provider не настроен

Файлы:
- `src/lib/auth.ts`;
- `src/app/[locale]/(auth)/login/login-form.tsx`;
- `src/app/[locale]/(auth)/register/register-form.tsx`.

В `auth.ts` Google/Facebook providers подключаются только если есть env. Но кнопки Google/Facebook в UI отображаются всегда.

Что исправить:
- скрывать кнопки, если provider не настроен;
- либо гарантировать env на staging/production;
- добавить ручной тест: Google/Facebook login не ведут на ошибку провайдера.

### 11. Есть Prisma `findMany()` без `take`

По протоколу проекта нельзя делать collection query без лимита.

Найдены:
- `src/actions/order.ts:233` - `getUserOrders()` без `take`;
- `src/queries/brands.ts:17` - `getBrands()` без `take`.

Что исправить:
- `getUserOrders()` должен принимать page/pageSize или хотя бы `take`;
- `getBrands()` должен иметь разумный `take`, например 100/200, или отдельное документированное исключение.

### 12. Header search использует raw `<img>`

Файл: `src/components/search/search-box.tsx`.

Есть:

```tsx
// eslint-disable-next-line @next/next/no-img-element
<img ... />
```

По ТЗ изображения должны идти через `next/image` с `alt` и `sizes`, кроме явно обоснованных случаев.

Что исправить:
- заменить на `next/image`;
- для `placehold.co` оставить точечный `unoptimized`.

### 13. Search/Algolia требует отдельной приемки

Код есть:
- `src/actions/search.ts`;
- `src/queries/search.ts`;
- `src/app/[locale]/(shop)/search/page.tsx`;
- `src/components/search/search-box.tsx`.

Но по ТЗ нужно подтвердить:
- Algolia env на staging/production;
- индекс соответствует Prisma;
- fallback работает при отсутствии Algolia;
- header search и `/search` дают одинаковые ожидаемые результаты;
- нет моковых результатов;
- empty/error states нормальные.

### 14. Placeholder images остаются production-visible

Seed содержит `https://placehold.co/...` для товаров. Для staging это допустимо, но для production-магазина это не финальные товарные изображения.

Что исправить:
- заменить на реальные изображения поставщиков/CDN;
- проверить `next.config.ts` remotePatterns;
- оставить `unoptimized` только для placeholder в dev/staging.

## P2. Что еще не хватает для полноценного магазина

- Password reset / email verification.
- Email-уведомление о заказе владельцу/клиенту.
- Реальная интеграция доставки: Новая Почта / отделения / стоимость.
- Реальная онлайн-оплата или честное отключение онлайн-методов.
- Отзывы с модерацией.
- Купоны/промокоды, если бизнесу нужны.
- GA4/Sentry/аналитика после стабилизации.
- Блог/статьи/SEO-контент, если нужен органический трафик.
- Compare/recently viewed, если подтверждено владельцем.

## Что разработчику делать дальше

### Шаг 1. Закрыть production config и SEO

- Исправить `NEXT_PUBLIC_SITE_URL` / `SITE_URL` на Vercel.
- Убрать `localhost:3000` из canonical, hreflang, OpenGraph, Product JSON-LD.
- Исправить `/uk/uk` и `/ru/ru` в breadcrumbs.
- Проверить `sitemap.xml` и `robots.txt` на production.

### Шаг 2. Очистить UI от fake-сценариев

- Убрать seed-отзывы с `vercel.app`.
- Отключить или реализовать форму отзывов.
- Реализовать contact/B2B forms или явно отключить.
- Скрыть online payment methods, если payment flow не готов.
- Скрыть social buttons, если OAuth env не настроен.

### Шаг 3. Довести коммерческий путь

- Главная -> каталог -> категория -> товар -> корзина -> checkout -> order success.
- Проверить guest cart, auth cart, merge cart.
- Проверить stock cap и oversell.
- Проверить order totals.
- Проверить account orders.

### Шаг 4. Довести admin minimum

- Заказы: список, просмотр, смена статуса.
- Товары: цена, остаток, активность.
- Категории/бренды: минимум просмотр и базовое управление.
- Algolia sync при товарных мутациях.

### Шаг 5. Добавить тесты

- Vitest unit/integration.
- Playwright smoke.
- Mobile viewport.
- Отчет по `TZ_05_ACCEPTANCE_CHECKLIST.md`.

### Шаг 6. Дизайн-аудит и Tailwind cleanup

- Убрать inline styles как массовый паттерн.
- Перенести цвета/поверхности/границы в Tailwind v4 tokens.
- Проверить 360/390/768/1280/1440 viewport.

## Приемочный статус

Текущий статус: не готово к production-приемке.

Допустимый статус: staging/demo для ручного просмотра и дальнейшей разработки.

Чтобы считать сайт готовым по ТЗ, нужно закрыть P0 и P1 из этого отчета и приложить официальный отчет разработчика по формату `TZ_05_ACCEPTANCE_CHECKLIST.md`.

