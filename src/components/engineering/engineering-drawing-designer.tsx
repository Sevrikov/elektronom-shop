'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Cable,
  CheckCircle2,
  CircuitBoard,
  Link2,
  Maximize2,
  Minimize2,
  MousePointer2,
  PanelTop,
  Redo2,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Undo2,
  Zap,
} from 'lucide-react'
import { computeBOMAndTotals } from '@/lib/engineering/bom'
import { runEngineeringCAE } from '@/lib/engineering/cae'
import { findCompatibleProductsForNode } from '@/lib/engineering/catalog-binding'
import { runNormGuard } from '@/lib/engineering/normguard'
import { exportEngineeringProjectVerilog, parseAndInterpretVerilog } from '@/lib/engineering/verilog'
import { ENGINEERING_TEMPLATES, buildTemplateDraft } from '@/lib/engineering/templates'
import { autoLayoutPanelDraft, RAIL_MODULE_TYPES } from '@/lib/engineering/panel-layout'
import { computePanelThermal } from '@/lib/engineering/panel-thermal'
import type { PanelMaterial } from '@/lib/engineering/panel-thermal'
import type { NormIssue } from '@/lib/engineering/normguard/types'
import type { EngineeringCatalogProduct, EngineeringLocale } from '@/lib/engineering/types'
import type {
  EngineeringConnectionKind,
  EngineeringDrawingNode,
  EngineeringEdge,
  EngineeringGraph,
  EngineeringNode,
  EngineeringNodeType,
  EngineeringProjectDraft,
} from '@/lib/engineering/graph'

interface EngineeringDrawingDesignerProps {
  locale: EngineeringLocale
  products: EngineeringCatalogProduct[]
  initialGraph: EngineeringGraph
}

interface PaletteItem {
  type: EngineeringNodeType
  label: string
  shortLabel: string
  properties: EngineeringNode['properties']
}

type SelectedElement =
  | { kind: 'node'; id: string }
  | { kind: 'edge'; id: string }
  | null

interface HistoryState {
  past: EngineeringProjectDraft[]
  present: EngineeringProjectDraft
  future: EngineeringProjectDraft[]
}

const CANVAS = {
  cols: 12,
  rows: 8,
  cellWidth: 100,
  cellHeight: 100,
} as const

const CONNECTION_KINDS: EngineeringConnectionKind[] = ['L', 'N', 'PE', 'PEN', 'DC+', 'DC-', 'signal', 'bus']

/** Designer UI strings; the workspace around it uses next-intl, this component keeps an inline dictionary */
const UI_STRINGS = {
  uk: {
    templates: 'Готові схеми',
    palette: 'Палітра',
    connection: 'Провідник',
    syncForm: 'Зі форми калькулятора',
    autoPanel: 'Авто-щит (на DIN-рейку)',
    loadJson: 'Завантажити збережене',
    saveJson: 'Зберегти проект',
    recalc: 'Перерахувати',
    inspector: 'Інспектор',
    selectHint: 'Оберіть елемент на кресленні або додайте новий з палітри.',
    label: 'Назва',
    moveUp: 'Вгору', moveLeft: 'Вліво', moveRight: 'Вправо', moveDown: 'Вниз',
    material: 'Матеріал', areaZone: 'Зона приміщення', strandType: 'Тип жили',
    sectionRange: 'Діапазон перерізу, мм²',
    catalogProduct: 'Товар з каталогу',
    notBomItem: 'Цей елемент не є позицією специфікації.',
    noCatalogMatch: 'Немає відповідного товару',
    pickProduct: 'Підібрати товар',
    closePicker: 'Закрити підбір',
    searchPlaceholder: 'Пошук за назвою або артикулом…',
    nothingFound: 'Нічого не знайдено',
    bind: 'Прив’язати',
    unbind: 'Відв’язати товар',
    page: 'стор.',
    issues: 'Зауваження',
    noNodeIssues: 'Немає зауважень по елементу',
    noLineIssues: 'Немає зауважень по лінії',
    suggestions: 'Поради NormGuard',
    connections: 'З’єднання',
    addTerminalSource: '+ Клема біля джерела',
    addTerminalTarget: '+ Клема біля приймача',
    terminal: 'Клема',
    conductorLabel: 'Провідник',
    aiTitle: 'Передати ШІ-асистенту',
    aiText: 'Асистент отримує чернетку, попередження NormGuard і специфікацію. Блокуючі порушення залишаються блокуючими.',
    openAssistant: 'Відкрити ШІ-асистента',
    bomTitle: 'Специфікація з креслення',
    verilogTitle: 'Verilog-міст',
    verilogText: 'Текстова модель схеми. Зміни тут і натисніть «Компілювати» — креслення оновиться.',
    compile: 'Компілювати на полотно',
    parseErrors: 'Помилки розбору',
    warnings: 'Попередження',
    bindings: 'привʼязок',
    mcpCommands: 'MCP-команд',
    expand: 'Розгорнути',
    exitFullscreen: 'Вийти',
    hidePalette: 'Сховати палітру',
    showPalette: 'Показати палітру',
    hintPlace: 'Клацніть порожню клітинку, щоб поставити',
    hintConnect: 'Клацніть джерело, потім приймач —',
    sourceSelected: 'Джерело обрано. Клацніть цільовий елемент.',
    legendOverload: '≥100% перевантаження',
    legendHigh: '80–99% межа',
    legendNorm: 'норма',
    legendLow: '<30% недовантажено',
    legendCold: '0% холодний',
    stock: 'залишок', need: 'потрібно',
    terminationSource: 'Оконцювання — джерело',
    terminationTarget: 'Оконцювання — приймач',
    terminationNone: '— не задано',
    zoneWidth: 'Зона щита: ширина, кліт.',
    zoneHeight: 'Зона щита: висота, кліт.',
    boxMaterial: 'Матеріал корпусу',
    matPlastic: 'Пластик',
    matMetal: 'Метал',
    thermalTitle: 'Тепловий баланс',
    modulesShort: 'мод',
    heatShort: 'тепло',
    overheat: 'Перегрів! ΔT понад межу',
    moduleOver: 'Перевищено ємність модулів',
    thermalOk: 'Тепловий баланс у нормі',
    description: 'Опис',
    boundProduct: 'Прив’язаний товар',
    analogs: 'Аналоги (сумісні товари)',
    noAnalogs: 'Сумісних товарів не знайдено',
    openProduct: 'Сторінка товару →',
    close: 'Закрити',
    moreInInspector: 'Повний підбір — в Інспекторі нижче',
    nodesChip: 'Елементи', edgesChip: 'Звʼязки',
    deleteSelected: 'Видалити вибране',
    modeSelect: 'Вибір / переміщення',
    modePlace: 'Додати елемент з палітри',
    modeConnect: 'Зʼєднати елементи',
    zoomIn: 'Збільшити', zoomOut: 'Зменшити', resetView: 'Скинути вид (100%)',
    caeTitle: 'CAE-перевірка',
    caeLoad: 'Навантаження', caeCurrent: 'Розрах. струм', caeLines: 'Ліній перевірено',
  },
  ru: {
    templates: 'Готовые схемы',
    palette: 'Палитра',
    connection: 'Проводник',
    syncForm: 'Из формы калькулятора',
    autoPanel: 'Авто-щит (на DIN-рейку)',
    loadJson: 'Загрузить сохранённое',
    saveJson: 'Сохранить проект',
    recalc: 'Пересчитать',
    inspector: 'Инспектор',
    selectHint: 'Выберите элемент на чертеже или добавьте новый из палитры.',
    label: 'Название',
    moveUp: 'Вверх', moveLeft: 'Влево', moveRight: 'Вправо', moveDown: 'Вниз',
    material: 'Материал', areaZone: 'Зона помещения', strandType: 'Тип жилы',
    sectionRange: 'Диапазон сечения, мм²',
    catalogProduct: 'Товар из каталога',
    notBomItem: 'Этот элемент не является позицией спецификации.',
    noCatalogMatch: 'Нет подходящего товара',
    pickProduct: 'Подобрать товар',
    closePicker: 'Закрыть подбор',
    searchPlaceholder: 'Поиск по названию или артикулу…',
    nothingFound: 'Ничего не найдено',
    bind: 'Привязать',
    unbind: 'Отвязать товар',
    page: 'стр.',
    issues: 'Замечания',
    noNodeIssues: 'Нет замечаний по элементу',
    noLineIssues: 'Нет замечаний по линии',
    suggestions: 'Советы NormGuard',
    connections: 'Соединения',
    addTerminalSource: '+ Клемма у источника',
    addTerminalTarget: '+ Клемма у приёмника',
    terminal: 'Клемма',
    conductorLabel: 'Проводник',
    aiTitle: 'Передать ИИ-ассистенту',
    aiText: 'Ассистент получает черновик, предупреждения NormGuard и спецификацию. Блокирующие нарушения остаются блокирующими.',
    openAssistant: 'Открыть ИИ-ассистента',
    bomTitle: 'Спецификация с чертежа',
    verilogTitle: 'Verilog-мост',
    verilogText: 'Текстовая модель схемы. Измените здесь и нажмите «Компилировать» — чертёж обновится.',
    compile: 'Компилировать на холст',
    parseErrors: 'Ошибки разбора',
    warnings: 'Предупреждения',
    bindings: 'привязок',
    mcpCommands: 'MCP-команд',
    expand: 'Развернуть',
    exitFullscreen: 'Выйти',
    hidePalette: 'Скрыть палитру',
    showPalette: 'Показать палитру',
    hintPlace: 'Кликните пустую клетку, чтобы поставить',
    hintConnect: 'Кликните источник, затем приёмник —',
    sourceSelected: 'Источник выбран. Кликните целевой элемент.',
    legendOverload: '≥100% перегрузка',
    legendHigh: '80–99% предел',
    legendNorm: 'норма',
    legendLow: '<30% недогружен',
    legendCold: '0% холодный',
    stock: 'остаток', need: 'нужно',
    terminationSource: 'Оконцовка — источник',
    terminationTarget: 'Оконцовка — приёмник',
    terminationNone: '— не задано',
    zoneWidth: 'Зона щита: ширина, клет.',
    zoneHeight: 'Зона щита: высота, клет.',
    boxMaterial: 'Материал корпуса',
    matPlastic: 'Пластик',
    matMetal: 'Металл',
    thermalTitle: 'Тепловой баланс',
    modulesShort: 'мод',
    heatShort: 'тепло',
    overheat: 'Перегрев! ΔT выше предела',
    moduleOver: 'Превышена ёмкость модулей',
    thermalOk: 'Тепловой баланс в норме',
    description: 'Описание',
    boundProduct: 'Привязанный товар',
    analogs: 'Аналоги (совместимые товары)',
    noAnalogs: 'Совместимых товаров не найдено',
    openProduct: 'Страница товара →',
    close: 'Закрыть',
    moreInInspector: 'Полный подбор — в Инспекторе ниже',
    nodesChip: 'Элементы', edgesChip: 'Связи',
    deleteSelected: 'Удалить выбранное',
    modeSelect: 'Выбор / перемещение',
    modePlace: 'Добавить элемент из палитры',
    modeConnect: 'Соединить элементы',
    zoomIn: 'Увеличить', zoomOut: 'Уменьшить', resetView: 'Сбросить вид (100%)',
    caeTitle: 'CAE-проверка',
    caeLoad: 'Нагрузка', caeCurrent: 'Расч. ток', caeLines: 'Линий проверено',
  },
} as const

type UiStrings = { [K in keyof typeof UI_STRINGS['uk']]: string }

/** Human description of each element type for the on-canvas info card */
const NODE_DESCRIPTIONS: Record<EngineeringNodeType, { uk: string; ru: string }> = {
  grid_input: {
    uk: 'Точка приєднання до мережі. Задає фазність, напругу і номінал ввідного захисту.',
    ru: 'Точка присоединения к сети. Задаёт фазность, напряжение и номинал вводной защиты.',
  },
  meter: {
    uk: 'Лічильник електроенергії. Облік споживання, ставиться до ввідного автомата або після нього за схемою обленерго.',
    ru: 'Счётчик электроэнергии. Учёт потребления, ставится по схеме облэнерго.',
  },
  main_breaker: {
    uk: 'Ввідний автомат. Захищає всю проводку від перевантаження і КЗ, вимикає весь щит.',
    ru: 'Вводной автомат. Защищает всю проводку от перегрузки и КЗ, отключает весь щит.',
  },
  voltage_relay: {
    uk: 'Реле напруги. Відключає навантаження при стрибках напруги (захист техніки від обриву нуля).',
    ru: 'Реле напряжения. Отключает нагрузку при скачках напряжения (защита техники от обрыва нуля).',
  },
  surge_protection: {
    uk: 'ПЗІП — захист від імпульсних перенапруг (грози).',
    ru: 'УЗИП — защита от импульсных перенапряжений (грозы).',
  },
  busbar_n: {
    uk: 'Нульова шина N. Збирає робочі нулі групових ліній.',
    ru: 'Нулевая шина N. Собирает рабочие нули групповых линий.',
  },
  busbar_pe: {
    uk: 'Шина заземлення PE. Збирає захисні провідники.',
    ru: 'Шина заземления PE. Собирает защитные проводники.',
  },
  rcd: {
    uk: 'ПЗВ/дифавтомат. Захист від ураження струмом: вимикає лінію при витоку (10мА — волога зона, 30мА — загальний).',
    ru: 'УЗО/дифавтомат. Защита от поражения током: отключает линию при утечке (10мА — влажная зона, 30мА — общий).',
  },
  mcb: {
    uk: 'Автоматичний вимикач групової лінії. Номінал узгоджується з перерізом кабелю (C16 → 2.5мм², C10 → 1.5мм²).',
    ru: 'Автоматический выключатель групповой линии. Номинал согласуется с сечением кабеля (C16 → 2.5мм², C10 → 1.5мм²).',
  },
  cable_line: {
    uk: 'Кабельна лінія. Переріз і довжина впливають на допустимий струм та падіння напруги.',
    ru: 'Кабельная линия. Сечение и длина влияют на допустимый ток и падение напряжения.',
  },
  load: {
    uk: 'Навантаження (споживач). Потужність і зона приміщення визначають вимоги до захисту лінії.',
    ru: 'Нагрузка (потребитель). Мощность и зона помещения определяют требования к защите линии.',
  },
  generator: {
    uk: 'Резервний генератор. Потребує АВР і визначеного режиму нейтралі.',
    ru: 'Резервный генератор. Требует АВР и определённого режима нейтрали.',
  },
  inverter: {
    uk: 'Інвертор (ДБЖ/сонячна станція). Джерело резервного живлення.',
    ru: 'Инвертор (ИБП/солнечная станция). Источник резервного питания.',
  },
  battery: {
    uk: 'Акумуляторна батарея. Накопичувач для резервної системи.',
    ru: 'Аккумуляторная батарея. Накопитель для резервной системы.',
  },
  ats: {
    uk: 'АВР — автоматичне введення резерву. Перемикає живлення мережа↔генератор; при резерві має комутувати нейтраль.',
    ru: 'АВР — автоматический ввод резерва. Переключает питание сеть↔генератор; при резерве должен коммутировать нейтраль.',
  },
  distribution_panel: {
    uk: 'Розподільчий щит. Кількість модулів має вміщати всю автоматику із запасом ~20%.',
    ru: 'Распределительный щит. Количество модулей должно вмещать всю автоматику с запасом ~20%.',
  },
  terminal: {
    uk: 'Клема/зʼєднувач. Зʼєднання провідників: діапазон перерізів і тип жили мають відповідати кабелю.',
    ru: 'Клемма/соединитель. Соединение проводников: диапазон сечений и тип жилы должны соответствовать кабелю.',
  },
}

