# Ревью ТЗ WaveZK-RL и дополнения для реального роста уровня идеи

Дата: 2026-05-26  
Проверяемый документ: `D:\WaveZK-RL-review\TZ_RESEARCH_WAVEZK_RL_FULL.md`  
Статус ревью: документ сильный, но требует одного критического исправления и отдельного слоя research-governance.

---

## Короткий вывод

ТЗ стало заметно сильнее: оно правильно разделяет Proof Compute и Witness Strategy, вводит честную таксономию claims, фиксирует CUDA-уроки и ставит Sprint 1 как correctness gate. Это уже похоже на материал, который можно превращать в исследовательский проект.

Но чтобы рост идеи стал реальным, а не только красивым roadmap, нужно добавить в ТЗ **Correctness & Research Governance Spine** — сквозной слой правил, артефактов и gate-проверок, который делает проект воспроизводимым, проверяемым и защищаемым перед сильными инженерами/исследователями.

Главная срочная правка: в Sprint 1 есть риск неправильной формулы `NW` для Pippenger MSM. Текущий текст называет `#define NW (254/CWIN)` правильным, но для `CWIN=11` это даёт `23` окна и может потерять верхний бит скаляра. Правильная стратегия — не floor, а безопасная обработка последнего неполного окна.

---

## P0. Исправить описание `NW/CWIN` в Sprint 1

В ТЗ сейчас написано:

```c
// ПРАВИЛЬНО:
#define NW (254/CWIN) // floor division = 23 для CWIN=11
```

Это опасно. Для 254-битного скаляра и `CWIN=11` нужно покрыть биты `0..253`.  
`23 * 11 = 253`, то есть окна `0..22` покрывают только биты `0..252`. Бит `253` выпадает, если отдельно не доказано, что скаляры всегда меньше `2^253`. В BN254 Fr это предположение нельзя использовать как универсальную корректность.

Правильное требование для ТЗ:

```c
// НУЖНО:
NW = ceil(SCALAR_BITS / CWIN)

// Для BN254 Fr:
SCALAR_BITS = 254
NW = (SCALAR_BITS + CWIN - 1) / CWIN

// Последнее окно обрабатывается как partial window:
bits_in_window(w) = min(CWIN, SCALAR_BITS - w * CWIN)
bucket_count(w) = 1 << bits_in_window(w)

// Нельзя читать биты за пределами SCALAR_BITS.
// Нельзя создавать buckets по несуществующим верхним битам.
```

Важно: ошибка из прошлых экспериментов была не в самом `ceil`, а в `ceil` без корректной partial-window защиты. Поэтому в ТЗ надо переписать тезис:

```text
Неверно: NW=floor(254/CWIN), потому что может потерять верхний бит.
Неверно: NW=ceil(254/CWIN) без partial-window masking, потому что последнее окно может читать мусорные биты.
Верно: NW=ceil(254/CWIN) + строгая функция extract_window_bits(), которая ограничивает чтение SCALAR_BITS и уменьшает bucket_count для последнего окна.
```

Обязательные тесты:

- скаляр с установленным битом `253`;
- скаляр `Fr_order - 1`;
- скаляр `0`;
- случайные скаляры после редукции `mod Fr_order`;
- сравнение GPU MSM против CPU reference на N = 1, 10, 100, 1000, 10000;
- тест, где последний partial window содержит ненулевой bucket.

---

## Главное дополнение: Correctness & Research Governance Spine

Предлагаю добавить в ТЗ новую часть после архитектуры или перед Sprint 0.

### ЧАСТЬ X. Correctness & Research Governance Spine

Цель слоя: каждый результат WaveZK-RL должен быть не только быстрым, но и воспроизводимым, валидированным, классифицированным и пригодным для независимой проверки.

Минимальные артефакты:

1. `SPEC_CORRECTNESS.md`
2. `BENCHMARK_SUITE.md`
3. `CLAIMS_REGISTRY_SCHEMA.md`
4. `REPRODUCIBILITY.md`
5. `ROADMAP_GATES.md`

Без этих файлов проект рискует снова уйти в режим быстрых экспериментов без жёсткой опоры.

---

## 1. `SPEC_CORRECTNESS.md`

Документ должен формально описывать, что значит “корректно” для каждого вычислительного слоя.

Минимальное содержание:

- поле `Fr`: модуль, диапазон, способ редукции;
- кодирование скаляров: endian, количество бит, limb layout;
- Pippenger MSM:
  - определение окон;
  - partial-window handling;
  - bucket indexing;
  - identity point;
  - порядок reduction;
  - допустимые эквивалентные результаты;
