// Decision Card Modal for Events

import React from 'react';
import type { GameEvent, DecisionChoice } from '../../types/game';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface DecisionModalProps {
  event: GameEvent;
  onSelectChoice: (choice: DecisionChoice) => void;
  onOpenWhy: (whyId: string) => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  event,
  onSelectChoice,
  onOpenWhy
}) => {
  const renderIllustration = () => {
    switch (event.illustrationType) {
      case 'dust_storm':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-amber-950/60 to-orange-950/40 border border-amber-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:16px_16px] opacity-40 animate-pulse" />
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">🌪️</span>
              <span className="font-mono text-xs text-amber-300 font-bold tracking-widest uppercase">
                ATMOSPHERIC DUST FRONT
              </span>
            </div>
          </div>
        );
      case 'greenhouse_stress':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">🌱</span>
              <span className="font-mono text-xs text-emerald-300 font-bold tracking-widest uppercase">
                HYDROPONIC SYSTEM IMBALANCE
              </span>
            </div>
          </div>
        );
      case 'radiation_spike':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-purple-950/60 to-red-950/40 border border-purple-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">☀️</span>
              <span className="font-mono text-xs text-purple-300 font-bold tracking-widest uppercase animate-pulse">
                CORONAL MASS EJECTION / PROTON FLUX
              </span>
            </div>
          </div>
        );
      case 'power_shortage':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-yellow-950/60 to-amber-950/40 border border-yellow-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">⚡</span>
              <span className="font-mono text-xs text-yellow-300 font-bold tracking-widest uppercase">
                ELECTRICAL BUS OVERLOAD
              </span>
            </div>
          </div>
        );
      case 'water_leak':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-sky-950/60 to-blue-950/40 border border-sky-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">💧</span>
              <span className="font-mono text-xs text-sky-300 font-bold tracking-widest uppercase">
                ECLSS WATER LOOP CONSTRICTION
              </span>
            </div>
          </div>
        );
      case 'discovery':
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">🔬</span>
              <span className="font-mono text-xs text-indigo-300 font-bold tracking-widest uppercase">
                PLANETARY GEOLOGICAL ANOMALY
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10">
              <span className="text-3xl block mb-1">🔧</span>
              <span className="font-mono text-xs text-slate-300 font-bold tracking-widest uppercase">
                MECHANICAL TELEMETRY ANOMALY
              </span>
            </div>
          </div>
        );
    }
  };

  const handleChoice = (c: DecisionChoice) => {
    sound.playClick();
    onSelectChoice(c);
  };

  const firstWhyId = event.choices[0]?.educationalWhyId || 'systems_engineering_redundancy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0D1527] border border-[#52D6FF]/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {event.urgency} PRIORITY EVENT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              // TELEMETRY ALERT
            </span>
          </div>

          {/* Educational "Why did this happen?" button */}
          <button
            onClick={() => onOpenWhy(firstWhyId)}
            className="px-2.5 py-1 rounded bg-[#52D6FF]/15 border border-[#52D6FF]/40 text-[#52D6FF] hover:bg-[#52D6FF]/25 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Learn the NASA STEM physics behind this event"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            WHY DID THIS HAPPEN?
          </button>
        </div>

        {/* Event Title */}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 tracking-tight">
          {event.title}
        </h2>

        {/* Visual Illustration Banner */}
        <div className="mb-4">
          {renderIllustration()}
        </div>

        {/* Story Narrative & Telemetry */}
        <div className="space-y-2 mb-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            {event.storyContext}
          </p>
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 font-mono text-xs text-amber-300/90 flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">TELEMETRY:</span>
            <span>{event.telemetrySnapshotText}</span>
          </div>
        </div>

        {/* Decision Choices */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            SELECT COMMAND DIRECTIVE:
          </div>
          {event.choices.map((choice, idx) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3.5 rounded-xl bg-[#141F36] hover:bg-[#1C2C4E] border border-slate-700 hover:border-[#52D6FF]/60 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-display font-bold text-sm text-white group-hover:text-[#52D6FF] transition-colors flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0A1020] border border-slate-600 flex items-center justify-center text-xs font-mono text-slate-300">
                    {idx + 1}
                  </span>
                  {choice.label}
                </span>
                <CheckCircle2 className="w-4 h-4 text-slate-500 group-hover:text-[#52D6FF] shrink-0 transition-colors" />
              </div>

              <p className="text-xs text-slate-300 mb-2 pl-7 leading-relaxed">
                {choice.description}
              </p>

              <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="text-emerald-400">
                  <strong className="text-slate-400">Immediate:</strong> {choice.immediateEffectsSummary}
                </div>
                <div className="text-amber-300">
                  <strong className="text-slate-400">Trade-Off:</strong> {choice.tradeoffHint}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
