# Детальное исследование: Al/Cu соединения, наконечники, клеммы, АВР 3P/4P и fact-check характеристик

Дата: 2026-05-31  
Контекст: развитие `/calculators` и будущего схемостроителя Elektronom  
Цель: описать правила, которые не позволят калькулятору/схемостроителю предложить опасное или неподтверждённое решение.

## 1. Главный вывод

Для инженерного калькулятора недостаточно знать “кабель 2.5 мм², автомат 16А”. Нужен слой технической совместимости:

1. Материал проводника: Cu / Al.
2. Тип проводника: solid / stranded / flexible.
3. Тип соединения: клемма, наконечник, гильза, шина, аппаратный зажим.
4. Допуск производителя: разрешён ли именно этот материал, сечение, класс жилы и комбинация Al/Cu.
5. Условия применения: сухое помещение, влажность, щит, коробка, PV/наружная установка, температура.
6. Нейтраль и схема заземления: особенно для АВР, генератора, инвертора, UPS.
7. Fact-check по первичным источникам: datasheet производителя, каталог, инструкция, сертификат/стандарт.

Если любой из этих пунктов неизвестен, система не должна уверенно рекомендовать товар. Максимум — показать “кандидат требует проверки”.

## 2. Источники и что из них важно

### WAGO: алюминий только при строгих условиях

Источник:  
https://www.wago.com/global/material-specifications  
https://www.wago.com/global/building-technology/electrical-installers/practical-tip-connecting-aluminum-and-copper-conductors

Ключевые выводы:

- WAGO прямо указывает, что их технология соединения рассчитана на медные проводники как базовый случай.
- Для алюминия разрешены только определённые серии, например 2273, 773, 224, 222, 280, 281, 780, 781 и некоторые screw-type решения.
- Для алюминия нужно использовать WAGO Alu-Plus Contact Paste, артикул `249-130`.
- WAGO 221 не одобрен для Al/Cu в указанном материале WAGO.
- Для Al/Cu через WAGO есть ограничения по сечению и типу жилы: в практическом материале указан solid aluminum up to 4 mm² для определённых серий.
- Нужно учитывать меньшую проводимость Al: WAGO приводит ориентиры 2.5 мм² Al = 16 A, 4 мм² Al = 22 A.

Правило для системы:

```text
Если conductorMaterial = Al и connector.brand = WAGO:
  разрешить только серии из allow-list производителя;
  требовать antiOxidationPaste = WAGO 249-130 или prefilled connector;
  запрещать WAGO 221 для Al/Cu;
  проверять solid/stranded и сечение;
  если данных нет — BLOCK для заказа.
```

### Phoenix Contact UBAL: отдельные Al/Cu клеммы

Источник:  
https://www.phoenixcontact.com/assets/7412c45d-9275-46a5-8e65-168a1223de67/index.html

Ключевые выводы:

- Серия UBAL Al/Cu предназначена именно для подключения алюминиевых и медных проводников в одном клеммнике.
- Указан диапазон: Al 6-240 мм² и Cu 2.5-240 мм².
- Клеммы предварительно смазаны, имеют биметаллическую контактную поверхность.
- Указана сертификация по IEC/EN 61238-1 Class A.
- Phoenix отдельно описывает проблемы Al: окисление, creep behavior, коррозия.

Правило для системы:

```text
Если соединение Al/Cu и сечение >= 6 мм²:
  искать специализированную Al/Cu клемму/блок, например Phoenix UBAL;
  требовать стандарт IEC/EN 61238-1 Class A или эквивалент;
  если обычная Cu-клемма — BLOCK.
```

### Klauke: биметаллические наконечники и гильзы

Источник:  
https://www.klauke.com/Media/Default/Downloads/CatalogsBrochures/BRFACH19GB_Klauke%20Fachwissen_02_2019_I_GB.pdf

Ключевые выводы:

- Klauke прямо описывает комбинацию Al/Cu как проблемную.
- Для профессионального соединения Al и Cu требуются Al/Cu compression cable lugs или Al/Cu connectors.
- Контактная смазка для Al улучшает свойства соединения.
- Для Al/Cu важны тип жилы по EN 60228, сечение, форма жилы, подходящая матрица обжима и маркировка наконечника.
- Простая лужёная алюминиевая клемма допустима только в постоянно сухих помещениях и чувствительна к повреждению слоя.

Правило для системы:

```text
Если Al кабель подключается к Cu-шине:
  требовать bimetallic Al/Cu lug;
  проверять boltSize, conductorClass, conductorShape, crossSection;
  требовать compatibleCrimpDie/tool;
  если наконечник просто Cu или неизвестный — BLOCK.
```

### Schneider / ASCO: конфигурации нейтрали в АВР

