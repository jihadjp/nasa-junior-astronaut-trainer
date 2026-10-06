// Interactive NASA ECLSS Closed-Loop Mass Balance Flow Diagram Component
// Models 98% loop closure, OGA water electrolysis, CDRA CO2 scrubbing, and Sabatier/MOXIE reaction

import React, { useState } from 'react';
import type { SimulationState } from '../../types/game';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { Droplets, Wind, Flame, Users, RefreshCw } from 'lucide-react';
import { NasaDataBadge } from '../common/NasaDataBadge';

interface EclssFlowDiagramProps {
  state: SimulationState;
}

export const EclssFlowDiagram: React.FC<EclssFlowDiagramProps> = ({ state }) => {
  const { formatNum, language } = useLanguage();
  const { crew, destination } = state;
  const isMars = destination === 'mars';

  const [activeNode, setActiveNode] = useState<'water' | 'oga' | 'crew' | 'co2'>('water');

  const crewCount = crew?.length || 4;

  // NASA Life Support Mass Balance Benchmark Figures (NASA MSFC / JSC ICES-2023-142 Baseline)
  const o2DemandKgPerDay = Math.round(crewCount * 0.84 * 10) / 10; // ~0.84 kg O2 / astronaut / day
  const waterDemandKgPerDay = Math.round(crewCount * 2.5 * 10) / 10; // ~2.5 kg water / astronaut / day
  const co2ExhaledKgPerDay = Math.round(crewCount * 1.0 * 10) / 10; // ~1.0 kg CO2 / astronaut / day
  const waterRecoveredKgPerDay = Math.round(waterDemandKgPerDay * 0.98 * 10) / 10; // 98% recovery

  return (
    <div className="w-full bg-[#080E1C] border border-sky-500/30 rounded-2xl p-3.5 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              {language === 'bn' 
                ? 'নাসা ECLSS ক্লোজড-লুপ ভর ভারসাম্য (Mass Balance Flow)' 
                : 'NASA ECLSS CLOSED-LOOP MASS BALANCE ARCHITECTURE'}
            </h3>
            <NasaDataBadge layer="scientific_model" size="sm" />
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {language === 'bn' 
              ? 'আন্তর্জাতিক মহাকাশ স্টেশন ও আর্টেমিসের ৯৮% ওয়াটার রিকভারি ও ইলেক্ট্রোলাইসিস চক্র' 
              : 'Interactive ISS & Artemis 98% water recycling loop and OGA electrolysis flow.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold">
            98.2% {language === 'bn' ? 'লুপ সমাপ্তি' : 'LOOP CLOSURE'}
          </span>
        </div>
      </div>

      {/* Interactive Loop Diagram Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
        {/* Node 1: Water Recovery & Potable Storage */}
        <div
          onClick={() => {
            sound.playClick();
            setActiveNode('water');
          }}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeNode === 'water'
              ? 'bg-[#0E2038] border-sky-400 shadow-md ring-1 ring-sky-400'
              : 'bg-[#060C18] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">
              1. WPA / UPA LOOP
            </span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <h4 className="font-display font-bold text-xs sm:text-sm text-white mb-1">
            {language === 'bn' ? 'ওয়াটার প্রসেসর (WPA)' : 'Water Recovery'}
          </h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div>{language === 'bn' ? 'দৈনিক ব্যবহার:' : 'Demand:'} <span className="font-bold text-sky-300">{formatNum(waterDemandKgPerDay)} kg/day</span></div>
            <div>{language === 'bn' ? 'পুনরুদ্ধার:' : 'Recovered:'} <span className="font-bold text-emerald-400">{formatNum(waterRecoveredKgPerDay)} kg/day</span></div>
          </div>
        </div>

        {/* Node 2: OGA Water Electrolysis */}
        <div
          onClick={() => {
            sound.playClick();
            setActiveNode('oga');
          }}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeNode === 'oga'
              ? 'bg-[#0E2038] border-sky-400 shadow-md ring-1 ring-sky-400'
              : 'bg-[#060C18] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">
              2. OGA ELECTROLYSIS
            </span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <h4 className="font-display font-bold text-xs sm:text-sm text-white mb-1">
            {language === 'bn' ? 'অক্সিজেন জেনারেশন (OGA)' : 'Oxygen Generator'}
          </h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div>{language === 'bn' ? 'উৎপাদিত O₂:' : 'O₂ Generated:'} <span className="font-bold text-teal-300">{formatNum(o2DemandKgPerDay)} kg/day</span></div>
            <div>{language === 'bn' ? 'উপজাত H₂:' : 'Byproduct H₂:'} <span className="font-bold text-slate-400">{formatNum(Math.round(o2DemandKgPerDay * 0.125 * 10) / 10)} kg/day</span></div>
          </div>
        </div>

        {/* Node 3: Crew Metabolism & Respiration */}
        <div
          onClick={() => {
            sound.playClick();
            setActiveNode('crew');
          }}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeNode === 'crew'
              ? 'bg-[#0E2038] border-sky-400 shadow-md ring-1 ring-sky-400'
              : 'bg-[#060C18] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
              3. CREW METABOLISM
            </span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="font-display font-bold text-xs sm:text-sm text-white mb-1">
            {language === 'bn' ? 'নভোচারী বিপাক ক্রিয়া' : 'Crew Respiration'}
          </h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div>{language === 'bn' ? 'শ্বাস গ্রহণ O₂:' : 'O₂ Consumed:'} <span className="font-bold text-white">{formatNum(o2DemandKgPerDay)} kg/day</span></div>
            <div>{language === 'bn' ? 'নিঃশ্বাস CO₂:' : 'CO₂ Exhaled:'} <span className="font-bold text-amber-300">{formatNum(co2ExhaledKgPerDay)} kg/day</span></div>
          </div>
        </div>

        {/* Node 4: CO2 Scrubbing & Sabatier / MOXIE Loop Closure */}
        <div
          onClick={() => {
            sound.playClick();
            setActiveNode('co2');
          }}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeNode === 'co2'
              ? 'bg-[#0E2038] border-sky-400 shadow-md ring-1 ring-sky-400'
              : 'bg-[#060C18] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
              4. {isMars ? 'MOXIE / CDRA' : 'SABATIER / CDRA'}
            </span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <h4 className="font-display font-bold text-xs sm:text-sm text-white mb-1">
            {language === 'bn' ? 'কার্বন রিঅ্যাক্টর ও রিসাইকেল' : 'CO₂ Loop Recovery'}
          </h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div>{language === 'bn' ? 'ফিল্টার CO₂:' : 'Scrubbed CO₂:'} <span className="font-bold text-rose-300">{formatNum(co2ExhaledKgPerDay)} kg/day</span></div>
            <div>{language === 'bn' ? 'পুনর্ব্যবহার:' : 'Recycled Water:'} <span className="font-bold text-emerald-400">~{formatNum(Math.round(co2ExhaledKgPerDay * 0.8 * 10) / 10)} kg</span></div>
          </div>
        </div>
      </div>

      {/* Selected Node Engineering Deep-Dive Details */}
      <div className="p-3.5 rounded-xl bg-[#050B16] border border-slate-800 text-xs leading-relaxed">
        {activeNode === 'water' && (
          <div>
            <strong className="text-sky-300 block font-mono text-[11px] uppercase mb-1">
              {language === 'bn' ? '💧 ওয়াটার রিকভারি আর্কিটেকচার (NASA WPA & UPA)' : '💧 WATER RECOVERY SYSTEM (NASA WPA & UPA)'}
            </strong>
            <p className="text-slate-300 font-sans">
              {language === 'bn'
                ? 'আন্তর্জাতিক মহাকাশ স্টেশনের ওয়াটার প্রসেসিং অ্যাসেম্বলি নভোচারীদের নিঃশ্বাসের বাষ্প, ঘাম ও মূত্র ডিস্টিলেশন করে ফিল্টার করে। এরপর অনুঘটন জারণের মাধ্যমে ৯৮% এর বেশি খাবার পানি পুনরায় ব্যবহারের উপযোগী করা হয়।'
                : 'The ISS Water Processor Assembly (WPA) purifies cabin humidity condensate, wash water, and urine distillate through multi-barrier catalytic oxidation, achieving over 98% loop closure.'}
            </p>
          </div>
        )}

        {activeNode === 'oga' && (
          <div>
            <strong className="text-teal-300 block font-mono text-[11px] uppercase mb-1">
              {language === 'bn' ? '🌬️ ওয়াটার ইলেক্ট্রোলাইসিস সেল (OGA)' : '🌬️ OXYGEN GENERATION ASSEMBLY (OGA)'}
            </strong>
            <p className="text-slate-300 font-sans">
              {language === 'bn'
                ? 'ইলেক্ট্রোলাইসিসের মাধ্যমে বিশুদ্ধ পানি ভেঙে শ্বাসযোগ্য অক্সিজেন (O₂) এবং হাইড্রোজেন (H₂) তৈরি করা হয়। রাসায়নিক বিক্রিয়া: 2H₂O + বিদ্যুৎ → 2H₂ + O₂। প্রতি ক্রুর জন্য প্রতিদিন প্রায় ০.৮৪ কেজি অক্সিজেন প্রয়োজন হয়।'
                : 'NASA OGA uses solid polymer electrochemical cells to split reclaimed water into pure breathable O2 and hydrogen gas: 2H₂O + electrical power → 2H₂ + O₂. Each astronaut consumes approx. 0.84 kg O2 per day.'}
            </p>
          </div>
        )}

        {activeNode === 'crew' && (
          <div>
            <strong className="text-amber-300 block font-mono text-[11px] uppercase mb-1">
              {language === 'bn' ? '🧑‍🚀 নভোচারী বিপাক ও গ্যাস বিনিময়' : '🧑‍🚀 HUMAN METABOLIC GAS EXCHANGE'}
            </strong>
            <p className="text-slate-300 font-sans">
              {language === 'bn'
                ? '৪ জন নভোচারী দিনে গড়ে ৩.৩৬ কেজি অক্সিজেন গ্রহণ করে এবং ৪.০ কেজি কার্বন ডাই-অক্সাইড ত্যাগ করে। কেবিনের বাতাসে CO₂ মাত্রা ০.৫% এর নিচে রাখা অত্যন্ত জরুরি, অন্যথায় ক্রুদের মাথাব্যথা ও সিদ্ধান্তহীনতা দেখা দেয়।'
                : 'A crew of 4 consumes ~3.36 kg of oxygen and exhales ~4.0 kg of carbon dioxide daily. Maintaining cabin CO2 below 0.5% (3.8 mmHg partial pressure) is vital to prevent cognitive impairment.'}
            </p>
          </div>
        )}

        {activeNode === 'co2' && (
          <div>
            <strong className="text-rose-300 block font-mono text-[11px] uppercase mb-1">
              {language === 'bn' ? '🔥 সাবাতিয়ের ও মোক্সি প্রযুক্তি (Sabatier & MOXIE)' : '🔥 CO2 REDUCTION & ISRU (SABATIER & MOXIE)'}
            </strong>
            <p className="text-slate-300 font-sans">
              {language === 'bn'
                ? 'সাবাতিয়ের রিঅ্যাক্টরে কার্বন ডাই-অক্সাইডের সাথে হাইড্রোজেন মিশিয়ে ৪৫০°C তাপমাত্রায় মিথেন ও পুনরায় পানি তৈরি করা হয়: CO₂ + 4H₂ → CH₄ + 2H₂O। আর মঙ্গলে নাসার MOXIE যন্ত্র ৮০০°C তাপে সরাসরি বায়ুমণ্ডলের CO₂ থেকে অক্সিজেন তৈরি করে।'
                : 'The Sabatier catalytic reactor combines exhaled CO2 with OGA byproduct H2 at 400°C to recover additional water: CO₂ + 4H₂ → CH₄ + 2H₂O. On Mars, NASA MOXIE utilizes solid-oxide electrolysis to produce O2 from CO2.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
