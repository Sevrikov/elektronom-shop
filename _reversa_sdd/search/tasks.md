# Задачи — модуль `search`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-SE-1** Клиенты Algolia (public/admin) с graceful-null.
  - Легаси: `lib/algolia.ts`. Готово: null при отсутствии env. 🟢
- [ ] **T-SE-2** Поиск с fallback на Prisma.
  - Легаси: `actions/search.ts:searchProducts`, `queries/search.ts`. Готово: индекс `products_{locale}`; деградация. 🟢
- [ ] **T-SE-3** Синхронизация индекса (upsert/delete по uk+ru).
  - Легаси: `actions/search.ts:syncProductIndex/removeProductFromIndex`. Готово: inactive→delete, иначе upsert. 🟢
- [ ] **T-SE-4** (Долг) Команда полной переиндексации.
  - Легаси: отсутствует. Готово: bulk reindex всех активных товаров. 🔴
- [ ] **T-SE-5** Гарантировать вызов sync при каждом изменении товара (catalog/admin).
  - Легаси: связка с `admin.ts`. Готово: индекс не дрейфует. 🟡
