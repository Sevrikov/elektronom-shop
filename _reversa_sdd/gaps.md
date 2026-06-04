# Пробелы (Gaps) — Elektronom

> Артефакт **Reviewer** (Фаза 5) · Reversa · `completo`. Категоризация по серьёзности.
> Это сводка лакун 🔴/🟡, требующих решения. Детали — в `code-analysis.md`, `domain.md`, `architecture.md`.

## 🔴 Критические (блокируют «коммерческую готовность» / безопасность)

| # | Пробел | Где | Влияние |
|---|--------|-----|---------|
| G-1 | **Онлайн-оплата не реализована** — `createOrder` не инициирует платёж, `PAYMENT_*`/webhook не используются; `paymentStatus` всегда `PENDING` | cart-checkout-orders | Нельзя принимать предоплату/карты |
| G-2 | **XSS-риск:** описание товара рендерится `dangerouslySetInnerHTML` без явного санитайза | product (page.tsx:390) | Возможен XSS, если HTML из админки/импорта не очищается |
| G-3 | **Нет автотестов и CI** при bleeding-edge стеке (Next16/React19/Prisma7/NextAuth5-beta) | весь проект | Высокий риск регрессий |
| G-4 | **Масштабирование фасетов:** in-memory расчёт до 50 000 товаров на категорию | catalog | Деградация/память при росте каталога |
| G-5 | **`ANTHROPIC_API_KEY` вне валидации** (`.env.example` и `env.ts`) | assistant/core-infra | Тихий сбой ассистента в проде |

## 🟡 Умеренные (тех. долг / консистентность)

| # | Пробел | Где |
|---|--------|-----|
| G-6 | Две реализации фасет-логики (SQL vs in-memory) — риск рассинхрона счётчиков и выдачи | catalog |
| G-7 | Дублирование конфигов фильтров (`catalog-data` vs `catalog-filter-config`) | catalog |
| G-8 | «RAG» не векторный: `TechnicalDocument`/`DocumentChunk`/`embedding` не используются; `sources` — плейсхолдеры | assistant |
| G-9 | `admin.ts` — god-файл (~1540 строк, 6 доменов) | admin |
| G-10 | Нет валидации переходов `OrderStatus` (любой статус принимается) | admin/orders |
| G-11 | Роль `MANAGER` не используется; нет аудита админ-действий | auth/admin |
| G-12 | `addressId` не привязывается к заказу; `Address` без CRUD | orders/auth |
| G-13 | Дубль `getUserOrders` (actions vs queries) | orders |
| G-14 | Rate-limit ассистента на скане БД (IP в неиндексируемом JSON), IP в открытом виде (PII) | assistant |
| G-15 | Рассинхрон `.env.example` ↔ `env.ts` (Cloudinary/Anthropic/Content Factory) | core-infra |
| G-16 | `SupplierInventory` без рантайм-кода; dev-скрипты в `src/actions/` (мёртвый код) | suppliers |
| G-17 | Нет полной переиндексации Algolia; дрейф индекса при пропуске sync | search |
| G-18 | `qty_breaks`: две несовместимые формы (реальная vs mock) | product/catalog |
| G-19 | Верификация email/авто-логин при регистрации отсутствуют | auth |

## 🟢 Косметические

| # | Пробел | Где |
|---|--------|-----|
| G-20 | Разнобой бренда `Electronom`/`Elektronom` (title/OG vs домен/email) | product/core-infra |
| G-21 | `shipping=0`/`discount=0` захардкожены (нет доставки/промокодов) | orders |
| G-22 | `categoryName=slug` в fallback-поиске (не переведённое имя) | search |

## Не покрыто специями (n/a)
`queries/workload.ts` (индикатор загрузки), `components/home|layout|shared|ui` (презентационный слой), `instrumentation.ts`, баннеры/bg-removal (визуальная часть, активная в git).

## Приоритет работ (рекомендация Reviewer)
1. **Оплата** (G-1) и **санитайз описаний** (G-2) — перед продом.
2. **Тесты/CI** (G-3) — для устойчивости стека.
3. **Фасеты в SQL/Algolia** (G-4, G-6) — перед ростом каталога.
4. Конфиг env (G-5, G-15), статусы заказов (G-10), дедупликация (G-7, G-13).
