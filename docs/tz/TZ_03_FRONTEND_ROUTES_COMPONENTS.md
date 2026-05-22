# ТЗ 03. Frontend routes and components

Дата: 2026-05-21  
Источник старой версии: `docs/tz/original/ТЗ_часть3.md`

## Общие правила

- App Router и локали сохраняются.
- Server Components используются по умолчанию.
- Client Components нужны только для состояния, событий, форм, корзины, модалок, поиска, фильтров и интерактива.
- Product/card/catalog компоненты не должны тащить лишний JS на клиент.
- Все кнопки в пользовательском пути должны выполнять действие или быть явно недоступными с корректным состоянием.

## Маршруты магазина

Должны быть готовы:

- `/{locale}` — главная.
- `/{locale}/catalog` — каталог.
- `/{locale}/catalog/[slug]` — категория.
- `/{locale}/product/[slug]` — карточка товара.
- `/{locale}/cart` — корзина.
- `/{locale}/checkout` — оформление заказа.
- `/{locale}/account` — кабинет.
- `/{locale}/account/orders` — история заказов.
- `/{locale}/account/orders/[id]` — заказ.
- `/{locale}/login` или выбранный auth route.
- `/{locale}/admin` — админка, если роль разрешает.

Если маршрут ещё не реализован, нужно создать production-safe страницу, а не заглушку с обещанием будущей функции.

## Главная и каталог

Требования:

- данные из backend queries;
- корректные loading/empty/error states;
- pagination или load more без слома URL;
- фильтры синхронизируются с query params;
- хлебные крошки корректны для локали;
- изображения проходят через Next Image и разрешённые remotePatterns.

## Product page

Требования:

- галерея изображений;
- thumbnail strip, lightbox и zoom на hover, если это не ухудшает mobile UX;
- цена, наличие, бренд, артикул/код товара;
- comparePrice и badge скидки, если данные есть;
- характеристики;
- описание;
- отзывы и форма отзыва для авторизованного пользователя, если модуль reviews включён;
- похожие товары;
- JSON-LD product schema;
- JSON-LD BreadcrumbList;
- loading skeleton для product page;
- Add to cart работает;
- wishlist button относится к P2, но должен быть учтён в account/wishlist сценарии;
- если товара нет в наличии, CTA не вводит пользователя в заблуждение.

## Cart

Требования:

- изменение количества;
- удаление позиции;
- очистка корзины;
- пересчёт totals;
- обработка out-of-stock;
- переход в checkout;
- состояние корзины не расходится между UI и Server Actions.

## Checkout

Checkout — главный незакрытый блок.

Минимальный сценарий:

- контактные данные;
- доставка;
- способ оплаты;
- комментарий;
- итоговая сумма;
- подтверждение заказа;
- создание заказа в базе;
- страница успеха или понятное подтверждение.
- маска телефона `+380`, если используется украинский формат;
- summary заказа справа или отдельным блоком на mobile.

Форма должна использовать Zod-валидацию и показывать ошибки рядом с полями. Нельзя отправлять заказ, если корзина пуста или остатки изменились.

## Account/Auth

Нужно завершить:

- login/logout;
- профиль пользователя;
- просмотр заказов;
- защиту чужих заказов;
- корректные редиректы после входа.

## Admin

Минимум для запуска:

- список заказов;
- просмотр заказа;
- изменение статуса;
- список товаров;
- базовое редактирование товара/наличия;
- защита по роли.

Расширенный admin из старого ТЗ:

- dashboard со статистикой заказов и выручкой;
- products list/search/filter;
- create product;
- edit product;
- categories tree;
- orders list;
- order details;
- brands;
- review moderation.

## Search

Требования:

- поиск в header;
- отдельная search page или results view;
- интеграция с Algolia;
- empty/error/loading states;
- переход к товару;
- поиск не должен ломать SSR/Edge/runtime ограничения.

