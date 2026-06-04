import { Bot, ExternalLink, Loader2, X } from 'lucide-react'
import type { ContentFactoryRunResult } from '@/actions/admin'

interface ProductAiFactoryResultModalProps {
  result: ContentFactoryRunResult | null
  isLoading: boolean
  locale: string
  onClose: () => void
  onRefresh: () => void
}

const labels = {
  uk: {
    title: 'AI Factory result',
    loading: 'Завантаження результату...',
    close: 'Закрити',
    refresh: 'Оновити',
    run: 'Run',
    job: 'Local agent',
    steps: 'Кроки',
    resultJson: 'Результат',
    reviews: 'Reviews',
    noResult: 'Результат ще не завантажено.',
  },
  ru: {
    title: 'AI Factory result',
    loading: 'Загрузка результата...',
    close: 'Закрыть',
    refresh: 'Обновить',
    run: 'Run',
    job: 'Local agent',
    steps: 'Шаги',
    resultJson: 'Результат',
    reviews: 'Reviews',
    noResult: 'Результат еще не загружен.',
  },
}

export function ProductAiFactoryResultModal({
  result,
  isLoading,
  locale,
  onClose,
  onRefresh,
}: ProductAiFactoryResultModalProps) {
  const t = locale === 'ru' ? labels.ru : labels.uk
  const run = result?.run
  const latestJob = result?.jobs?.[0]
  const latestAsset = run?.steps
    .filter((step) => step.step_type === 'asset_generation')
    .at(-1)?.output_json
  const assetUri = typeof latestAsset?.storage_uri === 'string' ? latestAsset.storage_uri : null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in">
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-accent mb-1">
              <Bot className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">{t.title}</span>
            </div>
            <h3 className="text-base font-black text-slate-950">
              {run ? `${run.action_type} / ${run.status}` : t.noResult}
            </h3>
            {run && <p className="text-xs font-semibold text-slate-500 mt-1">{run.id}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading || !run}
              className="h-8 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors disabled:opacity-60 inline-flex items-center gap-2"
            >
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              {t.refresh}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex flex-col gap-5">
          {isLoading && !run ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              {t.loading}
            </div>
          ) : null}

          {result?.error && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {result.error}
            </div>
          )}

          {run && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {metric(t.run, run.status)}
                {metric('Gate', typeof run.result_json?.current_gate === 'string' ? run.result_json.current_gate : '-')}
                {metric('Mode', run.provider_mode)}
                {metric(t.job, latestJob ? latestJob.status : '-')}
              </div>

              {assetUri && (
                <figure className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUri} alt="AI Factory generated asset" className="w-full max-h-[420px] object-contain bg-white" />
                  <figcaption className="px-3 py-2 text-[11px] font-semibold text-slate-500 border-t border-slate-100">
                    {typeof latestAsset?.provider === 'string' ? latestAsset.provider : 'generated asset'}
                  </figcaption>
                </figure>
              )}

              <section className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-700">
                  {t.steps}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white text-[10px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-2">Step</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Updated</th>
                        <th className="px-4 py-2">Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {run.steps.map((step) => (
                        <tr key={step.id}>
                          <td className="px-4 py-2 font-bold text-slate-800">{step.step_type}</td>
                          <td className="px-4 py-2">{step.status}</td>
                          <td className="px-4 py-2 text-slate-500">{formatDate(step.updated_at)}</td>
                          <td className="px-4 py-2 text-slate-500 max-w-md truncate">
                            {shortJson(step.output_json)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {latestJob && (
                <section className="rounded-xl border border-slate-200 p-4">
                  <h4 className="text-xs font-black text-slate-800 mb-2">{t.job}</h4>
                  <pre className="text-[11px] leading-relaxed overflow-auto bg-slate-950 text-slate-100 rounded-xl p-3 max-h-64">
                    {JSON.stringify(
                      {
                        id: latestJob.id,
                        status: latestJob.status,
                        next_action: latestJob.result_json?.next_action,
                        progress: latestJob.result_json?.progress,
                        error: latestJob.error_message,
                      },
                      null,
                      2
                    )}
                  </pre>
                </section>
              )}

              <section className="rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-black text-slate-800 mb-2">{t.resultJson}</h4>
                <pre className="text-[11px] leading-relaxed overflow-auto bg-slate-950 text-slate-100 rounded-xl p-3 max-h-72">
                  {JSON.stringify(run.result_json, null, 2)}
                </pre>
              </section>

              <a
                href={`http://127.0.0.1:8028/api/cms-admin/factory-runs/${run.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                <ExternalLink className="size-3.5" />
                Open raw Factory API
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function metric(label: string, value: string) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
      <strong className="block text-xs font-black text-slate-900 mt-1 truncate">{value}</strong>
    </div>
  )
}

function shortJson(value: unknown) {
  const raw = JSON.stringify(value || {})
  return raw.length > 180 ? `${raw.slice(0, 180)}...` : raw
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}
