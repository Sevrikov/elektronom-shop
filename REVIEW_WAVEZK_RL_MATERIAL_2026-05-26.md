# Review: WaveZK-RL material pack

Дата: 2026-05-26  
Папка источника: `D:\WaveZK-RL-review\`  
Проверенные материалы:

- `README.md`
- `HISTORY.md`
- `docs/TZ_WaveZK_RL_Full.md`
- `docs/wavezk-sota-comparison-2026-05-25.md`
- `experiments/*.md`
- `cuda/msm_opt5.cu`
- `cuda/msm_opt6.cu`

Внешние источники для sanity-check:

- ZKPoG ePrint 2025/765 summary: <https://askcryp.to/t/resource-topic-2025-765-zkpog-accelerating-witgen-incorporated-end-to-end-zero-knowledge-proof-on-gpu/24071>
- ICICLE-Snark post: <https://www.ingonyama.com/post/icicle-snark-the-fastest-groth16-implementation-in-the-world>
- ICICLE FAQ/license note: <https://dev.ingonyama.com/start/integration-%26-support/faq_and_troubleshooting>
- CUB `SortPairs` signature reference: <https://nvidia.github.io/cccl/unstable/cub/api/structcub_1_1DeviceSegmentedRadixSort.html>

## Executive Summary

Материал сильный как исследовательский дневник: хорошо сохранена хронология гипотез, ошибок, замеров и решений. Видно, что работа не просто “нарисована в презентации”, а проходила через реальные CUDA-итерации: pointer bug, shared memory limit, register spilling, CUB sort, occupancy, CWIN sweep.

Но как техническое ТЗ / claim-pack для статьи, инвестора или разработчика материал пока нельзя считать надежным. Есть критические проблемы корректности в MSM-коде и в интерпретации результатов. Текущие цифры `197ms MSM / 2.54 pps` нужно считать **benchmark-гипотезой**, а не доказанным корректным Groth16 prover throughput.

Главный риск: оптимизация измеряет скорость ядра, но не доказывает корректность результата MSM/proof. Для криптографии это блокер.

## Findings

### P0. `NW=23` для BN254 Fr вероятно отбрасывает верхний бит скаляра

Файлы:

- `D:\WaveZK-RL-review\cuda\msm_opt5.cu:137-146`
- `D:\WaveZK-RL-review\experiments\wavezk-session-2026-05-26-p8.md:45-48`
- `D:\WaveZK-RL-review\HISTORY.md:286-289`

В `msm_opt5.cu` зафиксировано:

```cpp
#define CWIN 11
#define NW 23
```

Лог p8 объясняет это так: “NW=23 (253 bits, достатньо для всіх BN254 Fr < 2^254)”. Это подозрительно. `23 * 11 = 253`, то есть покрываются биты `0..252`. Но BN254 scalar field имеет 254-битный модуль, и валидные скаляры могут иметь установленный bit 253.

В коде тестовые скаляры маскируются так:

```cpp
hs[i*4+3] &= 0x3fffffffffffffffULL;
```

Это сбрасывает два старших бита 256-битного слова, но **не гарантирует**, что bit 253 равен 0. Следовательно, `NW=23` может просто игнорировать вклад верхнего бита скаляра.

Почему это критично:

- MSM с пропущенным верхним битом математически неверен.
- Быстрый benchmark может быть быстрым потому, что считает не тот MSM.
- Любые `proofs/s` поверх такого MSM нельзя использовать как claim.

Что нужно сделать:

1. Вернуть корректную обработку partial window, а не отбрасывать его.
2. Для `CWIN=11` использовать либо `NW=24` с правильной обработкой последнего неполного окна, либо доказать инвариант `scalar < 2^253`.
3. Для последнего окна не выделять полный `NB=2048` как обычное окно. Можно хранить `window_bucket_count[w]`, где последний bucket count равен `1 << remaining_bits`.
4. Добавить CPU/reference MSM validation на случайных BN254 Fr скалярах, включая скаляры с bit 253 = 1.

### P0. Вызов CUB `SortPairs` выглядит перепутанным: значения сортируются из неинициализированного буфера

Файлы:

- `D:\WaveZK-RL-review\cuda\msm_opt5.cu:267`
- `D:\WaveZK-RL-review\cuda\msm_opt5.cu:279`
- `D:\WaveZK-RL-review\cuda\msm_opt5.cu:286`
- `D:\WaveZK-RL-review\cuda\msm_opt6.cu:205`
- `D:\WaveZK-RL-review\cuda\msm_opt6.cu:216`
- `D:\WaveZK-RL-review\cuda\msm_opt6.cu:222`

Код:

```cpp
cub::DeviceRadixSort::SortPairs(stmp, ssz, dk, dsv, dsv2, dk, total);
```

По сигнатуре CUB порядок аргументов такой:

```cpp
SortPairs(temp, bytes, keys_in, keys_out, values_in, values_out, num_items)
```

В текущем коде:

- `keys_in = dk`
- `keys_out = dsv`
- `values_in = dsv2`
- `values_out = dk`

Но `k_extract()` пишет `dk` и `dsv`, а не `dsv2`. То есть `dsv2` перед сортировкой выглядит неинициализированным. При этом `k_badd*()` затем читает именно `dsv2` как отсортированные индексы точек.

Ожидаемый паттерн должен быть примерно:

```cpp
int *dk_sorted;
cudaMalloc(&dk_sorted, total * sizeof(int));
cub::DeviceRadixSort::SortPairs(stmp, ssz, dk, dk_sorted, dsv, dsv2, total);
```

Почему это критично:

- Если `dsv2` неинициализирован, BktAdd может читать случайные индексы точек.
- Замер времени BktAdd может быть невалиден.
- Корректность MSM не доказана.

Что нужно сделать:

1. Исправить порядок аргументов `SortPairs`.
2. Добавить `dk_sorted` как отдельный буфер.
3. После sort проверить, что `dk_sorted` монотонен, а `dsv2` содержит перестановку `0..N-1` в рамках bucket entries.
4. Добавить CUDA error checks после каждого CUB/kernel вызова.

### P0. Нет проверки корректности MSM против CPU/reference implementation

Файлы:

- `D:\WaveZK-RL-review\cuda\msm_opt5.cu`
- `D:\WaveZK-RL-review\cuda\msm_opt6.cu`

В коде нет:

- CPU reference MSM;
- сравнения результата GPU vs CPU;
- проверки результата `k_reduce`;
- проверки, что `wins` или итоговая сумма совпадает с известным test vector;
- `cudaGetLastError()` / `cudaPeekAtLastError()` вокруг kernel launch.

Для криптографического кода “быстро” без “правильно” не имеет веса.

Что нужно сделать:

1. На малых `N` (`N=1, 2, 8, 256, 4096`) сравнивать GPU MSM с CPU reference.
2. Добавить тестовые скаляры:
   - `0`
   - `1`
   - `r-1`
   - `2^253`
   - random `< r`
3. Добавить разные точки, а не только один generator.
4. Вынести validation mode:

```bash
./msm_opt5 --validate --N 4096
```

### P1. Benchmark использует синтетические данные, не похожие на реальный Groth16 workload

Файлы:

- `D:\WaveZK-RL-review\cuda\msm_opt5.cu:244-255`
- `D:\WaveZK-RL-review\cuda\msm_opt6.cu:181-190`

Проблемы:

- Скаляры генерируются через `rand()`, не через cryptographic/random field generation.
- Все точки в `hp` одинаковые: BN254 G1 generator.
- Нет загрузки CRS/proving key points.
- Нет реального распределения scalars из witness / polynomial evaluations.

Это можно использовать для микробенча BktAdd, но нельзя переносить напрямую в “реальный Groth16 prover throughput”.

Что нужно сделать:

1. Подготовить fixture из реального Groth16 proving key или хотя бы набора валидных random G1 points.
2. Проверить, что memory locality, bucket distribution и cache behavior похожи на реальный CRS.
3. Разделить в документации:
   - synthetic microbenchmark;
   - algorithmic benchmark;
   - end-to-end proof benchmark.

### P1. Текущий pack неполный: заявлено больше, чем приложено

Файл: `D:\WaveZK-RL-review\README.md`

В папке есть только:

- `cuda/msm_opt5.cu`
- `cuda/msm_opt6.cu`

Но история ссылается на множество `/tmp/*.cu` файлов:

- `msm_opt3b.cu`
- `mont_bench.cu`
- `pipp_sort2.cu`
- `bn254_ntt.cu`
- `poseidon_stream.cu`
- `csr_r1cs.cu`
- `hub_bp.cu`
- `walksat.cu`

Без этих файлов нельзя воспроизвести большую часть claims.

Что нужно сделать:

1. Добавить папку `cuda/archive/` или `experiments/code/` со всеми исходниками, которые упомянуты в HISTORY.
2. Добавить checksums или commit ids.
3. Добавить `run_benchmarks.sh` / `run_benchmarks.ps1`.
4. Не ссылаться на `/tmp` как на источник правды.

### P1. В документах смешаны подтвержденные результаты, оценки и будущие гипотезы

Примеры:

- `p7`: `85ms MSM → 3.53 proofs/s` было оценкой после замены fp_mul.
- `p8`: фактический лучший измеренный результат стал `197ms MSM → 2.54 proofs/s`.
- `README`: указывает `msm_opt5` как `2.56 pps`, но рядом `msm_opt3b` как baseline `2.54`.
- `TZ`: revenue roadmap до `$30K/міс + $100K grant` подан слишком уверенно для текущего уровня технической валидации.

Что нужно сделать:

Ввести статус для каждого числа:

- `MEASURED`: реально измерено на T4, код приложен, команда запуска есть.
- `ESTIMATED`: расчет на основе microbench.
- `PROJECTED`: гипотеза после будущей оптимизации.
- `BUSINESS ASSUMPTION`: зависит от рынка/API/контракта.

### P1. Claim “birthday attack для witness finding” требует сильного сужения формулировки

Файлы:

- `D:\WaveZK-RL-review\docs\wavezk-sota-comparison-2026-05-25.md`
- `D:\WaveZK-RL-review\HISTORY.md`

Формулировка “witness finding” выглядит слишком широкой. Birthday/collision approach применим только к специальным схемам, где witness действительно можно свести к поиску коллизии/прообраза/малого separator subproblem.

Для общего R1CS witness generation это не универсальный метод. В общем случае witness задается программой/схемой, а не произвольным поиском пары.

Что нужно сделать:

Заменить broad claim:

> GPU birthday attack for ZK witness finding

на более точное:

> GPU warp-shuffle collision/probe search for a subclass of witness-generation subproblems, such as hash/preimage or bounded separator constraints.

И отдельно доказать, какие реальные circom/R1CS схемы попадают в этот класс.

### P1. Log-domain BP для BN254 фактически отмечен как blocker, но в SOTA-документе подается как novel theory

Файлы:

- `D:\WaveZK-RL-review\docs\TZ_WaveZK_RL_Full.md:40-48`
- `D:\WaveZK-RL-review\docs\wavezk-sota-comparison-2026-05-25.md`

Само ТЗ правильно говорит: нужно проверить feasibility через factorization `r-1`. Но SOTA-документ уже продает это как “Новая теория”.

Проблема: дискретный лог в большом поле обычно является тяжелой криптографической задачей. Если pipeline требует массово вычислять `k[v] = log_g(w[v])`, это может убить идею, кроме специальных подгрупп/малых доменов/предтабулированных значений.

Что нужно сделать:

1. Завершить `factorint(r - 1)` и записать результат.
2. Описать, какие значения реально логарифмируются:
   - весь BN254 Fr;
   - малая подгруппа;
   - lookup table;
   - ограниченный диапазон witness.
3. До этого держать log-domain BP в статусе `HYPOTHESIS / BLOCKED`, не `confirmed`.

### P2. В логах есть приватные/операционные данные

Файлы:

- `D:\WaveZK-RL-review\experiments\wavezk-session-2026-05-26-p7.md`
- `D:\WaveZK-RL-review\experiments\wavezk-session-2026-05-26-p8.md`

В логах есть:

- email Colab-аккаунта;
- локальный WebSocket URL DevTools;
- внутренние пути.

Если pack будет отправляться внешнему ревьюеру или инвестору, это нужно убрать.

Что нужно сделать:

- Создать `public-review/` версию без email, WS URL, локальных путей и временных `/tmp` деталей.

### P2. Нет воспроизводимого окружения

Проверка на текущей машине:

- `nvcc` не найден.
- `nvidia-smi` не найден.
- `D:\WaveZK-RL-review` не является git-репозиторием.

Это нормально для review-pack, но плохо для технической приемки.

Что нужно сделать:

- Добавить `Dockerfile` или Colab notebook export.
- Добавить точные версии:
  - CUDA Toolkit;
  - CUB/CCCL;
  - GPU model;
  - driver;
  - compiler flags;
  - `nvcc -Xptxas=-v` output для register count/spills.

## Что в материале сильное

1. **Хронология решений хорошая.** Видно, какие гипотезы отклонялись и почему: ICICLE, multi-acc, sorted atomics, shared memory overflow.
2. **MSM bottleneck найден правильно.** Переход от witness focus к MSM focus выглядит зрелым.
3. **Register pressure lesson ценный.** Multi-accumulator провал объяснен правдоподобно.
4. **CUB sort как архитектурный ход разумен.** Но реализация должна быть проверена и исправлена.
5. **SOTA-раздел уже полезен как черновик.** Внешние источники подтверждают, что ZKPoG заявляет 22.8x на RTX 4090, а ICICLE действительно активно позиционируется как быстрый Groth16 backend; по ICICLE licensing нужно аккуратно ссылаться на официальные FAQ.

## Рекомендованный следующий план

### Phase A: Correctness first

1. Исправить `SortPairs` аргументы.
2. Исправить partial-window handling для `CWIN=11`.
3. Добавить `cudaGetLastError` checks.
4. Добавить CPU reference MSM для `N <= 4096`.
5. Проверить edge scalars: `0`, `1`, `r-1`, `2^253`, random `< r`.
6. Использовать разные валидные G1 points.

### Phase B: Reproducible benchmark

1. Приложить `msm_opt3b.cu`, `mont_bench.cu`, `pipp_sort2.cu`.
2. Добавить compile scripts.
3. Сохранить benchmark logs.
4. Указывать confidence: median/best/min over N runs.
5. Отдельно мерить:
   - sort;
   - count;
   - badd;
   - reduce;
   - final weighted sum across windows.

### Phase C: Documentation cleanup

1. Разметить claims как `MEASURED / ESTIMATED / PROJECTED`.
2. Убрать приватные Colab данные.
3. Исправить broad claims по witness finding.
4. Перевести `TZ_WaveZK_RL_Full.md` из quick reference в полноценное ТЗ или переименовать файл.
5. Добавить “Known Invalidated Results” для p7 `85ms` оценки, чтобы она не смешивалась с p8 `197ms`.

## Итоговый статус

Статус: **research pack promising, not yet technically accepted**.

На уровне идеи и исследовательской траектории проект интересный. На уровне криптографического/инженерного доказательства пока есть P0-блокеры: возможно неверный MSM из-за `NW=23`, подозрительный `CUB SortPairs`, отсутствие CPU/reference validation и синтетический workload.

До исправления этих пунктов материал лучше использовать как внутренний R&D журнал, а не как внешний claim “у нас 2.56 proofs/s корректного Groth16 prover на T4”.
