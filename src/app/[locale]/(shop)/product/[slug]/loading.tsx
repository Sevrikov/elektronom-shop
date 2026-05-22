// src/app/[locale]/(shop)/product/[slug]/loading.tsx
// Skeleton для страницы товара — отображается пока идёт загрузка

export default function ProductLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-4 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2 h-5 mb-4">
        <div className="h-3 w-16 rounded bg-surface-raised" />
        <div className="h-3 w-2 rounded bg-surface-raised" />
        <div className="h-3 w-20 rounded bg-surface-raised" />
        <div className="h-3 w-2 rounded bg-surface-raised" />
        <div className="h-3 w-40 rounded bg-surface-raised" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery skeleton */}
        <div className="flex flex-col gap-3">
          <div className="w-full rounded-lg aspect-square bg-surface-raised" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="size-16 rounded shrink-0 bg-surface-raised"
              />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 rounded bg-surface-raised" />
          <div className="h-8 w-3/4 rounded bg-surface-raised" />
          <div className="h-4 w-24 rounded bg-surface-raised" />
          <div className="h-6 w-28 rounded bg-surface-raised" />
          <div className="h-10 w-32 rounded bg-surface-raised" />
          <div className="h-12 rounded bg-surface-raised" />
          <div className="h-24 rounded-lg bg-surface-raised" />
        </div>
      </div>

      {/* Bottom sections */}
      <div className="mt-10 flex flex-col gap-8">
        <div>
          <div className="h-6 w-40 rounded mb-4 bg-surface-raised" />
          <div className="rounded-lg overflow-hidden border border-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex gap-4 px-4 py-2.5 ${i < 5 ? 'border-b border-border' : ''}`}
              >
                <div className="h-4 w-1/2 rounded bg-surface-raised" />
                <div className="h-4 w-1/4 rounded bg-surface-raised" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

