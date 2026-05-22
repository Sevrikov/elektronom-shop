'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col items-center justify-center bg-surface-alt font-sans text-text-primary p-4">
        <div className="max-w-md text-center p-8 bg-white border border-border rounded-xl shadow-sm">
          <span className="text-6xl font-extrabold text-accent">404</span>
          <h1 className="text-xl font-bold mt-4 mb-2">Сторінку не знайдено</h1>
          <p className="text-sm text-text-muted mb-6">
            Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
          <Link
            href="/uk"
            className="inline-flex items-center justify-center px-5 h-11 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition-colors text-sm"
          >
            На головну
          </Link>
        </div>
      </body>
    </html>
  )
}
