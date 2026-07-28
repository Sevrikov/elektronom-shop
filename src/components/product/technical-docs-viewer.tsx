'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { FileText, Ruler, Zap, X, Download, ExternalLink, ZoomIn, ZoomOut, RotateCw, Hand, RefreshCw, AlertCircle, Eye } from 'lucide-react'

interface TechnicalDocsViewerProps {
  productSku?: string | null
  productName: string
  pdfUrl?: string | null
  catalogPdfUrl?: string | null
  dimensionsUrl?: string | null
  schematicsUrl?: string | null
}

export function TechnicalDocsViewer({
  productSku,
  productName,
  pdfUrl,
  catalogPdfUrl,
  dimensionsUrl,
  schematicsUrl,
}: TechnicalDocsViewerProps) {
  const locale = useLocale()
  const isRu = locale === 'ru'

  const [activeModal, setActiveModal] = useState<'pdf' | 'catalogPdf' | 'dimensions' | 'schematics' | null>(null)
  
  // PDF Mode: 'native' (loads Chrome/Edge PDF viewer with Hand Tool) vs 'google' (Google Docs Embed fallback)
  const [pdfMode, setPdfMode] = useState<'native' | 'google'>('native')

  // Image Viewer Interactive State (Zoom / Rotation / Error / Pan)
  const [zoomScale, setZoomScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imgError, setImgError] = useState(false)
  
  // Drag Panning State
  const [panPos, setPanPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleOpenModal = (type: 'pdf' | 'catalogPdf' | 'dimensions' | 'schematics') => {
    setZoomScale(1)
    setRotation(0)
    setPanPos({ x: 0, y: 0 })
    setImgError(false)
    setActiveModal(type)
  }

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.4, 3.5))
  const handleZoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(prev - 0.4, 0.5)
      if (next <= 1) setPanPos({ x: 0, y: 0 })
      return next
    })
  }
  const handleResetZoom = () => {
    setZoomScale(1)
    setRotation(0)
    setPanPos({ x: 0, y: 0 })
  }
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  // Dragging mouse & touch handlers for image drawings
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPanPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return
    const touch = e.touches[0]!
    setIsDragging(true)
    setDragStart({ x: touch.clientX - panPos.x, y: touch.clientY - panPos.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]!
    setPanPos({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y })
  }

  const handleTouchEnd = () => setIsDragging(false)

  // Use ONLY provided URLs strictly from database/manufacturer
  const effectivePdf = pdfUrl || null
  const effectiveCatalogPdf = catalogPdfUrl || null
  const effectiveDimensions = dimensionsUrl || null
  const effectiveSchematics = schematicsUrl || null

  const hasAnyDoc = Boolean(effectivePdf || effectiveCatalogPdf || effectiveDimensions || effectiveSchematics)

  if (!hasAnyDoc) return null

  return (
    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
        {isRu ? 'Техническая документация и чертежи' : 'Технічна документація та креслення'}
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Button 1: Dimensions (if available) */}
        {effectiveDimensions && (
          <button
            type="button"
            onClick={() => handleOpenModal('dimensions')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-surface-alt hover:bg-surface-white hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Ruler className="size-4 text-accent" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-bold text-text-primary group-hover:text-accent leading-tight">
              {isRu ? 'Габариты' : 'Габарити'}
            </span>
            <span className="text-[9.5px] text-text-muted">
              {isRu ? 'Чертеж завода' : 'Креслення заводу'}
            </span>
          </button>
        )}

        {/* Button 2: Wiring Schematics (if available) */}
        {effectiveSchematics && (
          <button
            type="button"
            onClick={() => handleOpenModal('schematics')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-surface-alt hover:bg-surface-white hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Zap className="size-4 text-accent" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-bold text-text-primary group-hover:text-accent leading-tight">
              {isRu ? 'Эл. схемы' : 'Ел. схеми'}
            </span>
            <span className="text-[9.5px] text-text-muted">
              {isRu ? 'Схема завода' : 'Схема заводу'}
            </span>
          </button>
        )}

        {/* Button 3: PDF Passport (if available) */}
        {effectivePdf && (
          <button
            type="button"
            onClick={() => handleOpenModal('pdf')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-accent/40 bg-accent-subtle/50 hover:bg-accent-subtle hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-accent text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
              <FileText className="size-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-bold text-accent group-hover:text-accent-hover leading-tight">
              {isRu ? 'ПДФ Паспорт' : 'ПДФ Паспорт'}
            </span>
            <span className="text-[9.5px] text-text-muted">
              {isRu ? 'Просмотр на сайте' : 'Перегляд на сайті'}
            </span>
          </button>
        )}

        {/* Button 4: Second PDF / Catalog Page (if available) */}
        {effectiveCatalogPdf && (
          <button
            type="button"
            onClick={() => handleOpenModal('catalogPdf')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-border bg-surface-alt hover:bg-surface-white hover:border-accent hover:shadow-2xs transition-all text-center group cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <FileText className="size-4 text-accent" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-bold text-text-primary group-hover:text-accent leading-tight">
              {isRu ? 'Каталог (PDF)' : 'Каталог (PDF)'}
            </span>
            <span className="text-[9.5px] text-text-muted">
              {isRu ? 'Страница каталога' : 'Сторінка каталогу'}
            </span>
          </button>
        )}
      </div>

      {/* Modal 1: PDF Passport Viewer (Supports Native Chrome/Edge Hand Tool & Google Embed) */}
      {activeModal === 'pdf' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[90vh] bg-surface-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with explicit mode toggle & download buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent text-white flex items-center justify-center shrink-0">
                  <FileText className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-text-primary leading-tight line-clamp-1">
                    {isRu ? 'Официальный паспорт изделия АСКО-УКРЕМ' : 'Офіційний паспорт виробу АСКО-УКРЕМ'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              {/* PDF Toolbar Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Viewer mode toggle: Native PDF (with built-in Hand tool) vs Google Docs */}
                <button
                  type="button"
                  onClick={() => setPdfMode(prev => prev === 'native' ? 'google' : 'native')}
                  title={pdfMode === 'native' ? (isRu ? 'Переключить на Google Viewer' : 'Переключити на Google Viewer') : (isRu ? 'Включить Нативный просмотрщик (Рука 🖐️)' : 'Увімкнути Нативний переглядач (Рука 🖐️)')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-white hover:bg-surface-raised border border-border text-text-primary text-[12px] font-bold transition-colors cursor-pointer"
                >
                  <Hand className="size-3.5 text-accent" />
                  <span>{pdfMode === 'native' ? (isRu ? 'Режим: Рука 🖐️ (Нативный)' : 'Режим: Рука 🖐️ (Нативний)') : 'Режим: Google Viewer'}</span>
                </button>

                <a
                  href={effectivePdf!}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-bold hover:bg-accent-hover transition-colors shadow-2xs"
                >
                  <Download className="size-3.5" />
                  <span>{isRu ? 'Скачать PDF' : 'Завантажити PDF'}</span>
                </a>
                <a
                  href={effectivePdf!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-white hover:bg-surface-raised border border-border text-text-primary text-[12px] font-bold transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  <span>{isRu ? 'В отдельном окне' : 'В окремому вікні'}</span>
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="size-8 rounded-lg flex items-center justify-center bg-surface-white hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Universal PDF Viewer Frame */}
            <div className="flex-1 w-full h-full bg-slate-900 overflow-hidden relative flex flex-col">
              {pdfMode === 'native' ? (
                <object
                  data={`${effectivePdf!}#toolbar=1&navpanes=1&pagemode=thumbs`}
                  type="application/pdf"
                  className="w-full h-full border-none bg-slate-900"
                >
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(effectivePdf!)}&embedded=true`}
                    className="w-full h-full border-none"
                    title={isRu ? 'Паспорт изделия' : 'Паспорт виробу'}
                  />
                </object>
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(effectivePdf!)}&embedded=true`}
                  className="w-full h-full border-none"
                  title={isRu ? 'Паспорт изделия' : 'Паспорт виробу'}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 1.5: Secondary Catalog PDF Viewer */}
      {activeModal === 'catalogPdf' && effectiveCatalogPdf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[90vh] bg-surface-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent text-white flex items-center justify-center shrink-0">
                  <FileText className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-text-primary leading-tight line-clamp-1">
                    {isRu ? 'Страница каталога АСКО-УКРЕМ' : 'Сторінка каталогу АСКО-УКРЕМ'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPdfMode(prev => prev === 'native' ? 'google' : 'native')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-white hover:bg-surface-raised border border-border text-text-primary text-[12px] font-bold transition-colors cursor-pointer"
                >
                  <Hand className="size-3.5 text-accent" />
                  <span>{pdfMode === 'native' ? (isRu ? 'Режим: Рука 🖐️ (Нативный)' : 'Режим: Рука 🖐️ (Нативний)') : 'Режим: Google Viewer'}</span>
                </button>

                <a
                  href={effectiveCatalogPdf}
                  download
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

            <div className="flex-1 w-full h-full bg-slate-900 overflow-hidden relative flex flex-col">
              {pdfMode === 'native' ? (
                <object
                  data={`${effectiveCatalogPdf}#toolbar=1&navpanes=1`}
                  type="application/pdf"
                  className="w-full h-full border-none bg-slate-900"
                >
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(effectiveCatalogPdf)}&embedded=true`}
                    className="w-full h-full border-none"
                    title={isRu ? 'Страница каталога' : 'Сторінка каталогу'}
                  />
                </object>
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(effectiveCatalogPdf)}&embedded=true`}
                  className="w-full h-full border-none"
                  title={isRu ? 'Страница каталога' : 'Сторінка каталогу'}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Official ASKO Dimensions Drawing with Interactive Zoom & Pan */}
      {activeModal === 'dimensions' && effectiveDimensions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Zoom Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Ruler className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-text-primary">
                    {isRu ? 'Установочные и габаритные размеры (АСКО-УКРЕМ)' : 'Установчі та габаритні розміри (АСКО-УКРЕМ)'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              {/* Interactive Zoom Toolbar */}
              <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title={isRu ? 'Увеличить' : 'Збільшити'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <ZoomIn className="size-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-text-muted px-1">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title={isRu ? 'Уменьшить' : 'Зменшити'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <ZoomOut className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  title={isRu ? 'Повернуть' : 'Повернути'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <RotateCw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title={isRu ? 'Сброс' : 'Скинути'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-border my-auto mx-0.5" />
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Official ASKO Dimensions Image / Fallback Container */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex flex-col items-center justify-center p-4 bg-slate-900/5 rounded-xl border border-border overflow-hidden min-h-[320px] max-h-[70vh] relative ${
                zoomScale > 1
                  ? isDragging
                    ? 'cursor-grabbing'
                    : 'cursor-grab'
                  : 'cursor-default'
              }`}
            >
              {imgError ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <AlertCircle className="size-10 text-amber-500" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-text-primary">
                    {isRu
                      ? 'Чертеж габаритов временно обновляется на сервере производителя.'
                      : 'Креслення габаритів тимчасово оновлюється на сервері виробника.'}
                  </p>
                  <a
                    href={effectiveDimensions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-sm hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>{isRu ? 'Открыть прямой файл' : 'Відкрити прямий файл'}</span>
                  </a>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center select-none"
                  style={{
                    transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomScale}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={effectiveDimensions}
                    alt="Установочные и габаритные размеры АСКО"
                    onError={() => setImgError(true)}
                    draggable={false}
                    className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm pointer-events-none select-none"
                  />
                </div>
              )}

              {/* Pan & Drag Instruction Badge */}
              {!imgError && (
                <div className="absolute bottom-3 right-3 bg-surface-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border shadow-xs text-[10px] font-semibold text-text-muted flex items-center gap-1 select-none pointer-events-none">
                  <Hand className="size-3 text-accent" />
                  <span>{isRu ? 'Зажмите мышку для перемещения' : 'Затисніть мишку для переміщення'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Official ASKO Electrical Schematics with Interactive Zoom & Pan */}
      {activeModal === 'schematics' && effectiveSchematics && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Zoom Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Zap className="size-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-text-primary">
                    {isRu ? 'Электрические схемы подключения (АСКО-УКРЕМ)' : 'Електричні схеми підключення (АСКО-УКРЕМ)'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              {/* Interactive Zoom Toolbar */}
              <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title={isRu ? 'Увеличить' : 'Збільшити'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <ZoomIn className="size-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-text-muted px-1">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title={isRu ? 'Уменьшить' : 'Зменшити'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <ZoomOut className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  title={isRu ? 'Повернуть' : 'Повернути'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <RotateCw className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title={isRu ? 'Сброс' : 'Скинути'}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-primary transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-border my-auto mx-0.5" />
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg hover:bg-surface-white text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Official ASKO Schematics Image / Fallback Container */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex flex-col items-center justify-center p-4 bg-slate-900/5 rounded-xl border border-border overflow-hidden min-h-[320px] max-h-[70vh] relative ${
                zoomScale > 1
                  ? isDragging
                    ? 'cursor-grabbing'
                    : 'cursor-grab'
                  : 'cursor-default'
              }`}
            >
              {imgError ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <AlertCircle className="size-10 text-amber-500" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-text-primary">
                    {isRu
                      ? 'Схема подключения временно обновляется на сервере производителя.'
                      : 'Схема підключення тимчасово оновлюється на сервері виробника.'}
                  </p>
                  <a
                    href={effectiveSchematics}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-sm hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>{isRu ? 'Открыть прямой файл' : 'Відкрити прямий файл'}</span>
                  </a>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center select-none"
                  style={{
                    transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomScale}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={effectiveSchematics}
                    alt="Электрические схемы подключения АСКО"
                    onError={() => setImgError(true)}
                    draggable={false}
                    className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-sm pointer-events-none select-none"
                  />
                </div>
              )}

              {/* Pan & Drag Instruction Badge */}
              {!imgError && (
                <div className="absolute bottom-3 right-3 bg-surface-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border shadow-xs text-[10px] font-semibold text-text-muted flex items-center gap-1 select-none pointer-events-none">
                  <Hand className="size-3 text-accent" />
                  <span>{isRu ? 'Зажмите мышку для перемещения' : 'Затисніть мишку для переміщення'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
