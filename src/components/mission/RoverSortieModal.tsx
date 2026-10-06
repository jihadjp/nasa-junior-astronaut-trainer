// Interactive NASA Rover Surface Sortie & ISRU Science Prospecting Modal
// Simulates autonomous surface sorties (e.g., VIPER ice prospecting & Perseverance core caching)

import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { 
  X, 
  Navigation, 
  Battery, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  RotateCcw
} from 'lucide-react';
import { NasaDataBadge } from '../common/NasaDataBadge';

interface RoverSortieModalProps {
  state: SimulationState;
  isOpen: boolean;
  onClose: () => void;
  onApplyRewards: (rewards: { water?: number; power?: number; sciencePts?: number; spares?: number }) => void;
}

interface SortieTarget {
  id: string;
  name: string;
  nameBn: string;
  distance_m: number;
  hazardRisk: 'LOW' | 'MODERATE' | 'HIGH';
  hazardDesc: string;
  hazardDescBn: string;
  resourceYield: string;
  resourceYieldBn: string;
  rewards: { water?: number; power?: number; sciencePts?: number; spares?: number };
}

export const RoverSortieModal: React.FC<RoverSortieModalProps> = ({
  state,
  isOpen,
  onClose,
  onApplyRewards
}) => {
  const { formatNum, language } = useLanguage();
  const { destination, landingSite } = state;
  const isMars = destination === 'mars';

  const [selectedTargetId, setSelectedTargetId] = useState<string>('target_1');
  const [missionPhase, setMissionPhase] = useState<'briefing' | 'driving' | 'drilling' | 'completed'>('briefing');
  const [progressPct, setProgressPct] = useState<number>(0);

  if (!isOpen) return null;

  // Generate authentic sortie targets based on current planet & landing site
  const targets: SortieTarget[] = !isMars ? [
    {
      id: 'target_1',
      name: 'Permanently Shadowed Crater Cold Trap',
      nameBn: 'স্থায়ী ছায়াযুক্ত খাদের বরফ অনুসন্ধান (PSR)',
      distance_m: 850,
      hazardRisk: 'HIGH',
      hazardDesc: 'Cryogenic 40 Kelvin cold trap with 28° regolith loose slopes.',
      hazardDescBn: '৪০ কেলভিনের অতি-শীতল পরিবেশ ও ২৮° খাড়া পিচ্ছিল রেগোলিথ ঢাল।',
      resourceYield: '+35 L Water Ice & Volatiles, +25 Astrobiology PTS',
      resourceYieldBn: '+৩৫ লিটার বরফ উদ্বায়ী এবং +২৫ বিজ্ঞান পয়েন্ট',
      rewards: { water: 35, sciencePts: 25 }
    },
    {
      id: 'target_2',
      name: 'High-Elevation Ridge Solar Relay Survey',
      nameBn: 'উঁচু শৈলশিরায় সোলার রিলে ও পাওয়ার জরিপ',
      distance_m: 1400,
      hazardRisk: 'MODERATE',
      hazardDesc: 'Abrasive boulder field on elevated ridgecrest.',
      hazardDescBn: 'শৈলশিরার উপর ছড়িয়ে থাকা ধারালো পাথর ও কঠিন ভূখণ্ড।',
      resourceYield: '+40 kWh Solar Calibration, +15 Science PTS',
      resourceYieldBn: '+৪০ কিলোওয়াট-ঘণ্টা পাওয়ার ব্যাকআপ ও +১৫ বিজ্ঞান পয়েন্ট',
      rewards: { power: 40, sciencePts: 15 }
    },
    {
      id: 'target_3',
      name: 'Pyroclastic Regolith Glass Sampling',
      nameBn: 'পাইরোক্লাস্টিক রেগোলিথ কাঁচ খনিজ সংগ্রহ',
      distance_m: 420,
      hazardRisk: 'LOW',
      hazardDesc: 'Flat basaltic plains with minimal wheel slip.',
      hazardDescBn: 'সমতল ব্যাসল্ট সমভূমি যেখানে চাকা পিছলে যাওয়ার ঝুঁকি কম।',
      resourceYield: '+20 Regolith Shield Minerals, +15 Science PTS',
      resourceYieldBn: '+২০ খনিজ সুরক্ষা উপাদান এবং +১৫ বিজ্ঞান পয়েন্ট',
      rewards: { spares: 2, sciencePts: 15 }
    }
  ] : [
    {
      id: 'target_1',
      name: 'River Delta Sediment Fan Core Drill',
      nameBn: 'নদী ডেল্টা পলল স্তর ড্রিলিং ও প্রাচীন নমুনা',
      distance_m: 1200,
      hazardRisk: 'MODERATE',
      hazardDesc: 'Fine clay sand dunes prone to rover wheel entrapment.',
      hazardDescBn: 'সূক্ষ্ম বালির টিলা যেখানে রোভারের চাকা আটকে যাওয়ার ঝুঁকি থাকে।',
      resourceYield: '+40 Astrobiology Biosignature PTS, +15 L Subsurface Hydration',
      resourceYieldBn: '+৪০ জ্যোতির্জীববিজ্ঞান পয়েন্ট ও +১৫ লিটার ভূগর্ভস্থ পানি',
      rewards: { sciencePts: 40, water: 15 }
    },
    {
      id: 'target_2',
      name: 'Layered Basalt Bedrock Core Extraction',
      nameBn: 'ব্যাসল্ট স্তরিত শিলা ড্রিল ও স্যাম্পল ক্যাশিং',
      distance_m: 650,
      hazardRisk: 'LOW',
      hazardDesc: 'Competent igneous rock terrace, safe traction.',
      hazardDescBn: 'মজবুত আগ্নেয় শিলার স্তর, চাকার গ্রিপ অত্যন্ত নিরাপদ।',
      resourceYield: '+25 Geology PTS, +3 Module Spare Components',
      resourceYieldBn: '+২৫ ভূতত্ত্ব পয়েন্ট ও +৩টি স্পেয়ার যন্ত্রাংশ',
      rewards: { sciencePts: 25, spares: 3 }
    },
    {
      id: 'target_3',
      name: 'Subsurface Radar Ice Scarps Exploration',
      nameBn: 'শারাড রাডারে শনাক্ত অগভীর ভূগর্ভস্থ বরফ স্তর',
      distance_m: 1900,
      hazardRisk: 'HIGH',
      hazardDesc: 'Fractured terrain with permafrost collapse scarps.',
      hazardDescBn: 'ফাটলযুক্ত বরফপৃষ্ঠ ও মাটি দেবে যাওয়ার উচ্চ ঝুঁকি।',
      resourceYield: '+45 L Potable Water Ice, +20 Science PTS',
      resourceYieldBn: '+৪৫ লিটার বিশুদ্ধ খাবার বরফ ও +২০ বিজ্ঞান পয়েন্ট',
      rewards: { water: 45, sciencePts: 20 }
    }
  ];

  const activeTarget = targets.find(t => t.id === selectedTargetId) || targets[0];

  const handleLaunchSortie = () => {
    sound.playQuindarTone(true);
    setMissionPhase('driving');
    setProgressPct(0);

    // Phase 1: Driving to Target (0 - 50%)
    sound.playRoverMotor();
    let currentP = 0;
    const driveInterval = setInterval(() => {
      currentP += 10;
      setProgressPct(currentP);

      if (currentP === 50) {
        clearInterval(driveInterval);
        setMissionPhase('drilling');
        sound.playRoverDrill();

        // Phase 2: Drilling & Coring (50 - 100%)
        const drillInterval = setInterval(() => {
          currentP += 10;
          setProgressPct(currentP);

          if (currentP >= 100) {
            clearInterval(drillInterval);
            setMissionPhase('completed');
            sound.playSuccess();
            sound.playQuindarTone(false);
            onApplyRewards(activeTarget.rewards);
          }
        }, 300);
      }
    }, 250);
  };

  const handleReset = () => {
    sound.playClick();
    setMissionPhase('briefing');
    setProgressPct(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0A1224] border-2 border-sky-400/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Close Rover Sortie Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                {language === 'bn' ? 'নাসা রোভার সারফেস সর্টি' : 'NASA SURFACE SORTIE'}
              </span>
              <NasaDataBadge layer="scientific_model" size="sm" />
            </div>
            <h3 className="text-base sm:text-xl font-display font-bold text-white mt-0.5">
              {language === 'bn' ? 'স্বায়ত্তশাসিত সায়েন্স ও বরফ অনুসন্ধান' : 'Autonomous Science & Resource Sortie'}
            </h3>
          </div>
        </div>

        {/* Rover Readiness Bar */}
        <div className="grid grid-cols-3 gap-2 bg-[#050B16] p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono mb-4 text-center">
          <div>
            <span className="text-slate-400 text-[9px] block uppercase flex items-center justify-center gap-1">
              <Battery className="w-3 h-3 text-emerald-400" />
              {language === 'bn' ? 'ব্যাটারি চার্জ' : 'Battery SoC'}
            </span>
            <span className="font-bold text-emerald-300">96% NOMINAL</span>
          </div>
          <div>
            <span className="text-slate-400 text-[9px] block uppercase flex items-center justify-center gap-1">
              <Navigation className="w-3 h-3 text-sky-400" />
              {language === 'bn' ? 'অবতরণ সাইট' : 'Site Zone'}
            </span>
            <span className="font-bold text-white truncate block">
              {landingSite?.coordinates || 'Active Site'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[9px] block uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              {language === 'bn' ? 'কোর ড্রিল' : 'Core Drill'}
            </span>
            <span className="font-bold text-purple-300">CALIBRATED</span>
          </div>
        </div>

        {/* SORTIE BRIEFING VIEW */}
        {missionPhase === 'briefing' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 font-bold block mb-2">
                {language === 'bn' ? 'অভিযান লক্ষ্যস্থল নির্বাচন করুন:' : 'Select Expedition Exploration Target:'}
              </label>

              <div className="space-y-2.5">
                {targets.map((tgt) => {
                  const isSelected = tgt.id === selectedTargetId;
                  const name = (language === 'bn' && tgt.nameBn) ? tgt.nameBn : tgt.name;
                  const hazard = (language === 'bn' && tgt.hazardDescBn) ? tgt.hazardDescBn : tgt.hazardDesc;
                  const yieldStr = (language === 'bn' && tgt.resourceYieldBn) ? tgt.resourceYieldBn : tgt.resourceYield;

                  return (
                    <div
                      key={tgt.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedTargetId(tgt.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#101E38] border-sky-400 shadow-md ring-1 ring-sky-400/80'
                          : 'bg-[#060B18] border-slate-800 hover:border-slate-700 hover:bg-[#0D162B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-sky-400' : 'bg-slate-600'}`} />
                          <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                            {name}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                          tgt.hazardRisk === 'LOW' 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : tgt.hazardRisk === 'MODERATE'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        }`}>
                          {tgt.hazardRisk} RISK
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-2">
                        <span>{language === 'bn' ? 'দূরত্ব:' : 'Distance:'} {formatNum(tgt.distance_m)} m</span>
                        <span>•</span>
                        <span className="text-amber-300/90">{hazard}</span>
                      </div>

                      <div className="text-[11px] font-mono text-sky-300 bg-[#040814] p-1.5 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase mr-1">{language === 'bn' ? 'সম্ভাব্য প্রাপ্তি:' : 'Expected Yield:'}</span>
                        <strong>{yieldStr}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                {language === 'bn' ? 'রোভার স্বয়ংক্রিয়ভাবে ফিরে আসবে' : 'Rover returns automatically upon sampling'}
              </span>
              <button
                type="button"
                onClick={handleLaunchSortie}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{language === 'bn' ? 'সর্টি শুরু করুন' : 'Launch Sortie'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE SORTIE ANIMATION & DRILLING PROGRESS */}
        {(missionPhase === 'driving' || missionPhase === 'drilling') && (
          <div className="py-6 text-center animate-fadeIn space-y-4">
            <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-400 mx-auto animate-pulse">
              <Navigation className="w-8 h-8 animate-spin-slow" />
            </div>

            <div>
              <h4 className="text-lg font-display font-bold text-white mb-1">
                {missionPhase === 'driving' 
                  ? (language === 'bn' ? 'রোভার লক্ষ্যস্থলের দিকে এগিয়ে যাচ্ছে...' : 'Rover Navigating Across Terrain...') 
                  : (language === 'bn' ? 'নাসা কোর ড্রিলিং ও নমুনা সংগ্রহ চলছে...' : 'Ground Radar Active & Core Drilling...')}
              </h4>
              <p className="text-xs font-mono text-sky-300">
                {language === 'bn' ? 'লাইভ টেলিমেট্রি প্রগ্রেস:' : 'Live Surface Telemetry:'} {formatNum(progressPct)}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700 max-w-md mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400 italic">
              {missionPhase === 'driving'
                ? (language === 'bn' ? 'লুনার/মার্স পৃষ্ঠের বিপজ্জনক ঢাল এড়িয়ে চলছে...' : 'Autonomous hazard avoidance steering around steep slopes...')
                : (language === 'bn' ? 'হাইড্রেটেড বরফ খনিজ ও শিলা কোর বের করা হচ্ছে...' : 'Extracting sub-surface core sample into hermetic canister...')}
            </p>
          </div>
        )}

        {/* MISSION COMPLETED VIEW */}
        {missionPhase === 'completed' && (
          <div className="py-4 text-center animate-fadeIn space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-display font-extrabold text-white mb-1">
                {language === 'bn' ? 'সর্টি সফল! নমুনা ঘাঁটিতে ফিরেছে' : 'Sortie Complete! Sample Cached'}
              </h4>
              <p className="text-xs font-sans text-slate-300 max-w-sm mx-auto">
                {language === 'bn' 
                  ? 'রোভার নিরাপদে আউটপোস্টের রোভার বে-তে ডক করেছে এবং সংগৃহীত সম্পদ ঘাঁটির গুদামে যুক্ত করা হয়েছে।'
                  : 'The rover safely returned and docked. Retrieved resources have been integrated into outpost telemetry.'}
              </p>
            </div>

            {/* Collected Loot Summary */}
            <div className="p-3.5 rounded-xl bg-[#060B18] border border-emerald-500/40 text-xs font-mono space-y-1 max-w-sm mx-auto">
              <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                {language === 'bn' ? 'ঘাঁটিতে যুক্ত হওয়া সম্পদ:' : 'ADDED TO BASE TELEMETRY:'}
              </span>
              <div className="text-white font-bold">
                {(language === 'bn' && activeTarget.resourceYieldBn) ? activeTarget.resourceYieldBn : activeTarget.resourceYield}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন অভিযান' : 'Another Sortie'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold font-mono text-xs transition-all shadow-lg"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Return to Base'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
