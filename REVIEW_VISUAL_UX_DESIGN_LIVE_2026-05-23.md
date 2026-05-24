# Visual / UX / Design Review Live

Дата: 2026-05-23
Объект: `https://elektronom.vercel.app`
Метод: live HTML/DOM audit + code/design-system audit + Reversa findings.

Важно: полноэкранный screenshot-pass через in-app browser не удалось выполнить из-за локальной ошибки браузерного окружения. Вместо этого проверены опубликованные HTML-срезы ключевых страниц и исходный код дизайн-системы. Это достаточно для фиксации SEO/DOM/структурных проблем, но финальный визуальный screenshot-pass нужно выполнить отдельно после исправлений.

## Проверенные Live URL

| URL | HTTP | HTML snapshot |
|---|---:|---|
| `https://elektronom.vercel.app/uk` | 200 | `tools/reversa/_reversa_sdd/final/live_uk.html` |
| `https://elektronom.vercel.app/uk/catalog` | 200 | `tools/reversa/_reversa_sdd/final/live_uk_catalog.html` |
| `https://elektronom.vercel.app/uk/cart` | 200 | `tools/reversa/_reversa_sdd/final/live_uk_cart.html` |
| `https://elektronom.vercel.app/uk/checkout` | 200 | `tools/reversa/_reversa_sdd/final/live_uk_checkout.html` |
| `https://elektronom.vercel.app/uk/search` | 200 | `tools/reversa/_reversa_sdd/final/live_uk_search.html` |
| `https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l` | 200 | `tools/reversa/_reversa_sdd/final/live_uk_product_castrol-edge-5w30-4l.html` |
| `https://elektronom.vercel.app/ru/product/castrol-edge-5w30-4l` | 200 | `tools/reversa/_reversa_sdd/final/live_ru_product_castrol-edge-5w30-4l.html` |

## Executive Verdict

Техническая Reversa-документация уже закрыта, а сборка после исправления `product-reviews.tsx` проходит. Но как продуктовый сайт Elektronom ещё не готов к приёмке дизайна/UX.

Главные проблемы live-версии:

1. Product page всё ещё отдаёт `localhost:3000` в canonical/OG/JSON-LD.
2. Product/cart/search на live имеют дубли locale `/uk/uk` или `/ru/ru`.
3. Мобильная корзина показывает hardcoded badge `3`.
4. Product page всё ещё показывает placeholder images `placehold.co` и пустые отзывы.
5. Design-system protocol нарушен массово: 344 `style={{...}}` в `src/app` + `src/components`, 32 крупных `rounded-2xl/3xl/4xl`.
6. Header/account/wishlist/mobile account навигация не доведена до цельного пользовательского сценария.
7. Реального screenshot/visual acceptance gate нет.

## P0 Findings

### P0-1. Live product page SEO всё ещё содержит `localhost:3000`

Evidence:

- `tools/reversa/_reversa_sdd/final/live_uk_product_castrol-edge-5w30-4l.html`
- `tools/reversa/_reversa_sdd/final/live_ru_product_castrol-edge-5w30-4l.html`

Live HTML check:

- `localhost: true` для `uk/product/castrol-edge-5w30-4l`
- `localhost: true` для `ru/product/castrol-edge-5w30-4l`

Impact:

- canonical, `og:url`, structured data and social previews can point to local development URL.
- Это критично для SEO и доверия к production deployment.

Fix:

1. На Vercel production/staging установить корректный `NEXT_PUBLIC_SITE_URL`.
2. В коде запретить production fallback на localhost.
3. Добавить smoke-check, который падает при `localhost:3000` в HTML.

### P0-2. Live product/cart/search генерируют duplicate locale URLs

Evidence:

- Product UK: `/uk/uk` found.
- Product RU: `/ru/ru` found.
- Cart UK: `/uk/uk` found.
- Search UK: `/uk/uk` found.

Source:

- `src/components/layout/breadcrumbs.tsx` всегда добавляет `/${locale}${item.url}`.
- `src/app/[locale]/(shop)/product/[slug]/page.tsx` передаёт breadcrumbs с `url: /${locale}` и `url: /${locale}/catalog`.

Impact:

- broken breadcrumbs.
- broken JSON-LD BreadcrumbList.
- пользователь и поисковик видят некорректную структуру сайта.

Fix:

1. Ввести `localizedPath(locale, path)`:
   - если path уже начинается с `/uk` или `/ru`, не добавлять locale повторно;
   - если path относительный, добавить locale.
2. В breadcrumbs передавать URL без locale: `/`, `/catalog`, `/catalog/[slug]`.
3. Покрыть тестом `uk` и `ru`.

## P1 Findings

### P1-1. Mobile cart badge hardcoded `3`

Source:

- `src/components/layout/mobile-nav.tsx:16`

Problem:

```ts
{ label: t('cart'), icon: ShoppingCart, href: '/cart', badge: 3 }
```

Impact:

- Пользователь видит 3 товара в корзине даже когда корзина пустая.
- Это ломает доверие к интерфейсу и checkout.

Fix:

- Получать count из того же источника, что Header/CartDrawer.
- Для guest/auth cart использовать единый server action/query.
- Не показывать badge при `0`.

### P1-2. Mobile account link ведёт на `/account`, но структура проекта использует `/profile`, `/orders`, `/wishlist`

Source:

- `src/components/layout/mobile-nav.tsx:17`

