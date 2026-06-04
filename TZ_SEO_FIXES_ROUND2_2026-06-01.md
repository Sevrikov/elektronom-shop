# ТЗ — SEO/Shopping доводка (раунд 2): sitemap, post-deploy, QA-фиксы

> Дата: 2026-06-01. Основано на QA-ревью (`_reversa_sdd/qa-review-seo-shopping-2026-06-01.md`), аудите sitemap и проблемах после деплоя.
> Контекст/правила: `MASTER_CONTEXT` + `ADDENDUM_GOOGLE_SHOPPING`; перед сдачей — `lint`/`tsc`/`build` зелёные; **§0 anti-regression** (`TZ_FIXES_MASTER`).

## Порядок (топ — быстрые и важные)
**P0:** S-1 (sitemap 200), Q-1 (бренд), PD-2 (INP bg-removal), PD-1 (verify ru.json) → **P1:** остальной sitemap, Q-2..Q-5, PD-3.

---

## Блок 1 — Sitemap (`src/app/sitemap.ts`) — P0

### S-1 🔴 Снять лимит `take: 200` на товары
Сейчас в карту попадают только 200 из 10 000+ SKU — остальные не индексируются.
- Убрать `take: 200` (включить ВСЕ `isActive` товары). Лимит Google — 50 000 URL/sitemap; 10k×2 локали = 20k влезает в один файл.
- Если каталог вырастет >25 000 товаров (×2 локали >50k) — разбить через `generateSitemaps` (чанки по 50k).
- **Приёмка:** в GSC sitemap показывает ~все активные товары; нет ошибки «too many URLs».

### S-2 🟡 Убрать `/cart` из карты
`/cart` — приватная/динамическая, в sitemap не нужна. Убрать из массива `routes` (оставить `''`, `/catalog`, `/blog`; добавить `/brands` индексную, info-страницы).

### S-3 🟡 hreflang-альтернаты в записях
Сейчас uk/ru идут отдельными URL без связки. Добавить в каждую запись:
```ts
alternates: { languages: {
  uk: `${baseUrl}/uk${path}`,
  ru: `${baseUrl}/ru${path}`,
} }
```
(или один entry на контент с languages). **Приёмка:** GSC «International Targeting» без ошибок hreflang.

### S-4 🟡 Добавить индексируемые фасет-лендинги (WP-2)
Сгенерировать URL whitelisted quick-links из `src/lib/catalog-filter-config.ts` (`categoryFilterConfig[*].quickLinks` с `filter`): для каждой категории+quickLink → `${baseUrl}/${locale}/catalog/${slug}?${key}=${value}`, priority ~0.6. Это страницы, которые помечены `index` в `generateMetadata` — Google должен их видеть и через карту.

### S-5 (опц.) Image-sitemap
Добавить `images: [mainImageUrl]` в записи товаров (Google Картинки).

> `robots.ts` — **не трогать**: staging-guard (vercel/localhost/test → disallow) и прод-правила корректны.

---

## Блок 2 — Проблемы после деплоя — P0/P1

### PD-1 ✅ Дубль ключа `admin` в `ru.json` — УЖЕ ИСПРАВЛЕНО (в ревью)
Блоки слиты в один. **Разработчику:** прогнать `build`, убедиться что 2 warning'а ушли; проверить, что нет других `Duplicate object key` в `uk.json`/`ru.json`, и что наборы ключей uk↔ru совпадают (§12).

### PD-2 🔴 «Шахматка» на главном баннере + INP (`src/components/home/hero-carousel.tsx`)
- Контейнер за товаром показывает checkerboard-фон (превью прозрачности) — заменить на реальную брендовую поверхность.
- **Корень:** `TransparentImage` (`components/shared/transparent-image.tsx`) делает **bg-removal на клиенте** — тяжёлый canvas BFS/distance-transform (до 800×800, неск. проходов) на главном потоке, в LCP-зоне. Бьёт по **INP/LCP**.
- **Решение:** перенести удаление фона **на сервер** (Cloudinary AI — уже подключён), хранить готовые прозрачные PNG в `ProductImage`, рендерить обычным `next/image`. На главной/в карточках не запускать client-canvas. (Закрывает и шахматку, и Core Web Vitals.)
- **Приёмка:** на баннере нет шахматки; INP(p98)<200мс, LCP<2.5с (CrUX/Lighthouse mobile); `TransparentImage` не используется на above-the-fold.

