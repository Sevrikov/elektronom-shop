# WaveZK-RL: путь к серьезному научно-инженерному уровню

Дата: 2026-05-26  
Контекст: развитие идеи из `D:\WaveZK-RL-review\HISTORY.md`

## Главная мысль

WaveZK-RL не стоит развивать только как “еще один быстрый Groth16 prover” или “CUDA-оптимизацию MSM”. На серьезный уровень проект может выйти, если соединить четыре слоя:

1. **Математическое ядро**: finite fields, elliptic curves, pairings, MSM, NTT, R1CS.
2. **Компиляторный анализ схем**: R1CS/CircuitGraph, sparsity, hubs, DAG/cyclic structure, hash/preimage fragments.
3. **GPU solver/prover backend**: CUDA kernels, MSM/NTT, sparse graph processing, witness subproblem solvers.
4. **Policy/RL layer**: автоматический выбор стратегии под структуру схемы и доступное железо.

Правильное позиционирование:

> WaveZK-RL is a GPU-native adaptive proving/witness runtime that classifies circuit structure and chooses the best solver/prover strategy for commodity GPUs.

То есть это не просто prover, а адаптивный runtime для разных типов ZK-схем.

## Почему это сильнее, чем просто MSM

Если проект свести только к MSM/NTT, он конкурирует напрямую с ICICLE, CuZK, ZKPoG и другими командами, у которых сильная криптография, много GPU-инженеров и зрелые библиотеки.

Более интересная ниша:

- анализировать схему;
- понимать ее структуру;
- выбирать solver path;
- ускорять witness/proof там, где обычный prover не использует структуру задачи;
- оптимизировать не только latency, но и `$ per proof` на commodity GPU.

Это может быть более оригинальным вкладом, чем “мы сделали еще один быстрый Pippenger”.

## Базовая архитектура

```txt
.r1cs / proving key / witness input
        ↓
CircuitGraph IR
        ↓
Feature Extractor
        ↓
Strategy Policy
        ↓
Solver / Prover Backend
        ↓
Verified MSM / Verified Proof / Benchmark Report
```

### CircuitGraph IR

Нужен единый внутренний формат схемы:

- variables;
- constraints;
- A/B/C matrices;
- sparse representation CSR/COO;
- graph edges;
- degree distribution;
- connected components;
- DAG/cyclic score;
- hub variables;
- constraint type tags.

Это фундамент для всех следующих слоев.

### Feature Extractor

Из `.r1cs` нужно извлекать:

- количество constraints;
- количество variables;
- sparsity;
- density;
- max/avg degree;
- hub variables;
- DAG depth;
- connected components;
- цикличность;
- hash/preimage fragments;
- lookup density;
- expected witness/proof cost;
- memory footprint.

### Strategy Policy

Сначала не нужен настоящий RL. Сначала достаточно rule-based policy:

```txt
if graph is DAG-like:
    use forward solver / WALKSAT-style propagation
elif bounded/hash fragment:
    use birthday/probe GPU search
elif hub-heavy cyclic:
    use damped BP / multigrid BP heuristic
else:
    use baseline witness/prover path
```

Когда накопится dataset схем и результатов, можно переходить к bandits/RL/meta-learning.

## Какие библиотеки использовать как фундамент

### Arkworks

Rust-экосистема для zkSNARK, R1CS, Groth16 и elliptic curves. Хороший вариант для reference implementation и корректности.

Роль в проекте:

- CPU/reference Groth16;
- reference MSM;
- R1CS structures;
- test vectors;
- correctness validation.

### Gnark

Go-экосистема для ZK, Groth16, BN254, практических circuit workflows. Полезна как источник сравнения и как production-oriented baseline.

Роль:

- benchmark competitor;
- source of practical circuits;
- comparison with existing prover flow.

### Circom / snarkjs / rapidsnark

Практический мир `.r1cs`, `.zkey`, witness и Groth16.

Роль:

- реальные схемы;
- реальные `.r1cs`;
- baseline;
- совместимость с существующим ZK workflow.

### ICICLE

Использовать не как обязательную зависимость, а как optional backend / competitor / comparison point.

Роль:

- внешний ускоритель, если лицензия позволяет;
- benchmark target;
- proof that external backend integration is possible.

## Математический аппарат

### 1. Finite Fields / Elliptic Curves / Pairings

Нужно твердо закрыть:

