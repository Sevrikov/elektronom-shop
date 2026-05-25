'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { ChatMessage, RecommendedProduct } from '@/lib/assistant/types';
import { AssistantProductCard } from './assistant-product-card';

interface Props {
  message: ChatMessage;
  locale: string;
  onAddToSelection: (product: RecommendedProduct) => void;
  onCompareProduct: (product: RecommendedProduct) => void;
  onSelectQuestion: (question: string) => void;
  onProvideFeedback: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
}

export function AssistantMessageItem({
  message,
  locale,
  onAddToSelection,
  onCompareProduct,
  onSelectQuestion,
  onProvideFeedback,
}: Props) {
  const isAssistant = message.role === 'assistant';
  const structured = message.structured;
  const isUk = locale === 'uk';

  return (
    <div
      className={`flex gap-3 max-w-[85%] ${
        isAssistant ? 'self-start' : 'self-end flex-row-reverse'
      }`}
    >
      {/* Avatar icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
          isAssistant
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}
      >
        {isAssistant ? 'AI' : 'U'}
      </div>

      {/* Bubble content */}
      <div className="space-y-3 flex-1 min-w-0">
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-slate-100/70 border border-slate-200/50 text-slate-800 rounded-tl-none'
              : 'bg-blue-600 text-white rounded-tr-none'
          }`}
        >
          {/* Main message text */}
          <div className="whitespace-pre-line text-sm">{message.content}</div>

          {/* Safety Warning Panel */}
          {isAssistant && structured?.warnings && structured.warnings.length > 0 && (
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex gap-2 items-start">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0 animate-bounce" />
              <div>{structured.warnings.join(' ')}</div>
            </div>
          )}

          {/* Timestamp & feedback options */}
          <div
            className={`flex items-center justify-between mt-2.5 pt-2 border-t text-[10px] ${
              isAssistant
                ? 'border-slate-200/40 text-slate-400'
                : 'border-blue-500 text-blue-200'
            }`}
          >
            <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

            {isAssistant && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onProvideFeedback(message.id, 'helpful')}
                  className={`hover:text-blue-600 p-0.5 transition-colors cursor-pointer ${
                    message.feedback === 'helpful' ? 'text-blue-600' : ''
                  }`}
                >
                  <ThumbsUp size={11} />
                </button>
                <button
                  onClick={() => onProvideFeedback(message.id, 'unhelpful')}
                  className={`hover:text-red-500 p-0.5 transition-colors cursor-pointer ${
                    message.feedback === 'unhelpful' ? 'text-red-500' : ''
                  }`}
                >
                  <ThumbsDown size={11} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products Carousel inside chat bubble */}
        {isAssistant && structured?.products && structured.products.length > 0 && (
          <div className="mt-2 space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-500" />
              {isUk ? 'Рекомендоване обладнання' : 'Рекомендуемое оборудование'}
            </h5>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {structured.products.map((product) => (
                <AssistantProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  onAddToSelection={onAddToSelection}
                  onCompareProduct={onCompareProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Clarifying Questions as Quick Action Chips */}
        {isAssistant && structured?.questions && structured.questions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {structured.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuestion(q)}
                className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-[11px] text-slate-600 py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
