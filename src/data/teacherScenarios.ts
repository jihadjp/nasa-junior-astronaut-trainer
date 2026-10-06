// Teacher Mode Presets, Curriculum Standards & Debrief Prompts

import type { DestinationType, MissionDuration } from '../types/game';

export interface ClassroomDebriefQuestion {
  id: string;
  question: string;
  targetConcept: string;
  teacherGuideNotes: string;
}

export interface TeacherPreset {
  id: string;
  title: string;
  destination: DestinationType;
  duration: MissionDuration;
  difficulty: 'Easy' | 'Standard' | 'Challenging';
  focusTopic: string;
  description: string;
  scenarioCode: string;
}

export const STEM_LEARNING_OBJECTIVES = [
  {
    id: 1,
    title: 'Resource Scarcity & Payload Budget',
    description: 'Understand that mass, volume, and energy launched from Earth are strictly finite. Every kilogram of shielding displaces a kilogram of food or scientific instrumentation.'
  },
  {
    id: 2,
    title: 'Closed-Loop Systems Interdependence',
    description: 'Recognize how life support subsystems link together: water recovery feeds both crew hydration and oxygen electrolysis; power failure cascades into greenhouse starvation.'
  },
  {
    id: 3,
    title: 'Engineering Trade-Offs & Opportunity Costs',
    description: 'Learn that engineering has no perfect solutions, only trade-offs. Prioritizing scientific discovery might increase astronaut fatigue and deplete reserve battery banks.'
  },
  {
    id: 4,
    title: 'Extraterrestrial Radiation Hazards',
    description: 'Analyze the mechanics of solar particle events and cosmic rays, evaluating why passive shielding (regolith/water) is essential for crew cellular health.'
  },
  {
    id: 5,
    title: 'Bioregenerative & Chemical ECLSS',
    description: 'Compare physical-chemical life support (electrolysis, CO2 scrubbers) with biological systems (hydroponic plants, algae) in terms of power draw and buffer capacity.'
  },
  {
    id: 6,
    title: 'Mission Resilience & Active Redundancy',
    description: 'Explore the concept of "fault tolerance" and why carrying spare parts and having multiple contingency procedures prevents catastrophic single-point failures.'
  },
  {
    id: 7,
    title: 'Decision-Making Under Environmental Uncertainty',
    description: 'Develop critical thinking when responding to sudden emergencies (dust storms, solar flares) where immediate safety must be weighed against long-term mission objectives.'
  }
];

export const TEACHER_PRESETS: TeacherPreset[] = [
  {
    id: 'lunar_beginner',
    title: 'Lunar Gateway Outpost — Intro to Life Support',
    destination: 'moon',
    duration: 30,
    difficulty: 'Easy',
    focusTopic: 'Basic Life Support & Solar Dependence',
    description: 'A 30-day lunar trial with moderate solar conditions. Ideal for 5th–8th grade students learning closed-loop ECLSS for the first time.',
    scenarioCode: 'NASA-LUNAR-30-BASIC'
  },
  {
    id: 'mars_storm_resilience',
    title: 'Mars Chryse Planitia — Dust Storm Crisis',
    destination: 'mars',
    duration: 30,
    difficulty: 'Standard',
    focusTopic: 'Photovoltaic Degradation & Power Rationing',
    description: 'A Martian mission confronting severe atmospheric dust storms. Challenges students to allocate scarce power between greenhouse and life support.',
    scenarioCode: 'NASA-MARS-30-STORM'
  },
  {
    id: 'deep_space_veteran',
    title: 'Artemis Base Camp — 60-Day Deep Space Trial',
    destination: 'moon',
    duration: 60,
    difficulty: 'Challenging',
    focusTopic: 'Cascading Failures & Long-Term Radiation Dose',
    description: 'An extended mission testing crew endurance across multiple lunar day/night transitions and unpredictable solar particle events.',
    scenarioCode: 'NASA-LUNAR-60-HARD'
  }
];

export const CLASSROOM_DEBRIEF_QUESTIONS: ClassroomDebriefQuestion[] = [
  {
    id: 'q1',
    question: 'When power production dropped, which system did your team shut down first, and what was the consequence 3 days later?',
    targetConcept: 'Cascading Subsystem Interdependence',
    teacherGuideNotes: 'Students often shut down the greenhouse first to save power, but fail to account for the delayed food depletion curve or oxygen drop.'
  },
  {
    id: 'q2',
    question: 'Why did we not just build 100% radiation shielding and infinite spare parts during the Base Builder phase?',
    targetConcept: 'Opportunity Cost and Payload Constraints',
    teacherGuideNotes: 'Guide students to reflect on the launch budget constraint: spending all credits on shielding left inadequate hydroponics and water recycling.'
  },
  {
    id: 'q3',
    question: 'How did the Engineer and Biologist roles help keep your outpost alive differently than having four Scientists?',
    targetConcept: 'Team Specialization and Resilience',
    teacherGuideNotes: 'Highlight the role bonuses: the Engineer consumes fewer spare parts per repair, while the Biologist increases hydroponic crop yield per liter of water.'
  },
  {
    id: 'q4',
    question: 'Compare survival vs overall score: Why did a mission that purely conserved resources not achieve the highest mission grade?',
    targetConcept: 'Mission Objectives vs Mere Survival',
    teacherGuideNotes: 'NASA missions travel to other worlds to conduct science and explore, not merely to sit in a bunker. Science and learning are key components of mission success.'
  }
];