Источник:  
https://www.se.com/us/en/faqs/FAQ000220886/

Ключевые выводы:

- ASCO/Schneider описывает разные конфигурации нейтрали: solid neutral, switched neutral, overlapping neutral.
- Switched neutral использует дополнительный полюс, чтобы нейтраль нормального или аварийного источника подключалась к нейтрали нагрузки.
- Overlapping neutral применяется для передачи между separately derived systems без разрыва нейтрали.

Правило для системы:

```text
АВР нельзя выбирать только по току и количеству фаз.
Нужно знать neutralMode:
  solidNeutral
  switchedNeutral
  overlappingNeutral
  none/unknown
```

### Eaton: 3P и 4P АВР — это вопрос безопасности, а не вкуса

Источник:  
https://www.eaton.com/content/dam/eaton/markets/healthcare/knowledge-center/white-paper/3-pole-and-4-pole-transfer-switch-switching-characteristics.pdf

Ключевые выводы:

- Eaton пишет, что 3-pole transfer switches могут применяться в non-separately derived systems при правильных interlocks.
- Для separately derived systems 3P не подходит как простое решение; Eaton указывает необходимость 4P, чтобы исключать циркулирующие токи нейтрали/земли и ложные срабатывания ground fault protection.
- Eaton подчёркивает, что выбор между 3P и 4P связан с безопасностью и соответствием требованиям, а не только с ценой.

Правило для системы:

```text
Если source2 = generator/inverter/UPS и source2NeutralBonded = true:
  считать источник separately derived или требующим проверки;
  требовать 4P / switched neutral / approved neutral scheme;
  3P ATS = BLOCK, если нет явно описанной схемы solid neutral + floating neutral + compliant bonding.
```

### ABB и Cummins: 3P/4P доступны как разные исполнения

Источники:  
ABB catalog / transfer switches: https://library.e.abb.com/public/58b8fd169c35425c95c0696e8677bd85/Catalogo%20Tecnico_Interruptores%20seccionadores%20conmutadores%20OT_C.pdf  
Cummins OTEC: https://www.cummins.com/generators/products/related-products-and-services/transfer-switches/otec-transfer-switch

Ключевые выводы:

- ABB в кодировке OTM показывает количество полюсов как часть типа изделия: 2 / 3 / 4 poles.
- ABB предлагает 3- и 4-полюсные исполнения.
- Cummins описывает 3-pole и 4-pole/switched neutral исполнения; 3P модели могут иметь neutral bar, но это не означает, что нейтраль переключается.

Правило для системы:

```text
Для товара ATS поля poles недостаточно.
Нужно отдельное поле neutralSwitching:
  none
  solidNeutralBar
  switchedNeutral
  overlappingNeutral
```

## 3. Новые сущности для каталога товаров

### 3.1 EngineeringSpec для любого инженерного товара

```ts
interface EngineeringSpecBase {
  engineeringRole:
    | 'wire'
    | 'cable'
    | 'connector'
    | 'terminalBlock'
    | 'lug'
    | 'sleeve'
    | 'breaker'
    | 'rcd'
    | 'rcbo'
    | 'ats'
    | 'voltageRelay'
    | 'panel'
    | 'busbar'
    | 'spd'
  manufacturer: string
  manufacturerPartNumber: string
  datasheetUrl: string
  catalogUrl?: string
  manualUrl?: string
  sourceVerifiedAt: string
  sourceConfidence: 'manufacturer' | 'distributor' | 'manual-review' | 'unknown'
}
```

### 3.2 Кабель/провод

```ts
interface CableSpec extends EngineeringSpecBase {
  engineeringRole: 'cable' | 'wire'
  conductorMaterial: 'Cu' | 'Al' | 'tinnedCu'
  conductorClass: 'solid' | 'stranded' | 'flexible'
  conductorShape?: 'round' | 'sector'
  crossSectionMm2: number
  cores: number
  insulation: string
  ratedVoltage: string
  maxOperatingTempC?: number
  standardRefs: string[]
}
```

### 3.3 Клемма / соединитель / наконечник

```ts
interface ConnectionSpec extends EngineeringSpecBase {
  engineeringRole: 'connector' | 'terminalBlock' | 'lug' | 'sleeve'
  allowedMaterials: Array<'Cu' | 'Al' | 'AlCu' | 'tinnedCu'>
  allowsMixedAlCu: boolean
  allowedConductorClass: Array<'solid' | 'stranded' | 'flexible'>
  minSectionMm2: number
  maxSectionMm2: number
  prefilledPaste?: boolean
  requiredPasteSku?: string
  requiresSurfaceCleaning?: boolean
  requiresCrimpTool?: boolean
  requiredCrimpDies?: string[]
  boltSize?: string
  standardRefs: string[]
  dryLocationOnly?: boolean
}
```

