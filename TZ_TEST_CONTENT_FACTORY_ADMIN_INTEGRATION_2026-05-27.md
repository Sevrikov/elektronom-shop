# ТЗ на тестирование интеграции AI Content Factory в админку Electronom

Дата: 2026-05-27  
Проект сайта: `C:\Users\sevri\Сайт\elektronom`  
Админка: `http://localhost:3000/uk/admin`  
Локальная фабрика: `http://127.0.0.1:8028`

## 1. Цель тестирования

Проверить полный MVP-цикл интеграции админки товаров Electronom с локальной AI Content Factory:

- запуск AI-задачи из строки товара;
- создание `factory_run` в Content Factory;
- создание `local-agent job`;
- отображение AI-статуса в таблице товаров;
- открытие модалки результата;
- выполнение safe-задачи локальным агентом;
- корректное разделение текстовых и визуальных задач.

## 2. Ключевые файлы реализации

В проекте сайта:

- `src/actions/admin.ts`
- `src/components/admin/products/admin-products-tab.tsx`
- `src/components/admin/products/product-admin-table.tsx`
- `src/components/admin/products/product-ai-factory-modal.tsx`
- `src/components/admin/products/product-ai-factory-result-modal.tsx`
- `TZ_CONTENT_FACTORY_ADMIN_INTEGRATION_2026-05-27.md`

В проекте фабрики:

- `backend/app/api/cms_admin_factory.py`
- `backend/app/api/local_agent_jobs.py`
- `backend/app/services/local_agent_runner.py`

## 3. Предусловия

Перед тестированием должно быть выполнено:

1. Сайт Electronom запущен на:

```text
http://localhost:3000
```

2. Content Factory запущена на:

```text
http://127.0.0.1:8028
```

3. В `.env` сайта настроен мост:

```env
CONTENT_FACTORY_API_URL=http://127.0.0.1:8028
CONTENT_FACTORY_TOKEN=
```

4. Пользователь авторизован как администратор.

5. В админке есть хотя бы один товар с:

- названием;
- SKU;
- категорией;
- ценой;
- описанием;
- хотя бы одним изображением.

## 4. Архитектурная схема MVP

На текущем этапе Electronom и Content Factory используют разные базы данных. Поэтому админка передает товар в фабрику как `custom`-источник.

Используемая схема связи:

```text
source_type = custom
source_id = electronom:{productId}
```

Пример:

```json
{
  "source_type": "custom",
  "source_id": "electronom:ckxx_product_id",
  "action_type": "main_image_infographic",
  "language": "uk-UA",
  "provider_mode": "mock"
}
```

Подробный контекст товара передается в `operator_notes` в формате Markdown.

## 5. Что должен проверить тестировщик в UI

### 5.1 Открытие админки

Открыть:

```text
http://localhost:3000/uk/admin
```

Если открывается login-страница:

```text
http://localhost:3000/uk/login?callbackUrl=/uk/admin
```

нужно авторизоваться под администратором и перейти в админку.

### 5.2 Проверка вкладки товаров

В админке открыть вкладку товаров.

Проверить:

- таблица товаров загружается;
- видны товары;
- у товара есть меню действий;
- открытие меню не ломает верстку;
- в меню есть пункт `AI Factory`.

### 5.3 Проверка модалки запуска AI Factory

В меню товара нажать:

```text
AI Factory
```

Ожидаемое поведение:

- открывается модальное окно `AI Content Factory`;
- отображается название выбранного товара;
- есть выбор задачи;
- есть выбор provider mode;
- есть поле заметок оператора;
- есть чекбокс full-auto режима;
- есть кнопки отмены и запуска.

Проверить доступные задачи:

- `product_description`;
- `main_image_infographic`;
- `description_infographic`;
- `article`;
- `video`;
- `shorts`.

Проверить доступные provider mode:

- `mock`;
- `manual`;
- `cheap`;
- `quality`.

### 5.4 Проверка предупреждения full-auto режима

Включить full-auto режим.

Нажать запуск.

Ожидаемо:

- появляется системное предупреждение;
- без подтверждения задача не запускается;
- после подтверждения задача запускается.

## 6. Основной позитивный сценарий

### Сценарий A: запуск главного инфографического изображения

Параметры:

```text
action_type = main_image_infographic
provider_mode = mock
full-auto = off
```

В notes можно оставить стандартный текст или указать:

```text
Использовать реальные фото товара. Не добавлять цену в изображение. Найти боль покупателя и закрыть ее короткой инфографикой.
```

Ожидаемый результат в UI:

- модалка закрывается;
- появляется toast `AI Factory queued...`;
- рядом с названием товара появляется AI-бейдж;
- бейдж кликабельный;
- в меню товара появляется/работает `Open AI result`.

Ожидаемый результат в Factory API:

```text
GET http://127.0.0.1:8028/api/cms-admin/factory-runs?limit=10
```

Нужно найти запись:

```json
{
  "source_type": "custom",
  "source_id": "electronom:{productId}",
  "action_type": "main_image_infographic"
}
```

Статус на старте обычно:

```text
brief_ready
```

Проверить local-agent job:

```text
GET http://127.0.0.1:8028/api/local-agent/jobs?limit=10
```

Ожидаемо:

```json
{
  "job_type": "factory_run.execute",
  "target_type": "factory_run",
  "status": "queued"
}
```

Для визуальной задачи в `payload_json` должно быть:

```json
{
  "generate_asset": true
}
```

## 7. Проверка local agent runner

В проекте фабрики выполнить:

```powershell
cd "C:\Users\sevri\Documents\New project\backend"
..\ .venv\Scripts\python.exe -m app.cli run-local-agent-once --agent-id desktop-admin-test
```

Если команда с относительным путем не сработает, использовать полный путь:

```powershell
cd "C:\Users\sevri\Documents\New project\backend"
"C:\Users\sevri\Documents\New project\.venv\Scripts\python.exe" -m app.cli run-local-agent-once --agent-id desktop-admin-test
```

Ожидаемый результат:

```text
Local agent: checked=1 claimed=1 completed=1 failed=0
```

После выполнения runner-а обновить админку.

Ожидаемо:

- AI-бейдж меняет статус;
- `Open AI result` открывает актуальный результат;
- local-agent статус отображается в модалке результата.

## 8. Проверка модалки результата

Открыть результат одним из способов:

- клик по AI-бейджу рядом с названием товара;
- меню товара -> `Open AI result`.

В модалке проверить:

- заголовок содержит `action_type / status`;
- отображается ID `factory_run`;
- есть метрики:
  - `Run`;
  - `Gate`;
  - `Mode`;
  - `Local agent`;
- есть таблица steps;
- видны шаги:
  - `source_import`;
  - `pain_research`;
  - `data_pack`;
  - `brief`;
  - после runner-а также могут быть `generation`, `qa`, `asset_generation`;
- есть JSON-блок local agent;
- есть JSON-блок результата фабрики;
- работает кнопка `Refresh`;
- работает ссылка `Open raw Factory API`.

Если в задаче был сгенерирован asset, проверить:

- отображается превью изображения;
- изображение берется из последнего шага `asset_generation`;
- используется поле `storage_uri`.

## 9. Негативные сценарии

### 9.1 Фабрика выключена

Остановить Content Factory.

В админке нажать `AI Factory` и попробовать запустить задачу.

Ожидаемо:

- админка не падает;
- пользователь видит ошибку;
- товарная таблица остается рабочей.

### 9.2 Текстовая задача не должна генерировать asset

Запустить:

```text
action_type = product_description
provider_mode = mock
full-auto = off
```

Проверить local-agent job:

```text
GET http://127.0.0.1:8028/api/local-agent/jobs?limit=10
```

Ожидаемо в `payload_json`:

```json
{
  "generate_asset": false
}
```

Runner не должен падать с ошибкой:

```text
Generation draft has no prompt
```

### 9.3 Визуальная задача должна включать asset pipeline

Запустить:

```text
action_type = main_image_infographic
```

Ожидаемо в `payload_json`:

```json
{
  "generate_asset": true
}
```

### 9.4 Перезагрузка страницы

После создания задачи перезагрузить:

```text
http://localhost:3000/uk/admin
```

Ожидаемо:

- AI-бейджи подтягиваются заново;
- связь работает по `source_id = electronom:{productId}`;
- данные не зависят от React state до перезагрузки.

## 10. Проверка сборки

В проекте сайта выполнить:

```powershell
cd "C:\Users\sevri\Сайт\elektronom"
npx tsc --noEmit
npm run lint
npm run build
```

Ожидаемо:

- TypeScript проходит без ошибок;
- lint проходит без ошибок;
- build проходит успешно.

Допустимое известное предупреждение:

```text
PostgreSQL SSL mode warning
```

Оно не относится к интеграции AI Factory.

В проекте фабрики выполнить:

```powershell
cd "C:\Users\sevri\Documents\New project"
powershell -ExecutionPolicy Bypass -File .\scripts\test-local-mock-suite.ps1
```

Ожидаемо:

```text
All checks passed
```

## 11. Критерии приемки

Интеграция считается принятой, если:

- из строки товара открывается `AI Factory`;
- задача успешно создает `factory_run`;
- задача успешно создает `local-agent job`;
- AI-бейдж появляется рядом с товаром;
- AI-бейдж открывает модалку результата;
- `Open AI result` работает из меню товара;
- safe-задача выполняется runner-ом без падения;
- текстовые задачи не запускают asset generation;
- визуальные задачи запускают asset pipeline;
- результат можно обновить через `Refresh`;
- после перезагрузки страницы AI-статусы подтягиваются заново;
- `npx tsc --noEmit`, `npm run lint`, `npm run build` проходят успешно.

## 12. Известные ограничения MVP

1. Статусы AI Factory пока не сохраняются в БД Electronom.

Текущая схема:

```text
Electronom product id -> source_id = electronom:{productId}
```

Статусы подтягиваются из Content Factory API.

2. Готовый результат пока не импортируется обратно в карточку товара.

Следующий этап:

- `product_description` -> записывать в описание товара;
- `main_image_infographic` -> добавлять как изображение товара;
- `description_infographic` -> добавлять блок в описание;
- `article/video/shorts` -> сохранять как draft/brief.

3. Runner запускается отдельно через CLI.

Следующий этап:

- добавить индикатор `local agent active`;
- добавить watcher или отдельный desktop-runner режим.
