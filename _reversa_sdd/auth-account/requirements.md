# Требования — модуль `auth-account`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
Аутентификация (credentials + OAuth), RBAC, профиль, смена пароля, wishlist.

## Функциональные требования (MoSCoW)
### Must
- **FR-AUTH-1** 🟢 Регистрация: email/пароль (≥6), уникальный email, bcrypt cost 10.
- **FR-AUTH-2** 🟢 Вход: Credentials (bcrypt) + Google/Facebook (если env заданы); JWT-сессия с `id`+`role`.
- **FR-AUTH-3** 🟢 RBAC: `requireAuth/requireAdmin/requireManager`.
- **FR-AUTH-4** 🟢 Профиль (имя), смена пароля (запрет для OAuth).
- **FR-AUTH-5** 🟢 Wishlist: toggle/list/remove (лимиты 200/100).
### Should
- **FR-AUTH-6** 🟡 Кабинет: профиль, заказы, wishlist.
### Won't (текущее)
- **FR-AUTH-7** 🔴 Верификация email / авто-логин после регистрации (`VerificationToken` не задействован).
- **FR-AUTH-8** 🔴 CRUD сохранённых адресов (`Address`).

## НФТ
- **NFR-AUTH-1 (Security)** 🟢 bcrypt(10), zod-валидация, серверная проверка ролей; пароли не возвращаются.
- **NFR-AUTH-2 (i18n)** 🟡 Страницы логина — `/uk/login` (хардкод локали, A-3).

## Критерии приёмки
**AC-AUTH-1 (happy)** 🟢 Дано: новый email; Когда: регистрация; Тогда: пользователь создан, пароль захеширован.
**AC-AUTH-2 (дубль email, fail)** 🟢 Тогда: «Користувач з таким email вже існує».
**AC-AUTH-3 (смена пароля OAuth, fail)** 🟢 Дано: нет `passwordHash`; Тогда: «Неможливо змінити пароль для OAuth-акаунту».
**AC-AUTH-4 (RBAC, fail)** 🟢 Дано: не-ADMIN; Когда: админ-действие; Тогда: throw FORBIDDEN.

## Зависимости
`core-infra` (Prisma, env, auth).

## Лакуны 🔴
Верификация email (A-2), адреса (A-1), неиспользуемый MANAGER, профиль только name (A-4).
