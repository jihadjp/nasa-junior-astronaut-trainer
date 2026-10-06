// 6 Core Resources HUD Component with Progressive Disclosure & Smooth Animation

import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { Wind, Droplets, Zap, Apple, Shield, Wrench, ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { Tooltip } from '../common/Tooltip';
import { ResourceDetailModal, type ResourceDetailData } from './ResourceDetailModal';
import { sound } from '../../sound/audioEngine';

interface ResourceHUDProps {
  state: SimulationState;
  onOpenEducationalWhy?: (whyId: string) => void;
}

export const ResourceHUD: React.FC<ResourceHUDProps> = ({ state, onOpenEducationalWhy }) => {
  const { t, formatNum, language } = useLanguage();
  const { resources, deltas, mode } = state;
  const isCommander = mode === 'commander';

  const [activeDetail, setActiveDetail] = useState<ResourceDetailData | null>(null);

  // Smooth Interpolated Resource Numbers (Requirement 20)
  const animO2 = useAnimatedNumber(resources.oxygen);
  const animWater = useAnimatedNumber(resources.water);
  const animPower = useAnimatedNumber(resources.power);
  const animFood = useAnimatedNumber(resources.food);
  const animShield = useAnimatedNumber(resources.shielding);
  const animSpares = useAnimatedNumber(resources.spareParts);

  // Calculate percentages
  const o2Pct = Math.round((animO2 / resources.oxygenMax) * 100);
  const h2oPct = Math.round((animWater / resources.waterMax) * 100);
  const powerPct = Math.round((animPower / resources.powerMax) * 100);
  const foodPct = Math.round((animFood / resources.foodMax) * 100);
  const shieldPct = Math.round(animShield);
  const sparesPct = Math.round((animSpares / 60) * 100);

  const getStatusBadge = (pct: number) => {
    if (pct <= 20) return { label: t('common.crit'), color: 'text-red-400 border-red-500/50 bg-red-950/50', isCritical: true, isWarning: false };
    if (pct <= 40) return { label: t('common.warn'), color: 'text-amber-400 border-amber-500/50 bg-amber-950/50', isCritical: false, isWarning: true };
    return { label: t('common.safe'), color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50', isCritical: false, isWarning: false };
  };

  const renderTrend = (val: number, unit: string) => {
    if (val > 0.05) {
      return (
        <span className="text-emerald-400 flex items-center text-[10px] font-mono font-semibold">
          <ArrowUpRight className="w-3 h-3 mr-0.5" />
          +{formatNum(val)} {unit}
        </span>
      );
    }
    if (val < -0.05) {
      return (
        <span className="text-red-400 flex items-center text-[10px] font-mono font-semibold">
          <ArrowDownRight className="w-3 h-3 mr-0.5" />
          {formatNum(val)} {unit}
        </span>
      );
    }
    return (
      <span className="text-slate-400 flex items-center text-[10px] font-mono">
        <Minus className="w-3 h-3 mr-0.5" />
        {formatNum(0)} {unit}
      </span>
    );
  };

  const dayUnit = language === 'bn' ? '/দিন' : '/d';

  const items = [
    {
      id: 'o2',
      name: language === 'bn' ? 'অক্সিজেন (O₂)' : 'OXYGEN (O₂)',
      shortCode: 'O₂',
      icon: Wind,
      iconColor: 'text-[#52D6FF]',
      current: animO2,
      max: resources.oxygenMax,
      pct: o2Pct,
      unit: language === 'bn' ? 'কেজি' : 'kg',
      delta: deltas.oxygen,
      deltaUnit: language === 'bn' ? 'কেজি/দিন' : 'kg/d',
      tooltip: t('common.tooltip.o2'),
      whyText: language === 'bn'
        ? 'বেঁচে থাকার জন্য নভোচারীদের অবিরাম বিশুদ্ধ অক্সিজেন দরকার। চাঁদে বা মঙ্গলে মুক্ত বাতাস নেই, তাই ইলেক্ট্রোলাইসিস ও উদ্ভিদের সাহায্যে বাতাস প্রস্তুত করা হয়।'
        : 'Human biology requires a continuous supply of oxygen for cellular respiration. Electrolysis systems (MOXIE) and living plants replenish the habitat air.',
      warningText: language === 'bn'
        ? 'অক্সিজেন কমে গেলে নভোচারীরা শ্বাসকষ্ট, মাথাঘোরা ও শারীরিক ক্লান্তিতে আক্রান্ত হন।'
        : 'Low oxygen triggers hypoxia, cognitive impairment, and critical crew health emergencies.',
      educationalWhyId: 'systems_engineering_redundancy',
      status: getStatusBadge(o2Pct)
    },
    {
      id: 'water',
      name: language === 'bn' ? 'পানি (H₂O)' : 'WATER (H₂O)',
      shortCode: 'H₂O',
      icon: Droplets,
      iconColor: 'text-blue-400',
      current: animWater,
      max: resources.waterMax,
      pct: h2oPct,
      unit: language === 'bn' ? 'লিটার' : 'L',
      delta: deltas.water,
      deltaUnit: language === 'bn' ? 'লি/দিন' : 'L/d',
      tooltip: t('common.tooltip.water'),
      whyText: language === 'bn'
        ? 'প্রতিটি মহাকাশচারীর দৈনিক পান করা, খাবার রান্না এবং পরিচ্ছন্নতার জন্য পানি লাগে। এছাড়া গ্রিনহাউসের গাছে সেচ দিতে পানি অপরিহার্য।'
        : 'Astronauts need at least 2.5 L daily for drinking, rehydrating meals, and hygiene. Space habitats recycle up to 98% of humidity and wastewater.',
      warningText: language === 'bn'
        ? 'পানি কমে গেলে নভোচারীদের ডিহাইড্রেশন হয় এবং গ্রিনহাউসে ফসলের ফলন বন্ধ হয়ে যায়।'
        : 'Water shortages cause severe crew dehydration, morale collapse, and greenhouse irrigation failure.',
      educationalWhyId: 'closed_loop_water',
      status: getStatusBadge(h2oPct)
    },
    {
      id: 'power',
      name: language === 'bn' ? 'বিদ্যুৎ (Power)' : 'POWER (Power)',
      shortCode: 'PWR',
      icon: Zap,
      iconColor: 'text-amber-400',
      current: animPower,
      max: resources.powerMax,
      pct: powerPct,
      unit: 'kWh',
      delta: deltas.powerNet,
      deltaUnit: 'kW',
      tooltip: t('common.tooltip.power'),
      whyText: language === 'bn'
        ? 'ঘাঁটির লাইফ-সাপোর্ট, অক্সিজেন মেকার, হিটার ও কম্পিউটার চালানোর চালিকাশক্তি হলো বিদ্যুৎ। সৌর প্যানেল বিদ্যুৎ বানিয়ে ব্যাটারিতে জমা রাখে।'
        : 'Solar arrays capture photons to power life-support scrubbers, thermal heaters, and computers. Batteries store power through extreme orbital nights.',
      warningText: language === 'bn'
        ? 'বিদ্যুৎ ফুরিয়ে গেলে পুরো ঘাঁটি বরফশীতল হয়ে যাবে (-১৩০°C) এবং লাইফ-সাপোর্ট বন্ধ হয়ে যাবে।'
        : 'Total blackout causes thermal freezing (-130°C on Moon), life-support shutdown, and telemetry loss.',
      educationalWhyId: 'lunar_night_battery',
      status: getStatusBadge(powerPct)
    },
    {
      id: 'food',
      name: language === 'bn' ? 'খাবার (Food)' : 'FOOD (Food)',
      shortCode: 'FOOD',
      icon: Apple,
      iconColor: 'text-emerald-400',
      current: animFood,
      max: resources.foodMax,
      pct: foodPct,
      unit: language === 'bn' ? 'কেজি' : 'kg',
      delta: deltas.food,
      deltaUnit: language === 'bn' ? 'কেজি/দিন' : 'kg/d',
      tooltip: t('common.tooltip.food'),
      whyText: language === 'bn'
        ? 'শারীরিক শক্তি ও রোগ প্রতিরোধ ক্ষমতার জন্য সুষম পুষ্টি দরকার। পৃথিবী থেকে আনা রেশনের পাশাপাশি বায়ো-গ্রিনহাউসে তাজা শাকসবজি উৎপাদন করা হয়।'
        : 'Deep space missions require caloric nutrition and vitamins. Hydroponic greenhouses cultivate fresh vegetables to supplement stored Earth rations.',
      warningText: language === 'bn'
        ? 'খাবার কমে গেলে নভোচারীরা দুর্বল হয়ে পড়বেন এবং বৈজ্ঞানিক অভিযান ও মেরামত করার শক্তি হারাবেন।'
        : 'Caloric starvation rapidly degrades astronaut stamina, immune resistance, and mission performance.',
      educationalWhyId: 'systems_engineering_redundancy',
      status: getStatusBadge(foodPct)
    },
    {
      id: 'shielding',
      name: language === 'bn' ? 'বিকিরণ রক্ষা (Shield)' : 'SHIELDING (Shield)',
      shortCode: 'RAD',
      icon: Shield,
      iconColor: 'text-purple-400',
      current: Math.round(animShield),
      max: 100,
      pct: shieldPct,
      unit: '%',
      delta: -deltas.radiationDose,
      deltaUnit: 'mSv/d',
      tooltip: t('common.tooltip.shield'),
      whyText: language === 'bn'
        ? 'চাঁদ ও মঙ্গলে বায়ুমণ্ডল না থাকায় মহাজাগতিক রশ্মি ও তীব্র সৌরঝড় সরাসরি আসে। চাঁদের মাটির (রেগোলিথ) পুরু স্তর এই ক্ষতিকর বিকিরণ আটকে দেয়।'
        : 'The Moon and Mars lack Earth\'s protective magnetosphere. Cosmic rays and solar proton events penetrate unshielded modules, damaging DNA.',
      warningText: language === 'bn'
        ? 'সুরক্ষা প্রাচীর দুর্বল হলে বিপজ্জনক বিকিরণ শরীরে প্রবেশ করে মারাত্মক অসুস্থতা তৈরি করে।'
        : 'Unshielded exposure causes acute radiation sickness, cellular breakdown, and cognitive deterioration.',
      educationalWhyId: 'radiation_shielding_physics',
      status: getStatusBadge(shieldPct)
    },
    {
      id: 'spares',
      name: language === 'bn' ? 'যন্ত্রাংশ (Spares)' : 'SPARES (Spares)',
      shortCode: 'SPAR',
      icon: Wrench,
      iconColor: 'text-orange-400',
      current: Math.round(animSpares),
      max: 60,
      pct: Math.min(100, sparesPct),
      unit: language === 'bn' ? 'টি' : 'units',
      delta: -deltas.sparePartsUsed,
      deltaUnit: language === 'bn' ? 'টি/দিন' : 'units/d',
      tooltip: t('common.tooltip.spares'),
      whyText: language === 'bn'
        ? 'মহাকাশের ধারালো ধূলিকণা ও চরম তাপমাত্রায় পাম্প ও ভালভ নষ্ট হয়। কোনো সিস্টেমের ক্ষতি হলে অতিরিক্ত যন্ত্রাংশ দিয়ে মেরামত করতে হয়।'
        : 'Abrasive lunar regolith dust and thermal cycling wear out mechanical seals, pumps, and valves. Spare inventory guarantees emergency repairs.',
      warningText: language === 'bn'
        ? 'যন্ত্রাংশ না থাকলে পরবর্তীতে কোনো যন্ত্রপাতি নষ্ট হলে তা আর ঠিক করা যাবে না।'
        : 'Without spare parts, equipment breakdowns permanently cripple base power, oxygen, or water generation.',
      educationalWhyId: 'dust_mitigation_engineering',
      status: getStatusBadge(sparesPct)
    }
  ];

  const handleOpenDetail = (item: typeof items[0]) => {
    sound.playClick();
    setActiveDetail({
      id: item.id,
      name: item.name,
      icon: item.icon,
      iconColor: item.iconColor,
      current: item.current,
      max: item.max,
      unit: item.unit,
      pct: item.pct,
      delta: item.delta,
      deltaUnit: item.deltaUnit || dayUnit,
      isCritical: item.status.isCritical,
      isWarning: item.status.isWarning,
      statusLabel: item.status.label,
      statusColor: item.status.color,
      whyText: item.whyText,
      warningText: item.warningText,
      educationalWhyId: item.educationalWhyId
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {items.map(item => {
          const Icon = item.icon;
          const isCritical = item.status.isCritical;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenDetail(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenDetail(item);
                }
              }}
              className={`p-3 rounded-xl border transition-all duration-200 relative overflow-hidden cursor-pointer group select-none ${
                isCritical
                  ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)] animate-pulse'
                  : 'bg-[#0B132B]/90 border-slate-700/80 hover:border-[#52D6FF]/60 hover:bg-[#121E3F]/90 shadow-md hover:shadow-cyan-950/30'
              }`}
            >
              {/* Header: Icon, Clean Name, and ⓘ Info Button */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  <span className="text-xs font-bold tracking-wider text-slate-200 font-display">
                    {item.shortCode}
                  </span>
                </div>

                {/* ⓘ Info Button with Desktop Tooltip (Requirement 2 & 6) */}
                <Tooltip content={item.tooltip}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(item);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-[#52D6FF] hover:bg-[#52D6FF]/15 transition-colors"
                    aria-label={`${item.name} details`}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </Tooltip>
              </div>

              {/* Resource Value & Trend (Clean Level 1 View) */}
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-white tracking-tight">
                    {formatNum(Math.round(item.current * 10) / 10)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isCommander ? `/ ${formatNum(item.max)} ${item.unit}` : item.unit}
                  </span>
                </div>
                {renderTrend(item.delta, item.deltaUnit || dayUnit)}
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isCritical
                      ? 'bg-red-500'
                      : item.pct < 40
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(3, item.pct))}%` }}
                />
              </div>

              {/* Clean Status Pill at Bottom */}
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{item.pct}%</span>
                <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${item.status.color}`}>
                  {item.status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level 2 Progressive Disclosure Detail Modal */}
      <ResourceDetailModal
        data={activeDetail}
        onClose={() => setActiveDetail(null)}
        onOpenEducationalWhy={onOpenEducationalWhy}
      />
    </div>
  );
};
