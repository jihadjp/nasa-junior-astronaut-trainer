// Top HUD: Mission Day, Environment Status, and Control Bar

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Compass, ShieldAlert, Award, GraduationCap, Play, Eye, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

interface TopHUDProps {
  state: SimulationState;
  onToggleMode: () => void;
  onOpenTeacher: () => void;
  onOpenAchievements: () => void;
  onOpenDemo: () => void;
  onAbortMission: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  onToggleMode,
  onOpenTeacher,
  onOpenAchievements,
  onOpenDemo,
  onAbortMission
}) => {
  const { t, formatNum, language } = useLanguage();
  const { missionDay, totalDays, destination, mode, missionStatus, environment } = state;
  const progressPct = Math.min(100, (missionDay / totalDays) * 100);
  const isMars = destination === 'mars';

  const expeditionLabel = isMars 
    ? (language === 'bn' ? 'মঙ্গল অভিযান' : 'MARS EXPEDITION')
    : (language === 'bn' ? 'চাঁদ অভিযান' : 'MOON EXPEDITION');

  return (
    <header className="w-full bg-[#101827]/95 border-b border-[#52D6FF]/20 px-4 py-2.5 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Destination & Language */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-xl">{isMars ? '🔴' : '🌙'}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wide text-white">{t('nav.brand')}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30">
                  {expeditionLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {t('nav.tagline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher Pill */}
            <button
              onClick={onToggleMode}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                mode === 'commander'
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-[#52D6FF]/15 border-[#52D6FF]/50 text-[#52D6FF] hover:bg-[#52D6FF]/25'
              }`}
              title="Click to toggle Junior vs Commander telemetry mode"
            >
              <Eye className="w-3.5 h-3.5" />
              {mode === 'commander' ? t('nav.mode.commander') : t('nav.mode.junior')}
            </button>

            {/* Language Switcher */}
            <LanguageToggle className="hidden sm:inline-flex" />
          </div>
        </div>

        {/* Center: Mission Day & Timeline Bar */}
        <div className="flex-1 max-w-md w-full px-2">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center gap-1.5 font-bold">
              <Compass className="w-3.5 h-3.5 text-[#52D6FF]" />
              {t('nav.day', { day: formatNum(missionDay) })} <span className="text-slate-500">{t('nav.of')} {formatNum(totalDays)}</span>
            </span>
            <span className="text-[#52D6FF] font-medium">
              {t('nav.complete', { pct: formatNum(Math.round(progressPct)) })}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Tools & Status */}
        <div className="flex items-center gap-2">
          <LanguageToggle className="sm:hidden" />

          {/* Mission Status Badge */}
          <div className={`px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 ${
            environment.solarFlareActive || environment.dustLevel > 50
              ? 'bg-red-950/80 border border-red-500/60 text-red-300 animate-pulse'
              : missionStatus === 'ongoing'
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
              : 'bg-blue-950/80 border border-blue-500/60 text-blue-300'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            {environment.solarFlareActive ? t('nav.status.hazard') : missionStatus === 'ongoing' ? t('nav.status.operational') : t('nav.status.complete')}
          </div>

          {/* Quick Nav Buttons */}
          <button
            onClick={onOpenDemo}
            className="p-1.5 rounded bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-mono flex items-center gap-1 transition-all"
            title="Launch 60-second judging demo showcase"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('nav.demo')}</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-1.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono flex items-center gap-1 transition-all"
            title="View Achievements"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('nav.awards')}</span>
          </button>

          <button
            onClick={onOpenTeacher}
            className="p-1.5 rounded bg-blue-500/15 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-mono flex items-center gap-1 transition-all"
            title="Teacher Mode & STEM Curriculum Guide"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('nav.teacher')}</span>
          </button>

          {/* Emergency Abort Header Button */}
          <button
            onClick={onAbortMission}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ml-1"
            title="Emergency Abort Active Expedition"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
            <span className="hidden sm:inline">{t('common.abort.short')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

