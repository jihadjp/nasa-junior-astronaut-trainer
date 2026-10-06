// Base Modules Configuration and Logic

import type { BaseModule, ModuleType } from '../types/game';

export const INITIAL_MODULES: Record<ModuleType, BaseModule> = {
  habitat: {
    id: 'habitat',
    name: 'Crew Living Quarters',
    nameBn: 'ক্রু বাসস্থান মডিউল (Habitat)',
    shortName: 'Habitat Core',
    shortNameBn: 'বাসস্থান হাব',
    category: 'core',
    level: 1,
    maxLevel: 3,
    costPoints: 120,
    powerDraw: 14, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Pressurized living volume providing thermal control, sleep berths, exercise gear, and air circulation.',
    descriptionBn: 'বায়ুচাপযুক্ত লিভিং কোয়ার্টার যেখানে তাপমাত্রা নিয়ন্ত্রণ, ঘুমানোর জায়গা, ব্যায়ামাগার ও বাতাস সঞ্চালন ব্যবস্থা রয়েছে।',
    educationalFact: 'Artemis base camp habitats must maintain 101.3 kPa (or 56 kPa Artemis atmosphere) and 21°C in outside environments from -130°C to +120°C.'
  },
  solar_array: {
    id: 'solar_array',
    name: 'Photovoltaic Solar Array',
    nameBn: 'সৌর বিদ্যুৎ প্যানেল অ্যারে (Solar Array)',
    shortName: 'Solar Field',
    shortNameBn: 'সোলার ফিল্ড',
    category: 'energy',
    level: 2,
    maxLevel: 3,
    costPoints: 150,
    powerDraw: 1,
    powerGeneration: 52, // kW under nominal sun
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'High-efficiency triple-junction solar panels converting extraterrestrial sunlight into electrical power.',
    descriptionBn: 'উচ্চ ক্ষমতাসম্পন্ন সৌর প্যানেল যা মহাজাগতিক সূর্যালোককে বিদ্যুতে রূপান্তর করে আউতপোস্ট চালায়।',
    educationalFact: 'Solar arrays on the Moon experience 14 Earth days of continuous intense sunlight followed by 14 days of darkness.'
  },
  life_support: {
    id: 'life_support',
    name: 'Oxygen Generation & CO₂ Scrubber',
    nameBn: 'অক্সিজেন উৎপাদন ও কার্বন ডাই-অক্সাইড স্ক্রাবার',
    shortName: 'Oxygen ECLSS',
    shortNameBn: 'অক্সিজেন ECLSS',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 140,
    powerDraw: 12, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Sabatier reactors and water electrolysis cells delivering breathable 21% O₂ atmosphere while extracting toxic CO₂.',
    descriptionBn: 'পানি বিশ্লেষণ ও সাবাতিয়ের রিঅ্যাক্টর যা নিঃশ্বাসযোগ্য ২১% অক্সিজেন তৈরি করে এবং ক্ষতিকর কার্বন ডাই-অক্সাইড দূর করে।',
    educationalFact: 'Without active carbon dioxide removal, astronaut blood acidity rises (hypercapnia), causing disorientation in hours.'
  },
  water_recycler: {
    id: 'water_recycler',
    name: 'Closed-Loop Water Recovery System',
    nameBn: 'পানি পুনর্ব্যবহার ব্যবস্থা (Water Recycler)',
    shortName: 'Water Recycler',
    shortNameBn: 'ওয়াটার রিসাইক্লার',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 130,
    powerDraw: 8, // kW
    efficiency: 0.95,
    operational: true,
    durability: 100,
    description: 'Multi-filtration beds, catalytic oxidizers, and vapor compression distillation reclaiming 95%+ of habitat moisture.',
    descriptionBn: 'ফিল্ট্রেশন ও ডিস্টিলেশন ব্যবস্থা যা ঘাঁটির ৯৫%+ আর্দ্রতা ও বর্জ্যপানি বিশুদ্ধ খাবার পানিতে রূপান্তর করে।',
    educationalFact: 'ISS astronauts recycle sweat and hygiene condensate so efficiently that recovered water is purer than bottled spring water.'
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Hydroponic Crop Greenhouse',
    nameBn: 'হাইড্রোপনিক গ্রিনহাউস (Greenhouse)',
    shortName: 'Bio-Greenhouse',
    shortNameBn: 'বায়ো-গ্রিনহাউস',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 160,
    powerDraw: 16, // kW (high lighting and temperature control)
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Nutrient-film hydroponic growth racks with spectrum-tuned LED illumination growing microgreens and dwarf crops.',
    descriptionBn: 'মাটিহীন হাইড্রোপনিক তাকে বিশেষ এলইডি আলো ব্যবহার করে তাজা শাকসবজি ও ভিটামিন সমৃদ্ধ পুষ্টিকর খাদ্য ফলায়।',
    educationalFact: 'Fresh crops boost astronaut psychological morale and supply Vitamin C & K, which slowly degrade in pre-packaged freeze-dried rations.'
  },
  radiation_shield: {
    id: 'radiation_shield',
    name: 'Regolith Radiation Vault & Water Shield',
    nameBn: 'রেগোলিথ বিকিরণ ঢাল ও ওয়াটার শিল্ড',
    shortName: 'Radiation Shield',
    shortNameBn: 'বিকিরণ শিল্ড',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 110,
    powerDraw: 2,
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Sintered lunar/Martian regolith berms and water jacket layers absorbing solar flares and galactic cosmic rays.',
    descriptionBn: 'চাঁদ বা মঙ্গলের মাটির স্তর ও পানির জ্যাকেট যা বিপজ্জনক সৌরঝড় ও ক্ষতিকর কসমিক রশ্মি আটকে দেয়।',
    educationalFact: 'Hydrogen-rich materials like water and sintered regolith block dangerous cosmic rays without generating secondary scatter radiation.'
  },
  science_lab: {
    id: 'science_lab',
    name: 'Astrobiology & Geology Laboratory',
    nameBn: 'মহাকাশ বিজ্ঞান ও ভূতত্ত্ব গবেষণাগার',
    shortName: 'Science Lab',
    shortNameBn: 'বিজ্ঞান ল্যাব',
    category: 'science',
    level: 1,
    maxLevel: 3,
    costPoints: 90,
    powerDraw: 10, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Mass spectrometers, sample analysis chambers, and geological coring workstations generating research telemetry.',
    descriptionBn: 'স্পেকট্রোমিটার ও নমুনা বিশ্লেষণ যন্ত্র যেখানে মাটির খনিজ ও জীবনের চিহ্ন নিয়ে বৈজ্ঞানিক গবেষণা চলে।',
    educationalFact: 'Space science experiments test mineral resources, search for biosignatures, and prepare technologies for human deep-space migration.'
  },
  rover_garage: {
    id: 'rover_garage',
    name: 'Pressurized Rover Maintenance Bay',
    nameBn: 'রোভার রক্ষণাবেক্ষণ ও চার্জিং বে',
    shortName: 'Rover Bay',
    shortNameBn: 'রোভার গ্যারেজ',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 80,
    powerDraw: 6, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Airlock bay and inductive charging station for pressurized exploration rovers conducting long-distance sorties.',
    descriptionBn: 'এয়ারলক ও চার্জিং ডক যা বহুদূরের অভিযানের জন্য রোভারকে প্রস্তুত ও সচল রাখে।',
    educationalFact: 'Apollo 15, 16, and 17 astronauts drove Lunar Roving Vehicles (LRVs) up to 35 kilometers to reach geologic formation boundaries.'
  },
  spare_fabricator: {
    id: 'spare_fabricator',
    name: '3D Additive Parts Fabrication Bay',
    nameBn: 'জরুরি ৩ডি প্রিন্টিং ও যন্ত্রাংশ তৈরির হাব',
    shortName: 'Spare Fabricator',
    shortNameBn: 'পার্টস ফেব্রিকেটর',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 70,
    powerDraw: 5, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Multi-axis metal/polymer 3D printer capable of fabricating replacement valves, gaskets, and electronic circuit boards.',
    descriptionBn: 'ধাতব ও পলিমার ৩ডি প্রিন্টার যা নষ্ট ভালভ, গ্যাসকেট ও সার্কিট তাৎক্ষণিকভাবে প্রিন্ট করে ঠিক করে।',
    educationalFact: 'In-situ additive manufacturing drastically cuts mission mass by printing only the specific replacement parts that break.'
  }
};
