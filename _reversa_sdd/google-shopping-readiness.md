# Готовность карточки товара к Google Shopping — полевой аудит + ТЗ

> ℹ️ **Это полевой аудит (основание).** Стандарт уровня протокола вынесен в `MASTER_CONTEXT_v1_3_ADDENDUM_GOOGLE_SHOPPING.md`, актуальное реализационное ТЗ — `TZ_GOOGLE_SHOPPING_2026-05-31.md` (обновляет этот документ).

> Дата: 2026-05-31. Проверено по коду: `Product` (Prisma), `components/product/product-schema.tsx`, grep по `gtin/ean/mpn/condition/shipping/merchant/feed`.
> **Вердикт: НЕ готово к Google Shopping.** Органический Product-JSON-LD приличный; для Merchant Center / merchant listings не хватает идентификаторов, доставки/возврата, категории Google и самого фида.

## 1. Что есть сейчас (✅) — пригодно для органических rich-результатов
`product-schema.tsx` (JSON-LD `Product`): `name`, `description` (очищенный от HTML), `sku`, `image[]`, `offers{ price, priceCurrency: UAH, availability: InStock/OutOfStock, url, priceValidUntil(+30д) }`, `brand`, `aggregateRating` (из видимых отзывов). Переводы name/description по locale → можно делать uk/ru фиды.

## 2. Полевой маппинг: атрибут Google Shopping → источник в коде → статус

| Атрибут Merchant Center | Обяз. | Источник в коде | Статус |
|---|---|---|---|
| `id` | ✓ | `Product.sku`/`id` | ✅ |
| `title` | ✓ | `ProductTranslation.name` | ✅ |
| `description` | ✓ | `ProductTranslation.description` | ✅ |
| `link` | ✓ | `slug` → URL | ✅ |
| `image_link` | ✓ | `ProductImage.url` (provider) | ✅ |
| `additional_image_link` | ○ | прочие `ProductImage` | 🟡 (есть данные, не выводится в фид) |
| `availability` | ✓ | `stock>0` | 🟡 только in/out (нет preorder/backorder/«під замовлення») |
| `price` | ✓ | `price Decimal` | ✅ |
| `sale_price` (+effective_date) | ○ | `comparePrice` | 🟡 есть поле, не маппится как sale |
| `brand` | ✓ | `Brand.name` | ✅ |
| **`gtin`** (EAN/UPC) | ✓* | — | ❌ **нет поля в `Product`** |
| **`mpn`** | ✓* | только `SupplierInventory.mpn` + текст в UI | ❌ **нет на `Product`** |
| `identifier_exists` | ○ | — | ❌ (нужен, если нет gtin/mpn) |
| **`condition`** | ✓ | — | ❌ нет (по умолчанию `new`, но не задано) |
| **`google_product_category`** | ○/✓ | — | ❌ нет маппинга `Category`→таксономия Google |
| `product_type` | ○ | `Category` дерево | 🟡 есть данные, не выводится |
| `item_group_id` + варианты (color/size) | ○ | — | ❌ нет группировки вариантов (серии/цвета) |
| `shipping` | ✓(UA) | UI-текст «Нова Пошта» | ❌ не в фиде/не в schema |
| **Фид Merchant Center** (XML/TSV/Content API) | ✓ | — | ❌ **эндпоинта фида нет вообще** |

\* `gtin` **или** `mpn`+`brand` обязателен для большинства категорий; без идентификаторов товары могут отклоняться/терять охват.

## 3. Чего не хватает в structured data для **merchant listings** (бесплатные товарные листинги через schema.org)
К текущему `Product` JSON-LD добавить:
- `gtin`/`mpn` в `Product`/`offers`.
- `offers.shippingDetails` (`OfferShippingDetails`: стоимость/сроки Нова Пошта).
- `offers.hasMerchantReturnPolicy` (`MerchantReturnPolicy`: 14 дней — уже декларируется в UI-тексте).
- `review` (отдельные отзывы, сейчас только `aggregateRating`).

## 4. ТЗ — привести карточку к Google Shopping

### GS-1. Расширить модель `Product` (Prisma) — миграция (учесть A-8/§6)
Добавить поля: `gtin String?` (EAN-13), `mpn String?`, `condition String @default("new")`, `googleProductCategory String?` (или `Int?` — ID таксономии), опц. `itemGroupId String?` (варианты), `saleStartsAt/saleEndsAt DateTime?`.
- Источник данных: `gtin`/`mpn` можно подтягивать из `SupplierInventory` (там `mpn` уже есть) или импортом ASKO/Prom.
- Приёмка: поля в схеме + миграция + админ-редактирование (`saveProductAdmin`).

### GS-2. Расширить `product-schema.tsx` (merchant listings)
Добавить в JSON-LD: `gtin`/`mpn`, `offers.shippingDetails`, `offers.hasMerchantReturnPolicy`, `review[]`; `sale_price` через `priceSpecification` при `comparePrice`.
- Приёмка: Rich Results / Merchant Listings тест Google проходит без ошибок/предупреждений.

### GS-3. Генератор фида Merchant Center
`src/app/feed/[locale]/route.ts` (или `api/merchant/feed`) — XML (Google RSS 2.0 / `g:` namespace) или TSV, по локали (`products_uk`/`products_ru` аналогично Algolia):
- Поля из §2; `availability` маппинг (in_stock/out_of_stock/backorder); `identifier_exists=no` если нет gtin/mpn; `google_product_category` из маппинга категорий.
- Только `isActive`, с пагинацией/потоковой генерацией (не грузить всё в память — учесть урок фасетов C-1).
- Приёмка: фид валиден в Merchant Center, товары проходят модерацию, disapprovals разобраны.

### GS-4. Маппинг `Category` → Google Product Taxonomy
Таблица соответствия слугов категорий → ID/строкам таксономии Google (электрика/инструмент/авто). Хранить в конфиге или поле категории.
- Приёмка: каждая активная категория имеет `google_product_category`.

### GS-5. Merchant Center setup (off-code)
Аккаунт MC + верификация домена + привязка фида/Content API + free listings + (опц.) Shopping Ads; связать с GBP (локальные товарные листинги).

## 5. Приоритет и связи
- **Высокий:** GS-1 (gtin/mpn/condition) + GS-3 (фид) + GS-2 (shipping/return в schema) — без них Shopping не работает/товары отклоняются.
- Тянет за собой: A-8 (изменение схемы согласовать с мастером), out-of-stock-обработку (availability), Нова Пошта (shippingDetails ↔ T-ORD-B доставка).
- Синергия: gtin/mpn улучшают и поиск по артикулу (B2B `searchByMpn` в UI уже есть, но поля на товаре нет — закрыть заодно).

## 6. Вывод
Карточка **готова к органике, но не к Shopping**. Минимально-необходимое: добавить идентификаторы (`gtin`/`mpn`), `condition`, доставку/возврат в schema, маппинг категории Google и **сгенерировать фид Merchant Center** (его сейчас нет). Это отдельный блок, которого не было ни в SEO-стратегии (она про органику/AIO), ни в моём `TZ_SEO_TOP10` — добавляется как WP «Google Shopping».
