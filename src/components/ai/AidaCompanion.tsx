import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { Bot, Sparkles, ChevronUp, ChevronDown, Lightbulb } from 'lucide-react';

interface AidaCompanionProps {
  state: SimulationState;
}

export const AidaCompanion: React.FC<AidaCompanionProps> = ({ state }) => {
  const { t, language } = useLanguage();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [customHintIndex, setCustomHintIndex] = useState<number | null>(null);

  const { resources, activeEvent } = state;

  // Determine dynamic advice based on base state
  const getDynamicTipKey = () => {
    if (activeEvent) {
      return language === 'bn' 
        ? `জরুরি সতর্কতা! "${activeEvent.titleBn || activeEvent.title}" সমাধান করতে ক্রুদের অগ্রাধিকার দাও!`
        : `Emergency Alert! Evaluate trade-offs carefully for "${activeEvent.title}"!`;
    }
    const o2Pct = resources.oxygenMax > 0 ? (resources.oxygen / resources.oxygenMax) * 100 : 100;
    const powerPct = resources.powerMax > 0 ? (resources.power / resources.powerMax) * 100 : 100;
    const waterPct = resources.waterMax > 0 ? (resources.water / resources.waterMax) * 100 : 100;
    const foodPct = resources.foodMax > 0 ? (resources.food / resources.foodMax) * 100 : 100;

    if (o2Pct < 35) return 'aida.tip.lowO2';
    if (powerPct < 35) return 'aida.tip.lowPower';
    if (waterPct < 30) return 'aida.tip.lowWater';
    if (foodPct < 30) return 'aida.tip.lowFood';
    return 'aida.tip.stable';
  };

  const extraHintsEn = [
    'Lunar soil (regolith) can be melted with microwaves to form solid solar-radiation bricks.',
    'Water electrolysis produces 8x more oxygen by mass than hydrogen, consuming ~4.5 kWh/kg.',
    'Astronauts consume roughly 0.84 kg of pure O2 per Earth day during nominal habitat tasks.',
    'Greenhouse plants recycle crew-exhaled CO2 into fresh oxygen via photosynthesis.',
    'A 14-day lunar night means 336 consecutive hours of zero photovoltaic power generation.'
  ];

  const extraHintsBn = [
    'চাঁদের মাটি (রেগোলিথ) মাইক্রোওয়েভ দিয়ে গলিয়ে শক্ত রেডিয়েশন প্রতিরোধী ইট তৈরি করা যায়।',
    'পানি তড়িৎ-বিশ্লেষণের মাধ্যমে প্রতি কেজিতে প্রায় ৮ গুণ বেশি অক্সিজেন পাওয়া যায়।',
    'একজন নভোচারীর স্বাভাবিক কাজের জন্য দিনে প্রায় ০.৮৪ কেজি খাঁটি অক্সিজেন প্রয়োজন হয়।',
    'গ্রিনহাউজের গাছপালা নভোচারীদের নিঃশ্বাসের বিষাক্ত CO₂ গ্রহণ করে সালোকসংশ্লেষণের মাধ্যমে O₂ ছড়ায়।',
    'চাঁদের ১৪ দিনের রাতের অর্থ হলো একটানা ৩৩৬ ঘণ্টা কোনো সৌরবিদ্যুৎ পাওয়া যাবে না।'
  ];

  const handleAskHint = () => {
    sound.playClick();
    const hints = language === 'bn' ? extraHintsBn : extraHintsEn;
    const nextIdx = customHintIndex === null ? 0 : (customHintIndex + 1) % hints.length;
    setCustomHintIndex(nextIdx);
  };

  const tipKey = getDynamicTipKey();
  const displayedMessage = customHintIndex !== null
    ? (language === 'bn' ? extraHintsBn[customHintIndex] : extraHintsEn[customHintIndex])
    : (tipKey.startsWith('aida.') ? t(tipKey as any) : tipKey);

  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-4 sm:bottom-4 z-40 sm:max-w-sm transition-all pointer-events-auto">
      <div className="bg-[#0B1222]/95 backdrop-blur-md border border-[#52D6FF]/40 rounded-2xl shadow-2xl p-3 sm:p-4 text-white overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#52D6FF]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#101827] border border-[#52D6FF] flex items-center justify-center text-[#52D6FF] shadow-inner">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wide text-white">{t('aida.name')}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#52D6FF]/20 text-[#52D6FF] font-semibold">AI COMPANION</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans hidden sm:block">{t('aida.title')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Body content */}
        {!isMinimized && (
          <div className="space-y-3 animate-fadeIn">
            {/* Speech bubble */}
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed flex items-start gap-2 shadow-inner">
              <Sparkles className="w-4 h-4 text-[#52D6FF] shrink-0 mt-0.5" />
              <div>
                <p>{displayedMessage}</p>
              </div>
            </div>

            {/* Interactive actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleAskHint}
                className="px-3 py-1.5 rounded-xl bg-[#101827] hover:bg-[#152238] border border-[#52D6FF]/40 text-[#52D6FF] hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('aida.btn.hint')}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsMinimized(true);
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                {t('aida.dismiss')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
