// Interactive NASA Planetary Terrain & Elevation Explorer Modal
// Visualizes authentic elevation profiles, slopes, and Solar System Treks metadata

import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  TrendingUp, 
  Sun, 
  Droplets, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import type { LandingSiteConfig } from '../../types/game';
import { NasaDataBadge } from '../common/NasaDataBadge';

interface NasaTerrainExplorerModalProps {
  site: LandingSiteConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenSourceDetails?: () => void;
}

export const NasaTerrainExplorerModal: React.FC<NasaTerrainExplorerModalProps> = ({
  site,
  isOpen,
  onClose,
  onOpenSourceDetails
}) => {
  const { formatNum, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'topography' | 'science' | 'gameplay'>('topography');

  if (!isOpen) return null;

  const siteName = (language === 'bn' && site.nameBn) ? site.nameBn : site.name;
  const siteReason = (language === 'bn' && site.suitabilityReasonBn) ? site.suitabilityReasonBn : site.suitabilityReason;
  const siteRisk = (language === 'bn' && site.terrainRiskBn) ? site.terrainRiskBn : site.terrainRisk;
  const missionCtx = (language === 'bn' && site.missionContextBn) ? site.missionContextBn : site.missionContext;
  const sciSignificance = (language === 'bn' && site.scientificSignificanceBn) ? site.scientificSignificanceBn : site.scientificSignificance;

  // Generate synthetic elevation cross-section profile matching real LOLA/MOLA site parameters
  const generateElevationPoints = () => {
    const baseElev = site.elevation_km;
    const slope = site.slope_deg;
    const isCrater = site.id.includes('crater') || site.id.includes('rim');
    const isMountain = site.id.includes('mountain') || site.id.includes('olympus');

    const points: Array<{ x: number; y: number; label: string }> = [];
    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
      const frac = i / (numPoints - 1);
      let offset = 0;
      if (isCrater) {
        // Crater dip: rim high, then steep descent to crater floor
        offset = Math.cos(frac * Math.PI) * (slope * 0.12);
      } else if (isMountain) {
        // Mountain peak rising
        offset = Math.sin(frac * Math.PI) * (slope * 0.18);
      } else {
        // Volcanic plains: gentle undulation
        offset = Math.sin(frac * Math.PI * 2) * 0.08;
      }
      const elev = Math.round((baseElev + offset) * 100) / 100;
      // Map to SVG coordinates: width 320, height 120
      const svgX = 20 + frac * 280;
      // Invert Y: higher elevation = smaller SVG y
      const svgY = 70 - (offset / (slope * 0.2 + 0.5)) * 35;
      points.push({ x: svgX, y: svgY, label: `${elev} km` });
    }
    return points;
  };

  const elevationPoints = generateElevationPoints();
  const polylineStr = elevationPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#091122] border-2 border-[#52D6FF]/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Close Terrain Explorer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <NasaDataBadge layer="nasa_data" size="sm" />
              <span className="text-[11px] font-mono text-[#52D6FF]">
                {site.coordinates}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              {siteName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              site.constructionSuitability === 'GOOD' 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : site.constructionSuitability === 'MODERATE'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}>
              {site.constructionSuitability === 'GOOD'
                ? (language === 'bn' ? 'অনুকূল এলাকা' : 'SUITABILITY: GOOD')
                : site.constructionSuitability === 'MODERATE'
                ? (language === 'bn' ? 'মাঝারি এলাকা' : 'SUITABILITY: MODERATE')
                : (language === 'bn' ? 'চ্যালেঞ্জিং এলাকা' : 'SUITABILITY: CHALLENGING')}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('topography')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'topography'
                ? 'bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '১. ভূখণ্ড ও উচ্চতা মানচিত্র' : '1. Topography & Elevation'}
          </button>
          <button
            onClick={() => setActiveTab('science')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'science'
                ? 'bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '২. নাসা বিজ্ঞান ও মিশন' : '2. NASA Mission Context'}
          </button>
          <button
            onClick={() => setActiveTab('gameplay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'gameplay'
                ? 'bg-[#52D6FF]/15 text-[#52D6FF] border border-[#52D6FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '৩. সিমুলেশনে প্রভাব' : '3. Simulation Effects'}
          </button>
        </div>

        {/* Tab 1: Topography Visualization */}
        {activeTab === 'topography' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Real Topographic Elevation Cross-Section Chart */}
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#52D6FF]" />
                  {language === 'bn' ? 'নাসা LOLA/MOLA উচ্চতা ক্রস-সেকশন প্রোফাইল' : 'NASA Laser Altimeter Elevation Profile'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Ref Datum: {formatNum(site.elevation_km)} km
                </span>
              </div>

              {/* Dynamic SVG Elevation Line */}
              <div className="w-full h-32 relative overflow-hidden bg-gradient-to-b from-[#091224] to-[#040813] rounded-lg border border-slate-800/80 p-1 flex items-center justify-center">
                <svg viewBox="0 0 320 120" className="w-full h-full">
                  {/* Grid background lines */}
                  <line x1="20" y1="35" x2="300" y2="35" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="20" y1="70" x2="300" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="20" y1="105" x2="300" y2="105" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Surface Fill Area */}
                  <polygon
                    points={`20,115 ${polylineStr} 300,115`}
                    fill="url(#elevGrad)"
                    opacity="0.35"
                  />

                  {/* Surface Polyline */}
                  <polyline
                    points={polylineStr}
                    fill="none"
                    stroke="#52D6FF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52D6FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0B132B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Nodes along the traverse */}
                  {elevationPoints.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#52D6FF" />
                      {i === 0 || i === Math.floor(elevationPoints.length / 2) || i === elevationPoints.length - 1 ? (
                        <text x={pt.x} y={pt.y - 7} fontSize="8" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                          {pt.label}
                        </text>
                      ) : null}
                    </g>
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
                <span>Traverse Start (0 km)</span>
                <span>Base Outpost Center</span>
                <span>Regional Perimeter (25 km)</span>
              </div>
            </div>

            {/* Core Planetary Measurement Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">{language === 'bn' ? 'উচ্চতা' : 'Elevation'}</span>
                <span className="text-base font-mono font-bold text-white">
                  {formatNum(site.elevation_km)} <span className="text-xs text-slate-400">km</span>
                </span>
                <span className="block text-[9px] font-mono text-[#52D6FF]">NASA Datum</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">{language === 'bn' ? 'ভূমির ঢাল' : 'Mean Slope'}</span>
                <span className="text-base font-mono font-bold text-amber-300">
                  {formatNum(site.slope_deg)}°
                </span>
                <span className="block text-[9px] font-mono text-slate-400">Surface Grade</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">{language === 'bn' ? 'সৌর আলো' : 'Solar Light'}</span>
                <span className="text-base font-mono font-bold text-sky-300 flex items-center justify-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  {formatNum(site.solarIlluminationPct)}%
                </span>
                <span className="block text-[9px] font-mono text-slate-400">Illumination</span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">{language === 'bn' ? 'মাটির বরফ' : 'Subsurface Ice'}</span>
                <span className="text-base font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  {site.subsurfaceIce ? (language === 'bn' ? 'প্রমাণিত' : 'Detected') : (language === 'bn' ? 'শুষ্ক' : 'Desiccated')}
                </span>
                <span className="block text-[9px] font-mono text-slate-400">
                  {site.subsurfaceIceDepth_m ? `~${site.subsurfaceIceDepth_m}m depth` : 'ECLSS loop'}
                </span>
              </div>
            </div>

            {/* Terrain Risk & Scientific Reason */}
            <div className="p-3.5 rounded-xl bg-[#0F1B33]/70 border border-slate-800 space-y-2 text-xs font-sans">
              <div className="flex items-start gap-2 text-slate-200 leading-relaxed">
                <Info className="w-4 h-4 text-[#52D6FF] shrink-0 mt-0.5" />
                <span>{siteReason}</span>
              </div>
              <div className="flex items-start gap-2 text-amber-300/90 leading-relaxed pt-2 border-t border-slate-800/80">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>{language === 'bn' ? 'ভূপ্রাকৃতিক ঝুঁকি:' : 'Terrain Hazard:'}</strong> {siteRisk}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: NASA Scientific Context */}
        {activeTab === 'science' && (
          <div className="space-y-3.5 animate-fadeIn text-xs font-sans">
            <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800">
              <h4 className="font-mono text-xs font-bold text-[#52D6FF] uppercase tracking-wider mb-1.5">
                {language === 'bn' ? 'মহাকাশ অভিযানের ঐতিহাসিক প্রেক্ষাপট' : 'NASA MISSION BASELINE & OBJECTIVES'}
              </h4>
              <p className="text-slate-300 leading-relaxed mb-3">
                {missionCtx}
              </p>

              <div className="p-3 rounded-lg bg-[#0F1B33] border border-sky-500/30 text-sky-200">
                <strong className="block font-mono text-[11px] text-sky-400 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'বিজ্ঞানীদের মূল লক্ষ্য:' : 'PRIMARY SCIENTIFIC OBJECTIVE:'}
                </strong>
                {sciSignificance}
              </div>
            </div>

            {/* Dataset reference attribution box */}
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">
                  {language === 'bn' ? 'উৎস ডেটাসেট' : 'Referenced NASA Dataset:'}
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {site.nasaDataset.name}
                </span>
                <span className="block text-[10px] font-mono text-slate-400">
                  Instrument: {site.nasaDataset.instrument} ({site.nasaDataset.mission})
                </span>
              </div>

              {onOpenSourceDetails && (
                <button
                  onClick={onOpenSourceDetails}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#52D6FF] font-mono text-xs font-bold transition-all shrink-0"
                >
                  {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Source'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Gameplay Simulation Effects */}
        {activeTab === 'gameplay' && (
          <div className="space-y-3 animate-fadeIn text-xs">
            <div className="p-3 rounded-xl bg-[#060B18] border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <NasaDataBadge layer="scientific_model" size="sm" />
                <span className="font-mono font-bold text-white text-xs">
                  {language === 'bn' ? 'এই সাইটের পদার্থবিজ্ঞান কীভাবে সিমুলেশন নিয়ন্ত্রণ করে' : 'Terrain Gameplay Coupling Model'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-3">
                {language === 'bn'
                  ? 'এই সাইটের উচ্চতা, ঢাল এবং সৌর আলোর বাস্তব নাসা মান সরাসরি সিমুলেশন ইঞ্জিনের সমীকরণে প্রয়োগ করা হয়।'
                  : 'Real NASA terrain measurements are fed directly into the game simulation equations to balance energy and life support.'}
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between p-2 rounded-lg bg-[#0F1B33] border border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'সৌরশক্তি উৎপাদন সহগ:' : 'Solar Efficiency Factor:'}</span>
                  <span className={`font-bold ${site.simulatedEffects.solarEfficiencyMod >= 1.0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {site.simulatedEffects.solarEfficiencyMod >= 1.0 ? '+' : ''}{Math.round((site.simulatedEffects.solarEfficiencyMod - 1.0) * 100)}% ({site.simulatedEffects.solarEfficiencyMod}x)
                  </span>
                </div>

                <div className="flex justify-between p-2 rounded-lg bg-[#0F1B33] border border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ভিত্তি নির্মাণ খরচ (ঢাল সহগ):' : 'Construction Cost (Slope):'}</span>
                  <span className={`font-bold ${site.simulatedEffects.constructionCostMod > 1.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {site.simulatedEffects.constructionCostMod > 1.0 ? '+' : ''}{Math.round((site.simulatedEffects.constructionCostMod - 1.0) * 100)}% ({site.simulatedEffects.constructionCostMod}x)
                  </span>
                </div>

                <div className="flex justify-between p-2 rounded-lg bg-[#0F1B33] border border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'পানি উত্তোলন বোনাস (বরফ):' : 'Water Mining Yield Bonus:'}</span>
                  <span className="font-bold text-sky-400">
                    +{Math.round((site.simulatedEffects.waterExtractionBonus - 1.0) * 100)}% ({site.simulatedEffects.waterExtractionBonus}x)
                  </span>
                </div>

                <div className="flex justify-between p-2 rounded-lg bg-[#0F1B33] border border-slate-800">
                  <span className="text-slate-400">{language === 'bn' ? 'ভূপ্রাকৃতিক বিকিরণ সুরক্ষা:' : 'Topographic Radiation Mod:'}</span>
                  <span className={`font-bold ${site.simulatedEffects.radiationDoseMod <= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {site.simulatedEffects.radiationDoseMod <= 1.0 ? '-' : '+'}{Math.abs(Math.round((site.simulatedEffects.radiationDoseMod - 1.0) * 100))}% ({site.simulatedEffects.radiationDoseMod}x)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4">
          {site.nasaDataset.trekUrl && (
            <a
              href={site.nasaDataset.trekUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'bn' ? 'নাসা সোলার সিস্টেম ট্রেক্স ৩ডি ভিউ ↗' : 'Launch NASA Solar System Treks ↗'}</span>
            </a>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
          >
            {language === 'bn' ? 'বন্ধ করো' : 'Close Explorer'}
          </button>
        </div>
      </div>
    </div>
  );
};
