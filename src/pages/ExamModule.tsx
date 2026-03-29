import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Play,
  RotateCcw,
  Clock,
  Check,
  X,
  ChevronRight,
  Award,
  BarChart3,
} from 'lucide-react';
import { ALL_PATTERNS, type EkgPattern } from '../utils/ekgWaveforms.ts';
import { CLINICAL_CASES } from '../data/casesContent.ts';
import { getExamResults, saveExamResult } from '../utils/progress.ts';
import EkgRenderer from '../components/EkgRenderer.tsx';

// ── German names for each EKG pattern ──

const PATTERN_NAMES: Record<string, string> = {
  normal_sinus: 'Normaler Sinusrhythmus',
  sinus_bradycardia: 'Sinusbradykardie',
  sinus_tachycardia: 'Sinustachykardie',
  afib: 'Vorhofflimmern',
  aflutter: 'Vorhofflattern',
  svt: 'Supraventrikuläre Tachykardie',
  vt: 'Ventrikuläre Tachykardie',
  vfib: 'Kammerflimmern',
  av_block_1: 'AV-Block I. Grades',
  av_block_2_type1: 'AV-Block II. Grades Typ Wenckebach',
  av_block_2_type2: 'AV-Block II. Grades Typ Mobitz',
  av_block_3: 'AV-Block III. Grades (totaler Block)',
  lbbb: 'Linksschenkelblock',
  rbbb: 'Rechtsschenkelblock',
  stemi_anterior: 'STEMI (Vorderwand)',
  stemi_inferior: 'STEMI (Hinterwand)',
  hyperkalemia: 'Hyperkaliämie',
  hypokalemia: 'Hypokaliämie',
  long_qt: 'Long-QT-Syndrom',
  pea: 'Pulslose elektrische Aktivität (PEA)',
  asystole: 'Asystolie',
  wpw: 'WPW-Syndrom (Wolff-Parkinson-White)',
  pericarditis: 'Perikarditis',
  pe: 'Lungenembolie (Rechtsherzbelastung)',
  digitalis: 'Digitaliseffekt',
  torsade: 'Torsade de Pointes',
};

// ── Exam question types ──

interface ExamQuestion {
  type: 'ekg_diagnosis' | 'therapy';
  pattern?: EkgPattern;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type ExamPhase = 'config' | 'running' | 'results';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateExamQuestions(count: number): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  // EKG diagnosis questions from patterns
  const patterns = shuffleArray([...ALL_PATTERNS]);
  for (const pattern of patterns) {
    if (questions.length >= count) break;

    const correctName = PATTERN_NAMES[pattern];
    if (!correctName) continue;

    // Pick 3 random wrong answers
    const otherNames = Object.entries(PATTERN_NAMES)
      .filter(([k]) => k !== pattern)
      .map(([, v]) => v);
    const wrongOptions = shuffleArray(otherNames).slice(0, 3);
    const allOptions = shuffleArray([correctName, ...wrongOptions]);

    questions.push({
      type: 'ekg_diagnosis',
      pattern,
      question: 'Welche Diagnose zeigt dieses EKG?',
      options: allOptions,
      correctIndex: allOptions.indexOf(correctName),
      explanation: `Das EKG zeigt typische Merkmale für: ${correctName}.`,
    });
  }

  // Add therapy questions from clinical cases
  const caseQuestions = shuffleArray(
    CLINICAL_CASES.flatMap((c) =>
      c.questions.map((q) => ({
        type: 'therapy' as const,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })),
    ),
  );

  for (const q of caseQuestions) {
    if (questions.length >= count) break;
    questions.push(q);
  }

  return shuffleArray(questions).slice(0, count);
}

