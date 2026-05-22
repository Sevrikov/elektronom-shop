# Критика MASTER_CONTEXT v1.2 — в разрезе редизайна elektronom.com.ua
**Дата:** 2026-05-09  
**Формат:** Технический разбор рисков, предостережений и архитектурных решений,  
которые могут пойти не так при агентной разработке.

---

## ЧАСТЬ 1 — ТЕХНОЛОГИЧЕСКИЙ СТЕК: РИСКИ ВЫБОРА

### ⚠️ Next.js 16 — слишком новый для продакшна сейчас

MASTER_CONTEXT строится вокруг Next.js 16 с рядом возможностей, которые либо новые, либо нестабильные:

- `cacheComponents: true` — новый флаг, меняет всю модель кэширования
- `'use cache'` + `cacheLife()` — API ещё в flux (в Next.js 15.x был `unstable_cache`)
- `proxy.ts` вместо `middleware.ts` — нестандартное именование, документация скудная
- React Compiler (`reactCompiler: true`) — стабилен только на бумаге

**Что может пойти не так:** Агенты обучены на Next.js 14–15. Они будут писать `export const revalidate`, `export const dynamic = 'force-dynamic'`, `unstable_cache` — всё то, что MASTER_CONTEXT запрещает. Это приведёт к конфликту между тем что агент знает и тем что написано в методичке. Проверять каждый файл вручную.

**Риск:** Высокий. `'use cache'` внутри функции — непривычная конструкция. Агент может поставить её некорректно (не первой строкой, после await, в Client Component).

---

### ⚠️ Tailwind CSS v4 — конфигурация через CSS, не JS

MASTER_CONTEXT запрещает `tailwind.config.ts` и требует `@theme {}` в globals.css. Это правильно для v4, но:

- Большинство обучающих данных агентов — Tailwind v3 с `tailwind.config.js`
- Плагины (typography, forms) в v4 подключаются иначе
- Кастомные токены в `@theme {}` не всегда подхватываются IntelliSense агента

**Что может пойти не так:** Агент создаст `tailwind.config.ts` с `extend: { colors: {...} }` параллельно с `@theme {}` в CSS. Возникнет конфликт токенов. Дизайн-спека (часть 4) использует переменные типа `--color-accent`, а агент напишет `text-blue-600` из Tailwind v3.

---

### ⚠️ NextAuth v5 + PrismaAdapter — известные баги

NextAuth v5 (auth.js) нестабилен с PrismaAdapter в ряде сценариев:
- Credentials провайдер требует `trustHost: true` в продакшне
- JWT + PrismaAdapter имеют конфликт при `session.strategy: 'jwt'` — сессии не пишутся в БД, но адаптер ожидает Session модель
- Google OAuth redirect может ломаться при `localePrefix: 'always'` в next-intl

**Что может пойти не так:** Авторизация будет работать в dev, ломаться в prod. Особенно при деплое на Vercel с Edge Runtime — PrismaClient не работает на Edge.

**Предостережение:** В `proxy.ts` используется `auth()` из NextAuth — это вызов БД на каждый запрос через middleware. При высокой нагрузке это узкое место. Нужен `jwt` стратегия с проверкой токена без БД.

---

## ЧАСТЬ 2 — АРХИТЕКТУРА: СТРУКТУРНЫЕ ПРОБЛЕМЫ

### ⚠️ Гостевая корзина в cookie — 4KB лимит реальная проблема

MASTER_CONTEXT §14:
> cookie "cart" (JSON, зашифрованный, max 4KB)

У elektronom.com.ua товары с длинными названиями (артикул + название + характеристики). Если в корзине 5–7 позиций с полными данными — 4KB закончится. Реальный сценарий: B2B клиент добавляет 20–30 позиций (это норма для электротехники).

**Что может пойти не так:** Корзина молча обрезается. Покупатель видит 20 товаров в UI, но в cookie попало только 8. При оформлении заказа — данные не совпадают.

**Решение:** Хранить в cookie только `[{ productId, quantity }]` — минимум. Расширенные данные (название, цена, фото) — доставать в Server Component при рендере корзины из БД по productId.

---

### ⚠️ Архитектура `'use cache'` + реальные цены — опасная комбинация

В MASTER_CONTEXT:
```
Карточка товара: 'use cache' + cacheLife('seconds') — ~60 сек
```

Для магазина электротехники с оптовыми ценами это критично. Сценарий:
1. Менеджер меняет цену товара в админке
2. `revalidateTag('product-{slug}')` срабатывает
3. Но если кэш на CDN (Vercel Edge) — инвалидация не мгновенная
4. Пользователь видит старую цену, добавляет в корзину
5. В `createOrder()` цена берётся из БД — несоответствие

