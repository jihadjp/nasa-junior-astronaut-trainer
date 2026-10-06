import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { SimulationState, ModuleType } from '../../types/game';
import { AlertTriangle, Info, Compass, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface OutpostCanvasProps {
  state: SimulationState;
  focusedModule?: ModuleType | null;
  onInspectModule?: (moduleId: ModuleType) => void;
  onOpenTerrainExplorer?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

export const OutpostCanvas: React.FC<OutpostCanvasProps> = ({ 
  state, 
  focusedModule = null, 
  onInspectModule,
  onOpenTerrainExplorer
}) => {
  const { t, formatNum, language } = useLanguage();
  const { destination, environment, modules, resources, deltas, missionDay, activeEvent, landingSite } = state;
  const isMars = destination === 'mars';
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);

  const siteId = landingSite?.id || '';
  const isMountainSite = siteId === 'malapert_mountain' || siteId === 'olympus_mons' || siteId === 'gale_crater';
  const isCraterSite = siteId === 'shackleton_rim' || siteId === 'jezero_crater';
  const isPlainsSite = siteId === 'oceanus_procellarum' || siteId === 'arcadia_planitia';
  const isValleySite = siteId === 'taurus_littrow';

  // Customize distant ridge path based on actual NASA site morphology
  const distantRidgePath = useMemo(() => {
    if (isMountainSite) {
      // Towering massif peaks rising into the sky
      return isMars
        ? "M 0,270 Q 140,160 280,240 T 560,140 T 840,230 L 960,250 L 960,480 L 0,480 Z"
        : "M 0,275 Q 160,170 320,250 T 640,150 T 960,260 L 960,480 L 0,480 Z";
    }
    if (isCraterSite) {
      // Crater rim walls with sharp elevation lip
      return isMars
        ? "M 0,250 Q 180,210 360,240 T 720,205 T 960,255 L 960,480 L 0,480 Z"
        : "M 0,255 Q 220,195 440,250 T 780,210 T 960,265 L 960,480 L 0,480 Z";
    }
    if (isPlainsSite) {
      // Vast, flat, low-relief basalt plain
      return isMars
        ? "M 0,290 Q 240,280 480,285 T 960,288 L 960,480 L 0,480 Z"
        : "M 0,295 Q 240,288 480,292 T 960,294 L 960,480 L 0,480 Z";
    }
    if (isValleySite) {
      // Deep valley with massifs on sides
      return "M 0,220 Q 200,275 480,280 T 800,220 T 960,210 L 960,480 L 0,480 Z";
    }
    return isMars
      ? "M 0,260 Q 200,215 380,245 T 760,225 T 960,260 L 960,480 L 0,480 Z"
      : "M 0,270 Q 240,235 460,260 T 820,240 T 960,270 L 960,480 L 0,480 Z";
  }, [isMountainSite, isCraterSite, isPlainsSite, isValleySite, isMars]);

  // Time & Animation Tick State (Continuous 60 FPS motion loop)
  const [animTime, setAnimTime] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Camera ViewBox Coordinates (Smooth Camera System)
  const [camera, setCamera] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 960,
    h: 480
  });

  // Rover Sortie State Machine: 'docked' | 'departing' | 'sampling' | 'returning'
  const [roverState, setRoverState] = useState<'docked' | 'departing' | 'sampling' | 'returning'>('docked');
  const [roverX, setRoverX] = useState<number>(830);

  // 60 FPS Animation Loop
  useEffect(() => {
    let lastT = performance.now();
    const loop = (t: number) => {
      const dt = (t - lastT) / 1000;
      lastT = t;
      setAnimTime(prev => prev + dt);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Rover Mission Animation Logic
  useEffect(() => {
    const roverInterval = setInterval(() => {
      setRoverState(current => {
        if (current === 'docked') return Math.random() < 0.35 ? 'departing' : 'docked';
        if (current === 'departing') return 'sampling';
        if (current === 'sampling') return 'returning';
        return 'docked';
      });
    }, 4500);
    return () => clearInterval(roverInterval);
  }, []);

  // Smoothly update rover position based on state
  useEffect(() => {
    if (roverState === 'docked') setRoverX(830);
    else if (roverState === 'departing') setRoverX(650);
    else if (roverState === 'sampling') setRoverX(300);
    else if (roverState === 'returning') setRoverX(750);
  }, [roverState]);

  // Target Camera Glide Coordinates based on active event or inspection
  const targetCamera = useMemo(() => {
    const targetModule = focusedModule || (activeEvent?.illustrationType === 'dust_storm' ? 'solar_array' :
      activeEvent?.illustrationType === 'power_shortage' ? 'solar_array' :
      activeEvent?.illustrationType === 'greenhouse_stress' ? 'greenhouse' :
      activeEvent?.illustrationType === 'radiation_spike' ? 'habitat' :
      activeEvent?.illustrationType === 'water_leak' ? 'life_support' :
      selectedModule);

    if (!targetModule) {
      // Subtle idle breathing drift (±4px)
      const driftX = Math.sin(animTime * 0.3) * 6;
      const driftY = Math.cos(animTime * 0.2) * 3;
      return { x: driftX, y: driftY, w: 960, h: 480 };
    }

    switch (targetModule) {
      case 'solar_array':
        return { x: 50, y: 180, w: 560, h: 280 };
      case 'habitat':
        return { x: 260, y: 220, w: 520, h: 260 };
      case 'life_support':
        return { x: 190, y: 200, w: 500, h: 250 };
      case 'greenhouse':
        return { x: 420, y: 220, w: 500, h: 250 };
      case 'science_lab':
        return { x: 550, y: 200, w: 460, h: 230 };
      case 'rover_garage':
        return { x: 620, y: 240, w: 450, h: 225 };
      default:
        return { x: 0, y: 0, w: 960, h: 480 };
    }
  }, [focusedModule, activeEvent, selectedModule, animTime]);

  // Smooth Camera Lerp
  useEffect(() => {
    const lerpSpeed = 0.08;
    setCamera(prev => ({
      x: prev.x + (targetCamera.x - prev.x) * lerpSpeed,
      y: prev.y + (targetCamera.y - prev.y) * lerpSpeed,
      w: prev.w + (targetCamera.w - prev.w) * lerpSpeed,
      h: prev.h + (targetCamera.h - prev.h) * lerpSpeed
    }));
  }, [targetCamera]);

  const handleModuleClick = (modId: ModuleType) => {
    setSelectedModule(modId);
    if (onInspectModule) onInspectModule(modId);
  };

  // Day/Night & Sun Cycle
  const dayCyclePhase = ((missionDay % (isMars ? 7 : 14)) / (isMars ? 7 : 14)) * 2 * Math.PI;
  const sunX = 140 + 680 * (0.5 + 0.5 * Math.sin(dayCyclePhase));
  const sunY = 55 + 35 * Math.cos(dayCyclePhase);
  const isNight = Math.cos(dayCyclePhase) < -0.2;
  const daylightIntensity = Math.max(0.12, Math.min(1.0, 0.5 + 0.5 * Math.cos(dayCyclePhase)));

  // Parallax Stars
  const starLayers = useMemo(() => {
    const layer1: Particle[] = [];
    const layer2: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      layer1.push({
        id: i,
        x: (i * 123.7) % 960,
        y: (i * 73.1) % 250,
        speed: 0.2,
        size: (i % 3 === 0 ? 1.6 : 0.9),
        opacity: 0.4 + (i % 5) * 0.12
      });
    }
    for (let j = 0; j < 35; j++) {
      layer2.push({
        id: j + 40,
        x: (j * 167.3) % 960,
        y: (j * 59.4) % 250,
        speed: 0.5,
        size: 1.2,
        opacity: 0.3 + (j % 4) * 0.15
      });
    }
    return { layer1, layer2 };
  }, []);

  // Solar Tracking Angle
  const panelAngle = Math.max(-28, Math.min(28, (sunX - 160) * 0.07));

  // Power Flow Energy Speed & Pulse Offset
  const powerFlowSpeed = Math.max(0.4, (deltas.powerGen / 45) * 2.2);
  const powerDashOffset = (animTime * 35 * powerFlowSpeed) % 40;
  const isLowPower = resources.power < 15;
  const isEmergencyPower = resources.power < 5;

  // Water & Oxygen Loop Speeds
  const waterFlowOffset = (animTime * 22) % 30;
  const oxygenFlowOffset = (animTime * 28) % 36;
  const isOxygenCritical = resources.oxygen < 25;

  // Greenhouse Crop Health Stage
  const greenhouseEfficiency = modules.greenhouse.efficiency;
  const cropStage = greenhouseEfficiency > 0.85 ? 'healthy' : greenhouseEfficiency > 0.5 ? 'stressed' : 'critical';

  // Radiation Particles Simulation
  const radParticleCount = environment.solarFlareActive ? 42 : 18;
  const shieldingStrength = resources.shielding / 100;

  // Dynamic EVA Astronaut Position
  const evaAstronautX = environment.solarFlareActive
    ? 385 // Runs to airlock under solar flare!
    : 220 + Math.sin(animTime * 0.8) * 18; // Normal patrol inspection

  return (
    <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-[#52D6FF]/25 bg-[#040814] shadow-2xl select-none group">
      {/* Dynamic Animated SVG Space Simulation */}
      <svg 
        className="w-full h-full transition-all duration-300" 
        viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`} 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient modulated by day/night cycle & dust tau */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop 
              offset="0%" 
              stopColor={isMars 
                ? (isNight ? "#0D0507" : "#1C0D0F") 
                : (isNight ? "#02040C" : "#050918")
              } 
            />
            <stop 
              offset="60%" 
              stopColor={isMars 
                ? (isNight ? "#240E10" : "#4A1D1A") 
                : (isNight ? "#080F24" : "#0F1C3D")
              } 
            />
            <stop 
              offset="100%" 
              stopColor={isMars 
                ? (isNight ? "#3D1714" : "#7A2E26") 
                : (isNight ? "#0E1833" : "#1C2E59")
              } 
            />
          </linearGradient>

          {/* Terrain Gradient */}
          <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMars ? "#8C3B2B" : "#2E3647"} />
            <stop offset="35%" stopColor={isMars ? "#6B291D" : "#212836"} />
            <stop offset="100%" stopColor={isMars ? "#42160F" : "#111622"} />
          </linearGradient>

          {/* Regolith Shield Berm Gradient */}
          <linearGradient id="regolithGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isMars ? "#A34835" : "#455066"} />
            <stop offset="100%" stopColor={isMars ? "#521E15" : "#1B2232"} />
          </linearGradient>

          {/* Module Hull Texture */}
          <linearGradient id="hullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Greenhouse LED Spectrum Glow */}
          <radialGradient id="greenhouseGlow" cx="50%" cy="50%" r="50%">
            <stop 
              offset="0%" 
              stopColor={cropStage === 'healthy' ? "#22C55E" : cropStage === 'stressed' ? "#EAB308" : "#EF4444"} 
              stopOpacity={isNight ? "0.9" : "0.6"} 
            />
            <stop offset="60%" stopColor="#D946EF" stopOpacity={isNight ? "0.45" : "0.25"} />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </radialGradient>

          {/* Specular Glare filter */}
          <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Dynamic Celestial Sky */}
        <rect width="960" height="480" fill="url(#skyGrad)" />

        {/* Parallax Stars Layer 1 (Slow Drift) */}
        <g opacity={isNight ? 0.95 : 0.5}>
          {starLayers.layer1.map(star => {
            const px = (star.x + animTime * star.speed * 2) % 960;
            const flicker = 0.7 + 0.3 * Math.sin(animTime * 2 + star.id);
            return (
              <circle
                key={star.id}
                cx={px}
                cy={star.y}
                r={star.size}
                fill="#FFFFFF"
                opacity={star.opacity * flicker}
              />
            );
          })}
        </g>

        {/* Parallax Stars Layer 2 (Faster Drift) */}
        <g opacity={isNight ? 0.8 : 0.35}>
          {starLayers.layer2.map(star => {
            const px = (star.x + animTime * star.speed * 3.5) % 960;
            return (
              <circle
                key={star.id}
                cx={px}
                cy={star.y}
                r={star.size}
                fill="#93C5FD"
                opacity={star.opacity}
              />
            );
          })}
        </g>

        {/* Celestial Body: Earth (from Moon) or Phobos (from Mars) */}
        {!isMars ? (
          <g transform={`translate(${770 - Math.sin(animTime * 0.05) * 8}, 65)`}>
            <circle cx="0" cy="0" r="26" fill="#1D4ED8" />
            <circle cx="-5" cy="-3" r="14" fill="#3B82F6" opacity="0.6" />
            <path d="M -12,-8 Q 0,0 8,-12 Q 18,-6 14,8 Q 0,16 -16,4 Z" fill="#60A5FA" opacity="0.75" />
            <circle cx="0" cy="0" r="26" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.4" />
            <text x="34" y="4" fill="#93C5FD" fontSize="9" fontFamily="monospace" opacity="0.75">{t('canvas.earth')}</text>
          </g>
        ) : (
          <g transform={`translate(${810 + Math.sin(animTime * 0.08) * 12}, 75)`}>
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#D1D5DB" />
            <text x="16" y="3" fill="#FCA5A5" fontSize="8" fontFamily="monospace" opacity="0.75">{t('canvas.phobos')}</text>
          </g>
        )}

        {/* The Sun / Photovoltaic Light Source */}
        <g transform={`translate(${sunX}, ${sunY})`}>
          <circle cx="0" cy="0" r={22} fill="#FDE047" opacity={daylightIntensity * 0.85} filter="url(#bloom)" />
          <circle cx="0" cy="0" r={13} fill="#FFFFFF" />
          <line x1="-36" y1="0" x2="36" y2="0" stroke="#FDE047" strokeWidth="1.5" opacity={daylightIntensity * 0.4} />
          <line x1="0" y1="-36" x2="0" y2="36" stroke="#FDE047" strokeWidth="1.5" opacity={daylightIntensity * 0.4} />
        </g>

        {/* Distant Mountain / Crater Ridges grounded in LOLA/MOLA site topography */}
        <path
          d={distantRidgePath}
          fill={isMars ? "#5E251F" : "#1B2232"}
          opacity={isNight ? 0.5 : 0.85}
        />

        {/* Foreground Terrain Surface */}
        <path
          d="M 0,310 Q 240,295 480,315 T 960,305 L 960,480 L 0,480 Z"
          fill="url(#terrainGrad)"
        />

        {/* Dynamic Surface Shadows Cast By Outpost Structures */}
        <ellipse 
          cx={160 - panelAngle * 0.8} 
          cy="365" 
          rx="45" 
          ry="6" 
          fill="#000000" 
          opacity={isNight ? 0.2 : 0.4} 
        />
        <ellipse 
          cx="410" 
          cy="368" 
          rx="70" 
          ry="10" 
          fill="#000000" 
          opacity={isNight ? 0.25 : 0.45} 
        />
        <ellipse 
          cx="565" 
          cy="366" 
          rx="55" 
          ry="8" 
          fill="#000000" 
          opacity={isNight ? 0.25 : 0.4} 
        />

        {/* Regolith Radiation Shielding Berm */}
        <path
          d="M 330,340 Q 480,290 640,340 L 630,380 L 340,380 Z"
          fill="url(#regolithGrad)"
          stroke="#52D6FF"
          strokeWidth="0.8"
          strokeOpacity={resources.shielding > 60 ? "0.4" : "0.1"}
        />

        {/* --- 2. ENERGETIC POWER BUS & PHYSICAL FLUID FLOWS --- */}

        {/* Central Power Battery Storage Hub */}
        <g transform="translate(265, 335)">
          <rect x="0" y="0" width="24" height="22" rx="3" fill="#0F172A" stroke="#52D6FF" strokeWidth="1.5" />
          <rect x="3" y="4" width={18 * (resources.power / resources.powerMax)} height="6" fill={isLowPower ? "#EF4444" : "#FBBF24"} />
          <circle cx="12" cy="16" r="2" fill="#52D6FF" className="animate-pulse" />
        </g>

        {/* Electrical Grid Lines (Animated Energy Particle Pulses) */}
        <g strokeLinecap="round" fill="none">
          {/* Solar Array -> Central Battery Hub */}
          <path 
            d="M 160,305 L 265,345" 
            stroke={isEmergencyPower ? "#EF4444" : isLowPower ? "#F59E0B" : "#52D6FF"} 
            strokeWidth={isLowPower ? "2" : "3"} 
            strokeDasharray="8 8"
            strokeDashoffset={powerDashOffset}
            opacity={deltas.powerGen > 5 ? 0.9 : 0.25}
          />
          {/* Battery Hub -> Habitat */}
          <path 
            d="M 289,345 L 360,345" 
            stroke={isLowPower ? "#F59E0B" : "#52D6FF"} 
            strokeWidth="3" 
            strokeDasharray="6 6"
            strokeDashoffset={powerDashOffset}
            opacity={0.85}
          />
          {/* Battery / Habitat -> Bio-Greenhouse Bus */}
          <path 
            d="M 440,335 L 500,335 L 540,325" 
            stroke={modules.greenhouse.operational && !isEmergencyPower ? "#38BDF8" : "#64748B"} 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            strokeDashoffset={powerDashOffset}
            opacity={modules.greenhouse.operational && !isEmergencyPower ? 0.85 : 0.2}
          />
          {/* Habitat -> ECLSS Life Support Bus */}
          <path 
            d="M 390,335 L 390,270 L 335,270" 
            stroke={isOxygenCritical ? "#EF4444" : "#35D07F"} 
            strokeWidth="2.5" 
            strokeDasharray="6 6"
            strokeDashoffset={oxygenFlowOffset}
            opacity={0.85}
          />
          {/* Habitat -> Science Lab Bus */}
          <path 
            d="M 430,350 L 670,350 L 710,330" 
            stroke={modules.science_lab.operational && !isLowPower ? "#C084FC" : "#475569"} 
            strokeWidth="2" 
            strokeDasharray="5 7"
            strokeDashoffset={powerDashOffset}
            opacity={modules.science_lab.operational && !isLowPower ? 0.85 : 0.2}
          />

          {/* Closed-Loop Water Supply Pipe: ECLSS -> Habitat -> Greenhouse */}
          <path 
            d="M 315,340 L 315,365 L 430,365 L 565,365 L 565,345" 
            stroke="#38BDF8" 
            strokeWidth="2.5" 
            strokeDasharray="5 5"
            strokeDashoffset={waterFlowOffset}
            opacity={resources.water > 10 ? 0.8 : 0.2}
          />
        </g>

        {/* --- 3. OUTPOST SUBMODULES WITH MECHANICAL DETAIL --- */}

        {/* MODULE 1: Photovoltaic Solar Array */}
        <g 
          className="cursor-pointer transition-transform duration-200" 
          onClick={() => handleModuleClick('solar_array')}
        >
          {/* Mast Support Structure */}
          <line x1="160" y1="360" x2="160" y2="280" stroke="#64748B" strokeWidth="6" />
          <circle cx="160" cy="280" r="5" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Rotating Solar Panel Array following sun angle */}
          <g transform={`rotate(${panelAngle}, 160, 280)`}>
            <rect x="70" y="240" width="180" height="42" rx="3" fill="#0A0F1D" stroke="#52D6FF" strokeWidth="2" />
            
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={70 + i * 22.5} y1="240" x2={70 + i * 22.5} y2="282" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            ))}
            <line x1="70" y1="261" x2="250" y2="261" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

            {/* Specular Reflective Highlight */}
            <line 
              x1={90 + Math.sin(animTime * 1.5) * 50} 
              y1="242" 
              x2={130 + Math.sin(animTime * 1.5) * 50} 
              y2="280" 
              stroke="#FFFFFF" 
              strokeWidth="2" 
              opacity={daylightIntensity * 0.45} 
            />

            {/* Dust Accumulation Layer */}
            {environment.dustLevel > 15 && (
              <rect 
                x="70" 
                y="240" 
                width="180" 
                height="42" 
                fill="#C2410C" 
                opacity={(environment.dustLevel / 100) * 0.55} 
              />
            )}

            {/* Inverter Status LED */}
            <circle 
              cx="240" 
              cy="248" 
              r="3" 
              fill={deltas.powerNet >= 0 ? "#35D07F" : isLowPower ? "#EF4444" : "#F59E0B"} 
            />
          </g>
          <text x="160" y="380" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.solar')}
          </text>
        </g>

        {/* MODULE 2: Habitat Core (Protected Dome Vault) */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('habitat')}>
          {/* Reinforced Geodesic Shell */}
          <path
            d="M 360,345 C 360,285 460,285 460,345 Z"
            fill="url(#hullGrad)"
            stroke="#52D6FF"
            strokeWidth="2"
          />
          {/* Observation Viewports (Illuminated warm yellow at night) */}
          <circle cx="395" cy="315" r="7" fill={isNight ? "#FDE047" : "#38BDF8"} opacity="0.9" />
          <circle cx="425" cy="315" r="7" fill={isNight ? "#FDE047" : "#38BDF8"} opacity="0.9" />
          
          {/* Commander Silhouette Visible in Viewport at x: 425 */}
          <circle cx="425" cy="313" r="2.5" fill="#1E293B" opacity="0.8" />
          <rect x="423" y="316" width="4" height="4" rx="1" fill="#1E293B" opacity="0.8" />

          {/* Pressure Airlock Hatch */}
          <rect x="400" y="330" width="20" height="20" rx="3" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />
          
          {/* Night Floodlight Beam */}
          {isNight && (
            <polygon 
              points="400,340 370,390 440,390" 
              fill="#FDE047" 
              opacity="0.15" 
            />
          )}

          <text x="410" y="375" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.hab')}
          </text>
        </g>

        {/* MODULE 3: Oxygen ECLSS & Water Recovery Tower */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('life_support')}>
          <rect x="290" y="275" width="26" height="65" rx="4" fill="#334155" stroke="#35D07F" strokeWidth="1.5" />
          <rect x="320" y="290" width="22" height="50" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          
          {/* Active Liquid Distillation Bubbles */}
          <circle cx="303" cy={325 - (animTime * 18) % 40} r="2.5" fill="#38BDF8" opacity="0.8" />
          <circle cx="331" cy={330 - (animTime * 14) % 30} r="2" fill="#35D07F" opacity="0.8" />
          
          {/* Rising Oxygen Micro-Bubbles into Ventilation Line */}
          {Array.from({ length: 3 }).map((_, b) => (
            <circle 
              key={b}
              cx={300 + b * 10} 
              cy={275 - ((animTime * 25 + b * 15) % 25)} 
              r="2" 
              fill="#52D6FF" 
              opacity={isOxygenCritical ? 0.3 : 0.85} 
            />
          ))}

          {/* Water Tank Level Gauge */}
          <rect x="294" y="295" width="5" height="38" fill="#1E293B" />
          <rect 
            x="294" 
            y={295 + 38 * (1 - resources.water / resources.waterMax)} 
            width="5" 
            height={38 * (resources.water / resources.waterMax)} 
            fill="#38BDF8" 
          />

          <text x="317" y="370" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.eclss')}
          </text>
        </g>

        {/* MODULE 4: Hydroponic Bio-Greenhouse (Living Plants & LEDs) */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('greenhouse')}>
          <path
            d="M 520,345 C 520,290 610,290 610,345 Z"
            fill="url(#greenhouseGlow)"
            stroke={cropStage === 'healthy' ? "#35D07F" : cropStage === 'stressed' ? "#EAB308" : "#EF4444"}
            strokeWidth="2"
          />

          {/* Animated Hydroponic Plant Racks with Gentle Natural Sway */}
          {Array.from({ length: 5 }).map((_, i) => {
            const bx = 535 + i * 15;
            const sway = Math.sin(animTime * 2.5 + i * 0.8) * 2;
            const plantColor = cropStage === 'healthy' ? "#22C55E" : cropStage === 'stressed' ? "#CA8A04" : "#991B1B";
            const plantHeight = cropStage === 'healthy' ? 22 : cropStage === 'stressed' ? 16 : 9;

            return (
              <g key={i}>
                <line 
                  x1={bx} 
                  y1="340" 
                  x2={bx + sway} 
                  y2={340 - plantHeight} 
                  stroke={plantColor} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                <circle cx={bx + sway - 2} cy={340 - plantHeight + 2} r="2" fill={plantColor} />
                <circle cx={bx + sway + 2} cy={340 - plantHeight + 2} r="2" fill={plantColor} />
              </g>
            );
          })}

          {/* Botanist Astronaut inside Greenhouse Dome at x: 550 */}
          <g transform="translate(548, 320)">
            <circle cx="6" cy="4" r="3" fill="#E2E8F0" stroke="#35D07F" strokeWidth="1" />
            <rect x="3" y="8" width="6" height="8" rx="1.5" fill="#334155" />
            <rect x="7" y="10" width="3" height="3" fill="#38BDF8" opacity="0.9" />
          </g>

          {/* Photosynthetic Grow Light Bar */}
          <line x1="535" y1="300" x2="595" y2="300" stroke="#E879F9" strokeWidth="2" opacity={isNight ? 0.9 : 0.6} />

          <text x="565" y="370" textAnchor="middle" fill="#86EFAC" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.greenhouse')}
          </text>
        </g>

        {/* MODULE 5: Astrobiology & Geology Science Lab */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('science_lab')}>
          <rect x="670" y="295" width="70" height="50" rx="4" fill="url(#hullGrad)" stroke="#C084FC" strokeWidth="2" />
          
          {/* Rotating High-Gain Satellite Antenna Dish */}
          <g transform="translate(705, 275)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#64748B" strokeWidth="3" />
            <path 
              d="M -16,-6 Q 0,-16 16,-6 Z" 
              fill="#E2E8F0" 
              stroke="#C084FC" 
              strokeWidth="1.5" 
              transform={`rotate(${Math.sin(animTime * 0.8) * 15})`} 
            />
            <circle 
              cx="0" 
              cy="-10" 
              r={modules.science_lab.operational && !isLowPower ? 2.5 : 1} 
              fill="#C084FC" 
              opacity={0.8} 
            />
          </g>
          <text x="705" y="370" textAnchor="middle" fill="#E9D5FF" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.lab')}
          </text>
        </g>

        {/* MODULE 6: Pressurized Rover Garage & Dynamic Sortie Rover */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('rover_garage')}>
          <path d="M 780,350 L 800,315 L 870,315 L 890,350 Z" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />

          {/* Active Exploration Rover Sortie Motion */}
          <g transform={`translate(${roverX}, 354)`}>
            {/* Front Headlight Light Cone on Surface */}
            <polygon 
              points="-5,7 -40,15 -40,2" 
              fill="#FDE047" 
              opacity="0.35" 
            />

            {/* Rover Chassis */}
            <rect x="0" y="0" width="36" height="15" rx="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
            <rect x="22" y="2" width="10" height="6" rx="2" fill="#38BDF8" />
            
            {/* Rotating Wheels */}
            <circle cx="6" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="18" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="30" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />

            {/* Animated Dust Puffs Trailing Moving Wheels */}
            {(roverState === 'departing' || roverState === 'returning') && (
              <g opacity="0.6">
                <circle cx={38 + Math.sin(animTime * 8) * 3} cy="15" r="2.5" fill={isMars ? "#EA580C" : "#94A3B8"} />
                <circle cx={42 + Math.cos(animTime * 7) * 4} cy="12" r="3.5" fill={isMars ? "#C2410C" : "#64748B"} />
              </g>
            )}

            {/* Drill Beam active during 'sampling' state */}
            {roverState === 'sampling' && (
              <line x1="2" y1="12" x2="-8" y2="24" stroke="#52D6FF" strokeWidth="2" strokeDasharray="2 2" className="animate-pulse" />
            )}

            <line x1="4" y1="0" x2="1" y2="-7" stroke="#F4C95D" strokeWidth="1.5" />
          </g>

          <text x="835" y="375" textAnchor="middle" fill="#FDE047" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            {t('canvas.rover')}
          </text>
        </g>

        {/* --- 4. LIVING EVA ASTRONAUT FIGURE OUTSIDE (Requirement 21) --- */}
        <g transform={`translate(${evaAstronautX}, 346)`}>
          {/* Suit Shadow */}
          <ellipse cx="6" cy="20" rx="7" ry="2" fill="#000000" opacity="0.4" />
          
          {/* Helmet with Reflective Visor */}
          <circle cx="6" cy="4" r="4" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1" />
          <ellipse cx="6" cy="3" rx="2.5" ry="1.5" fill="#38BDF8" />
          
          {/* Life-Support Backpack */}
          <rect x="-1" y="6" width="3" height="9" rx="1" fill="#475569" />
          
          {/* Torso & Suit */}
          <rect x="2" y="7" width="8" height="9" rx="2" fill="#F1F5F9" />
          
          {/* Walking Legs with stride phase */}
          <line 
            x1="4" 
            y1="16" 
            x2={4 + Math.sin(animTime * 4) * 3} 
            y2="20" 
            stroke="#94A3B8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <line 
            x1="8" 
            y1="16" 
            x2={8 - Math.sin(animTime * 4) * 3} 
            y2="20" 
            stroke="#94A3B8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* Biometric Status Beacon Dot */}
          <circle 
            cx="6" 
            cy="-1" 
            r="1.5" 
            fill={environment.solarFlareActive ? "#EF4444" : "#10B981"} 
            className="animate-pulse" 
          />
        </g>

        {/* --- 5. RADIATION SHIELDING & PENETRATION VISUALIZATION --- */}
        <g opacity={environment.solarFlareActive ? 0.95 : 0.65}>
          {Array.from({ length: radParticleCount }).map((_, i) => {
            const rx = 180 + (i * 47) % 640;
            const ry = 40 + ((i * 31 + animTime * 120) % 320);
            
            const isHabitatX = rx > 350 && rx < 620;
            const hitShieldThreshold = 250;
            const isProtected = isHabitatX && ry > hitShieldThreshold;
            
            const penetrates = isProtected && shieldingStrength < 0.55 && (i % 2 === 0);
            const safelyBlocked = isProtected && !penetrates;

            return (
              <g key={i}>
                <line
                  x1={rx}
                  y1={ry}
                  x2={rx - 6}
                  y2={ry + 14}
                  stroke={environment.solarFlareActive ? "#FF5C5C" : "#F4C95D"}
                  strokeWidth={safelyBlocked ? 2.5 : penetrates ? 1.8 : 1.2}
                  strokeDasharray={safelyBlocked ? "2 2" : "none"}
                />

                {/* Shield deflection flash */}
                {safelyBlocked && (
                  <circle
                    cx={rx - 6}
                    cy={ry + 14}
                    r="3.5"
                    fill="#52D6FF"
                    opacity="0.85"
                    filter="url(#bloom)"
                  />
                )}

                {/* Penetrating particle inside habitat */}
                {penetrates && (
                  <circle
                    cx={rx - 6}
                    cy={ry + 14}
                    r="2.5"
                    fill="#EF4444"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Protective Shielding Arc Forcefield */}
        {shieldingStrength > 0.45 && (
          <path
            d="M 310,325 Q 485,200 660,325"
            fill="none"
            stroke="#52D6FF"
            strokeWidth={shieldingStrength * 3}
            strokeDasharray="10 6"
            opacity={shieldingStrength * 0.8}
            filter="url(#bloom)"
          />
        )}

        {/* Martian Dust Storm Particles & Atmospheric Haze */}
        {environment.dustLevel > 15 && (
          <g>
            <rect
              width="960"
              height="480"
              fill="#C2410C"
              opacity={(environment.dustLevel / 100) * 0.48}
              style={{ mixBlendMode: 'color-burn' }}
            />
            {Array.from({ length: 25 }).map((_, k) => {
              const dx = (k * 61 + animTime * 95) % 960;
              const dy = 180 + (k * 37 + Math.sin(animTime * 2 + k) * 20) % 250;
              return (
                <circle 
                  key={k} 
                  cx={dx} 
                  cy={dy} 
                  r={1 + (k % 2)} 
                  fill="#FDBA74" 
                  opacity={0.5} 
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* Floating Outpost Environment Telemetry Overlay */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-auto flex flex-wrap gap-1 sm:gap-2 items-center text-[10px] sm:text-xs">
        <button
          type="button"
          onClick={onOpenTerrainExplorer}
          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#0A1020]/90 hover:bg-[#121c35] border border-[#52D6FF]/40 hover:border-[#52D6FF] text-[#52D6FF] font-mono flex items-center gap-1 sm:gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 text-left"
          title={language === 'bn' ? 'নাসা আসল ভূখণ্ড প্রোফাইল দেখুন' : 'Explore NASA LOLA/MOLA Topography Profile'}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#52D6FF] animate-pulse shrink-0"></span>
          <span className="font-bold truncate max-w-[130px] sm:max-w-[220px]">
            {landingSite 
              ? ((language === 'bn' && landingSite.nameBn) ? landingSite.nameBn : landingSite.name) 
              : (isMars ? 'MARS EXPEDITION' : 'LUNAR EXPEDITION')}
          </span>
          {landingSite && (
            <span className="text-slate-400 text-[9px] hidden md:inline">
              ({landingSite.elevation_km >= 0 ? `+${formatNum(landingSite.elevation_km)}` : formatNum(landingSite.elevation_km)} km)
            </span>
          )}
        </button>
        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-[#101827]/85 border border-slate-700 text-slate-300 font-mono">
          {t('canvas.temp', { temp: formatNum(environment.externalTempC) })}
        </span>
        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-[#101827]/85 border border-slate-700 text-slate-300 font-mono hidden xs:inline">
          {t('canvas.solarFlux', { flux: formatNum(Math.round(environment.sunIntensity * 100)) })}
        </span>
        {environment.dustLevel > 30 && (
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{t('canvas.dustTau', { tau: formatNum(environment.dustLevel) })}</span>
          </span>
        )}
        {environment.solarFlareActive && (
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-red-950/80 border border-red-500 text-red-300 font-mono flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{t('canvas.spe')}</span>
          </span>
        )}
      </div>

      {/* Reset Camera View Button */}
      {selectedModule && (
        <button
          onClick={() => setSelectedModule(null)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-[#0A1020]/85 border border-slate-700 hover:border-[#52D6FF]/50 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-md"
          title="Reset camera to outpost overview"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#52D6FF]" />
          {t('common.overview')}
        </button>
      )}

      {/* Quick Inspection Floating Drawer */}
      {selectedModule && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-[#101827]/95 border border-[#52D6FF]/40 backdrop-blur-md shadow-2xl text-xs z-10 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-display font-bold text-sm text-[#52D6FF] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#52D6FF]" />
              {(language === 'bn' && modules[selectedModule].nameBn) ? modules[selectedModule].nameBn : modules[selectedModule].name}{' '}
              {language === 'bn' ? `(লেভেল ${formatNum(modules[selectedModule].level)})` : `(Level ${modules[selectedModule].level})`}
            </span>
            <button
              onClick={() => setSelectedModule(null)}
              className="text-slate-400 hover:text-white px-1.5 font-mono"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 mb-2 leading-relaxed">
            {(language === 'bn' && modules[selectedModule].descriptionBn) ? modules[selectedModule].descriptionBn : modules[selectedModule].description}
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mb-2 bg-[#0A1020]/70 p-2 rounded border border-slate-800">
            <div>{language === 'bn' ? '⚡ বিদ্যুৎ খরচ: ' : '⚡ Power Load: '}<span className="text-amber-400">{formatNum(modules[selectedModule].powerDraw)} kW</span></div>
            <div>{language === 'bn' ? '⚙️ কার্যক্ষমতা: ' : '⚙️ Efficiency: '}<span className="text-emerald-400">{formatNum(Math.round(modules[selectedModule].efficiency * 100))}%</span></div>
          </div>
          <div className="text-[11px] text-sky-200/80 italic border-l-2 border-[#52D6FF] pl-2">
            {t('canvas.spec')} {modules[selectedModule].educationalFact}
          </div>
        </div>
      )}

      {/* Interactive Helper Hint */}
      {!selectedModule && (
        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-[#0A1020]/75 px-2.5 py-1 rounded-lg border border-slate-800">
          <Compass className="w-3.5 h-3.5 text-[#52D6FF]" />
          {t('canvas.hint')}
        </div>
      )}
    </div>
  );
};
