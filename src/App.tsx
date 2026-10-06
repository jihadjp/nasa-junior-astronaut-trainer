// OUTPOST: Junior Astronaut Mission Trainer - Master Application

import { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  SimulationState, 
  DestinationType, 
  MissionDuration, 
  GameMode, 
  MissionPhase, 
  BaseModule, 
  ModuleType, 
  DecisionChoice 
} from './types/game';
import { createInitialSimulationState, stepSimulationDay } from './simulation/engine';

// UI Components
import { TopHUD } from './components/mission/TopHUD';
import { OutpostCanvas } from './components/mission/OutpostCanvas';
import { ResourceHUD } from './components/mission/ResourceHUD';
import { CrewHUD } from './components/mission/CrewHUD';
import { TimeControls } from './components/mission/TimeControls';
import { CommanderTelemetry } from './components/mission/CommanderTelemetry';

// Setup Flow
import { LandingHero } from './components/landing/LandingHero';
import { DestinationSelector } from './components/setup/DestinationSelector';
import { CrewSelector } from './components/setup/CrewSelector';
import { BaseBuilder } from './components/setup/BaseBuilder';

// Modals & Overlays
import { DecisionModal } from './components/events/DecisionModal';
import { CausalChainModal } from './components/events/CausalChainModal';
import { EducationalModal } from './components/events/EducationalModal';
import { MissionReportModal } from './components/report/MissionReportModal';
import { ReplayModal } from './components/report/ReplayModal';
import { JudgingDemoModal } from './components/demo/JudgingDemoModal';
import { TeacherModeModal } from './components/teacher/TeacherModeModal';
import { AchievementsModal } from './components/achievements/AchievementsModal';
import { SourcesModal } from './components/layout/SourcesModal';
import { GuidedTutorial } from './components/tutorial/GuidedTutorial';

import { sound } from './sound/audioEngine';
import { Volume2, VolumeX } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'outpost_save_v1';

