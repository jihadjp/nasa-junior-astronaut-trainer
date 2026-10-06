// Level 2 Progressive Disclosure: Astronaut Bio, Specialty & Biometrics Modal

import React from 'react';
import type { Astronaut } from '../../types/game';
import { X, Heart, Activity, CheckCircle2, User } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

interface AstronautDetailModalProps {
  astronaut: Astronaut | null;
  onClose: () => void;
}

export const AstronautDetailModal: React.FC<AstronautDetailModalProps> = ({
  astronaut,
  onClose
}) => {
  const { formatNum, language } = useLanguage();

  if (!astronaut) return null;

  const astroName = (language === 'bn' && astronaut.nameBn) ? astronaut.nameBn : astronaut.name;
  const astroRole = (language === 'bn' && astronaut.roleBn) ? astronaut.roleBn : astronaut.role.toUpperCase();
  const astroSpecialty = (language === 'bn' && astronaut.specialtyBn) ? astronaut.specialtyBn : astronaut.specialty;
  const astroTask = (language === 'bn' && astronaut.currentTaskBn) ? astronaut.currentTaskBn : astronaut.currentTask;

  const roleColors: Record<string, string> = {
    commander: '#52D6FF',
    engineer: '#F4C95D',
    biologist: '#35D07F',
    scientist: '#C084FC'
  };
  const accent = roleColors[astronaut.role] || '#52D6FF';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0A1020] border-2 flex items-center justify-center shadow-lg" style={{ borderColor: accent }}>
              <User className="w-6 h-6" style={{ color: accent }} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52D6FF] font-semibold block">
                {language === 'bn' ? 'নভোচারী পরিচিতি' : 'FLIGHT CREW DOSSIER'}
              </span>
              <h3 className="text-base font-bold text-white font-display">
                {astroName}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role & Specialty */}
        <div className="p-3.5 rounded-xl bg-[#090E1A] border border-slate-800 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              {language === 'bn' ? 'মিশন দায়িত্ব:' : 'MISSION ROLE:'}
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30">
              {astroRole}
            </span>
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
              {language === 'bn' ? 'প্রকৌশল বিশেষত্ব:' : 'NASA SPECIALTY:'}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {astroSpecialty}
            </p>
          </div>
        </div>

        {/* Current Active Task */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            {language === 'bn' ? 'চলমান অভিযান অ্যাসাইনমেন্ট:' : 'ACTIVE MISSION ASSIGNMENT:'}
          </span>
          <p className="text-xs text-[#52D6FF] font-mono font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {astroTask}
          </p>
        </div>

        {/* Live Vitals & Gauges */}
        <div className="space-y-3 mb-2 bg-[#0B1324] p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Heart className="w-3.5 h-3.5" />
                {language === 'bn' ? 'শারীরিক স্বাস্থ্য (Health):' : 'PHYSICAL HEALTH:'}
              </span>
              <span className="font-bold">{formatNum(Math.round(astronaut.health))}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${astronaut.health}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                {language === 'bn' ? 'মানসিক মনোবল (Morale):' : 'PSYCHOLOGICAL MORALE:'}
              </span>
              <span className="font-bold">{formatNum(Math.round(astronaut.morale))}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${astronaut.morale}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
