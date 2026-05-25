'use client';

import React from 'react';
import { ArrowRightLeft, ArrowRight, Check, X, BadgeInfo } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AssistantOrderComparison } from '@/lib/assistant/types';

interface Props {
  comparison: AssistantOrderComparison;
  locale: string;
  onAccept: () => void;
  onReject: () => void;
  onCompareMore?: () => void;
}

export function AssistantOrderComparisonPanel({
  comparison,
  locale,
  onAccept,
  onReject,
  onCompareMore,
}: Props) {
  const t = useTranslations('assistant');
  const { changedItems, priceDelta, technicalSummary } = comparison;

  return (
    <div className="flex flex-col h-full bg-blue-50/20 border border-blue-100 rounded-2xl p-4 animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-100">
        <ArrowRightLeft size={16} className="text-blue-500" />
        <h3 className="font-bold text-slate-800 text-sm">
          {t('comparisonTitle')}
        </h3>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {changedItems.map((change, index) => {
          return (
            <div
              key={`${change.productId}-${index}`}
              className="bg-white rounded-xl border border-blue-100/60 p-3 shadow-sm relative overflow-hidden"
            >
              {change.type === 'replace' || change.type === 'add' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Previous Product (if replacement) */}
                    {change.previousPrice && (
                      <div className="flex-1 min-w-0 bg-slate-50 p-2 rounded-lg text-center opacity-70">
                        <span className="text-[9px] text-slate-400 font-mono block mb-1">
                          {locale === 'uk' ? 'СТАРИЙ' : 'СТАРЫЙ'}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-700 truncate">
                          {change.name}
                        </h4>
                        <div className="text-xs font-mono font-bold mt-1 text-slate-500">
                          {change.previousPrice.toLocaleString()} UAH
                        </div>
                      </div>
                    )}

                    {/* Replacement arrow */}
                    {change.previousPrice && (
                      <div className="flex items-center justify-center text-blue-500">
                        <ArrowRight size={18} className="animate-pulse" />
                      </div>
                    )}

                    {/* Proposed Product */}
                    <div className="flex-1 min-w-0 bg-blue-50/50 p-2 rounded-lg text-center border border-blue-100/80">
                      <span className="text-[9px] text-blue-600 font-bold block mb-1">
                        {locale === 'uk' ? 'НОВИЙ' : 'НОВЫЙ'}
                      </span>
                      <h4 className="text-xs font-semibold text-blue-900 truncate">
                        {change.name}
                      </h4>
                      <div className="text-xs font-mono font-bold mt-1 text-blue-600">
                        {change.newPrice?.toLocaleString()} UAH
                      </div>
                    </div>
                  </div>
                </div>
              ) : change.type === 'remove' ? (
                <div className="bg-red-50/30 border border-red-100 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-700 truncate">{change.name}</span>
                  <span className="text-[10px] text-red-500 font-bold uppercase">
                    {locale === 'uk' ? 'Видаляється' : 'Удаляется'}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Technical Summary Bubble */}
        {technicalSummary && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2.5 items-start">
            <BadgeInfo size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-1">
                {t('technicalJustification')}
              </span>
              {technicalSummary}
            </div>
          </div>
        )}

        {/* Comparison differences list */}
        <div className="space-y-1.5 text-xs border-t border-dashed border-slate-200 pt-3">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('priceDelta')}</span>
            <span className={`font-mono font-bold ${priceDelta > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {priceDelta > 0 ? '+' : ''}
              {priceDelta.toLocaleString()} UAH
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('compatibility')}</span>
            <span className="text-emerald-600 font-semibold">{t('fullCompatibility')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-blue-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onAccept}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Check size={14} />
            {t('accept')}
          </button>
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold text-xs transition-all cursor-pointer"
          >
            <X size={14} />
            {t('reject')}
          </button>
        </div>

        {onCompareMore && (
          <button
            onClick={onCompareMore}
            className="w-full text-center text-xs text-blue-600 hover:underline pt-1 cursor-pointer block"
          >
            {t('compareDetailed')}
          </button>
        )}
      </div>
    </div>
  );
}