export default function ExamModule() {
  const [phase, setPhase] = useState<ExamPhase>('config');
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pastResults = useMemo(() => getExamResults(), []);

  // Timer
  useEffect(() => {
    if (phase === 'running' && timeLimit && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase('results');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, timeLimit, timeLeft]);

  const startExam = useCallback(() => {
    const qs = generateExamQuestions(numQuestions);
    setQuestions(qs);
    setCurrentQ(0);
    setAnswers({});
    setRevealed({});
    setTimeLeft(numQuestions * 60); // 1 min per question
    setPhase('running');
  }, [numQuestions]);

  const handleAnswer = useCallback(
    (optIdx: number) => {
      if (revealed[currentQ]) return;
      setAnswers((prev) => ({ ...prev, [currentQ]: optIdx }));
      setRevealed((prev) => ({ ...prev, [currentQ]: true }));
    },
    [currentQ, revealed],
  );

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('results');
    }
  }, [currentQ, questions.length]);

  // Calculate score
  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    return correct;
  }, [answers, questions]);

  // Save result when phase changes to results
  useEffect(() => {
    if (phase === 'results' && questions.length > 0) {
      saveExamResult(score, questions.length, new Date().toISOString());
    }
  }, [phase, score, questions.length]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── CONFIG PHASE ──
  if (phase === 'config') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-purple-600" />
            Prüfungsmodus
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Testen Sie Ihr EKG-Wissen unter realistischen Bedingungen.
          </p>
        </div>

        {/* Config Card */}
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Prüfung konfigurieren
          </h3>

          {/* Number of questions */}
          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Anzahl der Fragen
            </label>
            <div className="flex gap-3">
              {[10, 20, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[48px] ${
                    numQuestions === n
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {n} Fragen
                </button>
              ))}
            </div>
          </div>

          {/* Time limit toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setTimeLimit(!timeLimit)}
                className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
                  timeLimit ? 'bg-purple-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    timeLimit ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Zeitlimit
                </span>
                <p className="text-xs text-slate-400">
                  {numQuestions} Minuten (1 Minute pro Frage)
                </p>
              </div>
            </label>
          </div>

          {/* Start Button */}
          <button
            onClick={startExam}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-200 min-h-[52px]"
          >
            <Play className="w-5 h-5" />
            Prüfung starten
          </button>
        </div>

        {/* Past results */}
        {pastResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Bisherige Ergebnisse
            </h3>
            <div className="space-y-2">
              {pastResults
                .slice()
                .reverse()
                .slice(0, 10)
                .map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Award
                          className={`w-5 h-5 ${
                            pct >= 80
                              ? 'text-teal-500'
                              : pct >= 50
                                ? 'text-amber-500'
                                : 'text-rose-400'
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {r.score}/{r.total} ({pct}%)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(r.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── RUNNING PHASE ──
  if (phase === 'running') {
    const q = questions[currentQ];
    const isRevealed = !!revealed[currentQ];
    const userAnswer = answers[currentQ];
    const isCorrect = userAnswer === q.correctIndex;

    return (
      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">
            Frage {currentQ + 1} / {questions.length}
          </span>
          {timeLimit && (
            <span
              className={`flex items-center gap-1 text-sm font-mono font-semibold ${
                timeLeft < 60 ? 'text-rose-500' : 'text-slate-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQ + (isRevealed ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* EKG display for diagnosis questions */}
        {q.type === 'ekg_diagnosis' && q.pattern && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="overflow-x-auto">
              <EkgRenderer
                pattern={q.pattern}
                width={700}
                height={220}
                showGrid
                showLabel
              />
            </div>
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6">
          <p className="font-semibold text-slate-900 mb-4">{q.question}</p>

          <div className="space-y-2">
            {q.options.map((opt, oIdx) => {
              let optClass =
                'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
              if (isRevealed) {
                if (oIdx === q.correctIndex) {
                  optClass = 'border-teal-400 bg-teal-50 text-teal-800';
                } else if (oIdx === userAnswer && !isCorrect) {
                  optClass = 'border-rose-400 bg-rose-50 text-rose-800';
                } else {
                  optClass = 'border-slate-100 bg-slate-50 text-slate-400';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(oIdx)}
                  disabled={isRevealed}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 min-h-[48px] ${optClass}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                    {isRevealed && oIdx === q.correctIndex ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : isRevealed && oIdx === userAnswer && !isCorrect ? (
                      <X className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + oIdx)
                    )}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${
                isCorrect
                  ? 'bg-teal-50 text-teal-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
            >
              <p className="font-semibold mb-1">
                {isCorrect ? 'Richtig!' : 'Leider falsch.'}
              </p>
              <p>{q.explanation}</p>
            </div>
          )}

          {isRevealed && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all duration-200 min-h-[48px]"
              >
                {currentQ < questions.length - 1
                  ? 'Nächste Frage'
                  : 'Ergebnis anzeigen'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS PHASE ──
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Prüfungsergebnis</h1>
      </div>

      {/* Score Circle */}
      <div
        className={`mx-auto w-40 h-40 rounded-full flex flex-col items-center justify-center mb-6 ${
          pct >= 80
            ? 'bg-teal-50 text-teal-700'
            : pct >= 50
              ? 'bg-amber-50 text-amber-700'
              : 'bg-rose-50 text-rose-700'
        }`}
      >
        <span className="text-4xl font-bold">{pct}%</span>
        <span className="text-sm">
          {score}/{questions.length} richtig
        </span>
      </div>

      <p className="text-center text-slate-500 mb-6">
        {pct >= 80
          ? 'Ausgezeichnet! Sie beherrschen die EKG-Diagnostik sehr gut.'
          : pct >= 50
            ? 'Gutes Ergebnis. Wiederholen Sie die Themen, bei denen Sie unsicher waren.'
            : 'Mehr Übung nötig. Nutzen Sie das Lernmodul und die klinischen Fälle.'}
      </p>

      {/* Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Auswertung
        </h3>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const correct = answers[i] === q.correctIndex;
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
              >
                {correct ? (
                  <Check className="w-5 h-5 text-teal-500 shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">
                    {q.type === 'ekg_diagnosis' && q.pattern
                      ? PATTERN_NAMES[q.pattern] ?? q.pattern
                      : q.question}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setPhase('config')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />
          Neue Prüfung
        </button>
        <button
          onClick={startExam}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px]"
        >
          <Play className="w-4 h-4" />
          Wiederholen
        </button>
      </div>
    </div>
  );
}
