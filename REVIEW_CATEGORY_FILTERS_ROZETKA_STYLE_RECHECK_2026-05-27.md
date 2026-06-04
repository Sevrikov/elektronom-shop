# Ревью реализации category filters / Rozetka-style category page

Дата: 2026-05-27  
Проверяемая задача: `TZ_CATEGORY_FILTERS_ROZETKA_STYLE_2026-05-26.md`  
Основная страница: `src/app/[locale]/(shop)/catalog/[slug]/page.tsx`

---

## Итог

Работа продвинулась существенно: появились URL helpers, конфиг фильтров по категориям, quick links, toolbar, mobile drawer, category tree, реальные category-wide facet counts и передача `attributes` в `getFilteredProducts()`.

TypeScript проверка проходит:

```text
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit" -> exit 0
```

Но принимать как полностью готовое пока нельзя: `npm run lint` падает, а в UI есть дублирование toolbar/sort/view, из-за которого категория будет выглядеть перегруженной и часть кнопок будет не связана с реальным состоянием выдачи.

---

## Finding 1 — P1: `npm run lint` падает, отчёт “всё чисто” неверен

Команда:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run lint"
```

Результат:

```text
2 errors, 13 warnings
```

Блокирующие ошибки:

```text
src/app/[locale]/(shop)/catalog/[slug]/page.tsx:219
Do not pass children as props. Instead, nest children between the opening and closing tags

src/components/shared/transparent-image.tsx:7
Unexpected any. Specify a different type
```

### Как исправить

1. В `CategoryTreeFilter` переименовать prop `children` в `childCategories` или `items`.

Сейчас:

```tsx
<CategoryTreeFilter
  currentSlug={slug}
  parent={category.parent ?? null}
  children={category.children}
  locale={locale as Locale}
/>
```

Нужно:

```tsx
<CategoryTreeFilter
  currentSlug={slug}
  parent={category.parent ?? null}
  childCategories={category.children}
  locale={locale as Locale}
/>
```

2. В `transparent-image.tsx` убрать `any`:

```ts
src?: string | StaticImageData
```

или, если StaticImageData недоступен:

```ts
src?: string | { src: string }
```

И привести `imgSrc` безопасно:

```ts
const imgSrc = typeof src === 'string' ? src : src?.src ?? ''
```

---

## Finding 2 — P1: На странице категории теперь два toolbar/sort/view блока

Файлы:

- `src/app/[locale]/(shop)/catalog/[slug]/page.tsx`
- `src/components/catalog/catalog-toolbar.tsx`
- `src/components/catalog/product-grid.tsx`

На странице рендерится новый `CatalogToolbar`, но внутри `ProductGrid` остался старый toolbar:

```tsx
<CatalogToolbar ... />
...
<ProductGrid ... />
```

А `ProductGrid` внутри себя всё ещё содержит:

- found count;
- sort dropdown;
- grid/list toggle;
- собственный `view` state.

Итого пользователь может увидеть две сортировки, два found count и два переключателя вида.

### Почему это плохо

Новый `CatalogToolbar` имеет свой `view` state, но этот state не передаётся в `ProductGrid`. Поэтому grid/list кнопки в новом toolbar визуально переключаются, но фактический layout товаров не меняют.

### Как исправить

Выбрать один источник управления:

Вариант A, предпочтительный:

- оставить `CatalogToolbar` как единственный toolbar;
- убрать toolbar/sort/view из `ProductGrid`;
- передавать `view` из `CatalogToolbar` в `ProductGrid` через URL (`view=grid|list`) или общий client wrapper.

Вариант B:

- удалить `CatalogToolbar`;
- оставить управление в `ProductGrid`;
- mobile drawer тогда нужно вынести отдельно.

Для ТЗ лучше вариант A.

---

## Finding 3 — P1: Quick link `4 л` не совпадает с реальным значением атрибута

Файл:

`src/lib/catalog-filter-config.ts`

Сейчас:

```ts
{ label: { uk: '4 л', ru: '4 л' }, filter: { key: 'volume', value: '4' } }
```

Но в seed для масел:

```ts
attributes: { volume: "4L" }
```

Результат: quick link `4 л` ведёт на URL с `volume=4`, а товары имеют `volume=4L`, поэтому выдача может стать пустой.

### Как исправить

Использовать фактическое значение:

```ts
filter: { key: 'volume', value: '4L' }
```

И отдельно отображать label как `4 л`.

Также проверить все quick links на совпадение с реальными slug/value:

- `brand` должен совпадать с `Brand.slug`;
- атрибуты должны совпадать с `Product.attributes`;
- не добавлять quick links, которые гарантированно дают 0 товаров, кроме случаев специальных SEO landing pages.

---

## Finding 4 — P2: В page.tsx рендерится лишний `MobileFilterDrawer`

Файл:

`src/app/[locale]/(shop)/catalog/[slug]/page.tsx`

Внизу страницы есть:

```tsx
<MobileFilterDrawer
  filters={filters}
  activeFilters={activeFilters}
  ...
/>
```

Но `CatalogToolbar` уже сам рендерит `MobileFilterDrawer` и управляет `isOpen`.

Текущий drawer в `page.tsx` получает `isOpen` по умолчанию `false` и всегда возвращает `null`. Это не ломает UI, но это мёртвый дубликат и источник путаницы.

### Как исправить

Удалить нижний `MobileFilterDrawer` из `page.tsx`, если drawer управляется внутри `CatalogToolbar`.

---

## Finding 5 — P2: Inline styles остались в затронутых catalog-компонентах

Файлы:

- `src/components/catalog/catalog-filters.tsx`
- `src/components/catalog/product-grid.tsx`

Примеры:

```tsx
style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 200ms' }}
style={{ color: 'var(--color-text-muted)' }}
style={{ border: '1px solid var(--color-border)' }}
```

По правилам проекта Tailwind v4:

```text
NO inline styles. Use Tailwind classes / theme tokens.
```

### Как исправить

Заменить на классы:

```tsx
className={cn('transition-opacity', isPending && 'opacity-50')}
className="text-text-muted"
className="border border-border"
```

---

## Finding 6 — P2: Category tree пока без counts

ТЗ требовало показывать counts у подкатегорий. Новый `CategoryTreeFilter` показывает parent/current/children, но без количества товаров.

Это можно принять как MVP, но если ориентируемся на Rozetka-style category navigation, counts стоит добавить:

```text
Розетки (123)
Вимикачі (87)
Рамки (41)
```

---

## Что подтверждено

Подтверждено:

- `npx tsc --noEmit` проходит;
- `attributes` теперь передаются в `getFilteredProducts()`;
- `getFilteredProducts()` строит JSONB conditions по логике AND между ключами и OR внутри ключа;
- `getCategoryFilters()` считает counts по брендам и JSONB-атрибутам;
- `catalog-filter-url.ts` вынес parse/build/toggle/remove logic;
- i18n keys `foundCount`, `showProducts`, `filters.title`, `close`, `view` добавлены для UK/RU;
- basic SEO canonical добавлен на category page.

---

## Что нужно сделать перед приёмкой

Минимальный список:

1. Исправить lint errors.
2. Убрать дублирование toolbar/sort/view.
3. Связать view switcher с реальным layout или временно убрать его из нового toolbar.
4. Исправить quick link `volume=4` на `volume=4L`.
5. Удалить лишний закрытый `MobileFilterDrawer` из page.
6. Почистить warnings хотя бы в новых catalog-файлах.
7. Повторить:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

После этого можно делать browser smoke test.

