# Отчёт ревью проекта Elektronom

Дата ревью: 2026-05-21  
Папка проекта: `C:\Users\sevri\Сайт\elektronom`  
Проверяемые источники требований:

- `C:\Users\sevri\Сайт\elektronom\MASTER_CONTEXT v1_02.md`
- `C:\Users\sevri\.gemini\antigravity\brain\5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a\ТЗ_СВОДНОЕ.md`
- `C:\Users\sevri\.gemini\antigravity\brain\5fa6b7e6-6ad2-4f83-abbb-2f399e8ab25a\ТЗ_часть4_дизайн.md`

## Общий вывод

Проект частично продвинут дальше исходного состояния из ТЗ: добавлены Prisma-схема, auth, queries, product page, cart actions и часть cart UI. Однако в текущем виде сайт не соответствует `MASTER_CONTEXT v1.2` и не готов к передаче как рабочий сайт: production build не проходит, есть расхождения по обязательному стеку, нарушены стоп-правила MASTER_CONTEXT, отсутствует значительная часть P0/P1 функционала.

Главный приоритет: сначала устранить build blocker и привести схему/стек к MASTER_CONTEXT, затем закрывать функциональные пробелы ТЗ.

## Проверки

Команды запускались через PowerShell с обходом локальной execution policy:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run lint"
powershell -ExecutionPolicy Bypass -Command "npm run build"
```

Результат:

- `npm run lint` не проходит: 3 ошибки, 8 warnings.
- `npm run build` не проходит: TypeScript error в `src/actions/cart.ts`.

Обычный `npm run ...` в PowerShell не стартует из-за локальной политики Windows: `npm.ps1` заблокирован execution policy. Это не ошибка проекта, но мешает проверкам без обхода.

## Критичные блокеры

### 1. Production build не проходит

Файл: `src/actions/cart.ts:106`

```ts
images: {
  where: { isMain: true },
  select: { url: true },
  take: 1,
}
```

Ошибка:

```text
Object literal may only specify known properties, and 'isMain' does not exist in type 'ProductImageWhereInput'.
```

Причина: в `prisma/schema.prisma` модель `ProductImage` не содержит поля `isMain`.

Файл: `prisma/schema.prisma:220`

```prisma
model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  alt       String?
  sortOrder Int     @default(0)
}
```

Что исправить:

- либо добавить `isMain Boolean @default(false)` в Prisma-схему и миграцию;
- либо заменить фильтр `where: { isMain: true }` на `orderBy: { sortOrder: "asc" }, take: 1`.

### 2. Обязательный стек не совпадает с MASTER_CONTEXT

MASTER_CONTEXT v1.2 требует:

- Prisma `5.x`
- Zustand `4.x`

Фактически в `package.json`:

```json
"@prisma/client": "^7.8.0",
"prisma": "^7.8.0",
"zustand": "^5.0.13"
```

Также в `prisma/schema.prisma` указано:

```prisma
// PostgreSQL 16 + Prisma 6
```

Это прямое расхождение с MASTER_CONTEXT.

Нужно принять решение:

- либо привести зависимости к Prisma 5 / Zustand 4;
- либо официально обновить MASTER_CONTEXT и ТЗ под фактический стек Prisma 7 / Zustand 5.

Без такого решения дальнейшая разработка будет конфликтовать с правилами проекта.

### 3. Prisma ID использует запрещённый `cuid()`

MASTER_CONTEXT v1.2 требует заменить `cuid()` на `cuid2()`.

Фактически `@default(cuid())` используется во всех основных моделях:

- `User`
- `Account`
- `Session`
- `Address`
- `Category`
- `Product`
- `ProductImage`
- `CartItem`
- `Order`
- `OrderItem`
- и др.

Пример:

```prisma
id String @id @default(cuid())
```

Также server actions валидируют ID через:

```ts
z.string().cuid()
```

Файл: `src/actions/cart.ts`

Нужно привести стратегию ID и Zod-валидацию к одному стандарту.

### 4. В проекте есть запрещённый `.js` файл

MASTER_CONTEXT запрещает JavaScript-файлы.

Файл:

```text
ga-script.js
```

Он же ломает lint:

```text
error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
```

Что исправить:

- удалить файл, если он не нужен;
- либо переписать в TypeScript;
- либо вынести за пределы проекта, если это служебный одноразовый скрипт.

### 5. Потенциальный секрет в репозитории

В корне найден файл:

```text
ga4-key.json
```

`.env` игнорируется через `.gitignore`, но `ga4-key.json` не покрыт игнором. Если это сервисный ключ Google Analytics / Google API, его нельзя хранить в репозитории.

Что исправить:

- удалить из репозитория;
- добавить в `.gitignore`;
- перевыпустить ключ, если файл уже попадал в git или передавался наружу.

## Серьёзные несоответствия MASTER_CONTEXT

### 1. `typedRoutes` отключён

MASTER_CONTEXT требует:

```ts
experimental: {
  typedRoutes: true,
}
```

Фактически в `next.config.ts`:

```ts
// typedRoutes: true,
experimental: {},
```

Комментарий говорит, что typed routes отключены из-за ошибок dynamic URL. Это технический долг, который противоречит MASTER_CONTEXT.

### 2. Массовое использование inline styles

MASTER_CONTEXT и дизайн-ТЗ запрещают:

```tsx
style={{ ... }}
```

По проекту найдено примерно `452` вхождения `style={{...}}` в `src`.

Примеры:

- `src/app/[locale]/page.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/(shop)/product/[slug]/page.tsx`
- `src/components/product/product-card.tsx`
- `src/components/product/product-gallery.tsx`
- `src/components/layout/header.tsx`

Это системное нарушение дизайн-ТЗ. Цвета, бордеры, фон, размеры и состояния нужно перенести в Tailwind-классы и CSS-токены.

### 3. Захардкоженные UI-тексты вместо `t()`

MASTER_CONTEXT требует: каждая строка интерфейса через `next-intl`.

Фактически много текстов написано так:

```tsx
loc === 'ru' ? 'В наличии' : 'В наявності'
```

Примеры:

- `src/app/[locale]/(shop)/product/[slug]/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/catalog/catalog-hub-tabs.tsx`

Нужно перенести строки в `src/i18n/messages/uk.json` и `src/i18n/messages/ru.json`.

### 4. Внутренняя ссылка сделана через `<a>`, а не `next/link`

Файл: `src/components/layout/header.tsx`

```tsx
<a href={lp('/login')}>
```

По MASTER_CONTEXT внутренние ссылки должны быть через `next/link`. Для `tel:` и `mailto:` обычный `<a>` допустим.

### 5. Catalog Hub принудительно сделан dynamic

Файл: `src/app/[locale]/(shop)/catalog/page.tsx`

```ts
await connection()
```

Комментарий:

```ts
// Opt out of prerendering to avoid Suspense errors with next-intl
```

По ТЗ Catalog Hub ожидается как SSG/статичная страница. Текущее решение отключает prerendering и требует пересмотра.

### 6. Слишком много Client Components

Найдено 32 файла с `'use client'`. Это не всегда ошибка, но противоречит принципу MASTER_CONTEXT: client component должен быть минимальным и только там, где есть интерактивность.

Особенно стоит пересмотреть:

- `src/components/product/product-card.tsx`
- `src/components/home/value-props.tsx`
- `src/components/home/trust-section.tsx`
- `src/components/home/prefooter-cta.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/category-sidebar.tsx`

Если компонент только отображает данные и ссылки, он должен быть Server Component.

## Ошибки lint

### 1. `ga-script.js`

```text
A `require()` style import is forbidden
```

### 2. `src/components/catalog/price-range-filter.tsx`

```text
Calling setState synchronously within an effect can trigger cascading renders
```

Проблемный код:

```tsx
useEffect(() => {
  setLocalMin(currentMin ?? min)
  setLocalMax(currentMax ?? max)
}, [currentMin, currentMax, min, max])
```

Нужно перепроектировать синхронизацию props/state.

### 3. `src/components/product/product-schema.tsx`

```text
Cannot call impure function during render
```

Проблемный код:

```tsx
priceValidUntil: new Date(Date.now() + 86400 * 7 * 1000)
```

Нужно передавать дату извне или вычислять стабильно на сервере до рендера компонента.

## Отсутствующий функционал по ТЗ

Отсутствуют P0/P1 страницы:

- `src/app/[locale]/(shop)/checkout/page.tsx`
- `src/app/[locale]/(shop)/order-success/page.tsx`
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/register/page.tsx`
- `src/app/[locale]/(account)/orders/page.tsx`
- `src/app/[locale]/(account)/profile/page.tsx`
- `src/app/[locale]/(account)/wishlist/page.tsx`
- `src/app/[locale]/(shop)/search/page.tsx`
- `src/app/[locale]/(shop)/brands/`
- `src/app/[locale]/(info)/about/page.tsx`
- `src/app/[locale]/(info)/delivery/page.tsx`
- `src/app/[locale]/(info)/contacts/page.tsx`
- `src/app/(admin)/dashboard/page.tsx`