### PD-3 🟡 McAfee WebAdvisor блокирует контент
- Проверить на **боевом домене** `elektronom.com.ua` (на превью `*.vercel.app` блок ожидаем — низкая репутация домена).
- Через «Просмотреть всё заблокированное содержимое» найти конкретный флагнутый внешний ресурс; вероятные источники: cross-origin фетчи `TransparentImage` (cache-buster), внешние картинки, трекеры/виджеты. Убрать/заменить флагнутый ресурс.
- **Приёмка:** на боевом домене WebAdvisor не блокирует; в Network нет ресурсов с подозрительных доменов.

---

## Блок 3 — Остатки QA-ревью — P1

### Q-1 🔴 Унификация бренда → `Electronom` (C, латиница)
Разнобой Elektronom/Electronom. Привести ВСЕ бренд-тексты к **`Electronom`**:
- `app/[locale]/layout.tsx:45` (OG `siteName`), `(shop)/catalog/[slug]/page.tsx:84,104`, `(shop)/product/[slug]/page.tsx:68,79`, `(shop)/assistant/page.tsx:19,20`.
- `lib/assistant/prompts.ts`, `lib/assistant/claude.ts`, `components/assistant/assistant-panel.tsx`.
- `lib/email.ts:57,102`; i18n `messages/uk.json`/`ru.json` (greeting/lead/policy).
- **НЕ трогать** домен/email `elektronom.com.ua` (K). Проверить гомоглиф (кириллическая `с`) и опечатки `Electrononom`/`Elektrononom`.
- **Приёмка:** grep `Elektronom` по `src` (без `generated`) не находит бренд-текстов (только домен/URL).

### Q-2 🟡 Убрать `any` (`components/seo/answer-block.tsx:11-12`)
`matchingQuickLink?: any` — типизировать (тип quickLink из `catalog-filter-config`). §3.1.

### Q-3 🟡 Реальные NAP в Organization (`app/[locale]/layout.tsx`)
Сейчас заглушки: адрес «Промислова 12», тел. `+380501234567`, соц-URL. Заменить реальными (или вынести в `config`/seed). Связано с GBP/локальным SEO (WP-12).

### Q-4 🟡 Убрать inline `style={{}}` с `<body>` (`app/[locale]/layout.tsx:123`)
`style={{ background: 'var(--color-surface-alt)' }}` → Tailwind-класс/токен. §10.

### Q-5 🟡 Данные gtin/mpn + out-of-stock
- Прогнать `scripts/sync-gtin-mpn.ts`, прислать % товаров с `gtin`/`mpn` (без них фид → `identifier_exists=no`, Merchant урезает охват).
- **Out-of-stock на странице товара:** не 404/редирект — сохранять URL, `availability=OutOfStock`, показывать «під замовлення»/аналоги (WP-13.1).

---

## Чек-лист приёмки раунда
- [ ] sitemap содержит все активные товары (GSC), без `/cart`, с hreflang.
- [ ] Главная без шахматки; INP/LCP в зелёной зоне (mobile).
- [ ] `ru.json`/`uk.json` без дублей ключей, паритет ключей.
- [ ] Бренд `Electronom` единообразно (grep чистый); домен elektronom.com.ua не тронут.
- [ ] Нет `any`/inline-`style` в новых местах; NAP реальные.
- [ ] `sync-gtin-mpn` прогнан, % покрытия прислан.
- [ ] `npm run lint` / `tsc --noEmit` / `npm run build` — зелёные.
