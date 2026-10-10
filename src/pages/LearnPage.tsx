// Route /learn : NASA Junior Astronaut Flight Academy & Interactive STEM Simulation Labs
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useLanguage } from '../i18n/LanguageContext';
import { useMission } from '../context/MissionContext';
import { sound } from '../sound/audioEngine';
import { EDUCATIONAL_ARTICLES } from '../data/educationalContent';
import { CadetQuizCertificate } from '../components/learn/CadetQuizCertificate';
import { NasaDataSourcesDirectory } from '../components/learn/NasaDataSourcesDirectory';
import {
  MoonLabWidget,
  MarsLabWidget,
  WaterLabWidget,
  RadiationLabWidget,
  PowerLabWidget,
  OxygenLabWidget,
  BioDomeLabWidget,
  RedundancyLabWidget
} from '../components/learn/InteractiveLabWidgets';
import { 
  Sparkles, 
  ExternalLink, 
  Layers, 
  FileText, 
  Rocket, 
  Globe, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Activity,
  Compass,
  Zap,
  Droplets,
  Wind,
  Shield,
  Radio
} from 'lucide-react';

type TrainingTrack = 'worlds' | 'eclss' | 'cert';
type LearnTab = 'moon' | 'mars' | 'power' | 'water' | 'oxygen' | 'food' | 'radiation' | 'missions' | 'quiz' | 'data';

