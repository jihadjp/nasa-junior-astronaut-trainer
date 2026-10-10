// Game-First Interactive STEM Training Lab Simulators
import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Zap, 
  Droplets, 
  Wind, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  Activity, 
  Thermometer, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Flame,
  Sparkles,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

// ==========================================
// 1. MOON THERMAL & ICE CRATER SIMULATOR
// ==========================================
export const MoonLabWidget: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';

  const [isNight, setIsNight] = useState<boolean>(false);
  const [regolithDepth, setRegolithDepth] = useState<number>(2.0); // meters

  // Calculations
  const surfaceTempC = isNight ? -130 : 120;
  const solarKw = isNight ? 0 : 45;
  const batteryDrainRate = isNight ? 12 : 2; // kW heating load
  // Radiation reduction: each meter of regolith reduces dose significantly
  const surfaceDose_mSv = 380;
  const protectedDose_mSv = Math.round(surfaceDose_mSv * Math.exp(-regolithDepth * 1.3));

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#070D1B] border border-cyan-500/30 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[#52D6FF]">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'ইন্টারেক্টিভ লুনার এনভায়রনমেন্ট ল্যাব' : 'INTERACTIVE LUNAR ENVIRONMENT LAB'}
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">
              {isBn ? 'থার্মাল সুইং ও রেগোলিথ শিল্ডিং সিমুলেশন' : 'Thermal Swings & Regolith Attenuation'}
            </span>
          </div>
        </div>

        {/* Day / Night Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsNight(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              !isNight ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>{isBn ? 'সূর্যকিরণ (+১২০°C)' : 'DAY (+120°C)'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsNight(true);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              isNight ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>{isBn ? '১৪ দিনের রাত (-১৩০°C)' : 'NIGHT (-130°C)'}</span>
          </button>
        </div>
      </div>

      {/* Visual Telemetry Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center">
        <div className={`p-2.5 rounded-xl border transition-all ${isNight ? 'bg-sky-950/40 border-sky-500/40' : 'bg-amber-950/40 border-amber-500/40'}`}>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-1">
            <Thermometer className="w-3 h-3" />
            <span>{isBn ? 'পৃষ্ঠ তাপমাত্রা' : 'SURFACE TEMP'}</span>
          </div>
          <span className={`text-sm sm:text-base font-bold ${isNight ? 'text-sky-300' : 'text-amber-400'}`}>
            {formatNum(surfaceTempC)}°C
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{isBn ? 'সোলার আউটপুট' : 'SOLAR FLUX'}</span>
          </div>
          <span className={`text-sm sm:text-base font-bold ${solarKw > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatNum(solarKw)} kW
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-1">
            <Activity className="w-3 h-3 text-amber-400" />
            <span>{isBn ? 'হিটার ড্র লোড' : 'HEATER LOAD'}</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-amber-300">
            {formatNum(batteryDrainRate)} kW
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>{isBn ? 'অভ্যন্তরীণ বিকিরণ' : 'CORE DOSE'}</span>
          </div>
          <span className={`text-sm sm:text-base font-bold ${protectedDose_mSv < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {formatNum(protectedDose_mSv)} mSv/yr
          </span>
        </div>
      </div>

      {/* Regolith Shield Thickness Slider */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>{isBn ? 'হ্যাবিটেটের উপর চাঁদের মাটির (রেগোলিথ) স্তর:' : 'Regolith Shield Layer Over Habitat:'}</span>
          </span>
          <span className="text-[#52D6FF] font-bold">{formatNum(regolithDepth)} meters</span>
        </div>
        <input 
          type="range"
          min="0"
          max="3.5"
          step="0.5"
          value={regolithDepth}
          onChange={(e) => setRegolithDepth(parseFloat(e.target.value))}
          className="w-full accent-[#52D6FF] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>{isBn ? '০ মিটার (অরক্ষিত)' : '0m (Unprotected: 380 mSv)'}</span>
          <span>{isBn ? '১.৫ মিটার (আংশিক)' : '1.5m (Nominal)'}</span>
          <span>{isBn ? '৩.০ মিটার (সম্পূর্ণ নিরাপদ)' : '3.0m (NASA Baseline: <20 mSv)'}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MARS MOXIE & DUST TAU SIMULATOR
// ==========================================
export const MarsLabWidget: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';

  const [dustTau, setDustTau] = useState<number>(0.5); // 0.4 to 4.5
  const [isMoxieRunning, setIsMoxieRunning] = useState<boolean>(false);
  const [moxieYield, setMoxieYield] = useState<number>(0);

  // Calculations
  // Solar efficiency decays exponentially with optical depth Tau
  const solarEfficiencyPct = Math.max(12, Math.round(100 * Math.exp(-dustTau * 0.75)));
  const commDelayMin = 14; // Average roundtrip radio delay

  const handleRunMoxie = () => {
    sound.playClick();
    setIsMoxieRunning(true);
    setMoxieYield(0);
    setTimeout(() => {
      sound.playSuccess();
      setIsMoxieRunning(false);
      setMoxieYield(10.8); // 10.8 grams of O2/hr
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#140809] border border-red-500/30 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'মঙ্গলের মোক্সি (MOXIE) ও ধূলিঝড় ল্যাব' : 'MARS MOXIE ISRU & DUST DYNAMICS LAB'}
            </h4>
            <span className="text-[10px] font-mono text-red-400">
              {isBn ? 'বাতাস থেকে অক্সিজেন উৎপাদন ও সোলার ক্ষয়' : 'Atmospheric Electrolysis & Solar Obscuration'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
          <Radio className="w-3.5 h-3.5" />
          <span>{isBn ? `রেডিও বিলম্ব: ±${formatNum(commDelayMin)} মিনিট` : `Radio Latency: ±${commDelayMin} mins`}</span>
        </div>
      </div>

      {/* Interactive MOXIE Converter */}
      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NASA MOXIE Solid Oxide Electrolyzer (800°C)</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {isBn 
              ? 'মঙ্গলের ৯৫% CO₂ গ্যাস টেনে নিয়ে তা খাঁটি O₂ তে রূপান্তরিত করে।' 
              : 'Splits atmospheric 95% CO₂ into 98% pure breathable O₂ via solid oxide cells.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunMoxie}
          disabled={isMoxieRunning}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-lg shadow-red-900/30 flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          {isMoxieRunning ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>{isBn ? 'ইলেক্ট্রোলাইসিস চলছে...' : 'ELECTROLYZING...'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBn ? 'মোক্সি টেস্ট চালান' : 'RUN MOXIE TEST'}</span>
            </>
          )}
        </button>
      </div>

      {moxieYield > 0 && (
        <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs font-mono text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'সফল রূপান্তর: ২ CO₂ ➔ ২ CO + O₂ (বিশুদ্ধ অক্সিজেন)' : 'Conversion Verified: 2 CO₂ ➔ 2 CO + O₂ (98% Pure)'}</span>
          </div>
          <span className="font-bold text-emerald-200">+{formatNum(moxieYield)} g/hr O₂</span>
        </div>
      )}

      {/* Dust Storm Optical Depth (Tau) Slider */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBn ? 'মঙ্গলের বায়ুমণ্ডলীয় ধূলিকণার মাত্রা (Optical Depth τ):' : 'Martian Dust Optical Depth (Tau τ):'}</span>
          </span>
          <span className="text-amber-400 font-bold">τ = {formatNum(dustTau)}</span>
        </div>
        <input 
          type="range"
          min="0.3"
          max="4.0"
          step="0.1"
          value={dustTau}
          onChange={(e) => setDustTau(parseFloat(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <span className="text-slate-400">
            {isBn ? 'সৌর প্যানেলের কার্যক্ষমতা:' : 'Solar Array Generation:'}
          </span>
          <span className={`font-bold ${solarEfficiencyPct < 30 ? 'text-rose-400 animate-pulse' : solarEfficiencyPct < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {formatNum(solarEfficiencyPct)}% {solarEfficiencyPct < 30 && (isBn ? '(বিপদ: রিজার্ভ ব্যাটারি প্রয়োজন!)' : '(CRITICAL BROWNOUT)')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CLOSED-LOOP WATER RECOVERY SIMULATOR
// ==========================================
export const WaterLabWidget: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';

  const [crewCount, setCrewCount] = useState<number>(4);
  const intakeLitersPerCrew = 2.5; // L/day
  const totalIntake = crewCount * intakeLitersPerCrew; // 10 L
  const recoveryEfficiency = 0.984; // 98.4% NASA ISS standard
  const recycledOutput = Math.round(totalIntake * recoveryEfficiency * 10) / 10;
  const makeupLoss = Math.round((totalIntake - recycledOutput) * 100) / 100;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#06101E] border border-emerald-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'ইসিএলএস ক্লোজড-লুপ পানি রিসাইক্লিং ল্যাব' : 'CLOSED-LOOP ECLSS WATER RECOVERY LAB'}
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">
              {isBn ? '৯৮.৪% পুনর্ব্যবহার দক্ষতা ও বিশুদ্ধকরণ' : '98.4% Recovery Efficiency Standard (ISS Heritage)'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-center text-xs">
        <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'নভোচারীদের দৈনিক পানির চাহিদা' : 'TOTAL CREW DEMAND'}</span>
          <span className="text-sm sm:text-base font-bold text-white">{formatNum(totalIntake)} L / day</span>
        </div>
        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40">
          <span className="text-[10px] text-emerald-400 block mb-1">{isBn ? 'রিসাইকেল করা বিশুদ্ধ খাবার পানি' : 'RECYCLED POTABLE WATER'}</span>
          <span className="text-sm sm:text-base font-bold text-emerald-300">+{formatNum(recycledOutput)} L / day</span>
        </div>
        <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'ঘাটতি / মেক-আপ রিজার্ভ' : 'NET MAKEUP WATER NEEDED'}</span>
          <span className="text-sm sm:text-base font-bold text-amber-300">{formatNum(makeupLoss)} L / day</span>
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">{isBn ? 'নভোচারীর সংখ্যা নির্বাচন করো:' : 'Select Expedition Crew Count:'}</span>
          <span className="text-emerald-400 font-bold">{formatNum(crewCount)} Astronauts</span>
        </div>
        <input 
          type="range"
          min="2"
          max="8"
          step="1"
          value={crewCount}
          onChange={(e) => setCrewCount(parseInt(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

// ==========================================
// 4. RADIATION BARRIER STOPPING POWER
// ==========================================
export const RadiationLabWidget: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [shieldMaterial, setShieldMaterial] = useState<'lead' | 'regolith' | 'water'>('water');

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0F071D] border border-purple-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'মহাকাশ বিকিরণ শোষণ ও কণা সংঘর্ষ ল্যাব' : 'DEEP SPACE RADIATION SHIELDING LAB'}
            </h4>
            <span className="text-[10px] font-mono text-purple-400">
              {isBn ? 'সীসা বনাম পানি ও চাঁদের মাটির পারমাণবিক তুলনা' : 'Secondary Fragmentation: Heavy Lead vs Hydrogenous Absorbers'}
            </span>
          </div>
        </div>
      </div>

      {/* Material Selector Buttons */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => {
            sound.playWarning();
            setShieldMaterial('lead');
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            shieldMaterial === 'lead' ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>⚠️ {isBn ? 'সীসা (Lead)' : 'Heavy Lead (Pb)'}</span>
          <span className="text-[10px] text-rose-400 font-normal">{isBn ? 'বিপজ্জনক কণা বিস্ফোরণ' : 'Bremsstrahlung Risk'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShieldMaterial('regolith');
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            shieldMaterial === 'regolith' ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🌕 {isBn ? 'রেগোলিথ (মাটি)' : 'Regolith Soil'}</span>
          <span className="text-[10px] text-amber-400 font-normal">{isBn ? 'প্রাকৃতিক পুরু স্তর' : 'In-Situ Barrier'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playSuccess();
            setShieldMaterial('water');
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            shieldMaterial === 'water' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>💧 {isBn ? 'পানি ও প্লাস্টিক' : 'Water & Polyethylene'}</span>
          <span className="text-[10px] text-emerald-400 font-normal">{isBn ? 'সেরা হাইড্রোজেন শোষণ' : 'Optimal Stopping Power'}</span>
        </button>
      </div>

      {/* Physics Result Card */}
      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-sans leading-relaxed">
        {shieldMaterial === 'lead' && (
          <div className="text-rose-300 space-y-1">
            <span className="font-bold font-mono text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'কেন সীসা মহাকাশে ক্ষতিকর?' : 'Why Lead Fails in Deep Space:'}</span>
            </span>
            <p>
              {isBn 
                ? 'উচ্চ শক্তির মহাজাগতিক প্রোটন সীসার ভারী নিউক্লিয়াসে আঘাত করলে পরমাণুটি ভেঙে হাজার হাজার ক্ষতিকর গৌণ নিউট্রন ও গামা রশ্মি ছড়ায় (Secondary Fragmentation), যা নভোচারীদের দ্বিগুণ ক্ষতি করে।'
                : 'Heavy atomic nuclei like Lead (Z=82) undergo severe nuclear fragmentation and emit intense secondary Bremsstrahlung radiation upon cosmic ray impact, multiplying radiation damage to crew.'}
            </p>
          </div>
        )}
        {shieldMaterial === 'regolith' && (
          <div className="text-amber-200 space-y-1">
            <span className="font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'চাঁদ ও মঙ্গলের মাটির কার্যকারিতা:' : 'Regolith Attenuation Mechanics:'}</span>
            </span>
            <p>
              {isBn
                ? 'চাঁদের মাটির ৩ মিটার পুরু বাঙ্কার স্তর মহাজাগতিক রশ্মির গতি কমিয়ে নিরাপদে আটকে দেয় এবং চরম তাপমাত্রা থেকে প্রাকৃতিক ইনসুলেশন দেয়।'
                : 'A 2-to-3 meter berm of compacted lunar or Martian regolith attenuates galactic cosmic rays below permissible occupational exposure limits without requiring Earth payload launch mass.'}
            </p>
          </div>
        )}
        {shieldMaterial === 'water' && (
          <div className="text-emerald-200 space-y-1">
            <span className="font-bold font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'পানি কেন মহাকাশের সেরা শিল্ড?' : 'Why Water and Hydrogenous Polymers Win:'}</span>
            </span>
            <p>
              {isBn
                ? 'পানির (H₂O) পরমাণুতে হাইড্রোজেন থাকে। প্রোটনের ভর এবং হাইড্রোজেনের ভর সমান হওয়ায় বিলিয়ার্ড বলের মতো এক কণা অন্য কণার গতিশক্তি সম্পূর্ণ শুষে নেয় কোনো বিষাক্ত ভাঙন ছাড়াই!'
                : 'Hydrogen has almost the exact same mass as incoming cosmic protons. Like billiard balls of identical mass, protons safely transfer their kinetic energy to hydrogen without producing hazardous secondary fragmentation.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. SOLAR POWER & DUST ACCUMULATION LAB
// ==========================================
export const PowerLabWidget: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';

  const [dustCoverage, setDustCoverage] = useState<number>(45); // 0 to 80%
  const [isWiping, setIsWiping] = useState<boolean>(false);

  const baseKw = 48;
  const currentKw = Math.round(baseKw * (1 - dustCoverage / 100));

  const handleWipeDust = () => {
    sound.playClick();
    setIsWiping(true);
    setTimeout(() => {
      sound.playSuccess();
      setDustCoverage(0);
      setIsWiping(false);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07131D] border border-amber-500/30 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'সৌর বিদ্যুৎ উৎপাদন ও ধূলি অপসারণ ল্যাব' : 'SOLAR POWER & DUST ACCUMULATION LAB'}
            </h4>
            <span className="text-[10px] font-mono text-amber-400">
              {isBn ? 'ধূলিকণা জমলে বিদ্যুৎ হ্রাস ও ক্লিনিং টেকনোলজি' : 'Photovoltaic Degradation & Electrostatic Dust Removal'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWipeDust}
          disabled={isWiping || dustCoverage === 0}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-mono text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {isWiping ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>{isBn ? 'পরিষ্কার হচ্ছে...' : 'WIPING...'}</span>
            </>
          ) : (
            <>
              <Wind className="w-3.5 h-3.5" />
              <span>{isBn ? 'ধুলো ঝেড়ে ফেলুন' : 'DEPLOY DUST WIPER'}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-center text-xs">
        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'সোলার ধুলোর স্তর' : 'DUST COATING'}</span>
          <span className={`text-sm sm:text-base font-bold ${dustCoverage > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatNum(dustCoverage)}%
          </span>
        </div>
        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'আসল বিদ্যুৎ উৎপাদন' : 'GENERATION OUTPUT'}</span>
          <span className="text-sm sm:text-base font-bold text-amber-300">
            {formatNum(currentKw)} / {formatNum(baseKw)} kW
          </span>
        </div>
        <div className="p-2.5 col-span-2 sm:col-span-1 bg-slate-900/70 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'গ্রিড স্ট্যাটাস' : 'GRID STATUS'}</span>
          <span className={`text-sm font-bold ${dustCoverage > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {dustCoverage > 50 ? (isBn ? 'ঘাটতি সতর্কবার্তা' : 'POWER DEFICIT') : (isBn ? 'স্বাভাবিক' : 'NOMINAL')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. OXYGEN ELECTROLYSIS & MOLECULE SPLITTER
// ==========================================
export const OxygenLabWidget: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const isBn = language === 'bn';

  const [waterFeedLiters, setWaterFeedLiters] = useState<number>(5.0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [o2ProducedKg, setO2ProducedKg] = useState<number>(4.4);

  const handleElectrolysis = () => {
    sound.playClick();
    setIsRunning(true);
    setTimeout(() => {
      sound.playSuccess();
      // 1 liter of H2O yields ~0.89 kg of O2
      setO2ProducedKg(Math.round(waterFeedLiters * 0.888 * 10) / 10);
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#05111B] border border-cyan-500/30 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'পানি বিশ্লেষণ ও অক্সিজেন উৎপাদন ল্যাব' : 'WATER ELECTROLYSIS & O2 GENERATION LAB'}
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">
              2 H₂O ➔ 2 H₂ + O₂ (Chemical Electrolysis)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleElectrolysis}
          disabled={isRunning}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? (isBn ? 'প্রক্রিয়া চলছে...' : 'SPLITTING...') : (isBn ? 'ইলেক্ট্রোলাইসিস শুরু' : 'START ELECTROLYSIS')}</span>
        </button>
      </div>

      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">{isBn ? 'পানি ফিডস্টক (Water Input):' : 'Water Feedstock Input:'}</span>
          <span className="text-cyan-400 font-bold">{formatNum(waterFeedLiters)} Liters H₂O</span>
        </div>
        <input 
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={waterFeedLiters}
          onChange={(e) => setWaterFeedLiters(parseFloat(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <span className="text-slate-400">{isBn ? 'বিশুদ্ধ অক্সিজেন উৎপাদন ফলন:' : 'Pure O₂ Generated Yield:'}</span>
          <span className="text-emerald-400 font-bold">+{formatNum(o2ProducedKg)} kg O₂ (~{formatNum(Math.round(o2ProducedKg / 0.84))} crew-days)</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. HYDROPONIC BIO-DOME LED SPECTRUM LAB
// ==========================================
export const BioDomeLabWidget: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [spectrumMode, setSpectrumMode] = useState<'white' | 'nasa_par'>('nasa_par');

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#06150D] border border-emerald-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'বায়ো-ডোম স্পেকট্রাম ও সালোকসংশ্লেষণ ল্যাব' : 'BIO-DOME LED SPECTRUM & PAR PHOTOSYNTHESIS LAB'}
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">
              {isBn ? 'উদ্ভিদের জন্য ৮০% লাল ও ২০% নীল আলোর বিজ্ঞান' : 'NASA Veggie & Advanced Plant Habitat Tuning'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setSpectrumMode('white');
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            spectrumMode === 'white' ? 'bg-slate-800 border-slate-400 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>💡 {isBn ? 'সাধারণ সাদা আলো' : 'Generic White Spectrum'}</span>
          <span className="text-[10px] text-slate-400">{isBn ? 'অতিরিক্ত বিদ্যুৎ অপচয়' : 'Standard Baseline'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playSuccess();
            setSpectrumMode('nasa_par');
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            spectrumMode === 'nasa_par' ? 'bg-fuchsia-950/60 border-fuchsia-500 text-fuchsia-300 font-bold shadow-lg shadow-fuchsia-950/40' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span>🌸 {isBn ? 'নাসা টিউনড PAR স্পেকট্রাম' : 'NASA Tuned PAR (Red/Blue)'}</span>
          <span className="text-[10px] text-fuchsia-400">{isBn ? '+৩৫% দ্রুত বৃদ্ধি, কম বিদ্যুৎ' : '80% 660nm + 20% 460nm'}</span>
        </button>
      </div>

      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
        <span className="text-slate-300">{isBn ? 'সালোকসংশ্লেষণ দক্ষতা:' : 'Photosynthetic Efficiency:'}</span>
        <span className={`font-bold ${spectrumMode === 'nasa_par' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {spectrumMode === 'nasa_par' ? (isBn ? '৯৪% (সর্বোচ্চ ক্লোরোফিল শোষণ)' : '94% (Max Chlorophyll Absorption)') : (isBn ? '৫৯% (সবুজ আলো প্রতিফলিত হয়)' : '59% (Excess Green Reflected)')}
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 8. SYSTEMS REDUNDANCY & DUAL FAILOVER LAB
// ==========================================
export const RedundancyLabWidget: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [primaryStatus, setPrimaryStatus] = useState<'online' | 'failed'>('online');
  const [backupStatus, setBackupStatus] = useState<'standby' | 'active'>('standby');

  const handleSimulateFailure = () => {
    sound.playWarning();
    setPrimaryStatus('failed');
    setTimeout(() => {
      sound.playSuccess();
      setBackupStatus('active');
    }, 600);
  };

  const handleReset = () => {
    sound.playClick();
    setPrimaryStatus('online');
    setBackupStatus('standby');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#090D1A] border border-sky-500/30 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-500/40 text-[#52D6FF]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
              {isBn ? 'এন+১ রিডান্ড্যান্সি ও স্বয়ংক্রিয় ফেইলওভার ল্যাব' : 'N+1 REDUNDANCY & DUAL FAILOVER LAB'}
            </h4>
            <span className="text-[10px] font-mono text-sky-400">
              {isBn ? 'মহাকাশ প্রকৌশল নীতি: দুটি হলো একটি, একটি হলো শূন্য' : 'Aerospace Rule: Two is One, and One is None'}
            </span>
          </div>
        </div>

        {primaryStatus === 'online' ? (
          <button
            type="button"
            onClick={handleSimulateFailure}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            {isBn ? 'প্রাইমারি ভালভ ফেইল করান' : 'SIMULATE PRIMARY FAILURE'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 cursor-pointer transition-all"
          >
            {isBn ? 'রিসেট করুন' : 'RESET SYSTEM'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs text-center">
        <div className={`p-3 rounded-xl border ${primaryStatus === 'online' ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/60 text-rose-300'}`}>
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'প্রাইমারি পাম্প এ' : 'PRIMARY PUMP A'}</span>
          <span className="font-bold">{primaryStatus === 'online' ? '● ONLINE' : '✖ OFFLINE (FAULT)'}</span>
        </div>

        <div className={`p-3 rounded-xl border ${backupStatus === 'active' ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
          <span className="text-[10px] text-slate-400 block mb-1">{isBn ? 'ব্যাকআপ পাম্প বি' : 'BACKUP PUMP B'}</span>
          <span className="font-bold">{backupStatus === 'active' ? '● ACTIVE (AUTOSWITCH)' : 'STANDBY'}</span>
        </div>
      </div>
    </div>
  );
};
