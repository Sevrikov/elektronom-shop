'use client'

import { useState, useEffect } from 'react'

export function CircuitBreakerToggle({ locale }: { locale?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const isUk = locale === 'uk'

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-2.5 py-1 rounded-lg shrink-0 bg-surface-alt hover:bg-surface-raised border border-border cursor-pointer select-none transition-all active:scale-95 shadow-sm"
      title={isUk ? 'Перемикач теми (Автомат)' : 'Переключатель темы (Автомат)'}
      aria-label="Theme toggle"
    >
      <svg width="18" height="30" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 shrink-0">
        <rect x="2" y="0" width="20" height="40" rx="2" fill="var(--color-surface-raised)" stroke="var(--color-border-strong)" strokeWidth="1"/>
        {theme === 'light' ? (
          <>
            {/* ON State: Lever up */}
            <rect x="7" y="4" width="10" height="12" rx="1" fill="var(--color-accent)" />
            <text x="12" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">ON</text>
            <rect x="7" y="20" width="10" height="4" rx="1" fill="var(--color-border-strong)" />
            <circle cx="12" cy="30" r="2" fill="var(--color-success)" />
          </>
        ) : (
          <>
            {/* OFF State: Lever down */}
            <rect x="7" y="4" width="10" height="4" rx="1" fill="var(--color-border-strong)" />
            <rect x="7" y="12" width="10" height="12" rx="1" fill="var(--color-text-muted)" />
            <text x="12" y="21" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">OFF</text>
            <circle cx="12" cy="30" r="2" fill="var(--color-destructive)" />
          </>
        )}
        <rect x="10" y="34" width="4" height="3" rx="0.5" fill="var(--color-border-strong)" />
      </svg>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
          {theme === 'light' ? (isUk ? 'Тема: День' : 'Тема: День') : (isUk ? 'Тема: Ніч' : 'Тема: Ночь')}
        </span>
        <span className="text-[10px] font-extrabold text-accent">
          {theme === 'light' ? (isUk ? 'Світла' : 'Светлая') : (isUk ? 'Темна' : 'Темная')}
        </span>
      </div>
    </button>
  )
}
