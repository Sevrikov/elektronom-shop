'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { RecommendedProduct } from '@/lib/assistant/types';

interface Props {
  product: RecommendedProduct;
  locale: string;
  onAddToSelection: (product: RecommendedProduct) => void;
  onCompareProduct: (product: RecommendedProduct) => void;
}

export function AssistantProductCard({ product, locale, onAddToSelection, onCompareProduct }: Props) {
  const isUk = locale === 'uk';

  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-[280px]">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 280px) 100vw, 280px"
          />
        ) : (
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            UPS
          </div>
        )}

        {/* Stock status badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
            product.stock > 0
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {product.stock > 0
            ? isUk
              ? 'В наявності'
              : 'В наличии'
            : isUk
            ? 'Під замовлення'
            : 'Под заказ'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-[10px] text-slate-400 font-mono block mb-1">SKU: {product.sku}</span>
        <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 min-h-[40px] mb-2">
          {product.name}
        </h4>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-slate-50 rounded-lg p-2 mb-3 text-[11px] text-slate-600 space-y-1">
            {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-400">{key}:</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* AI Reason */}
        {product.reason && (
          <p className="text-[11px] text-slate-500 italic mb-4 line-clamp-2">
            💡 {product.reason}
          </p>
        )}

        {/* Price & Actions */}
        <div className="mt-auto pt-2 border-t border-slate-50">
          <div className="text-lg font-bold text-slate-900 mb-3">
            {product.price.toLocaleString()} UAH
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onAddToSelection(product)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium text-slate-700 cursor-pointer"
            >
              <ShoppingCart size={13} />
              {isUk ? 'Додати' : 'Добавить'}
            </button>
            <button
              onClick={() => onCompareProduct(product)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors font-medium cursor-pointer"
            >
              {isUk ? 'Заміна' : 'Замена'}
              <ArrowRight size={13} />
            </button>
          </div>

          {/* View Product Details Link */}
          <Link
            href={`/${locale}/product/${product.slug}`}
            className="block text-center text-[11px] text-blue-600 hover:underline mt-2"
          >
            {isUk ? 'Детальніше про товар' : 'Подробнее о товаре'}
          </Link>
        </div>
      </div>
    </div>
  );
}
