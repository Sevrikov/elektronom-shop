'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { FileText, Ruler, Zap, X, Download, ExternalLink } from 'lucide-react'

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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Button 1: Dimensions (if available) */}
        {effectiveDimensions && (
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
              {isRu ? 'Чертеж завода' : 'Креслення заводу'}
            </span>
          </button>
        )}

        {/* Button 2: Wiring Schematics (if available) */}
        {effectiveSchematics && (
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
              {isRu ? 'Схема завода' : 'Схема заводу'}
            </span>
          </button>
        )}

        {/* Button 3: PDF Passport (if available) */}
        {effectivePdf && (
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
              {isRu ? 'Просмотр на сайте' : 'Перегляд на сайті'}
            </span>
          </button>
        )}

        {/* Button 4: Second PDF / Catalog Page (if available) */}
        {effectiveCatalogPdf && (
          <button
            type="button"
            onClick={() => setActiveModal('catalogPdf')}
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

      {/* Modal 1: Native HTML5 PDF Viewer */}
      {activeModal === 'pdf' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[88vh] bg-surface-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
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
                    {isRu ? 'Официальный паспорт изделия АСКО-УКРЕМ' : 'Офіційний паспорт виробу АСКО-УКРЕМ'}
                  </h3>
                  <p className="text-[11px] text-text-muted">{productSku ? `${productSku} · ` : ''}{productName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
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

            {/* Native Object / Embed PDF Viewer */}
            <div className="flex-1 w-full h-full bg-slate-900 overflow-hidden relative">
              <object
                data={`${effectivePdf}#toolbar=1&navpanes=1&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full border-none"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 text-white p-6 text-center">
                  <FileText className="size-12 text-accent" strokeWidth={1.5} />
                  <p className="text-sm font-semibold">
                    {isRu
                      ? 'Просмотрщик PDF готов. Если ваш браузер блокирует встроенное отображение:'
                      : 'Переглядач PDF готовий. Якщо ваш браузер блокує вбудований перегляд:'}
                  </p>
                  <a
                    href={effectivePdf!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-sm shadow-md hover:bg-accent-hover transition-colors"
                  >
                    {isRu ? 'Открыть PDF файл' : 'Відкрити PDF файл'}
                  </a>
                </div>
              </object>
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
            className="relative w-full max-w-5xl h-[88vh] bg-surface-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-alt">
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

            <div className="flex-1 w-full h-full bg-slate-900 overflow-hidden relative">
              <object
                data={`${effectiveCatalogPdf}#toolbar=1&navpanes=1&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full border-none"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 text-white p-6 text-center">
                  <FileText className="size-12 text-accent" strokeWidth={1.5} />
                  <a
                    href={effectiveCatalogPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-accent text-white font-bold text-sm shadow-md hover:bg-accent-hover transition-colors"
                  >
                    {isRu ? 'Открыть PDF файл' : 'Відкрити PDF файл'}
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Official ASKO Dimensions Drawing */}
      {activeModal === 'dimensions' && effectiveDimensions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
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
              <button
                onClick={() => setActiveModal(null)}
                className="size-8 rounded-lg flex items-center justify-center bg-surface-alt hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Official ASKO Dimensions Image */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={effectiveDimensions}
                alt="Установочные и габаритные размеры АСКО"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Official ASKO Electrical Schematics */}
      {activeModal === 'schematics' && effectiveSchematics && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-surface-white rounded-2xl p-5 shadow-2xl flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
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
              <button
                onClick={() => setActiveModal(null)}
                className="size-8 rounded-lg flex items-center justify-center bg-surface-alt hover:bg-surface-raised border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Official ASKO Schematics Image */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={effectiveSchematics}
                alt="Электрические схемы подключения АСКО"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
