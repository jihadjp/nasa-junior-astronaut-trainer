// In-game Achievements

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'survival' | 'engineering' | 'science' | 'mastery';
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_steps',
    title: 'FIRST STEPS',
    description: 'Complete your first lunar or Martian simulated mission.',
    icon: '🚀',
    category: 'survival'
  },
  {
    id: 'power_master',
    title: 'POWER MASTER',
    description: 'Maintain a stable positive energy balance for 10 consecutive simulated days.',
    icon: '⚡',
    category: 'engineering'
  },
  {
    id: 'green_thumb',
    title: 'GREEN THUMB',
    description: 'Harvest fresh food crops and maintain greenhouse efficiency above 80%.',
    icon: '🌱',
    category: 'science'
  },
  {
    id: 'shield_master',
    title: 'SHIELD MASTER',
    description: 'Survive a solar radiation storm with effective shielding keeping crew dose safe.',
    icon: '🛡️',
    category: 'survival'
  },
  {
    id: 'engineer_fix',
    title: 'CHIEF ENGINEER',
    description: 'Successfully resolve 3 major mechanical or life support equipment failures.',
    icon: '🔧',
    category: 'engineering'
  },
  {
    id: 'system_thinker',
    title: 'SYSTEM THINKER',
    description: 'Successfully navigate and recover from a cascading multi-system resource deficit.',
    icon: '🧠',
    category: 'mastery'
  },
  {
    id: 'mars_pioneer',
    title: 'RED PLANET PIONEER',
    description: 'Complete a full Martian outpost expedition through atmospheric dust storms.',
    icon: '🔴',
    category: 'mastery'
  },
  {
    id: 'mission_commander',
    title: 'MISSION COMMANDER',
    description: 'Complete an advanced 60 or 90 day expedition in Mission Commander Mode.',
    icon: '⭐',
    category: 'mastery'
  }
];
