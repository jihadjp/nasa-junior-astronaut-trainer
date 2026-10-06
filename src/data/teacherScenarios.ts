// Teacher Mode Presets, Curriculum Standards & Debrief Prompts

import type { DestinationType, MissionDuration } from '../types/game';

export interface ClassroomDebriefQuestion {
  id: string;
  question: string;
  questionBn?: string;
  targetConcept: string;
  targetConceptBn?: string;
  teacherGuideNotes: string;
  teacherGuideNotesBn?: string;
}

export interface TeacherPreset {
  id: string;
  title: string;
  titleBn?: string;
  destination: DestinationType;
  duration: MissionDuration;
  difficulty: 'Easy' | 'Standard' | 'Challenging';
  difficultyBn?: string;
  focusTopic: string;
  focusTopicBn?: string;
  description: string;
  descriptionBn?: string;
  scenarioCode: string;
}

export interface StemLearningObjective {
  id: number;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
}

export const STEM_LEARNING_OBJECTIVES: StemLearningObjective[] = [
  {
    id: 1,
    title: 'Resource Scarcity & Payload Budget',
    titleBn: 'সম্পদের সীমাবদ্ধতা ও পেলোড বাজেট',
    description: 'Understand that mass, volume, and energy launched from Earth are strictly finite. Every kilogram of shielding displaces a kilogram of food or scientific instrumentation.',
    descriptionBn: 'পৃথিবী থেকে উৎক্ষেপিত ভর, আয়তন ও শক্তি অত্যন্ত সীমিত। বিকিরণ শিল্ডিংয়ের জন্য বরাদ্দ প্রতিটি কিলোগ্রাম খাদ্য বা বৈজ্ঞানিক যন্ত্রপাতির পরিমাণ কমিয়ে দেয়।'
  },
  {
    id: 2,
    title: 'Closed-Loop Systems Interdependence',
    titleBn: 'বদ্ধ লুপ ব্যবস্থার পারস্পরিক নির্ভরতা',
    description: 'Recognize how life support subsystems link together: water recovery feeds both crew hydration and oxygen electrolysis; power failure cascades into greenhouse starvation.',
    descriptionBn: 'জীবন ধারণের প্রতিটি উপ-ব্যবস্থা পরস্পর সংযুক্ত: পানি পুনরুদ্ধার ব্যবস্থা নভোচারীদের পানীয় এবং অক্সিজেন তৈরির ইলেক্ট্রোলাইসিস উভয়কেই সচল রাখে; বিদ্যুৎ বিভ্রাট গ্রিনহাউসের উৎপাদন বন্ধ করে দেয়।'
  },
  {
    id: 3,
    title: 'Engineering Trade-Offs & Opportunity Costs',
    titleBn: 'প্রকৌশলগত ভারসাম্য ও সুযোগ-ব্যয়',
    description: 'Learn that engineering has no perfect solutions, only trade-offs. Prioritizing scientific discovery might increase astronaut fatigue and deplete reserve battery banks.',
    descriptionBn: 'প্রকৌশলে নিখুঁত কোনো সমাধান নেই, কেবল ভারসাম্য রক্ষা করা যায়। বৈজ্ঞানিক গবেষণাকে অতিরিক্ত অগ্রাধিকার দিলে নভোচারীদের ক্লান্তি বাড়তে পারে এবং ব্যাটারির শক্তি নিঃশেষ হতে পারে।'
  },
  {
    id: 4,
    title: 'Extraterrestrial Radiation Hazards',
    titleBn: 'মহাজাগতিক বিকিরণের ঝুঁকি',
    description: 'Analyze the mechanics of solar particle events and cosmic rays, evaluating why passive shielding (regolith/water) is essential for crew cellular health.',
    descriptionBn: 'সৌর কণা ঝড় ও মহাজাগতিক রশ্মির প্রভাব পর্যালোচনা করুন। কেন প্যাসিভ শিল্ডিং (রেগোলিথ বা পানি) নভোচারীদের কোষীয় স্বাস্থ্য সুরক্ষার জন্য অপরিহার্য তা জানুন।'
  },
  {
    id: 5,
    title: 'Bioregenerative & Chemical ECLSS',
    titleBn: 'বায়োরিজেনারেটিভ বনাম রাসায়নিক ECLSS',
    description: 'Compare physical-chemical life support (electrolysis, CO2 scrubbers) with biological systems (hydroponic plants, algae) in terms of power draw and buffer capacity.',
    descriptionBn: 'বিদ্যুৎ খরচ এবং সরবরাহ ক্ষমতার দিক থেকে ভৌত-রাসায়নিক জীবন ব্যবস্থা (ইলেক্ট্রোলাইসিস, কার্বন ডাই-অক্সাইড স্ক্রাবার) এবং জৈবিক ব্যবস্থার (হাইড্রোপনিক উদ্ভিদ, শৈবাল) তুলনা করুন।'
  },
  {
    id: 6,
    title: 'Mission Resilience & Active Redundancy',
    titleBn: 'মিশনের সহনশীলতা ও ব্যাকআপ ব্যবস্থা',
    description: 'Explore the concept of "fault tolerance" and why carrying spare parts and having multiple contingency procedures prevents catastrophic single-point failures.',
    descriptionBn: '"ফল্ট টলারেন্স" বা ত্রুটি মোকাবিলার ধারণা জানুন এবং কেন অতিরিক্ত খুচরা যন্ত্রাংশ ও বিকল্প জরুরি পরিকল্পনা রাখা ঘাঁটির চূড়ান্ত বিপর্যয় রোধ করে তা বুঝুন।'
  },
  {
    id: 7,
    title: 'Decision-Making Under Environmental Uncertainty',
    titleBn: 'পরিবেশগত অনিশ্চয়তায় সিদ্ধান্ত গ্রহণ',
    description: 'Develop critical thinking when responding to sudden emergencies (dust storms, solar flares) where immediate safety must be weighed against long-term mission objectives.',
    descriptionBn: 'ধূলিঝড় বা সৌর শিখার মতো হঠাৎ জরুরি পরিস্থিতিতে তাৎক্ষণিক নিরাপত্তা ও দীর্ঘমেয়াদী মিশনের লক্ষ্যের মধ্যে জটিল সিদ্ধান্ত গ্রহণের যৌক্তিক দক্ষতা অর্জন করুন।'
  }
];

