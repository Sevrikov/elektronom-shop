# Финальное повторное ревью исправлений E2E Checkout/Auth

Дата проверки: 2026-05-22  
Проект: `C:\Users\sevri\Сайт\elektronom`

## Итоговый статус

Статус: **не принимать как полностью готовое к staging/production**.

Часть критичных замечаний действительно исправлена: публичный `test-e2e` роут удален из `src`, обход авторизации по `x-e2e-user-id` отсутствует в исходниках, сборка Next.js проходит, а таблица `order_counters` добавлена в Prisma-схему и миграцию.

Но проверка разработчика содержит неточность: **`npm run lint` сейчас не проходит**, а новая миграция `add_order_counter` содержит регрессию и удаляет ранее добавленный GIN-индекс по JSONB-атрибутам товаров.

## Проверенные команды

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npx prisma migrate status
npm run build
rg -n "x-e2e-user-id|VERCEL_ENV|test-e2e|E2E_TEST_SECRET|overrideUserId" src --glob "!src/generated/**"
rg --files | rg "test-e2e"
```

Результаты:

- `npm run lint` - **ошибка**.
- `npx tsc --noEmit` - успешно.
- `npx prisma validate` - успешно.
- `npx prisma migrate status` - успешно, база синхронизирована с текущими миграциями.
- `npm run build` - успешно.
- `test-e2e` роут в `src/app` не найден.
- В build output API-роут `test-e2e` отсутствует, остался только `/api/auth/[...nextauth]`.
- Поиск `x-e2e-user-id|VERCEL_ENV|test-e2e|E2E_TEST_SECRET|overrideUserId` в `src` совпадений не дал.

## Findings

### P1 - Линтер не проходит из-за старого тестового runner-файла

Файл: `scratch/test_e2e_runner.js:1`

Команда `npm run lint` падает:

```text
C:\Users\sevri\Сайт\elektronom\scratch\test_e2e_runner.js
  1:14  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
```

Это противоречит заявлению разработчика, что `npm run lint` завершился успешно с кодом 0.

Дополнительный риск: этот файл не просто нарушает ESLint. Он все еще обращается к удаленному небезопасному роуту `/uk/api/test-e2e` и использует старые заголовки `x-e2e-secret` и `x-e2e-user-id`.

Примеры:

```text
scratch/test_e2e_runner.js:15  x-e2e-secret
scratch/test_e2e_runner.js:69  /uk/api/test-e2e?action=setup
scratch/test_e2e_runner.js:126 x-e2e-user-id
```

Что исправить:

1. Если `scratch/test_e2e_runner.js` больше не нужен - удалить файл из проекта.
2. Если он нужен как локальный черновик - вынести его из зоны ESLint и убедиться, что он не попадает в репозиторий/деплой.
3. Лучше заменить его на нормальный Playwright/Vitest E2E-сценарий без служебного публичного API-роута и без обхода авторизации.
4. После исправления повторно запустить `npm run lint`.

### P1 - Миграция `add_order_counter` удаляет GIN-индекс товаров

Файл: `prisma/migrations/20260522062352_add_order_counter/migration.sql:2`

В новой миграции есть строка:

```sql
DROP INDEX "products_attributes_gin_idx";
```

Это регрессия. Индекс `products_attributes_gin_idx` был добавлен отдельной миграцией:

```text
prisma/migrations/20260521130000_add_product_attributes_gin_index/migration.sql
```

Этот индекс нужен для рациональной работы фильтрации по JSONB-атрибутам товаров. Его удаление ухудшает производительность каталога и противоречит ранее согласованному протоколу разработки по фильтрам/атрибутам.

Вероятная причина: индекс создан вручную SQL-миграцией, а Prisma schema не умеет полноценно описать такой GIN-индекс, поэтому `prisma migrate dev` посчитал его drift-объектом и добавил `DROP INDEX`.

Что исправить:

1. Если миграция `20260522062352_add_order_counter` еще не применялась на общих/staging/prod окружениях - удалить из нее строку `DROP INDEX "products_attributes_gin_idx";`.
2. Если миграция уже применялась где-либо кроме локальной dev-БД - создать новую follow-up миграцию:

```sql
CREATE INDEX IF NOT EXISTS "products_attributes_gin_idx"
ON "products" USING GIN ("attributes");
```

3. После миграции проверить наличие индекса в БД через `psql` или Prisma raw query.
4. В `AGENTS.md` или dev-протокол добавить правило: ручные SQL-индексы, которые Prisma не моделирует, нельзя удалять автогенерированными миграциями без ревью.

### P2 - Manual Verification Report содержит неправильный query-параметр страницы успеха

Файл: `e2e_checkout_and_auth_report.md:56`

В отчете указано:

```text
/uk/order-success?number=ORD-2026-NNNNN
```

Фактический код использует другой параметр:

```text
src/app/[locale]/(shop)/checkout/checkout-form.tsx:63
router.push(`/${locale}/order-success?order=${response.orderNumber}`)

