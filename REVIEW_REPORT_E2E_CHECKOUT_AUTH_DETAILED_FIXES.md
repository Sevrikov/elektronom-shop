# Детальное ревью: checkout/auth/e2e после ответа разработчиков

Дата: 2026-05-22  
Файл подготовлен для передачи разработчикам.  
Основание: ответ разработчиков о закрытии коммерческого цикла, DB cart, merge cart, checkout transaction, stock protection, Google/Facebook auth и e2e.

## Краткий вывод

Автоматические проверки проходят, но работу нельзя считать полностью принятой. Основная причина — в код добавлены тестовые механизмы, которые попадают в публичную сборку и могут стать уязвимостью на staging/production.

Сборочная часть проекта выглядит рабочей:

- `npm run lint` — exit 0, есть warning;
- `npx tsc --noEmit` — exit 0;
- `npx prisma validate` — exit 0;
- `npm run build` — exit 0.

Но есть критические замечания:

- публичный E2E API route;
- auth bypass по header на preview;
- ненадёжная генерация номера заказа;
- неатомарная очистка DB-корзины после заказа;
- неполная проверка stock при merge/update корзины;
- заявленный отчёт `e2e_checkout_and_auth_report.md` отсутствует в проекте.

## Проверенный контекст

Были проверены ключевые файлы:

- `src/actions/cart.ts`
- `src/actions/order.ts`
- `src/actions/auth.ts`
- `src/actions/user.ts`
- `src/lib/auth.ts`
- `src/lib/env.ts`
- `src/app/[locale]/api/test-e2e/route.ts`
- `src/app/[locale]/(shop)/checkout/page.tsx`
- `src/app/[locale]/(shop)/checkout/checkout-form.tsx`
- `src/app/[locale]/(auth)/login/login-form.tsx`
- `src/app/[locale]/(auth)/register/register-form.tsx`
- `.env.example`
- `package.json`

Также проверялась сборка Next.js: route `/[locale]/api/test-e2e` действительно попадает в route table production build.

## Finding 1. P0 — публичный E2E route в production build

Файл:

```txt
src/app/[locale]/api/test-e2e/route.ts
```

Проблема:

Файл реализует публичный route:

```txt
/{locale}/api/test-e2e
```

Он содержит действия:

- `GET ?action=setup`
- `GET ?action=verify`
- `GET ?action=cleanup`
- `POST ?action=addToCart`
- `POST ?action=getCart`
- `POST ?action=createOrder`

Что делает route:

- создаёт тестового пользователя;
- создаёт session token;
- возвращает наружу `userId`, `email`, `sessionToken`;
- по переданному `userId` читает cart items и orders;
- по переданному `userId` удаляет sessions, cart items, orders, order items и user;
- проксирует реальные server actions корзины и checkout.

Почему это опасно:

На staging/production такой route становится публичной административной тестовой ручкой. Даже если он “только для тестов”, его можно вызвать обычным HTTP-запросом. Это даёт риск:

- засорения базы тестовыми пользователями;
- чтения заказов по `userId`;
- удаления пользовательских данных;
- создания заказов через обход обычного UI;
- непредсказуемого влияния на stock.

Что нужно исправить:

Вариант A — лучший:

- удалить `src/app/[locale]/api/test-e2e/route.ts` из app router;
- перенести e2e setup/cleanup в Playwright/Vitest helper scripts, которые работают локально и не деплоятся как публичный HTTP route.

Вариант B — допустимый временно:

- route должен работать только в локальном development/test;
- route должен требовать secret header;
- route должен возвращать 404/403 в production и preview.

Пример логики:

```ts
function assertE2EAllowed(request: Request) {
  const isLocalE2E =
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test";

  const expectedSecret = process.env.E2E_TEST_SECRET;
  const actualSecret = request.headers.get("x-e2e-secret");

  if (!isLocalE2E || !expectedSecret || actualSecret !== expectedSecret) {
    return false;
  }

  return true;
}
```

В начале `GET` и `POST`:

```ts
if (!assertE2EAllowed(request)) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
```

Дополнительно:

- не возвращать `sessionToken` в JSON;
- не делать `cleanup` по произвольному `userId` без secret;
- в `next build` перед staging желательно убедиться, что route недоступен публично.

Критерий исправления:

```txt
https://staging-domain/uk/api/test-e2e?action=setup
```

должен возвращать 404 или 403 без секретного тестового доступа.

