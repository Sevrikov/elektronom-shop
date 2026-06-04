# ТЗ: гибридный пайплайн удаления фона с автодетекцией необходимости нейросети

Дата: 2026-05-26  
Проект: `tools/image-bg-removal`  
Цель: не заменять текущий алгоритм нейросетью, а добавить умный выбор метода: быстрый deterministic/BFS-пайплайн остаётся основным, нейросеть включается только когда изображение сложное или это явно указано в конфиге.

---

## 1. Главная идея

Текущий инструмент хорошо подходит для товарных изображений на белом/светлом фоне, где фон однородный и объект отделяется простыми правилами. Нейросеть нужна не всегда: она медленнее, тяжелее, может скачивать модель, иногда ошибается на технических схемах и может испортить аккуратные товарные края.

Нужно реализовать **hybrid background removal pipeline**:

```text
process_image()
  ├─ load image
  ├─ read per-file config
  ├─ if skipProcessing -> save PNG
  ├─ analyze_complexity(img, config) -> score + reasons
  ├─ choose_method(config, score, cli flags)
  ├─ method=bfs    -> current deterministic algorithm
  ├─ method=neural -> rembg/U2-Net backend
  ├─ postprocess alpha/RGB invariants
  ├─ optional redraw annotations
  ├─ save PNG
  └─ write processing report
```

---

## 2. Нефункциональные принципы

1. **Нейросеть не является дефолтом.** По умолчанию используется текущий алгоритм, если изображение считается простым.
2. **Нейросеть optional.** `rembg` не добавлять в основной `requirements.txt`.
3. **Ленивый импорт.** Импортировать `rembg` только если выбран метод `neural`.
4. **Offline-safe.** Стандартный запуск без `rembg` и без скачивания модели должен работать.
5. **Explainable choice.** Для каждого изображения логировать, почему выбран `bfs` или `neural`.
6. **Config override важнее автодетекции.** Если в `config.json` указан `method`, он должен переопределять автоматический выбор.
7. **Диаграммы и спец-дорисовка осторожно.** Для изображений с `redrawAnnotations: true` нейросеть не использовать автоматически, только если явно указано `method: "neural"`.
8. **Прозрачный фон всегда safe.** После любого метода прозрачные пиксели должны иметь RGB `(255,255,255)` и alpha `0`, чтобы не появлялись чёрные ореолы.

---

## 3. Новые зависимости

Основной файл оставить лёгким:

`tools/image-bg-removal/requirements.txt`

```text
Pillow>=10.0.0
numpy>=1.20.0
```

Добавить отдельный файл:

`tools/image-bg-removal/requirements-neural.txt`

```text
rembg>=2.0.56
onnxruntime>=1.17.0
```

Опционально для GPU, отдельным документом, не включать в основной путь:

```text
onnxruntime-gpu
```

---

## 4. Новые CLI-флаги

Добавить в `remove_bg.py`:

```bash
--method auto|bfs|neural
--complexity-threshold 0.55
--neural-unavailable warn-fallback|error|skip
--write-report
--report-path delivery/bg-removal/processing_report.json
```

Поведение:

- `--method auto` — дефолт, выбор по complexity score.
- `--method bfs` — принудительно текущий алгоритм.
- `--method neural` — принудительно нейросеть.
- `--complexity-threshold` — глобальный порог для auto.
- `--neural-unavailable warn-fallback` — если `rembg` не установлен, вывести warning и использовать BFS.
- `--neural-unavailable error` — завершить обработку с ошибкой.
- `--neural-unavailable skip` — пропустить файл и записать статус в отчёт.
- `--write-report` — сохранять JSON-отчёт выбора метода и результатов.

---

## 5. Расширение `config.json`

Для каждого файла разрешить поля:

```json
{
  "example.png": {
    "method": "auto",
    "complexityThreshold": 0.55,
    "neuralUnavailable": "warn-fallback",
    "redrawAnnotations": false,
    "skipProcessing": false,
    "neuralPostprocess": {
      "whiteTransparentRgb": true,
      "alphaThreshold": 8,
      "trimTransparentBorder": false
    }
  }
}
```

Допустимые значения `method`:

- `auto` — выбрать по сложности;
- `bfs` — текущий алгоритм;
- `neural` — rembg/U2-Net;
- `skip` — аналог `skipProcessing`, но лучше для новых конфигов.

Приоритеты:

```text
skipProcessing / method=skip
  > explicit method in config
  > CLI --method, если config не задаёт method
  > auto complexity detection
```

---

## 6. Анализ сложности изображения

Добавить функцию:

```python
def analyze_complexity(img: Image.Image, config: dict) -> dict:
    return {
        "score": 0.0,
        "methodHint": "bfs",
        "reasons": [],
        "metrics": {
            "cornerHomogeneity": 0.0,
            "edgeVariance": 0.0,
            "backgroundVariance": 0.0,
            "edgeDensity": 0.0,
            "shadowRisk": 0.0,
            "transparentInput": False
        }
    }
```

