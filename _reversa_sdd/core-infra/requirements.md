# Требования — модуль `core-infra`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
Инфраструктура: клиент БД, валидация окружения, хранилище изображений, i18n, логирование, утилиты.

## Функциональные требования (MoSCoW)
### Must
- **FR-CI-1** 🟢 Singleton `PrismaClient` с `adapter-pg` (HMR-safe, лог запросов в dev).
- **FR-CI-2** 🟢 Zod-валидация env на старте; `throw` в production при ошибке.
- **FR-CI-3** 🟢 Хранилище: `uploadProductImage` (Cloudinary/локально dev), `deleteProductImage` (anti-traversal); прод требует Cloudinary.
- **FR-CI-4** 🟢 i18n: locales uk/ru, defaultLocale uk, `getRequestConfig`, `notFound` на невалидной локали.
- **FR-CI-5** 🟢 Утилиты: `formatPrice`, `getDiscountPercent`, `getSiteUrl`, `parseSearchParams`; `logger`; `constants`.
### Should
- **FR-CI-6** 🟢 Cloudinary refine «всё-или-ничего» в env-схеме.

## НФТ
- **NFR-CI-1 (Reliability)** 🟢 Fail-fast по env в проде.
- **NFR-CI-2 (Security)** 🟢 Двойная защита от path traversal при удалении локальных файлов; admin-ключи не в `NEXT_PUBLIC`.
- **NFR-CI-3 (Config integrity)** 🔴 Неполная валидация: `ANTHROPIC_API_KEY`/`CONTENT_FACTORY_*` вне `env.ts`; рассинхрон с `.env.example`.

## Критерии приёмки
**AC-CI-1 (env, prod fail)** 🟢 Дано: невалидный env в production; Когда: старт; Тогда: `throw`.
**AC-CI-2 (storage prod)** 🟢 Дано: прод без Cloudinary; Когда: upload; Тогда: ошибка (локально нельзя).
**AC-CI-3 (locale, fail)** 🟢 Дано: locale `de`; Тогда: `notFound`.

## Зависимости
Нет внутренних (базовый слой).

## Лакуны 🔴
Полнота env-валидации (CI-3), синхронизация `.env.example`↔`env.ts` (CI-4).
