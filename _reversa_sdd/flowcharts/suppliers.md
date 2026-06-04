# Flowcharts — модуль `suppliers`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность: 🔴 рудиментарный.

## 1. Фактическое положение интеграции поставщиков

```mermaid
flowchart TD
  subgraph Внешние скрипты C:\робот (вне репо)
    A[asko_stock_sync.py и др.] --> DB[(SupplierInventory)]
  end
  DB -. нет runtime-кода в приложении .-> APP[Elektronom Next.js]
  APP -. сопоставление по sku .-> P[(Product)]

  subgraph Dev-скрипты в src/actions (не server actions)
    G[get-asko-products.ts<br/>return; → мёртвый код] -.запуск tsx.-> P
    AN[analyze-products.ts<br/>CSV → группы Google Ads] -.чтение CSV.-> SC[scratch/groups_*]
  end
```

## Примечания
- `SupplierInventory` наполняется извне; в этом репозитории нет server action для синка (SU-1).
- `get-asko-products.ts` содержит недостижимый код после `return;` (SU-2).
