# Требования — модуль `assistant`

> SDD (Writer, `completo`, hybrid) · Reversa. 🟢/🟡/🔴.

## Назначение
AI технический консультант (Claude): подбор оборудования, расчёт, сравнение/замена, черновик заказа.

## Функциональные требования (MoSCoW)
### Must
- **FR-AS-1** 🟢 API `/api/assistant/chat`: zod (message ≤800, locale uk/ru, history), сессии (`AssistantSession`/`AssistantMessage`).
- **FR-AS-2** 🟢 Подбор товаров по ключевым словам (Prisma, take 12) + prompt-stuffing каталога.
- **FR-AS-3** 🟢 Вызов Claude (`claude-3-5-sonnet`), парсинг JSON, zod-валидация ответа.
- **FR-AS-4** 🟢 **Регидратация из БД** (цена/наличие/имя не из LLM).
- **FR-AS-5** 🟢 Защита: фильтры prompt-injection, усечение истории до 10, rate limit (1/2с на IP).
### Should
- **FR-AS-6** 🟢 Черновик заказа и сравнение (`draft-order.ts`).
- **FR-AS-7** 🟢 Учёт стоимости токенов (лог `costUsd`).
- **FR-AS-8** 🟡 Fallback «[Демо-режим]» без ключа.
### Won't (текущее)
- **FR-AS-9** 🔴 Векторный RAG по `TechnicalDocument`/`DocumentChunk` (embedding не используется).
- **FR-AS-10** 🔴 Реальные источники (sources) вместо плейсхолдеров.

## НФТ
- **NFR-AS-1 (Security)** 🟢 Анти-инъекция, лимит длины, серверная валидация; 🟡 IP в открытом виде (PII).
- **NFR-AS-2 (Cost)** 🟢 Усечение истории + учёт токенов.
- **NFR-AS-3 (Config)** 🔴 `ANTHROPIC_API_KEY` вне `.env.example`/`env.ts`.

## Критерии приёмки
**AC-AS-1 (happy)** 🟢 Дано: запрос про ИБП; Когда: есть ключ; Тогда: ответ Claude с товарами из БД (регидратированными) + warnings.
**AC-AS-2 (инъекция, fail)** 🟢 Дано: «ignore prior instructions»; Тогда: 400 blocked.
**AC-AS-3 (rate limit)** 🟢 Дано: 2 сообщения <2с с IP; Тогда: 429.
**AC-AS-4 (нет ключа)** 🟡 Тогда: «[Демо-режим]» ответ.

## Зависимости
`catalog` (товары), `core-infra`.

## Лакуны 🔴
RAG не векторный (AS-1), sources плейсхолдеры (AS-8), ключ вне валидации (AS-2), rate-limit на скане БД (AS-5).
