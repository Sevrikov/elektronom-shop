# Flowcharts — модуль `auth-account`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Аутентификация (NextAuth v5)

```mermaid
flowchart TD
  subgraph Регистрация
    R1[registerUser name,email,pass] --> R2[zod ≥6]
    R2 --> R3{email занят?}
    R3 -- да --> RE[error вже існує]
    R3 -- нет --> R4[bcrypt.hash cost10]
    R4 --> R5[user.create] --> R6[success — БЕЗ авто-логина/верификации]
  end
  subgraph Вход
    L1[Credentials authorize] --> L2[zod email+pass]
    L2 --> L3[user по email]
    L3 --> L4{passwordHash есть?}
    L4 -- нет --> LN[null OAuth-юзер]
    L4 -- да --> L5[bcrypt.compare]
    L5 -- ok --> L6[jwt: token.id, token.role]
    L6 --> L7[session.user.id, role]
  end
```

## 2. RBAC-гейтинг (хелперы)

```mermaid
flowchart LR
  A[requireAuth] --> B{session.user?}
  B -- нет --> X[throw UNAUTHORIZED]
  B -- да --> C[user]
  C --> D[requireManager: role∈ADMIN,MANAGER else FORBIDDEN]
  C --> E[requireAdmin: role==ADMIN else FORBIDDEN]
```

## 3. Toggle wishlist (идемпотентно)

```mermaid
flowchart TD
  A[toggleWishlist productId] --> B{auth?}
  B -- нет --> E[error Неавторизовано]
  B -- да --> C{запись есть?}
  C -- да --> D[delete → added=false]
  C -- нет --> F[create → added=true]
```

## Примечания
- Verification email/VerificationToken не задействованы (находка A-2).
- Адреса (`Address`) не управляются действиями (A-1); checkout снапшотит `customerData`.
