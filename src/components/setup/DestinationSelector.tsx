// Destination Selector: Moon vs Mars environmental physics comparison

import React, { useState } from 'react';
import type { DestinationType } from '../../types/game';
import { Compass, Thermometer, ShieldAlert, Wind, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface DestinationSelectorProps {
  selected: DestinationType;
  onSelect: (dest: DestinationType) => void;
  onNext: () => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  selected,
  onSelect,
  onNext
}) => {
  const { t, language } = useLanguage();
  const [showMoonDetails, setShowMoonDetails] = useState<boolean>(false);
  const [showMarsDetails, setShowMarsDetails] = useState<boolean>(false);

  const handleSelect = (dest: DestinationType) => {
    sound.playClick();
    onSelect(dest);
  };

  const handleProceed = () => {
    sound.playClick();
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 text-slate-100">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Compass className="w-3.5 h-3.5" />
          {t('dest.badge')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {t('dest.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
          {t('dest.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Destination 1: The Moon */}
        <div
          onClick={() => handleSelect('moon')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            selected === 'moon'
              ? 'bg-[#0F1B33] border-[#52D6FF] shadow-[0_0_25px_-5px_rgba(82,214,255,0.3)] ring-1 ring-[#52D6FF]'
              : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#131E33]/60'
          }`}
        >
          {/* Active selection badge */}
          {selected === 'moon' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-[10px] font-bold">
              {t('common.selected')}
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌙</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">{t('dest.moon.name')}</h3>
                <span className="text-xs font-mono text-[#52D6FF]">{t('dest.moon.loc')}</span>
              </div>
            </div>

            {/* Quick Summary Pill Row */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 bg-[#060B18]/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>-130°C ~ +120°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'তীব্র বিকিরণ' : 'Zero Magnetosphere'}</span>
              </div>
            </div>

            {/* Progressive Disclosure Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMoonDetails(prev => !prev);
              }}
              className="text-xs font-mono text-[#52D6FF] hover:underline flex items-center gap-1.5 mb-3"
            >
              <span>{language === 'bn' ? 'ⓘ পরিবেশগত চ্যালেঞ্জ ও ডেটা' : 'ⓘ Environment Specs & Challenge'}</span>
              {showMoonDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showMoonDetails && (
              <div className="space-y-3 mb-4 animate-fadeIn">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {t('dest.moon.desc')}
                </p>
                <div className="text-[11px] font-mono text-sky-300/90 italic border-l-2 border-[#52D6FF] pl-2.5 py-0.5 bg-sky-950/20 rounded-r">
                  {t('dest.moon.challenge')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Destination 2: Mars */}
        <div
          onClick={() => handleSelect('mars')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            selected === 'mars'
              ? 'bg-[#261214] border-red-500 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)] ring-1 ring-red-500'
              : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#1C1720]/60'
          }`}
        >
          {selected === 'mars' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold">
              {t('common.selected')}
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🔴</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">{t('dest.mars.name')}</h3>
                <span className="text-xs font-mono text-red-400">{t('dest.mars.loc')}</span>
              </div>
            </div>

            {/* Quick Summary Pill Row */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4 bg-[#060B18]/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>-140°C ~ +20°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Wind className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'bn' ? 'ধূলিঝড় ও পাতলা বাতাস' : 'Dust Storms & CO₂'}</span>
              </div>
            </div>

            {/* Progressive Disclosure Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMarsDetails(prev => !prev);
              }}
              className="text-xs font-mono text-red-400 hover:underline flex items-center gap-1.5 mb-3"
            >
              <span>{language === 'bn' ? 'ⓘ পরিবেশগত চ্যালেঞ্জ ও ডেটা' : 'ⓘ Environment Specs & Challenge'}</span>
              {showMarsDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showMarsDetails && (
              <div className="space-y-3 mb-4 animate-fadeIn">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {t('dest.mars.desc')}
                </p>
                <div className="text-[11px] font-mono text-red-300/90 italic border-l-2 border-red-500 pl-2.5 py-0.5 bg-red-950/20 rounded-r">
                  {t('dest.mars.challenge')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleProceed}
          className="min-h-[42px] py-2.5 sm:py-3 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-[#52D6FF]/20 transition-all active:scale-95"
        >
          {t('dest.btn.confirm')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
