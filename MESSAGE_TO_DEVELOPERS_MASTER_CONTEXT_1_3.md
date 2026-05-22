Нужно провести ревизию проекта по обновлённому протоколу MASTER_CONTEXT v1_02.md версии 1.3.

Главное: теперь официальный стек проекта — Prisma 7.x + Zustand 5.x. Не откатывать на Prisma 5 / Zustand 4.

Задача:

1. Прочитать MASTER_CONTEXT v1_02.md v1.3.
2. Проверить весь код проекта на соответствие этому документу.
3. Исправить все несоответствия.
4. После исправлений прогнать:
   - npm run lint
   - npm run build
   - npx tsc --noEmit
   Подтвердить, что все 3 команды проходят.
5. В отчёте написать:
   - что исправили;
   - какие файлы изменили;
   - какие проверки прошли;
   - что осталось как технический долг.

Особое внимание проверить:

* Prisma 7:
  - @/generated/prisma/client
  - @prisma/adapter-pg
  - prisma.config.ts
  - singleton Prisma только в src/lib/prisma.ts
  - new PrismaClient() только в src/lib/prisma.ts и технических seed/scripts
* ID:
  - в Prisma schema использовать cuid2() (через cuid(2) в схеме)
  - в Zod не использовать .cuid()
* Zustand 5:
  - только для UI-состояния
  - не хранить товары корзины в Zustand
* Next.js 16:
  - proxy.ts, не middleware.ts
  - cacheComponents: true
  - typedRoutes: true
  - без export const revalidate
  - без export const dynamic = 'force-dynamic'
* UI:
  - убрать inline style={{...}}, где можно заменить Tailwind/CSS tokens
  - UI-тексты вынести в next-intl
* Доделать отсутствующее по ТЗ:
  - checkout
  - auth pages
  - account pages
  - admin
  - Algolia search layer
  - sitemap/robots/error pages
  - tests

Результат работы должен быть не просто “проект собирается”, а “проект соответствует MASTER_CONTEXT v1_02.md v1.3 и ТЗ”.
