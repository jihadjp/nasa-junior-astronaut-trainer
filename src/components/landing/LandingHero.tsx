// AAA Space Simulation Title Screen: OUTPOST - Junior Astronaut Mission Trainer
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Rocket, 
  GraduationCap, 
  Sparkles, 
  Settings, 
  HelpCircle,
  Volume2,
  VolumeX,
  Radio,
  Satellite,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { CinematicOutpostCanvas, type CameraPreset } from '../3d/CinematicOutpostCanvas';

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
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('cinematic');
  const [isExploreMode, setIsExploreMode] = useState(false);

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
    <div className="w-full min-h-screen text-slate-100 relative overflow-hidden bg-[#02050E] flex flex-col justify-between selection:bg-[#52D6FF]/30 select-none">
      {/* 1. Real-Time 3D Celestial Lunar World (Three.js WebGL Engine) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <CinematicOutpostCanvas 
          planet="moon"
          interactive={true}
          activePreset={cameraPreset}
          onPresetChange={setCameraPreset}
          showControls={true}
        />
        {/* Cinematic Vignette & Radial Focus Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#02050E] via-transparent to-[#02050E]/80" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,transparent_40%,rgba(2,5,14,0.65)_100%)]" />
      </div>

      {/* Top Header Utility Bar */}
      <nav className="w-full px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between backdrop-blur-md bg-[#02050E]/60 border-b border-slate-800/80 relative z-20 transition-opacity duration-300">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse shadow-[0_0_12px_#52D6FF] shrink-0" />
          <span className="font-display font-black text-xs sm:text-sm tracking-[0.2em] text-white uppercase">
            {t('nav.brand')}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-sky-400/90 border-l border-slate-700/80 pl-3 uppercase tracking-wider">
            NASA SPACE APPS 2026
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Explore Environment Toggle (Hides UI for Full 3D Camera Interaction) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsExploreMode(!isExploreMode);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 hover:border-[#52D6FF] bg-slate-900/80 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            title={isExploreMode ? "Show Menu" : "Explore 3D Base"}
          >
            {isExploreMode ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5 text-[#52D6FF]" />}
            <span className="hidden md:inline">
              {isExploreMode 
                ? (language === 'bn' ? 'মেনু দেখাও' : 'SHOW MENU') 
                : (language === 'bn' ? 'ঘাঁটি ঘুরে দেখুন' : 'EXPLORE WORLD')}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/70 text-slate-400 hover:text-white transition-all min-h-[32px] min-w-[32px] flex items-center justify-center backdrop-blur-sm cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#52D6FF]" />}
          </button>

          {/* Canonical Global Language Toggle */}
          <LanguageToggle size="sm" />
        </div>
      </nav>

      {/* Main Game Menu Overlay (Fades out when in Explore Mode) */}
      {!isExploreMode && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 text-center relative z-20 my-auto w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          {/* Mission Telemetry Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070E1E]/90 border border-[#52D6FF]/40 text-[#52D6FF] text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-3.5 shadow-2xl backdrop-blur-md animate-fadeIn">
            <Radio className="w-3.5 h-3.5 text-[#52D6FF] animate-pulse shrink-0" />
            <span>{t('landing.badge')}</span>
          </div>

          {/* HERO GAME LOGO */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight text-white mb-1.5 drop-shadow-[0_12px_40px_rgba(82,214,255,0.35)] leading-none">
            OUTPOST
          </h1>

          <div className="text-xs sm:text-base md:text-lg font-mono font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-300 to-[#52D6FF] mb-4 sm:mb-6">
            JUNIOR ASTRONAUT MISSION TRAINER
          </div>

          {/* Tactical Subtitle / Tagline */}
          <div className="text-xs sm:text-sm font-sans text-slate-300 mb-6 sm:mb-8 max-w-md mx-auto drop-shadow-md">
            {language === 'bn' 
              ? 'বাস্তব নাসা ডেটা ও ইঞ্জিনিয়ারিং সিদ্ধান্তের শিক্ষামূলক স্পেস সিমুলেশন'
              : 'Extraterrestrial Base Simulation • Grounded in NASA Planetary Data'}
          </div>

          {/* ACTION BUTTON CLUSTER (GAME FIRST) */}
          <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-3">
            {/* Resume Expedition (if save game exists) */}
            {hasSavedMission && onResumeMission && (
              <button
                type="button"
                onClick={handleResume}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(16,185,129,0.4)] active:scale-98 transition-all group cursor-pointer"
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
              type="button"
              onClick={handleStart}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-xl text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 active:scale-98 transition-all group cursor-pointer ${
                hasSavedMission
                  ? 'bg-[#0E172C]/90 hover:bg-[#162340] text-slate-200 border-2 border-slate-700 hover:border-[#52D6FF]'
                  : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] shadow-[0_0_40px_rgba(82,214,255,0.45)]'
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
                type="button"
                onClick={handleDemo}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-purple-500/40 text-purple-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                title="60-second judging demo showcase"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t('nav.demo')}</span>
              </button>

              <button
                type="button"
                onClick={handleTutorial}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-sky-500/40 text-sky-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                title="How to Play"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'টিউটোরিয়াল' : 'HOW TO PLAY'}</span>
              </button>

              <button
                type="button"
                onClick={handleSettings}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
                title="Simulator Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t('nav.settings')}</span>
              </button>
            </div>

            {/* Commander Mode Quick Toggle */}
            <button
              type="button"
              onClick={onToggleCommanderMode}
              className="mt-1 text-[11px] font-mono text-amber-400/90 hover:text-amber-300 flex items-center justify-center gap-1.5 py-1.5 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('landing.btn.commander')}</span>
            </button>
          </div>
        </main>
      )}

      {/* Floating Pill in Explore Mode to bring back menu */}
      {isExploreMode && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsExploreMode(false);
            }}
            className="px-5 py-2.5 rounded-full bg-[#52D6FF] text-slate-950 font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(82,214,255,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'bn' ? 'মিশন মেনুতে ফিরে যান' : 'RETURN TO MISSION MENU'}</span>
          </button>
        </div>
      )}

      {/* Streamlined Game Footer */}
      <footer className="w-full px-4 sm:px-8 py-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between gap-2 z-20 backdrop-blur-md bg-[#02050E]/80">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Satellite className="w-3.5 h-3.5 text-[#52D6FF]" />
          <span>NASA Solar System Treks & PDS Integration</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onOpenTeacher} 
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('nav.teacher')}</span>
          </button>
          <span>•</span>
          <button 
            type="button"
            onClick={onOpenSources} 
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('nav.sources')}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
