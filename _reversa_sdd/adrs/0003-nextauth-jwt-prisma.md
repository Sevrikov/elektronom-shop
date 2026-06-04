# ADR-0003 — Аутентификация: NextAuth v5, стратегия JWT, PrismaAdapter

**Статус:** Принято · 🟢 подтверждено кодом

## Контекст
Нужны вход по email/паролю и соцсети (Google, Facebook), роли (CUSTOMER/MANAGER/ADMIN), серверная проверка доступа в RSC/server actions.

## Решение
NextAuth v5 (`next-auth@5 beta`) с `PrismaAdapter`, **session.strategy = "jwt"**. Провайдеры подключаются по наличию env-ключей. `role` и `id` пробрасываются в JWT и сессию через callbacks. RBAC-хелперы `requireAuth/requireAdmin/requireManager`.

## Последствия
- ➕ Stateless-сессии (JWT), не требуют чтения `Session`-таблицы на каждый запрос.
- ➕ Единая серверная проверка доступа.
- ➖ Таблица `Session` фактически не используется для хранения (только `Account` для OAuth-линковки) — рассинхрон ожиданий (🟡 A-6).
- ➖ Зависимость от **beta**-версии NextAuth 5 (риск стабильности API).
- ➖ Нет верификации email/авто-логина после регистрации (🔴 BR-AUTH-5).
