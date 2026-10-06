// Interactive NASA Planetary Surface Map & Radar Component
// Grounded in real orbiter coordinate grids and landing site coordinates
import React from 'react';
import type { DestinationType, LandingSiteConfig } from '../../types/game';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import { MapPin, Navigation, Satellite, Info } from 'lucide-react';
import { NasaDataBadge } from '../common/NasaDataBadge';

interface PlanetarySurfaceRadarProps {
  destination: DestinationType;
  sites: LandingSiteConfig[];
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
  onExploreElevation?: (site: LandingSiteConfig) => void;
}

export const PlanetarySurfaceRadar: React.FC<PlanetarySurfaceRadarProps> = ({
  destination,
  sites,
  selectedSiteId,
  onSelectSite,
  onExploreElevation
}) => {
  const { formatNum, language } = useLanguage();

  const isMars = destination === 'mars';
  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Helper to map celestial coordinates (Lat, Lon) to 2D projection coordinates (0-100% SVG box)
  const getCoordinatesPct = (site: LandingSiteConfig): { x: number; y: number } => {
    // Parse coordinates like "89.9° S, 0.0° E" or "18.4° N, 77.5° E"
    const latMatch = site.coordinates.match(/([\d.]+)\s*°\s*([NS])/i);
    const lonMatch = site.coordinates.match(/([\d.]+)\s*°\s*([EW])/i);

    let lat = latMatch ? parseFloat(latMatch[1]) * (latMatch[2].toUpperCase() === 'S' ? -1 : 1) : 0;
    let lon = lonMatch ? parseFloat(lonMatch[1]) * (lonMatch[2].toUpperCase() === 'W' ? -1 : 1) : 0;

    // Normalize: Lon -180 to 180 -> X 0% to 100%
    // Normalize: Lat 90 to -90 -> Y 0% to 100%
    // If Moon polar sites, spread them so they don't overlap in standard projection
    if (!isMars && (site.id === 'shackleton_rim' || site.id === 'malapert_mountain')) {
      if (site.id === 'shackleton_rim') return { x: 50, y: 88 };
      if (site.id === 'malapert_mountain') return { x: 58, y: 82 };
    }
    if (!isMars && site.id === 'oceanus_procellarum') return { x: 30, y: 52 };
    if (!isMars && site.id === 'taurus_littrow') return { x: 62, y: 38 };

    // Mars custom coordinates
    if (isMars) {
      if (site.id === 'jezero_crater') return { x: 58, y: 40 };
      if (site.id === 'arcadia_planitia') return { x: 82, y: 28 };
      if (site.id === 'gale_crater') return { x: 74, y: 54 };
      if (site.id === 'olympus_mons') return { x: 26, y: 39 };
    }

    const x = Math.max(8, Math.min(92, ((lon + 180) / 360) * 100));
    const y = Math.max(10, Math.min(90, ((90 - lat) / 180) * 100));
    return { x, y };
  };

  return (
    <div className="w-full bg-[#080E1C] border border-sky-500/30 rounded-2xl p-3 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Header telemetry strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Navigation className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                {language === 'bn' 
                  ? (isMars ? 'মঙ্গল গ্রহ পৃষ্ঠ ম্যাপিং রাডার (MOLA)' : 'চন্দ্রপৃষ্ঠ ভৌগোলিক ম্যাপিং রাডার (LOLA)') 
                  : (isMars ? 'MARS SURFACE TOPOGRAPHIC RADAR (MOLA)' : 'LUNAR SURFACE TOPOGRAPHIC RADAR (LOLA)')}
              </h3>
              <NasaDataBadge layer="nasa_data" size="sm" />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {language === 'bn'
                ? 'মানচিত্রে যেকোনো অবতরণ জোনে ক্লিক করে বিস্তারিত ভূখণ্ড ডেটা দেখুন'
                : 'Interactive orbiter coordinates. Click target beacons to inspect topography.'}
            </p>
          </div>
        </div>

        {/* Selected target preview pill */}
        <div className="flex items-center gap-2">
          <div className="bg-[#050B16] border border-sky-400/40 px-3 py-1 rounded-xl text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase block">
              {language === 'bn' ? 'টার্গেট জোন:' : 'TARGET COORDINATES:'}
            </span>
            <span className="font-bold text-sky-300">
              {selectedSite.coordinates}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Radar Screen */}
      <div className="relative w-full h-[220px] sm:h-[290px] rounded-xl overflow-hidden border border-slate-800 bg-[#030610] select-none">
        {/* Dynamic planetary texture background gradient */}
        <div 
          className={`absolute inset-0 opacity-80 ${
            isMars 
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#451813] via-[#240B0B] to-[#0A0304]' 
              : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B253D] via-[#0E1526] to-[#050811]'
          }`} 
        />

        {/* Planetary topography contours overlay SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Latitude Lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#38BDF8" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.4" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#38BDF8" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#38BDF8" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.4" />

          {/* Longitude Lines */}
          <line x1="25" y1="0" x2="25" y2="100" stroke="#38BDF8" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.4" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#38BDF8" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.6" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#38BDF8" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.4" />

          {/* Planetary Geographic Features Silhouette */}
          {!isMars ? (
            // Moon Mare Basins
            <g opacity="0.3" fill="none" stroke="#60A5FA" strokeWidth="0.3">
              <circle cx="32" cy="48" r="14" strokeDasharray="2,1" />
              <circle cx="65" cy="40" r="10" strokeDasharray="1,1" />
              <path d="M 40,80 Q 50,75 60,82" strokeWidth="0.5" />
            </g>
          ) : (
            // Mars Craters and Volcanic Caldrons
            <g opacity="0.35" fill="none" stroke="#F87171" strokeWidth="0.3">
              <ellipse cx="26" cy="39" rx="10" ry="7" strokeDasharray="2,1" />
              <ellipse cx="74" cy="54" rx="8" ry="6" strokeDasharray="1,1" />
              <path d="M 45,35 Q 58,40 65,42" strokeWidth="0.4" />
            </g>
          )}
        </svg>

        {/* Coordinate Labels */}
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-sky-400/60 pointer-events-none">
          +90° N (POLAR)
        </div>
        <div className="absolute top-[48%] left-2 text-[9px] font-mono text-sky-400/60 pointer-events-none">
          0° EQUATOR
        </div>
        <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-sky-400/60 pointer-events-none">
          -90° S (SOUTH POLE)
        </div>

        {/* Plot All Landing Site Interactive Target Beacons */}
        {sites.map((site) => {
          const isSelected = site.id === selectedSiteId;
          const coords = getCoordinatesPct(site);
          const name = (language === 'bn' && site.nameBn) ? site.nameBn : site.name;

          return (
            <div
              key={site.id}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              onClick={() => {
                sound.playClick();
                onSelectSite(site.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Radar Ping Rings */}
              {isSelected && (
                <div className="absolute -inset-3.5 rounded-full border border-sky-400 animate-ping opacity-60" />
              )}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full border border-sky-300/80 animate-pulse" />
              )}

              {/* Beacon Pin Icon */}
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-sky-400 text-slate-950 ring-2 ring-white shadow-lg shadow-sky-400/60 scale-110' 
                  : 'bg-slate-900/90 text-sky-400 border border-sky-400/50 hover:bg-sky-500 hover:text-slate-950 hover:scale-105'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Tooltip Label Overlay */}
              <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded bg-[#0A1224]/95 border border-sky-400/40 text-[10px] font-mono text-white whitespace-nowrap shadow-xl transition-all pointer-events-none ${
                isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
              }`}>
                <span className="font-bold block text-sky-300">{name}</span>
                <span className="text-[9px] text-slate-400">
                  {site.elevation_km >= 0 ? `+${formatNum(site.elevation_km)}` : formatNum(site.elevation_km)} km elev • {formatNum(site.slope_deg)}° slope
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Landing Site Telemetry Panel */}
      <div className="mt-3 p-3 rounded-xl bg-[#050C1A] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <Satellite className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-white block truncate">
              {(language === 'bn' && selectedSite.nameBn) ? selectedSite.nameBn : selectedSite.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {selectedSite.nasaDataset.mission} • {selectedSite.nasaDataset.instrument}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/30 text-[11px] text-sky-300">
            <span className="text-slate-400 text-[9px] block uppercase">{language === 'bn' ? 'উচ্চতা ও ঢাল:' : 'Elev & Slope:'}</span>
            <span>{selectedSite.elevation_km >= 0 ? `+${formatNum(selectedSite.elevation_km)}` : formatNum(selectedSite.elevation_km)} km | {formatNum(selectedSite.slope_deg)}°</span>
          </div>

          {onExploreElevation && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onExploreElevation(selectedSite);
              }}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all active:scale-95 flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
