// OUTPOST: Junior Astronaut Mission Trainer - Master Multi-Screen Application
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MissionProvider, useMission } from './context/MissionContext';

// Pages
import { HomePage } from './pages/HomePage';
import { LocationPage } from './pages/LocationPage';
import { SetupPage } from './pages/SetupPage';
import { BriefingPage } from './pages/BriefingPage';
import { SimulationPage } from './pages/SimulationPage';
import { ReportPage } from './pages/ReportPage';
import { ReplayPage } from './pages/ReplayPage';
import { LearnPage } from './pages/LearnPage';
import { TeacherPage } from './pages/TeacherPage';
import { SettingsPage } from './pages/SettingsPage';

// Global Modals
import { EducationalModal } from './components/events/EducationalModal';
import { JudgingDemoModal } from './components/demo/JudgingDemoModal';
import { AchievementsModal } from './components/achievements/AchievementsModal';
import { SourcesModal } from './components/layout/SourcesModal';
import { GuidedTutorial } from './components/tutorial/GuidedTutorial';

// Global Overlays Component (consumes MissionContext)
const GlobalOverlays: React.FC = () => {
  const {
    educationalWhyId,
    setEducationalWhyId,
    showDemoModal,
    setShowDemoModal,
    showAchievementsModal,
    setShowAchievementsModal,
    showSourcesModal,
    setShowSourcesModal,
    showTutorialModal,
    setShowTutorialModal,
    gameState,
    handleStartSetup
  } = useMission();

  return (
    <>
      {/* Educational Deep Science Modal */}
      {educationalWhyId && (
        <EducationalModal
          whyId={educationalWhyId}
          onClose={() => setEducationalWhyId(null)}
        />
      )}

      {/* 60-Second Judging Demo Walkthrough */}
      {showDemoModal && (
        <JudgingDemoModal
          onClose={() => setShowDemoModal(false)}
          onLaunchFullGame={() => {
            setShowDemoModal(false);
            handleStartSetup('moon');
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
            handleStartSetup('moon');
          }}
        />
      )}
    </>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <MissionProvider>
        <Routes>
          {/* 1. Home / Landing */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Mission Location Selection */}
          <Route path="/mission" element={<LocationPage />} />

          {/* 3. Crew + Base + Difficulty Setup */}
          <Route path="/mission/setup" element={<SetupPage />} />

          {/* 4. Mission Briefing */}
          <Route path="/mission/briefing" element={<BriefingPage />} />

          {/* 5. Main Interactive Mission Simulation */}
          <Route path="/mission/simulation" element={<SimulationPage />} />

          {/* 6. Emergency / Decision Event Route (Deep-Linking) */}
          <Route path="/mission/event/:eventId" element={<SimulationPage />} />

          {/* 7. Mission Complete / Failed Report */}
          <Route path="/mission/report" element={<ReportPage />} />

          {/* 8. Mission Replay / Analysis */}
          <Route path="/mission/replay" element={<ReplayPage />} />

          {/* 9. Science & Learning Academy */}
          <Route path="/learn" element={<LearnPage />} />

          {/* 10. Teacher Mode & Curriculum Portal */}
          <Route path="/teacher" element={<TeacherPage />} />

          {/* 11. Settings & Audio / Accessibility */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Modal Layer */}
        <GlobalOverlays />
      </MissionProvider>
    </BrowserRouter>
  );
}

export default App;
