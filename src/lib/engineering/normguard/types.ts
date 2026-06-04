export type SourceRefType = 'norm' | 'manufacturer_doc' | 'internal_policy' | 'catalog_attribute'
export type ConfidenceLevel = 'exact' | 'derived' | 'needs_review'

export type SourceRef =
  | {
      type: SourceRefType
      titleKey: string
      url?: string
      documentId: string
      section: string
      clause?: string
      confidence: 'exact'
      verifiedAt: string
    }
  | {
      type: SourceRefType
      titleKey: string
      url?: string
      documentId?: string
      section?: string
      clause?: string
      confidence: 'derived' | 'needs_review'
      verifiedAt?: string
    }

export interface FixSuggestion {
  actionCode: string
  descriptionKey: string
  params?: Record<string, string | number | boolean>
}

export type NormSeverity = 'info' | 'warning' | 'danger' | 'blocker'
export type NormScope = 'project' | 'source' | 'panel' | 'line' | 'load' | 'component' | 'catalog-item'

export interface NormIssue {
  code: string
  severity: NormSeverity
  scope: NormScope
  targetId?: string
  titleKey: string
  messageKey: string
  params?: Record<string, string | number | boolean>
  sourceRefs: SourceRef[]
  fixSuggestions: FixSuggestion[]
  blocksCheckout: boolean
}

export interface NormRule {
  code: string
  name: string
  description: string
  check(graph: import('../graph').EngineeringGraph): NormIssue[]
}
