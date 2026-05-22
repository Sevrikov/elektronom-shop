# ТЗ 05. Acceptance checklist

Дата: 2026-05-21  
Назначение: минимальная проверка перед передачей результата владельцу проекта.

## Команды

Перед сдачей должны пройти:

```powershell
npm run lint
npx tsc --noEmit
npm run build
npx prisma validate
npx prisma generate
```

Если есть тесты:

```powershell
npm test
npm run test:e2e
```

Если какой-то команды нет в `package.json`, разработчик должен указать это в отчёте и предложить, какую команду добавить.

## Минимальный набор тестов из старого ТЗ

Если тестовой инфраструктуры ещё нет, её нужно добавить или явно вынести в ближайшую итерацию с причиной. Старое ТЗ требует:

- unit: `formatPrice`, `getDiscountPercent`, `generateOrderNumber`;
- unit: Zod-схемы `CheckoutSchema`, `AddToCartSchema`;
- integration: `addToCart`, `removeFromCart`, `mergeGuestCart`;
- integration: `createOrder`, транзакция и decrement stock;
- integration: `getFilteredProducts`, `getProductBySlug`;
- e2e: главная → категория → товар → корзина → checkout;
- e2e: register/login/logout/redirect;
- e2e: mobile viewport 375x812 и mobile nav.

## Функциональная приёмка

Проверить вручную:

- главная загружается без runtime errors;
- каталог показывает реальные товары;
- фильтры и сортировка не ломают URL;
- product page открывается по slug;
- add to cart работает из карточки и со страницы товара;
- cart quantity/remove/clear работают;
- checkout создаёт заказ;
- нельзя купить больше, чем есть на складе;
- account показывает заказы текущего пользователя;
- admin доступен только разрешённой роли;
- search возвращает результаты или корректное empty state;
- sitemap/robots доступны;
- 404/error pages не выглядят как dev-заглушки.

## Проверка данных

Проверить:

- seed можно запускать повторно;
- товары имеют изображения;
- категории имеют slug;
- цены и остатки не отрицательные;
- order totals совпадают с позициями;
- после checkout остатки уменьшаются;
- Algolia индекс соответствует товарам в базе.

## Проверка безопасности

Проверить:

- новых `.js` файлов в runtime-коде нет;
- `any` не используется как обход типизации;
- секреты не лежат в репозитории;
- `.gitignore` закрывает ключи и локальные env;
- пользователь не видит чужие заказы;
- admin routes защищены;
- ошибки не раскрывают stack trace;
- Server Actions валидируют входные данные.

## Проверка дизайна

Проверить viewport:

- 360px;
- 390px;
- 768px;
- 1280px;
- 1440px.

На каждом размере проверить:

- header;
- каталог;
- карточку товара;
- корзину;
- checkout form;
- account/admin;
- search UI.

## Формат отчёта разработчика

Разработчик должен прислать:

```md
## Что сделано
- ...

## Какие пункты ТЗ закрыты
- TZ_02: ...
- TZ_03: ...

## Изменённые файлы
- ...

## Проверки
- npm run lint: pass/fail
- npx tsc --noEmit: pass/fail
- npm run build: pass/fail
- npx prisma validate: pass/fail

## Остаточные риски
- ...

## Что нужно решить владельцу проекта
- ...
```

Без такого отчёта итерация считается неполной, даже если build проходит.
