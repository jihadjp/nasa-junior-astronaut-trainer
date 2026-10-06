// Master Simulation Engine for OUTPOST

import type { 
  SimulationState, 
  DestinationType, 
  MissionDuration, 
  GameMode, 
  MissionTimelineEntry 
} from '../types/game';
import { INITIAL_MODULES } from './modules';
import { DEFAULT_ASTRONAUTS, updateCrewStates } from './crew';
import { calculateDailyResourceChanges } from './resources';
import { checkForTriggeredEvent } from '../events/eventEngine';
import { calculateMissionScores } from './scoring';

export function createInitialSimulationState(
  destination: DestinationType = 'moon',
  duration: MissionDuration = 30,
  mode: GameMode = 'junior',
  crewCount: number = 4
): SimulationState {
  const selectedCrew = DEFAULT_ASTRONAUTS.slice(0, crewCount);

  // Initial resources based on destination and budget
  const initialResources = {
    oxygen: 140, // kg
    oxygenMax: 180,
    water: 160,  // Liters
    waterMax: 200,
    power: 75,   // kWh stored in batteries
    powerMax: 100,
    food: 130,   // rations / kg
    foodMax: 160,
    shielding: destination === 'moon' ? 70 : 60, // Regolith/shield index
    spareParts: 45 // units
  };

  const initialDeltas = {
    oxygen: 0.5,
    water: -0.8,
    powerNet: 4.2,
    powerGen: 45,
    powerLoad: 40.8,
    food: -0.2,
    radiationDose: destination === 'moon' ? 0.35 : 0.28,
    sparePartsUsed: 0
  };

  const initialEnv = {
    dustLevel: destination === 'mars' ? 25 : 10,
    solarFlareActive: false,
    dustStormActive: false,
    micrometeoroidThreat: false,
    externalTempC: destination === 'moon' ? -20 : -45,
    communicationDelaySec: destination === 'mars' ? 720 : 1.3,
    sunIntensity: 0.95
  };

  const state: SimulationState = {
    missionDay: 1,
    totalDays: duration,
    destination,
    mode,
    isPaused: false,
    speed: 1,
    resources: initialResources,
    deltas: initialDeltas,
    environment: initialEnv,
    modules: JSON.parse(JSON.stringify(INITIAL_MODULES)),
    crew: JSON.parse(JSON.stringify(selectedCrew)),
    crewWellbeing: 95,
    sciencePoints: 10,
    baseIntegrity: 100,
    cumulativeRadiation_mSv: 0.35,
    completedDecisions: [],
    timeline: [
      {
        day: 1,
        oxygen: initialResources.oxygen,
        water: initialResources.water,
        power: initialResources.power,
        food: initialResources.food,
        crewHealth: 96,
        sciencePoints: 10,
        highlight: 'Mission Initialized at Outpost Site'
      }
    ],
    unlockedAchievements: [],
    activeEvent: null,
    lastCausalChain: null,
    missionStatus: 'ongoing'
  };

  return state;
}

