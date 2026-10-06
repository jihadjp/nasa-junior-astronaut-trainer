// Route /mission/setup : Step-Based Crew, Base & Difficulty Setup
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { CrewSelector } from '../components/setup/CrewSelector';
import { BaseBuilder } from '../components/setup/BaseBuilder';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Building2, 
  Sliders, 
  Rocket, 
  MapPin, 
  Heart, 
  Eye 
} from 'lucide-react';
import type { ModuleType, BaseModule, MissionDuration } from '../types/game';

type SetupStep = 'location' | 'crew' | 'base' | 'difficulty' | 'launch';

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    destConfig, 
    crewCountConfig, 
    setCrewCountConfig,
    durationConfig, 
    setDurationConfig,
    modeConfig, 
    setModeConfig,
    handleFinishBase
  } = useMission();
  const { t, formatNum, language } = useLanguage();

  const [currentStep, setCurrentStep] = useState<SetupStep>('crew'); // starts at Crew since location was picked in /mission

  // Cached module & budget configuration from BaseBuilder
  const [builtModules, setBuiltModules] = useState<Record<ModuleType, BaseModule> | null>(null);
  const [customBudget, setCustomBudget] = useState<{ extraSpares: number; extraFood: number }>({ extraSpares: 0, extraFood: 0 });

  const steps: Array<{ id: SetupStep; label: string; icon: React.ReactNode }> = [
    { id: 'location', label: t('setup.step.loc'), icon: <MapPin className="w-4 h-4" /> },
    { id: 'crew', label: t('setup.step.crew'), icon: <Users className="w-4 h-4" /> },
    { id: 'base', label: t('setup.step.base'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'difficulty', label: t('setup.step.difficulty'), icon: <Sliders className="w-4 h-4" /> },
    { id: 'launch', label: t('setup.step.review'), icon: <Rocket className="w-4 h-4" /> },
  ];

  const handleBaseBuilderDone = (modules: Record<ModuleType, BaseModule>, budget: { extraSpares: number; extraFood: number }) => {
    sound.playClick();
    setBuiltModules(modules);
    setCustomBudget(budget);
    setCurrentStep('difficulty');
  };

  const handleProceedToBriefing = () => {
    sound.playClick();
    if (builtModules) {
      handleFinishBase(builtModules, customBudget);
    } else {
      // If user jumped steps, initialize with default base modules
      navigate('/mission/briefing');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
        {/* Step Progression Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <div className="text-[10px] font-mono text-[#52D6FF] uppercase tracking-wider mb-0.5">
                {t('setup.badge')}
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                {t('setup.title')}
              </h1>
            </div>

            {/* Stepper Breadcrumb Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
              {steps.map((st) => {
                const isActive = currentStep === st.id;
                const isPassed = 
                  (st.id === 'location') ||
                  (st.id === 'crew' && currentStep !== 'crew' && currentStep !== 'location') ||
                  (st.id === 'base' && (currentStep === 'difficulty' || currentStep === 'launch')) ||
                  (st.id === 'difficulty' && currentStep === 'launch');

                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      sound.playClick();
                      if (st.id === 'location') navigate('/mission');
                      else setCurrentStep(st.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#52D6FF] text-slate-950 font-bold shadow-lg shadow-[#52D6FF]/20'
                        : isPassed
                        ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700/80 border border-slate-700'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : st.icon}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col justify-center">
          {/* STEP 1: Location Review */}
          {currentStep === 'location' && (
            <div className="max-w-xl mx-auto w-full p-6 rounded-2xl bg-[#0B1222] border border-slate-800 text-center animate-fadeIn">
              <span className="text-4xl block mb-2">{destConfig === 'moon' ? '🌙' : '🔴'}</span>
              <div className="text-xs font-mono text-slate-400 mb-1">{t('setup.loc.selected')}</div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {destConfig === 'moon' ? t('dest.moon.name') : t('dest.mars.name')}
              </h2>
              <p className="text-xs text-slate-300 font-sans mb-6">
                {destConfig === 'moon' ? t('dest.moon.loc') : t('dest.mars.loc')}
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/mission')}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all"
                >
                  {t('setup.loc.change')}
                </button>
                <button
                  onClick={() => setCurrentStep('crew')}
                  className="px-6 py-2 rounded-xl bg-[#52D6FF] text-slate-950 text-xs font-mono font-bold hover:bg-[#38BDF8] transition-all flex items-center gap-1.5"
                >
                  <span>{t('common.continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Crew Selection */}
          {currentStep === 'crew' && (
            <div className="animate-fadeIn">
              <CrewSelector
                crewCount={crewCountConfig}
                onSetCrewCount={setCrewCountConfig}
                onNext={() => setCurrentStep('base')}
                onBack={() => navigate('/mission')}
              />
            </div>
          )}

          {/* STEP 3: Base Builder Modules */}
          {currentStep === 'base' && (
            <div className="animate-fadeIn">
              <BaseBuilder
                onCompleteBase={handleBaseBuilderDone}
                onBack={() => setCurrentStep('crew')}
              />
            </div>
          )}

          {/* STEP 4: Difficulty & Duration */}
          {currentStep === 'difficulty' && (
            <div className="max-w-3xl mx-auto w-full p-6 sm:p-8 rounded-2xl bg-[#0B1222] border border-slate-800 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {t('setup.diff.title')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  {t('setup.diff.desc')}
                </p>
              </div>

              {/* Mode Selection (Junior vs Commander) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Junior Mode */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setModeConfig('junior');
                  }}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    modeConfig === 'junior'
                      ? 'bg-sky-950/30 border-[#52D6FF] ring-1 ring-[#52D6FF] shadow-lg shadow-[#52D6FF]/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Heart className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-display font-bold text-sm text-white">
                      {t('setup.diff.junior')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('setup.diff.junior.desc')}
                  </p>
                </div>

                {/* Commander Mode */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setModeConfig('commander');
                  }}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    modeConfig === 'commander'
                      ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Eye className="w-5 h-5 text-amber-400" />
                    <h3 className="font-display font-bold text-sm text-white">
                      {t('setup.diff.commander')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('setup.diff.commander.desc')}
                  </p>
                </div>
              </div>

              {/* Duration Selection (30 / 60 / 90 Days) */}
              <div className="mb-8">
                <label className="text-xs font-mono text-slate-300 font-bold block mb-3 text-center sm:text-left">
                  {t('setup.duration.title')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { days: 30 as MissionDuration, label: t('setup.duration.30') },
                    { days: 60 as MissionDuration, label: t('setup.duration.60') },
                    { days: 90 as MissionDuration, label: t('setup.duration.90') },
                  ].map((d) => (
                    <button
                      key={d.days}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDurationConfig(d.days);
                      }}
                      className={`p-3.5 rounded-xl border text-xs font-mono font-bold transition-all text-center ${
                        durationConfig === d.days
                          ? 'bg-[#52D6FF] text-slate-950 border-[#52D6FF] shadow-md'
                          : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep('base')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back')}</span>
                </button>
                <button
                  onClick={() => setCurrentStep('launch')}
                  className="px-6 py-2.5 rounded-xl bg-[#52D6FF] hover:bg-[#38BDF8] text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>{t('common.continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Launch */}
          {currentStep === 'launch' && (
            <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 rounded-2xl bg-[#0B1222] border border-slate-800 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <Rocket className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-2">
                {language === 'bn' ? 'ফ্লাইট প্রস্তুতি সম্পন্ন' : 'Expedition Flight Ready'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                {language === 'bn' 
                  ? 'তোমার আউটপোস্ট জীবনরক্ষা ব্যবস্থা ও নভোচারী দল প্রস্তুত। এখন মিশন ব্রিফিংয়ে অংশ নাও।' 
                  : 'Your outpost architecture, life support loops, and crew roster are verified. Proceed to flight briefing.'}
              </p>

              {/* Summary Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-xs font-mono bg-[#060B18] p-4 rounded-xl border border-slate-800">
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'অবস্থান' : 'Location'}</span>
                  <span className="font-bold text-white capitalize">{destConfig}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'নভোচারী' : 'Crew'}</span>
                  <span className="font-bold text-white">{formatNum(crewCountConfig)} {language === 'bn' ? 'জন' : 'Astronauts'}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'সময়কাল' : 'Duration'}</span>
                  <span className="font-bold text-white">{formatNum(durationConfig)} {language === 'bn' ? 'দিন' : 'Days'}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'মোড' : 'Mode'}</span>
                  <span className="font-bold text-[#52D6FF] capitalize">{modeConfig}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentStep('difficulty')}
                  className="px-5 py-3 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back')}</span>
                </button>

                <button
                  onClick={handleProceedToBriefing}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl hover:shadow-emerald-500/25 hover:scale-105 transition-all"
                >
                  <span>{t('setup.btn.briefing')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
