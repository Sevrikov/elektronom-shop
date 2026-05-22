'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[locale error]', error)
  }, [error])

  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-xl font-bold text-text-primary">Щось пішло не так</h2>
      <p className="text-sm text-text-muted max-w-md">
        Виникла помилка під час завантаження сторінки. Будь ласка, спробуйте знову.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center px-4 h-10 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover cursor-pointer transition-colors text-sm"
      >
        Спробувати знову
      </button>
    </main>
  )
}
