'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Cpu,
  Car,
  ArrowRight,
  Shield,
  Battery,
} from 'lucide-react'
import { cn, localizedPath } from '@/lib/utils'

// Image widths for variants
const PSIZE = {
  desktop: 420,
  compact: 320,
  tablet: 220,
  mobile: 130,
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNICAL BACKGROUND SVGs
// ─────────────────────────────────────────────────────────────────────────────

function BgGrid() {
  return (
    <div className="eb__bg eb__bg--grid">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <pattern id="bg-grid-cells" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#E6EAF0" strokeWidth="1" />
          </pattern>
          <linearGradient id="bg-grid-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bg-grid-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8EEF7" stopOpacity="0" />
            <stop offset="1" stopColor="#E8EEF7" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="1440" height="420" fill="url(#bg-grid-cells)" />
        <rect width="1440" height="420" fill="url(#bg-grid-fade)" />
        <rect x="720" y="0" width="720" height="420" fill="url(#bg-grid-right)" opacity="0.7" />
        <rect x="900" y="-20" width="2" height="460" fill="#3B7BD9" opacity="0.18" />
        <rect x="900" y="80" width="2" height="80" fill="#3B7BD9" />
        <g opacity="0.4">
          <line x1="780" y1="380" x2="1380" y2="380" stroke="#6A7280" strokeWidth="1" />
          <line x1="780" y1="384" x2="1380" y2="384" stroke="#6A7280" strokeWidth="1" />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={790 + i * 20} cy={382} r="0.8" fill="#6A7280" />
          ))}
        </g>
        <g stroke="#3B7BD9" strokeWidth="1" opacity="0.5">
          <line x1="1380" y1="20" x2="1400" y2="20" />
          <line x1="1390" y1="10" x2="1390" y2="30" />
        </g>
      </svg>
    </div>
  )
}

function BgCircuit() {
  return (
    <div className="eb__bg eb__bg--circuit">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="bg-cir-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#3B7BD9" strokeWidth="1.2" fill="none" opacity="0.35">
          <path d="M820 60 L820 140 L900 140 L900 220 L1020 220" />
          <path d="M1020 220 L1020 300 L1180 300" />
          <path d="M880 60 L880 100 L960 100 L960 180" />
          <path d="M1100 60 L1100 160 L1240 160 L1240 280" />
          <path d="M1280 80 L1380 80" />
          <path d="M1280 360 L1380 360" />
        </g>
        <g fill="#3B7BD9" opacity="0.6">
          <circle cx="820" cy="60" r="3" />
          <circle cx="1020" cy="220" r="3" />
          <circle cx="960" cy="180" r="3" />
          <circle cx="1240" cy="280" r="3" />
          <circle cx="1180" cy="300" r="3" />
          <circle cx="1380" cy="80" r="3" />
          <circle cx="1380" cy="360" r="3" />
        </g>
        <g fill="#3B7BD9" opacity="0.18">
          {Array.from({ length: 14 }).flatMap((_, r) =>
            Array.from({ length: 14 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={780 + c * 48} cy={20 + r * 28} r="1" />
            ))
          )}
        </g>
        <rect width="780" height="420" fill="url(#bg-cir-fade)" />
      </svg>
    </div>
  )
}

function BgSurge() {
  return (
    <div className="eb__bg eb__bg--surge">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="bg-srg-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#3B7BD9" fill="none">
          <path
            d="M780 220 Q820 160 860 220 T940 220 T1020 220 T1100 220 T1180 220 T1260 220 T1340 220 T1420 220"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M780 260 Q820 220 860 260 T940 260 T1020 260 T1100 260 T1180 260 T1260 260 T1340 260 T1420 260"
            strokeWidth="1.4"
            opacity="0.3"
          />
          <path
            d="M780 180 Q820 140 860 180 T940 180 T1020 180 T1100 180 T1180 180 T1260 180 T1340 180 T1420 180"
            strokeWidth="1.4"
            opacity="0.3"
          />
        </g>
        <g stroke="#6A7280" opacity="0.15">
          <line x1="780" y1="60" x2="1420" y2="60" strokeDasharray="4 6" />
          <line x1="780" y1="360" x2="1420" y2="360" strokeDasharray="4 6" />
        </g>
        <g fill="#6A7280" opacity="0.4">
          {Array.from({ length: 18 }).map((_, i) => (
            <rect key={i} x={780 + i * 38} y="58" width="1" height="4" />
          ))}
        </g>
        <rect width="900" height="420" fill="url(#bg-srg-fade)" />
      </svg>
    </div>
  )
}

