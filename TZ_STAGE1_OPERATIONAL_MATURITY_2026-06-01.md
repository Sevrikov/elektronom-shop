# ТЗ — Стадия 1: Операционная зрелость (спринт-уровень)

> Дата: 2026-06-01. Развёртка Стадии 1 из `TZ_ENTERPRISE_ROADMAP_2026-06-01.md` до задач/файлов/псевдокода.
> Это **входной билет в enterprise**. Без неё Стадии 2–4 рискованны. Правила: `MASTER_CONTEXT`+addendum, §0 anti-regression, без `any`/inline-`style`, `select`+`take`, `next/image`, `lint`/`tsc`/`build` зелёные.
> Порядок внутри стадии: **E1.1 (тесты) → E1.2 (пулинг) → E1.5 (перф) ∥ E1.3 (observability) ∥ E1.4 (security)**. Тесты — первыми (страховка для остального).

---

## E1.1 — Тесты + CI/CD 🔴

### Задачи
**T1.1.1 Установка и конфиг**
- Зависимости (dev): `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/dom`, `jsdom`, `@playwright/test`.
- `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'], thresholds: { lines: 70, functions: 70 } } },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
```
- `package.json`: `"test":"vitest run"`, `"test:watch":"vitest"`, `"test:e2e":"playwright test"`, `"typecheck":"tsc --noEmit"`.
- Структура `tests/{unit,integration,e2e}`.

**T1.1.2 Unit/integration — критпуть** (приоритет — бизнес-логика)
- `tests/integration/order.test.ts` — `createOrder`:
  - идемпотентность: 2 вызова с одним `idempotencyKey` → один заказ, тот же `number`.
  - гонка стока: `stock=1`, два параллельных заказа → один успех, второй `count===0`→throw.
  - нумерация: формат `ORD-YYYY-NNNNN`, инкремент `OrderCounter`.
- `tests/unit/facets.test.ts` — **паритет**: на одном датасете `buildAttributeWhere` (SQL-предикат) и `matchProduct` (in-memory) дают одинаковые множества (закрывает риск C-2).
- `tests/integration/cart.test.ts` — `mergeCartIfNeeded`: `qty=min(existing+new, stock, 99)`, очистка cookie.
- `tests/unit/rbac.test.ts` — `requireAdmin`/`requireManager` бросают `FORBIDDEN` для не-роли.
- `tests/integration/review.test.ts` — уникальность отзыва, `verifiedPurchase` по DELIVERED, `isVisible=false`.
- `tests/unit/feed.test.ts` — `feed-builder`: `identifier_exists` логика, маппинг availability in_stock/out_of_stock/backorder, condition.
- **БД для integration:** тест-Postgres (docker `postgres:16` service в CI) + `prisma migrate deploy` + seed; шаблон — оборачивать каждый тест в транзакцию с rollback ИЛИ truncate между тестами.

**T1.1.3 E2E (Playwright)**
- `playwright.config.ts` (baseURL из env, projects chromium+mobile).
- `tests/e2e/purchase.spec.ts` — критпуть: главная → категория → товар → в корзину → checkout → заказ (на seed-данных).
- `tests/e2e/auth.spec.ts` — регистрация/логин.

