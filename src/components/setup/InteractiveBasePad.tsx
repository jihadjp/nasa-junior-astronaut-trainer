// Interactive Tactical Base Construction Pad: Deploy Outpost Modules on Terrain
import React, { useState } from 'react';
import type { BaseModule, ModuleType } from '../../types/game';
import { 
  Sun, 
  Wind, 
  Droplet, 
  Sprout, 
  FlaskConical, 
  Truck, 
  Home, 
  Shield, 
  Wrench,
  Sparkles, 
  Zap
} from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface InteractiveBasePadProps {
  planet: 'moon' | 'mars';
  siteName: string;
  modules: Record<ModuleType, BaseModule>;
  creditsRemaining: number;
  onUpgradeModule: (modId: ModuleType) => void;
  onDowngradeModule: (modId: ModuleType) => void;
}

interface PadSlot {
  id: ModuleType;
  x: number; // percentage on pad
  y: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  conduitTarget?: ModuleType;
}

const PAD_SLOTS: PadSlot[] = [
  { id: 'solar_array', x: 22, y: 22, icon: Sun, color: '#52D6FF', conduitTarget: 'habitat' },
  { id: 'life_support', x: 50, y: 18, icon: Wind, color: '#38BDF8', conduitTarget: 'habitat' },
  { id: 'water_recycler', x: 78, y: 22, icon: Droplet, color: '#60A5FA', conduitTarget: 'habitat' },
  { id: 'habitat', x: 50, y: 45, icon: Home, color: '#34D399' },
  { id: 'greenhouse', x: 80, y: 54, icon: Sprout, color: '#4ADE80', conduitTarget: 'habitat' },
  { id: 'radiation_shield', x: 20, y: 54, icon: Shield, color: '#EC4899', conduitTarget: 'habitat' },
  { id: 'spare_fabricator', x: 24, y: 80, icon: Wrench, color: '#F59E0B', conduitTarget: 'habitat' },
  { id: 'science_lab', x: 50, y: 76, icon: FlaskConical, color: '#C084FC', conduitTarget: 'habitat' },
  { id: 'rover_garage', x: 78, y: 80, icon: Truck, color: '#FCD34D', conduitTarget: 'science_lab' }
];

