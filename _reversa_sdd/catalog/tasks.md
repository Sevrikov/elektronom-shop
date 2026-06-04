# Задачи (реимплементация) — модуль `catalog`

> SDD (Writer, `completo`) · Reversa. Каждая задача: источник в легаси + критерий готовности + уверенность.

- [ ] **T-CAT-1** Тип `ActiveFilters` + парсинг/сборка URL.
  - Легаси: `lib/catalog-filter-url.ts`.
  - Готово: round-trip URL↔filters стабилен; нормализация цены; сброс page; whitelist sort. 🟢
- [ ] **T-CAT-2** Запросы категорий и дерево.
  - Легаси: `queries/categories.ts` (`getCategories`, `getCategoryBySlug`, `getCategoryTree`).
  - Готово: дерево из плоского списка; кэш `hours`+теги. 🟢
- [ ] **T-CAT-3** SQL-фильтр товаров по JSONB + бренд/цена/наличие.
  - Легаси: `queries/products.ts` (`buildProductWhere`, `buildAttributeWhere`, `getFilteredProducts`).
  - Готово: AND ключей/OR значений; пагинация+сортировка; only `isActive`. 🟢
- [ ] **T-CAT-4** Реактивные фасеты + гистограмма.
  - Легаси: `queries/categories.ts` (`getCategoryFacets`, `getCategoryProductsForFacets`).
  - Готово: счётчики с `excludeKey`; `disabled` логика; 32 бакета; **синхронность с T-CAT-3** (закрыть C-2). 🟡
- [ ] **T-CAT-5** Конфиг фильтров категории (единый источник — устранить дублирование).
  - Легаси: `lib/catalog-filter-config.ts` + `lib/catalog-data.ts`.
  - Готово: один источник конфигурации; лейблы uk/ru, единицы, quickLinks. 🟡 (C-3)
- [ ] **T-CAT-6** UI: сайдбар фильтров, листинг, пагинация, мегаменю.
  - Легаси: `components/catalog/*`, `config/catalog-mega-menu.ts`.
  - Готово: чекбоксы/пилюли/диапазон/поиск-в-группе; чипы активных фильтров. 🟢
- [ ] **T-CAT-7** (Долг) Перенос фасет-агрегации в SQL/Algolia при росте каталога.
  - Легаси: комментарий в `getCategoryProductsForFacets`.
  - Готово: снят 50k-лимит. 🔴
