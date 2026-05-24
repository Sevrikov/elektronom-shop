# REVIEW REPORT: Product Page Production Recheck

Дата проверки: 2026-05-22  
Проект: Elektronom  
Проверяемый URL: https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l  
Контекст: повторная проверка после отчета разработчика о production-деплое страницы товара, галереи, отзывов, блока "Інші товари тієї ж серії" и "Супутні товари".

## Краткий вывод

Production-страница действительно отдается с кодом 200, а основные секции страницы товара появились в HTML: карточка товара, блок характеристик, описание, "Інші товари тієї ж серії" и "Супутні товари".

Но принимать задачу как полностью закрытую пока нельзя. В коде остались критичные приемочные проблемы: мок-отзывы включаются на домене `vercel.app`, форма отзыва имитирует отправку без сохранения, SEO/JSON-LD на production содержит `localhost:3000`, хлебные крошки строятся с дублем локали `/uk/uk`, а часть стилей нарушает действующий протокол проекта `AGENTS.md` / Tailwind v4.

Дополнение после проверки HTML, присланного владельцем: видимый украинский текст отзывов и UI в production HTML отображается нормально. Предыдущее подозрение на mojibake в `product-reviews.tsx` было перепроверено через чтение файла как UTF-8 в Node.js и не подтверждено. Пункт про поврежденную кодировку снят.

## Что подтверждено

1. Live URL доступен:
   - `https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l`
   - HTTP status: `200`.

2. На production HTML присутствуют секции:
   - основная карточка товара;
   - характеристики;
   - описание продукта;
   - `Інші товари тієї ж серії`;
   - `Супутні товари`.

3. По исходному коду галерея действительно получила расширенную интерактивность:
   - открытие lightbox;
   - закрытие через `Escape`;
   - навигация `ArrowLeft` / `ArrowRight`;
   - touch swipe;
   - `aria-modal="true"`;
   - блокировка scroll body при открытом lightbox.

4. Блоки для страницы товара добавлены в код:
   - `src/components/product/product-reviews.tsx`;
   - `src/components/product/same-series-products.tsx`;
   - `src/components/product/related-products-section.tsx`;
   - `src/components/product/product-gallery.tsx`;
   - `getSameSeriesProducts()` в `src/queries/products.ts`.

## Findings

### P0. Мок-отзывы включаются на production-домене Vercel

Файл: `src/components/product/product-reviews.tsx`  
Строки: 75-79

```ts
const isDevOrStaging = typeof window !== 'undefined' && 
  (window.location.hostname.includes('localhost') || 
   window.location.hostname.includes('vercel.app'))

const reviews = (initialReviews.length === 0 && mounted && isDevOrStaging) ? SEED_REVIEWS : initialReviews
```

Проблема: `elektronom.vercel.app` является текущим production URL, но логика считает любой `vercel.app` staging/dev окружением. Если в базе нет реальных отзывов, клиентская гидрация покажет синтетические отзывы на production.

Почему это критично:
- на публичном сайте появляются несуществующие отзывы;
- это юридический и репутационный риск;
- пользователь видит рейтинг/отзывы, которые не подтверждены заказами.

Как исправить:
- полностью убрать `vercel.app` из условия;
- разрешать seed-отзывы только через явный флаг окружения, например `NEXT_PUBLIC_ENABLE_REVIEW_SEEDS === 'true'`;
- на production этот флаг должен быть отсутствующим или `false`;
- лучше не хранить seed-отзывы внутри production-компонента, а вынести их в dev-only fixture.

Ожидаемый критерий приемки:
- на `elektronom.vercel.app` при `initialReviews=[]` блок отзывов показывает честное пустое состояние;
- синтетические отзывы доступны только локально или на отдельном preview/staging окружении с явным флагом.

### P0. Production SEO/JSON-LD содержит `localhost:3000`

Файлы:
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`, строки 62-81;
- `src/components/product/product-schema.tsx`, строки 23-57.

В присланном production HTML присутствуют:

```html
<link rel="canonical" href="http://localhost:3000/uk/product/castrol-edge-5w30-4l"/>
<meta property="og:url" content="http://localhost:3000/uk/product/castrol-edge-5w30-4l"/>
```

И JSON-LD Product:

```json
"url":"http://localhost:3000/uk/product/castrol-edge-5w30-4l"
```

Проблема: production-страница публично сообщает поисковым системам, соцсетям и rich snippets, что канонический URL товара находится на `localhost:3000`.

Почему это критично:
- поисковики получают неправильный canonical;
- OpenGraph/Twitter preview ведут на localhost;
- Schema.org Offer URL некорректен;
- это ломает SEO-приемку staging/production.

Как исправить:
- на Vercel production установить `NEXT_PUBLIC_SITE_URL=https://elektronom.vercel.app` или будущий реальный домен;
- лучше завести server-only `SITE_URL` для metadata/JSON-LD, чтобы не зависеть от публичной client env;
- добавить проверку в acceptance checklist: production HTML не должен содержать `localhost`.

