// Core Resource Calculation Engine

import type { 
  Resources, 
  ResourceDeltas, 
  EnvironmentalConditions, 
  BaseModule, 
  ModuleType, 
  Astronaut, 
  DestinationType 
} from '../types/game';

export interface ResourceTickResult {
  nextResources: Resources;
  deltas: ResourceDeltas;
  lowPowerModeActive: boolean;
  warnings: string[];
}

export function calculateDailyResourceChanges(
  resources: Resources,
  modules: Record<ModuleType, BaseModule>,
  crew: Astronaut[],
  environment: EnvironmentalConditions,
  destination: DestinationType
): ResourceTickResult {
  const warnings: string[] = [];
  const crewCount = crew.length;

  // Active bonuses from crew roles
  const hasEngineer = crew.some(c => c.role === 'engineer' && c.health > 40);
  const hasBiologist = crew.some(c => c.role === 'biologist' && c.health > 40);
  const hasCommander = crew.some(c => c.role === 'commander' && c.health > 40);

  // --- 1. POWER GENERATION & DEMAND ---
  // Solar generation depends on destination solar flux, dust factor, and module level
  const solarModule = modules.solar_array;
  let solarBaseGen = (solarModule.powerGeneration || 45) * (solarModule.level * 0.7);

  // Destination solar flux modifier (Mars is further from Sun: ~0.43 of Earth/Moon)
  const destFluxMod = destination === 'mars' ? 0.65 : 1.0;
  // Dust reduction (dustLevel: 0 - 100%)
  const dustFactor = Math.max(0.1, 1 - (environment.dustLevel / 100) * 0.85);
  // Sun intensity factor (orbital sun cycle)
  const sunFactor = environment.sunIntensity;

  const totalPowerGen = Math.round(solarBaseGen * destFluxMod * dustFactor * sunFactor * 10) / 10;

  // Module base loads
  let habitatLoad = modules.habitat.powerDraw;
  let lifeSupportLoad = modules.life_support.powerDraw;
  let waterRecyclerLoad = modules.water_recycler.powerDraw;
  let greenhouseLoad = modules.greenhouse.powerDraw;
  let labLoad = modules.science_lab.powerDraw;
  let roverLoad = modules.rover_garage.powerDraw;
  let fabricatorLoad = modules.spare_fabricator.powerDraw;
  let shieldLoad = modules.radiation_shield.powerDraw;

  // Calculate gross power load
  let totalPowerLoad = 
    habitatLoad + lifeSupportLoad + waterRecyclerLoad + 
    greenhouseLoad + labLoad + roverLoad + fabricatorLoad + shieldLoad;

  let netPower = totalPowerGen - totalPowerLoad;
  let lowPowerModeActive = false;

  // If power deficit and battery is critically low, enter automatic low-power shedding
  if (resources.power + netPower < 5 && netPower < 0) {
    lowPowerModeActive = true;
    warnings.push('⚡ CRITICAL POWER DEFICIT: Non-essential systems (Lab, Greenhouse heating) throttled to protect Life Support.');
    // Shed Lab and partial Greenhouse
    totalPowerLoad -= (labLoad + greenhouseLoad * 0.6);
    netPower = totalPowerGen - totalPowerLoad;
  }

  // Update battery storage
  let nextPower = Math.min(resources.powerMax, Math.max(0, resources.power + netPower));
  if (nextPower <= 0) {
    warnings.push('⚡ BATTERY EXHAUSTION: Complete habitat brownout!');
  }

  // --- 2. OXYGEN SYSTEM ---
  // Crew consumption: ~0.84 kg O2 per astronaut/day
  const oxygenConsumed = crewCount * 0.84;
  
  // O2 Production: Life Support electrolysis + Greenhouse plants
  const lifeSupportEff = lowPowerModeActive ? 0.7 : modules.life_support.efficiency;
  const lifeSupportGen = 0.9 * modules.life_support.level * lifeSupportEff * (crewCount >= 3 ? 1.2 : 1.0) * (hasCommander ? 1.05 : 1.0);
  
  // Greenhouse plant photosynthesis generates oxygen
  const plantBioGen = lowPowerModeActive ? 0.1 : (0.45 * modules.greenhouse.level * (hasBiologist ? 1.25 : 1.0));
  
  const totalOxygenGen = lifeSupportGen + plantBioGen;
  const netOxygen = Math.round((totalOxygenGen - oxygenConsumed) * 10) / 10;
  let nextOxygen = Math.min(resources.oxygenMax, Math.max(0, resources.oxygen + netOxygen));

  if (nextOxygen < 20) {
    warnings.push('⚠️ OXYGEN ALERT: Reserve tank pressure falling below safety margin!');
  }

  // --- 3. WATER SYSTEM ---
  // Crew consumption: ~2.5 L/day per astronaut
  const crewWaterUse = crewCount * 2.5;
  // Greenhouse irrigation: ~2.8 L/day
  const greenhouseWaterUse = lowPowerModeActive ? 1.0 : (modules.greenhouse.level * 2.5);
  const totalWaterDemand = crewWaterUse + greenhouseWaterUse;

  // Recycled water: recovery efficiency (90% to 98%)
  const recyclerEff = modules.water_recycler.efficiency * (hasEngineer ? 1.05 : 1.0);
  const waterRecovered = Math.round(totalWaterDemand * Math.min(0.98, recyclerEff * 0.92) * 10) / 10;
  
  const netWater = Math.round((waterRecovered - totalWaterDemand) * 10) / 10;
  let nextWater = Math.min(resources.waterMax, Math.max(0, resources.water + netWater));

  if (nextWater < 25) {
    warnings.push('💧 WATER DEFICIT: Greywater recovery unable to keep pace with demand.');
  }

  // --- 4. FOOD SYSTEM ---
  // Crew food consumption: ~1.4 kg / rations per day per astronaut
  const foodDemand = crewCount * 1.4;
  
  // Greenhouse crop yield
  let cropYield = 0;
  if (!lowPowerModeActive && nextWater > 10) {
    const bioBonus = hasBiologist ? 1.3 : 1.0;
    cropYield = Math.round((1.2 * modules.greenhouse.level * modules.greenhouse.efficiency * bioBonus) * 10) / 10;
  }
  
  const netFood = Math.round((cropYield - foodDemand) * 10) / 10;
  let nextFood = Math.min(resources.foodMax, Math.max(0, resources.food + netFood));

  if (nextFood < 15) {
    warnings.push('🌱 FOOD RESERVES CRITICAL: Emergency caloric rationing initiated.');
  }

  // --- 5. RADIATION SHIELDING & DOSE ---
  // Base daily cosmic ray dose: Moon has no atmosphere (~1.2 mSv/day base), Mars has thin atmosphere (~0.7 mSv/day)
  let baseRadiationRate = destination === 'moon' ? 1.2 : 0.75;
  if (environment.solarFlareActive) {
    baseRadiationRate *= 4.5; // Solar Particle Event spike
    warnings.push('☀️ SOLAR PARTICLE EVENT: Severe coronal mass ejection detected!');
  }

  // Shield attenuation factor based on shielding index (0-100)
  const shieldAttenuation = Math.min(0.95, (resources.shielding / 100) * (modules.radiation_shield.level * 0.45));
  const dailyAbsorbedDose = Math.round((baseRadiationRate * (1 - shieldAttenuation)) * 100) / 100;

  // Shielding durability slowly weathers from micrometeoroids or dust abrasion
  let nextShielding = resources.shielding;
  if (environment.micrometeoroidThreat || environment.dustStormActive) {
    nextShielding = Math.max(10, resources.shielding - 0.4);
  }

  // --- 6. SPARE PARTS & MAINTENANCE ---
  let sparePartsDelta = 0;
  // Natural wear and tear
  if (Math.random() < 0.2) {
    sparePartsDelta -= (hasEngineer ? 0.5 : 1.0);
  }
  // If spare fabricator is powered and operational, can print replacement components slowly
  if (!lowPowerModeActive && modules.spare_fabricator.operational && nextPower > 20) {
    sparePartsDelta += 0.8;
  }
  let nextSpareParts = Math.min(100, Math.max(0, resources.spareParts + sparePartsDelta));

  return {
    nextResources: {
      oxygen: Math.round(nextOxygen * 10) / 10,
      oxygenMax: resources.oxygenMax,
      water: Math.round(nextWater * 10) / 10,
      waterMax: resources.waterMax,
      power: Math.round(nextPower * 10) / 10,
      powerMax: resources.powerMax,
      food: Math.round(nextFood * 10) / 10,
      foodMax: resources.foodMax,
      shielding: Math.round(nextShielding * 10) / 10,
      spareParts: Math.round(nextSpareParts * 10) / 10
    },
    deltas: {
      oxygen: netOxygen,
      water: netWater,
      powerNet: Math.round(netPower * 10) / 10,
      powerGen: totalPowerGen,
      powerLoad: Math.round(totalPowerLoad * 10) / 10,
      food: netFood,
      radiationDose: dailyAbsorbedDose,
      sparePartsUsed: Math.abs(sparePartsDelta)
    },
    lowPowerModeActive,
    warnings
  };
}
