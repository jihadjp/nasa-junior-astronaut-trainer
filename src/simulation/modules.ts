// Base Modules Configuration and Logic

import type { BaseModule, ModuleType } from '../types/game';

export const INITIAL_MODULES: Record<ModuleType, BaseModule> = {
  habitat: {
    id: 'habitat',
    name: 'Crew Living Quarters',
    shortName: 'Habitat Core',
    category: 'core',
    level: 1,
    maxLevel: 3,
    costPoints: 120,
    powerDraw: 14, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Pressurized living volume providing thermal control, sleep berths, exercise gear, and air circulation.',
    educationalFact: 'Artemis base camp habitats must maintain 101.3 kPa (or 56 kPa Artemis atmosphere) and 21°C in outside environments from -130°C to +120°C.'
  },
  solar_array: {
    id: 'solar_array',
    name: 'Photovoltaic Solar Array',
    shortName: 'Solar Field',
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
    educationalFact: 'Solar arrays on the Moon experience 14 Earth days of continuous intense sunlight followed by 14 days of darkness.'
  },
  life_support: {
    id: 'life_support',
    name: 'Oxygen Generation & CO₂ Scrubber',
    shortName: 'Oxygen ECLSS',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 140,
    powerDraw: 12, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Sabatier reactors and water electrolysis cells delivering breathable 21% O₂ atmosphere while extracting toxic CO₂.',
    educationalFact: 'Without active carbon dioxide removal, astronaut blood acidity rises (hypercapnia), causing disorientation in hours.'
  },
  water_recycler: {
    id: 'water_recycler',
    name: 'Closed-Loop Water Recovery System',
    shortName: 'Water Recycler',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 130,
    powerDraw: 8, // kW
    efficiency: 0.95,
    operational: true,
    durability: 100,
    description: 'Multi-filtration beds, catalytic oxidizers, and vapor compression distillation reclaiming 95%+ of habitat moisture.',
    educationalFact: 'ISS astronauts recycle sweat and hygiene condensate so efficiently that recovered water is purer than bottled spring water.'
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Hydroponic Crop Greenhouse',
    shortName: 'Bio-Greenhouse',
    category: 'life_support',
    level: 1,
    maxLevel: 3,
    costPoints: 160,
    powerDraw: 16, // kW (high lighting and temperature control)
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Nutrient-film hydroponic growth racks with spectrum-tuned LED illumination growing microgreens and dwarf crops.',
    educationalFact: 'Fresh crops boost astronaut psychological morale and supply Vitamin C & K, which slowly degrade in pre-packaged freeze-dried rations.'
  },
  radiation_shield: {
    id: 'radiation_shield',
    name: 'Regolith Radiation Vault & Water Shield',
    shortName: 'Radiation Shield',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 110,
    powerDraw: 2,
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Sintered lunar/Martian regolith berms and water jacket layers absorbing solar flares and galactic cosmic rays.',
    educationalFact: 'Hydrogen-rich materials like water and sintered regolith block dangerous cosmic rays without generating secondary scatter radiation.'
  },
  science_lab: {
    id: 'science_lab',
    name: 'Astrobiology & Geology Laboratory',
    shortName: 'Science Lab',
    category: 'science',
    level: 1,
    maxLevel: 3,
    costPoints: 90,
    powerDraw: 10, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Mass spectrometers, sample analysis chambers, and geological coring workstations generating research telemetry.',
    educationalFact: 'Space science experiments test mineral resources, search for biosignatures, and prepare technologies for human deep-space migration.'
  },
  rover_garage: {
    id: 'rover_garage',
    name: 'Pressurized Rover Maintenance Bay',
    shortName: 'Rover Bay',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 80,
    powerDraw: 6, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Airlock bay and inductive charging station for pressurized exploration rovers conducting long-distance sorties.',
    educationalFact: 'Apollo 15, 16, and 17 astronauts drove Lunar Roving Vehicles (LRVs) up to 35 kilometers to reach geologic formation boundaries.'
  },
  spare_fabricator: {
    id: 'spare_fabricator',
    name: '3D Additive Parts Fabrication Bay',
    shortName: 'Spare Fabricator',
    category: 'support',
    level: 1,
    maxLevel: 3,
    costPoints: 70,
    powerDraw: 5, // kW
    efficiency: 1.0,
    operational: true,
    durability: 100,
    description: 'Multi-axis metal/polymer 3D printer capable of fabricating replacement valves, gaskets, and electronic circuit boards.',
    educationalFact: 'In-situ additive manufacturing drastically cuts mission mass by printing only the specific replacement parts that break.'
  }
};
