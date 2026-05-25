'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AssistantCharacter } from './assistant-character';
import { AssistantPanel } from './assistant-panel';
import type { AssistantState } from '@/lib/assistant/types';

interface Props {
  locale: string;
}

export function AssistantWidget({ locale }: Props) {
  const t = useTranslations('assistant');
  const [isOpen, setIsOpen] = useState(false);
  const [characterState, setCharacterState] = useState<AssistantState>('idle');
  const [showBubble, setShowBubble] = useState(false);

  // Waving greeting sequence on load after 6 seconds
  useEffect(() => {
    const bubbleTimer = setTimeout(() => {
      if (!isOpen) {
        setCharacterState('greeting');
        setShowBubble(true);

        // Return to idle after 4 seconds of waving
        setTimeout(() => {
          setCharacterState('idle');
        }, 4000);
      }
    }, 6000);

    return () => clearTimeout(bubbleTimer);
  }, [isOpen]);

  const handleOpenPanel = () => {
    setIsOpen(true);
    setShowBubble(false);
    setCharacterState('idle');
  };

  const handleClosePanel = () => {
    setIsOpen(false);
    setCharacterState('idle');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded chat panel */}
      {isOpen ? (
        <div className="animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
          <AssistantPanel locale={locale} onClose={handleClosePanel} />
        </div>
      ) : (
        /* Floating Robot Button */
        <div className="relative flex items-center justify-end">
          {/* Greeting Speech bubble */}
          {showBubble && (
            <div className="absolute right-20 bottom-2 bg-slate-900 text-white p-3 rounded-2xl rounded-br-none shadow-xl border border-slate-800 text-xs w-48 font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="absolute top-1 right-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
              <div className="pr-2 leading-relaxed">
                {t('wavingBubble')}
              </div>
            </div>
          )}

          {/* Glowing Ring behind Robot */}
          <button
            onClick={handleOpenPanel}
            onMouseEnter={() => setCharacterState('hover')}
            onMouseLeave={() => setCharacterState('idle')}
            className="group relative w-16 h-16 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Quick interactive notification dot */}
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <Sparkles size={8} className="text-white fill-white animate-pulse" />
            </span>

            {/* Render Character */}
            <AssistantCharacter state={characterState} className="w-12 h-12" />
          </button>
        </div>
      )}
    </div>
  );
}
