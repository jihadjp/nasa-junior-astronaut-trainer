// Official Printable NASA Cadet Flight Certificate Modal
// Generates printable high-res diploma with student name and real mission coordinates

import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { X, Printer, Award, Rocket, Edit3 } from 'lucide-react';
import { NasaDataBadge } from '../common/NasaDataBadge';

interface CadetFlightCertificateModalProps {
  state: SimulationState;
  isOpen: boolean;
  onClose: () => void;
}

export const CadetFlightCertificateModal: React.FC<CadetFlightCertificateModalProps> = ({
  state,
  isOpen,
  onClose
}) => {
  const { formatNum, language } = useLanguage();
  const { destination, totalDays, scores, landingSite } = state;
  const isMars = destination === 'mars';

  const [cadetName, setCadetName] = useState<string>('Artemis Explorer');

  if (!isOpen) return null;

  const sc = scores || {
    overallScore: 88,
    grade: 'EXPEDITION COMMANDER (A)',
    efficiencyScore: 85,
    survivalScore: 90
  };

  const siteName = landingSite 
    ? ((language === 'bn' && landingSite.nameBn) ? landingSite.nameBn : landingSite.name)
    : (isMars ? 'Jezero Crater Delta' : 'Shackleton Crater Rim');

  const destTitle = isMars 
    ? (language === 'bn' ? 'মঙ্গল গ্রহ' : 'MARS') 
    : (language === 'bn' ? 'চাঁদ' : 'THE MOON');

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#070D1C] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 relative my-auto max-h-[96vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              {language === 'bn' ? 'অফিসিয়াল নাসা ফ্লাইট সার্টিফিকেট' : 'Official NASA Flight Certificate'}
            </h3>
            <NasaDataBadge layer="scientific_model" size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save PDF'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Close Certificate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cadet Name Input Field (Hidden in print) */}
        <div className="mb-4 p-3 rounded-xl bg-[#050A16] border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono print:hidden">
          <label className="text-slate-300 font-bold flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'bn' ? 'সনদের জন্য তোমার নাম লিখো:' : 'Enter Cadet Name for Diploma:'}</span>
          </label>
          <input
            type="text"
            value={cadetName}
            onChange={(e) => setCadetName(e.target.value)}
            placeholder="Cadet Name"
            className="px-3 py-1.5 rounded-lg bg-[#0C152B] border border-sky-400/40 text-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 w-full sm:w-64"
          />
        </div>

        {/* --- HIGH RESOLUTION PRINTABLE DIPLOMA FRAME --- */}
        <div className="relative border-4 border-amber-500/80 bg-gradient-to-b from-[#0A1224] via-[#060C18] to-[#040812] p-5 sm:p-10 rounded-xl text-center shadow-2xl overflow-hidden print:border-4 print:border-black print:bg-white print:text-black print:p-8">
          {/* Ornate Aerospace Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

          {/* Insignia Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 mx-auto print:border-black print:text-black">
              <Rocket className="w-6 h-6" />
            </div>
          </div>

          <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-sky-400 font-extrabold mb-1 print:text-black">
            NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
          </div>
          <div className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-4 print:text-slate-600">
            SPACE APPS CHALLENGE 2026 // JUNIOR EXPEDITION CORPS
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-wide uppercase mb-2 print:text-black">
            {language === 'bn' ? 'অভিযান সফলতার আনুষ্ঠানিক সনদ' : 'CERTIFICATE OF FLIGHT COMPLETION'}
          </h2>

          <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-lg mx-auto mb-5 print:text-slate-700">
            {language === 'bn' 
              ? 'এই মর্মে প্রত্যায়ন করা যাচ্ছে যে সফলভাবে আউটপোস্ট পরিচালনা করেছেন:' 
              : 'This is to officially certify that the designated Cadet Commander:'}
          </p>

          {/* Large Cadet Name Banner */}
          <div className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-950/40 via-sky-900/30 to-sky-950/40 border-y border-amber-500/60 inline-block mb-5 max-w-full print:border-black print:bg-slate-100">
            <span className="text-xl sm:text-3xl font-display font-black text-amber-300 tracking-wide uppercase block truncate print:text-black">
              {cadetName || 'CADET ASTRONAUT'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed print:text-slate-700">
            {language === 'bn'
              ? `তিনি সফলভাবে ${destTitle}-এর ${siteName} এলাকায় দীর্ঘ ${formatNum(totalDays)} দিনের জন্য আউটপোস্টের জীবনরক্ষা ব্যবস্থা ও নভোচারীদের জীবন সুরক্ষিত রেখেছেন।`
              : `Has successfully directed base architecture, closed-loop life support, and mission survival at ${siteName} on ${destTitle} for a duration of ${formatNum(totalDays)} Days.`}
          </p>

          {/* Telemetry Flight Record Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-4 rounded-xl bg-[#060B18]/90 border border-slate-800 text-xs font-mono max-w-2xl mx-auto mb-8 print:border-black print:bg-slate-50">
            <div>
              <span className="text-slate-500 text-[9px] uppercase block print:text-slate-600">{language === 'bn' ? 'অবতরণ স্থানাঙ্ক' : 'Coordinates'}</span>
              <span className="font-bold text-white print:text-black">{landingSite?.coordinates || 'Polar Grid'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase block print:text-slate-600">{language === 'bn' ? 'মিশন সময়কাল' : 'Duration'}</span>
              <span className="font-bold text-white print:text-black">{formatNum(totalDays)} {language === 'bn' ? 'দিন' : 'Days'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase block print:text-slate-600">{language === 'bn' ? 'চূড়ান্ত স্কোর' : 'Final Score'}</span>
              <span className="font-bold text-amber-300 print:text-black">{formatNum(sc.overallScore)} / 100</span>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase block print:text-slate-600">{language === 'bn' ? 'যোগ্যতা গ্রেড' : 'Flight Rank'}</span>
              <span className="font-bold text-emerald-400 print:text-black">{sc.grade}</span>
            </div>
          </div>

          {/* Official Signatures & Verification Seal */}
          <div className="flex flex-wrap items-end justify-between gap-6 pt-4 border-t border-slate-800/80 max-w-2xl mx-auto text-left text-xs font-mono print:border-black">
            <div>
              <div className="w-32 border-b border-slate-400 pb-1 mb-1 italic font-serif text-slate-300 print:text-black print:border-black">
                Dr. E. Vance
              </div>
              <span className="text-[10px] text-slate-400 uppercase block print:text-slate-600">
                {language === 'bn' ? 'নাসা ফ্লাইট ডিরেক্টর' : 'NASA Flight Director'}
              </span>
            </div>

            {/* Gold Verification Stamp */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400/80 p-1 flex items-center justify-center text-center text-[8px] font-mono text-amber-300 font-bold uppercase rotate-[-6deg] print:border-black print:text-black">
                VERIFIED FLIGHT CORPS
              </div>
            </div>

            <div>
              <div className="w-32 border-b border-slate-400 pb-1 mb-1 italic font-serif text-slate-300 print:text-black print:border-black">
                Dr. K. Aida
              </div>
              <span className="text-[10px] text-slate-400 uppercase block print:text-slate-600">
                {language === 'bn' ? 'প্রধান বিজ্ঞান কর্মকর্তা' : 'Chief Science Officer'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