### 6.1 Метрики

#### Corner homogeneity

Оценить, насколько углы похожи между собой и на общий фон.

Пример:

```text
0.0 = углы однородные, фон простой
1.0 = углы сильно отличаются, фон сложный
```

#### Background variance along borders

Взять полосы по краям изображения: верх, низ, лево, право. Посчитать дисперсию RGB/brightness.

Высокая дисперсия означает:

- фон не белый;
- есть текстура;
- есть предметы/тени/градиенты;
- BFS может ошибиться.

#### Edge density

Простая Sobel-like или NumPy-разность яркости:

```text
edge = abs(dx) + abs(dy)
edgeDensity = count(edge > threshold) / pixels
```

Высокая плотность рёбер по фону означает, что фон сложный.

#### Foreground/background confidence

Если текущий BFS после первичной оценки видит много “островов”, дыр, шумных краёв или слишком большую connected component на фоне, это повышает score.

#### Shadow risk

Если нижняя часть изображения содержит мягкую тень, которая похожа на фон, но занимает большую площадь, score повышается умеренно. Тень не всегда требует нейросети, но может требовать postprocess.

---

## 7. Формула сложности

Начальная формула:

```python
score = (
    0.30 * background_variance_score +
    0.25 * edge_density_score +
    0.20 * corner_mismatch_score +
    0.15 * foreground_confidence_risk +
    0.10 * shadow_risk
)
```

Результат ограничить:

```python
score = min(max(score, 0.0), 1.0)
```

Начальный порог:

```text
complexityThreshold = 0.55
```

Интерпретация:

```text
score < 0.40       -> BFS confidently
0.40..0.55         -> BFS, but log "medium complexity"
0.55..0.75         -> neural if available, otherwise BFS with warning
score >= 0.75      -> neural strongly recommended
```

---

## 8. Выбор метода

Добавить:

```python
def choose_method(filename: str, img: Image.Image, config: dict, args) -> dict:
    ...
```

Выход:

```python
{
    "method": "bfs" | "neural" | "skip",
    "source": "config" | "cli" | "auto",
    "complexityScore": 0.73,
    "reasons": [
        "high edge density on image borders",
        "background variance above threshold"
    ],
    "fallback": None
}
```

Правила:

1. Если `skipProcessing: true` или `method: "skip"` — не удалять фон.
2. Если `method: "bfs"` — всегда BFS.
3. Если `method: "neural"` — использовать neural; если backend недоступен, применять `neuralUnavailable`.
4. Если `method: "auto"`:
   - если `redrawAnnotations: true`, по умолчанию BFS;
   - иначе если `score >= threshold`, neural;
   - иначе BFS.

---

## 9. Neural backend

Добавить отдельный слой:

```python
def remove_bg_neural(img: Image.Image, config: dict) -> Image.Image:
    try:
        from rembg import remove
    except ImportError:
        raise NeuralBackendUnavailable(...)
    ...
```

Требования:

- не импортировать `rembg` на старте скрипта;
- не ломать запуск без `rembg`;
- принимать и возвращать `RGBA`;
- после результата запускать общий `normalize_transparent_pixels()`;
- не применять спец-дорисовку внутри neural backend, только после него в общем pipeline.

---

## 10. Общий postprocess для всех методов

Добавить функцию:

```python
def normalize_transparent_pixels(img: Image.Image, transparent_rgb=(255, 255, 255), alpha_threshold=0) -> Image.Image:
    ...
```

Требования:

- все пиксели с `alpha <= alpha_threshold` привести к `(255,255,255,0)`;
- не менять видимые пиксели;
- использовать NumPy, не медленный pixel loop;
- использовать после BFS и после neural.

Это закрепляет урок с чёрным прямоугольником и не даёт прозрачному чёрному снова попасть в output.

---

## 11. Логирование

В консоль для каждого файла:

```text
Processing image: shell_helix_ultra.png
  Complexity score: 0.31
  Method selected: bfs
  Reasons: homogeneous corners, low border variance
  Saved: delivery/bg-removal/output/shell_helix_ultra.png
```

Для сложного изображения:

```text
Processing image: complex_tool_photo.jpg
  Complexity score: 0.78
  Method selected: neural
  Reasons: high background variance, high edge density
  Neural backend: rembg/u2net
```

Если neural недоступна:

```text
WARNING: Neural backend requested but rembg is not installed.
Fallback: bfs
Install: pip install -r tools/image-bg-removal/requirements-neural.txt
```

---

## 12. JSON-отчёт обработки

При `--write-report` сохранять:

`delivery/bg-removal/processing_report.json`

Формат:

