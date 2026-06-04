# Требования — модуль `search`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
Полнотекстовый поиск товаров через Algolia с деградацией на Prisma; синхронизация индекса.

## Функциональные требования (MoSCoW)
### Must
- **FR-SE-1** 🟢 `searchProducts(query, locale)`: индекс `products_{locale}`, 12 результатов.
- **FR-SE-2** 🟢 **Fallback на Prisma** (`searchProductsFallback`) при отсутствии клиента или ошибке.
- **FR-SE-3** 🟢 Синхронизация индекса: `syncProductIndex` (upsert в uk+ru; delete если `!isActive`), `removeProductFromIndex`.
### Should
- **FR-SE-4** 🟢 Два клиента: публичный (поиск) и admin (синхронизация); оба null при отсутствии env.
### Won't (текущее)
- **FR-SE-5** 🔴 Полная переиндексация (bulk reindex command).

## НФТ
- **NFR-SE-1 (Availability)** 🟢 Грациозная деградация на БД.
- **NFR-SE-2 (Consistency)** 🟡 Зависит от вызова sync на каждое изменение товара.

## Критерии приёмки
**AC-SE-1 (happy)** 🟢 Дано: Algolia настроен; Когда: поиск; Тогда: до 12 хитов из `products_{locale}`.
**AC-SE-2 (деградация)** 🟢 Дано: Algolia недоступен/не настроен; Тогда: результаты из Prisma.
**AC-SE-3 (деактивация)** 🟢 Дано: товар `isActive=false`; Когда: sync; Тогда: удалён из обоих индексов.

## Зависимости
`catalog` (товары), `core-infra`.

## Лакуны 🔴
Нет полной переиндексации (SE-2); `categoryName=slug` в fallback (SE-3); дрейф индекса при пропуске sync (SE-4).
