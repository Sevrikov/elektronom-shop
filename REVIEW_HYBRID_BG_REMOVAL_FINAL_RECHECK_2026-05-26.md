# Финальная проверка hybrid background removal после исправления P1

Дата: 2026-05-26  
Модуль: `tools/image-bg-removal`  
Связанный отчёт: `REVIEW_HYBRID_BG_REMOVAL_RECHECK_2026-05-26.md`

---

## Итог

P1 исправлен. Гибридный пайплайн можно принимать с оговоркой, что тесты `29 tests OK` я не смог независимо запустить в своём окружении из-за отсутствия Python runtime, но статически исправления подтверждены.

---

## Что проверено

### 1. Ветка `if not valid_corners`

Файл:

`tools/image-bg-removal/remove_bg.py`

Теперь ветка:

- нормализует прозрачные пиксели;
- создаёт выходную директорию;
- сохраняет PNG;
- заполняет `fallback`;
- заполняет `durationMs`;
- возвращает `method_decision` dict.

Фактический код:

```python
if not valid_corners:
    print(f"  Warning: No light/neutral background at corners. Copying to PNG.")
    img = normalize_transparent_pixels(img)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG")
    method_decision["fallback"] = "no light corners, copied as-is"
    method_decision["durationMs"] = int((time.time() - t_start) * 1000)
    return method_decision
```

Это закрывает ошибку `decision.get(...)` в `main()`.

### 2. Новый regression test

Файл:

`tools/image-bg-removal/tests/test_remove_bg.py`

Добавлен тест:

```text
test_process_image_returns_report_when_bfs_has_no_light_corners
```

Он создаёт тёмное изображение, вызывает `process_image()`, проверяет:

- результат не `None`;
- результат является `dict`;
- есть ключи `method` и `durationMs`;
- выходной PNG создан.

### 3. Количество тестов

Статически найдено 29 test functions:

- 5 старых/регрессионных в `test_remove_bg.py`;
- 24 новых в `test_hybrid_pipeline.py`.

### 4. Кэш Python

Проверка `__pycache__` и `.pyc` внутри `tools/image-bg-removal` ничего не нашла. Кэш удалён.

---

## Остаточный риск

Я не смог независимо запустить тесты:

```text
python: command not found
No suitable Python runtime found
```

Поэтому “29 tests OK” остаётся подтверждением разработчика, а моё подтверждение — статическое ревью кода, тестов и файловой структуры.

---

## Решение

Задачу можно считать закрытой по коду.

Перед коммитом желательно:

1. приложить/оставить лог `29 tests OK`;
2. убедиться, что delivery-отчёт не содержит старое количество тестов;
3. не коммитить временные output/report файлы, если они не нужны как артефакты поставки.

