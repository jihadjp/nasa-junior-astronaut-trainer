// Level 2 Progressive Disclosure: Interactive Resource Detail Modal / Sheet

import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

export interface ResourceDetailData {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  current: number;
  max: number;
  unit: string;
  pct: number;
  delta: number;
  deltaUnit: string;
  isCritical: boolean;
  isWarning: boolean;
  statusLabel: string;
  statusColor: string;
  whyText: string;
  warningText: string;
  educationalWhyId?: string;
  inflow?: number;
  outflow?: number;
}

interface ResourceDetailModalProps {
  data: ResourceDetailData | null;
  onClose: () => void;
  onOpenEducationalWhy?: (whyId: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  data,
  onClose,
  onOpenEducationalWhy
}) => {
  const { t, formatNum, language } = useLanguage();

  if (!data) return null;

  const Icon = data.icon;

  const handleDeepScience = () => {
    sound.playClick();
    if (data.educationalWhyId && onOpenEducationalWhy) {
      onOpenEducationalWhy(data.educationalWhyId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-950/40 p-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80">
              <Icon className={`w-6 h-6 ${data.iconColor}`} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52D6FF] font-semibold block">
                {language === 'bn' ? 'টেলিমেট্রি বিশদ' : 'TELEMETRY DOSSIER'}
              </span>
              <h3 className="text-base font-bold text-white font-display">
                {data.name}
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

        {/* Level 1 Summary Bar */}
        <div className="p-3.5 rounded-xl bg-[#090E1A] border border-slate-800/80 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">
              {t('res.detail.stock')}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${data.statusColor}`}>
              {data.statusLabel}
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold text-white tracking-tight">
                {formatNum(Math.round(data.current * 10) / 10)}
              </span>
              <span className="text-xs text-slate-400">
                / {formatNum(data.max)} {data.unit}
              </span>
            </div>
            <span className="text-sm font-mono font-bold text-[#52D6FF]">
              {formatNum(Math.round(data.pct))}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                data.isCritical
                  ? 'bg-red-500'
                  : data.isWarning
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF]'
              }`}
              style={{ width: `${Math.min(100, Math.max(3, data.pct))}%` }}
            />
          </div>
        </div>

        {/* Daily Net Flow Dynamics */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0B1324] border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">
              {t('res.detail.net')}
            </span>
            <div className="flex items-center gap-1 mt-1 font-bold">
              {data.delta > 0.05 ? (
                <span className="text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  +{formatNum(data.delta)} {data.deltaUnit}
                </span>
              ) : data.delta < -0.05 ? (
                <span className="text-red-400 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  {formatNum(data.delta)} {data.deltaUnit}
                </span>
              ) : (
                <span className="text-slate-400 flex items-center">
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                  {formatNum(0)} {data.deltaUnit}
                </span>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B1324] border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">
              {language === 'bn' ? 'স্ট্যাটাস সতর্কতা' : 'INTEGRITY STATUS'}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {data.isCritical ? (
                <span className="text-red-400 font-bold flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  {language === 'bn' ? 'জরুরি ঘাটতি' : 'CRITICAL DEFICIT'}
                </span>
              ) : data.isWarning ? (
                <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  {language === 'bn' ? 'সতর্কতা স্তর' : 'WARNING LEVEL'}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'নিরাপদ মজুদ' : 'STABLE BUFFER'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Why it Matters (Child-friendly Explanation) */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-3 space-y-1">
          <span className="text-[11px] font-mono text-[#52D6FF] font-bold flex items-center gap-1.5">
            🧠 {t('res.detail.why')}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {data.whyText}
          </p>
        </div>

        {/* Consequence of Depletion */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/25 mb-4 space-y-1">
          <span className="text-[11px] font-mono text-rose-300 font-bold flex items-center gap-1.5">
            ⚠️ {t('res.detail.warning')}
          </span>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            {data.warningText}
          </p>
        </div>

        {/* Level 3 Deep Science Button */}
        {data.educationalWhyId && (
          <button
            onClick={handleDeepScience}
            className="w-full py-2.5 px-3 rounded-xl bg-[#52D6FF]/15 hover:bg-[#52D6FF]/25 border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('res.detail.scienceBtn')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
