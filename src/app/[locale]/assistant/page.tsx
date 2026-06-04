import React from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale } from '@/i18n/request';
import { notFound } from 'next/navigation';
import { AssistantPanel } from '@/components/assistant/assistant-panel';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const isUk = locale === 'uk';

  return {
    title: isUk
      ? 'Технічний AI-консультант | Electronom'
      : 'Технический AI-консультант | Electronom',
    description: isUk
      ? 'Онлайн підбір електрообладнання, розрахунок ДБЖ, перевірка сумісності та залишків.'
      : 'Онлайн подбор электрооборудования, расчет ИБП, проверка совместимости и остатков.',
  };
}

export default async function AssistantPage({ params }: Props) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const isUk = locale === 'uk';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Intro header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          {isUk ? 'Технічний AI-консультант' : 'Технический AI-консультант'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isUk
            ? 'Інтелектуальний підбір безперебійного живлення, автоматики та сумісних кабелів'
            : 'Интеллектуальный подбор бесперебойного питания, автоматики и совместимых кабелей'}
        </p>
      </div>

      {/* Render full-page panel */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
        <AssistantPanel locale={locale} isFullPage={true} />
      </div>

      {/* Safety Disclaimer */}
      <div className="mt-4 text-center text-xs text-slate-400">
        {isUk
          ? 'Перед монтажем електрообладнання обов\'язково перевірте рішення з кваліфікованим електриком.'
          : 'Перед монтажом электрооборудования обязательно проверьте решение с квалифицированным электриком.'}
      </div>
    </div>
  );
}