```json
{
  "generatedAt": "2026-05-26T00:00:00Z",
  "input": "public/images/products",
  "output": "delivery/bg-removal/output",
  "items": [
    {
      "file": "shell_helix_ultra.png",
      "method": "bfs",
      "methodSource": "auto",
      "complexityScore": 0.31,
      "threshold": 0.55,
      "reasons": ["homogeneous corners", "low edge density"],
      "fallback": null,
      "status": "ok",
      "durationMs": 420
    },
    {
      "file": "complex_tool_photo.jpg",
      "method": "bfs",
      "methodSource": "auto",
      "complexityScore": 0.79,
      "threshold": 0.55,
      "reasons": ["high border variance", "high edge density"],
      "fallback": "neural unavailable, used bfs",
      "status": "ok_with_warning",
      "durationMs": 630
    }
  ]
}
```

---

## 13. Тесты

Добавить unit-тесты без обязательной установки `rembg`.

### 13.1 Complexity analyzer

```text
test_simple_white_background_scores_low
test_checker_or_noisy_background_scores_high
test_existing_catalog_fixtures_default_to_bfs
test_redraw_annotations_defaults_to_bfs
```

### 13.2 Method selection

```text
test_config_method_bfs_overrides_auto
test_config_method_neural_overrides_auto
test_cli_method_used_when_config_missing
test_neural_unavailable_warn_fallback
test_neural_unavailable_error
```

### 13.3 Neural backend через mock

Не требовать реальный `rembg` в обычных тестах. Замокать backend:

```text
test_neural_backend_called_when_score_above_threshold
test_neural_backend_not_imported_for_bfs
```

### 13.4 Transparent RGB invariant

```text
test_transparent_pixels_are_white_rgb_after_bfs
test_transparent_pixels_are_white_rgb_after_neural_mock
test_jack_stand_annotation_background_remains_transparent_white
```

---

## 14. Acceptance Criteria

Задача считается готовой, если:

1. Обычный запуск без `rembg` работает как раньше.
2. `requirements.txt` не содержит `rembg`.
3. Есть `requirements-neural.txt`.
4. Для простых текущих товаров метод выбирается `bfs`.
5. Для искусственного сложного фона метод в auto выбирается `neural`.
6. При отсутствии `rembg` сложное изображение не ломает весь batch, если выбран `warn-fallback`.
7. В логах видно `complexity score`, выбранный метод и причину.
8. `config.json` может принудительно включить `bfs` или `neural`.
9. После любого метода прозрачные пиксели нормализуются в `(255,255,255,0)`.
10. Старые тесты по подставке и АВР продолжают проходить.
11. Новые тесты покрывают выбор метода и fallback.
12. README описывает обычный режим и neural-режим отдельно.

---

## 15. README: что добавить

Добавить секцию:

```markdown
## Optional Neural Background Removal

The default tool uses the deterministic BFS/masking pipeline.
For complex images, the tool can optionally use `rembg`.

Install neural backend:

```powershell
.\.venv\Scripts\python.exe -m pip install -r tools\image-bg-removal\requirements-neural.txt
```

Run auto mode:

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method auto --complexity-threshold 0.55 --write-report
```

Force neural mode:

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method neural --neural-unavailable error
```

Force deterministic mode:

```powershell
.\.venv\Scripts\python.exe tools\image-bg-removal\remove_bg.py --method bfs
```
```

---

## 16. Важные ограничения

1. Нейросеть может съесть тонкие провода, прозрачные детали, белые товары на белом фоне и технические надписи.
2. Для схем с ручной векторной дорисовкой лучше использовать BFS + redraw.
3. Первый запуск `rembg` может скачать модель. Это нужно явно описать в README.
4. В CI не запускать real neural tests без отдельного флага.
5. Не смешивать качество BFS и neural в одном отчёте без указания метода.

---

## 17. Рекомендованный порядок разработки

1. Добавить `normalize_transparent_pixels()`.
2. Добавить `analyze_complexity()` и тесты на score.
3. Добавить `choose_method()`.
4. Добавить CLI flags.
5. Добавить JSON processing report.
6. Добавить lazy neural backend.
7. Добавить `requirements-neural.txt`.
8. Обновить README.
9. Перегенерировать delivery output/comparison.
10. Обновить `background_removal_delivery.md`.

---

## 18. Короткое задание разработчику

Реализовать гибридный режим удаления фона:

```text
Не переводить весь инструмент на нейросеть.
Добавить анализ сложности изображения.
В auto-режиме простые изображения обрабатывать текущим BFS/masking алгоритмом.
Нейросеть rembg/U2-Net использовать только для сложных изображений или по явному config/CLI override.
Сделать rembg optional dependency, lazy import, fallback и подробный лог выбора метода.
После любого метода нормализовать прозрачные пиксели в (255,255,255,0).
Покрыть тестами выбор метода, fallback, transparency invariant и сохранение текущей логики для технических изображений.
```

