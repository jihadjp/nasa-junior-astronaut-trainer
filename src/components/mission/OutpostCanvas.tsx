import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { SimulationState, ModuleType } from '../../types/game';
import { AlertTriangle, Info, Compass } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

interface OutpostCanvasProps {
  state: SimulationState;
  focusedModule?: ModuleType | null;
  onInspectModule?: (moduleId: ModuleType) => void;
  onOpenTerrainExplorer?: () => void;
  onOpenRoverSortie?: () => void;
  onOpenCrew?: () => void;
  onPerformTacticalAction?: (action: string, moduleId: ModuleType) => void;
}

export const OutpostCanvas: React.FC<OutpostCanvasProps> = ({ 
  state, 
  focusedModule = null, 
  onInspectModule,
  onOpenTerrainExplorer,
  onOpenRoverSortie,
  onOpenCrew,
  onPerformTacticalAction
}) => {
  const { t, formatNum, language } = useLanguage();
  const { destination, environment, modules, resources, deltas, missionDay, activeEvent, landingSite } = state;
  const isMars = destination === 'mars';
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [actionToast, setActionToast] = useState<{ message: string; icon: string } | null>(null);
  const [showDeepFact, setShowDeepFact] = useState<boolean>(false);

  const showToast = (message: string, icon: string = '✨') => {
    setActionToast({ message, icon });
    setTimeout(() => {
      setActionToast(null);
    }, 2800);
  };

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

  // Smooth animated mission day for cinematic day/night transitions (1.5s ease)
  const [displayDay, setDisplayDay] = useState<number>(missionDay);

  useEffect(() => {
    let animId: number;
    const startDay = displayDay;
    const targetDay = missionDay;
    if (Math.abs(startDay - targetDay) < 0.005) return;

    const startTime = performance.now();
    const duration = 1500; // 1.5s smooth transition

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeInOutQuad
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setDisplayDay(startDay + (targetDay - startDay) * eased);
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [missionDay]);

  // Camera ViewBox Coordinates (Smooth Camera System)
  const [camera, setCamera] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 960,
    h: 480
  });

  // Rover Sortie State: Stationed calmly at hangar unless active mission
  const roverX = 830;

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

  // Target Camera Glide Coordinates: Fixed & calm when idle, smooth glide on inspection
  const targetCamera = useMemo(() => {
    const targetModule = focusedModule || (activeEvent?.illustrationType === 'dust_storm' ? 'solar_array' :
      activeEvent?.illustrationType === 'power_shortage' ? 'solar_array' :
      activeEvent?.illustrationType === 'greenhouse_stress' ? 'greenhouse' :
      activeEvent?.illustrationType === 'radiation_spike' ? 'habitat' :
      activeEvent?.illustrationType === 'water_leak' ? 'life_support' :
      selectedModule);

    let baseBox = { x: 0, y: 0, w: 960, h: 480 };

    if (!targetModule) {
      // Physically calm: No idle camera wobbling!
      baseBox = { x: 0, y: 0, w: 960, h: 480 };
    } else {
      switch (targetModule) {
        case 'solar_array':
          baseBox = { x: 50, y: 180, w: 560, h: 280 };
          break;
        case 'habitat':
          baseBox = { x: 260, y: 220, w: 520, h: 260 };
          break;
        case 'life_support':
          baseBox = { x: 190, y: 200, w: 500, h: 250 };
          break;
        case 'greenhouse':
          baseBox = { x: 420, y: 220, w: 500, h: 250 };
          break;
        case 'science_lab':
          baseBox = { x: 550, y: 200, w: 460, h: 230 };
          break;
        case 'rover_garage':
          baseBox = { x: 620, y: 240, w: 450, h: 225 };
          break;
        default:
          baseBox = { x: 0, y: 0, w: 960, h: 480 };
      }
    }

    const scaledW = baseBox.w * zoomLevel;
    const scaledH = baseBox.h * zoomLevel;
    const centerX = baseBox.x + baseBox.w / 2;
    const centerY = baseBox.y + baseBox.h / 2;

    return {
      x: centerX - scaledW / 2,
      y: centerY - scaledH / 2,
      w: scaledW,
      h: scaledH
    };
  }, [focusedModule, activeEvent, selectedModule, zoomLevel]);

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
    sound.playClick();
    setSelectedModule(modId);
    setShowDeepFact(false);
    if (onInspectModule) onInspectModule(modId);
  };

  // Day/Night & Sun Cycle based on smooth displayDay
  const dayCyclePhase = ((displayDay % (isMars ? 7 : 14)) / (isMars ? 7 : 14)) * 2 * Math.PI;
  const sunX = 140 + 680 * (0.5 + 0.5 * Math.sin(dayCyclePhase));
  const sunY = 55 + 35 * Math.cos(dayCyclePhase);
  const isNight = Math.cos(dayCyclePhase) < -0.2;
  const daylightIntensity = Math.max(0.12, Math.min(1.0, 0.5 + 0.5 * Math.cos(dayCyclePhase)));

  // Spatially Fixed Starfield: Zero conveyor belt drift, natural stellar magnitude & twinkle
  const stars = useMemo(() => {
    const list: Array<{ id: number; x: number; y: number; r: number; opacity: number; twinkle: boolean }> = [];
    for (let i = 0; i < 95; i++) {
      const x = (i * 131.7 + i * i * 4.3) % 960;
      const y = 8 + ((i * 73.1 + i * 19.3) % 255);
      const r = i % 7 === 0 ? 1.2 : i % 3 === 0 ? 0.9 : 0.6;
      const opacity = 0.25 + (i % 6) * 0.12;
      const twinkle = i % 4 === 0;
      list.push({ id: i, x, y, r, opacity, twinkle });
    }
    return list;
  }, []);

  // Solar Tracking Angle smoothly tracks Sun vector
  const panelAngle = Math.max(-28, Math.min(28, (sunX - 160) * 0.065));

  // Subsystem Energy Flow: Speed & glow communicate real simulation state
  const isLowPower = resources.power < 25;
  const isEmergencyPower = resources.power < 10;
  const powerFlowSpeed = isEmergencyPower ? 0.05 : isLowPower ? 0.35 : 1.0;
  const powerDashOffset = (animTime * 18 * powerFlowSpeed) % 30;

  // Closed-loop Water & Oxygen Flow Speeds
  const waterFlowOffset = resources.water > 10 ? (animTime * 12) % 24 : 0;
  const oxygenFlowOffset = resources.oxygen > 15 ? (animTime * 14) % 24 : 0;
  const isOxygenCritical = resources.oxygen < 25;

  // Hydroponic Greenhouse Crop Health Stage & Growth Height
  const greenhouseEfficiency = modules.greenhouse.efficiency;
  const cropStage = greenhouseEfficiency > 0.85 ? 'healthy' : greenhouseEfficiency > 0.5 ? 'stressed' : 'critical';
  // Plants grow steadily over mission days (from 9px sprouts up to 24px mature crops)
  const cropGrowthHeight = Math.round(9 + Math.min(1, displayDay / 26) * 15);

  const shieldingStrength = resources.shielding / 100;

  // EVA Astronaut stays grounded on regolith; inside airlock during storms
  const isAstronautSheltered = environment.solarFlareActive || (isMars && environment.dustLevel > 50);
  const evaAstronautX = 230;

  // Single realistic meteor streak ONLY during active threat event
  const isMeteorEvent = environment.micrometeoroidThreat || activeEvent?.illustrationType === 'meteoroid';

  return (
    <div className="relative w-full h-[360px] xs:h-[420px] sm:h-[500px] md:h-[560px] lg:h-[620px] rounded-2xl overflow-hidden border border-[#52D6FF]/25 bg-[#040814] shadow-2xl select-none group">
      {/* Dynamic Animated SVG Space Simulation */}
      <svg 
        className="w-full h-full transition-all duration-300" 
        viewBox={`${camera.x} ${camera.y} ${camera.w} ${camera.h}`} 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky Gradient modulated by day/night cycle & planetary environment */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop 
              offset="0%" 
              stopColor={isMars 
                ? (isNight ? "#0D0507" : "#24100C") 
                : (isNight ? "#010308" : "#030612")
              } 
            />
            <stop 
              offset="55%" 
              stopColor={isMars 
                ? (isNight ? "#1C0B0E" : "#4A1F18") 
                : (isNight ? "#040714" : "#060C22")
              } 
            />
            <stop 
              offset="100%" 
              stopColor={isMars 
                ? (isNight ? "#2D1214" : "#7A3224") 
                : (isNight ? "#080F24" : "#0A1433")
              } 
            />
          </linearGradient>

          {/* Mars Atmospheric Haze Gradient */}
          <linearGradient id="marsHazeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C2410C" stopOpacity="0" />
            <stop offset="100%" stopColor="#C2410C" stopOpacity="0.35" />
          </linearGradient>

          {/* Solar Coronal Bloom */}
          <radialGradient id="sunBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor={isMars ? "#BAE6FD" : "#FEF08A"} stopOpacity="0.8" />
            <stop offset="70%" stopColor={isMars ? "#38BDF8" : "#FDE047"} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isMars ? "#0284C7" : "#EAB308"} stopOpacity="0" />
          </radialGradient>

          {/* Solar Flare SPE Ionization Shimmer (Upper Atmospheric Event Only) */}
          <linearGradient id="solarFlareIonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
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

        {/* LAYER 1: Deep Space & Spatially-Fixed Starfield (No conveyor belt, no falling rain) */}
        <g transform={`translate(${-camera.x * 0.02}, ${-camera.y * 0.02})`}>
          {stars.map(s => {
            const twinkleFactor = s.twinkle ? (0.75 + 0.25 * Math.sin(animTime * 1.5 + s.id)) : 1.0;
            return (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill={isMars ? "#FFF3EB" : "#FFFFFF"}
                opacity={isNight ? s.opacity * twinkleFactor : (s.opacity * 0.5 * twinkleFactor)}
              />
            );
          })}
        </g>

        {/* Event-Based Meteor / Micrometeorite Streak (ONLY active during meteor threat events!) */}
        {isMeteorEvent && (
          <g>
            <line
              x1="740"
              y1="35"
              x2="610"
              y2="105"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="40 100"
              strokeDashoffset={-(animTime * 180) % 140}
              opacity="0.85"
              filter="url(#bloom)"
            />
          </g>
        )}

        {/* Solar Particle Event: Atmospheric Coronal Ion Shimmer (ONLY active during SPE event!) */}
        {environment.solarFlareActive && (
          <rect 
            width="960" 
            height="220" 
            fill="url(#solarFlareIonGlow)" 
            opacity={0.3 + 0.1 * Math.sin(animTime * 1.5)} 
          />
        )}

        {/* Mars Dust Storm Veil (Dynamic atmospheric dust when active or high dust tau) */}
        {isMars && (environment.dustLevel > 35 || environment.dustStormActive) && (
          <g opacity={Math.min(0.65, environment.dustLevel / 100)}>
            <rect width="960" height="480" fill="#C2410C" opacity="0.18" />
            {Array.from({ length: 6 }).map((_, i) => (
              <line 
                key={i}
                x1={(i * 160 + animTime * 140) % 1040 - 80}
                y1={240 + (i * 34) % 180}
                x2={(i * 160 + animTime * 140) % 1040 + 20}
                y2={240 + (i * 34) % 180 + 3}
                stroke="#EA580C"
                strokeWidth="1.4"
                strokeDasharray="25 45"
                opacity="0.38"
              />
            ))}
          </g>
        )}

        {/* Celestial Body: Earth (from Moon) or Phobos (from Mars) */}
        {!isMars ? (
          <g transform="translate(770, 65)">
            {/* Blue Marble Earth: Calm & stationary against ink-black sky */}
            <circle cx="0" cy="0" r="26" fill="#1D4ED8" />
            <circle cx="-5" cy="-3" r="14" fill="#3B82F6" opacity="0.6" />
            <path d="M -12,-8 Q 0,0 8,-12 Q 18,-6 14,8 Q 0,16 -16,4 Z" fill="#60A5FA" opacity="0.75" />
            <path d="M -16,-2 Q -8,-10 2,-4 Q 12,-14 20,-2 Q 10,8 -4,12 Z" fill="#FFFFFF" opacity="0.45" />
            <circle cx="0" cy="0" r="27" fill="none" stroke="#60A5FA" strokeWidth="1.2" opacity="0.5" />
            <text x="34" y="4" fill="#93C5FD" fontSize="9" fontFamily="monospace" opacity="0.75">
              {language === 'bn' ? 'পৃথিবী • ৩,৮৪,৪০০ কিমি' : 'EARTH • 384,400 km'}
            </text>
          </g>
        ) : (
          <g transform="translate(810, 75)">
            {/* Phobos: Small irregular cratered moonlet */}
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#9CA3AF" />
            <circle cx="-2" cy="-1" r="2" fill="#6B7280" opacity="0.7" />
            <circle cx="3" cy="2" r="1.5" fill="#4B5563" opacity="0.6" />
            <text x="16" y="3" fill="#FCA5A5" fontSize="8" fontFamily="monospace" opacity="0.75">
              {language === 'bn' ? 'ফোবোস' : 'PHOBOS'}
            </text>
          </g>
        )}

        {/* The Sun / Photovoltaic Light Source: Smooth cinematic positioning */}
        <g transform={`translate(${sunX}, ${sunY})`}>
          <circle cx="0" cy="0" r={isMars ? 26 : 22} fill="url(#sunBloom)" opacity={daylightIntensity * 0.9} filter="url(#bloom)" />
          <circle cx="0" cy="0" r={isMars ? 10 : 13} fill="#FFFFFF" />
          {!isMars && (
            <>
              <line x1="-32" y1="0" x2="32" y2="0" stroke="#FDE047" strokeWidth="1.5" opacity={daylightIntensity * 0.45} />
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#FDE047" strokeWidth="1.5" opacity={daylightIntensity * 0.45} />
            </>
          )}
        </g>

        {/* LAYER 2: Distant Mountains / Horizon (LOLA/MOLA topography with realistic depth) */}
        <g transform={`translate(${-camera.x * 0.12}, ${-camera.y * 0.08})`}>
          <path
            d={distantRidgePath}
            fill={isMars ? (isNight ? "#2E1210" : "#5E251F") : (isNight ? "#0D111A" : "#1B2232")}
            opacity={isNight ? 0.6 : 0.9}
          />
          {/* Mars Atmospheric Dust Haze along Horizon */}
          {isMars && (
            <rect 
              x="0" 
              y="220" 
              width="960" 
              height="80" 
              fill="url(#marsHazeGrad)" 
              opacity={isNight ? 0.25 : 0.45} 
            />
          )}
        </g>

        {/* LAYER 3: Outpost Foreground Surface */}
        <path
          d="M 0,310 Q 240,295 480,315 T 960,305 L 960,480 L 0,480 Z"
          fill="url(#terrainGrad)"
        />

        {/* Dynamic Surface Shadows Cast By Outpost Structures: Smoothly responds to Sun vector */}
        <ellipse 
          cx={160 - panelAngle * 0.9} 
          cy="365" 
          rx={isNight ? 30 : Math.abs(panelAngle) > 15 ? 55 : 42} 
          ry="5" 
          fill="#000000" 
          opacity={isNight ? 0.15 : 0.45} 
        />
        <ellipse 
          cx="410" 
          cy="368" 
          rx="68" 
          ry="8" 
          fill="#000000" 
          opacity={isNight ? 0.2 : 0.45} 
        />
        <ellipse 
          cx="565" 
          cy="366" 
          rx="52" 
          ry="7" 
          fill="#000000" 
          opacity={isNight ? 0.2 : 0.4} 
        />

        {/* Regolith Radiation Shielding Berm */}
        <path
          d="M 330,340 Q 480,290 640,340 L 630,380 L 340,380 Z"
          fill="url(#regolithGrad)"
          stroke="#52D6FF"
          strokeWidth="0.8"
          strokeOpacity={resources.shielding > 60 ? "0.4" : "0.1"}
        />

        {/* --- 2. ENERGETIC POWER BUS & PHYSICAL FLUID FLOWS (Subtle, state-driven) --- */}

        {/* Central Power Battery Storage Hub */}
        <g transform="translate(265, 335)">
          <rect x="0" y="0" width="24" height="22" rx="3" fill="#0F172A" stroke="#52D6FF" strokeWidth="1.5" />
          <rect x="3" y="4" width={18 * (resources.power / resources.powerMax)} height="6" fill={isLowPower ? "#EF4444" : "#FBBF24"} />
          <circle cx="12" cy="16" r="2" fill="#52D6FF" opacity={isLowPower ? 0.4 : 0.9} />
        </g>

        {/* Electrical Grid Lines (Subtle pulsed energy conduits) */}
        <g strokeLinecap="round" fill="none">
          {/* Solar Array -> Central Battery Hub */}
          <path 
            d="M 160,305 L 265,345" 
            stroke={isEmergencyPower ? "#EF4444" : isLowPower ? "#F59E0B" : "#52D6FF"} 
            strokeWidth={isLowPower ? "1.8" : "2.2"} 
            strokeDasharray="4 6"
            strokeDashoffset={powerDashOffset}
            opacity={deltas.powerGen > 5 ? 0.85 : 0.2}
          />
          {/* Battery Hub -> Habitat */}
          <path 
            d="M 289,345 L 360,345" 
            stroke={isLowPower ? "#F59E0B" : "#52D6FF"} 
            strokeWidth="2.2" 
            strokeDasharray="4 6"
            strokeDashoffset={powerDashOffset}
            opacity={0.8}
          />
          {/* Battery / Habitat -> Bio-Greenhouse Bus */}
          <path 
            d="M 440,335 L 500,335 L 540,325" 
            stroke={modules.greenhouse.operational && !isEmergencyPower ? "#38BDF8" : "#64748B"} 
            strokeWidth="2" 
            strokeDasharray="4 6"
            strokeDashoffset={powerDashOffset}
            opacity={modules.greenhouse.operational && !isEmergencyPower ? 0.8 : 0.2}
          />
          {/* Habitat -> ECLSS Life Support Bus */}
          <path 
            d="M 390,335 L 390,270 L 335,270" 
            stroke={isOxygenCritical ? "#EF4444" : "#35D07F"} 
            strokeWidth="2" 
            strokeDasharray="4 6"
            strokeDashoffset={oxygenFlowOffset}
            opacity={0.8}
          />
          {/* Habitat -> Science Lab Bus */}
          <path 
            d="M 430,350 L 670,350 L 710,330" 
            stroke={modules.science_lab.operational && !isLowPower ? "#C084FC" : "#475569"} 
            strokeWidth="1.8" 
            strokeDasharray="4 6"
            strokeDashoffset={powerDashOffset}
            opacity={modules.science_lab.operational && !isLowPower ? 0.8 : 0.2}
          />

          {/* Closed-Loop Water Supply Pipe: ECLSS -> Habitat -> Greenhouse */}
          <path 
            d="M 315,340 L 315,362 L 430,362 L 565,362 L 565,345" 
            stroke="#38BDF8" 
            strokeWidth="2" 
            strokeDasharray="4 6"
            strokeDashoffset={waterFlowOffset}
            opacity={resources.water > 10 ? 0.75 : 0.2}
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

          {/* Rotating Solar Panel Array: Mechanically tracks the Sun angle smoothly */}
          <g 
            transform={`rotate(${panelAngle}, 160, 280)`}
            style={{ transition: 'transform 1.2s ease-out' }}
          >
            <rect x="70" y="240" width="180" height="42" rx="3" fill="#0A0F1D" stroke="#52D6FF" strokeWidth="2" />
            
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={70 + i * 22.5} y1="240" x2={70 + i * 22.5} y2="282" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            ))}
            <line x1="70" y1="261" x2="250" y2="261" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

            {/* Dust Accumulation Layer */}
            {environment.dustLevel > 20 && (
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
        </g>

        {/* MODULE 2: Habitat Core (Protected Dome Vault) */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('habitat')}>
          <path
            d="M 360,345 C 360,285 460,285 460,345 Z"
            fill="url(#hullGrad)"
            stroke="#52D6FF"
            strokeWidth="2"
          />
          {/* Emergency Alert Beacon on Habitat Roof (Active during crisis, low power, or low oxygen) */}
          {(isEmergencyPower || isOxygenCritical || activeEvent) && (
            <g transform="translate(410, 285)">
              <circle cx="0" cy="0" r="10" fill="#EF4444" opacity={0.25 + 0.25 * Math.sin(animTime * 7)} />
              <circle cx="0" cy="0" r="2.5" fill="#EF4444" />
              <line 
                x1="0" 
                y1="0" 
                x2={12 * Math.cos(animTime * 5)} 
                y2={-12 * Math.sin(animTime * 5)} 
                stroke="#EF4444" 
                strokeWidth="1.5" 
                opacity="0.85" 
              />
            </g>
          )}

          {/* Observation Viewports: Dynamically reacts to power brownout or day/night cycle */}
          <circle 
            cx="395" 
            cy="315" 
            r="7" 
            fill={isEmergencyPower ? "#EF4444" : isLowPower ? "#F59E0B" : isNight ? "#FDE047" : "#38BDF8"} 
            opacity={isEmergencyPower ? (0.4 + 0.4 * Math.sin(animTime * 6)) : isNight ? 0.95 : 0.65} 
          />
          <circle 
            cx="425" 
            cy="315" 
            r="7" 
            fill={isEmergencyPower ? "#EF4444" : isLowPower ? "#F59E0B" : isNight ? "#FDE047" : "#38BDF8"} 
            opacity={isEmergencyPower ? (0.4 + 0.4 * Math.sin(animTime * 6)) : isNight ? 0.95 : 0.65} 
          />
          
          {/* Commander Silhouette Visible in Viewport at x: 425 */}
          <circle cx="425" cy="313" r="2.5" fill="#1E293B" opacity="0.8" />
          <rect x="423" y="316" width="4" height="4" rx="1" fill="#1E293B" opacity="0.8" />

          {/* Pressure Airlock Hatch */}
          <rect x="400" y="330" width="20" height="20" rx="3" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />
          <circle cx="410" cy="326" r="1.5" fill={isEmergencyPower ? "#EF4444" : "#10B981"} />

          {/* Night Floodlight Beam */}
          {isNight && !isEmergencyPower && (
            <polygon 
              points="400,340 375,390 445,390" 
              fill={isLowPower ? "#F59E0B" : "#FDE047"} 
              opacity="0.12" 
            />
          )}
        </g>

        {/* MODULE 3: Oxygen ECLSS & Water Recovery Tower */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('life_support')}>
          <rect x="290" y="275" width="26" height="65" rx="4" fill="#334155" stroke="#35D07F" strokeWidth="1.5" />
          <rect x="320" y="290" width="22" height="50" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          
          {/* Active Liquid Distillation Bubbles */}
          <circle cx="303" cy={325 - (animTime * 14) % 36} r="2.5" fill="#38BDF8" opacity="0.8" />
          <circle cx="331" cy={330 - (animTime * 12) % 28} r="2" fill="#35D07F" opacity="0.8" />
          
          {/* Rising Oxygen Micro-Bubbles into Ventilation Line */}
          {Array.from({ length: 3 }).map((_, b) => (
            <circle 
              key={b}
              cx={300 + b * 10} 
              cy={275 - ((animTime * 18 + b * 15) % 25)} 
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
        </g>

        {/* MODULE 4: Hydroponic Bio-Greenhouse (Living Plants & LEDs) */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('greenhouse')}>
          <path
            d="M 520,345 C 520,290 610,290 610,345 Z"
            fill="url(#greenhouseGlow)"
            stroke={cropStage === 'healthy' ? "#35D07F" : cropStage === 'stressed' ? "#EAB308" : "#EF4444"}
            strokeWidth="2"
          />

          {/* Calm Hydroponic Plant Racks (NO seaweed swaying! Growth scales with missionDay) */}
          {Array.from({ length: 5 }).map((_, i) => {
            const bx = 535 + i * 15;
            const plantColor = cropStage === 'healthy' ? "#22C55E" : cropStage === 'stressed' ? "#CA8A04" : "#991B1B";
            const plantHeight = cropGrowthHeight;

            return (
              <g key={i}>
                <line 
                  x1={bx} 
                  y1="340" 
                  x2={bx} 
                  y2={340 - plantHeight} 
                  stroke={plantColor} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                <circle cx={bx - 2} cy={340 - plantHeight + 2} r="2" fill={plantColor} />
                <circle cx={bx + 2} cy={340 - plantHeight + 2} r="2" fill={plantColor} />
              </g>
            );
          })}

          {/* Botanist Astronaut inside Greenhouse Dome at x: 550 */}
          <g transform="translate(548, 320)">
            <circle cx="6" cy="4" r="3" fill="#E2E8F0" stroke="#35D07F" strokeWidth="1" />
            <rect x="3" y="8" width="6" height="8" rx="1.5" fill="#334155" />
            <rect x="7" y="10" width="3" height="3" fill="#38BDF8" opacity="0.9" />
          </g>

          {/* Photosynthetic Grow Light Bar: Steady, calm illumination */}
          <line x1="535" y1="300" x2="595" y2="300" stroke="#E879F9" strokeWidth="2" opacity={isNight ? 0.95 : 0.65} />
        </g>

        {/* MODULE 5: Astrobiology & Geology Science Lab */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('science_lab')}>
          <rect x="670" y="295" width="70" height="50" rx="4" fill="url(#hullGrad)" stroke="#C084FC" strokeWidth="2" />
          
          {/* Earth-Pointing High-Gain Satellite Antenna Dish */}
          <g transform="translate(705, 275)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#64748B" strokeWidth="3" />
            <path 
              d="M -16,-6 Q 0,-16 16,-6 Z" 
              fill="#E2E8F0" 
              stroke="#C084FC" 
              strokeWidth="1.5" 
            />
            <circle 
              cx="0" 
              cy="-10" 
              r={modules.science_lab.operational && !isLowPower ? 2.5 : 1} 
              fill="#C084FC" 
              opacity={0.8} 
            />
          </g>
        </g>

        {/* MODULE 6: Pressurized Rover Garage & Parked Exploration Rover */}
        <g className="cursor-pointer" onClick={() => handleModuleClick('rover_garage')}>
          <path d="M 780,350 L 800,315 L 870,315 L 890,350 Z" fill="#1E293B" stroke="#F4C95D" strokeWidth="1.5" />

          {/* Exploration Rover: Parked calmly at garage platform (NO random continuous sliding) */}
          <g transform={`translate(${roverX}, 354)`}>
            {/* Rover Chassis */}
            <rect x="0" y="0" width="36" height="15" rx="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
            <rect x="22" y="2" width="10" height="6" rx="2" fill="#38BDF8" />
            
            {/* Sturdy Wheels (Stationary when parked) */}
            <circle cx="6" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="18" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="30" cy="17" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="1" />

            {/* Antenna Mast */}
            <line x1="4" y1="0" x2="1" y2="-7" stroke="#F4C95D" strokeWidth="1.5" />
          </g>
        </g>

        {/* --- 4. NON-OVERLAPPING TACTICAL OBJECT BADGES (Requirement 18) --- */}
        <g>
          {/* ☀ SOLAR */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('solar_array')}>
            <rect x="132" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="160" y="398" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '☀ সোলার' : '☀ SOLAR'}
            </text>
          </g>

          {/* 🫁 ECLSS */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('life_support')}>
            <rect x="277" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="305" y="398" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '🫁 ইসিএলএস' : '🫁 ECLSS'}
            </text>
          </g>

          {/* 🏠 HAB */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('habitat')}>
            <rect x="387" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="415" y="398" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '🏠 হাব' : '🏠 HAB'}
            </text>
          </g>

          {/* 🌱 DOME */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('greenhouse')}>
            <rect x="537" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="565" y="398" textAnchor="middle" fill="#86EFAC" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '🌱 ডোম' : '🌱 DOME'}
            </text>
          </g>

          {/* 🔬 LAB */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('science_lab')}>
            <rect x="677" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="705" y="398" textAnchor="middle" fill="#E9D5FF" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '🔬 ল্যাব' : '🔬 LAB'}
            </text>
          </g>

          {/* 🚜 ROVER HANGAR */}
          <g className="cursor-pointer" onClick={() => handleModuleClick('rover_garage')}>
            <rect x="807" y="386" width="56" height="17" rx="4" fill="#0A1020" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
            <text x="835" y="398" textAnchor="middle" fill="#FDE047" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {language === 'bn' ? '🚜 রোভার' : '🚜 ROVER'}
            </text>
          </g>
        </g>

        {/* --- 5. LIVING EVA ASTRONAUT FIGURE OUTSIDE (Grounded, stationary) --- */}
        {!isAstronautSheltered && (
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
            
            {/* Sturdy Standing Legs */}
            <line x1="4" y1="16" x2="4" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="8" y1="16" x2="8" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Biometric Status Beacon Dot */}
            <circle cx="6" cy="-1" r="1.5" fill="#10B981" />
          </g>
        )}

        {/* Protective Radiation Shielding Arc Forcefield */}
        {shieldingStrength > 0.35 && (
          <path
            d="M 310,325 Q 485,185 660,325"
            fill="none"
            stroke={shieldingStrength > 0.5 ? "#52D6FF" : "#F59E0B"}
            strokeWidth={2 + shieldingStrength * 1.5}
            strokeDasharray="8 6"
            opacity={environment.solarFlareActive ? 0.95 : shieldingStrength * 0.4}
            filter="url(#bloom)"
          />
        )}

        {/* Martian Atmospheric Dust Storm Haze (ONLY on Mars and ONLY during actual storm!) */}
        {isMars && environment.dustLevel > 35 && (
          <rect
            width="960"
            height="480"
            fill="#C2410C"
            opacity={(environment.dustLevel / 100) * 0.4}
            style={{ mixBlendMode: 'color-burn' }}
          />
        )}
      </svg>

      {/* Floating Outpost Environment Telemetry Overlay (Top-Left) */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-auto flex flex-wrap gap-1 sm:gap-2 items-center text-[10px] sm:text-xs z-20">
        <button
          type="button"
          onClick={onOpenTerrainExplorer}
          className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#0A1020]/90 hover:bg-[#121c35] border border-[#52D6FF]/40 hover:border-[#52D6FF] text-[#52D6FF] font-mono flex items-center gap-1 sm:gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 text-left"
          title={language === 'bn' ? 'নাসা আসল ভূখণ্ড প্রোফাইল দেখুন' : 'Explore NASA LOLA/MOLA Topography Profile'}
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#52D6FF] animate-pulse shrink-0"></span>
          <span className="font-bold truncate max-w-[110px] sm:max-w-[180px]">
            {landingSite 
              ? ((language === 'bn' && landingSite.nameBn) ? landingSite.nameBn : landingSite.name) 
              : (isMars ? 'MARS EXPEDITION' : 'LUNAR EXPEDITION')}
          </span>
          {landingSite && (
            <span className="text-slate-400 text-[9px] hidden lg:inline">
              ({landingSite.elevation_km >= 0 ? `+${formatNum(landingSite.elevation_km)}` : formatNum(landingSite.elevation_km)} km)
            </span>
          )}
        </button>

        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-[#101827]/85 border border-slate-700 text-slate-300 font-mono">
          {t('canvas.temp', { temp: formatNum(environment.externalTempC) })}
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

      {/* Floating Tactical Camera Presets Toolbar (Top-Right) */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-0.5 sm:gap-1 bg-[#050914]/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-1 z-20 shadow-xl">
        <button 
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setSelectedModule(null); 
            setZoomLevel(1.0); 
          }}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            !selectedModule && zoomLevel === 1.0 ? 'bg-[#52D6FF] text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={language === 'bn' ? 'পুরো ঘাঁটি ভিউ' : 'Base Overview Camera'}
        >
          <span>👁</span>
          <span className="hidden md:inline">{language === 'bn' ? 'ঘাঁটি' : 'BASE'}</span>
        </button>

        <button 
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setSelectedModule('solar_array'); 
            setShowDeepFact(false);
          }}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            selectedModule === 'solar_array' ? 'bg-[#52D6FF] text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={language === 'bn' ? 'সৌর প্যানেল ভিউ' : 'Solar Array Camera'}
        >
          <span>☀</span>
          <span className="hidden md:inline">{language === 'bn' ? 'সোলার' : 'SOLAR'}</span>
        </button>

        <button 
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setSelectedModule('habitat'); 
            setShowDeepFact(false);
          }}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            selectedModule === 'habitat' ? 'bg-[#52D6FF] text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={language === 'bn' ? 'আবাসস্থল ভিউ' : 'Crew Habitat Camera'}
        >
          <span>🏠</span>
          <span className="hidden md:inline">{language === 'bn' ? 'হাব' : 'HAB'}</span>
        </button>

        <button 
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setSelectedModule('greenhouse'); 
            setShowDeepFact(false);
          }}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            selectedModule === 'greenhouse' ? 'bg-[#52D6FF] text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={language === 'bn' ? 'বায়ো-ডোম ভিউ' : 'Bio-Dome Camera'}
        >
          <span>🌱</span>
          <span className="hidden md:inline">{language === 'bn' ? 'ডোম' : 'DOME'}</span>
        </button>

        <button 
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setSelectedModule('rover_garage'); 
            setShowDeepFact(false);
          }}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            selectedModule === 'rover_garage' ? 'bg-[#52D6FF] text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={language === 'bn' ? 'রোভার হ্যাঙ্গার ভিউ' : 'Rover Garage Camera'}
        >
          <span>🚜</span>
          <span className="hidden md:inline">{language === 'bn' ? 'রোভার' : 'ROVER'}</span>
        </button>

        <div className="w-px h-3.5 bg-slate-700 mx-0.5" />

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setZoomLevel(z => Math.max(0.6, Number((z - 0.15).toFixed(2)))); 
          }}
          className="px-1.5 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/80 font-mono text-xs font-bold"
          title="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => { 
            sound.playClick(); 
            setZoomLevel(z => Math.min(1.4, Number((z + 0.15).toFixed(2)))); 
          }}
          className="px-1.5 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800/80 font-mono text-xs font-bold"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Floating Action Toast Notification (Top-Center) */}
      {actionToast && (
        <div className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-[#52D6FF] text-[#52D6FF] text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-sm">{actionToast.icon}</span>
          <span>{actionToast.message}</span>
        </div>
      )}

      {/* Tactical Contextual Object HUD (Bottom Overlay) */}
      {selectedModule && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-3 sm:p-3.5 rounded-xl bg-[#0A1020]/95 border border-[#52D6FF]/40 backdrop-blur-md shadow-2xl text-xs z-20 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">
                {selectedModule === 'solar_array' ? '☀' :
                 selectedModule === 'habitat' ? '🏠' :
                 selectedModule === 'life_support' ? '🫁' :
                 selectedModule === 'greenhouse' ? '🌱' :
                 selectedModule === 'science_lab' ? '🔬' : '🚜'}
              </span>
              <div>
                <span className="font-display font-bold text-xs sm:text-sm text-[#52D6FF] block leading-tight">
                  {(language === 'bn' && modules[selectedModule].nameBn) ? modules[selectedModule].nameBn : modules[selectedModule].name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {language === 'bn' ? `লেভেল ${formatNum(modules[selectedModule].level)} মডিউল` : `Level ${modules[selectedModule].level} Module`}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedModule(null);
                setZoomLevel(1.0);
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 font-mono text-xs cursor-pointer"
              title="Close Panel"
            >
              ✕
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] mb-2.5 bg-[#101827]/80 p-2 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{language === 'bn' ? '⚡ লোড:' : '⚡ Load:'}</span>
              <span className="text-amber-400 font-bold">{formatNum(modules[selectedModule].powerDraw)} kW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{language === 'bn' ? '⚙️ কার্যক্ষমতা:' : '⚙️ Eff:'}</span>
              <span className="text-emerald-400 font-bold">{formatNum(Math.round(modules[selectedModule].efficiency * 100))}%</span>
            </div>
          </div>

          {/* Instant Tactical Action Buttons */}
          <div className="mb-2">
            {selectedModule === 'solar_array' && (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  showToast(
                    language === 'bn' ? 'প্যানেলের ধুলো পরিষ্কার! বিদ্যুৎ উৎপাদন ক্ষমতা বৃদ্ধি পেল' : 'DUST WIPED OFF ARRAYS • SOLAR OUTPUT RESTORED',
                    '🧹'
                  );
                  if (onPerformTacticalAction) onPerformTacticalAction('clean_dust', 'solar_array');
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>🧹</span>
                <span>{language === 'bn' ? 'ধুলো পরিষ্কার করুন (+২০% বিদ্যুৎ)' : 'CLEAN DUST DEPOSITS (+20% POWER)'}</span>
              </button>
            )}

            {selectedModule === 'greenhouse' && (
              <button
                type="button"
                onClick={() => {
                  if (resources.water < 5) {
                    sound.playWarning();
                    showToast(
                      language === 'bn' ? 'পর্যাপ্ত পানি নেই! (কমপক্ষে ৫ লিটার প্রয়োজন)' : 'INSUFFICIENT WATER RESERVES (MIN 5L)',
                      '⚠️'
                    );
                    return;
                  }
                  sound.playSuccess();
                  showToast(
                    language === 'bn' ? 'গাছে সেচ সম্পন্ন! ফলন বৃদ্ধি নিশ্চিত' : 'CROPS IRRIGATED • HYDROPONIC BIOMASS OPTIMIZED',
                    '💧'
                  );
                  if (onPerformTacticalAction) onPerformTacticalAction('irrigate', 'greenhouse');
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>💧</span>
                <span>{language === 'bn' ? 'ফসলে সেচ দিন (-৫ লিটার পানি)' : 'IRRIGATE BIODOME CROPS (-5L H2O)'}</span>
              </button>
            )}

            {selectedModule === 'life_support' && (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  showToast(
                    language === 'bn' ? 'ইসিএলএস স্ক্রাবার ও ফিল্টার মেরামত সম্পন্ন' : 'ECLSS O2 SCRUBBER & FILTERS SERVICED',
                    '🔧'
                  );
                  if (onPerformTacticalAction) onPerformTacticalAction('service_eclss', 'life_support');
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>🔧</span>
                <span>{language === 'bn' ? 'ইসিএলএস সার্ভিসিং করুন (১০০% কার্যক্ষমতা)' : 'SERVICE ECLSS SCRUBBERS (100% EFF)'}</span>
              </button>
            )}

            {selectedModule === 'science_lab' && (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  showToast(
                    language === 'bn' ? 'গ্রহের ভূতাত্ত্বিক বিশ্লেষণ সম্পন্ন (+১৫ বিজ্ঞান পয়েন্ট)' : 'SPECTRAL ANALYSIS COMPLETE (+15 SCIENCE PTS)',
                    '🔬'
                  );
                  if (onPerformTacticalAction) onPerformTacticalAction('science_experiment', 'science_lab');
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-400 hover:to-indigo-300 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>🔬</span>
                <span>{language === 'bn' ? 'রেগোলিথ বিশ্লেষণ চালান (+১৫ পয়েন্ট)' : 'RUN REGOLITH ANALYSIS (+15 PTS)'}</span>
              </button>
            )}

            {selectedModule === 'rover_garage' && onOpenRoverSortie && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenRoverSortie();
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>🚜</span>
                <span>{language === 'bn' ? 'রোভার সর্টি অভিযান শুরু করুন ↗' : 'LAUNCH ROVER SCIENCE SORTIE ↗'}</span>
              </button>
            )}

            {selectedModule === 'habitat' && onOpenCrew && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCrew();
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>👨‍🚀</span>
                <span>{language === 'bn' ? 'নভোচারীদের স্বাস্থ্য পরীক্ষা করুন ↗' : 'INSPECT CREW WELLBEING ↗'}</span>
              </button>
            )}
          </div>

          {/* Deep Science Progressive Disclosure Toggle */}
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowDeepFact(prev => !prev);
              }}
              className="text-[#52D6FF] hover:underline flex items-center gap-1 font-mono text-[10px] cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>{showDeepFact ? (language === 'bn' ? 'তথ্য লুকান' : 'Hide NASA Spec') : (language === 'bn' ? 'নাসা বৈজ্ঞানিক তথ্য ▾' : 'NASA Technical Spec ▾')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedModule(null);
                setZoomLevel(1.0);
              }}
              className="text-slate-400 hover:text-white font-mono text-[10px]"
            >
              {language === 'bn' ? 'ঘাঁটি ভিউ' : 'Reset View'}
            </button>
          </div>

          {showDeepFact && (
            <div className="mt-2 text-[10px] text-sky-200/90 italic border-l-2 border-[#52D6FF] pl-2 py-0.5 bg-slate-900/60 rounded-r animate-in fade-in duration-150">
              {modules[selectedModule].educationalFact}
            </div>
          )}
        </div>
      )}

      {/* Interactive Helper Hint */}
      {!selectedModule && (
        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-[#0A1020]/75 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-[#52D6FF]" />
          {t('canvas.hint')}
        </div>
      )}
    </div>
  );
};
