// Interactive & Automated 60-Second Judging Demo Mode (Prompt Section 50)

import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface JudgingDemoModalProps {
  onClose: () => void;
  onLaunchFullGame: () => void;
}

interface DemoStep {
  step: number;
  title: string;
  titleBn?: string;
  badge: string;
  badgeBn?: string;
  badgeColor: string;
  story: string;
  storyBn?: string;
  metricHighlight: string;
  metricHighlightBn?: string;
  icon: string;
  decisionTaken?: string;
  decisionTakenBn?: string;
  causalSummary?: string;
  causalSummaryBn?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Phase 1: Expedition Architecture (Moon vs Mars)',
    titleBn: 'ধাপ ১: অভিযানের নকশা নির্ধারণ (চাঁদ বনাম মঙ্গল)',
    badge: 'MISSION SETUP',
    badgeBn: 'মিশন প্রস্তুতি',
    badgeColor: 'text-[#52D6FF] border-[#52D6FF]/40 bg-[#52D6FF]/10',
    story: 'Judges select destination. Moon presents hard vacuum with 14-day lunar nights; Mars introduces atmospheric dust and thin CO₂. The player selects a 4-astronaut crew with Commander, Engineer, Biologist, and Scientist specialties.',
    storyBn: 'বিচারকরা গন্তব্য নির্বাচন করবেন। চাঁদে ১৪ দিনের দীর্ঘ রাত ও কঠিন শূন্যতা বিরাজ করে; মঙ্গলে রয়েছে বায়ুমণ্ডলীয় ধূলিঝড় ও পাতলা কার্বন ডাই-অক্সাইড। খেলোয়াড় কমান্ডার, ইঞ্জিনিয়ার, জীববিজ্ঞানী ও বিজ্ঞানী নিয়ে ৪ জনের দক্ষ দল গঠন করে।',
    metricHighlight: 'Crew: 4 Astronauts | Daily Consumption: 3.36 kg O₂, 10 L H₂O, 5.6 kg Food',
    metricHighlightBn: 'ক্রু: ৪ নভোচারী | দৈনিক চাহিদা: ৩.৩৬ কেজি O₂, ১০ লিটার পানি, ৫.৬ কেজি খাবার',
    icon: '🚀'
  },
  {
    step: 2,
    title: 'Phase 2: Base Construction & Opportunity Cost',
    titleBn: 'ধাপ ২: ঘাঁটি নির্মাণ ও সুযোগ-ব্যয়',
    badge: 'PAYLOAD BUDGET',
    badgeBn: 'পেলোড বাজেট',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    story: 'Before launch, player allocates 1,000 payload credits. Upgrading radiation shielding reduces crew cancer risk, but leaves fewer credits for hydroponic racks or spare parts.',
    storyBn: 'উৎক্ষেপণের আগে খেলোয়াড় ১,০০০ পেলোড ক্রেডিট বরাদ্দ করে। বিকিরণ শিল্ড বাড়ালে নভোচারীদের স্বাস্থ্য সুরক্ষিত থাকে, কিন্তু হাইড্রোপনিক তাক বা খুচরা যন্ত্রাংশের বাজেট কমে যায়।',
    metricHighlight: 'Engineering Trade-Off: Mass budget strictly caps simultaneous redundancy.',
    metricHighlightBn: 'প্রকৌশলগত ভারসাম্য: রকেট ওজনের কঠোর সীমাবদ্ধতার কারণে সব ব্যবস্থা একসাথে সর্বোচ্চ করা যায় না।',
    icon: '🏗️'
  },
  {
    step: 3,
    title: 'Mission Day 1: Telemetry Nominal',
    titleBn: 'মিশনের দিন ১: স্বাভাবিক টেলিমেট্রি',
    badge: 'ACTIVE OUTPOST',
    badgeBn: 'সক্রিয় আউটপোস্ট',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    story: 'Base deployed on Chryse Planitia. Photovoltaic solar array generates 52 kW net. ECLSS water recovery achieves 95% loop closure. Plants in the hydroponic greenhouse begin photosynthesizing.',
    storyBn: 'ঘাঁটি সফলভাবে স্থাপন করা হয়েছে। সোলার প্যানেল নেট ৫২ কিলোওয়াট বিদ্যুৎ তৈরি করছে। ECLSS পানি পুনরুদ্ধার ব্যবস্থা ৯৫% কার্যক্ষমতা অর্জন করেছে। গ্রিনহাউসে গাছপালা খাদ্য ও অক্সিজেন উৎপাদন শুরু করেছে।',
    metricHighlight: 'O₂: 140 kg (Safe) | H₂O: 160 L (Safe) | Power: 75 kWh (Safe) | Morale: 95%',
    metricHighlightBn: 'O₂: ১৪০ কেজি (নিরাপদ) | পানি: ১৬০ লিটার (নিরাপদ) | বিদ্যুৎ: ৭৫ kWh (নিরাপদ) | মনোবল: ৯৫%',
    icon: '🛰️'
  },
  {
    step: 4,
    title: 'Mission Day 6: Electrical Shortage Dilemma',
    titleBn: 'মিশনের দিন ৬: বিদ্যুৎ ঘাটতির সংকট',
    badge: 'EVENT CARD',
    badgeBn: 'ইভেন্ট কার্ড',
    badgeColor: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    story: 'Power grid load exceeds solar output. The player decides to shed the Astrobiology Laboratory to protect Life Support.',
    storyBn: 'বিদ্যুতের চাহিদা সোলার উৎপাদনের চেয়ে বেড়ে গেছে। লাইফ সাপোর্ট অক্ষত রাখতে খেলোয়াড় অ্যাস্ট্রোবায়োলজি ল্যাবের বিদ্যুৎ বন্ধ করার সিদ্ধান্ত নেয়।',
    metricHighlight: 'Decision: Load Shedding (-10 kW load). Science output paused for 2 days.',
    metricHighlightBn: 'সিদ্ধান্ত: লোড শেডিং (-১০ কিলোওয়াট লোড)। বৈজ্ঞানিক গবেষণা ২ দিনের জন্য স্থগিত।',
    decisionTaken: 'Shed Science Lab Power to protect ECLSS',
    decisionTakenBn: 'লাইফ সাপোর্ট বাঁচাতে ল্যাবের বিদ্যুৎ বন্ধ',
    causalSummary: 'Decision -> Power stabilized -> Science delayed -> Life support safe',
    causalSummaryBn: 'সিদ্ধান্ত -> বিদ্যুৎ স্থিতিশীল -> গবেষণা বিলম্বিত -> লাইফ সাপোর্ট সুরক্ষিত',
    icon: '⚡'
  },
  {
    step: 5,
    title: 'Mission Day 12: Atmospheric Dust Storm',
    titleBn: 'মিশনের দিন ১২: বায়ুমণ্ডলীয় ধূলিঝড়',
    badge: 'CRISIS',
    badgeBn: 'জরুরি সংকট',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    story: 'High-velocity Martian dust obscures sunlight, dropping photovoltaic generation by 60%. The Engineer is deployed on an EVA to clear the array using electrostatic wipers.',
    storyBn: 'তীব্র ধূলিঝড়ে সূর্যালোক ঢেকে গিয়ে সৌর বিদ্যুৎ উৎপাদন ৬০% হ্রাস পায়। সোলার প্যানেল পরিষ্কার করতে স্পেসসুট পরিয়ে ইঞ্জিনিয়ারকে বাইরে পাঠানো হয়।',
    metricHighlight: 'Cost: 6 Spare Parts used, Engineer Fatigue (+15% stress). Power restored.',
    metricHighlightBn: 'খরচ: ৬টি খুচরা যন্ত্রাংশ ব্যবহৃত, ইঞ্জিনিয়ারের ক্লান্তি (+১৫% মানসিক চাপ)। বিদ্যুৎ স্বাভাবিক।',
    decisionTaken: 'Deploy Engineer EVA with electrostatic wipers',
    decisionTakenBn: 'ইঞ্জিনিয়ার পাঠিয়ে সোলার প্যানেল পরিষ্কার',
    causalSummary: 'Solar arrays cleared -> Battery drain halted -> Spare parts depleted',
    causalSummaryBn: 'সোলার প্যানেল পরিষ্কার -> ব্যাটারি ক্ষয় বন্ধ -> খুচরা যন্ত্রাংশের মজুত হ্রাস',
    icon: '🌪️'
  },
  {
    step: 6,
    title: 'Mission Day 18: Coronal Mass Ejection (Solar Flare)',
    titleBn: 'মিশনের দিন ১৮: করোনাল ভর নিক্ষেপ (সৌর শিখা)',
    badge: 'RADIATION EVENT',
    badgeBn: 'বিকিরণ ঝুঁকি',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    story: 'Deep space sensors detect relativistic protons. The crew retreats into the regolith radiation vault surrounded by water bladder jackets, absorbing only 1.2 mSv.',
    storyBn: 'সেন্সর মারাত্মক প্রোটন বিকিরণ শনাক্ত করেছে। ক্রুরা পানির দেয়াল ঘেরা রেগোলিথ বিকিরণ ভল্টে আশ্রয় নেয়, যার ফলে মাত্র ১.২ mSv তেজস্ক্রিয়তা শোষিত হয়।',
    metricHighlight: 'Shielding Attenuation: 92% dose blocked. Crew DNA cellular health protected.',
    metricHighlightBn: 'শিল্ডিং সুরক্ষা: ৯২% ক্ষতিকর বিকিরণ প্রতিহত। নভোচারীদের কোষীয় ডিএনএ সুরক্ষিত।',
    decisionTaken: 'Retreat crew into regolith vault',
    decisionTakenBn: 'রেগোলিথ আশ্রয়ে ক্রুদের কোয়ারেন্টাইন',
    causalSummary: 'Crew quarantined -> Water absorbs protons -> Zero radiation sickness',
    causalSummaryBn: 'ক্রুরা আশ্রয়ে গেল -> পানি প্রোটন শোষণ করল -> বিকিরণ অসুস্থতা শূন্য',
    icon: '☀️'
  },
  {
    step: 7,
    title: 'Mission Day 24: Recovery & Rover Water Discovery',
    titleBn: 'মিশনের দিন ২৪: সংকট উত্তরণ ও রোভারে পানি আবিষ্কার',
    badge: 'SCIENCE MILESTONE',
    badgeBn: 'বিজ্ঞান মাইলফলক',
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    story: 'With systems stabilized, the rover drills into crater permafrost, returning +15 Liters of water and +35 Science discovery points.',
    storyBn: 'ঘাঁটি স্থিতিশীল হওয়ার পর রোভার ক্রেটারের মাটির নিচে ড্রিলিং করে খাঁটি বরফ আবিষ্কার করে, যা ঘাঁটি ফিরিয়ে দেয় +১৫ লিটার পানি এবং +৩৫ বিজ্ঞান পয়েন্ট।',
    metricHighlight: 'Science Points: 115 PTS | Water Tanks Replenished | Crew Morale 92%',
    metricHighlightBn: 'বিজ্ঞান স্কোর: ১১৫ পয়েন্ট | পানির ট্যাংক পুনঃভর্তি | ক্রুর মনোবল ৯২%',
    decisionTaken: 'Rover core sampling sortie dispatched',
    decisionTakenBn: 'রোভারের ড্রিলিং ও নমুনা সংগ্রহের অভিযান',
    causalSummary: 'Cores extracted -> +15L water ice -> +35 science points',
    causalSummaryBn: 'কোর ড্রিলিং সম্পন্ন -> +১৫ লিটার বরফজল -> +৩৫ বিজ্ঞান স্কোর',
    icon: '🚜'
  },
  {
    step: 8,
    title: 'Mission Day 30: Mission Debrief & Scoring',
    titleBn: 'মিশনের দিন ৩০: মিশন মূল্যায়ন ও স্কোরিং',
    badge: 'FINAL REPORT',
    badgeBn: 'চূড়ান্ত রিপোর্ট',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    story: 'The crew completes the 30-day expedition. Comprehensive debrief evaluates Survival (88%), Efficiency (82%), Science (78%), Resilience (84%), and Learning (90%). Overall Score: 84 / 100 [MISSION VETERAN].',
    storyBn: 'ক্রুরা সম্পূর্ণ ৩০ দিনের অভিযান সফলভাবে শেষ করে। বিস্তৃত মূল্যায়ন: টিকে থাকা (৮৮%), দক্ষতা (৮২%), বিজ্ঞান (৭৮%), সহনশীলতা (৮৪%) ও শিখন (৯০%)। সামগ্রিক স্কোর: ৮৪ / ১০০ [অভিজ্ঞ কমান্ডার]।',
    metricHighlight: 'Result: Full expedition survived through adaptive engineering trade-offs!',
    metricHighlightBn: 'ফলাফল: সঠিক প্রকৌশল সিদ্ধান্তের মাধ্যমে পুরো মিশন টিকে রইল!',
    icon: '🏆'
  }
];

