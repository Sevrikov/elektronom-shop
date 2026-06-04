# Требования — модуль `admin`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
Админ-панель: CRUD товаров/категорий/брендов, заказы, модерация отзывов, загрузка изображений, Content Factory.

## Функциональные требования (MoSCoW)
### Must
- **FR-AD-1** 🟢 Все действия под `requireAdmin()`.
- **FR-AD-2** 🟢 Товары: список/статистика, save (транзакция), toggle active, update stock, delete (транзакция), duplicate, bulk-операции.
- **FR-AD-3** 🟢 Заказы: список (пагинация/фильтр статуса), смена статуса, заметки.
- **FR-AD-4** 🟢 Категории/бренды: save.
- **FR-AD-5** 🟢 Модерация отзывов: список (фильтр `isVisible`), toggle visibility, delete.
- **FR-AD-6** 🟢 Загрузка изображений: POST (тип jpeg/png/webp/avif, ≤10МБ), DELETE (защита path traversal).
### Should
- **FR-AD-7** 🟢 Content Factory: запуск/статусы/результат (внешний сервис).
- **FR-AD-8** 🟢 Гранулярная инвалидация кэша (`revalidateTag`).
### Won't (текущее)
- **FR-AD-9** 🔴 Аудит действий админа; доступ для MANAGER.

## НФТ
- **NFR-AD-1 (Security)** 🟢 RBAC на всех точках; валидация загрузок; маппинг 401/403.
- **NFR-AD-2 (Consistency)** 🟢 Транзакции для save/delete товара.
- **NFR-AD-3 (Coupling)** 🟡 Content Factory default `127.0.0.1:8028`.

## Критерии приёмки
**AC-AD-1 (RBAC, fail)** 🟢 Дано: не-ADMIN; Тогда: FORBIDDEN/403.
**AC-AD-2 (upload, happy)** 🟢 Дано: webp ≤10МБ; Тогда: загружено (Cloudinary/local), вернётся image-результат.
**AC-AD-3 (upload traversal, fail)** 🟢 Дано: DELETE local url с `..`; Тогда: 400/403.
**AC-AD-4 (модерация)** 🟢 Дано: скрытый отзыв; Когда: toggle; Тогда: `isVisible=true`, revalidate `product-{slug}`.

## Зависимости
Все домены + `core-infra`, `search` (sync), `storage`.

## Лакуны 🔴
Аудит (permissions), MANAGER не задействован (AD-5), god-файл (AD-6), CF localhost (AD-4).
