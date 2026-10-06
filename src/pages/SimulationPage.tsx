// Route /mission/simulation & /mission/event/:eventId : Interactive Core Game Simulator
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMission } from '../context/MissionContext';
import { TopHUD } from '../components/mission/TopHUD';
import { OutpostCanvas } from '../components/mission/OutpostCanvas';
import { ResourceHUD } from '../components/mission/ResourceHUD';
import { CrewHUD } from '../components/mission/CrewHUD';
import { TimeControls } from '../components/mission/TimeControls';
import { CommanderTelemetry } from '../components/mission/CommanderTelemetry';

// In-Game Overlays
import { DecisionModal } from '../components/events/DecisionModal';
import { CausalChainModal } from '../components/events/CausalChainModal';
import { EmergencyAbortModal } from '../components/mission/EmergencyAbortModal';
import { EducationalModal } from '../components/events/EducationalModal';
import { GAME_EVENTS } from '../events/eventDatabase';
import { sound } from '../sound/audioEngine';

export const SimulationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();

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
    setShowTeacherModal,
    setShowAchievementsModal,
    setShowDemoModal,
    eventModalVisible
  } = useMission();

  // Support direct route deep-linking to /mission/event/:eventId
  useEffect(() => {
    if (eventId && !gameState.activeEvent) {
      const matched = GAME_EVENTS.find(e => e.id === eventId);
      if (matched) {
        setGameState(prev => ({ ...prev, activeEvent: matched, isPaused: true }));
      }
    }
  }, [eventId, gameState.activeEvent, setGameState]);

  // Sync event route when event triggers during active simulation
  useEffect(() => {
    if (gameState.activeEvent && !eventId) {
      navigate(`/mission/event/${gameState.activeEvent.id}`, { replace: true });
    }
  }, [gameState.activeEvent, eventId, navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#050914] text-[#F5F7FA] font-sans relative selection:bg-[#52D6FF]/30">
      {/* 1. Specialized Game Top HUD */}
      <TopHUD
        state={gameState}
        onToggleMode={handleToggleMode}
        onOpenTeacher={() => setShowTeacherModal(true)}
        onOpenAchievements={() => setShowAchievementsModal(true)}
        onOpenDemo={() => setShowDemoModal(true)}
        onAbortMission={() => setShowAbortModal(true)}
      />

      <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1 flex flex-col gap-4">
        {/* 2. Main Animated Outpost Canvas Centerpiece with live physics loops */}
        <OutpostCanvas
          state={gameState}
          onInspectModule={() => {
            sound.playClick();
          }}
        />

        {/* 3. Six Core Resources HUD with Progressive Disclosure */}
        <ResourceHUD 
          state={gameState} 
          onOpenEducationalWhy={(whyId) => setEducationalWhyId(whyId)}
        />

        {/* 4. Time Controls with Turn-Based Stepping and Emergency Abort */}
        <TimeControls
          isPaused={gameState.isPaused}
          speed={gameState.speed}
          onTogglePause={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          onStepDays={(days) => stepDays(days)}
          onToggleSpeed={() => setGameState(prev => ({ ...prev, speed: prev.speed === 1 ? 3 : 1 }))}
          onAbortMission={() => setShowAbortModal(true)}
        />

        {/* 5. Crew Wellbeing & Astronaut Cards */}
        <CrewHUD state={gameState} />

        {/* 6. Mission Commander Deep Telemetry (when in Commander mode) */}
        {gameState.mode === 'commander' && (
          <CommanderTelemetry state={gameState} />
        )}
      </main>

      {/* --- IN-GAME OVERLAYS & MODALS (Keeps active game aesthetic) --- */}

      {/* Decision Card Modal: In-game cinematic overlay */}
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
            setGameState(prev => ({ ...prev, lastCausalChain: null, isPaused: true }));
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
    </div>
  );
};
