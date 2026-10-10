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
import { getLandingSiteById } from '../data/landingSites';
import { NasaDataBadge } from '../components/common/NasaDataBadge';
import { NasaDataSourceModal } from '../components/nasa/NasaDataSourceModal';
import { NasaTerrainExplorerModal } from '../components/nasa/NasaTerrainExplorerModal';

type SetupStep = 'location' | 'crew' | 'base' | 'difficulty' | 'launch';

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    destConfig, 
    landingSiteConfig,
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
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTerrainModal, setShowTerrainModal] = useState(false);

  const landingSite = getLandingSiteById(landingSiteConfig);
  const siteName = (language === 'bn' && landingSite.nameBn) ? landingSite.nameBn : landingSite.name;

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

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Step Progression Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 sm:pb-4">
            <div>
              <div className="text-[10px] font-mono text-[#52D6FF] uppercase tracking-wider mb-0.5">
                {t('setup.badge')}
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                {t('setup.title')}
              </h1>
            </div>

            {/* Stepper Breadcrumb Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[36px] active:scale-95 ${
                      isActive
                        ? 'bg-[#52D6FF] text-slate-950 font-bold shadow-lg shadow-[#52D6FF]/20'
                        : isPassed
                        ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700/80 border border-slate-700'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="shrink-0">{st.icon}</span>}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real NASA Landing Site Active Context Banner */}
        <div className="mb-4 p-3 rounded-xl bg-[#091122]/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">{destConfig === 'moon' ? '🌙' : '🔴'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white truncate">{siteName}</span>
                <span className="text-[10px] text-slate-400 font-mono">({landingSite.coordinates})</span>
                <NasaDataBadge layer="nasa_data" size="sm" />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{landingSite.elevation_km >= 0 ? `+${formatNum(landingSite.elevation_km)}` : formatNum(landingSite.elevation_km)} km elev</span>
                <span>•</span>
                <span>{formatNum(landingSite.slope_deg)}° slope</span>
                <span>•</span>
                <span className="text-[#52D6FF]">{landingSite.nasaDataset.instrument}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowTerrainModal(true)}
              className="px-2.5 py-1 rounded-lg bg-[#52D6FF]/10 hover:bg-[#52D6FF]/20 border border-[#52D6FF]/30 text-[#52D6FF] text-[11px] font-mono flex items-center gap-1 transition-all"
            >
              <span>{language === 'bn' ? 'ভূখণ্ড প্রোফাইল' : 'Terrain Profile'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/mission')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-all"
            >
              {language === 'bn' ? 'সাইট পরিবর্তন' : 'Change Site'}
            </button>
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col justify-center">
          {/* STEP 1: Location Review */}
          {currentStep === 'location' && (
            <div className="max-w-xl mx-auto w-full p-6 rounded-2xl bg-[#0B1222] border border-slate-800 text-center animate-fadeIn">
              <span className="text-4xl block mb-2">{destConfig === 'moon' ? '🌙' : '🔴'}</span>
              <div className="text-xs font-mono text-slate-400 mb-1">{t('setup.loc.selected')}</div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">
                {siteName}
              </h2>
              <div className="text-xs font-mono text-[#52D6FF] mb-3">
                {landingSite.coordinates} • {landingSite.nasaDataset.mission}
              </div>
              <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
                {(language === 'bn' && landingSite.suitabilityReasonBn) ? landingSite.suitabilityReasonBn : landingSite.suitabilityReason}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-[#060B18] p-3 rounded-xl border border-slate-800 text-xs font-mono mb-6 text-center">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'উচ্চতা' : 'Elevation'}</span>
                  <span className="font-bold text-white">{landingSite.elevation_km >= 0 ? `+${formatNum(landingSite.elevation_km)}` : formatNum(landingSite.elevation_km)} km</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'ঢাল' : 'Slope'}</span>
                  <span className="font-bold text-amber-300">{formatNum(landingSite.slope_deg)}°</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'সূর্যালোক' : 'Solar Flux'}</span>
                  <span className="font-bold text-[#52D6FF]">{formatNum(landingSite.solarIlluminationPct)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTerrainModal(true)}
                  className="px-4 py-2 rounded-xl border border-[#52D6FF]/40 bg-[#52D6FF]/10 text-xs font-mono text-[#52D6FF] hover:bg-[#52D6FF]/20 transition-all"
                >
                  {language === 'bn' ? 'নাসা প্রোফাইল দেখুন' : 'Explore NASA Data'}
                </button>
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
                planet={destConfig}
                siteName={siteName}
              />
            </div>
          )}

          {/* STEP 4: Difficulty & Duration */}
          {currentStep === 'difficulty' && (
            <div className="max-w-3xl mx-auto w-full p-4 sm:p-8 rounded-2xl bg-[#0B1222] border border-slate-800 animate-fadeIn">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
                  {t('setup.diff.title')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  {t('setup.diff.desc')}
                </p>
              </div>

              {/* Mode Selection (Junior vs Commander) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Junior Mode */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setModeConfig('junior');
                  }}
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] ${
                    modeConfig === 'junior'
                      ? 'bg-sky-950/30 border-[#52D6FF] ring-1 ring-[#52D6FF] shadow-lg shadow-[#52D6FF]/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                    <Heart className="w-5 h-5 text-emerald-400 shrink-0" />
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
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] ${
                    modeConfig === 'commander'
                      ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                    <Eye className="w-5 h-5 text-amber-400 shrink-0" />
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
              <div className="mb-6 sm:mb-8">
                <label className="text-xs font-mono text-slate-300 font-bold block mb-2.5 text-center sm:text-left">
                  {t('setup.duration.title')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                      className={`p-3 sm:p-3.5 rounded-xl border text-xs font-mono font-bold transition-all text-center min-h-[42px] active:scale-95 ${
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
              <div className="flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep('base')}
                  className="min-h-[42px] px-4 sm:px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back')}</span>
                </button>
                <button
                  onClick={() => setCurrentStep('launch')}
                  className="min-h-[42px] px-5 sm:px-6 py-2.5 rounded-xl bg-[#52D6FF] hover:bg-[#38BDF8] text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <span>{t('common.continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Launch */}
          {currentStep === 'launch' && (
            <div className="max-w-2xl mx-auto w-full p-4 sm:p-8 rounded-2xl bg-[#0B1222] border border-slate-800 text-center animate-fadeIn">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-3 sm:mb-4">
                <Rocket className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <h2 className="text-xl sm:text-3xl font-display font-extrabold text-white mb-2">
                {language === 'bn' ? 'ফ্লাইট প্রস্তুতি সম্পন্ন' : 'Expedition Flight Ready'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-5 sm:mb-6">
                {language === 'bn' 
                  ? 'তোমার আউটপোস্ট জীবনরক্ষা ব্যবস্থা ও নভোচারী দল প্রস্তুত। এখন মিশন ব্রিফিংয়ে অংশ নাও।' 
                  : 'Your outpost architecture, life support loops, and crew roster are verified. Proceed to flight briefing.'}
              </p>

              {/* Summary Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8 text-xs font-mono bg-[#060B18] p-3.5 sm:p-4 rounded-xl border border-slate-800 text-left">
                <div className="text-slate-300 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'অবতরণ সাইট' : 'Landing Site'}</span>
                  <span className="font-bold text-white truncate block">{siteName}</span>
                  <span className="text-[10px] text-sky-400 font-mono block">{landingSite.coordinates}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'ভূখণ্ড (LOLA/MOLA)' : 'Topography (LOLA/MOLA)'}</span>
                  <span className="font-bold text-[#52D6FF] block">
                    {landingSite.elevation_km >= 0 ? `+${formatNum(landingSite.elevation_km)}` : formatNum(landingSite.elevation_km)} km | {formatNum(landingSite.slope_deg)}°
                  </span>
                  <span className="text-[10px] text-slate-400 block">{landingSite.constructionSuitability}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'নভোচারী' : 'Crew'}</span>
                  <span className="font-bold text-white">{formatNum(crewCountConfig)} {language === 'bn' ? 'জন' : 'Crew'}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'সময়কাল' : 'Duration'}</span>
                  <span className="font-bold text-white">{formatNum(durationConfig)} {language === 'bn' ? 'দিন' : 'Days'}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[10px] uppercase">{language === 'bn' ? 'মোড' : 'Mode'}</span>
                  <span className="font-bold text-[#52D6FF] capitalize">{modeConfig}</span>
                </div>
                <div className="text-slate-300 flex flex-col justify-center">
                  <NasaDataBadge layer="nasa_data" size="sm" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep('difficulty')}
                  className="min-h-[42px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back')}</span>
                </button>

                <button
                  onClick={handleProceedToBriefing}
                  className="min-h-[42px] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-bold text-xs sm:text-base flex items-center gap-2 shadow-xl hover:shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  <span>{t('setup.btn.briefing')}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* NASA Modals */}
      <NasaTerrainExplorerModal
        site={landingSite}
        isOpen={showTerrainModal}
        onClose={() => setShowTerrainModal(false)}
        onOpenSourceDetails={() => {
          setShowTerrainModal(false);
          setShowSourceModal(true);
        }}
      />

      <NasaDataSourceModal
        dataset={landingSite.nasaDataset}
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
      />
    </div>
  );
};
