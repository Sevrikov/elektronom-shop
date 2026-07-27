'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { FileText, Ruler, Zap, X, Download, Maximize2, ExternalLink } from 'lucide-react'

interface TechnicalDocsViewerProps {
  productSku?: string
  productName: string
  categoryName?: string
  pdfUrl?: string
  dimensionsUrl?: string
  schematicsUrl?: string
}

export function TechnicalDocsViewer({
  productSku,
  productName,
  pdfUrl,
  dimensionsUrl,
  schematicsUrl,
}: TechnicalDocsViewerProps) {
  const locale = useLocale()
  const isRu = locale === 'ru'

  const [activeModal, setActiveModal] = useState<'pdf' | 'dimensions' | 'schematics' | null>(null)

  // Default fallback URLs if specific product assets aren't in DB yet
  const effectivePdf = pdfUrl || `https://www.acko.ua/upload/iblock/passport_va_2017.pdf`
  const effectiveDimensions = dimensionsUrl || `/images/tech/dimensions-va2017.svg`
  const effectiveSchematics = schematicsUrl || `/images/tech/schematics-va2017.svg`

  return (
    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
        {isRu ? 'Техническая документация и чертежи' : 'Технічна документація та креслення'}
      </span>

      <div className="grid grid-cols-3 gap-2">
        {/* Button 1: Dimensions */}
        <button
          type="button"
          onClick={() => setActiveModal('dimensions')}
          className="flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-surface-alt hover:bg-surface-white hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
        >
          <div className="size-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Ruler className="size-4 text-accent" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold text-text-primary group-hover:text-accent leading-tight">
            {isRu ? 'Габариты' : 'Габарити'}
          </span>
          <span className="text-[9.5px] text-text-muted">
            {isRu ? 'Чертеж' : 'Креслення'}
          </span>
        </button>

        {/* Button 2: Wiring Schematics */}
        <button
          type="button"
          onClick={() => setActiveModal('schematics')}
          className="flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-surface-alt hover:bg-surface-white hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
        >
          <div className="size-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Zap className="size-4 text-accent" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold text-text-primary group-hover:text-accent leading-tight">
            {isRu ? 'Эл. схемы' : 'Ел. схеми'}
          </span>
          <span className="text-[9.5px] text-text-muted">
            {isRu ? 'Подключение' : 'Підключення'}
          </span>
        </button>

        {/* Button 3: PDF Passport inline viewer */}
        <button
          type="button"
          onClick={() => setActiveModal('pdf')}
          className="flex flex-col items-center justify-center p-2 rounded-xl border border-accent/40 bg-accent-subtle/50 hover:bg-accent-subtle hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
        >
          <div className="size-7 rounded-lg bg-accent text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
            <FileText className="size-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-bold text-accent group-hover:text-accent-hover leading-tight">
            {isRu ? 'ПДФ Паспорт' : 'ПДФ Паспорт'}
          </span>
          <span className="text-[9.5px] text-text-muted">
            {isRu ? 'Открыть на сайте' : 'Відкрити на сайті'}
          </span>
        </button>
      </div>

      {/* Modal 1: Inline PDF Viewer (Opens inside the site without leaving!) */}
      {activeModal === 'pdf' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[85vh] bg-surface-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent text-white flex items-center justify-center shrink-0">
                  <FileText className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-text-primary leading-tight line-clamp-1">
                    {isRu ? 'Паспорт изделия & Инструкция' : 'Паспорт виробу & Інструкція'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={effectivePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-bold hover:bg-accent-hover transition-colors shadow-2xs"
                >
                  <Download className="size-3.5" />
                  <span>{isRu ? 'Скачать PDF' : 'Завантажити PDF'}</span>
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="size-8 rounded-lg flex items-center justify-center bg-surface-white hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="flex-1 w-full h-full bg-slate-900">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(effectivePdf)}&embedded=true`}
                className="w-full h-full border-none"
                title="PDF Passport Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Dimensions Diagram Viewer */}
      {activeModal === 'dimensions' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Ruler className="size-4" strokeWidth={2} />
                </div>
                <h3 className="text-[14px] font-bold text-text-primary">
                  {isRu ? 'Установочные и габаритные размеры' : 'Установчі та габаритні розміри'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="size-8 rounded-lg flex items-center justify-center bg-surface-alt hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Dimensions Drawing Component */}
            <div className="flex flex-col items-center justify-center p-4 bg-surface-alt rounded-xl border border-border">
              <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[350px]">
                {/* 3P/1P Circuit breaker body outline */}
                <rect x="70" y="80" width="100" height="150" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
                <rect x="170" y="80" width="100" height="150" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
                
                {/* DIN Rail latch back */}
                <rect x="270" y="100" width="45" height="110" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                <rect x="270" y="130" width="30" height="50" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                
                {/* Handles */}
                <rect x="100" y="135" width="40" height="30" rx="3" fill="#2563eb" />
                <rect x="200" y="135" width="40" height="30" rx="3" fill="#2563eb" />
                <line x1="120" y1="150" x2="220" y2="150" stroke="#1d4ed8" strokeWidth="4" />

                {/* Dimension Arrows and Text */}
                {/* Width 52.5 mm */}
                <line x1="70" y1="50" x2="270" y2="50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="70" y1="42" x2="70" y2="75" stroke="#ef4444" strokeWidth="1" />
                <line x1="270" y1="42" x2="270" y2="75" stroke="#ef4444" strokeWidth="1" />
                <text x="170" y="42" fontSize="13" fontWeight="800" fill="#ef4444" textAnchor="middle">
                  52.5 mm (3P) / 17.5 mm (1P)
                </text>

                {/* Height 79 mm */}
                <line x1="40" y1="80" x2="40" y2="230" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="32" y1="80" x2="65" y2="80" stroke="#ef4444" strokeWidth="1" />
                <line x1="32" y1="230" x2="65" y2="230" stroke="#ef4444" strokeWidth="1" />
                <text x="25" y="160" fontSize="13" fontWeight="800" fill="#ef4444" textAnchor="middle" transform="rotate(-90 25 160)">
                  79.0 mm
                </text>

                {/* Depth 77 mm */}
                <line x1="70" y1="255" x2="315" y2="255" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="70" y1="240" x2="70" y2="265" stroke="#ef4444" strokeWidth="1" />
                <line x1="315" y1="240" x2="315" y2="265" stroke="#ef4444" strokeWidth="1" />
                <text x="192" y="275" fontSize="13" fontWeight="800" fill="#ef4444" textAnchor="middle">
                  max 77.0 mm (глубина) / 67 mm (корпус)
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Electrical Wiring Schematics Viewer */}
      {activeModal === 'schematics' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Zap className="size-4" strokeWidth={2} />
                </div>
                <h3 className="text-[14px] font-bold text-text-primary">
                  {isRu ? 'Электрическая схема подключения' : 'Електрична схема підключення'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="size-8 rounded-lg flex items-center justify-center bg-surface-alt hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Electrical Schematics Drawing */}
            <div className="flex flex-col items-center justify-center p-6 bg-surface-alt rounded-xl border border-border">
              <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[300px]">
                {/* Input Terminals (Top) */}
                <circle cx="100" cy="30" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <circle cx="200" cy="30" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <circle cx="300" cy="30" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <text x="100" y="15" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">1 (L1)</text>
                <text x="200" y="15" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">3 (L2)</text>
                <text x="300" y="15" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">5 (L3)</text>

                {/* Thermal & Electromagnetic Release Symbols */}
                {/* Pole 1 */}
                <line x1="100" y1="38" x2="100" y2="80" stroke="#1e293b" strokeWidth="2" />
                <rect x="92" y="80" width="16" height="24" fill="none" stroke="#2563eb" strokeWidth="2" />
                <path d="M 90 115 L 110 115 L 105 130 Z" fill="#ef4444" />
                <line x1="100" y1="104" x2="100" y2="140" stroke="#1e293b" strokeWidth="2" />
                <line x1="100" y1="140" x2="115" y2="170" stroke="#2563eb" strokeWidth="2.5" />
                <line x1="100" y1="175" x2="100" y2="202" stroke="#1e293b" strokeWidth="2" />

                {/* Pole 2 */}
                <line x1="200" y1="38" x2="200" y2="80" stroke="#1e293b" strokeWidth="2" />
                <rect x="192" y="80" width="16" height="24" fill="none" stroke="#2563eb" strokeWidth="2" />
                <path d="M 190 115 L 210 115 L 205 130 Z" fill="#ef4444" />
                <line x1="200" y1="104" x2="200" y2="140" stroke="#1e293b" strokeWidth="2" />
                <line x1="200" y1="140" x2="215" y2="170" stroke="#2563eb" strokeWidth="2.5" />
                <line x1="200" y1="175" x2="200" y2="202" stroke="#1e293b" strokeWidth="2" />

                {/* Pole 3 */}
                <line x1="300" y1="38" x2="300" y2="80" stroke="#1e293b" strokeWidth="2" />
                <rect x="292" y="80" width="16" height="24" fill="none" stroke="#2563eb" strokeWidth="2" />
                <path d="M 290 115 L 310 115 L 305 130 Z" fill="#ef4444" />
                <line x1="300" y1="104" x2="300" y2="140" stroke="#1e293b" strokeWidth="2" />
                <line x1="300" y1="140" x2="315" y2="170" stroke="#2563eb" strokeWidth="2.5" />
                <line x1="300" y1="175" x2="300" y2="202" stroke="#1e293b" strokeWidth="2" />

                {/* Mechanical link bar */}
                <line x1="108" y1="155" x2="308" y2="155" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Output Terminals (Bottom) */}
                <circle cx="100" cy="210" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <circle cx="200" cy="210" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <circle cx="300" cy="210" r="8" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
                <text x="100" y="232" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">2 (T1)</text>
                <text x="200" y="232" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">4 (T2)</text>
                <text x="300" y="232" fontSize="11" fontWeight="800" fill="#1e293b" textAnchor="middle">6 (T3)</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
