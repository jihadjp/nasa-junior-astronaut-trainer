import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  User
} from 'lucide-react';

interface Question {
  id: string;
  qKey: 'quiz.q1' | 'quiz.q2' | 'quiz.q3' | 'quiz.q4';
  options: Array<{
    textKey: string;
    isCorrect: boolean;
  }>;
  explanationKey: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    qKey: 'quiz.q1',
    options: [
      { textKey: 'quiz.q1.o1', isCorrect: true },
      { textKey: 'quiz.q1.o2', isCorrect: false },
      { textKey: 'quiz.q1.o3', isCorrect: false }
    ],
    explanationKey: 'quiz.q1.exp'
  },
  {
    id: 'q2',
    qKey: 'quiz.q2',
    options: [
      { textKey: 'quiz.q2.o1', isCorrect: true },
      { textKey: 'quiz.q2.o2', isCorrect: false },
      { textKey: 'quiz.q2.o3', isCorrect: false }
    ],
    explanationKey: 'quiz.q2.exp'
  },
  {
    id: 'q3',
    qKey: 'quiz.q3',
    options: [
      { textKey: 'quiz.q3.o1', isCorrect: true },
      { textKey: 'quiz.q3.o2', isCorrect: false },
      { textKey: 'quiz.q3.o3', isCorrect: false }
    ],
    explanationKey: 'quiz.q3.exp'
  },
  {
    id: 'q4',
    qKey: 'quiz.q4',
    options: [
      { textKey: 'quiz.q4.o1', isCorrect: true },
      { textKey: 'quiz.q4.o2', isCorrect: false },
      { textKey: 'quiz.q4.o3', isCorrect: false }
    ],
    explanationKey: 'quiz.q4.exp'
  }
];

export const CadetQuizCertificate: React.FC = () => {
  const { t, formatNum, language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [cadetName, setCadetName] = useState<string>(language === 'bn' ? 'ক্যাডেট কমান্ডার' : 'Cadet Commander');

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const chosen = currentQ.options[selectedOption];
    if (chosen.isCorrect) {
      sound.playSuccess();
      setScore(prev => prev + 1);
    } else {
      sound.playWarning();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const handleRetake = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {!isQuizComplete ? (
        /* QUIZ CARD */
        <div className="p-6 sm:p-8 rounded-2xl bg-[#060B18] border border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-[#52D6FF] uppercase tracking-wider block mb-1">
                {t('quiz.badge')} // {language === 'bn' ? `প্রশ্ন ${formatNum(currentIdx + 1)} / ${formatNum(QUESTIONS.length)}` : `QUESTION ${currentIdx + 1} OF ${QUESTIONS.length}`}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                {t('quiz.title')}
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#101827] border border-slate-700 font-mono text-xs text-[#52D6FF] font-bold">
              {t('quiz.score', { score: formatNum(score), total: formatNum(QUESTIONS.length) })}
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-xl bg-[#0B1222] border border-slate-700/60">
            <h3 className="text-base sm:text-lg font-sans font-medium text-white leading-relaxed">
              {t(currentQ.qKey)}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-[#101827] hover:bg-[#152238] border-slate-800 text-slate-200';

              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-lg shadow-emerald-950/50';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-[#52D6FF]/15 border-[#52D6FF] text-[#52D6FF] font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-sans flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#060B18] border border-slate-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{t(opt.textKey as any)}</span>
                  </span>

                  {isAnswerSubmitted && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-[#101827] border-l-4 border-[#52D6FF] text-xs sm:text-sm text-slate-300 font-sans leading-relaxed animate-fadeIn">
              <span className="font-bold text-[#52D6FF] font-mono block mb-1">
                {language === 'bn' ? 'বৈজ্ঞানিক ব্যাখ্যা:' : 'SCIENTIFIC RATIONALE:'}
              </span>
              {t(currentQ.explanationKey as any)}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-[#52D6FF] hover:bg-[#40c0e8] disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-display font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#52D6FF]/20"
              >
                {t('quiz.submit')}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20"
              >
                {currentIdx < QUESTIONS.length - 1 ? t('quiz.next') : t('quiz.finish')}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* OFFICIAL NASA CERTIFICATE VIEW */
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar (Do not print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-[#101827] border border-slate-800 print:hidden">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#52D6FF] shrink-0" />
                <label className="text-xs font-mono text-slate-300">
                  {language === 'bn' ? 'তোমার নাম লিখো:' : 'Enter Cadet Name:'}
                </label>
              </div>
              <input
                type="text"
                value={cadetName}
                onChange={(e) => setCadetName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#060B18] border border-slate-700 text-white font-mono text-xs focus:border-[#52D6FF] outline-none w-full xs:w-auto"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#52D6FF] text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 hover:bg-[#40c0e8] transition-all shadow-lg shadow-[#52D6FF]/20"
              >
                <Printer className="w-4 h-4" />
                <span>{t('cert.print')}</span>
              </button>

              <button
                onClick={handleRetake}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#060B18] border border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('quiz.retake')}</span>
              </button>
            </div>
          </div>

          {/* Printable Certificate Canvas */}
          <div className="p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0B1528] via-[#070D1B] to-[#040813] border-2 sm:border-4 border-[#52D6FF]/60 shadow-2xl text-center relative overflow-hidden print:p-8 print:border-2 print:border-black print:bg-white print:text-black">
            {/* Holographic Watermark / Seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#52D6FF]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Seal */}
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#101E36] border-2 border-[#52D6FF] flex items-center justify-center text-[#52D6FF] shadow-lg shadow-[#52D6FF]/20">
                <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>

            {/* Title */}
            <p className="text-[11px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#52D6FF] uppercase font-bold mb-1.5 sm:mb-2">
              {t('cert.subtitle')}
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-wider mb-3 sm:mb-4">
              {t('cert.title')}
            </h1>

            <p className="text-xs sm:text-sm font-sans text-slate-400 mb-4 sm:mb-6 max-w-lg mx-auto">
              {t('cert.presented')}
            </p>

            {/* Cadet Name Box */}
            <div className="inline-block px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-[#101827]/90 border-2 border-[#52D6FF] text-xl sm:text-3xl md:text-4xl font-display font-black text-[#52D6FF] tracking-wide shadow-xl mb-4 sm:mb-6 max-w-full break-words">
              {cadetName || 'CADET COMMANDER'}
            </div>

            {/* Body Text */}
            <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8">
              {t('cert.body')}
            </p>

            {/* Specialist Badges Section */}
            <div className="mb-6 sm:mb-8">
              <p className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                {t('cert.badges')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#060B18] border border-emerald-500/50 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-emerald-300 shadow-sm">
                  <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>ECLSS Specialist</span>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#060B18] border border-amber-500/50 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-amber-300 shadow-sm">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span>Solar Architect</span>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#060B18] border border-purple-500/50 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-purple-300 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                  <span>Radiation Officer</span>
                </div>
              </div>
            </div>

            {/* Footer with date & official signatures */}
            <div className="pt-4 sm:pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-slate-400 text-center sm:text-left">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">{t('cert.date')}:</span>
                <span className="text-white font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="text-center">
                <span className="text-emerald-400 font-bold block">{t('cert.rank')}</span>
                <span className="text-[10px] text-slate-500">SCORE: {formatNum(score)} / {formatNum(QUESTIONS.length)} ({Math.round((score/QUESTIONS.length)*100)}%)</span>
              </div>
              <div className="sm:text-right">
                <span className="block text-[10px] text-slate-500 uppercase">VERIFIED BY:</span>
                <span className="text-[#52D6FF] font-bold">NASA Space Apps 2026 // Outpost Evaluator</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
