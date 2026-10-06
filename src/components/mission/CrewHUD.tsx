// Crew Wellbeing & Individual Astronaut Status Cards

import React from 'react';
import type { Astronaut, SimulationState } from '../../types/game';
import { Heart, Activity, Award, Sparkles } from 'lucide-react';

interface CrewHUDProps {
  state: SimulationState;
}

export const CrewHUD: React.FC<CrewHUDProps> = ({ state }) => {
  const { crew, crewWellbeing, sciencePoints } = state;

  const getStatusBadge = (status: Astronaut['status']) => {
    switch (status) {
      case 'Healthy':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'Tired':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Radiation Alert':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40 animate-pulse';
      case 'Hypoxic':
        return 'text-sky-400 bg-sky-950/60 border-sky-500/40 animate-pulse';
      case 'Critical':
        return 'text-red-400 bg-red-950/60 border-red-500/40 animate-pulse';
    }
  };

  const renderAstronautAvatar = (astro: Astronaut) => {
    const roleColors: Record<string, string> = {
      commander: '#52D6FF',
      engineer: '#F4C95D',
      biologist: '#35D07F',
      scientist: '#C084FC'
    };
    const accent = roleColors[astro.role] || '#52D6FF';

    return (
      <svg className="w-10 h-10 rounded-full bg-[#0A1020] border-2" style={{ borderColor: accent }} viewBox="0 0 64 64">
        {/* Space Helmet */}
        <circle cx="32" cy="32" r="24" fill="#1E293B" stroke={accent} strokeWidth="2.5" />
        {/* Visor Reflection */}
        <path d="M 18,30 Q 32,18 46,30 Q 32,42 18,30 Z" fill="#38BDF8" opacity="0.85" />
        <ellipse cx="26" cy="27" rx="5" ry="2" fill="#FFFFFF" opacity="0.75" />
        {/* Neck ring and badge */}
        <rect x="22" y="48" width="20" height="6" rx="2" fill="#475569" stroke={accent} strokeWidth="1" />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#101827]/90 rounded-xl border border-slate-800 p-3.5 backdrop-blur-md">
      {/* Top Banner: Overall Wellbeing + Science Tally */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${crewWellbeing > 60 ? 'text-rose-500' : 'text-red-500 animate-ping'}`} />
            <span className="font-display font-bold text-sm tracking-wide text-white">
              CREW WELLBEING
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold text-white">
              {Math.round(crewWellbeing)}%
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
              crewWellbeing >= 75
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : crewWellbeing >= 45
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-red-950/60 border-red-500/40 text-red-300 animate-pulse'
            }`}>
              {crewWellbeing >= 75 ? '✓ NOMINAL' : crewWellbeing >= 45 ? '⚠ STRESSED' : '✕ HAZARDOUS'}
            </span>
          </div>
        </div>

        {/* Science Output Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A1020] border border-purple-500/30">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300">
            SCIENCE DISCOVERY: <strong className="text-white text-sm font-bold">{sciencePoints}</strong> PTS
          </span>
        </div>
      </div>

      {/* Individual Astronaut Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {crew.map(astro => (
          <div
            key={astro.id}
            className="p-2.5 rounded-lg bg-[#0A1020]/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-2.5"
          >
            {renderAstronautAvatar(astro)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-200 truncate font-display">
                  {astro.name}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-medium ${getStatusBadge(astro.status)}`}>
                  {astro.status}
                </span>
              </div>

              <div className="text-[10px] font-mono uppercase tracking-wider text-[#52D6FF] mb-1.5 flex items-center gap-1">
                <Award className="w-2.5 h-2.5" />
                {astro.role}
              </div>

              {/* Health & Morale Mini Meters */}
              <div className="space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[9px]">
                    <Activity className="w-2.5 h-2.5 text-rose-400" /> HEALTH
                  </span>
                  <span className="text-slate-300">{Math.round(astro.health)}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${astro.health}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[9px]">MORALE</span>
                  <span className="text-slate-300">{Math.round(astro.morale)}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all"
                    style={{ width: `${astro.morale}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
