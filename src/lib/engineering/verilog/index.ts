/**
 * Verilog DSL Module — Public API
 *
 * Provides parsing, interpretation, export, and auto-layout
 * for the Electronom Engineering Verilog DSL.
 *
 * Usage:
 *   import { parseAndInterpretVerilog, autoLayoutDraft } from '@/lib/engineering/verilog'
 */

export { parseVerilogSource } from './verilog-parser'
export type {
  VerilogAST,
  VerilogInstanceAST,
  VerilogParseError,
  VerilogParseResult,
  VerilogWireAST,
} from './verilog-parser'

export { interpretVerilogAST } from './verilog-interpreter'
export type {
  InterpretResult,
  InterpretWarning,
} from './verilog-interpreter'

export { autoLayoutDraft } from './verilog-auto-layout'
export { exportEngineeringProjectVerilog, attachVerilogToDraft } from './verilog-exporter'
export type { EngineeringVerilogExport } from './verilog-exporter'

/* ------------------------------------------------------------------ */
/*  Convenience: parse + interpret + auto-layout in one call           */
/* ------------------------------------------------------------------ */

import type { EngineeringProjectDraft } from '../graph'
import { parseVerilogSource } from './verilog-parser'
import { interpretVerilogAST } from './verilog-interpreter'
import type { InterpretWarning } from './verilog-interpreter'
import type { VerilogParseError } from './verilog-parser'
import { autoLayoutDraft } from './verilog-auto-layout'

export interface VerilogPipelineResult {
  draft: EngineeringProjectDraft
  parseErrors: VerilogParseError[]
  warnings: InterpretWarning[]
  /** Whether auto-layout was applied */
  autoLayoutApplied: boolean
}

/**
 * Full pipeline: Verilog source → parse → interpret → auto-layout → draft.
 *
 * This is the main entry point for converting Verilog text to a canvas-ready draft.
 *
 * @param source - Raw Verilog source text
 * @param existingDraft - Optional existing draft to merge network config from
 * @returns Pipeline result with draft, errors, and warnings
 */
export function parseAndInterpretVerilog(
  source: string,
  existingDraft?: EngineeringProjectDraft,
): VerilogPipelineResult {
  const { ast, errors: parseErrors } = parseVerilogSource(source)

  if (!ast) {
    // Return a minimal draft if parsing completely fails
    const emptyDraft: EngineeringProjectDraft = existingDraft ?? {
      id: 'verilog-error',
      version: 1,
      name: 'Parse Error',
      updatedAt: new Date().toISOString(),
      graph: {
        id: 'error',
        version: 1,
        locale: 'uk',
        network: { phase: 1, voltageV: 230, inputBreakerA: 25, earthingSystem: 'TN-C-S' },
        nodes: [],
        edges: [],
        catalogBindings: [],
        loads: [],
        panels: [],
        bom: [],
        totals: { totalPowerW: 0, totalCurrentA: 0, occupiedModules: 0, estimatedCost: 0 },
        normIssues: [],
      },
      drawing: { canvas: { cols: 12, rows: 8, cellWidth: 100, cellHeight: 100 }, nodes: [], edges: [] },
    }
    return { draft: emptyDraft, parseErrors, warnings: [], autoLayoutApplied: false }
  }

  const { draft, warnings, needsAutoLayout, nodesNeedingLayout } = interpretVerilogAST(ast, existingDraft)

  // Only nodes without explicit X_MM/Y_MM are repositioned; pinned nodes stay put
  const finalDraft = needsAutoLayout
    ? autoLayoutDraft(draft, new Set(nodesNeedingLayout))
    : draft

  return {
    draft: finalDraft,
    parseErrors,
    warnings,
    autoLayoutApplied: needsAutoLayout,
  }
}
