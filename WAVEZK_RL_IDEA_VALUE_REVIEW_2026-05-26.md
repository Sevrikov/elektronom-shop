# WaveZK-RL: что ценного нельзя потерять из HISTORY.md

Дата: 2026-05-26  
Источник: `D:\WaveZK-RL-review\HISTORY.md`

## Главный вывод

В строгом техническом ревью я нашел P0-блокеры по корректности MSM. Но в истории идеи есть несколько действительно ценных направлений. Их нельзя выбрасывать только потому, что текущий CUDA benchmark еще не доказан как корректный Groth16 prover.

Правильная стратегия: разделить проект на две линии:

1. **Proof Compute Line** — MSM/NTT/Groth16 correctness-first.
2. **Witness Strategy Line** — классификатор схем + специализированные solver-подходы: birthday search, WALKSAT, BP/MG, lookup/LUT.

Именно вторая линия может быть более оригинальной, чем просто “еще один быстрый MSM”.

## Что реально ценное

### 1. Трехуровневая архитектура WaveZK-RL

В HISTORY проект изначально описан как три уровня:

- witness finding;
- proof computation;
- RL-агент, который выбирает алгоритм под структуру схемы.

Это хорошая архитектурная идея. Большинство GPU-ZK проектов фокусируются на MSM/NTT/proof computation. Если WaveZK сможет автоматически понимать тип схемы и выбирать solver, это может стать отдельной ценностью.

Что сохранить:

- не сводить проект только к MSM;
- развивать “strategy selection layer”;
- сделать классификацию схем: causal/DAG, hash/preimage, lookup-heavy, cyclic/loopy, sparse linear, dense hub.

### 2. Birthday attack не как универсальный witness generator, а как специализированный solver

HISTORY слишком широко формулирует “birthday attack для witness finding”. Это опасно. Но сама идея ценная, если сузить:

> GPU warp-shuffle collision/probe search for bounded witness subproblems.

Где это может быть полезно:

- hash/preimage toy circuits;
- bounded search constraints;
- separator subproblems;
- lookup-style constraints;
- weak/partial witness recovery;
- brute-force components внутри larger witness pipeline.

Что сделать:

- не заявлять “general R1CS witness finding”;
- собрать каталог схем, где birthday/probe search применим;
- сделать solver API: `solve_subproblem(type=collision/preimage/bounded_search)`;
- сравнить против CPU/SIMD для конкретных классов задач.

### 3. Log-domain transform как потенциальная научная идея

Идея:

```txt
w[a] * w[b] = w[c] mod p
k[a] + k[b] = k[c] mod (p-1), где k[v] = log_g(w[v])
```

Это интересная мысль, но она заблокирована дискретным логарифмом. Для всего BN254 Fr это, скорее всего, непрактично. Но идея может жить в ограниченных доменах:

- малые подгруппы;
- предтабулированные lookup-домены;
- range-limited witness;
- synthetic/approximation phase;
- heuristic BP preconditioner, а не финальный solver.

Что сделать:

- оставить в статусе `research hypothesis`;
- срочно проверить factorization `r-1`;
- описать, для каких доменов log table реально строится;
- не писать “confirmed”, пока нет практического способа получать `log_g(w)`.

### 4. Forward WALKSAT для causal/DAG структур

В HISTORY есть важный результат: параллельный Jacobi осциллирует на chain, а Forward WALKSAT сходится за 15 итераций.

Это может быть более практично, чем BP для реальных схем, потому что многие circuit fragments имеют направленную вычислительную структуру.

Что сделать:

- выделить WALKSAT/forward-fix как отдельный solver;
- тестировать на реальных circom-фрагментах;
- построить classifier: если graph is DAG/near-DAG, запускать forward solver, а не loopy BP.

### 5. Density-stratified Multigrid BP как quality heuristic

MG BP не дал универсального timing speedup на больших N, но показал quality benefit и implicit damping.

Ценность не обязательно в ускорении. Ценность может быть в стабилизации итерационного поиска на hub-heavy графах.

Что сделать:

- позиционировать MG BP как heuristic/preconditioner;
- мерить не только latency, но и violations reduction per ms;
- использовать как часть RL-action space: naive BP, damped BP, MG BP, WALKSAT, birthday.

### 6. CSR sparse R1CS как фундаментальная инженерная база

Знахідка “dense R1CS для 10K hashes = 18 TB, CSR = 92 MB” важная. Это не маркетинг, а базовая инженерная необходимость.

Что сохранить:

- все дальнейшие solver/analysis должны работать с CSR/COO graph form;
- построить единый `CircuitGraph` слой;
- хранить degrees, hubs, connected components, DAG layers, constraint types.

### 7. ICICLE failure как полезный бизнес/архитектурный урок

История ICICLE важна не потому, что ICICLE “плохой”, а потому что проекту нужен независимый fallback.

