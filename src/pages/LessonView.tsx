import { useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { LEARNING_LEVELS } from '../data/learningContent.ts';
import { markLessonComplete, getProgress } from '../utils/progress.ts';
import EkgRenderer from '../components/EkgRenderer.tsx';
import type { EkgPattern } from '../utils/ekgWaveforms.ts';

export default function LessonView() {
  const { levelId, lessonId } = useParams<{
    levelId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const level = LEARNING_LEVELS.find((l) => l.id === levelId);
  const lessonIdx = level?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const lesson = level?.lessons[lessonIdx];

  const progress = useMemo(() => getProgress(), []);
  const isAlreadyDone = progress.completedLessons.includes(
    `${levelId}/${lessonId}`,
  );

  // Quiz state
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [allCorrect, setAllCorrect] = useState(false);

  const handleAnswer = useCallback(
    (qIdx: number, optIdx: number) => {
      if (showResults[qIdx]) return; // already answered
      setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
      setShowResults((prev) => ({ ...prev, [qIdx]: true }));

      // Check if all questions are now answered
      if (lesson) {
        const newAnswers = { ...answers, [qIdx]: optIdx };
        const allAnswered = lesson.quiz.every(
          (_, i) => newAnswers[i] !== undefined,
        );
        if (allAnswered) {
          const correct = lesson.quiz.every(
            (q, i) => newAnswers[i] === q.correctIndex,
          );
          setAllCorrect(correct);
          if (levelId && lessonId) {
            markLessonComplete(levelId, lessonId);
          }
        }
      }
    },
    [answers, showResults, lesson, levelId, lessonId],
  );

  if (!level || !lesson) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <p className="text-slate-500">Lektion nicht gefunden.</p>
        <Link
          to="/lernen"
          className="mt-4 inline-flex items-center gap-1 text-teal-600 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  // Next lesson
  const nextLesson = level.lessons[lessonIdx + 1];
  const nextLevelIdx = LEARNING_LEVELS.findIndex((l) => l.id === levelId);
  const nextLevel =
    !nextLesson && nextLevelIdx >= 0
      ? LEARNING_LEVELS[nextLevelIdx + 1]
      : null;

  const quizComplete = lesson.quiz.length > 0 && lesson.quiz.every((_, i) => showResults[i]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
        <Link to="/lernen" className="hover:text-teal-600 transition-colors">
          Lernen
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-500">{level.title}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">{lesson.title}</span>
      </nav>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-slate-500 mt-1">{lesson.subtitle}</p>
        {isAlreadyDone && (
          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" />
            Abgeschlossen
          </span>
        )}
      </div>

      {/* Theory Content */}
      <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-6">
        <div
          className="lesson-content"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </div>

      {/* EKG Display */}
      {lesson.ekgPattern && (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            EKG-Beispiel
          </h3>
          <div className="overflow-x-auto">
            <EkgRenderer
              pattern={lesson.ekgPattern as EkgPattern}
              width={700}
              height={220}
              showGrid
              showLabel
            />
          </div>
        </div>
      )}

      {/* Key Points */}
      {lesson.keyPoints.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-teal-800 uppercase tracking-wide mb-3">
            Wichtige Punkte
          </h3>
          <ul className="space-y-2">
            {lesson.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-teal-900">
                <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz Section */}
      {lesson.quiz.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Wissensüberprüfung
          </h3>

          <div className="space-y-6">
            {lesson.quiz.map((q, qIdx) => {
              const answered = showResults[qIdx];
              const userAnswer = answers[qIdx];
              const isCorrect = userAnswer === q.correctIndex;

              return (
                <div key={qIdx} className="border border-slate-100 rounded-lg p-4">
                  <p className="font-medium text-slate-800 mb-3 text-sm">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      let optClass =
                        'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100';

                      if (answered) {
                        if (oIdx === q.correctIndex) {
                          optClass =
                            'border-teal-400 bg-teal-50 text-teal-800';
                        } else if (
                          oIdx === userAnswer &&
                          !isCorrect
                        ) {
                          optClass =
                            'border-rose-400 bg-rose-50 text-rose-800';
                        } else {
                          optClass =
                            'border-slate-100 bg-slate-50 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(qIdx, oIdx)}
                          disabled={answered}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 min-h-[48px] ${optClass}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                            {answered && oIdx === q.correctIndex ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : answered &&
                              oIdx === userAnswer &&
                              !isCorrect ? (
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

                  {answered && (
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
                </div>
              );
            })}
          </div>

          {/* Completion message */}
          {quizComplete && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                allCorrect
                  ? 'bg-teal-50 text-teal-800'
                  : 'bg-amber-50 text-amber-800'
              }`}
            >
              <p className="font-semibold">
                {allCorrect
                  ? 'Hervorragend! Alle Fragen richtig beantwortet.'
                  : 'Quiz abgeschlossen. Lektion als bearbeitet markiert.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>

        {nextLesson ? (
          <Link
            to={`/lernen/${levelId}/${nextLesson.id}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] no-underline"
          >
            Nächste Lektion
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : nextLevel ? (
          <Link
            to={`/lernen/${nextLevel.id}/${nextLevel.lessons[0]?.id}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] no-underline"
          >
            Nächstes Level starten
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/lernen"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] no-underline"
          >
            Zur Übersicht
          </Link>
        )}
      </div>
    </div>
  );
}
