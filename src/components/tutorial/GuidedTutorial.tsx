// Interactive Onboarding Guided Tutorial (<2 minutes)

import React, { useState } from 'react';
import { Compass, Users, Wrench, Zap, GitCommit, ChevronRight, Check, X } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface GuidedTutorialProps {
  onClose: () => void;
  onFinishTutorial: () => void;
}

interface TutorialSlide {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'Welcome, Junior Flight Director!',
    category: 'STEP 1 OF 5 // MISSION BRIEFING',
    description: 'You are now in command of a permanent lunar or Martian research outpost. Your job is not to build a huge base, but to keep your astronauts alive while discovering new science.',
    icon: <Compass className="w-6 h-6 text-[#52D6FF]" />,
    tips: [
      'The Moon has extreme vacuum and 14-day nights.',
      'Mars has intense dust storms that block solar panels.',
      'Every crew member requires oxygen, water, and food daily.'
    ]
  },
  {
    title: 'The Golden Rule: Opportunity Costs',
    category: 'STEP 2 OF 5 // LAUNCH BUDGET',
    description: 'Rockets have strictly finite mass. You cannot build maximum levels of everything.',
    icon: <Wrench className="w-6 h-6 text-amber-400" />,
    tips: [
      'More radiation shielding protects crew DNA, but leaves less budget for hydroponics.',
      'More spare parts safeguard against breakdowns, but reduce launch food rations.',
      'Plan a balanced base architecture before touching down.'
    ]
  },
  {
    title: 'Interconnected Life Support Loops',
    category: 'STEP 3 OF 5 // SYSTEMS COUPLING',
    description: 'Subsystems in space do not operate in silos. Power, water, oxygen, and food interact constantly.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    tips: [
      'Solar panels charge batteries, which power the water distillation pumps.',
      'Water feeds both astronaut hydration and oxygen electrolysis cells.',
      'Greenhouse plants consume exhaled CO₂ and produce fresh food + oxygen.'
    ]
  },
  {
    title: 'Decision Cards & Causal Storytelling',
    category: 'STEP 4 OF 5 // ENGINEERING CRISES',
    description: 'When dust storms, solar flares, or equipment failures strike, the game pauses for your command directive.',
    icon: <GitCommit className="w-6 h-6 text-purple-400" />,
    tips: [
      'Every choice reveals immediate effects AND trade-offs.',
      'After each decision, observe the Causal Chain to see how your choice altered the mission.',
      'Click "[ Why did this happen? ]" to read real NASA physics.'
    ]
  },
  {
    title: 'Ready for Touchdown!',
    category: 'STEP 5 OF 5 // EXPEDITION COMMENCEMENT',
    description: 'Toggle between friendly Junior Mode and deep Mission Commander Mode at any time in the top HUD.',
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    tips: [
      'Step day-by-day or fast-forward simulation time with Time Controls.',
      'Survive the full 30 days to receive your NASA Mission Evaluation debrief.',
      'Use the "What If?" Replay tool to test alternative decisions.'
    ]
  }
];

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  onClose,
  onFinishTutorial
}) => {
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const slide = TUTORIAL_SLIDES[slideIdx];

  const handleNext = () => {
    sound.playClick();
    if (slideIdx < TUTORIAL_SLIDES.length - 1) {
      setSlideIdx(prev => prev + 1);
    } else {
      onFinishTutorial();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (slideIdx > 0) {
      setSlideIdx(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0B1324] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#52D6FF]">
              {slide.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-1.5 mb-6">
          {TUTORIAL_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === slideIdx
                  ? 'w-8 bg-[#52D6FF]'
                  : idx < slideIdx
                  ? 'w-4 bg-blue-600'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="p-4 rounded-xl bg-[#10192D] border border-slate-800 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#060B18] border border-slate-700 flex items-center justify-center shrink-0">
              {slide.icon}
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              {slide.title}
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {slide.description}
          </p>

          <div className="space-y-2 bg-[#060B18] p-3 rounded-lg border border-slate-800/80">
            {slide.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                <span className="text-[#52D6FF] font-bold">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Nav */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={slideIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            PREVIOUS
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all hidden sm:block"
            >
              SKIP TUTORIAL
            </button>
            <button
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              {slideIdx === TUTORIAL_SLIDES.length - 1 ? (
                <>
                  <Check className="w-4 h-4" /> START EXPEDITION
                </>
              ) : (
                <>
                  NEXT <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