function BgPanel() {
  return (
    <div className="eb__bg eb__bg--panel">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <pattern id="bg-pnl-cells" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#E6EAF0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="420" fill="url(#bg-pnl-cells)" opacity="0.6" />
        <rect x="0" y="0" width="380" height="420" fill="#E8EEF7" opacity="0.7" />
        <rect x="378" y="0" width="2" height="420" fill="#3B7BD9" opacity="0.4" />
        <line x1="0" y1="0" x2="1440" y2="0" stroke="#3B7BD9" strokeWidth="3" />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNICAL FALLBACK SVG ILLUSTRATIONS
// ─────────────────────────────────────────────────────────────────────────────

interface SvgProps {
  scale: number
}

function ProductRelay({ scale = 1 }: SvgProps) {
  const s = scale
  return (
    <svg width={260 * s} height={260 * s} viewBox="0 0 260 260">
      <ellipse cx="130" cy="230" rx="80" ry="8" fill="#1A1F2B" opacity="0.08" />
      <rect x="60" y="180" width="140" height="40" rx="3" fill="#1F2937" />
      <rect x="60" y="180" width="140" height="6" fill="#374151" />
      <g fill="#C4A872">
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={i} x={75 + i * 30} y="220" width="6" height="14" rx="1" />
        ))}
      </g>
      <g fill="#9B7B4A" opacity="0.6">
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={i} x={75 + i * 30} y="220" width="6" height="2" />
        ))}
      </g>
      <rect x="70" y="60" width="120" height="120" rx="4" fill="#F0F4F8" stroke="#C8D2DE" strokeWidth="1.5" />
      <rect x="70" y="60" width="120" height="120" rx="4" fill="url(#relay-shine)" opacity="0.5" />
      <defs>
        <linearGradient id="relay-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="1" stopColor="#1A1F2B" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="86" y="80" width="40" height="80" rx="2" fill="#E0E7EE" stroke="#B5C0CC" strokeWidth="0.8" />
      <g stroke="#C4A872" strokeWidth="1.2" fill="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="88" y1={84 + i * 6.5} x2="124" y2={84 + i * 6.5} />
        ))}
      </g>
      <rect x="130" y="86" width="50" height="3" fill="#6B7280" />
      <rect x="130" y="120" width="50" height="3" fill="#6B7280" />
      <rect x="174" y="86" width="3" height="38" fill="#9CA3AF" />
      <g fill="#D5DCE5" stroke="#9CA3AF" strokeWidth="0.6">
        <circle cx="84" cy="68" r="3" />
        <circle cx="176" cy="68" r="3" />
      </g>
      <rect x="76" y="160" width="108" height="16" rx="1" fill="#1A1F2B" />
      <text
        x="130"
        y="172"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.08em"
      >
        OMRON LY2 · АС 220V
      </text>
      <circle cx="178" cy="100" r="4" fill="#FBBF24" opacity="0.9" />
      <circle cx="178" cy="100" r="2" fill="#FEF3C7" />
    </svg>
  )
}