Отсутствуют обязательные app-файлы:

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/not-found.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`

Отсутствуют actions:

- `src/actions/order.ts`
- `src/actions/product.ts`
- `src/actions/user.ts`
- `src/actions/search.ts`
- `src/actions/review.ts`
- `src/actions/wishlist.ts`

Отсутствуют search / Algolia файлы:

- `src/lib/algolia.ts`
- `src/components/search/search-box.tsx`
- `src/app/[locale]/(shop)/search/page.tsx`

Отсутствуют checkout/account/admin компоненты:

- `src/components/checkout/checkout-form.tsx`
- `src/components/auth/login-form.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/account/`

Отсутствует тестовая инфраструктура:

- `vitest`
- `playwright`
- `tests/unit`
- `tests/integration`
- `tests/e2e`

## Что уже сделано хорошо

- Используется Next.js 16.2.3.
- `cacheComponents: true` включён.
- `reactCompiler: true` включён.
- `proxy.ts` используется вместо `middleware.ts`.
- TypeScript strict-настройки в целом соответствуют MASTER_CONTEXT.
- Есть `next-intl` с локалями `uk` и `ru`.
- Есть `next/font` для Inter.
- Есть Prisma singleton в `src/lib/prisma.ts`.
- Есть NextAuth v5 setup в `src/lib/auth.ts`.
- Есть реальные Prisma queries для products/categories.
- Есть часть product page и cart flow.
- Внутри Prisma-запросов в основном используются `select` и `take`.

## Рекомендуемый порядок исправления

### Этап 1 — привести проект к собираемому состоянию

1. Исправить `ProductImage.isMain` конфликт.
2. Запустить `prisma generate`.
3. Добиться успешного `npm run build`.
4. Добиться успешного `npm run lint`.

### Этап 2 — устранить нарушения MASTER_CONTEXT

1. Решить вопрос со стеком: Prisma 5/Zustand 4 или обновление MASTER_CONTEXT.
2. Заменить `cuid()` / `z.string().cuid()` согласно принятой ID-стратегии.
3. Удалить или переписать `ga-script.js`.
4. Убрать `ga4-key.json` из репозитория и добавить в `.gitignore`.
5. Включить `typedRoutes`.

### Этап 3 — закрыть P0-функционал ТЗ

1. Checkout page + `actions/order.ts`.
2. Auth pages: login/register.
3. Account pages: orders/profile/wishlist.
4. Payment webhook.
5. Cart merge guest/auth.

### Этап 4 — закрыть поиск, SEO и production readiness

1. `lib/algolia.ts`.
2. `actions/search.ts`.
3. `components/search/search-box.tsx`.
4. `/search`.
5. `sitemap.ts`, `robots.ts`.
6. `not-found.tsx`, `error.tsx`, `global-error.tsx`.
7. JSON-LD: Organization, BreadcrumbList.

### Этап 5 — дизайн и архитектурная чистка

1. Убрать inline styles.
2. Перенести все UI-строки в `next-intl`.
3. Сократить количество Client Components.
4. Привести ProductCard, Header, Footer, Catalog Hub к дизайн-ТЗ Concept 6 v2.

## Финальный статус

Текущий статус: не соответствует MASTER_CONTEXT v1.2 и ТЗ в полном объёме.  
Готовность по факту: выше исходных 25%, но сайт пока не production-ready из-за build blocker и системных нарушений правил проекта.

