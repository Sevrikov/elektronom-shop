# Задачи — модуль `admin`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-AD-1** RBAC-гейтинг всех действий/роутов.
  - Легаси: `actions/admin.ts` (`requireAdmin`), `api/admin/upload`. Готово: 401/403 маппинг. 🟢
- [ ] **T-AD-2** Товары: CRUD + bulk + транзакции.
  - Легаси: `admin.ts:saveProductAdmin/delete/.../bulk*`. Готово: $tx для save/delete; revalidate. 🟢
- [ ] **T-AD-3** Заказы: список/статус/заметки.
  - Легаси: `admin.ts:getOrdersAdmin/updateOrderStatus/Notes`. Готово: пагинация/фильтр; **добавить guard переходов статуса** (🔴). 🟡
- [ ] **T-AD-4** Категории/бренды: save.
  - Легаси: `admin.ts:saveCategory/Brand`. Готово: revalidate тегов. 🟢
- [ ] **T-AD-5** Модерация отзывов.
  - Легаси: `admin.ts:getReviews/toggleVisibility/delete`. Готово: revalidate `product-{slug}`. 🟢
- [ ] **T-AD-6** Загрузка изображений (POST/DELETE) с защитой.
  - Легаси: `api/admin/upload/route.ts`, `lib/storage.ts`. Готово: тип/размер; anti-traversal. 🟢
- [ ] **T-AD-7** Content Factory (запуск/статусы/результат).
  - Легаси: `admin.ts:launchContentFactory*`. Готово: fetch+token; конфиг URL без localhost-дефолта в проде. 🟡
- [ ] **T-AD-8** (Долг) Разбить god-файл; ввести MANAGER-доступ и аудит действий.
  - Легаси: `admin.ts`. Готово: модульность; `requireManager` для подмножества; модель аудита. 🔴
