'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, X, ShoppingBag, ArrowRightLeft, Sparkles, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AssistantCharacter } from './assistant-character';
import { AssistantMessageItem } from './assistant-message';
import { AssistantDraftOrderPanel } from './assistant-draft-order';
import { AssistantOrderComparisonPanel } from './assistant-order-comparison';
import { calculateDraftOrder } from '@/lib/assistant/draft-order';
import type { ChatMessage, AssistantState, RecommendedProduct, AssistantDraftOrder, AssistantOrderComparison } from '@/lib/assistant/types';

interface Props {
  locale: string;
  isFullPage?: boolean;
  onClose?: () => void;
}

export function AssistantPanel({ locale, isFullPage = false, onClose }: Props) {
  const t = useTranslations('assistant');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Core State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [characterState, setCharacterState] = useState<AssistantState>('greeting');
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'selection' | 'comparison'>('chat');

  // Selection / Draft Order State
  const [draftOrder, setDraftOrder] = useState<AssistantDraftOrder>({
    id: 'draft_1',
    status: 'draft',
    items: [],
    subtotal: 0,
    total: 0,
    currency: 'UAH',
  });

  // Comparison State
  const [comparison, setComparison] = useState<AssistantOrderComparison | null>(null);

  // Voice Settings State
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Custom Toast State
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const triggerToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Speech Recognition Instantiation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // First greeting trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      const greetingMsg = t('greeting');

      setMessages([
        {
          id: 'greeting_msg',
          role: 'assistant',
          content: greetingMsg,
          structured: {
            message: greetingMsg,
            questions: [t('greetingQ1'), t('greetingQ2')],
          },
          createdAt: new Date().toISOString(),
        },
      ]);
      setCharacterState('idle');
    }, 1500);

    return () => clearTimeout(timer);
  }, [t]);

  // Scroll to bottom whenever messages or comparison changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, comparison]);

  // Set up Speech Recognition on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = locale === 'uk' ? 'uk-UA' : 'ru-RU';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsVoiceInputActive(false);
        };

        rec.onerror = () => {
          setIsVoiceInputActive(false);
        };

        rec.onend = () => {
          setIsVoiceInputActive(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [locale]);

  // Text-To-Speech Synthesis helper
  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || typeof window === 'undefined') return;

    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'uk' ? 'uk-UA' : 'ru-RU';

    utterance.onstart = () => {
      setCharacterState('speaking');
    };

    utterance.onend = () => {
      setCharacterState('idle');
    };

    utterance.onerror = () => {
      setCharacterState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop current voice speech synthesis
  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setCharacterState('idle');
    }
  };

  // Toggle speech input recording
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      triggerToast(t('voiceUnsupported'), 'error');
      return;
    }

    if (isVoiceInputActive) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      setIsVoiceInputActive(true);
      recognitionRef.current.start();
    }
  };

  // Send request message to server endpoint
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    stopSpeaking();

    // Trigger state sequences: searching -> reading documents -> thinking
    setCharacterState('searching');

    setTimeout(async () => {
      setCharacterState('readingDocs');

      setTimeout(async () => {
        setCharacterState('thinking');

        try {
          const chatHistory = messages.map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const response = await fetch('/api/assistant/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              history: chatHistory,
              locale,
              sessionId: sessionId || undefined,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.sessionId) {
              setSessionId(data.sessionId);
            }

            // Transition character state to typing
            setCharacterState('typing');

            // Apply incremental updates for live order recommendations
            if (data.draftOrder) {
              setDraftOrder(data.draftOrder);
              // Open selection tab automatically when products are updated
              setActiveTab('selection');
            }

            if (data.orderComparison) {
              setComparison(data.orderComparison);
              setActiveTab('comparison');
            }

            // Stream simulation/typing block
            setTimeout(() => {
              const assistantMessage: ChatMessage = {
                id: Math.random().toString(),
                role: 'assistant',
                content: data.message,
                structured: data,
                createdAt: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, assistantMessage]);
              setCharacterState('idle');

              // Trigger speech output if turned on
              if (isVoiceOutputEnabled) {
                speakText(data.message);
              }
            }, 800);
          } else {
            setCharacterState('error');
            const errorMsg: ChatMessage = {
              id: Math.random().toString(),
              role: 'assistant',
              content: t('errorText'),
              structured: {
                message: t('errorText'),
                warnings: [t('errorWarning')],
              },
              createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
          }
        } catch (err) {
          console.error(err);
          setCharacterState('error');
          const errorMsg: ChatMessage = {
            id: Math.random().toString(),
            role: 'assistant',
            content: t('errorText'),
            structured: {
              message: t('errorText'),
              warnings: [t('errorWarning')],
            },
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      }, 700);
    }, 700);
  };

  // Handle adding product from recommended cards
  const handleAddToSelection = (product: RecommendedProduct) => {
    const existing = draftOrder.items.find((item) => item.productId === product.id);
    let updatedItems = [];

    if (existing) {
      updatedItems = draftOrder.items.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [
        ...draftOrder.items,
        {
          id: `item_${Math.random().toString(36).substring(2, 9)}`,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    }

    const nextOrder = calculateDraftOrder(updatedItems);
    setDraftOrder(nextOrder);
    setActiveTab('selection');
  };

  // Triggering comparison logic
  const handleCompareProduct = (product: RecommendedProduct) => {
    // Look for matching existing category product to compare
    const matchItem = draftOrder.items[0];
    if (!matchItem) {
      triggerToast(
        locale === 'uk' ? 'Спочатку додайте товар у підбір' : 'Сначала добавьте товар в подбор',
        'info'
      );
      return;
    }

    const currentPrice = Number(matchItem.price);
    const currentName = matchItem.name;

    const mockComparison: AssistantOrderComparison = {
      mode: 'replace',
      previousOrder: {
        id: 'old_1',
        status: 'draft',
        items: [matchItem],
        subtotal: currentPrice,
        total: currentPrice,
        currency: 'UAH',
      },
      proposedOrder: {
        id: 'proposed_1',
        status: 'draft',
        items: [
          {
            id: `item_prop_${Math.random().toString(36).substring(2, 9)}`,
            productId: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ],
        subtotal: product.price,
        total: product.price,
        currency: 'UAH',
      },
      changedItems: [
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          type: 'replace',
          previousPrice: currentPrice,
          newPrice: product.price,
        },
      ],
      priceDelta: product.price - currentPrice,
      technicalSummary: locale === 'uk'
        ? `Порівняння характеристик для заміни ${currentName} на ${product.name}. Будь ласка, перевірте детальну специфікацію, ємність та сумісність у порівняльній таблиці товарів.`
        : `Сравнение характеристик для замены ${currentName} на ${product.name}. Пожалуйста, проверьте детальную спецификацию, емкость и совместимость в сравнительной таблице товаров.`,
      recommendation: 'accept',
    };

    setComparison(mockComparison);
    setActiveTab('comparison');
  };

  const handleUpdateQty = (productId: string, quantity: number) => {
    const updated = draftOrder.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setDraftOrder(calculateDraftOrder(updated));
  };

  const handleRemoveItem = (productId: string) => {
    const updated = draftOrder.items.filter((item) => item.productId !== productId);
    setDraftOrder(calculateDraftOrder(updated));
  };

  const handleClearOrder = () => {
    setDraftOrder({
      id: 'draft_1',
      status: 'draft',
      items: [],
      subtotal: 0,
      total: 0,
      currency: 'UAH',
    });
  };

  const handleAcceptReplacement = () => {
    if (comparison && comparison.proposedOrder) {
      setDraftOrder(comparison.proposedOrder);
      setComparison(null);
      setActiveTab('selection');
      triggerToast(locale === 'uk' ? 'Заміну прийнято!' : 'Замена принята!', 'success');
    }
  };

  const handleRejectReplacement = () => {
    setComparison(null);
    setActiveTab('selection');
    triggerToast(locale === 'uk' ? 'Заміну відхилено' : 'Замена отклонена', 'info');
  };

  const handleProvideFeedback = (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
  };

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden shadow-2xl transition-all duration-300 border border-slate-200/60 relative ${
        isFullPage
          ? 'h-[85vh] w-full rounded-2xl'
          : 'h-[600px] w-[380px] sm:w-[780px] rounded-2xl'
      }`}
    >
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className={`absolute top-12 left-4 right-4 z-50 p-2.5 rounded-xl border text-xs font-semibold shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 ${
          toastMsg.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : toastMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="flex-1">{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600 font-bold px-1.5 cursor-pointer">×</button>
        </div>
      )}

      {/* Upper header */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Animated SVG character header bubble */}
          <div className="w-10 h-10 bg-slate-800 rounded-xl p-1 flex items-center justify-center">
            <AssistantCharacter state={characterState} className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-400 fill-blue-400" />
              Elektronom AI Assistant
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono block">
              ● {characterState === 'idle' ? t('ready') : characterState.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Speech Synthesis Toggle */}
          <button
            onClick={() => {
              if (isVoiceOutputEnabled) {
                stopSpeaking();
              }
              setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isVoiceOutputEnabled ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title={locale === 'uk' ? 'Озвучувати відповіді' : 'Озвучивать ответы'}
          >
            {isVoiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Close Panel Widget Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-column Workspace layout */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Column: Chat thread */}
        <div
          className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${
            activeTab === 'chat' ? 'w-full' : 'hidden sm:flex sm:w-1/2'
          }`}
        >
          {/* Scrolling messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col min-h-0 bg-slate-50/30">
            {messages.map((msg) => (
              <AssistantMessageItem
                key={msg.id}
                message={msg}
                locale={locale}
                onAddToSelection={handleAddToSelection}
                onCompareProduct={handleCompareProduct}
                onSelectQuestion={handleSendMessage}
                onProvideFeedback={handleProvideFeedback}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form Area */}
          <div className="p-3 border-t border-slate-100 bg-white space-y-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
              {/* Mic Input */}
              <button
                onClick={toggleVoiceInput}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isVoiceInputActive
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isVoiceInputActive ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                placeholder={
                  isVoiceInputActive
                    ? (locale === 'uk' ? 'Говоріть...' : 'Говорите...')
                    : t('placeholder')
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputValue);
                }}
                disabled={isVoiceInputActive}
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder-slate-400 min-w-0"
              />

              {/* Submit Message */}
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Selection or Comparison Details panel */}
        <div
          className={`flex flex-col h-full border-l border-slate-100 p-4 overflow-hidden transition-all duration-300 ${
            activeTab !== 'chat' ? 'w-full' : 'hidden sm:flex sm:w-1/2'
          }`}
        >
          {activeTab === 'selection' && (
            <AssistantDraftOrderPanel
              draftOrder={draftOrder}
              locale={locale}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearOrder={handleClearOrder}
            />
          )}

          {activeTab === 'comparison' && comparison && draftOrder.items.length > 0 && (
            <AssistantOrderComparisonPanel
              comparison={comparison}
              locale={locale}
              onAccept={handleAcceptReplacement}
              onReject={handleRejectReplacement}
              onCompareMore={() => triggerToast(locale === 'uk' ? 'Порівняння розгорнуто!' : 'Сравнение развернуто!', 'success')}
            />
          )}

          {activeTab === 'comparison' && (!comparison || draftOrder.items.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
              <ArrowRightLeft size={40} className="text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">
                {locale === 'uk' ? 'Спочатку додайте товар у підбір' : 'Сначала добавьте товар в подбор'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {locale === 'uk'
                  ? 'Попросіть асистента порівняти товари або додайте позиції для аналізу'
                  : 'Попросите ассистента сравнить товары или добавьте позиции для анализа'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Responsive tabs toggles (only shown on mobile screens) */}
      <div className="sm:hidden grid grid-cols-3 border-t border-slate-100 bg-white">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500'
          }`}
        >
          <MessageCircle size={15} />
          {t('tabChat')}
        </button>
        <button
          onClick={() => setActiveTab('selection')}
          className={`py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'selection'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500'
          }`}
        >
          <ShoppingBag size={15} />
          {t('tabSelection')}
          {draftOrder.items.length > 0 && (
            <span className="bg-blue-500 text-white rounded-full text-[9px] px-1.5 font-bold">
              {draftOrder.items.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'comparison'
              ? 'border-blue-600 text-blue-600 bg-blue-50/10'
              : 'border-transparent text-slate-500'
          }`}
        >
          <ArrowRightLeft size={15} />
          {t('tabComparison')}
          {comparison && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
