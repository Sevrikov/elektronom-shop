# Повторное ревью Sprint 1: Engineering Module Stabilization

Дата: 2026-05-31  
Проверяемый модуль:

- `src/lib/engineering/types.ts`
- `src/lib/engineering/calculators.ts`
- `src/components/engineering/engineering-workspace.tsx`
- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

## 1. Итог

Sprint 1 нельзя считать полностью закрытым.

Часть задач действительно реализована:

- добавлены пользовательские потребители;
- добавлена сложность проекта;
- добавлены первые `NormIssue`;
- кнопка добавления в корзину блокируется при `danger` issue;
- часть UI-строк вынесена в `calculators` namespace.

Но есть блокирующие замечания:

- `npm run lint` падает с ошибками в новом модуле;
- чистая локализация не завершена;
- в UI и ядре остались hardcoded Cyrillic и mojibake;
- в ядре всё ещё возвращаются человекочитаемые строки вместо кодов;
- `NormGuard` пока слишком мягкий: резервный источник/нейтраль не блокируются;
- пользовательские нагрузки можно ввести с некорректными значениями;
- используются `as any`, что нарушает правила проекта.

## 2. Проверочные команды

### TypeScript

```bash
npx tsc --noEmit
```

Результат: пройдено.

### ESLint

```bash
npm run lint
```

Результат: не пройдено.

Ошибки нового модуля:

```text
src/components/engineering/engineering-workspace.tsx
  33:3    warning  'EngineeringLine' is defined but never used
  37:3    warning  'EngineeringWarning' is defined but never used
  251:38   error    Unexpected any. Specify a different type
  836:103  error    Unexpected any. Specify a different type
  863:109  error    Unexpected any. Specify a different type
```

## 3. Findings

### P0. Линт падает из-за `as any` в новом модуле

Файл: `src/components/engineering/engineering-workspace.tsx`

Проблемные места:

- `areaZone: template.areaZone as any`
- `areaZone: e.target.value as any`
- `connectionType: e.target.value as any`

Почему критично:

- проект требует строгой типизации;
- `as any` скрывает ошибки в `CustomLoadInput`;
- пользовательские значения зоны/подключения критичны для NormGuard.

Как исправить:

1. Типизировать `LOAD_TEMPLATES`:

```ts
type AreaZone = NonNullable<CustomLoadInput['areaZone']>
type ConnectionType = NonNullable<CustomLoadInput['connectionType']>

interface LoadTemplate {
  labelKey: EngineeringLoadKind
  kind: EngineeringLoadKind
  powerW: number
  phase: ElectricalPhase
  areaZone: AreaZone
  dedicated: boolean
  route: number
}
```

2. Для select values использовать type guards:

```ts
const areaZones = ['dry', 'damp', 'bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2', 'outdoor'] as const

function isAreaZone(value: string): value is AreaZone {
  return areaZones.includes(value as AreaZone)
}
```

3. Удалить неиспользуемые импорты.

### P0. Отчёт говорит “lint pass”, но фактически lint fail

Разработчик написал, что проверки проходят, но локальный `npm run lint` возвращает exit code 1.

Acceptance Criteria не выполнен.

Нужно:

- исправить ошибки;
- заново приложить вывод `npm run lint`;
- отдельно указать, что старые warning-и вне модуля остаются, если их не исправляют.

### P1. Чистая локализация не завершена

Отчёт заявляет:

> Extracted all hardcoded Cyrillic UI strings and messages

Фактически в `engineering-workspace.tsx` остались hardcoded строки:

- `Скинути / Сбросить`
- `Споживачі / Потребители`
- `Волога / Суха зона`
- `Ввідний автомат`
- `Захист`
- `Рекомендовано`
- `БЛОКУВАННЯ / БЛОКИРОВКА`
- `Виправте критичні порушення...`
- `Шаблони споживачів`
- placeholder-строки
- подписи `Так / Да`, `Ні / Нет`, `Примітка / Примечание`

Также в `calculators.ts` остались русские строки:

- `Освещение`
- `Розеточные группы комнат`
- `Кухонные розетки`
- `Ванная/санузел`
- `Стиральная машина`
- `Совпадение по роли...`
- `Подобран товар...`
- `Нет точного товара...`
- тексты причин NormIssue.

Почему важно:

- украинская страница может получать русские названия линий из ядра;
- AI/RAG контекст будет загрязнён человекочитаемыми строками;
- в будущем перевод станет неуправляемым.

Как исправить:

- в ядре хранить только `nameKey`, `reasonCode`, `warningCode`, `normIssueCode`;
- UI должен форматировать строки через `next-intl`;
- все оставшиеся hardcoded строки перенести в `uk.json`/`ru.json`;
- `calculators.ts` не должен возвращать локализованный текст.

### P1. Mojibake/кракозябры всё ещё присутствуют в исходнике/выводе

В выводе инспекции часть строк в `engineering-workspace.tsx` и `calculators.ts` отображается как `Р...`.

Даже если часть проблемы вызвана консольной кодировкой, в коде всё равно есть смешанные hardcoded строки. До закрытия Sprint 1 нужно:

- открыть файл в редакторе;
- убедиться, что строки сохранены в UTF-8;
- убрать все кириллические строки из TS/TSX, кроме технически неизбежных тестовых данных;
- перенести в JSON-локали.

### P1. NormGuard не блокирует опасные сценарии резервного источника/нейтрали

В `checkNorms()` резервный источник даёт только:

```ts
level: 'info'
code: 'backup-source-bonding'
```

Проблема:

- если пользователь добавит `generator_input` или `inverter_input`, система только покажет info;
- кнопка “Добавить в корзину” блокируется только при `danger`;
- значит потенциально опасная схема с генератором/инвертором может пройти в корзину.

Как исправить:

На Sprint 1 минимум:

- unknown neutral/bonding для generator/inverter/ATS должен быть `warning` или `danger`, не `info`;
- если есть резервный источник и нет полей `neutralMode`, `atsNeutralPolicy`, `earthingSystem`, нужно ставить `P0_BLOCK`;
- пока таких полей нет в input, резервный источник должен блокировать финальный заказ.

### P1. Пользовательские нагрузки не валидируются

В модальном окне можно ввести:

- мощность 0 или отрицательную;
- слишком большую мощность без предупреждения;
- длину трассы 0/отрицательную;
- пустое помещение;
- странное значение через DOM/select при будущих изменениях.

Сейчас нет Zod-схемы или централизованной нормализации.

Как исправить:

Создать:

```ts
CustomLoadInputSchema
EngineeringProjectInputSchema
```

Правила:

- `powerW`: `min(1).max(100000)` или профильный лимит;
- `routeLengthM`: `min(1).max(300)`;
- `phase`: enum 1/3;
- `voltage`: согласовать с фазой;
- `areaZone`: enum;
- `connectionType`: enum;
- если `phase = 3`, `voltage = 400`;
- если `phase = 1`, `voltage = 230`.

### P1. `NormIssue.reasons` содержит локализованный текст

Тип:

```ts
interface NormIssue {
  reasons: string[]
}
```

Фактически туда кладутся русские человекочитаемые строки.

Проблема:

- эти строки нельзя нормально локализовать;
- AI/RAG будет получать произвольный текст без структурного кода;
- нельзя строить стабильные тесты по причинам.

Как исправить:

```ts
interface NormIssue {
  code: string
  level: 'info' | 'warning' | 'danger'
  targetId?: string
  params?: Record<string, string | number | boolean>
}
```

А UI:

```ts
t(`normIssues.${issue.code}`, issue.params)
```

### P2. `buildLoads()` полностью заменяет дефолтные нагрузки при наличии `customLoads`

Сейчас:

```ts
if (input.customLoads && input.customLoads.length > 0) {
  return input.customLoads.map(...)
}
```

Это означает, что одна пользовательская нагрузка полностью заменит базовую модель объекта.

Это может быть задумано, но UX должен быть явным:

- либо `customLoads` — это весь список нагрузок;
- либо это дополнение к автосгенерированным линиям.

Сейчас по UI похоже, что список “потребителей” является всем проектом, но нужно закрепить это явно в ТЗ и коде.

### P2. Complexity score слишком грубый

Сейчас `expert-only` начинается с `score >= 40`.

Пример:

- 3-фазная схема: +15;
- backup source: +25;
- итог 40 -> expert-only.

Это нормально для MVP, но нужно добавить:

- Al/Cu;
- ATS;
- мокрые зоны с зональностью;
- outdoor;
- EV charger;
- unknown PE;
- unknown neutral;
- ручные blocked replacements.

### P2. AI panel пока не получает реальный инженерный контекст

Есть ссылка:

```text
/${locale}/assistant?scenario=engineering
```

Но не видно передачи:

- project snapshot;
- normIssues;
- blockedActions;
- allowedAlternatives;
- missingDataQuestions.

Как исправить:

- сохранить временный project draft в store/server;
- передать `projectId` или `draftId`;
- ассистент должен читать контекст, а не начинать общий сценарий.

## 4. Что исправить перед закрытием Sprint 1

Обязательный минимум:

1. Исправить `npm run lint`.
2. Удалить все `as any`.
3. Удалить неиспользуемые импорты.
4. Вынести оставшиеся строки из `engineering-workspace.tsx` в `uk.json`/`ru.json`.
5. Убрать человекочитаемые строки из `calculators.ts`.
6. Сделать `NormIssue` кодовым, а не текстовым.
7. Добавить валидацию `CustomLoadInput`.
8. Резервный источник/unknown neutral не должен быть просто `info`.
9. Добавить 3-5 unit/integration tests для:
   - damp custom load without RCD -> `danger`;
   - generator/inverter source -> blocks final add until neutral policy exists;
   - invalid custom load power/route rejected;
   - no `as any`;
   - localized line names render from i18n.

## 5. Статус

Статус Sprint 1: **не принят**.

Текущий уровень: хороший черновик функциональности, но качество стабилизации не соответствует заявлению разработчика.