export const InteractiveBasePad: React.FC<InteractiveBasePadProps> = ({
  planet,
  siteName,
  modules,
  creditsRemaining,
  onUpgradeModule,
  onDowngradeModule
}) => {
  const { language, formatNum } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState<ModuleType>('habitat');

  const selectedModule = modules[selectedSlot];

  const handleSelectSlot = (slotId: ModuleType) => {
    sound.playClick();
    setSelectedSlot(slotId);
  };

  const isMoon = planet === 'moon';

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 items-stretch select-none">
      {/* 1. Tactical Planetary Construction Pad (Visual Interactive Grid) */}
      <div className="flex-1 relative min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-slate-700/80 bg-[#070D1E] shadow-2xl flex flex-col justify-between p-3 sm:p-5 group">
        {/* Terrain Background Layer */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity"
          style={{
            background: isMoon 
              ? 'radial-gradient(circle at 50% 50%, #202736 0%, #0c111e 70%, #050811 100%)' 
              : 'radial-gradient(circle at 50% 50%, #431a10 0%, #1e0b06 70%, #0a0402 100%)'
          }}
        />

        {/* Construction Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${isMoon ? '#52D6FF' : '#F87171'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Header HUD inside Construction View */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#040814]/80 border border-slate-700/80 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">{siteName}</span>
            <span className="text-[10px] text-slate-400">PAD-01</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#040814]/80 border border-[#52D6FF]/40 text-[#52D6FF] font-bold">
            {language === 'bn' ? 'মডিউল স্থাপনা ও পাওয়ার গ্রিড' : 'MODULE DEPLOYMENT & CONDUIT GRID'}
          </div>
        </div>

        {/* SVG Conduits & Interconnected Pipes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="powerConduit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#52D6FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {PAD_SLOTS.map(slot => {
            if (!slot.conduitTarget) return null;
            const target = PAD_SLOTS.find(s => s.id === slot.conduitTarget);
            if (!target) return null;

            const isConnected = modules[slot.id] && modules[target.id] && modules[slot.id].level > 0 && modules[target.id].level > 0;

            return (
              <line
                key={`conduit-${slot.id}-${target.id}`}
                x1={`${slot.x}%`}
                y1={`${slot.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={isConnected ? 'url(#powerConduit)' : '#334155'}
                strokeWidth={isConnected ? '2.5' : '1.5'}
                strokeDasharray={isConnected ? '4 4' : '2 4'}
                strokeOpacity={isConnected ? '0.85' : '0.3'}
                className={isConnected ? 'animate-pulse' : ''}
              />
            );
          })}
        </svg>

        {/* Interactive Pad Module Nodes */}
        <div className="relative z-20 flex-1 my-2">
          {PAD_SLOTS.map(slot => {
            const mod = modules[slot.id];
            if (!mod) return null;
            const isSelected = selectedSlot === slot.id;
            const isOperational = mod.level > 0;
            const Icon = slot.icon;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSelectSlot(slot.id)}
                style={{ 
                  left: `${slot.x}%`, 
                  top: `${slot.y}%`,
                  borderColor: isSelected ? '#52D6FF' : isOperational ? slot.color : '#334155'
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1 group/btn shadow-xl ${
                  isSelected 
                    ? 'ring-4 ring-[#52D6FF]/50 scale-110 z-30' 
                    : 'hover:scale-105 z-20'
                } ${
                  isOperational
                    ? 'bg-[#0B1426] text-white'
                    : 'bg-[#0F172A]/70 text-slate-500 opacity-60'
                }`}
              >
                <div 
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${slot.color}20` }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: slot.color }} />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono font-bold leading-none">
                    L{formatNum(mod.level)}
                  </span>
                  {mod.level >= mod.maxLevel && (
                    <span className="text-[7px] font-mono text-emerald-400 font-bold">MAX</span>
                  )}
                </div>

                {/* Subtitle tag */}
                <span className="text-[8px] font-mono text-slate-400 truncate max-w-[65px] text-center leading-none">
                  {(language === 'bn' && mod.nameBn) ? mod.nameBn.split(' ')[0] : mod.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Construction Pad Footer Hint */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <span>{language === 'bn' ? 'মডিউলে ক্লিক করে কনফিগার করুন' : 'CLICK MODULE TO CONFIGURE'}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#52D6FF]">
              <Zap className="w-3 h-3" />
              <span>{language === 'bn' ? 'পাওয়ার লাইন সংযুক্ত' : 'GRID CONNECTED'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Right Inspector: Structure Specification & Upgrade Controls */}
      <div className="w-full lg:w-80 p-4 sm:p-5 rounded-2xl bg-[#090F20] border border-slate-700/80 shadow-2xl flex flex-col justify-between gap-4">
        {selectedModule && (
          <div className="space-y-4">
            {/* Selected Module Header */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#52D6FF] font-semibold">
                  {language === 'bn' ? 'মডিউল ইন্সপেক্টর' : 'MODULE INSPECTOR'}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedModule.level > 0 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {language === 'bn' ? `লেভেল ${formatNum(selectedModule.level)}` : `LEVEL ${selectedModule.level}`}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display">
                {(language === 'bn' && selectedModule.nameBn) ? selectedModule.nameBn : selectedModule.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#050914] p-3 rounded-xl border border-slate-800/80">
              {(language === 'bn' && selectedModule.descriptionBn) ? selectedModule.descriptionBn : selectedModule.description}
            </p>

            {/* Tactical Metrics (Efficiency, Power, Output) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#050A16] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">
                  {language === 'bn' ? 'দক্ষতা' : 'EFFICIENCY'}
                </span>
                <strong className="text-emerald-400 text-sm">
                  {formatNum(Math.round(selectedModule.efficiency * 100))}%
                </strong>
              </div>

              <div className="p-2.5 rounded-lg bg-[#050A16] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">
                  {language === 'bn' ? 'আপগ্রেড খরচ' : 'UPGRADE COST'}
                </span>
                <strong className="text-amber-300 text-sm">
                  {formatNum(selectedModule.costPoints)} <span className="text-[9px] text-slate-400">CR</span>
                </strong>
              </div>
            </div>

            {/* Upgrade & Downgrade Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onUpgradeModule(selectedSlot)}
                disabled={selectedModule.level >= selectedModule.maxLevel || creditsRemaining < selectedModule.costPoints}
                className={`w-full py-2.5 px-4 rounded-xl font-display font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedModule.level >= selectedModule.maxLevel
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : creditsRemaining < selectedModule.costPoints
                    ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 shadow-lg shadow-[#52D6FF]/20 active:scale-98'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {selectedModule.level >= selectedModule.maxLevel
                    ? (language === 'bn' ? 'সর্বোচ্চ লেভেল সম্পন্ন' : 'MAX LEVEL REACHED')
                    : creditsRemaining < selectedModule.costPoints
                    ? (language === 'bn' ? 'পর্যাপ্ত ক্রেডিট নেই' : 'INSUFFICIENT BUDGET')
                    : (language === 'bn' ? 'মডিউল আপগ্রেড করুন (+১৫% ক্ষমতা)' : 'UPGRADE MODULE (+15%)')}
                </span>
              </button>

              {selectedModule.level > 1 && (
                <button
                  type="button"
                  onClick={() => onDowngradeModule(selectedSlot)}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{language === 'bn' ? 'লেভেল কমান (ক্রেডিট ফেরত)' : 'DOWNGRADE (REFUND)'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Budget Status Callout */}
        <div className="p-3 rounded-xl bg-[#040814] border border-slate-800 text-xs font-mono flex items-center justify-between">
          <span className="text-slate-400">
            {language === 'bn' ? 'অবশিষ্ট বাজেট:' : 'REMAINING CREDITS:'}
          </span>
          <span className={`font-bold text-sm ${creditsRemaining < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {formatNum(creditsRemaining)} CR
          </span>
        </div>
      </div>
    </div>
  );
};
