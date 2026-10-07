// Game-First Tactical Decision Modal
// Philosophy: Visual Choices, Stat Deltas, Compact "WHY?" Causal Chain, Zero Paragraphs

import React, { useState } from 'react';
import type { GameEvent, DecisionChoice } from '../../types/game';
import { 
  AlertTriangle, 
  HelpCircle, 
  Shield, 
  Zap, 
  Wrench, 
  Sprout, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { language } = useLanguage();
  const [showWhyChain, setShowWhyChain] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const getChoiceIcon = (choiceId: string) => {
    if (choiceId.includes('shield') || choiceId.includes('shelter') || choiceId.includes('protect')) return Shield;
    if (choiceId.includes('power') || choiceId.includes('battery') || choiceId.includes('solar')) return Zap;
    if (choiceId.includes('greenhouse') || choiceId.includes('crop') || choiceId.includes('food')) return Sprout;
    if (choiceId.includes('repair') || choiceId.includes('wiper') || choiceId.includes('spares')) return Wrench;
    return Activity;
  };

  const eventTitle = (language === 'bn' && event.titleBn) ? event.titleBn : event.title;
  const firstWhyId = event.choices[0]?.educationalWhyId || 'systems_engineering_redundancy';

  const handleChoice = (c: DecisionChoice) => {
    if (isExecuting) return;
    setIsExecuting(true);
    sound.playClick();
    onSelectChoice(c);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#070D1B] border-2 border-sky-400/50 rounded-2xl shadow-[0_0_50px_rgba(82,214,255,0.25)] p-4 sm:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-black tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'bn' ? 'জরুরি পরিস্থিতি' : 'TACTICAL ANOMALY'}</span>
            </span>
          </div>

          {/* Small [ ? WHY ] Button */}
          <button
            onClick={() => setShowWhyChain(!showWhyChain)}
            className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-[#52D6FF] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="View Science Causal Chain"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'কেন ঘটল? (WHY?)' : '? WHY'}</span>
          </button>
        </div>

        {/* Event Title */}
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-1">
            {eventTitle}
          </h2>
          <div className="text-xs font-mono text-amber-300 font-semibold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'bn' 
                ? 'ইঞ্জিনিয়ারিং সিদ্ধান্ত গ্রহণ করুন' 
                : 'ENGINEERING RESPONSE REQUIRED'}
            </span>
          </div>
        </div>

        {/* Collapsible Visual Causal Chain ("WHY?" System) */}
        {showWhyChain && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#030610] border border-sky-500/30 font-mono text-xs text-sky-200 animate-fadeIn">
            <div className="font-bold text-[#52D6FF] uppercase text-[11px] mb-2 flex items-center gap-1.5">
              <span>🔬</span>
              <span>{language === 'bn' ? 'কার্যকারণ শৃঙ্খল (CAUSAL CHAIN):' : 'PHYSICAL CAUSAL CHAIN:'}</span>
            </div>
            <div className="flex flex-col gap-1.5 text-[11px] text-slate-300 pl-2 border-l border-sky-500/40">
              <div className="flex items-center gap-1.5 text-amber-300">
                <span>⚡ {eventTitle}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span>↓</span>
                <span>{language === 'bn' ? 'সাবসিস্টেম লোড বৃদ্ধি' : 'Subsystem stress surge'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span>↓</span>
                <span>{language === 'bn' ? 'রিজার্ভ ব্যালেন্সের ওপর সরাসরি চাপ' : 'Direct trade-off on stored reserves'}</span>
              </div>
            </div>
            <button
              onClick={() => onOpenWhy(firstWhyId)}
              className="mt-3 text-[10px] text-sky-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>{language === 'bn' ? 'নাসা বিজ্ঞান অ্যাকাডেমি খুলুন ↗' : 'Deep NASA Science Academy ↗'}</span>
            </button>
          </div>
        )}

        {/* VISUAL CHOICE CARDS (Zero Paragraphs - Clean Trade-Offs) */}
        <div className="space-y-3">
          {event.choices.map((choice) => {
            const ChoiceIcon = getChoiceIcon(choice.id);
            const choiceLabel = (language === 'bn' && choice.labelBn) ? choice.labelBn : choice.label;
            const choiceSummary = (language === 'bn' && choice.immediateEffectsSummaryBn) 
              ? choice.immediateEffectsSummaryBn 
              : choice.immediateEffectsSummary;

            return (
              <div
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="cursor-pointer p-3.5 sm:p-4 rounded-xl bg-[#0D1830] hover:bg-[#132244] border border-slate-700/80 hover:border-[#52D6FF] transition-all group active:scale-98 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#070D1B] border border-slate-700 group-hover:border-[#52D6FF] flex items-center justify-center shrink-0 transition-colors">
                      <ChoiceIcon className="w-5 h-5 text-[#52D6FF]" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm sm:text-base text-white group-hover:text-[#52D6FF] transition-colors leading-tight">
                        {choiceLabel}
                      </h3>
                      {/* Short 1-sentence tactical summary */}
                      <p className="text-xs text-slate-300 font-sans mt-0.5">
                        {choiceSummary}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#52D6FF] group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
