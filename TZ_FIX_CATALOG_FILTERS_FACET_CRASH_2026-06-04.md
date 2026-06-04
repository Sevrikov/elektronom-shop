# FIX: Каталог — фильтры «отрубились» (Бренд 0, цена 0–0, нет атрибутов)

**Дата:** 2026-06-04
**Файл:** `src/queries/categories.ts` → `getCategoryFacets()`
**Статус:** фикс применён в рабочей копии, проверен на реальной БД (Neon). Нужно закоммитить + задеплоить.

---

## Симптом
На любой категории (скрин — `elektryka`) сайдбар фильтров рисуется, но пустой:
- **Бренд: 0** (нет чекбоксов брендов)
- **Цена:** ползунок `0 – 0`
- нет ни одного атрибутного фильтра

## Корень (root cause)
`getCategoryFacets()` собирает все фасеты в одном `try{}`. Запрос гистограммы цен (price buckets) падал:

```
Postgres 42725: operator is not unique: unknown - unknown
```

Причина — выражение `(${absoluteMax} - ${absoluteMin})`: это **два нетипизированных bind-параметра** (`$1 - $2`), оба приходят как `unknown`, и Postgres не может выбрать оператор `-` для `unknown - unknown`.

Так как buckets идёт в `try` **раньше** брендов/атрибутов, любое его падение роняет всю функцию в:
```ts
} catch (error) {
  console.error("[getCategoryFacets] Error calculating facets:", error);
  return getEmptyFacetsFallback(activeFilters);  // total:0, brands:[], price 0/0, attributes:{}
}
```
→ поэтому пустые **все** фильтры, хотя `total`, `price MIN/MAX`, `brand counts` по отдельности валидны.

## Фикс (1 строка, уже в рабочей копии)
`src/queries/categories.ts`, запрос buckets — типизировать параметры через `::float` (+ `NULLIF` от деления на ноль):

```diff
- LEAST(31, GREATEST(0, FLOOR(((p.price - ${absoluteMin}) / (${absoluteMax} - ${absoluteMin})) * 32)))::int as bucket,
+ LEAST(31, GREATEST(0, FLOOR(((p.price - ${absoluteMin}::float) / NULLIF(${absoluteMax}::float - ${absoluteMin}::float, 0)) * 32)))::int as bucket,
```

## Проверка (репро на проде-БД)
| Категория | total | price | buckets | brandCounts | allCategoryBrands |
|---|---|---|---|---|---|
| `elektryka` | 3816 | 1.5 – 82689 | 13 rows ✅ | 13 ✅ | 13 ✅ |
| `avtomatychni-vymykachi` | 250 | 35 – 2299 | 14 rows ✅ | 3 ✅ | 3 ✅ |

До фикса buckets → THROW; после — все запросы проходят, фасеты возвращаются реальные.

---

## ⚠️ ВАЖНО про деплой
Вся новая система фасетов (`getCategoryFacets`, `catalog-filter-config.ts`, `catalog-filter-url.ts`, новые компоненты `catalog-sidebar/category-tree-filter/catalog-toolbar/...`) **НЕ закоммичена и НЕ на GitHub**.
`origin/Project_Alpha_V1` (HEAD `dc02e26`) содержит **старый** `categories.ts` (177 строк) со статическим `getCategoryFilters` + `lib/catalog-data.ts`. Прод по GitHub крутит старую систему.

Чтобы фикс реально доехал на сайт:
1. закоммитить + запушить эту ветку работы (новые фасеты целиком), затем задеплоить; **или**
2. если деплой идёт через `npx vercel` из рабочей папки — этот `::float`-каст применить в той же папке и передеплоить.

`npm run dev` подхватит сразу после сохранения (HMR / рестарт).

---

## Вторичный таск (НЕ краш, отдельно): атрибутные под-фильтры пустые
Для `avtomatychni-vymykachi` конфиг (`catalog-filter-config.ts`) ждёт ключи `poles / rated_current / curve / breaking_capacity`, а в БД `products.attributes` реально лежат транслитерированные ключи:

| Нужно в конфиге | Реальный ключ в JSONB |
|---|---|
| `poles` | `kolychestvo_polyusov` |
| `rated_current` | `nominalnyy_robochyy_strum_ie_a` |
| `curve` | `kharakterystyka_vidklyuchennya` |
| `breaking_capacity` | `nominalna_vymykayucha_zdatnist_icn_ka` |

→ запрос атрибутных фасетов возвращает 0 строк. Решение: либо маппинг `config key → data key`, либо нормализация ключей атрибутов при импорте товаров. Бренд/цена/наличие работают независимо от этого.
