// Route /mission/simulation & /mission/event/:eventId : Game-First Core Simulation Experience
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { TopHUD } from '../components/mission/TopHUD';
import { OutpostCanvas } from '../components/mission/OutpostCanvas';
import { ResourceHUD } from '../components/mission/ResourceHUD';
import { CrewHUD } from '../components/mission/CrewHUD';
import { CommanderTelemetry } from '../components/mission/CommanderTelemetry';
import { ResourceDetailModal, type ResourceDetailData } from '../components/mission/ResourceDetailModal';
import type { ModuleType } from '../types/game';

// In-Game Overlays & Tactical Modals
import { DecisionModal } from '../components/events/DecisionModal';
import { CausalChainModal } from '../components/events/CausalChainModal';
import { EmergencyAbortModal } from '../components/mission/EmergencyAbortModal';
import { EducationalModal } from '../components/events/EducationalModal';
import { AidaCompanion } from '../components/ai/AidaCompanion';
import { GAME_EVENTS } from '../events/eventDatabase';
import { sound } from '../sound/audioEngine';
import { NasaDataSourceModal } from '../components/nasa/NasaDataSourceModal';
import { NasaTerrainExplorerModal } from '../components/nasa/NasaTerrainExplorerModal';
import { RoverSortieModal } from '../components/mission/RoverSortieModal';

