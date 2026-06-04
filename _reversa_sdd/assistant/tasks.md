# Задачи — модуль `assistant`

> SDD (Writer, `completo`) · Reversa.

- [ ] **T-AS-1** API-маршрут: rate limit + zod + анти-инъекция + сессии + лог.
  - Легаси: `app/api/assistant/chat/route.ts`. Готово: 429/400-ветки, лог USER/ASSISTANT, costLog. 🟢
- [ ] **T-AS-2** `queryAssistant`: retrieval + вызов Claude + zod + регидратация.
  - Легаси: `lib/assistant/claude.ts`. Готово: keywords→товары→Anthropic→JSON→БД-регидратация. 🟢
- [ ] **T-AS-3** Черновик заказа и сравнение.
  - Легаси: `lib/assistant/draft-order.ts`. Готово: `calculateDraftOrder`, `buildComparison`. 🟢
- [ ] **T-AS-4** Fallback «[Демо-режим]».
  - Легаси: `claude.ts:313-459`. Готово: ответы по ключам без API. 🟡
- [ ] **T-AS-5** (Долг) Векторный RAG: эмбеддинги `DocumentChunk`, поиск по близости.
  - Легаси: модели `TechnicalDocument`/`DocumentChunk` (не используются). Готово: реальный retrieval + источники. 🔴
- [ ] **T-AS-6** (Безопасность/конфиг) Внести `ANTHROPIC_API_KEY` в `env.ts`/`.env.example`; вынести IP из открытого лога; rate-limit на индексируемом хранилище.
  - Легаси: `route.ts`, `env.ts`. Готово: валидация ключа, без PII в открытом виде, надёжный лимит. 🔴
- [ ] **T-AS-7** (Опц.) Перейти на официальный `@anthropic-ai/sdk` (ретраи/стриминг/tool-use).
  - Легаси: raw fetch в `claude.ts`. Готово: SDK-клиент. 🟡
