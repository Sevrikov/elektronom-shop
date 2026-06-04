# C4 — Уровень 3: Компоненты (внутри Web-приложения)

> Артефакт **Architect** (`completo`) · Mermaid · 🟢.

```mermaid
flowchart TB
  subgraph pages[Страницы RSC — app/[locale]]
    pCat[catalog/[slug]]
    pProd[product/[slug]]
    pCart[cart / checkout]
    pAcc[account/*]
    pAsst[assistant]
    pAdmin[admin]
  end

  subgraph actions[Server Actions — actions/*]
    aCart[cart.ts]
    aOrder[order.ts]
    aUser[user.ts]
    aAuth[auth.ts]
    aSearch[search.ts]
    aAdmin[admin.ts]
  end

  subgraph queries[Запросы — queries/* ('use cache')]
    qProd[products.ts]
    qCat[categories.ts]
    qOrd[orders.ts]
    qBrand[brands.ts]
  end

  subgraph lib[Домен/инфра — lib/*]
    lAuth[auth.ts + RBAC]
    lCatalog[catalog-filter-*, catalog-data]
    lAssist[assistant/claude.ts]
    lAlgolia[algolia.ts]
    lStorage[storage.ts]
    lPrisma[prisma.ts]
    lEnv[env.ts]
  end

  db[(PostgreSQL)]

  pCat --> qProd & qCat & lCatalog
  pProd --> qProd
  pProd --> aUser
  pCart --> aCart & aOrder
  pAcc --> aUser & qOrd
  pAsst --> lAssist
  pAdmin --> aAdmin
  aOrder --> lPrisma
  aCart --> lPrisma
  aSearch --> lAlgolia
  aAdmin --> lStorage & lAlgolia & lPrisma
  lAssist --> lPrisma
  qProd & qCat & qOrd & qBrand --> lPrisma
  lAuth --> lPrisma
  lPrisma --> db
  lib --> lEnv
```

## Ключевые компоненты и ответственность

| Компонент | Ответственность | Заметки |
|-----------|-----------------|---------|
| `queries/products.ts` | Чтение товаров, **SQL-фильтр JSONB** | facet-where, `buildProductWhere` |
| `queries/categories.ts` | Категории, дерево, **in-memory фасеты** | 50k-лимит (C-1) |
| `lib/catalog-filter-url.ts` | URL↔состояние фильтров | каноничные URL |
| `actions/order.ts` | Оформление заказа | транзакция, идемпотентность |
| `actions/cart.ts` | Корзина гость/БД + merge | httpOnly cookie |
| `lib/assistant/claude.ts` | LLM-интеграция + регидратация | keyword-RAG |
| `lib/auth.ts` | NextAuth + RBAC-хелперы | JWT |
| `actions/admin.ts` | Админ-операции (god-файл) | requireAdmin |
| `lib/storage.ts` | Загрузка/удаление изображений | Cloudinary/local, anti-traversal |
| `lib/prisma.ts` | Singleton-клиент БД | adapter-pg |
