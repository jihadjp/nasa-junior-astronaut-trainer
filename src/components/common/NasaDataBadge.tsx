// Real NASA Data vs Scientific Model vs Game Simulation Visual Indicator Badge
// Provides transparent educational distinction for students

import React, { useState } from 'react';
import { Database, FlaskConical, Gamepad2, Info, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type LayerType = 'nasa_data' | 'scientific_model' | 'simulation';

interface NasaDataBadgeProps {
  layer: LayerType;
  label?: string;
  size?: 'sm' | 'md';
  showInfoOnClick?: boolean;
  className?: string;
}

export const NasaDataBadge: React.FC<NasaDataBadgeProps> = ({
  layer,
  label,
  size = 'md',
  showInfoOnClick = true,
  className = ''
}) => {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState<boolean>(false);

  const getConfig = () => {
    switch (layer) {
      case 'nasa_data':
        return {
          icon: Database,
          defaultLabel: language === 'bn' ? 'নাসা আসল ডেটা' : 'REAL NASA DATA',
          bg: 'bg-sky-500/15 border-sky-400/50 text-sky-300 hover:bg-sky-500/25',
          dot: 'bg-sky-400',
          title: language === 'bn' ? '🛰️ নাসার আসল পর্যবেক্ষণ ডেটা' : '🛰️ Real NASA Observation Data',
          desc: language === 'bn'
            ? 'এটি নাসা লুনার রিকনেসান্স অরবিটার (LRO), মার্স গ্লোবাল সার্ভেয়ার (MOLA) বা রোভার মিশনের আসল পরিমাপ (উচ্চতা, ঢাল, স্থানাঙ্ক, তাপমাত্রা)।'
            : 'Authentic measurements (elevation, coordinates, surface slope, illumination) acquired directly by NASA orbiters and rovers.'
        };
      case 'scientific_model':
        return {
          icon: FlaskConical,
          defaultLabel: language === 'bn' ? 'নাসা বৈজ্ঞানিক মডেল' : 'NASA-GROUNDED MODEL',
          bg: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25',
          dot: 'bg-emerald-400',
          title: language === 'bn' ? '🧪 নাসা-সমর্থিত বৈজ্ঞানিক মডেল' : '🧪 NASA-Supported Scientific Model',
          desc: language === 'bn'
            ? 'এটি নাসার প্রযুক্তিগত গবেষণা (ECLSS ৯৮% পানি রিসাইক্লিং, MOXIE অক্সিজেন তৈরি, সৌর আলো সমীকরণ) থেকে নেওয়া বৈজ্ঞানিক সমীকরণ।'
            : 'Mathematical equations calibrated using published NASA Technical Reports (e.g., ECLSS 98% water recovery, MOXIE SOXE rates).'
        };
      case 'simulation':
      default:
        return {
          icon: Gamepad2,
          defaultLabel: language === 'bn' ? 'গেম সিমুলেশন' : 'SIMULATED VALUE',
          bg: 'bg-purple-500/15 border-purple-400/50 text-purple-300 hover:bg-purple-500/25',
          dot: 'bg-purple-400',
          title: language === 'bn' ? '🎮 শিক্ষামূলক গেম সিমুলেশন' : '🎮 Educational Game Simulation',
          desc: language === 'bn'
            ? 'এটি খেলোয়াড়ের সিদ্ধান্তের ওপর ভিত্তি করে গেমের ভেতরে হিসাব করা বর্তমান মান (যেমন: ব্যাটারি চার্জ, সংরক্ষিত অক্সিজেন, ক্রুর স্ট্রেস)।'
            : 'Dynamic educational gameplay numbers calculated in real time based on your command decisions.'
        };
    }
  };

  const cfg = getConfig();
  const Icon = cfg.icon;
  const isSm = size === 'sm';

  return (
    <>
      <span
        onClick={showInfoOnClick ? (e) => { e.stopPropagation(); setShowModal(true); } : undefined}
        role={showInfoOnClick ? 'button' : undefined}
        tabIndex={showInfoOnClick ? 0 : undefined}
        title={showInfoOnClick ? 'Click to see scientific data layer explanation' : undefined}
        className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider font-bold transition-all select-none ${cfg.bg} ${
          isSm ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } ${showInfoOnClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse shrink-0`} />
        <Icon className={isSm ? 'w-2.5 h-2.5 shrink-0' : 'w-3 h-3 shrink-0'} />
        <span>{label || cfg.defaultLabel}</span>
        {showInfoOnClick && <Info className="w-2.5 h-2.5 opacity-60 ml-0.5" />}
      </span>

      {/* Layer Explanation Modal for Students */}
      {showModal && (
        <div 
          onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0A1020] border-2 border-slate-700 rounded-2xl shadow-2xl p-5 text-left relative animate-in zoom-in-95"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
              <h3 className="font-display font-bold text-base text-white">
                {cfg.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              {cfg.desc}
            </p>

            {/* Three Layer Educational Comparison */}
            <div className="space-y-2 p-3 rounded-xl bg-[#060B18] border border-slate-800 text-[11px] font-mono">
              <div className="text-sky-300 flex items-center gap-2">
                <span>🛰️</span>
                <span><strong>NASA DATA:</strong> {language === 'bn' ? 'আসল ভূখণ্ড, উচ্চতা ও স্থানাঙ্ক' : 'Real terrain, elevation, and slopes'}</span>
              </div>
              <div className="text-emerald-300 flex items-center gap-2">
                <span>🧪</span>
                <span><strong>MODEL:</strong> {language === 'bn' ? 'নাসা সমীকরণে নিয়ন্ত্রিত পদার্থবিজ্ঞান' : 'Physics calibrated via NASA papers'}</span>
              </div>
              <div className="text-purple-300 flex items-center gap-2">
                <span>🎮</span>
                <span><strong>SIMULATION:</strong> {language === 'bn' ? 'খেলোয়াড়ের খেলার স্কোর ও লাইভ রিসোর্স' : 'Your real-time mission outcomes'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
            >
              {language === 'bn' ? 'বুঝেছি' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
