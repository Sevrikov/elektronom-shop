# REVIEW_ENGINEERING_SPRINT1_CLEANUP_ACCEPTANCE_2026-05-31

## Статус

Финальный cleanup инженерного модуля проверен. Sprint 1 можно закрывать и переводить проект к следующему спринту.

Критические и остаточные замечания из предыдущего recheck по инженерному модулю устранены:

- runtime-labels единиц измерения в `calculators.ts` переведены в ASCII-safe формат;
- кириллица из расчетного ядра `calculators.ts` убрана;
- оставшиеся UI-строки в `engineering-workspace.tsx` вынесены в i18n;
- unit-тесты NormGuard проходят;
- TypeScript проходит;
- ESLint проходит без ошибок.

## Проверенные команды

```powershell
npm run test:engineering
npx tsc --noEmit
npm run lint
```

Результат:

- `npm run test:engineering` — PASS.
- `npx tsc --noEmit` — PASS.
- `npm run lint` — PASS, exit code 0.

Примечание: lint выводит 7 warning'ов в старых участках проекта, не связанных напрямую с финальным cleanup инженерного модуля:

- `src/app/[locale]/(shop)/blog/[slug]/page.tsx`
- `src/app/[locale]/(shop)/blog/page.tsx`
- `src/app/[locale]/(shop)/catalog/page.tsx`
- `src/components/assistant/assistant-panel.tsx`
- `src/components/catalog/catalog-hub-blocks.tsx`
- `src/components/layout/header.tsx`
- `src/lib/assistant/claude.ts`

Для Sprint 1 это не блокер, но их стоит вынести в общий cleanup backlog.

## Проверка замечаний

### 1. ASCII-safe единицы измерения

Файл:

- `src/lib/engineering/calculators.ts`

Подтверждено:

- кабельные labels теперь используют `mm2`;
- RCD labels теперь используют `mA`;
- старые mojibake-единицы `РјРјВІ` / `РјРђ` больше не обнаружены.

Это правильное решение: расчетное ядро больше не зависит от кодировки консоли/Windows-локали.

### 2. Кириллица в расчетном ядре

Файл:

- `src/lib/engineering/calculators.ts`

Проверка регулярным поиском по кириллице в файле не нашла совпадений.

`roleWords` остался функциональным за счет Unicode escape-последовательностей, а комментарии переведены в ASCII-транслит.

### 3. Локализация UI-строк инженерного workspace

Файл:

- `src/components/engineering/engineering-workspace.tsx`

Подтверждено:

- `резерв` заменен на `{t('reserve')}`;
- `Зайнято` / `Занято` заменено на `{t('occupied')}`;
- заголовок блока ошибок формы заменен на `{t('customLoads.validationErrorsSummary')}`.

Файлы локализации:

- `src/i18n/messages/uk.json`
- `src/i18n/messages/ru.json`

Подтверждено наличие ключей:

- `calculators.reserve`;
- `calculators.occupied`;
- `calculators.customLoads.validationErrorsSummary`.

### 4. Unit-тесты NormGuard

Файл:

- `scripts/test-engineering.ts`

Команда:

```powershell
npm run test:engineering
```

Подтверждено 8 успешных проверок:

- отрицательная мощность блокируется;
- трасса более 300 м блокируется;
- валидный потребитель принимается;
- 3-фазная нагрузка при 230 В блокируется;
- 3-фазная нагрузка при 400 В принимается;
- влажная зона без дифференциальной защиты получает `danger`;
- резервный источник получает `danger` из-за необходимости проверки grounding/bonding;
- наличие `danger` блокирует оформление/заказ.

## Итоговая приемка

Sprint 1 принят.

Разработчику можно передать следующий статус:

1. Инженерный MVP стабилизирован.
2. Основные safety-правила NormGuard покрыты минимальными unit-тестами.
3. Расчетное ядро очищено от кодировочных рисков.
4. UI-строки вынесены в i18n.
5. Можно переходить к следующему спринту: расширение правил электротехнической совместимости, визуальный конструктор схем, связь с каталогом, AI-сценарии консультации и RAG по технической документации.

## Рекомендации на следующий спринт

Перед расширением функциональности желательно завести отдельный cleanup task для старых lint warning'ов вне инженерного модуля, чтобы не смешивать технический долг интерфейса/блога/хедера с развитием инженерной логики.

Для инженерного направления следующий правильный шаг:

- добавить больше norm-rules как независимые проверяемые функции;
- покрыть их тестами до интеграции в UI;
- отделить safety-blocking rules от advisory warnings;
- добавить explainability: почему правило сработало, что заменить, какие товары из каталога подходят;
- подключить AI только как объясняющий и подбирающий слой, не как источник окончательного safety-решения.
