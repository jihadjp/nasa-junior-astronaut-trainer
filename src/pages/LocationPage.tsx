// Game-First Destination & Landing Site Selector: OUTPOST
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  TrendingUp,
  MapPin,
  Satellite,
  Sun,
  Droplet,
  Wrench,
  Shield
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
    <div className="w-full min-h-screen bg-[#02050E] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30 select-none">
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

        {/* 1. PLANET SELECTION THEATERS (Moon vs Mars Dioramas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* THE MOON THEATER */}
          <div
            onClick={() => handleSelectDest('moon')}
            className={`cursor-pointer rounded-2xl border-2 transition-all duration-200 relative overflow-hidden p-4 sm:p-5 flex flex-col justify-between group shadow-xl ${
              destConfig === 'moon'
                ? 'bg-gradient-to-b from-[#0F1B33] to-[#060B16] border-[#52D6FF] ring-4 ring-[#52D6FF]/20 shadow-[0_0_30px_rgba(82,214,255,0.25)]'
                : 'bg-[#060B16]/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Visual Lunar Horizon Diorama */}
            <div className="h-24 sm:h-28 w-full rounded-xl overflow-hidden mb-3 relative bg-[#040814] border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Space vacuum sky */}
                <rect width="300" height="100" fill="#040711" />
                {/* Earth in lunar sky */}
                <circle cx="240" cy="25" r="14" fill="#1e3a8a" />
                <path d="M 233,18 Q 240,12 247,19 Q 252,28 245,35 Q 238,32 233,18 Z" fill="#60a5fa" />
                <path d="M 240,11 A 14 14 0 0 1 240,39 A 14 14 0 0 0 240,11" fill="#040711" opacity="0.6" />
                {/* Stars */}
                <circle cx="40" cy="15" r="0.75" fill="#ffffff" />
                <circle cx="85" cy="30" r="1" fill="#ffffff" />
                <circle cx="160" cy="12" r="0.75" fill="#ffffff" />
                {/* Mountain ridge (Shackleton / Malapert) */}
                <path d="M 0,70 L 40,50 L 95,65 L 145,45 L 205,62 L 260,48 L 300,58 L 300,100 L 0,100 Z" fill="#1e293b" />
                <path d="M 0,80 L 50,68 L 110,78 L 175,64 L 230,76 L 300,70 L 300,100 L 0,100 Z" fill="#334155" />
                {/* Lunar regolith foreground */}
                <path d="M 0,88 Q 150,82 300,88 L 300,100 L 0,100 Z" fill="#475569" />
              </svg>

              <div className="absolute top-2 left-2.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono text-slate-300">
                LUNAR SOUTH POLE · ARTEMIS BASIN
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌑</span>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-white group-hover:text-[#52D6FF] transition-colors leading-none">
                    {t('dest.moon.name')}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Artemis Exploration Program</span>
                </div>
              </div>

              {destConfig === 'moon' ? (
                <span className="px-2.5 py-1 rounded-full bg-[#52D6FF] text-slate-950 font-mono text-[10px] font-black flex items-center gap-1">
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
            <div className="grid grid-cols-3 gap-1.5 bg-[#030610] p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-center">
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

          {/* MARS THEATER */}
          <div
            onClick={() => handleSelectDest('mars')}
            className={`cursor-pointer rounded-2xl border-2 transition-all duration-200 relative overflow-hidden p-4 sm:p-5 flex flex-col justify-between group shadow-xl ${
              destConfig === 'mars'
                ? 'bg-gradient-to-b from-[#250F0B] to-[#120604] border-red-500 ring-4 ring-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
                : 'bg-[#060B16]/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Visual Martian Horizon Diorama */}
            <div className="h-24 sm:h-28 w-full rounded-xl overflow-hidden mb-3 relative bg-[#1c0b07] border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Martian dusty sky */}
                <rect width="300" height="100" fill="#2b110b" />
                <circle cx="220" cy="22" r="6" fill="#fcd34d" opacity="0.8" />
                {/* Phobos moon */}
                <circle cx="90" cy="28" r="3" fill="#cbd5e1" opacity="0.6" />
                {/* Distant crater rim / Olympus Mons profile */}
                <path d="M 0,65 L 55,48 L 115,58 L 180,42 L 235,55 L 300,50 L 300,100 L 0,100 Z" fill="#4c1d14" />
                <path d="M 0,75 L 45,66 L 105,72 L 165,60 L 225,69 L 300,64 L 300,100 L 0,100 Z" fill="#7c2d12" />
                {/* Ochre dunes foreground */}
                <path d="M 0,85 Q 150,78 300,85 L 300,100 L 0,100 Z" fill="#9a3412" />
              </svg>

              <div className="absolute top-2 left-2.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono text-amber-200">
                JEZERO BASIN · MRO TOPOGRAPHY
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🔴</span>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-white group-hover:text-red-400 transition-colors leading-none">
                    {t('dest.mars.name')}
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">Ares Mission Exploration</span>
                </div>
              </div>

              {destConfig === 'mars' ? (
                <span className="px-2.5 py-1 rounded-full bg-red-500 text-white font-mono text-[10px] font-black flex items-center gap-1">
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
            <div className="grid grid-cols-3 gap-1.5 bg-[#030610] p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-center">
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

        {/* 2. PLANETARY SURFACE RADAR */}
        <div className="p-3 sm:p-5 rounded-2xl bg-[#070D1E] border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#52D6FF]" />
              <span className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                {language === 'bn' 
                  ? `${destConfig === 'moon' ? 'চাঁদ' : 'মঙ্গল'}: সারফেস ল্যান্ডিং রাডার (NASA Treks)`
                  : `${destConfig === 'moon' ? 'MOON' : 'MARS'}: SURFACE LANDING RADAR (NASA Treks)`}
              </span>
            </div>

            {/* NASA Telemetry Badge Button */}
            <button
              type="button"
              onClick={() => setActiveExplorerSite(selectedSite)}
              className="px-2.5 py-1 rounded bg-[#52D6FF]/15 hover:bg-[#52D6FF]/25 border border-[#52D6FF]/40 text-[#52D6FF] font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
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

          {/* 3. GAMEPLAY CONSEQUENCES CARD FOR SELECTED LANDING SITE */}
          {selectedSite && selectedSite.simulatedEffects && (
            <div className="p-3.5 rounded-xl bg-[#040814] border border-[#52D6FF]/40 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse" />
                    <span className="font-display font-black text-sm sm:text-base text-white">
                      {(language === 'bn' && selectedSite.nameBn) ? selectedSite.nameBn : selectedSite.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({selectedSite.coordinates})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    {(language === 'bn' && selectedSite.suitabilityReasonBn) ? selectedSite.suitabilityReasonBn : selectedSite.suitabilityReason}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSourceSite(selectedSite)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Satellite className="w-3 h-3 text-sky-400" />
                    <span>NASA PDS DATA</span>
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

              {/* Scientific Gameplay Modifiers (How terrain genuinely changes simulation) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#070D1E] border border-slate-800 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'সৌর উৎপাদন' : 'SOLAR POWER'}</span>
                    <strong className={selectedSite.simulatedEffects.solarEfficiencyMod >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}>
                      {Math.round((selectedSite.simulatedEffects.solarEfficiencyMod - 1) * 100) > 0 ? '+' : ''}
                      {formatNum(Math.round((selectedSite.simulatedEffects.solarEfficiencyMod - 1) * 100))}%
                    </strong>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#070D1E] border border-slate-800 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'পানি উত্তোলন' : 'WATER ICE'}</span>
                    <strong className={selectedSite.simulatedEffects.waterExtractionBonus > 1.0 ? 'text-emerald-400' : 'text-slate-400'}>
                      {selectedSite.subsurfaceIce ? `+${formatNum(Math.round((selectedSite.simulatedEffects.waterExtractionBonus - 1) * 100))}%` : 'NONE'}
                    </strong>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#070D1E] border border-slate-800 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'নির্মাণ জটিলতা' : 'BUILD COST'}</span>
                    <strong className={selectedSite.simulatedEffects.constructionCostMod > 1.0 ? 'text-amber-400' : 'text-emerald-400'}>
                      {selectedSite.simulatedEffects.constructionCostMod > 1.0 ? `+${formatNum(Math.round((selectedSite.simulatedEffects.constructionCostMod - 1) * 100))}%` : 'STANDARD'}
                    </strong>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#070D1E] border border-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pink-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'প্রাকৃতিক বিকিরণ' : 'RADIATION'}</span>
                    <strong className="text-slate-200">
                      {formatNum(Math.round((selectedSite.simulatedEffects.radiationDoseMod || 1.0) * 100))}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম স্ক্রিন' : 'HOME'}</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="py-3 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(82,214,255,0.35)] active:scale-98 transition-all cursor-pointer"
          >
            <span>{language === 'bn' ? 'বেস কনফিগারেশনে যান' : 'PROCEED TO BASE SETUP'}</span>
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
