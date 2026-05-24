# Ревью реализации нижних блоков Product Page

Дата проверки: 2026-05-22  
Проект: `C:\Users\sevri\Сайт\elektronom`  
Проверяемое ТЗ: `docs/tz/TZ_PRODUCT_PAGE_LOWER_BLOCKS_REWORK.md`

## Итоговый статус

Статус: **не принимать как завершенную реализацию**.

Разработчик действительно добавил новые компоненты и часть функциональности:

- `src/components/product/same-series-products.tsx`
- `src/components/product/product-reviews.tsx`
- `src/components/product/related-products-section.tsx`
- доработан `src/components/product/product-gallery.tsx`
- добавлен `getSameSeriesProducts` в `src/queries/products.ts`
- product page подключает `ProductReviews`, `SameSeriesProducts`, `RelatedProductsSection`
- `npm run lint`, `npx tsc --noEmit`, `npx prisma validate`, `npm run build` проходят

Но есть блокирующие замечания по содержанию и приемке.

## Проверенные команды

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Результат:

- `npm run lint` - pass.
- `npx tsc --noEmit` - pass.
- `npx prisma validate` - pass.
- `npm run build` - pass.

Важно: `scratch/**` теперь исключен в `eslint.config.mjs`, поэтому старые `scratch/fetch.js` и `scratch/parse.js` больше не влияют на lint.

## Findings

### P0 - Seed-отзывы включаются на production Vercel

Файл: `src/components/product/product-reviews.tsx:76`

Текущая логика:

```ts
window.location.hostname.includes('localhost') ||
window.location.hostname.includes('vercel.app')
```

Это означает, что seed-отзывы будут показаны на `elektronom.vercel.app`, то есть на production Vercel-домене, если реальных отзывов нет.

Это нарушает ТЗ:

- seed-отзывы допустимы только для local/staging/dev/visual acceptance;
- production не должен показывать фейковые отзывы под видом реальных покупателей.

Что исправить:

1. Убрать `hostname.includes('vercel.app')` как критерий staging.
2. Использовать явный env flag, например:

```env
NEXT_PUBLIC_ENABLE_REVIEW_SEEDS=true
```

3. Включать seed только если:

```ts
process.env.NEXT_PUBLIC_ENABLE_REVIEW_SEEDS === 'true'
```

4. На production этот flag должен быть `false` или отсутствовать.
5. Визуально можно показывать seed на staging, но в отчете явно указывать, что это staging seed data.

### P0 - Пользовательские тексты повреждены mojibake

Файлы:

