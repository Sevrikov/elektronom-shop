# MASTER_CONTEXT — Addendum: Google Shopping / Merchant Center
# Версия протокола: 1.3 · Addendum: 2026-05-31
# ⚠️ ЯВЛЯЕТСЯ ЧАСТЬЮ MASTER_CONTEXT. Обязателен к соблюдению наравне с основным документом.
# Связан указателем в §6 (`MASTER_CONTEXT v1_02.md`). Реализация: `TZ_GOOGLE_SHOPPING_2026-05-31.md`.

## Статус и область
Этот addendum официально интегрирует стандарт **Google Shopping / Merchant Center** в протокол проекта: расширяет §6 (схема), §4 (структура), §9 (Route Handlers), §11 (микроразметка), §16 (ENV). Все правила и «абсолютные запреты» §3 основного документа сохраняются.

---

## A. §6 — Расширение модели `Product` (схема БД)

> Это **санкционированное** изменение схемы (снимает запрет §6 «поля вне схемы без обновления документа»). Требует миграции Prisma.

```prisma
enum ProductCondition {
  NEW
  USED
  REFURBISHED
}

model Product {
  // ... существующие поля без изменений ...

  // ─── Google Shopping / Merchant Center ───
  gtin                  String?            // EAN-13 / UPC / GTIN-14 (штрихкод производителя)
  mpn                   String?            // Manufacturer Part Number
  condition             ProductCondition   @default(NEW)
  googleProductCategory String?            // ID или путь Google Product Taxonomy
  itemGroupId           String?            // группировка вариантов (цвет/серия/секция)
  salePrice             Decimal?  @db.Decimal(12, 2)  // акционная цена → sale_price
  saleStartsAt          DateTime?
  saleEndsAt            DateTime?

  @@index([gtin])
  @@index([itemGroupId])
}
```

**Правила:**
- Соглашения §5 сохраняются: `cuid2()` PK, camelCase-поля, `SCREAMING_SNAKE_CASE` для enum-значений.
- **Идентификаторы:** для большинства категорий обязателен `gtin` **ЛИБО** (`mpn` + `brand`). Если оба пустые → в фиде `identifier_exists=no`.
- **Источник данных:** `gtin`/`mpn` подтягиваются из `SupplierInventory.mpn` и/или импорта ASKO/Prom; заполняются/редактируются через `saveProductAdmin`.
- `Decimal(12, 2)` (как фактический стандарт проекта, не `(10,2)`).

---

## B. §4 — Дополнения файловой структуры (санкционировано)

```
src/
├── app/
│   └── feed/
│       └── [locale]/
│           └── route.ts        # ← Фид Merchant Center (XML g:/TSV) по локали
├── components/
│   └── seo/                    # ← SEO/структурированные данные
│       ├── product-schema.tsx  # (существует — расширяется, см. §D)
│       └── organization-schema.tsx
├── lib/
│   ├── merchant/
│   │   ├── feed-builder.ts     # сборка фид-элементов (select+take/стриминг)
│   │   └── taxonomy.ts         # маппинг Category → Google Product Taxonomy
│   └── validations/
│       └── product-feed.ts     # zod-схема элемента фида
└── config/
    └── google-taxonomy.ts      # таблица соответствия слугов категорий → ID таксономии
```

---

## C. §9 — Исключение для Route Handlers (фид)

§9 разрешает Route Handlers **только** для вебхуков/NextAuth/публичного API. **Фид Merchant Center квалифицируется как публичный API** (потребитель — внешняя система Google), поэтому `src/app/feed/[locale]/route.ts` — **разрешённый** Route Handler.

Обязательно при реализации фида (правила §3.3):
- Только `select` нужных полей; **всегда `take`/пагинация/стриминг** — НЕ грузить весь каталог в память (урок: фасеты `take:50000`).
- ⛔ Без `$queryRaw` без крайней нужды. ⛔ Без `any` (§3.1) — типобезопасный билд элемента фида через zod.
- Только `isActive` товары.

---

## D. §11 — Структурированные данные для merchant listings

`components/seo/product-schema.tsx` (`Product` JSON-LD) ОБЯЗАН включать для бесплатных товарных листингов:
- `gtin` **или** `mpn` (+ `brand`);
- `offers.priceValidUntil` (уже есть), `offers.price`, `offers.priceCurrency`, `offers.availability`;
- `offers.shippingDetails` → `OfferShippingDetails` (стоимость/сроки Нова Пошта);
- `offers.hasMerchantReturnPolicy` → `MerchantReturnPolicy` (14 дней);
- `review[]` (отдельные отзывы) в дополнение к `aggregateRating`;
- при `salePrice` в активном окне `saleStartsAt..saleEndsAt` — `priceSpecification`/sale.

Проверка: **Rich Results Test** и **Merchant Listings** тест Google — без ошибок и критических предупреждений.

---

## E. Стандарт фида Merchant Center

**Формат:** Google RSS 2.0 c namespace `g:` (XML) или TSV; альтернатива — Content API for Shopping. **Раздельно по локали** (`uk`/`ru`), аналогично индексам Algolia (`products_uk`/`products_ru`).

**Обязательные атрибуты:** `id`, `title`, `description`, `link`, `image_link`, `availability`, `price`, `brand`, `condition`, `gtin`/`mpn`(+`identifier_exists`), `google_product_category`.
**Рекомендуемые:** `additional_image_link`, `product_type`, `item_group_id`, `sale_price`(+`sale_price_effective_date`), `shipping`.

**Маппинг:**
- `availability`: `stock>0` → `in_stock`; `stock=0` без поставщика → `out_of_stock`; есть у поставщика → `backorder`/«під замовлення».
- `condition`: из `Product.condition` (`NEW`→`new` и т.д.).
- `google_product_category`: из `config/google-taxonomy.ts` по `Category`.
- `sale_price`: из `salePrice` + окно `saleStartsAt..saleEndsAt`.
- `identifier_exists=no` при отсутствии `gtin` и `mpn`.

---

## F. §16 — Переменные окружения (если Content API)
При использовании Content API for Shopping (вместо файла-фида) добавить в `lib/env.ts` и `.env.example` (как `optional`, с валидацией):
```
MERCHANT_CENTER_ID=""
GOOGLE_MERCHANT_SERVICE_ACCOUNT_JSON=""   # либо путь/секрет сервис-аккаунта
```
Секреты — НЕ в `NEXT_PUBLIC_*`.

---

## G. Чек-лист приёмки (в дополнение к §-чек-листу мастера)
- [ ] Миграция Product (поля §A) применена; админ редактирует gtin/mpn/condition.
- [ ] `product-schema.tsx` проходит Merchant Listings тест (gtin/mpn/shipping/return/review).
- [ ] Фид `/feed/{locale}` валиден в Merchant Center; **0 critical disapprovals**.
- [ ] `google_product_category` задан для всех активных категорий.
- [ ] Фид собирается потоково (без загрузки всего каталога в память); нет `any`/`$queryRaw`.
- [ ] Бесплатные товарные листинги активны; (опц.) Shopping Ads.
- [ ] `npm run lint` / `tsc --noEmit` / `npm run build` — проходят.

## H. Связи
- Снимает условие **A-8** для полей Shopping (схема узаконена этим addendum).
- Чинит заодно «поиск по MPN» (в UI `searchByMpn` есть, поля на `Product` не было).
- Синергия: `shippingDetails` ↔ доставка Нова Пошта (T-ORD-B); `availability backorder` ↔ supplier feed (Ставка 3).
