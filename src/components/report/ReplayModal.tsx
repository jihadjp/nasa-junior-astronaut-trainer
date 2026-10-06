// Mission Replay & "What If?" Decision Branching Comparator

import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { GitBranch, RotateCcw, X, Sparkles } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface ReplayModalProps {
  state: SimulationState;
  onBranchReplay: (branchDay: number) => void;
  onClose: () => void;
}

export const ReplayModal: React.FC<ReplayModalProps> = ({
  state,
  onBranchReplay,
  onClose
}) => {
  const { completedDecisions, scores } = state;
  const [selectedBranchDay, setSelectedBranchDay] = useState<number>(
    completedDecisions.length > 0 ? completedDecisions[0].day : 1
  );

  const handleStartBranch = () => {
    sound.playClick();
    onBranchReplay(selectedBranchDay);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1220] border border-purple-500/50 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              "WHAT IF?" DECISION BRANCHING
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Concept */}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
          Explore Alternate Engineering Outcomes
        </h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          In space systems engineering, every trade-off carries opportunity costs. Replay from a crucial decision fork to observe how alternative choices would have shifted life support buffers, crew wellbeing, and science milestones.
        </p>

        {/* First Run Benchmark Summary */}
        <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 mb-5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            ORIGINAL EXPEDITION BENCHMARK (RUN 1):
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
            <div className="p-2 rounded bg-[#060B18] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">WELLBEING</span>
              <span className="text-white font-bold">{Math.round(state.crewWellbeing)}%</span>
            </div>
            <div className="p-2 rounded bg-[#060B18] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SCIENCE</span>
              <span className="text-purple-400 font-bold">{state.sciencePoints} PTS</span>
            </div>
            <div className="p-2 rounded bg-[#060B18] border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SCORE</span>
              <span className="text-[#52D6FF] font-bold">{scores?.overallScore || 70} / 100</span>
            </div>
          </div>
        </div>

        {/* Select Branch Decision Point */}
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-2.5">
            SELECT DECISION BRANCH POINT:
          </span>

          {completedDecisions.length === 0 ? (
            <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800 text-xs text-slate-400 font-mono text-center">
              Replay from Mission Day 1 (Fresh Base Baseline)
            </div>
          ) : (
            <div className="space-y-2">
              {completedDecisions.map(d => (
                <button
                  key={d.day}
                  onClick={() => setSelectedBranchDay(d.day)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                    selectedBranchDay === d.day
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md'
                      : 'bg-[#060B18] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white mb-0.5">
                      Day {d.day}: {d.eventId.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Chosen: <span className="text-[#52D6FF]">{d.choiceLabel}</span>
                    </div>
                  </div>
                  <span className="text-purple-400 text-[11px] font-bold shrink-0">
                    {selectedBranchDay === d.day ? 'SELECTED FORK' : 'SELECT'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Educational Takeaway Preview */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200/90 mb-6 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Hypothesis to test:</strong> What if you conserved spare parts instead of rushing repairs? Or prioritized science over safety? Notice how short-term risk alters long-term resilience.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={handleStartBranch}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-display font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            FORK SIMULATION FROM DAY {selectedBranchDay}
          </button>
        </div>
      </div>
    </div>
  );
};
