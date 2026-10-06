// Comprehensive Event Database with Decisions, Causal Chains & STEM links

import type { GameEvent, SimulationState } from '../types/game';

export const GAME_EVENTS: GameEvent[] = [
  // 1. DUST STORM EVENT (Mars or Moon regolith electrostatic levitation)
  {
    id: 'dust_storm',
    title: 'Extraterrestrial Dust Storm Inbound',
    titleBn: 'আসন্ন মহাজাগতিক ধূলিঝড়',
    category: 'environmental',
    urgency: 'high',
    dayTriggerMin: 4,
    dayTriggerMax: 9,
    storyContext: 
      'Atmospheric monitoring indicates a high-velocity dust front bearing down on your outpost. Fine abrasive iron-oxide grains are obscuring the sun and accumulating on photovoltaic cells.',
    storyContextBn:
      'বায়ুমণ্ডলীয় সেন্সর জানাচ্ছে যে তীব্র গতির ধূলিঝড় ঘাঁটির দিকে ধেয়ে আসছে। সূক্ষ্ম ক্ষয়কারী আয়রন অক্সাইড ধূলিকণা সূর্যকে ঢেকে দিচ্ছে এবং সৌর প্যানেলে (Solar Panel) জমছে।',
    telemetrySnapshotText: 
      'Optical depth (Tau) rising to 4.2. Photovoltaic solar generation projected to plummet by 55-75%.',
    telemetrySnapshotTextBn:
      'অপটিক্যাল গভীরতা (Tau) বেড়ে ৪.২ হয়েছে। সৌর বিদ্যুৎ উৎপাদন ৫৫-৭৫% হ্রাস পেতে পারে।',
    illustrationType: 'dust_storm',
    choices: [
      {
        id: 'clean_eva',
        label: 'Deploy Astronauts for Electrostatic Wiper Sortie',
        labelBn: 'ইলেক্ট্রোস্ট্যাটিক ক্লিনিং অভিযানের জন্য নভোচারী পাঠান',
        description: 'Send the Engineer outside in an EVA suit to deploy automated vibratory dust wipers across the primary array.',
        descriptionBn: 'ইঞ্জিনিয়ারকে স্পেসসুট পরিয়ে বাইরে পাঠিয়ে মূল সৌর প্যানেলের উপর স্বয়ংক্রিয় ভাইব্রেটরি ডাস্ট ওয়াইপার চালু করুন।',
        immediateEffectsSummary: 'Restores +30% solar efficiency immediately. Consumes 6 units of spare parts & tires crew.',
        immediateEffectsSummaryBn: 'তৎক্ষণাৎ +৩০% সৌর দক্ষতা ফিরে পায়। ৬টি খুচরা যন্ত্রাংশ খরচ হয় এবং ক্রু ক্লান্ত হয়।',
        tradeoffHint: 'Crew fatigue & suit exposure vs maintaining full electrical power for greenhouse.',
        tradeoffHintBn: 'ক্রুর ক্লান্তি ও স্যুটের ঝুঁকি বনাম গ্রিনহাউসের জন্য পূর্ণ বিদ্যুৎ সরবরাহ নিশ্চিত করা।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            environment: { ...state.environment, dustLevel: Math.max(10, state.environment.dustLevel - 45) },
            resources: { ...state.resources, spareParts: Math.max(0, state.resources.spareParts - 6) },
            crew: state.crew.map(c => c.role === 'engineer' ? { ...c, morale: Math.max(0, c.morale - 8), stress: Math.min(100, c.stress + 15) } : c)
          };
        },
        educationalWhyId: 'power_grids_dust',
        causalChain: [
          {
            step: 1,
            title: 'Astronaut EVA Deployed',
            titleBn: 'নভোচারীর সারফেস এক্সকারশন (EVA)',
            description: 'The Engineer conducted a high-risk surface excursion in fine regolith dust.',
            descriptionBn: 'ইঞ্জিনিয়ার সূক্ষ্ম রেগোলিথ ধুলার মধ্যে উচ্চ-ঝুঁকিপূর্ণ পৃষ্ঠ মেরামত সম্পন্ন করেন।',
            icon: '👨‍🚀',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Solar Panels Cleaned',
            titleBn: 'সৌর প্যানেল পরিষ্কার',
            description: 'Vibratory electrostatic sweeps removed 80% of iron-oxide particulate coating.',
            descriptionBn: 'কম্পনশীল ইলেক্ট্রোস্ট্যাটিক সুইপ ৮০% আয়রন অক্সাইড ধূলিকণা দূর করেছে।',
            icon: '⚡',
            highlightCategory: 'system',
            metricImpact: 'Power generation restored +30%',
            metricImpactBn: 'বিদ্যুৎ উৎপাদন +৩০% পুনরুদ্ধার'
          },
          {
            step: 3,
            title: 'Crew Fatigue & Suit Wear',
            titleBn: 'ক্রুর ক্লান্তি ও স্যুটের ক্ষয়',
            description: 'Dust abrasion wore down EVA seals, and the engineer experienced acute fatigue.',
            descriptionBn: 'ঘর্ষণজনিত কারণে স্যুটের সিল ক্ষয়প্রাপ্ত হয়েছে এবং ইঞ্জিনিয়ার তীব্র ক্লান্ত।',
            icon: '⚠️',
            highlightCategory: 'crew',
            metricImpact: 'Spare Parts -6, Engineer Stress +15%',
            metricImpactBn: 'খুচরা যন্ত্রাংশ -৬, ইঞ্জিনিয়ারের মানসিক চাপ +১৫%'
          },
          {
            step: 4,
            title: 'Mission Grid Protected',
            titleBn: 'ঘাঁটির বিদ্যুৎ সুরক্ষিত',
            description: 'Greenhouse lighting and water recycling maintained uninterrupted 24-hour cycles.',
            descriptionBn: 'গ্রিনহাউসের আলো ও পানি রিসাইক্লিং ব্যবস্থা ২৪ ঘণ্টা নিরবচ্ছিন্নভাবে চালু রয়েছে।',
            icon: '🛡️',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'shed_load',
        label: 'Hunker Down & Shed Science Lab Power',
        labelBn: 'ল্যাবরেটরির বিদ্যুৎ বন্ধ করে ঘাঁটিতে আশ্রয় নিন',
        description: 'Retract sensitive sensors, power down the Astrobiology Laboratory, and run on battery conservation mode until the storm clears.',
        descriptionBn: 'সংবেদনশীল সেন্সরগুলো গুটিয়ে রাখুন, সায়েন্স ল্যাবের পাওয়ার বন্ধ করুন এবং ঝড় না কমা পর্যন্ত ব্যাটারি সংরক্ষণ মোডে চলুন।',
        immediateEffectsSummary: 'Saves 10 kW continuous power. Halts science progress and lowers crew morale.',
        immediateEffectsSummaryBn: 'একটানা ১০ কিলোওয়াট বিদ্যুৎ বাঁচে। তবে বৈজ্ঞানিক গবেষণা বন্ধ থাকে এবং ক্রুর মনোবল কমে।',
        tradeoffHint: 'Zero risk to crew, but zero scientific output during the multi-day storm.',
        tradeoffHintBn: 'ক্রুর কোনো ঝুঁকি নেই, কিন্তু কয়েক দিনের ঝড়ের সময় বৈজ্ঞানিক গবেষণা শূন্য থাকবে।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            environment: { ...state.environment, dustLevel: Math.min(90, state.environment.dustLevel + 30) },
            sciencePoints: Math.max(0, state.sciencePoints - 5),
            crew: state.crew.map(c => ({ ...c, morale: Math.max(0, c.morale - 4) }))
          };
        },
        educationalWhyId: 'power_grids_dust',
        causalChain: [
          {
            step: 1,
            title: 'Lab Systems Powered Down',
            titleBn: 'ল্যাবরেটরি সিস্টেম বন্ধ',
            description: 'Scientific mass spectrometers and rover docks entered unpowered hibernation.',
            descriptionBn: 'বৈজ্ঞানিক স্পেকট্রোমিটার ও রোভার ডক বিদ্যুৎহীন স্লিপ মোডে চলে গেল।',
            icon: '🔌',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Grid Demand Reduced by 10 kW',
            titleBn: '১০ কিলোওয়াট লোড হ্রাস',
            description: 'Battery reserves stabilized without needing dangerous surface maintenance.',
            descriptionBn: 'ঝুঁকিপূর্ণ পৃষ্ঠের বাইরে না গিয়েও ব্যাটারির চার্জ স্থিতিশীল রাখা সম্ভব হলো।',
            icon: '🔋',
            highlightCategory: 'system',
            metricImpact: 'Load reduced by 10 kW',
            metricImpactBn: 'লোড ১০ কিলোওয়াট হ্রাস'
          },
          {
            step: 3,
            title: 'Crew Idled in Quarters',
            titleBn: 'ক্রু কোয়ার্টারে অলস সময়',
            description: 'Confined to the habitat core, crew morale declined from inactivity.',
            descriptionBn: 'বাসস্থানে বন্দি থাকায় নিষ্ক্রিয়তার কারণে ক্রুর মনোবল হ্রাস পেল।',
            icon: '😔',
            highlightCategory: 'crew',
            metricImpact: 'Morale -4% across all crew',
            metricImpactBn: 'সকল ক্রুর মনোবল -৪%'
          },
          {
            step: 4,
            title: 'Science Target Delayed',
            titleBn: 'বিজ্ঞান গবেষণা বিলম্বিত',
            description: 'Zero research milestones were recorded for 3 simulated days.',
            descriptionBn: 'টানা ৩ সিমুলেটেড দিন কোনো গবেষণামূলক ফলাফল রেকর্ড করা যায়নি।',
            icon: '🔬',
            highlightCategory: 'mission',
            metricImpact: 'Science score paused',
            metricImpactBn: 'বিজ্ঞান স্কোর সাময়িক স্থগিত'
          }
        ]
      }
    ]
  },

  // 2. GREENHOUSE IRRIGATION BLIGHT
  {
    id: 'greenhouse_stress',
    title: 'Hydroponic Nutrient Delivery Malfunction',
    titleBn: 'হাইড্রোপনিক পুষ্টি সরবরাহ ব্যবস্থায় ত্রুটি',
    category: 'mechanical',
    urgency: 'medium',
    dayTriggerMin: 8,
    dayTriggerMax: 14,
    storyContext: 
      'Automated sensors in the Bio-Greenhouse detect root dryout and chlorosis (leaf yellowing) across 40% of the red romaine and dwarf wheat racks. A main irrigation dosing valve is sticking.',
    storyContextBn:
      'বায়ো-গ্রিনহাউসের সেন্সরগুলো দেখাচ্ছে ৪০% লাল রোমেইন ও বামন গমের শিকড় শুকিয়ে যাচ্ছে এবং পাতা হলুদ হয়ে গেছে। প্রধান সেচ ডোজ ভাল্বটি আটকে গেছে।',
    telemetrySnapshotText: 
      'Hydroponic pump flow rate down 62%. Plant transpiration recovery offline.',
    telemetrySnapshotTextBn:
      'হাইড্রোপনিক পাম্প প্রবাহের হার ৬২% কমে গেছে। উদ্ভিদের প্রস্বেদন পুনরুদ্ধার ব্যবস্থা অফলাইনে।',
    illustrationType: 'greenhouse_stress',
    choices: [
      {
        id: 'replace_valve_spares',
        label: 'Fabricate & Replace Solid-State Dosing Valve',
        labelBn: 'খুচরা সলিড-স্টেট ভাল্ব তৈরি ও প্রতিস্থাপন করুন',
        description: 'Spend 8 spare parts to install a new ceramic solenoid valve and flush root channels with fresh nutrient fluid.',
        descriptionBn: '৮টি খুচরা যন্ত্রাংশ খরচ করে একটি নতুন সিরামিক সলিনয়েড ভাল্ব বসান এবং শিকড়ের চ্যানেলে সতেজ পুষ্টি তরল দিন।',
        immediateEffectsSummary: 'Restores 100% crop health. Consumes 8 spare parts & 12 Liters of reserve water.',
        immediateEffectsSummaryBn: '১০০% ফসলের স্বাস্থ্য পুনরুদ্ধার। ৮টি খুচরা যন্ত্রাংশ ও ১২ লিটার সংরক্ষিত পানি খরচ হয়।',
        tradeoffHint: 'Spares inventory takes a hit to guarantee uninterrupted harvest calories.',
        tradeoffHintBn: 'নিশ্চিত টাটকা ফসলের ক্যালোরি বজায় রাখতে খুচরা যন্ত্রাংশের মজুত হ্রাস পায়।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            resources: {
              ...state.resources,
              spareParts: Math.max(0, state.resources.spareParts - 8),
              water: Math.max(0, state.resources.water - 12)
            },
            modules: {
              ...state.modules,
              greenhouse: { ...state.modules.greenhouse, efficiency: 1.0, durability: 95 }
            }
          };
        },
        educationalWhyId: 'plant_biology_microg',
        causalChain: [
          {
            step: 1,
            title: 'Spare Part Valve Installed',
            titleBn: 'নতুন ভাল্ব স্থাপন',
            description: 'The crew calibrated and installed a 3D-printed ceramic solenoid valve.',
            descriptionBn: 'ক্রুরা থ্রিডি-প্রিন্টেড সিরামিক সলিনয়েড ভাল্ব নিখুঁতভাবে ক্যালিব্রেট ও ইনস্টল করল।',
            icon: '🔧',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Nutrient Flow Restored',
            titleBn: 'পুষ্টি প্রবাহ পুনরুদ্ধার',
            description: 'Optimal nutrient-film circulation returned to 100% of hydroponic growth trays.',
            descriptionBn: '১০০% হাইড্রোপনিক ট্রেতে আদর্শ পুষ্টি তরল প্রবাহ আবার শুরু হলো।',
            icon: '🌱',
            highlightCategory: 'system',
            metricImpact: 'Greenhouse efficiency restored to 1.0',
            metricImpactBn: 'গ্রিনহাউস দক্ষতা ১.০-এ পুনরুদ্ধার'
          },
          {
            step: 3,
            title: 'Biologist Morale Boost',
            titleBn: 'জীববিজ্ঞানীর মনোবল বৃদ্ধি',
            description: 'The Biologist successfully saved the harvest of fresh Vitamin C microgreens.',
            descriptionBn: 'জীববিজ্ঞানী সফলভাবে টাটকা ভিটামিন-সি সমৃদ্ধ মাইক্রোগ্রিনের ফলন বাঁচালেন।',
            icon: '🥬',
            highlightCategory: 'crew',
            metricImpact: 'Biologist Morale +8%',
            metricImpactBn: 'জীববিজ্ঞানীর মনোবল +৮%'
          },
          {
            step: 4,
            title: 'Reserves Reduced',
            titleBn: 'মজুত হ্রাস',
            description: 'Outpost spare parts and water reserves dropped to pay for the repair.',
            descriptionBn: 'মেরামতের খরচ মেটাতে ঘাঁটির খুচরা যন্ত্রাংশ ও পানির মজুত কিছুটা কমল।',
            icon: '💧',
            highlightCategory: 'mission',
            metricImpact: 'Spares -8, Water -12 L',
            metricImpactBn: 'খুচরা যন্ত্রাংশ -৮, পানি -১২ লিটার'
          }
        ]
      },
      {
        id: 'cull_and_ration',
        label: 'Cull Damaged Trays & Shift to Freeze-Dried Rations',
        labelBn: 'নষ্ট চারা ফেলে দিন ও সংরক্ষিত ফ্রোজেন খাবারে যান',
        description: 'Prune the dying crops to conserve remaining water and switch astronauts to pre-packaged emergency ration packs.',
        descriptionBn: 'পানি বাঁচাতে মরণাপন্ন চারাগুলো ছেঁটে ফেলুন এবং মহাকাশচারীদের প্যাকেটজাত জরুরি খাবারে নিয়ে যান।',
        immediateEffectsSummary: 'Saves water and spare parts. Food production drops by 35% for 7 days.',
        immediateEffectsSummaryBn: 'পানি ও খুচরা যন্ত্রাংশ বাঁচে। ৭ দিনের জন্য খাদ্য উৎপাদন ৩৫% কমে যায়।',
        tradeoffHint: 'Protects critical spare parts inventory at the expense of crew diet variety and future food growth.',
        tradeoffHintBn: 'জরুরি খুচরা যন্ত্রাংশ সুরক্ষিত থাকে, কিন্তু ক্রুর খাবারের বৈচিত্র্য ও ভবিষ্যৎ উৎপাদন ব্যাহত হয়।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            modules: {
              ...state.modules,
              greenhouse: { ...state.modules.greenhouse, efficiency: 0.65 }
            },
            crew: state.crew.map(c => ({ ...c, morale: Math.max(0, c.morale - 6) }))
          };
        },
        educationalWhyId: 'plant_biology_microg',
        causalChain: [
          {
            step: 1,
            title: 'Hydroponic Trays Culled',
            titleBn: 'হাইড্রোপনিক ট্রে ছাঁটাই',
            description: '40% of the active crop volume was composted to prevent bacterial rot.',
            descriptionBn: 'ব্যাকটেরিয়া পচন রোধে ৪০% সক্রিয় চারা কম্পোস্টে রূপান্তর করা হলো।',
            icon: '✂️',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Food Yield Decreased',
            titleBn: 'খাদ্য ফলন হ্রাস',
            description: 'Daily fresh calorie generation fell by 35%, increasing reliance on pantry rations.',
            descriptionBn: 'দৈনিক তাজা ক্যালোরি উৎপাদন ৩৫% কমল, প্যাকেটজাত খাবারের ওপর নির্ভরতা বাড়ল।',
            icon: '🍞',
            highlightCategory: 'system',
            metricImpact: 'Food yield down 35%',
            metricImpactBn: 'খাদ্য উৎপাদন ৩৫% হ্রাস'
          },
          {
            step: 3,
            title: 'Menu Fatigue',
            titleBn: 'খাবারে একঘেয়েমি',
            description: 'Astronauts complained about monotonous vacuum-sealed ration paste.',
            descriptionBn: 'মহাকাশচারীরা প্রতিদিন একইরকম ভ্যাকুয়াম-সিল করা শুকনো খাবার খাওয়ায় অসন্তোষ প্রকাশ করল।',
            icon: '😒',
            highlightCategory: 'crew',
            metricImpact: 'Crew Morale -6%',
            metricImpactBn: 'ক্রুর মনোবল -৬%'
          },
          {
            step: 4,
            title: 'Critical Spares Conserved',
            titleBn: 'গুরুত্বপূর্ণ যন্ত্রাংশ সংরক্ষিত',
            description: 'Remaining spare parts were preserved for life-support contingencies.',
            descriptionBn: 'ভবিষ্যতের জীবন-রক্ষাকারী জরুরি পরিস্থিতির জন্য খুচরা যন্ত্রাংশ অক্ষত রাখা হলো।',
            icon: '🛡️',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  },

  // 3. SOLAR RADIATION FLARE
  {
    id: 'solar_radiation_flare',
    title: 'Coronal Mass Ejection: Solar Particle Event',
    titleBn: 'করোনাল ভর নিক্ষেপ: সৌর কণা ঝড় (CME)',
    category: 'crisis',
    urgency: 'critical',
    dayTriggerMin: 12,
    dayTriggerMax: 18,
    storyContext: 
      'Deep Space Climate Observatory sensors detect an X-class solar flare directed toward your planet. A massive front of relativistic solar protons will impact the base in 45 minutes!',
    storyContextBn:
      'ডিপ স্পেস অবজারভেটরির সেন্সরগুলো আপনার গ্রহের দিকে আসা একটি এক্স-ক্লাস সৌর শিখা শনাক্ত করেছে। তীব্র গতির ক্ষতিকর সৌর প্রোটনের বিশাল ঢেউ ৪৫ মিনিটের মধ্যে ঘাঁটিতে আঘাত করবে!',
    telemetrySnapshotText: 
      'Radiation flux climbing from 1.1 mSv/day to over 28 mSv/day. Dangerous biological ionising radiation.',
    telemetrySnapshotTextBn:
      'বিকিরণের মাত্রা ১.১ mSv/দিন থেকে বেড়ে ২৮ mSv/দিনের বেশি হচ্ছে। বিপজ্জনক জৈবিক আয়োনাইজিং বিকিরণ।',
    illustrationType: 'radiation_spike',
    choices: [
      {
        id: 'storm_shelter',
        label: 'Retreat to Regolith Radiation Storm Shelter',
        labelBn: 'রেগোলিথ বিকিরণ আশ্রয়কেন্দ্রে সরে যান',
        description: 'Order all astronauts into the reinforced regolith vault surrounded by water bladder jackets. All outdoor operations and lab work cease for 48 hours.',
        descriptionBn: 'সকল নভোচারীকে পানির ব্লাডার জ্যাকেট দিয়ে ঘেরা সুরক্ষিত রেগোলিথ ভল্টে আশ্রয় নিতে নির্দেশ দিন। ৪৮ ঘণ্টার জন্য বাইরের সমস্ত অভিযান ও ল্যাব কাজ বন্ধ রাখুন।',
        immediateEffectsSummary: 'Blocks 92% of radiation dose. Halts all science sorties and reduces daily power to essential life support.',
        immediateEffectsSummaryBn: 'বিকিরণ ডোজের ৯২% প্রতিহত করে। বিজ্ঞানের কাজ সাময়িক বন্ধ হয় এবং দৈনিক বিদ্যুৎ কেবল জরুরি ব্যবস্থার জন্য থাকে।',
        tradeoffHint: 'Maximum crew biological protection vs zero mission activity for 2 days.',
        tradeoffHintBn: 'ক্রুর সর্বোচ্চ স্বাস্থ্য সুরক্ষা বনাম ২ দিনের জন্য অভিযানের সব কার্যক্রম বন্ধ।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            environment: { ...state.environment, solarFlareActive: true },
            resources: { ...state.resources, power: Math.max(0, state.resources.power - 15) },
            cumulativeRadiation_mSv: state.cumulativeRadiation_mSv + 1.2,
            crew: state.crew.map(c => ({ ...c, stress: Math.min(100, c.stress + 10) }))
          };
        },
        educationalWhyId: 'radiation_physics',
        causalChain: [
          {
            step: 1,
            title: 'Crew Quarantined in Storm Shelter',
            titleBn: 'ঝড় আশ্রয়কেন্দ্রে কোয়ারেন্টাইন',
            description: 'Astronauts sealed themselves inside the regolith-banked habitat core.',
            descriptionBn: 'মহাকাশচারীরা রেগোলিথ স্তূপ দিয়ে সুরক্ষিত বাসস্থানের ভেতরে নিজেদের আটকে রাখল।',
            icon: '🛡️',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Water Bladders Absorbed Protons',
            titleBn: 'পানি দ্বারা প্রোটন শোষণ',
            description: 'Hydrogen-rich water walls scattered incoming protons without secondary Bremsstrahlung.',
            descriptionBn: 'হাইড্রোজেন-সমৃদ্ধ পানির দেয়াল ক্ষতিকর গৌণ বিকিরণ ছাড়াই আগত প্রোটন কণাকে আটকে দিল।',
            icon: '🌊',
            highlightCategory: 'system',
            metricImpact: '92% radiation dose attenuated',
            metricImpactBn: '৯২% বিকিরণ ডোজ প্রতিহত'
          },
          {
            step: 3,
            title: 'Astronaut DNA Protected',
            titleBn: 'নভোচারীর ডিএনএ সুরক্ষিত',
            description: 'Crew health remained safe with only 1.2 mSv total absorbed dose.',
            descriptionBn: 'মাত্র ১.২ mSv মোট ডোজ শোষিত হওয়ায় ক্রুদের স্বাস্থ্য সম্পূর্ণ নিরাপদ রইল।',
            icon: '❤️',
            highlightCategory: 'crew',
            metricImpact: 'Zero radiation sickness',
            metricImpactBn: 'বিকিরণ অসুস্থতা শূন্য'
          },
          {
            step: 4,
            title: 'Sorties Canceled',
            titleBn: 'বহিরাঙ্গন অভিযান বাতিল',
            description: 'Rover operations were aborted until solar proton levels subsided.',
            descriptionBn: 'সৌর প্রোটনের মাত্রা স্বাভাবিক না হওয়া পর্যন্ত রোভারের কার্যক্রম বাতিল করা হলো।',
            icon: '📡',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'continue_with_shielding_boost',
        label: 'Route Emergency Battery Power to Active Magnetic Deflector',
        labelBn: 'জরুরি ব্যাটারি দিয়ে চৌম্বকীয় বিকিরণ ডিফ্লেক্টর চালু রাখুন',
        description: 'Keep crew in standard quarters and run experimental electromagnetic coil shielding at maximum power to deflect charged particles.',
        descriptionBn: 'ক্রুকে সাধারণ কোয়ার্টারে রেখে পরীক্ষামূলক ইলেক্ট্রোম্যাগনেটিক শিল্ডিং সর্বোচ্চ শক্তিতে চালান যাতে চার্জযুক্ত কণাগুলো দিক পরিবর্তন করে।',
        immediateEffectsSummary: 'Maintains partial science output (+15 pts), but drains 40 kWh of battery storage and absorbs moderate radiation.',
        immediateEffectsSummaryBn: 'আংশিক বিজ্ঞান গবেষণা বজায় থাকে (+১৫ পয়েন্ট), কিন্তু ব্যাটারির ৪০ kWh শক্তি শেষ হয় এবং মাঝারি বিকিরণ শোষিত হয়।',
        tradeoffHint: 'High power drain & moderate health risk for valuable coronal physics measurements.',
        tradeoffHintBn: 'উচ্চ বিদ্যুৎ খরচ এবং মাঝারি স্বাস্থ্য ঝুঁকি নিয়ে মূল্যবান সৌর কণার তথ্য সংগ্রহ।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            environment: { ...state.environment, solarFlareActive: true },
            resources: { ...state.resources, power: Math.max(0, state.resources.power - 40) },
            sciencePoints: state.sciencePoints + 18,
            cumulativeRadiation_mSv: state.cumulativeRadiation_mSv + 5.8,
            crew: state.crew.map(c => ({ ...c, health: Math.max(0, c.health - 6), status: 'Radiation Alert' }))
          };
        },
        educationalWhyId: 'radiation_physics',
        causalChain: [
          {
            step: 1,
            title: 'Active Magnetic Shielding Powered',
            titleBn: 'সক্রিয় চৌম্বকীয় শিল্ড সক্রিয়',
            description: 'Battery banks routed 40 kWh to the high-voltage deflector coils.',
            descriptionBn: 'ব্যাটারি ব্যাংক থেকে ৪০ kWh শক্তি হাই-ভোল্টেজ ডিফ্লেক্টর কয়েলে প্রবাহিত হলো।',
            icon: '⚡',
            highlightCategory: 'decision',
            metricImpact: 'Power storage -40 kWh',
            metricImpactBn: 'বিদ্যুৎ সংরক্ষণ -৪০ kWh'
          },
          {
            step: 2,
            title: 'Valuable Heliophysics Captured',
            titleBn: 'মূল্যবান সৌর পদার্থবিদ্যা রেকর্ড',
            description: 'The science lab recorded rare multi-energy proton spectra during the CME.',
            descriptionBn: 'সায়েন্স ল্যাব সৌর ঝড়ের বিরল মাল্টি-এনার্জি প্রোটন স্পেকট্রা রেকর্ড করেছে।',
            icon: '🔬',
            highlightCategory: 'system',
            metricImpact: 'Science points +18',
            metricImpactBn: 'বিজ্ঞান স্কোর +১৮'
          },
          {
            step: 3,
            title: 'Elevated Dose Exposure',
            titleBn: 'উচ্চ মাত্রার বিকিরণ সংস্পর্শ',
            description: 'High-energy neutrons penetrated outer modules, causing astronaut fatigue.',
            descriptionBn: 'উচ্চ-শক্তির নিউট্রন বাইরের মডিউল ভেদ করায় নভোচারীদের ক্লান্তি দেখা দিল।',
            icon: '⚠️',
            highlightCategory: 'crew',
            metricImpact: 'Crew Health -6%, Radiation Alert',
            metricImpactBn: 'ক্রুর স্বাস্থ্য -৬%, বিকিরণ সতর্কতা'
          },
          {
            step: 4,
            title: 'Battery Reserve Depleted',
            titleBn: 'ব্যাটারির শক্তি ফুরিয়ে যাওয়া',
            description: 'The base entered nighttime with low emergency electrical margin.',
            descriptionBn: 'ঘাঁটিটি খুব কম জরুরি বিদ্যুৎ ব্যাকআপ নিয়ে রাতের চক্রে প্রবেশ করল।',
            icon: '🔋',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  },

  // 4. WATER RECYCLER FILTER FAILURE
  {
    id: 'water_recycler_clog',
    title: 'ECLSS Catalytic Distillation Filter Jam',
    titleBn: 'ECLSS ডিস্টিলেশন ফিল্টার জ্যাম',
    category: 'mechanical',
    urgency: 'high',
    dayTriggerMin: 17,
    dayTriggerMax: 23,
    storyContext: 
      'Mineral scaling and biofilm have clogged the rotary distillation centrifuge in the Water Recovery Assembly. Reclaimed greywater purity has dropped below potable NASA standards.',
    storyContextBn:
      'খনিজ আস্তরণ ও বায়োফিল্মের কারণে ওয়াটার রিকভারি সিস্টেমের রোটারি ডিস্টিলেশন সেন্ট্রিফিউজ আটকে গেছে। পরিশোধিত পানির বিশুদ্ধতা নাসার পানের মানদণ্ডের নিচে নেমে গেছে।',
    telemetrySnapshotText: 
      'Water loop closure down from 95% to 48%. Net loss of 11 Liters/day.',
    telemetrySnapshotTextBn:
      'পানি রিসাইক্লিং লুপ ৯৫% থেকে নেমে ৪৮%-এ পৌঁছেছে। প্রতিদিন নেট ১১ লিটার পানির ঘাটতি।',
    illustrationType: 'water_leak',
    choices: [
      {
        id: 'replace_centrifuge_core',
        label: 'Replace Centrifuge Rotor with Spare Assembly',
        labelBn: 'খুচরা সেন্ট্রিফিউজ রোটর দিয়ে সম্পূর্ণ ইউনিট প্রতিস্থাপন করুন',
        description: 'Install a pre-tested replacement rotor module and recalibrate ultraviolet oxidation sterilizers.',
        descriptionBn: 'একটি পরীক্ষিত নতুন রোটর মডিউল বসান এবং আল্ট্রাভায়োলেট অক্সিডেশন জীবাণুনাশক পুনরায় ক্যালিব্রেট করুন।',
        immediateEffectsSummary: 'Restores water recycling back to 96%. Consumes 10 spare parts.',
        immediateEffectsSummaryBn: 'পানি রিসাইক্লিং আবার ৯৬%-এ ফিরে আসে। ১০টি খুচরা যন্ত্রাংশ খরচ হয়।',
        tradeoffHint: 'Reliable and permanent solution, but heavily depletes remaining spare parts.',
        tradeoffHintBn: 'নির্ভরযোগ্য ও স্থায়ী সমাধান, তবে অবশিষ্ট খুচরা যন্ত্রাংশের মজুত অনেকটা কমে যায়।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            resources: { ...state.resources, spareParts: Math.max(0, state.resources.spareParts - 10) },
            modules: {
              ...state.modules,
              water_recycler: { ...state.modules.water_recycler, efficiency: 0.96, durability: 95 }
            }
          };
        },
        educationalWhyId: 'eclss_water_recovery',
        causalChain: [
          {
            step: 1,
            title: 'Rotor Assembly Replaced',
            titleBn: 'রোটর অ্যাসেম্বলি প্রতিস্থাপন',
            description: 'The Engineer completed a 4-hour precision overhaul of the vapor compression unit.',
            descriptionBn: 'ইঞ্জিনিয়ার ৪ ঘণ্টার নিখুঁত প্রচেষ্টায় ভ্যাপার কম্প্রেশন ইউনিট সম্পূর্ণ ওভারহল করল।',
            icon: '🔧',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Water Loop Closure at 96%',
            titleBn: 'পানি রিসাইক্লিং ৯৬%-এ ফিরল',
            description: 'Effluent conductivity dropped back to pristine 0.2 µS/cm drinking quality.',
            descriptionBn: 'পানির পরিবাহিতা ফিরে এল খাঁটি ০.২ µS/cm পানের উপযোগী মানে।',
            icon: '💧',
            highlightCategory: 'system',
            metricImpact: 'Water recovery efficiency restored',
            metricImpactBn: 'পানি পুনরুদ্ধার দক্ষতা সম্পূর্ণ ঠিক'
          },
          {
            step: 3,
            title: 'Astronaut Hydration Secured',
            titleBn: 'নভোচারীদের পানি নিরাপত্তা',
            description: 'Crew members resumed full hydration and greenhouse irrigation.',
            descriptionBn: 'ক্রু সদস্যরা আবার পর্যাপ্ত বিশুদ্ধ পানি ও গ্রিনহাউস সেচ সুবিধা পেল।',
            icon: '🥛',
            highlightCategory: 'crew'
          },
          {
            step: 4,
            title: 'Spare Inventory Depleted',
            titleBn: 'খুচরা যন্ত্রাংশের মজুত হ্রাস',
            description: 'Only minimal mechanical spares remain for unexpected future hull issues.',
            descriptionBn: 'ভবিষ্যতের অপ্রত্যাশিত কাঠামোগত ত্রুটির জন্য খুব কম যন্ত্রাংশ অবশিষ্ট রইল।',
            icon: '📦',
            highlightCategory: 'mission',
            metricImpact: 'Spare Parts -10 units',
            metricImpactBn: 'খুচরা যন্ত্রাংশ -১০ ইউনিট'
          }
        ]
      },
      {
        id: 'chemical_acid_flush',
        label: 'Perform Chemical Descaling Acid Flush',
        labelBn: 'কেমিক্যাল অ্যাসিড ফ্লাশ দিয়ে পাইপ পরিষ্কার করুন',
        description: 'Inject citric acid solution through the clogged filter pipes without replacing the core rotor.',
        descriptionBn: 'মূল রোটর না বদলে আটকে থাকা ফিল্টারের পাইপগুলোতে সাইট্রিক অ্যাসিড দ্রবণ দিয়ে ফ্লাশ করুন।',
        immediateEffectsSummary: 'Restores recycling to 78% without using spare parts. Damages module durability (-25%) and temporarily consumes 8 L of clean water.',
        immediateEffectsSummaryBn: 'খুচরা যন্ত্রাংশ ছাড়াই রিসাইক্লিং ৭৮%-এ পুনরুদ্ধার হয়। মডিউলের স্থায়িত্ব কমে (-২৫%) এবং অস্থায়ীভাবে ৮ লিটার পরিষ্কার পানি খরচ হয়।',
        tradeoffHint: 'Saves spare parts, but leaves system fragile and degrades future recycling lifespan.',
        tradeoffHintBn: 'খুচরা যন্ত্রাংশ বাঁচায়, তবে সিস্টেমকে ভঙ্গুর করে তোলে এবং ভবিষ্যতের আয়ু হ্রাস করে।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            resources: { ...state.resources, water: Math.max(0, state.resources.water - 8) },
            modules: {
              ...state.modules,
              water_recycler: { ...state.modules.water_recycler, efficiency: 0.78, durability: 60 }
            }
          };
        },
        educationalWhyId: 'eclss_water_recovery',
        causalChain: [
          {
            step: 1,
            title: 'Chemical Acid Flush Executed',
            titleBn: 'রাসায়নিক অ্যাসিড ফ্লাশ সম্পন্ন',
            description: 'Hot citric acid was pumped through scaled distillation tubes.',
            descriptionBn: 'ডিস্টিলেশন পাইপের ভেতর গরম সাইট্রিক অ্যাসিড পাম্প করা হলো।',
            icon: '🧪',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Partial Flow Cleared (78%)',
            titleBn: 'আংশিক প্রবাহ পরিষ্কার (৭৮%)',
            description: 'Blockages dissolved, but corrosive wear degraded pipe gaskets.',
            descriptionBn: 'জ্যাম পরিষ্কার হলো, কিন্তু অ্যাসিড ক্ষয়ের ফলে পাইপের গ্যাসকেটের ক্ষতি হলো।',
            icon: '⚠️',
            highlightCategory: 'system',
            metricImpact: 'Efficiency 78%, Durability -25%',
            metricImpactBn: 'দক্ষতা ৭৮%, স্থায়িত্ব -২৫%'
          },
          {
            step: 3,
            title: 'Water Loss from Flush Cycle',
            titleBn: 'ফ্লাশ সাইকেলে পানি অপচয়',
            description: '8 Liters of potable water were consumed during chemical neutralisation.',
            descriptionBn: 'রাসায়নিক প্রশমনে ৮ লিটার খাবার উপযোগী পানি খরচ হলো।',
            icon: '💧',
            highlightCategory: 'crew',
            metricImpact: 'Water reserve -8 L',
            metricImpactBn: 'পানির মজুত -৮ লিটার'
          },
          {
            step: 4,
            title: 'Spares Preserved',
            titleBn: 'যন্ত্রাংশ সংরক্ষিত রইল',
            description: 'All mechanical spare parts remain in reserve for primary hull integrity.',
            descriptionBn: 'ঘাঁটির মূল ফ্রেম সুরক্ষার জন্য সব মেকানিক্যাল খুচরা যন্ত্রাংশ সংরক্ষিত থাকল।',
            icon: '🛡️',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  },

  // 5. OXYGEN SCRUBBER SATURATION
  {
    id: 'oxygen_scrubber_issue',
    title: 'Sabatier Reactor Catalyst Saturation',
    titleBn: 'সাবাতিয়ে রিঅ্যাক্টর অনুঘটক স্যাচুরেশন',
    category: 'crisis',
    urgency: 'critical',
    dayTriggerMin: 22,
    dayTriggerMax: 27,
    storyContext: 
      'Carbon dioxide partial pressure in the habitat has reached 5.8 mmHg (normal limit: 3.0 mmHg). The ruthenium catalyst in the Sabatier oxygen reclamation loop is poisoned by trace sulfur.',
    storyContextBn:
      'বাসস্থানে কার্বন ডাই-অক্সাইডের আংশিক চাপ ৫.৮ mmHg-এ পৌঁছেছে (স্বাভাবিক মাত্রা: ৩.০ mmHg)। সাবাতিয়ে অক্সিজেন লুপের রুথেনিয়াম অনুঘটকটি ট্রেস সালফারের কারণে দূষিত হয়েছে।',
    telemetrySnapshotText: 
      'Atmospheric CO₂ climbing. Astronauts report headache and mild lethargy (early hypercapnia).',
    telemetrySnapshotTextBn:
      'বাতাসে CO₂ মাত্রা দ্রুত বাড়ছে। নভোচারীদের মাথাব্যথা ও ক্লান্তি দেখা দিচ্ছে (প্রাথমিক হাইপারক্যাপনিয়া)।',
    illustrationType: 'equipment_failure',
    choices: [
      {
        id: 'electrolyze_water_surge',
        label: 'Surge Water Electrolysis Cells for Pure O₂ Injection',
        labelBn: 'পানি তড়িৎ-বিশ্লেষণ বাড়িয়ে খাঁটি অক্সিজেন সরবরাহ করুন',
        description: 'Bypass the Sabatier loop and run high-amperage water electrolysis to flood the cabin with fresh oxygen while venting CO₂.',
        descriptionBn: 'সাবাতিয়ে লুপ বাইপাস করে উচ্চ ক্ষমতার ওয়াটার ইলেক্ট্রোলাইসিস চালিয়ে কেবিনে তাজা অক্সিজেন ভরুন এবং CO₂ বাইরে বের করে দিন।',
        immediateEffectsSummary: 'Rapidly normalizes oxygen and clears headaches. Consumes 18 Liters of water and 15 kWh of power.',
        immediateEffectsSummaryBn: 'দ্রুত অক্সিজেনের মাত্রা স্বাভাবিক করে এবং মাথাব্যথা দূর করে। ১৮ লিটার পানি ও ১৫ কিলোওয়াট-ঘণ্টা বিদ্যুৎ খরচ হয়।',
        tradeoffHint: 'Immediately restores crew alertness, but burns through stored water reserves.',
        tradeoffHintBn: 'তৎক্ষণাৎ ক্রুর সতর্কতা ও স্বাস্থ্য ফিরিয়ে আনে, কিন্তু মূল্যবান পানির মজুত দ্রুত নিঃশেষ করে।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            resources: {
              ...state.resources,
              water: Math.max(0, state.resources.water - 18),
              power: Math.max(0, state.resources.power - 15),
              oxygen: Math.min(state.resources.oxygenMax, state.resources.oxygen + 15)
            },
            crew: state.crew.map(c => ({ ...c, health: Math.min(100, c.health + 4), morale: Math.min(100, c.morale + 5), status: 'Healthy' }))
          };
        },
        educationalWhyId: 'oxygen_generation_electrolysis',
        causalChain: [
          {
            step: 1,
            title: 'Electrolysis Surge Activated',
            titleBn: 'ইলেক্ট্রোলাইসিস বৃদ্ধি সক্রিয়',
            description: 'Power buses routed maximum current into the water splitting cells.',
            descriptionBn: 'বিদ্যুৎ লাইনগুলো পানি বিভাজন কোষে সর্বোচ্চ কারেন্ট সরবরাহ করল।',
            icon: '⚡',
            highlightCategory: 'decision',
            metricImpact: 'Power -15 kWh',
            metricImpactBn: 'বিদ্যুৎ -১৫ kWh'
          },
          {
            step: 2,
            title: 'Pure Oxygen Injected',
            titleBn: 'বিশুদ্ধ অক্সিজেন সরবরাহ',
            description: 'Electrolysis produced +15 kg of pure breathable oxygen into air ducts.',
            descriptionBn: 'ইলেক্ট্রোলাইসিসের মাধ্যমে এয়ার ডাক্টে +১৫ কেজি খাঁটি শ্বাসযোগ্য অক্সিজেন তৈরি হলো।',
            icon: '🌬️',
            highlightCategory: 'system',
            metricImpact: 'Oxygen +15 kg, Water -18 L',
            metricImpactBn: 'অক্সিজেন +১৫ কেজি, পানি -১৮ লিটার'
          },
          {
            step: 3,
            title: 'Hypercapnia Symptoms Cleared',
            titleBn: 'অসুস্থতার লক্ষণ দূর',
            description: 'Astronaut headaches vanished and cognitive focus returned.',
            descriptionBn: 'মহাকাশচারীদের মাথাব্যথা দূর হলো এবং কাজে মনোযোগ ফিরে এল।',
            icon: '🧠',
            highlightCategory: 'crew',
            metricImpact: 'Crew Health & Morale restored',
            metricImpactBn: 'ক্রুর স্বাস্থ্য ও মনোবল পুনরুদ্ধার'
          },
          {
            step: 4,
            title: 'Water Inventory Depleted',
            titleBn: 'পানির মজুত উল্লেখযোগ্য হ্রাস',
            description: 'Significant water volume was permanently split to maintain the atmosphere.',
            descriptionBn: 'বায়ুমণ্ডল স্বাভাবিক রাখতে প্রচুর পরিমাণ পানি স্থায়ীভাবে ভেঙে ফেলা হলো।',
            icon: '💧',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'bake_out_catalyst',
        label: 'Perform High-Heat Thermal Catalyst Bake-Out',
        labelBn: 'উচ্চ তাপে থার্মাল বেক-আউট করে অনুঘটক পরিষ্কার করুন',
        description: 'Heat the Sabatier reactor bed to 550°C using reserve power to burn off impurities and regenerate the catalyst.',
        descriptionBn: 'রিজার্ভ বিদ্যুৎ ব্যবহার করে সাবাতিয়ে রিঅ্যাক্টর বেড ৫৫০° সেলসিয়াসে উত্তপ্ত করুন যাতে ময়লা পুড়ে অনুঘটক পুনরুজ্জীবিত হয়।',
        immediateEffectsSummary: 'Restores catalyst over 36 hours. Drains 25 kWh power; crew tolerates 24 hrs of mild headaches.',
        immediateEffectsSummaryBn: '৩৬ ঘণ্টার মধ্যে অনুঘটকটি ঠিক করে। ২৫ কিলোওয়াট-ঘণ্টা বিদ্যুৎ খরচ হয়; ক্রুদের ২৪ ঘণ্টা মৃদু মাথাব্যথা সহ্য করতে হয়।',
        tradeoffHint: 'Conserves precious water, but causes temporary crew stress and drains power.',
        tradeoffHintBn: 'মূল্যবান পানি রক্ষা করে, কিন্তু সাময়িক মানসিক চাপ তৈরি করে এবং ব্যাটারির চার্জ শেষ করে।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            resources: { ...state.resources, power: Math.max(0, state.resources.power - 25) },
            crew: state.crew.map(c => ({ ...c, morale: Math.max(0, c.morale - 6), stress: Math.min(100, c.stress + 10) }))
          };
        },
        educationalWhyId: 'oxygen_generation_electrolysis',
        causalChain: [
          {
            step: 1,
            title: 'Catalyst Bake-Out Initiated',
            titleBn: 'থার্মাল বেক-আউট শুরু',
            description: 'Heater coils brought the reactor core to 550°C to volatilize contaminants.',
            descriptionBn: 'হিটার কয়েল রিঅ্যাক্টর কোরকে ৫৫০° সেলসিয়াসে নিয়ে গেল দূষকগুলো বাষ্পীভূত করতে।',
            icon: '🔥',
            highlightCategory: 'decision',
            metricImpact: 'Power -25 kWh',
            metricImpactBn: 'বিদ্যুৎ -২৫ kWh'
          },
          {
            step: 2,
            title: 'Reclamation Efficiency Recovered',
            titleBn: 'পুনরুদ্ধার দক্ষতা ফিরে এল',
            description: 'After 36 hours, Sabatier CO₂ reduction returned to nominal 92%.',
            descriptionBn: '৩৬ ঘণ্টা পর সাবাতিয়ে কার্বন ডাই-অক্সাইড দূরীকরণ আবার স্বাভাবিক ৯২%-এ ফিরল।',
            icon: '🔄',
            highlightCategory: 'system'
          },
          {
            step: 3,
            title: 'Temporary Crew Discomfort',
            titleBn: 'ক্রুর সাময়িক অস্বস্তি',
            description: 'Crew endured elevated CO₂ symptoms during the bake-out duration.',
            descriptionBn: 'বেক-আউটের সময়ে ক্রুদের উচ্চ CO₂-জনিত মাথাব্যথা সহ্য করতে হলো।',
            icon: '🤕',
            highlightCategory: 'crew',
            metricImpact: 'Crew Morale -6%',
            metricImpactBn: 'ক্রুর মনোবল -৬%'
          },
          {
            step: 4,
            title: 'Critical Water Conserved',
            titleBn: 'গুরুত্বপূর্ণ পানি সংরক্ষিত',
            description: 'Zero potable water was consumed to solve the crisis.',
            descriptionBn: 'এই সংকট সমাধানে কোনো পানযোগ্য পানি নষ্ট করতে হয়নি।',
            icon: '💧',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  },

  // 6. ASTROBIOLOGY DISCOVERY
  {
    id: 'subsurface_water_ice',
    title: 'Subsurface Permafrost & Mineral Anomaly',
    titleBn: 'পৃষ্ঠের নিচে বরফ ও খনিজের উপস্থিতি শনাক্ত',
    category: 'discovery',
    urgency: 'low',
    dayTriggerMin: 14,
    dayTriggerMax: 20,
    storyContext: 
      'Ground-penetrating radar on the exploration rover detected a dielectric signature consistent with pure subsurface water ice and hydrated phyllosilicate minerals in a nearby crater rim.',
    storyContextBn:
      'অভিযাত্রী রোভারের গ্রাউন্ড-পেনিট্রেটিং রাডার পাশের একটি গর্তের (Crater) নিচে খাঁটি ভূগর্ভস্থ বরফ এবং হাইড্রেটেড ফিলোসি্লিকেট খনিজের অস্তিত্ব নিশ্চিত করেছে।',
    telemetrySnapshotText: 
      'High-confidence geological resource deposit located 3.8 km from outpost perimeter.',
    telemetrySnapshotTextBn:
      'ঘাঁটির সীমানা থেকে ৩.৮ কিমি দূরে উচ্চ সম্ভাবনাময় ভূতাত্ত্বিক সম্পদ আবিষ্কৃত।',
    illustrationType: 'discovery',
    choices: [
      {
        id: 'send_rover_sorties',
        label: 'Dispatch Full Rover Drilling & Sampling Expedition',
        labelBn: 'ড্রিলিং ও নমুনা সংগ্রহের জন্য রোভার দল পাঠান',
        description: 'Send the Scientist and Commander on a 12-hour sortie to drill core samples and extract mineral volatiles.',
        descriptionBn: 'কোর নমুনা সংগ্রহ এবং খনিজ উদ্বায়ী উপাদান উত্তোলনের জন্য বিজ্ঞানী ও কমান্ডারকে ১২ ঘণ্টার অভিযানে পাঠান।',
        immediateEffectsSummary: '+35 Science Points, +15 Liters extracted water, consumes 12 kWh rover power.',
        immediateEffectsSummaryBn: '+৩৫ বিজ্ঞান পয়েন্ট, +১৫ লিটার উত্তোলিত পানি, রোভারের ১২ কিলোওয়াট-ঘণ্টা বিদ্যুৎ খরচ।',
        tradeoffHint: 'Significant scientific breakthrough and water gain, with battery consumption.',
        tradeoffHintBn: 'উল্লেখযোগ্য বৈজ্ঞানিক আবিষ্কার এবং পানি অর্জন, তবে ব্যাটারির বিদ্যুৎ খরচ হয়।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            sciencePoints: state.sciencePoints + 35,
            resources: {
              ...state.resources,
              water: Math.min(state.resources.waterMax, state.resources.water + 15),
              power: Math.max(0, state.resources.power - 12)
            },
            crew: state.crew.map(c => c.role === 'scientist' ? { ...c, morale: 100 } : c)
          };
        },
        educationalWhyId: 'systems_engineering_redundancy',
        causalChain: [
          {
            step: 1,
            title: 'Rover Sortie Dispatched',
            titleBn: 'রোভার এক্সপিডিশন শুরু',
            description: 'The exploration rover traversed 3.8 km to the geological fault.',
            descriptionBn: 'অন্বেষণকারী রোভারটি ভূতাত্ত্বিক ফাটলের দিকে ৩.৮ কিমি পথ পাড়ি দিল।',
            icon: '🚜',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Subsurface Cores Extracted',
            titleBn: 'ভূগর্ভস্থ বরফের কোর উত্তোলন',
            description: 'Coring drill extracted pristine ice lenses beneath regolith shield.',
            descriptionBn: 'কোর ড্রিল রেগোলিথ শিল্ডের নিচ থেকে খাঁটি বরফের স্তর বের করে আনল।',
            icon: '🧊',
            highlightCategory: 'system',
            metricImpact: 'Water +15 L, Power -12 kWh',
            metricImpactBn: 'পানি +১৫ লিটার, বিদ্যুৎ -১২ kWh'
          },
          {
            step: 3,
            title: 'Scientific Triumph',
            titleBn: 'বৈজ্ঞানিক সাফল্য',
            description: 'Astrobiology findings beamed back to Earth for peer review.',
            descriptionBn: 'মহাকাশ-জীববিজ্ঞানের ফলাফল মূল্যায়নের জন্য পৃথিবীতে প্রেরণ করা হলো।',
            icon: '🌟',
            highlightCategory: 'crew',
            metricImpact: 'Scientist Morale 100%, +35 Science',
            metricImpactBn: 'বিজ্ঞানীর মনোবল ১০০%, +৩৫ বিজ্ঞান'
          },
          {
            step: 4,
            title: 'Expanded In-Situ Resource Potential',
            titleBn: 'ভবিষ্যতের সম্পদ সম্ভাবনার বিকাশ',
            description: 'Proved presence of accessible water ice for future human bases.',
            descriptionBn: 'ভবিষ্যতের মানব ঘাঁটির জন্য সুলভ পানির অস্তিত্ব প্রমাণিত হলো।',
            icon: '🚀',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'remote_sensor_only',
        label: 'Perform Low-Power Remote Spectrometer Scan Only',
        labelBn: 'দূরবর্তী স্পেকট্রোমিটার স্ক্যান সম্পন্ন করুন',
        description: 'Take orbital radar and optical zoom measurements without leaving the habitat perimeter.',
        descriptionBn: 'বাসস্থানের সীমানা অতিক্রম না করে কেবল কক্ষপথের রাডার ও অপটিক্যাল জুমের মাধ্যমে পরিমাপ নিন।',
        immediateEffectsSummary: '+10 Science Points, zero power or water expenditure.',
        immediateEffectsSummaryBn: '+১০ বিজ্ঞান পয়েন্ট, কোনো বিদ্যুৎ বা পানি খরচ নেই।',
        tradeoffHint: 'Zero risk, but misses the opportunity to collect real physical water ice.',
        tradeoffHintBn: 'কোনো ঝুঁকি নেই, তবে সরাসরি ভৌত বরফ সংগ্রহ করার দারুণ সুযোগ নষ্ট হয়।',
        applyChoice: (state: SimulationState) => {
          return {
            ...state,
            sciencePoints: state.sciencePoints + 10
          };
        },
        educationalWhyId: 'systems_engineering_redundancy',
        causalChain: [
          {
            step: 1,
            title: 'Remote Radar Ping',
            titleBn: 'রিমোট রাডার পিং',
            description: 'Stationary habitat antenna recorded passive dielectric reflection.',
            descriptionBn: 'ঘাঁটির অ্যান্টেনা দূর থেকে ডাই-ইলেক্ট্রিক প্রতিফলন সংকেত রেকর্ড করল।',
            icon: '📡',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Telemetry Logged',
            titleBn: 'টেলিমেট্রি ডেটা সংরক্ষিত',
            description: 'Basic coordinate data added to planetary mapping database.',
            descriptionBn: 'গ্রহের ম্যাপিং ডাটাবেসে সাধারণ ভৌগোলিক তথ্য যুক্ত করা হলো।',
            icon: '📊',
            highlightCategory: 'system',
            metricImpact: '+10 Science Points',
            metricImpactBn: '+১০ বিজ্ঞান পয়েন্ট'
          },
          {
            step: 3,
            title: 'Crew Safe Inside',
            titleBn: 'ক্রুরা ভেতরে সুরক্ষিত',
            description: 'Astronauts remained inside with zero EVA fatigue.',
            descriptionBn: 'কোনো বাইরের ক্লান্তি ছাড়াই নভোচারীরা ঘাঁটির ভেতরে নিরাপদ রইল।',
            icon: '👨‍🚀',
            highlightCategory: 'crew'
          },
          {
            step: 4,
            title: 'Untapped Ice Reservoir',
            titleBn: 'বরফের ভাণ্ডার অনাবিষ্কৃত রয়ে গেল',
            description: 'Valuable ice resources remained unharvested in the crater.',
            descriptionBn: 'গর্তের ভেতরে মূল্যবান বরফের খনিজ অপরিবর্তিত পড়ে রইল।',
            icon: '🧊',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  }
];
