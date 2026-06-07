# A12-2.3 Article Schema QA

## Scope
Валидация корректности генерации и внедрения микроразметки `Article` / `BlogPosting` в формате JSON-LD для детальных страниц блога на сайте Electronom в рамках этапа Alpha 1.2. Проверка выполнена на двух языковых версиях страниц:
- `/uk/blog/yak-obraty-avtomatychy-vymykach` (украинская локаль)
- `/ru/blog/yak-obraty-avtomatychy-vymykach` (русская локаль)

## Environment
- **Branch:** `codex/alpha-1-2-authority-seo-ai`
- **Commit:** `497d6b7 feat(alpha-1.2): add flagged article schema`
- **Server:** `Next.js 16.2.3 Dev Server (Turbopack)`
- **Flag Control Method:** Добавление/удаление переменной `alpha12_article_schema_enabled` в `.env`

## Flag OFF Result
При значении `alpha12_article_schema_enabled=false` или при ее отсутствии в конфигурационном файле `.env`:
- Страницы детального просмотра статей отображаются без ошибок.
- Тег `<script type="application/ld+json">` со схемой `Article` / `BlogPosting` / `TechArticle` **не рендерится**.
- Никаких изменений в итоговой разметке HTML по сравнению с оригинальным кодом нет.

## Flag ON Result
При значении `alpha12_article_schema_enabled=true` в файле `.env`:
- На страницах статей успешно генерируется и вставляется в HTML страницы тег `<script type="application/ld+json">` внутри server-rendered blog detail page. Размещение не в `<head>` не является блокером для JSON-LD, так как разметка присутствует в исходном HTML.
- Структурированные данные корректно парсятся и содержат все обязательные поля.

## Required Fields
Сгенерированная схема содержит следующие поля:
- `@context`: `"https://schema.org"`
- `@type`: `"BlogPosting"` (или `"TechArticle"`, если тип задан в свойствах статьи)
- `headline`: Заголовок статьи (соответственно языковой версии)
- `description`: Краткое описание статьи (соответственно языковой версии)
- `mainEntityOfPage`: Объект `{"@type": "WebPage", "@id": "<абсолютный URL статьи>"}`
- `url`: Абсолютный URL статьи (с использованием `getSiteUrl()`)
- `image`: абсолютный URL изображения статьи; для внешних URL используется исходное значение, для относительных URL добавляется `getSiteUrl()`.
- `datePublished`: `"2026-05-10"`
- `dateModified`: `"2026-05-10"`
- `inLanguage`: Код языка (`"uk"` или `"ru"`)
- `publisher`: Объект `{"@type": "Organization", "name": "Electronom", ...}`

## Forbidden Fields
Схема полностью очищена от потенциально недостоверных E-E-A-T сигналов в соответствии с требованиями безопасности:
- Поля `Person`, `Author`, `author`, `reviewedBy` **полностью отсутствуют** в JSON-LD разметке.

## Validation
Все локальные статические проверки пройдены успешно:
- `npm run lint`: успешно (0 ошибок, только 8 старых предупреждений репозитория)
- `npx tsc --noEmit`: успешно (0 ошибок типизации)
- `npm run build`: успешно (проект собирается в продакшен-бандл без ошибок)
- `git diff --check`: успешно (нет ошибок форматирования или лишних пробелов)

## Git Status
Файл конфигурации `.env` и нецелевой Excel-отчет `export-products-31-05-26_02-51-11.xlsx` исключены из коммита.
Локальный статус перед отправкой:
```text
?? export-products-31-05-26_02-51-11.xlsx
?? REPORT_ALPHA_1_2_ARTICLE_SCHEMA_QA_2026-06-08.md
```

## Conclusion
Внедрение микроразметки `ArticleSchema` за фич-флагом выполнено безопасно и корректно, полностью соответствуя архитектурным требованиям и правилам репозитория.
