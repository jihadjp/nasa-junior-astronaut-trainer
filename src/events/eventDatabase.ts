// Comprehensive Event Database with Decisions, Causal Chains & STEM links

import type { GameEvent, SimulationState } from '../types/game';

export const GAME_EVENTS: GameEvent[] = [
  // 1. DUST STORM EVENT (Mars or Moon regolith electrostatic levitation)
  {
    id: 'dust_storm',
    title: 'Extraterrestrial Dust Storm Inbound',
    category: 'environmental',
    urgency: 'high',
    dayTriggerMin: 4,
    dayTriggerMax: 9,
    storyContext: 
      'Atmospheric monitoring indicates a high-velocity dust front bearing down on your outpost. Fine abrasive iron-oxide grains are obscuring the sun and accumulating on photovoltaic cells.',
    telemetrySnapshotText: 
      'Optical depth (Tau) rising to 4.2. Photovoltaic solar generation projected to plummet by 55-75%.',
    illustrationType: 'dust_storm',
    choices: [
      {
        id: 'clean_eva',
        label: 'Deploy Astronauts for Electrostatic Wiper Sortie',
        description: 'Send the Engineer outside in an EVA suit to deploy automated vibratory dust wipers across the primary array.',
        immediateEffectsSummary: 'Restores +30% solar efficiency immediately. Consumes 6 units of spare parts & tires crew.',
        tradeoffHint: 'Crew fatigue & suit exposure vs maintaining full electrical power for greenhouse.',
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
            description: 'The Engineer conducted a high-risk surface excursion in fine regolith dust.',
            icon: '👨‍🚀',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Solar Panels Cleaned',
            description: 'Vibratory electrostatic sweeps removed 80% of iron-oxide particulate coating.',
            icon: '⚡',
            highlightCategory: 'system',
            metricImpact: 'Power generation restored +30%'
          },
          {
            step: 3,
            title: 'Crew Fatigue & Suit Wear',
            description: 'Dust abrasion wore down EVA seals, and the engineer experienced acute fatigue.',
            icon: '⚠️',
            highlightCategory: 'crew',
            metricImpact: 'Spare Parts -6, Engineer Stress +15%'
          },
          {
            step: 4,
            title: 'Mission Grid Protected',
            description: 'Greenhouse lighting and water recycling maintained uninterrupted 24-hour cycles.',
            icon: '🛡️',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'shed_load',
        label: 'Hunker Down & Shed Science Lab Power',
        description: 'Retract sensitive sensors, power down the Astrobiology Laboratory, and run on battery conservation mode until the storm clears.',
        immediateEffectsSummary: 'Saves 10 kW continuous power. Halts science progress and lowers crew morale.',
        tradeoffHint: 'Zero risk to crew, but zero scientific output during the multi-day storm.',
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
            description: 'Scientific mass spectrometers and rover docks entered unpowered hibernation.',
            icon: '🔌',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Grid Demand Reduced by 10 kW',
            description: 'Battery reserves stabilized without needing dangerous surface maintenance.',
            icon: '🔋',
            highlightCategory: 'system',
            metricImpact: 'Load reduced by 10 kW'
          },
          {
            step: 3,
            title: 'Crew Idled in Quarters',
            description: 'Confined to the habitat core, crew morale declined from inactivity.',
            icon: '😔',
            highlightCategory: 'crew',
            metricImpact: 'Morale -4% across all crew'
          },
          {
            step: 4,
            title: 'Science Target Delayed',
            description: 'Zero research milestones were recorded for 3 simulated days.',
            icon: '🔬',
            highlightCategory: 'mission',
            metricImpact: 'Science score paused'
          }
        ]
      }
    ]
  },

  // 2. GREENHOUSE IRRIGATION BLIGHT
  {
    id: 'greenhouse_stress',
    title: 'Hydroponic Nutrient Delivery Malfunction',
    category: 'mechanical',
    urgency: 'medium',
    dayTriggerMin: 8,
    dayTriggerMax: 14,
    storyContext: 
      'Automated sensors in the Bio-Greenhouse detect root dryout and chlorosis (leaf yellowing) across 40% of the red romaine and dwarf wheat racks. A main irrigation dosing valve is sticking.',
    telemetrySnapshotText: 
      'Hydroponic pump flow rate down 62%. Plant transpiration recovery offline.',
    illustrationType: 'greenhouse_stress',
    choices: [
      {
        id: 'replace_valve_spares',
        label: 'Fabricate & Replace Solid-State Dosing Valve',
        description: 'Spend 8 spare parts to install a new ceramic solenoid valve and flush root channels with fresh nutrient fluid.',
        immediateEffectsSummary: 'Restores 100% crop health. Consumes 8 spare parts & 12 Liters of reserve water.',
        tradeoffHint: 'Spares inventory takes a hit to guarantee uninterrupted harvest calories.',
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
            description: 'The crew calibrated and installed a 3D-printed ceramic solenoid valve.',
            icon: '🔧',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Nutrient Flow Restored',
            description: 'Optimal nutrient-film circulation returned to 100% of hydroponic growth trays.',
            icon: '🌱',
            highlightCategory: 'system',
            metricImpact: 'Greenhouse efficiency restored to 1.0'
          },
          {
            step: 3,
            title: 'Biologist Morale Boost',
            description: 'The Biologist successfully saved the harvest of fresh Vitamin C microgreens.',
            icon: '🥬',
            highlightCategory: 'crew',
            metricImpact: 'Biologist Morale +8%'
          },
          {
            step: 4,
            title: 'Reserves Reduced',
            description: 'Outpost spare parts and water reserves dropped to pay for the repair.',
            icon: '💧',
            highlightCategory: 'mission',
            metricImpact: 'Spares -8, Water -12 L'
          }
        ]
      },
      {
        id: 'cull_and_ration',
        label: 'Cull Damaged Trays & Shift to Freeze-Dried Rations',
        description: 'Prune the dying crops to conserve remaining water and switch astronauts to pre-packaged emergency ration packs.',
        immediateEffectsSummary: 'Saves water and spare parts. Food production drops by 35% for 7 days.',
        tradeoffHint: 'Protects critical spare parts inventory at the expense of crew diet variety and future food growth.',
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
            description: '40% of the active crop volume was composted to prevent bacterial rot.',
            icon: '✂️',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Food Yield Decreased',
            description: 'Daily fresh calorie generation fell by 35%, increasing reliance on pantry rations.',
            icon: '🍞',
            highlightCategory: 'system',
            metricImpact: 'Food yield down 35%'
          },
          {
            step: 3,
            title: 'Menu Fatigue',
            description: 'Astronauts complained about monotonous vacuum-sealed ration paste.',
            icon: '😒',
            highlightCategory: 'crew',
            metricImpact: 'Crew Morale -6%'
          },
          {
            step: 4,
            title: 'Critical Spares Conserved',
            description: 'Remaining spare parts were preserved for life-support contingencies.',
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
    category: 'crisis',
    urgency: 'critical',
    dayTriggerMin: 12,
    dayTriggerMax: 18,
    storyContext: 
      'Deep Space Climate Observatory sensors detect an X-class solar flare directed toward your planet. A massive front of relativistic solar protons will impact the base in 45 minutes!',
    telemetrySnapshotText: 
      'Radiation flux climbing from 1.1 mSv/day to over 28 mSv/day. Dangerous biological ionising radiation.',
    illustrationType: 'radiation_spike',
    choices: [
      {
        id: 'storm_shelter',
        label: 'Retreat to Regolith Radiation Storm Shelter',
        description: 'Order all astronauts into the reinforced regolith vault surrounded by water bladder jackets. All outdoor operations and lab work cease for 48 hours.',
        immediateEffectsSummary: 'Blocks 92% of radiation dose. Halts all science sorties and reduces daily power to essential life support.',
        tradeoffHint: 'Maximum crew biological protection vs zero mission activity for 2 days.',
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
            description: 'Astronauts sealed themselves inside the regolith-banked habitat core.',
            icon: '🛡️',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Water Bladders Absorbed Protons',
            description: 'Hydrogen-rich water walls scattered incoming protons without secondary Bremsstrahlung.',
            icon: '🌊',
            highlightCategory: 'system',
            metricImpact: '92% radiation dose attenuated'
          },
          {
            step: 3,
            title: 'Astronaut DNA Protected',
            description: 'Crew health remained safe with only 1.2 mSv total absorbed dose.',
            icon: '❤️',
            highlightCategory: 'crew',
            metricImpact: 'Zero radiation sickness'
          },
          {
            step: 4,
            title: 'Sorties Canceled',
            description: 'Rover operations were aborted until solar proton levels subsided.',
            icon: '📡',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'continue_with_shielding_boost',
        label: 'Route Emergency Battery Power to Active Magnetic Deflector',
        description: 'Keep crew in standard quarters and run experimental electromagnetic coil shielding at maximum power to deflect charged particles.',
        immediateEffectsSummary: 'Maintains partial science output (+15 pts), but drains 40 kWh of battery storage and absorbs moderate radiation.',
        tradeoffHint: 'High power drain & moderate health risk for valuable coronal physics measurements.',
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
            description: 'Battery banks routed 40 kWh to the high-voltage deflector coils.',
            icon: '⚡',
            highlightCategory: 'decision',
            metricImpact: 'Power storage -40 kWh'
          },
          {
            step: 2,
            title: 'Valuable Heliophysics Captured',
            description: 'The science lab recorded rare multi-energy proton spectra during the CME.',
            icon: '🔬',
            highlightCategory: 'system',
            metricImpact: 'Science points +18'
          },
          {
            step: 3,
            title: 'Elevated Dose Exposure',
            description: 'High-energy neutrons penetrated outer modules, causing astronaut fatigue.',
            icon: '⚠️',
            highlightCategory: 'crew',
            metricImpact: 'Crew Health -6%, Radiation Alert'
          },
          {
            step: 4,
            title: 'Battery Reserve Depleted',
            description: 'The base entered nighttime with low emergency electrical margin.',
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
    category: 'mechanical',
    urgency: 'high',
    dayTriggerMin: 17,
    dayTriggerMax: 23,
    storyContext: 
      'Mineral scaling and biofilm have clogged the rotary distillation centrifuge in the Water Recovery Assembly. Reclaimed greywater purity has dropped below potable NASA standards.',
    telemetrySnapshotText: 
      'Water loop closure down from 95% to 48%. Net loss of 11 Liters/day.',
    illustrationType: 'water_leak',
    choices: [
      {
        id: 'replace_centrifuge_core',
        label: 'Replace Centrifuge Rotor with Spare Assembly',
        description: 'Install a pre-tested replacement rotor module and recalibrate ultraviolet oxidation sterilizers.',
        immediateEffectsSummary: 'Restores water recycling back to 96%. Consumes 10 spare parts.',
        tradeoffHint: 'Reliable and permanent solution, but heavily depletes remaining spare parts.',
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
            description: 'The Engineer completed a 4-hour precision overhaul of the vapor compression unit.',
            icon: '🔧',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Water Loop Closure at 96%',
            description: 'Effluent conductivity dropped back to pristine 0.2 µS/cm drinking quality.',
            icon: '💧',
            highlightCategory: 'system',
            metricImpact: 'Water recovery efficiency restored'
          },
          {
            step: 3,
            title: 'Astronaut Hydration Secured',
            description: 'Crew members resumed full hydration and greenhouse irrigation.',
            icon: '🥛',
            highlightCategory: 'crew'
          },
          {
            step: 4,
            title: 'Spare Inventory Depleted',
            description: 'Only minimal mechanical spares remain for unexpected future hull issues.',
            icon: '📦',
            highlightCategory: 'mission',
            metricImpact: 'Spare Parts -10 units'
          }
        ]
      },
      {
        id: 'chemical_acid_flush',
        label: 'Perform Chemical Descaling Acid Flush',
        description: 'Inject citric acid solution through the clogged filter pipes without replacing the core rotor.',
        immediateEffectsSummary: 'Restores recycling to 78% without using spare parts. Damages module durability (-25%) and temporarily consumes 8 L of clean water.',
        tradeoffHint: 'Saves spare parts, but leaves system fragile and degrades future recycling lifespan.',
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
            description: 'Hot citric acid was pumped through scaled distillation tubes.',
            icon: '🧪',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Partial Flow Cleared (78%)',
            description: 'Blockages dissolved, but corrosive wear degraded pipe gaskets.',
            icon: '⚠️',
            highlightCategory: 'system',
            metricImpact: 'Efficiency 78%, Durability -25%'
          },
          {
            step: 3,
            title: 'Water Loss from Flush Cycle',
            description: '8 Liters of potable water were consumed during chemical neutralisation.',
            icon: '💧',
            highlightCategory: 'crew',
            metricImpact: 'Water reserve -8 L'
          },
          {
            step: 4,
            title: 'Spares Preserved',
            description: 'All mechanical spare parts remain in reserve for primary hull integrity.',
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
    category: 'crisis',
    urgency: 'critical',
    dayTriggerMin: 22,
    dayTriggerMax: 27,
    storyContext: 
      'Carbon dioxide partial pressure in the habitat has reached 5.8 mmHg (normal limit: 3.0 mmHg). The ruthenium catalyst in the Sabatier oxygen reclamation loop is poisoned by trace sulfur.',
    telemetrySnapshotText: 
      'Atmospheric CO₂ climbing. Astronauts report headache and mild lethargy (early hypercapnia).',
    illustrationType: 'equipment_failure',
    choices: [
      {
        id: 'electrolyze_water_surge',
        label: 'Surge Water Electrolysis Cells for Pure O₂ Injection',
        description: 'Bypass the Sabatier loop and run high-amperage water electrolysis to flood the cabin with fresh oxygen while venting CO₂.',
        immediateEffectsSummary: 'Rapidly normalizes oxygen and clears headaches. Consumes 18 Liters of water and 15 kWh of power.',
        tradeoffHint: 'Immediately restores crew alertness, but burns through stored water reserves.',
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
            description: 'Power buses routed maximum current into the water splitting cells.',
            icon: '⚡',
            highlightCategory: 'decision',
            metricImpact: 'Power -15 kWh'
          },
          {
            step: 2,
            title: 'Pure Oxygen Injected',
            description: 'Electrolysis produced +15 kg of pure breathable oxygen into air ducts.',
            icon: '🌬️',
            highlightCategory: 'system',
            metricImpact: 'Oxygen +15 kg, Water -18 L'
          },
          {
            step: 3,
            title: 'Hypercapnia Symptoms Cleared',
            description: 'Astronaut headaches vanished and cognitive focus returned.',
            icon: '🧠',
            highlightCategory: 'crew',
            metricImpact: 'Crew Health & Morale restored'
          },
          {
            step: 4,
            title: 'Water Inventory Depleted',
            description: 'Significant water volume was permanently split to maintain the atmosphere.',
            icon: '💧',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'bake_out_catalyst',
        label: 'Perform High-Heat Thermal Catalyst Bake-Out',
        description: 'Heat the Sabatier reactor bed to 550°C using reserve power to burn off impurities and regenerate the catalyst.',
        immediateEffectsSummary: 'Restores catalyst over 36 hours. Drains 25 kWh power; crew tolerates 24 hrs of mild headaches.',
        tradeoffHint: 'Conserves precious water, but causes temporary crew stress and drains power.',
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
            description: 'Heater coils brought the reactor core to 550°C to volatilize contaminants.',
            icon: '🔥',
            highlightCategory: 'decision',
            metricImpact: 'Power -25 kWh'
          },
          {
            step: 2,
            title: 'Reclamation Efficiency Recovered',
            description: 'After 36 hours, Sabatier CO₂ reduction returned to nominal 92%.',
            icon: '🔄',
            highlightCategory: 'system'
          },
          {
            step: 3,
            title: 'Temporary Crew Discomfort',
            description: 'Crew endured elevated CO₂ symptoms during the bake-out duration.',
            icon: '🤕',
            highlightCategory: 'crew',
            metricImpact: 'Crew Morale -6%'
          },
          {
            step: 4,
            title: 'Critical Water Conserved',
            description: 'Zero potable water was consumed to solve the crisis.',
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
    category: 'discovery',
    urgency: 'low',
    dayTriggerMin: 14,
    dayTriggerMax: 20,
    storyContext: 
      'Ground-penetrating radar on the exploration rover detected a dielectric signature consistent with pure subsurface water ice and hydrated phyllosilicate minerals in a nearby crater rim.',
    telemetrySnapshotText: 
      'High-confidence geological resource deposit located 3.8 km from outpost perimeter.',
    illustrationType: 'discovery',
    choices: [
      {
        id: 'send_rover_sorties',
        label: 'Dispatch Full Rover Drilling & Sampling Expedition',
        description: 'Send the Scientist and Commander on a 12-hour sortie to drill core samples and extract mineral volatiles.',
        immediateEffectsSummary: '+35 Science Points, +15 Liters extracted water, consumes 12 kWh rover power.',
        tradeoffHint: 'Significant scientific breakthrough and water gain, with battery consumption.',
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
            description: 'The exploration rover traversed 3.8 km to the geological fault.',
            icon: '🚜',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Subsurface Cores Extracted',
            description: 'Coring drill extracted pristine ice lenses beneath regolith shield.',
            icon: '🧊',
            highlightCategory: 'system',
            metricImpact: 'Water +15 L, Power -12 kWh'
          },
          {
            step: 3,
            title: 'Scientific Triumph',
            description: 'Astrobiology findings beamed back to Earth for peer review.',
            icon: '🌟',
            highlightCategory: 'crew',
            metricImpact: 'Scientist Morale 100%, +35 Science'
          },
          {
            step: 4,
            title: 'Expanded In-Situ Resource Potential',
            description: 'Proved presence of accessible water ice for future human bases.',
            icon: '🚀',
            highlightCategory: 'mission'
          }
        ]
      },
      {
        id: 'remote_sensor_only',
        label: 'Perform Low-Power Remote Spectrometer Scan Only',
        description: 'Take orbital radar and optical zoom measurements without leaving the habitat perimeter.',
        immediateEffectsSummary: '+10 Science Points, zero power or water expenditure.',
        tradeoffHint: 'Zero risk, but misses the opportunity to collect real physical water ice.',
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
            description: 'Stationary habitat antenna recorded passive dielectric reflection.',
            icon: '📡',
            highlightCategory: 'decision'
          },
          {
            step: 2,
            title: 'Telemetry Logged',
            description: 'Basic coordinate data added to planetary mapping database.',
            icon: '📊',
            highlightCategory: 'system',
            metricImpact: '+10 Science Points'
          },
          {
            step: 3,
            title: 'Crew Safe Inside',
            description: 'Astronauts remained inside with zero EVA fatigue.',
            icon: '👨‍🚀',
            highlightCategory: 'crew'
          },
          {
            step: 4,
            title: 'Untapped Ice Reservoir',
            description: 'Valuable ice resources remained unharvested in the crater.',
            icon: '🧊',
            highlightCategory: 'mission'
          }
        ]
      }
    ]
  }
];
