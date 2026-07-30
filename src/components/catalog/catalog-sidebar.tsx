'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import type { CategoryTreeNode } from '@/queries/categories'
import type { Locale } from '@/types'
import CategoryIcon from '@/components/ui/category-icon'

interface CatalogSidebarProps {
  categories: CategoryTreeNode[]
  locale: string
}

interface CategoryNodeProps {
  node: CategoryTreeNode
  depth: number
  locale: string
  expanded: Set<string>
  onToggle: (slug: string) => void
}

function CategoryNode({ node, depth, locale, expanded, onToggle }: CategoryNodeProps) {
  const subs = (node.children || [])
    .filter((sub) => sub.count > 0)
    .sort((a, b) => b.count - a.count)

  const isExpanded = expanded.has(node.slug)
  const hasSubs = subs.length > 0

  const handleToggle = (e: React.MouseEvent) => {
    if (hasSubs) {
      e.preventDefault()
      e.stopPropagation()
      onToggle(node.slug)
    }
  }

  const paddingLeft = 16 + depth * 16
  const fontSize = depth === 0 ? 'text-[13px] font-semibold' : depth === 1 ? 'text-[12px] font-medium' : 'text-[11px]'
  const textColor = depth === 0 ? 'text-[#1A1F2B]' : 'text-[#6A7280]'
  const height = depth === 0 ? 'h-10' : 'h-8'

  return (
    <div>
      <div
        className={`w-full flex items-center gap-2 px-4 transition-colors group cursor-pointer ${height}`}
        style={{ paddingLeft }}
        onClick={handleToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F5F7FA'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {depth === 0 ? (
          <CategoryIcon slug={node.slug} className="size-6 shrink-0 transition-transform group-hover:scale-105" />
        ) : (
          <span className="text-[#C9D1DC] font-light select-none text-[10px] mr-0.5">└─</span>
        )}
        
        <Link
          href={`/${locale}/catalog/${node.slug}`}
          className={`flex-1 text-left truncate transition-colors group-hover:text-[#3B7BD9] ${fontSize} ${textColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          {node.name}
        </Link>

        <span
          className="text-[11px] shrink-0 font-medium px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 text-[#9AA3AF] group-hover:text-[#3B7BD9] transition-colors"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {node.count.toLocaleString('uk-UA')}
        </span>

        {hasSubs && (
          <button 
            onClick={handleToggle}
            className="p-1 -mr-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="size-3.5 shrink-0 text-[#9AA3AF]" strokeWidth={2} />
            ) : (
              <ChevronRight className="size-3.5 shrink-0 text-[#9AA3AF]" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {hasSubs && isExpanded && (
        <div className="border-l border-slate-100 dark:border-slate-800 ml-5">
          {subs.map((sub) => (
            <CategoryNode
              key={sub.slug}
              node={sub}
              depth={depth + 1}
              locale={locale}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CatalogSidebar({ categories, locale }: CatalogSidebarProps) {
  const loc = locale as Locale
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  // Sort root categories by product count desc (larger first)
  const sortedRoots = [...categories]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#fff', border: '1px solid #E6EAF0' }}
    >
      {/* Title */}
      <div
        className="px-4 py-3 flex items-center"
        style={{ background: '#F5F7FA', borderBottom: '1px solid #E6EAF0' }}
      >
        <span
          className="text-[11px] font-bold tracking-[0.5px] uppercase"
          style={{ color: '#6A7280' }}
        >
          {loc === 'uk' ? 'УСІ КАТЕГОРІЇ' : 'ВСЕ КАТЕГОРИИ'}
        </span>
      </div>

      {/* Tree */}
      <div
        className="overflow-y-auto py-1"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {sortedRoots.map((cat) => (
          <CategoryNode
            key={cat.id}
            node={cat}
            depth={0}
            locale={locale}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Bottom link */}
      <div style={{ borderTop: '1px solid #E6EAF0' }}>
        <Link
          href={`/${locale}/catalog`}
          className="flex items-center gap-1 px-4 py-3 text-[13px] font-semibold transition-colors hover:opacity-80"
          style={{ color: '#3B7BD9' }}
        >
          {loc === 'uk' ? `Усі ${categories.length} категорії` : `Все ${categories.length} категории`}
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}
