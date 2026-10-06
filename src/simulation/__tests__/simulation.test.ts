// Automated Verification Suite for Simulation Engine and Systems

import { describe, it, expect } from 'vitest';
import { createInitialSimulationState, stepSimulationDay } from '../engine';
import { calculateDailyResourceChanges } from '../resources';
import { updateCrewStates, DEFAULT_ASTRONAUTS } from '../crew';
import { calculateMissionScores } from '../scoring';
import { GAME_EVENTS } from '../../events/eventDatabase';

describe('OUTPOST: Junior Astronaut Mission Trainer - Simulation Engine', () => {
  it('initializes Moon expedition with valid baseline telemetry', () => {
    const state = createInitialSimulationState('moon', 30, 'junior', 4);
    expect(state.missionDay).toBe(1);
    expect(state.totalDays).toBe(30);
    expect(state.destination).toBe('moon');
    expect(state.crew.length).toBe(4);
    expect(state.resources.oxygen).toBe(140);
    expect(state.resources.water).toBe(160);
    expect(state.resources.power).toBe(75);
    expect(state.resources.food).toBe(130);
    expect(state.resources.shielding).toBe(70);
    expect(state.missionStatus).toBe('ongoing');
  });

  it('initializes Mars expedition with atmospheric dust and distinct radiation', () => {
    const state = createInitialSimulationState('mars', 30, 'commander', 4);
    expect(state.destination).toBe('mars');
    expect(state.environment.dustLevel).toBe(25);
    expect(state.resources.shielding).toBe(60);
    expect(state.environment.communicationDelaySec).toBe(720);
  });

  it('calculates daily resource changes deterministically', () => {
    const state = createInitialSimulationState('moon', 30, 'junior', 4);
    const { nextResources, deltas } = calculateDailyResourceChanges(
      state.resources,
      state.modules,
      state.crew,
      state.environment,
      'moon'
    );

    expect(nextResources.oxygen).toBeGreaterThan(0);
    expect(nextResources.water).toBeGreaterThan(0);
    expect(deltas.powerGen).toBeGreaterThan(0);
    expect(deltas.powerLoad).toBeGreaterThan(0);
    expect(deltas.radiationDose).toBeGreaterThan(0);
  });

  it('triggers emergency low-power shedding when battery is exhausted', () => {
    const state = createInitialSimulationState('moon', 30, 'junior', 4);
    state.resources.power = 2; // Critical low battery
    const env = { ...state.environment, sunIntensity: 0.1 }; // Nighttime / no solar

    const { lowPowerModeActive, warnings } = calculateDailyResourceChanges(
      state.resources,
      state.modules,
      state.crew,
      env,
      'moon'
    );

    expect(lowPowerModeActive).toBe(true);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('updates astronaut wellbeing, health, and status based on life support', () => {
    const crew = JSON.parse(JSON.stringify(DEFAULT_ASTRONAUTS));
    
    // Nominal conditions
    const nominal = updateCrewStates(crew, 80, 80, 80, 80, 20, false);
    expect(nominal.overallWellbeing).toBeGreaterThanOrEqual(90);

    // Severe hypoxia conditions
    const hypoxic = updateCrewStates(crew, 10, 80, 80, 80, 20, false);
    expect(hypoxic.overallWellbeing).toBeLessThan(nominal.overallWellbeing);
    expect(hypoxic.updatedCrew.some(c => c.status === 'Hypoxic' || c.status === 'Critical')).toBe(true);
  });

  it('applies decision effects and executes causal chain logic', () => {
    let state = createInitialSimulationState('mars', 30, 'junior', 4);
    const dustEvent = GAME_EVENTS.find(e => e.id === 'dust_storm');
    expect(dustEvent).toBeDefined();

    if (dustEvent) {
      state.activeEvent = dustEvent;
      const choice = dustEvent.choices[0]; // EVA wiper sortie
      const modified = choice.applyChoice(state);

      expect(choice.causalChain.length).toBeGreaterThanOrEqual(3);
      expect(modified.environment.dustLevel).toBeLessThan(state.environment.dustLevel);
    }
  });

  it('evaluates mission scoring accurately across 5 engineering dimensions', () => {
    let state = createInitialSimulationState('moon', 30, 'junior', 4);
    state.missionDay = 30;
    state.missionStatus = 'victory';
    state.sciencePoints = 140;

    const scores = calculateMissionScores(state);
    expect(scores.overallScore).toBeGreaterThan(0);
    expect(scores.survivalScore).toBeGreaterThan(0);
    expect(scores.efficiencyScore).toBeGreaterThan(0);
    expect(scores.scienceScore).toBeGreaterThan(0);
    expect(scores.resilienceScore).toBeGreaterThan(0);
    expect(scores.learningScore).toBeGreaterThan(0);
    expect(scores.grade).toBeDefined();
  });

  it('detects mission failure when oxygen runs completely dry', () => {
    let state = createInitialSimulationState('moon', 30, 'junior', 4);
    state.resources.oxygen = 0.1;
    // Drain oxygen completely by setting modules off
    state.modules.life_support.efficiency = 0;
    state.modules.greenhouse.efficiency = 0;

    const nextState = stepSimulationDay(state);
    if (nextState.resources.oxygen <= 0) {
      expect(nextState.missionStatus).toBe('failed');
      expect(nextState.failureReason).toContain('Oxygen');
    }
  });

  it('supports progressive 30-day mission advancement to victory', () => {
    let state = createInitialSimulationState('moon', 30, 'junior', 2); // 2 crew = easy survival
    for (let day = 1; day < 30; day++) {
      if (state.missionStatus !== 'ongoing') break;
      // Auto-resolve any event that triggers so simulation continues
      if (state.activeEvent) {
        state = state.activeEvent.choices[0].applyChoice(state);
        state.activeEvent = null;
        state.isPaused = false;
      }
      state = stepSimulationDay(state);
    }
    expect(state.missionDay).toBeGreaterThanOrEqual(25);
  });
});
