# System Architecture & Technical Specifications
# OUTPOST: Junior Astronaut Mission Trainer

---

## 1. System Overview

**OUTPOST** is structured as an offline-first, client-side single page application (SPA) built with React 19, TypeScript, and Vite. The design cleanly decouples the **Simulation Engine & Mathematical Models** from the **React UI Rendering Layer**, ensuring deterministic execution, high testability, and 60 FPS visual performance.

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  |     Top HUD        |   | 2.5D Outpost Canvas   |   |   6-Resource HUD       |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | Time & Speed Ctrl  |   | Crew Wellbeing & Cards|   | Commander Telemetry    |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | Dispatches Actions & Ticks
                                          v
+-----------------------------------------------------------------------------------+
|                             MASTER SIMULATION ENGINE                              |
|                                                                                   |
|  +------------------------+  +-------------------------+  +--------------------+  |
|  | stepSimulationDay()    |  | calculateResourceDeltas |  | updateCrewStates() |  |
|  +------------------------+  +-------------------------+  +--------------------+  |
|  +------------------------+  +-------------------------+  +--------------------+  |
|  | checkTriggeredEvents() |  | evaluateAchievements()  |  | calculateScores()  |  |
|  +------------------------+  +-------------------------+  +--------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | Telemetry Feedback Loop
                                          v
