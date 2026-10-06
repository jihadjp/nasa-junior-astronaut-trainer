// Bilingual System Automated Verification Suite (Bengali 🇧🇩 ↔ English 🇬🇧)

import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../translations';
import { toBengaliNumerals } from '../LanguageContext';
import { GAME_EVENTS } from '../../events/eventDatabase';
import { DEFAULT_ASTRONAUTS } from '../../simulation/crew';
import { STEM_LEARNING_OBJECTIVES, TEACHER_PRESETS, CLASSROOM_DEBRIEF_QUESTIONS } from '../../data/teacherScenarios';
import { NASA_DATA_SOURCES } from '../../data/nasaSources';
import { ACHIEVEMENTS_LIST } from '../../data/achievements';
import { EDUCATIONAL_ARTICLES } from '../../data/educationalContent';

describe('Bilingual Language System (বাংলা 🇧🇩 ↔ English 🇬🇧)', () => {
  it('has matching translation keys between English and Bengali dictionaries', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const bnKeys = Object.keys(TRANSLATIONS.bn).sort();

    // Check every EN key is present in BN
    for (const key of enKeys) {
      expect((TRANSLATIONS.bn as Record<string, string>)[key], `Missing Bengali translation for key: "${key}"`).toBeDefined();
      expect((TRANSLATIONS.bn as Record<string, string>)[key].trim().length).toBeGreaterThan(0);
    }

    // Check every BN key is present in EN
    for (const key of bnKeys) {
      expect((TRANSLATIONS.en as Record<string, string>)[key], `Missing English translation for key: "${key}"`).toBeDefined();
      expect((TRANSLATIONS.en as Record<string, string>)[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('correctly converts English numerals to Bengali digits', () => {
    expect(toBengaliNumerals(0)).toBe('০');
    expect(toBengaliNumerals(1)).toBe('১');
    expect(toBengaliNumerals(1234567890)).toBe('১২৩৪৫৬৭৮৯০');
    expect(toBengaliNumerals('Day 30 of 30')).toBe('Day ৩০ of ৩০');
    expect(toBengaliNumerals('98.5%')).toBe('৯৮.৫%');
  });

  it('provides complete Bengali translations for all Game Events and Causal Chains', () => {
    expect(GAME_EVENTS.length).toBeGreaterThanOrEqual(6);

    for (const event of GAME_EVENTS) {
      expect(event.titleBn, `Event "${event.id}" missing titleBn`).toBeTruthy();
      expect(event.storyContextBn, `Event "${event.id}" missing storyContextBn`).toBeTruthy();
      expect(event.telemetrySnapshotTextBn, `Event "${event.id}" missing telemetrySnapshotTextBn`).toBeTruthy();

      for (const choice of event.choices) {
        expect(choice.labelBn, `Choice "${choice.id}" in event "${event.id}" missing labelBn`).toBeTruthy();
        expect(choice.descriptionBn, `Choice "${choice.id}" in event "${event.id}" missing descriptionBn`).toBeTruthy();
        expect(choice.immediateEffectsSummaryBn, `Choice "${choice.id}" in event "${event.id}" missing immediateEffectsSummaryBn`).toBeTruthy();
        expect(choice.tradeoffHintBn, `Choice "${choice.id}" in event "${event.id}" missing tradeoffHintBn`).toBeTruthy();

        for (const step of choice.causalChain) {
          expect(step.titleBn, `Causal step ${step.step} in choice "${choice.id}" missing titleBn`).toBeTruthy();
          expect(step.descriptionBn, `Causal step ${step.step} in choice "${choice.id}" missing descriptionBn`).toBeTruthy();
        }
      }
    }
  });

  it('provides complete Bengali fields for Default Astronaut crew members', () => {
    for (const astronaut of DEFAULT_ASTRONAUTS) {
      expect(astronaut.nameBn, `Astronaut "${astronaut.id}" missing nameBn`).toBeTruthy();
      expect(astronaut.roleBn, `Astronaut "${astronaut.id}" missing roleBn`).toBeTruthy();
      expect(astronaut.specialtyBn, `Astronaut "${astronaut.id}" missing specialtyBn`).toBeTruthy();
      expect(astronaut.currentTaskBn, `Astronaut "${astronaut.id}" missing currentTaskBn`).toBeTruthy();
    }
  });

  it('provides complete Bengali fields for Teacher Mode presets, standards, and debrief prompts', () => {
    for (const obj of STEM_LEARNING_OBJECTIVES) {
      expect(obj.titleBn, `Objective ${obj.id} missing titleBn`).toBeTruthy();
      expect(obj.descriptionBn, `Objective ${obj.id} missing descriptionBn`).toBeTruthy();
    }

    for (const preset of TEACHER_PRESETS) {
      expect(preset.titleBn, `Preset "${preset.id}" missing titleBn`).toBeTruthy();
      expect(preset.difficultyBn, `Preset "${preset.id}" missing difficultyBn`).toBeTruthy();
      expect(preset.focusTopicBn, `Preset "${preset.id}" missing focusTopicBn`).toBeTruthy();
      expect(preset.descriptionBn, `Preset "${preset.id}" missing descriptionBn`).toBeTruthy();
    }

    for (const q of CLASSROOM_DEBRIEF_QUESTIONS) {
      expect(q.questionBn, `Debrief question "${q.id}" missing questionBn`).toBeTruthy();
      expect(q.targetConceptBn, `Debrief question "${q.id}" missing targetConceptBn`).toBeTruthy();
      expect(q.teacherGuideNotesBn, `Debrief question "${q.id}" missing teacherGuideNotesBn`).toBeTruthy();
    }
  });

  it('provides complete Bengali fields for NASA Data Sources and Achievements', () => {
    for (const source of NASA_DATA_SOURCES) {
      expect(source.nameBn, `Source "${source.id}" missing nameBn`).toBeTruthy();
      expect(source.dataTypeBn, `Source "${source.id}" missing dataTypeBn`).toBeTruthy();
      expect(source.descriptionBn, `Source "${source.id}" missing descriptionBn`).toBeTruthy();
    }

    for (const ach of ACHIEVEMENTS_LIST) {
      expect(ach.titleBn, `Achievement "${ach.id}" missing titleBn`).toBeTruthy();
      expect(ach.descriptionBn, `Achievement "${ach.id}" missing descriptionBn`).toBeTruthy();
    }
  });

  it('provides complete child-friendly Bengali content for all NASA Educational Articles', () => {
    const articles = Object.values(EDUCATIONAL_ARTICLES);
    expect(articles.length).toBeGreaterThanOrEqual(6);

    for (const topic of articles) {
      expect(topic.titleBn, `Article "${topic.id}" missing titleBn`).toBeTruthy();
      expect(topic.subtitleBn, `Article "${topic.id}" missing subtitleBn`).toBeTruthy();
      expect(topic.categoryBn, `Article "${topic.id}" missing categoryBn`).toBeTruthy();
      expect(topic.simplifiedExplanationBn, `Article "${topic.id}" missing simplifiedExplanationBn`).toBeTruthy();
      expect(topic.realNasaMissionFactBn, `Article "${topic.id}" missing realNasaMissionFactBn`).toBeTruthy();
      expect(topic.visualDiagram.labelsBn?.length).toBe(topic.visualDiagram.labels.length);
      expect(topic.visualDiagram.captionBn, `Article "${topic.id}" missing visualDiagram.captionBn`).toBeTruthy();
      expect(topic.advancedEngineeringSpec.descriptionBn, `Article "${topic.id}" missing advancedEngineeringSpec.descriptionBn`).toBeTruthy();
    }
  });

  it('safely re-hydrates serialized game state without losing applyChoice function', () => {
    const originalEvent = GAME_EVENTS[0];
    const serialized = JSON.stringify({ activeEvent: originalEvent });
    const parsed = JSON.parse(serialized);

    // After JSON serialization, applyChoice is undefined
    expect(parsed.activeEvent.choices[0].applyChoice).toBeUndefined();

    // Re-hydration lookup restores the authoritative function
    const rehydratedEvent = GAME_EVENTS.find(e => e.id === parsed.activeEvent.id);
    expect(rehydratedEvent).toBeDefined();
    expect(typeof rehydratedEvent?.choices[0].applyChoice).toBe('function');
  });
});
