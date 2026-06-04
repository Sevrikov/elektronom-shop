# Дизайн — модуль `assistant`

> SDD (Writer, `completo`) · Reversa. 🟢/🟡/🔴.

## Файлы
- `app/api/assistant/chat/route.ts` — API (rate limit, zod, анти-инъекция, сессии, лог стоимости).
- `lib/assistant/claude.ts` — `queryAssistant`, `extractAndParseJson`, zod-схемы, регидратация.
- `lib/assistant/prompts.ts` — системный промпт; `lib/assistant/draft-order.ts` — `calculateDraftOrder`, `buildComparison`; `types.ts`.
- `components/assistant/*`, страница `(locale)/assistant`.

## Поток (см. `flowcharts/assistant.md`)
POST → IP/rate-limit → zod → анти-инъекция → история(10) → сессия → лог USER → `queryAssistant` → лог ASSISTANT+cost → ответ+sessionId.
`queryAssistant`: keywords → товары(12) → если ключ: fetch Anthropic → extract JSON → zod → **регидратация из БД** → draft/comparison; иначе fallback.

## Структуры
`ModelResponseSchema {message, questions?, products?, draftOrder?, orderComparison?, warnings?}`; `AssistantResponse` (+sources, availabilityCheckedAt). Лог в `AssistantMessage.structured`.

## Решения
[ADR-0005](../adrs/0005-ai-assistant-claude-fetch-rehydration.md).

## Риски
🔴 AS-1 нет векторного RAG; 🔴 AS-2 ключ вне валидации; 🟡 AS-5 rate-limit БД; 🟡 AS-6 raw fetch; 🟡 AS-7 IP PII; 🟡 AS-8 sources.
