// 6 Core Resources HUD Component (Junior vs Commander Mode)

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Wind, Droplets, Zap, Apple, Shield, Wrench, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ResourceHUDProps {
  state: SimulationState;
}

export const ResourceHUD: React.FC<ResourceHUDProps> = ({ state }) => {
  const { resources, deltas, mode } = state;
  const isCommander = mode === 'commander';

  // Calculate percentage capacities
  const o2Pct = Math.round((resources.oxygen / resources.oxygenMax) * 100);
  const h2oPct = Math.round((resources.water / resources.waterMax) * 100);
  const powerPct = Math.round((resources.power / resources.powerMax) * 100);
  const foodPct = Math.round((resources.food / resources.foodMax) * 100);
  const shieldPct = Math.round(resources.shielding);
  const sparesPct = Math.round((resources.spareParts / 60) * 100);

  const getStatusBadge = (pct: number) => {
    if (pct <= 20) return { label: '✕ CRITICAL', color: 'text-red-400 border-red-500/50 bg-red-950/40', isCritical: true };
    if (pct <= 40) return { label: '⚠ WARNING', color: 'text-amber-400 border-amber-500/50 bg-amber-950/40', isCritical: false };
    return { label: '✓ SAFE', color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40', isCritical: false };
  };

  const renderTrend = (val: number, unit: string) => {
    if (val > 0.05) {
      return (
        <span className="text-emerald-400 flex items-center text-[11px] font-mono">
          <ArrowUpRight className="w-3 h-3 mr-0.5" />
          +{val} {unit}
        </span>
      );
    }
    if (val < -0.05) {
      return (
        <span className="text-red-400 flex items-center text-[11px] font-mono">
          <ArrowDownRight className="w-3 h-3 mr-0.5" />
          {val} {unit}
        </span>
      );
    }
    return (
      <span className="text-slate-400 flex items-center text-[11px] font-mono">
        <Minus className="w-3 h-3 mr-0.5" />
        0.0 {unit}
      </span>
    );
  };

  const items = [
    {
      id: 'o2',
      name: 'OXYGEN',
      icon: Wind,
      iconColor: 'text-[#52D6FF]',
      current: resources.oxygen,
      max: resources.oxygenMax,
      pct: o2Pct,
      unit: 'kg',
      delta: deltas.oxygen,
      juniorHint: o2Pct < 30 ? 'Low oxygen! Astronauts need clean air to breathe.' : 'Air scrubbers and plants are making good oxygen.',
      status: getStatusBadge(o2Pct)
    },
    {
      id: 'water',
      name: 'WATER',
      icon: Droplets,
      iconColor: 'text-blue-400',
      current: resources.water,
      max: resources.waterMax,
      pct: h2oPct,
      unit: 'L',
      delta: deltas.water,
      juniorHint: h2oPct < 30 ? 'Water tanks low! Water recycler needs power.' : 'Water recycler is purifying moisture nicely.',
      status: getStatusBadge(h2oPct)
    },
    {
      id: 'power',
      name: 'POWER',
      icon: Zap,
      iconColor: 'text-amber-400',
      current: resources.power,
      max: resources.powerMax,
      pct: powerPct,
      unit: 'kWh',
      delta: deltas.powerNet,
      extraSub: isCommander ? `Gen: ${deltas.powerGen} kW | Load: ${deltas.powerLoad} kW` : undefined,
      juniorHint: powerPct < 30 ? 'Batteries draining! Dust or shadow is blocking solar panels.' : 'Solar panels are charging batteries steadily.',
      status: getStatusBadge(powerPct)
    },
    {
      id: 'food',
      name: 'FOOD',
      icon: Apple,
      iconColor: 'text-emerald-400',
      current: resources.food,
      max: resources.foodMax,
      pct: foodPct,
      unit: 'kg',
      delta: deltas.food,
      juniorHint: foodPct < 30 ? 'Food pantry getting empty! Greenhouse needs water and light.' : 'Hydroponic vegetables are growing healthily.',
      status: getStatusBadge(foodPct)
    },
    {
      id: 'shielding',
      name: 'SHIELDING',
      icon: Shield,
      iconColor: 'text-purple-400',
      current: Math.round(resources.shielding),
      max: 100,
      pct: shieldPct,
      unit: '%',
      delta: -deltas.radiationDose,
      deltaUnit: 'mSv/d',
      extraSub: isCommander ? `Absorbed Dose: ${deltas.radiationDose} mSv/d` : undefined,
      juniorHint: shieldPct < 40 ? 'Cosmic rays reaching habitat! Shielding is thin.' : 'Regolith berm blocks cosmic rays and solar particles.',
      status: getStatusBadge(shieldPct)
    },
    {
      id: 'spares',
      name: 'SPARE PARTS',
      icon: Wrench,
      iconColor: 'text-orange-400',
      current: Math.round(resources.spareParts),
      max: 60,
      pct: Math.min(100, sparesPct),
      unit: 'units',
      delta: -deltas.sparePartsUsed,
      juniorHint: sparesPct < 25 ? 'Low on tools! If machines break, you cannot fix them.' : 'Spare valves and tools ready for emergency repairs.',
      status: getStatusBadge(sparesPct)
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {items.map(item => {
          const Icon = item.icon;
          const isCritical = item.status.isCritical;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isCritical
                  ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] animate-pulse'
                  : 'bg-[#101827]/90 border-slate-800 hover:border-[#52D6FF]/40'
              }`}
            >
              {/* Header: Icon, Name & Status Badge */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  <span className="text-[11px] font-bold tracking-wider text-slate-300 font-display">
                    {item.name}
                  </span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${item.status.color}`}>
                  {item.status.label}
                </span>
              </div>

              {/* Resource Value & Trend */}
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-white tracking-tight">
                    {item.current}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isCommander ? `/ ${item.max} ${item.unit}` : item.unit}
                  </span>
                </div>
                {renderTrend(item.delta, item.deltaUnit || '/d')}
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1.5 border border-slate-700/60">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCritical
                      ? 'bg-red-500'
                      : item.pct < 40
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(3, item.pct))}%` }}
                />
              </div>

              {/* Mode-specific caption */}
              {isCommander && item.extraSub ? (
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {item.extraSub}
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                  {item.juniorHint}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