export function stepSimulationDay(state: SimulationState): SimulationState {
  if (state.missionStatus !== 'ongoing') return state;

  const nextDay = state.missionDay + 1;

  // 1. Environmental cycling (orbital sun intensity, dust fluctuation)
  // Day-night or orbital cycle variation
  const sunAngleFactor = 0.75 + 0.25 * Math.sin((nextDay / (state.destination === 'moon' ? 14 : 7)) * Math.PI);
  let nextDust = state.environment.dustLevel;
  if (state.environment.dustStormActive) {
    nextDust = Math.min(85, nextDust + 5);
  } else {
    nextDust = Math.max(state.destination === 'mars' ? 15 : 5, nextDust - 2);
  }

  // Deactivate one-off solar flares after 2 days
  const solarFlareActive = state.environment.solarFlareActive && (nextDay % 3 !== 0);

  const nextEnv = {
    ...state.environment,
    sunIntensity: Math.round(sunAngleFactor * 100) / 100,
    dustLevel: nextDust,
    solarFlareActive
  };

  // 2. Resource updates
  const { nextResources, deltas, lowPowerModeActive, warnings } = calculateDailyResourceChanges(
    state.resources,
    state.modules,
    state.crew,
    nextEnv,
    state.destination
  );

  // 3. Crew updates
  const o2Pct = (nextResources.oxygen / nextResources.oxygenMax) * 100;
  const h2oPct = (nextResources.water / nextResources.waterMax) * 100;
  const foodPct = (nextResources.food / nextResources.foodMax) * 100;
  const powerPct = (nextResources.power / nextResources.powerMax) * 100;
  const radRiskPct = (deltas.radiationDose / 2.0) * 100;

  const { updatedCrew, overallWellbeing } = updateCrewStates(
    state.crew,
    o2Pct,
    h2oPct,
    foodPct,
    powerPct,
    radRiskPct,
    solarFlareActive
  );

  // 4. Science output
  const hasScientist = updatedCrew.some(c => c.role === 'scientist' && c.health > 40);
  const labOperational = state.modules.science_lab.operational && !lowPowerModeActive;
  const dailyScience = labOperational ? Math.round((4.5 * state.modules.science_lab.level * (hasScientist ? 1.4 : 1.0)) * 10) / 10 : 0.5;
  const nextScience = Math.round((state.sciencePoints + dailyScience) * 10) / 10;

  // 5. Radiation accumulation
  const nextCumulativeRad = Math.round((state.cumulativeRadiation_mSv + deltas.radiationDose) * 100) / 100;

  // 6. Base integrity check
  let nextIntegrity = state.baseIntegrity;
  if (nextResources.power <= 0) nextIntegrity -= 1.5;
  if (state.environment.micrometeoroidThreat) nextIntegrity -= 3;
  nextIntegrity = Math.max(0, Math.min(100, Math.round(nextIntegrity * 10) / 10));

  // 7. Check Victory or Failure Conditions
  let missionStatus: SimulationState['missionStatus'] = 'ongoing';
  let failureReason: string | undefined = undefined;

  // Failure criteria: O2 fully depleted, or crew health <= 0, or total life support collapse
  const avgHealth = updatedCrew.reduce((acc, c) => acc + c.health, 0) / updatedCrew.length;
  if (nextResources.oxygen <= 0) {
    missionStatus = 'failed';
    failureReason = 'Atmospheric Hypoxia: Oxygen generation completely exhausted.';
  } else if (avgHealth <= 10) {
    missionStatus = 'failed';
    failureReason = 'Crew Incapacitation: Severe biological exhaustion and medical emergency.';
  } else if (nextResources.water <= 0 && nextDay > 5) {
    missionStatus = 'failed';
    failureReason = 'Dehydration Crisis: Zero potable water remaining in habitat storage.';
  } else if (nextDay >= state.totalDays) {
    missionStatus = 'victory';
  }

  // 8. Timeline logging
  const timelineEntry: MissionTimelineEntry = {
    day: nextDay,
    oxygen: nextResources.oxygen,
    water: nextResources.water,
    power: nextResources.power,
    food: nextResources.food,
    crewHealth: overallWellbeing,
    sciencePoints: nextScience,
    highlight: warnings.length > 0 ? warnings[0] : `Nominal telemetry. +${dailyScience} Science.`,
    isCrisis: warnings.length > 0
  };

  // 9. Check achievements
  const unlocked = [...state.unlockedAchievements];
  if (!unlocked.includes('first_steps') && nextDay >= 5) {
    unlocked.push('first_steps');
  }
  if (!unlocked.includes('power_master') && nextDay >= 10 && nextResources.power > 40) {
    unlocked.push('power_master');
  }
  if (!unlocked.includes('green_thumb') && nextDay >= 12 && state.modules.greenhouse.efficiency >= 0.9) {
    unlocked.push('green_thumb');
  }
  if (!unlocked.includes('shield_master') && nextCumulativeRad < 5.0 && nextDay >= 15) {
    unlocked.push('shield_master');
  }
  if (!unlocked.includes('mars_pioneer') && missionStatus === 'victory' && state.destination === 'mars') {
    unlocked.push('mars_pioneer');
  }

  const intermediateState: SimulationState = {
    ...state,
    missionDay: nextDay,
    resources: nextResources,
    deltas,
    environment: nextEnv,
    crew: updatedCrew,
    crewWellbeing: overallWellbeing,
    sciencePoints: nextScience,
    baseIntegrity: nextIntegrity,
    cumulativeRadiation_mSv: nextCumulativeRad,
    timeline: [...state.timeline, timelineEntry],
    unlockedAchievements: unlocked,
    missionStatus,
    failureReason
  };

  // If game ended, compute score
  if (missionStatus !== 'ongoing') {
    intermediateState.scores = calculateMissionScores(intermediateState);
  }

  // 10. Check for new triggered event if mission is ongoing
  if (missionStatus === 'ongoing' && !state.activeEvent) {
    const triggered = checkForTriggeredEvent(intermediateState);
    if (triggered) {
      intermediateState.activeEvent = triggered;
      intermediateState.isPaused = true; // Auto-pause for decision card
    }
  }

  return intermediateState;
}
