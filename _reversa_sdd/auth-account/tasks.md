# Задачи — модуль `auth-account`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-AUTH-1** Конфиг NextAuth v5 (PrismaAdapter, JWT, провайдеры, callbacks).
  - Легаси: `lib/auth.ts`. Готово: Credentials+OAuth (env-gated), id/role в сессии. 🟢
- [ ] **T-AUTH-2** RBAC-хелперы.
  - Легаси: `lib/auth.ts:108-130`. Готово: requireAuth/Admin/Manager. 🟢
- [ ] **T-AUTH-3** Регистрация (bcrypt, уникальный email).
  - Легаси: `actions/auth.ts:registerUser`. Готово: zod, hash(10). 🟢
- [ ] **T-AUTH-4** Профиль и смена пароля (запрет OAuth).
  - Легаси: `actions/user.ts:updateProfile/changePassword`. Готово: проверка текущего, hash нового. 🟢
- [ ] **T-AUTH-5** Wishlist CRUD.
  - Легаси: `actions/user.ts:toggleWishlist/getWishlist/remove`. Готово: идемпотентный toggle, лимиты. 🟢
- [ ] **T-AUTH-6** (Долг) Верификация email + авто-логин.
  - Легаси: модель `VerificationToken` (не используется). Готово: письмо-подтверждение через Resend. 🔴
- [ ] **T-AUTH-7** (Долг) CRUD адресов + привязка к заказу.
  - Легаси: модель `Address` (без действий). Готово: управление адресами в кабинете. 🔴
- [ ] **T-AUTH-8** Локализация страниц логина (убрать хардкод `/uk/login`).
  - Легаси: `lib/auth.ts:100-103`. Готово: редирект по текущей локали. 🟡
