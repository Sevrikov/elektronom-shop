# Ревью реализации hybrid background removal pipeline

Дата: 2026-05-26  
Проверяемая задача: `TZ_HYBRID_BG_REMOVAL_NEURAL_FALLBACK_2026-05-26.md`  
Модуль: `tools/image-bg-removal`

---

## Итог

Реализация в целом соответствует ТЗ: добавлены `analyze_complexity()`, `choose_method()`, `remove_bg_neural()` с lazy import, отдельный `requirements-neural.txt`, CLI-флаги, README-секция, JSON-report и новый набор тестов.

Но есть один P1-дефект в fallback-сценарии BFS и один P2-дефект по чистоте репозитория после тестов.

---

## Finding 1 — P1: `process_image()` возвращает `None` при BFS-сценарии без светлых углов, ломая report/main flow

Файл:

`tools/image-bg-removal/remove_bg.py`

Проблемный участок:

```python
if not valid_corners:
    print(f"  Warning: No light/neutral background at corners. Copying to PNG.")
    img.save(out_path, "PNG")
    return
```

Дальше в `main()` код ожидает, что `process_image()` вернёт dict:

```python
decision = process_image(...)
report_item = {
    "file": filename,
    "method": decision.get("method"),
    ...
}
```

Если `process_image()` вернул `None`, `decision.get(...)` вызывает `AttributeError`, и обработка файла попадает в `except Exception` как ошибка, хотя PNG уже был сохранён.

### Почему это важно

Это не только старый BFS edge case. В новом гибридном пайплайне такой сценарий может возникнуть чаще:

- auto выбрал neural;
- `rembg` не установлен;
- `neuralUnavailable=warn-fallback`;
- метод падает обратно на BFS;
- у сложного изображения нет светлых углов;
- BFS сохраняет исходник как PNG и возвращает `None`;
- JSON-report помечает файл как error.

То есть fallback работает не полностью корректно.

### Как исправить

В ветке `not valid_corners` нужно:

1. создать output directory;
2. нормализовать прозрачные пиксели;
3. сохранить PNG;
4. заполнить `method_decision`;
5. вернуть dict.

Пример:

```python
if not valid_corners:
    print("  Warning: No light/neutral background at corners. Copying to PNG.")
    img = normalize_transparent_pixels(img)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    method_decision["durationMs"] = int((time.time() - t_start) * 1000)
    method_decision["fallback"] = method_decision.get("fallback") or "bfs could not identify neutral corners; copied as PNG"
    method_decision["status"] = "ok_with_warning"
    return method_decision
```

И добавить тест:

```text
test_process_image_returns_report_when_bfs_has_no_light_corners
```

Проверить:

- output PNG создан;
- `process_image()` вернул dict;
- `fallback` заполнен;
- `main()` может сформировать report без exception.

---

## Finding 2 — P2: После тестов снова появился `__pycache__`

Файл/папка:

```text
tools/image-bg-removal/tests/__pycache__/
```

Найдены:

```text
test_hybrid_pipeline.cpython-311.pyc
test_remove_bg.cpython-311.pyc
```

Это не ломает код, но ранее мы уже закрывали замечание про отсутствие Python-кэша в поставке. Если тесты запускаются локально, папка снова появляется.

### Как исправить

Перед коммитом удалить:

```text
tools/image-bg-removal/tests/__pycache__/
```

И убедиться, что `.gitignore` содержит:

```text
__pycache__/
*.py[cod]
```

Опционально: запускать тесты с:

```powershell
$env:PYTHONDONTWRITEBYTECODE=1
```

---

## Что подтверждено

Подтверждено статически:

- основной `requirements.txt` остался лёгким: `Pillow`, `numpy`;
- `requirements-neural.txt` содержит `rembg` и `onnxruntime`;
- `rembg` импортируется лениво только в `remove_bg_neural()`;
- `choose_method()` реализует приоритеты skip/config/CLI/auto;
- для `redrawAnnotations: true` в auto-режиме выбирается BFS;
- CLI-флаги добавлены:
  - `--method`;
  - `--complexity-threshold`;
  - `--neural-unavailable`;
  - `--write-report`;
  - `--report-path`;
- JSON-report реализован;
- README содержит секцию optional neural mode;
- добавлены 24 новых теста в `test_hybrid_pipeline.py`;
- всего в тестах обнаружено 28 test functions.

---

## Что не подтверждено

Я не смог независимо запустить тесты в своём окружении, потому что здесь нет доступного Python runtime:

```text
python: command not found
No suitable Python runtime found
```

Поэтому статус “28 tests OK” принимается как отчёт разработчика, но не как независимо воспроизведённый мной результат.

---

## Рекомендация

Не принимать как полностью закрыто до исправления Finding 1.

После исправления:

1. добавить тест на no-light-corners BFS fallback;
2. прогнать все 29 тестов;
3. удалить `__pycache__`;
4. обновить delivery/report, если он упоминает количество тестов.

После этого гибридный пайплайн можно считать готовым к коммиту.

