'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import {
  AlertTriangle,
  Cable,
  CheckCircle2,
  CircuitBoard,
  Home,
  Info,
  Minus,
  PanelTop,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Zap,
  Trash2,
  Edit3,
  Settings,
  Sparkles,
  AlertOctagon,
} from 'lucide-react'
import { addMultipleToCart } from '@/actions/cart'
import { useCartUIStore } from '@/store/cart-store'
import { buildEngineeringGraph, buildEngineeringProject, defaultEngineeringInput, buildLoads } from '@/lib/engineering/calculators'
import { EngineeringDrawingDesigner } from '@/components/engineering/engineering-drawing-designer'
import type {
  ElectricalPhase,
  EngineeringCatalogProduct,
  EngineeringLocale,
  EngineeringProjectInput,
  EngineeringProjectType,
  CustomLoadInput,
  EngineeringLoadKind,
} from '@/lib/engineering/types'
import { CustomLoadInputSchema } from '@/lib/engineering/validation'

interface EngineeringWorkspaceProps {
  locale: EngineeringLocale
  products: EngineeringCatalogProduct[]
}

const projectTypes = ['apartment', 'house', 'office', 'garage'] as const

type AreaZone = NonNullable<CustomLoadInput['areaZone']>
type ConnectionType = NonNullable<CustomLoadInput['connectionType']>

interface LoadTemplate {
  labelKey: string
  kind: EngineeringLoadKind
  powerW: number
  phase: ElectricalPhase
  areaZone: AreaZone
  dedicated: boolean
  route: number
}

const areaZones = ['dry', 'damp', 'bathroom_zone_0', 'bathroom_zone_1', 'bathroom_zone_2', 'outdoor'] as const
function isAreaZone(value: string): value is AreaZone {
  return areaZones.includes(value as AreaZone)
}

const connectionTypes = ['socket', 'fixed', 'junction-box', 'panel-direct'] as const
function isConnectionType(value: string): value is ConnectionType {
  return connectionTypes.includes(value as ConnectionType)
}

const LOAD_TEMPLATES: LoadTemplate[] = [
  { labelKey: 'lighting', kind: 'lighting', powerW: 600, phase: 1, areaZone: 'dry', dedicated: false, route: 20 },
  { labelKey: 'socket_group', kind: 'socket_group', powerW: 2500, phase: 1, areaZone: 'dry', dedicated: false, route: 25 },
  { labelKey: 'kitchen_socket', kind: 'kitchen_socket', powerW: 3500, phase: 1, areaZone: 'dry', dedicated: true, route: 20 },
  { labelKey: 'bathroom_socket', kind: 'bathroom_socket', powerW: 1800, phase: 1, areaZone: 'bathroom_zone_2', dedicated: true, route: 15 },
  { labelKey: 'boiler', kind: 'boiler', powerW: 2000, phase: 1, areaZone: 'bathroom_zone_2', dedicated: true, route: 15 },
  { labelKey: 'washing_machine', kind: 'washing_machine', powerW: 2200, phase: 1, areaZone: 'bathroom_zone_2', dedicated: true, route: 15 },
  { labelKey: 'dishwasher', kind: 'dishwasher', powerW: 2000, phase: 1, areaZone: 'dry', dedicated: true, route: 15 },
  { labelKey: 'oven', kind: 'oven', powerW: 3200, phase: 1, areaZone: 'dry', dedicated: true, route: 10 },
  { labelKey: 'hob', kind: 'hob', powerW: 7000, phase: 1, areaZone: 'dry', dedicated: true, route: 10 },
  { labelKey: 'conditioner', kind: 'conditioner', powerW: 2500, phase: 1, areaZone: 'dry', dedicated: true, route: 20 },
  { labelKey: 'warm_floor', kind: 'warm_floor', powerW: 1500, phase: 1, areaZone: 'dry', dedicated: true, route: 15 },
  { labelKey: 'ev_charger', kind: 'ev_charger', powerW: 11000, phase: 3, areaZone: 'outdoor', dedicated: true, route: 25 },
  { labelKey: 'pump', kind: 'pump', powerW: 1500, phase: 1, areaZone: 'bathroom_zone_2', dedicated: true, route: 30 },
  { labelKey: 'generator_input', kind: 'generator_input', powerW: 5000, phase: 1, areaZone: 'dry', dedicated: true, route: 5 },
  { labelKey: 'inverter_input', kind: 'inverter_input', powerW: 3000, phase: 1, areaZone: 'dry', dedicated: true, route: 5 },
  { labelKey: 'custom', kind: 'custom', powerW: 1000, phase: 1, areaZone: 'dry', dedicated: false, route: 15 }
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value)
}

