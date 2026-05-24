/* global React */
const { useState: _useState } = React;
const useState = _useState;

// ---------- tiny Lucide-style icon helpers ----------
function I({ d, size = 16, color = 'currentColor', sw = 1.5, vb = 24, children }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
         stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0 }}>
      {d ? <path d={d} /> : children}
    </svg>
  );
}
const IconArrowRight = (p) => <I {...p}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></I>;
const IconChevronRight = (p) => <I {...p}><path d="M9 6l6 6-6 6"/></I>;
const IconChevronLeft = (p) => <I {...p}><path d="M15 6l-6 6 6 6"/></I>;
const IconCheck = (p) => <I {...p}><path d="M20 6L9 17l-5-5"/></I>;
const IconZap = (p) => <I {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></I>;
const IconShield = (p) => <I {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></I>;
const IconBattery = (p) => <I {...p}><rect x="2" y="8" width="18" height="8" rx="1.5"/><path d="M22 11v2"/><path d="M6 11v2"/><path d="M10 11v2"/></I>;
const IconCpu = (p) => <I {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></I>;
const IconBox = (p) => <I {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></I>;
const IconTruck = (p) => <I {...p}><path d="M14 17V5H2v12h2"/><path d="M14 8h4l3 3v6h-3"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></I>;

// ============================================================
// Background SVGs
// ============================================================
function BgGrid() {
  // Soft technical grid with one accent vertical & one DIN-rail strip
  return (
    <div className="eb__bg eb__bg--grid">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <pattern id="bg-grid-cells" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#E6EAF0" strokeWidth="1"/>
          </pattern>
          <linearGradient id="bg-grid-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="bg-grid-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8EEF7" stopOpacity="0"/>
            <stop offset="1" stopColor="#E8EEF7" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <rect width="1440" height="420" fill="url(#bg-grid-cells)"/>
        <rect width="1440" height="420" fill="url(#bg-grid-fade)"/>
        <rect x="720" y="0" width="720" height="420" fill="url(#bg-grid-right)" opacity="0.7"/>
        {/* Accent vertical bar */}
        <rect x="900" y="-20" width="2" height="460" fill="#3B7BD9" opacity="0.18"/>
        <rect x="900" y="80" width="2" height="80" fill="#3B7BD9"/>
        {/* DIN-rail hint */}
        <g opacity="0.4">
          <line x1="780" y1="380" x2="1380" y2="380" stroke="#6A7280" strokeWidth="1"/>
          <line x1="780" y1="384" x2="1380" y2="384" stroke="#6A7280" strokeWidth="1"/>
          {Array.from({length: 30}).map((_, i) => (
            <circle key={i} cx={790 + i * 20} cy={382} r="0.8" fill="#6A7280"/>
          ))}
        </g>
        {/* corner cross-hairs */}
        <g stroke="#3B7BD9" strokeWidth="1" opacity="0.5">
          <line x1="1380" y1="20" x2="1400" y2="20"/>
          <line x1="1390" y1="10" x2="1390" y2="30"/>
        </g>
      </svg>
    </div>
  );
}

function BgCircuit() {
  return (
    <div className="eb__bg eb__bg--circuit">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="bg-cir-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* circuit traces on right side */}
        <g stroke="#3B7BD9" strokeWidth="1.2" fill="none" opacity="0.35">
          <path d="M820 60 L820 140 L900 140 L900 220 L1020 220"/>
          <path d="M1020 220 L1020 300 L1180 300"/>
          <path d="M880 60 L880 100 L960 100 L960 180"/>
          <path d="M1100 60 L1100 160 L1240 160 L1240 280"/>
          <path d="M1280 80 L1380 80"/>
          <path d="M1280 360 L1380 360"/>
        </g>
        <g fill="#3B7BD9" opacity="0.6">
          <circle cx="820" cy="60" r="3"/>
          <circle cx="1020" cy="220" r="3"/>
          <circle cx="960" cy="180" r="3"/>
          <circle cx="1240" cy="280" r="3"/>
          <circle cx="1180" cy="300" r="3"/>
          <circle cx="1380" cy="80" r="3"/>
          <circle cx="1380" cy="360" r="3"/>
        </g>
        {/* faint dot-grid */}
        <g fill="#3B7BD9" opacity="0.18">
          {Array.from({length: 14}).flatMap((_, r) =>
            Array.from({length: 14}).map((_, c) => (
              <circle key={`${r}-${c}`} cx={780 + c * 48} cy={20 + r * 28} r="1"/>
            ))
          )}
        </g>
        {/* left fade */}
        <rect width="780" height="420" fill="url(#bg-cir-fade)"/>
      </svg>
    </div>
  );
}

function BgSurge() {
  return (
    <div className="eb__bg eb__bg--surge">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="bg-srg-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* sine waves */}
        <g stroke="#3B7BD9" fill="none">
          <path d="M780 220 Q820 160 860 220 T940 220 T1020 220 T1100 220 T1180 220 T1260 220 T1340 220 T1420 220"
                strokeWidth="2" opacity="0.55"/>
          <path d="M780 260 Q820 220 860 260 T940 260 T1020 260 T1100 260 T1180 260 T1260 260 T1340 260 T1420 260"
                strokeWidth="1.4" opacity="0.3"/>
          <path d="M780 180 Q820 140 860 180 T940 180 T1020 180 T1100 180 T1180 180 T1260 180 T1340 180 T1420 180"
                strokeWidth="1.4" opacity="0.3"/>
        </g>
        {/* horizontal rail marks */}
        <g stroke="#6A7280" opacity="0.15">
          <line x1="780" y1="60" x2="1420" y2="60" strokeDasharray="4 6"/>
          <line x1="780" y1="360" x2="1420" y2="360" strokeDasharray="4 6"/>
        </g>
        {/* tick marks like an oscilloscope */}
        <g fill="#6A7280" opacity="0.4">
          {Array.from({length: 18}).map((_, i) => (
            <rect key={i} x={780 + i * 38} y="58" width="1" height="4"/>
          ))}
        </g>
        <rect width="900" height="420" fill="url(#bg-srg-fade)"/>
      </svg>
    </div>
  );
}

function BgPanel() {
  return (
    <div className="eb__bg eb__bg--panel">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <pattern id="bg-pnl-cells" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#E6EAF0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="1440" height="420" fill="url(#bg-pnl-cells)" opacity="0.6"/>
        {/* accent corner block */}
        <rect x="0" y="0" width="380" height="420" fill="#E8EEF7" opacity="0.7"/>
        <rect x="378" y="0" width="2" height="420" fill="#3B7BD9" opacity="0.4"/>
        {/* category tag rail at top */}
        <line x1="0" y1="0" x2="1440" y2="0" stroke="#3B7BD9" strokeWidth="3"/>
      </svg>
    </div>
  );
}

// ============================================================
// Product SVG illustrations (placeholders signalling real photos)
// ============================================================
function ProductRelay({ scale = 1 }) {
  // LY2 small omron-style cube relay with clear top + 8-pin base
  const s = scale;
  return (
    <svg width={260 * s} height={260 * s} viewBox="0 0 260 260">
      {/* soft shadow */}
      <ellipse cx="130" cy="230" rx="80" ry="8" fill="#1A1F2B" opacity="0.08"/>
      {/* base socket */}
      <rect x="60" y="180" width="140" height="40" rx="3" fill="#1F2937"/>
      <rect x="60" y="180" width="140" height="6" fill="#374151"/>
      {/* pins */}
      <g fill="#C4A872">
        {Array.from({length: 4}).map((_, i) => (
          <rect key={i} x={75 + i * 30} y="220" width="6" height="14" rx="1"/>
        ))}
      </g>
      <g fill="#9B7B4A" opacity="0.6">
        {Array.from({length: 4}).map((_, i) => (
          <rect key={i} x={75 + i * 30} y="220" width="6" height="2"/>
        ))}
      </g>
      {/* clear plastic body */}
      <rect x="70" y="60" width="120" height="120" rx="4" fill="#F0F4F8" stroke="#C8D2DE" strokeWidth="1.5"/>
      <rect x="70" y="60" width="120" height="120" rx="4" fill="url(#relay-shine)" opacity="0.5"/>
      <defs>
        <linearGradient id="relay-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9"/>
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.1"/>
          <stop offset="1" stopColor="#1A1F2B" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      {/* internal coil */}
      <rect x="86" y="80" width="40" height="80" rx="2" fill="#E0E7EE" stroke="#B5C0CC" strokeWidth="0.8"/>
      <g stroke="#C4A872" strokeWidth="1.2" fill="none">
        {Array.from({length: 12}).map((_, i) => (
          <line key={i} x1="88" y1={84 + i * 6.5} x2="124" y2={84 + i * 6.5}/>
        ))}
      </g>
      {/* armature lever */}
      <rect x="130" y="86" width="50" height="3" fill="#6B7280"/>
      <rect x="130" y="120" width="50" height="3" fill="#6B7280"/>
      <rect x="174" y="86" width="3" height="38" fill="#9CA3AF"/>
      {/* terminal screws on top */}
      <g fill="#D5DCE5" stroke="#9CA3AF" strokeWidth="0.6">
        <circle cx="84" cy="68" r="3"/>
        <circle cx="176" cy="68" r="3"/>
      </g>
      {/* LY2 label band */}
      <rect x="76" y="160" width="108" height="16" rx="1" fill="#1A1F2B"/>
      <text x="130" y="172" textAnchor="middle" fill="#fff" fontFamily="Inter Tight, sans-serif"
            fontSize="9" fontWeight="700" letterSpacing="0.08em">OMRON LY2 · АС 220V</text>
      {/* small status LED */}
      <circle cx="178" cy="100" r="4" fill="#FBBF24" opacity="0.9"/>
      <circle cx="178" cy="100" r="2" fill="#FEF3C7"/>
    </svg>
  );
}

function ProductRCCB({ scale = 1 }) {
  // UTrust 2-module RCCB on DIN rail
  const s = scale;
  return (
    <svg width={260 * s} height={300 * s} viewBox="0 0 260 300">
      <ellipse cx="130" cy="278" rx="100" ry="8" fill="#1A1F2B" opacity="0.08"/>
      {/* DIN rail */}
      <rect x="20" y="240" width="220" height="14" rx="1" fill="#D5DCE5" stroke="#9CA3AF" strokeWidth="1"/>
      <rect x="20" y="244" width="220" height="2" fill="#9CA3AF" opacity="0.4"/>
      {/* body two modules side by side */}
      <g>
        {/* module 1 */}
        <rect x="60" y="50" width="60" height="200" rx="2" fill="#FFFFFF" stroke="#C8D2DE" strokeWidth="1.4"/>
        {/* module 2 */}
        <rect x="120" y="50" width="60" height="200" rx="2" fill="#FFFFFF" stroke="#C8D2DE" strokeWidth="1.4"/>
        <line x1="120" y1="50" x2="120" y2="250" stroke="#C8D2DE" strokeWidth="1"/>
      </g>
      {/* top terminal block */}
      <rect x="60" y="50" width="120" height="22" fill="#1F2937"/>
      <g fill="#C4A872">
        <rect x="78" y="55" width="20" height="12" rx="1"/>
        <rect x="138" y="55" width="20" height="12" rx="1"/>
      </g>
      {/* bottom terminal block */}
      <rect x="60" y="228" width="120" height="14" fill="#1F2937"/>
      <g fill="#C4A872">
        <rect x="78" y="230" width="20" height="10" rx="1"/>
        <rect x="138" y="230" width="20" height="10" rx="1"/>
      </g>
      {/* status window */}
      <rect x="76" y="86" width="36" height="12" rx="1" fill="#FEE2C2"/>
      <rect x="76" y="86" width="14" height="12" rx="1" fill="#22C55E"/>
      <rect x="76" y="86" width="36" height="12" rx="1" fill="none" stroke="#9CA3AF" strokeWidth="0.6"/>
      {/* toggle handle */}
      <rect x="78" y="108" width="84" height="60" rx="2" fill="#F5F7FA" stroke="#C8D2DE" strokeWidth="1"/>
      <rect x="86" y="118" width="68" height="40" rx="2" fill="#1F2937"/>
      <rect x="100" y="128" width="40" height="20" rx="1" fill="#EF4444"/>
      <text x="120" y="142" textAnchor="middle" fill="#fff" fontFamily="Inter Tight" fontSize="11" fontWeight="700">I</text>
      {/* test button */}
      <circle cx="153" cy="190" r="9" fill="#1F2937"/>
      <circle cx="153" cy="190" r="5" fill="#3B7BD9"/>
      <text x="106" y="194" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="7" fontWeight="600">T</text>
      {/* brand */}
      <text x="120" y="218" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="9" fontWeight="700" letterSpacing="0.1em">UTrust</text>
      {/* ratings strip */}
      <rect x="68" y="76" width="104" height="8" fill="#F5F7FA" stroke="#E6EAF0" strokeWidth="0.6"/>
      <text x="120" y="83" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="6" fontWeight="600" letterSpacing="0.08em">40A · 30mA · TYPE A</text>
    </svg>
  );
}

function ProductBattery({ scale = 1 }) {
  // Trinix 12V20Ah battery brick
  const s = scale;
  return (
    <svg width={300 * s} height={240 * s} viewBox="0 0 300 240">
      <ellipse cx="150" cy="220" rx="110" ry="9" fill="#1A1F2B" opacity="0.1"/>
      {/* battery body */}
      <rect x="30" y="50" width="240" height="160" rx="6" fill="#1A1F2B"/>
      <rect x="30" y="50" width="240" height="22" rx="6" fill="#0F172A"/>
      <rect x="30" y="68" width="240" height="4" fill="#000"/>
      {/* terminals */}
      <g>
        <rect x="58" y="36" width="42" height="20" rx="2" fill="#9CA3AF"/>
        <rect x="62" y="40" width="34" height="14" rx="1" fill="#6B7280"/>
        <circle cx="79" cy="47" r="5" fill="#D5DCE5"/>
        <text x="79" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">+</text>
      </g>
      <g>
        <rect x="200" y="36" width="42" height="20" rx="2" fill="#9CA3AF"/>
        <rect x="204" y="40" width="34" height="14" rx="1" fill="#6B7280"/>
        <circle cx="221" cy="47" r="5" fill="#D5DCE5"/>
        <text x="221" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">−</text>
      </g>
      {/* brand label */}
      <rect x="50" y="86" width="200" height="106" rx="2" fill="#FFFFFF"/>
      <rect x="50" y="86" width="200" height="32" fill="#3B7BD9"/>
      <text x="150" y="108" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter Tight" fontSize="22" fontWeight="800" letterSpacing="0.04em">TRINIX</text>
      <text x="150" y="142" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="22" fontWeight="800">12V 20Ah</text>
      <text x="150" y="160" textAnchor="middle" fill="#6A7280" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.16em">LiFePO4 · LFP 44-00093</text>
      <line x1="62" y1="172" x2="238" y2="172" stroke="#E6EAF0"/>
      <text x="150" y="184" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600" letterSpacing="0.08em">SUPER CHARGE AGM SERIES</text>
      {/* bottom rim */}
      <rect x="30" y="200" width="240" height="10" fill="#0F172A"/>
    </svg>
  );
}

function ProductTrio({ scale = 1 }) {
  const s = scale;
  return (
    <svg width={460 * s} height={260 * s} viewBox="0 0 460 260">
      <g transform="translate(0, 30) scale(0.55)">
        <ProductRelay scale={1}/>
      </g>
      <g transform="translate(160, 0) scale(0.5)">
        <ProductRCCB scale={1}/>
      </g>
      <g transform="translate(290, 60) scale(0.5)">
        <ProductBattery scale={1}/>
      </g>
    </svg>
  );
}

// ============================================================
// More product SVGs (top performers from analytics — placeholders)
// ============================================================
function ProductJackStand({ scale = 1 }) {
  // INTERTOOL GT0401 · 3-ton jack stand
  return (
    <svg width={260 * scale} height={300 * scale} viewBox="0 0 260 300">
      <ellipse cx="130" cy="282" rx="110" ry="7" fill="#1A1F2B" opacity="0.12"/>
      {/* base feet */}
      <g fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5">
        <path d="M40 278 L80 240 L100 250 L60 280 Z"/>
        <path d="M220 278 L180 240 L160 250 L200 280 Z"/>
        <path d="M115 282 L130 248 L145 282 Z"/>
      </g>
      {/* main column */}
      <rect x="105" y="80" width="50" height="170" fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5"/>
      {/* ratchet teeth */}
      <g stroke="#1A1F2B" strokeWidth="1.4" fill="#1A1F2B">
        {Array.from({length: 7}).map((_, i) => (
          <path key={i} d={`M125 ${100 + i * 18} L155 ${100 + i * 18} L150 ${108 + i * 18} L125 ${108 + i * 18} Z`} opacity="0.85"/>
        ))}
      </g>
      {/* ratchet lever */}
      <g fill="#1A1F2B" stroke="#1A1F2B" strokeWidth="1">
        <rect x="155" y="155" width="50" height="10" rx="1"/>
        <circle cx="160" cy="160" r="5" fill="#FFC937"/>
      </g>
      {/* top saddle V */}
      <g fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.5">
        <path d="M80 78 L130 50 L180 78 L180 95 L130 70 L80 95 Z"/>
      </g>
      {/* INTERTOOL band */}
      <rect x="100" y="210" width="60" height="22" fill="#1A1F2B"/>
      <text x="130" y="225" textAnchor="middle" fill="#FFC937" fontFamily="Inter Tight" fontSize="9" fontWeight="800" letterSpacing="0.08em">INTERTOOL</text>
      <text x="130" y="240" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="8" fontWeight="700">3 т · GT0401</text>
    </svg>
  );
}

function ProductATS({ scale = 1 }) {
  // Kraft ATS — 2-pole automatic transfer switch on DIN rail
  return (
    <svg width={280 * scale} height={300 * scale} viewBox="0 0 280 300">
      <ellipse cx="140" cy="280" rx="110" ry="8" fill="#1A1F2B" opacity="0.1"/>
      {/* DIN rail */}
      <rect x="20" y="240" width="240" height="14" rx="1" fill="#D5DCE5" stroke="#9CA3AF" strokeWidth="1"/>
      {/* body */}
      <rect x="50" y="50" width="180" height="200" rx="2" fill="#FFFFFF" stroke="#C8D2DE" strokeWidth="1.4"/>
      <line x1="110" y1="50" x2="110" y2="250" stroke="#C8D2DE" strokeWidth="1"/>
      <line x1="170" y1="50" x2="170" y2="250" stroke="#C8D2DE" strokeWidth="1"/>
      {/* terminals top/bottom */}
      <rect x="50" y="50" width="180" height="20" fill="#1F2937"/>
      <rect x="50" y="230" width="180" height="20" fill="#1F2937"/>
      <g fill="#C4A872">
        <rect x="68" y="54" width="20" height="12" rx="1"/>
        <rect x="128" y="54" width="20" height="12" rx="1"/>
        <rect x="188" y="54" width="20" height="12" rx="1"/>
        <rect x="68" y="234" width="20" height="12" rx="1"/>
        <rect x="128" y="234" width="20" height="12" rx="1"/>
        <rect x="188" y="234" width="20" height="12" rx="1"/>
      </g>
      {/* MAIN/RES toggle area */}
      <rect x="62" y="84" width="156" height="40" rx="3" fill="#F5F7FA" stroke="#C8D2DE"/>
      <rect x="62" y="84" width="78" height="40" rx="3" fill="#3B7BD9"/>
      <text x="101" y="108" textAnchor="middle" fill="#fff" fontFamily="Inter Tight" fontSize="11" fontWeight="700" letterSpacing="0.06em">MAIN</text>
      <text x="178" y="108" textAnchor="middle" fill="#6A7280" fontFamily="Inter Tight" fontSize="11" fontWeight="700" letterSpacing="0.06em">RES</text>
      {/* status LEDs */}
      <g>
        <circle cx="80" cy="148" r="5" fill="#22C55E"/>
        <text x="92" y="152" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600">L1</text>
        <circle cx="80" cy="166" r="5" fill="#22C55E"/>
        <text x="92" y="170" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600">L2</text>
        <circle cx="80" cy="184" r="5" fill="#D5DCE5"/>
        <text x="92" y="188" fill="#6A7280" fontFamily="Inter" fontSize="9" fontWeight="600">FAULT</text>
      </g>
      {/* 100A spec band */}
      <rect x="155" y="142" width="65" height="50" rx="2" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="0.8"/>
      <text x="188" y="160" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="16" fontWeight="800">100A</text>
      <text x="188" y="178" textAnchor="middle" fill="#6A7280" fontFamily="Inter" fontSize="8" fontWeight="600" letterSpacing="0.08em">2 ПОЛЮСИ</text>
      {/* brand */}
      <text x="140" y="218" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="11" fontWeight="800" letterSpacing="0.1em">Kraft · АВР</text>
    </svg>
  );
}

function ProductRivetGun({ scale = 1 }) {
  // INTERTOOL Storm RT-0020 threaded rivet gun (~scissor body)
  return (
    <svg width={320 * scale} height={220 * scale} viewBox="0 0 320 220">
      <ellipse cx="160" cy="200" rx="120" ry="6" fill="#1A1F2B" opacity="0.1"/>
      {/* head */}
      <g>
        <rect x="20" y="80" width="80" height="34" rx="3" fill="#1A1F2B"/>
        <rect x="100" y="92" width="40" height="10" fill="#1A1F2B"/>
        <circle cx="36" cy="97" r="6" fill="#FFC937"/>
        <rect x="46" y="92" width="18" height="10" fill="#9CA3AF"/>
      </g>
      {/* mandrel sticking out */}
      <rect x="0" y="95" width="22" height="4" fill="#9CA3AF"/>
      {/* body / hinge */}
      <g fill="#FFC937" stroke="#1A1F2B" strokeWidth="1.4">
        <path d="M140 75 L260 60 L290 100 L160 130 Z"/>
        <circle cx="160" cy="100" r="6" fill="#1A1F2B"/>
      </g>
      {/* upper handle */}
      <g fill="#1A1F2B">
        <rect x="180" y="40" width="100" height="14" rx="4" transform="rotate(-12 230 47)"/>
      </g>
      {/* lower handle */}
      <g fill="#1A1F2B">
        <rect x="160" y="130" width="120" height="18" rx="4" transform="rotate(8 220 139)"/>
      </g>
      {/* grip patterns */}
      <g stroke="#FFC937" strokeWidth="1" opacity="0.6">
        {Array.from({length: 6}).map((_, i) => (
          <line key={i} x1={200 + i * 14} y1="36" x2={196 + i * 14} y2="52"/>
        ))}
      </g>
      {/* brand */}
      <text x="200" y="100" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="11" fontWeight="800" letterSpacing="0.06em">INTERTOOL</text>
      <text x="200" y="116" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="700">STORM RT-0020</text>
    </svg>
  );
}

function ProductBatteryAGM({ scale = 1 }) {
  // Trinix AGM 12V20Ah — variant of battery with AGM label
  return (
    <svg width={300 * scale} height={240 * scale} viewBox="0 0 300 240">
      <ellipse cx="150" cy="220" rx="110" ry="9" fill="#1A1F2B" opacity="0.1"/>
      <rect x="30" y="50" width="240" height="160" rx="6" fill="#0F172A"/>
      <rect x="30" y="50" width="240" height="22" rx="6" fill="#1A1F2B"/>
      <g>
        <rect x="58" y="36" width="42" height="20" rx="2" fill="#9CA3AF"/>
        <circle cx="79" cy="47" r="5" fill="#D5DCE5"/>
        <text x="79" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">+</text>
      </g>
      <g>
        <rect x="200" y="36" width="42" height="20" rx="2" fill="#9CA3AF"/>
        <circle cx="221" cy="47" r="5" fill="#D5DCE5"/>
        <text x="221" y="34" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="11" fontWeight="700">−</text>
      </g>
      <rect x="50" y="86" width="200" height="106" rx="2" fill="#FFFFFF"/>
      <rect x="50" y="86" width="200" height="32" fill="#1A1F2B"/>
      <text x="150" y="108" textAnchor="middle" fill="#FFC937" fontFamily="Inter Tight" fontSize="22" fontWeight="800" letterSpacing="0.04em">TRINIX</text>
      <text x="150" y="142" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter Tight" fontSize="22" fontWeight="800">12V 20Ah</text>
      <text x="150" y="160" textAnchor="middle" fill="#6A7280" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.16em">AGM · SUPER CHARGE</text>
      <line x1="62" y1="172" x2="238" y2="172" stroke="#E6EAF0"/>
      <text x="150" y="184" textAnchor="middle" fill="#1A1F2B" fontFamily="Inter" fontSize="9" fontWeight="600" letterSpacing="0.08em">VRLA · LEAD-ACID · 44-00049</text>
      <rect x="30" y="200" width="240" height="10" fill="#000"/>
    </svg>
  );
}

// extra icons
const IconFlame = (p) => <I {...p}><path d="M12 2c0 4-4 5-4 9a4 4 0 0 0 8 0c0-2-2-3-2-5l4 4a6 6 0 1 1-12 0c0-5 6-5 6-8z"/></I>;
const IconStar = (p) => <I {...p}><path d="M12 2l3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z"/></I>;
const IconCar = (p) => <I {...p}><path d="M5 11l2-5h10l2 5"/><rect x="3" y="11" width="18" height="6" rx="1"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></I>;

// ============================================================
// Real product photo — drop-in <img>, served from prom.ua CDN
// Falls back to SVG mockup on error.
// ============================================================
function ProductPhoto({ src, alt, fallback, width = 260, height = 260, style = {} }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    if (fallback === 'relay')    return <ProductRelay scale={width / 260}/>;
    if (fallback === 'rccb')     return <ProductRCCB scale={width / 260}/>;
    if (fallback === 'battery')  return <ProductBattery scale={width / 300}/>;
    if (fallback === 'agm')      return <ProductBatteryAGM scale={width / 300}/>;
    if (fallback === 'jack')     return <ProductJackStand scale={width / 260}/>;
    if (fallback === 'ats')      return <ProductATS scale={width / 280}/>;
    if (fallback === 'rivet')    return <ProductRivetGun scale={width / 320}/>;
    if (fallback === 'trio')     return <ProductTrio scale={width / 460}/>;
    return null;
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        maxWidth: width,
        maxHeight: height,
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
        mixBlendMode: 'multiply',
        ...style,
      }}
    />
  );
}

window.UI = {
  IconArrowRight, IconChevronRight, IconChevronLeft, IconCheck,
  IconZap, IconShield, IconBattery, IconCpu, IconBox, IconTruck,
  IconFlame, IconStar, IconCar,
  BgGrid, BgCircuit, BgSurge, BgPanel,
  ProductRelay, ProductRCCB, ProductBattery, ProductBatteryAGM,
  ProductJackStand, ProductATS, ProductRivetGun,
  ProductTrio, ProductPhoto,
};