```powershell
rg -n "localhost:3000|http://localhost" .next src
```

Ожидаемый критерий приемки:
- canonical, hreflang, OpenGraph и JSON-LD Product Offer URL используют production-домен;
- в HTML страницы товара нет `localhost:3000`.

### P0. Breadcrumb URL строится с дублем локали `/uk/uk`

Файл: `src/components/layout/breadcrumbs.tsx`  
Строки: 18, 48

```ts
item: `https://elektronom.com.ua/${locale}${item.url}`
href={`/${locale}${item.url}`}
```

В присланном HTML:

```html
href="/uk/uk"
href="/uk/uk/catalog"
href="/uk/uk/catalog/motornye-masla"
```

И JSON-LD BreadcrumbList:

```json
"item":"https://elektronom.com.ua/uk/uk"
```

Проблема: `item.url` уже приходит с локалью либо формируется как локализованный путь, а компонент повторно добавляет `/${locale}`.

Как исправить:
- нормализовать контракт `BreadcrumbItem.url`: он должен быть либо всегда без локали, либо всегда готовым href;
- в компоненте не добавлять locale повторно, если `item.url` уже начинается с `/${locale}`;
- использовать единый helper `localizedHref(locale, path)`.

Ожидаемый критерий приемки:
- хлебные крошки ведут на `/uk`, `/uk/catalog`, `/uk/catalog/...`;
- JSON-LD BreadcrumbList не содержит `/uk/uk` или `/ru/ru`.

### P1. Форма "Написати відгук" имитирует отправку, но не сохраняет отзыв

Файл: `src/components/product/product-reviews.tsx`  
Строки: 81-88, 110-117

Проблема: форма отзыва является client-only mock. Она показывает success state, но не отправляет данные в БД, не проходит модерацию, не привязана к пользователю/заказу и не создает реальный отзыв.

Почему это важно:
- тестировщик и владелец сайта могут подумать, что отзывы уже работают;
- пользователь на production может получить ложное подтверждение отправки;
- нет защиты от спама, XSS, повторных отправок и фейковых отзывов.

Как исправить:
- либо временно скрыть кнопку "Написати відгук" на production до реализации backend;
- либо реализовать полноценный Server Action / Route Handler:
  - Zod-валидация;
  - авторизация пользователя;
  - проверка покупки товара, если нужен бейдж "Підтверджена покупка";
  - статус `pending` для модерации;
  - сохранение в БД;
  - защита от повторов/спама.

Ожидаемый критерий приемки:
- если backend отзывов не готов, production не показывает фальшивый success;
- если backend готов, отзыв реально появляется в БД со статусом модерации.

### P1. Бейдж "Підтверджена покупка" показывается всем отзывам без проверки

Файл: `src/components/product/product-reviews.tsx`  
Строки: 254-256

```tsx
<span className="inline-flex ...">
  <Check className="size-2.5" strokeWidth={3} />
  {t.verified}
