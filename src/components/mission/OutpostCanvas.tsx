// Interactive Animated Outpost Visualizer (2.5D Stylized Mission Control)

import React, { useState, useEffect } from 'react';
import type { SimulationState, ModuleType } from '../../types/game';
import { Sparkles, AlertTriangle, Info } from 'lucide-react';

interface OutpostCanvasProps {
  state: SimulationState;
  onInspectModule?: (moduleId: ModuleType) => void;
}

export const OutpostCanvas: React.FC<OutpostCanvasProps> = ({ state, onInspectModule }) => {
  const { destination, environment, modules, resources, deltas, missionDay } = state;
  const isMars = destination === 'mars';
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [roverOffset, setRoverOffset] = useState<number>(0);

  // Subtle rover sortie animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRoverOffset(prev => (prev + 1) % 120);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleModuleClick = (modId: ModuleType) => {
    setSelectedModule(modId);
    if (onInspectModule) {
      onInspectModule(modId);
    }
  };

  // Celestial sun position based on sunIntensity & mission day
  const sunX = 120 + ((missionDay * 18) % 680);
  const sunY = 50 + Math.sin(missionDay * 0.4) * 20;

  // Radiation particle count based on flare status
  const particleCount = environment.solarFlareActive ? 36 : 14;

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] rounded-xl overflow-hidden border border-[#52D6FF]/20 bg-[#060B18] shadow-2xl select-none">
      {/* Dynamic Celestial Sky & Planetary Surface */}
      <svg className="w-full h-full" viewBox="0 0 960 480" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMars ? "#160A0C" : "#040714"} />
            <stop offset="55%" stopColor={isMars ? "#381716" : "#0A1329"} />
            <stop offset="100%" stopColor={isMars ? "#5E251F" : "#141F38"} />
          </linearGradient>

          {/* Terrain Gradient */}
          <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMars ? "#8C3B2B" : "#323B4E"} />
            <stop offset="30%" stopColor={isMars ? "#722E22" : "#242B3A"} />
            <stop offset="100%" stopColor={isMars ? "#4D1D16" : "#131822"} />
          </linearGradient>

          {/* Regolith Berm Gradient */}
          <linearGradient id="regolithGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMars ? "#9E4735" : "#4B556B"} />
            <stop offset="100%" stopColor={isMars ? "#572118" : "#1E2535"} />
          </linearGradient>

          {/* Module Hull Texture */}
          <linearGradient id="hullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Greenhouse Glow */}
          <radialGradient id="greenhouseLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#35D07F" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#A855F7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </radialGradient>

          {/* Shield Glow Filter */}
          <filter id="shieldBloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Celestial Backdrop */}
        <rect width="960" height="480" fill="url(#skyGrad)" />

        {/* Stars */}
        <g opacity={isMars ? 0.4 : 0.85}>
          {Array.from({ length: 60 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 137.5) % 960}
              cy={(i * 83.3) % 240}
              r={(i % 3 === 0 ? 1.5 : 0.8)}
              fill="#FFFFFF"
              opacity={0.3 + (i % 5) * 0.15}
            />
          ))}
        </g>

        {/* Distant Earth (if Moon) or Phobos/Deimos (if Mars) */}
        {!isMars ? (
          <g transform="translate(760, 65)">
            <circle cx="0" cy="0" r="26" fill="#1D4ED8" />
            <circle cx="-5" cy="-3" r="14" fill="#3B82F6" opacity="0.6" />
            <path d="M -12,-8 Q 0,0 8,-12 Q 18,-6 14,8 Q 0,16 -16,4 Z" fill="#60A5FA" opacity="0.7" />
            <circle cx="0" cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
            <text x="36" y="4" fill="#93C5FD" fontSize="10" fontFamily="monospace" opacity="0.75">EARTH · 384,400 KM</text>
          </g>
        ) : (
          <g transform="translate(800, 75)">
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#D1D5DB" />
            <text x="18" y="3" fill="#FCA5A5" fontSize="9" fontFamily="monospace" opacity="0.75">PHOBOS</text>
          </g>
        )}

        {/* The Sun / Solar Flux Center */}
        <g transform={`translate(${sunX}, ${sunY})`}>
          <circle cx="0" cy="0" r="18" fill="#FDE047" opacity={environment.sunIntensity * 0.9} filter="url(#shieldBloom)" />
          <circle cx="0" cy="0" r="12" fill="#FFFFFF" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#FDE047" strokeWidth="1.5" opacity="0.4" />
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#FDE047" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Distant Cratered Mountains / Martian Dunes */}
        <path
          d={isMars 
            ? "M 0,260 Q 180,220 360,250 T 720,230 T 960,260 L 960,480 L 0,480 Z" 
            : "M 0,270 Q 220,240 440,265 T 800,245 T 960,270 L 960,480 L 0,480 Z"}
          fill={isMars ? "#5E251F" : "#1B2232"}
          opacity="0.85"
        />

        {/* Foreground Planetary Terrain */}
        <path
          d="M 0,310 Q 240,295 480,315 T 960,305 L 960,480 L 0,480 Z"
          fill="url(#terrainGrad)"
        />

        {/* Surface Regolith Berm / Shielding Mound */}
        <path
          d="M 330,340 Q 480,290 640,340 L 630,380 L 340,380 Z"
          fill="url(#regolithGrad)"
          stroke="#52D6FF"
          strokeWidth="0.8"
          strokeOpacity={resources.shielding > 60 ? "0.4" : "0.1"}
        />

        {/* --- 2. OUTPOST MODULE INFRASTRUCTURE --- */}

        {/* Power Bus Conduit Lines (Animated Electric Pulses) */}
        <g stroke="#52D6FF" strokeWidth="2.5" fill="none" opacity={deltas.powerGen > 20 ? 0.85 : 0.35}>
          {/* Solar to Habitat */}
          <path d="M 170,305 L 290,305 L 360,335" className="animate-flow" />
          {/* Habitat to Greenhouse */}
          <path d="M 440,335 L 500,335 L 550,320" className="animate-flow" />
          {/* Habitat to Life Support */}
          <path d="M 400,335 L 400,265 L 430,265" className="animate-flow" stroke="#35D07F" />
          {/* Habitat to Science Lab */}
          <path d="M 430,350 L 670,350 L 710,330" className="animate-flow" stroke="#C084FC" />
        </g>

        {/* MODULE 1: Photovoltaic Solar Array (Left) */}
        <g 
          className="cursor-pointer transition-all duration-300 hover:opacity-100" 
          opacity={selectedModule === 'solar_array' ? 1.0 : 0.9}
          onClick={() => handleModuleClick('solar_array')}
        >
          {/* Array Support Mast */}
          <line x1="160" y1="360" x2="160" y2="280" stroke="#64748B" strokeWidth="6" />
          {/* Solar Panels tilted toward the sun */}
          <g transform={`rotate(${((sunX - 160) * 0.05)}, 160, 280)`}>
            <rect x="70" y="240" width="180" height="42" rx="3" fill="#0F172A" stroke="#52D6FF" strokeWidth="2" />
            {/* Solar Cell Grid */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={70 + i * 22.5} y1="240" x2={70 + i * 22.5} y2="282" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            ))}
            <line x1="70" y1="261" x2="250" y2="261" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            {/* Efficiency Indicator LED */}
            <circle cx="240" cy="248" r="3" fill={deltas.powerNet >= 0 ? "#35D07F" : "#EF4444"} className="animate-ping" />
          </g>
          <text x="160" y="380" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            SOLAR ARRAY
          </text>
        </g>

        {/* MODULE 2: Habitat Core (Center Protected Vault) */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleModuleClick('habitat')}
        >
          {/* Geodesic Dome / Inflatable Torus */}
          <path
            d="M 360,345 C 360,285 460,285 460,345 Z"
            fill="url(#hullGrad)"
            stroke="#52D6FF"
            strokeWidth="2"
          />
          {/* Observation Viewports */}
          <circle cx="395" cy="315" r="7" fill="#38BDF8" opacity="0.85" />
          <circle cx="425" cy="315" r="7" fill="#38BDF8" opacity="0.85" />
          {/* Pressure Airlock Hatch */}
          <rect x="400" y="330" width="20" height="20" rx="3" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />
          <text x="410" y="375" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
            HABITAT CORE
          </text>
        </g>

        {/* MODULE 3: Oxygen ECLSS & Water Recovery Tower */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleModuleClick('life_support')}
        >
          {/* Distillation Columns */}
          <rect x="290" y="275" width="26" height="65" rx="5" fill="#334155" stroke="#35D07F" strokeWidth="1.5" />
          <rect x="320" y="290" width="22" height="50" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Condensate Level Gauge */}
          <rect x="295" y="295" width="6" height="38" fill="#38BDF8" opacity="0.75" />
          <line x1="285" y1="340" x2="345" y2="340" stroke="#64748B" strokeWidth="4" />
          <text x="317" y="370" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            ECLSS
          </text>
        </g>

        {/* MODULE 4: Hydroponic Bio-Greenhouse (Right-Center) */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleModuleClick('greenhouse')}
        >
          {/* Transparent Polycarbonate Vault */}
          <path
            d="M 520,345 C 520,290 610,290 610,345 Z"
            fill="url(#greenhouseLight)"
            stroke="#35D07F"
            strokeWidth="2"
          />
          {/* Internal Hydroponic Racks & Green Stalks */}
          <path d="M 540,335 L 545,315 M 560,338 L 565,310 M 580,335 L 585,312 M 595,338 L 598,318" stroke="#22C55E" strokeWidth="2.5" />
          {/* Photosynthetic LED Illumination Canopy */}
          <line x1="535" y1="300" x2="595" y2="300" stroke="#E879F9" strokeWidth="2" className="animate-pulse" />
          <text x="565" y="370" textAnchor="middle" fill="#86EFAC" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            BIO-GREENHOUSE
          </text>
        </g>

        {/* MODULE 5: Astrobiology & Geology Science Lab (Far Right) */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleModuleClick('science_lab')}
        >
          <rect x="670" y="295" width="70" height="50" rx="4" fill="url(#hullGrad)" stroke="#C084FC" strokeWidth="2" />
          {/* Rotating High-Gain Satellite Dish */}
          <g transform="translate(705, 275)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#64748B" strokeWidth="3" />
            <path d="M -16,-6 Q 0,-16 16,-6 Z" fill="#E2E8F0" stroke="#C084FC" strokeWidth="1.5" />
            <circle cx="0" cy="-10" r="2.5" fill="#C084FC" className="animate-ping" />
          </g>
          <text x="705" y="370" textAnchor="middle" fill="#E9D5FF" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            SCIENCE LAB
          </text>
        </g>

        {/* MODULE 6: Pressurized Rover Garage & Active Sortie */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleModuleClick('rover_garage')}
        >
          {/* Garage Hangar */}
          <path d="M 780,350 L 800,315 L 870,315 L 890,350 Z" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />
          {/* Pressurized Exploration Rover traversing terrain */}
          <g transform={`translate(${770 - roverOffset * 1.5}, 355)`}>
            <rect x="0" y="0" width="36" height="16" rx="4" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
            {/* Cockpit Window */}
            <rect x="22" y="2" width="10" height="7" rx="2" fill="#38BDF8" />
            {/* Rover High-Traction Wheels */}
            <circle cx="6" cy="18" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="18" cy="18" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="30" cy="18" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            {/* Communication Antenna */}
            <line x1="4" y1="0" x2="1" y2="-8" stroke="#F4C95D" strokeWidth="1.5" />
          </g>
          <text x="835" y="375" textAnchor="middle" fill="#FDE047" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            ROVER BAY
          </text>
        </g>

        {/* --- 3. RADIATION SHIELDING PARTICLES --- */}
        {/* Visualizing cosmic rays / solar protons impacting shielding (Prompt Section 8.5) */}
        <g opacity={environment.solarFlareActive ? 0.95 : 0.6}>
          {Array.from({ length: particleCount }).map((_, i) => {
            const px = 200 + (i * 37) % 520;
            const py = 60 + ((i * 29 + missionDay * 15) % 240);
            const isProtectedArea = px > 340 && px < 630;
            const hitShield = isProtectedArea && py > 250;

            return (
              <g key={i}>
                <line
                  x1={px}
                  y1={py}
                  x2={px - 8}
                  y2={py + 16}
                  stroke={environment.solarFlareActive ? "#FF5C5C" : "#F4C95D"}
                  strokeWidth={hitShield ? 2.5 : 1.2}
                  strokeDasharray={hitShield ? "2 2" : "none"}
                />
                {hitShield && (
                  <circle
                    cx={px - 8}
                    cy={py + 16}
                    r="3.5"
                    fill="#52D6FF"
                    opacity="0.8"
                    filter="url(#shieldBloom)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Shielding Barrier Arc (when strong) */}
        {resources.shielding > 50 && (
          <path
            d="M 320,320 Q 485,210 650,320"
            fill="none"
            stroke="#52D6FF"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity={resources.shielding / 150}
            filter="url(#shieldBloom)"
          />
        )}

        {/* Atmospheric Dust Layer (Mars dust storm haze) */}
        {environment.dustLevel > 20 && (
          <rect
            width="960"
            height="480"
            fill="#C2410C"
            opacity={(environment.dustLevel / 100) * 0.45}
            style={{ mixBlendMode: 'color-burn' }}
          />
        )}
      </svg>

      {/* Floating Outpost Environment Telemetry Overlay */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-[#0A1020]/90 border border-[#52D6FF]/30 text-[#52D6FF] font-mono flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#52D6FF] animate-pulse"></span>
          {isMars ? 'MARS // CHRYSE PLANITIA' : 'MOON // SHACKLETON CRATER'}
        </span>
        <span className="px-2 py-1 rounded bg-[#101827]/80 border border-slate-700 text-slate-300 font-mono">
          TEMP: {environment.externalTempC}°C
        </span>
        <span className="px-2 py-1 rounded bg-[#101827]/80 border border-slate-700 text-slate-300 font-mono">
          SOLAR FLUX: {Math.round(environment.sunIntensity * 100)}%
        </span>
        {environment.dustLevel > 30 && (
          <span className="px-2 py-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            DUST TAU: {environment.dustLevel}%
          </span>
        )}
        {environment.solarFlareActive && (
          <span className="px-2 py-1 rounded bg-red-950/80 border border-red-500 text-red-300 font-mono flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            SOLAR PROTON EVENT ACTIVE
          </span>
        )}
      </div>

      {/* Quick Inspection Floating Drawer */}
      {selectedModule && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-3.5 rounded-lg bg-[#101827]/95 border border-[#52D6FF]/40 backdrop-blur-md shadow-2xl text-xs z-10 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-display font-bold text-sm text-[#52D6FF] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#52D6FF]" />
              {modules[selectedModule].name} (Level {modules[selectedModule].level})
            </span>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-slate-400 hover:text-white px-1 font-mono"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 mb-2 leading-relaxed">
            {modules[selectedModule].description}
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mb-2 bg-[#0A1020]/70 p-2 rounded border border-slate-800">
            <div>⚡ Power Load: <span className="text-amber-400">{modules[selectedModule].powerDraw} kW</span></div>
            <div>⚙️ Efficiency: <span className="text-emerald-400">{Math.round(modules[selectedModule].efficiency * 100)}%</span></div>
          </div>
          <div className="text-[11px] text-sky-200/80 italic border-l-2 border-[#52D6FF] pl-2">
            NASA Spec: {modules[selectedModule].educationalFact}
          </div>
        </div>
      )}

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-[#0A1020]/75 px-2.5 py-1 rounded border border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
        Click any module to inspect ECLSS telemetry
      </div>
    </div>
  );
};