Вывод:

- нельзя строить бизнес-план только на чужом proprietary backend;
- свой MSM/NTT имеет смысл как strategic independence;
- при этом ICICLE/gnark backend можно оставить как optional accelerator, если лицензия/условия подходят.

### 8. Commodity T4 positioning

Фокус на Tesla T4 ценный. Не “мы быстрее всех на A100”, а “мы выжимаем максимум из дешевого commodity cloud GPU”.

Это хороший бизнес-угол:

- дешевые inference GPU;
- много доступных T4/L4;
- proof/mining/solver jobs как batch workload;
- экономика `$ per proof`, а не только raw latency.

Но revenue-таблицы нужно пометить как business assumptions, пока нет реального покупателя/API.

## Что мы могли упустить в предыдущем ревью

### Упущенная ценность 1: RL здесь не украшение, а оркестратор solver-стратегий

Если оставить только MSM, проект конкурирует с ICICLE/CuZK/ZKPoG на их поле. Если развивать RL/classifier, проект может стать “compiler/runtime optimizer for witness/proving strategies”.

Практический MVP:

```txt
Input: R1CS / circuit graph
Features:
  - number of constraints
  - sparsity
  - degree distribution
  - hub variables
  - DAG depth
  - hash/preimage fragments
  - lookup density
Output:
  - recommended solver path
  - expected cost
  - GPU batch size
  - fallback strategy
```

### Упущенная ценность 2: “ошибки” в логах дают набор анти-паттернов для CUDA-ZK

HISTORY содержит очень ценный список инженерных уроков:

- `cudaMemset(&ptr)` vs `cudaMemset(ptr)`;
- sorted atomics serialize;
- register spilling kills;
- `maxrregcount` может ухудшить в десятки раз;
- carry chain нельзя упрощать;
- shared memory limits ломают naive designs.

Это можно превратить в отдельный документ: `CUDA_ZK_OPTIMIZATION_LESSONS.md`.

### Упущенная ценность 3: CWIN sweep как реальный путь, но только после correctness

Идея CWIN tuning хорошая. Но она должна идти после:

- correct partial window;
- correct CUB sort;
- reference validation.

Иначе sweep найдет “самый быстрый неправильный MSM”.

## Что надо переименовать/переформулировать

### Было слишком широко

```txt
Birthday attack для witness finding
```

Лучше:

```txt
GPU collision/probe solver for bounded witness subproblems
```

### Было слишком уверенно

```txt
Log-domain transform → confirmed new theory
```

Лучше:

```txt
Log-domain transform → research hypothesis; feasible only for restricted domains unless DLog is tractable/lookupable
```

### Было слишком product-like

```txt
2.56 proofs/s/GPU
```

Лучше:

```txt
2.56 pps projected/measured microbenchmark, pending corrected MSM validation
```

## Рекомендованный следующий R&D план

### Sprint 1: correctness gate

1. Исправить MSM P0 из ревью.
2. Добавить CPU reference validation.
3. Получить первое корректное число MSM на T4.
4. После этого обновить HISTORY: какие цифры invalidated, какие confirmed.

### Sprint 2: circuit graph layer

1. Реальный `.r1cs` reader.
2. CSR/COO representation.
3. Feature extractor:
   - sparsity;
   - degree/hub variables;
   - components;
   - DAG/cyclic score;
   - constraint type tags.

### Sprint 3: solver zoo

1. Forward WALKSAT for DAG/causal.
2. Birthday/probe solver for bounded/hash fragments.
3. Damped BP/MG BP for hub-heavy cyclic fragments.
4. Baseline CPU/GPU fallback.

### Sprint 4: RL/Auto-selection

Сначала не настоящий RL, а rule-based policy:

```txt
if graph is DAG-like:
  use forward solver
elif bounded/hash fragment:
  use birthday/probe
elif hub-heavy cyclic:
  use damped/MG BP
else:
  fallback baseline
```

Потом собирать dataset и учить model/policy.

## Итог

Да, в истории есть ценная идея, которую легко было упустить: **WaveZK-RL интересен не только как быстрый Groth16 MSM на T4, а как адаптивный runtime/solver для разных типов ZK-схем**.

Самая перспективная формула проекта:

> WaveZK-RL is a GPU-native adaptive proving/witness runtime that classifies circuit structure and chooses the best solver/prover strategy for commodity GPUs.

А самая опасная ошибка:

> пытаться сейчас продавать проект только цифрой `2.56 proofs/s`, пока MSM correctness не закрыт.

Сохраняем идеи: birthday/probe solver, graph classifier, WALKSAT, MG/BP heuristic, CSR graph layer, commodity T4 economics.  
Чиним claims: MSM correctness, witness scope, log-domain feasibility, measured vs projected numbers.
