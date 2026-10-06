// Causal Storytelling Modal: Decision -> System Change -> Crew Effect -> Mission Outcome

import React from 'react';
import type { CausalStep } from '../../types/game';
import { ArrowDown, Check, GitCommit } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface CausalChainModalProps {
  chain: CausalStep[];
  onDismiss: () => void;
}

export const CausalChainModal: React.FC<CausalChainModalProps> = ({
  chain,
  onDismiss
}) => {
  const { t, formatNum, language } = useLanguage();

  const handleProceed = () => {
    sound.playClick();
    onDismiss();
  };

  const getStepColor = (cat: CausalStep['highlightCategory']) => {
    switch (cat) {
      case 'decision':
        return 'border-[#52D6FF] text-[#52D6FF] bg-[#52D6FF]/10';
      case 'system':
        return 'border-amber-400 text-amber-300 bg-amber-400/10';
      case 'crew':
        return 'border-rose-400 text-rose-300 bg-rose-400/10';
      case 'mission':
        return 'border-emerald-400 text-emerald-300 bg-emerald-400/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0B1220] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
            <GitCommit className="w-3.5 h-3.5" />
            {t('causal.badge')}
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            {t('causal.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('causal.desc')}
          </p>
        </div>

        {/* Causal Step Flow */}
        <div className="space-y-3 mb-6 relative">
          {chain.map((step, idx) => {
            const stepTitle = (language === 'bn' && step.titleBn) ? step.titleBn : step.title;
            const stepDesc = (language === 'bn' && step.descriptionBn) ? step.descriptionBn : step.description;
            const stepImpact = (language === 'bn' && step.metricImpactBn) ? step.metricImpactBn : step.metricImpact;

            return (
              <React.Fragment key={step.step}>
                <div className="p-3.5 rounded-xl bg-[#131C2E] border border-slate-700/80 shadow-md flex items-start gap-3">
                  {/* Icon Badge */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 ${getStepColor(step.highlightCategory)}`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-display font-bold text-sm text-white">
                        {stepTitle}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {t('causal.step', { step: formatNum(step.step) })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-1">
                      {stepDesc}
                    </p>
                    {stepImpact && (
                      <div className="text-[11px] font-mono font-semibold text-[#52D6FF]">
                        ↳ {stepImpact}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting Down Arrow */}
                {idx < chain.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer CTA */}
        <button
          onClick={handleProceed}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[#52D6FF]/20 transition-all"
        >
          <Check className="w-4 h-4" />
          {t('common.proceed')}
        </button>
      </div>
    </div>
  );
};
