// STEM Educational Explanations & NASA Physics Content

export interface EducationalArticle {
  id: string;
  title: string;
  titleBn?: string;
  subtitle: string;
  subtitleBn?: string;
  category: 'Life Support' | 'Power & Energy' | 'Radiation & Health' | 'Botany & Food' | 'Systems Engineering';
  categoryBn?: string;
  simplifiedExplanation: string;
  simplifiedExplanationBn?: string;
  visualDiagram: {
    type: 'flow' | 'shield' | 'cycle' | 'balance';
    labels: string[];
    labelsBn?: string[];
    caption: string;
    captionBn?: string;
  };
  realNasaMissionFact: string;
  realNasaMissionFactBn?: string;
  advancedEngineeringSpec: {
    formulaOrMetric: string;
    description: string;
    descriptionBn?: string;
    realWorldCounterpart: string;
    referenceDocument: string;
  };
}

export const EDUCATIONAL_ARTICLES: Record<string, EducationalArticle> = {
  radiation_physics: {
    id: 'radiation_physics',
    title: 'Radiation Shielding in Deep Space',
    titleBn: 'মহাশূন্যে বিপজ্জনক বিকিরণ ও সুরক্ষাবলয় (Radiation Shielding)',
    subtitle: 'Why lead is not the best shield in space, and why water and regolith win.',
    subtitleBn: 'মহাকাশে ভারী সীসা কেন নিরাপদ নয়, কিন্তু পানি ও চাঁদের মাটি সেরা সুরক্ষা দেয়।',
    category: 'Radiation & Health',
    categoryBn: 'বিকিরণ ও নভোচারী স্বাস্থ্য',
    simplifiedExplanation: 
      'On Earth, our thick atmosphere and strong magnetic field block cosmic rays and solar flares. On the Moon or Mars, astronauts face Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). Unlike Earth medical X-rays where heavy lead is used, space radiation consists of high-energy protons and heavy ions. Heavy atomic nuclei like lead create dangerous secondary radiation (Bremsstrahlung and nuclear fragmentation) when struck. Instead, materials with light atoms packed with protons—like water (H₂O), polyethylene plastic, or thick piled lunar soil (regolith)—safely absorb space radiation.',
    simplifiedExplanationBn:
      'পৃথিবীতে আমাদের চারপাশের বায়ুমণ্ডল ও চৌম্বক ক্ষেত্র সূর্য ও গ্যালাক্সির ক্ষতিকর মহাজাগতিক রশ্মি (Cosmic Rays) আটকে রাখে। কিন্তু চাঁদ বা মঙ্গলে কোনো বায়ুমণ্ডল নেই! সেখানে তীব্র গতিতে ছুটে আসে ক্ষতিকর প্রোটন কণা। পৃথিবীর এক্স-রে রুমে সীসা (Lead) ব্যবহার করা হলেও মহাকাশে তা মারাত্মক ক্ষতিকর—কারণ সীসায় কণা আঘাত করলে তা ভেঙে আরও বিপজ্জনক কণা ছড়ায়। তাই মহাকাশ বিজ্ঞানীরা হাইড্রোজেন সমৃদ্ধ হালকা জিনিস ব্যবহার করেন—যেমন পানি (H₂O), বিশেষ প্লাস্টিক এবং চাঁদ বা মঙ্গলের মাটির পুরু স্তর (Regolith), যা বিকিরণকে নিরাপদে শুষে নেয়।',
    visualDiagram: {
      type: 'shield',
      labels: ['Incoming Solar Protons', 'Regolith / Water Barrier', 'Protected Habitat Core'],
      labelsBn: ['সৌর প্রোটন রশ্মি', 'রেগোলিথ ও পানি শিল্ড', 'সুরক্ষিত নভোচারী ঘর'],
      caption: 'Light elements (Hydrogen) absorb particle kinetic energy without spraying heavy secondary fragments.',
      captionBn: 'হালকা পরমাণু (হাইড্রোজেন) বিপজ্জনক কণাগুলোকে নিরাপদে আটকে দেয়।'
    },
    realNasaMissionFact:
      'On the International Space Station, astronauts sleep surrounded by water bags and polyethylene bricks in the crew quarters for added radiation shielding during solar proton events.',
    realNasaMissionFactBn:
      'আন্তর্জাতিক মহাকাশ স্টেশনে (ISS) তীব্র সৌরঝড়ের সময় নভোচারীদের ঘুমানোর কেবিনের চারপাশে পানির ব্যাগ ও বিশেষ পলিইথিলিন ইট সাজিয়ে অতিরিক্ত সুরক্ষা নিশ্চিত করা হয়।',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Dose Equivalent H = Q × D (where Q is quality factor up to 20 for heavy ions, measured in Sieverts/yr)',
      description: 'Annual exposure on the lunar surface averages 380 mSv/yr, compared to ~3 mSv/yr on Earth. NASA limits career astronaut exposure to keep lifetime excess risk of cancer mortality below 3%.',
      descriptionBn: 'চাঁদের বুকে বার্ষিক বিকিরণ প্রায় ৩৮০ mSv, যেখানে পৃথিবীতে মাত্র ৩ mSv। নাসা নভোচারীদের আজীবন বিকিরণ কঠোরভাবে নিয়ন্ত্রণ করে।',
      realWorldCounterpart: 'NASA Artemis Crew Survival Shielding & Lunar Regolith Sintering Studies',
      referenceDocument: 'NASA TP-2015-218570: Human Exploration of Mars - Radiation Assessment'
    }
  },

  power_grids_dust: {
    id: 'power_grids_dust',
    title: 'Photovoltaic Power & The Threat of Martian Dust',
    titleBn: 'সৌর বিদ্যুৎ ও মঙ্গলের ধূলিঝড়ের চ্যালেঞ্জ (Solar Power & Dust)',
    subtitle: 'How atmospheric opacity (Tau) affects solar cell generation.',
    subtitleBn: 'বাতাসের ধূলিকণা কীভাবে সৌর প্যানেলের বিদ্যুৎ উৎপাদন কমিয়ে দেয়।',
    category: 'Power & Energy',
    categoryBn: 'শক্তি ও বিদ্যুৎ গ্রিড',
    simplifiedExplanation: 
      'Solar panels convert sunlight photons into electricity. On the Moon, there is zero atmosphere, but each lunar night lasts 14 Earth days (354 hours of darkness!), requiring immense battery storage or regenerative fuel cells. On Mars, global dust storms loft fine iron-oxide dust high into the thin atmosphere, creating high optical depth (tau factor > 8.0) that blocks over 99% of sunlight and coats solar panels.',
    simplifiedExplanationBn:
      'সৌর প্যানেল সূর্যের আলো শুষে বিদ্যুৎ তৈরি করে। চাঁদে কোনো ধূলিঝড় নেই, কিন্তু সেখানে এক নাগারে ১৪ দিন রাত থাকে! অর্থাৎ ৩৫০ ঘণ্টারও বেশি সময় ব্যাটারির জমানো বিদ্যুতে চলতে হয়। অন্যদিকে মঙ্গলে লাল লোহার ধূলিকণার বিশাল ঝড় পুরো গ্রহকে ঢেকে ফেলে। ধুলো সৌর প্যানেলের ওপর জমে সূর্যের আলো আটকে দেয়—ফলে বিদ্যুৎ উৎপাদন ৭৫% থেকে ৯৯% পর্যন্ত কমে যায়!',
    visualDiagram: {
      type: 'balance',
      labels: ['Sunlight', 'Dust Obscuration', 'Degraded Solar Output', 'Battery Draw Rate'],
      labelsBn: ['সূর্যালোক', 'ধূলিঝড়ের বাধা', 'সৌর বিদ্যুৎ হ্রাস', 'ব্যাটারির চাপ বৃদ্ধি'],
      caption: 'Atmospheric optical depth reduces direct irradiance, requiring reserve battery shedding.',
      captionBn: 'বাতাসে ধূলিকণা বাড়লে বিদ্যুৎ কমে যায় এবং জরুরি ব্যাটারি সঞ্চয় প্রয়োজন হয়।'
    },
    realNasaMissionFact:
      'In 2018, a planet-encircling Martian dust storm ended the 14-year mission of NASA’s Opportunity rover after dust obscured the sun, draining its solar-charged batteries.',
    realNasaMissionFactBn:
      '২০১৮ সালে মঙ্গলের এক প্রলয়ঙ্করী ধূলিঝড়ে নাসার ঐতিহাসিক অপরচুনিটি রোভারটির সৌর প্যানেল ধুলোয় ঢেকে যায়, যার ফলে ১৪ বছরের সফল অভিযানের সমাপ্তি ঘটে।',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Solar Irradiance I = I₀ × exp(-τ / cos θ), where τ is atmospheric optical depth',
      description: 'Martian solar irradiance is already only 43% of Earth’s (~590 W/m² vs ~1361 W/m²). When optical depth τ climbs above 3.0 during storms, photovoltaic output drops below operational thresholds.',
      descriptionBn: 'মঙ্গলে এমনিতেই সূর্যের আলো পৃথিবীর মাত্র ৪৩%। ধূলিঝড়ের অপটিক্যাল ডেপথ বাড়লে সোলার পাওয়ার আশঙ্কাজনকভাবে কমে যায়।',
      realWorldCounterpart: 'InSight & Opportunity Mars Landers Photovoltaic Cleaning Events',
      referenceDocument: 'NASA JPL Mars Exploration Rover (MER) Power Telemetry Archive'
    }
  },

  eclss_water_recovery: {
    id: 'eclss_water_recovery',
    title: 'Closed-Loop Environmental Life Support (ECLSS)',
    titleBn: 'ক্লোজড-লুপ পানি পুনর্ব্যবহার প্রযুক্তি (Water Recovery ECLSS)',
    subtitle: 'Every drop of water must be purified, recovered, and recycled.',
    subtitleBn: 'ঘাঁটির প্রতিটি ফোঁটা পানি বিশুদ্ধ ও পুনর্ব্যবহারযোগ্য করা জরুরি।',
    category: 'Life Support',
    categoryBn: 'জীবনরক্ষা ব্যবস্থা (ECLSS)',
    simplifiedExplanation: 
      'Launching water from Earth costs tens of thousands of dollars per kilogram. On long-duration outposts, almost every single drop of water—including astronaut perspiration, exhaled humidity, and hygiene water—must be reclaimed. Condensate dehumidifiers pull moisture from the cabin air, while vacuum distillation and catalytic oxidizers purify water to standards cleaner than municipal tap water on Earth.',
    simplifiedExplanationBn:
      'পৃথিবী থেকে মহাকাশে পানি পাঠাতে প্রতি কেজিতে লক্ষ লক্ষ টাকা খরচ হয়। তাই দূরবর্তী ঘাঁটিতে পানির প্রতিটি ফোঁটা রিসাইকেল করতে হয়! নভোচারীদের নিঃশ্বাসের জলীয় বাষ্প, ঘাম ও ব্যবহৃত পানি বিশেষ ফিল্টার ও ডিস্টিলেশন যন্ত্রে পুরোপুরি জীবাণুমুক্ত করা হয়। এই রিসাইকেল করা পানি পৃথিবীর যে কোনো বোতলজাত মিনারেল ওয়াটারের চেয়েও বেশি বিশুদ্ধ ও নিরাপদ!',
    visualDiagram: {
      type: 'cycle',
      labels: ['Crew Consumption', 'Perspiration & Humidity', 'Dehumidifier Recovery', 'Multi-stage Filtration', 'Potable Tank'],
      labelsBn: ['নভোচারীদের পানি পান', 'নিঃশ্বাস ও ঘামের বাষ্প', 'আর্দ্রতা শোষণ', 'বহুস্তরীয় ফিল্টার', 'বিশুদ্ধ খাবার পানির ট্যাংক'],
      caption: 'The ECLSS water recycling loop operates continuously to maintain mass balance.',
      captionBn: 'জীবনরক্ষা ব্যবস্থার পানি রিসাইক্লিং চক্র নিরবচ্ছিন্নভাবে ৯৮% পানি ফিরিয়ে দেয়।'
    },
    realNasaMissionFact:
      'In 2023, NASA announced that the ISS Environmental Control and Life Support System (ECLSS) achieved a milestone 98% water recovery rate using the Exploration Water Recovery System.',
    realNasaMissionFactBn:
      '২০২৩ সালে নাসা ঘোষণা করে যে আন্তর্জাতিক মহাকাশ স্টেশন তার বিশেষ ওয়াটার রিকভারি সিস্টেম দিয়ে ৯৮% পানি সফলভাবে পুনর্ব্যবহার করার রেকর্ড অর্জন করেছে।',
    advancedEngineeringSpec: {
      formulaOrMetric: 'ECLSS Recovery Rate η = (Recycled H₂O / Total Consumed H₂O) × 100% ≥ 98%',
      description: 'Standard human daily requirement is ~2.5 kg water for hydration and food prep, plus ~1.8 kg for oxygen electrolysis if not reclaimed via Sabatier carbon dioxide reduction.',
      descriptionBn: 'একজন নভোচারীর দৈনিক প্রায় ২.৫ লিটার পানির প্রয়োজন হয়। ৯৮% রিসাইক্লিং দক্ষতা বাইরের সাপ্লাই ছাড়া দীর্ঘদিন বেঁচে থাকার মূল চাবিকাঠি।',
      realWorldCounterpart: 'ISS Urine Processor Assembly (UPA) & Water Processor Assembly (WPA)',
      referenceDocument: 'NASA ECLSS Exploration Water Recovery Architecture (ICES-2023-142)'
    }
  },

  plant_biology_microg: {
    id: 'plant_biology_microg',
    title: 'Hydroponics & Bioregenerative Life Support',
    titleBn: 'হাইড্রোপনিক্স ও মহাকাশ গ্রিনহাউস (Hydroponic Crops)',
    subtitle: 'Growing fresh food while recycling carbon dioxide and generating oxygen.',
    subtitleBn: 'তাজা খাদ্য উৎপাদনের পাশাপাশি বাতাস বিশুদ্ধ করার জীবন্ত কারখানা।',
    category: 'Botany & Food',
    categoryBn: 'উদ্ভিদবিজ্ঞান ও খাদ্য উৎপাদন',
    simplifiedExplanation: 
      'Fresh crops do much more than supply vitamins (like Potassium, Vitamin C, and K) that degrade in packaged space food over time. Plants act as natural bioregenerative life support: through photosynthesis, they consume the carbon dioxide astronauts exhale and release fresh oxygen, while transpiring clean distilled water vapor back into the habitat atmosphere.',
    simplifiedExplanationBn:
      'প্যাকেটজাত মহাকাশ খাবারে দীর্ঘদিন পর ভিটামিন-সি ও প্রয়োজনীয় পুষ্টি নষ্ট হয়ে যায়। তাই মহাকাশ ঘাঁটিতে মাটি ছাড়াই বিশেষ পুষ্টিকর পানিতে (হাইড্রোপনিক্স) শাকসবজি ফলানো হয়। গাছ শুধু খাবারই দেয় না, তারা সালোকসংশ্লেষণ প্রক্রিয়ায় মানুষের শ্বাসত্যাগের ক্ষতিকর কার্বন ডাই-অক্সাইড টেনে নিয়ে বুকভরা তাজা অক্সিজেন উপহার দেয়!',
    visualDiagram: {
      type: 'cycle',
      labels: ['CO₂ from Astronauts', 'Nutrient Hydroponics', 'Photosynthetic LEDs', 'Fresh O₂ + Food Crops'],
      labelsBn: ['মানুষের নির্গত CO₂', 'পুষ্টিসমৃদ্ধ হাইড্রোপনিক্স', 'বিশেষ উদ্ভিজ্জ LED আলো', 'তাজা অক্সিজেন ও পুষ্টিকর ফসল'],
      caption: 'Bioregenerative balance: Plants close the biological loop between carbon and oxygen.',
      captionBn: 'গাছপালা ও মানুষের মধ্যে গ্যাস ও পুষ্টির প্রাকৃতিক ভারসাম্য তৈরি হয়।'
    },
    realNasaMissionFact:
      'Astronauts on the International Space Station have successfully grown and eaten red romaine lettuce, mizuna mustard greens, and chile peppers inside NASA’s Veggie and Advanced Plant Habitat (APH) facilities.',
    realNasaMissionFactBn:
      'আন্তর্জাতিক মহাকাশ স্টেশনের ভেজি (Veggie) ল্যাবে নভোচারীরা সফলভাবে লাল লেটুস পাতা, সরিষা শাক এবং কাঁচামরিচ ফলিয়েছেন এবং সেগুলো মহাকাশেই সানন্দে খেয়েছেন!',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Photosynthetic Reaction: 6 CO₂ + 6 H₂O + Photons → C₆H₁₂O₆ + 6 O₂',
      description: 'Optimal Photosynthetically Active Radiation (PAR) requires specific spectrum tuning: 80% Red (660 nm) for chlorophyll a/b absorption, and 20% Blue (460 nm) for stomatal opening and phototropism.',
      descriptionBn: 'গাছের বৃদ্ধির জন্য ৮০% লাল ও ২০% নীল আলোর বিশেষ অনুপাত রাখা হয়, যা ক্লোরোফিল তৈরি ও উদ্ভিদের পাতা খুলতে সাহায্য করে।',
      realWorldCounterpart: 'NASA Advanced Plant Habitat (APH) and Veggie Production System',
      referenceDocument: 'NASA Technical Memorandum: Bioregenerative Life Support Systems (BLSS) for Mars'
    }
  },

  oxygen_generation_electrolysis: {
    id: 'oxygen_generation_electrolysis',
    title: 'Generating Breathable Oxygen: Electrolysis & MOXIE',
    titleBn: 'নিঃশ্বাসের জন্য অক্সিজেন তৈরি: ইলেকট্রোলাইসিস ও মক্সি (Oxygen Generation)',
    subtitle: 'Splitting molecules to breathe on an airless celestial world.',
    subtitleBn: 'বায়ুহীন মহাকাশে অণু ভেঙে নিঃশ্বাস নেওয়ার বিজ্ঞান।',
    category: 'Life Support',
    categoryBn: 'জীবনরক্ষা ব্যবস্থা (ECLSS)',
    simplifiedExplanation: 
      'To breathe without bringing months of heavy oxygen tanks from Earth, outposts use chemistry. One method is water electrolysis: running electric current through water to split it into hydrogen gas and breathable oxygen gas (2 H₂O → 2 H₂ + O₂). On Mars, where 95% of the atmosphere is carbon dioxide, NASA developed MOXIE—an instrument that heats CO₂ to 800°C to split carbon dioxide into carbon monoxide and breathable oxygen.',
    simplifiedExplanationBn:
      'পৃথিবী থেকে সব অক্সিজেন বোতলে ভরে বয়ে নেওয়া সম্ভব নয়। তাই মহাকাশ বিজ্ঞানীরা পানির অণু ভেঙে অক্সিজেন তৈরি করেন (ইলেক্ট্রোলাইসিস: 2 H₂O → 2 H₂ + O₂)। আর মঙ্গলে যেখানে ৯৫% বাতাসই কার্বন ডাই-অক্সাইড, সেখানে নাসার বিশেষ ‘মক্সি (MOXIE)’ যন্ত্র ৮০০ ডিগ্রি সেলসিয়াসে বাতাস গরম করে কার্বন ডাই-অক্সাইড থেকে খাঁটি অক্সিজেন আলাদা করে ফেলে!',
    visualDiagram: {
      type: 'flow',
      labels: ['Power Supply', 'H₂O or CO₂ Feedstock', 'Electrolysis / Solid Oxide Cell', 'Pure Breathable O₂'],
      labelsBn: ['বিদ্যুৎ শক্তি', 'পানি (H₂O) বা কার্বন ডাই-অক্সাইড (CO₂)', 'ইলেক্ট্রোলাইসিস সেল', 'বিশুদ্ধ নিঃশ্বাসযোগ্য অক্সিজেন (O₂)'],
      caption: 'Electrical energy splits bonded chemical molecules into elemental breathable oxygen.',
      captionBn: 'বিদ্যুৎ শক্তির সাহায্যে অণু ভেঙে বেঁচে থাকার উপযোগী অক্সিজেন উৎপন্ন করা হয়।'
    },
    realNasaMissionFact:
      'NASA’s Perseverance rover successfully generated 122 grams of oxygen on Mars using the MOXIE instrument—enough to sustain a small dog for 10 hours—proving In-Situ Resource Utilization (ISRU) works!',
    realNasaMissionFactBn:
      'নাসার পারসিভিয়ারেন্স রোভার মঙ্গলের মাটিতে মক্সি (MOXIE) যন্ত্র দিয়ে ১২২ গ্রাম খাঁটি অক্সিজেন বানিয়ে দেখিয়েছে—যা প্রমাণ করে মহাকাশের স্থানীয় উপাদান থেকেই বাঁচার রসদ তৈরি সম্ভব!',
    advancedEngineeringSpec: {
      formulaOrMetric: 'Mars ISRU: 2 CO₂ → 2 CO + O₂ (via Solid Oxide Electrolysis Cells at 800°C)',
      description: 'An adult human requires approximately 0.84 kg of O₂ per day at 101.3 kPa cabin pressure (or ~0.55 kg/day in a 56 kPa Artemis 34% O₂ environment).',
      descriptionBn: 'একজন পূর্ণবয়স্ক মানুষের প্রতিদিন প্রায় ০.৮৪ কেজি অক্সিজেন প্রয়োজন হয়। স্থানীয় সম্পদ থেকে অক্সিজেন তৈরিকে ISRU বলা হয়।',
      realWorldCounterpart: 'Mars Oxygen ISRU Experiment (MOXIE) on Perseverance Rover',
      referenceDocument: 'Hecht et al., Science Advances: Mars Oxygen ISRU Experiment (MOXIE)'
    }
  },

  systems_engineering_redundancy: {
    id: 'systems_engineering_redundancy',
    title: 'Redundancy, Mean Time Between Failures & Spare Parts',
    titleBn: 'সিস্টেম ইঞ্জিনিয়ারিং ও যন্ত্রাংশের গুরুত্ব (Spare Parts & Redundancy)',
    subtitle: 'The golden rule of aerospace engineering: Two is one, and one is none.',
    subtitleBn: 'মহাকাশ প্রকৌশলের মূল নীতি: ব্যাকআপ ছাড়া মহাকাশে কোনো যন্ত্র নিরাপদ নয়।',
    category: 'Systems Engineering',
    categoryBn: 'সিস্টেম ইঞ্জিনিয়ারিং ও নিরাপত্তা',
    simplifiedExplanation: 
      'In deep space, you cannot call for a hardware replacement truck. Critical systems must have redundancy: duplicate backup pumps, bypass valves, and spare components. Spare parts represent mass that was launched instead of extra food or fuel. Engineers must balance the risk of mechanical breakdowns against the payload mass budget.',
    simplifiedExplanationBn:
      'মহাকাশে কোনো যন্ত্র নষ্ট হলে দোকানে গিয়ে কেনার উপায় নেই! তাই জীবনরক্ষাকারী প্রতিটি যন্ত্রের অন্তত একটি বিকল্প ব্যাকআপ রাখা হয়। রকেটের ওজনসীমা সীমিত হওয়ায় অতিরিক্ত যন্ত্রাংশ নিলে খাবার বা পানি কম নিতে হয়। প্রকৌশলীদের সবসময় সিদ্ধান্ত নিতে হয়—কোন যন্ত্রাংশ নেওয়া বেশি জরুরি এবং নষ্ট হলে তাৎক্ষণিকভাবে কীভাবে ৩ডি প্রিন্ট করে মেরামত করা যায়।',
    visualDiagram: {
      type: 'balance',
      labels: ['Launch Mass Budget', 'Spare Parts Allowance', 'Mean Time Between Failures', 'Base Resilience'],
      labelsBn: ['রকেট ওজন বাজেট', 'জরুরি যন্ত্রাংশ বরাদ্দ', 'যন্ত্র নষ্টের সম্ভাব্য সময়', 'ঘাঁটির দীর্ঘমেয়াদী স্থায়িত্ব'],
      caption: 'Every spare part launched protects against a single point of failure at the cost of launch budget.',
      captionBn: 'প্রতিটি অতিরিক্ত যন্ত্রাংশ ঘাঁটিকে বড় বিপর্যয় থেকে রক্ষা করে।'
    },
    realNasaMissionFact:
      'The ISS has a 3D printer capable of fabricating spare tools and replacement plastic fasteners in microgravity using CAD files beamed up from engineers at Mission Control in Houston.',
    realNasaMissionFactBn:
      'আন্তর্জাতিক মহাকাশ স্টেশনে বিশেষ ৩ডি প্রিন্টার রয়েছে, যা হিউস্টন থেকে পাঠানো কম্পিউটার ডিজাইনের মাধ্যমে মহাকাশেই প্রয়োজনীয় রেঞ্জ ও নাট-বল্টু তাৎক্ষণিকভাবে প্রিন্ট করে দিতে পারে!',
    advancedEngineeringSpec: {
      formulaOrMetric: 'System Reliability R(t) = 1 - ∏(1 - R_subsystem(t)) with active parallel redundancy',
      description: 'Critical life-support systems (Class 1-A) require dual-fault tolerance: the system must survive two consecutive component failures without loss of crew life.',
      descriptionBn: 'জীবনরক্ষাকারী ক্লাস ১-এ সিস্টেমগুলোর অন্তত দুটি পরপর যান্ত্রিক ত্রুটি সামলানোর ক্ষমতা থাকতে হয় (Dual-fault tolerance)।',
      realWorldCounterpart: 'NASA Human-Rating Requirements for Space Systems (NASA-STD-8705.2C)',
      referenceDocument: 'NASA Systems Engineering Handbook (NASA/SP-2016-6105 Rev 2)'
    }
  }
};
