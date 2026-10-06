// Mission Commander Telemetry: In-depth Subsystem Matrix and Rates

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Cpu, Activity, Zap, Wind, ShieldCheck, Layers } from 'lucide-react';

interface CommanderTelemetryProps {
  state: SimulationState;
}

export const CommanderTelemetry: React.FC<CommanderTelemetryProps> = ({ state }) => {
  const { resources, deltas, modules, environment, cumulativeRadiation_mSv, baseIntegrity, crew } = state;

  return (
    <div className="w-full bg-[#0A1020]/95 rounded-xl border border-amber-500/30 p-4 font-mono text-xs text-slate-300 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-sm">
          <Cpu className="w-4 h-4 text-amber-400" />
          MISSION COMMANDER // DEEP TELEMETRY MATRIX
        </div>
        <div className="flex items-center gap-2 text-[10px] text-amber-400/80">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          REAL-TIME BUS VOLTAGES & ECLSS SENSORS ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Power & Electrical Bus */}
        <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-[#52D6FF] font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Zap className="w-3.5 h-3.5" />
            ELECTRICAL BUS TELEMETRY
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Photovoltaic Output:</span>
            <span className="text-emerald-400 font-bold">{deltas.powerGen} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Outpost Load:</span>
            <span className="text-rose-400 font-bold">{deltas.powerLoad} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Net Power Flux:</span>
            <span className={deltas.powerNet >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {deltas.powerNet > 0 ? `+${deltas.powerNet}` : deltas.powerNet} kW
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Battery Storage:</span>
            <span className="text-white">{resources.power} / {resources.powerMax} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Solar Optical Depth (Tau):</span>
            <span className="text-amber-300">{(environment.dustLevel * 0.05).toFixed(2)}</span>
          </div>
        </div>

        {/* Column 2: ECLSS Life Support Loop Closure */}
        <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Wind className="w-3.5 h-3.5" />
            ECLSS & ATMOSPHERE MASS BALANCE
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Crew O₂ Consumption:</span>
            <span className="text-slate-200">{(crew.length * 0.84).toFixed(2)} kg/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Electrolysis + Bio O₂:</span>
            <span className="text-emerald-400 font-bold">+{((crew.length * 0.84) + deltas.oxygen).toFixed(2)} kg/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Water Recycling Closure:</span>
            <span className="text-sky-400 font-bold">{Math.round(modules.water_recycler.efficiency * 95)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Daily Water Balance:</span>
            <span className={deltas.water >= 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
              {deltas.water > 0 ? `+${deltas.water}` : deltas.water} L/day
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Daily Food Calorie Flux:</span>
            <span className={deltas.food >= 0 ? "text-emerald-400" : "text-amber-400"}>
              {deltas.food > 0 ? `+${deltas.food}` : deltas.food} kg/day
            </span>
          </div>
        </div>

        {/* Column 3: Radiation Dosimetry & Structural Resilience */}
        <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-2">
          <div className="text-purple-400 font-bold text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            DOSIMETRY & FAULT TOLERANCE
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Daily Dose Rate:</span>
            <span className="text-purple-300 font-bold">{deltas.radiationDose} mSv/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cumulative Mission Dose:</span>
            <span className="text-white font-bold">{cumulativeRadiation_mSv.toFixed(2)} mSv</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NASA Career Limit Margin:</span>
            <span className="text-emerald-400 font-bold">
              {Math.max(0, Math.round((1 - cumulativeRadiation_mSv / 600) * 100))}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Base Hull Integrity:</span>
            <span className="text-sky-300 font-bold">{baseIntegrity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Spare Parts Inventory:</span>
            <span className="text-amber-300 font-bold">{resources.spareParts} units</span>
          </div>
        </div>
      </div>

      {/* Subsystem Dependencies Graph / Matrix */}
      <div className="mt-3 p-3 rounded-lg bg-[#0A1020] border border-slate-800">
        <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          SUBSYSTEM COUPLING & SINGLE-POINT DEPENDENCY MATRIX
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">⚡ Power Grid</span>
            <p className="text-slate-400">Powers ECLSS, Water distillation, Hydroponic LEDs, and Lab spectrometers.</p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-sky-400 font-bold block mb-1">💧 Water Loop</span>
            <p className="text-slate-400">Feeds crew hydration, hydroponics, and oxygen electrolysis feedstock.</p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">🌱 Bioregenerative</span>
            <p className="text-slate-400">Plants consume crew CO₂ & water; release fresh O₂ & Vitamin C/K calories.</p>
          </div>
          <div className="p-2 rounded bg-[#101827] border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">🛡️ Passive Regolith</span>
            <p className="text-slate-400">Shields crew DNA & module microelectronics from ionising cosmic protons.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
