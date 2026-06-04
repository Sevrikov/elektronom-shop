# Финальный recheck Sprint 1: Engineering Module Stabilization

Дата: 2026-05-31  
Проверенные файлы:

- `src/lib/engineering/validation.ts`
- `src/lib/engineering/types.ts`
- `src/lib/engineering/calculators.ts`
- `src/components/engineering/engineering-workspace.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

## 1. Итог

Sprint 1 можно считать условно принятым по функциональному минимуму, но с техническим backlog перед Sprint 2.

Критические ошибки из предыдущего ревью в основном исправлены:

- `npx tsc --noEmit` проходит.
- `npm run lint` теперь не имеет ошибок.
- `as any` в `engineering-workspace.tsx` убраны.
- Добавлена `src/lib/engineering/validation.ts`.
- Пользовательские нагрузки валидируются через Zod.
- Ошибки формы локализованы через `calculators.customLoads.errors`.
- `NormIssue` больше не хранит массив текстовых `reasons`.
- `backup-source-bonding` теперь `danger`, а не `info`.
- Добавлена передача черновика проекта в AI через `sessionStorage` и `scenario=engineering`.

## 2. Проверочные команды

### TypeScript

```bash
npx tsc --noEmit
```

Результат: pass.

### ESLint

```bash
npm run lint
```

Результат: pass без errors.

Остались 7 warning-ов вне нового инженерного модуля:

- blog pages;
- catalog page;
- assistant-panel hook dependency;
- catalog-hub-blocks;
- header navItems;
- lib/assistant/claude eslint-disable.

Эти warning-и не блокируют Sprint 1, но должны быть закрыты отдельной задачей.

## 3. Что исправлено хорошо

### 3.1 Валидация пользовательских нагрузок

Файл: `src/lib/engineering/validation.ts`

Добавлено:

- `CustomLoadInputSchema`;
- `EngineeringProjectInputSchema`;
- валидация `name`, `room`, `powerW`, `routeLengthM`;
- enum для `kind`, `areaZone`, `connectionType`;
- согласование `phase` и `voltage`.

Это закрывает прежний риск, когда пользователь мог сохранить некорректную нагрузку без нормализации.

### 3.2 Убраны `as any` из workspace

Вместо `as any` добавлены:

- `isAreaZone`;
- `isConnectionType`.

Это правильно, потому что зона и тип подключения критичны для будущего `NormGuard`.

### 3.3 `NormIssue` стал более структурным

Тип теперь:

```ts
interface NormIssue {
  code: string
  level: 'info' | 'warning' | 'danger'
  targetId?: string
  params?: Record<string, string | number | boolean>
}
```

Это лучше для i18n, RAG и тестов.

### 3.4 Резервный источник теперь блокирует заказ

`generator_input` / `inverter_input` теперь создают:

```ts
code: 'backup-source-bonding'
level: 'danger'
```

Это соответствует предыдущему ревью: неизвестная нейтраль/заземление не должны проходить как просто информационная подсказка.

### 3.5 AI получает engineering draft

В `engineering-workspace.tsx` перед переходом в assistant сохраняется:

- input;
- loads;
- normIssues;
- complexity.

В `assistant-panel.tsx` сценарий `engineering` читает `sessionStorage.engineering_draft` и формирует стартовый промпт.

Для Sprint 1 это приемлемый MVP.

## 4. Остаточные замечания

### P1 backlog. В `calculators.ts` остались mojibake keyword-и

Файл: `src/lib/engineering/calculators.ts`

В словаре `roleWords` всё ещё видны строки вида:

```ts
cable: ['РєР°Р±РµР»СЊ', ...]
breaker: ['Р°РІС‚РѕРјР°С‚', ...]
```

Это может ломать matching товаров по украинским/русским словам.

Нужно исправить до Sprint 2:

- заменить на нормальные UTF-8 строки;
- или лучше вынести keyword dictionaries в отдельный ASCII/slug-based словарь;
- дополнительно перейти от текстового matching к `EngineeringSpec`.

### P1 backlog. В `engineering-workspace.tsx` ещё есть hardcoded строки

Остались строки вида:

- `Будь ласка, виправте помилки:`;
- `Ввідний автомат ... резерв ...`;
- `Резерв/влажная/сухая зона` в отдельных местах;
- `locale === 'uk' ? ... : ...`;
- `defaultValue` в `t('aiPanel.*', { defaultValue: ... })`.

Функционально это не ломает Sprint 1, но заявление “всё вынесено в i18n” всё ещё не полностью верно.

До Sprint 2 нужно:

- убрать `defaultValue` из `useTranslations`;
- перенести оставшиеся строки в JSON;
- оставить в TSX только ключи.

### P1 backlog. Assistant prompt содержит hardcoded Cyrillic

Файл: `src/components/assistant/assistant-panel.tsx`

Сценарий `engineering` формирует длинный prompt прямо в компоненте. Это MVP, но для production нужно:

- вынести шаблон prompt в `lib/assistant/prompts/engineering.ts`;
- использовать структурированный payload, а не только текст;
- добавить Zod-валидацию `engineering_draft` перед парсингом;
- не давать AI принимать решения вместо `NormGuard`.

### P2 backlog. Нет unit tests для validation/NormGuard

Нужны тесты:

- invalid custom load power/route rejected;
- phase=3 requires voltage=400;
- wet custom load without protection -> danger;
- backup source -> danger;
- add-to-cart disabled when `danger` issue exists.

### P2 backlog. `backup-source-bonding` слишком грубый

Пока любой generator/inverter блокируется. Это безопасно для Sprint 1, но в Sprint 2 нужно добавить поля:

- `neutralMode`;
- `atsNeutralPolicy`;
- `earthingSystem`;
- `sourceBonding`;
- `atsPoles`;
- `neutralSwitching`.

После этого блокировка должна стать точнее.

## 5. Статус

Статус: **Sprint 1 MVP accepted with backlog**.

Перед Sprint 2 обязательно закрыть:

1. mojibake keyword-и в `calculators.ts`;
2. оставшиеся hardcoded строки в `engineering-workspace.tsx`;
3. prompt-шаблон assistant engineering scenario;
4. unit tests для `validation.ts` и базового `NormGuard`.