- NTT:
  - domain size;
  - root of unity;
  - bit-reversal convention;
  - inverse normalization;
- witness correctness:
  - `A*w ∘ B*w == C*w`;
  - public inputs consistency;
  - proof verification as final gate.

Definition of Done:

```text
Любая оптимизация считается принятой только если она проходит SPEC_CORRECTNESS.md tests.
Быстрее, но математически неэквивалентно = rejected.
```

---

## 2. `BENCHMARK_SUITE.md`

Нужен управляемый набор реальных схем, а не только синтетика.

Минимальная структура:

```yaml
circuits:
  - id: tornado_cash_withdraw
    source: "..."
    license: "..."
    format: ["r1cs", "wasm", "zkey"]
    constraints: 28904
    expected_fragments:
      dag: high
      hub: medium
      bounded: low
    baseline:
      snarkjs_witness_ms: null
      rapidsnark_prove_ms: null
    status: active
```

Требования:

- минимум 20 реальных схем для Paper 1;
- минимум 5 классов схем: hash-heavy, lookup-heavy, arithmetic DAG, zkML/dense, DeFi/accounting;
- фиксированные версии файлов;
- SHA256 для каждого входного артефакта;
- запрет “подменять” схему без обновления manifest;
- отдельный список synthetic/proxy benchmarks, чтобы не смешивать их с production-claims.

---

## 3. `CLAIMS_REGISTRY_SCHEMA.md`

В ТЗ уже есть `results.yaml`, это сильная идея. Её нужно сделать строгой схемой.

Предлагаемый формат:

```yaml
claims:
  - id: msm_t4_cwin11_2m_v001
    title: "GPU MSM on Tesla T4, BN254, N=2M, CWIN=11"
    status: MEASURED
    validation_status: not_validated
    value:
      msm_ms: 197
      pps: 2.54
    hardware:
      gpu: "Tesla T4"
      cuda: "12.x"
      driver: "..."
    code:
      commit: "..."
      file: "cuda/msm_opt6.cu"
    dataset:
      type: synthetic
      scalar_generation: "random_u256_mod_fr"
      point_generation: "generator_multiply"
    raw_logs:
      - "results/raw/msm_t4_cwin11_2026-05-26.log"
    validation:
      cpu_reference: false
      proof_verified: false
    invalidation:
      invalidated_by: null
      reason: null
      superseded_by: null
```

Обязательное правило:

```text
Если claim оказался неверным, его нельзя удалять.
Его нужно пометить как INVALIDATED, указать причину, commit и новый superseding claim.
```

Это делает проект научно честным и защищает историю экспериментов.

---

## 4. `REPRODUCIBILITY.md`

Нужен “one command replay” для каждого claim.

Минимум:

```bash
wavezk bench --claim msm_t4_cwin11_2m_v001 --reproduce
```

Документ должен фиксировать:

- OS;
- GPU model;
- driver;
- CUDA toolkit;
- CUB/CCCL version;
- compiler flags;
- seed;
- commit hash;
- exact command;
- expected output;
- raw output path;
- accepted tolerance.

Для Colab/T4 отдельно:

- notebook URL или `.ipynb`;
- cell order;
- install commands;
- expected runtime;
- expected memory use.

---

## 5. `ROADMAP_GATES.md`

Каждый Sprint должен иметь gate, который нельзя обходить.

Пример:

```text
Gate 1: MSM Correctness
- GPU MSM == CPU reference для всех mandatory vectors.
- Есть тест со скаляром bit253=1.
- Все CUDA calls проверяются на ошибки.
- Все числа в results.yaml имеют status VALIDATED или MEASURED/not_validated.

Gate 2: CircuitProfiler Reality
- 20 real circuits parsed.
- Для каждой схемы есть manifest, features.json, profile report.
- Manual label agreement посчитан минимум двумя независимыми annotators.

Gate 3: Solver Benefit
- Любой speedup измерен на реальной схеме.
- Есть baseline.
- Есть ablation.
- Есть negative cases.

Gate 4: End-to-End Proof
- Witness generated.
- Proof generated.
- Proof verified.
- Benchmark включает total wall-clock, not only kernel time.
```

---

## Дополнение к научной программе

Сейчас в ТЗ сильная гипотеза: структура R1CS позволяет выбрать solver/prover strategy. Чтобы она стала научной, нужен не только код, но и экспериментальная методология.