/** Utilization bucket for the load infographics: badge chip + bright plate under the component */
function utilizationBucket(pct: number): { ring: string; badge: string; plate: string } {
  if (pct >= 100) return { ring: 'ring-2 ring-error', badge: 'bg-error text-white', plate: 'bg-error/35' }
  if (pct >= 80) return { ring: 'ring-2 ring-warning', badge: 'bg-warning text-text-primary', plate: 'bg-warning/35' }
  if (pct >= 30) return { ring: '', badge: 'bg-success text-white', plate: 'bg-success/20' }
  if (pct > 0) return { ring: '', badge: 'bg-accent text-white', plate: 'bg-accent/15' }
  return { ring: '', badge: 'bg-border text-text-muted', plate: 'bg-border/50' }
}

/** Schematic colour per conductor kind (L=red, N=blue, PE=green per IEC marking) */
const CONDUCTOR_COLORS: Record<string, string> = {
  L: '#dc2626',
  N: '#2563eb',
  PE: '#16a34a',
  PEN: '#0d9488',
  'DC+': '#b91c1c',
  'DC-': '#1d4ed8',
  signal: '#9333ea',
  bus: '#475569',
}

function conductorColor(edge: EngineeringEdge) {
  return CONDUCTOR_COLORS[edge.conductor ?? ''] ?? '#0f766e'
}

function utilizationHex(pct: number) {
  if (pct >= 100) return '#dc2626'
  if (pct >= 80) return '#d97706'
  if (pct >= 30) return '#16a34a'
  if (pct > 0) return '#2563eb'
  return '#94a3b8'
}

/** Wire-end termination glyph: twist=✕, ferrule=bar, lug=ring, clamp=square, direct=dot */
function TerminationGlyph({ x, y, kind, color }: { x: number; y: number; kind: string; color: string }) {
  if (kind === 'twist') {
    return (
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round">
        <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
        <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
      </g>
    )
  }
  if (kind === 'ferrule') return <rect x={x - 3} y={y - 6} width={6} height={12} rx={1.5} fill={color} stroke="#ffffff" strokeWidth={1} />
  if (kind === 'lug') return <circle cx={x} cy={y} r={5} fill="none" stroke={color} strokeWidth={2.5} />
  if (kind === 'clamp') return <rect x={x - 5} y={y - 5} width={10} height={10} rx={1.5} fill="#ffffff" stroke={color} strokeWidth={2.5} />
  return <circle cx={x} cy={y} r={3} fill={color} stroke="#ffffff" strokeWidth={1} />
}

const TERMINATION_OPTIONS: Array<{ value: 'direct' | 'twist' | 'ferrule' | 'lug' | 'clamp'; uk: string; ru: string }> = [
  { value: 'direct', uk: 'Напряму (моножила)', ru: 'Напрямую (моножила)' },
  { value: 'twist', uk: 'Скрутка / СІЗ', ru: 'Скрутка / СИЗ' },
  { value: 'ferrule', uk: 'Наконечник НШВІ', ru: 'Наконечник НШВИ' },
  { value: 'lug', uk: 'Кільцевий наконечник', ru: 'Кольцевой наконечник' },
  { value: 'clamp', uk: 'Клема', ru: 'Клемма' },
]

/**
 * Manhattan path (H–V–H) with semicircle hops where this path's horizontal
 * runs cross other edges' vertical runs — classic schematic bridge.
 */
function manhattanPathWithHops(
  x1: number, y1: number, x2: number, y2: number,
  verticalSegments: Array<{ edgeId: string; x: number; yMin: number; yMax: number }>,
  selfEdgeId: string,
) {
  const midX = (x1 + x2) / 2
  const R = 7

  const horizontalRun = (fromX: number, toX: number, y: number) => {
    const dir = Math.sign(toX - fromX) || 1
    const hops = verticalSegments
      .filter((seg) => seg.edgeId !== selfEdgeId)
      .filter((seg) => seg.yMin + 1 < y && y < seg.yMax - 1)
      .filter((seg) => Math.min(fromX, toX) + R < seg.x && seg.x < Math.max(fromX, toX) - R)
      .map((seg) => seg.x)
      .sort((a, b) => (a - b) * dir)
    let d = ''
    for (const hopX of hops) {
      // Sweep flag chosen so the bridge always bumps UP (above the straight line)
      d += ` L ${hopX - dir * R} ${y} A ${R} ${R} 0 0 ${dir > 0 ? 0 : 1} ${hopX + dir * R} ${y}`
    }
    d += ` L ${toX} ${y}`
    return d
  }

  let d = `M ${x1} ${y1}`
  d += horizontalRun(x1, midX, y1)
  d += ` L ${midX} ${y2}`
  d += horizontalRun(midX, x2, y2)
  return d
}

const PALETTE: PaletteItem[] = [
  {
    type: 'grid_input',
    label: 'Input',
    shortLabel: 'IN',
    properties: { phase: 1, voltageV: 230, currentA: 32 },
  },
  {
    type: 'meter',
    label: 'Meter',
    shortLabel: 'MTR',
    properties: { modules: 4, currentA: 40 },
  },
  {
    type: 'mcb',
    label: 'Breaker',
    shortLabel: 'MCB',
    properties: { currentA: 16, poles: '2P', curve: 'C', modules: 2 },
  },
  {
    type: 'rcd',
    label: 'RCD / dif',
    shortLabel: 'RCD',
    properties: { currentA: 25, leakageMa: 30, poles: '2P' },
  },
  {
    type: 'cable_line',
    label: 'Cable line',
    shortLabel: 'CAB',
    properties: { cores: 3, sectionMm2: 2.5, material: 'Cu', routeLengthM: 25, strandType: 'solid' },
  },
  {
    type: 'load',
    label: 'Load',
    shortLabel: 'LOAD',
    properties: { powerW: 1500, phase: 1, voltageV: 230, areaZone: 'dry', kind: 'custom' },
  },
  {
    type: 'distribution_panel',
    label: 'Panel',
    shortLabel: 'PNL',
    properties: { modules: 24 },
  },
  {
    type: 'busbar_n',
    label: 'N bus',
    shortLabel: 'N',
    properties: { material: 'Cu' },
  },
  {
    type: 'busbar_pe',
    label: 'PE bus',
    shortLabel: 'PE',
    properties: { material: 'Cu' },
  },
  {
    type: 'terminal',
    label: 'Terminal',
    shortLabel: 'TERM',
    properties: {
      material: 'Cu',
      materialsSupported: ['Cu'],
      sectionRangeMm2: [0.5, 4],
      strandTypes: ['solid', 'stranded'],
    },
  },
  {
    type: 'ats',
    label: 'ATS',
    shortLabel: 'ATS',
    properties: { currentA: 40, poles: '2P', switchesNeutral: true },
  },
  {
    type: 'generator',
    label: 'Generator',
    shortLabel: 'GEN',
    properties: { powerW: 5000, phase: 1, voltageV: 230, neutralMode: 'auto' },
  },
]

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function issueLevel(issue: NormIssue): 'info' | 'warning' | 'danger' {
  if (issue.severity === 'danger' || issue.severity === 'blocker') return 'danger'
  if (issue.severity === 'warning') return 'warning'
  return 'info'
}

function edgeTypeFor(kind: EngineeringConnectionKind): NonNullable<EngineeringEdge['type']> {
  if (kind === 'N') return 'neutral'
  if (kind === 'PE' || kind === 'PEN') return 'earth'
  if (kind === 'signal') return 'signal'
  if (kind === 'bus') return 'bus'
  if (kind === 'DC+' || kind === 'DC-') return 'dc'
  return 'power'
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value)
}

function nodeTone(issues: NormIssue[]) {
  if (issues.some((issue) => issueLevel(issue) === 'danger')) {
    return 'border-error bg-error-subtle/30 text-error'
  }
  if (issues.some((issue) => issueLevel(issue) === 'warning')) {
    return 'border-warning bg-warning-subtle/40 text-warning'
  }
  return 'border-border bg-surface-white text-text-primary'
}

function edgeStroke(issues: NormIssue[]) {
  if (issues.some((issue) => issueLevel(issue) === 'danger')) return '#dc2626'
  if (issues.some((issue) => issueLevel(issue) === 'warning')) return '#d97706'
  return '#0f766e'
}

function formatWatts(value: unknown) {
  const watts = Number(value ?? 0)
  if (!Number.isFinite(watts) || watts <= 0) return null
  if (watts >= 1000) return `${Number((watts / 1000).toFixed(1))} kW`
  return `${watts} W`
}

function nodeSymbol(node: EngineeringNode) {
  switch (node.type) {
    case 'grid_input':
      return 'IN'
    case 'meter':
      return 'kWh'
    case 'main_breaker':
    case 'mcb':
      return String(node.properties.curve ?? 'C')
    case 'rcd':
      return 'Idn'
    case 'cable_line':
      return 'CAB'
    case 'distribution_panel':
      return 'DIN'
    case 'busbar_n':
      return 'N'
    case 'busbar_pe':
      return 'PE'
    case 'terminal':
      return 'T'
    case 'ats':
      return 'ATS'
    case 'generator':
      return 'GEN'
    case 'inverter':
      return 'INV'
    case 'battery':
      return 'BAT'
    default:
      return 'LOAD'
  }
}

function nodePrimarySpec(node: EngineeringNode) {
  switch (node.type) {
    case 'mcb':
    case 'main_breaker':
      return `${node.properties.curve ?? 'C'}${node.properties.currentA ?? 16} / ${node.properties.poles ?? '2P'}`
    case 'rcd':
      return `${node.properties.currentA ?? 25}A / ${node.properties.leakageMa ?? 30}mA`
    case 'cable_line':
      return `${node.properties.cores ?? 3}x${node.properties.sectionMm2 ?? 2.5} mm2 ${node.properties.material ?? 'Cu'}`
    case 'load':
    case 'generator':
    case 'inverter':
    case 'battery':
      return [formatWatts(node.properties.powerW), `${node.properties.voltageV ?? 230}V`].filter(Boolean).join(' / ')
    case 'distribution_panel':
      return `${node.properties.modules ?? 24} modules`
    case 'meter':
      return `${node.properties.currentA ?? 40}A meter`
    case 'ats':
      return `${node.properties.currentA ?? 40}A / ${node.properties.poles ?? '2P'}`
    case 'terminal':
      return `${node.properties.material ?? 'Cu'} terminal`
    case 'busbar_n':
    case 'busbar_pe':
      return `${node.properties.material ?? 'Cu'} bus`
    case 'grid_input':
      return `${node.properties.currentA ?? 32}A / ${node.properties.phase ?? 1} phase`
    default:
      return node.type
  }
}

function nodeSecondarySpec(node: EngineeringNode) {
  if (node.type === 'cable_line') return `${node.properties.routeLengthM ?? 25} m route`
  if (node.type === 'rcd') return `${node.properties.poles ?? '2P'} differential protection`
  if (node.type === 'ats') return node.properties.switchesNeutral ? 'neutral switched' : 'neutral solid'
  if (node.type === 'load') return String(node.properties.areaZone ?? 'dry')
  if (node.type === 'terminal') return `range ${(node.properties.sectionRangeMm2 as [number, number] | undefined)?.join('-') ?? '0.5-4'} mm2`
  return node.type.replace(/_/g, ' ')
}

function nodePixelPattern(type: EngineeringNodeType) {
  switch (type) {
    case 'grid_input':
      return ['0011100', '0100010', '1001001', '0011100', '0001000', '0001000', '0011100']
    case 'meter':
      return ['1111111', '1000001', '1011101', '1010101', '1011101', '1000001', '1111111']
    case 'main_breaker':
    case 'mcb':
      return ['1111111', '0011100', '0010100', '0001000', '0010100', '0011100', '1111111']
    case 'rcd':
      return ['1111111', '0100010', '0010100', '0001000', '0010100', '0100010', '1111111']
    case 'cable_line':
      return ['0001000', '0011100', '0110110', '1100011', '0110110', '0011100', '0001000']
    case 'load':
      return ['0011100', '0100010', '1001001', '1001001', '1001001', '0100010', '0011100']
    case 'distribution_panel':
      return ['1111111', '1001001', '1111111', '1001001', '1111111', '1001001', '1111111']
    case 'busbar_n':
      return ['0000000', '1111111', '0001000', '1111111', '0001000', '1111111', '0000000']
    case 'busbar_pe':
      return ['0001000', '0001000', '1111111', '0011100', '0011100', '0101010', '1000001']
    case 'terminal':
      return ['1111111', '1001001', '0001000', '1111111', '0001000', '1001001', '1111111']
    case 'ats':
      return ['1100011', '1010101', '1001001', '0001000', '1001001', '1010101', '1100011']
    case 'generator':
      return ['0011100', '0100010', '1000101', '1011001', '1000101', '0100010', '0011100']
    case 'inverter':
      return ['1111111', '1000001', '1010101', '1001001', '1010101', '1000001', '1111111']
    case 'battery':
      return ['0011100', '1111111', '1000001', '1011101', '1011101', '1000001', '1111111']
    default:
      return ['0011100', '0100010', '1000001', '1001001', '1000001', '0100010', '0011100']
  }
}

