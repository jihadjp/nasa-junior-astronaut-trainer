// Top HUD: Mission Day, Environment Status, and Control Bar

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Compass, ShieldAlert, Award, GraduationCap, Play, Eye, AlertOctagon, Satellite } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

interface TopHUDProps {
  state: SimulationState;
  onToggleMode: () => void;
  onOpenTeacher: () => void;
  onOpenAchievements: () => void;
  onOpenDemo: () => void;
  onAbortMission: () => void;
  onOpenNasaData?: () => void;
  onOpenTerrainExplorer?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  onToggleMode,
  onOpenTeacher,
  onOpenAchievements,
  onOpenDemo,
  onAbortMission,
  onOpenNasaData,
  onOpenTerrainExplorer
}) => {
  const { t, formatNum, language } = useLanguage();
  const { missionDay, totalDays, destination, mode, missionStatus, environment, landingSite } = state;
  const progressPct = Math.min(100, (missionDay / totalDays) * 100);
  const isMars = destination === 'mars';

  const expeditionLabel = isMars 
    ? (language === 'bn' ? 'মঙ্গল অভিযান' : 'MARS EXPEDITION')
    : (language === 'bn' ? 'চাঁদ অভিযান' : 'MOON EXPEDITION');

  const siteName = landingSite 
    ? ((language === 'bn' && landingSite.nameBn) ? landingSite.nameBn : landingSite.name)
    : null;

  return (
    <header className="w-full bg-[#101827]/95 border-b border-[#52D6FF]/20 px-2.5 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        {/* Left: Branding & Destination & Language */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-lg sm:text-xl shrink-0">{isMars ? '🔴' : '🌙'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-white shrink-0">{t('nav.brand')}</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30 truncate max-w-[120px] sm:max-w-none">
                  {expeditionLabel}
                </span>
                {siteName && (
                  <button
                    type="button"
                    onClick={onOpenTerrainExplorer || onOpenNasaData}
                    className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-[9px] font-mono text-sky-300 transition-all cursor-pointer"
                    title={language === 'bn' ? 'নাসা আসল ভূখণ্ড প্রোফাইল দেখুন' : 'Explore Real NASA Topography & Orbiter Data'}
                  >
                    <span className="truncate max-w-[120px] lg:max-w-[160px]">{siteName}</span>
                    <span className="text-sky-400">({landingSite?.coordinates})</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden xs:block truncate">
                {t('nav.tagline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mode Switcher Pill */}
            <button
              onClick={onToggleMode}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium border transition-all flex items-center gap-1 sm:gap-1.5 min-h-[30px] ${
                mode === 'commander'
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-[#52D6FF]/15 border-[#52D6FF]/50 text-[#52D6FF] hover:bg-[#52D6FF]/25'
              }`}
              title="Click to toggle Junior vs Commander telemetry mode"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{mode === 'commander' ? t('nav.mode.commander') : t('nav.mode.junior')}</span>
            </button>

            {/* Language Switcher on Desktop */}
            <LanguageToggle size="sm" className="hidden sm:inline-flex" />
          </div>
        </div>

        {/* Center: Mission Day & Timeline Bar */}
        <div className="flex-1 max-w-md w-full px-1 sm:px-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center gap-1 sm:gap-1.5 font-bold">
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#52D6FF]" />
              {t('nav.day', { day: formatNum(missionDay) })} <span className="text-slate-500">{t('nav.of')} {formatNum(totalDays)}</span>
            </span>
            <span className="text-[#52D6FF] font-medium text-[11px] sm:text-xs">
              {t('nav.complete', { pct: formatNum(Math.round(progressPct)) })}
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Tools & Status */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 w-full md:w-auto pt-1 md:pt-0">
          <LanguageToggle size="sm" className="sm:hidden scale-90 origin-left" />

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Mission Status Badge */}
            <div className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 sm:gap-1.5 min-h-[30px] ${
              environment.solarFlareActive || environment.dustLevel > 50
                ? 'bg-red-950/80 border border-red-500/60 text-red-300 animate-pulse'
                : missionStatus === 'ongoing'
                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                : 'bg-blue-950/80 border border-blue-500/60 text-blue-300'
            }`}>
              <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{environment.solarFlareActive ? t('nav.status.hazard') : missionStatus === 'ongoing' ? t('nav.status.operational') : t('nav.status.complete')}</span>
            </div>

            {/* Quick Nav Buttons */}
            {onOpenNasaData && (
              <button
                onClick={onOpenNasaData}
                className="px-2 py-1 rounded bg-sky-500/15 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 text-xs font-mono font-bold flex items-center gap-1 transition-all min-h-[30px] justify-center"
                title={language === 'bn' ? 'অফিসিয়াল নাসা ডেটাসেট ও তথ্যসূত্র দেখুন' : 'Explore Official NASA Mission Datasets & Citations'}
              >
                <Satellite className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">NASA DATA</span>
              </button>
            )}

            <button
              onClick={onOpenDemo}
              className="p-1.5 rounded bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-mono flex items-center gap-1 transition-all min-h-[30px] min-w-[30px] justify-center"
              title="Launch 60-second judging demo showcase"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('nav.demo')}</span>
            </button>

            <button
              onClick={onOpenAchievements}
              className="p-1.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono flex items-center gap-1 transition-all min-h-[30px] min-w-[30px] justify-center"
              title="View Achievements"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('nav.awards')}</span>
            </button>

            <button
              onClick={onOpenTeacher}
              className="p-1.5 rounded bg-blue-500/15 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-mono flex items-center gap-1 transition-all min-h-[30px] min-w-[30px] justify-center"
              title="Teacher Mode & STEM Curriculum Guide"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('nav.teacher')}</span>
            </button>

            {/* Emergency Abort Header Button */}
            <button
              onClick={onAbortMission}
              className="px-2 sm:px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm active:scale-95 min-h-[30px]"
              title="Emergency Abort Active Expedition"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
              <span>{t('common.abort.short')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

