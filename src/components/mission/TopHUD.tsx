// Minimalist Professional Game HUD (Top HUD)
// Core Philosophy: Game First, Clean Indicators, Zero Card Clutter

import React from 'react';
import type { SimulationState } from '../../types/game';
import { 
  Zap, 
  Droplets, 
  Wind, 
  Apple, 
  Shield, 
  AlertTriangle, 
  Eye, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { LanguageToggle } from '../common/LanguageToggle';

interface TopHUDProps {
  state: SimulationState;
  onToggleMode: () => void;
  onOpenTeacher?: () => void;
  onOpenAchievements?: () => void;
  onOpenDemo?: () => void;
  onAbortMission: () => void;
  onOpenNasaData?: () => void;
  onOpenTerrainExplorer?: () => void;
  onSelectResource?: (resKey: string) => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  onToggleMode,
  onAbortMission,
  onSelectResource
}) => {
  const { formatNum, language } = useLanguage();
  const { 
    missionDay, 
    totalDays, 
    destination, 
    mode, 
    resources, 
    environment, 
    activeEvent 
  } = state;

  const progressPct = Math.min(100, (missionDay / totalDays) * 100);
  const isMars = destination === 'mars';

  // Calculate vital percentages
  const powerPct = Math.round((resources.power / resources.powerMax) * 100);
  const waterPct = Math.round((resources.water / resources.waterMax) * 100);
  const o2Pct = Math.round((resources.oxygen / resources.oxygenMax) * 100);
  const foodPct = Math.round((resources.food / resources.foodMax) * 100);
  const shieldPct = Math.round(resources.shielding);

  // Status helper: subtle by default, bold on warning (<40%), glowing on critical (<20%)
  const getVitalStyle = (pct: number) => {
    if (pct <= 20) {
      return 'text-rose-400 bg-rose-950/80 border-rose-500/80 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]';
    }
    if (pct <= 40) {
      return 'text-amber-300 bg-amber-950/60 border-amber-500/50';
    }
    return 'text-slate-200 bg-[#0A1020]/80 border-slate-800/80 hover:border-slate-700';
  };

  return (
    <header className="w-full bg-[#050914]/95 border-b border-slate-800/90 px-3 sm:px-6 py-2 sm:py-2.5 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* TOP-LEFT: MISSION DAY 07 / 30 */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="text-base sm:text-lg shrink-0">
            {isMars ? '🔴' : '🌙'}
          </span>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>{language === 'bn' ? 'মিশন দিন' : 'DAY'}</span>
              <span className="text-white text-xs sm:text-sm font-black font-display">
                {formatNum(missionDay)}
              </span>
              <span className="text-slate-600">/ {formatNum(totalDays)}</span>
            </div>
            {/* Ultra-slim progress indicator */}
            <div className="w-20 sm:w-28 h-1 rounded-full bg-slate-800/80 overflow-hidden mt-0.5">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-[#52D6FF] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* TOP-CENTER: ACTIVE ENVIRONMENT ALERT (Only visible during event/hazard) */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {environment.solarFlareActive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-300 text-[11px] font-mono font-bold animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'bn' ? 'সতর্কতা: সোলার প্রোটন স্টর্ম' : 'ALERT: SOLAR PARTICLE STORM'}</span>
            </div>
          ) : environment.dustLevel > 50 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-500 text-amber-300 text-[11px] font-mono font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'সতর্কতা: তীব্র মার্স ডাস্ট স্টর্ম' : 'WARNING: ATMOSPHERIC DUST STORM'}</span>
            </div>
          ) : activeEvent ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/50 text-sky-300 text-[11px] font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'bn' ? 'জরুরি অ্যানোমালি রিপোর্ট' : 'MISSION ANOMALY DETECTED'}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:block">
              {isMars ? 'MARS EXPEDITION • SYSTEMS NOMINAL' : 'LUNAR ARTEMIS OUTPOST • SYSTEMS NOMINAL'}
            </div>
          )}
        </div>

        {/* TOP-RIGHT: COMPACT GAME-STYLE VITALS (⚡ 82%  💧 74%  🫁 91%  🌱 68%  🛡 55%) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* POWER */}
          <button 
            type="button"
            onClick={() => onSelectResource && onSelectResource('power')}
            className={`px-1.5 sm:px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${getVitalStyle(powerPct)}`}
            title={`Power: ${powerPct}% (${formatNum(Math.round(resources.power))} kWh)`}
          >
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">{powerPct}%</span>
          </button>

          {/* WATER */}
          <button 
            type="button"
            onClick={() => onSelectResource && onSelectResource('water')}
            className={`px-1.5 sm:px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${getVitalStyle(waterPct)}`}
            title={`Water: ${waterPct}% (${formatNum(Math.round(resources.water))} L)`}
          >
            <Droplets className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="hidden xs:inline">{waterPct}%</span>
          </button>

          {/* OXYGEN */}
          <button 
            type="button"
            onClick={() => onSelectResource && onSelectResource('oxygen')}
            className={`px-1.5 sm:px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${getVitalStyle(o2Pct)}`}
            title={`Oxygen: ${o2Pct}% (${formatNum(Math.round(resources.oxygen))} kg)`}
          >
            <Wind className="w-3 h-3 text-[#52D6FF] shrink-0" />
            <span className="hidden xs:inline">{o2Pct}%</span>
          </button>

          {/* FOOD */}
          <button 
            type="button"
            onClick={() => onSelectResource && onSelectResource('food')}
            className={`px-1.5 sm:px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${getVitalStyle(foodPct)}`}
            title={`Food: ${foodPct}% (${formatNum(Math.round(resources.food))} kg)`}
          >
            <Apple className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">{foodPct}%</span>
          </button>

          {/* SHIELDING */}
          <button 
            type="button"
            onClick={() => onSelectResource && onSelectResource('shielding')}
            className={`px-1.5 sm:px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all ${getVitalStyle(shieldPct)}`}
            title={`Shielding: ${shieldPct}%`}
          >
            <Shield className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="hidden xs:inline">{shieldPct}%</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5 sm:mx-1 hidden xs:block" />

          {/* Mode Pill Toggle (Junior / Commander) */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMode();
            }}
            className={`px-2 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 min-h-[30px] ${
              mode === 'commander'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
            }`}
            title="Toggle Junior vs Commander Telemetry"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">
              {mode === 'commander' ? 'CMD' : 'JR'}
            </span>
          </button>

          {/* Canonical Global Language Toggle */}
          <LanguageToggle size="sm" />

          {/* Emergency Abort Button */}
          <button
            onClick={() => {
              sound.playWarning();
              onAbortMission();
            }}
            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-white transition-all min-h-[30px] min-w-[30px] flex items-center justify-center"
            title="Emergency Abort Expedition"
            aria-label="Abort Mission"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