function nodePixelToneClass(node: EngineeringNode) {
  if (node.type === 'busbar_pe') return 'bg-success'
  if (node.type === 'busbar_n') return 'bg-accent'
  if (node.type === 'cable_line') return 'bg-warning'
  if (node.type === 'rcd') return 'bg-error'
  if (node.type === 'generator' || node.type === 'ats') return 'bg-text-primary'
  return 'bg-accent'
}

function PixelSchematicIcon({ node, cell = 'size-1.5' }: { node: EngineeringNode; cell?: string }) {
  const pattern = nodePixelPattern(node.type)
  const activeClass = nodePixelToneClass(node)

  return (
    <span className="grid grid-cols-7 gap-px">
      {pattern.flatMap((row, rowIndex) =>
        [...row].map((value, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={`${cell} rounded-[1px] ${
              value === '1' ? activeClass : 'bg-transparent'
            }`}
          />
        )),
      )}
    </span>
  )
}

function polesNumber(poles: unknown): number {
  if (poles === '4P') return 4
  if (poles === '3P') return 3
  if (poles === '2P') return 2
  return 1
}

/** Key spec lines for the card body — primary characteristics first */
function nodeKeySpecs(node: EngineeringNode): string[] {
  const p = node.properties
  const lines: string[] = []
  switch (node.type) {
    case 'mcb':
    case 'main_breaker':
      lines.push(`I ${p.currentA ?? 16}A · ${p.curve ?? 'C'}`)
      lines.push(`${p.poles ?? '2P'} · ${polesNumber(p.poles)} клем`)
      break
    case 'rcd':
      lines.push(`I ${p.currentA ?? 25}A · Idn ${p.leakageMa ?? 30}mA`)
      lines.push(`${p.poles ?? '2P'} · ${polesNumber(p.poles)} клем`)
      break
    case 'cable_line':
      lines.push(`${p.cores ?? 3}×${p.sectionMm2 ?? 2.5} ${p.material ?? 'Cu'}`)
      lines.push(`${p.routeLengthM ?? 25} м`)
      break
    case 'load':
      lines.push(formatWatts(p.powerW) ?? '—')
      lines.push(`U ${p.voltageV ?? 230}V · ${p.phase ?? 1}ф`)
      break
    case 'distribution_panel':
      lines.push(`${p.modules ?? 24} модулів`)
      lines.push(p.boxMaterial === 'metal' ? 'метал' : 'пластик')
      break
    case 'grid_input':
      lines.push(`I ${p.currentA ?? 32}A · ${p.phase ?? 1}ф`)
      lines.push(`U ${p.voltageV ?? 230}V`)
      break
    case 'voltage_relay':
      lines.push(`I ${p.currentA ?? 40}A`)
      lines.push('реле напруги')
      break
    case 'meter':
      lines.push(`I ${p.currentA ?? 40}A`)
      lines.push('лічильник')
      break
    case 'ats':
      lines.push(`I ${p.currentA ?? 40}A · ${p.poles ?? '2P'}`)
      lines.push(p.switchesNeutral ? 'комутує N' : 'N суцільний')
      break
    case 'busbar_n':
    case 'busbar_pe':
      lines.push(node.type === 'busbar_n' ? 'шина N' : 'шина PE')
      lines.push(String(p.material ?? 'Cu'))
      break
    case 'generator':
    case 'inverter':
    case 'battery':
      lines.push(formatWatts(p.powerW) ?? '—')
      lines.push(`U ${p.voltageV ?? 230}V`)
      break
    default:
      lines.push(nodePrimarySpec(node))
  }
  return lines
}

function nodeShapeClass(node: EngineeringNode, issues: NormIssue[]) {
  const tone = nodeTone(issues)
  if (node.type === 'busbar_n' || node.type === 'busbar_pe') {
    return `${tone} bg-[linear-gradient(180deg,#f8fbff_0%,#dfe7f1_42%,#f7fafc_100%)]`
  }
  if (node.type === 'cable_line') {
    return `${tone} bg-[linear-gradient(90deg,#eef3f8_0%,#c8d3df_18%,#f9fbfd_50%,#c8d3df_82%,#eef3f8_100%)]`
  }
  return `${tone} bg-[linear-gradient(135deg,#ffffff_0%,#eef3f8_38%,#d5dde7_52%,#f8fbff_100%)]`
}

/**
 * Shared card content (role icon + product photo + spec fields) used by both
 * regular nodes and the distribution-panel corner badge. Icons sit transparently
 * on the card plate; the photo lies with slight transparency.
 */
function NodeCardVisual({ node, productImage }: { node: EngineeringNode; productImage?: string | undefined }) {
  return (
    <div className="flex h-full w-full flex-col gap-1 overflow-hidden">
      {/* Large product photo on top (roughly square) */}
      {productImage ? (
        <span className="h-[62px] w-full shrink-0 overflow-hidden rounded border border-border/60">
          <Image src={productImage} alt="" width={124} height={62} className="size-full object-cover" />
        </span>
      ) : null}

      {/* Pictogram (role icon) + description below */}
      <div className="flex min-h-0 flex-1 items-center gap-1.5">
        <span className="flex shrink-0 flex-col items-center justify-center">
          <PixelSchematicIcon node={node} />
          <span className="mt-0.5 font-mono text-[7px] font-black leading-none text-accent">{nodeSymbol(node)}</span>
        </span>
        <span
          className="min-w-0 flex-1"
          title={`${nodePrimarySpec(node)} · ${node.label} · ${nodeSecondarySpec(node)}`}
        >
          <span className="block truncate font-mono text-[11px] font-black leading-tight text-text-primary">
            {nodePrimarySpec(node)}
          </span>
          <span className="mt-0.5 block truncate text-[8px] font-extrabold uppercase leading-tight text-text-muted">
            {node.label}
          </span>
          <span className="mt-0.5 block truncate text-[7px] font-bold uppercase leading-tight text-text-muted">
            {nodeSecondarySpec(node)}
          </span>
        </span>
      </div>
    </div>
  )
}

function nextElementId(prefix: string, existingIds: Set<string>) {
  let index = existingIds.size + 1
  let id = `${prefix}-${index}`
  while (existingIds.has(id)) {
    index += 1
    id = `${prefix}-${index}`
  }
  return id
}

function makeNode(item: PaletteItem, x: number, y: number, nodeId: string): { node: EngineeringNode; drawingNode: EngineeringDrawingNode } {
  const node: EngineeringNode = {
    id: nodeId,
    type: item.type,
    label: item.label,
    properties: { ...item.properties },
  }

  return {
    node,
    drawingNode: {
      nodeId: node.id,
      x,
      y,
      width: 1,
      height: 1,
    },
  }
}

function createDraftFromGraph(graph: EngineeringGraph): EngineeringProjectDraft {
  const drawingNodes: EngineeringDrawingNode[] = graph.nodes.map((node, index) => ({
    nodeId: node.id,
    x: (index % 6) * 2,
    y: Math.min(CANVAS.rows - 1, Math.floor(index / 6) * 2),
    width: 1,
    height: 1,
  }))

  return {
    id: 'engineering-project-draft',
    version: 1,
    name: 'Engineering draft',
    updatedAt: 'unsaved',
    graph: cloneJson({
      id: graph.id,
      version: graph.version,
      locale: graph.locale,
      network: graph.network,
      nodes: graph.nodes,
      edges: graph.edges,
      catalogBindings: graph.catalogBindings,
      loads: graph.loads,
      panels: graph.panels,
      bom: graph.bom,
      totals: graph.totals,
      normIssues: graph.normIssues,
    } as EngineeringProjectDraft['graph']),
    drawing: {
      canvas: CANVAS,
      nodes: drawingNodes,
      edges: graph.edges.map((edge) => ({ edgeId: edge.id })),
    },
  }
}

function buildLoadSnapshots(graph: EngineeringGraph): EngineeringGraph['loads'] {
  return graph.nodes
    .filter((node) => node.type === 'load')
    .map((node) => ({
      id: node.id,
      name: node.label,
      kind: String(node.properties.kind ?? 'custom'),
      powerW: Number(node.properties.powerW ?? 0),
      voltageV: Number(node.properties.voltageV ?? graph.network.voltageV),
      phase: node.properties.phase === 3 ? 3 : 1,
      areaZone: typeof node.properties.areaZone === 'string' ? node.properties.areaZone : undefined,
      room: typeof node.properties.room === 'string' ? node.properties.room : undefined,
      critical: Boolean(node.properties.critical),
      reservePowerRequired: Boolean(node.properties.reservePowerRequired),
    }))
}

const PICKER_PAGE_SIZE = 5