**Что может пойти не так:** Покупатель видит цену X, оплачивает, получает заказ по цене Y. Конфликт с клиентом.

**Предостережение:** В `createOrder()` ОБЯЗАТЕЛЬНА строка "цена из БД, а не от клиента" — в MASTER_CONTEXT она есть, но агент может забыть и взять `price` из `input`. Нужно добавить в AGENTS.md явное правило.

---

### ⚠️ `generateStaticParams` + 10000+ SKU = медленный build

MASTER_CONTEXT:
```typescript
export async function generateStaticParams() {
  // top-1000 товаров по updatedAt
  take: 1000,
}
```

На сайте ~10000+ SKU (в меню категорий видно: Електрика 5127, Інструменти 4939, Спецодяг 363...). `take: 1000` — это 10% товаров. Остальные 90% будут рендериться on-demand при первом запросе (ISR fallback).

**Что может пойти не так:**
- Первый пользователь, зашедший на страницу нового товара, ждёт 2–5 секунд рендера
- При деплое: сборка 1000 страниц = ~10–15 минут build time
- При 10000 страницах = ~90 минут, что неприемлемо для Vercel Free

**Решение:** Не использовать `generateStaticParams` совсем, полностью на ISR/`'use cache'`. Или разбить на `generateSitemaps` с пагинацией (Next.js 16 поддерживает).

---

### ⚠️ Транзакция createOrder — декремент stock без блокировки

В MASTER_CONTEXT §14 транзакция:
```typescript
await tx.product.update({
  where: { id: item.productId },
  data: { stock: { decrement: item.quantity } }
})
```

**Нет проверки на отрицательный stock внутри транзакции.** Если два пользователя одновременно купили последний товар — stock уйдёт в минус.

**Правильно:**
```typescript
const updated = await tx.product.update({
  where: { id: item.productId, stock: { gte: item.quantity } },
  data: { stock: { decrement: item.quantity } }
})
// Если товара нет — update вернёт null → бросить ошибку
```

Или использовать `SELECT FOR UPDATE` через `$queryRaw` — но MASTER_CONTEXT это запрещает без крайней нужды. Вариант с `where: { stock: { gte: quantity } }` — чистый Prisma-способ.

---

### ⚠️ Маршрут `catalog/[slug]` — проблема с подкатегориями

В файловой структуре MASTER_CONTEXT:
```
catalog/
  └── [slug]/
        └── page.tsx
```

Один уровень `[slug]`. Но дерево категорий трёхуровневое. Slug вложенной категории может совпадать у разных родителей ("aksessuary" есть и в Електриці, и в Інструментах).

**Что может пойти не так:** `getCategoryBySlug('aksessuary')` — вернёт первую найденную категорию с этим slug, не ту, что ожидает пользователь. Breadcrumbs сломаются.

**Решение:** Slug должен быть уникальным глобально (в схеме `slug String @unique` — это уже есть), тогда проблемы нет. Но нужно убедиться что при seed и импорте данных slug генерируется как `parent-slug-child-slug` (составной), а не просто `child-slug`.

---

## ЧАСТЬ 3 — АГЕНТНАЯ РАЗРАБОТКА: ЧТО ПОЙДЁТ НЕ ТАК

### ⚠️ Агент будет игнорировать `productCardSelect`

MASTER_CONTEXT определяет `productCardSelect` как предопределённый Prisma select. Это хорошая практика. Но агенты склонны писать новые select'ы для каждого запроса заново, игнорируя существующий.

**Результат:** 15 разных select'ов в разных компонентах, половина без `take` на images, часть с лишними полями. Утечка данных (costPrice) попадёт в клиентский компонент.

**Предостережение:** Добавить в AGENTS.md: "ЗАПРЕЩЕНО писать новый select для productCard — использовать только `productCardSelect` из queries/products.ts".

---

### ⚠️ `'use client'` будет расползаться вверх

Агент, столкнувшись с ошибкой "useState cannot be used in Server Component", добавит `'use client'` на уровень page.tsx или layout.tsx. Это лишит страницу всех преимуществ Server Components.

**Типичный сценарий:**
1. Нужна кнопка "Додати до кошика" на странице товара
2. Агент добавляет `'use client'` на `product/[slug]/page.tsx`
3. Вся страница становится клиентской — `getProductBySlug` вызывается из браузера
4. Prisma импортируется в браузер → ошибка сборки

**Что нужно:** В AGENTS.md явный пример правильного разделения для страницы товара — Server Component с данными, Client Component `AddToCartButton` как лист дерева.

---

### ⚠️ Server Actions без `'use server'` — тихая ошибка

