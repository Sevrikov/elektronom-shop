# ТЗ 02. Backend protocol

Дата: 2026-05-21  
Источник старой версии: `docs/tz/original/ТЗ_часть2.md`

## Обязательный стек

- Prisma: 7.x
- PostgreSQL: основной источник данных
- Server Actions: для мутаций корзины, checkout, заказов и админских операций
- Zod: валидация входных данных
- Algolia: поиск и индекс товаров
- NextAuth/Auth.js: auth/account/admin protection

## Prisma 7 правила

`prisma/schema.prisma` должен использовать новый generator:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Runtime-код импортирует Prisma Client только из:

```ts
import { PrismaClient } from "@/generated/prisma/client";
```

Подключение к PostgreSQL выполняется через adapter:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
```

Требования:

- `src/lib/prisma.ts` — единственный runtime singleton.
- `new PrismaClient()` запрещён в app/components/actions/queries, кроме singleton-файла.
- В seed/scripts допускается отдельный клиент, если это технически оправдано и не попадает в runtime bundle.
- Для идентификаторов использовать `cuid2()` в Prisma schema.
- В Zod для Cuid2 не использовать `.cuid()`. Минимум: `z.string().min(1)`, лучше отдельный helper `idSchema`.

## Env и конфигурация

Должны быть проверены:

- `DATABASE_URL`
- auth secrets/provider env
- Algolia env
- media/CDN domains
- production-safe logging

Если env-переменная обязательна для runtime, она должна валидироваться в `src/lib/env.ts`. Если переменная нужна только для seed или технического скрипта, это должно быть явно отражено.

## Seed

`prisma/seed.ts` должен:

- создавать категории, бренды, товары, изображения и базовые данные без дублей;
- использовать актуальный Prisma 7 client;
- после seed индексировать Algolia только при наличии env-переменных;
- не падать полностью из-за недоступной Algolia на раннем этапе разработки;
- не хранить реальные секреты в репозитории.

## Server Actions

Обязательные действия:

- cart: add, update quantity, remove, clear;
- checkout/order: create order, validate stock, decrement stock atomically;
- search/admin actions — по мере реализации соответствующих модулей.

Правила:

- Все входы валидировать через Zod.
- `revalidateTag` вызывать совместимо с Next.js 16, с явным вторым аргументом, если это требуется текущей локальной документацией.
- Ошибки возвращать в предсказуемом формате, без утечки stack trace пользователю.
- Мутации заказов и остатков выполнять в транзакции.

Для списания остатков нельзя делать простой read-then-write без защиты. Нужно использовать транзакцию и условное обновление, например через `updateMany` с условием `stock >= quantity`, либо другой эквивалентный атомарный механизм.

## Queries

Queries должны:

- работать на сервере;
- не импортироваться в Client Components напрямую;
- иметь понятные фильтры, сортировки и pagination;
- возвращать только нужные поля;
- не ломать typed routes и локализацию.

## Algolia

Требуется:

- `src/lib/algolia.ts` или эквивалентный слой клиента;
- индекс товаров при seed и при изменениях товаров в admin;
- search actions/queries;
- UI поиска в header/search page;
- fallback на database search или корректное empty/error state, если Algolia недоступна.

## Auth и безопасность

Нужно завершить:

- session strategy;
- protected routes для account/admin;
- роли пользователя;
- запрет доступа к чужим заказам;
- CSRF/session-aware mutations там, где применимо.

## Полный объём backend из старого ТЗ

Старое `ТЗ_часть2.md` содержало детальный перечень backend-объектов. Он сохраняется, но обновляется под Prisma 7 и MASTER v1.3.

### Модели базы данных

В `prisma/schema.prisma` должны быть покрыты:

- `User`, `Account`, `Session`;
- `Address`;
- `Category` и `CategoryTranslation`;
- `Product`, `ProductTranslation`, `ProductImage`;
- `Brand`;
- `Review`;
- `WishlistItem`;
- `CartItem`;
- `Order` и `OrderItem`.

Обязательны индексы из схемы MASTER, включая индекс для JSONB attributes. Если Prisma migration не создаёт нужный GIN индекс автоматически, он добавляется отдельной SQL-миграцией и документируется.

### Библиотеки `src/lib`

Нужно проверить или реализовать:

- `src/lib/prisma.ts` — Prisma 7 singleton;
- `src/lib/auth.ts` — Google OAuth, Credentials, JWT/session role, `requireAuth()`, `requireAdmin()`;
- `src/lib/algolia.ts` — server-only admin client, `getProductIndex(locale)`, тип `AlgoliaProductRecord`;
- `src/lib/env.ts` — Zod/env validation;
- `src/lib/logger.ts` — безопасный production logger;
- `src/lib/email.ts` — `sendOrderConfirmation`, `sendPasswordReset`, HTML-шаблоны;
- `src/lib/payment.ts` — `verifyWebhookSignature` для LiqPay/Monobank;
- `src/lib/utils.ts` — `formatPrice`, `getDiscountPercent`, `generateOrderNumber`, `cn`, `buildProductWhereClause`, `parseSearchParams`.

### Queries

Минимальный список:

- `getProductBySlug`, `getFilteredProducts`, `getProductsCount`;
- `getFeaturedProducts`, `getNewArrivals`, `getSimilarProducts`;
- `productCardSelect`;
- `getCategories`, `getCategoryBySlug`, `getCategoryTree`, `getCategoryFilters`;
- `getBrands`, `getBrandBySlug`, `getBrandProducts`;
- `getOrderByNumber`, `getUserOrders`;
- `searchProductsFallback`.

Кеширование делать только по актуальной документации Next.js 16. Если старое ТЗ требует `cacheLife()`/`cacheTag()`, разработчик обязан проверить локальные docs перед реализацией.

### Server Actions

Помимо cart/order/search/admin, старое ТЗ требует:

- `mergeGuestCart(guestItems)`;
- `getServerCart(userId)`;
- гостевую корзину в защищённой cookie;
- admin product actions: create/update/delete/toggle active/upload image;
- user actions: update profile, change password, add/update/delete address, set default address;
- search actions: index product, sync price/stock, remove from index, bulk reindex;
- review actions: create review, admin moderation;
- wishlist actions: add/remove/get wishlist.

Если какая-то функция переносится в другой слой, это допустимо, но поведение должно быть сохранено и отражено в отчёте разработчика.

### API route handlers

Нужно покрыть:

- `src/app/api/auth/[...nextauth]/route.ts` с экспортом `{ GET, POST }`;
- `src/app/api/webhooks/payment/route.ts` для LiqPay/Monobank, проверка подписи и обновление `Order.paymentStatus` / `Order.status`;
- публичный products API только если он реально нужен мобильному приложению или внешней интеграции.

### Env example и миграция статичных данных

Должен быть актуальный `.env.example` без секретов. Старые mock/static источники должны быть заменены на Prisma queries:

- `queries/products.ts`;
- `queries/categories.ts`;
- `lib/catalog-data.ts`;
- `lib/catalog-hub-data.ts`;
- `lib/constants.ts` для top sales/new arrivals;
- home/catalog/category pages.

## Acceptance для backend

Backend часть считается готовой, когда:

- `npx prisma validate` проходит;
- `npx prisma generate` проходит;
- `npx tsc --noEmit` проходит;
- checkout создаёт заказ и корректно списывает остатки;
- повторная покупка сверх остатка невозможна;
- seed можно запускать повторно без разрушения данных;
- Algolia не ломает build/seed при отсутствующих env в development.
