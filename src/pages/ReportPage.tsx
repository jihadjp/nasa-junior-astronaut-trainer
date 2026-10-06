// Route /mission/report : Dedicated Post-Mission Debrief & Evaluation Report
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Droplets, 
  Apple, 
  Heart 
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, handleStartSetup } = useMission();
  const { t, formatNum, language } = useLanguage();

  const { missionStatus, failureReason, scores, destination, totalDays, resources, crewWellbeing, completedDecisions } = gameState;
  const isVictory = missionStatus === 'victory';

  const [expandedChain, setExpandedChain] = useState<boolean>(true);

  useEffect(() => {
    if (isVictory) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
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
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center animate-fadeIn">
        {/* Banner Card */}
        <div className="bg-[#0B1222] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
          {/* Status Header */}
          <div className="text-center pb-6 border-b border-slate-800 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
              {isVictory ? (
                <span className="text-emerald-400 border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-4 h-4" /> {t('report.page.victory')}
                </span>
              ) : (
                <span className="text-red-400 border border-red-500/40 bg-red-950/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <XCircle className="w-4 h-4" /> {t('report.page.failed')}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2">
              {isVictory ? `${destLabel} // EXPEDITION COMPLETE` : `${destLabel} // MISSION COMPROMISED`}
            </h1>

            <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed">
              {isVictory
                ? (language === 'bn' 
                    ? `অভিনন্দন! তোমার দল টানা ${formatNum(totalDays)} দিন বিভিন্ন চ্যালেঞ্জ মোকাবিলা করে নিরাপদে বেঁচে থাকতে সক্ষম হয়েছে।`
                    : `Congratulations! Your crew endured all ${totalDays} simulated days through continuous resource balancing.`)
                : (((language === 'bn' && gameState.failureReasonBn) ? gameState.failureReasonBn : failureReason) || (language === 'bn' ? 'জরুরি সম্পদের ঘাটতির কারণে মিশন বাতিল করা হয়েছে।' : 'A critical resource deficit triggered base abandonment.'))}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-[#060B18] p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="p-2">
              <span className="text-slate-500 block text-[10px] uppercase flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                {language === 'bn' ? 'নভোচারী স্বাস্থ্য' : 'Crew Wellbeing'}
              </span>
              <span className="font-bold text-lg text-emerald-400">{formatNum(crewWellbeing)}%</span>
            </div>
            <div className="p-2">
              <span className="text-slate-500 block text-[10px] uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {language === 'bn' ? 'বিদ্যুৎ সঞ্চয়' : 'Power Reserve'}
              </span>
              <span className="font-bold text-lg text-amber-300">
                {formatNum(Math.round((resources.power / resources.powerMax) * 100))}%
              </span>
            </div>
            <div className="p-2">
              <span className="text-slate-500 block text-[10px] uppercase flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                {language === 'bn' ? 'পানি রিজার্ভ' : 'Water Reserve'}
              </span>
              <span className="font-bold text-lg text-blue-300">
                {formatNum(Math.round((resources.water / resources.waterMax) * 100))}%
              </span>
            </div>
            <div className="p-2">
              <span className="text-slate-500 block text-[10px] uppercase flex items-center gap-1">
                <Apple className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'bn' ? 'খাদ্য মজুদ' : 'Food Reserve'}
              </span>
              <span className="font-bold text-lg text-emerald-300">
                {formatNum(Math.round((resources.food / resources.foodMax) * 100))}%
              </span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#101827] via-[#152238] to-[#101827] border border-[#52D6FF]/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                {t('report.grade.label')}
              </span>
              <div className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#52D6FF] to-blue-400">
                {(language === 'bn' && sc.gradeBn) ? sc.gradeBn : sc.grade}
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs font-mono text-slate-400 block">{language === 'bn' ? 'সামগ্রিক স্কোর' : 'OVERALL SCORE'}</span>
              <div className="text-3xl font-display font-extrabold text-white">
                {formatNum(sc.overallScore)}<span className="text-sm font-mono text-slate-400">/১০০</span>
              </div>
            </div>
          </div>

          {/* Visual Causal Timeline: What Happened? */}
          <div className="border border-slate-800 rounded-xl p-4 bg-[#060B18]/60 mb-6">
            <button
              onClick={() => setExpandedChain(prev => !prev)}
              className="w-full flex items-center justify-between text-xs font-mono font-bold text-[#52D6FF] hover:underline"
            >
              <span>{t('report.timeline.title')}</span>
              {expandedChain ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedChain && (
              <div className="mt-4 space-y-3 animate-fadeIn">
                {completedDecisions.length > 0 ? (
                  <div className="space-y-2">
                    {completedDecisions.map((dec, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#0B1222] border border-slate-800 text-xs font-mono flex items-center justify-between">
                        <span className="text-[#52D6FF] font-bold">
                          {language === 'bn' ? `দিন ${formatNum(dec.day)}:` : `DAY ${dec.day}:`}
                        </span>
                        <span className="text-slate-200">{dec.choiceLabel}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-sans italic">
                    {t('report.timeline.empty')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-[#52D6FF]" />
              <span>{t('report.btn.share')}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/mission/replay')}
                className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-900/40 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('report.page.replay')}</span>
              </button>

              <button
                onClick={() => navigate('/learn')}
                className="px-4 py-2.5 rounded-xl bg-sky-950/40 border border-sky-500/40 text-sky-300 hover:bg-sky-900/40 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('report.btn.learn')}</span>
              </button>

              <button
                onClick={() => {
                  handleStartSetup('moon');
                  navigate('/mission');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#52D6FF] hover:bg-[#38BDF8] text-slate-950 font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg"
              >
                <span>{t('report.page.new')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
