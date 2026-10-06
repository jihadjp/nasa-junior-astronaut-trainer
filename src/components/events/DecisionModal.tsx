// Streamlined Decision Card Modal with Progressive Disclosure & Visual Clarity

import React, { useState } from 'react';
import type { GameEvent, DecisionChoice } from '../../types/game';
import { AlertCircle, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Activity, Shield, Zap, Wrench, Sprout } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface DecisionModalProps {
  event: GameEvent;
  onSelectChoice: (choice: DecisionChoice) => void;
  onOpenWhy: (whyId: string) => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  event,
  onSelectChoice,
  onOpenWhy
}) => {
  const { t, language } = useLanguage();
  const [showTelemetry, setShowTelemetry] = useState<boolean>(false);
  const [expandedChoiceId, setExpandedChoiceId] = useState<string | null>(null);

  const getChoiceIcon = (choiceId: string) => {
    if (choiceId.includes('shield') || choiceId.includes('shelter') || choiceId.includes('protect')) return Shield;
    if (choiceId.includes('power') || choiceId.includes('battery') || choiceId.includes('solar')) return Zap;
    if (choiceId.includes('greenhouse') || choiceId.includes('crop') || choiceId.includes('food')) return Sprout;
    if (choiceId.includes('repair') || choiceId.includes('wiper') || choiceId.includes('spares')) return Wrench;
    return Activity;
  };

  const renderIllustration = () => {
    switch (event.illustrationType) {
      case 'dust_storm':
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-amber-950/70 via-orange-950/50 to-amber-900/40 border border-amber-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">🌪️</span>
              <div>
                <span className="font-mono text-xs text-amber-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'বায়ুমণ্ডলীয় ধূলিঝড়' : 'ATMOSPHERIC DUST STORM'}
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {language === 'bn' ? 'সৌর প্যানেলে ধুলোর স্তর' : 'Dust accumulation on arrays'}
                </span>
              </div>
            </div>
          </div>
        );
      case 'greenhouse_stress':
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-green-900/40 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl">🌱</span>
              <div>
                <span className="font-mono text-xs text-emerald-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'হাইড্রোপনিক পুষ্টি সমস্যা' : 'HYDROPONIC SYSTEM IMBALANCE'}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  {language === 'bn' ? 'ফসলের বৃদ্ধি ব্যাহত' : 'Crop growth inhibited'}
                </span>
              </div>
            </div>
          </div>
        );
      case 'radiation_spike':
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-purple-950/70 via-red-950/50 to-purple-900/40 border border-purple-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl animate-pulse">☀️</span>
              <div>
                <span className="font-mono text-xs text-purple-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'তীব্র সৌরঝড় ও বিকিরণ' : 'SOLAR PROTON RADIATION SPIKE'}
                </span>
                <span className="text-[10px] text-purple-400/80 font-mono">
                  {language === 'bn' ? 'রেডিওঅ্যাকটিভ প্রোটন প্রবাহ' : 'High energy proton flux'}
                </span>
              </div>
            </div>
          </div>
        );
      case 'power_shortage':
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-yellow-950/70 via-amber-950/50 to-yellow-900/40 border border-yellow-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl animate-pulse">⚡</span>
              <div>
                <span className="font-mono text-xs text-yellow-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'বৈদ্যুতিক বাস ওভারলোড' : 'ELECTRICAL BUS DEFICIT'}
                </span>
                <span className="text-[10px] text-yellow-400/80 font-mono">
                  {language === 'bn' ? 'ব্যাটারি চার্জিং বিঘ্নিত' : 'Battery depletion risk'}
                </span>
              </div>
            </div>
          </div>
        );
      case 'water_leak':
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-sky-950/70 via-blue-950/50 to-sky-900/40 border border-sky-500/30 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl">💧</span>
              <div>
                <span className="font-mono text-xs text-sky-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'পানি সরবরাহ ব্লকেজ' : 'ECLSS WATER LOOP CONSTRICTION'}
                </span>
                <span className="text-[10px] text-sky-400/80 font-mono">
                  {language === 'bn' ? 'ফিল্টার চাপ বৃদ্ধি' : 'Filtration pressure surge'}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-24 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden">
            <div className="text-center z-10 flex items-center gap-2.5">
              <span className="text-3xl">🔧</span>
              <div>
                <span className="font-mono text-xs text-slate-300 font-bold uppercase block tracking-wider">
                  {language === 'bn' ? 'যান্ত্রিক ত্রুটি সতর্কতা' : 'MECHANICAL TELEMETRY ANOMALY'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {language === 'bn' ? 'জরুরি প্রকৌশল সিদ্ধান্ত' : 'Engineering response required'}
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleChoice = (c: DecisionChoice) => {
    sound.playClick();
    onSelectChoice(c);
  };

  const firstWhyId = event.choices[0]?.educationalWhyId || 'systems_engineering_redundancy';

  const priorityLabel = event.urgency === 'critical'
    ? (language === 'bn' ? 'জরুরি ঘটনা' : 'CRITICAL')
    : (language === 'bn' ? 'সতর্কতা' : 'ALERT');

  const eventTitle = (language === 'bn' && event.titleBn) ? event.titleBn : event.title;
  const eventStory = (language === 'bn' && event.storyContextBn) ? event.storyContextBn : event.storyContext;
  const eventTelemetry = (language === 'bn' && event.telemetrySnapshotTextBn) ? event.telemetrySnapshotTextBn : event.telemetrySnapshotText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0D1527] border-2 border-[#52D6FF]/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {priorityLabel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {t('event.alert')}
            </span>
          </div>

          {/* Deep Science Button */}
          <button
            onClick={() => onOpenWhy(firstWhyId)}
            className="px-2.5 py-1 rounded-lg bg-[#52D6FF]/15 border border-[#52D6FF]/40 text-[#52D6FF] hover:bg-[#52D6FF]/25 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            title="Explore NASA STEM Science behind this event"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('event.science.btn')}</span>
          </button>
        </div>

        {/* Event Title */}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 tracking-tight">
          {eventTitle}
        </h2>

        {/* Visual Illustration */}
        <div className="mb-3.5">
          {renderIllustration()}
        </div>

        {/* Story Narrative (Clean Level 1 Text) */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 font-sans">
          {eventStory}
        </p>

        {/* Progressive Disclosure: Collapsible Telemetry Snapshot */}
        <div className="mb-4">
          <button
            onClick={() => setShowTelemetry(prev => !prev)}
            className="text-[11px] font-mono text-[#52D6FF] hover:underline flex items-center gap-1 focus:outline-none"
          >
            <span>{t('event.telemetry.toggle')}</span>
            {showTelemetry ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTelemetry && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#060B18] border border-slate-800 font-mono text-xs text-amber-300/90 flex items-start gap-2 animate-fadeIn">
              <span className="text-amber-400 font-bold shrink-0">📊</span>
              <span>{eventTelemetry}</span>
            </div>
          )}
        </div>

        {/* Decision Choices (Clean Hero Cards) */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            {t('event.directive')}
          </div>

          {event.choices.map((choice) => {
            const ChoiceIcon = getChoiceIcon(choice.id);
            const choiceLabel = (language === 'bn' && choice.labelBn) ? choice.labelBn : choice.label;
            const choiceDesc = (language === 'bn' && choice.descriptionBn) ? choice.descriptionBn : choice.description;
            const choiceImmediate = (language === 'bn' && choice.immediateEffectsSummaryBn) ? choice.immediateEffectsSummaryBn : choice.immediateEffectsSummary;
            const choiceTradeoff = (language === 'bn' && choice.tradeoffHintBn) ? choice.tradeoffHintBn : choice.tradeoffHint;
            const isExpanded = expandedChoiceId === choice.id;

            return (
              <div
                key={choice.id}
                className="rounded-xl bg-[#131F38] border border-slate-700/80 hover:border-[#52D6FF]/60 hover:bg-[#182746] transition-all overflow-hidden"
              >
                {/* Main Clickable Action Bar */}
                <div
                  onClick={() => handleChoice(choice)}
                  className="p-3 sm:p-3.5 cursor-pointer flex items-center justify-between gap-3 group select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#0A1020] border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-[#52D6FF] transition-colors">
                      <ChoiceIcon className="w-4 h-4 text-[#52D6FF]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#52D6FF] transition-colors truncate">
                        {choiceLabel}
                      </h4>
                      <p className="text-[11px] text-slate-300 truncate mt-0.5 font-sans">
                        {choiceDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle Trade-off Details */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedChoiceId(isExpanded ? null : choice.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 text-[10px] font-mono flex items-center gap-0.5"
                      title={t('event.tradeoff.toggle')}
                    >
                      <span>ⓘ</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <div className="px-3 py-1.5 rounded-lg bg-[#52D6FF] group-hover:bg-[#38bdf8] text-slate-950 font-mono font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95">
                      <span>{language === 'bn' ? 'বাছাই করো' : 'EXECUTE'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Level 2 Collapsible Trade-Off Analysis */}
                {isExpanded && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-800/80 bg-[#0A1020]/90 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono animate-fadeIn">
                    <div className="text-emerald-400">
                      <strong className="text-slate-400 block text-[10px]">{t('event.immediate')}</strong>
                      {choiceImmediate}
                    </div>
                    <div className="text-amber-300">
                      <strong className="text-slate-400 block text-[10px]">{t('event.tradeoff')}</strong>
                      {choiceTradeoff}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
