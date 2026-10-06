// OUTPOST: Junior Astronaut Mission Trainer - Types

export type DestinationType = 'moon' | 'mars';

export type AstronautRole = 'commander' | 'engineer' | 'biologist' | 'scientist';

export type GameMode = 'junior' | 'commander';

export type MissionDuration = 30 | 60 | 90;

export type MissionPhase = 
  | 'landing'       // Cinematic opening / landing page
  | 'setup'         // Destination & crew & base setup
  | 'active'        // Gameplay loop
  | 'event'         // Decision modal open
  | 'causal_story'  // Post-decision causal chain playback
  | 'report'        // Mission complete / failed debrief
  | 'replay'        // Branching what-if replay screen
  | 'teacher'       // Teacher scenario dashboard
  | 'sources';      // NASA credits & educational sources

export interface DestinationConfig {
  id: DestinationType;
  name: string;
  tagline: string;
  gravity: number; // m/s^2 (Moon: 1.62, Mars: 3.72)
  temperatureRange: [number, number]; // Celsius [-130 to 120] vs [-140 to 20]
  atmosphere: string;
  solarFluxBase: number; // W/m^2
  radiationHazard: 'Extreme (No Magnetosphere/Atmosphere)' | 'High (Thin Atmosphere, Frequent Flares)';
  primaryChallenge: string;
  environmentalRisks: string[];
  dayCycleHours: number; // 708 hrs (Moon) vs 24.6 hrs (Mars)
  roverSpeedMod: number;
}

export interface Astronaut {
  id: string;
  name: string;
  role: AstronautRole;
  callsign: string;
  specialty: string;
  specialtyDescription: string;
  avatarSeed: string;
  health: number; // 0 - 100
  morale: number; // 0 - 100
  stress: number; // 0 - 100
  status: 'Healthy' | 'Tired' | 'Radiation Alert' | 'Hypoxic' | 'Critical';
  currentTask: string;
}

export type ModuleType = 
  | 'habitat'
  | 'solar_array'
  | 'life_support'
  | 'water_recycler'
  | 'greenhouse'
  | 'radiation_shield'
  | 'science_lab'
  | 'rover_garage'
  | 'spare_fabricator';

export interface BaseModule {
  id: ModuleType;
  name: string;
  shortName: string;
  category: 'core' | 'energy' | 'life_support' | 'science' | 'support';
  level: number; // 1 to 3
  maxLevel: number;
  costPoints: number;
  powerDraw: number; // kW
  powerGeneration?: number; // kW (e.g. solar)
  efficiency: number; // 0.0 to 1.0
  operational: boolean;
  durability: number; // 0 - 100
  description: string;
  educationalFact: string;
}

export interface Resources {
  oxygen: number;        // kg (stored breathable O2)
  oxygenMax: number;     // storage capacity
  water: number;         // Liters
  waterMax: number;      // capacity
  power: number;         // kWh stored in batteries
  powerMax: number;      // battery bank capacity
  food: number;          // kg / rations
  foodMax: number;       // pantry capacity
  shielding: number;     // Effective radiation attenuation index (0-100)
  spareParts: number;    // units of replacement components (0-100)
}

export interface ResourceDeltas {
  oxygen: number;     // delta per day
  water: number;      // delta per day
  powerNet: number;   // kW net generation - load
  powerGen: number;   // kW generated
  powerLoad: number;  // kW consumed
  food: number;       // delta per day
  radiationDose: number; // mSv/day absorbed
  sparePartsUsed: number;
}

export interface EnvironmentalConditions {
  dustLevel: number; // 0 - 100% (affects solar)
  solarFlareActive: boolean;
  dustStormActive: boolean;
  micrometeoroidThreat: boolean;
  externalTempC: number;
  communicationDelaySec: number;
  sunIntensity: number; // 0.0 to 1.0 (day/night / orbital angle)
}

export interface CausalStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  highlightCategory: 'decision' | 'system' | 'crew' | 'mission';
  metricImpact?: string;
}

export interface DecisionChoice {
  id: string;
  label: string;
  description: string;
  immediateEffectsSummary: string;
  tradeoffHint: string;
  applyChoice: (state: SimulationState) => SimulationState;
  causalChain: CausalStep[];
  educationalWhyId: string;
}

export interface GameEvent {
  id: string;
  title: string;
  category: 'environmental' | 'mechanical' | 'medical' | 'discovery' | 'crisis';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  dayTriggerMin?: number;
  dayTriggerMax?: number;
  destinationSpecific?: DestinationType;
  storyContext: string;
  telemetrySnapshotText: string;
  illustrationType: 'dust_storm' | 'power_shortage' | 'greenhouse_stress' | 'radiation_spike' | 'equipment_failure' | 'meteoroid' | 'discovery' | 'water_leak';
  choices: DecisionChoice[];
}

export interface MissionTimelineEntry {
  day: number;
  eventTitle?: string;
  choiceSelected?: string;
  oxygen: number;
  water: number;
  power: number;
  food: number;
  crewHealth: number;
  sciencePoints: number;
  highlight?: string;
  isCrisis?: boolean;
}

export interface MissionScores {
  survivalScore: number;    // 0 - 100
  efficiencyScore: number;  // 0 - 100
  scienceScore: number;     // 0 - 100
  resilienceScore: number;  // 0 - 100
  learningScore: number;    // 0 - 100
  overallScore: number;     // 0 - 100
  grade: 'PIONEER COMMANDER (A+)' | 'MISSION VETERAN (A)' | 'SPACE CADET (B)' | 'SURVIVOR (C)' | 'MISSION COMPROMISED (D)';
  feedback: string[];
}

export interface SimulationState {
  missionDay: number;
  totalDays: MissionDuration;
  destination: DestinationType;
  mode: GameMode;
  isPaused: boolean;
  speed: 1 | 3;
  resources: Resources;
  deltas: ResourceDeltas;
  environment: EnvironmentalConditions;
  modules: Record<ModuleType, BaseModule>;
  crew: Astronaut[];
  crewWellbeing: number; // 0 - 100 average weighted health & morale
  sciencePoints: number;
  baseIntegrity: number; // 0 - 100
  cumulativeRadiation_mSv: number;
  completedDecisions: Array<{ day: number; eventId: string; choiceId: string; choiceLabel: string }>;
  timeline: MissionTimelineEntry[];
  unlockedAchievements: string[];
  activeEvent: GameEvent | null;
  lastCausalChain: CausalStep[] | null;
  missionStatus: 'ongoing' | 'victory' | 'failed';
  failureReason?: string;
  scores?: MissionScores;
}
