# Задачи — модуль `suppliers`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-SU-1** (Решение) Определить судьбу модуля: легитимная интеграция или удаление.
  - Легаси: `SupplierInventory`, внешние скрипты. Готово: принято решение (см. `domain.md` лакуна #5). 🔴
- [ ] **T-SU-2** (Если доводить) Server action синхронизации остатков/цен поставщика.
  - Легаси: внешний `asko_stock_sync.py`. Готово: upsert `SupplierInventory`, маппинг на `Product` по `sku`. 🔴
- [ ] **T-SU-3** (Гигиена) Удалить/перенести dev-скрипты из `src/actions/`.
  - Легаси: `get-asko-products.ts` (мёртвый код), `analyze-products.ts` (Ads-скрипт). Готово: `src/actions/` содержит только `'use server'` экшены. 🟡
