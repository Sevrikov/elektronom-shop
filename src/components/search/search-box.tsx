'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { searchProducts, type SearchResultProduct } from '@/actions/search'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchBox() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('header')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultProduct[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const debouncedQuery = useDebounce(query, 300)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Execute search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      startTransition(() => {
        setResults([])
      })
      return
    }

    startTransition(async () => {
      const response = await searchProducts(debouncedQuery, locale)
      if (response.success) {
        setResults(response.results)
        setIsOpen(true)
      }
    })
  }, [debouncedQuery, locale])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex h-12 items-center gap-3 rounded-md px-4 border border-border-strong bg-white focus-within:border-accent transition-colors"
      >
        {isPending ? (
          <Loader2 className="size-[18px] text-text-muted animate-spin shrink-0" />
        ) : (
          <button type="submit" className="shrink-0 cursor-pointer flex items-center justify-center p-0 border-0 bg-transparent">
            <Search className="size-[18px] text-text-muted hover:text-accent transition-colors" strokeWidth={1.5} />
          </button>
        )}
        <input
          type="search"
          id="search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('search')}
          className="flex-1 border-0 outline-none bg-transparent text-sm text-text-primary placeholder:text-text-muted h-full"
        />
      </form>


      {/* Results Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border shadow-lg rounded-lg overflow-hidden z-50 max-h-[380px] overflow-y-auto">
          {isPending && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-text-muted">
              {t('loading') || 'Завантаження...'}
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((product) => (
                <Link
                  key={product.objectID}
                  href={`/${locale}/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-surface-alt transition-colors"
                >
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-10 object-contain rounded border border-border shrink-0"
                    />
                  ) : (
                    <div className="size-10 bg-surface-raised rounded flex items-center justify-center shrink-0 text-text-muted text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-text-muted truncate">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-text-primary num">
                      {product.price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                    </span>
                    {!product.inStock && (
                      <p className="text-[10px] text-destructive font-medium">Немає в наявності</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-text-muted">
              Нічого не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  )
}
