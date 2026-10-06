// Mission Scoring Engine

import type { SimulationState, MissionScores } from '../types/game';

export function calculateMissionScores(state: SimulationState): MissionScores {
  const { crew, resources, sciencePoints, completedDecisions, timeline, totalDays, missionStatus } = state;

  // 1. SURVIVAL SCORE (0-100)
  // Evaluates crew wellbeing, health, lack of deaths or critical hypoxia
  const avgCrewHealth = crew.reduce((acc, c) => acc + c.health, 0) / crew.length;
  const avgCrewMorale = crew.reduce((acc, c) => acc + c.morale, 0) / crew.length;
  const survivalWeight = missionStatus === 'failed' ? 0.3 : 1.0;
  const survivalScore = Math.min(100, Math.max(0, Math.round((avgCrewHealth * 0.7 + avgCrewMorale * 0.3) * survivalWeight)));

  // 2. EFFICIENCY SCORE (0-100)
  // Evaluates resource buffers remaining vs waste, power balance stability
  const o2Ratio = resources.oxygen / resources.oxygenMax;
  const h2oRatio = resources.water / resources.waterMax;
  const powerRatio = resources.power / resources.powerMax;
  const foodRatio = resources.food / resources.foodMax;
  
  // Healthy buffer between 30% and 85% is ideal efficiency (not hoarding or starving)
  const avgBuffer = (o2Ratio + h2oRatio + powerRatio + foodRatio) / 4;
  const efficiencyScore = Math.min(100, Math.max(0, Math.round(avgBuffer * 105)));

  // 3. SCIENCE SCORE (0-100)
  // Target benchmark: ~150 points for 30 days, ~300 for 60 days
  const scienceTarget = (totalDays / 30) * 160;
  const scienceScore = Math.min(100, Math.max(0, Math.round((sciencePoints / scienceTarget) * 100)));

  // 4. RESILIENCE SCORE (0-100)
  // How well the base weathered crises and maintained spares/shielding
  const crisisPoints = timeline.filter(t => t.isCrisis).length;
  const crisisBonus = Math.min(15, crisisPoints * 3);
  const sparesBuffer = Math.min(100, (resources.spareParts / 60) * 100);
  const shieldingBuffer = resources.shielding;
  const baseIntegrity = state.baseIntegrity;
  const resilienceScore = Math.min(100, Math.max(0, Math.round((sparesBuffer * 0.3 + shieldingBuffer * 0.3 + baseIntegrity * 0.25 + crisisBonus))));

  // 5. LEARNING SCORE (0-100)
  // Based on decision variety, tackling events rather than avoiding, and maintaining systems
  const decisionRatio = Math.min(1.0, completedDecisions.length / (totalDays / 3));
  const learningScore = Math.min(100, Math.max(0, Math.round(50 + decisionRatio * 50)));

  // Overall Weighted Score
  // 30% Survival + 20% Efficiency + 25% Science + 15% Resilience + 10% Learning
  const overallScore = Math.min(100, Math.max(0, Math.round(
    survivalScore * 0.30 +
    efficiencyScore * 0.20 +
    scienceScore * 0.25 +
    resilienceScore * 0.15 +
    learningScore * 0.10
  )));

  let grade: MissionScores['grade'] = 'SPACE CADET (B)';
  if (missionStatus === 'failed') {
    grade = 'MISSION COMPROMISED (D)';
  } else if (overallScore >= 90) {
    grade = 'PIONEER COMMANDER (A+)';
  } else if (overallScore >= 80) {
    grade = 'MISSION VETERAN (A)';
  } else if (overallScore >= 65) {
    grade = 'SPACE CADET (B)';
  } else {
    grade = 'SURVIVOR (C)';
  }

  const feedback: string[] = [];
  if (scienceScore > 85) {
    feedback.push('Outstanding astrobiology & geology discovery throughput—NASA Science Mission Directorate commends your crew.');
  } else if (scienceScore < 50) {
    feedback.push('Science output was conservative. Future missions should prioritize laboratory research sorties.');
  }

  if (resilienceScore > 80) {
    feedback.push('Excellent proactive maintenance and spare parts discipline prevented single-point cascades.');
  } else {
    feedback.push('Outpost spare parts inventory ran close to critical thresholds during environmental stress.');
  }

  if (survivalScore > 85) {
    feedback.push('Crew returned in prime physical and psychological health with minimal radiation dose accumulation.');
  }

  return {
    survivalScore,
    efficiencyScore,
    scienceScore,
    resilienceScore,
    learningScore,
    overallScore,
    grade,
    feedback
  };
}
