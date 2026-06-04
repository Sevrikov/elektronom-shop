# Дизайн — модуль `suppliers`

> SDD (Writer, `completo`) · Reversa. 🔴 рудиментарный.

## Файлы (фактические)
- `prisma/schema.prisma` — модель `SupplierInventory` (`sku @unique`, `mpn`, `supplierSku`, `name`, `stock`, `price`, `supplierName`).
- `actions/get-asko-products.ts` — tsx-скрипт (мёртвый код после `return;`).
- `actions/analyze-products.ts` — Google Ads скрипт (CSV→группы, хардкод-пути, пишет в `scratch/`).

## Фактическая интеграция (см. `flowcharts/suppliers.md`)
`SupplierInventory` наполняется **извне** (Python-скрипты `C:\робот`), связь с `Product` по `sku` на уровне внешних процессов. В приложении кода синка нет.

## Целевой дизайн (если доводить)
Server action/route `syncSupplierInventory(supplier)`: получить фид → upsert `SupplierInventory` по `sku` → опционально обновить `Product.stock/price` по совпадению `sku`.

## Решения
Сейчас — намеренный вынос синка вовне (робот-экосистема). Рекомендация: легитимизировать как интеграцию или удалить модель/скрипты.

## Риски
🔴 SU-1 нет рантайма; 🔴 SU-2 мёртвый код; 🟡 SU-3 неуместные скрипты в actions/.
