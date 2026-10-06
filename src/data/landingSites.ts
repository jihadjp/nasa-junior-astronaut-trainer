// Authentic NASA Planetary Landing Sites
// Grounded in real NASA Lunar Reconnaissance Orbiter (LRO) and Mars Orbiter data
// Used to establish realistic base locations with scientific gameplay consequences

import type { LandingSiteConfig } from '../types/game';
import { NASA_PLANETARY_DATASETS } from './nasaDatasets';

export const LUNAR_LANDING_SITES: LandingSiteConfig[] = [
  {
    id: 'shackleton_rim',
    name: 'Shackleton Crater Rim',
    nameBn: 'শ্যাকলটন ক্র্যাটার রিম (দক্ষিণ মেরু)',
    destination: 'moon',
    coordinates: '89.9° S, 0.0° E',
    elevation_km: 1.12, // Peak above mean lunar sphere from LOLA
    slope_deg: 8.4,     // Mean ridge crest slope
    solarIlluminationPct: 86, // Up to 86-90% persistent illumination
    temperatureRange: [-130, -20],
    constructionSuitability: 'MODERATE',
    suitabilityReason: 'Elevated ridge offers ~86% near-constant solar illumination and direct Earth line-of-sight communication. However, steep crater flanks (25°–32°) require careful module anchoring.',
    suitabilityReasonBn: 'উঁচু শৈলশিরায় প্রায় ৮৬% সময় সূর্যের আলো পাওয়া যায় এবং পৃথিবীর সাথে সরাসরি সংযোগ থাকে। তবে ক্র্যাটারের খাড়া দেওয়ালের কারণে মডিউল স্থাপনে সতর্কতা প্রয়োজন।',
    terrainRisk: 'Steep crater rim drop-offs and cryogenic thermal traps.',
    terrainRiskBn: 'ক্র্যাটারের খাড়া খাদ এবং অত্যন্ত শীতল ছায়াযুক্ত ট্র্যাপ।',
    subsurfaceIce: true, // Floor PSR contains ice volatiles confirmed by LCROSS & Diviner
    subsurfaceIceDepth_m: 0.5,
    missionContext: 'Primary focus area for the NASA Artemis Base Camp and VIPER rover surface prospecting.',
    missionContextBn: 'নাসা আর্টেমিস বেস ক্যাম্প এবং ভাইপার (VIPER) রোভারের অন্যতম প্রধান প্রস্তাবিত এলাকা।',
    scientificSignificance: 'Permanently Shadowed Regions (PSRs) at 40 Kelvin preserve ancient solar system volatile records and accessible ice for hydrogen/oxygen propellant.',
    scientificSignificanceBn: 'স্থায়ী ছায়াযুক্ত খাদে (৪০ কেলভিন) কোটি বছর ধরে জমা বরফ পাওয়া যায়, যা রকেটের হাইড্রোজেন ও অক্সিজেন জ্বালানি তৈরিতে কাজে লাগবে।',
    nasaDataset: NASA_PLANETARY_DATASETS.diviner_thermal_solar,
    simulatedEffects: {
      solarEfficiencyMod: 1.25,      // Continuous grazing sun prevents standard 14-day lunar night
      constructionCostMod: 1.15,     // 15% extra spare parts/power to level on crater ridge
      waterExtractionBonus: 1.35,    // +35% water yield from nearby crater floor ice deposits
      radiationDoseMod: 0.95
    }
  },
  {
    id: 'malapert_mountain',
    name: 'Malapert Mountain (Plateau)',
    nameBn: 'মালাপার্ট পর্বত (মালভূমি)',
    destination: 'moon',
    coordinates: '84.9° S, 12.9° E',
    elevation_km: 5.0, // Massive 5 km relief above surroundings
    slope_deg: 13.8,   // High-elevation massif slope
    solarIlluminationPct: 89, // High illumination peak
    temperatureRange: [-125, -15],
    constructionSuitability: 'CHALLENGING',
    suitabilityReason: 'Superb permanent radio line-of-sight to Earth and near-constant sunlight, but elevated massif terrain makes transport and habitat leveling challenging.',
    suitabilityReasonBn: 'পৃথিবীর সাথে নিরবচ্ছিন্ন রেডিও যোগাযোগ এবং প্রচুর সূর্যালোক পাওয়া যায়, কিন্তু ৫ কিমি উঁচু মালভূমির খাড়া ঢাল ও পাথুরে গঠন নির্মাণকাজকে কিছুটা চ্যালেঞ্জিং করে।',
    terrainRisk: 'High-relief escarpments and abrasive regolith scree.',
    terrainRiskBn: 'উঁচু খাড়া পাহাড়ের ধার এবং ধারালো পাথুরে রেগোলিথ।',
    subsurfaceIce: false,
    missionContext: 'Artemis Candidate Landing Region 004; ideal for high-gain communications relays.',
    missionContextBn: 'আর্টেমিস অভিযানের ক্যান্ডিডেট সাইট ০০৪; উচ্চ ক্ষমতাসম্পন্ন যোগাযোগ রিলে ঘাঁটির জন্য আদর্শ।',
    scientificSignificance: 'High-altitude vantage point provides 360-degree telemetry monitoring across the lunar south polar region.',
    scientificSignificanceBn: 'বিশাল উচ্চতার কারণে পুরো দক্ষিণ মেরুর চারপাশে নজরদারি ও টেলিমোট্রি সংযোগ নিশ্চিত করা যায়।',
    nasaDataset: NASA_PLANETARY_DATASETS.lola_topography,
    simulatedEffects: {
      solarEfficiencyMod: 1.35,      // Excellent high-altitude solar visibility
      constructionCostMod: 1.30,     // 30% extra resources due to 13.8° slope
      waterExtractionBonus: 1.0,     // Standard closed loop (no local surface ice)
      radiationDoseMod: 1.10         // Higher elevation has slightly less horizon terrain shielding
    }
  },
  {
    id: 'oceanus_procellarum',
    name: 'Oceanus Procellarum (Marius Hills)',
    nameBn: 'ওশেনাস প্রোসেলেয়ারাম (মারিয়াস হিলস)',
    destination: 'moon',
    coordinates: '3.0° S, 23.4° W',
    elevation_km: -1.4, // Basaltic volcanic lowlands
    slope_deg: 1.8,     // Flat smooth plain
    solarIlluminationPct: 50, // Standard equatorial 14-day day / 14-day night cycle
    temperatureRange: [-170, 120],
    constructionSuitability: 'GOOD',
    suitabilityReason: 'Exceptionally flat, stable basaltic plains allow rapid, low-cost base modular construction. However, base must survive brutal 14-day lunar nights with heavy battery/fuel cell reliance.',
    suitabilityReasonBn: 'অত্যন্ত সমতল ও শক্ত লাভা সমভূমি হওয়ায় দ্রুত ও কম খরচে ঘাঁটি তৈরি করা যায়। তবে টানা ১৪ দিনের দীর্ঘ অন্ধকার রাতে বিশাল ব্যাটারি ব্যাকআপ দরকার হয়।',
    terrainRisk: 'Subsurface lava tube skylights and micrometeorite impacts.',
    terrainRiskBn: 'ভূগর্ভস্থ লাভা টিউবের গহ্বর এবং উল্কাপিণ্ডের সরাসরি আঘাতের ঝুঁকি।',
    subsurfaceIce: false,
    missionContext: 'Apollo 12 and Surveyor 3 historic exploration baseline; potential lava tube shelter sites.',
    missionContextBn: 'অ্যাপোলো ১২ এবং সার্ভেয়ার ৩ অভিযানের ঐতিহাসিক এলাকা; প্রাকৃতিক লাভা টিউব আশ্রয়ের জন্য গবেষণাধীন।',
    scientificSignificance: 'Extensive basaltic flood plains rich in titanium and pyroxene for regolith sintering and oxygen extraction.',
    scientificSignificanceBn: 'টাইটানিয়াম ও খনিজে সমৃদ্ধ ব্যাসল্ট লাভা সমভূমি, যা রেগোলিথ গলিয়ে বাসস্থান তৈরিতে উপযোগী।',
    nasaDataset: NASA_PLANETARY_DATASETS.lola_topography,
    simulatedEffects: {
      solarEfficiencyMod: 0.85,      // Subject to 14-day night blackout; higher storage dependence
      constructionCostMod: 1.0,      // Flat ground = lowest build cost
      waterExtractionBonus: 0.85,    // Fully desiccated equatorial soil; pure ECLSS recycling reliance
      radiationDoseMod: 1.0
    }
  },
  {
    id: 'taurus_littrow',
    name: 'Taurus-Littrow Valley',
    nameBn: 'টরাস-লিট্রো উপত্যকা (অ্যাপোলো ১৭ সাইট)',
    destination: 'moon',
    coordinates: '20.19° N, 30.77° E',
    elevation_km: -2.1,
    slope_deg: 4.2,
    solarIlluminationPct: 50,
    temperatureRange: [-160, 110],
    constructionSuitability: 'GOOD',
    suitabilityReason: 'Valley floor is shielded by surrounding 2 km massifs, reducing cosmic ray angles, with abundant titanium-rich ilmenite regolith for oxygen extraction.',
    suitabilityReasonBn: 'চারপাশের ২ কিমি উঁচু পাহাড় মহাজাগতিক রশ্মির কোণ কমিয়ে প্রাকৃতিক সুরক্ষা দেয় এবং টাইটানিয়াম সমৃদ্ধ রেগোলিথ থেকে অক্সিজেন নিষ্কাশনে সুবিধা পাওয়া যায়।',
    terrainRisk: 'Massif boulder rolling tracks and electrostatic dust adhesion.',
    terrainRiskBn: 'পাহাড় থেকে পাথর গড়িয়ে পড়ার খাঁদ এবং অতিসূক্ষ্ম উড়ন্ত ধূলিকণা।',
    subsurfaceIce: false,
    missionContext: 'Apollo 17 final human lunar landing exploration zone (Harrison Schmitt & Gene Cernan).',
    missionContextBn: 'অ্যাপোলো ১৭ এর সর্বশেষ মানব চন্দ্রাভিযানের ঐতিহাসিক অবতরণ স্থল।',
    scientificSignificance: 'Rich orange pyroclastic volcanic glass beads formed in deep lunar mantle explosive eruptions.',
    scientificSignificanceBn: 'চাঁদের অভ্যন্তরের গভীর বিস্ফোরণ থেকে তৈরি হওয়া প্রাচীন কমলা কাচ-কণার অনন্য বৈজ্ঞানিক মজুত।',
    nasaDataset: NASA_PLANETARY_DATASETS.lola_topography,
    simulatedEffects: {
      solarEfficiencyMod: 0.90,
      constructionCostMod: 1.05,
      waterExtractionBonus: 0.95,
      radiationDoseMod: 0.88         // Mountain massifs block 12% of horizon cosmic rays!
    }
  }
];

