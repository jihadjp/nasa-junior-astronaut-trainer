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
  Satellite,
  Maximize2,
  Minimize2,
  Compass,
  BookOpen,
  Camera
} from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { CinematicOutpostCanvas, type CameraPreset } from '../3d/CinematicOutpostCanvas';

interface LandingHeroProps {
  onStartMission: (dest?: 'moon' | 'mars') => void;
  onResumeMission?: () => void;
  hasSavedMission?: boolean;
  savedMissionDay?: number;
  onStartDemo: () => void;
  onOpenAcademy?: () => void;
  onOpenTeacher: () => void;
  onOpenSources: () => void;
  onToggleCommanderMode: (dest?: 'moon' | 'mars') => void;
  onOpenTutorial?: () => void;
  onOpenSettings?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartMission,
  onResumeMission,
  hasSavedMission,
  savedMissionDay,
  onStartDemo,
  onOpenAcademy,
  onOpenTeacher,
  onOpenSources,
  onToggleCommanderMode,
  onOpenTutorial,
  onOpenSettings
}) => {
  const { t, formatNum, language } = useLanguage();
  const isBn = language === 'bn';
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [selectedPlanet, setSelectedPlanet] = useState<'moon' | 'mars'>('moon');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('cinematic');
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [isCommander, setIsCommander] = useState(false);

  // Subtle ambient audio cue on title screen interaction
  useEffect(() => {
    sound.startAmbient();
  }, []);

  const handleStart = () => {
    sound.playClick();
    onStartMission(selectedPlanet);
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

  const handleAcademy = () => {
    sound.playClick();
    if (onOpenAcademy) onOpenAcademy();
  };

  const toggleSound = () => {
    const nextState = !sound.toggleMute();
    setIsMuted(nextState);
  };

  const handlePlanetSwitch = (planet: 'moon' | 'mars') => {
    sound.playClick();
    setSelectedPlanet(planet);
  };

  const handleCameraChange = (preset: CameraPreset) => {
    sound.playClick();
    setCameraPreset(preset);
  };

  return (
    <div className="w-full min-h-screen text-slate-100 relative overflow-hidden bg-[#02050E] flex flex-col justify-between selection:bg-[#52D6FF]/30 select-none">
      
      {/* 1. Real-Time 3D Celestial Lunar/Martian World (Three.js WebGL Engine) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <CinematicOutpostCanvas 
          planet={selectedPlanet}
          interactive={true}
          activePreset={cameraPreset}
          onPresetChange={setCameraPreset}
          showControls={false}
        />

        {/* Cinematic Sci-Fi Vignettes & Holographic Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#02050E] via-transparent to-[#02050E]/85" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,transparent_45%,rgba(2,5,14,0.7)_100%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      </div>

      {/* 2. Tactical Sci-Fi HUD Corner Brackets & Telemetry Lines (Decorative) */}
      <div className="absolute inset-0 pointer-events-none z-10 p-3 sm:p-5 flex flex-col justify-between">
        {/* Top Corners */}
        <div className="flex justify-between items-start text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold text-xs">⌜</span>
            <span>SYS_ONLINE // PDS-V8.3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>TARGET: {selectedPlanet.toUpperCase()} // DATUM_NOMINAL</span>
            <span className="text-cyan-400 font-bold text-xs">⌝</span>
          </div>
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between items-end text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold text-xs">⌞</span>
            <span>COORD: {selectedPlanet === 'moon' ? '-89.9°S 0.0°E' : '-4.6°S 137.4°E'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>NASA SPACE APPS 2026 // PIONEER</span>
            <span className="text-cyan-400 font-bold text-xs">⌟</span>
          </div>
        </div>
      </div>

      {/* 3. Top Header Utility Bar */}
      <nav className="w-full px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between backdrop-blur-md bg-[#02050E]/70 border-b border-slate-800/80 relative z-20">
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
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/90 hover:border-[#52D6FF] bg-slate-900/85 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer backdrop-blur-sm active:scale-95 shadow-md"
            title={isExploreMode ? "Show Menu" : "Explore 3D Base"}
          >
            {isExploreMode ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5 text-[#52D6FF]" />}
            <span className="hidden md:inline font-bold">
              {isExploreMode 
                ? (isBn ? 'মেনু দেখাও' : 'SHOW MENU') 
                : (isBn ? 'ঘাঁটি ঘুরে দেখুন' : 'EXPLORE WORLD')}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/85 text-slate-400 hover:text-white transition-all min-h-[32px] min-w-[32px] flex items-center justify-center backdrop-blur-sm cursor-pointer active:scale-95 shadow-md"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#52D6FF]" />}
          </button>

          {/* Canonical Global Language Toggle */}
          <LanguageToggle size="sm" />
        </div>
      </nav>

      {/* 4. Main Game Title & Menu Deck */}
      {!isExploreMode && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-6 text-center relative z-20 my-auto w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Target Celestial Body Quick-Picker (Tactile Game World Switcher) */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#060D1E]/90 border border-slate-700/90 shadow-2xl backdrop-blur-md mb-3 sm:mb-4">
            <button
              type="button"
              onClick={() => handlePlanetSwitch('moon')}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedPlanet === 'moon'
                  ? 'bg-gradient-to-r from-sky-500 to-[#52D6FF] text-slate-950 shadow-lg shadow-sky-500/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>🌙</span>
              <span>{isBn ? 'চাঁদ (লুনার বেস)' : 'THE MOON (ARTEMIS)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlanetSwitch('mars')}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedPlanet === 'mars'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>🔴</span>
              <span>{isBn ? 'মঙ্গল (অ্যারিস কলোনি)' : 'MARS (ARES COLONY)'}</span>
            </button>
          </div>

          {/* HERO GAME LOGO WITH CYBER-GLOW */}
          <div className="relative mb-1">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white drop-shadow-[0_15px_45px_rgba(82,214,255,0.4)] leading-none select-none">
              OUTPOST
            </h1>
            <div className="h-1 w-32 sm:w-48 mx-auto mt-1 rounded-full bg-gradient-to-r from-transparent via-[#52D6FF] to-transparent shadow-[0_0_15px_#52D6FF]" />
          </div>

          <div className="text-xs sm:text-base md:text-lg font-mono font-bold uppercase tracking-[0.25em] sm:tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-sky-300 to-[#52D6FF] mb-3 sm:mb-4">
            JUNIOR ASTRONAUT MISSION TRAINER
          </div>

          {/* Tactical Subtitle / Tagline */}
          <p className="text-xs sm:text-sm font-sans text-slate-300/90 mb-5 sm:mb-6 max-w-lg mx-auto drop-shadow-md leading-relaxed">
            {isBn 
              ? 'নাসার আসল প্ল্যানেটারি ডেটা ও সারভাইভাল ইঞ্জিনিয়ারিং-চালিত মহাকাশ সিমুলেশন গেম'
              : 'Authentic NASA Planetary Science & Closed-Loop Extraterrestrial Base Survival'}
          </p>

          {/* ACTION BUTTON DECK (GAME FIRST) */}
          <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-2.5 sm:gap-3">
            
            {/* Resume Expedition (if save game exists) */}
            {hasSavedMission && onResumeMission && (
              <button
                type="button"
                onClick={handleResume}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_40px_rgba(16,185,129,0.45)] active:scale-98 transition-all group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" />
                <span>
                  {isBn 
                    ? `অভিযানে ফিরে যাও (দিন ${formatNum(savedMissionDay || 1)})` 
                    : `CONTINUE EXPEDITION (SOL ${savedMissionDay || 1})`}
                </span>
              </button>
            )}

            {/* Primary Action: Launch Expedition */}
            <button
              type="button"
              onClick={handleStart}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl text-slate-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 active:scale-98 transition-all group cursor-pointer ${
                hasSavedMission
                  ? 'bg-[#0E172C]/90 hover:bg-[#162340] text-slate-200 border-2 border-slate-700 hover:border-[#52D6FF] shadow-xl'
                  : 'bg-gradient-to-r from-[#00D4FF] via-[#38BDF8] to-[#2563EB] hover:from-[#38BDF8] hover:to-[#1D4ED8] shadow-[0_0_45px_rgba(0,212,255,0.5)]'
              }`}
            >
              <Rocket className="w-5 h-5 fill-current shrink-0 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              <span>
                {hasSavedMission 
                  ? (isBn ? `নতুন অভিযান শুরু করো (${selectedPlanet === 'moon' ? 'চাঁদ' : 'মঙ্গল'})` : `LAUNCH NEW EXPEDITION (${selectedPlanet.toUpperCase()})`)
                  : (isBn ? `অভিযান শুরু করো (${selectedPlanet === 'moon' ? 'চাঁদ' : 'মঙ্গল'})` : `LAUNCH EXPEDITION (${selectedPlanet.toUpperCase()})`)}
              </span>
            </button>

            {/* Secondary Action Matrix (4 Tactical Buttons) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {/* 60s Demo */}
              <button
                type="button"
                onClick={handleDemo}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-purple-500/40 text-purple-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm shadow-md"
                title="60-second judging demo showcase"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? 'ডেমো টেস্ট' : 'DEMO (60S)'}</span>
              </button>

              {/* Cadet Academy (Learn) */}
              <button
                type="button"
                onClick={handleAcademy}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-[#52D6FF]/40 text-[#52D6FF] hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm shadow-md"
                title="STEM Training Academy & Interactive Labs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isBn ? 'একাডেমি' : 'ACADEMY'}</span>
              </button>

              {/* How to Play Tutorial */}
              <button
                type="button"
                onClick={handleTutorial}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-sky-500/40 text-sky-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm shadow-md"
                title="How to Play Manual"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isBn ? 'নির্দেশিকা' : 'MANUAL'}</span>
              </button>

              {/* Simulator Settings */}
              <button
                type="button"
                onClick={handleSettings}
                className="py-2.5 px-3 rounded-xl bg-[#090F20]/90 hover:bg-[#121E3B] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm shadow-md"
                title="Simulator Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isBn ? 'সেটিংস' : 'CONFIG'}</span>
              </button>
            </div>

            {/* Tactical Difficulty Selector: Cadet vs Commander */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#081124]/90 border border-slate-800 text-xs font-mono mt-1">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'অভিযান মোড:' : 'MODE:'}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsCommander(false)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    !isCommander ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isBn ? 'ক্যাডেট (সহজ)' : 'CADET'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCommander(true);
                    onToggleCommanderMode(selectedPlanet);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    isCommander ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isBn ? 'কমান্ডার (প্রো)' : 'COMMANDER'}
                </button>
              </div>
            </div>

            {/* Floating 3D Camera Presets Switcher Bar */}
            <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Camera className="w-3 h-3 text-[#52D6FF]" />
                <span className="hidden sm:inline">CAMERA:</span>
              </span>
              <button
                type="button"
                onClick={() => handleCameraChange('cinematic')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  cameraPreset === 'cinematic' ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF] font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                CINEMATIC
              </button>
              <button
                type="button"
                onClick={() => handleCameraChange('habitat')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  cameraPreset === 'habitat' ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF] font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                BASE HAB
              </button>
              <button
                type="button"
                onClick={() => handleCameraChange('rover')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  cameraPreset === 'rover' ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF] font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                ROVER
              </button>
              <button
                type="button"
                onClick={() => handleCameraChange('earth')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  cameraPreset === 'earth' ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF] font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                }`}
              >
                ORBIT
              </button>
            </div>
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
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] text-slate-950 font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_35px_rgba(82,214,255,0.7)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isBn ? 'মিশন মেনুতে ফিরে যান' : 'RETURN TO MISSION MENU'}</span>
          </button>
        </div>
      )}

      {/* 5. Streamlined Game Footer with Live Telemetry Citations */}
      <footer className="w-full px-4 sm:px-8 py-2.5 sm:py-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur-md bg-[#02050E]/85">
        <div className="flex items-center gap-2 text-slate-300">
          <Satellite className="w-3.5 h-3.5 text-[#52D6FF]" />
          <span>NASA Planetary Data System (LRO LOLA/Diviner & MRO HiRISE/CRISM)</span>
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
