'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AssistantState } from '@/lib/assistant/types';

interface Props {
  state: AssistantState;
  className?: string;
}

export function AssistantCharacter({ state, className }: Props) {
  const [blink, setBlink] = useState(false);

  // Periodic blinking in idle/greeting states
  useEffect(() => {
    if (state !== 'idle' && state !== 'greeting' && state !== 'hover') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, [state]);

  // Determine colors based on state
  const isError = state === 'error';
  const isThinking = state === 'thinking';
  const isSearching = state === 'searching';
  const isReading = state === 'readingDocs';
  const isTyping = state === 'typing';
  const isSpeaking = state === 'speaking';
  const isHovered = state === 'hover';

  const glowColor = isError
    ? 'rgba(249, 115, 22, 0.4)' // Amber
    : 'rgba(59, 123, 217, 0.4)'; // Electric Blue

  const screenColor = isError
    ? '#FFF7ED' // Amber-tinted light screen
    : '#ECF2FF'; // Soft Blue screen

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none transition-all duration-300",
        className
      )}
    >
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60 transition-colors duration-500"
        style={{
          background: glowColor,
          animation: state === 'idle' ? 'pulse 3s infinite' : 'none',
        }}
      />

      {/* SVG Robot Figure */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "relative z-10 transition-transform duration-300",
          state === 'idle' && "animate-bounce-subtle",
          isHovered && "scale-105 -rotate-3"
        )}
      >
        {/* Antennas */}
        <path d="M50 25 V15" stroke="#3B7BD9" strokeWidth="3" strokeLinecap="round" />
        <circle
          cx="50"
          cy="12"
          r="4"
          fill={isError ? '#F97316' : '#3B7BD9'}
          className={cn(
            (isThinking || isSearching) && "animate-ping",
            isSpeaking && "animate-pulse"
          )}
        />

        {/* Head/Body Capsule */}
        <rect
          x="20"
          y="25"
          width="60"
          height="50"
          rx="18"
          fill="#FFFFFF"
          stroke={isError ? '#F97316' : '#3B7BD9'}
          strokeWidth="4"
          className="shadow-md"
        />

        {/* Technical screen border */}
        <rect
          x="26"
          y="31"
          width="48"
          height="32"
          rx="8"
          fill={screenColor}
          stroke={isError ? '#FDBA74' : '#93C5FD'}
          strokeWidth="2"
        />

        {/* Screen grid lines in RAG / Searching state */}
        {(isSearching || isReading) && (
          <g opacity="0.3">
            <line x1="26" y1="39" x2="74" y2="39" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="26" y1="47" x2="74" y2="47" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="26" y1="55" x2="74" y2="55" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="38" y1="31" x2="38" y2="63" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="31" x2="50" y2="63" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="62" y1="31" x2="62" y2="63" stroke="#3B7BD9" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}

        {/* Eyes / Face expressions */}
        {isError && (
          <g>
            {/* Error X eyes or Warning shape */}
            <path d="M38 42 L46 50 M46 42 L38 50" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <path d="M54 42 L62 50 M62 42 L54 50" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            {/* Warning exclamation inside bubble */}
            <rect x="47" y="54" width="6" height="4" rx="1" fill="#EF4444" />
          </g>
        )}

        {isThinking && (
          <g>
            {/* Processing spinning loading dots */}
            <circle cx="36" cy="47" r="3.5" fill="#3B7BD9" className="animate-dot-1" />
            <circle cx="50" cy="47" r="3.5" fill="#3B7BD9" className="animate-dot-2" />
            <circle cx="64" cy="47" r="3.5" fill="#3B7BD9" className="animate-dot-3" />
          </g>
        )}

        {isSearching && (
          <g>
            {/* Radar scanner sweep line */}
            <line
              x1="28"
              y1="47"
              x2="72"
              y2="47"
              stroke="#24A1DE"
              strokeWidth="2.5"
              className="animate-scan"
            />
            {/* Square eye frames */}
            <rect x="34" y="42" width="10" height="10" rx="2" stroke="#3B7BD9" strokeWidth="2" fill="none" />
            <rect x="56" y="42" width="10" height="10" rx="2" stroke="#3B7BD9" strokeWidth="2" fill="none" />
          </g>
        )}

        {isReading && (
          <g>
            {/* Reading spectacles or schematic overlays */}
            <path d="M32 45 H46 M54 45 H68" stroke="#3B7BD9" strokeWidth="3" strokeLinecap="round" />
            <circle cx="39" cy="45" r="5" stroke="#3B7BD9" strokeWidth="2" fill="none" />
            <circle cx="61" cy="45" r="5" stroke="#3B7BD9" strokeWidth="2" fill="none" />
            <line x1="44" y1="45" x2="56" y2="45" stroke="#3B7BD9" strokeWidth="2" />
            {/* Mini schematic document */}
            <path d="M44 53 H56 M44 57 H52" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {isTyping && (
          <g>
            {/* Concentrated eyes */}
            <path d="M34 44 H44 M56 44 H66" stroke="#3B7BD9" strokeWidth="3" strokeLinecap="round" />
            {/* Keyboard matrix indicator */}
            <rect x="42" y="52" width="16" height="8" rx="2" fill="#E2E8F0" />
            <circle cx="45" cy="56" r="1" fill="#3B7BD9" className="animate-ping" />
            <circle cx="50" cy="56" r="1" fill="#3B7BD9" />
            <circle cx="55" cy="56" r="1" fill="#3B7BD9" />
          </g>
        )}

        {isSpeaking && (
          <g>
            {/* Equalizer lines in screen */}
            <line x1="36" y1="52" x2="36" y2="42" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" className="animate-eq-1" />
            <line x1="43" y1="55" x2="43" y2="39" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" className="animate-eq-2" />
            <line x1="50" y1="52" x2="50" y2="42" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" className="animate-eq-3" />
            <line x1="57" y1="56" x2="57" y2="37" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" className="animate-eq-4" />
            <line x1="64" y1="52" x2="64" y2="42" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" className="animate-eq-1" />
          </g>
        )}

        {/* Greeting / Waving / Idle & Hover expressions */}
        {(state === 'idle' || state === 'greeting' || isHovered) && (
          <g>
            {/* Smiling / curious eyes */}
            {blink ? (
              <g>
                <path d="M34 47 H44 M56 47 H66" stroke="#3B7BD9" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                {/* Curved happy eyes */}
                <path d="M34 49 C34 45 44 45 44 49" stroke="#3B7BD9" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M56 49 C56 45 66 45 66 49" stroke="#3B7BD9" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Waving arm (Right arm) */}
            {state === 'greeting' ? (
              <g className="origin-right-arm animate-wave">
                <path d="M80 50 C86 42 90 44 94 40" stroke="#3B7BD9" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="94" cy="40" r="3" fill="#3B7BD9" />
              </g>
            ) : (
              // Normal arm
              <g>
                <path d="M80 50 C84 55 86 60 84 66" stroke="#3B7BD9" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="84" cy="66" r="3" fill="#3B7BD9" />
              </g>
            )}

            {/* Left arm */}
            <path d="M20 50 C16 55 14 60 16 66" stroke="#3B7BD9" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="16" cy="66" r="3" fill="#3B7BD9" />

            {/* Mouth */}
            <path d="M46 56 Q50 60 54 56" stroke="#3B7BD9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Small Technical Details: Wheels / Feet */}
        <rect x="34" y="74" width="10" height="8" rx="3" fill="#E2E8F0" stroke="#3B7BD9" strokeWidth="2" />
        <rect x="56" y="74" width="10" height="8" rx="3" fill="#E2E8F0" stroke="#3B7BD9" strokeWidth="2" />
        <line x1="28" y1="81" x2="72" y2="81" stroke="#3B7BD9" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Embedded CSS Animations for custom states */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-25deg); }
        }
        .animate-wave {
          transform-origin: 80px 50px;
          animation: wave 1.2s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: float 4s infinite ease-in-out;
        }
        @keyframes scan {
          0%, 100% { transform: translateY(-10px); opacity: 0; }
          10%, 90% { opacity: 0.8; }
          50% { transform: translateY(12px); }
        }
        .animate-scan {
          animation: scan 2s infinite linear;
        }
        @keyframes eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.1); }
        }
        .animate-eq-1 { transform-origin: center bottom; animation: eq 0.6s infinite ease-in-out; }
        .animate-eq-2 { transform-origin: center bottom; animation: eq 0.4s infinite ease-in-out; }
        .animate-eq-3 { transform-origin: center bottom; animation: eq 0.8s infinite ease-in-out; }
        .animate-eq-4 { transform-origin: center bottom; animation: eq 0.5s infinite ease-in-out; }

        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .animate-dot-1 { animation: dot-bounce 1s infinite 0s ease-in-out; }
        .animate-dot-2 { animation: dot-bounce 1s infinite 0.2s ease-in-out; }
        .animate-dot-3 { animation: dot-bounce 1s infinite 0.4s ease-in-out; }
      `}} />
    </div>
  );
}
