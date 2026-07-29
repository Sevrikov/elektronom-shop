// src/components/ui/category-icon.tsx
// Монолинейный набор иконок категорий ELEKTRONOM Icon System V1:
// Серый корпус (#90A1B9 / slate-400), Синие функциональные детали (#1550FC / #51A2FF), Зелёный акцент-индикатор (#10B981 / emerald-500)

import React from 'react'

interface IconProps {
  slug: string
  className?: string
}

export default function CategoryIcon({ slug, className = 'size-5' }: IconProps) {
  const s = slug.toLowerCase()

  const baseGray = 'stroke-[#90A1B9] dark:stroke-slate-400'
  const detailBlue = 'stroke-[#1550FC] dark:stroke-[#51A2FF]'
  const accentGreen = 'fill-[#10B981] stroke-[#10B981]'
  const strokeGreen = 'stroke-[#10B981]'

  // 1. Електрика / Электротовары / Автоматичні вимикачі (Circuit Breakers & Electrical)
  if (s.includes('electr') || s.includes('elektr') || s.includes('avtomat') || s.includes('vymykach') || s.includes('zap')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" className={baseGray} />
        <path d="M12 7l-2 4.5h4l-2 4.5" className={detailBlue} />
        <circle cx="12" cy="5" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 2. Інструменти (Tools & Equipment)
  if (s.includes('instrument') || s.includes('wrench') || s.includes('drill')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0z" className={baseGray} />
        <path d="M14.7 7.7L5 17.4a2 2 0 000 2.8l1.4 1.4a2 2 0 002.8 0l9.7-9.7" className={detailBlue} />
        <path d="M7.5 15l2 2" className={strokeGreen} />
      </svg>
    )
  }

  // 3. Відеонаглядення / CCTV / TVT Digital
  if (s.includes('video') || s.includes('cctv') || s.includes('tvt')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l13-6 4 4-13 6z" className={baseGray} />
        <path d="M9 16v3M6 21h6" className={baseGray} />
        <circle cx="16.5" cy="8.5" r="2" className={detailBlue} />
        <circle cx="16.5" cy="8.5" r="0.75" className={accentGreen} />
      </svg>
    )
  }

  // 4. Охорона, Пожежна сигналізація, Ajax, Контроль доступу, Домофони (Security, Alarm & Access Control)
  if (s.includes('ohran') || s.includes('okhoron') || s.includes('pozhezh') || s.includes('ajax') || s.includes('domofon') || s.includes('sygnaliz') || s.includes('syhnaliz') || s.includes('kontrol') || s.includes('access') || s.includes('shield')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className={baseGray} />
        <path d="M12 7v5" className={detailBlue} />
        <path d="M9.5 14.5l2 2 3.5-3.5" className={strokeGreen} />
      </svg>
    )
  }

  // 5. Кабель та провід (Cables & Wires)
  if (s.includes('kabel') || s.includes('provid') || s.includes('provod') || s.includes('cable') || s.includes('drot')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h9" className={baseGray} />
        <path d="M11 8a4 4 0 014 4 4 4 0 01-4 4" className={detailBlue} />
        <path d="M15 9.5h5.5M15 14.5h5.5" className={detailBlue} />
        <circle cx="21" cy="9.5" r="1" className={accentGreen} />
        <circle cx="21" cy="14.5" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 6. Освітлення LED (LED Bulb & Lighting)
  if (s.includes('osvitl') || s.includes('osveshch') || s.includes('led') || s.includes('lampa') || s.includes('lightbulb')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 13.5c.8-1 1.2-2.2 1.2-3.5A5.2 5.2 0 0011 4.8a5.2 5.2 0 00-5.2 5.2c0 1.3.4 2.5 1.2 3.5v2.5h8v-2.5z" className={detailBlue} />
        <path d="M9 18.5h6M10 21h4" className={baseGray} />
        <path d="M11 8.5v3M11 2v1.5" className={strokeGreen} />
        <circle cx="11" cy="8.5" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 7. Абразиви та кріпеж (Fasteners & Abrasives)
  if (s.includes('abraziv') || s.includes('krepezh') || s.includes('krepysh') || s.includes('metiz')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v13M9 20h6" className={baseGray} />
        <path d="M6 4h12l1.5 3H4.5L6 4z" className={detailBlue} />
        <circle cx="12" cy="11" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 8. Зварювальне обладнання (Welding Equipment)
  if (s.includes('svar') || s.includes('zvar') || s.includes('weld')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l6-6" className={baseGray} />
        <path d="M10 14l3-3" className={detailBlue} />
        <path d="M15 9l2-4m-6 2l3 2" className={strokeGreen} />
      </svg>
    )
  }

  // 9. Спецодяг та захист (Workwear & Safety Protection)
  if (s.includes('spec') || s.includes('spets') || s.includes('odezhd') || s.includes('odyah')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4l6 3 6-3v14l-6 3-6-3V4z" className={baseGray} />
        <path d="M12 7v14" className={detailBlue} />
        <circle cx="12" cy="11" r="1.5" className={accentGreen} />
      </svg>
    )
  }

  // 10. Клеммники та шины (Terminal Blocks & Busbars)
  if (s.includes('klemm') || s.includes('shyna')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" className={baseGray} />
        <path d="M7 9v6M12 9v6M17 9v6" className={detailBlue} />
        <circle cx="12" cy="6" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 11. Счетчики электроэнергии (Energy Meters)
  if (s.includes('schetchik') || s.includes('lychilnyk') || s.includes('meter')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" className={baseGray} />
        <rect x="7" y="6" width="10" height="5" rx="1" className={detailBlue} />
        <path d="M8 15h4M8 18h2" className={detailBlue} />
        <circle cx="15" cy="16" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 12. Трансформаторы тока (Transformers)
  if (s.includes('transform') || s.includes('toka')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="12" r="5.5" className={baseGray} />
        <circle cx="15" cy="12" r="5.5" className={detailBlue} />
        <circle cx="12" cy="12" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 13. Реле и тумблеры (Relays & Switches)
  if (s.includes('rele') || s.includes('tumbler')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" className={baseGray} />
        <path d="M8 9h8M8 15h5" className={detailBlue} />
        <path d="M15 15l2-2" className={strokeGreen} />
        <circle cx="16" cy="9" r="1" className={accentGreen} />
      </svg>
    )
  }

  // 14. Абразивы и крепеж (Fasteners & Abrasives)
  if (s.includes('abraziv') || s.includes('krepezh') || s.includes('krepysh')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v13M9 20h6" className={baseGray} />
        <path d="M6 4h12l1.5 3H4.5L6 4z" className={detailBlue} />
        <circle cx="12" cy="11" r="1" className={accentGreen} />
      </svg>
    )
  }

  // Default Fallback Box
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" className={baseGray} />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" className={detailBlue} />
      <circle cx="12" cy="12" r="1" className={accentGreen} />
    </svg>
  )
}

