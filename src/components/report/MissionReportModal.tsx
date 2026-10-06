// Mission Report Modal: Complete debrief with multi-factor radar scores and 30-day timeline

import React from 'react';
import type { SimulationState } from '../../types/game';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { sound } from '../../sound/audioEngine';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';

interface MissionReportModalProps {
  state: SimulationState;
  onReplayBranch: () => void;
  onNewMission: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({
  state,
  onReplayBranch,
  onNewMission
}) => {
  const { t, formatNum, language } = useLanguage();
  const { missionStatus, failureReason, scores, timeline, destination, totalDays } = state;
  const isVictory = missionStatus === 'victory';

  React.useEffect(() => {
    if (isVictory) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      sound.playPowerDown();
    }
  }, [isVictory]);

  const sc = scores || {
    survivalScore: 60,
    efficiencyScore: 70,
    scienceScore: 50,
    resilienceScore: 65,
    learningScore: 75,
    overallScore: 64,
    grade: 'SURVIVOR (C)',
    feedback: ['Mission concluded with acceptable data return.']
  };

  const destLabel = destination === 'moon' 
    ? (language === 'bn' ? 'চাঁদ' : 'MOON')
    : (language === 'bn' ? 'মঙ্গল' : 'MARS');

  const handleShare = () => {
    sound.playClick();
    if (navigator.clipboard) {
      const shareText = language === 'bn'
        ? `🚀 আমি আউটপোস্ট (Junior Astronaut Mission Trainer)-এ ${destLabel} সফলভাবে সম্পন্ন করেছি!\nস্কোর: ${formatNum(sc.overallScore)}/১০০ [${sc.grade}]\nতুমি কি মহাকাশ ঘাঁটি নিরাপদে রাখতে পারবে?`
        : `🚀 I completed the ${destination.toUpperCase()} Outpost Expedition in OUTPOST: Junior Astronaut Mission Trainer!\nScore: ${sc.overallScore}/100 [${sc.grade}]\nCan you keep the base alive?`;
      navigator.clipboard.writeText(shareText);
      alert(language === 'bn' ? 'মিশন মূল্যায়ন রিপোর্ট ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Mission Debrief copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0B1222] border border-[#52D6FF]/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="text-center pb-4 border-b border-slate-800 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 border shadow-sm">
            {isVictory ? (
              <span className="text-emerald-400 border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('report.victory.badge')}
              </span>
            ) : (
              <span className="text-red-400 border-red-500/40 bg-red-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {t('report.failed.badge')}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {isVictory ? t('report.victory.title', { dest: destLabel }) : t('report.failed.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isVictory
              ? (language === 'bn' 
                  ? `তোমার টিম টানা ${formatNum(totalDays)} দিন বিভিন্ন চ্যালেঞ্জ মোকাবিলা করে সফলভাবে টিকে থেকেছে!`
                  : `Your crew endured all ${totalDays} simulated days through continuous resource trade-offs.`)
              : (((language === 'bn' && state.failureReasonBn) ? state.failureReasonBn : failureReason) || (language === 'bn' ? 'জরুরি সম্পদের ঘাটতির কারণে মিশন বাতিল করা হয়েছে।' : 'A critical resource deficit triggered base abandonment.'))}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#101827] via-[#152238] to-[#101827] border border-[#52D6FF]/30 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              {t('report.grade.label')}
            </span>
            <div className="text-xl sm:text-2xl font-display font-bold text-[#52D6FF] flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              {(language === 'bn' && sc.gradeBn) ? sc.gradeBn : sc.grade}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              {t('report.score.label')}
            </span>
            <div className="text-4xl font-mono font-bold text-white tracking-tight">
              {formatNum(sc.overallScore)} <span className="text-slate-500 text-lg">/ {formatNum(100)}</span>
            </div>
          </div>
        </div>

        {/* 5-Factor Score Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px] mb-1">{t('report.survival')}</span>
            <span className="text-lg font-bold text-rose-400">{formatNum(sc.survivalScore)}</span>
            <span className="text-[10px] text-slate-500 block">{t('report.survival.sub')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px] mb-1">{t('report.efficiency')}</span>
            <span className="text-lg font-bold text-[#52D6FF]">{formatNum(sc.efficiencyScore)}</span>
            <span className="text-[10px] text-slate-500 block">{t('report.efficiency.sub')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px] mb-1">{t('report.science')}</span>
            <span className="text-lg font-bold text-purple-400">{formatNum(sc.scienceScore)}</span>
            <span className="text-[10px] text-slate-500 block">{t('report.science.sub')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px] mb-1">{t('report.resilience')}</span>
            <span className="text-lg font-bold text-amber-400">{formatNum(sc.resilienceScore)}</span>
            <span className="text-[10px] text-slate-500 block">{t('report.resilience.sub')}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] mb-1">{t('report.learning')}</span>
            <span className="text-lg font-bold text-emerald-400">{formatNum(sc.learningScore)}</span>
            <span className="text-[10px] text-slate-500 block">{t('report.learning.sub')}</span>
          </div>
        </div>

        {/* 30-Day Mission Timeline Flow */}
        <div className="mb-5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
            {t('report.timeline')}
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-lg bg-[#060B18] border border-slate-800 text-xs font-mono">
            {timeline
              .filter(t => t.day % 4 === 0 || t.isCrisis || t.day === 1 || t.day === totalDays)
              .map(t => (
                <div key={t.day} className="flex items-start justify-between gap-2 p-1.5 rounded hover:bg-[#101827]">
                  <span className="text-[#52D6FF] font-bold shrink-0">
                    {language === 'bn' ? `দিন ${formatNum(t.day)}:` : `DAY ${t.day}:`}
                  </span>
                  <span className="text-slate-300 flex-1 truncate">{t.highlight}</span>
                  <span className="text-slate-500 text-[10px] shrink-0">
                    O₂ {formatNum(t.oxygen)}kg | H₂O {formatNum(t.water)}L
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Feedback bullets */}
        {((language === 'bn' && sc.feedbackBn ? sc.feedbackBn : sc.feedback).length > 0) && (
          <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200/90 mb-5 space-y-1">
            {(language === 'bn' && sc.feedbackBn ? sc.feedbackBn : sc.feedback).map((f, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-[#52D6FF]">↳</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onReplayBranch}
            className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('report.btn.replay')}
          </button>

          <button
            onClick={onNewMission}
            className="py-2.5 px-4 rounded-xl bg-[#52D6FF] hover:bg-[#38BDF8] text-slate-950 font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {t('report.btn.new')}
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('report.btn.share')}
          </button>
        </div>
      </div>
    </div>
  );
};
