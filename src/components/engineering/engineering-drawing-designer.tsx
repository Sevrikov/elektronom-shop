'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Cable,
  CheckCircle2,
  CircuitBoard,
  Link2,
  MousePointer2,
  PanelTop,
  Redo2,
  Save,
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
import { exportEngineeringProjectVerilog } from '@/lib/engineering/verilog'
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

function PixelSchematicIcon({ node }: { node: EngineeringNode }) {
  const pattern = nodePixelPattern(node.type)
  const activeClass = nodePixelToneClass(node)

  return (
    <span className="grid grid-cols-7 gap-px rounded-[3px] border border-border-strong bg-[linear-gradient(135deg,#f7fbff_0%,#d8e1eb_45%,#ffffff_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(16,24,40,0.10)]">
      {pattern.flatMap((row, rowIndex) =>
        [...row].map((cell, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={`size-1.5 rounded-[1px] ${
              cell === '1' ? activeClass : 'bg-surface-white/80'
            }`}
          />
        )),
      )}
    </span>
  )
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

export function EngineeringDrawingDesigner({ locale, products, initialGraph }: EngineeringDrawingDesignerProps) {
  const [history, setHistory] = useState<HistoryState>(() => {
    const present = createDraftFromGraph(initialGraph)
    return { past: [], present, future: [] }
  })
  const [selected, setSelected] = useState<SelectedElement>(null)
  const [paletteType, setPaletteType] = useState<EngineeringNodeType>('load')
  const [connectionKind, setConnectionKind] = useState<EngineeringConnectionKind>('L')
  const [connectFromId, setConnectFromId] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'add' | 'connect'>('select')
  const [savedAt, setSavedAt] = useState<string | null>(null)

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
      if (!parsed.graph?.nodes || !parsed.drawing?.nodes) return
      setHistory({
        past: [...history.past, present],
        present: parsed,
        future: [],
      })
      setSelected(null)
      setConnectFromId(null)
    } catch {
      window.localStorage.removeItem('engineering_project_draft')
    }
  }

  const syncFromForm = () => {
    setHistory({ past: [], present: createDraftFromGraph(initialGraph), future: [] })
    setSelected(null)
    setConnectFromId(null)
  }

  const nodesByCell = useMemo(() => {
    const map = new Map<string, EngineeringDrawingNode>()
    for (const node of present.drawing.nodes) {
      map.set(`${node.x}:${node.y}`, node)
    }
    return map
  }, [present.drawing.nodes])

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

  const cells = Array.from({ length: CANVAS.cols * CANVAS.rows }, (_, index) => {
    const x = index % CANVAS.cols
    const y = Math.floor(index / CANVAS.cols)
    return { x, y, key: `${x}:${y}` }
  })

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
            onClick={() => setMode('select')}
            className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-bold ${
              mode === 'select' ? 'border-accent bg-accent text-white' : 'border-border bg-surface-alt text-text-primary'
            }`}
          >
            <MousePointer2 className="size-3.5" />
            Select
          </button>
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-bold ${
              mode === 'add' ? 'border-accent bg-accent text-white' : 'border-border bg-surface-alt text-text-primary'
            }`}
          >
            <Zap className="size-3.5" />
            Place
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('connect')
              setConnectFromId(null)
            }}
            className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-bold ${
              mode === 'connect' ? 'border-accent bg-accent text-white' : 'border-border bg-surface-alt text-text-primary'
            }`}
          >
            <Link2 className="size-3.5" />
            Connect
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={history.past.length === 0}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-surface-alt text-text-primary disabled:opacity-40"
            aria-label="Undo"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={history.future.length === 0}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-surface-alt text-text-primary disabled:opacity-40"
            aria-label="Redo"
          >
            <Redo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="flex h-9 items-center gap-2 rounded-md bg-accent px-3 text-xs font-bold text-white"
          >
            <Save className="size-3.5" />
            Save JSON
          </button>
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[190px_minmax(0,1fr)_320px]">
        <aside className="flex flex-col gap-3">
          <div className="rounded-lg border border-border bg-surface-alt p-3">
            <p className="mb-2 text-xs font-extrabold uppercase text-text-muted">Palette</p>
            <div className="grid grid-cols-2 gap-2 2xl:grid-cols-1">
              {PALETTE.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    setPaletteType(item.type)
                    setMode('add')
                  }}
                  className={`rounded-md border px-2 py-2 text-left text-xs font-bold transition-colors ${
                    paletteType === item.type && mode === 'add'
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface-white text-text-primary hover:border-accent/50'
                  }`}
                >
                  <span className="block text-[10px] opacity-70">{item.shortLabel}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-alt p-3">
            <p className="mb-2 text-xs font-extrabold uppercase text-text-muted">Connection</p>
            <div className="grid grid-cols-4 gap-1.5 2xl:grid-cols-2">
              {CONNECTION_KINDS.map((kind) => (
                <button
                  type="button"
                  key={kind}
                  onClick={() => {
                    setConnectionKind(kind)
                    setMode('connect')
                  }}
                  className={`h-8 rounded-md border text-xs font-bold ${
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
                Source selected. Click target node.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={syncFromForm}
            className="rounded-md border border-border bg-surface-white px-3 py-2 text-xs font-bold text-text-primary"
          >
            Sync from calculator form
          </button>
          <button
            type="button"
            onClick={loadSavedDraft}
            className="rounded-md border border-border bg-surface-white px-3 py-2 text-xs font-bold text-text-primary"
          >
            Load saved JSON
          </button>
        </aside>

        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-lg border border-border-strong bg-[linear-gradient(145deg,#f8fafc_0%,#e9eef5_45%,#ffffff_100%)] shadow-inner">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(59,123,217,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,123,217,0.10)_1px,transparent_1px)] bg-[size:25px_25px]" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(26,31,43,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,31,43,0.10)_1px,transparent_1px)] bg-[size:100px_100px]" />
            <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border border-border bg-surface-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-text-muted shadow-sm">
              Electronom / Engineering sheet / A3
            </div>
            <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1200 800" aria-hidden="true">
              <defs>
                <marker id="engineering-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#0f766e" />
                </marker>
              </defs>
              {computed.graph.edges.map((edge) => {
                const source = drawingByNodeId.get(edge.source)
                const target = drawingByNodeId.get(edge.target)
                if (!source || !target) return null
                const issues = computed.issuesByTarget.get(edge.id) ?? []
                const x1 = source.x * 100 + 50
                const y1 = source.y * 100 + 50
                const x2 = target.x * 100 + 50
                const y2 = target.y * 100 + 50

                return (
                  <g key={edge.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={edgeStroke(issues)}
                      strokeWidth={issues.length > 0 ? 5 : 4}
                      strokeDasharray={edge.conductor === 'signal' ? '8 8' : undefined}
                      markerEnd="url(#engineering-arrow)"
                    />
                    <line
                      x1={x1}
                      y1={y1 + 7}
                      x2={x2}
                      y2={y2 + 7}
                      stroke="#d5dce5"
                      strokeWidth={1}
                      strokeDasharray={edge.conductor === 'signal' ? '8 8' : '2 8'}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      textAnchor="middle"
                      className="fill-text-primary text-[18px] font-extrabold"
                    >
                      {edge.conductor ?? edge.type ?? 'L'}
                    </text>
                  </g>
                )
              })}
            </svg>

            <div className="relative z-10 grid min-h-[560px] grid-cols-12 grid-rows-8 p-3 pt-10">
              {cells.map((cell) => {
                const drawingNode = nodesByCell.get(cell.key)
                const graphNode = drawingNode ? nodeById.get(drawingNode.nodeId) : undefined
                const issues = graphNode ? computed.issuesByTarget.get(graphNode.id) ?? [] : []
                const isSelected = selected?.kind === 'node' && graphNode?.id === selected.id
                const isConnectSource = graphNode?.id === connectFromId

                return (
                  <button
                    type="button"
                    key={cell.key}
                    onClick={() => {
                      if (graphNode) {
                        handleNodeClick(graphNode.id)
                      } else if (mode === 'add') {
                        addNodeAt(cell.x, cell.y)
                      }
                    }}
                    className="relative min-h-16 border-b border-r border-border/40 p-1.5 text-left"
                  >
                    {graphNode ? (
                      <span
                        className={`group relative flex h-full min-h-16 items-center gap-1.5 overflow-visible rounded-md border px-1.5 py-2 text-[10px] shadow-[0_6px_18px_rgba(16,24,40,0.10),inset_0_1px_0_rgba(255,255,255,0.85)] ${
                          nodeShapeClass(graphNode, issues)
                        } ${isSelected ? 'ring-2 ring-accent' : ''} ${isConnectSource ? 'ring-2 ring-warning' : ''}`}
                      >
                        <span className="absolute left-1.5 top-1 flex gap-1">
                          <span className="size-1 rounded-full border border-border-strong bg-surface-white shadow-sm" />
                          <span className="size-1 rounded-full border border-border-strong bg-surface-white shadow-sm" />
                        </span>
                        <span className="absolute bottom-1 left-1.5 flex gap-1">
                          <span className="size-1 rounded-full border border-border-strong bg-surface-white shadow-sm" />
                          <span className="size-1 rounded-full border border-border-strong bg-surface-white shadow-sm" />
                        </span>
                        {issues.length > 0 ? (
                          <span className="absolute -right-1 -top-1 z-20 flex size-4 items-center justify-center rounded-sm border border-warning bg-warning-subtle text-warning shadow-sm">
                            <AlertTriangle className="size-3" />
                          </span>
                        ) : null}

                        <span className="flex h-14 w-8 shrink-0 flex-col items-center justify-center rounded border border-border-strong bg-[linear-gradient(180deg,#ffffff_0%,#e1e8f0_48%,#f9fbfd_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                          <PixelSchematicIcon node={graphNode} />
                          <span className="mt-1 font-mono text-[7px] font-black leading-none text-accent">{nodeSymbol(graphNode)}</span>
                        </span>

                        <span className="min-w-0 flex-1 rounded border border-border/70 bg-surface-white/85 px-1.5 py-1 shadow-[0_2px_6px_rgba(16,24,40,0.06)]">
                          <span className="block truncate font-mono text-[11px] font-black leading-tight text-text-primary">
                            {nodePrimarySpec(graphNode)}
                          </span>
                          <span className="mt-0.5 block truncate text-[8px] font-extrabold uppercase text-text-muted">
                            {graphNode.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[7px] font-bold uppercase text-text-muted">
                            {nodeSecondarySpec(graphNode)}
                          </span>
                          <span className="mt-1 flex items-center justify-between border-t border-border/70 pt-0.5 text-[7px] font-black text-text-muted">
                            <span>L</span>
                            <span>N</span>
                            <span>PE</span>
                          </span>
                        </span>
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">Nodes</span>
              <b className="block text-xl text-text-primary">{computed.graph.nodes.length}</b>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-xs text-text-muted">Edges</span>
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
                <h3 className="text-sm font-extrabold text-text-primary">CAE sanity</h3>
              </div>
              <span className={computed.cae.issues.some((issue) => issue.severity === 'danger') ? 'text-xs font-bold text-error' : 'text-xs font-bold text-success'}>
                {computed.cae.issues.length} issues
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">Load</span>
                <b className="block text-sm text-text-primary">{formatWatts(computed.cae.totalPowerW) ?? '0 W'}</b>
              </div>
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">Estimated current</span>
                <b className="block text-sm text-text-primary">{computed.cae.estimatedCurrentA} A</b>
              </div>
              <div className="rounded-md border border-border bg-surface-white p-2">
                <span className="text-[10px] font-bold uppercase text-text-muted">Checked lines</span>
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

        <aside className="flex flex-col gap-3">
          <section className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PanelTop className="size-4 text-accent" />
                <h3 className="text-sm font-extrabold text-text-primary">Inspector</h3>
              </div>
              <button
                type="button"
                disabled={!selected}
                onClick={deleteSelected}
                className="flex size-8 items-center justify-center rounded-md border border-error-subtle bg-error-subtle/20 text-error disabled:opacity-40"
                aria-label="Delete selected element"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {selectedNode ? (
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-text-muted">Label</span>
                  <input
                    value={selectedNode.label}
                    onChange={(event) => updateSelectedNode({ label: event.target.value })}
                    className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                  />
                </label>

                <div className="grid grid-cols-4 gap-1.5">
                  <button type="button" onClick={() => moveSelectedNode(0, -1)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">Up</button>
                  <button type="button" onClick={() => moveSelectedNode(-1, 0)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">Left</button>
                  <button type="button" onClick={() => moveSelectedNode(1, 0)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">Right</button>
                  <button type="button" onClick={() => moveSelectedNode(0, 1)} className="rounded-md border border-border bg-surface-white py-1 text-xs font-bold">Down</button>
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
                  <span className="font-bold text-text-muted">Material</span>
                  <select
                    value={String(selectedNode.properties.material ?? 'Cu')}
                    onChange={(event) => updateSelectedNodeProperty('material', event.target.value)}
                    className="h-9 rounded-md border border-border bg-surface-white px-2 font-semibold text-text-primary outline-none"
                  >
                    <option value="Cu">Cu</option>
                    <option value="Al">Al</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-text-muted">Area zone</span>
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
                  <p className="mb-2 text-xs font-extrabold text-text-muted">Catalog product</p>
                  {selectedNodeBom.length > 0 ? (
                    selectedNodeBom.map((item) => (
                      <div key={item.sku} className="mb-2 rounded-md bg-surface-alt p-2 text-xs">
                        <p className="font-bold text-text-primary">{item.name}</p>
                        <p className="text-text-muted">{item.missing ? 'No catalog match' : `${item.sku} / ${formatMoney(item.total)}`}</p>
                        {typeof item.stock === 'number' ? (
                          <p className={item.stockInsufficient ? 'mt-1 font-bold text-error' : 'mt-1 font-bold text-success'}>
                            stock {item.stock} / need {item.qty}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted">This node is not a BOM item.</p>
                  )}
                  {selectedNodeAlternatives.map(({ product, score }) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => bindProduct(product)}
                      className="mt-1 w-full rounded-md border border-border bg-surface-white px-2 py-2 text-left text-xs hover:border-accent"
                    >
                      <span className="block font-bold text-text-primary">{product.name}</span>
                      <span className="text-text-muted">{product.sku} / score {score} / stock {product.stock}</span>
                    </button>
                  ))}
                </div>

                <div className="rounded-md border border-border bg-surface-white p-2">
                  <p className="mb-2 text-xs font-extrabold text-text-muted">Issues</p>
                  {selectedNodeIssues.length > 0 ? selectedNodeIssues.map((issue) => (
                    <p key={issue.code} className="mb-1 rounded bg-error-subtle/20 px-2 py-1 text-xs font-semibold text-error">
                      {issue.code}
                    </p>
                  )) : (
                    <p className="flex items-center gap-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="size-3.5" />
                      No node warnings
                    </p>
                  )}
                </div>

                {selectedFixSuggestions.length > 0 ? (
                  <div className="rounded-md border border-warning-subtle bg-warning-subtle/20 p-2">
                    <p className="mb-2 text-xs font-extrabold text-warning">NormGuard suggestions</p>
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
                <p className="text-text-muted">Conductor: {selectedEdge.conductor ?? selectedEdge.type}</p>
                {selectedEdgeIssues.length > 0 ? selectedEdgeIssues.map((issue) => (
                  <p key={issue.code} className="rounded bg-error-subtle/20 px-2 py-1 font-semibold text-error">{issue.code}</p>
                )) : (
                  <p className="font-semibold text-success">No line warnings</p>
                )}
                {selectedFixSuggestions.length > 0 ? selectedFixSuggestions.map((suggestion) => (
                  <p key={`${suggestion.actionCode}-${JSON.stringify(suggestion.params ?? {})}`} className="rounded bg-warning-subtle/20 px-2 py-1 font-semibold text-warning">
                    {suggestion.actionCode}
                  </p>
                )) : null}
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-text-muted">
                Select an element or place a new one from the palette.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="mb-2 flex items-center gap-2">
              <Link2 className="size-4 text-accent" />
              <h3 className="text-sm font-extrabold text-text-primary">Connections</h3>
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
              <h3 className="text-sm font-extrabold text-text-primary">AI handoff</h3>
            </div>
            <p className="text-xs leading-relaxed text-text-muted">
              Assistant receives current draft, NormGuard warnings and BOM. Blocking NormGuard issues stay blocking.
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
              Open AI assistant
            </Link>
          </section>
        </aside>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-border bg-surface-alt p-3">
          <div className="mb-3 flex items-center gap-2">
            <Cable className="size-4 text-accent" />
            <h3 className="text-sm font-extrabold text-text-primary">BOM from drawing graph</h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {computed.bom.slice(0, 9).map((item) => (
              <div key={`${item.nodeId ?? item.sku}-${item.role}`} className="rounded-md border border-border bg-surface-white p-2 text-xs">
                <p className="line-clamp-2 font-bold text-text-primary">{item.name}</p>
                <p className="mt-1 text-text-muted">{item.role} / qty {item.qty}</p>
                <p className={item.missing ? 'mt-1 font-bold text-error' : 'mt-1 font-bold text-text-primary'}>
                  {item.missing ? 'Catalog match missing' : formatMoney(item.total)}
                </p>
                {typeof item.stock === 'number' ? (
                  <p className={item.stockInsufficient ? 'mt-1 font-bold text-error' : 'mt-1 font-bold text-success'}>
                    stock {item.stock}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface-alt p-3">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            <h3 className="text-sm font-extrabold text-text-primary">Verilog bridge</h3>
          </div>
          <p className="text-xs text-text-muted">
            Export binds Verilog symbols to graph nodes, edges and catalog product IDs for MCP control.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <p className="rounded-md bg-surface-white px-2 py-1 text-xs font-bold text-text-primary">
              {verilogExport.bindings.length} bindings
            </p>
            <p className="rounded-md bg-surface-white px-2 py-1 text-xs font-bold text-text-primary">
              {verilogExport.mcpControlManifest.commands.length} MCP cmds
            </p>
          </div>
          <textarea
            readOnly
            value={verilogExport.source}
            className="mt-2 h-32 w-full resize-none rounded-md border border-border bg-surface-white p-2 font-mono text-[10px] leading-relaxed text-text-primary outline-none"
          />
          <p className="mt-2 rounded-md bg-surface-white px-2 py-1 text-xs font-bold text-text-primary">
            {savedAt ? `Draft saved ${savedAt}` : `Draft updated ${present.updatedAt}`}
          </p>
        </section>
      </div>
    </section>
  )
}
