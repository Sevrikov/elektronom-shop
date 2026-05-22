# Мини-ТЗ: локальный мини-сервер для ручного тестирования

Дата: 2026-05-22  
Цель: подготовить проект так, чтобы тестировщик мог запустить сайт на ПК и вручную прокликать основные страницы без боевой оплаты, писем и production-интеграций.

## 1. Что нужно получить

Разработчик должен обеспечить локальный запуск сайта по адресу:

```txt
http://localhost:3001/uk
```

Если порт `3001` занят, разрешено использовать `3002` или другой свободный порт, но это нужно явно указать тестировщику.

## 2. Режим запуска

Для ручного тестирования и правок использовать dev-режим:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev -- -p 3001"
```

Для проверки production-сборки:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run build"
powershell -ExecutionPolicy Bypass -Command "npm run start -- -p 3001"
```

## 3. Подготовка базы

Перед передачей тестировщику:

```powershell
powershell -ExecutionPolicy Bypass -Command "npx prisma migrate deploy"
powershell -ExecutionPolicy Bypass -Command "npm run db:seed"
```

Если используется локальная база, разработчик должен проверить, что `.env` содержит рабочий `DATABASE_URL`.

## 4. Тестовый режим без коммерческих интеграций

На этапе ручного просмотра можно не подключать:

- реальную оплату;
- боевой LiqPay/Monobank webhook;
- реальные email-рассылки;
- production Algolia.

Но сайт не должен показывать технические ошибки. Если Algolia не настроена, поиск должен работать через Prisma fallback или показывать корректное пустое состояние.

## 5. Обязательные страницы для ручного клика

Тестировщик должен открыть:

```txt
http://localhost:3001/uk
http://localhost:3001/uk/catalog
http://localhost:3001/uk/search?q=bosch
http://localhost:3001/uk/cart
http://localhost:3001/uk/checkout
http://localhost:3001/uk/brands
http://localhost:3001/uk/about
http://localhost:3001/uk/delivery
http://localhost:3001/uk/contacts
http://localhost:3001/robots.txt
http://localhost:3001/sitemap.xml
```

Также нужно открыть минимум одну реальную страницу товара из каталога.

## 6. Что должно работать

- главная открывается без ошибок;
- каталог показывает товары;
- карточка товара открывается;
- кнопка добавления в корзину работает;
- корзина показывает добавленный товар;
- изменение количества в корзине работает;
- удаление товара из корзины работает;
- checkout открывается, если корзина не пустая;
- при пустой корзине checkout корректно возвращает в корзину;
- поиск не показывает `Algolia client not configured`;
- `robots.txt` отдаёт 200;
- `sitemap.xml` отдаёт 200;
- авторизационные страницы `/uk/login` и `/uk/register` открываются;
- закрытые страницы account/admin не падают, а корректно ведут на login.

## 7. Что можно считать тестовой заглушкой

Допустимо временно:

- не проводить реальную оплату;
- не отправлять реальные письма;
- не создавать реальную доставку Новой Почтой;
- показывать простой admin dashboard без полного CRUD;
- показывать пустой wishlist, если избранное ещё не подключено к UI.

Недопустимо:

- показывать пользователю stack trace;
- показывать технические ошибки env/Algolia/Prisma;
- оставлять кнопки, которые выглядят рабочими, но ничего не делают;
- ломать страницу при пустой базе или пустой корзине.

## 8. Проверки перед передачей тестировщику

Разработчик должен выполнить:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
powershell -ExecutionPolicy Bypass -Command "npx prisma validate"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

Все команды должны пройти без ошибок.

## 9. Формат отчёта разработчика

После подготовки мини-сервера разработчик должен прислать:

```md
## Локальный запуск
URL: http://localhost:3001/uk
Команда запуска: ...

## База данных
- migrate deploy: pass/fail
- db:seed: pass/fail

## Проверки
- npm run lint: pass/fail
- npx tsc --noEmit: pass/fail
- npx prisma validate: pass/fail
- npm run build: pass/fail

## Что можно тестировать руками
- ...

## Временные ограничения
- ...

## Известные проблемы
- ...
```

## 10. Критерий готовности

Мини-сервер считается готовым, если тестировщик может открыть локальный URL, пройти путь:

```txt
главная → каталог → товар → корзина → checkout
```

и при этом не увидеть технических ошибок, белого экрана, 404 на системных файлах или неработающих основных кнопок.