## Error и SEO pages

Должны быть:

- `not-found.tsx`;
- route-level `error.tsx`;
- `global-error.tsx`;
- `sitemap.ts`;
- `robots.ts`;
- корректные metadata/canonical по локалям.

Дополнительно по SEO:

- `generateMetadata` на каждой важной странице;
- OpenGraph images, если подтверждены бизнесом;
- hreflang alternates для локалей;
- Organization JSON-LD на главной;
- Product и Breadcrumb JSON-LD на товарной странице.

## Детальные frontend-пункты из старого ТЗ

Эти пункты не отменены, но получают обновлённый статус: реализованное проверяется, отсутствующее уходит в P0/P1/P2 по `TZ_00_SUMMARY.md`.

### Главная

- заменить остаточные static constants на `getFeaturedProducts()` и `getNewArrivals()`;
- `CategoriesSection` должен получать данные из `getCategories(locale)`;
- `HeroBanner` и trust content должны быть реальным контентом или i18n-managed static content;
- metadata берётся из i18n.

### Catalog hub и category page

- `getCategories(locale)` и `getBrands()`;
- BOM-конфигуратор с вкладками: резисторы, конденсаторы, транзисторы, диоды;
- project lists с horizontal scroll на mobile;
- `getCategoryBySlug(slug, locale)` с `notFound()`;
- `getFilteredProducts(filters)` и `getProductsCount(filters)`;
- URL-based filters через search params;
- подкатегории в sidebar;
- `generateStaticParams` для активных категорий, если это рационально для текущего объёма каталога.

### Brands и content pages

Нужно реализовать или явно перенести в P2:

- `/brands`;
- `/brands/[slug]`;
- `/about`;
- `/delivery`;
- `/contacts`;
- отдельный `(info)` layout без shop sidebar, если это улучшает структуру.

### UI/shared компоненты

Проверить наличие и необходимость:

- `error-boundary`;
- `loading-skeleton`;
- URL-based `pagination`;
- `dialog`;
- `dropdown-menu`;
- `skeleton`;
- `toast`;
- `avatar`;
- `tabs`;
- `select`;
- `checkbox`;
- `slider`.

### Header/mobile layout

Header должен иметь:

- search input с dropdown;
- cart icon с badge;
- login button или avatar;
- mobile nav с cart/account.

### State и hooks

Zustand 5 stores:

- `cart-store` только для UI-состояния drawer;
- `ui-store` для mobile menu/search state.

Hooks:

- `use-debounce`;
- `use-cart`;
- `use-media-query` SSR-safe, если он реально нужен.

### I18N

Ключи должны покрывать:

- `product.*`;
- `cart.*`;
- `checkout.*`;
- `account.*`;
- `auth.*`;
- `search.*`;
- `filters.*`;
- `about.*`, `delivery.*`, `contacts.*`;
- `errors.*`.

### Performance

- все изображения через `next/image` с `alt` и `sizes`;
- `priority` только для above-the-fold;
- heavy client gallery/reviews/similar blocks можно грузить через dynamic/Suspense при необходимости;
- нет блокирующих скриптов в `<head>`;
- `remotePatterns` содержит только реальные CDN-домены.

### P2 возможности

Старое ТЗ также упоминало промокоды, блог, сравнение товаров, recently viewed, email-рассылку, Новая Пошта API, LiqPay webhook, GA4 и Sentry. Это не блокеры P0, но они не потеряны: решение о реализации принимает владелец проекта после закрытия checkout/auth/admin/search.

## Acceptance для frontend

Frontend часть считается готовой, когда пользователь без ручных действий в devtools проходит путь:

1. Открывает главную.
2. Переходит в каталог.
3. Фильтрует или ищет товар.
4. Открывает товар.
5. Добавляет товар в корзину.
6. Меняет количество.
7. Оформляет заказ.
8. Видит подтверждение и заказ в кабинете.
