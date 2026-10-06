// In-game Achievements

export interface Achievement {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  icon: string;
  category: 'survival' | 'engineering' | 'science' | 'mastery';
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_steps',
    title: 'FIRST STEPS',
    titleBn: 'প্রথম পদক্ষেপ',
    description: 'Complete your first lunar or Martian simulated mission.',
    descriptionBn: 'তোমার প্রথম চন্দ্র বা মঙ্গল সিমুলেটেড মিশন সফলভাবে সম্পন্ন করো।',
    icon: '🚀',
    category: 'survival'
  },
  {
    id: 'power_master',
    title: 'POWER MASTER',
    titleBn: 'বিদ্যুৎ মাস্টার',
    description: 'Maintain a stable positive energy balance for 10 consecutive simulated days.',
    descriptionBn: 'টানা ১০ সিমুলেটেড দিন ইতিবাচক ও স্থিতিশীল বিদ্যুৎ ভারসাম্য বজায় রাখো।',
    icon: '⚡',
    category: 'engineering'
  },
  {
    id: 'green_thumb',
    title: 'GREEN THUMB',
    titleBn: 'মহাকাশ কৃষক',
    description: 'Harvest fresh food crops and maintain greenhouse efficiency above 80%.',
    descriptionBn: 'টাটকা শস্য উৎপাদন করো এবং গ্রিনহাউসের কার্যক্ষমতা ৮০% এর উপরে রাখো।',
    icon: '🌱',
    category: 'science'
  },
  {
    id: 'shield_master',
    title: 'SHIELD MASTER',
    titleBn: 'শিল্ড বিশেষজ্ঞ',
    description: 'Survive a solar radiation storm with effective shielding keeping crew dose safe.',
    descriptionBn: 'কার্যকর রেডিয়েশন শিল্ডিংয়ের মাধ্যমে সৌর ঝড় অতিক্রম করো এবং ক্রুদের সুস্থ রাখো।',
    icon: '🛡️',
    category: 'survival'
  },
  {
    id: 'engineer_fix',
    title: 'CHIEF ENGINEER',
    titleBn: 'প্রধান প্রকৌশলী',
    description: 'Successfully resolve 3 major mechanical or life support equipment failures.',
    descriptionBn: '৩টি বড় ধরনের যান্ত্রিক বা লাইফ সাপোর্ট ত্রুটি সফলভাবে সমাধান করো।',
    icon: '🔧',
    category: 'engineering'
  },
  {
    id: 'system_thinker',
    title: 'SYSTEM THINKER',
    titleBn: 'সিস্টেম চিন্তাবিদ',
    description: 'Successfully navigate and recover from a cascading multi-system resource deficit.',
    descriptionBn: 'একসাথে একাধিক ব্যবস্থার জটিল সংকট সফলভাবে মোকাবিলা ও পুনরুদ্ধার করো।',
    icon: '🧠',
    category: 'mastery'
  },
  {
    id: 'mars_pioneer',
    title: 'RED PLANET PIONEER',
    titleBn: 'লাল গ্রহের অগ্রদূত',
    description: 'Complete a full Martian outpost expedition through atmospheric dust storms.',
    descriptionBn: 'বায়ুমণ্ডলীয় ধূলিঝড়ের মধ্যেও মঙ্গলের পূর্ণাঙ্গ আউটপোস্ট মিশন সম্পন্ন করো।',
    icon: '🔴',
    category: 'mastery'
  },
  {
    id: 'mission_commander',
    title: 'MISSION COMMANDER',
    titleBn: 'মিশন কমান্ডার',
    description: 'Complete an advanced 60 or 90 day expedition in Mission Commander Mode.',
    descriptionBn: 'মিশন কমান্ডার মোডে ৬০ বা ৯০ দিনের দীর্ঘ ও জটিল অভিযান সম্পন্ন করো।',
    icon: '⭐',
    category: 'mastery'
  }
];
