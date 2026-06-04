# Задачи — модуль `core-infra`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-CI-1** Prisma singleton + adapter-pg.
  - Легаси: `lib/prisma.ts`. Готово: HMR-safe, лог в dev. 🟢
- [ ] **T-CI-2** Zod-валидация env (fail-fast в проде).
  - Легаси: `lib/env.ts`. Готово: схема + Cloudinary refine; throw в production. 🟢
- [ ] **T-CI-3** Хранилище изображений (Cloudinary/local) с anti-traversal.
  - Легаси: `lib/storage.ts`. Готово: прод требует Cloudinary; защита удаления. 🟢
- [ ] **T-CI-4** i18n-конфиг (uk/ru, notFound).
  - Легаси: `i18n/request.ts`. Готово: загрузка messages по локали. 🟢
- [ ] **T-CI-5** Утилиты/логгер/константы.
  - Легаси: `lib/utils.ts`, `lib/logger.ts`, `lib/constants.ts`. Готово: formatPrice/discount/siteUrl. 🟢
- [ ] **T-CI-6** (Конфиг) Внести `ANTHROPIC_API_KEY`/`CONTENT_FACTORY_*` в `env.ts`; синхронизировать с `.env.example`.
  - Легаси: `env.ts`, `.env.example`. Готово: единый, валидируемый список env. 🔴