export const LearnPage: React.FC = () => {
  const { language, formatNum } = useLanguage();
  const { gameState, hasSavedMission } = useMission();
  const isBn = language === 'bn';

  const [activeTrack, setActiveTrack] = useState<TrainingTrack>('worlds');
  const [activeTab, setActiveTab] = useState<LearnTab>('moon');

  // Handle switching training track
  const handleTrackChange = (track: TrainingTrack) => {
    sound.playClick();
    setActiveTrack(track);
    if (track === 'worlds') setActiveTab('moon');
    if (track === 'eclss') setActiveTab('power');
    if (track === 'cert') setActiveTab('quiz');
  };

  // Handle switching sub-topic
  const handleTabChange = (tabId: LearnTab) => {
    sound.playClick();
    setActiveTab(tabId);
  };

  // Map tab to educational article
  const getArticle = () => {
    switch (activeTab) {
      case 'power': return EDUCATIONAL_ARTICLES['power_grids_dust'];
      case 'water': return EDUCATIONAL_ARTICLES['eclss_water_recovery'];
      case 'oxygen': return EDUCATIONAL_ARTICLES['oxygen_generation_electrolysis'];
      case 'food': return EDUCATIONAL_ARTICLES['plant_biology_microg'];
      case 'radiation': return EDUCATIONAL_ARTICLES['radiation_physics'];
      case 'missions': return EDUCATIONAL_ARTICLES['systems_engineering_redundancy'];
      default: return null;
    }
  };

  const article = getArticle();

  return (
    <div className="w-full min-h-screen bg-[#040814] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-7 flex-1 flex flex-col gap-5 sm:gap-6 animate-fadeIn">
        
        {/* ACADEMY FLIGHT COMMAND HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-[#081022] border border-[#52D6FF]/30 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#52D6FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101E36] border border-[#52D6FF]/40 text-[#52D6FF] text-[11px] font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NASA ARTEMIS // STEM TRAINING ACADEMY</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {isBn ? 'জুনিয়র নভোচারী বিজ্ঞান ও প্রকৌশল একাডেমি' : 'Junior Astronaut Flight Academy & Science Labs'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
              {isBn 
                ? 'চাঁদ ও মঙ্গলে নভোচারীদের বাঁচিয়ে রাখার আসল মহাকাশ পদার্থবিজ্ঞান, ইসিএলএস লাইফ সাপোর্ট ও বেঁচে থাকার কৌশল আয়ত্ত করো।' 
                : 'Master the real aerospace physics, closed-loop ECLSS life support engineering, and planetary survival science that keep astronauts alive.'}
            </p>
          </div>

          {/* Quick Mission Play Shortcut */}
          <div className="shrink-0 relative z-10 flex items-center">
            <Link
              to="/mission/simulation"
              onClick={() => sound.playClick()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#3B82F6] hover:from-[#38bdf8] hover:to-[#2563eb] text-slate-950 font-mono text-xs font-bold shadow-lg shadow-[#00D4FF]/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <Rocket className="w-4 h-4 fill-current" />
              <span>
                {hasSavedMission 
                  ? (isBn ? `সিমুলেশনে ফিরুন (দিন ${formatNum(gameState.missionDay)})` : `RETURN TO MISSION (SOL ${gameState.missionDay})`)
                  : (isBn ? 'সিমুলেশন খেলুন' : 'LAUNCH SIMULATION')}
              </span>
            </Link>
          </div>
        </div>

        {/* 3-TRACK SEGMENTED TRAINING NAVIGATOR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Track 1: Planetary Worlds */}
          <button
            type="button"
            onClick={() => handleTrackChange('worlds')}
            className={`p-3 sm:p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
              activeTrack === 'worlds'
                ? 'bg-[#101D35] border-[#52D6FF] shadow-lg shadow-[#52D6FF]/15 text-white'
                : 'bg-[#080E1C] hover:bg-[#0E1729] border-slate-800 text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTrack === 'worlds' ? 'bg-[#52D6FF]/20 text-[#52D6FF]' : 'bg-slate-900 text-slate-500'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
                {isBn ? 'ট্র্যাক ০১' : 'TRACK 01'}
              </span>
              <h3 className="text-xs sm:text-sm font-display font-bold">
                {isBn ? '🪐 গ্রহীয় পরিবেশ (Planets)' : '🪐 Planetary Worlds'}
              </h3>
            </div>
          </button>

          {/* Track 2: ECLSS & Survival Labs */}
          <button
            type="button"
            onClick={() => handleTrackChange('eclss')}
            className={`p-3 sm:p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
              activeTrack === 'eclss'
                ? 'bg-[#101D35] border-[#52D6FF] shadow-lg shadow-[#52D6FF]/15 text-white'
                : 'bg-[#080E1C] hover:bg-[#0E1729] border-slate-800 text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTrack === 'eclss' ? 'bg-[#52D6FF]/20 text-[#52D6FF]' : 'bg-slate-900 text-slate-500'}`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
                {isBn ? 'ট্র্যাক ০২' : 'TRACK 02'}
              </span>
              <h3 className="text-xs sm:text-sm font-display font-bold">
                {isBn ? '🔬 ইসিএলএস ল্যাব (ECLSS)' : '🔬 ECLSS & Life Support Labs'}
              </h3>
            </div>
          </button>

          {/* Track 3: Flight Certification & Data */}
          <button
            type="button"
            onClick={() => handleTrackChange('cert')}
            className={`p-3 sm:p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
              activeTrack === 'cert'
                ? 'bg-[#101D35] border-[#52D6FF] shadow-lg shadow-[#52D6FF]/15 text-white'
                : 'bg-[#080E1C] hover:bg-[#0E1729] border-slate-800 text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTrack === 'cert' ? 'bg-[#52D6FF]/20 text-[#52D6FF]' : 'bg-slate-900 text-slate-500'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
                {isBn ? 'ট্র্যাক ০৩' : 'TRACK 03'}
              </span>
              <h3 className="text-xs sm:text-sm font-display font-bold">
                {isBn ? '🎖️ ক্যাডেট সনদ ও নাসা ডেটা' : '🎖️ Certification & NASA Data'}
              </h3>
            </div>
          </button>
        </div>

        {/* SUB-TOPIC PILLS BAR FOR ACTIVE TRACK */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {activeTrack === 'worlds' && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange('moon')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'moon'
                    ? 'bg-[#52D6FF] text-slate-950 shadow-md shadow-[#52D6FF]/25'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <span>🌙</span>
                <span>{isBn ? 'চাঁদ: চরম শূন্যতা ও রাত' : 'The Moon (Extreme Vacuum)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('mars')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'mars'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <span>🔴</span>
                <span>{isBn ? 'মঙ্গল: ধূলিঝড় ও মোক্সি' : 'Mars (Dust & MOXIE)'}</span>
              </button>
            </>
          )}

          {activeTrack === 'eclss' && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange('power')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'power'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'বিদ্যুৎ ও ধূলিকণা' : 'Power & Dust'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('water')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'water'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'পানি রিসাইক্লিং' : 'Water Recovery'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('oxygen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'oxygen'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isBn ? 'অক্সিজেন প্রযুক্তি' : 'Oxygen Systems'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('food')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'food'
                    ? 'bg-green-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <span>🌱</span>
                <span>{isBn ? 'উদ্ভিদ ও বায়ো-ডোম' : 'Hydroponic Food'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('radiation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'radiation'
                    ? 'bg-purple-500 text-white font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>{isBn ? 'বিকিরণ ও সুরক্ষাবলয়' : 'Radiation Shielding'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('missions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'missions'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>{isBn ? 'যন্ত্রাংশ ও রিডান্ড্যান্সি' : 'Systems Redundancy'}</span>
              </button>
            </>
          )}

          {activeTrack === 'cert' && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange('quiz')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <span>🎖️</span>
                <span>{isBn ? 'ক্যাডেট পরীক্ষা ও অফিসিয়াল সার্টিফিকেট' : 'Cadet Flight Exam & Certificate'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('data')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'data'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-[#0C1527] hover:bg-[#121F3A] text-slate-300 border border-slate-800'
                }`}
              >
                <span>🛰️</span>
                <span>{isBn ? 'নাসা আসল ওপেন ডেটাসেট পোর্টাল' : 'NASA Open Data Repositories'}</span>
              </button>
            </>
          )}
        </div>

        {/* MAIN INTERACTIVE ACADEMY WORKSPACE CONTAINER */}
        <div className="bg-[#070D1B] border border-slate-800 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-6">
          
          {/* ==================================================== */}
          {/* TAB 1: THE MOON */}
          {/* ==================================================== */}
          {activeTab === 'moon' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Interactive Moon Simulator Widget */}
              <MoonLabWidget />

              {/* Condensed Scientific Dossier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0C1527] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                    <Compass className="w-4 h-4" />
                    <span>{isBn ? 'শ্যাকলটন ক্র্যাটার ও পার্মানেন্টলি শ্যাডো রিজিয়ন (PSR)' : 'Permanently Shadowed Craters (PSRs)'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {isBn
                      ? 'চাঁদের দক্ষিণ মেরুর গভীর খাদগুলোতে কোটি কোটি বছর ধরে সূর্যের আলো পড়েনি (-২৪৬°C)। সেখানে আনুমানিক ১০০+ মিলিয়ন টন পানির বরফ জমে আছে, যা ভেঙে অক্সিজেন ও রকেট জ্বালানি (LOX/LH₂) তৈরি সম্ভব।'
                      : 'Impact crater floors at the lunar south pole like Shackleton exist in perpetual darkness at -246°C, harboring billions of metric tons of volatile water ice suitable for ISRU propellant and life support.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-300">
                    NASA LOLA & Diviner Radiometer Instrument Verification
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0C1527] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Zap className="w-4 h-4" />
                    <span>{isBn ? '৩৫৪ ঘণ্টার লুনার নাইট এনার্জি চ্যালেঞ্জ' : 'The 14-Day Night Energy Challenge'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {isBn
                      ? 'যেহেতু চাঁদের রাত একটানা ১৪ পৃথিবী দিন (৩৫৪ ঘণ্টা) স্থায়ী হয়, সাধারণ সোলার প্যানেল কাজ করে না। ঘাঁটিতে পর্যাপ্ত তাপ ও শক্তি বজায় রাখতে রিজেনারেটিভ ফুয়েল সেল বা সারফেস ফিশন রিঅ্যাক্টর প্রয়োজন।'
                      : 'With 354 continuous hours of lunar darkness, stationary solar power requires supplemental Regenerative Fuel Cells (RFCs) or Kilopower fission surface reactors to power base thermal heaters.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-300">
                    NASA Artemis Base Camp Electrical Infrastructure Baseline
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: MARS */}
          {/* ==================================================== */}
          {activeTab === 'mars' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Interactive Mars Simulator Widget */}
              <MarsLabWidget />

              {/* Condensed Scientific Dossier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0C1527] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                    <Wind className="w-4 h-4" />
                    <span>{isBn ? 'মঙ্গলের পাতলা বায়ুমণ্ডল ও কার্বন ডাই-অক্সাইড' : 'Thin Martian Atmosphere (95% CO₂)'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {isBn
                      ? 'মঙ্গল গ্রহের বাতাস পৃথিবীর চেয়ে ১০০ গুণ পাতলা (০.৬% চাপ) এবং তার ৯৫% বিষাক্ত CO₂। নাসার পারসিভিয়ারেন্স রোভারের বিশেষ যন্ত্র MOXIE প্রমাণ করেছে যে স্থানীয় বাতাস ভেঙেই খাঁটি অক্সিজেন পাওয়া সম্ভব।'
                      : 'Mars possesses a tenuous atmosphere (0.6% Earth pressure) composed of 95% CO₂. NASA’s MOXIE experiment proved that atmospheric resources can be converted directly into human-breathable oxygen.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-red-300">
                    Perseverance Rover Flight Heritage // 122g O₂ Generated
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0C1527] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                    <Radio className="w-4 h-4" />
                    <span>{isBn ? 'যোগাযোগের বিলম্ব ও স্বায়ত্তশাসন' : 'Radio Latency (4 to 20 Minutes)'}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {isBn
                      ? 'পৃথিবী থেকে মঙ্গলে রেডিও সিগন্যাল যেতে এবং ফিরে আসতে ৪ থেকে ২০ মিনিট সময় লাগে। তাই কোনো জরুরি বিপদে পৃথিবী থেকে তাৎক্ষণিক সাহায্য সম্ভব নয়; ঘাঁটির ক্রুদের সম্পূর্ণ স্বয়ংসম্পূর্ণ হতে হয়।'
                      : 'Light travel time imposes a 4-to-20 minute one-way delay. Astronauts cannot rely on real-time Houston mission overrides and must execute automated ECLSS triage autonomously.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-300">
                    NASA Autonomous Systems & Crew Autonomy Protocol
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TRACK 02: ECLSS & PHYSICS LAB ARTICLES */}
          {/* ==================================================== */}
          {article && (
            <div className="space-y-6 animate-fadeIn">
              {/* Interactive Widget Header based on active tab */}
              {activeTab === 'power' && <PowerLabWidget />}
              {activeTab === 'water' && <WaterLabWidget />}
              {activeTab === 'oxygen' && <OxygenLabWidget />}
              {activeTab === 'food' && <BioDomeLabWidget />}
              {activeTab === 'radiation' && <RadiationLabWidget />}
              {activeTab === 'missions' && <RedundancyLabWidget />}

              {/* Title & Technical Dossier Header */}
              <div className="pt-2">
                <span className="text-xs font-mono text-[#52D6FF] uppercase tracking-wider block mb-1">
                  {(isBn && article.categoryBn) ? article.categoryBn : article.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
                  {(isBn && article.titleBn) ? article.titleBn : article.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  {(isBn && article.subtitleBn) ? article.subtitleBn : article.subtitle}
                </p>
              </div>

              {/* Core Physical Principle Insight Card */}
              <div className="p-4 rounded-xl bg-[#0C1527] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {(isBn && article.simplifiedExplanationBn) 
                  ? article.simplifiedExplanationBn 
                  : article.simplifiedExplanation}
              </div>

              {/* Engineering System Flow Diagram */}
              {article.visualDiagram && (
                <div className="p-4 rounded-xl bg-[#091224] border border-[#52D6FF]/30 shadow-md">
                  <div className="text-[10px] font-mono uppercase text-[#52D6FF] font-bold mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isBn ? 'প্রকৌশল ডায়াগ্রাম পাইপলাইন' : 'ENGINEERING SYSTEM PIPELINE'}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 py-2">
                    {((isBn && article.visualDiagram.labelsBn) ? article.visualDiagram.labelsBn : article.visualDiagram.labels).map((lbl, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className="px-3 py-1.5 rounded-lg bg-[#050B16] border border-slate-700 font-mono text-xs text-white font-bold shadow-sm">
                          {lbl}
                        </div>
                        {idx < arr.length - 1 && (
                          <span className="text-[#52D6FF] font-bold">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
                    {(isBn && article.visualDiagram.captionBn) ? article.visualDiagram.captionBn : article.visualDiagram.caption}
                  </p>
                </div>
              )}

              {/* Verified NASA Flight Heritage Fact Box */}
              <div className="p-4 rounded-xl bg-[#09151A] border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isBn ? 'আসল নাসা মিশন ফ্যাক্ট ও ফ্লাইট হেরিটেজ' : 'VERIFIED NASA MISSION FLIGHT FACT'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {(isBn && article.realNasaMissionFactBn) ? article.realNasaMissionFactBn : article.realNasaMissionFact}
                </p>
              </div>

              {/* Aerospace Physics & Engineering Specifications */}
              {article.advancedEngineeringSpec && (
                <div className="p-4 rounded-xl bg-[#070D1A] border border-slate-800 text-xs font-mono space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {isBn ? 'পদার্থবিজ্ঞান ও প্রকৌশল সূত্র:' : 'PHYSICS & MATHEMATICAL FORMULA:'}
                  </div>
                  <div className="text-[#52D6FF] font-bold text-sm bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    {article.advancedEngineeringSpec.formulaOrMetric}
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">
                    {(isBn && article.advancedEngineeringSpec.descriptionBn)
                      ? article.advancedEngineeringSpec.descriptionBn
                      : article.advancedEngineeringSpec.description}
                  </p>
                  <div className="text-[10px] text-slate-500 pt-1">
                    <span className="text-slate-400 font-bold">Citation: </span>
                    {article.advancedEngineeringSpec.referenceDocument}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TRACK 03: CADET QUIZ & CERTIFICATE */}
          {/* ==================================================== */}
          {activeTab === 'quiz' && (
            <div className="animate-fadeIn">
              <CadetQuizCertificate />
            </div>
          )}

          {/* ==================================================== */}
          {/* TRACK 03: NASA OPEN DATA REPOSITORIES */}
          {/* ==================================================== */}
          {activeTab === 'data' && (
            <div className="animate-fadeIn">
              <NasaDataSourcesDirectory />
            </div>
          )}

          {/* SCIENTIFIC PROVENANCE FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#52D6FF]" />
              <span>NASA Planetary Data System (PDS) & Technical Reports Server (NTRS)</span>
            </span>
            <a
              href="https://www.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#52D6FF] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>NASA.gov Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
