// Destination Selector: Moon vs Mars environmental physics comparison

import React from 'react';
import type { DestinationType } from '../../types/game';
import { Compass, Thermometer, ShieldAlert, Sun, Wind, ArrowRight } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface DestinationSelectorProps {
  selected: DestinationType;
  onSelect: (dest: DestinationType) => void;
  onNext: () => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  selected,
  onSelect,
  onNext
}) => {
  const handleSelect = (dest: DestinationType) => {
    sound.playClick();
    onSelect(dest);
  };

  const handleProceed = () => {
    sound.playClick();
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Compass className="w-3.5 h-3.5" />
          PHASE 1: DESTINATION ASSIGNMENT
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Select Outpost Environment
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
          Every extraterrestrial body presents distinct physical constraints. Solar irradiance, thermal swings, and atmospheric dynamics fundamentally dictate engineering trade-offs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Destination 1: The Moon */}
        <div
          onClick={() => handleSelect('moon')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            selected === 'moon'
              ? 'bg-[#0F1B33] border-[#52D6FF] shadow-[0_0_25px_-5px_rgba(82,214,255,0.3)] ring-1 ring-[#52D6FF]'
              : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#131E33]/60'
          }`}
        >
          {/* Active selection badge */}
          {selected === 'moon' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-[10px] font-bold">
              SELECTED
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌙</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">THE MOON</h3>
                <span className="text-xs font-mono text-[#52D6FF]">SHACKLETON CRATER // SOUTH POLE</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Airless vacuum with extreme thermal extremes and unmitigated cosmic radiation. Peaks of Eternal Light provide continuous solar energy, but long lunar shadows require massive battery reserves.
            </p>

            {/* Environmental Specifications Grid */}
            <div className="space-y-2 text-xs font-mono mb-6 bg-[#060B18]/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Irradiance:
                </span>
                <span className="text-white font-bold">1,361 W/m² (100% Earth)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperature:
                </span>
                <span className="text-white font-bold">-130°C to +120°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Radiation:
                </span>
                <span className="text-rose-400 font-bold">Extreme (Zero Magnetosphere)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-400" /> Atmosphere:
                </span>
                <span className="text-slate-300 font-bold">Hard Vacuum (0 kPa)</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-sky-300/80 italic border-l-2 border-[#52D6FF] pl-2.5">
            Key Challenge: Massive battery storage required for 14-day lunar night and regolith shielding for cosmic ray protection.
          </div>
        </div>

        {/* Destination 2: Mars */}
        <div
          onClick={() => handleSelect('mars')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            selected === 'mars'
              ? 'bg-[#261214] border-red-500 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)] ring-1 ring-red-500'
              : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#1C1720]/60'
          }`}
        >
          {selected === 'mars' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold">
              SELECTED
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🔴</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">MARS</h3>
                <span className="text-xs font-mono text-red-400">CHRYSE PLANITIA // RED PLANET</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Thin carbon-dioxide atmosphere subject to planet-encircling dust storms that coat solar arrays. Communication latency to Earth spans 4 to 20 minutes each way, requiring high autonomous crew resilience.
            </p>

            <div className="space-y-2 text-xs font-mono mb-6 bg-[#060B18]/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Irradiance:
                </span>
                <span className="text-white font-bold">590 W/m² (43% Earth)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperature:
                </span>
                <span className="text-white font-bold">-140°C to +20°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Radiation:
                </span>
                <span className="text-amber-400 font-bold">High (Thin CO₂ buffer)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-orange-400" /> Atmosphere:
                </span>
                <span className="text-orange-300 font-bold">95% CO₂ (0.6 kPa) + Dust Storms</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-red-300/80 italic border-l-2 border-red-500 pl-2.5">
            Key Challenge: Atmospheric dust lowers solar efficiency by up to 75%; requires MOXIE CO₂-to-O₂ electrolysis and mechanical dust wipers.
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end">
        <button
          onClick={handleProceed}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-[#52D6FF]/20 transition-all"
        >
          CONFIRM DESTINATION & SELECT CREW
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