**T1.1.4 CI** `.github/workflows/ci.yml`
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:16, env: { POSTGRES_PASSWORD: postgres }, ports: ['5432:5432'],
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5 }
    env: { DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test, DIRECT_URL: postgresql://postgres:postgres@localhost:5432/test }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4 { with: { node-version: 20, cache: npm } }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npx prisma migrate deploy
      - run: npm run test
      - run: npm run build
```
(+ опц. job `e2e` с `npx playwright install --with-deps` и `npm run test:e2e`).

**T1.1.5 (опц.) tsgo — ускоритель typecheck (TypeScript 7 / нативный компилятор)** 🟢
- Цель: ускорить проверку типов в ~10× локально и в CI **без риска для сборки** (Next.js собирает через SWC; `tsc` у нас — только type-check). Новых типов это не добавляет — это про скорость/DX.
- Установка: `npm i -D @typescript/native-preview`.
- `package.json`: `"typecheck:fast": "tsgo --noEmit"` (оставить `"typecheck": "tsc --noEmit"` авторитетным).
- Использование: локально/в pre-commit — `typecheck:fast`; в CI на этапе фидбэка — `tsgo --noEmit`, но **гейт PR оставить на `tsc --noEmit`** (correctness), пока tsgo не закроет edge-кейсы и не станет полностью стабильным.
- (Опц.) VS Code — расширение «TypeScript (native preview)» для быстрого IntelliSense на большом коде.
- ⚠️ Не делать tsgo единственным гейтом и не менять build-пайплайн Next, пока tsgo не GA-стабилен. Стек и так bleeding-edge — внедрять инкрементально.
- **Приёмка:** `tsgo --noEmit` проходит на том же коде, что и `tsc --noEmit` (нет расхождений по ошибкам); время type-check заметно меньше; PR-гейт по-прежнему на `tsc`.

### Приёмка E1.1
- PR не мёржится при красных lint/tsc/test/build (branch protection).
- Критпуть (заказ, фасет-паритет, корзина-merge, RBAC, отзыв, фид) покрыт; coverage ≥70%.
- E2E purchase-flow зелёный.

---

## E1.2 — Connection pooling (Vercel) 🔴

### Задачи
- Выбрать: **Prisma Accelerate** (рекоменд. для Vercel) ИЛИ PgBouncer (Supabase/Neon).
- `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled (Accelerate: prisma://... ; PgBouncer: ...?pgbouncer=true&connection_limit=1)
  directUrl = env("DIRECT_URL")     // прямой — для миграций
}
```
- `env.ts` + `.env.example`: добавить `DIRECT_URL` (url).
- Миграции/seed — через `DIRECT_URL` (Prisma делает это автоматически при наличии `directUrl`).
- (Accelerate) обернуть клиент `withAccelerate()` в `lib/prisma.ts` (не ломая singleton).

### Приёмка E1.2
- Нагрузочный тест (k6/artillery, ~100 rps на категорию/товар) — без `too many connections`.
- Миграции применяются через прямое соединение.

---

## E1.3 — Observability 🔴

### Задачи
**T1.3.1 Sentry** (`@sentry/nextjs`)
- `sentry.{client,server,edge}.config.ts` (или через `instrumentation.ts`), `NEXT_PUBLIC_SENTRY_DSN` в env.
- В catch-блоках actions/route handlers рядом с `logger.error(...)` добавить `Sentry.captureException(err, { extra })`. Пример `createOrder`, `api/assistant/chat`, `api/feed`.
- Загрузка source maps в CI.

**T1.3.2 OpenTelemetry** — достроить `instrumentation.ts`: зарегистрировать OTel NodeSDK, экспорт трейсов (OTLP/Sentry/Vercel). Спаны на ключевые операции (createOrder tx, фид, ассистент).

**T1.3.3 Логи/метрики/алерты** — `lib/logger` (JSON) → сток (Axiom/Logtail/Vercel). Vercel Speed Insights (CWV) + Web Analytics. Алерты: рост 5xx, деградация INP/LCP, всплеск AI-стоимости (`costLog` уже есть).

### Приёмка E1.3
- Ошибка в проде видна в Sentry с трейсом и контекстом (userId/orderId).
- Дашборд: ошибки, p95 latency, заказы/мин, CWV, AI-стоимость. Алерты настроены.

---

## E1.4 — Security hardening 🟡

### Задачи
**T1.4.1 Заголовки/CSP** — `next.config.ts` `headers()` или `proxy.ts`:
- `Content-Security-Policy` (⚠️ в `layout.tsx` есть inline theme-script — выдать ему **nonce** или хеш, иначе CSP его заблокирует), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`.
- Разрешить в CSP домены: self, Cloudinary, Algolia, Anthropic, images-домен; `script-src` с nonce.

**T1.4.2 Санитайз HTML** — `lib/sanitize.ts` (`isomorphic-dompurify`): белый список тегов; применять в `admin.saveProductAdmin` (вход) и при рендере описания (`product/[slug]/page.tsx`). Миграция: прогнать существующие `ProductTranslation.description`.

**T1.4.3 PII** — убрать IP из `AssistantMessage.structured`/`costLog` (хешировать или не хранить).

**T1.4.4 RBAC MANAGER + аудит** — задействовать `requireManager` для подмножества admin (заказы/модерация); модель `AuditLog { id, userId, action, entity, entityId, meta Json, createdAt }`; писать в неё из admin-мутаций.

**T1.4.5 ENV-валидация** — внести `ANTHROPIC_API_KEY`, `CONTENT_FACTORY_*`, payment/merchant в `env.ts` (см. A-5/addendum §F); чтение через `env.*`.

### Приёмка E1.4
- securityheaders.com / CSP-evaluator без критики; inline-script с nonce работает.
- XSS-payload в описании вырезается (тест).
- В логах/БД нет «голого» IP. Аудит фиксирует кто/что/когда. ENV валиден, fail-fast в проде.

---

## E1.5 — Производительность baseline 🟡

### Задачи
**T1.5.1 Серверный image-pipeline** — заменить client `TransparentImage` (canvas BFS) на **Cloudinary AI** (`e_background_removal`/`e_bgremoval`) **на загрузке** (`actions/admin.saveProductAdmin`/`api/admin/upload`): хранить готовый прозрачный URL в `ProductImage`. На фронте — обычный `next/image` (вкл. `hero-carousel`). Удалить использование `TransparentImage` на above-the-fold.

**T1.5.2 Свой хостинг изображений** — мигрировать хотлинки `images.prom.ua` (`hero-carousel:512,522` и пр.) → Cloudinary; обновить `ProductImage.url`; sitemap/фид — свои URL. (Заодно вероятный фикс McAfee.)

**T1.5.3 `next/image` везде** — `priority` на LCP-элементе (активный слайд героя/главное фото товара), корректные `sizes`; убрать сырые `<img>`.

**T1.5.4 Баннеры/JS** — тяжёлые анимации на CSS/`requestAnimationFrame`, lazy ниже сгиба; `content-visibility` для скрытого.

### Приёмка E1.5
- CrUX/Lighthouse mobile p75: **INP<200мс, LCP<2.5с, CLS<0.1**.
- На главной нет client-canvas обработки; нет хотлинков на внешние домены изображений; все изображения через `next/image`.

---

## Definition of Done (Стадия 1)
- [ ] CI-гейт (lint/tsc/test/build) на PR; критпуть покрыт; e2e зелёный.
- [ ] Connection pooling включён; нагрузка без `too many connections`.
- [ ] Sentry+трейсы в проде; дашборд+алерты.
- [ ] CSP/security-заголовки; санитайз; нет PII в логах; аудит; ENV валиден.
- [ ] CWV зелёные; серверный image-pipeline; свой хостинг картинок; `next/image` везде.

## Зависимости / трассировка
- E1.1 — первой (страховка). E1.2 — до нагрузочных проверок E2. E1.5 пересекается с round-2 (PD-2 INP, хотлинки).
- Связано: `TZ_FIXES_MASTER` (A-3/A-5/A-6, XSS), `TZ_SEO_FIXES_ROUND2` (PD-2, image), `TZ_ENTERPRISE_ROADMAP` (Стадия 1).