- BN254 Fr/Fp;
- Montgomery arithmetic;
- FIOS/CIOS multiplication;
- carry propagation;
- G1/G2 operations;
- MSM;
- NTT;
- Groth16 proof structure.

Это база корректности.

### 2. Graph Theory

R1CS нужно рассматривать как factor graph / bipartite graph:

- variables ↔ constraints;
- degree distribution;
- hubs;
- components;
- DAG-like fragments;
- cyclic fragments;
- separator variables.

Это база для strategy selection.

### 3. Constraint Satisfaction / SAT / WALKSAT

Для witness solving полезны:

- local search;
- WALKSAT;
- forward propagation;
- bounded search;
- conflict analysis.

Особенно важно для causal/DAG-like fragments.

### 4. Belief Propagation / Factor Graphs

BP/MG BP стоит оставить как heuristic:

- не как универсальный solver;
- а как stabilizer/preconditioner для hub-heavy/cyclic fragments;
- с метрикой violations reduction per millisecond.

### 5. Sparse Linear Algebra

CSR/COO representation обязателен:

- dense R1CS быстро становится физически невозможным;
- sparse graph traversal нужен для анализа и solver execution;
- memory layout влияет на GPU performance.

### 6. Performance Modeling

Нужно использовать:

- roofline model;
- occupancy analysis;
- register pressure analysis;
- memory bandwidth;
- launch overhead;
- PCIe transfer overhead;
- cost per proof.

### 7. Bandits / RL / Meta-Learning

Настоящий RL нужен позже. Сначала:

- собрать dataset схем;
- измерить strategy performance;
- сделать rule-based policy;
- потом заменить policy на contextual bandit/RL.

## Ценные solver-направления

### Birthday / Probe Solver

Не позиционировать как “универсальный witness finding”.

Правильная формулировка:

> GPU collision/probe solver for bounded witness subproblems.

Где может работать:

- hash/preimage fragments;
- bounded search;
- separator subproblems;
- lookup-like constraints;
- small-domain variables;
- brute-force fragments внутри общей схемы.

### Forward WALKSAT / Causal Solver

Очень перспективно для DAG-like structures.

Задача:

- выделить causal fragments;
- запускать forward solver;
- сравнить с generic witness generation;
- измерить convergence и violations.

### Damped BP / Multigrid BP

Оставить как heuristic для hub-heavy/cyclic fragments.

Метрики:

- violations reduction;
- convergence quality;
- time to acceptable residual;
- effect of damping;
- effect of multigrid density stratification.

### GPU MSM / NTT

Это must-have, но не единственная ценность.

Сначала correctness:

- CPU reference MSM;
- edge scalars;
- partial windows;
- different G1 points;
- real proving key points.

Потом performance:

- CWIN sweep;
- SoA layout;
- bucket scheduling;
- register pressure;
- memory coalescing;
- persistent kernels.

## MVP: что собрать первым

### MVP 1: WaveZK-CircuitProfiler

CLI:

```bash
wavezk analyze circuit.r1cs
```

Вывод:

- constraints count;
- variable count;
- sparsity;
- graph stats;
- hub variables;
- DAG/cyclic classification;
- estimated proof/witness cost;
- recommended strategy.

### MVP 2: WaveZK-GPU-MSM

CLI:

```bash
wavezk msm-bench --curve bn254 --n 4096 --validate
wavezk msm-bench --curve bn254 --n 2430000 --gpu T4
```

Обязательные свойства:

- CPU reference validation;
- test vectors;
- edge scalar tests;
- proof that partial windows are correct;
- real random G1 points;
- benchmark logs.

### MVP 3: WaveZK-SolverPolicy

CLI:

```bash
wavezk plan circuit.r1cs --gpu T4
```

Вывод:

```txt
Circuit class: DAG-like + hash fragments
Recommended:
  witness: forward solver + bounded probe
  proof: GPU MSM/NTT
Expected:
  memory: ...
  time: ...
  risk: ...
```

### MVP 4: End-to-End Benchmark Harness

CLI:

```bash
wavezk benchmark circuit.r1cs --strategy auto --compare rapidsnark,snarkjs,gnark
```

Нужно сравнивать:

- correctness;
- proof verification;
- latency;
- throughput;
- GPU memory;
- cost per proof.

## Научная программа

### Research Question 1

Можно ли автоматически классифицировать R1CS-схемы так, чтобы выбор solver strategy давал устойчивый выигрыш?

### Research Question 2

Какие классы witness subproblems реально ускоряются через GPU collision/probe search?

### Research Question 3

