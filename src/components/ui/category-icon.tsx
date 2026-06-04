// src/components/ui/category-icon.tsx
// Кастомные трехцветные иконки для категорий: Синий (базовый) + Серый (детали) + Зеленый (акцент)
// MASTER_CONTEXT v1.2 §12

import React from 'react'

interface IconProps {
  slug: string
  className?: string
}

export default function CategoryIcon({ slug, className = 'size-5' }: IconProps) {
  const s = slug.toLowerCase()

  // 1. Автоматичні вимикачі / zap (Circuit Breaker)
  if (s.includes('avtomat') || s.includes('vymykach') || s.includes('zap')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 7l-2 5h4l-2 5" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="12" cy="5" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 2. Розетки та вимикачі / plug (Socket)
  if (s.includes('rozetk') || s.includes('plug')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" className="stroke-slate-400 dark:stroke-slate-500" />
        <circle cx="12" cy="12" r="5" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="10" cy="12" r="1" className="fill-slate-600 stroke-slate-600 dark:fill-slate-400 dark:stroke-slate-400" />
        <circle cx="14" cy="12" r="1" className="fill-slate-600 stroke-slate-600 dark:fill-slate-400 dark:stroke-slate-400" />
        <path d="M12 5v2M12 17v2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 3. Кабель та провід / cable (Cable)
  if (s.includes('kabel') || s.includes('provid') || s.includes('cable')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h10" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 8a4 4 0 014 4 4 4 0 01-4 4" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M6 8h4M6 16h4" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M16 10h4" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M16 14h4" className="stroke-emerald-500" />
        <circle cx="21" cy="10" r="1" className="fill-blue-600 stroke-blue-600" />
        <circle cx="21" cy="14" r="1" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 4. Освітлення LED / lightbulb (LED Bulb)
  if (s.includes('osvitl') || s.includes('led') || s.includes('lampa') || s.includes('lightbulb')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.8-1 1-2.2 1-3.5A5 5 0 0011 5 5 5 0 006 10c0 1.3.2 2.5 1 3.5v2h8v-2z" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M9 18h6M10 20h4" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 8v4" className="stroke-emerald-500" />
        <path d="M12 2v1M5 5l1 1M18 5l-1 1" className="stroke-emerald-400" />
      </svg>
    )
  }

  // 5. Пускова апаратура / power (Toggle / Switch station)
  if (s.includes('puskova') || s.includes('power')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <circle cx="12" cy="8" r="3" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="12" cy="16" r="3" className="fill-emerald-500/20 stroke-emerald-500" />
      </svg>
    )
  }

  // 6. Щити електричні / server (Cabinet panel)
  if (s.includes('shchyty') || s.includes('server')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M6 12h2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M10 7h6M10 12h6M10 17h6" className="stroke-slate-400 dark:stroke-slate-500" />
        <circle cx="18" cy="6" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 7. Інструмент ручний / wrench / instrument (Tools)
  if (s.includes('instrument') || s.includes('wrench') || s.includes('drill')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0z" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M14.7 7.7L5 17.4a2 2 0 000 2.8l1.4 1.4a2 2 0 002.8 0l9.7-9.7" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M7.5 15l2 2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 8. ПЗВ та диф-автомати / shield (Safety Guard)
  if (s.includes('pzv') || s.includes('shield')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M12 6v6" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M9 13l2 2 4-4" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 9. ДБЖ / ups / battery-charging
  if (s.includes('dbzh') || s.includes('ups') || s.includes('battery-charging')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="14" height="12" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M7 4v3M13 4v3" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M10 9l-2 3.5h3L10 16" className="stroke-emerald-500 fill-emerald-500/20" />
      </svg>
    )
  }

  // 10. Акумулятори / akumulyatory / battery
  if (s.includes('akumulyator') || s.includes('battery')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="14" height="12" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M6 4v3M14 4v3" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M6 10v4M4 12h4" className="stroke-emerald-500" />
        <path d="M12 12h4" className="stroke-slate-400 dark:stroke-slate-500" />
      </svg>
    )
  }

  // 11. Генератори / henerator / flame
  if (s.includes('henerator') || s.includes('generat') || s.includes('flame')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="14" height="12" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M7 3v3M17 9h3" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M10 10l-1 2h2l-1 2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 12. Двигуни / elektrodvyguny / cog
  if (s.includes('dvygun') || s.includes('motor') || s.includes('cog')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M20 12h2M2 12h2" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M10 9a3 3 0 014 0l1-1" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 13. Насоси / nasosy / droplet
  if (s.includes('nasos') || s.includes('pump') || s.includes('droplet')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="8" width="14" height="12" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 4v4M19 14h2M3 14h2" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M12 12c-1 1-1.5 2-1.5 2.5a1.5 1.5 0 003 0c0-.5-.5-1.5-1.5-2.5z" className="fill-emerald-500/20 stroke-emerald-500" />
      </svg>
    )
  }

  // 14. Вентиляція / ventylyatsiya / wind
  if (s.includes('ventil') || s.includes('wind')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 12c2-2 4-1 4 1s-2 4-4 4" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M4 8h2M3 12h3M4 16h2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 15. Обігрівачі / obigrivachi / thermometer
  if (s.includes('obigriv') || s.includes('heat') || s.includes('thermometer')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="1" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M8 6v12M12 6v12M16 6v12" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M8 3c0 1 .5 2 1 2M14 3c0 1 .5 2 1 2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 16. Стабілізатори / stabilizatory / trending-up
  if (s.includes('stabiliz') || s.includes('trending-up')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M7 14l3-3 4 3 4-5" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="18" cy="9" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 17. Відеоспостереження / videosposterezhennya / video
  if (s.includes('video') || s.includes('cctv')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l13-6 4 4-13 6z" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M9 16v3M6 21h6" className="stroke-slate-400 dark:stroke-slate-500" />
        <circle cx="17" cy="9" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 18. Зварювальне обладнання / zvaryuvalne / flame / welding
  if (s.includes('zvaryu') || s.includes('weld')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l6-6" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M10 14l3-3" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M15 9l2-4m-6 2l3 2" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 19. Масла для авто / motornye / droplet
  if (s.includes('masla') || s.includes('motornye')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9a4 4 0 00-4 4v8M19 12h2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M12 6c1 1 2 2.5 2 4s-1 3-2 4" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="12" cy="18" r="2" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // 20. Мережеве обладнання / router / server / starlink
  if (s.includes('merezheve') || s.includes('router') || s.includes('starlink')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="14" width="18" height="6" rx="1" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M6 14V6M18 14V6" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M10 6a3 3 0 014 0" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 21. Реле / repeat (Relay switch)
  if (s.includes('rele') || s.includes('repeat')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <path d="M8 8h8M8 12h8" className="stroke-blue-600 dark:stroke-blue-400" />
        <path d="M12 16l3-3m-3 3l-3-3" className="stroke-emerald-500" />
      </svg>
    )
  }

  // 22. Домофони та сигналізація / bell / intercom / ajax
  if (s.includes('domofon') || s.includes('sygnaliz') || s.includes('ajax') || s.includes('bell')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" className="stroke-slate-400 dark:stroke-slate-500" />
        <rect x="8" y="6" width="8" height="6" rx="1" className="stroke-blue-600 dark:stroke-blue-400" />
        <circle cx="12" cy="16" r="2" className="fill-emerald-500 stroke-emerald-500" />
      </svg>
    )
  }

  // Default Box
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" className="stroke-slate-400 dark:stroke-slate-500" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" className="stroke-blue-600 dark:stroke-blue-400" />
      <circle cx="12" cy="12" r="1.5" className="fill-emerald-500 stroke-emerald-500" />
    </svg>
  )
}