+-----------------------------------------------------------------------------------+
|                             CORE SUBSYSTEM ENGINES                                |
|  +------------------+  +-------------------+  +------------------+  +-----------+ |
|  | Photovoltaic Bus |  | ECLSS Water Loop  |  | O2 Electrolysis  |  | Hydroponic| |
|  +------------------+  +-------------------+  +------------------+  +-----------+ |
|  +------------------+  +-------------------+  +------------------+  +-----------+ |
|  | Regolith Shield  |  | 3D Spare Fab      |  | Web Audio Synth  |  | LocalSave | |
|  +------------------+  +-------------------+  +------------------+  +-----------+ |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
src/
├── types/
│   ├── game.ts              # Core types: SimulationState, Resources, Modules, Crew, Scores
│   └── events.ts            # DecisionChoice, CausalStep, GameEvent contracts
├── simulation/
│   ├── engine.ts            # Master stepSimulationDay() lifecycle orchestrator
│   ├── resources.ts         # Deterministic calculations for O₂, H₂O, Power, Food, Shield, Spares
│   ├── modules.ts           # Subsystem module specs (Habitat, Solar, ECLSS, Bio, Lab, etc.)
│   ├── crew.ts              # Crew wellbeing curves, stress, morale, and role bonuses
│   ├── scoring.ts           # 5-factor scoring algorithm (Survival, Efficiency, Science, Resilience, Learning)
│   └── __tests__/           # Vitest automated test suite
├── events/
│   ├── eventDatabase.ts     # 10+ comprehensive events with decisions, trade-offs & causal chains
│   └── eventEngine.ts       # Trigger evaluation logic based on day windows & crises
├── data/
│   ├── educationalContent.ts# STEM articles, concept schematics, and NASA mission specs
│   ├── nasaSources.ts       # NASA PDS datasets, citations, and licenses
│   ├── teacherScenarios.ts  # Classroom presets, 7 STEM learning objectives, debrief prompts
│   └── achievements.ts      # 8 mission honor awards and unlock criteria
├── sound/
│   └── audioEngine.ts       # Web Audio API synthetic audio engine (100% offline, procedural)
├── components/
│   ├── landing/             # Cinematic landing hero, challenge callouts
│   ├── setup/               # DestinationSelector, CrewSelector, BaseBuilder
│   ├── mission/             # TopHUD, OutpostCanvas, ResourceHUD, CrewHUD, TimeControls, CommanderTelemetry
│   ├── events/              # DecisionModal, CausalChainModal, EducationalModal
│   ├── report/              # MissionReportModal, ReplayModal ("What If?" branching)
│   ├── demo/                # JudgingDemoModal (60-sec judging showcase)
│   ├── teacher/             # TeacherModeModal (curriculum standards, presets, debriefs)
│   ├── achievements/        # AchievementsModal
│   ├── layout/              # SourcesModal, SoundToggle
│   └── tutorial/            # GuidedTutorial onboarding
├── utils/                   # Storage helpers, formatting
├── App.tsx                  # Root component & phase state machine
├── index.css                # Tailwind CSS v4 setup, scanlines, flow animations
└── main.tsx                 # React entry point
```

---

## 3. The Daily Simulation Tick Lifecycle

When `stepSimulationDay(state)` executes:

1. **Mission Clock Increment**:
   `nextDay = missionDay + 1`
2. **Orbital & Atmospheric Physics**:
   - Updates celestial sun angle: $\sin\left(\frac{\text{day}}{\text{period}} \cdot \pi\right)$.
   - Updates atmospheric dust concentration (Martian tau parameter).
   - Recalculates solar irradiance factor $I = I_0 \times (1 - \text{dust} \times 0.85) \times \text{sunFactor}$.
3. **Electrical Grid Bus Allocation**:
   - Calculates gross generation: $\text{SolarGen} = \text{Base} \times \text{Level} \times \text{FluxMod} \times \text{DustFactor} \times \text{SunFactor}$.
   - Sums loads from Habitat, ECLSS, Water Recycler, Greenhouse, Science Lab, Rover Bay, and Fabricator.
   - If battery deficit occurs ($\text{Power} + \text{Net} < 5\text{ kWh}$), activates **Automatic Load Shedding** (throttles Science Lab and non-essential greenhouse heating to safeguard life support).
4. **ECLSS Mass Balance Calculations**:
   - **Oxygen**: Respiratory consumption ($0.84\text{ kg/day/astronaut}$) subtracted from Sabatier/electrolysis output and plant photosynthesis.
   - **Water**: Human hydration ($2.5\text{ L/day/astronaut}$) + irrigation ($2.5\text{ L/day}$) reclaimed via vacuum distillation (90% to 98% efficiency).
   - **Food**: Caloric intake ($1.4\text{ kg/day/astronaut}$) offset by hydroponic harvest yield.
   - **Radiation**: Base flux ($1.2\text{ mSv/day}$ Moon, $0.75\text{ mSv/day}$ Mars) attenuated by regolith and water barrier.
5. **Crew Psychobiological Modeling**:
   - Evaluates partial pressures of O₂, hydration buffer, caloric balance, cabin temperature, and radiation dose.
   - Recomputes individual Astronaut Health %, Morale %, and Stress %.
   - Assigns dynamic physiological statuses (`Healthy`, `Tired`, `Radiation Alert`, `Hypoxic`, `Critical`).
   - Weighted overall wellbeing: $0.65 \times \text{Health} + 0.35 \times \text{Morale}$.
6. **Scientific Output**:
   - Astrobiology lab output generated if powered, amplified by Scientist specialty bonus (+35%).
7. **Failure and Victory Evaluation**:
   - Failure triggered if Oxygen $\le 0$, Potable Water $\le 0$, or Crew Health $\le 10\%$.
   - Victory triggered if `missionDay >= totalDays` (30, 60, or 90 days).
8. **Event Trigger Evaluation**:
   - Evaluates random and threshold-based events (dust storms, equipment clogs, solar flares, discoveries).
   - If triggered, automatically pauses clock and mounts `DecisionModal`.

---

## 4. Procedural Audio Synthesizer (Zero-Asset)

To satisfy the **Offline-First** requirement with zero external network downloads and zero audio file latency:
- Implemented via the native browser **Web Audio API**.
- Procedural oscillator synthesis:
  - **Ambient Space Drone**: 55 Hz sawtooth wave fed through a 120 Hz low-pass biquad filter.
  - **UI Click**: 880 Hz to 440 Hz exponential frequency drop over 60 ms.
  - **Warning Beep**: Dual-tone 520 Hz / 660 Hz triangle wave over 250 ms.
  - **Alert Klaxon**: Interleaved 800 Hz to 400 Hz sawtooth sweeps.
  - **Success Chime**: Polytone C-Major chord (C5, E5, G5, C6) with exponential decay.
- Full compliance with modern browser autoplay policies (initialized on first user interaction).

---

## 5. Accessibility & Responsive Implementation

- **Color Independence**: Every telemetry state and alarm uses a dual indicator (e.g. `✓ SAFE`, `⚠ WARNING`, `✕ CRITICAL`) rather than relying on color alone.
- **Keyboard Navigation**:
  - `[Space]`: Toggle Pause / Resume simulation
  - `[1] / [3]`: Toggle 1x / 3x simulation speed
  - `[Esc]`: Dismiss open modals and return to HUD
- **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by bypassing continuous CSS canvas animations.
- **Responsive Layout**: Adapts gracefully from 360px mobile screens (collapsible bottom sheets) to 4K ultra-wide monitors.
