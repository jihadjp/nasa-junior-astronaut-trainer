// Crew setup, specialties and wellbeing calculation

import type { Astronaut, AstronautRole } from '../types/game';

export const DEFAULT_ASTRONAUTS: Astronaut[] = [
  {
    id: 'astro_1',
    name: 'Maya Lin',
    role: 'commander',
    callsign: 'Polaris-1',
    specialty: 'Expedition Command',
    specialtyDescription: '+15% Base Morale resilience & lower crew panic during crises',
    avatarSeed: 'maya',
    health: 98,
    morale: 95,
    stress: 10,
    status: 'Healthy',
    currentTask: 'Supervising mission control & life support telemetry'
  },
  {
    id: 'astro_2',
    name: 'Tariq Al-Mansoor',
    role: 'engineer',
    callsign: 'Vector-2',
    specialty: 'ECLSS & Power Systems',
    specialtyDescription: '+25% Repair efficiency, -30% spare parts consumed during fixes',
    avatarSeed: 'tariq',
    health: 96,
    morale: 92,
    stress: 15,
    status: 'Healthy',
    currentTask: 'Calibrating solar array tracking and battery bus voltages'
  },
  {
    id: 'astro_3',
    name: 'Elena Rostova',
    role: 'biologist',
    callsign: 'Sprout-3',
    specialty: 'Hydroponics & Bioregeneration',
    specialtyDescription: '+20% Crop yield & +15% water recovery efficiency',
    avatarSeed: 'elena',
    health: 97,
    morale: 90,
    stress: 12,
    status: 'Healthy',
    currentTask: 'Inspecting nutrient solutions in greenhouse hydroponic racks'
  },
  {
    id: 'astro_4',
    name: 'Marcus Chen',
    role: 'scientist',
    callsign: 'Nova-4',
    specialty: 'Planetary Geology & Physics',
    specialtyDescription: '+35% Science points generated from lab experiments and sorties',
    avatarSeed: 'marcus',
    health: 95,
    morale: 94,
    stress: 14,
    status: 'Healthy',
    currentTask: 'Analyzing mass spectrometry coring data from surface rover'
  }
];

export function getRoleColor(role: AstronautRole): string {
  switch (role) {
    case 'commander': return '#52D6FF'; // Cyan
    case 'engineer': return '#F4C95D';  // Amber/Gold
    case 'biologist': return '#35D07F'; // Green
    case 'scientist': return '#C084FC'; // Purple
  }
}

export function updateCrewStates(
  crew: Astronaut[],
  oxygenLevelPct: number,
  waterLevelPct: number,
  foodLevelPct: number,
  powerLevelPct: number,
  radiationRiskPct: number,
  isSolarFlare: boolean
): { updatedCrew: Astronaut[]; overallWellbeing: number } {
  let totalHealth = 0;
  let totalMorale = 0;

  const updatedCrew = crew.map(astro => {
    let healthChange = 0;
    let moraleChange = 0;
    let stressChange = 0;

    // Oxygen impact (Critical)
    if (oxygenLevelPct < 15) {
      healthChange -= 6;
      moraleChange -= 5;
      stressChange += 10;
    } else if (oxygenLevelPct < 30) {
      healthChange -= 2;
      moraleChange -= 2;
      stressChange += 4;
    } else {
      healthChange += 0.5; // Natural recovery if O2 is good
    }

    // Water impact
    if (waterLevelPct < 15) {
      healthChange -= 3.5;
      moraleChange -= 4;
      stressChange += 6;
    } else if (waterLevelPct < 30) {
      healthChange -= 1.5;
      moraleChange -= 2;
    }

    // Food impact
    if (foodLevelPct < 15) {
      healthChange -= 2.5;
      moraleChange -= 3;
    }

    // Power impact (cold, dark, alarms)
    if (powerLevelPct < 15) {
      moraleChange -= 3;
      stressChange += 5;
    }

    // Radiation impact
    if (isSolarFlare || radiationRiskPct > 60) {
      healthChange -= 3;
      stressChange += 6;
    }

    // Role bonus modifiers
    if (astro.role === 'commander') {
      moraleChange += 0.8;
      stressChange -= 1;
    }

    const newHealth = Math.min(100, Math.max(0, astro.health + healthChange));
    const newMorale = Math.min(100, Math.max(0, astro.morale + moraleChange));
    const newStress = Math.min(100, Math.max(0, astro.stress + stressChange - 0.5));

    // Determine status
    let status: Astronaut['status'] = 'Healthy';
    if (newHealth < 30) {
      status = 'Critical';
    } else if (oxygenLevelPct < 25) {
      status = 'Hypoxic';
    } else if (isSolarFlare || radiationRiskPct > 70) {
      status = 'Radiation Alert';
    } else if (newMorale < 40 || newStress > 70) {
      status = 'Tired';
    }

    totalHealth += newHealth;
    totalMorale += newMorale;

    return {
      ...astro,
      health: Math.round(newHealth * 10) / 10,
      morale: Math.round(newMorale * 10) / 10,
      stress: Math.round(newStress * 10) / 10,
      status
    };
  });

  const avgHealth = totalHealth / crew.length;
  const avgMorale = totalMorale / crew.length;
  // Crew wellbeing is weighted combination: 65% health + 35% morale
  const overallWellbeing = Math.round((avgHealth * 0.65 + avgMorale * 0.35) * 10) / 10;

  return { updatedCrew, overallWellbeing };
}
