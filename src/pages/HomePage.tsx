// Route / : Cinematic Entrance & Landing Screen
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHero } from '../components/landing/LandingHero';
import { useMission } from '../context/MissionContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    hasSavedMission,
    handleStartSetup,
    handleToggleMode,
    setShowDemoModal,
    setShowSourcesModal,
    setShowTutorialModal
  } = useMission();

  return (
    <div className="w-full min-h-screen bg-[#050914] flex flex-col justify-between">
      <LandingHero
        hasSavedMission={hasSavedMission}
        savedMissionDay={gameState.missionDay}
        onResumeMission={() => navigate('/mission/simulation')}
        onStartMission={(dest = 'moon') => {
          handleStartSetup(dest);
          navigate('/mission');
        }}
        onStartDemo={() => setShowDemoModal(true)}
        onOpenAcademy={() => navigate('/learn')}
        onOpenTeacher={() => navigate('/teacher')}
        onOpenSources={() => setShowSourcesModal(true)}
        onOpenTutorial={() => setShowTutorialModal(true)}
        onOpenSettings={() => navigate('/settings')}
        onToggleCommanderMode={(dest = 'moon') => {
          handleToggleMode();
          handleStartSetup(dest);
          navigate('/mission');
        }}
      />
    </div>
  );
};
