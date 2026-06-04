# Дизайн — модуль `product`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `app/[locale]/(shop)/product/[slug]/page.tsx` — RSC-страница (композиция, `generateStaticParams`, `generateMetadata`, `QtyBreaksTable`).
- `queries/products.ts` — `getProductBySlug`, `getSimilarProducts`, `getSameSeriesProducts`.
- `actions/user.ts` — `submitProductReview`.
- `components/product/*` — `product-gallery`, `product-attributes`, `product-reviews`, `product-schema` (JSON-LD), `same-series-products`, `related-products-section`.

## Поток (см. `flowcharts/product.md`)
1. `getProductBySlug(slug, locale)` → notFound при null.
2. Парсинг `attributes`: выделение `qty_breaks` (`{min,discount}[]`), остальное → displayAttrs.
3. Рендер hero (галерея/цена/AddToCart/qty-breaks) + характеристики + описание (HTML) + отзывы + похожие/серия (Suspense).
4. Отзыв: `submitProductReview` → проверки (auth, zod, уникальность, DELIVERED) → create `isVisible=false`.

## Структуры
`Product` (+images/translations/reviews/brand/category); форма отзыва `{productId,rating,comment,advantages?,disadvantages?}`; `qty_breaks {min:number,discount:number}`.

## Решения
SEO hreflang/JSON-LD; ISR top-1000. Премодерация отзывов (см. `state-machines.md` §3).

## Риски
- 🔴 P-1 XSS (`dangerouslySetInnerHTML`). 🟡 P-2 qty_breaks форма. 🟡 P-4 объём ISR. 🟡 P-5 бренд Electronom/Elektronom.
