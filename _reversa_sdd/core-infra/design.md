# Дизайн — модуль `core-infra`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `lib/prisma.ts` — singleton + `PrismaPg(DATABASE_URL)`, глобальный кэш в dev.
- `lib/env.ts` — zod-схема + refine Cloudinary; `throw` в проде.
- `lib/storage.ts` — `uploadProductImage`/`deleteProductImage` (Cloudinary upload_stream / локально), re-export `images.ts`.
- `lib/images.ts` — `getImageUrl`/`getTransformedImageUrl`.
- `i18n/request.ts` — `locales`, `isValidLocale`, `getRequestConfig`.
- `lib/utils.ts`, `lib/logger.ts`, `lib/constants.ts`, `config/*`.

## Потоки (см. `flowcharts/core-infra.md`)
- Старт: импорт `env.ts` → safeParse → (prod) throw / (dev) лог.
- Upload: File/base64→buffer → Cloudinary | local(dev) | throw(prod).
- Locale: `requestLocale` → guard → import messages.

## Решения
[ADR-0008](../adrs/0008-bleeding-edge-stack-caching.md): стек + `'use cache'`-кэширование.

## Риски
🔴 CI-3 ключи вне валидации; 🔴 CI-4 рассинхрон env-доков; 🟡 CI-7 бренд Electronom/Elektronom.
