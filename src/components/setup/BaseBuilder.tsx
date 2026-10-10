// Base Design & Module Allocation Phase with Interactive Tactical Pad & Budgeting

import React, { useState } from 'react';
import type { BaseModule, ModuleType } from '../../types/game';
import { INITIAL_MODULES } from '../../simulation/modules';
import { Wrench, ArrowRight, ArrowLeft, Plus, Minus, LayoutGrid, Layers } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { InteractiveBasePad } from './InteractiveBasePad';

interface BaseBuilderProps {
  onCompleteBase: (modules: Record<ModuleType, BaseModule>, customBudget: { extraSpares: number; extraFood: number }) => void;
  onBack: () => void;
  planet?: 'moon' | 'mars';
  siteName?: string;
}

const STARTING_PAYLOAD_CREDITS = 1000;

export const BaseBuilder: React.FC<BaseBuilderProps> = ({
  onCompleteBase,
  onBack,
  planet = 'moon',
  siteName = 'Artemis Base Camp'
}) => {
  const { t, formatNum, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'pad' | 'cards'>('pad');
  const [modules, setModules] = useState<Record<ModuleType, BaseModule>>(
    JSON.parse(JSON.stringify(INITIAL_MODULES))
  );
  const [extraFood, setExtraFood] = useState<number>(20); // extra kg food rations
  const [extraSpares, setExtraSpares] = useState<number>(20); // extra spare units
  const [expandedModId, setExpandedModId] = useState<string | null>(null);

  // Calculate current payload expenditure
  // Modules base levels cost costPoints * (level - 1)
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
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 text-slate-100 select-none">
      {/* Title & Directive */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52D6FF]/15 border border-[#52D6FF]/30 text-[#52D6FF] text-xs font-mono mb-2">
          <Wrench className="w-3.5 h-3.5" />
          {t('base.badge')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {t('base.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-1">
          {t('base.desc')}
        </p>
      </div>

      {/* Payload Budget HUD Bar & View Mode Toggle */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#090F20] border border-[#52D6FF]/40 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-14 z-20 backdrop-blur-md shadow-xl">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {t('base.budget.label')}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl sm:text-2xl font-mono font-bold ${creditsRemaining < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatNum(creditsRemaining)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {formatNum(STARTING_PAYLOAD_CREDITS)} {language === 'bn' ? 'ক্রেডিট বাকি' : 'CREDITS REMAINING'}
            </span>
          </div>
        </div>

        {/* View Mode Toggle: Interactive Pad vs Card List */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#040814] border border-slate-700">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode('pad');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'pad'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'কনস্ট্রাকশন প্যাড' : 'TACTICAL PAD'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode('cards');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মডিউল তালিকা' : 'MODULE LIST'}</span>
          </button>
        </div>
      </div>

      {/* Main Construction View */}
      {viewMode === 'pad' ? (
        <div className="mb-6 animate-fadeIn">
          <InteractiveBasePad
            planet={planet}
            siteName={siteName}
            modules={modules}
            creditsRemaining={creditsRemaining}
            onUpgradeModule={handleUpgradeModule}
            onDowngradeModule={handleDowngradeModule}
          />
        </div>
      ) : (
        /* Alternate Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 animate-fadeIn">
          {Object.values(modules).map(mod => {
            const canUpgrade = mod.level < mod.maxLevel && creditsRemaining >= mod.costPoints;
            const canDowngrade = mod.level > 1;
            const modName = (language === 'bn' && mod.nameBn) ? mod.nameBn : mod.name;
            const modDesc = (language === 'bn' && mod.descriptionBn) ? mod.descriptionBn : mod.description;

            return (
              <div
                key={mod.id}
                className="p-3.5 sm:p-4 rounded-xl bg-[#0B1224]/90 border border-slate-700 hover:border-[#52D6FF]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className="font-display font-bold text-sm text-white truncate">
                        {modName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setExpandedModId(prev => prev === mod.id ? null : mod.id)}
                        className="p-1 rounded text-slate-400 hover:text-[#52D6FF] text-[10px] font-mono shrink-0 cursor-pointer"
                        title={language === 'bn' ? 'মডিউল বিবরণ ও নাসা তথ্য' : 'Module specifications'}
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/30 font-bold shrink-0">
                      {t('base.lvl', { lvl: formatNum(mod.level) })}
                    </span>
                  </div>

                  {expandedModId === mod.id ? (
                    <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-[#060A16] p-2.5 rounded-lg border border-slate-800 animate-fadeIn">
                      {modDesc}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 truncate mb-3">
                      {modDesc}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#050914] p-2 rounded-lg border border-slate-800 mb-3">
                    <div>{t('base.draw')} <span className="text-amber-400">{formatNum(mod.powerDraw)} kW</span></div>
                    <div>{t('base.cost', { cost: formatNum(mod.costPoints) })}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleDowngradeModule(mod.id)}
                    disabled={!canDowngrade}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-center min-w-[32px] cursor-pointer ${
                      canDowngrade
                        ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95'
                        : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 text-center font-mono text-xs text-slate-400">
                    {language === 'bn' ? 'দক্ষতা:' : 'Eff:'} <strong className="text-emerald-400">{formatNum(Math.round(mod.efficiency * 100))}%</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpgradeModule(mod.id)}
                    disabled={!canUpgrade}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-center min-w-[32px] cursor-pointer ${
                      canUpgrade
                        ? 'border-[#52D6FF]/50 bg-[#52D6FF] text-slate-950 font-bold hover:bg-[#38BDF8] active:scale-95 shadow-md shadow-[#52D6FF]/20'
                        : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Extra Mission Rations & Spare Parts Allocation */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#090F20] border border-slate-700/80 mb-6">
        <h3 className="text-sm font-bold font-display text-white mb-1">
          {t('base.supplies.title')}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {t('base.supplies.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Stored Food Rations */}
          <div className="p-3.5 rounded-xl bg-[#050A16] border border-slate-800 flex items-center justify-between">
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
                type="button"
                onClick={() => setExtraFood(prev => Math.max(0, prev - 10))}
                className="min-w-[34px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                -{formatNum(10)}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (creditsRemaining >= 25) setExtraFood(prev => prev + 10);
                }}
                className="min-w-[34px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#52D6FF] text-slate-950 hover:bg-[#38BDF8] text-xs font-mono font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                +{formatNum(10)}
              </button>
            </div>
          </div>

          {/* Extra Spare Parts */}
          <div className="p-3.5 rounded-xl bg-[#050A16] border border-slate-800 flex items-center justify-between">
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
                type="button"
                onClick={() => setExtraSpares(prev => Math.max(0, prev - 5))}
                className="min-w-[34px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-mono flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                -{formatNum(5)}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (creditsRemaining >= 20) setExtraSpares(prev => prev + 5);
                }}
                className="min-w-[34px] min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#52D6FF] text-slate-950 hover:bg-[#38BDF8] text-xs font-mono font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                +{formatNum(5)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[42px] py-2.5 px-4 sm:px-5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-mono text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('base.btn.back')}
        </button>

        <button
          type="button"
          onClick={handleStartMission}
          className="min-h-[42px] py-2.5 sm:py-3 px-5 sm:px-7 rounded-xl bg-gradient-to-r from-emerald-500 to-[#52D6FF] hover:from-emerald-400 hover:to-[#38BDF8] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-xl hover:shadow-[#52D6FF]/25 transition-all active:scale-95 cursor-pointer"
        >
          {t('base.btn.launch')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