### 3.4 АВР / переключатель источников

```ts
interface AtsSpec extends EngineeringSpecBase {
  engineeringRole: 'ats'
  poles: 2 | 3 | 4
  ratedCurrentA: number
  ratedVoltageV: number
  utilizationCategory?: 'AC-21A' | 'AC-22A' | 'AC-23A' | string
  standardRefs: string[]
  transitionType: 'open' | 'closed' | 'delayed' | 'unknown'
  neutralSwitching: 'none' | 'solidNeutralBar' | 'switchedNeutral' | 'overlappingNeutral' | 'unknown'
  sourceTypesAllowed: Array<'utility' | 'generator' | 'inverter' | 'ups'>
  separatelyDerivedAllowed: boolean | 'onlyWith4P' | 'unknown'
  mechanicalInterlock: boolean
  electricalInterlock?: boolean
}
```

## 4. Новые поля проекта для схемостроителя

```ts
interface PowerSourceInput {
  id: string
  type: 'utility' | 'generator' | 'inverter' | 'ups'
  phases: 1 | 3
  neutralMode: 'floating' | 'bondedToPe' | 'unknown'
  hasLocalEarthElectrode?: boolean
  ratedPowerKw?: number
}

interface EngineeringProjectInput {
  earthingSystem: 'TN-S' | 'TN-C-S' | 'TN-C' | 'TT' | 'IT' | 'unknown'
  peAvailable: boolean
  penSplitPoint?: 'meterPanel' | 'mainPanel' | 'unknown'
  sources: PowerSourceInput[]
  atsRequired: boolean
  atsNeutralPolicy: 'solid' | 'switched' | 'overlap' | 'unknown'
  prospectiveShortCircuitKa?: number
  installationEnvironment: 'dry' | 'damp' | 'outdoor' | 'industrial'
}
```

## 5. Правила NormGuard для Al/Cu

### P0_BLOCK

1. Прямое соединение Al и Cu в обычной клемме без допуска `allowsMixedAlCu`.
2. Использование WAGO 221 для Al/Cu.
3. Алюминий в клемме/аппарате, где datasheet допускает только Cu.
4. Al многопроволочная жила в клемме, которая допускает только solid Al.
5. Al/Cu наконечник без подтверждения сечения, класса жилы, болта и инструмента обжима.
6. Al/Cu соединение во влажной среде без специализированного биметаллического решения и защиты от коррозии.
7. Отсутствует обязательная паста/смазка, если производитель требует её.

### P1_WARNING

1. Известно, что соединение Al/Cu допустимо, но нет данных о моменте затяжки.
2. Есть datasheet, но нет ссылки на инструкцию монтажа.
3. Указана паста, но не указана температура эксплуатации.
4. Старая алюминиевая проводка в квартире: требовать ручной осмотр и протокол электрика.

### P2_INFO

1. Подсказать зачистку Al непосредственно перед монтажом.
2. Подсказать повторную протяжку только если это требует производитель; не навязывать там, где клемма maintenance-free.
3. Подсказать маркировку Al/Cu перехода на схеме.

## 6. Правила NormGuard для АВР 3P/4P и нейтрали

### P0_BLOCK

1. 3P АВР выбран для 3-фазной схемы с источником `generator/inverter/ups`, у которого `neutralMode = bondedToPe`, и нет подтверждённой схемы solid neutral.
2. 3P АВР выбран, но проект требует switched neutral.
3. 4P АВР выбран, но downstream оборудование/UPS требует solid neutral и производитель запрещает switched neutral.
4. АВР без mechanical interlock.
5. Нейтраль отсутствует в схеме, где есть однофазные нагрузки 230 В.
6. Не указан режим нейтрали генератора/инвертора.
7. Одновременное соединение нейтралей двух источников при separately derived system.

### P1_WARNING

1. 3P АВР с solid neutral допустим только при подтверждённом floating neutral источника и корректной системе заземления.
2. 4P АВР требует проверки transient/sequence, особенно для UPS и чувствительных нагрузок.
3. Unknown transition type: open/closed/delayed.
4. Неизвестна категория применения AC-22A/AC-23A.

### P2_INFO

1. Показать пользователю объяснение: 3P переключает фазы, но нейтраль остаётся общей/solid.
2. Показать объяснение: 4P переключает фазы и нейтраль.
3. Показать предупреждение, что “нейтраль” не всегда безопасно считать нулём; её режим зависит от источника и заземления.

## 7. Fact-check характеристик товара

### 7.1 Источники доверия

У каждого инженерного товара нужен источник:

1. `manufacturer_datasheet` — высший приоритет.
2. `manufacturer_catalog`.
3. `manufacturer_manual`.
4. `official_distributor`.
5. `seller_text` — низкий приоритет, не годится для нормо-допуска.
6. `ai_extracted` — только черновик, требует ручной проверки.

