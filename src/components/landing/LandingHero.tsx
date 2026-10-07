// AAA Space Simulation Title Screen: OUTPOST - Junior Astronaut Mission Trainer
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Rocket, 
  GraduationCap, 
  Eye, 
  Sparkles, 
  Settings, 
  HelpCircle,
  Volume2,
  VolumeX,
  Radio,
  Satellite
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
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartMission,
  onResumeMission,
  hasSavedMission,
  savedMissionDay,
  onStartDemo,
  onOpenTeacher,
  onOpenSources,
  onToggleCommanderMode,
  onOpenTutorial,
  onOpenSettings
}) => {
  const { t, formatNum, language } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);

  // Subtle ambient audio cue on title screen interaction
  useEffect(() => {
    sound.startAmbient();
  }, []);

  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  const handleResume = () => {
    sound.playClick();
    if (onResumeMission) onResumeMission();
  };

  const handleDemo = () => {
    sound.playClick();
    onStartDemo();
  };

  const handleTutorial = () => {
    sound.playClick();
    if (onOpenTutorial) onOpenTutorial();
  };

  const handleSettings = () => {
    sound.playClick();
    if (onOpenSettings) onOpenSettings();
  };

  const toggleSound = () => {
    sound.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full min-h-screen text-slate-100 relative overflow-hidden bg-[#030712] flex flex-col justify-between selection:bg-[#52D6FF]/30 select-none">
      {/* 1. Cinematic Animated Celestial World Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Photorealistic planetary horizon */}
        <img
          src="/assets/hero_lunar.jpg"
          alt="NASA Outpost Simulation Horizon"
          className="w-full h-full object-cover object-center scale-110 filter brightness-[0.38] contrast-125 saturate-110 animate-subtle-drift"
        />

        {/* Ambient Animated Starfield & Horizon Fog Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-[#030712]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(82,214,255,0.12),transparent_70%)]" />

        {/* Pulsing Planetary Base Beacon Lights */}
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-[#52D6FF] animate-ping opacity-75" />
        <div className="absolute bottom-[28%] right-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60 delay-700" />
        <div className="absolute bottom-[26%] left-1/2 w-3 h-3 rounded-full bg-amber-400 blur-[2px] animate-pulse" />

        {/* Subtle Scanline Grid for authentic NASA Flight HUD aesthetic */}
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
      </div>

      {/* Top Header Utility Bar */}
      <nav className="w-full px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-md relative z-20">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse shadow-[0_0_12px_#52D6FF] shrink-0" />
          <span className="font-display font-black text-xs sm:text-sm tracking-[0.2em] text-white uppercase">
            {t('nav.brand')}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-sky-400/80 border-l border-slate-700/80 pl-3 uppercase tracking-wider">
            NASA SPACE APPS 2026
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/60 text-slate-400 hover:text-white transition-all min-h-[32px] min-w-[32px] flex items-center justify-center backdrop-blur-sm"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#52D6FF]" />}
          </button>

          {/* Canonical Global Language Toggle */}
          <LanguageToggle size="sm" />
        </div>
      </nav>

      {/* Main Game Title Showcase */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 text-center relative z-20 my-auto w-full flex flex-col items-center">
        {/* Mission Telemetry Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A1020]/90 border border-[#52D6FF]/40 text-[#52D6FF] text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-4 shadow-2xl backdrop-blur-md animate-fadeIn">
          <Radio className="w-3.5 h-3.5 text-[#52D6FF] animate-pulse shrink-0" />
          <span>{t('landing.badge')}</span>
        </div>

        {/* HERO GAME LOGO */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight text-white mb-1.5 drop-shadow-[0_10px_35px_rgba(82,214,255,0.25)] leading-none">
          OUTPOST
        </h1>

        <div className="text-xs sm:text-base md:text-lg font-mono font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-300 to-[#52D6FF] mb-6 sm:mb-8">
          JUNIOR ASTRONAUT MISSION TRAINER
        </div>

        {/* Tactical Subtitle / Tagline */}
        <div className="text-xs sm:text-sm font-sans text-slate-400 mb-8 sm:mb-12 max-w-md mx-auto">
          {language === 'bn' 
            ? 'বাস্তব নাসা ডেটা ও ইঞ্জিনিয়ারিং সিদ্ধান্তের শিক্ষামূলক স্পেস সিমুলেশন'
            : 'Extraterrestrial Base Simulation • Grounded in NASA Planetary Data'}
        </div>

        {/* ACTION BUTTON CLUSTER (GAME FIRST) */}
        <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-3">
          {/* Resume Expedition (if save game exists) */}
          {hasSavedMission && onResumeMission && (
            <button
              onClick={handleResume}
              className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-98 transition-all group"
            >
              <Play className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" />
              <span>
                {language === 'bn' 
                  ? `অভিযানে ফিরে যাও (দিন ${formatNum(savedMissionDay || 1)})` 
                  : `CONTINUE MISSION (DAY ${savedMissionDay || 1})`}
              </span>
            </button>
          )}

          {/* Primary Action: Start Mission */}
          <button
            onClick={handleStart}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-xl text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 active:scale-98 transition-all group ${
              hasSavedMission
                ? 'bg-[#101827]/90 hover:bg-[#18243A] text-slate-200 border border-slate-700 hover:border-[#52D6FF]'
                : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] shadow-[0_0_35px_rgba(82,214,255,0.4)]'
            }`}
          >
            <Rocket className="w-5 h-5 fill-current shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <span>
              {hasSavedMission 
                ? (language === 'bn' ? 'নতুন অভিযান শুরু করো' : 'START NEW MISSION')
                : (language === 'bn' ? 'অভিযান শুরু করো' : 'START MISSION')}
            </span>
          </button>

          {/* Secondary Action Row: Demo, How to Play, Settings */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleDemo}
              className="py-2.5 px-3 rounded-lg bg-[#0F172A]/85 hover:bg-[#1E293B] border border-purple-500/40 text-purple-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              title="60-second judging demo showcase"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('nav.demo')}</span>
            </button>

            <button
              onClick={handleTutorial}
              className="py-2.5 px-3 rounded-lg bg-[#0F172A]/85 hover:bg-[#1E293B] border border-sky-500/40 text-sky-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              title="How to Play"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'টিউটোরিয়াল' : 'HOW TO PLAY'}</span>
            </button>

            <button
              onClick={handleSettings}
              className="py-2.5 px-3 rounded-lg bg-[#0F172A]/85 hover:bg-[#1E293B] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              title="Simulator Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('nav.settings')}</span>
            </button>
          </div>

          {/* Commander Mode Quick Toggle */}
          <button
            onClick={onToggleCommanderMode}
            className="mt-2 text-[11px] font-mono text-amber-400/80 hover:text-amber-300 flex items-center justify-center gap-1.5 py-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('landing.btn.commander')}</span>
          </button>
        </div>
      </main>

      {/* Streamlined Game Footer */}
      <footer className="w-full px-4 sm:px-8 py-3 border-t border-slate-900/90 text-[11px] font-mono text-slate-500 flex items-center justify-between gap-2 z-20 backdrop-blur-sm bg-[#030712]/80">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Satellite className="w-3.5 h-3.5 text-[#52D6FF]" />
          <span>NASA Solar System Treks & PDS Integration</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onOpenTeacher} className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-purple-400" />
            <span>{t('nav.teacher')}</span>
          </button>
          <span>•</span>
          <button onClick={onOpenSources} className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>{t('nav.sources')}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
