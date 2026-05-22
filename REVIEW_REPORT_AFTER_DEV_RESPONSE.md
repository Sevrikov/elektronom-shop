# Повторный отчёт ревью после ответа разработчиков

Дата проверки: 2026-05-21  
Проект: `C:\Users\sevri\Сайт\elektronom`  
Основание: письмо разработчиков о внесённых исправлениях после отчёта `REVIEW_REPORT_MASTER_CONTEXT_TZ.md`.

## Общий вывод

Исправлена только часть замечаний. Главный TypeScript-блокер в `src/actions/cart.ts` по полю `isMain` действительно устранён, и `npx tsc --noEmit` проходит. Однако проект всё ещё нельзя считать исправленным: `npm run lint` падает, `npm run build` падает, а ряд критичных несоответствий `MASTER_CONTEXT v1.2` и ТЗ остаётся.

Заявление разработчиков “проект успешно собирается” не подтвердилось проверкой `next build`.

## Проверенные команды

Команды запускались так:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npm run build"
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
```

Результат:

- `npx tsc --noEmit` — проходит без ошибок.
- `npm run lint` — не проходит: 6 errors, 8 warnings.
- `npm run build` — не проходит: ошибка prerender `/uk/cart`.

Важно: успешный `npx tsc --noEmit` не равен успешной сборке Next.js. Также `tsconfig.json` не проверяет `prisma/seed.ts`, поэтому ошибки в seed-скрипте могут не попадать в `tsc`.

## Что действительно исправлено

### 1. `src/actions/cart.ts`: `z.string().cuid()` заменён

Файл: `src/actions/cart.ts`

Было:

```ts
productId: z.string().cuid()
```

Стало:

```ts
productId: z.string().min(1)
```

Это соответствует обновлённой логике MASTER_CONTEXT для Cuid2.

### 2. `src/actions/cart.ts`: выборка изображения исправлена

Было обращение к несуществующему полю:

```ts
images: {
  where: { isMain: true },
  select: { url: true },
  take: 1,
}
```

Стало:

```ts
images: {
  orderBy: { sortOrder: 'asc' },
  select: { url: true },
  take: 1,
}
```

Это исправляет прежний build blocker именно в `cart.ts`.

### 3. `revalidateTag` в `cart.ts` обновлён

Файл: `src/actions/cart.ts`

```ts
revalidateTag('cart', 'max')
```

Это соответствует Next.js 16 signature.

### 4. `images.prom.ua` добавлен в `next.config.ts`

Файл: `next.config.ts`

```ts
{
  protocol: 'https',
  hostname: 'images.prom.ua',
  pathname: '**',
}
```

### 5. `product-card.tsx` больше не Client Component

Файл: `src/components/product/product-card.tsx`

Директива `'use client'` удалена. Компонент стал Server Component и использует клиентский `AddToCartButton` точечно.

Это хорошее архитектурное изменение, но в файле всё ещё остаются inline styles и неиспользуемые переменные.

## Что не исправлено или исправлено частично

### 1. `npm run build` всё ещё падает

Текущая ошибка:

```text
Error: Route "/[locale]/cart": Uncached data was accessed outside of <Suspense>.
Error occurred prerendering page "/uk/cart".
Export encountered an error on /[locale]/(shop)/cart/page: /uk/cart
```

Проблемное место:

Файл: `src/app/[locale]/(shop)/cart/page.tsx`

```ts
const items = await getCart(locale)
```

`getCart()` читает cookies и БД, то есть использует персонализированные uncached data. При `cacheComponents` Next.js 16 требует правильной динамической границы/Suspense-паттерна. Текущий комментарий “SSR, без 'use cache'” недостаточен: сборка всё равно пытается prerender и падает.

Нужно исправить стратегию рендеринга cart page под Next.js 16.

### 2. `npm run lint` всё ещё падает

Ошибки lint:

```text
ga-script.js
  A `require()` style import is forbidden

prisma/seed.ts
  @ts-ignore запрещён, нужен @ts-expect-error или нормальная типизация

src/components/catalog/price-range-filter.tsx
  Calling setState synchronously within an effect

src/components/product/product-schema.tsx
  Cannot call impure function Date.now during render
