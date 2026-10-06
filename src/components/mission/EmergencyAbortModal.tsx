// Interactive NASA Emergency Mission Abort Confirmation Modal

import React from 'react';
import { AlertOctagon, X, RotateCcw, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

interface EmergencyAbortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAbortToReport: () => void;
  onConfirmAbortToSetup: () => void;
}

export const EmergencyAbortModal: React.FC<EmergencyAbortModalProps> = ({
  isOpen,
  onClose,
  onConfirmAbortToReport,
  onConfirmAbortToSetup
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="abort-dialog-title"
    >
      <div className="relative w-full max-w-lg bg-[#0F172A] border-2 border-rose-500/60 rounded-2xl shadow-2xl shadow-rose-950/60 overflow-hidden">
        {/* Red Alert Header Banner */}
        <div className="bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-slate-900 px-6 py-4 border-b border-rose-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold block">
                {t('common.abort.subtitle')}
              </span>
              <h2 id="abort-dialog-title" className="text-lg font-bold text-white font-display">
                {t('common.abort.title')}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Warning Message Box */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-200/90 leading-relaxed">
              {t('common.abort.msg')}
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-400 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              {language === 'bn' ? 'জরুরি প্রটোকল নির্দেশনা:' : 'EMERGENCY PROTOCOL ACTIONS:'}
            </div>
            <p className="pl-3.5">
              {language === 'bn'
                ? '• ঘাঁটির জীবনধারণ ব্যবস্থা অবিলম্বে বন্ধ হয়ে যাবে।'
                : '• Outpost life-support grids and habitat systems will safely power down.'}
            </p>
            <p className="pl-3.5">
              {language === 'bn'
                ? '• বর্তমান দিনের তথ্য বিশ্লেষণ করে পোস্ট-মরটেম ফ্লাইট রিপোর্ট প্রস্তুত হবে।'
                : '• A complete mission debrief & telemetry post-mortem will be generated.'}
            </p>
          </div>

          {/* Action Choice Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            {/* Resume Mission / Cancel Button */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition-all order-3 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.abort.cancel')}
            </button>

            {/* Quick Abort to Setup */}
            <button
              onClick={() => {
                sound.playClick();
                onConfirmAbortToSetup();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 flex items-center justify-center gap-2 transition-all order-2 sm:order-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('common.abort.setup')}
            </button>

            {/* Confirm Abort to Report */}
            <button
              onClick={() => {
                sound.playWarning();
                onConfirmAbortToReport();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all order-1 sm:order-3 active:scale-95"
            >
              <AlertOctagon className="w-4 h-4" />
              {t('common.abort.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