## Finding 2. P0 — auth bypass через `x-e2e-user-id` на Vercel preview

Файл:

```txt
src/lib/auth.ts
```

Проблемный фрагмент:

```ts
if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
  const overrideUserId = headerList.get("x-e2e-user-id");
  ...
}
```

Проблема:

Любой внешний пользователь на preview/staging может отправить header:

```txt
x-e2e-user-id: <userId>
```

и получить session-like объект этого пользователя, если id существует.

Почему это опасно:

Это фактический обход auth на preview/staging. Preview часто показывают заказчику, тестировщику или внешним людям. Если такой механизм останется, staging нельзя считать безопасным.

Что нужно исправить:

Вариант A — лучший:

- полностью убрать E2E override из `src/lib/auth.ts`;
- тесты должны авторизовываться через реальный login или через test-only helper, который не попадает в общую auth-функцию.

Вариант B — временный:

- оставить override только для `NODE_ENV === "test"`;
- не использовать `VERCEL_ENV === "preview"`;
- требовать secret header;
- не принимать один `x-e2e-user-id` как достаточное основание для сессии.

Пример:

```ts
const isE2ETest = process.env.NODE_ENV === "test";
const e2eSecret = process.env.E2E_TEST_SECRET;
const actualSecret = headerList.get("x-e2e-secret");

if (isE2ETest && e2eSecret && actualSecret === e2eSecret) {
  const overrideUserId = headerList.get("x-e2e-user-id");
  ...
}
```

Критерий исправления:

На staging/preview header `x-e2e-user-id` не должен давать авторизованную сессию.

## Finding 3. P1 — генерация номера заказа через `count() + 1`

Файл:

```txt
src/actions/order.ts
```

Проблемный фрагмент:

```ts
const orderCount = await tx.order.count()
const number = `ORD-${year}-${String(orderCount + 1).padStart(5, '0')}`
```

Проблема:

При двух одновременных checkout оба запроса могут увидеть одинаковый `orderCount` и попытаться создать одинаковый `number`.

Риск:

Один из заказов упадёт на unique constraint `orders_number_key`. Для пользователя это будет ошибка checkout, хотя stock и форма были корректны.

Как исправить:

Вариант A — отдельная таблица счётчика:

```prisma
model OrderCounter {
  year  Int @id
  value Int @default(0)
}
```

В transaction:

```ts
const counter = await tx.orderCounter.upsert({
  where: { year },
  create: { year, value: 1 },
  update: { value: { increment: 1 } },
});

const number = `ORD-${year}-${String(counter.value).padStart(5, "0")}`;
```

Вариант B — retry при unique conflict:

- генерировать номер;
- пытаться создать заказ;
- при unique conflict повторить с новым номером.

Вариант C — timestamp/random:

```ts
const number = `ORD-${year}-${Date.now().toString(36).toUpperCase()}`
```

Для бухгалтерски красивых последовательных номеров лучше вариант A.

Критерий исправления:

Параллельные checkout-запросы не должны создавать conflict по `orders_number_key`.

## Finding 4. P1 — очистка DB-корзины после заказа вне транзакции

Файл:

```txt
src/actions/order.ts
```

Текущая логика:

- transaction списывает stock;
- transaction создаёт order;
- после transaction выполняется `prisma.cartItem.deleteMany()`.

Проблема:

Очистка DB-корзины авторизованного пользователя не атомарна вместе с заказом.

Риск:

Если заказ создан, stock списан, а очистка корзины упала, пользователь снова увидит товары в корзине. Это создаёт плохой UX и риск повторного checkout.

Как исправить:

Для авторизованного пользователя переместить очистку корзины внутрь `$transaction`:

```ts
const newOrder = await prisma.$transaction(async (tx) => {
  ...
  const order = await tx.order.create(...)

  if (session?.user?.id) {
    await tx.cartItem.deleteMany({
      where: { userId: session.user.id },
    });
  }

  return order;
});
```

Для guest cookie cart очистку оставить после transaction, потому что cookie не часть БД.

Критерий исправления:

После успешного order у авторизованного пользователя DB cart пустая в той же DB transaction.

## Finding 5. P1 — merge/update DB cart не проверяет stock полностью

Файл:

```txt
src/actions/cart.ts
```

Проблемы:

1. `mergeCartIfNeeded()` делает:

```ts
quantity: Math.min(existing.quantity + item.quantity, 99)
```

но не ограничивает quantity по `product.stock`.

2. `updateCartQuantity()` для авторизованного пользователя пишет:

