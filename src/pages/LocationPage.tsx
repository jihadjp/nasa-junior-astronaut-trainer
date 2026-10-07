// Game-First Destination & Landing Site Selector: OUTPOST
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
  CheckCircle2,
  TrendingUp,
  MapPin,
  Satellite
} from 'lucide-react';
import type { DestinationType, LandingSiteConfig } from '../types/game';
import { getLandingSitesForDestination, getLandingSiteById } from '../data/landingSites';
import { NasaDataSourceModal } from '../components/nasa/NasaDataSourceModal';
import { NasaTerrainExplorerModal } from '../components/nasa/NasaTerrainExplorerModal';
import { PlanetarySurfaceRadar } from '../components/nasa/PlanetarySurfaceRadar';

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { destConfig, setDestConfig, landingSiteConfig, setLandingSiteConfig } = useMission();
  const { t, formatNum, language } = useLanguage();

  const [activeExplorerSite, setActiveExplorerSite] = useState<LandingSiteConfig | null>(null);
  const [activeSourceSite, setActiveSourceSite] = useState<LandingSiteConfig | null>(null);

  const availableSites = getLandingSitesForDestination(destConfig);
  const selectedSite = getLandingSiteById(landingSiteConfig) || availableSites[0];

  const handleSelectDest = (dest: DestinationType) => {
    sound.playClick();
    setDestConfig(dest);
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
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30 select-none">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-5">
        {/* Compact Directive Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#52D6FF]" />
            <h1 className="text-base sm:text-xl font-display font-black tracking-wide text-white uppercase">
              {language === 'bn' ? 'গন্তব্য ও অবতরণ সাইট নির্বাচন' : 'MISSION DESTINATION & LANDING SITE'}
            </h1>
          </div>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded-full">
            STAGE 1 OF 3
          </span>
        </div>

        {/* 1. PLANET SELECTION THEATERS (Moon vs Mars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* THE MOON */}
          <div
            onClick={() => handleSelectDest('moon')}
            className={`cursor-pointer rounded-xl border transition-all duration-200 relative overflow-hidden p-3.5 sm:p-4 flex flex-col justify-between group ${
              destConfig === 'moon'
                ? 'bg-gradient-to-r from-[#0F1B33] to-[#0A1122] border-[#52D6FF] ring-2 ring-[#52D6FF]/60 shadow-[0_0_20px_rgba(82,214,255,0.25)]'
                : 'bg-[#090F1E]/80 border-slate-800/90 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌑</span>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-white group-hover:text-[#52D6FF] transition-colors leading-none">
                    {t('dest.moon.name')}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Artemis Exploration Basin</span>
                </div>
              </div>

              {destConfig === 'moon' ? (
                <span className="px-2 py-0.5 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-[10px] font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SELECTED</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300">
                  CLICK TO SELECT
                </span>
              )}
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#050A14] p-2 rounded-lg border border-slate-800/80 text-[10px] font-mono text-center">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">GRAVITY</span>
                <span className="font-bold text-white">1.62 m/s²</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">SOLAR DAY</span>
                <span className="font-bold text-sky-300">29.5 Earth Days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">TERRAIN</span>
                <span className="font-bold text-emerald-400">NASA LOLA</span>
              </div>
            </div>
          </div>

          {/* MARS */}
          <div
            onClick={() => handleSelectDest('mars')}
            className={`cursor-pointer rounded-xl border transition-all duration-200 relative overflow-hidden p-3.5 sm:p-4 flex flex-col justify-between group ${
              destConfig === 'mars'
                ? 'bg-gradient-to-r from-[#240F0F] to-[#140808] border-red-500 ring-2 ring-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                : 'bg-[#090F1E]/80 border-slate-800/90 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔴</span>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-white group-hover:text-red-400 transition-colors leading-none">
                    {t('dest.mars.name')}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Perseverance & MRO Basin</span>
                </div>
              </div>

              {destConfig === 'mars' ? (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SELECTED</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300">
                  CLICK TO SELECT
                </span>
              )}
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#050A14] p-2 rounded-lg border border-slate-800/80 text-[10px] font-mono text-center">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">GRAVITY</span>
                <span className="font-bold text-white">3.71 m/s²</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">SOLAR DAY</span>
                <span className="font-bold text-amber-300">24h 39m (Sol)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">TERRAIN</span>
                <span className="font-bold text-red-400">NASA MOLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PLANETARY SURFACE RADAR (THE HERO OF SITE SELECTION) */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#080E1C] border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#52D6FF]" />
              <span className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                {language === 'bn' 
                  ? `${destConfig === 'moon' ? 'চাঁদ' : 'মঙ্গল'}: সারফেস ল্যান্ডিং রাডার`
                  : `${destConfig === 'moon' ? 'MOON' : 'MARS'}: SURFACE LANDING RADAR`}
              </span>
            </div>

            {/* NASA Telemetry Badge Button */}
            <button
              onClick={() => setActiveExplorerSite(selectedSite)}
              className="px-2.5 py-1 rounded bg-[#52D6FF]/15 hover:bg-[#52D6FF]/25 border border-[#52D6FF]/40 text-[#52D6FF] font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'উচ্চতা ও ঢাল প্রোফাইল' : 'TERRAIN PROFILE'}</span>
            </button>
          </div>

          {/* Interactive Radar */}
          <PlanetarySurfaceRadar
            destination={destConfig}
            sites={availableSites}
            selectedSiteId={landingSiteConfig}
            onSelectSite={handleSelectSite}
            onExploreElevation={(site) => setActiveExplorerSite(site)}
          />

          {/* Selected Site Tactical Telemetry Pill */}
          {selectedSite && (
            <div className="p-3 rounded-xl bg-[#040812] border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#52D6FF] animate-pulse" />
                  <span className="font-display font-black text-sm text-white">
                    {(language === 'bn' && selectedSite.nameBn) ? selectedSite.nameBn : selectedSite.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({selectedSite.coordinates})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 mt-1">
                  <span>Elev: <strong className="text-white">{formatNum(selectedSite.elevation_km)} km</strong></span>
                  <span>Slope: <strong className="text-amber-300">{formatNum(selectedSite.slope_deg)}°</strong></span>
                  <span>Sun: <strong className="text-sky-300">{formatNum(selectedSite.solarIlluminationPct)}%</strong></span>
                  <span>Ice: <strong className="text-emerald-400">{selectedSite.subsurfaceIce ? 'YES' : 'NONE'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveSourceSite(selectedSite)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Satellite className="w-3 h-3 text-sky-400" />
                  <span>NASA PDS</span>
                </button>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${
                  selectedSite.constructionSuitability === 'GOOD'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : selectedSite.constructionSuitability === 'MODERATE'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}>
                  {selectedSite.constructionSuitability}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম স্ক্রিন' : 'HOME'}</span>
          </button>

          <button
            onClick={handleContinue}
            className="py-3 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(82,214,255,0.35)] active:scale-98 transition-all"
          >
            <span>{language === 'bn' ? 'বেস কনফিগারেশনে যাও' : 'PROCEED TO BASE SETUP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* NASA Modals */}
      {activeExplorerSite && (
        <NasaTerrainExplorerModal
          site={activeExplorerSite}
          isOpen={true}
          onClose={() => setActiveExplorerSite(null)}
          onOpenSourceDetails={() => {
            setActiveSourceSite(activeExplorerSite);
            setActiveExplorerSite(null);
          }}
        />
      )}

      {activeSourceSite && (
        <NasaDataSourceModal
          dataset={activeSourceSite.nasaDataset}
          isOpen={true}
          onClose={() => setActiveSourceSite(null)}
        />
      )}
    </div>
  );
};
