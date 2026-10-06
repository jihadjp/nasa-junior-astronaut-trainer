// Route /mission : Mission Location Selection (Moon vs Mars)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Thermometer, 
  ShieldAlert, 
  Wind, 
  Clock, 
  Info, 
  X 
} from 'lucide-react';
import type { DestinationType } from '../types/game';

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { destConfig, setDestConfig } = useMission();
  const { t, language } = useLanguage();

  const [activeEduModal, setActiveEduModal] = useState<DestinationType | null>(null);

  const handleSelect = (dest: DestinationType) => {
    sound.playClick();
    setDestConfig(dest);
  };

  const handleContinue = () => {
    sound.playClick();
    navigate('/mission/setup');
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Header Directive */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827] border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono mb-3 shadow-md">
            <Compass className="w-4 h-4" />
            <span>{t('dest.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
            {t('loc.title')}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('loc.subtitle')}
          </p>
        </div>

        {/* 2 Large Visual Planet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {/* Card 1: The Moon */}
          <div
            onClick={() => handleSelect('moon')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
              destConfig === 'moon'
                ? 'bg-gradient-to-b from-[#0F1B33] to-[#0A1122] border-[#52D6FF] shadow-[0_0_35px_-5px_rgba(82,214,255,0.35)] ring-2 ring-[#52D6FF]'
                : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#131E33]/60'
            }`}
          >
            {destConfig === 'moon' && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-xs font-extrabold tracking-wider shadow-md">
                {t('common.selected')}
              </div>
            )}

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                  🌙
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                    {t('dest.moon.name')}
                  </h2>
                  <span className="text-xs font-mono text-[#52D6FF]">
                    {t('dest.moon.loc')}
                  </span>
                </div>
              </div>

              {/* Core Physical Environment Stats */}
              <div className="space-y-2.5 mb-6 bg-[#060B18]/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    {language === 'bn' ? 'তাপমাত্রা:' : 'Temperature:'}
                  </span>
                  <span className="font-bold text-rose-300">-130°C ~ +120°C</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    {language === 'bn' ? 'বিকিরণ ঝুঁকি:' : 'Radiation:'}
                  </span>
                  <span className="font-bold text-purple-300">
                    {language === 'bn' ? 'চরম (কোনো বায়ুমণ্ডল নেই)' : 'Extreme (No Atmosphere)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    {language === 'bn' ? 'পৃথিবী থেকে দূরত্ব:' : 'Travel Time:'}
                  </span>
                  <span className="font-bold text-sky-300">
                    {language === 'bn' ? '৩ দিন (দ্রুত সরবরাহ)' : '3 Days (Fast Resupply)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progressive Disclosure Link */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setActiveEduModal('moon');
                }}
                className="text-xs font-mono text-[#52D6FF] hover:text-white flex items-center gap-1.5 transition-colors group/btn"
              >
                <Info className="w-4 h-4 text-[#52D6FF] group-hover/btn:scale-110 transition-transform" />
                <span className="underline decoration-dotted">{t('loc.moon.learn')}</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {language === 'bn' ? 'চন্দ্রপৃষ্ঠ ঘাঁটি' : 'Shackleton Crater'}
              </span>
            </div>
          </div>

          {/* Card 2: Mars */}
          <div
            onClick={() => handleSelect('mars')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
              destConfig === 'mars'
                ? 'bg-gradient-to-b from-[#2B1414] to-[#160B0B] border-red-500 shadow-[0_0_35px_-5px_rgba(239,68,68,0.35)] ring-2 ring-red-500'
                : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#1C1720]/60'
            }`}
          >
            {destConfig === 'mars' && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500 text-white font-mono text-xs font-extrabold tracking-wider shadow-md">
                {t('common.selected')}
              </div>
            )}

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-900/60 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform">
                  🔴
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                    {t('dest.mars.name')}
                  </h2>
                  <span className="text-xs font-mono text-red-400">
                    {t('dest.mars.loc')}
                  </span>
                </div>
              </div>

              {/* Core Physical Environment Stats */}
              <div className="space-y-2.5 mb-6 bg-[#060B18]/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    {language === 'bn' ? 'তাপমাত্রা:' : 'Temperature:'}
                  </span>
                  <span className="font-bold text-rose-300">-140°C ~ +20°C</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-orange-400" />
                    {language === 'bn' ? 'পরিবেশগত ঝুঁকি:' : 'Atmosphere:'}
                  </span>
                  <span className="font-bold text-orange-300">
                    {language === 'bn' ? 'ধূলিঝড় ও পাতলা CO₂ বাতাস' : 'Dust Storms & Thin CO₂'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {language === 'bn' ? 'পৃথিবী থেকে দূরত্ব:' : 'Travel Time:'}
                  </span>
                  <span className="font-bold text-amber-300">
                    {language === 'bn' ? '৬-৯ মাস (সম্পূর্ণ স্বাবলম্বী)' : '6-9 Months (Autonomous)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progressive Disclosure Link */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setActiveEduModal('mars');
                }}
                className="text-xs font-mono text-red-400 hover:text-white flex items-center gap-1.5 transition-colors group/btn"
              >
                <Info className="w-4 h-4 text-red-400 group-hover/btn:scale-110 transition-transform" />
                <span className="underline decoration-dotted">{t('loc.mars.learn')}</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {language === 'bn' ? 'জেজেরো ক্র্যাটার' : 'Jezero Station'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </button>

          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:shadow-[#52D6FF]/25 hover:scale-105 transition-all"
          >
            <span>{t('loc.btn.continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Progressive Disclosure Educational Modal */}
      {activeEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0B1222] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setActiveEduModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeEduModal === 'moon' ? '🌙' : '🔴'}</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">
                  {activeEduModal === 'moon' ? t('dest.moon.name') : t('dest.mars.name')}
                </h3>
                <span className="text-xs font-mono text-[#52D6FF]">
                  {activeEduModal === 'moon' ? 'NASA Artemis Scientific Baseline' : 'NASA Mars 2020 Telemetry Baseline'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-6">
              <p>
                {activeEduModal === 'moon' ? t('dest.moon.desc') : t('dest.mars.desc')}
              </p>
              <div className="p-3 rounded-xl bg-[#060B18] border-l-4 border-[#52D6FF] font-mono text-xs text-sky-200">
                {activeEduModal === 'moon' ? t('dest.moon.challenge') : t('dest.mars.challenge')}
              </div>
            </div>

            <button
              onClick={() => setActiveEduModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
