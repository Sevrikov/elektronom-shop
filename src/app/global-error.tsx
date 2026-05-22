'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global error]', error)
  }, [error])

  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col items-center justify-center bg-surface-alt font-sans text-text-primary p-4">
        <div className="max-w-md text-center p-8 bg-white border border-border rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-2">Критична помилка</h2>
          <p className="text-sm text-text-muted mb-6">
            Сталася непередбачена помилка в роботі додатку. Спробуйте оновити сторінку.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-4 h-10 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover cursor-pointer transition-colors text-sm"
          >
            Спробувати знову
          </button>
        </div>
      </body>
    </html>
  )
}