function ProductBattery({ scale = 1 }: SvgProps) {
  const s = scale
  return (
    <svg width={300 * s} height={240 * s} viewBox="0 0 300 240">
      <ellipse cx="150" cy="220" rx="110" ry="9" fill="#1A1F2B" opacity="0.1" />
      <rect x="30" y="50" width="240" height="160" rx="6" fill="#1A1F2B" />
      <rect x="30" y="50" width="240" height="22" rx="6" fill="#0F172A" />
      <rect x="30" y="68" width="240" height="4" fill="#000" />
      <g>
        <rect x="58" y="36" width="42" height="20" rx="2" fill="#9CA3AF" />
        <rect x="62" y="40" width="34" height="14" rx="1" fill="#6B7280" />
        <circle cx="79" cy="47" r="5" fill="#D5DCE5" />
        <text x="79" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">
          +
        </text>
      </g>
      <g>
        <rect x="200" y="36" width="42" height="20" rx="2" fill="#9CA3AF" />
        <rect x="204" y="40" width="34" height="14" rx="1" fill="#6B7280" />
        <circle cx="221" cy="47" r="5" fill="#D5DCE5" />
        <text x="221" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">
          −
        </text>
      </g>
      <rect x="50" y="86" width="200" height="106" rx="2" fill="#FFFFFF" />
      <rect x="50" y="86" width="200" height="32" fill="#3B7BD9" />
      <text
        x="150"
        y="108"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Inter"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        TRINIX
      </text>
      <text x="150" y="142" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="22" fontWeight="800">
        12V 20Ah
      </text>
      <text
        x="150"
        y="160"
        textAnchor="middle"
        fill="#6A7280"
        fontFamily="Inter"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.16em"
      >
        LiFePO4 · LFP 44-00093
      </text>
      <line x1="62" y1="172" x2="238" y2="172" stroke="#E6EAF0" />
      <text
        x="150"
        y="184"
        textAnchor="middle"
        fill="#1A1F2B"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        SUPER CHARGE AGM SERIES
      </text>
      <rect x="30" y="200" width="240" height="10" fill="#0F172A" />
    </svg>
  )
}