Добавить:

```text
Для каждого solver strategy проводится:
1. Applicability test: где метод применим.
2. Negative test: где метод не должен применяться.
3. Baseline comparison: snarkjs / circom witness / witnesscalc / rapidsnark / gnark, в зависимости от слоя.
4. Ablation: policy без признака X, без solver Y, без topology labels.
5. Cost metric: ms, GPU memory, $ per proof, correctness status.
```

Особенно важно: `rapidsnark` не всегда корректный baseline для witness generation. Для witness-части лучше сравнивать по ситуации:

- `snarkjs wtns calculate`;
- `circom` witness calculator;
- `witnesscalc`;
- `gnark` для Go-circuits;
- `rapidsnark` для proof side или если workflow реально совпадает.

---

## Дополнение к CircuitProfiler

Заявление “нет CLI-инструмента” лучше сделать осторожнее:

```text
Рабочая формулировка:
В открытой экосистеме мало специализированных CLI-инструментов, которые строят structural profile R1CS именно для выбора solver/prover strategy. Перед публикацией claim требует literature/tool survey.
```

Минимальный MVP `wavezk analyze` должен выдавать:

- `profile.json`;
- `features.csv`;
- `fragments.json`;
- human-readable Markdown report;
- confidence score для каждого fragment label;
- предупреждение, если классификация неуверенная.

---

## Что НЕ стоит добавлять сейчас

Не стоит сразу перегружать ТЗ полноценным RL. До dataset и solver zoo настоящий RL будет декоративным. Правильная последовательность:

1. rule-based policy;
2. contextual bandit;
3. learned classifier;
4. только потом RL/meta-learning.

Не стоит обещать log-domain transform как практический solver. Оставить как `[HYPOTHESIS]` и вынести в отдельный research track.

Не стоит заявлять “первый в мире” по birthday/probe witness без literature review. Формулировка должна быть: “исследуем применимость GPU probe/collision search для bounded witness subproblems”.

---

## Developer-ready вставка в ТЗ

Ниже текст, который можно прямо вставить в `TZ_RESEARCH_WAVEZK_RL_FULL.md`.

```markdown
## ЧАСТЬ X. Correctness & Research Governance Spine

WaveZK-RL обязан развиваться через воспроизводимые и валидируемые claims. Любой performance-result без корректностной валидации считается `[MEASURED, not validated]` и не используется как основание для roadmap.

### Обязательные артефакты

1. `SPEC_CORRECTNESS.md` — математическая спецификация корректности MSM, NTT, witness и proof verification.
2. `BENCHMARK_SUITE.md` — управляемый набор реальных схем, provenance, SHA256, license, expected labels.
3. `CLAIMS_REGISTRY_SCHEMA.md` — строгая схема `results.yaml`, включая invalidation protocol.
4. `REPRODUCIBILITY.md` — one-command replay для каждого claim.
5. `ROADMAP_GATES.md` — gate-критерии для каждого sprint.

### MSM partial-window rule

Для BN254 Fr скаляры рассматриваются как 254-битные значения после редукции `mod Fr_order`. Для Pippenger MSM число окон:

`NW = ceil(254 / CWIN)`

Последнее окно является partial window, если `254 % CWIN != 0`. Реализация обязана:

- не читать биты за пределами 254;
- вычислять `bits_in_window = min(CWIN, 254 - w * CWIN)`;
- использовать `bucket_count = 1 << bits_in_window` для последнего окна;
- иметь тест со скаляром, у которого установлен бит 253;
- валидироваться против CPU reference.

Запрещено использовать `floor(254 / CWIN)` как общее исправление, потому что это может потерять старший валидный бит скаляра.

### Invalidation protocol

Если результат оказался неверным, запись в `results.yaml` не удаляется. Она переводится в статус `INVALIDATED` с полями:

- `invalidated_by`;
- `reason`;
- `superseded_by`;
- `date`;
- `evidence`.
```

---

## Итоговая рекомендация

ТЗ стоит принять как базу, но перед передачей разработчику/исследователю обязательно внести:

1. исправление `NW/CWIN`;
2. отдельный раздел `Correctness & Research Governance Spine`;
3. schema для `results.yaml`;
4. benchmark manifest для реальных схем;
5. independent replication gate.

Именно это делает рост уровня идеи реальным: не “мы попробуем ускорить ZK”, а “мы строим проверяемую исследовательскую платформу, где каждый claim можно повторить, опровергнуть, улучшить и защитить”.
