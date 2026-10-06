// Time and Simulation Speed Controls

import React from 'react';
import { Play, Pause, StepForward, FastForward, RotateCcw } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface TimeControlsProps {
  isPaused: boolean;
  speed: 1 | 3;
  onTogglePause: () => void;
  onStepDays: (days: number) => void;
  onToggleSpeed: () => void;
  onRestartMission: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  isPaused,
  speed,
  onTogglePause,
  onStepDays,
  onToggleSpeed,
  onRestartMission
}) => {
  const handlePause = () => {
    sound.playClick();
    onTogglePause();
  };

  const handleStep = (days: number) => {
    sound.playClick();
    onStepDays(days);
  };

  const handleSpeed = () => {
    sound.playClick();
    onToggleSpeed();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#101827]/90 border border-slate-800 backdrop-blur-md">
      {/* Primary Simulation Clock Controls */}
      <div className="flex items-center gap-2">
        {/* Play / Pause Button */}
        <button
          onClick={handlePause}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
            isPaused
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>

        {/* Step 1 Day */}
        <button
          onClick={() => handleStep(1)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#0A1020] hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
          title="Simulate 1 Day forward"
        >
          <StepForward className="w-3.5 h-3.5" />
          +1 DAY
        </button>

        {/* Step 3 Days */}
        <button
          onClick={() => handleStep(3)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#0A1020] hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all hidden sm:flex"
          title="Simulate 3 Days forward"
        >
          <StepForward className="w-3.5 h-3.5" />
          +3 DAYS
        </button>

        {/* Speed Toggle (1x vs 3x) */}
        <button
          onClick={handleSpeed}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 transition-all ${
            speed === 3
              ? 'bg-[#52D6FF]/20 border-[#52D6FF] text-[#52D6FF]'
              : 'bg-[#0A1020] border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Simulation Speed"
        >
          <FastForward className="w-3.5 h-3.5" />
          {speed}x SPEED
        </button>
      </div>

      {/* Auxiliary: Restart / Abort */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestartMission}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 flex items-center gap-1.5 transition-all"
          title="Abort and reconfigure mission"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">RECONFIG MISSION</span>
        </button>
      </div>
    </div>
  );
};
