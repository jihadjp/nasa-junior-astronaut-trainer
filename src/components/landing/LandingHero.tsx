// Cinematic Landing Hero & Educational Overview with Authentic NASA Photorealistic Imagery
import React from 'react';
import { 
  Play, 
  Rocket, 
  GraduationCap, 
  Eye, 
  Sparkles, 
  Wind, 
  Droplets, 
  Zap, 
  Apple, 
  Shield, 
  Wrench, 
  ArrowRight, 
  Radio, 
  Activity 
} from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

interface LandingHeroProps {
  onStartMission: () => void;
  onResumeMission?: () => void;
  hasSavedMission?: boolean;
  savedMissionDay?: number;
  onStartDemo: () => void;
  onOpenTeacher: () => void;
  onOpenSources: () => void;
  onToggleCommanderMode: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartMission,
  onResumeMission,
  hasSavedMission,
  savedMissionDay,
  onStartDemo,
  onOpenTeacher,
  onOpenSources,
  onToggleCommanderMode
}) => {
  const { t, formatNum, language } = useLanguage();

  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  const handleDemo = () => {
    sound.playClick();
    onStartDemo();
  };

  return (
    <div className="w-full min-h-screen text-slate-100 relative overflow-hidden bg-[#050914] flex flex-col justify-between selection:bg-[#52D6FF]/30">
      {/* 1. Cinematic Photorealistic Space Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero_lunar.jpg"
          alt="NASA Lunar and Martian Outpost Simulation"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-125 saturate-110 pointer-events-none transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Vignette & Radial Atmospheric Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/75 to-[#050914]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-[#050914]/60 to-[#050914]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      </div>

      {/* Top Mission Control Bar */}
      <nav className="w-full px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse shadow-[0_0_10px_#52D6FF] shrink-0" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-widest text-white truncate">
            {t('nav.brand')}
          </span>
          <span className="hidden md:inline text-[11px] font-mono text-slate-400 border-l border-slate-700 pl-3">
            NASA SPACE APPS CHALLENGE 2026
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle />

          <button
            onClick={onOpenTeacher}
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all hidden sm:flex items-center gap-1.5 backdrop-blur-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('nav.teacher')}</span>
          </button>

          <button
            onClick={onOpenSources}
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all hidden sm:flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
            <span>{t('nav.sources')}</span>
          </button>
        </div>
      </nav>

      {/* Hero Central Showcase */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 text-center relative z-10 my-auto w-full">
        {/* Mission Status Callout Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101827]/90 border border-[#52D6FF]/40 text-[#52D6FF] text-[11px] sm:text-xs font-mono mb-4 sm:mb-6 shadow-xl backdrop-blur-md animate-in fade-in duration-700">
          <Radio className="w-3.5 h-3.5 text-[#52D6FF] animate-pulse shrink-0" />
          <span>{t('landing.badge')}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white mb-2 sm:mb-3 leading-tight sm:leading-none drop-shadow-2xl">
          {t('landing.title')}
        </h1>

        <div className="text-base sm:text-2xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-[#52D6FF] mb-3 sm:mb-4 tracking-wide">
          {t('landing.subtitle')}
        </div>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 font-sans leading-relaxed drop-shadow-md">
          {t('landing.quote')}
          <br className="hidden sm:inline" />
          {' '}{t('landing.desc')}
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-14 max-w-md sm:max-w-none mx-auto w-full">
          {hasSavedMission && onResumeMission && (
            <button
              onClick={() => {
                sound.playClick();
                onResumeMission();
              }}
              className="min-h-[46px] py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-emerald-500/30 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current shrink-0" />
              <span>
                {language === 'bn' 
                  ? `অভিযানে ফিরে যাও (দিন ${formatNum(savedMissionDay || 1)})` 
                  : `RESUME EXPEDITION (DAY ${savedMissionDay || 1})`}
              </span>
            </button>
          )}

          <button
            onClick={handleStart}
            className="min-h-[46px] py-3 sm:py-3.5 px-6 sm:px-9 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl hover:shadow-[#52D6FF]/30 active:scale-95 transition-all"
          >
            <Rocket className="w-5 h-5 fill-current shrink-0" />
            <span>
              {hasSavedMission 
                ? (language === 'bn' ? 'নতুন অভিযান শুরু করো' : 'START NEW EXPEDITION')
                : t('landing.btn.start')}
            </span>
          </button>

          <button
            onClick={handleDemo}
            className="min-h-[46px] py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl bg-[#101827]/90 hover:bg-[#152238] border border-purple-500/40 text-purple-300 font-mono font-medium text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md shadow-lg hover:border-purple-400 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>{t('landing.btn.demo')}</span>
          </button>

          <button
            onClick={onToggleCommanderMode}
            className="min-h-[46px] py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl bg-[#101827]/90 hover:bg-[#152238] border border-amber-500/40 text-amber-300 font-mono font-medium text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md shadow-lg hover:border-amber-400 active:scale-95 transition-all hidden xs:flex"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>{t('landing.btn.commander')}</span>
          </button>
        </div>

        {/* 2. REALISTIC PLANETARY THEATERS PREVIEW (Moon & Mars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          {/* Moon Card Preview */}
          <div 
            onClick={handleStart}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-700/80 hover:border-[#52D6FF] bg-[#0A1122]/90 backdrop-blur-md transition-all duration-300 shadow-2xl relative"
          >
            <div className="h-44 w-full relative overflow-hidden">
              <img
                src="/assets/moon_outpost.jpg"
                alt="NASA Artemis Lunar Outpost"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1122] via-[#0A1122]/40 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1.5">
                <span>🌙</span>
                <span>{language === 'bn' ? 'চাঁদ: শ্যাকলটন ক্র্যাটার' : 'MOON: SHACKLETON CRATER'}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-display font-bold text-white group-hover:text-[#52D6FF] transition-colors flex items-center justify-between mb-2">
                <span>{language === 'bn' ? 'আর্টেমিস লুনার বেস ক্যাম্প' : 'Artemis Lunar Base Camp'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                {language === 'bn' 
                  ? 'তীব্র কসমিক বিকিরণ, ১৪ দিনের অন্ধকার রাত এবং চরম তাপমাত্রা (-১৩০°C থেকে +১২০°C)।' 
                  : 'Zero atmosphere, unmitigated cosmic radiation, and 14-day lunar nights requiring massive battery buffers.'}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300">
                  {language === 'bn' ? 'রেগোলিথ শিল্ড' : 'Regolith Berms'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
                  {language === 'bn' ? '১৪-দিনের শক্তি রিজার্ভ' : 'RFC Fuel Cells'}
                </span>
              </div>
            </div>
          </div>

          {/* Mars Card Preview */}
          <div 
            onClick={handleStart}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-700/80 hover:border-red-500 bg-[#160B0B]/90 backdrop-blur-md transition-all duration-300 shadow-2xl relative"
          >
            <div className="h-44 w-full relative overflow-hidden">
              <img
                src="/assets/mars_outpost.jpg"
                alt="NASA Mars Research Outpost"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160B0B] via-[#160B0B]/40 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1.5">
                <span>🔴</span>
                <span>{language === 'bn' ? 'মঙ্গল: জেজেরো স্টেশন' : 'MARS: JEZERO STATION'}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-display font-bold text-white group-hover:text-red-400 transition-colors flex items-center justify-between mb-2">
                <span>{language === 'bn' ? 'মার্শিয়ান হিউম্যান রিসার্চ আউটপোস্ট' : 'Martian Human Research Outpost'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                {language === 'bn' 
                  ? 'পাতলা CO₂ বাতাস, মাসব্যাপী ধূলিঝড় এবং পৃথিবী থেকে রেডিও সিগন্যালে ২০ মিনিটের বিলম্ব।' 
                  : 'Thin CO₂ atmosphere, global solar-attenuating dust storms, and 20-minute radio communication latency.'}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                  {language === 'bn' ? 'হাইড্রোপনিক গ্রিনহাউস' : 'LED Biodome'}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300">
                  {language === 'bn' ? 'MOXIE O₂ রূপান্তর' : 'MOXIE ISRU'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* "WHY THIS MATTERS" Educational Foundation */}
        <div className="text-left bg-[#0B1222]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-12 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#52D6FF] mb-2">
            <Activity className="w-4 h-4" />
            <span>{t('landing.why.badge')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
            {t('landing.why.title')}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
            {t('landing.why.desc')}
          </p>

          {/* 6 Interconnected Systems Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Wind className="w-5 h-5 text-[#52D6FF] mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'অক্সিজেন' : 'OXYGEN'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? 'ইলেক্ট্রোলাইসিস ও উদ্ভিদ' : 'Electrolysis & Plants'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'পানি' : 'WATER'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? '৯৮% রিসাইক্লিং' : '98% Closed-Loop Recycler'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'বিদ্যুৎ' : 'POWER'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? 'সৌর প্যানেল' : 'Photovoltaic Arrays'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Apple className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'খাবার' : 'FOOD'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? 'হাইড্রোপনিক গ্রিনহাউস' : 'Hydroponic Crops'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Shield className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'সুরক্ষাবলয়' : 'SHIELDING'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? 'রেগোলিথ ও বিকিরণ শিল্ড' : 'Regolith & Water Vault'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Wrench className="w-5 h-5 text-orange-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">{language === 'bn' ? 'যন্ত্রাংশ' : 'SPARES'}</span>
              <span className="text-[10px] text-slate-400">{language === 'bn' ? 'জরুরি ৩ডি প্রিন্টিং' : '3D In-Situ Printing'}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 backdrop-blur-md bg-[#050914]/80">
        <div>
          {t('landing.footer.text')}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenSources} className="hover:text-white transition-colors">
            {t('landing.footer.sources')}
          </button>
          <span>•</span>
          <button onClick={onOpenTeacher} className="hover:text-white transition-colors">
            {t('landing.footer.teacher')}
          </button>
          <LanguageToggle className="sm:hidden" />
        </div>
      </footer>
    </div>
  );
};