export const TEACHER_PRESETS: TeacherPreset[] = [
  {
    id: 'lunar_beginner',
    title: 'Lunar Gateway Outpost — Intro to Life Support',
    titleBn: 'লুনার গেটওয়ে আউটপোস্ট — লাইফ সাপোর্ট পরিচিতি',
    destination: 'moon',
    duration: 30,
    difficulty: 'Easy',
    difficultyBn: 'সহজ',
    focusTopic: 'Basic Life Support & Solar Dependence',
    focusTopicBn: 'মৌলিক জীবন সমর্থন ও সৌর নির্ভরতা',
    description: 'A 30-day lunar trial with moderate solar conditions. Ideal for 5th–8th grade students learning closed-loop ECLSS for the first time.',
    descriptionBn: 'সহনীয় সৌর অবস্থায় ৩০ দিনের চাঁদের মিশন। ৫ম–৮ম শ্রেণির শিক্ষার্থীদের প্রথমবার বদ্ধ-লুপ ECLSS শেখানোর জন্য অত্যন্ত উপযোগী।',
    scenarioCode: 'NASA-LUNAR-30-BASIC'
  },
  {
    id: 'mars_storm_resilience',
    title: 'Mars Chryse Planitia — Dust Storm Crisis',
    titleBn: 'মার্স ক্রাইস প্ল্যানিটিয়া — ধূলিঝড় সংকট',
    destination: 'mars',
    duration: 30,
    difficulty: 'Standard',
    difficultyBn: 'মানসম্মত',
    focusTopic: 'Photovoltaic Degradation & Power Rationing',
    focusTopicBn: 'সৌর শক্তি হ্রাস ও বিদ্যুৎ রেশনিং',
    description: 'A Martian mission confronting severe atmospheric dust storms. Challenges students to allocate scarce power between greenhouse and life support.',
    descriptionBn: 'মার্সিয়ান মিশন যেখানে তীব্র বায়ুমণ্ডলীয় ধূলিঝড়ের মুখোমুখি হতে হয়। গ্রিনহাউস ও লাইফ সাপোর্টের মধ্যে সীমিত বিদ্যুৎ বণ্টনের চ্যালেঞ্জ।',
    scenarioCode: 'NASA-MARS-30-STORM'
  },
  {
    id: 'deep_space_veteran',
    title: 'Artemis Base Camp — 60-Day Deep Space Trial',
    titleBn: 'আর্টেমিস বেস ক্যাম্প — ৬০ দিনের দীর্ঘ মহাশূন্য পরীক্ষা',
    destination: 'moon',
    duration: 60,
    difficulty: 'Challenging',
    difficultyBn: 'চ্যালেঞ্জিং',
    focusTopic: 'Cascading Failures & Long-Term Radiation Dose',
    focusTopicBn: 'ধারাবাহিক ব্যর্থতা ও দীর্ঘমেয়াদী বিকিরণ ডোজ',
    description: 'An extended mission testing crew endurance across multiple lunar day/night transitions and unpredictable solar particle events.',
    descriptionBn: 'একটি দীর্ঘায়িত মিশন যা চন্দ্রের দিন/রাতের চক্র এবং অপ্রত্যাশিত সৌর কণা ঝড়ে ক্রুদের সহনশীলতা পরীক্ষা করে।',
    scenarioCode: 'NASA-LUNAR-60-HARD'
  }
];

