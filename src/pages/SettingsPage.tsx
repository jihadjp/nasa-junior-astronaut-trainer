// Route /settings : Master Simulator Configuration & Accessibility
import React, { useState } from 'react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Globe, 
  Trash2, 
  Eye, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    isSoundMuted, 
    handleToggleMute, 
    clearSaveData, 
    hasSavedMission, 
    gameState 
  } = useMission();
  const { t, formatNum, language, setLanguage } = useLanguage();

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return document.documentElement.classList.contains('reduced-motion');
  });

  const [clearStatusMsg, setClearStatusMsg] = useState<string | null>(null);

  const toggleReducedMotion = () => {
    sound.playClick();
    const next = !reducedMotion;
    setReducedMotion(next);
    if (next) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  const handleClearData = () => {
    sound.playClick();
    if (window.confirm(language === 'bn' 
      ? 'তুমি কি সত্যিই সংরক্ষিত মিশন ডেটা মুছে ফেলতে চাও?' 
      : 'Are you sure you want to delete all saved mission data?')) {
      clearSaveData();
      setClearStatusMsg(t('settings.storage.cleared'));
      setTimeout(() => setClearStatusMsg(null), 4000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center animate-fadeIn">
        <div className="bg-[#0B1222] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-800 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>{t('settings.badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2">
              {t('settings.title')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              {t('settings.desc')}
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Language Toggle Section */}
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-[#52D6FF]" />
                  <span>{language === 'bn' ? 'ভাষা নির্বাচন (Language Toggle)' : 'Language Selection'}</span>
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  {language === 'bn' 
                    ? 'বাংলা অথবা ইংরেজিতে সম্পূর্ণ সিমুলেটর উপভোগ করো।' 
                    : 'Switch instantly between English and child-friendly Bengali.'}
                </p>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-[#0F172A] border border-slate-700">
                <button
                  onClick={() => {
                    sound.playClick();
                    setLanguage('bn');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    language === 'bn'
                      ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇧🇩 বাংলা
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setLanguage('en');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    language === 'en'
                      ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English 🇬🇧
                </button>
              </div>
            </div>

            {/* 2. Audio & Synthesizer Controls */}
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2 mb-1">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{t('settings.audio.title')}</span>
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  {language === 'bn' 
                    ? 'টেলিমিতি বিপ, মহাকাশ আবহ ও জরুরি সতর্কতার অডিও সিন্থেসাইজার।' 
                    : 'Synthesizer telemetry audio, atmospheric background, and hazard alarm pings.'}
                </p>
              </div>

              <button
                onClick={handleToggleMute}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 ${
                  isSoundMuted
                    ? 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/40'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                }`}
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSoundMuted ? (language === 'bn' ? 'সাউন্ড বন্ধ' : 'Sound Muted') : (language === 'bn' ? 'সাউন্ড চালু' : 'Sound Active')}</span>
              </button>
            </div>

            {/* 3. Accessibility & Motion */}
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>{t('settings.motion.title')}</span>
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  {t('settings.motion.desc')}
                </p>
              </div>

              <button
                onClick={toggleReducedMotion}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 ${
                  reducedMotion
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                    : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>{reducedMotion ? (language === 'bn' ? 'সচল' : 'Enabled') : (language === 'bn' ? 'বন্ধ' : 'Disabled')}</span>
              </button>
            </div>

            {/* 4. Saved Mission Storage Management */}
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2 mb-1">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>{t('settings.storage.title')}</span>
                </span>
                <p className="text-xs text-slate-400 font-sans">
                  {hasSavedMission 
                    ? t('settings.storage.active').replace('{day}', String(formatNum(gameState.missionDay)))
                    : t('settings.storage.none')}
                </p>
              </div>

              <button
                onClick={handleClearData}
                disabled={!hasSavedMission}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/40 text-rose-300 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('settings.storage.clear')}</span>
              </button>
            </div>

            {clearStatusMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>{clearStatusMsg}</span>
              </div>
            )}

            {/* 5. Attribution & NASA Space Apps Notice */}
            <div className="p-4 rounded-xl bg-[#101827] border border-slate-800 text-xs font-sans text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-200 block mb-1 font-mono text-[11px] uppercase">
                {t('settings.about.title')}
              </span>
              <p>{t('settings.about.desc')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
