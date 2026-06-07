# Отчет по аудиту готовности инфраструктуры (Alpha 1.2 Foundation)
*Дата отчета: 2026-06-08*

Этот документ содержит аудит базовой SEO- и технической инфраструктуры интернет-магазина Elektronom, проведенный на ветке `codex/alpha-1-2-authority-seo-ai` относительно стабильного релиза `Project_Alpha_V1.1`.

---

## 1. robots.ts (Файл роботов)

**Расположение:** `src/app/robots.ts`

### Статус и выводы:
* **Разделение Staging / Production:** Реализовано корректно. URL-адреса, содержащие `test.elektronom.com.ua`, `localhost`, `127.0.0.1` или `vercel.app`, определяются как тестовые окружения и полностью закрываются от индексации (`disallow: '/'`).
* **Технические зоны:** В продакшене закрыты служебные и динамические пути:
  * `/api/` (API-маршруты)
  * `/admin/` (Административная панель)
  * `/checkout/` (Процесс оформления заказа)
  * `/account/` (Личный кабинет)
  * `/search` и `/search/` (Результаты внутреннего поиска)
* **Sitemap:** Ссылка на файл карты сайта формируется динамически (`${siteUrl}/sitemap.xml`) на основе функции `getSiteUrl()`.

---

## 2. sitemap.ts (Карта сайта)

**Расположение:** `src/app/sitemap.ts`

### Статус и структура:
* **Покрытие:** Карта сайта включает в себя статические страницы, активные товары, категории, бренды, статьи блога и индексируемые посадочные страницы фильтров (quick-links).
* **Локализация:** Поддерживаются обе локали (`uk`, `ru`). Для всех записей корректно генерируются альтернативные ссылки (`alternates.languages`) для перелинковки языковых версий.

### Критические риски (Лимит в 50 000 URL):
* Google Search Central устанавливает жесткое ограничение на один файл sitemap: **не более 50 000 URL** или **50 МБ** в несжатом виде.
* В текущей реализации лимит запроса к БД по товарам установлен на уровне `take: 50000`. Однако из-за двух локалей (`uk` и `ru`) количество генерируемых записей для товаров составит `50000 * 2 = 100 000` URL.
* **Рекомендация:** При превышении суммарным каталогом ~23 000 активных SKU необходимо внедрить sitemap index (индекс карт сайта) для разделения файлов sitemap по типам страниц или локалям (например, `/sitemap-products-uk.xml`, `/sitemap-products-ru.xml` и т.д.).

---

## 3. Canonical & Hreflang (Канонические и языковые теги)

Проведен аудит метаданных на ключевых шаблонах страниц:

### Карточка товара (`src/app/[locale]/(shop)/product/[slug]/page.tsx`):
* **Canonical:** Формируется абсолютно: `${baseUrl}/${locale}/product/${slug}`.
* **Hreflang:** Указаны альтернативные языки для `uk`, `ru` и значение по умолчанию `x-default` (указывает на `uk`).

### Страница категории (`src/app/[locale]/(shop)/catalog/[slug]/page.tsx`):
* **Whitelisted Quick-Link:** При совпадении фильтров с whitelisted quick-link возвращается канонический URL с параметром (`?key=val`) и разрешается индексация (`index: true, follow: true`).
* **Не-whitelisted фильтры:** При наличии неразрешенных параметров canonical указывает на родительскую категорию без параметров, а страница закрывается тегом `noindex: true`.
* **Основная категория:** Чистый URL без параметров получает self-canonical и альтернативные языковые ссылки.

### Детальная страница блога (`src/app/[locale]/(shop)/blog/[slug]/page.tsx`):
* **Анализ:** Blog canonical uses a relative path (`/${locale}/blog/${slug}`), while locale layout defines `metadataBase: new URL(getSiteUrl())`. Therefore this is not a confirmed indexing bug. Recommendation: optional consistency cleanup in Alpha 1.2 to align blog metadata style with product/category pages and use explicit absolute canonical URLs.

### Дополнительный риск по разметке:
* **Organization JSON-LD / NAP risk:** locale layout contains Organization schema, but address values must be validated against real business NAP before Stage 4 E-E-A-T / Local SEO work. No code change in Foundation release; record as Alpha 1.2 SEO authority follow-up.


---

## 4. Merchant Feed (Экспорт в Google Shopping)

**Расположение:** `src/app/feed/[locale]/route.ts` & `src/lib/merchant/feed-builder.ts`

### Статус и производительность:
* **Серверное кэширование:** В обработчике маршрута используется современная серверная директива `'use cache'` с временем жизни `cacheLife('hours')` и тегированием кэша (`cacheTag`) для быстрой инвалидации при изменении товаров.
* **Генерация данных:** Функция `generateFeedItems` реализована как `AsyncGenerator`. Чтение товаров из базы данных происходит чанками по 100 элементов (`take: batchSize`), что исключает переполнение оперативной памяти.
* **Стандарты Prisma:** Строго соблюдаются правила `select` (выбираются только нужные для фида поля) и `take` / `skip` для пагинации.
* **Проверка данных:** Каждый элемент перед экспортом валидируется с помощью Zod-схемы `FeedItemSchema`.

---

## 5. Feature Flags (Флаги функций Alpha 1.2)

**Расположение:** `src/lib/features.ts` & `src/lib/env.ts`

* **Безопасность парсинга:** Реализован строгий парсер `parseFeatureFlag()`, исключающий ложное срабатывание для строкового значения `"false"` из `process.env`.
* **Безопасность сборки:** Переменные не имеют префикса `NEXT_PUBLIC_`, что исключает их случайную компиляцию в клиентские бандлы. Управление поведением происходит исключительно на серверной стороне.
* **Значение по умолчанию:** Все 11 флагов `alpha12_*` по умолчанию настроены в `false`.

---

## 6. Влияние на стабильные слои приложения

* Проверка изменений (`git diff --name-only Project_Alpha_V1.1..HEAD`) подтвердила, что в коммите содержатся только новые файлы конфигурации/документации и точечные изменения в `.gitignore`, `.env.example` и `src/lib/env.ts`.
* Компоненты оформления заказа (`checkout`), корзины (`cart`), оплаты (`payment`) и шаблоны отображения (`templates`) **не изменялись**.