### 7.2 Поля с обязательным подтверждением

Для клемм/наконечников:

- материал;
- сечение;
- класс жилы;
- mixed Al/Cu allowed;
- паста/смазка;
- момент затяжки;
- стандарт;
- температура;
- условия применения.

Для АВР:

- количество полюсов;
- neutralSwitching;
- rated current;
- rated voltage;
- transition type;
- utilization category;
- standards;
- source compatibility;
- neutral bar / switched neutral / overlapping neutral;
- interlock.

Для автоматов:

- ratedCurrentA;
- curve;
- poles;
- breakingCapacityKa;
- standard;
- ratedVoltage;
- terminal allowed material Cu/Al;
- tightening torque.

Для УЗО/дифов:

- leakageMa;
- rcdType: AC/A/F/B;
- poles;
- ratedCurrentA;
- ratedVoltage;
- standard;
- short-circuit coordination if required.

## 8. UI требования

### 8.1 Значки на схеме

- `BLOCKED`: красный значок стоп на компоненте и линии.
- `WARNING`: жёлтый треугольник.
- `UNKNOWN`: серый вопрос.
- `VERIFIED`: зелёная галка с подписью “datasheet verified”.
- `MANUFACTURER_SOURCE`: синяя иконка документа.

### 8.2 Поведение при выборе товара

Если пользователь выбирает товар вручную:

1. Система сравнивает `requiredSpec` линии и `EngineeringSpec` товара.
2. Если товар не подходит — компонент остаётся на схеме, но с красным статусом.
3. Кнопка “Принять замену” отключена.
4. Показывается причина: например, “АВР 3P не переключает нейтраль, а второй источник имеет bonded neutral”.
5. Показываются допустимые альтернативы.

### 8.3 Поведение в корзине

Нельзя добавлять в корзину инженерный BOM, если:

- есть хотя бы один `P0_BLOCK`;
- есть товар без datasheet для критического компонента;
- есть неизвестная нейтраль у АВР;
- есть Al/Cu соединение без подтверждённой клеммы/наконечника.

Можно добавить частично только неопасные позиции, но UI должен явно сказать: “Спецификация неполная, критические позиции заблокированы”.

## 9. Как это связано с AI-помощником

AI должен быть не источником нормы, а интерфейсом к `NormGuard`.

Правильно:

- “Почему 3P АВР заблокирован?”
- “Потому что второй источник имеет bonded neutral, а выбранный АВР не переключает нейтраль. Нужен 4P/switched neutral или подтверждённая схема solid neutral.”

Неправильно:

- “Поставьте 3P, так дешевле.”
- “Можно соединить Al и Cu через обычную клемму.”

AI должен получать:

```ts
{
  project,
  normIssues,
  blockedComponents,
  verifiedSources,
  allowedAlternatives
}
```

AI не должен иметь права снять блокировку.

## 10. Задача разработчику: Sprint Al/Cu + ATS NormGuard

### Цель

Добавить слой проверки материалов проводников, Al/Cu соединений, наконечников, клемм и АВР 3P/4P с нейтралью.

### Файлы/модули

- `src/lib/engineering/specs/types.ts`
- `src/lib/engineering/specs/source-verification.ts`
- `src/lib/engineering/norms/al-cu-rules.ts`
- `src/lib/engineering/norms/ats-neutral-rules.ts`
- `src/lib/engineering/norms/validate-component.ts`
- `src/components/engineering/norm-status-icon.tsx`
- `src/components/engineering/component-issue-card.tsx`
- `src/components/admin/products/engineering-spec-editor.tsx`

### Acceptance Criteria

1. Товар WAGO 221 с Al/Cu должен блокироваться.
2. WAGO 222/2273 с Alu-Plus и допустимым сечением может быть разрешён.
3. Phoenix UBAL может быть разрешён для Al/Cu в своём диапазоне сечений.
4. Al кабель к Cu-шине без Al/Cu lug блокируется.
5. 3P АВР с bonded-neutral generator блокируется.
6. 4P АВР со switched neutral проходит, если схема требует switched neutral.
7. Товар без datasheetUrl для критической роли получает `UNKNOWN_DATA` и не допускается к финальному заказу.
8. UI показывает причину блокировки прямо на компоненте и в BOM.
9. AI объясняет блокировку, но не может её отключить.

## 11. Практический вывод

Это направление сильно повышает уровень проекта. Если добавить `EngineeringSpec + NormGuard + source verification`, Elektronom получит не просто интернет-магазин с калькулятором, а инженерный commerce-инструмент: пользователь не только покупает товар, но и понимает, почему конкретный товар безопасен или недопустим в его схеме.

