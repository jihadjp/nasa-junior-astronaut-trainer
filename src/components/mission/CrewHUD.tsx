// Crew Wellbeing & Individual Astronaut Status Cards with Progressive Disclosure (Level 1 + Level 2)

import React, { useState } from 'react';
import type { Astronaut, SimulationState } from '../../types/game';
import { Heart, Sparkles, Activity, CheckCircle2, Award, ChevronRight, Users } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AstronautDetailModal } from './AstronautDetailModal';
import { sound } from '../../sound/audioEngine';

interface CrewHUDProps {
  state: SimulationState;
}

export const CrewHUD: React.FC<CrewHUDProps> = ({ state }) => {
  const { t, formatNum, language } = useLanguage();
  const { crew, crewWellbeing, sciencePoints } = state;

  const [selectedAstronaut, setSelectedAstronaut] = useState<Astronaut | null>(null);

  const getStatusBadge = (status: Astronaut['status']) => {
    switch (status) {
      case 'Healthy':
        return 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50';
      case 'Tired':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/50';
      case 'Radiation Alert':
        return 'text-purple-300 bg-purple-950/80 border-purple-500/50 animate-pulse';
      case 'Hypoxic':
        return 'text-sky-300 bg-sky-950/80 border-sky-500/50 animate-pulse';
      case 'Critical':
        return 'text-red-300 bg-red-950/80 border-red-500/50 animate-pulse';
    }
  };

  const getStatusLabel = (status: Astronaut['status']) => {
    if (language !== 'bn') return status.toUpperCase();
    switch (status) {
      case 'Healthy': return 'সুস্থ';
      case 'Tired': return 'ক্লান্ত';
      case 'Radiation Alert': return 'বিকিরণ ঝুঁকি';
      case 'Hypoxic': return 'অক্সিজেন সংকট';
      case 'Critical': return 'সংকটপূর্ণ';
    }
  };

  const getRoleLabel = (role: string) => {
    if (language !== 'bn') return role.toUpperCase();
    switch (role.toLowerCase()) {
      case 'commander': return 'কমান্ডার';
      case 'engineer': return 'প্রকৌশলী';
      case 'biologist': return 'জীববিজ্ঞানী';
      case 'scientist': return 'বিজ্ঞানী';
      default: return role;
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
    const isCritical = astro.status === 'Critical' || astro.status === 'Hypoxic';
    const isTired = astro.status === 'Tired';

    return (
      <div className="relative shrink-0">
        <svg 
          className={`w-12 h-12 rounded-full bg-[#0A1020] border-2 transition-transform shadow-md ${
            isCritical ? 'animate-pulse' : ''
          }`} 
          style={{ borderColor: isCritical ? '#EF4444' : accent }} 
          viewBox="0 0 64 64"
        >
          {/* Outer Helmet */}
          <circle cx="32" cy="32" r="24" fill="#1E293B" stroke={accent} strokeWidth="2.5" />
          
          {/* Polarized Visor with Dynamic Glint Reflection */}
          <path 
            d="M 18,30 Q 32,18 46,30 Q 32,42 18,30 Z" 
            fill={isCritical ? "#DC2626" : isTired ? "#0284C7" : accent} 
            opacity={isTired ? "0.6" : "0.85"} 
          />
          
          {/* Specular Visor Highlight */}
          <ellipse cx="26" cy="27" rx="5" ry="2" fill="#FFFFFF" opacity="0.8" />
          
          {/* HUD Target Reticle / Biometric Glint */}
          {!isCritical && (
            <circle cx="38" cy="32" r="1.5" fill="#FFFFFF" opacity="0.9" />
          )}

          {/* Neck Ring Assembly */}
          <rect x="22" y="48" width="20" height="6" rx="2" fill="#475569" stroke={accent} strokeWidth="1" />
        </svg>

        {/* Biometric Status Beacon Dot */}
        <span 
          className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#101827] ${
            isCritical ? 'bg-red-500 animate-ping' : astro.status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400'
          }`} 
        />
      </div>
    );
  };

  const handleOpenAstro = (astro: Astronaut) => {
    sound.playClick();
    setSelectedAstronaut(astro);
  };

  return (
    <div className="w-full text-slate-100 space-y-4">
      {/* Top Banner: Overall Wellbeing + Science Discovery + Active Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-[#090F1E] border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${crewWellbeing > 60 ? 'text-rose-500' : 'text-red-500 animate-ping'}`} />
            <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-white">
              {t('crew.wellbeing')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
              {formatNum(Math.round(crewWellbeing))}%
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
              crewWellbeing >= 75
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : crewWellbeing >= 45
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-red-950/80 border-red-500/50 text-red-300 animate-pulse'
            }`}>
              {crewWellbeing >= 75 ? t('crew.status.nominal') : crewWellbeing >= 45 ? t('crew.status.stressed') : t('crew.status.hazard')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Crew Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E172C] border border-slate-700 text-slate-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-[#52D6FF]" />
            <span>{formatNum(crew.length)} {language === 'bn' ? 'জন সক্রিয়' : 'ACTIVE'}</span>
          </div>

          {/* Science Output Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E172C] border border-purple-500/40">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs font-mono text-purple-300 font-semibold">
              {t('crew.science.pts', { pts: formatNum(sciencePoints) })}
            </span>
          </div>
        </div>
      </div>

      {/* Individual Astronaut Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {crew.map(astro => {
          const astroName = (language === 'bn' && astro.nameBn) ? astro.nameBn : astro.name;
          const astroSpecialty = (language === 'bn' && astro.specialtyBn) ? astro.specialtyBn : astro.specialty;
          const astroTask = (language === 'bn' && astro.currentTaskBn) ? astro.currentTaskBn : astro.currentTask;

          return (
            <div
              key={astro.id}
              onClick={() => handleOpenAstro(astro)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenAstro(astro);
                }
              }}
              className="p-3.5 sm:p-4 rounded-xl bg-[#0D1527] border border-slate-700/90 hover:border-[#52D6FF]/60 hover:bg-[#121E38] transition-all flex flex-col justify-between gap-3 cursor-pointer group shadow-lg select-none active:scale-[0.99]"
            >
              {/* Header: Avatar, Name, Callsign, Role & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {renderAstronautAvatar(astro)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-[#52D6FF] transition-colors">
                        {astroName}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        ({astro.callsign})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-[#52D6FF] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#52D6FF]/10 border border-[#52D6FF]/30">
                        {getRoleLabel(astro.role)}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${getStatusBadge(astro.status)}`}>
                        {getStatusLabel(astro.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-[#52D6FF]/20 text-slate-400 group-hover:text-[#52D6FF] transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Specialty Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/25 px-2.5 py-1.5 rounded-lg">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold truncate">{astroSpecialty}</span>
              </div>

              {/* Active Mission Assignment */}
              <div className="p-2.5 rounded-lg bg-[#080D1A] border border-slate-800 text-xs font-mono">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">
                  {language === 'bn' ? 'চলমান দায়িত্ব:' : 'ACTIVE ASSIGNMENT:'}
                </span>
                <p className="text-[11px] text-[#52D6FF] font-medium flex items-center gap-1.5 leading-snug">
                  <CheckCircle2 className="w-3 h-3 text-[#52D6FF] shrink-0" />
                  <span className="truncate">{astroTask}</span>
                </p>
              </div>

              {/* Dual Meters: Health & Morale */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-[10px] font-mono">
                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <Heart className="w-3 h-3" />
                      {language === 'bn' ? 'স্বাস্থ্য' : 'HEALTH'}
                    </span>
                    <span className="font-bold">{formatNum(Math.round(astro.health))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${astro.health}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1 text-sky-400 font-semibold">
                      <Activity className="w-3 h-3" />
                      {language === 'bn' ? 'মনোবল' : 'MORALE'}
                    </span>
                    <span className="font-bold">{formatNum(Math.round(astro.morale))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                    <div
                      className="h-full bg-sky-400 rounded-full transition-all duration-300"
                      style={{ width: `${astro.morale}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level 2 Astronaut Detail Modal (Portal-rendered) */}
      <AstronautDetailModal
        astronaut={selectedAstronaut}
        onClose={() => setSelectedAstronaut(null)}
      />
    </div>
  );
};