export function App() {
  // Navigation & Phases
  const [phase, setPhase] = useState<MissionPhase>('landing');
  const [setupStep, setSetupStep] = useState<'destination' | 'crew' | 'base'>('destination');
  
  // Setup configuration state
  const [destConfig, setDestConfig] = useState<DestinationType>('moon');
  const [crewCountConfig, setCrewCountConfig] = useState<number>(4);
  const [durationConfig, setDurationConfig] = useState<MissionDuration>(30);
  const [modeConfig, setModeConfig] = useState<GameMode>('junior');

  // Active Simulation State
  const [gameState, setGameState] = useState<SimulationState>(() => {
    // Check localStorage for saved mission
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.missionDay && parsed.resources) {
          return parsed;
        }
      } catch {}
    }
    return createInitialSimulationState('moon', 30, 'junior', 4);
  });

  // Modals visibility
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [educationalWhyId, setEducationalWhyId] = useState<string | null>(null);
  const [showReplayModal, setShowReplayModal] = useState<boolean>(false);

  // Sound Muted state
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(sound.getIsMuted());

  // Auto-step tick interval for simulation loop
  const timerRef = useRef<number | null>(null);

  // Keyboard navigation & accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' && phase === 'active' && !gameState.activeEvent) {
        e.preventDefault();
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      } else if (e.key === 'Escape') {
        setShowDemoModal(false);
        setShowTeacherModal(false);
        setShowAchievementsModal(false);
        setShowSourcesModal(false);
        setShowTutorialModal(false);
        setShowReplayModal(false);
        setEducationalWhyId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, gameState.activeEvent]);

  // Persist game state to localStorage
  useEffect(() => {
    if (phase === 'active' || phase === 'report') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
      } catch {}
    }
  }, [gameState, phase]);

  // Simulation step function
  const stepDays = useCallback((days: number) => {
    setGameState(prev => {
      let state = prev;
      for (let i = 0; i < days; i++) {
        if (state.missionStatus !== 'ongoing' || state.activeEvent) break;
        state = stepSimulationDay(state);
      }
      // Check if finished
      if (state.missionStatus !== 'ongoing') {
        setPhase('report');
      }
      return state;
    });
  }, []);

  // Timer loop when active and unpaused
  useEffect(() => {
    if (phase === 'active' && !gameState.isPaused && !gameState.activeEvent && gameState.missionStatus === 'ongoing') {
      const intervalMs = gameState.speed === 3 ? 1200 : 2600;
      timerRef.current = window.setInterval(() => {
        stepDays(1);
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, gameState.isPaused, gameState.activeEvent, gameState.speed, gameState.missionStatus, stepDays]);

  // Handle Event Decision Selection
  const handleDecisionChoice = (choice: DecisionChoice) => {
    setGameState(prev => {
      if (!prev.activeEvent) return prev;
      sound.playClick();

      // Apply decision impacts
      const modified = choice.applyChoice(prev);
      const decisionLog = {
        day: prev.missionDay,
        eventId: prev.activeEvent.id,
        choiceId: choice.id,
        choiceLabel: choice.label
      };

      return {
        ...modified,
        activeEvent: null,
        lastCausalChain: choice.causalChain,
        completedDecisions: [...prev.completedDecisions, decisionLog],
        isPaused: true // Keep paused during causal storytelling review
      };
    });
  };

  // Start new game setup
  const handleStartSetup = () => {
    setPhase('setup');
    setSetupStep('destination');
  };

  // Base construction finalized -> start Day 1
  const handleFinishBase = (modules: Record<ModuleType, BaseModule>, customBudget: { extraSpares: number; extraFood: number }) => {
    const freshState = createInitialSimulationState(destConfig, durationConfig, modeConfig, crewCountConfig);
    freshState.modules = modules;
    freshState.resources.spareParts += customBudget.extraSpares;
    freshState.resources.food += customBudget.extraFood;

    setGameState(freshState);
    setPhase('active');
    sound.startAmbient();
  };

  // Toggle Junior vs Commander mode
  const handleToggleMode = () => {
    sound.playClick();
    const nextMode = gameState.mode === 'junior' ? 'commander' : 'junior';
    setGameState(prev => ({ ...prev, mode: nextMode }));
    setModeConfig(nextMode);
  };

  // Replay from branch day
  const handleBranchReplay = (branchDay: number) => {
    setShowReplayModal(false);
    // Find timeline entry
    const entry = gameState.timeline.find(t => t.day === branchDay);
    if (!entry) {
      setGameState(createInitialSimulationState(gameState.destination, gameState.totalDays, gameState.mode, gameState.crew.length));
    } else {
      setGameState(prev => ({
        ...prev,
        missionDay: branchDay,
        resources: {
          ...prev.resources,
          oxygen: entry.oxygen,
          water: entry.water,
          power: entry.power,
          food: entry.food
        },
        missionStatus: 'ongoing',
        activeEvent: null,
        lastCausalChain: null,
        isPaused: false
      }));
    }
    setPhase('active');
  };

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const isNowMuted = !sound.toggleMute();
    setIsSoundMuted(isNowMuted);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-[#F5F7FA] font-sans flex flex-col relative selection:bg-[#52D6FF]/30">
      {/* Floating Audio & Accessibility HUD Control */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-full bg-[#101827]/90 border border-slate-700 hover:border-[#52D6FF]/50 text-slate-300 hover:text-white shadow-xl backdrop-blur-md transition-all"
          title={isSoundMuted ? 'Unmute Sound Synthesizer' : 'Mute Sound Synthesizer'}
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#52D6FF]" />}
        </button>
      </div>

      {/* PHASE 1: LANDING PAGE */}
      {phase === 'landing' && (
        <LandingHero
          onStartMission={handleStartSetup}
          onStartDemo={() => setShowDemoModal(true)}
          onOpenTeacher={() => setShowTeacherModal(true)}
          onOpenSources={() => setShowSourcesModal(true)}
          onToggleCommanderMode={() => {
            handleToggleMode();
            handleStartSetup();
          }}
        />
      )}

      {/* PHASE 2: MISSION SETUP */}
      {phase === 'setup' && (
        <div className="min-h-screen bg-[#050914] flex flex-col justify-between py-6">
          {setupStep === 'destination' && (
            <DestinationSelector
              selected={destConfig}
              onSelect={setDestConfig}
              onNext={() => setSetupStep('crew')}
            />
          )}

          {setupStep === 'crew' && (
            <CrewSelector
              crewCount={crewCountConfig}
              onSetCrewCount={setCrewCountConfig}
              onNext={() => setSetupStep('base')}
              onBack={() => setSetupStep('destination')}
            />
          )}

          {setupStep === 'base' && (
            <BaseBuilder
              onCompleteBase={handleFinishBase}
              onBack={() => setSetupStep('crew')}
            />
          )}
        </div>
      )}

      {/* PHASE 3: ACTIVE GAMEPLAY LOOP */}
      {(phase === 'active' || phase === 'report') && (
        <div className="flex-1 flex flex-col min-h-screen bg-[#050914]">
          {/* Top HUD */}
          <TopHUD
            state={gameState}
            onToggleMode={handleToggleMode}
            onOpenTeacher={() => setShowTeacherModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onOpenDemo={() => setShowDemoModal(true)}
          />

          <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1 flex flex-col gap-4">
            {/* 1. Main Animated Outpost Canvas Centerpiece */}
            <OutpostCanvas
              state={gameState}
              onInspectModule={() => {
                sound.playClick();
              }}
            />

            {/* 2. Six Core Resources HUD */}
            <ResourceHUD state={gameState} />

            {/* 3. Time & Speed Controls */}
            <TimeControls
              isPaused={gameState.isPaused}
              speed={gameState.speed}
              onTogglePause={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
              onStepDays={(days) => stepDays(days)}
              onToggleSpeed={() => setGameState(prev => ({ ...prev, speed: prev.speed === 1 ? 3 : 1 }))}
              onRestartMission={() => {
                if (confirm('Reconfigure mission architecture and return to setup?')) {
                  setPhase('setup');
                  setSetupStep('destination');
                }
              }}
            />

            {/* 4. Crew Wellbeing & Astronaut Cards */}
            <CrewHUD state={gameState} />

            {/* 5. Mission Commander Deep Telemetry (when in Commander mode) */}
            {gameState.mode === 'commander' && (
              <CommanderTelemetry state={gameState} />
            )}
          </main>
        </div>
      )}

      {/* OVERLAY MODALS */}

      {/* Decision Card Modal */}
      {gameState.activeEvent && (
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
            setGameState(prev => ({ ...prev, lastCausalChain: null, isPaused: false }));
          }}
        />
      )}

      {/* STEM "Why did this happen?" Educational Modal */}
      {educationalWhyId && (
        <EducationalModal
          whyId={educationalWhyId}
          onClose={() => setEducationalWhyId(null)}
        />
      )}

      {/* Mission Debrief & Evaluation Report Modal */}
      {phase === 'report' && (
        <MissionReportModal
          state={gameState}
          onReplayBranch={() => setShowReplayModal(true)}
          onNewMission={handleStartSetup}
        />
      )}

      {/* What If? Replay Modal */}
      {showReplayModal && (
        <ReplayModal
          state={gameState}
          onBranchReplay={handleBranchReplay}
          onClose={() => setShowReplayModal(false)}
        />
      )}

      {/* 60-Second Judging Demo Walkthrough */}
      {showDemoModal && (
        <JudgingDemoModal
          onClose={() => setShowDemoModal(false)}
          onLaunchFullGame={() => {
            setShowDemoModal(false);
            handleStartSetup();
          }}
        />
      )}

      {/* Teacher Mode & Curriculum Portal */}
      {showTeacherModal && (
        <TeacherModeModal
          onClose={() => setShowTeacherModal(false)}
          onLaunchScenario={(dest, duration) => {
            setShowTeacherModal(false);
            setDestConfig(dest);
            setDurationConfig(duration);
            const state = createInitialSimulationState(dest, duration, 'junior', 4);
            setGameState(state);
            setPhase('active');
          }}
        />
      )}

      {/* In-game Achievements Modal */}
      {showAchievementsModal && (
        <AchievementsModal
          unlockedIds={gameState.unlockedAchievements}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {/* NASA Sources & Scientific Citations Modal */}
      {showSourcesModal && (
        <SourcesModal
          onClose={() => setShowSourcesModal(false)}
        />
      )}

      {/* Guided Tutorial Onboarding */}
      {showTutorialModal && (
        <GuidedTutorial
          onClose={() => setShowTutorialModal(false)}
          onFinishTutorial={() => {
            setShowTutorialModal(false);
            handleStartSetup();
          }}
        />
      )}
    </div>
  );
}

export default App;
