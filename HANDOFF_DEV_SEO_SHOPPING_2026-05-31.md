# 📦 Передача разработчику — SEO + Google Shopping готовность

> Дата: 2026-05-31. Это cover-note: что читать, в каком порядке, по каким правилам. Цель: привести сайт к SEO-готовности (выход в Топ-10) и Google Shopping (Merchant Center).

## 1. Скинуть обязательно (по этим документам работаем)

| # | Файл | Зачем |
|---|------|-------|
| 1 | `MASTER_CONTEXT v1_02.md` | **Правила проекта** (стек, запреты §3, структура, схема §6). Соблюдать строго. |
| 2 | `MASTER_CONTEXT_v1_3_ADDENDUM_GOOGLE_SHOPPING.md` | **Стандарт Google Shopping** — точные поля `Product`, структура фида, требования schema.org. |
| 3 | `TZ_GOOGLE_SHOPPING_2026-05-31.md` | **Реализация Shopping** — задачи GS-1…GS-6 (поля, фид, таксономия, schema, MC). |
| 4 | `TZ_SEO_TOP10_2026-05-31.md` | **Реализация SEO/GEO** — рабочие пакеты WP-1…WP-13 (вкл. WP-11 Shopping). |
| 5 | `TZ_FIXES_MASTER_2026-05-31.md` | **Только §0 ANTI-REGRESSION + зависимости** (A-3 тесты, B-13 inline-styles, B-1 бренд). Чтобы не сломать готовое. |

## 2. Справочно (по желанию — для понимания контекста)
- `_reversa_sdd/google-shopping-readiness.md` — полевой аудит: каких полей реально нет в коде.
- `_reversa_sdd/seo-doc-factcheck.md` — что из SEO-стратегии не делать (напр. `llms.txt` не тратить ресурс).
- `00_INDEX_DOCS_2026-05-31.md` — общий индекс всей документации.

---

## 3. Золотые правила (озвучить разработчику)
1. **Соблюдать `MASTER_CONTEXT` + addendum.** Чек перед сдачей: `npm run lint`, `npx tsc --noEmit`, `npm run build` — все три проходят.
2. **Прочитать §0 ANTI-REGRESSION** (TZ_FIXES_MASTER): НЕ пересоздавать готовое, НЕ выравнивать схему под §6 вслепую, НЕ удалять ассистента/поставщиков.
3. **Поля Shopping для `Product` уже официально санкционированы** addendum'ом (§A) — миграцию делать можно, отдельный A-8 для них не нужен.
4. Без `any` (§3.1); запросы/фид — `select` + `take`/стриминг, без `$queryRaw` (§3.3); только Tailwind, без inline-`style`/`<style>` (§10).

## 4. Порядок работ (для SEO + Shopping)

### A) Google Shopping (быстрее даёт канал продаж)
1. **GS-1** — миграция `Product`: `gtin, mpn, condition, googleProductCategory, itemGroupId, salePrice/saleStartsAt/EndsAt` (точно по addendum §A); заполнить `gtin/mpn` из `SupplierInventory`/импорта.
2. **GS-4** — маппинг `Category` → Google Product Taxonomy (`config/google-taxonomy.ts`).
3. **GS-3** — генератор фида `app/feed/[locale]/route.ts` (XML `g:`/TSV, по локали, только `isActive`, потоково).
4. **GS-2** — расширить `components/seo/product-schema.tsx`: `gtin/mpn`, `shippingDetails`, `hasMerchantReturnPolicy`, `review[]`.
5. **GS-5** — настройка Merchant Center + free listings (off-code). **GS-6** — поиск по MPN.

### B) SEO/GEO (Топ-10 за 12 мес)
1. **WP-1** — семантический HTML5 (`main/article/section`), `robots.ts`+`Sitemap:`, расширить sitemap. (`llms.txt` — низкий приоритет.)
2. **WP-13** — техника товаров: out-of-stock без 404, управление фасет-краулом (`noindex` произвольных фильтров и `/search`), image SEO, hreflang-корректность.
3. **WP-2** — программные фасет-лендинги (whitelisted `quickLinks` → индексируемые + self-canonical; прочие → canonical/noindex).
4. **WP-4** — Schema-граф: `Organization`, расширенный `Product`, `FAQPage`, `HowTo`, `Person/Author`.
5. **WP-3 + WP-5** — AEO-блоки (Direct Answer 40-80 слов + FAQ) + контент-хаб/техгайды (через Content Factory; гайды = корпус и для ассистента).
6. **WP-6** — E-E-A-T (авторы, Trust/privacy, бейдж «перевірена покупка»).
7. **WP-7** — INP<200мс (баннеры/bg-removal/фильтры/ассистент; снять inline-стили = B-13).
8. **WP-8/9/12** — бренд-сущность, линкбилдинг, локальное SEO/GBP. **WP-10** — GSC/GA4/трекинг.

> Важно (из фактчека): AIO сильнее бьёт по **информационным** запросам (−34%), по транзакционным — слабо (−12%). Поэтому GEO/AEO концентрировать в **гайдах/блоге** (WP-5), а на товарах/категориях — классическое + e-commerce-SEO.

## 5. Зависимости и предусловия
- **A-3 (тесты)** желательно до правок фасетов/шаблонов (страховка) — см. TZ_FIXES_MASTER.
- **Нова Пошта (доставка)** нужна для `shippingDetails` в фиде/schema — если ещё не сделана (T-ORD-B).
- **Бренд (Q10, решено 2026-05-31):** канон — **`Electronom`** (через C, латиница). Домен/email `elektronom.com.ua` (через K) НЕ трогать. Унифицировать все бренд-тексты к `Electronom` (вкл. промпт ассистента — был `Elektronom`); проверить гомоглиф `с` и опечатки `*nonom`.

## 6. Критерии готовности
- **Shopping:** фид `/feed/{uk,ru}` валиден в Merchant Center, **0 critical disapprovals**, free listings активны.
- **SEO:** индексация >95% (GSC), нет дублей/soft-404, INP(p98)<200мс, Rich Results/Merchant Listings тесты зелёные.
- Сборка: lint + tsc + build проходят.
