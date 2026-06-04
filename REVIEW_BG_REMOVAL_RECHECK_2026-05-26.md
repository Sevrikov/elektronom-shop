# Recheck: tools/image-bg-removal

Дата: 2026-05-26  
Проверяемый блок: `C:\Users\sevri\Сайт\elektronom\tools\image-bg-removal`  
Основание: ответ разработчика о переносе проекта очистки фона из `scratch` в отдельный инструмент.

## Итог

Большая часть прошлых архитектурных замечаний действительно закрыта: появился отдельный каталог `tools/image-bg-removal`, JSON-конфиг, README, requirements, CLI, сохранение в `.png`, NumPy-маски и базовые unit-тесты.

Но принимать инструмент как готовый для массовой обработки каталога пока рано. Найдены новые блокирующие/важные проблемы: тесты невозможно подтвердить в текущем окружении, в репозиторий попали `__pycache__`, команда из README может запускаться из неправильной директории, а визуальный результат для подставки содержит артефакт дорисованной аннотации.

## Что подтверждено

- `tools/image-bg-removal/remove_bg.py` создан.
- `tools/image-bg-removal/config.json` создан и больше не парсится из TypeScript.
- `tools/image-bg-removal/requirements.txt` создан.
- `tools/image-bg-removal/README.md` создан.
- В `process_image()` выходной файл строится как `stem + ".png"`.
- Для comparison sheets также используется `comp_{stem}.png`.
- `set`/`dict` для основных масок заменены на `np.zeros(...)`.
- Есть `tests/test_remove_bg.py` с проверками PNG-формата, прозрачных углов, skipProcessing и генерации comparison sheet.

## Findings

### P1. Тесты нельзя подтвердить в текущем окружении

Команда:

```powershell
py -3.11 -m unittest discover tools\image-bg-removal\tests
```

Результат:

```txt
No suitable Python runtime found
```

Это не доказывает, что тесты плохие, но означает, что локально в рабочей среде Codex/проекта результат разработчика “тесты проходят успешно” не воспроизведен.

Что нужно сделать:

- Зафиксировать поддерживаемую версию Python в README, например Python 3.11.
- Добавить команду проверки окружения.
- Желательно добавить `pyproject.toml` или `uv`/`venv` инструкцию.
- Разработчику приложить лог запуска тестов из чистого окружения.

### P1. Визуальный результат подставки содержит артефакты после дорисовки

Файл результата:

`delivery/bg-removal/comparisons/comp_7138921733_w640_h640_podstavka-pod-mashinu.png`

Проблема: на comparison sheet видно, что рядом с текстом `288-430 мм` появился отдельный/наложенный символ `2`, текст пересекается и выглядит не как чистая техническая маркировка. Это результат не только удаления фона, но и ручной дорисовки аннотаций.

Связанный код:

- `tools/image-bg-removal/remove_bg.py:18-143`
- `tools/image-bg-removal/remove_bg.py:535-538`

Риск: инструмент очистки фона начинает менять смысловую графику товара. Для каталога это опасно: можно случайно исказить техническую схему, размер, маркировку или рекламный бейдж.

Что нужно сделать:

1. По умолчанию отключить `redraw_jack_stand_annotations`.
2. Вынести дорисовку в отдельный режим, например `--redraw-annotations`.
3. Сделать per-file параметр `redrawAnnotations: true`, а не hardcode по имени файла.
4. Исправить композицию текста и бейджа на подставке.
5. Добавить отдельный golden-тест/visual fixture именно на отсутствие наложений в зоне размера `288-430 мм`.

### P1. README-команды неоднозначны по рабочей директории

Файл: `tools/image-bg-removal/README.md`

В README указано:

```bash
pip install -r requirements.txt
python remove_bg.py --input <input_directory_or_file> --output <output_directory> --config config.json --compare
```

Проблема: эти команды работают только если пользователь уже находится в `tools/image-bg-removal`. Если запускать из корня проекта, `requirements.txt`, `remove_bg.py` и `config.json` не найдутся.

Дополнительно в `remove_bg.py` есть комментарий “Resolve relative paths with respect to this script”, но код делает `os.path.abspath(...)` относительно текущей рабочей директории, а не `script_dir`:

- `tools/image-bg-removal/remove_bg.py:561-574`

Что нужно сделать:

В README дать команды из корня проекта:

```powershell
py -3.11 -m pip install -r tools\image-bg-removal\requirements.txt
py -3.11 tools\image-bg-removal\remove_bg.py --input public\images\products --output delivery\bg-removal\output --config tools\image-bg-removal\config.json --compare
```

Или изменить код, чтобы дефолты и относительные пути действительно резолвились от `script_dir`.

### P2. В репозиторий попали `__pycache__` и `.pyc`

Файлы:

- `tools/image-bg-removal/__pycache__/remove_bg.cpython-311.pyc`
- `tools/image-bg-removal/tests/__pycache__/__init__.cpython-311.pyc`
- `tools/image-bg-removal/tests/__pycache__/test_remove_bg.cpython-311.pyc`

Риск: мусорные бинарные файлы попадут в коммит, будут создавать лишние диффы и привязку к локальной версии Python.

Что нужно сделать:

- Удалить `__pycache__` из рабочей папки.
- Убедиться, что `.gitignore` содержит:

```gitignore
__pycache__/
*.py[cod]
```

### P2. `remove_bg.py` содержит неиспользуемый импорт

Файл: `tools/image-bg-removal/remove_bg.py:6`

`shutil` импортирован, но в файле не используется.

Что нужно сделать:

- Удалить импорт.
- Добавить проверку форматтером/линтером для Python, например `ruff`.

### P2. Golden-тесты пока слишком синтетические

Файл: `tools/image-bg-removal/tests/test_remove_bg.py`

Текущие тесты полезны, но используют только простой сгенерированный квадрат на белом фоне. Они проверяют механику, но не ловят реальные проблемы каталога:

- тонкие ножки подставки;
- светлые элементы товара;
- внутренние отверстия;
- тени под товаром;
- текстовые маркировки;
- аннотационные бейджи.

Что нужно сделать:

- Добавить fixture-изображения из реального каталога, минимум 5-7 кейсов.
- Проверять не только “углы прозрачные”, но и bbox, наличие alpha-канала, отсутствие обрезания, процент прозрачности, и визуальный hash/mask для критических зон.
- Отдельно тестировать `skipProcessing`.

### P2. Обработан и задокументирован только один delivery-результат

В `delivery/bg-removal` сейчас есть:

- `output/7138921733_w640_h640_podstavka-pod-mashinu.png`
- `comparisons/comp_7138921733_w640_h640_podstavka-pod-mashinu.png`

Для приемки инструмента этого мало. Нужен пакет результатов по всем ключевым типам изображений из `config.json`.

Что нужно сделать:

- Прогнать минимум товары:
  - `castrol_edge_5w30.png`
  - `shell_helix_ultra.png`
  - `mobil1_esp.png`
  - `liqui_moly.png`
  - `bosch_filter.png`
  - `7138921733_w640_h640_podstavka-pod-mashinu.jpg`
  - `6335425546_w640_h640_avtomatichnij-peremikach-avr.jpg`
- Сохранить comparison sheet для каждого.

## Рекомендация разработчику

Перед приемкой сделать короткий фикс-спринт:

1. Удалить `__pycache__` и `.pyc`.
2. Исправить README-команды для запуска из корня проекта.
3. Настроить резолв относительных путей либо явно относительно cwd, либо явно относительно `script_dir`.
4. Отключить/изолировать `redraw_jack_stand_annotations`.
5. Исправить визуальный баг с наложением `2` и `288-430 мм`.
6. Добавить реальные fixture-тесты.
7. Сгенерировать delivery-output не для одного файла, а для всех критичных товарных кейсов.
8. Приложить лог тестов из чистого Python 3.11 окружения.

## Статус

Статус: **частично принято, требуется rework перед production-использованием**.

Архитектурные P1 из прошлого ревью в основном закрыты, но новый блок нельзя подключать к массовой обработке каталога, пока не исправлены визуальная дорисовка аннотаций и воспроизводимость тестов.