</span>
```

Проблема: бейдж подтвержденной покупки рендерится для каждого отзыва без поля `verifiedPurchase` / проверки заказа.

Как исправить:
- добавить в модель/DTO отзыва поле `verifiedPurchase`;
- показывать бейдж только если пользователь действительно покупал товар;
- для seed/dev-отзывов явно маркировать данные как тестовые и не выводить их на production.

Ожидаемый критерий приемки:
- у неподтвержденных отзывов бейдж отсутствует;
- бейдж появляется только после проверки связи `review.userId -> order -> orderItem.productId`.

### P1. Остались inline styles, что нарушает протокол Tailwind v4

Файл: `src/app/[locale]/(shop)/product/[slug]/page.tsx`  
Строки: 103, 107, 108, 111, 114, 120, 123, 126, 131

Файл: `src/components/product/product-reviews.tsx`  
Строка: 200

Файл: `src/components/cart/add-to-cart-button.tsx`  
Строки: 85, 102

Проблема: в проектном протоколе явно указано `NO inline styles`. Разработчик сообщил, что inline styles удалены, но они остаются в коде.

Как исправить:
- заменить стили таблицы `QtyBreaksTable` на Tailwind-классы и токены `border-border`, `bg-surface-alt`, `text-text-muted`, `text-success`;
- для rating bars использовать CSS-переменную через class/data attribute только если это согласовано, либо дискретные классы ширины;
- убрать публичный `style?: React.CSSProperties` из `AddToCartButton`, если он не нужен, или заменить на `className`/variant API.

Ожидаемый критерий приемки:

```powershell
rg -n "style=|style\\?:" src/app src/components
```

не должен находить inline styles в product/cart UI, кроме технически обоснованных исключений с комментарием.

### P1. Заявленный walkthrough artifact и screenshots не найдены в репозитории

Разработчик сослался на:

- `product_page_rework_walkthrough.md`;
- `quantity_initial_1779456299407.png`;
- `quantity_updated_1779456483800.png`;
- `bottom_details_1779454813238.png`.

Проверка по репозиторию не нашла эти файлы. В наличии есть только старое упоминание этих имен внутри `REVIEW_REPORT_PRODUCT_PAGE_LOWER_BLOCKS.md`.

Как исправить:
- сохранить отчет в репозитории, например:
  - `docs/reports/product_page_rework_walkthrough.md`;
  - `docs/reports/assets/product_page_quantity_initial.png`;
  - `docs/reports/assets/product_page_quantity_updated.png`;
  - `docs/reports/assets/product_page_bottom_details.png`;
- в отчете указать точные URL, viewport, дату, команды и что именно проверено.

Ожидаемый критерий приемки:
- артефакты реально существуют в репозитории;
- по ним можно открыть визуальное подтверждение без внешней переписки.

### P2. "Інші товари тієї ж серії" сейчас не является настоящей серией

Файл: `src/queries/products.ts`  
Строки: 266-318

Проблема: функция `getSameSeriesProducts()` принимает `attributes`, но не использует их. Сейчас логика фактически такая:
- сначала товары той же категории и того же бренда;
- если нет, товары той же категории.

Это не равно "той же серии". Для масла Castrol это может случайно выглядеть нормально, но для электротоваров будет смешивать разные линейки внутри бренда/категории.

Как исправить:
- определить, какие поля считаются серией:
  - `series`;
  - `line`;
  - `modelFamily`;
  - `collection`;
  - либо конкретный JSONB attribute;
- если такого поля нет, добавить нормализованное поле/атрибут;
- строить запрос по этому признаку, а не только по бренду и категории.

Ожидаемый критерий приемки:
- товары в блоке имеют общий series/line/family;
- fallback "бренд + категория" используется только если явная серия отсутствует, и блок тогда лучше назвать иначе, например "Інші товари бренду".

### P2. Нужно проверить галерею не только по коду, но и интерактивно

По коду lightbox, keyboard navigation и touch swipe реализованы. Но для приемки нужно приложить browser evidence:

- desktop screenshot до открытия;
- desktop screenshot lightbox;
- mobile screenshot;
- проверка закрытия по `Escape`;
- проверка стрелок;
- проверка свайпа на mobile viewport;
- проверка, что активный thumbnail видим при перелистывании.

Если активная миниатюра уходит за пределы горизонтальной ленты, добавить auto-scroll к активному thumbnail через ref + `scrollIntoView({ inline: 'center', block: 'nearest' })`.

## Рекомендованный порядок исправления

1. Срочно убрать seed reviews с production:
   - удалить `vercel.app` из `isDevOrStaging`;
   - ввести явный флаг окружения для preview/dev.

2. Исправить production SEO URL:
   - выставить корректный `NEXT_PUBLIC_SITE_URL` / `SITE_URL`;
   - убрать `localhost:3000` из canonical, hreflang, OpenGraph и JSON-LD.

3. Исправить breadcrumbs:
   - убрать дубли локали `/uk/uk`, `/ru/ru`;
   - привести HTML-ссылки и JSON-LD к одному контракту.

4. Принять решение по отзывам:
   - либо скрыть production-форму до backend;
   - либо реализовать полноценную модель отзывов, модерацию и verified purchase.

5. Убрать inline styles:
   - `QtyBreaksTable`;
   - rating bars;
   - `AddToCartButton` style prop.

6. Исправить семантику same-series:
   - использовать явное поле серии/линейки;
   - переименовать fallback-блок, если серии нет.

7. Сохранить визуальный walkthrough в репозиторий.

## Команды проверки

Использованные проверки:

```powershell
Invoke-WebRequest -Uri "https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l" -UseBasicParsing -TimeoutSec 30
curl.exe -L "https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l" -o live_uk_product.html
curl.exe -L "https://elektronom.vercel.app/ru/product/castrol-edge-5w30-4l" -o live_ru_product.html
rg -n "SEED_REVIEWS|vercel\\.app|localhost|style=|Підтверджена|Подтвержденная|verified|verifiedPurchase" -- src/components/product src/app/[locale]/(shop)/product src/components/cart/add-to-cart-button.tsx
rg -n "getSameSeriesProducts|attributes|brandId|categoryId|take|OR:" -- src/queries/products.ts
rg -n "role=\"dialog\"|aria-modal|Escape|ArrowLeft|ArrowRight|touchStart|touchEnd|setLightboxOpen|overflow-x-auto|scroll" -- src/components/product/product-gallery.tsx
rg -n "product_page_rework_walkthrough|quantity_initial|quantity_updated|bottom_details" -- .
```

## Итоговый статус

Статус: не принимать как полностью закрыто.

Причина: визуальный каркас страницы товара продвинулся, но production-качество отзывов, SEO URL и приемочная чистота кода не соответствуют требованиям. Главные блокеры — синтетические отзывы на `vercel.app` production, `localhost:3000` в metadata/JSON-LD и дубль локали `/uk/uk` в breadcrumbs.
