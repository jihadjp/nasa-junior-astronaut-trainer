# Asset Registry & Open Source Licenses
# OUTPOST: Junior Astronaut Mission Trainer

This document details the licensing, attribution, and origins of all third-party libraries, fonts, icons, and intellectual property incorporated into **OUTPOST: Junior Astronaut Mission Trainer**.

---

## 1. Project Software License

```
MIT License

Copyright (c) 2026 NASA Space Apps Challenge Team - Junior Astronaut Mission Trainer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 2. Typography & Fonts

| Font Family | Author / Foundry | License | Usage |
| :--- | :--- | :--- | :--- |
| **Space Grotesk** | Florian Karsten | SIL Open Font License 1.1 | Primary HUD Headers, Module Titles |
| **Inter** | Rasmus Andersson | SIL Open Font License 1.1 | Body Text, Descriptions, Educational Lessons |
| **JetBrains Mono** | JetBrains | SIL Open Font License 1.1 | Telemetry Metrics, Engineering Numbers, Time |

---

## 3. Icons & Visual Assets

| Asset / Library | Provider | License | Description |
| :--- | :--- | :--- | :--- |
| **Lucide Icons** | Lucide Project | ISC License | Technical mission-control icons (wind, droplets, zap, etc.) |
| **2.5D SVG Base Visualizer** | Original Work | MIT License | Clean vector modules, flowing conduits, celestial sky |
| **Astronaut Portraits** | Original Work | MIT License | Stylized vector flight helmets and role collar insignia |
| **Canvas Confetti** | Kiril Vatev | ISC License | Mission success completion effect |

---

## 4. Audio Engine

| Asset Component | Implementation | License | Description |
| :--- | :--- | :--- | :--- |
| **Web Audio Synthesizer** | Native Web Audio API | MIT License (Original) | Procedural oscillators (55Hz drone, alert sweeps, chimes). Zero external audio files. 100% offline. |

---

## 5. NASA Data & Attributions

NASA technical parameters and educational datasets referenced in `src/data/nasaSources.ts` and `src/data/educationalContent.ts` are in the public domain or published under open-access scientific publication guidelines by NASA and JPL.
