# Мини-ТЗ: staging-деплой сайта для просмотра в интернете

Дата: 2026-05-22  
Цель: развернуть тестовую интернет-версию сайта, чтобы владелец проекта и тестировщик могли смотреть сайт по публичной ссылке без запуска локального ПК.

## 1. Целевой результат

Нужно получить staging URL:

```txt
https://test.elektronom.com.ua
```

Если домен ещё не готов, допускается временный URL платформы деплоя, например Vercel preview/staging URL. Разработчик обязан явно указать рабочую ссылку.

## 2. Рекомендуемый способ

Рекомендуемый вариант:

- GitHub repository;
- Vercel для Next.js 16;
- Neon PostgreSQL или другой managed PostgreSQL;
- staging env отдельно от production;
- отдельная staging database, не production database.

Локальный ПК не должен быть нужен для просмотра сайта в интернете.

## 3. Что нельзя делать

- Не открывать локальный компьютер в интернет как постоянный сервер.
- Не использовать production-базу для тестов.
- Не хранить секреты в репозитории.
- Не коммитить `.env`.
- Не включать реальные платежи без отдельного согласования.
- Не отправлять реальные email клиентам из staging.

## 4. Staging env

В панели деплоя нужно добавить минимум:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=https://test.elektronom.com.ua
NEXT_PUBLIC_SITE_URL=https://test.elektronom.com.ua
```

Опционально:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
```

Если Algolia не настроена, поиск обязан работать через Prisma fallback или показывать корректное пустое состояние без технической ошибки.

Если Resend/payment не настроены, checkout должен работать в тестовом режиме без реальной отправки писем и оплаты.

## 5. База данных

Для staging создать отдельную PostgreSQL database.

После настройки `DATABASE_URL` выполнить:

```powershell
npx prisma migrate deploy
npm run db:seed
```

Важно: если initial migration уже применена, не переписывать её. Новые изменения добавлять отдельными миграциями.

Обязательная миграция:

```txt
prisma/migrations/20260521130000_add_product_attributes_gin_index/migration.sql
```

Она добавляет GIN index для `products.attributes`.

## 6. Build command

Для Vercel/CI:

```txt
npm run build
```

Перед деплоем локально проверить:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

## 7. Проверка после деплоя

Открыть в браузере:

```txt
https://test.elektronom.com.ua/uk
https://test.elektronom.com.ua/uk/catalog
https://test.elektronom.com.ua/uk/search?q=bosch
https://test.elektronom.com.ua/uk/cart
https://test.elektronom.com.ua/uk/checkout
https://test.elektronom.com.ua/uk/brands
https://test.elektronom.com.ua/uk/about
https://test.elektronom.com.ua/uk/delivery
https://test.elektronom.com.ua/uk/contacts
https://test.elektronom.com.ua/robots.txt
https://test.elektronom.com.ua/sitemap.xml
```

Также открыть минимум одну реальную страницу товара.

## 8. Что должно работать на staging

- главная страница открывается;
- каталог показывает товары из staging database;
- товарная страница открывается;
- корзина работает;
- checkout доступен в тестовом режиме;
- поиск не показывает `Algolia client not configured`;
- account/admin routes не падают;
- закрытые страницы отправляют неавторизованного пользователя на login;
- `robots.txt` отдаёт 200;
- `sitemap.xml` отдаёт 200;
- нет белого экрана и runtime errors.

## 9. Тестовый checkout

Для staging допускается:

- заказ создаётся в базе;
- оплата не проводится;
- payment status остаётся `PENDING`;
- email не отправляется, если Resend не настроен;
- менеджерская обработка заказа может быть ручной.

Недопустимо:

- кнопка checkout выглядит рабочей, но ничего не делает;
- заказ создаётся без проверки остатков;
- пользователь видит stack trace или техническую ошибку.

## 10. SEO staging

Для staging допустимо закрыть индексацию от поисковиков.

Проверить:

- `robots.txt` доступен;
- `sitemap.xml` доступен;
- staging не должен случайно индексироваться как production.

Если используется `test.elektronom.com.ua`, желательно:

- `robots` для staging: `noindex` или закрытие индексации;
- production sitemap не должен ссылаться на staging URL.

## 11. Отчёт разработчика

После деплоя разработчик должен прислать:

```md
## Staging URL
https://...

## Платформа
- Vercel/другое:
- База:

## Env
- DATABASE_URL: configured
- AUTH_SECRET: configured
- AUTH_URL: configured
- NEXT_PUBLIC_SITE_URL: configured
- Algolia: configured/not configured, fallback works
- Email: configured/not configured
- Payment: disabled/test mode

## Миграции и seed
- npx prisma migrate deploy: pass/fail
- npm run db:seed: pass/fail

## Проверки
- npm run lint: pass/fail
- npx tsc --noEmit: pass/fail
- npx prisma validate: pass/fail
- npm run build: pass/fail

## Проверенные URL
- /uk: pass/fail
- /uk/catalog: pass/fail
- /uk/product/...: pass/fail
- /uk/cart: pass/fail
- /uk/checkout: pass/fail
- /uk/search?q=bosch: pass/fail
- /robots.txt: pass/fail
- /sitemap.xml: pass/fail

## Известные ограничения staging
- ...
```

## 12. Критерий готовности

Staging считается готовым, если сайт открывается по публичной ссылке и тестировщик может пройти путь:

```txt
главная → каталог → товар → корзина → checkout
```

без локального запуска проекта на своём ПК и без технических ошибок на экране.
