// Interactive Onboarding Guided Tutorial (<2 minutes)

import React, { useState } from 'react';
import { Compass, Users, Wrench, Zap, GitCommit, ChevronRight, Check, X } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface GuidedTutorialProps {
  onClose: () => void;
  onFinishTutorial: () => void;
}

interface TutorialSlide {
  title: string;
  titleBn?: string;
  category: string;
  categoryBn?: string;
  description: string;
  descriptionBn?: string;
  icon: React.ReactNode;
  tips: string[];
  tipsBn?: string[];
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'Welcome, Junior Flight Director!',
    titleBn: 'স্বাগতম, জুনিয়র ফ্লাইট ডিরেক্টর!',
    category: 'STEP 1 OF 5 // MISSION BRIEFING',
    categoryBn: 'ধাপ ১ / ৫ // মিশনের প্রারম্ভিক ব্রিফিং',
    description: 'You are now in command of a permanent lunar or Martian research outpost. Your job is not to build a huge base, but to keep your astronauts alive while discovering new science.',
    descriptionBn: 'চাঁদ বা মঙ্গল গ্রহের স্থায়ী গবেষণা ঘাঁটি পরিচালনার দায়িত্ব এখন তোমার হাতে। তোমার মূল কাজ কেবল ঘাঁটি বানানো নয়, নভোচারীদের বাঁচিয়ে রেখে নতুন বৈজ্ঞানিক তথ্য আবিষ্কার করা!',
    icon: <Compass className="w-6 h-6 text-[#52D6FF]" />,
    tips: [
      'The Moon has extreme vacuum and 14-day nights.',
      'Mars has intense dust storms that block solar panels.',
      'Every crew member requires oxygen, water, and food daily.'
    ],
    tipsBn: [
      'চাঁদে চরম বায়ুশূন্যতা এবং ১৪ দিনের দীর্ঘ অন্ধকার রাত থাকে।',
      'মঙ্গলে তীব্র ধূলিঝড় সৌর প্যানেলের বিদ্যুৎ উৎপাদন প্রায় বন্ধ করে দেয়।',
      'প্রতিটি মহাকাশচারীর দৈনিক শ্বাসযোগ্য অক্সিজেন, পানি ও খাবার প্রয়োজন।'
    ]
  },
  {
    title: 'The Golden Rule: Opportunity Costs',
    titleBn: 'সোনালী নিয়ম: সুযোগ-ব্যয় (Opportunity Cost)',
    category: 'STEP 2 OF 5 // LAUNCH BUDGET',
    categoryBn: 'ধাপ ২ / ৫ // রকেট উৎক্ষেপণ বাজেট',
    description: 'Rockets have strictly finite mass. You cannot build maximum levels of everything.',
    descriptionBn: 'পৃথিবী থেকে রকেটে করে অসীম ওজনের জিনিস পাঠানো সম্ভব নয়। তাই সব কিছু একসাথে সর্বোচ্চ স্তরে বাড়ানো যাবে না।',
    icon: <Wrench className="w-6 h-6 text-amber-400" />,
    tips: [
      'More radiation shielding protects crew DNA, but leaves less budget for hydroponics.',
      'More spare parts safeguard against breakdowns, but reduce launch food rations.',
      'Plan a balanced base architecture before touching down.'
    ],
    tipsBn: [
      'বেশি রেডিয়েশন শিল্ডিং নভোচারীদের রক্ষা করে, তবে গ্রিনহাউসের বাজেট কমিয়ে দেয়।',
      'বেশি খুচরা যন্ত্রাংশ নিলে জরুরি পরিস্থিতিতে সুবিধা হয়, কিন্তু খাবারের মজুত কমে যায়।',
      'ঘাঁটি নামানোর আগেই একটি সুষম ও ভারসাম্যপূর্ণ প্রকৌশল পরিকল্পনা তৈরি করো।'
    ]
  },
  {
    title: 'Interconnected Life Support Loops',
    titleBn: 'পরস্পর সংযুক্ত লাইফ সাপোর্ট লুপ',
    category: 'STEP 3 OF 5 // SYSTEMS COUPLING',
    categoryBn: 'ধাপ ৩ / ৫ // উপ-ব্যবস্থার চেইন নির্ভরতা',
    description: 'Subsystems in space do not operate in silos. Power, water, oxygen, and food interact constantly.',
    descriptionBn: 'মহাকাশের কোনো ব্যবস্থাপনাই আলাদাভাবে কাজ করতে পারে না। বিদ্যুৎ, পানি, অক্সিজেন ও খাবার সবসময় একে অপরের সাথে যুক্ত।',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    tips: [
      'Solar panels charge batteries, which power the water distillation pumps.',
      'Water feeds both astronaut hydration and oxygen electrolysis cells.',
      'Greenhouse plants consume exhaled CO₂ and produce fresh food + oxygen.'
    ],
    tipsBn: [
      'সৌর প্যানেল ব্যাটারি চার্জ করে, যা পানি রিসাইক্লিং ডিস্টিলেশন পাম্প চালায়।',
      'পানি দিয়ে যেমন নভোচারীদের তৃষ্ণা মেটে, তেমনই ইলেক্ট্রোলাইসিসের মাধ্যমে খাঁটি অক্সিজেন তৈরি হয়।',
      'গ্রিনহাউসের গাছপালা শ্বাস ফেলা CO₂ গ্রহণ করে এবং তাজা খাবার ও অক্সিজেন উপহার দেয়।'
    ]
  },
  {
    title: 'Decision Cards & Causal Storytelling',
    titleBn: 'সিদ্ধান্ত কার্ড ও কারণ-ফলাফল গল্প',
    category: 'STEP 4 OF 5 // ENGINEERING CRISES',
    categoryBn: 'ধাপ ৪ / ৫ // প্রকৌশল সংকট সমাধান',
    description: 'When dust storms, solar flares, or equipment failures strike, the game pauses for your command directive.',
    descriptionBn: 'ধূলিঝড়, সৌর শিখা বা যান্ত্রিক ত্রুটি ঘটলে গেমটি সাময়িকভাবে থেমে তোমার সরাসরি আদেশের জন্য অপেক্ষা করবে।',
    icon: <GitCommit className="w-6 h-6 text-purple-400" />,
    tips: [
      'Every choice reveals immediate effects AND trade-offs.',
      'After each decision, observe the Causal Chain to see how your choice altered the mission.',
      'Click "[ Why did this happen? ]" to read real NASA physics.'
    ],
    tipsBn: [
      'প্রতিটি সিদ্ধান্তের সাথে এর তাৎক্ষণিক ফল এবং দীর্ঘমেয়াদী প্রভাব স্পষ্ট লেখা থাকে।',
      'সিদ্ধান্ত নেওয়ার পর "কারণ ও ফলাফল চেইন" দেখে বোঝো তোমার সিদ্ধান্তের প্রভাব ঘাঁটিতে কীভাবে ছড়াল।',
      'নাসার আসল পদার্থবিজ্ঞান ও প্রযুক্তি জানতে "[ এটা কেন হলো? ]" বাটনে চাপ দাও।'
    ]
  },
  {
    title: 'Ready for Touchdown!',
    titleBn: 'ঘাঁটিতে নামার জন্য প্রস্তুত!',
    category: 'STEP 5 OF 5 // EXPEDITION COMMENCEMENT',
    categoryBn: 'ধাপ ৫ / ৫ // অভিযানের শুভ সূচনা',
    description: 'Toggle between friendly Junior Mode and deep Mission Commander Mode at any time in the top HUD.',
    descriptionBn: 'স্ক্রিনের উপরের অংশ থেকে যেকোনো সময় সহজ "জুনিয়র মোড" অথবা গভীর প্রকৌশল তথ্যের "কমান্ডার মোড"-এ পরিবর্তন করতে পারো।',
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    tips: [
      'Step day-by-day or fast-forward simulation time with Time Controls.',
      'Survive the full 30 days to receive your NASA Mission Evaluation debrief.',
      'Use the "What If?" Replay tool to test alternative decisions.'
    ],
    tipsBn: [
      'টাইম কন্ট্রোল দিয়ে দিন-বাই-দিন পর্যবেক্ষণ করো বা দ্রুত সিমুলেশন এগিয়ে নাও।',
      'পুরো ৩০ দিন টিকে থেকে নাসার চূড়ান্ত মিশন মূল্যায়ন রিপোর্ট অর্জন করো।',
      '"যদি অন্য সিদ্ধান্ত নিতাম?" রিপ্লে টুলের মাধ্যমে বিকল্প সিদ্ধান্তের ফলাফল পরীক্ষা করো।'
    ]
  }
];

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  onClose,
  onFinishTutorial
}) => {
  const { t, language } = useLanguage();
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

  const title = (language === 'bn' && slide.titleBn) ? slide.titleBn : slide.title;
  const category = (language === 'bn' && slide.categoryBn) ? slide.categoryBn : slide.category;
  const desc = (language === 'bn' && slide.descriptionBn) ? slide.descriptionBn : slide.description;
  const tips = (language === 'bn' && slide.tipsBn) ? slide.tipsBn : slide.tips;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0B1324] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#52D6FF]">
              {category}
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
              {title}
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {desc}
          </p>

          <div className="space-y-2 bg-[#060B18] p-3 rounded-lg border border-slate-800/80">
            {tips.map((tip, idx) => (
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
            {t('common.previous')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all hidden sm:block"
            >
              {t('tut.skip')}
            </button>
            <button
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              {slideIdx === TUTORIAL_SLIDES.length - 1 ? (
                <>
                  <Check className="w-4 h-4" /> {t('tut.start')}
                </>
              ) : (
                <>
                  {t('common.next')} <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
