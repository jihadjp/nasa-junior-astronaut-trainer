// STEM Educational Explanations & NASA Physics Content

export interface EducationalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Life Support' | 'Power & Energy' | 'Radiation & Health' | 'Botany & Food' | 'Systems Engineering';
  simplifiedExplanation: string;
  visualDiagram: {
    type: 'flow' | 'shield' | 'cycle' | 'balance';
    labels: string[];
    caption: string;
  };
  realNasaMissionFact: string;
  advancedEngineeringSpec: {
    formulaOrMetric: string;
    description: string;
    realWorldCounterpart: string;
    referenceDocument: string;
  };
}

export const EDUCATIONAL_ARTICLES: Record<string, EducationalArticle> = {
  radiation_physics: {
    id: 'radiation_physics',
    title: 'Radiation Shielding in Deep Space',
    subtitle: 'Why lead is not the best shield in space, and why water and regolith win.',
    category: 'Radiation & Health',
    simplifiedExplanation: 
      'On Earth, our thick atmosphere and strong magnetic field block cosmic rays and solar flares. On the Moon or Mars, astronauts face Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). Unlike Earth medical X-rays where heavy lead is used, space radiation consists of high-energy protons and heavy ions. Heavy atomic nuclei like lead create dangerous secondary radiation (Bremsstrahlung and nuclear fragmentation) when struck. Instead, materials with light atoms packed with protons—like water (H₂O), polyethylene plastic, or thick piled lunar soil (regolith)—safely absorb space radiation.',
    visualDiagram: {
      type: 'shield',
      labels: ['Incoming Solar Protons', 'Regolith / Water Barrier', 'Protected Habitat Core'],
      caption: 'Light elements (Hydrogen) absorb particle kinetic energy without spraying heavy secondary fragments.'
    },
    realNasaMissionFact:
      'On the International Space Station, astronauts sleep surrounded by water bags and polyethylene bricks in the crew quarters for added radiation shielding during solar proton events.',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Dose Equivalent H = Q × D (where Q is quality factor up to 20 for heavy ions, measured in Sieverts/yr)',
      description: 'Annual exposure on the lunar surface averages 380 mSv/yr, compared to ~3 mSv/yr on Earth. NASA limits career astronaut exposure to keep lifetime excess risk of cancer mortality below 3%.',
      realWorldCounterpart: 'NASA Artemis Crew Survival Shielding & Lunar Regolith Sintering Studies',
      referenceDocument: 'NASA TP-2015-218570: Human Exploration of Mars - Radiation Assessment'
    }
  },

  power_grids_dust: {
    id: 'power_grids_dust',
    title: 'Photovoltaic Power & The Threat of Martian Dust',
    subtitle: 'How atmospheric opacity (Tau) affects solar cell generation.',
    category: 'Power & Energy',
    simplifiedExplanation: 
      'Solar panels convert sunlight photons into electricity. On the Moon, there is zero atmosphere, but each lunar night lasts 14 Earth days (354 hours of darkness!), requiring immense battery storage or regenerative fuel cells. On Mars, global dust storms loft fine iron-oxide dust high into the thin atmosphere, creating high optical depth (tau factor > 8.0) that blocks over 99% of sunlight and coats solar panels.',
    visualDiagram: {
      type: 'balance',
      labels: ['Sunlight', 'Dust Obscuration', 'Degraded Solar Output', 'Battery Draw Rate'],
      caption: 'Atmospheric optical depth reduces direct irradiance, requiring reserve battery shedding.'
    },
    realNasaMissionFact:
      'In 2018, a planet-encircling Martian dust storm ended the 14-year mission of NASA’s Opportunity rover after dust obscured the sun, draining its solar-charged batteries.',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Solar Irradiance I = I₀ × exp(-τ / cos θ), where τ is atmospheric optical depth',
      description: 'Martian solar irradiance is already only 43% of Earth’s (~590 W/m² vs ~1361 W/m²). When optical depth τ climbs above 3.0 during storms, photovoltaic output drops below operational thresholds.',
      realWorldCounterpart: 'InSight & Opportunity Mars Landers Photovoltaic Cleaning Events',
      referenceDocument: 'NASA JPL Mars Exploration Rover (MER) Power Telemetry Archive'
    }
  },

  eclss_water_recovery: {
    id: 'eclss_water_recovery',
    title: 'Closed-Loop Environmental Life Support (ECLSS)',
    subtitle: 'Every drop of water must be purified, recovered, and recycled.',
    category: 'Life Support',
    simplifiedExplanation: 
      'Launching water from Earth costs tens of thousands of dollars per kilogram. On long-duration outposts, almost every single drop of water—including astronaut perspiration, exhaled humidity, and hygiene water—must be reclaimed. Condensate dehumidifiers pull moisture from the cabin air, while vacuum distillation and catalytic oxidizers purify water to standards cleaner than municipal tap water on Earth.',
    visualDiagram: {
      type: 'cycle',
      labels: ['Crew Consumption', 'Perspiration & Humidity', 'Dehumidifier Recovery', 'Multi-stage Filtration', 'Potable Tank'],
      caption: 'The ECLSS water recycling loop operates continuously to maintain mass balance.'
    },
    realNasaMissionFact:
      'In 2023, NASA announced that the ISS Environmental Control and Life Support System (ECLSS) achieved a milestone 98% water recovery rate using the Exploration Water Recovery System.',
    advancedEngineeringSpec: {
      formulaOrMetric: 'ECLSS Recovery Rate η = (Recycled H₂O / Total Consumed H₂O) × 100% ≥ 98%',
      description: 'Standard human daily requirement is ~2.5 kg water for hydration and food prep, plus ~1.8 kg for oxygen electrolysis if not reclaimed via Sabatier carbon dioxide reduction.',
      realWorldCounterpart: 'ISS Urine Processor Assembly (UPA) & Water Processor Assembly (WPA)',
      referenceDocument: 'NASA ECLSS Exploration Water Recovery Architecture (ICES-2023-142)'
    }
  },

  plant_biology_microg: {
    id: 'plant_biology_microg',
    title: 'Hydroponics & Bioregenerative Life Support',
    subtitle: 'Growing fresh food while recycling carbon dioxide and generating oxygen.',
    category: 'Botany & Food',
    simplifiedExplanation: 
      'Fresh crops do much more than supply vitamins (like Potassium, Vitamin C, and K) that degrade in packaged space food over time. Plants act as natural bioregenerative life support: through photosynthesis, they consume the carbon dioxide astronauts exhale and release fresh oxygen, while transpiring clean distilled water vapor back into the habitat atmosphere.',
    visualDiagram: {
      type: 'cycle',
      labels: ['CO₂ from Astronauts', 'Nutrient Hydroponics', 'Photosynthetic LEDs', 'Fresh O₂ + Food Crops'],
      caption: 'Bioregenerative balance: Plants close the biological loop between carbon and oxygen.'
    },
    realNasaMissionFact:
      'Astronauts on the International Space Station have successfully grown and eaten red romaine lettuce, mizuna mustard greens, and chile peppers inside NASA’s Veggie and Advanced Plant Habitat (APH) facilities.',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Photosynthetic Reaction: 6 CO₂ + 6 H₂O + Photons → C₆H₁₂O₆ + 6 O₂',
      description: 'Optimal Photosynthetically Active Radiation (PAR) requires specific spectrum tuning: 80% Red (660 nm) for chlorophyll a/b absorption, and 20% Blue (460 nm) for stomatal opening and phototropism.',
      realWorldCounterpart: 'NASA Advanced Plant Habitat (APH) and Veggie Production System',
      referenceDocument: 'NASA Technical Memorandum: Bioregenerative Life Support Systems (BLSS) for Mars'
    }
  },

  oxygen_generation_electrolysis: {
    id: 'oxygen_generation_electrolysis',
    title: 'Generating Breathable Oxygen: Electrolysis & MOXIE',
    subtitle: 'Splitting molecules to breathe on an airless celestial world.',
    category: 'Life Support',
    simplifiedExplanation: 
      'To breathe without bringing months of heavy oxygen tanks from Earth, outposts use chemistry. One method is water electrolysis: running electric current through water to split it into hydrogen gas and breathable oxygen gas (2 H₂O → 2 H₂ + O₂). On Mars, where 95% of the atmosphere is carbon dioxide, NASA developed MOXIE—an instrument that heats CO₂ to 800°C to split carbon dioxide into carbon monoxide and breathable oxygen.',
    visualDiagram: {
      type: 'flow',
      labels: ['Power Supply', 'H₂O or CO₂ Feedstock', 'Electrolysis / Solid Oxide Cell', 'Pure Breathable O₂'],
      caption: 'Electrical energy splits bonded chemical molecules into elemental breathable oxygen.'
    },
    realNasaMissionFact:
      'NASA’s Perseverance rover successfully generated 122 grams of oxygen on Mars using the MOXIE instrument—enough to sustain a small dog for 10 hours—proving In-Situ Resource Utilization (ISRU) works!',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Mars ISRU: 2 CO₂ → 2 CO + O₂ (via Solid Oxide Electrolysis Cells at 800°C)',
      description: 'An adult human requires approximately 0.84 kg of O₂ per day at 101.3 kPa cabin pressure (or ~0.55 kg/day in a 56 kPa Artemis 34% O₂ environment).',
      realWorldCounterpart: 'Mars Oxygen ISRU Experiment (MOXIE) on Perseverance Rover',
      referenceDocument: 'Hecht et al., Science Advances: Mars Oxygen ISRU Experiment (MOXIE)'
    }
  },

  systems_engineering_redundancy: {
    id: 'systems_engineering_redundancy',
    title: 'Redundancy, Mean Time Between Failures & Spare Parts',
    subtitle: 'The golden rule of aerospace engineering: Two is one, and one is none.',
    category: 'Systems Engineering',
    simplifiedExplanation: 
      'In deep space, you cannot call for a hardware replacement truck. Critical systems must have redundancy: duplicate backup pumps, bypass valves, and spare components. Spare parts represent mass that was launched instead of extra food or fuel. Engineers must balance the risk of mechanical breakdowns against the payload mass budget.',
    visualDiagram: {
      type: 'balance',
      labels: ['Launch Mass Budget', 'Spare Parts Allowance', 'Mean Time Between Failures', 'Base Resilience'],
      caption: 'Every spare part launched protects against a single point of failure at the cost of launch budget.'
    },
    realNasaMissionFact:
      'The ISS has a 3D printer capable of fabricating spare tools and replacement plastic fasteners in microgravity using CAD files beamed up from engineers at Mission Control in Houston.',
    advancedEngineeringSpec: {
      formulaOrMetric: 'System Reliability R(t) = 1 - ∏(1 - R_subsystem(t)) with active parallel redundancy',
      description: 'Critical life-support systems (Class 1-A) require dual-fault tolerance: the system must survive two consecutive component failures without loss of crew life.',
      realWorldCounterpart: 'NASA Human-Rating Requirements for Space Systems (NASA-STD-8705.2C)',
      referenceDocument: 'NASA Systems Engineering Handbook (NASA/SP-2016-6105 Rev 2)'
    }
  }
};
