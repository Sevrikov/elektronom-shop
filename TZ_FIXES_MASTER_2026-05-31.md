# ТЗ (v2, единый операционный план) — фиксы, остаток, anti-regression

> Дата: 2026-05-31 · Версия: 2 (заменяет операционную часть `TZ_UPDATED_MASTER_CONTEXT_1_3.md` и `TZ_FIXES_CRITICAL_AND_COSMETIC_2026-05-30.md`).
> Источник правил: `MASTER_CONTEXT v1_02.md` (протокол v1.3). Источник фактического состояния: реверс Reversa (`_reversa_sdd/`, `master-context-compliance.md`).
> ⚠️ **Зачем v2:** ранний роадмап (снапшот 2026-05-21) устарел — его «todo» уже реализованы. Следование ему дословно ломает/дублирует код. Этот документ — текущий безопасный план.

---

## 0. ⛔ ANTI-REGRESSION GUARD — что НЕЛЬЗЯ делать

> Прочитать ПЕРЕД любой задачей. Нарушение = регрессия рабочего функционала.

1. **НЕ пересоздавать уже реализованные модули** (см. §1). Старый роадмап помечал их 0–20%, но на 2026-05-30 они есть и часто сложнее примеров спеки. Только **расширять**, не переписывать с нуля.
2. **НЕ выравнивать схему под §6 «вслепую».** §6 устарел относительно кода. В частности:
   - НЕ менять `PaymentStatus` `PENDING/FAILED` → `UNPAID/PARTIAL`.
   - НЕ возвращать `ProductImage.isMain` (код использует `provider/publicId/sortOrder`; примеры §6/§14 с `where:{isMain:true}` — устаревшие, адаптировать их, а не код).
   - НЕ менять `Decimal(12,2)` → `(10,2)`.
   - НЕ откатывать `Order.idempotencyKey` и модель `OrderCounter` (их нет в §6, но это улучшения — сохранить).
   Любое изменение схемы — только через задачу **A-8** (решение + обновление мастера + миграция).
3. **НЕ удалять «сверхплановое»** при чистке под документ: модели и код **AI-ассистента/RAG** (`TechnicalDocument`, `DocumentChunk`, `AssistantSession`, `AssistantMessage`) и **`SupplierInventory`** отсутствуют в документах, но это рабочий функционал. Сначала — узаконить (A-8), не удалять.
4. **НЕ ломать checkout сменой `paymentMethod`.** Реальный enum (`CARD_ONLINE/CASH_ON_DELIVERY/MONOBANK_PARTS/PRIVAT_PARTS`) — оставить; примеры спеки `['card','cod','liqpay']` устаревшие.
5. **НЕ трогать** колонки/логику без теста-страховки, пока не выполнена **A-3** (тесты) — особенно фасеты и `createOrder`.

---

## 1. Статус относительно роадмапа v1.3 — ЧТО УЖЕ СДЕЛАНО (не переделывать)

| Область из роадмапа (2026-05-21) | Роадмап | Факт 2026-05-30 | Действие |
|---|---|---|---|
| `actions/order.ts` / checkout / order-success | 0% | ✅ есть (транзакция, идемпотентность, снапшоты) | только расширять (A-1: оплата) |
| Auth pages (login/register) | 20% | ✅ есть | не пересоздавать |
| Account (orders/profile/wishlist) | 0% | ✅ есть | не пересоздавать |
| Admin panel + product actions | 0% | ✅ `actions/admin.ts` + upload + модерация | рефактор по B/A-8, не с нуля |
| Search / Algolia | 10% | ✅ `lib/algolia.ts` + sync + fallback | дополнить (полный reindex, B) |
| SEO: sitemap/robots/error/not-found | 25% | ✅ присутствуют | не пересоздавать |
| Brands / Info pages | — | ✅ присутствуют | не пересоздавать |
| Guest cart merge | todo | ✅ `mergeCartIfNeeded` | не пересоздавать |
| **Сверх плана (нет в роадмапе):** AI-ассистент, RAG, SupplierInventory | — | ✅ есть | узаконить (A-8) |

