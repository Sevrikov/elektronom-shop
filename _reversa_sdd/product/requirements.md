# Требования — модуль `product`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
Карточка товара: галерея, характеристики, цена/скидка/наличие, оптовые цены, отзывы с премодерацией, похожие/«та же серия», SEO.

## Функциональные требования (MoSCoW)
### Must
- **FR-PR-1** 🟢 Страница `/[locale]/product/[slug]` с данными по `getProductBySlug` (переводы по locale, изображения, бренд, категория, видимые отзывы).
- **FR-PR-2** 🟢 Цена + `comparePrice` (если > price) + % скидки; наличие `stock>0`.
- **FR-PR-3** 🟢 Характеристики из `attributes` (кроме `qty_breaks`).
- **FR-PR-4** 🟢 Отзыв: создание авторизованным, премодерация (`isVisible=false`), `verifiedPurchase` по DELIVERED-заказу, 1 на пользователя+товар.
- **FR-PR-5** 🟢 SEO: canonical, hreflang (uk/ru/x-default), OpenGraph, JSON-LD (`product-schema`).
### Should
- **FR-PR-6** 🟢 Оптовые цены (`qty_breaks`): таблица `base×(1−discount/100)`.
- **FR-PR-7** 🟢 Похожие (`getSimilarProducts`) и «та же серия» (`getSameSeriesProducts`).
- **FR-PR-8** 🟢 ISR: `generateStaticParams` (топ-1000×2 локали).
### Could
- **FR-PR-9** 🟡 Trust-сайдбар (доставка/возврат/гарантия/B2B-оплата с НДС).

## НФТ
- **NFR-PR-1 (Performance)** 🟢 `'use cache'` `seconds` на товар; ISR ~2000 страниц.
- **NFR-PR-2 (Security)** 🔴 Описание через `dangerouslySetInnerHTML` — требуется санитайз HTML на входе.

## Критерии приёмки
**AC-PR-1 (happy)** 🟢 Дано: активный товар; Когда: открыта карточка; Тогда: цена/наличие/характеристики/галерея/SEO отрендерены.
**AC-PR-2 (отзыв, fail)** 🟢 Дано: пользователь уже оставил отзыв; Когда: повторная отправка; Тогда: ошибка «вже залишили відгук».
**AC-PR-3 (verifiedPurchase)** 🟢 Дано: есть DELIVERED-заказ с товаром; Когда: отзыв создан; Тогда: `verifiedPurchase=true`, `isVisible=false`.

## Зависимости
`catalog`, `cart-checkout-orders` (AddToCart, проверка покупки), `auth-account`, `core-infra`.

## Лакуны 🔴
- Санитайз HTML описания (P-1). Несогласованность форм `qty_breaks` (P-2).