В Next.js 16, если забыть `'use server'` в начале файла actions/, функция выполняется на клиенте. Ошибки нет, но:
- `prisma` не найден в браузере
- `auth()` вернёт undefined
- ENV переменные без `NEXT_PUBLIC_` будут пустыми

Агенты иногда забывают директиву, особенно при рефакторинге.

---

### ⚠️ Zod cuid() vs cuid2() — несовместимость

В MASTER_CONTEXT схема использует `cuid2()`, но в `CheckoutSchema`:
```typescript
productId: z.string().cuid()
```

`z.string().cuid()` валидирует старый формат cuid (начинается с `c`). cuid2 имеет другой формат. Валидация будет падать на всех productId из БД.

**Нужно:** `z.string().min(1)` или кастомный валидатор для cuid2. Это баг в самом MASTER_CONTEXT.

---

### ⚠️ i18n + `localePrefix: 'always'` — проблема с adminкой

В `proxy.ts`:
```typescript
localePrefix: 'always'  // ВСЕГДА /uk/... и /ru/...
```

Но `(admin)/` маршруты в MASTER_CONTEXT — без locale prefix (`/admin/dashboard`). При `localePrefix: 'always'` next-intl будет редиректить `/admin/*` на `/uk/admin/*`, ломая admin-роуты.

**Решение:** В конфигурации next-intl указать `pathnames` с исключениями, или использовать `localePrefix: 'as-needed'` для путей вне `[locale]` сегмента.

---

### ⚠️ Algolia — индексация при seed не предусмотрена

В Спринте 1 (задача 1.2) создаётся seed с товарами в PostgreSQL. В Спринте 4 (задача 4.1–4.3) настраивается Algolia. Но между ними нет задачи "проиндексировать seed-данные в Algolia".

**Что произойдёт:** После Спринта 1 поиск (fallback Prisma) работает. После подключения Algolia в Спринте 4 — поиск пустой, потому что индекс не заполнен. Нужно добавить `bulkReindex()` в конец seed.ts.

---

## ЧАСТЬ 4 — СПЕЦИФИКА МАГАЗИНА ЭЛЕКТРОТЕХНИКИ

### ⚠️ Фильтрация по JSONB атрибутам — производительность

Ассортимент включает товары с десятками характеристик (напряжение, ток, количество полюсов, степень защиты IP и т.д.). Фильтрация по `attributes JSONB` с GIN индексом работает хорошо для точных совпадений, но:

- `buildProductWhereClause(filters)` в MASTER_CONTEXT не реализована — только обозначена
- Для диапазонных фильтров (ток от 16А до 63А) GIN не поможет — нужен функциональный индекс
- Для `mode: 'insensitive'` на JSONB значениях — индекс не используется

**Что может пойти не так:** Фильтрация в каталоге работает медленно при 5000+ товарах в категории.

---

### ⚠️ Изображения товаров — внешний CDN Prom.ua

Все текущие изображения хранятся на `images.prom.ua`. При миграции на новый домен:
- `remotePatterns` в `next.config.ts` должен включать `images.prom.ua`
- Если Prom.ua заблокирует хотбандинг — изображения пропадут
- `next/image` будет проксировать изображения через свой сервер — трафик на Vercel

**В MASTER_CONTEXT:** `remotePatterns` — пустой массив ("Добавлять только реальные домены").  
**Риск:** Агент забудет добавить домены изображений, и все `<Image>` будут ломаться.

Нужно явно добавить в задачу 1.19 (`.env.example`): задокументировать какие домены CDN нужны.

---

### ⚠️ SEO — дублирование контента uk/ru

При `localePrefix: 'always'` один и тот же товар доступен по двум URL:
- `/uk/product/uzo-utrust-40a`
- `/ru/product/uzo-utrust-40a`

В MASTER_CONTEXT есть `alternates` с `hreflang` в `generateMetadata` — это правильно. Но если `canonical` не настроен корректно, Google будет считать это дублями и понизит ранжирование.

**Что нужно:** Убедиться что canonical всегда указывает на `/uk/` версию (основная локаль), а `hreflang` правильно прописывает обе версии + `x-default`.

---

### ⚠️ Decimal vs Number — тихая потеря точности

Prisma возвращает `price: Decimal` (объект, не число). В MASTER_CONTEXT это обработано в `formatPrice()`. Но агенты часто пишут:

```typescript
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

`Decimal * number` в JavaScript — потеря точности. `884 * 12 = 10607.999999...` вместо `10608`.

**Нужно:** Добавить в AGENTS.md: "НИКОГДА не делать арифметику с Prisma.Decimal напрямую. Использовать `Number(price)` или библиотеку `decimal.js`".

---

## ЧАСТЬ 5 — ПРЕДОСТЕРЕЖЕНИЯ ПО ДЕПЛОЮ

### ⚠️ Prisma на Vercel — cold start и connection pooling

При деплое на Vercel (Serverless):
- Каждый serverless вызов создаёт новое подключение к PostgreSQL
- При пиковой нагрузке — PostgreSQL исчерпает пул соединений
- `PgBouncer` или `Prisma Accelerate` — обязательны, но не упомянуты в MASTER_CONTEXT

**Что может пойти не так:** Сайт работает в dev, падает в prod под нагрузкой с ошибкой "too many connections".

**Решение:** Добавить `DATABASE_URL` с параметром `?connection_limit=1&pool_timeout=20`, или использовать `DIRECT_URL` + `DATABASE_URL` через Prisma Accelerate/PgBouncer.

---

### ⚠️ Edge Runtime несовместим с Prisma

Если агент по ошибке добавит `export const runtime = 'edge'` на любой page/route — Prisma сломается (нет поддержки Node.js APIs на Edge).

`proxy.ts` выполняется на Edge по умолчанию. В нём вызывается `auth()` из NextAuth — это может вызывать Prisma через PrismaAdapter. Нужно убедиться что `auth()` в `proxy.ts` использует JWT стратегию без обращения к БД.

---

### ⚠️ Webhook LiqPay — `req.text()` vs `req.json()`

В route handler вебхука:
```typescript
const body = await req.text()  // ✅ правильно — для верификации подписи
```

LiqPay передаёт `data` + `signature` как form-encoded, не JSON. Агент, видя `/api/webhooks/payment/route.ts`, скорее всего напишет `await req.json()` — верификация подписи сломается.

---

## ИТОГОВАЯ МАТРИЦА РИСКОВ

| Риск | Вероятность | Критичность | Когда проявится |
|------|-------------|-------------|-----------------|
| Агент пишет `export const revalidate` вместо `'use cache'` | 🔴 Высокая | 🟡 Средняя | Спринт 1–2 |
| `'use client'` расползается на page.tsx | 🔴 Высокая | 🔴 Высокая | Спринт 2 |
| `z.string().cuid()` vs cuid2 — несовместимость | 🟡 Средняя | 🔴 Высокая | Спринт 2, checkout |
| Stock уходит в минус при concurrent заказах | 🟡 Средняя | 🔴 Высокая | Продакшн |
| Prisma connection pool исчерпан на Vercel | 🟡 Средняя | 🔴 Высокая | Продакшн под нагрузкой |
| Algolia индекс пустой после seed | 🔴 Высокая | 🟡 Средняя | Спринт 4 |
| Изображения Prom.ua не добавлены в remotePatterns | 🔴 Высокая | 🔴 Высокая | Спринт 1 |
| Admin маршруты ломаются из-за localePrefix | 🟡 Средняя | 🟡 Средняя | Спринт 3 |
| Decimal арифметика — потеря точности в итогах | 🟡 Средняя | 🟡 Средняя | Спринт 2–3 |
| Webhook LiqPay — `req.json()` вместо `req.text()` | 🟡 Средняя | 🔴 Высокая | Спринт 3 |
| Cookie корзина переполняется у B2B клиентов | 🟡 Средняя | 🟡 Средняя | Продакшн |
| Подкатегории имеют неуникальные slug | 🟡 Средняя | 🟡 Средняя | Спринт 1, seed |
| `auth()` в proxy.ts обращается к БД на Edge | 🟡 Средняя | 🔴 Высокая | Спринт 3, деплой |

---

## ЧТО НУЖНО ДОБАВИТЬ В MASTER_CONTEXT / AGENTS.md

1. **Явный запрет** `z.string().cuid()` — заменить на `z.string().min(1)` или `z.string().regex(/^[a-z0-9]+$/)` для cuid2
2. **Правило** `where: { stock: { gte: quantity } }` в транзакции createOrder
3. **Пример** правильного разделения Server/Client для страницы товара (страница = Server, кнопки = Client листья)
4. **Обязательно** добавить `images.prom.ua` в `remotePatterns` как временный CDN
5. **Правило** для `bulkReindex()` в конце `seed.ts`
6. **Предупреждение** о `PgBouncer` / `connection_limit` для Vercel деплоя
7. **Явный запрет** `export const runtime = 'edge'` в любых файлах кроме специально помеченных
8. **Правило** для `req.text()` в webhook route (не `req.json()`)
9. **Правило** арифметики с Decimal — только через `Number()` или `decimal.js`
10. **Slug стратегия** для подкатегорий — составной slug `parent-child`
