# Flowcharts — модуль `assistant`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Поток обработки сообщения (API + LLM)

```mermaid
flowchart TD
  A[POST /api/assistant/chat] --> B[IP из заголовков]
  B --> C[Rate limit: скан AssistantMessage 5с]
  C -- IP в пределах 2с --> R429[429 Too many requests]
  C --> D[zod: message ≤800, locale]
  D -- invalid --> R400[400]
  D --> E{prompt-injection regex?}
  E -- да --> R400b[400 blocked]
  E --> F[История → последние 10]
  F --> G[find/create AssistantSession]
  G --> H[log USER message + IP в structured]
  H --> I[queryAssistant]
  I --> J[log ASSISTANT + costLog]
  J --> K[return response + sessionId]
```

## 2. `queryAssistant` — retrieval + LLM + регидратация

```mermaid
flowchart TD
  A[queryAssistant message,history,locale] --> B[keywords из message]
  B --> C[Prisma: товары по keywords take 12]
  C --> D{ANTHROPIC_API_KEY?}
  D -- нет --> F[Fallback: Демо-режим по ключам]
  D -- да --> E[fetch api.anthropic.com<br/>claude-3-5-sonnet, catalog в system]
  E --> G[extractAndParseJson]
  G --> H[zod ModelResponseSchema]
  H -- invalid --> F
  H -- ok --> I[Регидратация из dbProducts<br/>цена/имя/сток по id/sku]
  I --> J[draftOrder/comparison через draft-order.ts]
  J --> K[response + hardcoded sources]
  F --> K
```

## Примечания
- 🔴 Эмбеддинги/`DocumentChunk`/`TechnicalDocument` в потоке НЕ участвуют (AS-1). Диаграмма отражает фактический keyword-retrieval.
- 🟢 Шаг «Регидратация из БД» — ключевая защита от доверия ценам/наличию от LLM (AS-3).