Может ли graph topology-aware witness solving улучшить end-to-end proving cost на commodity GPUs?

### Research Question 4

Когда BP/MG BP полезен как heuristic, а когда он принципиально проигрывает WALKSAT/forward propagation?

### Research Question 5

Какой минимальный набор circuit features достаточен для хорошего strategy selection?

## Как оформить научный уровень

Нужно разделить claims:

- `MEASURED`: измерено, код приложен, команда запуска есть;
- `VALIDATED`: есть CPU/reference correctness;
- `ESTIMATED`: расчет на основе microbench;
- `PROJECTED`: будущая оптимизация;
- `BUSINESS ASSUMPTION`: зависит от рынка/API/цены.

Для статьи/whitepaper обязательно:

- theorem/lemma для применимости birthday/probe;
- formal definition of circuit classes;
- benchmark methodology;
- ablation study;
- correctness tests;
- comparison with baselines;
- limitations section.

## Сравнение с baselines

Нужно сравнивать с:

- snarkjs;
- rapidsnark;
- gnark;
- arkworks;
- ICICLE where possible;
- CuZK / ZKPoG literature numbers.

Важно:

- не сравнивать T4 microbenchmark с RTX 4090 end-to-end напрямую без нормализации;
- не смешивать witness-only и proof-only acceleration;
- не смешивать synthetic и real circuits.

## Что нельзя делать

1. Нельзя продавать `2.56 proofs/s` до закрытия correctness MSM.
2. Нельзя писать “general witness finding”, если ускоряются только bounded/hash fragments.
3. Нельзя считать log-domain BP подтвержденным, пока DLog feasibility не закрыт.
4. Нельзя строить бизнес-план только на ICICLE.
5. Нельзя смешивать measured и projected цифры.

## Дорожная карта

### Sprint 1: Correctness Gate

- Исправить MSM partial windows.
- Исправить CUB `SortPairs`.
- Добавить CPU reference MSM.
- Добавить edge scalar tests.
- Добавить разные G1 points.
- Получить первое корректное T4 MSM число.

### Sprint 2: CircuitGraph Layer

- Реальный `.r1cs` reader.
- CSR/COO graph representation.
- Feature extractor.
- Graph statistics report.
- DAG/cyclic/hub classification.

### Sprint 3: Solver Zoo

- Forward WALKSAT for DAG-like fragments.
- Birthday/probe solver for bounded/hash fragments.
- Damped BP/MG BP for hub-heavy cyclic fragments.
- Baseline fallback.

### Sprint 4: Strategy Policy

- Rule-based policy.
- Benchmark each strategy on fixture circuits.
- Store results.
- Generate recommendation reports.

### Sprint 5: End-to-End Proof Benchmark

- Integrate with rapidsnark/snarkjs/arkworks/gnark baselines.
- Verify proofs.
- Measure full pipeline.
- Produce cost-per-proof report.

### Sprint 6: Learning Layer

- Dataset of circuits and strategy outcomes.
- Contextual bandit or lightweight RL.
- Strategy prediction.
- Online tuning of batch size/window size/backend.

## Что может стать продуктом

### Developer CLI

```bash
wavezk analyze
wavezk plan
wavezk benchmark
wavezk prove
```

### Proving Infrastructure Optimizer

Сервис, который говорит:

- какой backend выбрать;
- сколько GPU нужно;
- сколько будет стоить proof;
- какие схемы плохо подходят для текущей инфраструктуры.

### Research Toolkit

Библиотека для анализа R1CS topology и solver strategies.

### Commodity GPU Prover Runtime

Runtime под T4/L4/A10, где ключевой показатель — не absolute speed, а price/performance.

## Итог

Вывести WaveZK-RL на серьезный уровень можно, но не через одну CUDA-оптимизацию. Сильный путь — соединить:

- криптографически корректный Groth16/MSM/NTT backend;
- R1CS graph analysis;
- solver zoo для разных классов witness subproblems;
- strategy policy / RL;
- воспроизводимый benchmark harness;
- честную научную методологию.

Самая сильная формула:

> WaveZK-RL — это адаптивный GPU-native runtime для ZK-схем, который классифицирует структуру circuit и выбирает оптимальную witness/proof стратегию под commodity GPU.

Самый быстрый путь к ценности:

1. закрыть correctness MSM;
2. сделать `.r1cs` analyzer;
3. доказать пользу strategy selection хотя бы на 3-5 классах схем;
4. только потом строить RL и коммерческий prover service.