import { 
  StepForward, 
  Play, 
  Pause, 
  FastForward, 
  Activity, 
  MapPin, 
  Satellite, 
  BarChart2, 
  Wind, 
  Droplets, 
  Zap, 
  Apple, 
  Shield 
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const { formatNum, language } = useLanguage();

  const [showNasaDataModal, setShowNasaDataModal] = useState(false);
  const [showTerrainModal, setShowTerrainModal] = useState(false);
  const [showRoverSortieModal, setShowRoverSortieModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [selectedResourceDetail, setSelectedResourceDetail] = useState<ResourceDetailData | null>(null);

  const {
    gameState,
    setGameState,
    stepDays,
    handleDecisionChoice,
    handleToggleMode,
    handleAbortToReport,
    handleAbortToSetup,
    educationalWhyId,
    setEducationalWhyId,
    showAbortModal,
    setShowAbortModal,
    eventModalVisible
  } = useMission();

  // Support direct route deep-linking to /mission/event/:eventId
  useEffect(() => {
    if (eventId) {
      const isCompleted = gameState.completedDecisions.some(d => d.eventId === eventId);
      if (isCompleted) {
        navigate('/mission/simulation', { replace: true });
        return;
      }
      if (!gameState.activeEvent) {
        const matched = GAME_EVENTS.find(e => e.id === eventId);
        if (matched) {
          setGameState(prev => ({ ...prev, activeEvent: matched, isPaused: true }));
        } else {
          navigate('/mission/simulation', { replace: true });
        }
      }
    }
  }, [eventId, gameState.activeEvent, gameState.completedDecisions, navigate, setGameState]);

  const handleApplyRoverRewards = (rewards: { water?: number; power?: number; sciencePts?: number; spares?: number }) => {
    setGameState(prev => {
      const nextRes = { ...prev.resources };
      if (rewards.water) nextRes.water = Math.min(nextRes.waterMax, nextRes.water + rewards.water);
      if (rewards.power) nextRes.power = Math.min(nextRes.powerMax, nextRes.power + rewards.power);
      if (rewards.spares) nextRes.spareParts = Math.min(100, nextRes.spareParts + rewards.spares);
      return {
        ...prev,
        resources: nextRes,
        sciencePoints: prev.sciencePoints + (rewards.sciencePts || 0)
      };
    });
  };

  const handlePerformTacticalAction = (action: string, _moduleId: ModuleType) => {
    setGameState(prev => {
      const nextModules = { ...prev.modules };
      const nextResources = { ...prev.resources };
      let nextScience = prev.sciencePoints;
      const nextEnv = { ...prev.environment };

      if (action === 'clean_dust') {
        nextModules.solar_array = {
          ...nextModules.solar_array,
          efficiency: Math.min(1.0, nextModules.solar_array.efficiency + 0.2)
        };
        nextEnv.dustLevel = Math.max(0, nextEnv.dustLevel - 20);
      } else if (action === 'irrigate') {
        if (nextResources.water >= 5) {
          nextResources.water -= 5;
          nextModules.greenhouse = {
            ...nextModules.greenhouse,
            efficiency: 1.0
          };
        }
      } else if (action === 'service_eclss') {
        nextModules.life_support = {
          ...nextModules.life_support,
          efficiency: 1.0
        };
      } else if (action === 'science_experiment') {
        nextScience += 15;
      }

      return {
        ...prev,
        modules: nextModules,
        resources: nextResources,
        environment: nextEnv,
        sciencePoints: nextScience
      };
    });
  };

  const getResourceDetailData = (resKey: string): ResourceDetailData | null => {
    const { resources, deltas } = gameState;
    const isBn = language === 'bn';

    switch (resKey) {
      case 'oxygen':
        return {
          id: 'oxygen',
          name: isBn ? 'অক্সিজেন (O₂)' : 'OXYGEN (O₂)',
          icon: Wind,
          iconColor: 'text-[#52D6FF]',
          current: resources.oxygen,
          max: resources.oxygenMax,
          unit: isBn ? 'কেজি' : 'kg',
          pct: Math.round((resources.oxygen / resources.oxygenMax) * 100),
          delta: deltas.oxygen,
          deltaUnit: isBn ? 'কেজি/দিন' : 'kg/d',
          isCritical: resources.oxygen < 20,
          isWarning: resources.oxygen < 40,
          statusLabel: resources.oxygen < 20 ? (isBn ? 'সংকটজনক' : 'CRITICAL') : resources.oxygen < 40 ? (isBn ? 'সতর্কতা' : 'WARNING') : (isBn ? 'স্বাভাবিক' : 'NOMINAL'),
          statusColor: resources.oxygen < 20 ? 'text-rose-400 border-rose-500/50 bg-rose-950/50' : resources.oxygen < 40 ? 'text-amber-400 border-amber-500/50 bg-amber-950/50' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          whyText: isBn
            ? 'বেঁচে থাকার জন্য নভোচারীদের অবিরাম বিশুদ্ধ অক্সিজেন দরকার। চাঁদে বা মঙ্গলে মুক্ত বাতাস নেই, তাই ইলেক্ট্রোলাইসিস ও উদ্ভিদের সাহায্যে বাতাস প্রস্তুত করা হয়।'
            : 'Human biology requires a continuous supply of oxygen for cellular respiration. Electrolysis systems (MOXIE) and living plants replenish the habitat air.',
          warningText: isBn
            ? 'অক্সিজেন কমে গেলে নভোচারীরা শ্বাসকষ্ট, মাথাঘোরা ও শারীরিক ক্লান্তিতে আক্রান্ত হন।'
            : 'Low oxygen triggers hypoxia, cognitive impairment, and critical crew health emergencies.',
          educationalWhyId: 'systems_engineering_redundancy'
        };
      case 'water':
        return {
          id: 'water',
          name: isBn ? 'পানি (H₂O)' : 'WATER (H₂O)',
          icon: Droplets,
          iconColor: 'text-blue-400',
          current: resources.water,
          max: resources.waterMax,
          unit: isBn ? 'লিটার' : 'L',
          pct: Math.round((resources.water / resources.waterMax) * 100),
          delta: deltas.water,
          deltaUnit: isBn ? 'লি/দিন' : 'L/d',
          isCritical: resources.water < 20,
          isWarning: resources.water < 40,
          statusLabel: resources.water < 20 ? (isBn ? 'সংকটজনক' : 'CRITICAL') : resources.water < 40 ? (isBn ? 'সতর্কতা' : 'WARNING') : (isBn ? 'স্বাভাবিক' : 'NOMINAL'),
          statusColor: resources.water < 20 ? 'text-rose-400 border-rose-500/50 bg-rose-950/50' : resources.water < 40 ? 'text-amber-400 border-amber-500/50 bg-amber-950/50' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          whyText: isBn
            ? 'প্রতিটি মহাকাশচারীর দৈনিক পান করা, খাবার রান্না এবং পরিচ্ছন্নতার জন্য পানি লাগে। এছাড়া গ্রিনহাউসের গাছে সেচ দিতে পানি অপরিহার্য।'
            : 'Astronauts need at least 2.5 L daily for drinking, rehydrating meals, and hygiene. Space habitats recycle up to 98% of humidity and wastewater.',
          warningText: isBn
            ? 'পানি কমে গেলে নভোচারীদের ডিহাইড্রেশন হয় এবং গ্রিনহাউসে ফসলের ফলন বন্ধ হয়ে যায়।'
            : 'Water shortages cause severe crew dehydration, morale collapse, and greenhouse irrigation failure.',
          educationalWhyId: 'closed_loop_water'
        };
      case 'power':
        return {
          id: 'power',
          name: isBn ? 'বিদ্যুৎ শক্তি' : 'ELECTRICAL POWER',
          icon: Zap,
          iconColor: 'text-amber-400',
          current: resources.power,
          max: resources.powerMax,
          unit: 'kWh',
          pct: Math.round((resources.power / resources.powerMax) * 100),
          delta: deltas.powerNet,
          deltaUnit: 'kW',
          isCritical: resources.power < 15,
          isWarning: resources.power < 35,
          statusLabel: resources.power < 15 ? (isBn ? 'সংকটজনক' : 'CRITICAL') : resources.power < 35 ? (isBn ? 'সতর্কতা' : 'WARNING') : (isBn ? 'স্বাভাবিক' : 'NOMINAL'),
          statusColor: resources.power < 15 ? 'text-rose-400 border-rose-500/50 bg-rose-950/50' : resources.power < 35 ? 'text-amber-400 border-amber-500/50 bg-amber-950/50' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          whyText: isBn
            ? 'ঘাঁটির লাইফ-সাপোর্ট, অক্সিজেন মেকার, হিটার ও কম্পিউটার চালানোর চালিকাশক্তি হলো বিদ্যুৎ। সৌর প্যানেল বিদ্যুৎ বানিয়ে ব্যাটারিতে জমা রাখে।'
            : 'Solar arrays capture photons to power life-support scrubbers, thermal heaters, and computers. Batteries store power through extreme orbital nights.',
          warningText: isBn
            ? 'বিদ্যুৎ ফুরিয়ে গেলে পুরো ঘাঁটি বরফশীতল হয়ে যাবে (-১৩০°C) এবং লাইফ-সাপোর্ট বন্ধ হয়ে যাবে।'
            : 'Total blackout causes thermal freezing (-130°C on Moon), life-support shutdown, and telemetry loss.',
          educationalWhyId: 'lunar_night_battery'
        };
      case 'food':
        return {
          id: 'food',
          name: isBn ? 'খাবার ও পুষ্টি' : 'FOOD & NUTRITION',
          icon: Apple,
          iconColor: 'text-emerald-400',
          current: resources.food,
          max: resources.foodMax,
          unit: isBn ? 'কেজি' : 'kg',
          pct: Math.round((resources.food / resources.foodMax) * 100),
          delta: deltas.food,
          deltaUnit: isBn ? 'কেজি/দিন' : 'kg/d',
          isCritical: resources.food < 20,
          isWarning: resources.food < 40,
          statusLabel: resources.food < 20 ? (isBn ? 'সংকটজনক' : 'CRITICAL') : resources.food < 40 ? (isBn ? 'সতর্কতা' : 'WARNING') : (isBn ? 'স্বাভাবিক' : 'NOMINAL'),
          statusColor: resources.food < 20 ? 'text-rose-400 border-rose-500/50 bg-rose-950/50' : resources.food < 40 ? 'text-amber-400 border-amber-500/50 bg-amber-950/50' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          whyText: isBn
            ? 'শারীরিক শক্তি ও রোগ প্রতিরোধ ক্ষমতার জন্য সুষম পুষ্টি দরকার। পৃথিবী থেকে আনা রেশনের পাশাপাশি বায়ো-গ্রিনহাউসে তাজা শাকসবজি উৎপাদন করা হয়।'
            : 'Deep space missions require caloric nutrition and vitamins. Hydroponic greenhouses cultivate fresh vegetables to supplement stored Earth rations.',
          warningText: isBn
            ? 'খাবার কমে গেলে নভোচারীরা দুর্বল হয়ে পড়বেন এবং বৈজ্ঞানিক অভিযান ও মেরামত করার শক্তি হারাবেন।'
            : 'Caloric starvation rapidly degrades astronaut stamina, immune resistance, and mission performance.',
          educationalWhyId: 'systems_engineering_redundancy'
        };
      case 'shielding':
        return {
          id: 'shielding',
          name: isBn ? 'বিকিরণ সুরক্ষা প্রাচীর' : 'RADIATION SHIELDING',
          icon: Shield,
          iconColor: 'text-purple-400',
          current: Math.round(resources.shielding),
          max: 100,
          unit: '%',
          pct: Math.round(resources.shielding),
          delta: -deltas.radiationDose,
          deltaUnit: 'mSv/d',
          isCritical: resources.shielding < 30,
          isWarning: resources.shielding < 50,
          statusLabel: resources.shielding < 30 ? (isBn ? 'সংকটজনক' : 'CRITICAL') : resources.shielding < 50 ? (isBn ? 'সতর্কতা' : 'WARNING') : (isBn ? 'স্বাভাবিক' : 'NOMINAL'),
          statusColor: resources.shielding < 30 ? 'text-rose-400 border-rose-500/50 bg-rose-950/50' : resources.shielding < 50 ? 'text-amber-400 border-amber-500/50 bg-amber-950/50' : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/50',
          whyText: isBn
            ? 'চাঁদ ও মঙ্গলে বায়ুমণ্ডল না থাকায় মহাজাগতিক রশ্মি ও তীব্র সৌরঝড় সরাসরি আসে। চাঁদের মাটির (রেগোলিথ) পুরু স্তর এই ক্ষতিকর বিকিরণ আটকে দেয়।'
            : 'The Moon and Mars lack Earth\'s protective magnetosphere. Cosmic rays and solar proton events penetrate unshielded modules, damaging DNA.',
          warningText: isBn
            ? 'সুরক্ষা প্রাচীর দুর্বল হলে বিপজ্জনক বিকিরণ শরীরে প্রবেশ করে মারাত্মক অসুস্থতা তৈরি করে।'
            : 'Unshielded exposure causes acute radiation sickness, cellular breakdown, and cognitive deterioration.',
          educationalWhyId: 'radiation_shielding_physics'
        };
      default:
        return null;
    }
  };

  const hasCriticalCrew = gameState.crew.some(c => c.status === 'Critical' || c.status === 'Hypoxic');
  const hasTiredCrew = gameState.crew.some(c => c.status === 'Tired' || c.status === 'Radiation Alert');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#050914] text-[#F5F7FA] font-sans relative selection:bg-[#52D6FF]/30">
      {/* 1. Specialized Game Top HUD */}
      <TopHUD
        state={gameState}
        onToggleMode={handleToggleMode}
        onAbortMission={() => setShowAbortModal(true)}
        onSelectResource={(resKey) => {
          sound.playClick();
          const detail = getResourceDetailData(resKey);
          if (detail) setSelectedResourceDetail(detail);
        }}
      />

      <main className="max-w-7xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-3 flex-1 flex flex-col gap-2.5 sm:gap-3">
        {/* 2. Hero Animated Planetary Outpost Simulation */}
        <OutpostCanvas
          state={gameState}
          onInspectModule={() => {
            sound.playClick();
          }}
          onOpenTerrainExplorer={() => setShowTerrainModal(true)}
          onOpenRoverSortie={() => setShowRoverSortieModal(true)}
          onOpenCrew={() => setShowCrewModal(true)}
          onPerformTacticalAction={handlePerformTacticalAction}
        />

        {/* 3. Docked Bottom Tactical Command Bar */}
        <div className="w-full bg-[#0A1020]/95 border border-slate-800/90 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2 select-none">
          
          {/* TIME CONTROLS CLUSTER */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Advance +1 Day (Hero Glow Action) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                stepDays(1);
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] hover:from-[#38bdf8] hover:to-[#2563eb] text-slate-950 shadow-lg shadow-[#00D4FF]/25 flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 cursor-pointer min-h-[38px]"
              title={language === 'bn' ? '১ দিন এগিয়ে যান' : 'Advance 1 Mission Day'}
            >
              <StepForward className="w-4 h-4 fill-current shrink-0" />
              <span>{language === 'bn' ? '+১ দিন' : '+1 DAY'}</span>
              <span className="hidden md:inline">{language === 'bn' ? 'এগিয়ে যান' : 'ADVANCE'}</span>
            </button>

            {/* Quick Multi-Day: +3 Days */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                stepDays(3);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono font-medium bg-[#131F37] hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 flex items-center gap-1 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? '৩ দিন এগিয়ে যান' : 'Advance 3 Days'}
            >
              <StepForward className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'bn' ? '+৩ দিন' : '+3 DAYS'}</span>
            </button>

            {/* Auto-Run / Pause Clock Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
              }}
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all border min-h-[38px] cursor-pointer ${
                gameState.isPaused
                  ? 'bg-[#131F37] hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500/50 text-emerald-400'
                  : 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/30 animate-pulse'
              }`}
              title={gameState.isPaused ? (language === 'bn' ? 'অটোরান শুরু করুন' : 'Start Auto-Run') : (language === 'bn' ? 'বিরতি দিন' : 'Pause Simulation')}
            >
              {gameState.isPaused ? <Play className="w-3.5 h-3.5 fill-current shrink-0" /> : <Pause className="w-3.5 h-3.5 fill-current shrink-0" />}
              <span className="hidden sm:inline">{gameState.isPaused ? (language === 'bn' ? 'অটোরান' : 'AUTO-RUN') : (language === 'bn' ? 'বিরতি' : 'PAUSE')}</span>
            </button>

            {/* Speed Toggle (1x vs 3x) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setGameState(prev => ({ ...prev, speed: prev.speed === 1 ? 3 : 1 }));
              }}
              className={`px-2.5 py-2 rounded-xl text-xs font-mono font-bold border flex items-center justify-center gap-1 transition-all min-h-[38px] cursor-pointer ${
                gameState.speed === 3
                  ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF]'
                  : 'bg-[#131F37] border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Simulation Speed"
            >
              <FastForward className="w-3.5 h-3.5 shrink-0" />
              <span>{formatNum(gameState.speed)}x</span>
            </button>
          </div>

          {/* TACTICAL SYSTEMS & DRAWERS CLUSTER */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* CREW BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowCrewModal(true);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-[#52D6FF]/40 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? 'নভোচারীদের অবস্থা' : 'Crew Status & Wellbeing'}
            >
              <span className="text-sm">👨‍🚀</span>
              <span>{language === 'bn' ? 'ক্রু' : 'CREW'}</span>
              <span className={`w-2 h-2 rounded-full ${
                hasCriticalCrew ? 'bg-rose-500 animate-pulse' : hasTiredCrew ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
            </button>

            {/* ROVER SORTIE BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowRoverSortieModal(true);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? 'রোভার বিজ্ঞান অভিযান' : 'Autonomous Rover Sortie'}
            >
              <span className="text-sm">🚜</span>
              <span>{language === 'bn' ? 'রোভার' : 'ROVER'}</span>
            </button>

            {/* COMMANDER TELEMETRY (if Commander mode) */}
            {gameState.mode === 'commander' && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowTelemetryModal(true);
                }}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-[#52D6FF] text-xs font-mono font-bold flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer"
                title={language === 'bn' ? 'ইসিএলএস সাবসিস্টেম টেলিমেট্রি' : 'ECLSS Subsystems Telemetry'}
              >
                <Activity className="w-3.5 h-3.5 text-[#52D6FF]" />
                <span className="hidden xs:inline">{language === 'bn' ? 'টেলিমেট্রি' : 'TELEMETRY'}</span>
              </button>
            )}

            {/* ALL VITALS OVERVIEW BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowResourcesModal(true);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? 'সব রিসোর্স মেট্রিক্স' : 'All Resources Matrix'}
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xs:inline">{language === 'bn' ? 'রিসোর্স' : 'VITALS'}</span>
            </button>

            {/* NASA TERRAIN BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowTerrainModal(true);
              }}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? 'নাসা আসল ভূখণ্ড প্রোফাইল' : 'NASA Real Terrain Profile'}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{language === 'bn' ? 'ভূখণ্ড' : 'TERRAIN'}</span>
            </button>

            {/* NASA DATA SOURCE BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowNasaDataModal(true);
              }}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#131F37] hover:bg-slate-800 border border-slate-700 hover:border-sky-500/40 text-sky-300 text-xs font-mono font-bold flex items-center gap-1 transition-all min-h-[38px] cursor-pointer"
              title={language === 'bn' ? 'নাসা আসল ডেটাসেট' : 'NASA Data Provenance'}
            >
              <Satellite className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{language === 'bn' ? 'নাসা' : 'NASA'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* --- IN-GAME OVERLAYS & MODALS (Keeps active game aesthetic) --- */}

      {/* AI Flight Assistant Companion (AIDA) */}
      <AidaCompanion state={gameState} />

      {/* Decision Card Modal: In-game tactical choice overlay */}
      {gameState.activeEvent && eventModalVisible && (
        <DecisionModal
          event={gameState.activeEvent}
          onSelectChoice={handleDecisionChoice}
          onOpenWhy={(whyId) => setEducationalWhyId(whyId)}
        />
      )}

      {/* Causal Chain Storytelling Playback */}
      {gameState.lastCausalChain && (
        <CausalChainModal
          chain={gameState.lastCausalChain}
          onDismiss={() => {
            sound.playClick();
            setGameState(prev => ({ ...prev, activeEvent: null, lastCausalChain: null, isPaused: true }));
            if (eventId) {
              navigate('/mission/simulation', { replace: true });
            }
          }}
        />
      )}

      {/* Emergency Abort Confirmation Modal */}
      <EmergencyAbortModal
        isOpen={showAbortModal}
        onClose={() => setShowAbortModal(false)}
        onConfirmAbortToReport={handleAbortToReport}
        onConfirmAbortToSetup={handleAbortToSetup}
      />

      {/* STEM "Why did this happen?" Educational Modal */}
      {educationalWhyId && (
        <EducationalModal
          whyId={educationalWhyId}
          onClose={() => setEducationalWhyId(null)}
        />
      )}

      {/* Level 2 Resource Detail Dossier Modal (When clicking Top HUD chips) */}
      <ResourceDetailModal
        data={selectedResourceDetail}
        onClose={() => setSelectedResourceDetail(null)}
        onOpenEducationalWhy={(whyId) => setEducationalWhyId(whyId)}
      />

      {/* Floating Tactical Crew Modal */}
      {showCrewModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCrewModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0F172A] border border-[#52D6FF]/40 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-display font-bold text-base">
                <span>👨‍🚀</span>
                <span>{language === 'bn' ? 'নভোচারীদের স্বাস্থ্য ও দায়িত্ব' : 'CREW ROSTER & HEALTH TELEMETRY'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCrewModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <CrewHUD state={gameState} />
          </div>
        </div>
      )}

      {/* Floating Commander Telemetry Modal */}
      {showTelemetryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowTelemetryModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0F172A] border border-amber-500/40 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-base">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>{language === 'bn' ? 'ইসিএলএস সাবসিস্টেম ও শক্তি বিশ্লেষণ' : 'COMMANDER ECLSS TELEMETRY MATRIX'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTelemetryModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <CommanderTelemetry state={gameState} />
          </div>
        </div>
      )}

      {/* Floating All Resources Overview Modal */}
      {showResourcesModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowResourcesModal(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-display font-bold text-base">
                <BarChart2 className="w-5 h-5 text-[#52D6FF]" />
                <span>{language === 'bn' ? 'ঘাঁটির ৬টি মূল রিসোর্স ড্যাশবোর্ড' : 'EXPEDITION LIFE SUPPORT VITALS'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResourcesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <ResourceHUD 
              state={gameState} 
              onOpenEducationalWhy={(whyId) => {
                setShowResourcesModal(false);
                setEducationalWhyId(whyId);
              }}
            />
          </div>
        </div>
      )}

      {/* NASA Planetary Terrain & Data Modals */}
      {gameState.landingSite && (
        <>
          <NasaTerrainExplorerModal
            site={gameState.landingSite}
            isOpen={showTerrainModal}
            onClose={() => setShowTerrainModal(false)}
            onOpenSourceDetails={() => {
              setShowTerrainModal(false);
              setShowNasaDataModal(true);
            }}
          />
          <NasaDataSourceModal
            dataset={gameState.landingSite.nasaDataset}
            isOpen={showNasaDataModal}
            onClose={() => setShowNasaDataModal(false)}
          />
          <RoverSortieModal
            state={gameState}
            isOpen={showRoverSortieModal}
            onClose={() => setShowRoverSortieModal(false)}
            onApplyRewards={handleApplyRoverRewards}
          />
        </>
      )}
    </div>
  );
};
