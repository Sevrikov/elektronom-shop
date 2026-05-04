export default function CatalogLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-4 w-16 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
        <div className="h-4 w-4 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
        <div className="h-4 w-16 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
        <div className="h-4 w-4 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
        <div className="h-4 w-32 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
      </div>

      {/* Title skeleton */}
      <div className="h-8 w-64 rounded mb-6 animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />

      <div className="flex gap-6 items-start">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)', background: '#fff' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="h-4 w-24 rounded animate-pulse mb-2" style={{ background: 'var(--color-surface-raised)' }} />
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2 py-1.5">
                    <div className="size-4 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                    <div className="h-3 flex-1 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                    <div className="h-3 w-6 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-40 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
            <div className="flex gap-2">
              <div className="h-8 w-32 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
              <div className="h-8 w-16 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
            </div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid var(--color-border)', background: '#fff' }}
              >
                <div className="h-[160px] animate-pulse" style={{ background: 'var(--color-surface-alt)' }} />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-12 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  <div className="h-4 w-full rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  <div className="h-3 w-20 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  <div className="flex justify-between items-end pt-2">
                    <div className="h-6 w-16 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                    <div className="size-9 rounded animate-pulse" style={{ background: 'var(--color-surface-raised)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
