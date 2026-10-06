// Mission Commander Telemetry: In-depth Subsystem Matrix and Rates

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Cpu, Activity, Zap, Wind, ShieldCheck, Layers } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CommanderTelemetryProps {
  state: SimulationState;
}

export const CommanderTelemetry: React.FC<CommanderTelemetryProps> = ({ state }) => {
  const { t, formatNum, language } = useLanguage();
  const { resources, deltas, modules, environment, cumulativeRadiation_mSv, baseIntegrity, crew } = state;

  return (
    <div className="w-full bg-[#0A1020]/95 rounded-xl border border-amber-500/30 p-3 sm:p-4 font-mono text-xs text-slate-300 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-amber-500/20 mb-3">
        <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-sm">
          <Cpu className="w-4 h-4 text-amber-400" />
          {t('cmd.title')}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-amber-400/80">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          {t('cmd.active')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Column 1: Power & Electrical Bus */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-[#52D6FF] font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Zap className="w-3.5 h-3.5" />
            {t('cmd.bus')}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.solarGen')}</span>
            <span className="text-emerald-400 font-bold">{formatNum(deltas.powerGen)} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.load')}</span>
            <span className="text-rose-400 font-bold">{formatNum(deltas.powerLoad)} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.net')}</span>
            <span className={deltas.powerNet >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {deltas.powerNet > 0 ? `+${formatNum(deltas.powerNet)}` : formatNum(deltas.powerNet)} kW
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.battery')}</span>
            <span className="text-white">{formatNum(resources.power)} / {formatNum(resources.powerMax)} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.tau')}</span>
            <span className="text-amber-300">{formatNum((environment.dustLevel * 0.05).toFixed(2))}</span>
          </div>
        </div>

        {/* Column 2: ECLSS Life Support Loop Closure */}
        <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Wind className="w-3.5 h-3.5" />
            {t('cmd.eclss')}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.o2Use')}</span>
            <span className="text-slate-200">{formatNum((crew.length * 0.84).toFixed(2))} {language === 'bn' ? 'কেজি/দিন' : 'kg/day'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.o2Gen')}</span>
            <span className="text-emerald-400 font-bold">+{formatNum(((crew.length * 0.84) + deltas.oxygen).toFixed(2))} {language === 'bn' ? 'কেজি/দিন' : 'kg/day'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.h2oClosure')}</span>
            <span className="text-sky-400 font-bold">{formatNum(Math.round(modules.water_recycler.efficiency * 95))}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.h2oBal')}</span>
            <span className={deltas.water >= 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {deltas.water > 0 ? `+${formatNum(deltas.water)}` : formatNum(deltas.water)} {language === 'bn' ? 'লিটার/দিন' : 'L/day'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.foodFlux')}</span>
            <span className={deltas.food >= 0 ? "text-emerald-400" : "text-amber-400"}>
              {deltas.food > 0 ? `+${formatNum(deltas.food)}` : formatNum(deltas.food)} {language === 'bn' ? 'কেজি/দিন' : 'kg/day'}
            </span>
          </div>
        </div>

        {/* Column 3: Radiation Dosimetry & Structural Resilience */}
        <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-purple-400 font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('cmd.rad')}
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.dailyDose')}</span>
            <span className="text-purple-300 font-bold">{formatNum(deltas.radiationDose)} mSv/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.cumDose')}</span>
            <span className="text-white font-bold">{formatNum(cumulativeRadiation_mSv.toFixed(2))} mSv</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.margin')}</span>
            <span className="text-emerald-400 font-bold">
              {formatNum(Math.max(0, Math.round((1 - cumulativeRadiation_mSv / 600) * 100)))}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.hull')}</span>
            <span className="text-sky-300 font-bold">{formatNum(baseIntegrity)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('cmd.spares')}</span>
            <span className="text-amber-300 font-bold">{formatNum(resources.spareParts)} {language === 'bn' ? 'টি' : 'units'}</span>
          </div>
        </div>
      </div>

      {/* Subsystem Dependencies Graph / Matrix */}
      <div className="mt-3 p-3 rounded-lg bg-[#0A1020] border border-slate-800">
        <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          {t('cmd.matrix')}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">
              {language === 'bn' ? '⚡ বিদ্যুৎ গ্রিড' : '⚡ Power Grid'}
            </span>
            <p className="text-slate-400">
              {language === 'bn' ? 'ECLSS, ওয়াটার ডিস্টিলেশন, হাইড্রোপনিক এলইডি ও বিজ্ঞান ল্যাব চালায়।' : 'Powers ECLSS, Water distillation, Hydroponic LEDs, and Lab spectrometers.'}
            </p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-sky-400 font-bold block mb-1">
              {language === 'bn' ? '💧 পানি সরবরাহ লুপ' : '💧 Water Loop'}
            </span>
            <p className="text-slate-400">
              {language === 'bn' ? 'নভোচারীদের পানি, হাইড্রোপনিক গ্রিনহাউস ও অক্সিজেন উৎপাদনের মূল উৎস।' : 'Feeds crew hydration, hydroponics, and oxygen electrolysis feedstock.'}
            </p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">
              {language === 'bn' ? '🌱 বায়োরিজেনারেটিভ চক্র' : '🌱 Bioregenerative'}
            </span>
            <p className="text-slate-400">
              {language === 'bn' ? 'উদ্ভিদ মানুষের CO₂ ও পানি নিয়ে তাজা অক্সিজেন ও পুষ্টিকর ক্যালরি তৈরি করে।' : 'Plants consume crew CO₂ & water; release fresh O₂ & Vitamin C/K calories.'}
            </p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">
              {language === 'bn' ? '🛡️ প্যাসিভ রেগোলিথ শিল্ড' : '🛡️ Passive Regolith'}
            </span>
            <p className="text-slate-400">
              {language === 'bn' ? 'নভোচারীদের ডিএনএ ও কম্পিউটারের চিপগুলোকে ক্ষতিকর কসমিক রশ্মি থেকে বাঁচায়।' : 'Shields crew DNA & module microelectronics from ionising cosmic protons.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
