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
  let gradeBn = 'স্পেস ক্যাডেট (B)';
  if (missionStatus === 'failed') {
    grade = 'MISSION COMPROMISED (D)';
    gradeBn = 'মিশন বিপর্যস্ত (D)';
  } else if (overallScore >= 90) {
    grade = 'PIONEER COMMANDER (A+)';
    gradeBn = 'পায়োনিয়ার কমান্ডার (A+)';
  } else if (overallScore >= 80) {
    grade = 'MISSION VETERAN (A)';
    gradeBn = 'মিশন অভিজ্ঞ (A)';
  } else if (overallScore >= 65) {
    grade = 'SPACE CADET (B)';
    gradeBn = 'স্পেস ক্যাডেট (B)';
  } else {
    grade = 'SURVIVOR (C)';
    gradeBn = 'বেঁচে ফেরা অভিযাত্রী (C)';
  }

  const feedback: string[] = [];
  const feedbackBn: string[] = [];
  if (scienceScore > 85) {
    feedback.push('Outstanding astrobiology & geology discovery throughput—NASA Science Mission Directorate commends your crew.');
    feedbackBn.push('অসাধারণ অ্যাস্ট্রোবায়োলজি ও ভূতাত্ত্বিক গবেষণা আবিষ্কার—নাসা সায়েন্স ডিরেক্টরেট তোমাদের দলকে অভিনন্দন জানিয়েছে।');
  } else if (scienceScore < 50) {
    feedback.push('Science output was conservative. Future missions should prioritize laboratory research sorties.');
    feedbackBn.push('বৈজ্ঞানিক ফলাফল তুলনামূলক কম ছিল। পরবর্তী মিশনে গবেষণাগার অনুসন্ধানকে আরও অগ্রাধিকার দেওয়া উচিত।');
  }

  if (resilienceScore > 80) {
    feedback.push('Excellent proactive maintenance and spare parts discipline prevented single-point cascades.');
    feedbackBn.push('চমৎকার দূরদর্শী রক্ষণাবেক্ষণ এবং খুচরা যন্ত্রাংশের সুশৃঙ্খল ব্যবহার যেকোনো একক বিপর্যয় আটকে দিয়েছে।');
  } else {
    feedback.push('Outpost spare parts inventory ran close to critical thresholds during environmental stress.');
    feedbackBn.push('পরিবেশগত ঝড়ের সময় ঘাঁটির খুচরা যন্ত্রাংশের মজুত বিপজ্জনক সীমার কাছাকাছি নেমে গিয়েছিল।');
  }

  if (survivalScore > 85) {
    feedback.push('Crew returned in prime physical and psychological health with minimal radiation dose accumulation.');
    feedbackBn.push('নভোচারীরা ন্যূনতম বিকিরণের সংস্পর্শে এসে চমৎকার শারীরিক ও মানসিক সুস্থতা নিয়ে মিশন সম্পন্ন করেছে।');
  }

  return {
    survivalScore,
    efficiencyScore,
    scienceScore,
    resilienceScore,
    learningScore,
    overallScore,
    grade,
    gradeBn,
    feedback,
    feedbackBn
  };
}
