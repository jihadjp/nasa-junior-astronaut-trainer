// Event Engine to evaluate triggers and queue decisions

import type { SimulationState, GameEvent } from '../types/game';
import { GAME_EVENTS } from './eventDatabase';

export function checkForTriggeredEvent(state: SimulationState): GameEvent | null {
  // If an event is already active, don't trigger another
  if (state.activeEvent) return null;

  const currentDay = state.missionDay;
  const completedIds = new Set(state.completedDecisions.map(d => d.eventId));

  // 1. Check for day-based events that haven't occurred yet
  for (const event of GAME_EVENTS) {
    if (completedIds.has(event.id)) continue;

    // Check day window
    const minDay = event.dayTriggerMin ?? 1;
    const maxDay = event.dayTriggerMax ?? state.totalDays;

    if (currentDay >= minDay && currentDay <= maxDay) {
      // Trigger chance or guaranteed on middle day
      const isMidDay = currentDay === Math.floor((minDay + maxDay) / 2);
      if (isMidDay || Math.random() < 0.45) {
        return event;
      }
    }
  }

  // 2. Resource-triggered emergency events (if not already handled)
  if (state.resources.power < 12 && !completedIds.has('power_shortage_emergency')) {
    return {
      id: 'power_shortage_emergency',
      title: 'Power Grid Brownout Threat',
      category: 'crisis',
      urgency: 'critical',
      storyContext: 'Sub-zero temperatures and high base electrical consumption have drained battery banks to critical reserves.',
      telemetrySnapshotText: 'Main battery bank bus voltage at 18% and falling. Low-power shedding imminent.',
      illustrationType: 'power_shortage',
      choices: [
        {
          id: 'shed_science_garage',
          label: 'Emergency Shed: Science Lab & Rover Garage',
          description: 'Instantly cut power to all research equipment and rover chargers to safeguard Life Support.',
          immediateEffectsSummary: 'Reduces power load by 16 kW immediately. Science points reduced by 5.',
          tradeoffHint: 'Saves life support, but science research is temporarily halted.',
          applyChoice: (s: SimulationState) => ({
            ...s,
            sciencePoints: Math.max(0, s.sciencePoints - 5),
            resources: { ...s.resources, power: s.resources.power + 8 }
          }),
          educationalWhyId: 'power_grids_dust',
          causalChain: [
            {
              step: 1,
              title: 'Load Shedding Executed',
              description: 'Circuit breakers opened to non-critical science modules.',
              icon: '🔌',
              highlightCategory: 'decision'
            },
            {
              step: 2,
              title: 'Battery Drain Stopped',
              description: 'Power load dropped by 16 kW, stabilizing battery reserves.',
              icon: '⚡',
              highlightCategory: 'system',
              metricImpact: 'Power load -16 kW'
            },
            {
              step: 3,
              title: 'Life Support Continuous',
              description: 'Oxygen scrubbers and habitat thermal systems stayed active.',
              icon: '🌬️',
              highlightCategory: 'crew'
            },
            {
              step: 4,
              title: 'Science Paused',
              description: 'Experiment cycles delayed while grid recovers.',
              icon: '🔬',
              highlightCategory: 'mission'
            }
          ]
        },
        {
          id: 'drain_backup_cells',
          label: 'Discharge Auxiliary Chemical Batteries',
          description: 'Deploy one-shot reserve fuel cells to sustain full outpost operations through the night.',
          immediateEffectsSummary: 'Adds +35 kWh power. Consumes 12 units of spare parts.',
          tradeoffHint: 'Zero module shutdowns, but consumes non-renewable spare parts.',
          applyChoice: (s: SimulationState) => ({
            ...s,
            resources: {
              ...s.resources,
              power: Math.min(s.resources.powerMax, s.resources.power + 35),
              spareParts: Math.max(0, s.resources.spareParts - 12)
            }
          }),
          educationalWhyId: 'power_grids_dust',
          causalChain: [
            {
              step: 1,
              title: 'Chemical Cells Fired',
              description: 'Auxiliary backup cells injected 35 kWh into main power bus.',
              icon: '🔋',
              highlightCategory: 'decision',
              metricImpact: 'Power +35 kWh'
            },
            {
              step: 2,
              title: 'Modules Kept Running',
              description: 'Science Lab and Greenhouse continued unhindered.',
              icon: '💡',
              highlightCategory: 'system'
            },
            {
              step: 3,
              title: 'Crew Confident',
              description: 'Habitat remained warm, well-lit, and comfortable.',
              icon: '😊',
              highlightCategory: 'crew'
            },
            {
              step: 4,
              title: 'Spare Inventory Depleted',
              description: '12 spare parts were burned up in the chemical cells.',
              icon: '📦',
              highlightCategory: 'mission',
              metricImpact: 'Spare Parts -12 units'
            }
          ]
        }
      ]
    };
  }

  return null;
}
