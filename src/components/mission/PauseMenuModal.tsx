// In-Game Tactical Pause Menu & Mission Control Overlay
import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flag, 
  Keyboard, 
  X, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import type { SimulationState } from '../../types/game';

interface PauseMenuModalProps {
  isOpen: boolean;
  state: SimulationState;
  onResume: () => void;
  onRestart: () => void;
  onAbortToReport: () => void;
}

export const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  isOpen,
  state,
  onResume,
  onRestart,
  onAbortToReport
}) => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const nextState = !sound.toggleMute();
    setIsMuted(nextState);
  };

  const isLowPower = state.resources.power < 25;
  const isLowOxygen = state.resources.oxygen < 30;
  const hasCriticalCrew = state.crew.some(c => c.status === 'Critical' || c.status === 'Hypoxic');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      onClick={onResume}
    >
      <div 
        className="relative w-full max-w-xl bg-[#0B132B] border-2 border-[#52D6FF]/60 rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 50px -10px rgba(82, 214, 255, 0.3), 0 25px 60px -15px rgba(0, 0, 0, 0.95)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider animate-pulse">
              {isBn ? '⏸ সিমুলেশন স্থগিত' : '⏸ PAUSED'}
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
              {isBn ? 'মিশন কন্ট্রোল মেনু' : 'TACTICAL PAUSE'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Resume"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Telemetry Summary Card */}
        <div className="bg-[#131F37] border border-slate-700/70 rounded-xl p-3.5 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'গন্তব্য' : 'TARGET'}</span>
            <span className="text-xs font-bold text-[#52D6FF] capitalize">{state.destination}</span>
          </div>
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'মিশন দিন' : 'SOL'}</span>
            <span className="text-xs font-bold text-amber-300">{formatNum(state.missionDay)} / 30</span>
          </div>
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'বিদ্যুৎ' : 'POWER'}</span>
            <span className={`text-xs font-bold ${isLowPower ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatNum(Math.round(state.resources.power))}%
            </span>
          </div>
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'ইসিএলএস' : 'ECLSS'}</span>
            <span className={`text-xs font-bold ${isLowOxygen || hasCriticalCrew ? 'text-rose-400' : 'text-emerald-400'}`}>
              {hasCriticalCrew ? (isBn ? 'বিপদ' : 'ALERT') : (isBn ? 'স্বাভাবিক' : 'NOMINAL')}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 mb-6">
          {/* Resume Mission */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] hover:from-[#38bdf8] hover:to-[#2563eb] text-slate-950 shadow-lg shadow-[#00D4FF]/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isBn ? 'অভিযানে ফিরে যান (RESUME)' : 'RESUME EXPEDITION'}</span>
          </button>

          {/* Audio Engine Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isBn ? 'সাউন্ড ইঞ্জিন (SFX ও অ্যাম্বিয়েন্স)' : 'SOUND ENGINE (SFX & AMBIENCE)'}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isMuted ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
              {isMuted ? (isBn ? 'নিঃশব্দ (MUTED)' : 'MUTED') : (isBn ? 'সক্রিয় (ENABLED)' : 'ACTIVE')}
            </span>
          </button>

          {/* Restart Mission Toggle */}
          {!showConfirmRestart ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowConfirmRestart(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'মিশন পুনরায় শুরু করুন' : 'RESTART CURRENT MISSION'}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/60 flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'আপনি কি নিশ্চিত?' : 'Restart from Sol 1?'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmRestart(false)}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onRestart();
                  }}
                  className="px-3 py-1 text-xs font-mono font-bold rounded bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  {isBn ? 'হ্যাঁ, রিস্টার্ট' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          {/* Abort to Mission Debrief */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onAbortToReport();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span>{isBn ? 'অভিযান প্রত্যাহার ও ডিব্রিফিং' : 'ABORT TO MISSION DEBRIEF'}</span>
          </button>
        </div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-2.5 pb-1.5 border-b border-slate-800">
            <Keyboard className="w-3.5 h-3.5 text-[#52D6FF]" />
            <span>{isBn ? 'কিবোর্ড শর্টকাট গাইড' : 'KEYBOARD CONTROLS CHEATSHEET'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'দিন বৃদ্ধি (+১)' : '+1 Day Advance'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">SPACE</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'সিম স্পিড' : 'Sim Speed (1x / 3x)'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">1 / 3</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'নভোচারী রস্টার' : 'Crew Roster'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">C</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'রোভার অভিযান' : 'Rover Sortie'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">R</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'রিসোর্স মেট্রিক্স' : 'Vitals Matrix'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">V</kbd>
            </div>
            <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded">
              <span>{isBn ? 'পজ / মেনু' : 'Pause / Menu'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">ESC / P</kbd>
            </div>
          </div>
        </div>

        {/* NASA Provenance Footer */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
          <Info className="w-3 h-3 text-[#52D6FF]" />
          <span>NASA Planetary Data System (LRO LOLA/Diviner & MRO HiRISE/CRISM)</span>
        </div>
      </div>
    </div>
  );
};
