# Flowcharts — модуль `core-infra`

> Артефакт **Archaeologist** (`completo`) · Mermaid. Уверенность 🟢.

## 1. Валидация окружения (старт приложения)

```mermaid
flowchart TD
  A[Импорт env.ts] --> B[zod safeParse process.env]
  B -- success --> C[export env = data]
  B -- fail --> D{NODE_ENV == production?}
  D -- да --> E[throw — fail-fast]
  D -- нет --> F[лог ошибок + продолжить с process.env]
  C --> G[Cloudinary refine: всё-или-ничего]
```

## 2. Выбор провайдера хранилища изображений

```mermaid
flowchart TD
  A[uploadProductImage file] --> B[File или base64 → buffer]
  B --> C{Cloudinary настроен?}
  C -- да --> D[upload_stream → CLOUDINARY url]
  C -- нет --> E{NODE_ENV dev?}
  E -- да --> F[запись в public/uploads → LOCAL url]
  E -- нет --> G[throw — нельзя локально в проде]
```

## 3. Резолв локали (next-intl)

```mermaid
flowchart LR
  A[requestLocale] --> B{isValidLocale uk/ru?}
  B -- нет --> N[notFound]
  B -- да --> C[import messages/locale.json]
  C --> D[locale + messages]
```

## Примечания
- 🟡 `ANTHROPIC_API_KEY`, `CONTENT_FACTORY_*` не проходят через схему `env.ts` (CI-3) — диаграмма 1 не покрывает их.
- 🟢 Удаление локальных файлов защищено от path traversal (как в upload-роуте).
