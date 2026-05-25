'use client';

import React, { useTransition, useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, Check, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/hooks/use-cart';
import type { AssistantDraftOrder } from '@/lib/assistant/types';

interface Props {
  draftOrder: AssistantDraftOrder;
  locale: string;
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearOrder: () => void;
}

export function AssistantDraftOrderPanel({
  draftOrder,
  locale,
  onUpdateQty,
  onRemoveItem,
  onClearOrder,
}: Props) {
  const t = useTranslations('assistant');
  const { add } = useCart();
  const [isAddingToCart, startAddingTransition] = useTransition();
  const [addSuccess, setAddSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorItems, setErrorItems] = useState<string[]>([]);

  const handleCopyToRealCart = () => {
    setShowConfirm(true);
  };

  const executeCopyToRealCart = () => {
    setShowConfirm(false);
    setErrorItems([]);

    startAddingTransition(async () => {
      const failedList: string[] = [];

      for (const item of draftOrder.items) {
        await new Promise<void>((resolve) => {
          add(
            item.productId,
            item.quantity,
            () => resolve(),
            () => {
              failedList.push(item.name);
              resolve();
            }
          );
        });
      }

      if (failedList.length > 0) {
        setErrorItems(failedList);
      } else {
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 3000);
      }
    });
  };

  if (!draftOrder.items || draftOrder.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
        <ShoppingBag size={48} className="stroke-[1.5] mb-4 text-slate-300" />
        <p className="text-sm font-medium">{t('emptyTitle')}</p>
        <p className="text-xs text-slate-500 mt-1">{t('emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          {t('draftTitle')}
        </h3>
        <button
          onClick={onClearOrder}
          className="text-xs text-red-500 hover:underline cursor-pointer"
        >
          {t('clear')}
        </button>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[400px]">
        {draftOrder.items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
          >
            {/* Image */}
            <div className="relative w-12 h-12 rounded-lg bg-slate-50 p-1 flex-shrink-0 flex items-center justify-center">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-slate-400 font-bold">UPS</span>
              )}
            </div>

            {/* Title & Qty */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-800 truncate mb-1">
                {item.name}
              </h4>
              <div className="text-[11px] font-mono text-slate-500 mb-1.5">SKU: {item.sku}</div>
              <div className="flex items-center justify-between">
                {/* Quantity Editor */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => onUpdateQty(item.productId, Math.max(1, item.quantity - 1))}
                    className="p-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                    className="p-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-900">
                  {(Number(item.price) * item.quantity).toLocaleString()} UAH
                </div>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemoveItem(item.productId)}
              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Pricing and Synced CTA */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{t('subtotal')}</span>
          <span>{draftOrder.subtotal.toLocaleString()} UAH</span>
        </div>
        {draftOrder.discount ? (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>{t('discount')}</span>
            <span>-{draftOrder.discount.toLocaleString()} UAH</span>
          </div>
        ) : null}
        <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
          <span>{t('total')}</span>
          <span>{draftOrder.total.toLocaleString()} UAH</span>
        </div>

        {/* Sync or Confirmation UI */}
        {showConfirm ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs space-y-2 mt-2">
            <p className="font-semibold text-blue-900">{t('addedToCartConfirmation')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={executeCopyToRealCart}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-center cursor-pointer"
              >
                {locale === 'uk' ? 'Так' : 'Да'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="py-1.5 px-3 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-center cursor-pointer"
              >
                {locale === 'uk' ? 'Ні' : 'Нет'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleCopyToRealCart}
            disabled={isAddingToCart}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs mt-2 transition-all cursor-pointer ${
              addSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                {t('transferring')}
              </>
            ) : addSuccess ? (
              <>
                <Check size={14} />
                {t('transferred')}
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                {t('transferToCart')}
              </>
            )}
          </button>
        )}

        {/* Error Items Listing */}
        {errorItems.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg space-y-1">
            {errorItems.map((name, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[11px] text-red-700">
                <AlertCircle size={12} className="flex-shrink-0" />
                <span>{t('additionError', { name })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
