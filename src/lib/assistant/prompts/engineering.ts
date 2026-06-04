import { z } from 'zod'

export const EngineeringDraftSchema = z.object({
  input: z.object({
    type: z.enum(['apartment', 'house', 'office', 'garage']),
    areaM2: z.number().min(20).max(300),
    phase: z.union([z.literal(1), z.literal(3)]),
    inputBreakerA: z.number().min(16).max(63),
  }),
  complexity: z.object({
    level: z.string(),
  }),
  loads: z.array(z.object({
    name: z.string(),
    powerW: z.number(),
  })).optional(),
  normIssues: z.array(z.object({
    code: z.string(),
  })).optional(),
})

export type EngineeringDraftPayload = z.infer<typeof EngineeringDraftSchema>

export function getEngineeringPrompt(draft: EngineeringDraftPayload, locale: string): string {
  const loadSummary = draft.loads 
    ? draft.loads.map((l) => `${l.name} (${l.powerW}W)`).join(', ') 
    : ''
  const issuesSummary = draft.normIssues 
    ? draft.normIssues.map((i) => i.code).join(', ') 
    : ''

  if (locale === 'uk') {
    return `Я розробляю інженерний проект. Тип: ${draft.input.type}, Площа: ${draft.input.areaM2}м², Фазність: ${draft.input.phase}ф, Ввідний автомат: ${draft.input.inputBreakerA}A. Завантажені споживачі: ${loadSummary || 'немає'}. Порушення норм (NormIssues): ${issuesSummary || 'відсутні'}. Складність: ${draft.complexity.level}. Потрібна твоя допомога з аналізом схеми.`
  }

  return `Я разрабатываю инженерный проект. Тип: ${draft.input.type}, Площадь: ${draft.input.areaM2}м², Фазность: ${draft.input.phase}ф, Вводный автомат: ${draft.input.inputBreakerA}A. Загруженные потребители: ${loadSummary || 'нет'}. Нарушения норм (NormIssues): ${issuesSummary || 'отсутствуют'}. Сложность: ${draft.complexity.level}. Нужна твоя помощь с анализом схемы.`
}
