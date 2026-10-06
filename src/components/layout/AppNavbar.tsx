// Global Navigation Bar for Non-Simulation Screens
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, GraduationCap, BookOpen, Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMission } from '../../context/MissionContext';

export const AppNavbar: React.FC = () => {
  const { t, formatNum, language } = useLanguage();
  const location = useLocation();
  const { 
    gameState, 
    hasSavedMission, 
    isSoundMuted, 
    handleToggleMute,
    setShowSourcesModal
  } = useMission();

  const isHome = location.pathname === '/';

  return (
    <nav className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-[#060B18]/90 backdrop-blur-md relative z-30">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] group-hover:scale-125 transition-transform animate-pulse" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-widest text-white group-hover:text-[#52D6FF] transition-colors">
            {t('nav.brand')}
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden md:inline border-l border-slate-700 pl-2">
            NASA SPACE APPS 2026
          </span>
        </Link>
      </div>

      {/* Center/Right Nav Links */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Expedition Shortcut */}
        {hasSavedMission && location.pathname !== '/mission/simulation' && (
          <Link
            to="/mission/simulation"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 text-xs font-mono transition-all animate-pulse shadow-lg shadow-emerald-500/10"
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {language === 'bn' ? `চলমান অভিযান (দিন ${formatNum(gameState.missionDay)})` : `ACTIVE MISSION (DAY ${gameState.missionDay})`}
            </span>
            <span className="sm:hidden">
              {language === 'bn' ? `দিন ${formatNum(gameState.missionDay)}` : `D${gameState.missionDay}`}
            </span>
          </Link>
        )}

        {/* Learn */}
        <Link
          to="/learn"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            location.pathname === '/learn'
              ? 'bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title={t('nav.learn')}
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">{t('nav.learn')}</span>
        </Link>

        {/* Teacher */}
        <Link
          to="/teacher"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            location.pathname === '/teacher'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title={t('nav.teacher')}
        >
          <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">{t('nav.teacher')}</span>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            location.pathname === '/settings'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title={t('nav.settings')}
        >
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t('nav.settings')}</span>
        </Link>

        {/* Sources button (only on home or secondary) */}
        {isHome && (
          <button
            onClick={() => setShowSourcesModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            title={t('nav.sources')}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
            <span>{t('nav.sources')}</span>
          </button>
        )}

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all"
          title={
            language === 'bn'
              ? (isSoundMuted ? 'সাউন্ড আনমিউট করো' : 'সাউন্ড মিউট করো')
              : (isSoundMuted ? 'Unmute Sound' : 'Mute Sound')
          }
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#52D6FF]" />}
        </button>

        {/* Language Toggle Segmented Button */}
        <LanguageToggle />
      </div>
    </nav>
  );
};
