// Mission State & Simulation Lifecycle Context
// Preserves entire outpost telemetry, configurations, and decisions across all routes

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { 
  SimulationState, 
  DestinationType, 
  MissionDuration, 
  GameMode, 
  BaseModule, 
  ModuleType, 
  DecisionChoice 
} from '../types/game';
import { createInitialSimulationState, stepSimulationDay } from '../simulation/engine';
import { GAME_EVENTS } from '../events/eventDatabase';
import { sound } from '../sound/audioEngine';
import { useLanguage } from '../i18n/LanguageContext';

export const LOCAL_STORAGE_KEY = 'outpost_save_v1';

// Helper to safely load and re-hydrate stored simulation state
function loadSavedGameState(): SimulationState {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.missionDay && parsed.resources) {
        // Re-hydrate activeEvent with real functions from GAME_EVENTS (JSON drops functions)
        if (parsed.activeEvent?.id) {
          const realEvent = GAME_EVENTS.find(e => e.id === parsed.activeEvent.id);
          parsed.activeEvent = realEvent || null;
        } else {
          parsed.activeEvent = null;
        }

        if (!Array.isArray(parsed.lastCausalChain)) {
          parsed.lastCausalChain = null;
        }

        // Always ensure simulation starts paused on load
        parsed.isPaused = true;

        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved mission state:', e);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    }
  }
  return createInitialSimulationState('moon', 30, 'junior', 4);
}

export interface MissionContextValue {
  gameState: SimulationState;
  setGameState: React.Dispatch<React.SetStateAction<SimulationState>>;
  destConfig: DestinationType;
  setDestConfig: (dest: DestinationType) => void;
  crewCountConfig: number;
  setCrewCountConfig: (n: number) => void;
  durationConfig: MissionDuration;
  setDurationConfig: (d: MissionDuration) => void;
  modeConfig: GameMode;
  setModeConfig: (m: GameMode) => void;
  isSoundMuted: boolean;
  stepDays: (days: number) => void;
  handleDecisionChoice: (choice: DecisionChoice) => void;
  handleStartSetup: (dest?: DestinationType) => void;
  handleFinishBase: (modules: Record<ModuleType, BaseModule>, customBudget: { extraSpares: number; extraFood: number }) => void;
  handleToggleMode: () => void;
  handleBranchReplay: (branchDay: number) => void;
  handleAbortToReport: () => void;
  handleAbortToSetup: () => void;
  handleToggleMute: () => void;
  educationalWhyId: string | null;
  setEducationalWhyId: (id: string | null) => void;
  showDemoModal: boolean;
  setShowDemoModal: (v: boolean) => void;
  showTeacherModal: boolean;
  setShowTeacherModal: (v: boolean) => void;
  showAchievementsModal: boolean;
  setShowAchievementsModal: (v: boolean) => void;
  showSourcesModal: boolean;
  setShowSourcesModal: (v: boolean) => void;
  showTutorialModal: boolean;
  setShowTutorialModal: (v: boolean) => void;
  showAbortModal: boolean;
  setShowAbortModal: (v: boolean) => void;
  showReplayModal: boolean;
  setShowReplayModal: (v: boolean) => void;
  eventModalVisible: boolean;
  setEventModalVisible: (v: boolean) => void;
  launchScenario: (dest: DestinationType, duration: MissionDuration) => void;
  clearSaveData: () => void;
  hasSavedMission: boolean;
}