```ts
data: { quantity: parsed.data.quantity }
```

без проверки stock.

Риск:

В БД-корзине может оказаться количество больше остатка. Checkout потом не даст списать отрицательный stock, но пользователь узнает об ошибке только в конце оформления.

Как исправить:

Для `mergeCartIfNeeded()`:

- перед create/update получить product stock и isActive;
- если товара нет или он inactive — не переносить item;
- если stock меньше запрошенного quantity — ограничить до stock или вернуть понятную ошибку;
- если stock = 0 — не добавлять в DB cart.

Для `updateCartQuantity()`:

```ts
const product = await prisma.product.findUnique({
  where: { id: parsed.data.productId, isActive: true },
  select: { stock: true },
});

if (!product) return { success: false, error: "Товар не знайдено" };
if (product.stock < parsed.data.quantity) {
  return { success: false, error: "Недостатньо товару на складі" };
}
```

Критерий исправления:

DB cart не должен хранить quantity выше текущего stock.

## Finding 6. P1 — заявленный отчёт отсутствует в проекте

Заявленный файл:

```txt
e2e_checkout_and_auth_report.md
```

Проблема:

Файл не найден в рабочей папке проекта. Поиск по project workspace не обнаружил отчёт.

Что нужно:

Добавить файл в корень проекта или в `docs/reports/`.

Минимальное содержание:

```md
## Что проверялось
- guest cart
- DB cart
- merge cart
- checkout transaction
- stock decrement
- negative stock prevention
- credentials login
- Google login
- Facebook login

## Команды
- npm run lint
- npx tsc --noEmit
- npx prisma validate
- npm run build

## Ручные/e2e сценарии
- ...

## Результаты
- ...

## Ограничения
- ...
```

## Finding 7. P2 — Facebook env не валидируется

Файлы:

```txt
.env.example
src/lib/env.ts
src/lib/auth.ts
```

Проблема:

`.env.example` содержит:

```env
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

`src/lib/auth.ts` использует эти переменные, но `src/lib/env.ts` их не валидирует.

Как исправить:

Добавить в `envSchema`:

```ts
FACEBOOK_CLIENT_ID: z.string().optional(),
FACEBOOK_CLIENT_SECRET: z.string().optional(),
```

Лучше также использовать централизованный `env`, а не прямой `process.env` в auth config.

## Что подтверждено как положительное

Разработчики действительно добавили или доработали:

- DB cart для авторизованных пользователей через `CartItem`;
- merge гостевой корзины в DB cart;
- checkout, который читает DB cart для авторизованного пользователя;
- транзакционное списание stock через `updateMany` с `stock >= quantity`;
- Google provider;
- Facebook provider;
- social login buttons в login/register UI;
- `.env.example` с Facebook OAuth переменными.

Это хорошие изменения, но они требуют доработки security и edge cases.

## Обязательные исправления перед staging

Перед staging нужно закрыть минимум:

1. Убрать или закрыть `/[locale]/api/test-e2e`.
2. Убрать `VERCEL_ENV === "preview"` из auth override.
3. Исправить генерацию номера заказа.
4. Перенести очистку DB cart внутрь transaction.
5. Добавить stock validation в DB cart merge/update.
6. Добавить `e2e_checkout_and_auth_report.md` в проект.

## Проверки после исправлений

Запустить:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Проверить вручную:

```txt
/uk
/uk/catalog
/uk/product/<real-slug>
/uk/cart
/uk/checkout
/uk/login
/uk/register
/uk/orders
/robots.txt
/sitemap.xml
```

Проверить сценарии:

- guest add to cart;
- guest checkout;
- register/login;
- guest cart → login → merge cart;
- auth cart → checkout → order created → cart empty;
- попытка купить больше stock;
- Google login при настроенных env;
- Facebook login при настроенных env;
- `/uk/api/test-e2e?action=setup` недоступен без разрешённого тестового режима.

## Текст для разработчиков

Работу по checkout/auth пока нельзя принимать как полностью закрытую. Автопроверки проходят, но в код попали тестовые механизмы, которые становятся публичными route/auth bypass на staging/preview. Просьба исправить P0/P1 из этого отчёта и прислать обновлённый отчёт с результатами проверок.

Особенно важно: `/[locale]/api/test-e2e` и `x-e2e-user-id` не должны работать на публичном staging/preview без жёсткого server-only секрета, а лучше вообще не должны попадать в публичный runtime.