Impact:

- Mobile user получает потенциально несуществующий/неполный маршрут.

Fix:

- Либо создать `/[locale]/account`, либо вести мобильную кнопку на `/[locale]/profile`.
- Account sidebar/nav должны иметь единый route contract.

### P1-3. Product page визуально всё ещё демо-страница, а не товар production-каталога

Evidence:

- Live product HTML содержит `placehold.co`.
- Reviews state: `Поки немає відгуків` / `Пока нет отзывов`.
- Same/related products частично выглядят как seed/demo витрина.

Impact:

- Для теста функционала допустимо.
- Для acceptance товарной страницы по ТЗ/Concept 6 недостаточно.

Fix:

1. Загрузить реальные изображения товаров или честный branded placeholder только для missing media.
2. Добавить несколько изображений для проверки gallery/lightbox.
3. Определить review policy: verified buyer only / authenticated / moderated.
4. Same-series делать по реальному признаку серии, а не слабой близости.

### P1-4. Design-system protocol массово нарушен inline styles

Evidence:

- `rg "style={{" src/app src/components`: 344 matches.
- Live HTML style counts:
  - home: 307
  - catalog: 624
  - product: 67
  - cart: 68
  - checkout: 61
  - search: 61

Examples:

- `src/app/[locale]/layout.tsx:70`
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/catalog/*`
- `src/components/home/*`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`

Impact:

- Tailwind v4 token protocol формально есть, но обходится.
- Сложно поддерживать единый стиль главная/catalog/product/cart.

Fix:

1. Разрешить inline style только для редких динамических значений, например progress width.
2. Всё остальное заменить на Tailwind v4 tokens:
   - `bg-surface-white`
   - `bg-surface-alt`
   - `text-text-primary`
   - `border-border`
   - `bg-accent`
3. Добавить CI guard против новых `style={{`.

### P1-5. Radius/card language расходится с правилом 8px

Evidence:

- `rounded-2xl/3xl/4xl`: 32 matches in `src/app` + `src/components`.
- Product live: 7 `rounded-2xl`.
- Catalog live: 12 `rounded-2xl`.

Impact:

- UI местами становится “мягким SaaS/маркетинговым”, а ТЗ требует более строгий e-commerce/catalog style.

Fix:

- Основные панели: `rounded-lg`.
- Допустимые исключения: modal, drawer, repeated cards only if visual system accepts.
- Product page cards привести к одному радиусу с catalog cards.

### P1-6. Header/action controls выглядят как интерактивные, но часть маршрутов/действий не завершена

Known sources:

- Header wishlist/account icon buttons.
- Mobile account href.
- Search Enter behavior ранее отмечен как gap.

Fix:

- Header icon buttons должны быть Link или реальным action.
- Wishlist/account/mobile account должны вести на существующие страницы.
- Search input Enter должен вести на `/search?q=...`.

## P2 Findings

### P2-1. Главная всё ещё использует декоративный gradient hero вместо сильного product/category signal

Source:

- `src/components/home/hero-section.tsx`

Impact:

- Для e-commerce лучше показать реальные категории, подбор, товары, бренды или промо, а не абстрактную сцену.

Fix:

- Заменить hero на продуктово-категорийный первый экран.
- Оставить утилитарный стиль: каталог, подбор оборудования, B2B прайс, популярные категории.

### P2-2. Placeholder strategy не отделена от production media policy

Evidence:

- `placehold.co` на home/product/related images.

Fix:

- Для seed/staging допустимо.
- Для production catalog должно быть правило:
  - real image required для active products;
  - fallback branded image только при отсутствии;
  - отдельный monitoring report по товарам без изображения.

## Dynamic Click-Through Status

Не завершено полноценно в этом проходе:

- реальные клики gallery/lightbox;
- add-to-cart drawer interaction;
- search typing;
- checkout form interaction;
- mobile viewport screenshots.

Причина: browser automation в текущем окружении не подключился, локальный dev-server не удержался в фоне. Live HTML/DOM audit выполнен, но screenshot-pass нужно повторить через обычный браузер/Playwright у разработчика.

## Required Visual QA Checklist For Developer

1. Desktop 1440:
   - `/uk`
   - `/uk/catalog`
   - `/uk/product/castrol-edge-5w30-4l`
   - `/uk/cart`
   - `/uk/checkout`
   - `/uk/search`
2. Mobile 390:
   - same pages.
3. For each page screenshot must show:
   - header state;
   - first viewport;
   - main working block;
   - footer or lower content when relevant.
4. Mandatory interaction videos or screenshots:
   - product gallery open/close;
   - add to cart;
   - cart drawer;
   - quantity change;
   - search query;
   - checkout validation.

## Recommended Fix Order

1. SEO/env + duplicate locale helper.
2. Mobile nav badge/account route.
3. Product page real media/reviews/same-series policy.
4. Header/search/account/wishlist actions.
5. Inline style cleanup in layout/header/footer/mobile-nav first.
6. Catalog/home style cleanup.
7. Product/cart/checkout style cleanup.
8. Visual screenshot acceptance gate.

## Acceptance Verdict

Status: not ready for final visual/product acceptance.

Reason: live version still has P0 SEO/locale defects and P1 design/UX consistency gaps.

The project is now buildable, and Reversa documentation is complete. The next developer task should be a visual/UX stabilization sprint, not another feature expansion.