```

То есть утверждение “проект проходит проверки” неверно.

### 3. `ga-script.js` всё ещё существует

Файл:

```text
ga-script.js
```

MASTER_CONTEXT запрещает `.js` файлы. Этот файл по-прежнему ломает lint.

Нужно:

- удалить файл;
- или переписать в TypeScript;
- или вынести за пределы проекта.

### 4. `ga4-key.json` всё ещё лежит в корне

Файл:

```text
ga4-key.json
```

`.gitignore` игнорирует `.env*`, но не игнорирует `ga4-key.json`.

Это остаётся риском утечки секрета.

Нужно:

- удалить файл из проекта;
- добавить `ga4-key.json` или `*-key.json` в `.gitignore`;
- перевыпустить ключ, если он уже мог попасть наружу.

### 5. В `prisma/seed.ts` снова используется несуществующее поле `isMain`

Файл: `prisma/seed.ts`

```ts
images: { where: { isMain: true }, take: 1 },
```

В `prisma/schema.prisma` у `ProductImage` поля `isMain` нет.

Это не ловится `npx tsc --noEmit`, потому что `prisma/seed.ts` не входит в `tsconfig.json include`. Но при запуске seed или расширенной проверке это станет ошибкой.

### 6. В `prisma/seed.ts` добавлены запрещённые `@ts-ignore`

Файл: `prisma/seed.ts`

```ts
// @ts-ignore
```

Найдено 3 вхождения. MASTER_CONTEXT запрещает `@ts-ignore` без обоснования, ESLint тоже падает.

Нужно типизировать dynamic import Algolia корректно или использовать допустимый `@ts-expect-error` с объяснением, если без этого никак.

### 7. В `prisma/seed.ts` используется `include`

Файл: `prisma/seed.ts`

```ts
include: {
  translations: { where: { locale } },
  images: { where: { isMain: true }, take: 1 },
  category: { include: { translations: { where: { locale } } } },
  brand: true,
}
```

MASTER_CONTEXT требует `select` нужных полей, а не вложенный `include`, особенно для связанных сущностей.

### 8. Prisma schema всё ещё на `cuid()`

Файл: `prisma/schema.prisma`

Найдено 15 вхождений:

```prisma
@default(cuid())
```

MASTER_CONTEXT уже обновлён под `cuid2()`, но фактическая схема БД не приведена к нему.

Это важное несоответствие: документация говорит `cuid2`, код всё ещё создаёт `cuid`.

### 9. Версии стека всё ещё расходятся с MASTER_CONTEXT

Файл: `package.json`

Фактически:

```json
"@prisma/client": "^7.8.0",
"prisma": "^7.8.0",
"zustand": "^5.0.13"
```

MASTER_CONTEXT v1.2 требует:

- Prisma `5.x`
- Zustand `4.x`

Либо нужно менять зависимости, либо официально обновлять MASTER_CONTEXT. Сейчас код и документ всё ещё конфликтуют.

### 10. `typedRoutes` всё ещё отключён

Файл: `next.config.ts`

```ts
// typedRoutes: true,
experimental: {},
```

MASTER_CONTEXT требует:

```ts
experimental: {
  typedRoutes: true,
}
```

### 11. Inline styles почти не устранены

По `src` осталось примерно:

```text
450 style={{...}}
```

Это системное нарушение MASTER_CONTEXT и дизайн-ТЗ.

Примеры всё ещё есть в:

- `src/components/product/product-card.tsx`
- `src/components/product/product-gallery.tsx`
- `src/components/cart/cart-page-client.tsx`
- `src/components/layout/header.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`

Исправление одного inline style в cart page не решает проблему.

### 12. P0/P1 функционал ТЗ всё ещё отсутствует

По-прежнему отсутствуют:

- `src/app/[locale]/(shop)/checkout/page.tsx`
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/register/page.tsx`
- `src/app/[locale]/(account)/orders/page.tsx`
- `src/app/[locale]/(account)/profile/page.tsx`
- `src/app/(admin)/dashboard/page.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/not-found.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/lib/algolia.ts`
- `src/actions/search.ts`
- `src/actions/order.ts`
- `src/actions/product.ts`
- `src/actions/review.ts`
- `src/actions/wishlist.ts`
- `src/components/search/search-box.tsx`
- `src/components/product/product-reviews.tsx`
- `tests/unit`
- `tests/integration`
- `tests/e2e`

## Отдельная проблема: Algolia в seed

Разработчики добавили Algolia indexing в `prisma/seed.ts`, но реализация противоречит правилам MASTER_CONTEXT:

- создаётся `algoliasearch()` прямо в `seed.ts`, хотя MASTER_CONTEXT говорит не создавать клиент вне `src/lib/algolia.ts`;
- используются `@ts-ignore`;
- используется `include`;
- используется несуществующее поле `isMain`;
- `algoliasearch` отсутствует в `package.json`, поэтому импорт может падать;
- sync с Algolia в seed не заменяет обязательные `src/lib/algolia.ts` и `src/actions/search.ts`.

Правильнее вынести Algolia singleton в `src/lib/algolia.ts`, а seed должен вызывать уже типизированную серверную функцию или отдельный серверный helper.

## Итоговая таблица

| Пункт из письма разработчиков | Статус | Комментарий |
|---|---:|---|
| Cuid2 validation через `.min(1)` | Частично да | В `cart.ts` да, но Prisma schema всё ещё `cuid()` |
| `images.prom.ua` в `remotePatterns` | Да | Добавлено |
| Algolia sync в seed | Нет | Реализация нарушает MASTER_CONTEXT и содержит `isMain`, `@ts-ignore`, `include` |
| Ошибка `isMain` в cart actions | Да | В `cart.ts` исправлено |
| `revalidateTag(..., 'max')` | Да | В `cart.ts` исправлено |
| ProductCard Server Component | Частично да | `'use client'` убран, но inline styles и unused vars остались |
| Inline style в cart page | Да | Один style заменён |
| AGENTS.md обновлён | Да | Файл изменён |
| Проект успешно собирается | Нет | `next build` падает |
| TypeScript проходит | Да | `npx tsc --noEmit` проходит |

## Приоритет исправлений

1. Починить `next build`: разобраться с `/uk/cart` и uncached data вне Suspense/dynamic boundary.
2. Починить `npm run lint`: удалить `ga-script.js`, убрать `@ts-ignore`, исправить `price-range-filter`, вынести `Date.now()`.
3. Убрать `isMain` из `prisma/seed.ts` или добавить поле в Prisma schema.
4. Убрать `include` из Algolia seed-запроса и заменить на `select`.
5. Решить конфликт `cuid()` vs `cuid2()` на уровне Prisma schema и миграций.
6. Решить конфликт версий Prisma/Zustand с MASTER_CONTEXT.
7. Удалить/заигнорить `ga4-key.json`.
8. Включить `typedRoutes`.
9. Закрыть отсутствующие страницы/actions из ТЗ.
10. Планово убрать inline styles и захардкоженные UI-тексты.

## Финальный статус

Исправления разработчиков частичные.  
Проект всё ещё не соответствует MASTER_CONTEXT v1.2 и ТЗ.  
Состояние после повторной проверки: **не готово к приёмке**.

