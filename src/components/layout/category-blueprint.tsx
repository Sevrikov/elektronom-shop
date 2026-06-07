'use client'

import { useId } from 'react'

interface CategoryBlueprintProps {
  slug: string
  className?: string
}

export default function CategoryBlueprint({ slug, className = '' }: CategoryBlueprintProps) {
  // Normalize slug to match our config categories
  const normalizedSlug = slug.toLowerCase().replace(/_/g, '-')
  const blueprintId = useId().replace(/:/g, '')
  const gridPatternId = `${blueprintId}-blueprint-grid`

  // Renders the blueprint grid pattern
  const renderGrid = () => (
    <>
      <defs>
        <pattern id={gridPatternId} width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M 16 0 L 0 0 0 16"
            fill="none"
            stroke="#3B7BD9"
            strokeWidth="0.5"
            opacity="0.08"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${gridPatternId})`} rx="6" />
      <rect
        width="100%"
        height="100%"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        className="rounded-lg"
        rx="6"
      />
    </>
  )

  switch (normalizedSlug) {
    case 'elektryka':
    case 'elektrika':
    case 'elektroustanovochni-vyroby':
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}
          
          {/* 1. Circuit Breaker (Left) */}
          <g transform="translate(10, 0)">
            {/* Outer contour (Thick) */}
            <path
              d="M 35,20 L 55,20 L 55,30 L 60,30 L 60,110 L 55,110 L 55,120 L 35,120 L 35,110 L 30,110 L 30,30 L 35,30 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            {/* Main parts (Medium) */}
            <rect
              x="37"
              y="52"
              width="16"
              height="26"
              rx="2"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
            <path
              d="M 40,65 L 48,58 L 48,70 L 40,70 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.5] fill-accent/20 dark:fill-blue-400/20"
            />
            <line
              x1="30"
              y1="45"
              x2="60"
              y2="45"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25]"
            />
            <line
              x1="30"
              y1="90"
              x2="60"
              y2="90"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25]"
            />
            {/* Details (Thin) */}
            <circle
              cx="45"
              cy="28"
              r="3"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75] fill-none"
            />
            <line
              x1="42"
              y1="28"
              x2="48"
              y2="28"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <circle
              cx="45"
              cy="110"
              r="3"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75] fill-none"
            />
            <line
              x1="42"
              y1="110"
              x2="48"
              y2="110"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="33"
              y1="30"
              x2="33"
              y2="110"
              className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75]"
            />
            <line
              x1="57"
              y1="30"
              x2="57"
              y2="110"
              className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75]"
            />
          </g>

          {/* 2. Digital Voltage Relay (Middle) */}
          <g transform="translate(10, 0)">
            {/* Outer contour (Thick) */}
            <path
              d="M 80,15 L 115,15 L 115,25 L 120,25 L 120,115 L 115,115 L 115,125 L 80,125 L 80,115 L 75,115 L 75,25 L 80,25 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            {/* Main parts (Medium) */}
            <rect
              x="83"
              y="35"
              width="34"
              height="24"
              rx="1.5"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-accent/10 dark:fill-blue-400/10"
            />
            {/* Seven-segment "220" indicator */}
            <g className="stroke-accent dark:stroke-blue-400 stroke-[1.25]" fill="none">
              <path d="M 87,40 H 92 V 46 L 87,49 H 92" />
              <path d="M 96,40 H 101 V 46 L 96,49 H 101" />
              <path d="M 105,40 H 110 V 49 H 105 Z" />
            </g>
            {/* Details (Thin) */}
            <circle
              cx="87"
              cy="70"
              r="2"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1] fill-none"
            />
            <circle
              cx="97.5"
              cy="70"
              r="2"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1] fill-none"
            />
            <circle
              cx="108"
              cy="70"
              r="2"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1] fill-none"
            />
            <circle
              cx="90"
              cy="88"
              r="3.5"
              className="stroke-accent/60 dark:stroke-blue-400/60 stroke-[0.75] fill-none"
            />
            <circle
              cx="105"
              cy="88"
              r="3.5"
              className="stroke-accent/60 dark:stroke-blue-400/60 stroke-[0.75] fill-none"
            />
            <path
              d="M 89,88 H 91 M 90,87 V 89 M 104,88 H 106"
              className="stroke-accent/60 dark:stroke-blue-400/60 stroke-[0.75]"
            />
          </g>

          {/* 3. Socket (Right) */}
          <g transform="translate(10, 0)">
            {/* Outer contour (Thick) */}
            <rect
              x="140"
              y="30"
              width="70"
              height="70"
              rx="8"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            {/* Main parts (Medium) */}
            <circle
              cx="175"
              cy="65"
              r="22"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
            <circle
              cx="175"
              cy="65"
              r="18"
              className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75] fill-none"
            />
            {/* Details (Thin) */}
            <circle
              cx="165"
              cy="65"
              r="3"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.25] fill-accent/30 dark:fill-blue-400/30"
            />
            <circle
              cx="185"
              cy="65"
              r="3"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.25] fill-accent/30 dark:fill-blue-400/30"
            />
            <path
              d="M 175,43 L 175,47 M 172,47 H 178"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1]"
            />
            <path
              d="M 175,87 L 175,83 M 172,83 H 178"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1]"
            />
          </g>
        </svg>
      )

    case 'instrumenty':
    case 'instrumenti':
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}

          {/* 1. Plier (Left) */}
          <g transform="translate(15, 5)">
            {/* Handles (Thick) */}
            <path
              d="M 33,52 L 20,115 M 43,52 L 56,115"
              className="stroke-accent dark:stroke-blue-400 stroke-[2.5] stroke-linecap-round"
            />
            <path
              d="M 32,55 C 26,80 22,100 22,110 M 44,55 C 50,80 54,100 54,110"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[1] fill-none"
            />
            {/* Pivot and Jaws (Thick) */}
            <circle
              cx="38"
              cy="48"
              r="6.5"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            <path
              d="M 34,43 L 28,20 H 48 L 42,43 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/10 dark:fill-blue-400/10"
            />
            {/* Detail Lines (Thin) */}
            <line
              x1="38"
              y1="48"
              x2="38"
              y2="48"
              className="stroke-accent dark:stroke-blue-400 stroke-[3] stroke-linecap-round"
            />
            <line
              x1="32"
              y1="25"
              x2="44"
              y2="25"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="32"
              y1="30"
              x2="44"
              y2="30"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="32"
              y1="35"
              x2="44"
              y2="35"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
          </g>

          {/* 2. Cordless Drill (Middle) */}
          <g transform="translate(10, 5)">
            {/* Outer housing (Thick) */}
            <path
              d="M 90,30 H 135 L 140,55 H 110 L 125,98 H 145 V 112 H 105 V 98 L 105,75 L 90,48 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            {/* Main parts (Medium) */}
            <rect
              x="78"
              y="33"
              width="12"
              height="18"
              rx="1"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-accent/10 dark:fill-blue-400/10"
            />
            <line
              x1="62"
              y1="42"
              x2="78"
              y2="42"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] stroke-linecap-round"
            />
            <path
              d="M 100,52 C 100,58 108,58 108,52 Z"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
            <line
              x1="125"
              y1="98"
              x2="125"
              y2="112"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]"
            />
            {/* Air vents & Details (Thin) */}
            <line
              x1="110"
              y1="36"
              x2="110"
              y2="45"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="115"
              y1="36"
              x2="115"
              y2="45"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="120"
              y1="36"
              x2="120"
              y2="45"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
          </g>

          {/* 3. Screwdriver (Right) */}
          <g transform="translate(-10, 5)">
            {/* Handle (Thick) */}
            <rect
              x="185"
              y="25"
              width="15"
              height="45"
              rx="4"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5 dark:fill-blue-400/5"
            />
            {/* Shaft & Tip (Thick / Medium) */}
            <line
              x1="192.5"
              y1="70"
              x2="192.5"
              y2="112"
              className="stroke-accent dark:stroke-blue-400 stroke-[2]"
            />
            <path
              d="M 190.5,112 L 194.5,112 L 192.5,120 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.5] fill-accent/20"
            />
            {/* Handle details (Thin) */}
            <line
              x1="189"
              y1="30"
              x2="189"
              y2="65"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
            <line
              x1="196"
              y1="30"
              x2="196"
              y2="65"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
          </g>
        </svg>
      )

    case 'led-osvitlennya':
    case 'osvitlennya-led':
    case 'osvitlennya':
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}

          {/* 1. Bulb (Left) */}
          <g transform="translate(15, 5)">
            {/* Outer dome (Thick) */}
            <path
              d="M 30,55 C 30,25 70,25 70,55 C 70,68 62,75 58,82 H 42 C 38,75 30,68 30,55 Z"
              className="stroke-accent dark:stroke-blue-400 stroke-[2.5] fill-accent/5"
            />
            {/* Screw base (Medium) */}
            <rect
              x="44"
              y="82"
              width="12"
              height="14"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5] fill-accent/10 dark:fill-blue-400/10"
            />
            <line x1="44" y1="87" x2="56" y2="87" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]" />
            <line x1="44" y1="92" x2="56" y2="92" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]" />
            <path d="M 47,96 C 47,99 53,99 53,96 Z" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]" />
            {/* Filament / Internal LED (Thin) */}
            <line x1="50" y1="58" x2="50" y2="82" className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]" />
            <circle cx="50" cy="55" r="4.5" className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1] fill-none" />
          </g>

          {/* 2. LED Floodlight (Middle) */}
          <g transform="translate(10, 5)">
            {/* Bracket (Medium) */}
            <path
              d="M 86,55 L 90,65 V 75 L 86,85"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]"
              fill="none"
            />
            <path
              d="M 144,55 L 140,65 V 75 L 144,85"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]"
              fill="none"
            />
            {/* Housing (Thick) */}
            <rect
              x="90"
              y="30"
              width="50"
              height="45"
              rx="3"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            {/* Inner matrix details (Thin) */}
            <rect
              x="95"
              y="35"
              width="40"
              height="35"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75] fill-none"
            />
            <circle cx="103" cy="43" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="115" cy="43" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="127" cy="43" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="103" cy="53" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="115" cy="53" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="127" cy="53" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="103" cy="63" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="115" cy="63" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
            <circle cx="127" cy="63" r="1.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] fill-accent" />
          </g>

          {/* 3. Spot Tracklight (Right) */}
          <g transform="translate(-10, 5)">
            {/* Cylinder body (Thick) */}
            <rect
              x="170"
              y="35"
              width="25"
              height="45"
              rx="2"
              transform="rotate(20 182 57)"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            {/* Joint (Medium / Thin) */}
            <path d="M 175,25 H 188 L 184,38" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25]" fill="none" />
            <circle cx="184" cy="38" r="1.5" className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]" />
            {/* Light beam indications (Thin) */}
            <line x1="165" y1="80" x2="155" y2="105" strokeDasharray="2,3" className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75]" />
            <line x1="183" y1="85" x2="183" y2="115" strokeDasharray="2,3" className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75]" />
          </g>
        </svg>
      )

    case 'kabeli-droty':
    case 'kabel-ta-provid':
    case 'kabel-provid':
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}

          {/* 1. Spool (Left) */}
          <g transform="translate(15, 5)">
            {/* Outer circle (Thick) */}
            <circle
              cx="55"
              cy="65"
              r="34"
              className="stroke-accent dark:stroke-blue-400 stroke-[2.5] fill-accent/5"
            />
            <circle
              cx="55"
              cy="65"
              r="30"
              className="stroke-accent/40 dark:stroke-blue-400/40 stroke-[0.75] fill-none"
            />
            {/* Core hole (Medium) */}
            <circle
              cx="55"
              cy="65"
              r="10"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/10 dark:fill-blue-400/10"
            />
            {/* Concentric Cable windings (Medium / Thin) */}
            <circle
              cx="55"
              cy="65"
              r="24"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
            <circle
              cx="55"
              cy="65"
              r="18"
              className="stroke-accent/60 dark:stroke-blue-400/60 stroke-[1] fill-none"
            />
            {/* Cross ticks on spool (Thin) */}
            <line x1="55" y1="31" x2="55" y2="35" className="stroke-accent/50 stroke-[0.75]" />
            <line x1="55" y1="95" x2="55" y2="99" className="stroke-accent/50 stroke-[0.75]" />
            <line x1="21" y1="65" x2="25" y2="65" className="stroke-accent/50 stroke-[0.75]" />
            <line x1="85" y1="65" x2="89" y2="65" className="stroke-accent/50 stroke-[0.75]" />
          </g>

          {/* 2. Stripped Cable (Right) */}
          <g transform="translate(5, 5)">
            {/* Cable Sheath (Thick) */}
            <rect
              x="120"
              y="60"
              width="62"
              height="16"
              rx="2"
              transform="rotate(-15 151 68)"
              className="stroke-accent dark:stroke-blue-400 stroke-[2.5] fill-accent/10 dark:fill-blue-400/10"
            />
            {/* Outcoming inner wires (Medium) */}
            <path
              d="M 175,53 C 185,48 195,48 205,50"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]"
              fill="none"
            />
            <path
              d="M 178,61 C 188,61 198,63 208,68"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]"
              fill="none"
            />
            <path
              d="M 175,68 C 185,73 195,83 205,86"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5]"
              fill="none"
            />
            {/* Copper conductor ends (Thick highlighted) */}
            <path
              d="M 205,50 L 215,51"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] stroke-linecap-round"
            />
            <path
              d="M 208,68 L 218,70"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] stroke-linecap-round"
            />
            <path
              d="M 205,86 L 215,88"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] stroke-linecap-round"
            />
            {/* Internal sheathing cross-sections (Thin) */}
            <ellipse
              cx="175"
              cy="61"
              rx="2"
              ry="7"
              transform="rotate(-15 175 61)"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[1]"
            />
          </g>
        </svg>
      )

    case 'video-sposterezhennya':
    case 'video-sposterezhennia':
    case 'ajax':
    case 'okhoronna-syhnalizatsiya':
    case 'okhoronna-syhnalizatsiia':
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}

          {/* 1. Dome Camera (Left) */}
          <g transform="translate(15, 12)">
            {/* Camera Base (Thick) */}
            <ellipse
              cx="45"
              cy="35"
              rx="30"
              ry="10"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/10"
            />
            {/* Dome Glass bubble (Thick) */}
            <path
              d="M 15,35 C 15,68 75,68 75,35"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            {/* Lens assembly (Medium / Thin) */}
            <circle
              cx="45"
              cy="45"
              r="14"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
            <circle
              cx="45"
              cy="48"
              r="5"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/30 dark:fill-blue-400/30"
            />
            <circle
              cx="45"
              cy="48"
              r="2"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75] fill-none"
            />
          </g>

          {/* 2. Motion Sensor (Middle) */}
          <g transform="translate(10, 5)">
            {/* Outer body (Thick) */}
            <rect
              x="105"
              y="30"
              width="30"
              height="65"
              rx="6"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            {/* Sensor Fresnel lens (Medium) */}
            <rect
              x="110"
              y="42"
              width="20"
              height="26"
              rx="2.5"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-accent/10 dark:fill-blue-400/10"
            />
            <line x1="110" y1="50" x2="130" y2="50" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]" />
            <line x1="110" y1="58" x2="130" y2="58" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]" />
            <line x1="120" y1="42" x2="120" y2="68" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]" />
            {/* LED indicator slot (Thin) */}
            <line
              x1="116"
              y1="36"
              x2="124"
              y2="36"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.5] stroke-linecap-round"
            />
          </g>

          {/* 3. Keyfob (Right) */}
          <g transform="translate(-10, 5)">
            {/* Case (Thick) */}
            <rect
              x="165"
              y="42"
              width="24"
              height="44"
              rx="5"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            {/* Buttons (Medium) */}
            <circle cx="177" cy="52" r="2.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none" />
            <circle cx="177" cy="61" r="2.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none" />
            <circle cx="177" cy="70" r="2.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none" />
            <circle cx="177" cy="79" r="2.5" className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none" />
            {/* Detail line (Thin) */}
            <line x1="165" y1="65" x2="189" y2="65" className="stroke-accent/30 dark:stroke-blue-400/30 stroke-[0.75]" />
          </g>
        </svg>
      )

    default:
      // Fallback blueprint showing engineering gear, calipers, dimension lines
      return (
        <svg
          viewBox="0 0 240 140"
          className={`w-full h-28 object-contain rounded-md mb-4 bg-slate-50/50 dark:bg-slate-900/10 ${className}`}
          aria-hidden="true"
        >
          {renderGrid()}

          {/* Ruler / Calipers */}
          <g transform="translate(0, 5)">
            <rect
              x="50"
              y="90"
              width="140"
              height="10"
              rx="1.5"
              transform="rotate(-28 120 95)"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.5] fill-accent/5"
            />
            <path
              d="M 72,70 L 68,62 M 86,62 L 82,54 M 100,54 L 96,46 M 114,46 L 110,38 M 128,38 L 124,30"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75]"
            />
          </g>

          {/* Mechanical Gear */}
          <g transform="translate(0, -5)">
            <circle
              cx="120"
              cy="65"
              r="24"
              className="stroke-accent dark:stroke-blue-400 stroke-[2] fill-accent/5"
            />
            <circle
              cx="120"
              cy="65"
              r="8"
              className="stroke-accent dark:stroke-blue-400 stroke-[1.5] fill-none"
            />
            {/* Gear teeth outline */}
            <path
              d="M 116,40 L 124,40 L 126,46 M 136,49 L 142,44 L 147,48 M 149,59 L 155,61 L 155,69 M 149,71 L 146,79 L 140,84 M 128,89 L 124,90 L 116,90 M 114,84 L 104,79 L 99,84 M 92,71 L 85,69 L 85,61 M 91,59 L 94,51 L 99,46 Z"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1.25] fill-none"
            />
          </g>

          {/* Dimension Lines */}
          <g>
            <path
              d="M 60,118 H 180"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1] stroke-dasharray-[2,2]"
            />
            <path
              d="M 60,113 V 123 M 180,113 V 123"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]"
            />
            <path
              d="M 66,118 L 60,118 L 64,115 M 174,118 L 180,118 L 176,115"
              className="stroke-accent/80 dark:stroke-blue-400/80 stroke-[1]"
            />
            {/* Dimension Text box */}
            <rect
              x="110"
              y="113"
              width="20"
              height="10"
              rx="1"
              className="stroke-accent/50 dark:stroke-blue-400/50 stroke-[0.75] fill-white dark:fill-slate-900"
            />
            <line
              x1="113"
              y1="118"
              x2="127"
              y2="118"
              className="stroke-accent/70 dark:stroke-blue-400/70 stroke-[0.75]"
            />
          </g>
        </svg>
      )
  }
}
