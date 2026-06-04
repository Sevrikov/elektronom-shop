# Требования — модуль `suppliers`

> SDD (Writer, `completo`, hybrid) · Reversa. 🔴 преимущественно рудиментарный.

## Назначение (заявленное)
Интеграция остатков/цен поставщиков (ASKO) через `SupplierInventory`, сопоставление по `sku` с `Product`.

## Фактическое состояние
- 🔴 `SupplierInventory` **не используется** в рантайме приложения (нет server action/запроса). Наполнение — внешними скриптами (`C:\робот`).
- 🔴 `actions/get-asko-products.ts` — dev-скрипт с мёртвым кодом после `return;`.
- 🟡 `actions/analyze-products.ts` — скрипт построения групп Google Ads (CSV→25 групп), хардкод-пути.

## Функциональные требования (целевые, MoSCoW)
### Should (если фичу доводить)
- **FR-SU-1** 🔴 Синхронизация остатков/цен поставщика в `SupplierInventory` (server action/cron).
- **FR-SU-2** 🔴 Сопоставление `SupplierInventory.sku ↔ Product.sku`, обновление `stock`/`price`.
### Won't (текущее)
- **FR-SU-3** 🔴 Любая рантайм-логика поставщиков в этом репозитории отсутствует.

## Критерии приёмки (целевые)
**AC-SU-1** 🔴 Дано: фид ASKO; Когда: sync; Тогда: `SupplierInventory` обновлён, сопоставленные `Product.stock/price` синхронизированы.

## Зависимости
`core-infra`; внешние процессы (`asko_stock_sync.py`).

## Лакуны 🔴
Перенести синк в приложение (SU-1); убрать dev-скрипты из `src/actions/` (SU-2/SU-3).
