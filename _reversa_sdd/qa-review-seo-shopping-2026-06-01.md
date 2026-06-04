# QA-ревью: реализация SEO + Google Shopping (по отчёту разработчика)

> Дата: 2026-06-01. Проверено по коду против `TZ_SEO_TOP10`, `TZ_GOOGLE_SHOPPING`, `ADDENDUM_GOOGLE_SHOPPING`, MASTER_CONTEXT, anti-regression. Build зелёный (tsc/build exit 0) — подтверждено разработчиком.

## Вердикт
**Качественно. Принять с доработками.** Ядро логики (canonical/noindex, фид, schema, миграция) — корректно и в основном соответствует протоколу. Блокер один — **разнобой бренда**. Остальное — мелочи.

## ✅ Сделано хорошо
- **WP-2/13.2 canonical/noindex** (`catalog/[slug]/page.tsx`): whitelisted quick-link → self-canonical `?key=val` + `index,follow`; произвольные фильтры → canonical на базовую + `noindex,follow`; чистая категория → hreflang uk/ru/x-default. Логика верная.
- **GS-1 миграция** (`schema.prisma`): добавлены ровно поля addendum §A (`gtin, mpn, condition, googleProductCategory, itemGroupId, salePrice, saleStartsAt/EndsAt`) + индексы `gtin`/`itemGroupId`. **Существующие поля/индексы сохранены — регрессии нет.** ✅
- **GS-3 фид** (`lib/merchant/feed-builder.ts`): async-generator с батчами `take:100/skip` (память-эффективно, §3.3 соблюдён); supplier-aware `backorder`; `identifier_exists` логика; zod-валидация каждого item; без `any`.
- **Фид-роут** (`app/feed/[locale]/route.ts`): `'use cache' hours` + теги (products/categories/brands/supplier_inventory), `Content-Type: application/xml`, обработка ошибок.
- **GS-2 product-schema** (`product-schema.tsx`): `gtin/mpn`, `shippingDetails`, `hasMerchantReturnPolicy` (14 дн), `review[]`, sale-окно → `priceSpecification`. Существующее сохранено.
- **WP-4.1 Organization JSON-LD** (`layout.tsx`): `name: 'Electronom'` ✅, contactPoint/address/sameAs.
- **WP-3 AEO** (`answer-block.tsx`): Tailwind-токены (без inline-style), таблица спеков (AEO-friendly), Direct Answer.
- **Бонус сверх отчёта:** `lib/email.ts` (=A-7 письма!), `(shop)/blog/[slug]` (=WP-5 старт), движок engineering-платформы.

## 🔴 Критично (фикс до релиза)
**BR-1. Разнобой бренда (B-1 не выполнен).** Сайт смешивает `Elektronom` (K) и `Electronom` (C). Новое использует Electronom (Org-schema, фид, product-schema), но `Elektronom` (K) остался в:
- `app/[locale]/layout.tsx:45` — OG `siteName: 'Elektronom'` (при этом Org-schema `name: 'Electronom'` в том же файле!).
- `app/[locale]/(shop)/catalog/[slug]/page.tsx:84,104` — заголовки (новый код).
- `app/[locale]/(shop)/product/[slug]/page.tsx:68,79` — title/OG товара.
- `lib/assistant/prompts.ts:2`, `claude.ts:296,441,442`, `assistant-panel.tsx:491`, `assistant/page.tsx:19,20`.
- `lib/email.ts:57,102`; i18n `messages/uk.json|ru.json` (greeting/lead/policies).
→ Решение Q10: канон **Electronom** (C). Привести ВСЕ бренд-тексты к `Electronom`; домен/email `elektronom.com.ua` (K) не трогать. Для SEO-сущности это важно (Google видит два бренда).

## 🟡 Мелкое (поправить)
- **QA-2 `any`** в `answer-block.tsx:11-12` (`matchingQuickLink?: any`, eslint-disabled) — §3.1. Типизировать (тип quickLink из `catalog-filter-config`).
- **QA-3 NAP-плейсхолдеры** в Organization (`layout.tsx`): адрес «Промислова 12», тел. `+380501234567`, соц-URL — заглушки. Заменить реальными (WP-12). В отчёте сказано «из seed-конфигов», по факту захардкожено.
- **QA-4 inline `style={{}}`** на `<body>` (`layout.tsx:123`) — §10/B-13.
- **QA-5 shippingRate 80 UAH flat** + `returnFees=CustomerPaying` в product-schema — проверить соответствие реальной политике (Нова Пошта динамическая; расхождение → предупреждения Merchant).
- **QA-6 фид материализует весь массив** (`getCachedFeedItems` собирает все items в память перед XML) — при 10k ок (кэш на час), но при росте >50k разбивать на чанки.
- **QA-7 `llms.txt`** создан — по фактчеку Google его не использует; вреда нет, но SEO-ценности не ждать (не приоритет).

## ❓ Проверить / не закрыто
- **Данные `gtin/mpn` реально залиты?** Есть `scripts/sync-gtin-mpn.ts`, но если не прогнан/нет данных — у всех `identifier_exists=no` (Merchant снизит охват). Прогнать + замерить покрытие.
- **WP-13.1 out-of-stock на странице товара** (не 404, показ аналогов) — фид availability сделан, страница — не подтверждено.
- **GS-5 Merchant Center** (аккаунт/верификация/привязка фида) — off-code, статус неизвестен.
- **Реальная доставка Нова Пошта** для `shippingDetails` (T-ORD-B) — сейчас хардкод.
- **Image-sitemap** (WP-13.3) — не подтверждено.

## Соответствие MASTER_CONTEXT
§3.3 select+take ✅ · §7 use cache ✅ · §6 схема (addendum) ✅ · anti-regression ✅ · §3.1 no any 🟡(1) · §10 no inline-style 🟡(1) · бренд Q10 🔴.
