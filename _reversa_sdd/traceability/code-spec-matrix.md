# Матрица код ↔ спецификация — Elektronom

> Артефакт **Writer** (`completo`) · Reversa. Покрытие: 🟢 полное · 🟡 частичное · n/a — нет unit.

| Файл легаси | Unit (spec) | Покрытие |
|-------------|-------------|----------|
| `src/queries/products.ts` | `catalog/`, `product/` | 🟢 |
| `src/queries/categories.ts` | `catalog/` | 🟢 |
| `src/queries/brands.ts` | `catalog/` | 🟢 |
| `src/lib/catalog-filter-url.ts` | `catalog/` | 🟢 |
| `src/lib/catalog-filter-config.ts` | `catalog/` | 🟢 |
| `src/lib/catalog-data.ts` | `catalog/` | 🟡 (mock-данные) |
| `src/lib/catalog-tree.ts`, `catalog-hub-data.ts`, `config/catalog-mega-menu.ts` | `catalog/` | 🟡 |
| `src/app/[locale]/(shop)/product/[slug]/page.tsx` | `product/` | 🟢 |
| `src/components/product/*` | `product/` | 🟡 (UI) |
| `src/actions/order.ts` | `cart-checkout-orders/` | 🟢 |
| `src/actions/cart.ts` | `cart-checkout-orders/` | 🟢 |
| `src/queries/orders.ts` | `cart-checkout-orders/` | 🟢 |
| `src/store/cart-store.ts`, `hooks/use-cart.ts` | `cart-checkout-orders/` | 🟢 |
| `src/lib/auth.ts` | `auth-account/` | 🟢 |
| `src/actions/auth.ts` | `auth-account/` | 🟢 |
| `src/actions/user.ts` | `auth-account/`, `product/` (отзыв) | 🟢 |
| `src/app/api/auth/[...nextauth]/route.ts` | `auth-account/` | 🟢 |
| `src/lib/assistant/*` | `assistant/` | 🟢 |
| `src/app/api/assistant/chat/route.ts` | `assistant/` | 🟢 |
| `src/lib/algolia.ts`, `actions/search.ts`, `queries/search.ts` | `search/` | 🟢 |
| `src/actions/admin.ts` | `admin/` | 🟢 |
| `src/app/api/admin/upload/route.ts` | `admin/` | 🟢 |
| `src/components/admin/*` | `admin/` | 🟡 (UI) |
| `src/actions/get-asko-products.ts`, `analyze-products.ts` | `suppliers/` | 🟡 (рудимент) |
| `prisma/schema.prisma` (SupplierInventory) | `suppliers/` | 🟡 |
| `src/lib/prisma.ts`, `env.ts`, `storage.ts`, `images.ts` | `core-infra/` | 🟢 |
| `src/i18n/request.ts`, `lib/utils.ts`, `logger.ts`, `constants.ts` | `core-infra/` | 🟢 |
| `src/queries/workload.ts` | — | n/a (индикатор загрузки, не покрыт unit'ом) |
| `src/components/home/*`, `layout/*`, `shared/*`, `ui/*` | — | n/a (презентационный слой) |
| `src/components/assistant/*`, `cart/*`, `search/*` | соответствующие модули | 🟡 (UI) |

## Оценка покрытия
- **Серверная логика (actions/queries/lib):** ~🟢 95% покрыто unit'ами.
- **UI-компоненты:** 🟡 покрыты на уровне модулей (не отдельные компоненты).
- **Не покрыто (n/a):** `queries/workload.ts` (индикатор загрузки), презентационные `components/home|layout|shared|ui`, домашняя страница/баннеры (вне доменной логики).
- **Итого оценка покрытия логики:** ~90%.

## Кандидаты на доп. анализ
`queries/workload.ts`, `components/home/*` (баннеры/мегаменю — много git-активности), `instrumentation.ts`.
