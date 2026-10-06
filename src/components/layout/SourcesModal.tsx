// NASA Sources, Citations & Open Source Licenses Modal (Prompt Sections 24, 44, 45)

import React from 'react';
import { NASA_DATA_SOURCES } from '../../data/nasaSources';
import { Database, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SourcesModalProps {
  onClose: () => void;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0B1324] border border-[#52D6FF]/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#52D6FF]/20 border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              {t('sources.badge')}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              // OPEN ACCESS REGISTRY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Educational Accuracy Notice (Section 44) */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 mb-5 text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#52D6FF] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-mono text-[11px] mb-0.5">
              {t('sources.notice.title')}
            </strong>
            {t('sources.notice.desc')}
          </div>
        </div>

        {/* List of NASA Sources & Datasets */}
        <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
          {NASA_DATA_SOURCES.map(source => {
            const name = (language === 'bn' && source.nameBn) ? source.nameBn : source.name;
            const dataType = (language === 'bn' && source.dataTypeBn) ? source.dataTypeBn : source.dataType;
            const desc = (language === 'bn' && source.descriptionBn) ? source.descriptionBn : source.description;

            return (
              <div
                key={source.id}
                className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-white text-sm">
                    {name}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#52D6FF]/10 text-[#52D6FF] border border-[#52D6FF]/20 shrink-0">
                    {dataType}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {t('sources.agency', { agency: source.agencyOrPublisher })}
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {desc}
                </p>

                <div className="text-[11px] font-mono text-slate-400 italic bg-[#060B18] p-2 rounded border border-slate-800">
                  {t('sources.citation', { citation: source.citation })}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                  <span className="text-emerald-400">
                    {t('sources.license', { license: source.license })}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#52D6FF] hover:underline flex items-center gap-1"
                  >
                    {t('sources.link')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technology Credits */}
        <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800 text-[11px] font-mono text-slate-400 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span>Tech Stack: React 19 + TypeScript + Vite + Tailwind CSS + Web Audio Synthesizer</span>
          <span className="text-emerald-400">
            {language === 'bn' ? '১০০% অফলাইন-ফার্স্ট আর্কিটেকচার' : '100% Offline-First Architecture'}
          </span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
          >
            {t('common.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
};
