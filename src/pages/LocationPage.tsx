// Route /mission : Real NASA Planetary Data Landing Site Selection
// Grounded in LRO LOLA, Diviner, MGS MOLA, and MRO SHARAD datasets

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  X,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Database
} from 'lucide-react';
import type { DestinationType, LandingSiteConfig } from '../types/game';
import { getLandingSitesForDestination, getLandingSiteById } from '../data/landingSites';
import { NasaDataBadge } from '../components/common/NasaDataBadge';
import { NasaDataSourceModal } from '../components/nasa/NasaDataSourceModal';
import { NasaTerrainExplorerModal } from '../components/nasa/NasaTerrainExplorerModal';

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { destConfig, setDestConfig, landingSiteConfig, setLandingSiteConfig } = useMission();
  const { t, formatNum, language } = useLanguage();

  const [activeEduModal, setActiveEduModal] = useState<DestinationType | null>(null);
  const [activeExplorerSite, setActiveExplorerSite] = useState<LandingSiteConfig | null>(null);
  const [activeSourceSite, setActiveSourceSite] = useState<LandingSiteConfig | null>(null);

  const availableSites = getLandingSitesForDestination(destConfig);
  const selectedSite = getLandingSiteById(landingSiteConfig);

  const handleSelectDest = (dest: DestinationType) => {
    sound.playClick();
    setDestConfig(dest);
    // Auto-select primary landing site for the new planet
    const defaultSite = dest === 'moon' ? 'shackleton_rim' : 'jezero_crater';
    setLandingSiteConfig(defaultSite);
  };

  const handleSelectSite = (siteId: string) => {
    sound.playClick();
    setLandingSiteConfig(siteId);
  };

  const handleContinue = () => {
    sound.playClick();
    navigate('/mission/setup');
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col">
        {/* Header Directive */}
        <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101827] border border-[#52D6FF]/40 text-[#52D6FF] text-[11px] sm:text-xs font-mono mb-2.5 shadow-md">
            <Compass className="w-4 h-4" />
            <span>{t('dest.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-2">
            {t('loc.title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {language === 'bn'
              ? 'নাসার লুনার ও মার্স অরবিটার স্যাটেলাইটের আসল ভূখণ্ড ও উচ্চতা ডেটা ব্যবহার করে তোমার ঘাঁটির জন্য সবচেয়ে উপযুক্ত অবতরণ এলাকা নির্বাচন করো।'
              : 'Select your target destination and choose an authentic landing site grounded in real NASA orbiter elevation, terrain slope, and illumination datasets.'}
          </p>
        </div>

        {/* STEP 1: Planet Choice (Moon vs Mars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Planet 1: Moon */}
          <div
            onClick={() => handleSelectDest('moon')}
            className={`cursor-pointer rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
              destConfig === 'moon'
                ? 'bg-gradient-to-b from-[#0F1B33] to-[#0A1122] border-[#52D6FF] shadow-[0_0_25px_-5px_rgba(82,214,255,0.35)] ring-2 ring-[#52D6FF]'
                : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#131E33]/60'
            }`}
          >
            <div className="h-40 w-full relative overflow-hidden">
              <img
                src="/assets/moon_outpost.jpg"
                alt="NASA Artemis Lunar Base"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1122] via-[#0A1122]/50 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <NasaDataBadge layer="nasa_data" size="sm" label="LRO LOLA & DIVINER" />
              </div>

              {destConfig === 'moon' && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-[11px] font-extrabold flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('common.selected')}</span>
                </div>
              )}

              <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-white drop-shadow-md">
                    {t('dest.moon.name')}
                  </h2>
                  <span className="text-xs font-mono text-[#52D6FF]">
                    {language === 'bn' ? 'নাসা আর্টেমিস অভিযানের বেসলাইন' : 'NASA Artemis Expedition Baseline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0A1122]">
              <div className="grid grid-cols-3 gap-2 bg-[#060B18] p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono mb-2 text-center">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'মাধ্যাকর্ষণ' : 'Gravity'}</span>
                  <span className="font-bold text-white">1.62 m/s²</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'তাপমাত্রা' : 'Temp Range'}</span>
                  <span className="font-bold text-rose-300">-130° to +120°</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'দূরত্ব' : 'Flight Time'}</span>
                  <span className="font-bold text-sky-300">3 Days</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setActiveEduModal('moon');
                  }}
                  className="text-xs font-mono text-[#52D6FF] hover:text-white flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="underline decoration-dotted">{t('loc.moon.learn')}</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {language === 'bn' ? '৪টি আসল ল্যান্ডিং সাইট' : '4 NASA Sites Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Planet 2: Mars */}
          <div
            onClick={() => handleSelectDest('mars')}
            className={`cursor-pointer rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
              destConfig === 'mars'
                ? 'bg-gradient-to-b from-[#2B1414] to-[#160B0B] border-red-500 shadow-[0_0_25px_-5px_rgba(239,68,68,0.35)] ring-2 ring-red-500'
                : 'bg-[#101827]/70 border-slate-800 hover:border-slate-700 hover:bg-[#1C1720]/60'
            }`}
          >
            <div className="h-40 w-full relative overflow-hidden">
              <img
                src="/assets/mars_outpost.jpg"
                alt="NASA Mars Research Base"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160B0B] via-[#160B0B]/50 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <NasaDataBadge layer="nasa_data" size="sm" label="MGS MOLA & MRO" />
              </div>

              {destConfig === 'mars' && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white font-mono text-[11px] font-extrabold flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('common.selected')}</span>
                </div>
              )}

              <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-white drop-shadow-md">
                    {t('dest.mars.name')}
                  </h2>
                  <span className="text-xs font-mono text-red-400">
                    {language === 'bn' ? 'নাসা মার্স ২০২০ পারসিভিয়ারেন্স বেসলাইন' : 'NASA Mars 2020 Exploration Baseline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#160B0B]">
              <div className="grid grid-cols-3 gap-2 bg-[#060B18] p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono mb-2 text-center">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'মাধ্যাকর্ষণ' : 'Gravity'}</span>
                  <span className="font-bold text-white">3.72 m/s²</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'তাপমাত্রা' : 'Temp Range'}</span>
                  <span className="font-bold text-rose-300">-140° to +20°</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'দূরত্ব' : 'Flight Time'}</span>
                  <span className="font-bold text-amber-300">6-9 Months</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setActiveEduModal('mars');
                  }}
                  className="text-xs font-mono text-red-400 hover:text-white flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="underline decoration-dotted">{t('loc.mars.learn')}</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {language === 'bn' ? '৪টি আসল ল্যান্ডিং সাইট' : '4 NASA Sites Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: REAL TERRAIN-BASED LANDING SITE SELECTION (Requirement 3 & 4) */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#091122] border border-slate-800/90 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#52D6FF]" />
                <h3 className="text-base sm:text-lg font-display font-bold text-white">
                  {language === 'bn'
                    ? `${destConfig === 'moon' ? 'চাঁদ' : 'মঙ্গল'}: বাস্তব ভূখণ্ড অনুযায়ী অবতরণ সাইট বেছে নিন`
                    : `${destConfig === 'moon' ? 'Moon' : 'Mars'}: Select NASA Terrain-Based Landing Site`}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {language === 'bn'
                  ? 'প্রতিটি সাইটের উচ্চতা, ঢাল ও সৌর আলো সরাসরি গেমের সিমুলেশনে প্রভাব ফেলে।'
                  : 'Elevation, surface slope, and illumination directly modify power production and construction difficulty.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <NasaDataBadge layer="nasa_data" size="sm" />
              <button
                onClick={() => setActiveExplorerSite(selectedSite)}
                className="px-3 py-1.5 rounded-lg bg-[#52D6FF]/15 hover:bg-[#52D6FF]/25 border border-[#52D6FF]/40 text-[#52D6FF] font-mono text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'উচ্চতা প্রোফাইল দেখুন' : 'Explore NASA Data'}</span>
              </button>
            </div>
          </div>

          {/* 4 Landing Sites Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSites.map((site) => {
              const isSelected = landingSiteConfig === site.id;
              const name = (language === 'bn' && site.nameBn) ? site.nameBn : site.name;
              const reason = (language === 'bn' && site.suitabilityReasonBn) ? site.suitabilityReasonBn : site.suitabilityReason;

              return (
                <div
                  key={site.id}
                  onClick={() => handleSelectSite(site.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#101E36] border-[#52D6FF] shadow-lg shadow-sky-950/40 ring-2 ring-[#52D6FF]/80'
                      : 'bg-[#060B18]/90 border-slate-800 hover:border-slate-700 hover:bg-[#0D162B]/80'
                  }`}
                >
                  <div>
                    {/* Header: Name + Coordinates + Suitability Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#52D6FF]" />
                          <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#52D6FF] transition-colors">
                            {name}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block ml-3.5">
                          {site.coordinates}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                        site.constructionSuitability === 'GOOD'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : site.constructionSuitability === 'MODERATE'
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      }`}>
                        {site.constructionSuitability}
                      </span>
                    </div>

                    {/* Scientific Measurement Chips (Elevation, Slope, Light, Ice) */}
                    <div className="grid grid-cols-4 gap-1.5 bg-[#091122] p-2 rounded-lg border border-slate-800/80 text-[10px] font-mono text-center mb-2.5">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'উচ্চতা' : 'Elev'}</span>
                        <span className="font-bold text-white">{formatNum(site.elevation_km)} km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'ঢাল' : 'Slope'}</span>
                        <span className="font-bold text-amber-300">{formatNum(site.slope_deg)}°</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'আলো' : 'Sun'}</span>
                        <span className="font-bold text-sky-300">{formatNum(site.solarIlluminationPct)}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">{language === 'bn' ? 'বরফ' : 'Ice'}</span>
                        <span className="font-bold text-emerald-400">{site.subsurfaceIce ? 'YES' : 'NO'}</span>
                      </div>
                    </div>

                    {/* Suitability explanation snippet */}
                    <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">
                      {reason}
                    </p>
                  </div>

                  {/* Footer Actions: ⓘ Why & Explore */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setActiveExplorerSite(site);
                      }}
                      className="text-[#52D6FF] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ভূপ্রাকৃতিক বিশ্লেষণ ও নাসা ডেটা' : 'ⓘ Why? View Terrain Data'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        setActiveSourceSite(site);
                      }}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Database className="w-3 h-3" />
                      <span>{language === 'bn' ? 'উৎস' : 'NASA Source'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Selected: <strong className="text-white">{selectedSite.name}</strong> ({selectedSite.coordinates})
            </span>

            <button
              onClick={handleContinue}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:shadow-[#52D6FF]/25 active:scale-95 transition-all"
            >
              <span>{t('loc.btn.continue')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Planetary Environment Educational Modal */}
      {activeEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-[#0B1222] border border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveEduModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeEduModal === 'moon' ? '🌙' : '🔴'}</span>
              <div>
                <h3 className="text-xl font-display font-bold text-white">
                  {activeEduModal === 'moon' ? t('dest.moon.name') : t('dest.mars.name')}
                </h3>
                <span className="text-xs font-mono text-[#52D6FF]">
                  {activeEduModal === 'moon' ? 'NASA Artemis Scientific Baseline' : 'NASA Mars 2020 Telemetry Baseline'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-6">
              <p>
                {activeEduModal === 'moon' ? t('dest.moon.desc') : t('dest.mars.desc')}
              </p>
              <div className="p-3 rounded-xl bg-[#060B18] border-l-4 border-[#52D6FF] font-mono text-xs text-sky-200">
                {activeEduModal === 'moon' ? t('dest.moon.challenge') : t('dest.mars.challenge')}
              </div>
            </div>

            <button
              onClick={() => setActiveEduModal(null)}
              className="w-full min-h-[42px] py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all active:scale-95"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Terrain Explorer Modal (Section 21) */}
      {activeExplorerSite && (
        <NasaTerrainExplorerModal
          site={activeExplorerSite}
          isOpen={Boolean(activeExplorerSite)}
          onClose={() => setActiveExplorerSite(null)}
          onOpenSourceDetails={() => {
            setActiveSourceSite(activeExplorerSite);
            setActiveExplorerSite(null);
          }}
        />
      )}

      {/* NASA Data Source Attribution Modal (Section 7) */}
      {activeSourceSite && (
        <NasaDataSourceModal
          dataset={activeSourceSite.nasaDataset}
          isOpen={Boolean(activeSourceSite)}
          onClose={() => setActiveSourceSite(null)}
        />
      )}
    </div>
  );
};
