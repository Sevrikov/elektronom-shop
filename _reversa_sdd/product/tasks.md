# Задачи — модуль `product`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-PR-1** Запрос товара по slug (с отзывами/изображениями/брендом/категорией).
  - Легаси: `queries/products.ts:getProductBySlug`. Готово: кэш `seconds`; only `isActive`. 🟢
- [ ] **T-PR-2** Композиция страницы + парсинг `qty_breaks`/displayAttrs.
  - Легаси: `product/[slug]/page.tsx`. Готово: hero/характеристики/описание/отзывы/похожие. 🟢
- [ ] **T-PR-3** SEO: `generateMetadata` (canonical/hreflang/OG) + JSON-LD.
  - Легаси: `page.tsx`, `components/product/product-schema.tsx`. Готово: валидная разметка uk/ru. 🟢
- [ ] **T-PR-4** Серверное действие отзыва с премодерацией и verifiedPurchase.
  - Легаси: `actions/user.ts:submitProductReview`. Готово: zod, уникальность, DELIVERED-проверка, `isVisible=false`. 🟢
- [ ] **T-PR-5** (Безопасность) Санитайз HTML описания перед рендером.
  - Легаси: `page.tsx:390` (`dangerouslySetInnerHTML`). Готово: HTML очищается (DOMPurify/sanitize) на входе/выводе. 🔴
- [ ] **T-PR-6** Унифицировать форму `qty_breaks` (реальная vs mock).
  - Легаси: `page.tsx` vs `lib/catalog-data.ts`. Готово: единая модель. 🟡
- [ ] **T-PR-7** Похожие/«та же серия».
  - Легаси: `queries/products.ts:getSimilar/getSameSeries`. Готово: бренд→категория fallback. 🟢
