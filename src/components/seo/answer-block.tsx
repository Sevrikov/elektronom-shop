// src/components/seo/answer-block.tsx
// AEO (Answer Engine Optimization) Direct Answer Block
// Responsive layout: text on the left, specifications table on the right.

import { Sparkles } from 'lucide-react'
import { getDirectAnswer } from '@/lib/direct-answers'
import { QuickLink } from '@/lib/catalog-filter-config'
import { isFeatureEnabled } from '@/lib/features'

interface AnswerBlockProps {
  categorySlug: string
  locale: string
  matchingQuickLink?: QuickLink | null
  layout?: 'default' | 'sidebar'
}

export function AnswerBlock({ categorySlug, locale, matchingQuickLink, layout = 'default' }: AnswerBlockProps) {
  if (!isFeatureEnabled('alpha12_seo_answer_blocks_enabled')) return null

  const data = getDirectAnswer(categorySlug, matchingQuickLink)
  if (!data) return null

  const isUk = locale === 'uk'
  const titleText = isUk ? 'Швидка довідка' : 'Быстрая справка'

  if (layout === 'sidebar') {
    return (
      <div className="p-4 bg-surface-white border border-border border-l-4 border-l-accent rounded-2xl shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-6 rounded-md bg-accent/10 text-accent flex items-center justify-center">
            <Sparkles className="size-3.5" />
          </div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            {titleText}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Direct Answer Text */}
          <div className="text-[13px] text-text-muted leading-relaxed font-normal">
            {data.answer[locale as 'uk' | 'ru']}
          </div>

          {/* Key Specs Table */}
          <div className="bg-surface-alt/50 border border-border/80 rounded-xl p-3">
            <table className="w-full text-xs text-left text-text-muted">
              <tbody>
                {data.table.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b last:border-b-0 border-border/60"
                  >
                    <td className="py-2 pr-3 font-semibold text-text-secondary w-1/3">
                      {row.label[locale as 'uk' | 'ru']}
                    </td>
                    <td className="py-2 text-text-primary">
                      {row.value[locale as 'uk' | 'ru']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 p-5 bg-surface-white border border-border border-l-4 border-l-accent rounded-2xl shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="size-6 rounded-md bg-accent/10 text-accent flex items-center justify-center">
          <Sparkles className="size-3.5" />
        </div>
        <span className="text-xs font-bold text-accent uppercase tracking-wider">
          {titleText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Direct Answer Text */}
        <div className="md:col-span-2 text-sm text-text-muted leading-relaxed font-normal">
          {data.answer[locale as 'uk' | 'ru']}
        </div>

        {/* Right Side: Key Specs Table */}
        <div className="bg-surface-alt/50 border border-border/80 rounded-xl p-3.5">
          <table className="w-full text-xs text-left text-text-muted">
            <tbody>
              {data.table.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="border-b last:border-b-0 border-border/60"
                >
                  <td className="py-2 pr-3 font-semibold text-text-secondary w-1/3">
                    {row.label[locale as 'uk' | 'ru']}
                  </td>
                  <td className="py-2 text-text-primary">
                    {row.value[locale as 'uk' | 'ru']}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