function numberInput(value: number, min: number, max: number, onChange: (value: number) => void) {
  return (
    <div className="flex h-10 items-center rounded-lg border border-border bg-surface-white">
      <button
        type="button"
        className="flex size-10 items-center justify-center text-text-muted transition-colors hover:text-accent disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)))
        }}
        className="h-full w-full min-w-0 border-x border-border bg-transparent text-center text-sm font-bold text-text-primary outline-none"
      />
      <button
        type="button"
        className="flex size-10 items-center justify-center text-text-muted transition-colors hover:text-accent disabled:opacity-30"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export function EngineeringWorkspace({ locale, products }: EngineeringWorkspaceProps) {
  const t = useTranslations('calculators')

  // Initialize input state, pre-populating customLoads with defaults if empty
  const [input, setInput] = useState<EngineeringProjectInput>(() => {
    const defaultLoads = buildLoads(defaultEngineeringInput)
    const initialCustomLoads: CustomLoadInput[] = defaultLoads.map((load) => ({
      id: load.id,
      name: load.name,
      kind: load.kind,
      room: load.kind === 'bathroom_socket' || load.kind === 'boiler' || load.kind === 'washing_machine' ? 'bathroom' : 'room',
      areaZone: load.wetZone ? 'bathroom_zone_2' : 'dry',
      powerW: load.powerW,
      phase: load.phase,
      voltage: load.voltage,
      critical: load.critical ?? false,
      reservePowerRequired: false,
      dedicatedLineRequired: true,
      routeLengthM: 25,
    }))
    return {
      ...defaultEngineeringInput,
      customLoads: initialCustomLoads,
    }
  })

  const [status, setStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLoad, setEditingLoad] = useState<Partial<CustomLoadInput> | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [dismissedAiHelp, setDismissedAiHelp] = useState(false)

  const openDrawer = useCartUIStore((state) => state.openDrawer)
  const triggerCartUpdate = useCartUIStore((state) => state.triggerCartUpdate)

  const project = useMemo(() => buildEngineeringProject(input, products), [input, products])
  const drawingInitialGraph = useMemo(() => buildEngineeringGraph(input), [input])
  const addableItems = project.bom.items.filter((item) => item.productId && !item.missing)
  const hasDangerIssue = project.normIssues.some((issue) => issue.level === 'danger')
  const hasMissingSafetyComponent = project.bom.items.some((item) => item.blocksCheckout)

  const update = <K extends keyof EngineeringProjectInput>(key: K, value: EngineeringProjectInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
  }

  const addProjectToCart = () => {
    if (hasDangerIssue || hasMissingSafetyComponent) return
    setStatus(null)
    startTransition(async () => {
      const itemsToCart = addableItems
        .filter((item) => item.productId)
        .map((item) => ({
          productId: item.productId!,
          quantity: Math.min(item.qty, 999),
        }))
      
      const result = await addMultipleToCart(itemsToCart)
      const added = result.success ? result.addedCount : 0
      const skipped = result.success && result.skippedItems ? result.skippedItems.length : 0

      triggerCartUpdate()
      openDrawer()
      if (skipped > 0) {
        setStatus(t('addedWithSkipped', { added, skipped }))
      } else {
        setStatus(t('addedCount', { count: added }))
      }
    })
  }

  // Custom load management actions
  const openAddLoadModal = () => {
    setEditingLoad({
      id: `custom-${Date.now()}`,
      name: '',
      kind: 'custom',
      room: 'room',
      areaZone: 'dry',
      powerW: 1000,
      phase: 1,
      voltage: 230,
      critical: false,
      reservePowerRequired: false,
      dedicatedLineRequired: 'auto',
      routeLengthM: 15,
    })
    setValidationErrors({})
    setIsModalOpen(true)
  }

  const openEditLoadModal = (load: CustomLoadInput) => {
    setEditingLoad({ ...load })
    setValidationErrors({})
    setIsModalOpen(true)
  }

  const saveCustomLoad = () => {
    if (!editingLoad) return
    
    // Parse using Zod schema to validate fields
    const validationResult = CustomLoadInputSchema.safeParse(editingLoad)
    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    const parsedData = validationResult.data
    const finalLoad: CustomLoadInput = {
      id: parsedData.id,
      name: parsedData.name,
      kind: parsedData.kind,
      room: parsedData.room,
      powerW: parsedData.powerW,
      phase: parsedData.phase,
      voltage: parsedData.voltage,
      critical: parsedData.critical,
      reservePowerRequired: parsedData.reservePowerRequired,
      dedicatedLineRequired: parsedData.dedicatedLineRequired,
      routeLengthM: parsedData.routeLengthM,
    }
    if (parsedData.areaZone !== undefined) {
      finalLoad.areaZone = parsedData.areaZone
    }
    if (parsedData.connectionType !== undefined) {
      finalLoad.connectionType = parsedData.connectionType
    }
    if (parsedData.userNote !== undefined) {
      finalLoad.userNote = parsedData.userNote
    }

    const updatedLoads = [...(input.customLoads || [])]
    const index = updatedLoads.findIndex((l) => l.id === finalLoad.id)

    if (index >= 0) {
      updatedLoads[index] = finalLoad
    } else {
      updatedLoads.push(finalLoad)
    }

    update('customLoads', updatedLoads)
    setIsModalOpen(false)
    setEditingLoad(null)
  }

  const deleteCustomLoad = (id: string) => {
    const updatedLoads = (input.customLoads || []).filter((l) => l.id !== id)
    update('customLoads', updatedLoads)
    setIsModalOpen(false)
    setEditingLoad(null)
  }

  const resetToDefaultLoads = () => {
    const defaultLoads = buildLoads(defaultEngineeringInput)
    const initialCustomLoads: CustomLoadInput[] = defaultLoads.map((load) => ({
      id: load.id,
      name: load.name,
      kind: load.kind,
      room: load.kind === 'bathroom_socket' || load.kind === 'boiler' || load.kind === 'washing_machine' ? 'bathroom' : 'room',
      areaZone: load.wetZone ? 'bathroom_zone_2' : 'dry',
      powerW: load.powerW,
      phase: load.phase,
      voltage: load.voltage,
      critical: load.critical ?? false,
      reservePowerRequired: false,
      dedicatedLineRequired: true,
      routeLengthM: 25,
    }))
    update('customLoads', initialCustomLoads)
  }

  const handleTemplateChange = (templateKind: string) => {
    const template = LOAD_TEMPLATES.find((t) => t.kind === templateKind)
    if (!template || !editingLoad) return
    setEditingLoad((curr) => {
      if (!curr) return null
      return {
        ...curr,
        kind: template.kind,
        name: t(`loadKinds.${template.kind}`),
        powerW: template.powerW,
        phase: template.phase,
        voltage: template.phase === 3 ? 400 : 230,
        areaZone: template.areaZone,
        dedicatedLineRequired: template.dedicated ? true : 'auto',
        routeLengthM: template.route,
      }
    })
  }

  // AI Trigger Panel message evaluator
  const getAiTriggerMessage = () => {
    if (project.complexity.level === 'expert-only') {
      return t('aiPanel.expertOnlyMsg')
    }
    if (hasDangerIssue) {
      return t('aiPanel.dangerMsg')
    }
    const hasBackup = project.loads.some((l) => ['generator_input', 'inverter_input', 'battery_system'].includes(l.kind))
    if (hasBackup) {
      return t('aiPanel.backupMsg')
    }
    if (project.complexity.level === 'complex') {
      return t('aiPanel.complexMsg')
    }
    return null
  }

  const aiMessage = getAiTriggerMessage()

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 lg:px-7">
      {/* Title & Stats */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-border bg-surface-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-accent-subtle px-2.5 py-1 text-xs font-bold text-accent">
                <CircuitBoard className="size-3.5" />
                <span>MVP Engineering Module</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                {t('title')}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">{t('lead')}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-surface-alt px-3 py-2">
                <b className="block text-lg text-text-primary">{project.lines.length}</b>
                <span className="text-text-muted">{t('lines')}</span>
              </div>
              <div className="rounded-lg border border-border bg-surface-alt px-3 py-2">
                <b className="block text-lg text-text-primary">{project.panel.recommendedModules}</b>
                <span className="text-text-muted">{t('modules')}</span>
              </div>
              <div className="rounded-lg border border-border bg-surface-alt px-3 py-2">
                <b className="block text-lg text-text-primary">{addableItems.length}</b>
                <span className="text-text-muted">{t('found')}</span>
              </div>
            </div>
          </div>
        </div>
        <aside className="rounded-lg border border-border bg-surface-white p-4 shadow-sm flex items-center">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-text-muted">{t('catalogNotice')}</p>
          </div>
        </aside>
      </section>

      {/* Main Workspace Layout */}
      <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)_420px]">
        {/* Left Column: Settings and Custom Loads */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-accent" />
                <h2 className="text-base font-extrabold text-text-primary">{t('inputs')}</h2>
              </div>
              <button
                type="button"
                onClick={resetToDefaultLoads}
                className="text-xs font-semibold text-accent hover:underline"
              >
                {t('resetBtn')}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-text-primary">{t('project')}</span>
                <select
                  value={input.type}
                  onChange={(event) => update('type', event.target.value as EngineeringProjectType)}
                  className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {t(`projectTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">м²</span>
                  {numberInput(input.areaM2, 20, 300, (value) => update('areaM2', value))}
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('route')}, м</span>
                  {numberInput(input.routeLengthM, 5, 120, (value) => update('routeLengthM', value))}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('phase_1')} / {t('phase_3')}</span>
                  <select
                    value={input.phase}
                    onChange={(event) => update('phase', Number(event.target.value) as ElectricalPhase)}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  >
                    <option value={1}>{t('phase_1')}</option>
                    <option value={3}>{t('phase_3')}</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('inputBreaker')}, A</span>
                  {numberInput(input.inputBreakerA, 16, 63, (value) => update('inputBreakerA', value))}
                </label>
              </div>
            </div>
          </div>

          {/* Custom Loads List */}
          <div className="rounded-lg border border-border bg-surface-white p-4 shadow-sm flex-1 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">{t('consumers')}</h3>
              <span className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-bold text-text-muted">
                {project.loads.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] flex flex-col gap-2 pr-1 mb-4">
              {project.loads.map((load) => (
                <div
                  key={load.id}
                  onClick={() => openEditLoadModal(load as CustomLoadInput)}
                  className="group relative flex items-center justify-between rounded-lg border border-border bg-surface-alt p-2.5 transition-all hover:border-accent/40 cursor-pointer"
                >
                  <div className="min-w-0 pr-6">
                    <p className="truncate text-xs font-extrabold text-text-primary">
                      {load.kind === 'custom' || !t.has(`loadKinds.${load.kind}`) ? load.name : t(`loadKinds.${load.kind}`)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-text-muted truncate">
                      {load.powerW} W · {load.phase}ф · {load.wetZone ? t('wet') : t('dry')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="size-3.5 text-text-muted hover:text-accent" />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openAddLoadModal}
              className="w-full py-2.5 rounded-lg border border-dashed border-accent/40 bg-accent-subtle/20 text-xs font-bold text-accent transition-colors hover:bg-accent-subtle/30"
            >
              {t('customLoads.addBtn')}
            </button>
          </div>
        </aside>

        {/* Middle Column: Scheme, NormIssues, Complexity, AI Trigger Panel */}
        <main className="flex flex-col gap-5">
          {/* Proactive AI Trigger Panel */}
          {aiMessage && !dismissedAiHelp && (
            <div className="relative overflow-hidden rounded-lg border border-accent/40 bg-gradient-to-r from-accent-subtle/30 to-indigo-500/10 p-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-md">
                  <Sparkles className="size-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-text-primary">{t('aiPanel.title')}</h4>
                  <p className="mt-1 text-xs text-text-muted leading-relaxed pr-6">{aiMessage}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      href={`/${locale}/assistant?scenario=engineering`}
                      onClick={() => {
                        try {
                          sessionStorage.setItem('engineering_draft', JSON.stringify({
                            input,
                            complexity: project.complexity,
                            normIssues: project.normIssues,
                            loads: project.loads
                          }))
                        } catch (err) {
                          console.error('Failed to save project draft to sessionStorage:', err)
                        }
                      }}
                      className="inline-flex h-8 items-center rounded-md bg-accent px-3 text-xs font-bold text-white transition-colors hover:bg-accent-hover"
                    >
                      {t('aiPanel.yesBtn')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDismissedAiHelp(true)}
                      className="inline-flex h-8 items-center rounded-md border border-border bg-surface-white px-3 text-xs font-bold text-text-primary transition-colors hover:bg-surface-alt"
                    >
                      {t('aiPanel.noBtn')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complexity Result Card */}
          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="size-4 text-accent" />
              <h2 className="text-base font-extrabold text-text-primary">{t('complexity.title')}</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg bg-surface-alt">
              <div>
                <span className="text-xs text-text-muted">{t('complexity.level')}: </span>
                <span className={`text-sm font-bold uppercase tracking-wider ${
                  project.complexity.level === 'expert-only' ? 'text-error' :
                  project.complexity.level === 'complex' ? 'text-warning' :
                  project.complexity.level === 'medium' ? 'text-accent' : 'text-success'
                }`}>
                  {t(`complexity.${project.complexity.level}`)}
                </span>
                <p className="mt-1 text-xs text-text-muted">Score: {project.complexity.score} / 100</p>
              </div>
              {project.complexity.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-w-md">
                  {project.complexity.reasons.map((r) => (
                    <span key={r} className="rounded bg-border px-2 py-0.5 text-[10px] font-bold text-text-primary">
                      {t(`complexity.reasons.${r}`, { count: project.lines.length })}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <EngineeringDrawingDesigner
            locale={locale}
            products={products}
            initialGraph={drawingInitialGraph}
          />

          {/* Scheme View */}
          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PanelTop className="size-4 text-accent" />
                <h2 className="text-base font-extrabold text-text-primary">{t('scheme')}</h2>
              </div>
              <span className="rounded bg-accent-subtle px-2 py-0.5 text-xs font-bold text-accent">
                {t('disclaimer')}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-white">
                      <Home className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-text-primary">
                        {t(`projectTypes.${input.type}`)} · {input.areaM2} м² · {input.phase}ф
                      </p>
                      <p className="text-xs text-text-muted">
                        {t('inputBreaker')} {input.inputBreakerA}A, {t('reserve')} {project.panel.reserveModules} {t('modules')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {project.lines.map((line) => {
                    const lLoad = line.loads[0]
                    const displayName = lLoad && (lLoad.kind === 'custom' || !t.has(`loadKinds.${lLoad.kind}`)) 
                      ? line.name 
                      : (lLoad ? t(`loadKinds.${lLoad.kind}`) : line.name)

                    return (
                      <div key={line.id} className="rounded-lg border border-border bg-surface-white p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-text-primary">{displayName}</p>
                            <p className="mt-1 text-xs text-text-muted">
                              {line.totalPowerW} W / {line.calculatedCurrentA} A
                            </p>
                          </div>
                          <Zap className="size-4 shrink-0 text-accent" />
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                          <div className="rounded-md bg-surface-alt px-2 py-1.5">
                            <span className="block text-text-muted">{t('roles.cable')}</span>
                            <b className="text-text-primary">
                              {t('cableLabel', { cores: line.cable.cores, section: line.cable.sectionMm2 })}
                            </b>
                          </div>
                          <div className="rounded-md bg-surface-alt px-2 py-1.5">
                            <span className="block text-text-muted">{t('roles.breaker')}</span>
                            <b className="text-text-primary">{line.breaker.label}</b>
                          </div>
                          <div className="rounded-md bg-surface-alt px-2 py-1.5">
                            <span className="block text-text-muted">{t('protection')}</span>
                            <b className="text-text-primary">
                              {line.rcd ? t('rcdLabel', { poles: line.rcd.poles, current: line.rcd.currentA, leakage: line.rcd.leakageMa }) : t('noRcd')}
                            </b>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Panel Modules Spec */}
          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              <h2 className="text-base font-extrabold text-text-primary">{t('panel')}</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-surface-alt p-3">
                <span className="text-xs text-text-muted">{t('occupied')}</span>
                <b className="block text-xl text-text-primary">{project.panel.occupiedModules}</b>
              </div>
              <div className="rounded-lg bg-surface-alt p-3">
                <span className="text-xs text-text-muted">{t('recommended')}</span>
                <b className="block text-xl text-text-primary">{project.panel.recommendedModules}</b>
              </div>
              <div className="rounded-lg bg-surface-alt p-3">
                <span className="text-xs text-text-muted">{t('reserve')}</span>
                <b className="block text-xl text-success">{project.panel.reserveModules}</b>
              </div>
            </div>
          </section>

          {/* Warnings & NormIssues Section */}
          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="size-4 text-accent" />
              <h2 className="text-base font-extrabold text-text-primary">{t('warnings')}</h2>
            </div>
            <div className="grid gap-2">
              {/* Dynamic Norm Issues (Critical & Danger) */}
              {project.normIssues.map((issue, idx) => (
                <div
                  key={`norm-issue-${idx}`}
                  className={`flex gap-2 rounded-lg border px-3 py-2 text-xs ${
                    issue.level === 'danger'
                      ? 'border-error-subtle bg-error-subtle text-error'
                      : 'border-warning-subtle bg-warning-subtle text-warning'
                  }`}
                >
                  <AlertOctagon className="mt-0.5 size-3.5 shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5">
                      {t(issue.level === 'danger' ? 'dangerLevel' : 'warningLevel')}
                    </span>
                    <p>{t(`normIssues.${issue.code}`, issue.params as Record<string, string | number>)}</p>
                  </div>
                </div>
              ))}

              {/* Standard Warnings translated */}
              {project.warnings.map((warning, idx) => {
                const message = t.has(`warningMessages.${warning.code}`)
                  ? t(`warningMessages.${warning.code}`, warning.params as Record<string, string | number>)
                  : warning.message || ''

                if (!message) return null

                const tone = warning.level === 'danger'
                  ? 'border-error-subtle bg-error-subtle text-error'
                  : warning.level === 'warning'
                    ? 'border-warning-subtle bg-warning-subtle text-warning'
                    : 'border-border bg-surface-alt text-text-muted'

                return (
                  <div key={`warning-${idx}`} className={`flex gap-2 rounded-lg border px-3 py-2 text-xs ${tone}`}>
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        {/* Right Column: BOM Spec & Recommendations */}
        <aside className="flex flex-col gap-5">
          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-4 text-accent" />
                <h2 className="text-base font-extrabold text-text-primary">{t('bom')}</h2>
              </div>
              <span className="rounded-md bg-surface-alt px-2 py-1 text-xs font-bold text-text-muted">
                {project.bom.items.length}
              </span>
            </div>

            <div className="flex max-h-[620px] flex-col gap-2 overflow-y-auto pr-1">
              {project.bom.items.map((item) => {
                const specMessage = t.has(`recommendationReasons.${item.reasonCode}`)
                  ? t(`recommendationReasons.${item.reasonCode}`, { spec: String(item.reasonParams?.spec || '') })
                  : item.reason

                return (
                  <div
                    key={item.recommendationId}
                    className={`rounded-lg border p-3 ${
                      item.missing ? 'border-warning-subtle bg-warning-subtle' : 'border-border bg-surface-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold text-text-primary">{item.name}</p>
                        <p className="mt-1 text-xs text-text-muted">{item.sku ?? t('technicalSpec')}</p>
                      </div>
                      {item.missing ? (
                        <AlertTriangle className="size-4 shrink-0 text-warning" />
                      ) : (
                        <CheckCircle2 className="size-4 shrink-0 text-success" />
                      )}
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3 text-sm">
                      <div>
                        <span className="block text-xs text-text-muted">qty</span>
                        <b className="text-text-primary">{item.qty}</b>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-text-muted">{item.missing ? t('missing') : t('found')}</span>
                        <b className="text-text-primary">{item.missing ? t('noProduct') : formatMoney(item.total)}</b>
                      </div>
                    </div>
                    {item.productId ? (
                      <Link
                        href={`/${locale}/product/${project.recommendations.find((rec) => rec.id === item.recommendationId)?.selected?.product.slug ?? ''}`}
                        className="mt-2 inline-flex text-xs font-bold text-accent hover:underline"
                      >
                        {t('openProduct')}
                      </Link>
                    ) : null}
                    <p className="mt-2 text-[10px] text-text-muted leading-snug">{specMessage}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 rounded-lg border border-border bg-surface-alt p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-text-muted">{t('subtotal')}</span>
                <b className="text-xl text-text-primary">{formatMoney(project.bom.subtotal)}</b>
              </div>
               <button
                type="button"
                disabled={isPending || addableItems.length === 0 || hasDangerIssue || hasMissingSafetyComponent}
                onClick={addProjectToCart}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? <RefreshCw className="size-4 animate-spin" /> : <ShoppingCart className="size-4" />}
                {isPending ? t('adding') : t('addFound')}
              </button>
              {hasDangerIssue && (
                <p className="mt-2 text-center text-xs font-bold text-error">
                  {t('fixDangerIssues')}
                </p>
              )}
              {hasMissingSafetyComponent && (
                <p className="mt-2 text-center text-xs font-bold text-error">
                  {t('missingSafetyComponents')}
                </p>
              )}
              {status ? (
                <button
                  type="button"
                  onClick={openDrawer}
                  className="mt-2 flex w-full items-center justify-center rounded-md border border-border bg-surface-white px-3 py-2 text-xs font-bold text-text-primary"
                >
                  {status} · {t('openCart')}
                </button>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Cable className="size-4 text-accent" />
              <h2 className="text-base font-extrabold text-text-primary">{t('recommendations')}</h2>
            </div>
            <div className="flex flex-col gap-2">
              {project.recommendations.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-surface-alt p-3 text-xs">
                  <p className="font-bold text-text-primary">{item.title}</p>
                  <p className="mt-1 text-text-muted">{Object.values(item.requiredSpec).join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      {/* Modal / Dialog for Add & Edit Custom Load */}
      {isModalOpen && editingLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-text-primary">
                {editingLoad.id && (input.customLoads || []).some((l) => l.id === editingLoad.id)
                  ? t('customLoads.editTitle')
                  : t('customLoads.addTitle')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid gap-4 max-h-[460px] overflow-y-auto pr-1">
              {/* Validation errors summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="rounded-lg border border-error-subtle bg-error-subtle/10 p-3 text-xs text-error font-semibold flex flex-col gap-1">
                  {t('customLoads.validationErrorsSummary')}
                  <ul className="list-disc pl-4 mt-1 font-medium">
                    {Object.values(validationErrors).map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preset / Template Selector */}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-text-primary">
                  {t('templatesLabel')}
                </span>
                <select
                  value={editingLoad.kind || 'custom'}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                >
                  {LOAD_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.kind} value={tmpl.kind}>
                      {t(`loadKinds.${tmpl.kind}`)}
                    </option>
                  ))}
                </select>
              </label>

              {/* Name */}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-text-primary">{t('customLoads.nameLabel')}</span>
                <input
                  type="text"
                  value={editingLoad.name || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    setEditingLoad((curr) => curr ? { ...curr, name: val } : null)
                  }}
                  className={`h-10 rounded-lg border ${validationErrors.name ? 'border-error focus:border-error' : 'border-border focus:border-accent'} bg-surface-white px-3 text-sm font-medium text-text-primary outline-none`}
                  placeholder={t('namePlaceholder')}
                />
                {validationErrors.name && (
                  <p className="text-xs text-error font-semibold">{validationErrors.name}</p>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Power */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.powerLabel')}</span>
                  <input
                    type="number"
                    value={editingLoad.powerW || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setEditingLoad((curr) => curr ? { ...curr, powerW: val } : null)
                    }}
                    className={`h-10 rounded-lg border ${validationErrors.powerW ? 'border-error focus:border-error' : 'border-border focus:border-accent'} bg-surface-white px-3 text-sm font-medium text-text-primary outline-none`}
                  />
                  {validationErrors.powerW && (
                    <p className="text-xs text-error font-semibold">{validationErrors.powerW}</p>
                  )}
                </label>

                {/* Phase */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.phaseLabel')}</span>
                  <select
                    value={editingLoad.phase || 1}
                    onChange={(e) => {
                      const val = Number(e.target.value) as ElectricalPhase
                      setEditingLoad((curr) => curr ? { ...curr, phase: val, voltage: val === 3 ? 400 : 230 } : null)
                    }}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  >
                    <option value={1}>{t('phase_1')}</option>
                    <option value={3}>{t('phase_3')}</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Room */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.roomLabel')}</span>
                  <input
                    type="text"
                    value={editingLoad.room || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditingLoad((curr) => curr ? { ...curr, room: val } : null)
                    }}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  />
                </label>

                {/* Area Zone (Wet/Dry) */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.dampLabel')}</span>
                  <select
                    value={editingLoad.areaZone || 'dry'}
                    onChange={(e) => {
                      const val = e.target.value
                      if (isAreaZone(val)) {
                        setEditingLoad((curr) => curr ? { ...curr, areaZone: val } : null)
                      }
                    }}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  >
                    <option value="dry">{t('dry')}</option>
                    <option value="damp">{t('wet')}</option>
                    <option value="outdoor">{t('outdoor')}</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Route Length */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.routeLabel')}</span>
                  <input
                    type="number"
                    value={editingLoad.routeLengthM || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setEditingLoad((curr) => curr ? { ...curr, routeLengthM: val } : null)
                    }}
                    className={`h-10 rounded-lg border ${validationErrors.routeLengthM ? 'border-error focus:border-error' : 'border-border focus:border-accent'} bg-surface-white px-3 text-sm font-medium text-text-primary outline-none`}
                  />
                  {validationErrors.routeLengthM && (
                    <p className="text-xs text-error font-semibold">{validationErrors.routeLengthM}</p>
                  )}
                </label>

                {/* Connection Type */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.connectionLabel')}</span>
                  <select
                    value={editingLoad.connectionType || 'socket'}
                    onChange={(e) => {
                      const val = e.target.value
                      if (isConnectionType(val)) {
                        setEditingLoad((curr) => curr ? { ...curr, connectionType: val } : null)
                      }
                    }}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  >
                    <option value="socket">{t('customLoads.connections.socket')}</option>
                    <option value="fixed">{t('customLoads.connections.fixed')}</option>
                    <option value="junction-box">{t('customLoads.connections.junction-box')}</option>
                    <option value="panel-direct">{t('customLoads.connections.panel-direct')}</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Dedicated line required */}
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-text-primary">{t('customLoads.dedicatedLabel')}</span>
                  <select
                    value={String(editingLoad.dedicatedLineRequired)}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditingLoad((curr) => {
                        if (!curr) return null
                        return {
                          ...curr,
                          dedicatedLineRequired: val === 'true' ? true : val === 'false' ? false : 'auto',
                        }
                      })
                    }}
                    className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  >
                    <option value="true">{t('yes')}</option>
                    <option value="false">{t('no')}</option>
                    <option value="auto">Авто</option>
                  </select>
                </label>

                {/* Critical flag */}
                <div className="flex flex-col justify-end gap-1 text-sm py-1">
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={editingLoad.critical || false}
                      onChange={(e) => {
                        const val = e.target.checked
                        setEditingLoad((curr) => curr ? { ...curr, critical: val } : null)
                      }}
                      className="size-4 rounded border-border bg-surface-white text-accent accent-accent"
                    />
                    <span className="font-medium text-text-primary">{t('customLoads.criticalLabel')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={editingLoad.reservePowerRequired || false}
                      onChange={(e) => {
                        const val = e.target.checked
                        setEditingLoad((curr) => curr ? { ...curr, reservePowerRequired: val } : null)
                      }}
                      className="size-4 rounded border-border bg-surface-white text-accent accent-accent"
                    />
                    <span className="font-medium text-text-primary">{t('customLoads.reserveLabel')}</span>
                  </label>
                </div>
              </div>

              {/* User Note */}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-text-primary">{t('note')}</span>
                <input
                  type="text"
                  value={editingLoad.userNote || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    setEditingLoad((curr) => curr ? { ...curr, userNote: val } : null)
                  }}
                  className="h-10 rounded-lg border border-border bg-surface-white px-3 text-sm font-medium text-text-primary outline-none focus:border-accent"
                  placeholder={t('commentPlaceholder')}
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div>
                {editingLoad.id && (input.customLoads || []).some((l) => l.id === editingLoad.id) && (
                  <button
                    type="button"
                    onClick={() => deleteCustomLoad(editingLoad.id!)}
                    className="flex items-center gap-1.5 rounded-lg border border-error-subtle bg-error-subtle/10 px-4 py-2 text-xs font-bold text-error transition-colors hover:bg-error-subtle/20"
                  >
                    <Trash2 className="size-3.5" />
                    {t('customLoads.deleteBtn')}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border bg-surface-white px-4 py-2 text-xs font-bold text-text-primary transition-colors hover:bg-surface-alt"
                >
                  {t('customLoads.cancelBtn')}
                </button>
                <button
                  type="button"
                  disabled={!editingLoad.name}
                  onClick={saveCustomLoad}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  {t('customLoads.saveBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
