// Crew Wellbeing & Individual Astronaut Status Cards with Progressive Disclosure (Level 1 + Level 2)

import React, { useState } from 'react';
import type { Astronaut, SimulationState } from '../../types/game';
import { Heart, Sparkles, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Tooltip } from '../common/Tooltip';
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

  const getStatusLabel = (status: Astronaut['status']) => {
    if (language !== 'bn') return status;
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
          className={`w-10 h-10 rounded-full bg-[#0A1020] border-2 transition-transform ${
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
            fill={isCritical ? "#DC2626" : isTired ? "#0284C7" : "#38BDF8"} 
            opacity={isTired ? "0.6" : "0.85"} 
          />
          
          {/* Specular Visor Highlight */}
          <ellipse cx="26" cy="27" rx="5" ry="2" fill="#FFFFFF" opacity="0.75" />
          
          {/* HUD Target Reticle / Biometric Glint */}
          {!isCritical && (
            <circle cx="38" cy="32" r="1.5" fill="#52D6FF" opacity="0.8" />
          )}

          {/* Neck Ring Assembly */}
          <rect x="22" y="48" width="20" height="6" rx="2" fill="#475569" stroke={accent} strokeWidth="1" />
        </svg>

        {/* Biometric Status Beacon Dot */}
        <span 
          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#101827] ${
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
    <div className="w-full bg-[#0B132B]/90 rounded-2xl border border-slate-700/80 p-2.5 sm:p-3.5 backdrop-blur-md shadow-xl">
      {/* Top Banner: Overall Wellbeing + Science Discovery */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Heart className={`w-4 h-4 ${crewWellbeing > 60 ? 'text-rose-500' : 'text-red-500 animate-ping'}`} />
            <span className="font-display font-bold text-xs tracking-wide text-white">
              {t('crew.wellbeing')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">
              {formatNum(Math.round(crewWellbeing))}%
            </span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${
              crewWellbeing >= 75
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : crewWellbeing >= 45
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-red-950/60 border-red-500/40 text-red-300 animate-pulse'
            }`}>
              {crewWellbeing >= 75 ? t('crew.status.nominal') : crewWellbeing >= 45 ? t('crew.status.stressed') : t('crew.status.hazard')}
            </span>
          </div>
        </div>

        {/* Science Output Display */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#080E1C] border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-xs font-mono text-purple-300 font-semibold">
            {t('crew.science.pts', { pts: formatNum(sciencePoints) })}
          </span>
        </div>
      </div>

      {/* Individual Astronaut Roster Grid (Level 1 Clean View) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {crew.map(astro => {
          const astroName = (language === 'bn' && astro.nameBn) ? astro.nameBn : astro.name;

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
              className="p-2.5 rounded-xl bg-[#111C36]/80 border border-slate-700/80 hover:border-[#52D6FF]/50 hover:bg-[#162444] transition-all flex items-center justify-between gap-2.5 cursor-pointer group shadow-sm select-none active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {renderAstronautAvatar(astro)}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-slate-100 truncate font-display group-hover:text-[#52D6FF] transition-colors">
                      {astroName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] font-mono text-[#52D6FF] font-medium uppercase truncate">
                      {getRoleLabel(astro.role)}
                    </span>
                    <span className={`text-[8px] font-mono px-1 py-0.2 rounded border font-semibold ${getStatusBadge(astro.status)}`}>
                      {getStatusLabel(astro.status)}
                    </span>
                  </div>

                  {/* Health Mini Bar */}
                  <div className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5 border border-slate-700/60">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${astro.health}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ⓘ Info Button with Desktop Tooltip */}
              <Tooltip content={language === 'bn' ? 'নভোচারীর স্বাস্থ্য ও বিশদ বিবরণ' : 'Astronaut dossier & biometrics'}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAstro(astro);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#52D6FF] hover:bg-[#52D6FF]/15 transition-colors shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label={`${astroName} profile`}
                >
                  <Info className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Level 2 Astronaut Detail Modal */}
      <AstronautDetailModal
        astronaut={selectedAstronaut}
        onClose={() => setSelectedAstronaut(null)}
      />
    </div>
  );
};
