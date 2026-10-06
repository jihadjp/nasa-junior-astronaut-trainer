// Interactive & Automated 60-Second Judging Demo Mode (Prompt Section 50)

import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface JudgingDemoModalProps {
  onClose: () => void;
  onLaunchFullGame: () => void;
}

interface DemoStep {
  step: number;
  title: string;
  badge: string;
  badgeColor: string;
  story: string;
  metricHighlight: string;
  icon: string;
  decisionTaken?: string;
  causalSummary?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Phase 1: Expedition Architecture (Moon vs Mars)',
    badge: 'MISSION SETUP',
    badgeColor: 'text-[#52D6FF] border-[#52D6FF]/40 bg-[#52D6FF]/10',
    story: 'Judges select destination. Moon presents hard vacuum with 14-day lunar nights; Mars introduces atmospheric dust and thin CO₂. The player selects a 4-astronaut crew with Commander, Engineer, Biologist, and Scientist specialties.',
    metricHighlight: 'Crew: 4 Astronauts | Daily Consumption: 3.36 kg O₂, 10 L H₂O, 5.6 kg Food',
    icon: '🚀'
  },
  {
    step: 2,
    title: 'Phase 2: Base Construction & Opportunity Cost',
    badge: 'PAYLOAD BUDGET',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    story: 'Before launch, player allocates 1,000 payload credits. Upgrading radiation shielding reduces crew cancer risk, but leaves fewer credits for hydroponic racks or spare parts.',
    metricHighlight: 'Engineering Trade-Off: Mass budget strictly caps simultaneous redundancy.',
    icon: '🏗️'
  },
  {
    step: 3,
    title: 'Mission Day 1: Telemetry Nominal',
    badge: 'ACTIVE OUTPOST',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    story: 'Base deployed on Chryse Planitia. Photovoltaic solar array generates 52 kW net. ECLSS water recovery achieves 95% loop closure. Plants in the hydroponic greenhouse begin photosynthesizing.',
    metricHighlight: 'O₂: 140 kg (Safe) | H₂O: 160 L (Safe) | Power: 75 kWh (Safe) | Morale: 95%',
    icon: '🛰️'
  },
  {
    step: 4,
    title: 'Mission Day 6: Electrical Shortage Dilemma',
    badge: 'EVENT CARD',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    story: 'Power grid load exceeds solar output. The player decides to shed the Astrobiology Laboratory to protect Life Support.',
    metricHighlight: 'Decision: Load Shedding (-10 kW load). Science output paused for 2 days.',
    decisionTaken: 'Shed Science Lab Power to protect ECLSS',
    causalSummary: 'Decision -> Power stabilized -> Science delayed -> Life support safe',
    icon: '⚡'
  },
  {
    step: 5,
    title: 'Mission Day 12: Atmospheric Dust Storm',
    badge: 'CRISIS',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    story: 'High-velocity Martian dust obscures sunlight, dropping photovoltaic generation by 60%. The Engineer is deployed on an EVA to clear the array using electrostatic wipers.',
    metricHighlight: 'Cost: 6 Spare Parts used, Engineer Fatigue (+15% stress). Power restored.',
    decisionTaken: 'Deploy Engineer EVA with electrostatic wipers',
    causalSummary: 'Solar arrays cleared -> Battery drain halted -> Spare parts depleted',
    icon: '🌪️'
  },
  {
    step: 6,
    title: 'Mission Day 18: Coronal Mass Ejection (Solar Flare)',
    badge: 'RADIATION EVENT',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    story: 'Deep space sensors detect relativistic protons. The crew retreats into the regolith radiation vault surrounded by water bladder jackets, absorbing only 1.2 mSv.',
    metricHighlight: 'Shielding Attenuation: 92% dose blocked. Crew DNA cellular health protected.',
    decisionTaken: 'Retreat crew into regolith vault',
    causalSummary: 'Crew quarantined -> Water absorbs protons -> Zero radiation sickness',
    icon: '☀️'
  },
  {
    step: 7,
    title: 'Mission Day 24: Recovery & Rover Water Discovery',
    badge: 'SCIENCE MILESTONE',
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    story: 'With systems stabilized, the rover drills into crater permafrost, returning +15 Liters of water and +35 Science discovery points.',
    metricHighlight: 'Science Points: 115 PTS | Water Tanks Replenished | Crew Morale 92%',
    decisionTaken: 'Rover core sampling sortie dispatched',
    causalSummary: 'Cores extracted -> +15L water ice -> +35 science points',
    icon: '🚜'
  },
  {
    step: 8,
    title: 'Mission Day 30: Mission Debrief & Scoring',
    badge: 'FINAL REPORT',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    story: 'The crew completes the 30-day expedition. Comprehensive debrief evaluates Survival (88%), Efficiency (82%), Science (78%), Resilience (84%), and Learning (90%). Overall Score: 84 / 100 [MISSION VETERAN].',
    metricHighlight: 'Result: Full expedition survived through adaptive engineering trade-offs!',
    icon: '🏆'
  }
];

export const JudgingDemoModal: React.FC<JudgingDemoModalProps> = ({
  onClose,
  onLaunchFullGame
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleNext = () => {
    sound.playClick();
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      onLaunchFullGame();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1324] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              JUDGING DEMO SHOWCASE (60 SECONDS)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-slate-400">
            SHOWCASE MILESTONE <strong className="text-white">{currentStep.step}</strong> OF {DEMO_STEPS.length}
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${currentStep.badgeColor}`}>
            {currentStep.badge}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-[#3B82F6] to-[#52D6FF] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep.step / DEMO_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Card Body */}
        <div className="p-5 rounded-2xl bg-[#101B30] border border-slate-800 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A1020] border border-[#52D6FF]/30 flex items-center justify-center text-2xl shrink-0">
              {currentStep.icon}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-1">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStep.story}
              </p>
            </div>
          </div>

          {/* Metric Highlight Box */}
          <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 font-mono text-xs text-sky-300 mb-3 flex items-start gap-2">
            <span className="text-[#52D6FF] font-bold shrink-0">KEY TELEMETRY:</span>
            <span>{currentStep.metricHighlight}</span>
          </div>

          {/* Causal Chain Callout if decision was taken */}
          {currentStep.decisionTaken && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-200">
              <span className="text-amber-400 font-bold block mb-0.5">
                ↳ CAUSAL STORYTELLING FLOW:
              </span>
              <span>{currentStep.causalSummary}</span>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            PREVIOUS STEP
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchFullGame}
              className="px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all hidden sm:block"
            >
              SKIP TO PLAYABLE GAME
            </button>

            <button
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              {currentStepIdx === DEMO_STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> PLAY FULL SIMULATION
                </>
              ) : (
                <>
                  NEXT STEP <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
