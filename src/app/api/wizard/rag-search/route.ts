import { NextResponse } from 'next/server'
import rulesData from '../../../../../docs/rag_knowledge_base/schemas_international_rules.json'

interface RuleItem {
  id: string
  keywords: string[]
  recommendation: string
  suggested_rating?: number
  suggested_phase?: string
  mandatory_components: string[]
}

interface StandardItem {
  code: string
  region: string
  title: string
  rules: RuleItem[]
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const query = String(body.query || '').toLowerCase().trim()

    if (!query) {
      return NextResponse.json({ success: false, message: 'Пустой запрос' })
    }

    const matchedRules: Array<{
      standard: string
      region: string
      title: string
      recommendation: string
      suggestedRating?: number
      suggestedPhase?: string
      mandatoryComponents: string[]
    }> = []

    const standards = rulesData.standards as StandardItem[]

    // Search rules in knowledge base
    for (const std of standards) {
      for (const rule of std.rules) {
        const matches = rule.keywords.some((kw) => query.includes(kw))
        if (matches) {
          matchedRules.push({
            standard: std.code,
            region: std.region,
            title: rule.recommendation,
            recommendation: rule.recommendation,
            suggestedRating: rule.suggested_rating ?? 25,
            suggestedPhase: rule.suggested_phase ?? '1phase',
            mandatoryComponents: rule.mandatory_components,
          })
        }
      }
    }

    // Default fallback intelligence if no exact keyword match
    if (matchedRules.length === 0) {
      matchedRules.push({
        standard: 'PUE_7_DBN',
        region: 'UA / EU (IEC 60364)',
        title: 'Универсальная комплексная защита для электрощита',
        recommendation: `По вашему запросу "${query}" ИИ-ассистент рекомендует стандартную сборку с Реле напряжения ZUBR (защита от 380V), противопожарным УЗО 300mA и автоматами кривой B.`,
        suggestedRating: 25,
        suggestedPhase: '1phase',
        mandatoryComponents: ['Реле напряжения ZUBR D2-40', 'Вводной автомат 25A', 'УЗО 40A 30mA'],
      })
    }

    const primaryMatch = matchedRules[0]!

    return NextResponse.json({
      success: true,
      query,
      answer: primaryMatch.recommendation,
      standard: primaryMatch.standard,
      region: primaryMatch.region,
      suggestedRating: primaryMatch.suggestedRating ?? 25,
      suggestedPhase: primaryMatch.suggestedPhase ?? '1phase',
      mandatoryComponents: primaryMatch.mandatoryComponents,
      allMatches: matchedRules,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