export const CLASSROOM_DEBRIEF_QUESTIONS: ClassroomDebriefQuestion[] = [
  {
    id: 'q1',
    question: 'When power production dropped, which system did your team shut down first, and what was the consequence 3 days later?',
    questionBn: 'বিদ্যুৎ উৎপাদন কমে যাওয়ার পর তোমাদের দল সবার আগে কোন ব্যবস্থাটি বন্ধ করেছিল, এবং ৩ দিন পর তার ফল কী হয়েছিল?',
    targetConcept: 'Cascading Subsystem Interdependence',
    targetConceptBn: 'উপ-ব্যবস্থাগুলোর চেইন নির্ভরতা',
    teacherGuideNotes: 'Students often shut down the greenhouse first to save power, but fail to account for the delayed food depletion curve or oxygen drop.',
    teacherGuideNotesBn: 'শিক্ষার্থীরা বিদ্যুৎ বাঁচাতে প্রায়ই প্রথমে গ্রিনহাউস বন্ধ করে, কিন্তু কয়েক দিন পর খাদ্য বা অক্সিজেনের ঘাটতি বুঝতে পারে।'
  },
  {
    id: 'q2',
    question: 'Why did we not just build 100% radiation shielding and infinite spare parts during the Base Builder phase?',
    questionBn: 'বেস তৈরির সময় আমরা কেন ১০০% বিকিরণ শিল্ড এবং অসীম খুচরা যন্ত্রাংশ নিতে পারিনি?',
    targetConcept: 'Opportunity Cost and Payload Constraints',
    targetConceptBn: 'সুযোগ-ব্যয় এবং রকেট পেলোড সীমাবদ্ধতা',
    teacherGuideNotes: 'Guide students to reflect on the launch budget constraint: spending all credits on shielding left inadequate hydroponics and water recycling.',
    teacherGuideNotesBn: 'শিক্ষার্থীদের বোঝান যে উৎক্ষেপণ বাজেটের সীমাবদ্ধতা রয়েছে: শিল্ডিংয়ে সব ক্রেডিট খরচ করলে হাইড্রোপনিক্স ও পানি রিসাইক্লিংয়ের বাজেট থাকে না।'
  },
  {
    id: 'q3',
    question: 'How did the Engineer and Biologist roles help keep your outpost alive differently than having four Scientists?',
    questionBn: 'চারজন বিজ্ঞানীর চেয়ে একজন ইঞ্জিনিয়ার ও একজন জীববিজ্ঞানী থাকা কীভাবে ঘাঁটিকে বেশি কার্যকর রাখে?',
    targetConcept: 'Team Specialization and Resilience',
    targetConceptBn: 'দলের বিশেষীকরণ ও সহনশীলতা',
    teacherGuideNotes: 'Highlight the role bonuses: the Engineer consumes fewer spare parts per repair, while the Biologist increases hydroponic crop yield per liter of water.',
    teacherGuideNotesBn: 'বিশেষ দক্ষতার সুবিধা ব্যাখ্যা করুন: ইঞ্জিনিয়ার কম যন্ত্রাংশে মেরামত করতে পারে, আর জীববিজ্ঞানী প্রতি লিটার পানিতে বেশি খাদ্য উৎপাদন করে।'
  },
  {
    id: 'q4',
    question: 'Compare survival vs overall score: Why did a mission that purely conserved resources not achieve the highest mission grade?',
    questionBn: 'টিকে থাকা বনাম সামগ্রিক স্কোর তুলনা করো: কেবল সম্পদ জমিয়ে রেখে একটি মিশন কেন সর্বোচ্চ গ্রেড পায় না?',
    targetConcept: 'Mission Objectives vs Mere Survival',
    targetConceptBn: 'মিশনের মূল উদ্দেশ্য বনাম নিছক বেঁচে থাকা',
    teacherGuideNotes: 'NASA missions travel to other worlds to conduct science and explore, not merely to sit in a bunker. Science and learning are key components of mission success.',
    teacherGuideNotesBn: 'নাসার মিশন কেবল বাঙ্কারে বসে থাকার জন্য নয়, বৈজ্ঞানিক গবেষণা ও মহাকাশ অনুসন্ধানের জন্য যায়। বিজ্ঞান ও শিখনই সাফল্যের চাবিকাঠি।'
  }
];