- `src/components/product/product-reviews.tsx`
- `src/components/product/same-series-products.tsx`
- `src/components/product/related-products-section.tsx`
- `src/components/product/product-gallery.tsx`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`
- `src/actions/cart.ts`

Примеры:

```text
РћС‚Р·С‹РІС‹ РїРѕРєСѓРїР°С‚РµР»РµР№
Р’С–РґРіСѓРєРё РїРѕРєСѓРїС†С–РІ
Р”СЂСѓРіРёРµ С‚РѕРІР°СЂС‹ СЌС‚РѕР№ СЃРµСЂРёРё
РЎСѓРїСѓС‚РЅС– С‚РѕРІР°СЂРё
РџРѕРїРµСЂРµРґРЅС” С„РѕС‚Рѕ
```

Это не косметика. Такие строки попадут пользователю в UI, aria-label, ошибки server actions, отзывы и SEO. Страница не может быть принята с поврежденной кодировкой.

Что исправить:

1. Заменить все mojibake-строки на нормальные украинские/русские тексты.
2. Перенести UI-тексты в `src/i18n/messages/uk.json` и `src/i18n/messages/ru.json`, где это уместно.
3. Проверить:

```powershell
rg -n "Рџ|Рќ|Р”|Рљ|Рћ|Р’ РЅ|Р†|РЎ|Р—" src/app src/components src/actions src/i18n --glob "!src/generated/**"
```

4. Ложные срабатывания объяснить в отчете. Для пользовательского UI ложных срабатываний быть не должно.

### P1 - Inline styles всё еще есть в UI страницы товара и reviews

Файлы:

- `src/app/[locale]/(shop)/product/[slug]/page.tsx:103`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:107`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:108`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:111`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:114`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:120`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:123`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:126`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx:131`
- `src/components/product/product-reviews.tsx:200`

Примеры:

```tsx
style={{ border: '1px solid var(--color-border)' }}
style={{ background: 'var(--color-surface-alt)', borderBottom: '1px solid var(--color-border)' }}
style={{ width: `${row.percentage}%` }}
```

ТЗ требовало убрать inline styles из UI. Для progress bar можно сделать безопаснее через CSS variable/class или ограниченный inline style, но это должно быть осознанным исключением и описано. В текущем виде строк слишком много, особенно в `QtyBreaksTable`.

Что исправить:

1. Переписать `QtyBreaksTable` на Tailwind classes.
2. Для rating bars использовать CSS variable или data attribute/class approach.
3. Убрать prop `style?: React.CSSProperties` из `AddToCartButton`, если он больше не нужен.
4. Повторить:

```powershell
rg -n "style=\{|style=" "src/app/[locale]/(shop)/product/[slug]/page.tsx" src/components/product src/components/cart
```

### P1 - Walkthrough artifact и скриншоты не найдены

Разработчик ссылается на:

```text
product_page_rework_walkthrough.md
quantity_initial_1779456299407.png
quantity_updated_1779456483800.png
bottom_details_1779454813238.png
```

Но в рабочей папке эти файлы не найдены:

```powershell
rg --files | rg "product_page_rework_walkthrough|quantity_initial|quantity_updated|bottom_details"
```

Результат: найдено только исходные компоненты, artifact отсутствует.

Что исправить:

1. Добавить walkthrough report в проект, например:

```text
docs/reports/product_page_rework_walkthrough.md
docs/reports/screenshots/...
```

2. В отчете указать реальные пути к скриншотам.
3. Приложить desktop/mobile скриншоты:
   - same-series block;
   - reviews block;
   - related products;
   - gallery lightbox;
   - quantity initial/updated.

### P1 - Mock review submission может вводить в заблуждение

Файл: `src/components/product/product-reviews.tsx`

Кнопка `Написати відгук` открывает форму, пользователь заполняет отзыв, затем получает сообщение об отправке на модерацию. Но фактически нет server action, сохранения и модерации.

Это допустимо только как явно помеченная UI-заглушка, но сейчас UI выглядит как настоящая отправка.

Что исправить:

Вариант A, если форма не входит в этап:

- сделать кнопку неактивной или показывать честное сообщение:

```text
Форма відгуків буде доступна після запуску особистого кабінету.
```

Вариант B, если форма входит в этап:

- добавить server action;
- Zod validation;
- запись в БД;
- moderation status;
- защиту от спама;
- привязку к user/order, если нужен `Підтверджена покупка`.

### P1 - Verified badge показывается для всех отзывов без основания

Файл: `src/components/product/product-reviews.tsx`

Сейчас `Підтверджена покупка` показывается каждому отзыву. Для seed/staging это допустимо только если явно отмечено как demo, но для реальных отзывов badge должен зависеть от данных.

Что исправить:

1. Добавить поле `verifiedPurchase?: boolean`.
2. Показывать badge только если `verifiedPurchase === true`.
3. Для seed-отзывов можно выставить часть отзывов verified, часть без badge.

### P2 - `SameSeriesProducts` пока не использует attributes

Файл: `src/queries/products.ts:266`

Функция принимает `attributes`, но фактически не использует их. Логика сейчас:

1. same category + same brand;
2. fallback same category.

Это может показывать не “товары той же серии”, а просто товары бренда/категории.

Что исправить:

1. Использовать ключевые атрибуты серии/модели, если они есть.
2. Если явной серии нет, переименовать блок во что-то честнее:

```text
Інші товари бренду
Схожі товари категорії
```

3. Не обещать “тієї ж серії”, если серия не определена.

### P2 - Gallery улучшена, но active thumbnail auto-scroll не подтвержден

Файл: `src/components/product/product-gallery.tsx`

Подтверждено:

- lightbox;
- backdrop close;
- ESC/ArrowLeft/ArrowRight;
- touch swipe;
- counter;
- horizontal thumbnails.

Не подтверждено в коде:

- active thumbnail автоматически прокручивается в видимую область при смене стрелками;
- отдельные стрелки/scroll controls для thumbnail strip.

Это не блокер, но по ТЗ стоит доделать или явно указать как ограничение.

## Что подтверждено как сделанное

1. 3-компонентная нижняя структура появилась.
2. Same-series block подключен в правую колонку product page.
3. Reviews block содержит rating summary, breakdown, filters, modal.
4. Related products section использует `ProductCard` и сетку 2/3/4.
5. Gallery получила lightbox, arrows, ESC, touch swipe.
6. Quantity stepper в `AddToCartButton` передает выбранное `quantity` в `addToCart`.
7. Server action `addToCart` учитывает `quantity` и ограничивает по stock.
8. Основные команды проходят.

## Приемочный вывод

Текущую реализацию нельзя принимать как финальную, несмотря на зеленые команды.

Перед повторной приемкой обязательно:

1. Убрать seed-отзывы с production Vercel через явный env flag.
2. Исправить mojibake во всех пользовательских строках.
3. Убрать inline styles из UI product page/reviews или документировать точечные исключения.
4. Добавить отсутствующий walkthrough report и скриншоты.
5. Сделать mock review submission честной заглушкой или полноценной server-side функцией.
6. Показывать `Підтверджена покупка` только при наличии данных.
7. Уточнить/исправить логику same-series, чтобы блок не вводил в заблуждение.

После исправления повторить:

```powershell
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
rg -n "style=\{|style=" "src/app/[locale]/(shop)/product/[slug]/page.tsx" src/components/product src/components/cart
rg -n "Рџ|Рќ|Р”|Рљ|Рћ|Р’ РЅ|Р†|РЎ|Р—" src/app src/components src/actions src/i18n --glob "!src/generated/**"
```