function ProductJackStand({ scale = 1 }: SvgProps) {
  const s = scale
  return (
    <svg width={260 * s} height={300 * s} viewBox="0 0 260 300">
      <ellipse cx="130" cy="282" rx="110" ry="7" fill="#1A1F2B" opacity="0.12" />
      <g fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5">
        <path d="M40 278 L80 240 L100 250 L60 280 Z" />
        <path d="M220 278 L180 240 L160 250 L200 280 Z" />
        <path d="M115 282 L130 248 L145 282 Z" />
      </g>
      <rect x="105" y="80" width="50" height="170" fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5" />
      <g stroke="#1A1F2B" strokeWidth="1.4" fill="#1A1F2B">
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M125 ${100 + i * 18} L155 ${100 + i * 18} L150 ${108 + i * 18} L125 ${108 + i * 18} Z`}
            opacity="0.85"
          />
        ))}
      </g>
      <g fill="#1A1F2B" stroke="#1A1F2B" strokeWidth="1">
        <rect x="155" y="155" width="50" height="10" rx="1" />
        <circle cx="160" cy="160" r="5" fill="#FFC937" />
      </g>
      <g fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5">
        <path d="M80 78 L130 50 L180 78 L180 95 L130 70 L80 95 Z" />
      </g>
      <rect x="100" y="210" width="60" height="22" fill="#1A1F2B" />
      <text
        x="130"
        y="225"
        textAnchor="middle"
        fill="#FFC937"
        fontFamily="Inter"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.08em"
      >
        INTERTOOL
      </text>
      <text x="130" y="240" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="8" fontWeight="700">
        3 т · GT0401
      </text>
    </svg>
  )
}

function ProductATS({ scale = 1 }: SvgProps) {
  const s = scale
  return (
    <svg width={280 * s} height={300 * s} viewBox="0 0 280 300">
      <ellipse cx="140" cy="280" rx="110" ry="8" fill="#1A1F2B" opacity="0.1" />
      <rect x="20" y="240" width="240" height="14" rx="1" fill="#D5DCE5" stroke="#9CA3AF" strokeWidth="1" />
      <rect x="50" y="50" width="180" height="200" rx="2" fill="#FFFFFF" stroke="#C8D2DE" strokeWidth="1.4" />
      <line x1="110" y1="50" x2="110" y2="250" stroke="#C8D2DE" strokeWidth="1" />
      <line x1="170" y1="50" x2="170" y2="250" stroke="#C8D2DE" strokeWidth="1" />
      <rect x="50" y="50" width="180" height="20" fill="#1F2937" />
      <rect x="50" y="230" width="180" height="20" fill="#1F2937" />
      <g fill="#C4A872">
        <rect x="68" y="54" width="20" height="12" rx="1" />
        <rect x="128" y="54" width="20" height="12" rx="1" />
        <rect x="188" y="54" width="20" height="12" rx="1" />
        <rect x="68" y="234" width="20" height="12" rx="1" />
        <rect x="128" y="234" width="20" height="12" rx="1" />
        <rect x="188" y="234" width="20" height="12" rx="1" />
      </g>
      <rect x="62" y="84" width="156" height="40" rx="3" fill="#F5F7FA" stroke="#C8D2DE" />
      <rect x="62" y="84" width="78" height="40" rx="3" fill="#3B7BD9" />
      <text
        x="101"
        y="108"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Inter"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.06em"
      >
        MAIN
      </text>
      <text
        x="178"
        y="108"
        textAnchor="middle"
        fill="#6A7280"
        fontFamily="Inter"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.06em"
      >
        RES
      </text>
      <g>
        <circle cx="80" cy="148" r="5" fill="#22C55E" />
        <text x="92" y="152" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600">
          L1
        </text>
        <circle cx="80" cy="166" r="5" fill="#22C55E" />
        <text x="92" y="170" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600">
          L2
        </text>
        <circle cx="80" cy="184" r="5" fill="#D5DCE5" />
        <text x="92" y="188" fill="#6A7280" fontFamily="Inter" fontSize="9" fontWeight="600">
          FAULT
        </text>
      </g>
      <rect x="155" y="142" width="65" height="50" rx="2" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="0.8" />
      <text x="188" y="160" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="16" fontWeight="800">
        100A
      </text>
      <text
        x="188" y="178"
        textAnchor="middle"
        fill="#6A7280"
        fontFamily="Inter"
        fontSize="8"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        2 ПОЛЮСИ
      </text>
      <text
        x="140"
        y="218"
        textAnchor="middle"
        fill="#1A1F2B"
        fontFamily="Inter"
        fontSize="11"
        fontWeight="800"
        letterSpacing="0.1em"
      >
        Kraft · АВР
      </text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART IMAGE WRAPPER (FALLBACK TO SVG ILLUSTRATION ON ERROR)
// ─────────────────────────────────────────────────────────────────────────────

interface ProductPhotoProps {
  src: string | null
  alt: string
  fallback: 'relay' | 'battery' | 'jack' | 'ats'
  variant: 'desktop' | 'compact' | 'tablet' | 'mobile'
}

function ProductPhoto({ src, alt, fallback, variant }: ProductPhotoProps) {
  const [error, setError] = useState(false)
  const width = PSIZE[variant]

  if (error || !src) {
    if (fallback === 'relay') return <ProductRelay scale={width / 260} />
    if (fallback === 'battery') return <ProductBattery scale={width / 300} />
    if (fallback === 'jack') return <ProductJackStand scale={width / 260} />
    if (fallback === 'ats') return <ProductATS scale={width / 280} />
    return null
  }

  // Bounding boxes
  const heightMultiplier = fallback === 'battery' ? 0.85 : fallback === 'relay' ? 1.0 : 1.05
  const height = Math.round(width * heightMultiplier)

  const heightClass = fallback === 'battery' ? 'battery' : fallback === 'relay' ? 'relay' : 'other'
  const wrapperClass = `eb__photo-wrapper--${variant}-${heightClass}`

  return (
    <div className={cn("relative flex items-center justify-center select-none", wrapperClass)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={() => setError(true)}
        className="object-contain block transition-opacity duration-300 pointer-events-none mix-blend-multiply"
        sizes={`(max-width: 639px) 130px, (max-width: 1023px) 220px, (max-width: 1279px) 320px, 420px`}
        priority={variant === 'desktop'}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SLIDE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

interface SlideData {
  id: string
  translationKey: 'automation' | 'offerJack' | 'ats' | 'backup'
  slug: string
  secondaryPath: string
  imageSrc: string
  fallback: 'relay' | 'jack' | 'ats' | 'battery'
  bg: 'grid' | 'panel' | 'circuit' | 'surge'
  badgeClass?: string
}

const SLIDES: SlideData[] = [
  {
    id: 'automation',
    translationKey: 'automation',
    slug: 'p1554670317-rele-promezhutochnoe-ly2',
    secondaryPath: '/catalog',
    imageSrc: '/images/relay_ly2_mock.png',
    fallback: 'relay',
    bg: 'grid',
  },
  {
    id: 'offerJack',
    translationKey: 'offerJack',
    slug: 'p2952960074-podstavka-pod-mashinu',
    secondaryPath: '/catalog',
    imageSrc: 'https://images.prom.ua/7138921733_w640_h640_podstavka-pod-mashinu.jpg',
    fallback: 'jack',
    bg: 'panel',
    badgeClass: 'eb__badge--offer',
  },
  {
    id: 'ats',
    translationKey: 'ats',
    slug: 'p2393369424-avtomaticheskij-pereklyuchatel-avr',
    secondaryPath: '/catalog',
    imageSrc: 'https://images.prom.ua/6335425546_w640_h640_avtomatichnij-peremikach-avr.jpg',
    fallback: 'ats',
    bg: 'circuit',
    badgeClass: 'eb__badge--dark',
  },
  {
    id: 'backup',
    translationKey: 'backup',
    slug: 'p2852315599-akkumulyator-128v-12v20ah',
    secondaryPath: '/catalog',
    imageSrc: '/images/trinix_battery_mock.png',
    fallback: 'battery',
    bg: 'surge',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HERO CAROUSEL MASTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface HeroCarouselProps {
  locale: string
}

export default function HeroCarousel({ locale }: HeroCarouselProps) {
  const t = useTranslations('home.banners')
  const [active, setActive] = useState(0)
  const [variant, setVariant] = useState<'desktop' | 'compact' | 'tablet' | 'mobile'>('desktop')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null)
  const isHovered = useRef(false)

  // Determine responsive variant inside useEffect (safe from SSR hydration mismatches)
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 640) {
        setVariant('mobile')
      } else if (w < 1024) {
        setVariant('tablet')
      } else if (w < 1280) {
        setVariant('compact')
      } else {
        setVariant('desktop')
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Slide navigation
  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  // Autoplay hook with reduced motion check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return // Do not autoplay if reduced motion preferred

    const startTimer = () => {
      autoplayTimer.current = setInterval(() => {
        if (!isHovered.current) {
          nextSlide()
        }
      }, 6000)
    }

    startTimer()

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    }
  }, [nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return
      // Only process arrow keys if the carousel contains focused element or is hovered
      const isFocused = containerRef.current.contains(document.activeElement)
      const isMouseOver = containerRef.current.matches(':hover')
      if (isFocused || isMouseOver) {
        if (e.key === 'ArrowLeft') {
          prevSlide()
        } else if (e.key === 'ArrowRight') {
          nextSlide()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Swipe logic for touchscreens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches && e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    if (e.targetTouches && e.targetTouches[0]) {
      const currentTouch = e.targetTouches[0].clientX
      const diff = touchStart - currentTouch

      if (diff > 50) {
        // Swipe left -> Next
        nextSlide()
        setTouchStart(null)
      } else if (diff < -50) {
        // Swipe right -> Prev
        prevSlide()
        setTouchStart(null)
      }
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  const handleMouseEnter = () => {
    isHovered.current = true
  }

  const handleMouseLeave = () => {
    isHovered.current = false
  }

  return (
    <div
      ref={containerRef}
      className="carousel-eb h-[450px] max-h-[450px] sm:h-[480px] sm:max-h-[480px] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={t('ariaLabel')}
      role="region"
    >
      <div className="carousel-eb__track">
        {SLIDES.map((slide, index) => {
          const isActive = index === active
          const isMobile = variant === 'mobile'
          const key = slide.translationKey

          // Parse highlight texts
          const titleText = (
            <h1 className="eb__h1">
              {t(`${key}.title1`)}
              <span className="em">{t(`${key}.titleHighlight`)}</span>
              {t(`${key}.title2`)}
            </h1>
          )

          // Background component
          let bgElement = <BgGrid />
          if (slide.bg === 'circuit') bgElement = <BgCircuit />
          if (slide.bg === 'surge') bgElement = <BgSurge />
          if (slide.bg === 'panel') bgElement = <BgPanel />

          return (
            <div
              key={slide.id}
              className={cn(
                'carousel-eb__slide',
                isActive && 'carousel-eb__slide--active'
              )}
              aria-hidden={!isActive}
            >
              <div className={cn('eb', variant !== 'desktop' && `eb--${variant}`)}>
                {bgElement}
                <div className="eb__content">
                  <div className="eb__copy">
                    <span className={cn('eb__badge', slide.badgeClass)}>
                      <span className="dot" />
                      {t(`${key}.badge`)}
                    </span>
                    {titleText}
                    {!isMobile && <p className="eb__sub">{t(`${key}.subtitle`)}</p>}

                    <div className="eb__chips">
                      <span className="eb__chip eb__chip--num">
                        <strong>{t(`${key}.chip1`)}</strong>
                      </span>
                      <span className="eb__chip">
                        {t(`${key}.chip2`)}
                      </span>
                      {!isMobile && (
                        <span className="eb__chip">
                          {t(`${key}.chip3`)}
                        </span>
                      )}
                      {!isMobile && (
                        <span className="eb__chip">
                          {slide.fallback === 'relay' && (
                            <span className="ico mr-1.5 inline-flex align-middle">
                              <Cpu size={13} />
                            </span>
                          )}
                          {slide.fallback === 'jack' && (
                            <span className="ico mr-1.5 inline-flex align-middle">
                              <Car size={13} />
                            </span>
                          )}
                          {slide.fallback === 'ats' && (
                            <span className="ico mr-1.5 inline-flex align-middle">
                              <Shield size={13} />
                            </span>
                          )}
                          {slide.fallback === 'battery' && (
                            <span className="ico mr-1.5 inline-flex align-middle">
                              <Battery size={13} />
                            </span>
                          )}
                          {t(`${key}.chip4`)}
                        </span>
                      )}
                      <span className="eb__chip eb__chip--success">
                        <span className="ico mr-1.5 inline-flex align-middle">
                          <Check size={13} />
                        </span>
                        {t(`${key}.chip5`)}
                      </span>
                    </div>

                    <div className="eb__cta-row">
                      <Link
                        href={localizedPath(locale, `/product/${slide.slug}`) as never}
                        className="eb__btn hover:no-underline"
                      >
                        {t(`${key}.cta`)}
                        <ArrowRight size={16} className="ml-1 shrink-0" />
                      </Link>
                      {!isMobile && (
                        <Link
                          href={localizedPath(locale, slide.secondaryPath) as never}
                          className="eb__link hover:no-underline"
                        >
                          {t(`${key}.link`)}
                        </Link>
                      )}
                    </div>

                    {!isMobile && (
                      <div className="eb__trust">
                        <span className="ico mr-1 inline-flex align-middle">
                          <Check size={14} className="text-success" />
                        </span>
                        <span className="align-middle">{t(`${key}.trust`)}</span>
                      </div>
                    )}
                  </div>

                  <div className="eb__stage">
                    <div className="eb__product">
                      <ProductPhoto
                        src={slide.imageSrc}
                        alt={t(`${key}.imageAlt`)}
                        fallback={slide.fallback}
                        variant={variant}
                      />
                      {!isMobile && (
                        <>
                          <div
                            className={cn(
                              'eb__stat',
                              slide.id === 'offerJack' ? 'eb__stat--discount' : 'eb__stat--top'
                            )}
                          >
                            <span className="lbl">
                              {t(`${key}.stats.top.label`)}
                            </span>
                            <span className="val">
                              {t(`${key}.stats.top.val`)}
                              <em>{t(`${key}.stats.top.unit`)}</em>
                            </span>
                          </div>
                          <div className="eb__stat eb__stat--bottom">
                            <span className="lbl">
                              {t(`${key}.stats.bottom.label`)}
                            </span>
                            <span className="val">
                              {t(`${key}.stats.bottom.val`)}
                              <em>{t(`${key}.stats.bottom.unit`)}</em>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Slide Arrows (Desktop only) */}
      {variant !== 'mobile' && (
        <>
          <button
            className="eb__arrow eb__arrow--l"
            onClick={prevSlide}
            aria-label={t('prev')}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            className="eb__arrow eb__arrow--r"
            onClick={nextSlide}
            aria-label={t('next')}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="eb__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={cn('eb__dot', i === active && 'eb__dot--active')}
            onClick={() => setActive(i)}
            aria-label={`${t('slide')} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