export const JudgingDemoModal: React.FC<JudgingDemoModalProps> = ({
  onClose,
  onLaunchFullGame
}) => {
  const { t, formatNum, language } = useLanguage();
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

  const stepTitle = (language === 'bn' && currentStep.titleBn) ? currentStep.titleBn : currentStep.title;
  const stepBadge = (language === 'bn' && currentStep.badgeBn) ? currentStep.badgeBn : currentStep.badge;
  const stepStory = (language === 'bn' && currentStep.storyBn) ? currentStep.storyBn : currentStep.story;
  const stepMetric = (language === 'bn' && currentStep.metricHighlightBn) ? currentStep.metricHighlightBn : currentStep.metricHighlight;
  const stepCausal = (language === 'bn' && currentStep.causalSummaryBn) ? currentStep.causalSummaryBn : currentStep.causalSummary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1324] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('demo.badge')}
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
            {language === 'bn'
              ? `শোকেস মাইলফলক ${formatNum(currentStep.step)} / ${formatNum(DEMO_STEPS.length)}`
              : `SHOWCASE MILESTONE ${currentStep.step} OF ${DEMO_STEPS.length}`}
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${currentStep.badgeColor}`}>
            {stepBadge}
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
                {stepTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stepStory}
              </p>
            </div>
          </div>

          {/* Metric Highlight Box */}
          <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 font-mono text-xs text-sky-300 mb-3 flex items-start gap-2">
            <span className="text-[#52D6FF] font-bold shrink-0">{t('demo.telemetry')}</span>
            <span>{stepMetric}</span>
          </div>

          {/* Causal Chain Callout if decision was taken */}
          {currentStep.decisionTaken && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-200">
              <span className="text-amber-400 font-bold block mb-0.5">
                {t('demo.causal')}
              </span>
              <span>{stepCausal}</span>
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
            {t('common.previous')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchFullGame}
              className="px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all hidden sm:block"
            >
              {t('demo.btn.skip')}
            </button>

            <button
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              {currentStepIdx === DEMO_STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> {t('demo.btn.play')}
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