> Если задача роадмапа звучит как «создать X», а X уже в таблице выше — это **рефактор/доводка**, а не создание.

---

## 2. КРИТИЧЕСКИЕ (P0)

### A-1. Онлайн-оплата (РАСШИРИТЬ существующий `createOrder`, не переписывать) ⛔Q1
- **Не трогать** текущую транзакцию/идемпотентность/нумерацию. **Добавить** поверх:
  - `src/lib/payment.ts` (`createPayment`, `verifyWebhook`, `mapProviderStatus`) — путь и контракт по §9/§14.
  - `src/app/api/webhooks/payment/route.ts` (POST, `verifyWebhookSignature` → обновить `paymentStatus` идемпотентно).
  - В `createOrder` после COMMIT: для `CARD_ONLINE`/parts — `createPayment`, вернуть `redirectUrl`.
- **Предусловие Q1:** провайдер (LiqPay/Mono/WayForPay). **Сохранить** существующий enum `paymentMethod`.
- **Приёмка:** `CARD_ONLINE`→redirect, webhook PAID идемпотентно, невалидная подпись→400, `CASH_ON_DELIVERY` без изменений.

### A-2. Санитайз HTML описания (XSS) — быстрая победа
- `src/lib/sanitize.ts` (DOMPurify/sanitize-html), очистка в `admin.saveProductAdmin` (вход) + в `product/[slug]/page.tsx:390` (выход). Миграция существующих описаний.
- Не затрагивает 4 безопасных `dangerouslySetInnerHTML` (JSON-LD/`<style>` — см. B-9).
- **Приёмка:** `<script>`/`on*` вырезаются, легальная разметка сохраняется.

### A-3. Тесты + CI (страховка перед прочими правками)
- Vitest + Playwright, `tests/{unit,integration,e2e}` (по §2/§18). CI `.github/workflows/ci.yml`: lint→tsc→test→build.
- Приоритет: `createOrder` (tx/идемпотентность/сток), **паритет фасетов SQL↔in-memory**, `mergeCartIfNeeded`, RBAC, отзыв.
- **Делать до A-4/A-1.**

### A-4. Масштабирование фасетов (без нарушения §3.3)
- Сейчас in-memory `take:50000` (`getCategoryFacets`). §3.3 запрещает `$queryRaw` «без крайней нужды», §20 — Algolia при >50k SKU.
- **Предпочесть Algolia-фасеты** (уже подключён) ИЛИ оформить `$queryRaw`+`jsonb_each_text` как обоснованную крайнюю нужду. Снять 50k-лимит. Закрыть рассинхрон SQL↔in-memory тестом из A-3.

### A-5. Полнота валидации ENV — быстрая победа
- Внести в `env.ts`: `ANTHROPIC_API_KEY`, `CONTENT_FACTORY_API_URL`, `CONTENT_FACTORY_TOKEN` (+ перевести чтение с `process.env` на `env.*`). `RESEND_API_KEY` сделать `startsWith('re_')` (§16). Убрать localhost-дефолт Content Factory в проде.

### A-6. Connection pooling для Vercel (§16 СТОП-СИГНАЛ) — НОВОЕ
- Проверить прод `.env`: для serverless обязателен пуллинг (Prisma Accelerate / PgBouncer / `?connection_limit=1&pool_timeout=20`) + `DIRECT_URL` для миграций. Иначе риск `too many connections`.
- **Приёмка:** под нагрузкой нет исчерпания пула; миграции идут через `DIRECT_URL`.

### A-7. Письмо-подтверждение заказа (§14) — НОВОЕ
- `src/lib/email.ts` + `sendOrderConfirmation` (Resend), вызвать в `createOrder` ПОСЛЕ транзакции (не падать из-за email). Сейчас Resend сконфигурирован, но в `src/` не используется.
- **Приёмка:** после заказа уходит письмо; сбой почты не валит заказ.