export const MARS_LANDING_SITES: LandingSiteConfig[] = [
  {
    id: 'jezero_crater',
    name: 'Jezero Crater Delta',
    nameBn: 'জেজেরো ক্র্যাটার ডেল্টা (মার্স ২০২০)',
    destination: 'mars',
    coordinates: '18.38° N, 77.58° E',
    elevation_km: -2.5, // 2.5 km below Martian topographic datum
    slope_deg: 3.5,     // Alluvial fan slope
    solarIlluminationPct: 95,
    temperatureRange: [-85, -10],
    constructionSuitability: 'GOOD',
    suitabilityReason: 'Thicker atmospheric column at -2.5 km elevation aids MOXIE oxygen compression and aerodynamic stability. Prime astrobiology site with rich scientific return.',
    suitabilityReasonBn: '-২.৫ কিমি গভীরতায় বায়ুমণ্ডলীয় চাপ কিছুটা বেশি হওয়ায় মোক্সি (MOXIE) দিয়ে অক্সিজেন তৈরি সহজ হয়। বৈজ্ঞানিক গবেষণার জন্য এটি নাসার সেরা সাইট।',
    terrainRisk: 'Seasonal regional dust storm opacity (Tau > 3.0) and sand dunes.',
    terrainRiskBn: 'মৌসুমি ধূলিঝড়ে সূর্যের আলো কমে যাওয়া এবং বালির ঢিবি।',
    subsurfaceIce: false,
    missionContext: 'Mars 2020 Perseverance Rover & Ingenuity helicopter exploration; proven MOXIE flight data site.',
    missionContextBn: 'মার্স ২০২০ পারসিভিয়ারেন্স রোভার ও ইনজেনুইটি হেলিকপ্টারের সক্রিয় গবেষণার বাস্তব স্থান।',
    scientificSignificance: 'Ancient 3.8-billion-year-old river delta and paleolake containing clay minerals and carbonates for biosignature preservation.',
    scientificSignificanceBn: '৩৮০ কোটি বছরের প্রাচীন নদী মোহনা ও হ্রদের পলিমাটি, যা প্রাচীন প্রাণের জীবাশ্ম সংরক্ষণে সেরা।',
    nasaDataset: NASA_PLANETARY_DATASETS.moxie_perseverance_isru,
    simulatedEffects: {
      solarEfficiencyMod: 1.05,
      constructionCostMod: 1.0,
      waterExtractionBonus: 1.0,
      radiationDoseMod: 0.95
    }
  },
  {
    id: 'arcadia_planitia',
    name: 'Arcadia Planitia (Ice Plains)',
    nameBn: 'আর্কেডিয়া প্ল্যানিটিয়া (বরফ সমভূমি)',
    destination: 'mars',
    coordinates: '39.3° N, 189.7° E',
    elevation_km: -3.8, // Low-altitude smooth volcanic plains
    slope_deg: 1.2,     // Flattest terrain on Mars
    solarIlluminationPct: 85,
    temperatureRange: [-120, -25],
    constructionSuitability: 'GOOD',
    suitabilityReason: 'Flattest volcanic plain on Mars enables rapid, safe habitat deployment. Direct access to vast water ice sheets just 1.5–2.5m beneath the surface supercharges water and fuel production.',
    suitabilityReasonBn: 'মঙ্গলের সবচেয়ে সমতল এলাকা হওয়ায় ঘাঁটি তৈরি সবচেয়ে সহজ। মাটির মাত্র ১.৫-২.৫ মিটার নিচে বিশুদ্ধ পানির বরফ স্তর রয়েছে, যা পানি ও জ্বালানি উৎপাদনে যুগান্তকারী সুবিধা দেয়।',
    terrainRisk: 'Higher northern latitude winter darkness and freezing cryogenic frost.',
    terrainRiskBn: 'উত্তরের অক্ষাংশে শীতকালের তীব্র ঠান্ডা এবং সূর্যালোকে ঘাটতি।',
    subsurfaceIce: true, // Confirmed shallow sheet ice via MRO SHARAD
    subsurfaceIceDepth_m: 1.8,
    missionContext: 'Top candidate region in NASA Moon-to-Mars Human Landing Site studies for in-situ water mining.',
    missionContextBn: 'নাসার মানববাহী মঙ্গল অভিযানের জন্য সবচেয়ে সম্ভাবনাময় পানি উত্তোলন ও অবতরণ সাইট।',
    scientificSignificance: 'MRO SHARAD radar confirmed buried glacial ice sheets extending across hundreds of kilometers under a thin protecting regolith layer.',
    scientificSignificanceBn: 'রাডারে প্রমাণিত সুবিশাল হিমবাহ বরফের চাদর, যা পাতলা মাটির স্তরের নিচে প্রাকৃতিকভাবে সুরক্ষিত।',
    nasaDataset: NASA_PLANETARY_DATASETS.sharad_subsurface_radar,
    simulatedEffects: {
      solarEfficiencyMod: 0.90,      // Mid-latitude orbital solar incidence is slightly lower
      constructionCostMod: 0.95,     // Ultra-flat plain provides 5% construction resource savings!
      waterExtractionBonus: 1.45,    // Massive +45% water recovery bonus from shallow glacier ice!
      radiationDoseMod: 1.0
    }
  },
  {
    id: 'gale_crater',
    name: 'Gale Crater (Mount Sharp Foothills)',
    nameBn: 'গেল ক্র্যাটার (মাউন্ট শার্প পাদদেশ)',
    destination: 'mars',
    coordinates: '5.4° S, 137.8° E',
    elevation_km: -4.4, // Deep crater depression
    slope_deg: 5.8,
    solarIlluminationPct: 96,
    temperatureRange: [-90, 0],
    constructionSuitability: 'MODERATE',
    suitabilityReason: 'Deepest crater basin (-4.4 km) provides natural terrain radiation shielding and higher atmospheric density, but dune fields present rover traction wear.',
    suitabilityReasonBn: 'গভীর খাদ হওয়ায় প্রাকৃতিক বিকিরণ সুরক্ষা পাওয়া যায় এবং বায়ুমণ্ডলীয় ঘনত্ব বেশি থাকে। তবে বালির ঢিবিতে রোভারের চাকা বেশি ক্ষয় হতে পারে।',
    terrainRisk: 'Active barchan sand dune migration and abrasive wheel-wearing sharp ventifacts.',
    terrainRiskBn: 'চলমান বালির স্তূপ এবং ধারালো পাথুরে খণ্ডের কারণে চাকা ক্ষয়ের ঝুঁকি।',
    subsurfaceIce: false,
    missionContext: 'Mars Science Laboratory (MSL Curiosity Rover) continuous surface dosimetry and geology site.',
    missionContextBn: 'মার্স সায়েন্স ল্যাবরেটরি (কিউরিওসিটি রোভার) এর এক দশকেরও বেশি সময়ের গবেষণার কেন্দ্র।',
    scientificSignificance: 'Mount Sharp rises 5.5 km from crater floor, exposing billions of years of layered Martian climate transitions from wet to arid.',
    scientificSignificanceBn: '৫.৫ কিমি উঁচু মাউন্ট শার্প পাহাড় মঙ্গলের জলবায়ু পরিবর্তনের কোটি কোটি বছরের ইতিহাস স্তরে স্তরে ধারণ করে আছে।',
    nasaDataset: NASA_PLANETARY_DATASETS.msl_curiosity_rad,
    simulatedEffects: {
      solarEfficiencyMod: 1.0,
      constructionCostMod: 1.10,     // 10% extra due to crater floor rocks and dunes
      waterExtractionBonus: 1.0,
      radiationDoseMod: 0.85         // Verified MSL RAD data: Crater depression blocks 15% of cosmic rays!
    }
  },
  {
    id: 'olympus_mons_aureole',
    name: 'Olympus Mons Aureole',
    nameBn: 'অলিম্পাস মনস অরিওল (আগ্নেয়গিরি মালভূমি)',
    destination: 'mars',
    coordinates: '18.65° N, 226.2° E',
    elevation_km: 18.5, // Summit altitude extreme
    slope_deg: 16.8,    // Steep volcanic cliff slope
    solarIlluminationPct: 100, // Above atmospheric dust clouds!
    temperatureRange: [-135, -35],
    constructionSuitability: 'CHALLENGING',
    suitabilityReason: 'Extreme altitude rises above global dust storms, ensuring uninterrupted solar power. However, ultra-thin atmosphere (0.14 kPa) causes extreme cold, lack of aerodynamic deceleration, and severe radiation exposure.',
    suitabilityReasonBn: '১৮ কিমি উঁচুতে হওয়ায় ধূলিঝড়ের উপরে থাকে এবং সর্বোচ্চ সৌরশক্তি পাওয়া যায়। কিন্তু বাতাস অত্যন্ত পাতলা হওয়ায় তীব্র ঠান্ডা ও মহাজাগতিক বিকিরণের ঝুঁকি চরম।',
    terrainRisk: 'Extreme 6-kilometer drop cliff escarpments and ultra-low atmospheric pressure.',
    terrainRiskBn: 'বিশাল ৬ কিমি খাড়া পাহাড়ের খাদ এবং প্রায় বায়ুশূন্য পরিবেশ।',
    subsurfaceIce: false,
    missionContext: 'MGS MOLA elevation extreme research; ultimate engineering proving ground.',
    missionContextBn: 'সৌরজগতের বৃহত্তম আগ্নেয়গিরি গবেষণার শীর্ষ প্রকৌশল সাইট।',
    scientificSignificance: 'Largest shield volcano in the solar system, with a 600-km footprint formed by stationary mantle plume hotspots.',
    scientificSignificanceBn: 'সৌরজগতের বৃহত্তম আগ্নেয়গিরি, যা ৬০০ কিমি চওড়া এবং মাটির গভীর ভূ-অভ্যন্তরীণ ইতিহাসের প্রতীক।',
    nasaDataset: NASA_PLANETARY_DATASETS.mola_mars_topography,
    simulatedEffects: {
      solarEfficiencyMod: 1.30,      // Sun shines bright above lower tropospheric dust!
      constructionCostMod: 1.35,     // Steep slopes & vacuum require 35% extra engineering resources
      waterExtractionBonus: 0.80,    // Desiccated peak
      radiationDoseMod: 1.30         // Thinnest air on Mars provides almost no cosmic ray deceleration
    }
  }
];

export const ALL_LANDING_SITES: LandingSiteConfig[] = [
  ...LUNAR_LANDING_SITES,
  ...MARS_LANDING_SITES
];

export function getLandingSiteById(id: string): LandingSiteConfig {
  const found = ALL_LANDING_SITES.find(s => s.id === id);
  if (found) return found;
  return LUNAR_LANDING_SITES[0];
}

export function getLandingSitesForDestination(dest: 'moon' | 'mars'): LandingSiteConfig[] {
  return dest === 'moon' ? LUNAR_LANDING_SITES : MARS_LANDING_SITES;
}
