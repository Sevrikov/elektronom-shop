# ТЗ — Интеграция Google Shopping / Merchant Center

> Дата: 2026-05-31 · **Обновляет** `_reversa_sdd/google-shopping-readiness.md` (полевой аудит — остаётся основанием) и **реализует** стандарт `MASTER_CONTEXT_v1_3_ADDENDUM_GOOGLE_SHOPPING.md`.
> Слой: реализация (задачи/приёмка). Стандарт/правила — в addendum. ⚠️ Соблюдать `§0 ANTI-REGRESSION` (`TZ_FIXES_MASTER_2026-05-31.md`).

## Что изменилось относительно предыдущего ТЗ
- **Поля схемы теперь официально определены** (точные типы) — в addendum §A. **Условие A-8 снято** для этих полей (схема узаконена в протоколе).
- **Структура файлов зафиксирована** (addendum §B), фид как Route Handler **санкционирован** (addendum §C).
- Добавлены точные правила маппинга фида и микроразметки (addendum §D/§E).

## Текущее состояние (из аудита)
Карточка **готова к органике**, но **НЕ к Shopping**: нет `gtin/mpn/condition/googleProductCategory`, нет `shippingDetails`/`hasMerchantReturnPolicy` в JSON-LD, **нет фида** Merchant Center. Детальный полевой маппинг — `_reversa_sdd/google-shopping-readiness.md` §2.

---

## Задачи

### GS-1 — Миграция `Product` (поля Shopping) 🟢 разблокировано addendum
- **Файлы:** `prisma/schema.prisma` (+ enum `ProductCondition`), миграция, `src/actions/admin.ts` (`saveProductAdmin` — редактирование новых полей), `src/app/[locale]/admin/*` (форма).
- **Поля (точно по addendum §A):** `gtin`, `mpn`, `condition (NEW default)`, `googleProductCategory`, `itemGroupId`, `salePrice`, `saleStartsAt/EndsAt`, индексы `gtin`/`itemGroupId`.
- **Данные:** заполнить `gtin/mpn` из `SupplierInventory.mpn`/импорта ASKO (скрипт разовой синхронизации по `sku`).
- **Приёмка:** миграция применена; админ редактирует поля; ≥X% товаров имеют `gtin` или `mpn`.
- **Не ломать:** существующие поля Product; `Decimal(12,2)`.

### GS-2 — Расширить `product-schema.tsx` (merchant listings)
- **Файл:** `src/components/seo/product-schema.tsx` (расширить существующий, не заменять).
- **Добавить в JSON-LD:** `gtin`/`mpn`, `offers.shippingDetails` (`OfferShippingDetails`), `offers.hasMerchantReturnPolicy` (`MerchantReturnPolicy`), `review[]`; sale через `priceSpecification` при активном `salePrice`.
- **Приёмка:** Merchant Listings / Rich Results тест — без ошибок.
- **Не ломать:** текущие `price/availability/priceValidUntil/brand/aggregateRating`.

### GS-3 — Генератор фида Merchant Center ⭐
- **Файлы:** `src/app/feed/[locale]/route.ts` (Route Handler, §C), `src/lib/merchant/feed-builder.ts`, `src/lib/validations/product-feed.ts` (zod).
- **Стандарт:** Google RSS 2.0 (`g:`)/TSV, раздельно `uk`/`ru`; обязательные/рекоменд. атрибуты и маппинг — addendum §E.
- **Требования §3.3:** только `isActive`; `select`+`take`/стриминг (НЕ весь каталог в память); без `$queryRaw`/`any`.
- **Маппинг availability:** in_stock / out_of_stock / backorder («під замовлення» из supplier feed).
- **Приёмка:** `/feed/uk` и `/feed/ru` отдают валидный фид; принят в Merchant Center; **0 critical disapprovals**.

### GS-4 — Маппинг категорий → Google Product Taxonomy
- **Файлы:** `src/config/google-taxonomy.ts`, `src/lib/merchant/taxonomy.ts`; (опц.) поле `Category.googleCategory`.
- **Приёмка:** каждая активная категория имеет `google_product_category`.

### GS-5 — Настройка Merchant Center (off-code)
- Аккаунт MC + верификация домена + привязка фида (или Content API) + free listings + (опц.) Shopping Ads; связать с GBP (локальные товарные листинги, WP-12 SEO-ТЗ).
- При Content API: env `MERCHANT_*` в `env.ts`/`.env.example` (addendum §F).
- **Приёмка:** товары проходят модерацию; бесплатные листинги активны.

### GS-6 — Побочное: поиск по MPN
- Заполнив `gtin/mpn` на `Product`, включить поиск по ним (в UI `searchByMpn` уже заявлен; поля не было).
- **Файлы:** `actions/search.ts`/`queries/search.ts` + индекс Algolia (добавить `gtin/mpn` в record).
- **Приёмка:** поиск по артикулу/MPN/штрихкоду находит товар.

---

## Приоритет и порядок
1. **GS-1** (схема — узаконена addendum) → **GS-3 + GS-4** (фид + таксономия) → **GS-2** (schema) → **GS-5** (MC) → **GS-6** (поиск).
2. Параллельно с фиксами: зависит от out-of-stock-обработки (T-SEO-13.1 / availability) и доставки Нова Пошта (T-ORD-B → `shippingDetails`).

## Соответствие MASTER_CONTEXT
- §6: поля санкционированы addendum §A (A-8 для них закрыт).
- §9: фид — разрешённый Route Handler (addendum §C).
- §3.1/§3.3: без `any`, `select`+`take`, без `$queryRaw`.
- §4: новые файлы по addendum §B; zod в `lib/validations/`.
- §11: микроразметка по addendum §D.

## Трассировка
Стандарт — `MASTER_CONTEXT_v1_3_ADDENDUM_GOOGLE_SHOPPING.md`; полевой аудит — `_reversa_sdd/google-shopping-readiness.md`; SEO-контекст — `TZ_SEO_TOP10_2026-05-31.md` (WP-11); фиксы/anti-regression — `TZ_FIXES_MASTER_2026-05-31.md`.
