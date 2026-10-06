// Base Design & Module Allocation Phase with Opportunity Cost Budgeting

import React, { useState } from 'react';
import type { BaseModule, ModuleType } from '../../types/game';
import { INITIAL_MODULES } from '../../simulation/modules';
import { Wrench, Sparkles, ArrowRight, ArrowLeft, Plus, Minus, AlertCircle } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface BaseBuilderProps {
  onCompleteBase: (modules: Record<ModuleType, BaseModule>, customBudget: { extraSpares: number; extraFood: number }) => void;
  onBack: () => void;
}

const STARTING_PAYLOAD_CREDITS = 1000;

export const BaseBuilder: React.FC<BaseBuilderProps> = ({
  onCompleteBase,
  onBack
}) => {
  const { t, formatNum, language } = useLanguage();
  const [modules, setModules] = useState<Record<ModuleType, BaseModule>>(
    JSON.parse(JSON.stringify(INITIAL_MODULES))
  );
  const [extraFood, setExtraFood] = useState<number>(20); // extra kg food rations
  const [extraSpares, setExtraSpares] = useState<number>(20); // extra spare units
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

  // Calculate current payload expenditure
  // Modules base levels cost costPoints * level
  const modulePointsSpent = Object.values(modules).reduce((sum, mod) => {
    return sum + mod.costPoints * (mod.level - 1);
  }, 450); // baseline level 1 modules cost 450 total

  const suppliesPointsSpent = extraFood * 2.5 + extraSpares * 4;
  const totalSpent = modulePointsSpent + suppliesPointsSpent;
  const creditsRemaining = Math.max(0, STARTING_PAYLOAD_CREDITS - totalSpent);

  const handleUpgradeModule = (modId: ModuleType) => {
    const mod = modules[modId];
    if (mod.level >= mod.maxLevel) return;
    if (creditsRemaining < mod.costPoints) {
      sound.playWarning();
      return;
    }
    sound.playClick();
    setModules(prev => ({
      ...prev,
      [modId]: {
        ...prev[modId],
        level: prev[modId].level + 1,
        efficiency: Math.min(1.0, prev[modId].efficiency + 0.15)
      }
    }));
  };

  const handleDowngradeModule = (modId: ModuleType) => {
    const mod = modules[modId];
    if (mod.level <= 1) return;
    sound.playClick();
    setModules(prev => ({
      ...prev,
      [modId]: {
        ...prev[modId],
        level: prev[modId].level - 1
      }
    }));
  };

  const handleStartMission = () => {
    sound.playSuccess();
    onCompleteBase(modules, { extraSpares, extraFood });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-slate-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Wrench className="w-3.5 h-3.5" />
          {t('base.badge')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {t('base.title')}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-1">
          {t('base.desc')}
        </p>
      </div>

      {/* Payload Budget HUD Bar */}
      <div className="p-4 rounded-xl bg-[#0B1324] border border-[#52D6FF]/40 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-14 z-10 backdrop-blur-md shadow-xl">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            {t('base.budget.label')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-mono font-bold ${creditsRemaining < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatNum(creditsRemaining)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {formatNum(STARTING_PAYLOAD_CREDITS)} {language === 'bn' ? 'ক্রেডিট বাকি' : 'CREDITS REMAINING'}
            </span>
          </div>
        </div>

        {/* Trade-off Warning */}
        {creditsRemaining < 100 && (
          <div className="text-xs font-mono text-amber-300 flex items-center gap-1.5 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            {t('base.budget.warning')}
          </div>
        )}
      </div>

      {/* Modules Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.values(modules).map(mod => {
          const canUpgrade = mod.level < mod.maxLevel && creditsRemaining >= mod.costPoints;
          const canDowngrade = mod.level > 1;
          const modName = (language === 'bn' && mod.nameBn) ? mod.nameBn : mod.name;
          const modDesc = (language === 'bn' && mod.descriptionBn) ? mod.descriptionBn : mod.description;

          return (
            <div
              key={mod.id}
              className="p-4 rounded-xl bg-[#101827]/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="font-display font-bold text-sm text-white truncate">
                      {modName}
                    </h4>
                    <button
                      onClick={() => setExpandedModId(prev => prev === mod.id ? null : mod.id)}
                      className="p-1 rounded text-slate-400 hover:text-[#52D6FF] hover:bg-[#52D6FF]/15 text-[10px] font-mono shrink-0"
                      title={language === 'bn' ? 'মডিউল বিবরণ ও নাসা তথ্য' : 'Module specifications'}
                    >
                      <span>ⓘ</span>
                    </button>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30 font-bold shrink-0">
                    {t('base.lvl', { lvl: formatNum(mod.level) })}
                  </span>
                </div>

                {expandedModId === mod.id ? (
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-[#0A1020] p-2.5 rounded-lg border border-slate-800 animate-fadeIn">
                    {modDesc}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 truncate mb-3">
                    {modDesc}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#060B18] p-2 rounded-lg border border-slate-800 mb-3">
                  <div>{t('base.draw')} <span className="text-amber-400">{formatNum(mod.powerDraw)} kW</span></div>
                  <div>{t('base.cost', { cost: formatNum(mod.costPoints) })}</div>
                </div>
              </div>

              {/* Upgrade / Downgrade Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">
                  {mod.level === mod.maxLevel ? t('base.max') : t('base.nextLvl', { cost: formatNum(mod.costPoints) })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDowngradeModule(mod.id)}
                    disabled={!canDowngrade}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Downgrade module level"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleUpgradeModule(mod.id)}
                    disabled={!canUpgrade}
                    className="p-1.5 rounded-lg bg-[#52D6FF] hover:bg-[#38BDF8] text-slate-950 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Upgrade module level"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Supplies: Stored Rations vs Spare Parts */}
      <div className="p-4 rounded-xl bg-[#0B1324] border border-slate-800 mb-8">
        <h4 className="font-display font-bold text-sm text-white mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {t('base.reserves.title')}
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          {t('base.reserves.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Stored Food Rations */}
          <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                {t('base.rations.label', { amount: formatNum(extraFood) })}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {t('base.rations.cost', { cost: formatNum(extraFood * 2.5) })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExtraFood(prev => Math.max(0, prev - 10))}
                className="p-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono"
              >
                -{formatNum(10)}
              </button>
              <button
                onClick={() => {
                  if (creditsRemaining >= 25) setExtraFood(prev => prev + 10);
                }}
                className="p-1 rounded bg-[#52D6FF] text-slate-950 hover:bg-[#38BDF8] text-xs font-mono font-bold"
              >
                +{formatNum(10)}
              </button>
            </div>
          </div>

          {/* Extra Spare Parts */}
          <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 block">
                {t('base.spares.label', { amount: formatNum(extraSpares) })}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {t('base.spares.cost', { cost: formatNum(extraSpares * 4) })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExtraSpares(prev => Math.max(0, prev - 5))}
                className="p-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono"
              >
                -{formatNum(5)}
              </button>
              <button
                onClick={() => {
                  if (creditsRemaining >= 20) setExtraSpares(prev => prev + 5);
                }}
                className="p-1 rounded bg-[#52D6FF] text-slate-950 hover:bg-[#38BDF8] text-xs font-mono font-bold"
              >
                +{formatNum(5)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="py-2.5 px-5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-mono text-xs font-bold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('base.btn.back')}
        </button>

        <button
          onClick={handleStartMission}
          className="py-3 px-7 rounded-xl bg-gradient-to-r from-emerald-500 to-[#52D6FF] hover:from-emerald-400 hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm flex items-center gap-2 shadow-xl hover:shadow-[#52D6FF]/25 transition-all"
        >
          {t('base.btn.launch')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