### A-8. Согласование схема ↔ мастер-документ — НОВОЕ (разблокирует §0.2/§0.3)
- Обновить `MASTER_CONTEXT` §6 под факт: внести модели **ассистента/RAG** и **`SupplierInventory`**; зафиксировать `PaymentStatus` (`PENDING/FAILED`), `paymentMethod` enum, отсутствие `ProductImage.isMain`, `Decimal(12,2)`, `idempotencyKey`, `OrderCounter`.
- Решить судьбу ассистента/поставщиков: узаконить как модуль ИЛИ вынести в R&D.
- **Приёмка:** §6 = фактической схеме; ни одна задача не требует отката рабочего кода.

---

## 3. МАССОВЫЙ КОСМЕТИЧЕСКИЙ/МЕЛКИЙ РЕМОНТ (один батч-PR, P2/P3)

| ID | Задача | Файлы | Примечание |
|----|--------|-------|-----------|
| B-1 | Унификация бренда → **`Electronom`** (C, латиница; Q10 решено) | title/OG, constants, footer, i18n, **промпт ассистента** (был Elektronom), schema | НЕ менять домен/email `elektronom.com.ua` (K); проверить гомоглиф `с` и опечатки `*nonom` |
| B-2 | search: `categoryName` = переведённое имя | `actions/search.ts` | — |
| B-3 | Удалить мёртвый код / вынести dev-скрипты | `actions/get-asko-products.ts`, `analyze-products.ts` → `scripts/` | — |
| B-4 | Дедупликация `getUserOrders` | `actions/order.ts` vs `queries/orders.ts` | оставить пагинированную |
| B-5 | Локаль-зависимый логин-редирект | `lib/auth.ts` (`/uk/login`) | через proxy/locale |
| B-6 | Синхронизация `.env.example` ↔ `env.ts` | оба | вместе с A-5 |
| B-7 | Доставка/скидки: конфиг вместо `0` | `actions/order.ts` | связано с A-1 |
| B-8 | Единый источник конфигов фильтров | `catalog-data.ts` vs `catalog-filter-config.ts` | с тестом A-3 |
| B-9 | Аудит прочих `dangerouslySetInnerHTML` | breadcrumbs/product-schema/assistant-character/layout | подтвердить безопасность |
| **B-10** | Пароль `min(8)` (§13) | `lib/auth.ts`, `actions/auth.ts` | сейчас `min(6)` |
| **B-11** | Телефон `/^\+380\d{9}$/` (§14) | `actions/order.ts` | сейчас `min(10)` |
| **B-12** | Убрать `any` (§3.1) | `lib/assistant/claude.ts`, `api/assistant/chat/route.ts` | типобезопасность |
| **B-13** | Хардкод i18n → `t()` (§12); inline `style{{}}`→Tailwind/token (§10) | `product/[slug]/page.tsx` и др. | P2 cleanup (признано роадмапом) |

---

## 4. Порядок, ветки, регрессия
1. **A-8 решение по схеме/ассистенту** (разблокирует безопасную работу) → **A-3 тесты** → A-2/A-5/A-6/A-7 → батч B → A-4 → A-1.
2. Ветки: `fix/*` на каждую P0; `chore/cosmetic-cleanup` на весь §3.
3. Регрессия (обязательно, §чек-лист роадмапа): `npm run lint`, `npx tsc --noEmit`, `npm run build`; после A-3 — `vitest` + `playwright` в CI.
4. Чек-лист приёмки v1.3 сохраняется: нет `.js`, нет `@default(cuid())`, нет `z.string().cuid()`, `proxy.ts` не `middleware.ts`, `next/image`, `select`+`take`.

## 5. Открытые решения (продуктовые)
`_reversa_sdd/questions.md` — Q1 (провайдер оплаты), Q2 (RAG-стратегия), Q10 (бренд), + A-8 (узаконить ассистента/поставщиков). Закрыть до старта зависимых задач.

## 6. Трассировка
Находки и реклассификация — `_reversa_sdd/gaps.md`, `master-context-compliance.md` (§5 реконсиляция с роадмапом v1.3).
