// src/components/ui/category-icon.tsx
// ELEKTRONOM Concept 3 ("Classic Hero") Monoline Iconography System
// Palette: Slate Gray (#90A1B9), Brand Blue (#155DFC), Emerald Accent (#00BC7D)

import React from 'react'

interface IconProps {
  slug: string
  className?: string
}

export default function CategoryIcon({ slug, className = 'size-5' }: IconProps) {
  const s = slug.toLowerCase()

  const baseGray = 'stroke-[#90A1B9] dark:stroke-slate-400'
  const baseGrayFill = 'fill-[#90A1B9] dark:fill-slate-400'
  const detailBlue = 'stroke-[#155DFC] dark:stroke-[#51A2FF]'
  const detailBlueFill = 'fill-[#155DFC] dark:fill-[#51A2FF]'
  const accentGreen = 'fill-[#00BC7D] stroke-[#00BC7D]'
  const strokeGreen = 'stroke-[#00BC7D]'

  // r-electrical
  if (s.includes('elektr') || s.includes('electr') || s.includes('avtomat-root') || s.includes('zap-root')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2.75v1.75M15 2.75v1.75M9 19.5v1.75M15 19.5v1.75"></path><rect x="5" y="4.5" width="14" height="15" rx="2.25"></rect><path d="M8.25 16.25h3"></path></g>
  <rect x="12.25" y="7.25" width="4.25" height="5.5" rx="1.25" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="8.5" cy="8.75" r="1.05" className={accentGreen}></circle>
      </svg>
    )
  }

  // r-tools
  if (s.includes('instrument') || s.includes('tools-root')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 11.8 10.85 6.4a1.2 1.2 0 0 1 2.3 0l.95 5.4"></path><path d="M12 6.6v5.2"></path></g>
  <circle cx="12" cy="13.3" r="1.5" fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></circle>
  <path d="M10.7 14.4 8.2 20.6M13.3 14.4l2.5 6.2" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // r-cctv
  if (s.includes('video') || s.includes('cctv') || s.includes('tvt')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.75" y="7.5" width="14.5" height="7.5" rx="3.25"></rect><path d="M10.25 15v3.5M6.75 18.75h7"></path></g>
  <path d="M19.75 8.4a3.9 3.9 0 0 1 0 5.7" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="6.9" cy="11.25" r="1.7" className={accentGreen}></circle>
      </svg>
    )
  }

  // r-security
  if (s.includes('ohran') || s.includes('okhoron') || s.includes('security') || s.includes('syhnaliz')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 21.4c1.05-.45 6.9-3.3 6.9-8.85V5.6L12 2.9 5.1 5.6v6.95c0 5.55 5.85 8.4 6.9 8.85Z" fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
  <g fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 12.55a3 3 0 0 1 4.2 0"></path><path d="M8.2 10.75a5.4 5.4 0 0 1 7.6 0"></path></g>
  <circle cx="12" cy="14.9" r="1.05" className={accentGreen}></circle>
      </svg>
    )
  }

  // r-cable
  if (s.includes('kabel') || s.includes('provid') || s.includes('provod') || s.includes('cable-root')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="12" r="8.9" fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></circle>
  <g fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.5" r="2.6"></circle><circle cx="8.95" cy="13.8" r="2.6"></circle></g>
  <circle cx="15.05" cy="13.8" r="2.6" fill="none" className={strokeGreen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></circle>
      </svg>
    )
  }

  // r-light
  if (s.includes('osvitl') || s.includes('osveshch') || s.includes('led-root')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.75 4.5h18.5"></path><path d="M7 4.5v3.15a5 5 0 0 0 10 0V4.5"></path></g>
  <path d="M8.55 14.6 7.3 17.9M12 14.6v3.6M15.45 14.6l1.25 3.3" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M8.9 11.55h6.2" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // r-switchgear
  if (s.includes('shchit') || s.includes('shchyty') || s.includes('switchgear')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3.4" width="18" height="17.2" rx="2.5"></rect><rect x="6.2" y="7.4" width="2.6" height="5.6" rx=".85"></rect><rect x="9.7" y="7.4" width="2.6" height="5.6" rx=".85"></rect><path d="M6.2 16.7h9.6"></path></g>
  <rect x="13.2" y="7.4" width="2.6" height="5.6" rx=".85" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="18" cy="16.7" r="1.05" className={accentGreen}></circle>
      </svg>
    )
  }

  // r-fixing
  if (s.includes('abraziv') || s.includes('krepezh') || s.includes('metiz')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.75 15.05 4.5v3.5L12 9.75 8.95 8V4.5Z"></path><path d="M10.25 9.75v9M13.75 9.75v9"></path><path d="M10.25 18.75 12 21.25l1.75-2.5"></path></g>
  <path d="M10.25 12.4h3.5M10.25 15.05h3.5" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // r-fire
  if (s.includes('pozhezh') || s.includes('fire')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.75 4.25h18.5"></path><path d="M5.5 4.25v1.8M18.5 4.25v1.8"></path><path d="M5.5 6.05a11 11 0 0 0 13 0"></path></g>
  <g fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.35a4.25 4.25 0 0 0 6 0"></path><path d="M7 15.1a6.9 6.9 0 0 0 10 0"></path></g>
  <circle cx="12" cy="7" r="1.05" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-mcb
  if (s.includes('avtomat') || s.includes('vymykach') || s.includes('mcb')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.25 1.1v1.15M9.75 1.1v1.15M6.25 13.75v1.15M9.75 13.75v1.15"></path><rect x="4.25" y="2.25" width="7.5" height="11.5" rx="1.5"></rect></g>
  <rect x="7.75" y="4.75" width="3" height="3.75" rx=".9" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
      </svg>
    )
  }

  // m-rcd
  if (s.includes('dif') || s.includes('uzo') || s.includes('rcd')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="3" y="2.25" width="10" height="11.5" rx="1.5" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <path d="M5.5 5h5" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="8" cy="9.9" r="1.5" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-relay
  if (s.includes('rele') || s.includes('relay') || s.includes('tumbler')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="1.75" y="4.75" width="12.5" height="6.5" rx="3.25" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="10.75" cy="8" r="2" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-contactor
  if (s.includes('kontakt') || s.includes('puskat') || s.includes('contactor')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="3" width="11" height="10" rx="1.5"></rect><path d="M5.25 1.5V3M10.75 1.5V3"></path><rect x="5.25" y="5.75" width="5.5" height="4.5" rx="1"></rect></g>
  <path d="M5.25 8h5.5" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-socket
  if (s.includes('rozetk') || s.includes('socket')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="3.25" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="8" cy="8" r="4.25" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></circle>
  <g className={detailBlueFill}><circle cx="6.1" cy="8" r=".95"></circle><circle cx="9.9" cy="8" r=".95"></circle></g>
      </svg>
    )
  }

  // m-terminal
  if (s.includes('klemm') || s.includes('shyn') || s.includes('shin') || s.includes('terminal')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.75" y="4.75" width="5.25" height="6.5" rx="1.25"></rect><rect x="9" y="4.75" width="5.25" height="6.5" rx="1.25"></rect></g>
  <path d="M4.4 6.9v2.2M11.65 6.9v2.2" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-din
  if (s.includes('ramk') || s.includes('nakladk') || s.includes('frame') || s.includes('din')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M1.5 11.25V8.35h3V4.75h7v3.6h3v2.9" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="8" cy="6.55" r=".95" className={detailBlueFill}></circle>
      </svg>
    )
  }

  // m-meter
  if (s.includes('schetch') || s.includes('lychiln') || s.includes('meter')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.75"></rect><path d="M4.75 10.6h3.75"></path></g>
  <rect x="4.5" y="4.6" width="7" height="2.9" rx=".7" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="11.1" cy="10.6" r=".95" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-utp
  if (s.includes('utp') || s.includes('vytaya') || s.includes('lan')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M1.75 5.5c1.8 0 1.8 5 3.6 5s1.8-5 3.6-5 1.8 5 3.6 5" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M1.75 10.5c1.8 0 1.8-5 3.6-5s1.8 5 3.6 5 1.8-5 3.6-5" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-heatshrink
  if (s.includes('termo') || s.includes('heatshrink')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M1.75 4.25h5.1l3.25 2.4v2.7l-3.25 2.4H1.75" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M10.1 8h4.15" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-conduit
  if (s.includes('gofra') || s.includes('trub') || s.includes('conduit')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 5h13M1.5 11h13"></path><path d="M4.75 5v6M11.25 5v6"></path></g>
  <path d="M8 5v6" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-gland
  if (s.includes('salnik') || s.includes('vvod') || s.includes('gland')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.75 6 4.5h2.75l2 1.25v4.5l-2 1.25H6L4 10.25Z"></path><path d="M4 8H1.75"></path></g>
  <path d="M10.75 8h3.5" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-bulb
  if (s.includes('lampa') || s.includes('bulb')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M8 1.6a4.35 4.35 0 0 0-2.6 7.85v1.3h5.2v-1.3A4.35 4.35 0 0 0 8 1.6Z" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M6.1 12.55h3.8M6.8 14.4h2.4" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-panel
  if (s.includes('paneli') || s.includes('panel')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="1.5" y="2.5" width="13" height="7" rx="1.5" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <path d="M4.5 11.75v2.15M8 11.75v2.6M11.5 11.75v2.15" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-flood
  if (s.includes('prozhektor') || s.includes('flood')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.6" y="4" width="8" height="8" rx="1.5"></rect><path d="M5.6 12v2M3.6 14.5h4"></path></g>
  <path d="M11.4 5.9h2.9M11.4 8h2.9M11.4 10.1h2.9" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-camera
  if (s.includes('kamera') || s.includes('camera')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="4.75" width="9.5" height="5.25" rx="2.25"></rect><path d="M6.5 10v2M4.25 12.5h4.5"></path></g>
  <path d="M13.1 5.6a3.1 3.1 0 0 1 0 3.8" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="4.55" cy="7.4" r="1.3" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-nvr
  if (s.includes('nvr') || s.includes('registr')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="4.25" width="13" height="7.5" rx="1.5"></rect><circle cx="4.75" cy="8" r="1.85"></circle></g>
  <path d="M8.75 6.75h4M8.75 9.25h4" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="4.75" cy="8" r=".6" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-hub
  if (s.includes('hub') || s.includes('ajax') || s.includes('central')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="3.5" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="8" cy="8" r="3.3" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></circle>
  <circle cx="8" cy="8" r="1.05" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-motion
  if (s.includes('ruhu') || s.includes('motion')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect x="2.25" y="3" width="7.5" height="10" rx="3.5" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <path d="M12.1 5.3a4 4 0 0 1 0 5.4" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <circle cx="6" cy="6.4" r="1.5" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-siren
  if (s.includes('siren')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M2.25 6.5h2.5L8.75 3.5v9L4.75 9.5h-2.5a.85.85 0 0 1-.85-.85V7.35a.85.85 0 0 1 .85-.85Z" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <g fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11.1 5.7a3.3 3.3 0 0 1 0 4.6"></path><path d="M13.3 3.9a6 6 0 0 1 0 8.2"></path></g>
      </svg>
    )
  }

  // m-smoke
  if (s.includes('duma') || s.includes('smoke')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1.75 3.5h12.5"></path><path d="M3.5 3.5v.85M12.5 3.5v.85"></path><path d="M3.5 4.35a8.5 8.5 0 0 0 9 0"></path></g>
  <g fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8.6a3.25 3.25 0 0 0 6 0"></path><path d="M3.25 11.3a5.25 5.25 0 0 0 9.5 0"></path></g>
  <circle cx="8" cy="4.95" r=".85" className={accentGreen}></circle>
      </svg>
    )
  }

  // m-enclosure
  if (s.includes('korpus') || s.includes('bochs')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="12" height="12" rx="1.75"></rect><rect x="4.25" y="4.5" width="2" height="3.6" rx=".6"></rect><rect x="7" y="4.5" width="2" height="3.6" rx=".6"></rect><path d="M4.25 11h7.5"></path></g>
  <rect x="9.75" y="4.5" width="2" height="3.6" rx=".6" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
      </svg>
    )
  }

  // m-disc
  if (s.includes('otrez') || s.includes('disc')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.25"></circle><circle cx="8" cy="8" r="1.6"></circle></g>
  <path d="M8 1.75v1.6M8 12.65v1.6M1.75 8h1.6M12.65 8h1.6" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-screw
  if (s.includes('samorez') || s.includes('bolty') || s.includes('screw')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5.5 2.25h5"></path><path d="M6.5 2.25v3h3v-3"></path><path d="M6.5 5.25v5.5L8 14l1.5-3.25V5.25"></path></g>
  <path d="M6.5 7.3h3M6.5 9.35h3" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-pliers
  if (s.includes('kleshch') || s.includes('passatiz') || s.includes('pliers')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 7.85 7.25 4.25a.8.8 0 0 1 1.5 0l.65 3.6"></path><path d="M8 4.5v3.35"></path></g>
  <circle cx="8" cy="8.85" r="1" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></circle>
  <path d="M7.15 9.6 5.5 13.75M8.85 9.6l1.65 4.15" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-multimeter
  if (s.includes('multimetr') || s.includes('vymir') || s.includes('tester')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <g fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.75" y="1.75" width="10.5" height="12.5" rx="1.75"></rect><circle cx="8" cy="10.1" r="2.1"></circle></g>
  <rect x="4.75" y="3.75" width="6.5" height="2.9" rx=".7" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></rect>
  <path d="M8 10.1 9.35 8.75" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-drill
  if (s.includes('drel') || s.includes('perforat') || s.includes('drill')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M2.25 4.25h6.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6l-.75 3.5H3l.75-3.5H2.25a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M9.9 6.25h4.35" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // m-shield
  if (s.includes('spec') || s.includes('spets') || s.includes('odezhd') || s.includes('odyah') || s.includes('shield')) {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <path d="M8 14.25c.7-.3 4.6-2.2 4.6-5.9V3.6L8 1.75 3.4 3.6v4.75c0 3.7 3.9 5.6 4.6 5.9Z" fill="none" className={baseGray} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M6 8.15 7.4 9.6 10.15 6.85" fill="none" className={detailBlue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    )
  }

  // Default Fallback (r-electrical)
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <g fill="none" className={baseGray} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2.75v1.75M15 2.75v1.75M9 19.5v1.75M15 19.5v1.75"></path><rect x="5" y="4.5" width="14" height="15" rx="2.25"></rect><path d="M8.25 16.25h3"></path></g>
  <rect x="12.25" y="7.25" width="4.25" height="5.5" rx="1.25" fill="none" className={detailBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></rect>
  <circle cx="8.5" cy="8.75" r="1.05" className={accentGreen}></circle>
    </svg>
  )
}
