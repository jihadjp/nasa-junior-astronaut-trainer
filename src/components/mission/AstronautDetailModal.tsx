// Level 2 Progressive Disclosure: Astronaut Bio, Specialty & Biometrics Modal
// Rendered via React Portal directly into document.body to prevent parent modal clipping & transform traps

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Astronaut } from '../../types/game';
import { X, Heart, Activity, CheckCircle2, ShieldAlert, Award, Zap } from 'lucide-react';
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

  // Escape key handler
  useEffect(() => {
    if (!astronaut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [astronaut, onClose]);

  if (!astronaut) return null;

  const astroName = (language === 'bn' && astronaut.nameBn) ? astronaut.nameBn : astronaut.name;
  const astroRole = (language === 'bn' && astronaut.roleBn) ? astronaut.roleBn : astronaut.role.toUpperCase();
  const astroSpecialty = (language === 'bn' && astronaut.specialtyBn) ? astronaut.specialtyBn : astronaut.specialty;
  const astroSpecialtyDesc = (language === 'bn' && astronaut.specialtyDescriptionBn) ? astronaut.specialtyDescriptionBn : astronaut.specialtyDescription;
  const astroTask = (language === 'bn' && astronaut.currentTaskBn) ? astronaut.currentTaskBn : astronaut.currentTask;

  const roleColors: Record<string, string> = {
    commander: '#52D6FF',
    engineer: '#F4C95D',
    biologist: '#35D07F',
    scientist: '#C084FC'
  };
  const accent = roleColors[astronaut.role] || '#52D6FF';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0F172A] border-2 border-[#52D6FF]/60 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-slate-100"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: `0 0 35px -5px ${accent}40, 0 25px 50px -12px rgba(0, 0, 0, 0.8)` }}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Detailed Helmet Avatar */}
            <div className="relative shrink-0">
              <svg
                className="w-14 h-14 rounded-full bg-[#0A1020] border-2 shadow-lg"
                style={{ borderColor: accent }}
                viewBox="0 0 64 64"
              >
                {/* Outer Helmet */}
                <circle cx="32" cy="32" r="24" fill="#1E293B" stroke={accent} strokeWidth="2.5" />
                {/* Polarized Visor with Dynamic Glint */}
                <path d="M 18,30 Q 32,18 46,30 Q 32,42 18,30 Z" fill={accent} opacity="0.85" />
                <ellipse cx="26" cy="27" rx="5" ry="2" fill="#FFFFFF" opacity="0.85" />
                <circle cx="38" cy="32" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <rect x="22" y="48" width="20" height="6" rx="2" fill="#475569" stroke={accent} strokeWidth="1" />
              </svg>
              <span
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0F172A]"
                style={{ backgroundColor: astronaut.status === 'Healthy' ? '#34D399' : '#F59E0B' }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded font-bold uppercase" style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}50` }}>
                  {astroRole}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {astronaut.callsign}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {astroName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NASA Specialty & Crisis Perk */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090E1A] border border-slate-700/80 mb-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {language === 'bn' ? 'নাসা প্রকৌশল বিশেষত্ব:' : 'NASA SPECIALTY:'}
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {astroSpecialty}
            </span>
          </div>

          {astroSpecialtyDesc && (
            <div className="pt-1.5 border-t border-slate-800/80">
              <p className="text-xs text-slate-300 leading-relaxed font-sans flex items-start gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{astroSpecialtyDesc}</span>
              </p>
            </div>
          )}
        </div>

        {/* Current Active Task / Mission Assignment */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 mb-3.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
            {language === 'bn' ? 'চলমান অভিযান অ্যাসাইনমেন্ট:' : 'ACTIVE MISSION ASSIGNMENT:'}
          </span>
          <p className="text-xs sm:text-sm text-[#52D6FF] font-mono font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#52D6FF] shrink-0" />
            <span>{astroTask}</span>
          </p>
        </div>

        {/* Live Vitals & Biometric Gauges */}
        <div className="space-y-3 bg-[#0B1324] p-4 rounded-xl border border-slate-700/80 font-mono text-xs mb-4">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{language === 'bn' ? 'লাইভ শারীরিক ও মানসিক টেলিমেট্রি' : 'LIVE BIOMETRICS & PSYCHOLOGY'}</span>
            <span className="text-emerald-400 font-semibold">{astronaut.status}</span>
          </div>

          {/* Health Gauge */}
          <div>
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Heart className="w-3.5 h-3.5" />
                {language === 'bn' ? 'শারীরিক স্বাস্থ্য (Health):' : 'PHYSICAL INTEGRITY:'}
              </span>
              <span className="font-bold text-rose-300">{formatNum(Math.round(astronaut.health))}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${astronaut.health}%` }}
              />
            </div>
          </div>

          {/* Morale Gauge */}
          <div>
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                {language === 'bn' ? 'মানসিক মনোবল (Morale):' : 'PSYCHOLOGICAL MORALE:'}
              </span>
              <span className="font-bold text-sky-300">{formatNum(Math.round(astronaut.morale))}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${astronaut.morale}%` }}
              />
            </div>
          </div>

          {/* Stress / Crisis Tolerance */}
          {astronaut.stress !== undefined && (
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'মানসিক চাপ স্তর (Stress):' : 'STRESS LEVEL:'}
                </span>
                <span className="font-bold text-amber-300">{formatNum(Math.round(astronaut.stress))}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${astronaut.stress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Dismiss Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'bn' ? 'ডসিয়ার বন্ধ করুন' : 'CLOSE DOSSIER'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