src/app/[locale]/(shop)/order-success/page.tsx:28
const { order: orderNumber } = await searchParams
```

Что исправить:

1. Исправить отчет на `/uk/order-success?order=ORD-2026-NNNNN`.
2. Либо, если бизнес-требование именно `number`, синхронно изменить checkout redirect и page parser. Сейчас код и отчет расходятся.

### P2 - Отчет называется E2E, но фактически подтвержден только manual verification

Файл: `e2e_checkout_and_auth_report.md`

Обновленный отчет стал полезнее: в нем есть URL, шаги и ожидаемые результаты. Но автоматический E2E-контур не подтвержден, потому что текущий `scratch/test_e2e_runner.js` невалиден, использует удаленный API и ломает lint.

Что исправить:

1. Переименовать отчет/раздел так, чтобы было ясно: это Manual Verification Report.
2. Если требуется именно E2E-приемка - добавить Playwright-сценарии:
   - гостевая корзина;
   - login и merge cart;
   - ограничение количества по stock;
   - checkout;
   - проверка orders/order_items/cart_items/stock через безопасный test DB setup, не через публичный route.

## Что подтверждено как исправленное

1. Папка `src/app/[locale]/api/test-e2e` отсутствует.
2. Build output Next.js не содержит `/[locale]/api/test-e2e`.
3. В `src` нет совпадений по `x-e2e-user-id`, `E2E_TEST_SECRET`, `overrideUserId`, `test-e2e`.
4. `src/lib/auth.ts` больше не содержит E2E-обход авторизации.
5. Prisma model `OrderCounter` добавлен и мапится на таблицу `order_counters`.
6. Facebook OAuth env-переменные валидируются в `src/lib/env.ts`.
7. `npx tsc --noEmit`, `npx prisma validate`, `npx prisma migrate status`, `npm run build` проходят.

## Рекомендованный порядок исправления

1. Удалить или заменить `scratch/test_e2e_runner.js`.
2. Добиться зеленого `npm run lint`.
3. Исправить миграцию, чтобы она не удаляла `products_attributes_gin_idx`, или добавить follow-up миграцию восстановления индекса.
4. Исправить query-параметр в `e2e_checkout_and_auth_report.md`.
5. Повторно запустить:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npx prisma migrate status
npm run build
```

6. После этого можно возвращаться к staging-деплою.

## Приемочный вывод

Текущую версию нельзя считать полностью готовой к staging/production, потому что:

- заявленная зеленая проверка `npm run lint` фактически падает;
- новая миграция удаляет важный GIN-индекс каталога;
- manual report расходится с фактическим URL-параметром страницы успешного заказа;
- автоматический E2E-контур не подтвержден.

После исправления этих пунктов блокеры по прошлым P0-замечаниям можно будет считать закрытыми.