export function EngineeringDrawingDesigner({ locale, products, initialGraph }: EngineeringDrawingDesignerProps) {
  const [history, setHistory] = useState<HistoryState>(() => {
    const present = autoLayoutPanelDraft(createDraftFromGraph(initialGraph))
    return { past: [], present, future: [] }
  })
  const [selected, setSelected] = useState<SelectedElement>(null)
  const [paletteType, setPaletteType] = useState<EngineeringNodeType>('load')
  const [connectionKind, setConnectionKind] = useState<EngineeringConnectionKind>('L')
  const [connectFromId, setConnectFromId] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'add' | 'connect'>('select')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const [verilogText, setVerilogText] = useState('')
  const [verilogErrors, setVerilogErrors] = useState<Array<{ line: number; message: string }>>([])
  const [verilogWarnings, setVerilogWarnings] = useState<Array<{ message: string }>>([])

  // CAD interactive states
  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState(1.0)
  // Shifted right so the left-hand cable column is in view by default
  const [pan, setPan] = useState({ x: 360, y: 40 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [spacePressed, setSpacePressed] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragStartOffset, setDragStartOffset] = useState({ x: 50, y: 50 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(true)
  const [recalcAt, setRecalcAt] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerQuery, setPickerQuery] = useState('')
  const [pickerPage, setPickerPage] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)

  const s: UiStrings = UI_STRINGS[locale === 'ru' ? 'ru' : 'uk']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setSpacePressed(true)
        e.preventDefault()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false)
      }
      if (e.code === 'Escape') {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Lock page scroll while the canvas is expanded to fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isFullscreen])

  const present = history.present

  const computed = useMemo(() => {
    const graphForCheck: EngineeringGraph = {
      ...present.graph,
      loads: buildLoadSnapshots(present.graph),
    }
    const normIssues = runNormGuard(graphForCheck)
    const bomResult = computeBOMAndTotals(graphForCheck, products)
    const graph: EngineeringGraph = {
      ...graphForCheck,
      normIssues,
      bom: bomResult.bom,
      panels: bomResult.panels,
      totals: bomResult.totals,
    }

    const issuesByTarget = new Map<string, NormIssue[]>()
    for (const issue of normIssues) {
      if (!issue.targetId) continue
      const current = issuesByTarget.get(issue.targetId) ?? []
      issuesByTarget.set(issue.targetId, [...current, issue])
    }

    return {
      graph,
      normIssues,
      bom: bomResult.bom,
      panels: bomResult.panels,
      totals: bomResult.totals,
      cae: runEngineeringCAE(graph),
      issuesByTarget,
    }
  }, [present, products])

  const finalDraft = useMemo<EngineeringProjectDraft>(() => ({
    ...present,
    graph: computed.graph,
  }), [computed.graph, present])
  const verilogExport = useMemo(() => exportEngineeringProjectVerilog(finalDraft), [finalDraft])
  const exportDraft = useMemo<EngineeringProjectDraft>(() => ({
    ...finalDraft,
    verilog: {
      source: verilogExport.source,
      bindings: verilogExport.bindings,
    },
  }), [finalDraft, verilogExport])

  const nodeById = useMemo(() => {
    const map = new Map<string, EngineeringNode>()
    for (const node of computed.graph.nodes) {
      map.set(node.id, node)
    }
    return map
  }, [computed.graph.nodes])

  const drawingByNodeId = useMemo(() => {
    const map = new Map<string, EngineeringDrawingNode>()
    for (const node of present.drawing.nodes) {
      map.set(node.nodeId, node)
    }
    return map
  }, [present.drawing.nodes])

  /**
   * Load utilization per node id (% of capacity): cables from CAE line checks,
   * propagated upstream to the breaker/RCD feeding each cable.
   */
  const utilizationByNode = useMemo(() => {
    const map = new Map<string, { pct: number; currentA: number; limitA: number }>()
    for (const check of computed.cae.lineChecks) {
      const pct = check.ampacityA > 0 ? Math.round((check.currentA / check.ampacityA) * 100) : 0
      map.set(check.cableId, { pct, currentA: check.currentA, limitA: check.ampacityA })
      for (const edge of computed.graph.edges) {
        if (edge.target !== check.cableId) continue
        const parent = nodeById.get(edge.source)
        if (!parent) continue
        if (parent.type === 'mcb' || parent.type === 'main_breaker' || parent.type === 'rcd') {
          const rated = typeof parent.properties.currentA === 'number' ? parent.properties.currentA : 0
          map.set(parent.id, {
            pct: rated > 0 ? Math.round((check.currentA / rated) * 100) : 0,
            currentA: check.currentA,
            limitA: rated,
          })
        }
      }
    }
    return map
  }, [computed.cae.lineChecks, computed.graph.edges, nodeById])

  /** Vertical runs of every edge (midX column) — used to draw crossing hops */
  const verticalSegments = useMemo(() => {
    const segments: Array<{ edgeId: string; x: number; yMin: number; yMax: number }> = []
    for (const edge of computed.graph.edges) {
      const source = drawingByNodeId.get(edge.source)
      const target = drawingByNodeId.get(edge.target)
      if (!source || !target) continue
      const y1 = source.y * 100 + 45
      const y2 = target.y * 100 + 45
      const midX = (source.x * 100 + 50 + target.x * 100 + 50) / 2
      segments.push({ edgeId: edge.id, x: midX, yMin: Math.min(y1, y2), yMax: Math.max(y1, y2) })
    }
    return segments
  }, [computed.graph.edges, drawingByNodeId])

  /** Thumbnail of the bound/auto-matched product per node id */
  const productImageByNode = useMemo(() => {
    const productById = new Map(products.map((product) => [product.id, product]))
    const map = new Map<string, string>()
    for (const item of computed.bom) {
      if (!item.nodeId || !item.productId) continue
      const imageUrl = productById.get(item.productId)?.imageUrl
      if (imageUrl) map.set(item.nodeId, imageUrl)
    }
    return map
  }, [computed.bom, products])

  /**
   * Distinct casing/outline colour per protected line, so parallel cable runs
   * are tellable apart. A "line" = a connected component of the branch-type
   * sub-graph (rcd → mcb → cable → load). Trunk elements stay neutral.
   */
  const lineGroups = useMemo(() => {
    const BRANCH_TYPES = new Set<EngineeringNodeType>(['rcd', 'mcb', 'cable_line', 'load', 'terminal'])
    const PALETTE = [
      '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
      '#14b8a6', '#a855f7', '#eab308', '#0ea5e9', '#d946ef', '#22c55e',
    ]
    const isBranch = (id: string) => BRANCH_TYPES.has(nodeById.get(id)?.type ?? 'load' as EngineeringNodeType)

    const adj = new Map<string, string[]>()
    for (const node of computed.graph.nodes) {
      if (BRANCH_TYPES.has(node.type)) adj.set(node.id, [])
    }
    for (const edge of computed.graph.edges) {
      if (isBranch(edge.source) && isBranch(edge.target)) {
        adj.get(edge.source)?.push(edge.target)
        adj.get(edge.target)?.push(edge.source)
      }
    }

    const compOf = new Map<string, number>()
    let comp = 0
    for (const id of adj.keys()) {
      if (compOf.has(id)) continue
      const queue = [id]
      compOf.set(id, comp)
      while (queue.length) {
        const cur = queue.shift() as string
        for (const nb of adj.get(cur) ?? []) {
          if (!compOf.has(nb)) { compOf.set(nb, comp); queue.push(nb) }
        }
      }
      comp++
    }

    // Stable colour per component (ordered by smallest node id for determinism)
    const compMinId = new Map<number, string>()
    for (const [id, c] of compOf) {
      const prev = compMinId.get(c)
      if (prev === undefined || id < prev) compMinId.set(c, id)
    }
    const orderedComps = [...compMinId.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([c]) => c)
    const compColor = new Map<number, string>()
    orderedComps.forEach((c, i) => compColor.set(c, PALETTE[i % PALETTE.length] ?? '#94a3b8'))

    const nodeColor = new Map<string, string>()
    for (const [id, c] of compOf) {
      const col = compColor.get(c)
      if (col) nodeColor.set(id, col)
    }
    const edgeColor = new Map<string, string>()
    for (const edge of computed.graph.edges) {
      const col = nodeColor.get(edge.source) ?? nodeColor.get(edge.target)
      if (col) edgeColor.set(edge.id, col)
    }
    return { nodeColor, edgeColor }
  }, [computed.graph.nodes, computed.graph.edges, nodeById])

  /**
   * DIN rails inside each panel box (one per row of modular devices), plus the
   * set of edges the rail bus replaces (same-rail neighbours need no wire).
   */
  const panelRails = useMemo(() => {
    const rails: Array<{ y: number; x0: number; x1: number }> = []
    const suppressedEdges = new Set<string>()
    for (const panel of computed.graph.nodes.filter((n) => n.type === 'distribution_panel')) {
      const dn = drawingByNodeId.get(panel.id)
      if (!dn) continue
      const x1b = dn.x + (dn.width ?? 7)
      const y1b = dn.y + (dn.height ?? 5)
      const rows = new Map<number, number[]>()
      const railOf = new Map<string, number>()
      for (const node of computed.graph.nodes) {
        if (!RAIL_MODULE_TYPES.has(node.type)) continue
        const p = drawingByNodeId.get(node.id)
        if (!p || p.x < dn.x - 1 || p.x > x1b || p.y < dn.y - 1 || p.y > y1b) continue
        rows.set(p.y, [...(rows.get(p.y) ?? []), p.x])
        railOf.set(node.id, p.y)
      }
      for (const [y, xs] of rows) {
        if (xs.length > 0) rails.push({ y, x0: Math.min(...xs), x1: Math.max(...xs) })
      }
      for (const edge of computed.graph.edges) {
        const sy = railOf.get(edge.source)
        const ty = railOf.get(edge.target)
        if (sy !== undefined && sy === ty) suppressedEdges.add(edge.id)
      }
    }
    return { rails, suppressedEdges }
  }, [computed.graph.nodes, computed.graph.edges, drawingByNodeId])

  /**
   * Cables sit in the left column, decoupled from routing. The actual feed is
   * drawn directly from the cable's upstream device to its downstream load, so
   * the schematic shows breaker → load while the bead is just a labelled item.
   */
  const cableLinks = useMemo(() => {
    const links: Array<{ id: string; fromId: string; toId: string; color: string }> = []
    const suppressed = new Set<string>()
    for (const cable of computed.graph.nodes) {
      if (cable.type !== 'cable_line') continue
      const inEdge = computed.graph.edges.find((e) => e.target === cable.id)
      const outEdge = computed.graph.edges.find((e) => e.source === cable.id)
      if (inEdge) suppressed.add(inEdge.id)
      if (outEdge) suppressed.add(outEdge.id)
      if (inEdge && outEdge) {
        links.push({
          id: cable.id,
          fromId: inEdge.source,
          toId: outEdge.target,
          color: lineGroups.nodeColor.get(cable.id) ?? '#94a3b8',
        })
      }
    }
    return { links, suppressed }
  }, [computed.graph.nodes, computed.graph.edges, lineGroups])

  /**
   * Each panel box auto-grows to enclose its modular devices (so nothing
   * overflows), plus its material + thermal balance. Single-panel projects map
   * every modular device to the one panel.
   */
  const panelBoxes = useMemo(() => {
    const CARD_W = 132
    const CARD_H = 126
    const PAD = 22
    const panels = computed.graph.nodes.filter((n) => n.type === 'distribution_panel')
    return panels.map((panel) => {
      const pdn = drawingByNodeId.get(panel.id)
      const contained = computed.graph.nodes
        .filter((n) => RAIL_MODULE_TYPES.has(n.type))
        .map((n) => drawingByNodeId.get(n.id))
        .filter((p): p is EngineeringDrawingNode => !!p)

      const xs = [pdn ? pdn.x * 100 : 0, ...contained.map((p) => p.x * 100)]
      const ys = [pdn ? pdn.y * 100 : 0, ...contained.map((p) => p.y * 100)]
      const xe = [pdn ? pdn.x * 100 + CARD_W : 0, ...contained.map((p) => p.x * 100 + CARD_W)]
      const ye = [pdn ? pdn.y * 100 + CARD_H : 0, ...contained.map((p) => p.y * 100 + CARD_H)]

      const x = Math.min(...xs) - PAD
      const y = Math.min(...ys) - PAD
      const w = Math.max(...xe) - Math.min(...xs) + PAD * 2
      const h = Math.max(...ye) - Math.min(...ys) + PAD * 2

      const material: PanelMaterial = panel.properties.boxMaterial === 'metal' ? 'metal' : 'plastic'
      const thermal = computePanelThermal(computed.graph, material)
      return { panel, x, y, w, h, material, thermal }
    })
  }, [computed.graph, drawingByNodeId])

  // Sync the editable Verilog text whenever the canvas re-exports a new source
  // (state adjustment during render — https://react.dev/learn/you-might-not-need-an-effect)
  const [lastExportedSource, setLastExportedSource] = useState('')
  if (lastExportedSource !== verilogExport.source) {
    setLastExportedSource(verilogExport.source)
    setVerilogText(verilogExport.source)
    setVerilogErrors([])
    setVerilogWarnings([])
  }

  const compileVerilog = () => {
    const result = parseAndInterpretVerilog(verilogText, present)
    if (result.parseErrors.length > 0) {
      setVerilogErrors(result.parseErrors)
      return
    }
    setVerilogErrors([])
    setVerilogWarnings(result.warnings.map((w) => ({ message: w.message })))

    setHistory((current) => {
      const next = result.draft
      next.updatedAt = new Date().toISOString()
      return {
        past: [...current.past.slice(-24), current.present],
        present: next,
        future: [],
      }
    })
    setSelected(null)
    setConnectFromId(null)
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1.15
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const prevX = (mouseX - pan.x) / zoom
    const prevY = (mouseY - pan.y) / zoom

    const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor
    const clampedZoom = Math.max(0.15, Math.min(3.0, newZoom))

    setPan({
      x: mouseX - prevX * clampedZoom,
      y: mouseY - prevY * clampedZoom,
    })
    setZoom(clampedZoom)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const isLeftClickOnEmpty = e.button === 0 && (e.target as HTMLElement).classList.contains('cad-canvas-bg')
    const isMiddleClick = e.button === 1
    const isRightClick = e.button === 2
    const isSpacePressed = spacePressed

    if (isLeftClickOnEmpty || isMiddleClick || isRightClick || isSpacePressed) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    } else if (draggedNodeId) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top
      const canvasX = (clientX - pan.x) / zoom
      const canvasY = (clientY - pan.y) / zoom

      const gridX = Math.round((canvasX - dragStartOffset.x) / 100)
      const gridY = Math.round((canvasY - dragStartOffset.y) / 100)

      const targetX = Math.max(-200, Math.min(200, gridX))
      const targetY = Math.max(-200, Math.min(200, gridY))

      const dn = drawingByNodeId.get(draggedNodeId)
      if (dn && (dn.x !== targetX || dn.y !== targetY)) {
        commitDraft((draft) => ({
          ...draft,
          drawing: {
            ...draft.drawing,
            nodes: draft.drawing.nodes.map((item) =>
              item.nodeId === draggedNodeId ? { ...item, x: targetX, y: targetY } : item
            ),
          },
        }))
      }
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setDraggedNodeId(null)
  }

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    const target = e.target as SVGElement
    if (target.classList.contains('cad-canvas-bg')) {
      if (mode === 'add') {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left - pan.x) / zoom
        const y = (e.clientY - rect.top - pan.y) / zoom
        const gridX = Math.round(x / 100)
        const gridY = Math.round(y / 100)
        addNodeAt(gridX, gridY)
      } else if (mode === 'select') {
        setSelected(null)
      }
    }
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0 || mode === 'connect') return
    e.stopPropagation()
    setSelected({ kind: 'node', id: nodeId })

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    setDraggedNodeId(nodeId)
    setDragStartOffset({ x: clickX / zoom, y: clickY / zoom })
  }

  const selectedNode = selected?.kind === 'node'
    ? computed.graph.nodes.find((node) => node.id === selected.id)
    : undefined
  const selectedEdge = selected?.kind === 'edge'
    ? computed.graph.edges.find((edge) => edge.id === selected.id)
    : undefined

  const selectedNodeIssues = selectedNode ? computed.issuesByTarget.get(selectedNode.id) ?? [] : []
  const selectedEdgeIssues = selectedEdge ? computed.issuesByTarget.get(selectedEdge.id) ?? [] : []
  const selectedIssues = selectedNode ? selectedNodeIssues : selectedEdge ? selectedEdgeIssues : []
  const selectedFixSuggestions = selectedIssues.flatMap((issue) => issue.fixSuggestions)
  const selectedNodeBom = selectedNode ? computed.bom.filter((item) => item.nodeId === selectedNode.id) : []
  const selectedNodeAlternatives = selectedNode
    ? findCompatibleProductsForNode(selectedNode, products).slice(0, 4)
    : []

  // Computed only while the picker is open (no memo: selectedNode is re-derived each render)
  const pickerMatches = (() => {
    if (!pickerOpen || !selectedNode) return []
    const compatible = findCompatibleProductsForNode(selectedNode, products)
    const query = pickerQuery.trim().toLowerCase()
    if (!query) return compatible
    return compatible.filter(({ product }) =>
      product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query))
  })()

  const pickerPageCount = Math.max(1, Math.ceil(pickerMatches.length / PICKER_PAGE_SIZE))
  const pickerSafePage = Math.min(pickerPage, pickerPageCount - 1)
  const pickerSlice = pickerMatches.slice(pickerSafePage * PICKER_PAGE_SIZE, (pickerSafePage + 1) * PICKER_PAGE_SIZE)

  const hasBlockingIssue = computed.normIssues.some((issue) => issue.blocksCheckout)

  const commitDraft = (updater: (draft: EngineeringProjectDraft) => EngineeringProjectDraft) => {
    setHistory((current) => {
      const next = updater(cloneJson(current.present))
      next.updatedAt = new Date().toISOString()
      return {
        past: [...current.past.slice(-24), current.present],
        present: next,
        future: [],
      }
    })
  }

  const undo = () => {
    setHistory((current) => {
      const previous = current.past[current.past.length - 1]
      if (!previous) return current
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future],
      }
    })
    setSelected(null)
    setConnectFromId(null)
  }

  const redo = () => {
    setHistory((current) => {
      const next = current.future[0]
      if (!next) return current
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1),
      }
    })
    setSelected(null)
    setConnectFromId(null)
  }

  const addNodeAt = (x: number, y: number) => {
    const item = PALETTE.find((entry) => entry.type === paletteType)
    if (!item) return
    const existingIds = new Set(present.graph.nodes.map((node) => node.id))
    const { node, drawingNode } = makeNode(item, x, y, nextElementId(item.type, existingIds))

    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        nodes: [...draft.graph.nodes, node],
      },
      drawing: {
        ...draft.drawing,
        nodes: [...draft.drawing.nodes, drawingNode],
      },
    }))
    setSelected({ kind: 'node', id: node.id })
    setMode('select')
  }

  const connectNodes = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return
    const existingIds = new Set(present.graph.edges.map((edgeItem) => edgeItem.id))
    const edge: EngineeringEdge = {
      id: nextElementId('edge', existingIds),
      source: sourceId,
      target: targetId,
      type: edgeTypeFor(connectionKind),
      conductor: connectionKind,
    }

    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        edges: [...draft.graph.edges, edge],
      },
      drawing: {
        ...draft.drawing,
        edges: [...draft.drawing.edges, { edgeId: edge.id }],
      },
    }))
    setSelected({ kind: 'edge', id: edge.id })
    setConnectFromId(null)
    setMode('select')
  }

  const handleNodeClick = (nodeId: string) => {
    if (mode === 'connect') {
      if (!connectFromId) {
        setConnectFromId(nodeId)
      } else {
        connectNodes(connectFromId, nodeId)
      }
      return
    }

    setSelected({ kind: 'node', id: nodeId })
    setInfoOpen(true)
  }

  const moveSelectedNode = (dx: number, dy: number) => {
    if (!selectedNode) return
    commitDraft((draft) => ({
      ...draft,
      drawing: {
        ...draft.drawing,
        nodes: draft.drawing.nodes.map((item) => item.nodeId === selectedNode.id
          ? {
              ...item,
              x: clamp(item.x + dx, 0, draft.drawing.canvas.cols - 1),
              y: clamp(item.y + dy, 0, draft.drawing.canvas.rows - 1),
            }
          : item),
      },
    }))
  }

  const updateSelectedNode = (patch: Partial<EngineeringNode>) => {
    if (!selectedNode) return
    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        nodes: draft.graph.nodes.map((node) => node.id === selectedNode.id ? { ...node, ...patch } : node),
      },
    }))
  }

  const updateSelectedNodeProperty = (key: string, value: unknown) => {
    if (!selectedNode) return
    updateSelectedNode({
      properties: {
        ...selectedNode.properties,
        [key]: value,
      },
    })
  }

  /** Panel zone size in grid cells (distribution boxes render as area underlays) */
  const updateSelectedNodeSize = (key: 'width' | 'height', value: number) => {
    if (!selectedNode || !Number.isFinite(value)) return
    commitDraft((draft) => ({
      ...draft,
      drawing: {
        ...draft.drawing,
        nodes: draft.drawing.nodes.map((item) => item.nodeId === selectedNode.id
          ? { ...item, [key]: clamp(Math.round(value), 1, 60) }
          : item),
      },
    }))
  }

  const updateSelectedEdgeTermination = (end: 'sourceTermination' | 'targetTermination', value: string) => {
    if (!selectedEdge) return
    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        edges: draft.graph.edges.map((edge) => {
          if (edge.id !== selectedEdge.id) return edge
          const next = { ...edge }
          if (value === 'direct' || value === 'twist' || value === 'ferrule' || value === 'lug' || value === 'clamp') {
            next[end] = value
          } else {
            delete next[end]
          }
          return next
        }),
      },
    }))
  }

  const deleteSelected = () => {
    if (!selected) return

    commitDraft((draft) => {
      if (selected.kind === 'edge') {
        return {
          ...draft,
          graph: {
            ...draft.graph,
            edges: draft.graph.edges.filter((edge) => edge.id !== selected.id),
          },
          drawing: {
            ...draft.drawing,
            edges: draft.drawing.edges.filter((edge) => edge.edgeId !== selected.id),
          },
        }
      }

      const edgeIdsToDelete = new Set(
        draft.graph.edges
          .filter((edge) => edge.source === selected.id || edge.target === selected.id)
          .map((edge) => edge.id)
      )

      return {
        ...draft,
        graph: {
          ...draft.graph,
          nodes: draft.graph.nodes.filter((node) => node.id !== selected.id),
          edges: draft.graph.edges.filter((edge) => !edgeIdsToDelete.has(edge.id)),
          catalogBindings: draft.graph.catalogBindings.filter((binding) => binding.nodeId !== selected.id),
        },
        drawing: {
          ...draft.drawing,
          nodes: draft.drawing.nodes.filter((node) => node.nodeId !== selected.id),
          edges: draft.drawing.edges.filter((edge) => !edgeIdsToDelete.has(edge.edgeId)),
        },
      }
    })
    setSelected(null)
  }

  const bindProduct = (product: EngineeringCatalogProduct) => {
    if (!selectedNode) return
    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        catalogBindings: [
          ...draft.graph.catalogBindings.filter((binding) => binding.nodeId !== selectedNode.id),
          {
            nodeId: selectedNode.id,
            productId: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            stock: product.stock,
            slug: product.slug,
            attributes: product.attributes,
          },
        ],
      },
    }))
  }

  const unbindProduct = () => {
    if (!selectedNode) return
    commitDraft((draft) => ({
      ...draft,
      graph: {
        ...draft.graph,
        catalogBindings: draft.graph.catalogBindings.filter((binding) => binding.nodeId !== selectedNode.id),
      },
    }))
  }

  /** Forces a fresh NormGuard/BOM/CAE pass over the current draft */
  const recalc = () => {
    commitDraft((draft) => ({ ...draft }))
    setRecalcAt(new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()))
  }

  /**
   * Inserts a terminal (clamp) into the selected edge: A→B becomes A→T→B.
   * `at` controls where the clamp sits visually — squeezed next to the source
   * or the target node.
   */
  const insertTerminalOnEdge = (edgeId: string, at: 'source' | 'target') => {
    let newTerminalId: string | null = null
    commitDraft((draft) => {
      const edge = draft.graph.edges.find((item) => item.id === edgeId)
      if (!edge) return draft

      const existingIds = new Set(draft.graph.nodes.map((node) => node.id))
      const terminalId = nextElementId('term', existingIds)
      newTerminalId = terminalId

      const endpointId = at === 'source' ? edge.source : edge.target
      const otherId = at === 'source' ? edge.target : edge.source
      const endPos = draft.drawing.nodes.find((dn) => dn.nodeId === endpointId)
      const otherPos = draft.drawing.nodes.find((dn) => dn.nodeId === otherId)

      let x = endPos?.x ?? 0
      let y = (endPos?.y ?? 0) + 1
      if (endPos && otherPos) {
        const dx = Math.sign(otherPos.x - endPos.x)
        const dy = Math.sign(otherPos.y - endPos.y)
        if (dy !== 0) { x = endPos.x; y = endPos.y + dy }
        else if (dx !== 0) { x = endPos.x + dx; y = endPos.y }
      }

      const neighborCable = [edge.source, edge.target]
        .map((id) => draft.graph.nodes.find((node) => node.id === id))
        .find((node) => node?.type === 'cable_line')
      const cableSection = typeof neighborCable?.properties.sectionMm2 === 'number'
        ? neighborCable.properties.sectionMm2
        : 2.5

      const terminal: EngineeringNode = {
        id: terminalId,
        type: 'terminal',
        label: s.terminal,
        properties: {
          material: 'Cu',
          materialsSupported: ['Cu'],
          sectionMm2: cableSection,
          sectionRangeMm2: [Math.min(0.75, cableSection), Math.max(4, cableSection)],
          strandTypes: ['solid', 'stranded', 'flexible'],
          strandType: typeof neighborCable?.properties.strandType === 'string'
            ? neighborCable.properties.strandType as 'solid' | 'stranded' | 'flexible'
            : 'solid',
        },
      }

      const splitEdges: EngineeringEdge[] = [
        { id: `${edge.id}-s`, source: edge.source, target: terminalId },
        { id: `${edge.id}-t`, source: terminalId, target: edge.target },
      ].map((item) => {
        const next: EngineeringEdge = { ...item }
        if (edge.type) next.type = edge.type
        if (edge.conductor) next.conductor = edge.conductor
        return next
      })

      return {
        ...draft,
        graph: {
          ...draft.graph,
          nodes: [...draft.graph.nodes, terminal],
          edges: [...draft.graph.edges.filter((item) => item.id !== edgeId), ...splitEdges],
        },
        drawing: {
          ...draft.drawing,
          nodes: [...draft.drawing.nodes, { nodeId: terminalId, x, y, width: 1, height: 1 }],
          edges: [
            ...draft.drawing.edges.filter((item) => item.edgeId !== edgeId),
            { edgeId: `${edgeId}-s` },
            { edgeId: `${edgeId}-t` },
          ],
        },
      }
    })
    if (newTerminalId) setSelected({ kind: 'node', id: newTerminalId })
  }

  const saveDraft = () => {
    const payload: EngineeringProjectDraft = {
      ...exportDraft,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem('engineering_project_draft', JSON.stringify(payload))
    window.sessionStorage.setItem('engineering_project_draft', JSON.stringify(payload))
    setSavedAt(new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(new Date()))
  }

  const loadSavedDraft = () => {
    const saved = window.localStorage.getItem('engineering_project_draft')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as EngineeringProjectDraft
      setHistory({ past: [], present: parsed, future: [] })
      setSelected(null)
      setConnectFromId(null)
    } catch {
      window.localStorage.removeItem('engineering_project_draft')
    }
  }

  const syncFromForm = () => {
    setHistory({ past: [], present: autoLayoutPanelDraft(createDraftFromGraph(initialGraph)), future: [] })
    setSelected(null)
    setConnectFromId(null)
  }

  const loadTemplate = (templateId: string) => {
    const templateDraft = buildTemplateDraft(templateId)
    if (!templateDraft) return
    setHistory((current) => ({
      past: [...current.past.slice(-24), current.present],
      present: autoLayoutPanelDraft(cloneJson(templateDraft)),
      future: [],
    }))
    setSelected(null)
    setConnectFromId(null)
    setMode('select')
  }

  const applyPanelLayout = () => {
    commitDraft((draft) => autoLayoutPanelDraft(draft))
    setSelected(null)
    setConnectFromId(null)
  }

  return (
    <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CircuitBoard className="size-4 text-accent" />
            <h2 className="text-base font-extrabold text-text-primary">Project drawing canvas</h2>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            Nodes and connections below are stored in EngineeringGraph. NormGuard, BOM and catalog binding read this graph.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={recalc}
            className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface-white px-3 text-xs font-bold text-text-primary hover:border-accent"
          >
            <Redo2 className="size-3.5" />
            {s.recalc}{recalcAt ? ` · ${recalcAt}` : ''}
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-xs font-bold text-white"
          >
            <Save className="size-3.5" />
            {s.saveJson}{savedAt ? ` · ${savedAt}` : ''}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        <div className={isFullscreen
          ? 'fixed inset-0 z-[100] flex flex-col bg-surface-white p-3'
          : 'min-w-0 flex flex-col'}
        >
          <div
            className={`relative overflow-hidden rounded-lg border border-border-strong bg-[#f8fafc] shadow-inner select-none w-full ${isFullscreen ? 'flex-1 min-h-0' : 'h-[70vh] min-h-[560px]'}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isPanning || spacePressed ? 'grabbing' : mode === 'add' ? 'crosshair' : mode === 'connect' ? 'cell' : 'default',
            }}
          >
            {/* Floating toolbar: palette toggle + edit modes + history (top-left) */}
            <div className="absolute left-3 top-3 z-30 flex flex-col items-start gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-white/95 p-1 shadow-md backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setPaletteOpen((value) => !value)}
                  className={`flex size-8 items-center justify-center rounded-md ${
                    paletteOpen ? 'bg-surface-alt text-accent' : 'text-text-primary hover:bg-surface-alt'
                  }`}
                  title={paletteOpen ? s.hidePalette : s.showPalette}
                >
                  <PanelTop className="size-4 -rotate-90" />
                </button>
                <span className="mx-0.5 h-5 w-px bg-border" />
                <button
                  type="button"
                  onClick={() => setMode('select')}
                  className={`flex size-8 items-center justify-center rounded-md ${
                    mode === 'select' ? 'bg-accent text-white' : 'text-text-primary hover:bg-surface-alt'
                  }`}
                  title={s.modeSelect}
                >
                  <MousePointer2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode('add')}
                  className={`flex size-8 items-center justify-center rounded-md ${
                    mode === 'add' ? 'bg-accent text-white' : 'text-text-primary hover:bg-surface-alt'
                  }`}
                  title={s.modePlace}
                >
                  <Zap className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('connect')
                    setConnectFromId(null)
                  }}
                  className={`flex size-8 items-center justify-center rounded-md ${
                    mode === 'connect' ? 'bg-accent text-white' : 'text-text-primary hover:bg-surface-alt'
                  }`}
                  title={s.modeConnect}
                >
                  <Link2 className="size-4" />
                </button>
                <span className="mx-0.5 h-5 w-px bg-border" />
                <button
                  type="button"
                  onClick={undo}
                  disabled={history.past.length === 0}
                  className="flex size-8 items-center justify-center rounded-md text-text-primary hover:bg-surface-alt disabled:opacity-30"
                  title="Undo"
                >
                  <Undo2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={history.future.length === 0}
                  className="flex size-8 items-center justify-center rounded-md text-text-primary hover:bg-surface-alt disabled:opacity-30"
                  title="Redo"
                >
                  <Redo2 className="size-4" />
                </button>
              </div>
              {mode === 'add' && (
                <div className="pointer-events-none rounded-md border border-accent/30 bg-surface-white/95 px-2.5 py-1 text-[10px] font-semibold text-accent shadow-sm">
                  {s.hintPlace} <b className="uppercase">{paletteType}</b>
                </div>
              )}
              {mode === 'connect' && (
                <div className="pointer-events-none rounded-md border border-warning/30 bg-surface-white/95 px-2.5 py-1 text-[10px] font-semibold text-warning shadow-sm">
                  {s.hintConnect} <b className="uppercase">{connectionKind}</b>
                </div>
              )}
            </div>

            {/* Floating toolbar: zoom + fullscreen (top-right) */}
            <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-surface-white/95 p-1 shadow-md backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.15, z / 1.15))}
                className="flex size-8 items-center justify-center rounded-md font-mono text-sm font-black text-text-primary hover:bg-surface-alt"
                title={s.zoomOut}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1.0)
                  setPan({ x: 360, y: 40 })
                }}
                className="h-8 min-w-12 rounded-md px-1 font-mono text-[11px] font-black text-text-primary hover:bg-surface-alt"
                title={s.resetView}
              >
                {(zoom * 100).toFixed(0)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.0, z * 1.15))}
                className="flex size-8 items-center justify-center rounded-md font-mono text-sm font-black text-text-primary hover:bg-surface-alt"
                title={s.zoomIn}
              >
                +
              </button>
              <span className="mx-0.5 h-5 w-px bg-border" />
              <button
                type="button"
                onClick={() => setIsFullscreen((value) => !value)}
                className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold ${
                  isFullscreen ? 'text-text-primary hover:bg-surface-alt' : 'bg-accent text-white hover:bg-accent/90'
                }`}
                title={isFullscreen ? `${s.exitFullscreen} (Esc)` : s.expand}
              >
                {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                {isFullscreen ? s.exitFullscreen : s.expand}
              </button>
            </div>

            {/* Status caption (bottom-left) */}
            <div className="pointer-events-none absolute bottom-2 left-3 z-20 rounded bg-surface-white/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Electronom CAD · {(zoom * 100).toFixed(0)}% · X {pan.x.toFixed(0)} Y {pan.y.toFixed(0)}{isFullscreen ? ' · Esc' : ''}
            </div>

            {/* Load utilization legend (bottom-right) */}
            <div className="pointer-events-none absolute bottom-2 right-3 z-20 flex items-center gap-2 rounded bg-surface-white/85 px-2 py-1 text-[9px] font-bold text-text-muted">
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-error" />{s.legendOverload}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-warning" />{s.legendHigh}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-success" />{s.legendNorm}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-accent" />{s.legendLow}</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-border" />{s.legendCold}</span>
            </div>

            {/* Palette drawer (left, slides over the grid) */}
            {paletteOpen && (
              <div className="absolute bottom-10 left-3 top-16 z-20 flex w-56 flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-surface-white/95 p-3 shadow-lg backdrop-blur-sm">
                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase text-text-muted">
                    {s.templates}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {ENGINEERING_TEMPLATES.map((template) => (
                      <button
                        type="button"
                        key={template.id}
                        onClick={() => loadTemplate(template.id)}
                        title={template.description[locale] ?? template.description.uk}
                        className="rounded-md border border-border bg-surface-white px-2 py-1.5 text-left text-xs font-bold text-text-primary transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <Sparkles className="mr-1 inline size-3 text-accent" />
                        {template.name[locale] ?? template.name.uk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase text-text-muted">{s.palette}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PALETTE.map((item) => (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => {
                          setPaletteType(item.type)
                          setMode('add')
                        }}
                        className={`rounded-md border px-2 py-1.5 text-left text-xs font-bold transition-colors ${
                          paletteType === item.type && mode === 'add'
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-surface-white text-text-primary hover:border-accent/50'
                        }`}
                      >
                        <span className="block text-[9px] opacity-70">{item.shortLabel}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-extrabold uppercase text-text-muted">{s.connection}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {CONNECTION_KINDS.map((kind) => (
                      <button
                        type="button"
                        key={kind}
                        onClick={() => {
                          setConnectionKind(kind)
                          setMode('connect')
                        }}
                        className={`h-7 rounded-md border text-[11px] font-bold ${
                          connectionKind === kind && mode === 'connect'
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-surface-white text-text-primary'
                        }`}
                      >
                        {kind}
                      </button>
                    ))}
                  </div>
                  {connectFromId ? (
                    <p className="mt-2 rounded-md bg-accent-subtle px-2 py-1 text-[10px] font-bold text-accent">
                      {s.sourceSelected}
                    </p>
                  ) : null}
                </div>

                <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-2">
                  <button
                    type="button"
                    onClick={applyPanelLayout}
                    className="rounded-md bg-accent px-2 py-1.5 text-xs font-bold text-white hover:bg-accent/90"
                  >
                    {s.autoPanel}
                  </button>
                  <button
                    type="button"
                    onClick={syncFromForm}
                    className="rounded-md border border-border bg-surface-white px-2 py-1.5 text-xs font-bold text-text-primary hover:border-accent/50"
                  >
                    {s.syncForm}
                  </button>
                  <button
                    type="button"
                    onClick={loadSavedDraft}
                    className="rounded-md border border-border bg-surface-white px-2 py-1.5 text-xs font-bold text-text-primary hover:border-accent/50"
                  >
                    {s.loadJson}
                  </button>
                </div>
              </div>
            )}

            {/* Node info card: description + bound product + analogs (opens on node click) */}
            {infoOpen && selectedNode ? (() => {
              const binding = computed.graph.catalogBindings.find((item) => item.nodeId === selectedNode.id)
              const bomItem = computed.bom.find((item) => item.nodeId === selectedNode.id)
              const productById = new Map(products.map((product) => [product.id, product]))
              const boundProduct = binding ? productById.get(binding.productId) : bomItem?.productId ? productById.get(bomItem.productId) : undefined
              const analogs = findCompatibleProductsForNode(selectedNode, products)
                .filter(({ product }) => product.id !== (boundProduct?.id ?? binding?.productId))
                .slice(0, 5)
              const nodeIssues = computed.issuesByTarget.get(selectedNode.id) ?? []
              const description = NODE_DESCRIPTIONS[selectedNode.type]

              return (
                <div className="absolute bottom-10 right-3 top-16 z-20 flex w-72 flex-col overflow-y-auto rounded-lg border border-border bg-surface-white/95 p-3 shadow-lg backdrop-blur-sm">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PixelSchematicIcon node={selectedNode} />
                      <div>
                        <p className="text-xs font-extrabold leading-tight text-text-primary">{selectedNode.label}</p>
                        <p className="font-mono text-[10px] font-bold text-text-muted">{nodePrimarySpec(selectedNode)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInfoOpen(false)}
                      className="flex size-6 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface-alt hover:text-text-primary"
                      title={s.close}
                    >
                      ×
                    </button>
                  </div>

                  <p className="mb-1 text-[10px] font-extrabold uppercase text-text-muted">{s.description}</p>
                  <p className="mb-3 text-xs leading-relaxed text-text-primary">
                    {description[locale] ?? description.uk}
                  </p>

                  {(binding || (bomItem && !bomItem.missing)) ? (
                    <div className="mb-3">
                      <p className="mb-1 text-[10px] font-extrabold uppercase text-text-muted">{s.boundProduct}</p>
                      <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent-subtle/30 p-2">
                        {boundProduct?.imageUrl ? (
                          <Image src={boundProduct.imageUrl} alt="" width={36} height={36} className="size-9 shrink-0 rounded-sm border border-border bg-surface-white object-cover" />
                        ) : null}
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="truncate font-bold text-text-primary">{binding?.name ?? bomItem?.name}</p>
                          <p className="text-[10px] text-text-muted">
                            {binding?.sku ?? bomItem?.sku} · {formatMoney(binding?.price ?? bomItem?.unitPrice ?? 0)}
                          </p>
                          {(binding?.slug ?? boundProduct?.slug) ? (
                            <Link
                              href={`/${locale}/product/${binding?.slug ?? boundProduct?.slug}`}
                              className="text-[10px] font-bold text-accent hover:underline"
                            >
                              {s.openProduct}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <p className="mb-1 text-[10px] font-extrabold uppercase text-text-muted">{s.analogs}</p>
                  {analogs.length === 0 ? (
                    <p className="text-xs text-text-muted">{s.noAnalogs}</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {analogs.map(({ product, score }) => (
                        <button
                          type="button"
                          key={product.id}
                          onClick={() => bindProduct(product)}
                          title={s.bind}
                          className="flex items-center gap-2 rounded-md border border-border bg-surface-white p-1.5 text-left text-xs hover:border-accent"
                        >
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt="" width={28} height={28} className="size-7 shrink-0 rounded-sm border border-border object-cover" />
                          ) : (
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-alt text-[8px] font-black text-text-muted">—</span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold text-text-primary">{product.name}</span>
                            <span className="text-[10px] text-text-muted">
                              {formatMoney(product.price)} · {s.stock} {product.stock} · {score}
                            </span>
                          </span>
                        </button>
                      ))}
                      <p className="mt-1 text-[10px] text-text-muted">{s.moreInInspector}</p>
                    </div>
                  )}

                  {nodeIssues.length > 0 ? (
                    <div className="mt-3">
                      <p className="mb-1 text-[10px] font-extrabold uppercase text-text-muted">{s.issues}</p>
                      {nodeIssues.slice(0, 3).map((issue) => (
                        <p key={issue.code} className="mb-1 rounded bg-error-subtle/20 px-2 py-1 text-[10px] font-semibold text-error">
                          {issue.code}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })() : null}

            <svg
              ref={svgRef}
              onClick={handleCanvasClick}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <marker id="engineering-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0f766e" />
                </marker>
                <pattern id="grid-1mm" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid-5mm" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="url(#grid-1mm)"/>
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.09)" strokeWidth="0.8"/>
                </pattern>
                <pattern id="grid-25mm" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#grid-5mm)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(148, 163, 184, 0.22)" strokeWidth="1.2"/>
                </pattern>
              </defs>

              {/* Infinite background grid transformed with pan and zoom */}
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <rect
                  x="-30000"
                  y="-30000"
                  width="60000"
                  height="60000"
                  fill="url(#grid-25mm)"
                  className="cad-canvas-bg"
                />

                {/* Distribution panel boxes — opaque modular enclosures with thermal balance */}
                {panelBoxes.map(({ panel, x, y, w, h, material, thermal }) => {
                  const isZoneSelected = selected?.kind === 'node' && selected.id === panel.id
                  const zoneImage = productImageByNode.get(panel.id)
                  const fill = material === 'metal' ? '#ccd3dc' : '#dde2d8'
                  const thermalBad = !!thermal && (thermal.overheated || thermal.moduleOverflow)
                  const borderColor = thermalBad ? '#dc2626' : isZoneSelected ? '#3b82f6' : '#64748b'
                  return (
                    <g key={`box-${panel.id}`}>
                      {/* White pixel outline, 4 px */}
                      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={14} fill="none" stroke="#ffffff" strokeWidth={4} />
                      {/* Opaque enclosure plate */}
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx={12}
                        fill={fill}
                        stroke={borderColor}
                        strokeWidth={isZoneSelected ? 3 : 2}
                        strokeDasharray="9 5"
                        className="cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => handleNodeMouseDown(e, panel.id)}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNodeClick(panel.id)
                        }}
                      />
                      {/* Corner card */}
                      <foreignObject x={x + 6} y={y + 6} width={140} height={128} className="overflow-visible">
                        <div
                          onMouseDown={(e) => handleNodeMouseDown(e, panel.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(panel.id)
                          }}
                          className={`flex h-[120px] rounded-md border p-1.5 text-[10px] shadow-[0_4px_12px_rgba(16,24,40,0.12)] cursor-grab active:cursor-grabbing ${
                            nodeShapeClass(panel, [])
                          } ${isZoneSelected ? 'ring-2 ring-accent' : ''} ${zoneImage ? 'w-[128px]' : 'w-[112px]'}`}
                        >
                          <NodeCardVisual node={panel} productImage={zoneImage} />
                        </div>
                      </foreignObject>
                      {/* Modules + thermal tag (top-right) */}
                      {thermal ? (
                        <foreignObject x={x + w - 162} y={y + 6} width={156} height={68} className="overflow-visible">
                          <div
                            className={`pointer-events-none rounded-md border bg-surface-white/95 px-2 py-1 text-[9px] font-bold shadow-sm ${
                              thermalBad ? 'border-error text-error' : 'border-border text-text-primary'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="uppercase">{material === 'metal' ? s.matMetal : s.matPlastic}</span>
                              <span className={thermal.moduleOverflow ? 'text-error' : ''}>
                                {thermal.occupiedModules}/{thermal.capacityModules} {s.modulesShort}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between text-text-muted">
                              <span>{s.heatShort} {thermal.heatW} W</span>
                              <span className={thermal.overheated ? 'text-error' : ''}>ΔT {thermal.tempRiseK}K</span>
                            </div>
                            <div className="mt-0.5">
                              {thermal.overheated ? s.overheat : thermal.moduleOverflow ? s.moduleOver : s.thermalOk}
                            </div>
                          </div>
                        </foreignObject>
                      ) : null}
                    </g>
                  )
                })}

                {/* DIN rails inside panel boxes — modular cards clip onto these */}
                {panelRails.rails.map((rail, i) => {
                  const x = rail.x0 * 100 - 28
                  const w = (rail.x1 - rail.x0) * 100 + 100 + 56
                  const y = rail.y * 100 + 42
                  return (
                    <g key={`rail-${i}`} className="pointer-events-none">
                      <rect x={x} y={y - 11} width={w} height={22} rx={3} fill="#aab4c2" stroke="#6b7686" strokeWidth={1.4} />
                      <line x1={x} y1={y - 6} x2={x + w} y2={y - 6} stroke="#5a6675" strokeWidth={1.4} />
                      <line x1={x} y1={y + 6} x2={x + w} y2={y + 6} stroke="#5a6675" strokeWidth={1.4} />
                      <rect x={x + 4} y={y - 2} width={w - 8} height={4} rx={2} fill="#c4ccd6" />
                    </g>
                  )
                })}

                {/* Direct breaker → load feeds (the cable bead lives in the left column) */}
                {cableLinks.links.map((link) => {
                  const from = drawingByNodeId.get(link.fromId)
                  const to = drawingByNodeId.get(link.toId)
                  if (!from || !to) return null
                  const x1 = from.x * 100 + 50
                  const y1 = from.y * 100 + 50
                  const x2 = to.x * 100 + 50
                  const y2 = to.y * 100 + 50
                  const pathD = manhattanPathWithHops(x1, y1, x2, y2, verticalSegments, link.id)
                  return (
                    <g key={`cablefeed-${link.id}`} className="pointer-events-none">
                      <path d={pathD} fill="none" stroke="#ffffff" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
                      <path d={pathD} fill="none" stroke={link.color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
                      <path d={pathD} fill="none" stroke="#dc2626" strokeWidth={2} markerEnd="url(#engineering-arrow)" />
                    </g>
                  )
                })}

                {/* SVG Connections (Manhattan routing, conductor colours, crossing hops) */}
                {computed.graph.edges.map((edge) => {
                  if (panelRails.suppressedEdges.has(edge.id) || cableLinks.suppressed.has(edge.id)) return null
                  const source = drawingByNodeId.get(edge.source)
                  const target = drawingByNodeId.get(edge.target)
                  if (!source || !target) return null
                  const issues = computed.issuesByTarget.get(edge.id) ?? []

                  // Coordinates center within 100x100 node cells
                  const x1 = source.x * 100 + 50
                  const y1 = source.y * 100 + 45
                  const x2 = target.x * 100 + 50
                  const y2 = target.y * 100 + 45

                  const midX = (x1 + x2) / 2
                  const pathD = manhattanPathWithHops(x1, y1, x2, y2, verticalSegments, edge.id)

                  const isSelected = selected?.kind === 'edge' && selected.id === edge.id
                  const wireColor = issues.length > 0 ? edgeStroke(issues) : conductorColor(edge)

                  // Termination markers sit on the wire just outside each device
                  const sourceDir = Math.sign(midX - x1) || 1
                  const targetDir = Math.sign(x2 - midX) || 1
                  const sourceNode = nodeById.get(edge.source)
                  const targetNode = nodeById.get(edge.target)
                  const lineUtil = utilizationByNode.get(
                    sourceNode?.type === 'cable_line' ? edge.source
                      : targetNode?.type === 'cable_line' ? edge.target
                      : edge.source,
                  )
                  const terminationColor = lineUtil ? utilizationHex(lineUtil.pct) : wireColor
                  const terminationTitle = (kind: string) => {
                    const option = TERMINATION_OPTIONS.find((item) => item.value === kind)
                    const name = option ? (locale === 'ru' ? option.ru : option.uk) : kind
                    return lineUtil ? `${name} · ${lineUtil.currentA}A (${lineUtil.pct}%)` : name
                  }

                  const groupColor = issues.length > 0 ? edgeStroke(issues) : (lineGroups.edgeColor.get(edge.id) ?? '#94a3b8')
                  // Put the conductor letter above the first horizontal run, off the wire line
                  const labelX = (x1 + midX) / 2
                  const labelY = y1 - 9

                  return (
                    <g key={edge.id}>
                      {/* 1. White gap keeps crossing wires legible */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={issues.length > 0 ? 10 : 9}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="pointer-events-none"
                      />
                      {/* 2. Per-line colour casing — tells parallel runs apart */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={groupColor}
                        strokeWidth={issues.length > 0 ? 6.5 : 6}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className={`cursor-pointer transition-all ${isSelected ? 'drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected({ kind: 'edge', id: edge.id })
                        }}
                      />
                      {/* 3. Conductor core colour (L red / N blue / PE green) */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? '#3b82f6' : wireColor}
                        strokeWidth={2.5}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeDasharray={edge.conductor === 'signal' ? '6 6' : undefined}
                        markerEnd="url(#engineering-arrow)"
                        className="pointer-events-none"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fill={wireColor}
                        stroke="#ffffff"
                        strokeWidth={3}
                        paintOrder="stroke"
                        className="text-[12px] font-black pointer-events-none"
                      >
                        {edge.conductor ?? edge.type ?? 'L'}
                      </text>
                      {edge.sourceTermination ? (
                        <g className="pointer-events-none">
                          <title>{terminationTitle(edge.sourceTermination)}</title>
                          <TerminationGlyph x={x1 + sourceDir * 18} y={y1} kind={edge.sourceTermination} color={terminationColor} />
                        </g>
                      ) : null}
                      {edge.targetTermination ? (
                        <g className="pointer-events-none">
                          <title>{terminationTitle(edge.targetTermination)}</title>
                          <TerminationGlyph x={x2 - targetDir * 18} y={y2} kind={edge.targetTermination} color={terminationColor} />
                        </g>
                      ) : null}
                    </g>
                  )
                })}

                {/* SVG Nodes rendered inside zoomable/pannable foreignObjects */}
                {present.drawing.nodes.map((dn) => {
                  const graphNode = nodeById.get(dn.nodeId)
                  if (!graphNode) return null
                  const issues = computed.issuesByTarget.get(graphNode.id) ?? []
                  const isSelected = selected?.kind === 'node' && graphNode.id === selected.id
                  const isConnectSource = graphNode.id === connectFromId
                  const utilization = utilizationByNode.get(graphNode.id)
                  const bucket = utilization ? utilizationBucket(utilization.pct) : null
                  const productImage = productImageByNode.get(graphNode.id)
                  const isTerminal = graphNode.type === 'terminal'
                  // Per-line colour outline so the card matches its cable run
                  const nodeGroupColor = issues.length === 0 ? lineGroups.nodeColor.get(graphNode.id) : undefined
                  const cardBorderStyle = nodeGroupColor ? { borderColor: nodeGroupColor } : undefined

                  // Distribution panels render as zone underlays before the edges
                  if (graphNode.type === 'distribution_panel') return null

                  if (isTerminal) {
                    // Clamp squeezed between wire and node: flat, half-height element
                    return (
                      <foreignObject
                        key={dn.nodeId}
                        x={dn.x * 100}
                        y={dn.y * 100 + 26}
                        width={100}
                        height={38}
                        className="overflow-visible"
                      >
                        <div
                          onMouseDown={(e) => handleNodeMouseDown(e, graphNode.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(graphNode.id)
                          }}
                          className={`group relative flex h-full items-center gap-1 overflow-visible rounded-sm border border-border-strong bg-[linear-gradient(180deg,#fdf6e3_0%,#ead9b0_50%,#f8efd8_100%)] px-1.5 text-[8px] shadow-[0_2px_6px_rgba(16,24,40,0.12)] cursor-grab active:cursor-grabbing ${
                            issues.length > 0 ? 'border-warning' : ''
                          } ${isSelected ? 'ring-2 ring-accent' : ''} ${isConnectSource ? 'ring-2 ring-warning' : ''}`}
                        >
                          <span className="flex h-4 items-center gap-0.5">
                            <span className="size-1.5 rounded-full border border-border-strong bg-surface-white" />
                            <span className="h-0.5 w-2 bg-text-muted" />
                            <span className="size-1.5 rounded-full border border-border-strong bg-surface-white" />
                          </span>
                          <span className="min-w-0 flex-1 truncate font-mono text-[8px] font-black text-text-primary">
                            {graphNode.label} {String(graphNode.properties.material ?? 'Cu')} {String(graphNode.properties.sectionMm2 ?? '')}мм²
                          </span>
                          {issues.length > 0 ? (
                            <AlertTriangle className="size-2.5 shrink-0 text-warning" />
                          ) : null}
                        </div>
                      </foreignObject>
                    )
                  }

                  if (graphNode.type === 'cable_line') {
                    // A cable is a wire, not a device — render a compact bead on the run
                    const cores = Math.min(5, Math.max(1, Number(graphNode.properties.cores ?? 3)))
                    const section = String(graphNode.properties.sectionMm2 ?? '')
                    const material = String(graphNode.properties.material ?? 'Cu')
                    const routeM = String(graphNode.properties.routeLengthM ?? '')
                    const cableColor = issues.length === 0 ? (lineGroups.nodeColor.get(graphNode.id) ?? '#94a3b8') : '#d97706'
                    return (
                      <foreignObject
                        key={dn.nodeId}
                        x={dn.x * 100 + 12}
                        y={dn.y * 100 + 14}
                        width={76}
                        height={58}
                        className="overflow-visible"
                      >
                        <div
                          onMouseDown={(e) => handleNodeMouseDown(e, graphNode.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(graphNode.id)
                          }}
                          style={{ borderColor: cableColor }}
                          title={`${graphNode.label} · ${material} · ${routeM}м`}
                          className={`relative flex h-[52px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-2xl border-2 bg-surface-white/92 px-1 shadow-[0_2px_8px_rgba(16,24,40,0.12)] cursor-grab active:cursor-grabbing ${
                            isSelected ? 'ring-2 ring-accent' : ''
                          } ${isConnectSource ? 'ring-2 ring-warning' : ''}`}
                        >
                          {bucket && utilization ? (
                            <span
                              className={`absolute -right-1 -top-1.5 z-20 rounded-sm px-0.5 font-mono text-[7px] font-black leading-3 shadow-sm ${bucket.badge}`}
                              title={`${utilization.currentA}A / ${utilization.limitA}A`}
                            >
                              {utilization.pct}%
                            </span>
                          ) : null}
                          <span className="flex items-center gap-0.5">
                            {Array.from({ length: cores }).map((_, i) => (
                              <span key={i} className="size-1.5 rounded-full" style={{ backgroundColor: cableColor }} />
                            ))}
                          </span>
                          <span className="font-mono text-[10px] font-black leading-none text-text-primary">{cores}×{section}</span>
                          <span className="text-[7px] font-bold uppercase leading-none text-text-muted">{material} · {routeM}м</span>
                        </div>
                      </foreignObject>
                    )
                  }

                  return (
                    <foreignObject
                      key={dn.nodeId}
                      x={dn.x * 100}
                      y={dn.y * 100}
                      width={150}
                      height={128}
                      className="overflow-visible"
                    >
                      <div className={`relative h-[120px] ${productImage ? 'w-[128px]' : 'w-[112px]'}`}>
                        {/* Bright utilization plate UNDER the card (halo, never over content) */}
                        {bucket ? (
                          <span className={`pointer-events-none absolute -inset-1 rounded-lg ${bucket.plate}`} />
                        ) : null}
                        <div
                          onMouseDown={(e) => handleNodeMouseDown(e, graphNode.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(graphNode.id)
                          }}
                          style={cardBorderStyle}
                          className={`group relative flex h-full w-full overflow-visible rounded-md p-1.5 text-[10px] shadow-[0_4px_12px_rgba(16,24,40,0.08)] transition-all cursor-grab active:cursor-grabbing ${
                            nodeGroupColor ? 'border-2' : 'border'
                          } ${
                            nodeShapeClass(graphNode, issues)
                          } ${isSelected ? 'ring-2 ring-accent' : ''} ${isConnectSource ? 'ring-2 ring-warning' : ''}`}
                        >
                          {bucket && utilization ? (
                            <span
                              className={`absolute -left-1 -top-1.5 z-20 rounded-sm px-1 font-mono text-[8px] font-black leading-3 shadow-sm ${bucket.badge}`}
                              title={`${utilization.currentA}A / ${utilization.limitA}A`}
                            >
                              {utilization.pct}%
                            </span>
                          ) : null}
                          {issues.length > 0 ? (
                            <span className="absolute -right-1 -top-1 z-20 flex size-3.5 items-center justify-center rounded-sm border border-warning bg-warning-subtle text-warning shadow-sm">
                              <AlertTriangle className="size-2.5" />
                            </span>
                          ) : null}

                          <NodeCardVisual node={graphNode} productImage={productImage} />
                        </div>
                      </div>
                    </foreignObject>
                  )
                })}
              </g>
            </svg>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">{s.nodesChip}</span>
              <b className="block text-xl text-text-primary">{computed.graph.nodes.length}</b>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">{s.edgesChip}</span>
              <b className="block text-xl text-text-primary">{computed.graph.edges.length}</b>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">NormGuard</span>
              <b className={hasBlockingIssue ? 'block text-xl text-error' : 'block text-xl text-success'}>
                {computed.normIssues.length}
              </b>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">BOM</span>
              <b className="block text-xl text-text-primary">{formatMoney(computed.totals.estimatedCost)}</b>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                <h3 className="text-sm font-extrabold text-text-primary">{s.caeTitle}</h3>
              </div>
              <span className={computed.cae.issues.some((issue) => issue.severity === 'danger') ? 'text-xs font-bold text-error' : 'text-xs font-bold text-success'}>
                {computed.cae.issues.length} issues
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">{s.caeLoad}</span>
                <b className="block text-sm text-text-primary">{formatWatts(computed.cae.totalPowerW) ?? '0 W'}</b>
              </div>
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">{s.caeCurrent}</span>
                <b className="block text-sm text-text-primary">{computed.cae.estimatedCurrentA} A</b>
              </div>
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">{s.caeLines}</span>
                <b className="block text-sm text-text-primary">{computed.cae.lineChecks.length}</b>
              </div>
            </div>
            {computed.cae.issues.slice(0, 4).map((issue) => (
              <p
                key={`${issue.code}-${issue.targetId ?? 'project'}`}
                className={`mt-2 rounded-md px-2 py-1 text-xs font-semibold ${
                  issue.severity === 'danger' ? 'bg-error-subtle/30 text-error' : 'bg-warning-subtle/30 text-warning'
                }`}
              >
                {issue.code}{issue.targetId ? ` / ${issue.targetId}` : ''}: {issue.message}
              </p>
            ))}
          </div>

          <div className="mt-3 grid gap-2">
            {computed.normIssues.slice(0, 5).map((issue) => (
              <div
                key={`${issue.code}-${issue.targetId ?? 'project'}`}
                className={`flex gap-2 rounded-lg border px-3 py-2 text-xs ${
                  issueLevel(issue) === 'danger'
                    ? 'border-error-subtle bg-error-subtle/20 text-error'
                    : 'border-warning-subtle bg-warning-subtle/30 text-warning'
                }`}
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  <b>{issue.code}</b>
                  {issue.targetId ? `: ${issue.targetId}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          <section className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PanelTop className="size-4 text-accent" />
                <h3 className="text-sm font-extrabold text-text-primary">{s.inspector}</h3>
              </div>
              <button
                type="button"
                disabled={!selected}
                onClick={deleteSelected}
                className="flex size-8 items-center justify-center rounded-md border border-error-subtle bg-error-subtle/20 text-error disabled:opacity-40"
                aria-label={s.deleteSelected}
                title={s.deleteSelected}
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {selectedNode ? (
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-text-muted">{s.label}</span>
                  <input
                    value={selectedNode.label}
                    onChange={(event) => updateSelectedNode({ label: event.target.value })}
                    className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                  />
                </label>

                <div className="grid grid-cols-4 gap-1.5">
                  <button type="button" onClick={() => moveSelectedNode(0, -1)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">{s.moveUp}</button>
                  <button type="button" onClick={() => moveSelectedNode(-1, 0)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">{s.moveLeft}</button>
                  <button type="button" onClick={() => moveSelectedNode(1, 0)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">{s.moveRight}</button>
                  <button type="button" onClick={() => moveSelectedNode(0, 1)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">{s.moveDown}</button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['currentA', 'powerW', 'sectionMm2', 'routeLengthM', 'leakageMa', 'modules'].map((key) => (
                    <label key={key} className="flex flex-col gap-1 text-xs">
                      <span className="font-bold text-text-muted">{key}</span>
                      <input
                        type="number"
                        value={typeof selectedNode.properties[key] === 'number' ? selectedNode.properties[key] as number : ''}
                        onChange={(event) => {
                          const value = Number(event.target.value)
                          updateSelectedNodeProperty(key, Number.isFinite(value) ? value : undefined)
                        }}
                        className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                      />
                    </label>
                  ))}
                </div>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-text-muted">{s.material}</span>
                  <select
                    value={String(selectedNode.properties.material ?? 'Cu')}
                    onChange={(event) => updateSelectedNodeProperty('material', event.target.value)}
                    className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                  >
                    <option value="Cu">Cu</option>
                    <option value="Al">Al</option>
                  </select>
                </label>

                {(selectedNode.type === 'cable_line' || selectedNode.type === 'terminal') ? (
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-bold text-text-muted">{s.strandType}</span>
                    <select
                      value={String(selectedNode.properties.strandType ?? 'solid')}
                      onChange={(event) => updateSelectedNodeProperty('strandType', event.target.value)}
                      className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                    >
                      <option value="solid">solid</option>
                      <option value="stranded">stranded</option>
                      <option value="flexible">flexible</option>
                    </select>
                  </label>
                ) : null}

                {selectedNode.type === 'distribution_panel' ? (() => {
                  const material: PanelMaterial = selectedNode.properties.boxMaterial === 'metal' ? 'metal' : 'plastic'
                  const thermal = computePanelThermal(computed.graph, material)
                  return (
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {([['width', s.zoneWidth], ['height', s.zoneHeight]] as const).map(([sizeKey, sizeLabel]) => (
                          <label key={sizeKey} className="flex flex-col gap-1 text-xs">
                            <span className="font-bold text-text-muted">{sizeLabel}</span>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={drawingByNodeId.get(selectedNode.id)?.[sizeKey] ?? ''}
                              onChange={(event) => updateSelectedNodeSize(sizeKey, Number(event.target.value))}
                              className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                            />
                          </label>
                        ))}
                      </div>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="font-bold text-text-muted">{s.boxMaterial}</span>
                        <select
                          value={material}
                          onChange={(event) => updateSelectedNodeProperty('boxMaterial', event.target.value)}
                          className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                        >
                          <option value="plastic">{s.matPlastic}</option>
                          <option value="metal">{s.matMetal}</option>
                        </select>
                      </label>
                      {thermal ? (
                        <div className={`rounded-md border p-2 text-xs ${
                          thermal.overheated || thermal.moduleOverflow ? 'border-error-subtle bg-error-subtle/20' : 'border-border bg-surface-white'
                        }`}>
                          <p className="mb-1 font-extrabold text-text-muted">{s.thermalTitle}</p>
                          <div className="grid grid-cols-2 gap-1 font-semibold text-text-primary">
                            <span>{thermal.occupiedModules}/{thermal.capacityModules} {s.modulesShort}</span>
                            <span>{thermal.boxWidthMm}×{thermal.boxHeightMm}мм</span>
                            <span>{s.heatShort} {thermal.heatW} W</span>
                            <span className={thermal.overheated ? 'text-error' : ''}>ΔT {thermal.tempRiseK}/{thermal.tempRiseLimitK}K</span>
                          </div>
                          <p className={`mt-1 font-bold ${thermal.overheated || thermal.moduleOverflow ? 'text-error' : 'text-success'}`}>
                            {thermal.overheated ? s.overheat : thermal.moduleOverflow ? s.moduleOver : s.thermalOk}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )
                })() : null}

                {selectedNode.type === 'terminal' ? (
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-bold text-text-muted">{s.sectionRange}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1].map((rangeIndex) => {
                        const range = (selectedNode.properties.sectionRangeMm2 as [number, number] | undefined) ?? [0.5, 4]
                        return (
                          <input
                            key={rangeIndex}
                            type="number"
                            step="0.25"
                            value={range[rangeIndex] ?? ''}
                            onChange={(event) => {
                              const value = Number(event.target.value)
                              if (!Number.isFinite(value)) return
                              const next: [number, number] = [range[0] ?? 0.5, range[1] ?? 4]
                              next[rangeIndex] = value
                              updateSelectedNodeProperty('sectionRangeMm2', next)
                            }}
                            className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                          />
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-text-muted">{s.areaZone}</span>
                  <select
                    value={String(selectedNode.properties.areaZone ?? 'dry')}
                    onChange={(event) => updateSelectedNodeProperty('areaZone', event.target.value)}
                    className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                  >
                    <option value="dry">dry</option>
                    <option value="damp">damp</option>
                    <option value="bathroom_zone_0">bathroom zone 0</option>
                    <option value="bathroom_zone_1">bathroom zone 1</option>
                    <option value="bathroom_zone_2">bathroom zone 2</option>
                    <option value="outdoor">outdoor</option>
                  </select>
                </label>

                <div className="rounded-md border border-border bg-surface-white p-2">
                  <p className="mb-2 text-xs font-extrabold text-text-muted">{s.catalogProduct}</p>
                  {selectedNodeBom.length > 0 ? (
                    selectedNodeBom.map((item) => (
                      <div key={item.sku} className="mb-2 rounded-md bg-surface-alt p-2 text-xs">
                        <p className="font-bold text-text-primary">{item.name}</p>
                        <p className="text-text-muted">{item.missing ? s.noCatalogMatch : `${item.sku} / ${formatMoney(item.total)}`}</p>
                        {typeof item.stock === 'number' ? (
                          <p className={item.stockInsufficient ? 'mt-1 font-bold text-error' : 'mt-1 font-bold text-success'}>
                            {s.stock} {item.stock} / {s.need} {item.qty}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted">{s.notBomItem}</p>
                  )}

                  <div className="mt-1 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPickerOpen((value) => !value)
                        setPickerQuery('')
                        setPickerPage(0)
                      }}
                      className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-accent px-2 text-xs font-bold text-white hover:bg-accent/90"
                    >
                      <Search className="size-3.5" />
                      {pickerOpen ? s.closePicker : s.pickProduct}
                    </button>
                    {computed.graph.catalogBindings.some((binding) => binding.nodeId === selectedNode.id) ? (
                      <button
                        type="button"
                        onClick={unbindProduct}
                        className="h-8 rounded-md border border-border bg-surface-white px-2 text-xs font-bold text-text-primary hover:border-error hover:text-error"
                      >
                        {s.unbind}
                      </button>
                    ) : null}
                  </div>

                  {pickerOpen ? (
                    <div className="mt-2 rounded-md border border-border bg-surface-alt p-2">
                      <input
                        value={pickerQuery}
                        onChange={(event) => {
                          setPickerQuery(event.target.value)
                          setPickerPage(0)
                        }}
                        placeholder={s.searchPlaceholder}
                        className="h-8 w-full rounded-md border border-border bg-surface-white px-2 text-xs font-semibold text-text-primary outline-none focus:border-accent"
                      />
                      <div className="mt-2 flex flex-col gap-1">
                        {pickerSlice.length === 0 ? (
                          <p className="py-2 text-center text-xs text-text-muted">{s.nothingFound}</p>
                        ) : pickerSlice.map(({ product, score }) => (
                          <button
                            type="button"
                            key={product.id}
                            onClick={() => {
                              bindProduct(product)
                              setPickerOpen(false)
                            }}
                            className="flex items-center gap-2 rounded-md border border-border bg-surface-white p-1.5 text-left text-xs hover:border-accent"
                          >
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt="" width={28} height={28} className="size-7 shrink-0 rounded-sm border border-border object-cover" />
                            ) : (
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-alt text-[8px] font-black text-text-muted">—</span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-bold text-text-primary">{product.name}</span>
                              <span className="text-[10px] text-text-muted">{product.sku} · {formatMoney(product.price)} · {s.stock} {product.stock} · {score}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                      {pickerPageCount > 1 ? (
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            disabled={pickerSafePage === 0}
                            onClick={() => setPickerPage((page) => Math.max(0, page - 1))}
                            className="size-7 rounded-md border border-border bg-surface-white font-black disabled:opacity-30"
                          >
                            ←
                          </button>
                          <span className="font-bold text-text-muted">{s.page} {pickerSafePage + 1} / {pickerPageCount}</span>
                          <button
                            type="button"
                            disabled={pickerSafePage >= pickerPageCount - 1}
                            onClick={() => setPickerPage((page) => Math.min(pickerPageCount - 1, page + 1))}
                            className="size-7 rounded-md border border-border bg-surface-white font-black disabled:opacity-30"
                          >
                            →
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    selectedNodeAlternatives.map(({ product, score }) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => bindProduct(product)}
                        className="mt-1 w-full rounded-md border border-border bg-surface-white px-2 py-2 text-left text-xs hover:border-accent"
                      >
                        <span className="block font-bold text-text-primary">{product.name}</span>
                        <span className="text-text-muted">{product.sku} / score {score} / {s.stock} {product.stock}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="rounded-md border border-border bg-surface-white p-2">
                  <p className="mb-2 text-xs font-extrabold text-text-muted">{s.issues}</p>
                  {selectedNodeIssues.length > 0 ? selectedNodeIssues.map((issue) => (
                    <p key={issue.code} className="mb-1 rounded bg-error-subtle/20 px-2 py-1 text-xs font-semibold text-error">
                      {issue.code}
                    </p>
                  )) : (
                    <p className="flex items-center gap-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="size-3.5" />
                      {s.noNodeIssues}
                    </p>
                  )}
                </div>

                {selectedFixSuggestions.length > 0 ? (
                  <div className="rounded-md border border-warning-subtle bg-warning-subtle/20 p-2">
                    <p className="mb-2 text-xs font-extrabold text-warning">{s.suggestions}</p>
                    {selectedFixSuggestions.map((suggestion) => (
                      <p key={`${suggestion.actionCode}-${JSON.stringify(suggestion.params ?? {})}`} className="mb-1 rounded bg-surface-white px-2 py-1 text-xs font-semibold text-text-primary">
                        {suggestion.actionCode}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : selectedEdge ? (
              <div className="flex flex-col gap-2 text-xs">
                <p className="font-bold text-text-primary">{selectedEdge.source} {'->'} {selectedEdge.target}</p>
                <p className="text-text-muted">{s.conductorLabel}: {selectedEdge.conductor ?? selectedEdge.type}</p>
                {([['sourceTermination', s.terminationSource], ['targetTermination', s.terminationTarget]] as const).map(([endKey, endLabel]) => (
                  <label key={endKey} className="flex flex-col gap-1">
                    <span className="font-bold text-text-muted">{endLabel}</span>
                    <select
                      value={selectedEdge[endKey] ?? ''}
                      onChange={(event) => updateSelectedEdgeTermination(endKey, event.target.value)}
                      className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                    >
                      <option value="">{s.terminationNone}</option>
                      {TERMINATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {locale === 'ru' ? option.ru : option.uk}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertTerminalOnEdge(selectedEdge.id, 'source')}
                    className="rounded-md border border-border bg-surface-white px-2 py-1.5 font-bold text-text-primary hover:border-accent"
                  >
                    {s.addTerminalSource}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTerminalOnEdge(selectedEdge.id, 'target')}
                    className="rounded-md border border-border bg-surface-white px-2 py-1.5 font-bold text-text-primary hover:border-accent"
                  >
                    {s.addTerminalTarget}
                  </button>
                </div>
                {selectedEdgeIssues.length > 0 ? selectedEdgeIssues.map((issue) => (
                  <p key={issue.code} className="rounded bg-error-subtle/20 px-2 py-1 font-semibold text-error">{issue.code}</p>
                )) : (
                  <p className="font-semibold text-success">{s.noLineIssues}</p>
                )}
                {selectedFixSuggestions.length > 0 ? selectedFixSuggestions.map((suggestion) => (
                  <p key={`${suggestion.actionCode}-${JSON.stringify(suggestion.params ?? {})}`} className="rounded bg-warning-subtle/20 px-2 py-1 font-semibold text-warning">
                    {suggestion.actionCode}
                  </p>
                )) : null}
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-text-muted">
                {s.selectHint}
              </p>
            )}
          </section>

          <section className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-2 flex items-center gap-2">
              <Link2 className="size-4 text-accent" />
              <h3 className="text-sm font-extrabold text-text-primary">{s.connections}</h3>
            </div>
            <div className="flex max-h-36 flex-col gap-1 overflow-y-auto pr-1">
              {computed.graph.edges.map((edge) => (
                <button
                  type="button"
                  key={edge.id}
                  onClick={() => setSelected({ kind: 'edge', id: edge.id })}
                  className={`rounded-md border px-2 py-1.5 text-left text-[10px] font-bold ${
                    selected?.kind === 'edge' && selected.id === edge.id
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface-white text-text-primary'
                  }`}
                >
                  {edge.conductor ?? edge.type} / {edge.source} {'->'} {edge.target}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h3 className="text-sm font-extrabold text-text-primary">{s.aiTitle}</h3>
            </div>
            <p className="text-xs leading-relaxed text-text-muted">
              {s.aiText}
            </p>
            <Link
              href={`/${locale}/assistant?scenario=engineering-drawing`}
              onClick={() => {
                window.sessionStorage.setItem('engineering_draft', JSON.stringify({
                  projectDraft: exportDraft,
                  verilog: verilogExport,
                  cae: computed.cae,
                  warnings: computed.normIssues,
                  bom: computed.bom,
                  normGuard: {
                    blocksCheckout: hasBlockingIssue,
                    aiMayBypass: false,
                  },
                }))
              }}
              className={`mt-2 flex h-9 items-center justify-center rounded-md px-3 text-xs font-bold ${
                hasBlockingIssue ? 'bg-warning text-text-primary' : 'bg-accent text-white'
              }`}
            >
              {s.openAssistant}
            </Link>
          </section>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-lg border border-border bg-surface-alt p-3">
          <div className="mb-3 flex items-center gap-2">
            <Cable className="size-4 text-accent" />
            <h3 className="text-sm font-extrabold text-text-primary">{s.bomTitle}</h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {computed.bom.slice(0, 9).map((item) => (
              <div key={`${item.nodeId ?? item.sku}-${item.role}`} className="rounded-md border border-border bg-surface-white p-2 text-xs">
                <p className="line-clamp-2 font-bold text-text-primary">{item.name}</p>
                <p className="mt-1 text-text-muted">{item.role} / qty {item.qty}</p>
                <p className={item.missing ? 'mt-1 font-bold text-error' : 'mt-1 font-bold text-text-primary'}>
                  {item.missing ? s.noCatalogMatch : formatMoney(item.total)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface-alt p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CircuitBoard className="size-4 text-accent" />
              <h3 className="text-sm font-extrabold text-text-primary">{s.verilogTitle}</h3>
            </div>
            <span className="text-[10px] font-bold text-text-muted">
              {verilogExport.bindings.length} {s.bindings} · {verilogExport.mcpControlManifest.commands.length} {s.mcpCommands}
            </span>
          </div>
          <p className="mb-2 text-xs leading-relaxed text-text-muted">
            {s.verilogText}
          </p>
          <textarea
            value={verilogText}
            onChange={(event) => setVerilogText(event.target.value)}
            spellCheck={false}
            rows={14}
            className="w-full rounded-md border border-border bg-surface-white p-2 font-mono text-[10px] leading-relaxed text-text-primary outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={compileVerilog}
            className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-xs font-bold text-white hover:bg-accent/90"
          >
            <Zap className="size-3.5" />
            {s.compile}
          </button>
          {verilogErrors.length > 0 ? (
            <div className="mt-2 rounded-md border border-error-subtle bg-error-subtle/20 p-2">
              <p className="mb-1 text-xs font-extrabold text-error">{s.parseErrors}</p>
              {verilogErrors.slice(0, 6).map((error, index) => (
                <p key={`${error.line}-${index}`} className="text-xs font-semibold text-error">
                  L{error.line}: {error.message}
                </p>
              ))}
            </div>
          ) : null}
          {verilogWarnings.length > 0 ? (
            <div className="mt-2 rounded-md border border-warning-subtle bg-warning-subtle/20 p-2">
              <p className="mb-1 text-xs font-extrabold text-warning">{s.warnings}</p>
              {verilogWarnings.slice(0, 6).map((warning, index) => (
                <p key={index} className="text-xs font-semibold text-warning">
                  {warning.message}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </section>
  )
}
