// Time and Simulation Speed Controls with Turn-Based Manual Stepping & Emergency Abort

import React from 'react';
import { Play, Pause, StepForward, FastForward, AlertOctagon } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface TimeControlsProps {
  isPaused: boolean;
  speed: 1 | 3;
  onTogglePause: () => void;
  onStepDays: (days: number) => void;
  onToggleSpeed: () => void;
  onAbortMission: () => void;
  onRestartMission?: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  isPaused,
  speed,
  onTogglePause,
  onStepDays,
  onToggleSpeed,
  onAbortMission,
  onRestartMission
}) => {
  const { t, formatNum, language } = useLanguage();

  const handlePause = () => {
    sound.playClick();
    onTogglePause();
  };

  const handleStep = (days: number) => {
    sound.playClick();
    onStepDays(days);
  };

  const handleSpeed = () => {
    sound.playClick();
    onToggleSpeed();
  };

  const handleAbort = () => {
    sound.playWarning();
    if (onAbortMission) {
      onAbortMission();
    } else if (onRestartMission) {
      onRestartMission();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 sm:p-3.5 rounded-2xl bg-[#0B132B]/95 border border-slate-700/80 backdrop-blur-md shadow-xl">
      {/* 1. Primary Stepping & Playback Controls */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
        {/* Step 1 Day - Main Hero Advance Button */}
        <button
          onClick={() => handleStep(1)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] hover:from-[#38bdf8] hover:to-[#2563eb] text-slate-950 shadow-lg shadow-[#00D4FF]/25 flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 group min-h-[42px]"
          title={t('common.step.hint')}
        >
          <StepForward className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform shrink-0" />
          <span>{language === 'bn' ? '+১ দিন' : '+1 DAY'}</span>
          <span className="hidden md:inline">{language === 'bn' ? 'এগিয়ে যাও' : 'ADVANCE'}</span>
        </button>

        {/* Step 3 Days */}
        <button
          onClick={() => handleStep(3)}
          className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-medium bg-[#131F37] hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 items-center gap-1.5 transition-all hidden xs:flex min-h-[42px]"
          title="Simulate 3 Days forward"
        >
          <StepForward className="w-3.5 h-3.5 shrink-0" />
          <span>{t('common.step3')}</span>
        </button>

        {/* Auto-Run / Pause Clock Toggle */}
        <button
          onClick={handlePause}
          className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all border min-h-[42px] ${
            isPaused
              ? 'bg-[#131F37] hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500/50 text-emerald-400'
              : 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/30 animate-pulse'
          }`}
          title={isPaused ? t('common.autorun.start') : t('common.autorun.pause')}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current shrink-0" /> : <Pause className="w-3.5 h-3.5 fill-current shrink-0" />}
          <span>{isPaused ? t('common.autorun.start') : t('common.autorun.pause')}</span>
        </button>

        {/* Speed Toggle (1x vs 3x) */}
        <button
          onClick={handleSpeed}
          className={`px-2.5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold border flex items-center justify-center gap-1 transition-all min-h-[42px] ${
            speed === 3
              ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF]'
              : 'bg-[#131F37] border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Simulation Speed"
        >
          <FastForward className="w-3.5 h-3.5 shrink-0" />
          <span>{formatNum(speed)}x</span>
        </button>

        {/* Emergency Abort Mission Button (Integrated on mobile, right-aligned on desktop) */}
        <button
          onClick={handleAbort}
          className="sm:hidden px-2.5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/60 shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[42px]"
          title="Emergency abort active expedition"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{t('common.abort')}</span>
        </button>
      </div>

      {/* 2. Simulation Status Indicator */}
      <div className="hidden lg:flex items-center gap-2">
        {isPaused ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{t('common.mode.manual')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{t('common.mode.autorun', { speed: formatNum(speed) })}</span>
          </div>
        )}
      </div>

      {/* 3. Emergency Abort Mission Button (Desktop/Tablet view) */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={handleAbort}
          className="px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/60 hover:border-rose-400 shadow-md shadow-rose-950/40 flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
          title="Emergency abort active expedition"
        >
          <AlertOctagon className="w-4 h-4 text-rose-400 group-hover:text-white shrink-0" />
          <span>{t('common.abort')}</span>
        </button>
      </div>
    </div>
  );
};
