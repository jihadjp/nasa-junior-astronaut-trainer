// Crew Selector: Astronaut roster, roles, specialties, and crew size trade-off

import React from 'react';
import { DEFAULT_ASTRONAUTS } from '../../simulation/crew';
import { Users, Award, Heart, Activity, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface CrewSelectorProps {
  crewCount: number;
  onSetCrewCount: (count: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CrewSelector: React.FC<CrewSelectorProps> = ({
  crewCount,
  onSetCrewCount,
  onNext,
  onBack
}) => {
  const handleCountChange = (count: number) => {
    sound.playClick();
    onSetCrewCount(count);
  };

  const handleProceed = () => {
    sound.playClick();
    onNext();
  };

  const handleBack = () => {
    sound.playClick();
    onBack();
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Users className="w-3.5 h-3.5" />
          PHASE 2: FLIGHT CREW COMPOSITION
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          Select Expedition Crew Size
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
          A larger crew provides greater engineering and scientific specialization, but substantially accelerates daily oxygen, water, and food consumption.
        </p>
      </div>

      {/* Crew Size Selector Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {[2, 3, 4].map(count => (
          <button
            key={count}
            onClick={() => handleCountChange(count)}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-2 ${
              crewCount === count
                ? 'bg-[#52D6FF] text-slate-950 border-[#52D6FF] shadow-lg shadow-[#52D6FF]/20 scale-105'
                : 'bg-[#101827] text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            {count} ASTRONAUTS {count === 4 && '(RECOMMENDED)'}
          </button>
        ))}
      </div>

      {/* Consumption Trade-off Summary Callout */}
      <div className="p-3.5 rounded-xl bg-[#060B18] border border-slate-800 font-mono text-xs text-slate-300 mb-6 flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <span className="text-slate-500 text-[10px] block">DAILY OXYGEN USE:</span>
          <span className="text-[#52D6FF] font-bold">{(crewCount * 0.84).toFixed(2)} kg / day</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">DAILY WATER USE:</span>
          <span className="text-sky-400 font-bold">{(crewCount * 2.5).toFixed(1)} Liters / day</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">DAILY FOOD USE:</span>
          <span className="text-emerald-400 font-bold">{(crewCount * 1.4).toFixed(1)} kg / day</span>
        </div>
      </div>

      {/* Astronaut Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {DEFAULT_ASTRONAUTS.map((astro, idx) => {
          const isActive = idx < crewCount;
          return (
            <div
              key={astro.id}
              className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                isActive
                  ? 'bg-[#101827]/90 border-slate-700 shadow-md'
                  : 'bg-[#0A1020]/40 border-slate-800/40 opacity-40'
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-[#0A1020] border-2 border-[#52D6FF]/40 flex items-center justify-center text-xl shrink-0">
                👨‍🚀
              </div>

              {/* Astronaut Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-sm text-white truncate">
                    {astro.name}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30">
                    {astro.role}
                  </span>
                </div>

                <div className="text-xs font-mono text-amber-300 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  {astro.specialty}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {astro.specialtyDescription}
                </p>

                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Health: {astro.health}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-sky-400" /> Morale: {astro.morale}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="py-2.5 px-5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-mono text-xs font-bold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO DESTINATION
        </button>

        <button
          onClick={handleProceed}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-[#52D6FF]/20 transition-all"
        >
          CONFIRM CREW & BUILD BASE
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
