// Crew Selector: Astronaut roster, roles, specialties, and crew size trade-off

import React, { useState } from 'react';
import { DEFAULT_ASTRONAUTS } from '../../simulation/crew';
import { Users, Award, Heart, Activity, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t, formatNum, language } = useLanguage();
  const [expandedAstroId, setExpandedAstroId] = useState<string | null>(null);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 text-slate-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Users className="w-3.5 h-3.5" />
          {t('crew.badge')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {t('crew.title')}
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
          {t('crew.desc')}
        </p>
      </div>

      {/* Crew Size Selector Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        {[2, 3, 4].map(count => (
          <button
            key={count}
            onClick={() => handleCountChange(count)}
            className={`flex-1 sm:flex-initial min-w-[85px] px-3 sm:px-5 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] ${
              crewCount === count
                ? 'bg-[#52D6FF] text-slate-950 border-[#52D6FF] shadow-lg shadow-[#52D6FF]/20 scale-[1.02] sm:scale-105'
                : 'bg-[#101827] text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>{t('crew.btn.count', { count: formatNum(count) })}</span>
            {count === 4 && <span className="hidden xs:inline text-[10px] opacity-80">({language === 'bn' ? 'সুপারিশ' : 'rec'})</span>}
          </button>
        ))}
      </div>

      {/* Consumption Trade-off Summary Callout */}
      <div className="p-3.5 rounded-xl bg-[#060B18] border border-slate-800 font-mono text-xs text-slate-300 mb-6 flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <span className="text-slate-500 text-[10px] block">{t('crew.daily.o2')}</span>
          <span className="text-[#52D6FF] font-bold">
            {formatNum((crewCount * 0.84).toFixed(2))} {language === 'bn' ? 'কেজি / দিন' : 'kg / day'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">{t('crew.daily.water')}</span>
          <span className="text-sky-400 font-bold">
            {formatNum((crewCount * 2.5).toFixed(1))} {language === 'bn' ? 'লিটার / দিন' : 'Liters / day'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">{t('crew.daily.food')}</span>
          <span className="text-emerald-400 font-bold">
            {formatNum((crewCount * 1.4).toFixed(1))} {language === 'bn' ? 'কেজি / দিন' : 'kg / day'}
          </span>
        </div>
      </div>

      {/* Astronaut Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {DEFAULT_ASTRONAUTS.map((astro, idx) => {
          const isActive = idx < crewCount;
          const astroName = (language === 'bn' && astro.nameBn) ? astro.nameBn : astro.name;
          const astroSpecialty = (language === 'bn' && astro.specialtyBn) ? astro.specialtyBn : astro.specialty;
          const astroDesc = (language === 'bn' && astro.specialtyDescriptionBn) ? astro.specialtyDescriptionBn : astro.specialtyDescription;

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
                    {astroName}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30">
                    {getRoleLabel(astro.role)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 mb-1">
                  <div className="text-xs font-mono text-amber-300 flex items-center gap-1 font-semibold">
                    <Award className="w-3 h-3 text-amber-400" />
                    {astroSpecialty}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedAstroId(prev => prev === astro.id ? null : astro.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-[#52D6FF] hover:bg-[#52D6FF]/15 text-[10px] font-mono flex items-center gap-0.5"
                    title={language === 'bn' ? 'বিশেষত্ব ও ব্যাকগ্রাউন্ড' : 'Dossier details'}
                  >
                    <span>ⓘ</span>
                  </button>
                </div>

                {expandedAstroId === astro.id ? (
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0A1020] p-2 rounded border border-slate-800 animate-fadeIn my-1.5 font-sans">
                    {astroDesc}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 truncate mb-1">
                    {astroDesc}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> {t('crew.health')}: {formatNum(astro.health)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-sky-400" /> {t('crew.morale')}: {formatNum(astro.morale)}%
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
          {t('crew.btn.back')}
        </button>

        <button
          onClick={handleProceed}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-[#52D6FF]/20 transition-all"
        >
          {t('crew.btn.confirm')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
