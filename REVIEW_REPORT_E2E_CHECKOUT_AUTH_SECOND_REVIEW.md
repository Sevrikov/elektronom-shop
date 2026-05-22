# Повторное ревью: ответ разработчиков по 7 findings checkout/auth/e2e

Дата проверки: 2026-05-22  
Основание: разработчик сообщил, что все 7 замечаний P0/P1/P2 устранены.

## Итог

Не подтверждаю полное закрытие всех замечаний. Часть исправлений действительно внесена, но остаются минимум два блокера:

- P0: публичный route `/[locale]/api/test-e2e` всё ещё существует и попадает в `next build`;
- P0/P1: `OrderCounter` добавлен в `schema.prisma`, но миграции для таблицы `order_counters` нет, поэтому `migrate deploy` не создаст нужную таблицу на staging/production.

Автоматические проверки проходят, но они не ловят эти проблемы полностью.

## Проверки

Запущены команды:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
npx prisma migrate status
npx prisma generate
```

Результат:

- `npm run lint`: exit 0, но warning в `src/app/[locale]/api/test-e2e/route.ts`;
- `npx tsc --noEmit`: exit 0;
- `npx prisma validate`: exit 0;
- `npm run build`: exit 0;
- `npx prisma migrate status`: показывает, что 2 миграции применены, но это не проверяет drift между текущей schema и migration history;
- `npx prisma generate`: exit 0.

## Статус по findings

### Finding 1. P0 — публичный E2E route

Статус: **не исправлено**.

Разработчик написал, что route полностью удалён, но файл всё ещё существует:

```txt
src/app/[locale]/api/test-e2e/route.ts
```

Внутри всё ещё есть опасная логика:

- `GET ?action=setup`;
- `GET ?action=verify`;
- `GET ?action=cleanup`;
- `POST ?action=addToCart`;
- `POST ?action=getCart`;
- `POST ?action=createOrder`;
- возврат `sessionToken`;
- удаление пользователя/заказов/корзины по `userId`.

`npm run build` также показывает route в production route table:

```txt
ƒ /[locale]/api/test-e2e
```

Что нужно исправить:

- физически удалить папку/файл `src/app/[locale]/api/test-e2e/route.ts`;
- после удаления выполнить `npm run build`;
- в build output не должно быть строки `ƒ /[locale]/api/test-e2e`;
- `rg --files | rg "test-e2e"` не должен находить app route.

Критерий готовности:

```txt
/uk/api/test-e2e?action=setup
```

на staging/production не существует.

### Finding 2. P0 — auth bypass через `x-e2e-user-id`

Статус: **исправлено**.

В `src/lib/auth.ts` больше нет wrapper-логики с `x-e2e-user-id`, `VERCEL_ENV === "preview"` и подменой session. `auth` экспортируется напрямую из `NextAuth`.

Остаточное замечание:

- после удаления `test-e2e` route нужно ещё раз проверить `rg -n "x-e2e-user-id|VERCEL_ENV|test-e2e" src`.

### Finding 3. P1 — генерация номера заказа через `count() + 1`

Статус: **частично исправлено, но миграция отсутствует**.

В `src/actions/order.ts` логика действительно переписана на:

```ts
tx.orderCounter.upsert(...)
```

В `prisma/schema.prisma` добавлена модель:

```prisma
model OrderCounter {
  year  Int @id
  value Int @default(0)

  @@map("order_counters")
}
```

Но в `prisma/migrations/` нет SQL, который создаёт таблицу `order_counters`.

Сейчас в migrations есть только:

```txt
20260510111405_init/migration.sql
20260521130000_add_product_attributes_gin_index/migration.sql
```

Поиск по миграциям не находит `order_counters`.

Риск:

На базе, где будут применены только миграции через `npx prisma migrate deploy`, таблица `order_counters` не появится. Первый checkout упадёт на обращении к `tx.orderCounter.upsert`.

Что нужно исправить:

Добавить отдельную миграцию, например:

```txt
prisma/migrations/20260522120000_add_order_counter/migration.sql
```

Содержимое:

```sql
CREATE TABLE IF NOT EXISTS "order_counters" (
  "year" INTEGER NOT NULL,
  "value" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "order_counters_pkey" PRIMARY KEY ("year")
);
```

После этого:

```powershell
npx prisma validate
npx prisma migrate deploy
npx tsc --noEmit
npm run build
```

Критерий готовности:

- `rg -n "order_counters" prisma/migrations` находит новую migration;
- checkout не падает на `orderCounter`.

### Finding 4. P1 — очистка DB cart вне транзакции

Статус: **исправлено**.

В `src/actions/order.ts` очистка DB cart для авторизованного пользователя перенесена внутрь `$transaction`:

```ts
await tx.cartItem.deleteMany({
  where: { userId: session.user.id },
})
```

Guest cookie cart по-прежнему очищается после transaction, это нормально.

### Finding 5. P1 — stock validation при merge/update cart

Статус: **в основном исправлено**.

Подтверждено:

- `mergeCartIfNeeded()` теперь читает `product.stock` и `isActive`;
- inactive/out-of-stock товары пропускаются;
- quantity ограничивается `product.stock` и `99`;
- `updateCartQuantity()` проверяет product и stock перед update.

Остаточная рекомендация:

- в `getCart()` для DB cart сейчас UI quantity ограничивается через `Math.min(...)`, но DB record не нормализуется, если stock уменьшился после добавления. Это не P0, но лучше при чтении или отдельной maintenance-логике обновлять/удалять некорректные cart items.

### Finding 6. P1 — отсутствующий e2e report

Статус: **исправлено частично**.

Файл создан:

```txt
e2e_checkout_and_auth_report.md
```

Но это больше текстовый отчёт, чем доказательство e2e:

- нет Playwright/Vitest test files;
- нет команды запуска e2e;
- нет логов реального прогона;
- нет скриншотов/trace;
- нет доказательства реальной проверки Google/Facebook OAuth, только указано, что кнопки/провайдеры добавлены.

Что нужно улучшить:

- добавить реальные тесты или явно назвать отчёт “manual verification report”;
- если e2e пока ручной, указать конкретные URL, тестовые данные, шаги и фактический результат каждого шага.

### Finding 7. P2 — Facebook env validation

Статус: **исправлено**.

В `src/lib/env.ts` добавлены:

```ts
FACEBOOK_CLIENT_ID: z.string().optional(),
FACEBOOK_CLIENT_SECRET: z.string().optional(),
```

## Главные действия для разработчика

1. Удалить `src/app/[locale]/api/test-e2e/route.ts`.
2. Добавить Prisma migration для `order_counters`.
3. Перезапустить проверки:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

4. В отчёте приложить build output, где отсутствует:

```txt
ƒ /[locale]/api/test-e2e
```

5. В отчёте приложить подтверждение, что migration содержит:

```txt
order_counters
```

## Решение по приёмке

Работу пока нельзя принимать как полностью закрытую.  
P0 по публичному E2E route остаётся открытым.  
P1/P0 по `OrderCounter` migration остаётся открытым, потому что код уже зависит от таблицы, но migration history её не создаёт.