const MissionContext = createContext<MissionContextValue | null>(null);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Setup configuration state
  const [destConfig, setDestConfig] = useState<DestinationType>('moon');
  const [crewCountConfig, setCrewCountConfig] = useState<number>(4);
  const [durationConfig, setDurationConfig] = useState<MissionDuration>(30);
  const [modeConfig, setModeConfig] = useState<GameMode>('junior');

  // Active Simulation State with function re-hydration
  const [gameState, setGameState] = useState<SimulationState>(() => loadSavedGameState());

  // Modals visibility
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [showTeacherModal, setShowTeacherModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [educationalWhyId, setEducationalWhyId] = useState<string | null>(null);
  const [showReplayModal, setShowReplayModal] = useState<boolean>(false);
  const [showAbortModal, setShowAbortModal] = useState<boolean>(false);
  const [eventModalVisible, setEventModalVisible] = useState<boolean>(false);

  // Sound Muted state
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(sound.getIsMuted());

  // Auto-step tick interval for simulation loop
  const timerRef = useRef<number | null>(null);

  const isSimulationRoute = location.pathname.startsWith('/mission/simulation') || location.pathname.startsWith('/mission/event');

  // Cinematic Event Staging: Trigger event popup when in simulation route
  useEffect(() => {
    if (isSimulationRoute && gameState.activeEvent) {
      sound.playEvent();
      const timer = setTimeout(() => {
        setEventModalVisible(true);
      }, 750);
      return () => clearTimeout(timer);
    } else {
      setEventModalVisible(false);
    }
  }, [isSimulationRoute, gameState.activeEvent]);

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
        navigate('/mission/report');
      }
      return state;
    });
  }, [navigate]);

  // Keyboard navigation & accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' && isSimulationRoute && !gameState.activeEvent) {
        e.preventDefault();
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      } else if ((e.key === 'd' || e.key === 'D') && isSimulationRoute && !gameState.activeEvent) {
        e.preventDefault();
        stepDays(1);
      } else if (e.key === 'Escape') {
        setShowAbortModal(false);
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
  }, [isSimulationRoute, gameState.activeEvent, stepDays]);

  // Persist game state to localStorage
  useEffect(() => {
    if (gameState.missionDay > 1 || gameState.missionStatus !== 'ongoing') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
      } catch {}
    }
  }, [gameState]);

  // Timer loop when active and unpaused on simulation route
  useEffect(() => {
    if (isSimulationRoute && !gameState.isPaused && !gameState.activeEvent && gameState.missionStatus === 'ongoing') {
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
  }, [isSimulationRoute, gameState.isPaused, gameState.activeEvent, gameState.speed, gameState.missionStatus, stepDays]);

  // Handle Event Decision Selection
  const handleDecisionChoice = (choice: DecisionChoice) => {
    setGameState(prev => {
      if (!prev.activeEvent) return prev;
      sound.playClick();

      // Find authoritative event and choice from GAME_EVENTS to guarantee applyChoice exists
      const realEvent = GAME_EVENTS.find(e => e.id === prev.activeEvent?.id);
      const realChoice = realEvent?.choices.find(c => c.id === choice.id) || choice;

      // Apply decision impacts safely
      let modified = prev;
      if (typeof realChoice.applyChoice === 'function') {
        try {
          modified = realChoice.applyChoice(prev);
        } catch (err) {
          console.error('Error applying choice:', err);
        }
      } else if (typeof choice.applyChoice === 'function') {
        try {
          modified = choice.applyChoice(prev);
        } catch (err) {
          console.error('Error applying fallback choice:', err);
        }
      }

      const decisionLog = {
        day: prev.missionDay,
        eventId: prev.activeEvent.id,
        choiceId: realChoice.id,
        choiceLabel: (language === 'bn' && realChoice.labelBn) ? realChoice.labelBn : realChoice.label
      };

      return {
        ...modified,
        activeEvent: null,
        lastCausalChain: realChoice.causalChain || null,
        completedDecisions: [...prev.completedDecisions, decisionLog],
        isPaused: true
      };
    });

    // If on /mission/event/:eventId, return to simulation screen
    if (location.pathname.startsWith('/mission/event')) {
      navigate('/mission/simulation');
    }
  };

  // Start fresh game setup
  const handleStartSetup = (dest: DestinationType = 'moon') => {
    setDestConfig(dest);
    navigate('/mission');
  };

  // Base construction finalized -> start Day 1 in PAUSED mode
  const handleFinishBase = (modules: Record<ModuleType, BaseModule>, customBudget: { extraSpares: number; extraFood: number }) => {
    const freshState = createInitialSimulationState(destConfig, durationConfig, modeConfig, crewCountConfig);
    freshState.modules = modules;
    freshState.resources.spareParts += customBudget.extraSpares;
    freshState.resources.food += customBudget.extraFood;
    freshState.isPaused = true;

    setGameState(freshState);
    navigate('/mission/briefing');
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
        isPaused: true
      }));
    }
    navigate('/mission/simulation');
  };

  // Emergency Abort Handlers
  const handleAbortToReport = () => {
    setShowAbortModal(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setGameState(prev => ({
      ...prev,
      missionStatus: 'failed',
      failureReason: language === 'bn'
        ? 'ফ্লাইট ডিরেক্টর জরুরি আদেশে অভিযান বাতিল করেছেন।'
        : 'Expedition manually aborted by Flight Director emergency override.',
      isPaused: true,
      activeEvent: null,
      lastCausalChain: null
    }));
    navigate('/mission/report');
  };

  const handleAbortToSetup = () => {
    setShowAbortModal(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setGameState(createInitialSimulationState('moon', 30, 'junior', 4));
    navigate('/mission');
  };

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const isNowMuted = !sound.toggleMute();
    setIsSoundMuted(isNowMuted);
  };

  // Clear saved mission data
  const clearSaveData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setGameState(createInitialSimulationState('moon', 30, 'junior', 4));
  };

  // Launch a pre-configured scenario (Teacher / Demo)
  const launchScenario = (dest: DestinationType, duration: MissionDuration) => {
    setDestConfig(dest);
    setDurationConfig(duration);
    const state = createInitialSimulationState(dest, duration, 'junior', 4);
    setGameState(state);
    navigate('/mission/briefing');
  };

  const hasSavedMission = gameState.missionDay > 1 && gameState.missionStatus === 'ongoing';

  return (
    <MissionContext.Provider
      value={{
        gameState,
        setGameState,
        destConfig,
        setDestConfig,
        crewCountConfig,
        setCrewCountConfig,
        durationConfig,
        setDurationConfig,
        modeConfig,
        setModeConfig,
        isSoundMuted,
        stepDays,
        handleDecisionChoice,
        handleStartSetup,
        handleFinishBase,
        handleToggleMode,
        handleBranchReplay,
        handleAbortToReport,
        handleAbortToSetup,
        handleToggleMute,
        educationalWhyId,
        setEducationalWhyId,
        showDemoModal,
        setShowDemoModal,
        showTeacherModal,
        setShowTeacherModal,
        showAchievementsModal,
        setShowAchievementsModal,
        showSourcesModal,
        setShowSourcesModal,
        showTutorialModal,
        setShowTutorialModal,
        showAbortModal,
        setShowAbortModal,
        showReplayModal,
        setShowReplayModal,
        eventModalVisible,
        setEventModalVisible,
        launchScenario,
        clearSaveData,
        hasSavedMission
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}
