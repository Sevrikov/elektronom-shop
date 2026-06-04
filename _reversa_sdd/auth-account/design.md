# Дизайн — модуль `auth-account`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `lib/auth.ts` — конфиг NextAuth v5 (PrismaAdapter, JWT, провайдеры, callbacks), `requireAuth/requireAdmin/requireManager`.
- `actions/auth.ts` — `registerUser`.
- `actions/user.ts` — `updateProfile`, `changePassword`, `toggleWishlist`, `getWishlist*`, `removeFromWishlist`, `submitProductReview`.
- `app/api/auth/[...nextauth]/route.ts`; страницы `(auth)/login|register`, `(account)/profile|orders|wishlist`.

## Поток (см. `flowcharts/auth-account.md`)
- Регистрация: zod → проверка email → bcrypt → create.
- Вход: Credentials.authorize → bcrypt.compare → jwt callback (id/role) → session callback.
- RBAC: хелперы бросают `UNAUTHORIZED`/`FORBIDDEN`.

## Структуры
`RegisterSchema {name,email,password}`, `UpdateProfileSchema {name}`, `ChangePasswordSchema`, `WishlistSchema {productId}`; сессия `{user:{id,role,...}}`.

## Решения
[ADR-0003](../adrs/0003-nextauth-jwt-prisma.md). Права — `permissions.md`.

## Риски
🟡 A-3 хардкод `/uk/login`; 🟡 A-6 Session-таблица не используется; 🔴 A-2 верификация email; 🔴 A-1 адреса.
