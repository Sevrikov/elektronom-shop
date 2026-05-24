# Sprint 1 Recheck: SEO, Locale, Header/Mobile UX

Дата: 2026-05-23
Проверяемый отчёт разработчика: Sprint 1 implementation report.

## Verdict

Статус: superseded by `REVIEW_SPRINT1_FINAL_ACCEPTANCE_2026-05-23.md`.

Локально код стал лучше и сборка проходит. Основные правки по breadcrumbs/mobile/header/search действительно внесены. Но Sprint 1 нельзя считать полностью закрытым до исправления `getSiteUrl()` под реальные Vercel env и до подтверждения live deployment: опубликованный `https://elektronom.vercel.app` всё ещё отдаёт старые SEO/locale дефекты.

## Что Подтверждено

### Автоматические проверки

Команды выполнены успешно:

```text
npm.cmd run lint          pass
npx.cmd tsc --noEmit      pass
npx.cmd prisma validate   pass
npm.cmd run build         pass
```

`npm.cmd run build` потребовал сетевой доступ к Google Fonts, после разрешения сборка прошла.

### Breadcrumbs / duplicate locale в локальной сборке

В `.next/server/app` для app HTML/RSC не найдено:

```text
localhost:3000
/uk/uk
/ru/ru
```

Проверенные локальные build pages:

- `.next/server/app/uk/product/castrol-edge-5w30-4l.html`
- `.next/server/app/ru/product/castrol-edge-5w30-4l.html`
- `.next/server/app/uk/cart.html`
- `.next/server/app/uk/search.html`

Итог: локальная сборка после изменений больше не содержит старых SEO/locale строк в app HTML.

### Header / Mobile UX

Подтверждено по diff:

- `src/components/layout/header.tsx`: Wishlist и Account стали `Link` на `/wishlist` и `/profile`.
- `src/components/layout/mobile-nav.tsx`: cart badge больше не hardcoded `3`, берётся через `getCartCount()`.
- `src/components/layout/mobile-nav.tsx`: account route изменён на `/profile`.
- `src/components/cart/cart-button.tsx`: cart count обновляется на pathname changes.
- `src/components/search/search-box.tsx`: search input обёрнут в `<form>`, submit ведёт на `/${locale}/search?q=...`.

## Оставшиеся Замечания

### P0/P1. Live Vercel всё ещё отдаёт старый HTML

Проверка live URL:

```text
https://elektronom.vercel.app/uk/product/castrol-edge-5w30-4l
localhost=True
dupUk=True
canonical=http://localhost:3000/uk/product/castrol-edge-5w30-4l

https://elektronom.vercel.app/ru/product/castrol-edge-5w30-4l
localhost=True
dupRu=True
canonical=http://localhost:3000/ru/product/castrol-edge-5w30-4l

https://elektronom.vercel.app/uk/cart
dupUk=True

https://elektronom.vercel.app/uk/search
dupUk=True
```

Interpretation:

- либо новый код ещё не задеплоен;
- либо Vercel serving cache/ISR отдаёт старую версию;
- либо production env всё ещё содержит `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

Required:

1. Выполнить fresh production deploy.
2. Проверить Vercel env.
3. Очистить/обновить кеш ISR, если страница продолжает отдавать старый HTML.
4. Повторить live smoke:
   - no `localhost:3000`;
   - no `/uk/uk`;
   - no `/ru/ru`;
   - canonical starts with expected production domain.

### P1. `getSiteUrl()` использует нестандартные Vercel env names

Текущий код:

```ts
const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL;
```

Risk:

Vercel обычно предоставляет server env:

```text
VERCEL_URL
VERCEL_PROJECT_PRODUCTION_URL
```

без `NEXT_PUBLIC_`.

Текущий helper при стандартном Vercel env-only сценарии ведёт себя так:

```text
NODE_ENV=production
VERCEL=1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
VERCEL_URL=elektronom.vercel.app

getSiteUrl() => https://elektronom.com.ua
```

То есть он не использует `VERCEL_URL`, если не создан дополнительный `NEXT_PUBLIC_VERCEL_URL`.

Recommended fix:

```ts
const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL;
```

Лучше ещё проще: для production явно задать `NEXT_PUBLIC_SITE_URL=https://elektronom.vercel.app` или будущий домен, а Vercel vars использовать только как fallback.

### P2. `localizedPath()` функционально работает, но нужен unit/smoke test

Проверенные результаты:

```text
localizedPath('uk', '/')              => /uk
localizedPath('uk', '/catalog')       => /uk/catalog
localizedPath('uk', '/uk')            => /uk
localizedPath('uk', '/uk/catalog')    => /uk/catalog
localizedPath('uk', '/ru/catalog')    => /uk/catalog
localizedPath('uk', 'catalog')        => /uk/catalog
localizedPath('uk', '//uk//catalog')  => /uk/catalog
```

Required:

- добавить маленький unit test или build-time smoke для helper;
- добавить HTML smoke после build/deploy.

## Acceptance Status

| Objective | Status |
|---|---|
| Unified locale helper | pass locally |
| Breadcrumb duplicate locale fix | pass locally |
| Product schema uses site URL helper | pass locally |
| Sitemap/robots use site URL helper | pass locally |
| Mobile cart badge not hardcoded | pass |
| Mobile account route `/profile` | pass |
| Header wishlist/account links | pass |
| Search form submit | pass |
| Local lint/tsc/prisma/build | pass |
| Live Vercel no localhost | fail/not deployed |
| Live Vercel no `/uk/uk` `/ru/ru` | fail/not deployed |
| Vercel env fallback robustness | needs fix |

## Final Recommendation

Sprint 1 можно считать закрытым по локальному коду после одного дополнительного исправления `getSiteUrl()` под стандартные Vercel env names.

Sprint 1 нельзя считать закрытым по live-сайту, пока опубликованный HTML всё ещё содержит:

```text
localhost:3000
/uk/uk
/ru/ru
```

Next action for developer:

1. Исправить `getSiteUrl()` fallback.
2. Убедиться, что Vercel env `NEXT_PUBLIC_SITE_URL` задан корректно.
3. Сделать fresh deploy.
4. Приложить live smoke output по четырём URL:
   - `/uk/product/castrol-edge-5w30-4l`
   - `/ru/product/castrol-edge-5w30-4l`
   - `/uk/cart`
   - `/uk/search`

## Final Update

Повторная проверка после нового deploy прошла успешно. Sprint 1 закрыт в:

`REVIEW_SPRINT1_FINAL_ACCEPTANCE_2026-05-23.md`
