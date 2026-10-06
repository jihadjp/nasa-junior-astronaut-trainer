// In-game Achievements Modal

import React from 'react';
import { ACHIEVEMENTS_LIST } from '../../data/achievements';
import { Award, Lock, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AchievementsModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedIds,
  onClose
}) => {
  const { t, formatNum, language } = useLanguage();
  const unlockedSet = new Set(unlockedIds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1324] border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              {t('ach.badge')}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({formatNum(unlockedSet.size)} / {formatNum(ACHIEVEMENTS_LIST.length)} {language === 'bn' ? 'অর্জিত' : 'UNLOCKED'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[460px] overflow-y-auto pr-1">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedSet.has(ach.id);
            const title = (language === 'bn' && ach.titleBn) ? ach.titleBn : ach.title;
            const desc = (language === 'bn' && ach.descriptionBn) ? ach.descriptionBn : ach.description;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-[#121E36] border-amber-500/40 shadow-sm'
                    : 'bg-[#0A1020]/60 border-slate-800/60 opacity-50'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                  isUnlocked
                    ? 'bg-[#060B18] border-amber-500/50 shadow-inner'
                    : 'bg-[#060B18] border-slate-800'
                }`}>
                  {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-slate-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className={`font-display font-bold text-xs uppercase tracking-wider ${
                      isUnlocked ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {title}
                    </h4>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
          >
            {language === 'bn' ? 'মিশনে ফিরে যাও' : 'RETURN TO MISSION'}
          </button>
        </div>
      </div>
    </div>
  );
};
