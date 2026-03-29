import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { CLINICAL_CASES, CASE_CATEGORIES } from '../data/casesContent.ts';
import { markCaseComplete } from '../utils/progress.ts';
import EkgRenderer from '../components/EkgRenderer.tsx';
import type { EkgPattern } from '../utils/ekgWaveforms.ts';

export default function CaseView() {
  const { caseId } = useParams<{ caseId: string }>();
  const caseData = CLINICAL_CASES.find((c) => c.id === caseId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  const catInfo = useMemo(
    () => CASE_CATEGORIES.find((c) => c.id === caseData?.category),
    [caseData?.category],
  );

  const score = useMemo(() => {
    if (!caseData) return 0;
    let correct = 0;
    caseData.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    return caseData.questions.length > 0
      ? Math.round((correct / caseData.questions.length) * 100)
      : 0;
  }, [answers, caseData]);

  const handleAnswer = useCallback(
    (optIdx: number) => {
      if (revealed[currentQ]) return;
      setAnswers((prev) => ({ ...prev, [currentQ]: optIdx }));
      setRevealed((prev) => ({ ...prev, [currentQ]: true }));
    },
    [currentQ, revealed],
  );

  const handleNext = useCallback(() => {
    if (!caseData) return;
    if (currentQ < caseData.questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      setFinished(true);
      if (caseId) {
        markCaseComplete(caseId, score);
      }
    }
  }, [currentQ, caseData, caseId, score]);

  if (!caseData) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <p className="text-slate-500">Fall nicht gefunden.</p>
        <Link
          to="/faelle"
          className="mt-4 inline-flex items-center gap-1 text-teal-600 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const pi = caseData.patientInfo;
  const vp = caseData.vitalparameter;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
        <Link to="/faelle" className="hover:text-teal-600 transition-colors">
          Fälle
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">{caseData.title}</span>
      </nav>

      {/* Title + Category */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">{caseData.title}</h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {catInfo?.icon} {catInfo?.label}
          </span>
          <span className="text-xs text-slate-400">
            {'★'.repeat(caseData.difficulty)}
            {'☆'.repeat(3 - caseData.difficulty)}
          </span>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Patienteninformationen
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <InfoItem label="Alter" value={`${pi.age} Jahre`} />
          <InfoItem
            label="Geschlecht"
            value={pi.gender === 'M' ? 'Männlich' : 'Weiblich'}
          />
          <InfoItem label="Gewicht" value={`${pi.weight} kg`} />
          <InfoItem label="Größe" value={`${pi.height} cm`} />
        </div>
        {pi.vorerkrankungen.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Vorerkrankungen
            </p>
            <ul className="text-sm text-slate-700 space-y-0.5">
              {pi.vorerkrankungen.map((v, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-300 mt-1">-</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}
        {pi.medikamente.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Medikamente
            </p>
            <ul className="text-sm text-slate-700 space-y-0.5">
              {pi.medikamente.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-300 mt-1">-</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {pi.allergie.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-rose-500 mb-1">
              Allergien
            </p>
            <p className="text-sm text-rose-700">{pi.allergie.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Vital Parameters Monitor */}
      <div className="vital-monitor rounded-xl p-5 mb-4 text-white">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-400" />
          Vitalparameter
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <VitalItem label="HF" value={vp.hf} color="text-green-400" />
          <VitalItem label="RR" value={vp.rr} color="text-red-400" />
          <VitalItem label="SpO2" value={vp.spo2} color="text-cyan-400" />
          {vp.temperatur && (
            <VitalItem
              label="Temp"
              value={vp.temperatur}
              color="text-yellow-400"
            />
          )}
          {vp.etco2 && (
            <VitalItem label="etCO2" value={vp.etco2} color="text-purple-400" />
          )}
        </div>
      </div>

      {/* Scenario */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Klinisches Szenario
        </h3>
        <div
          className="lesson-content text-sm"
          dangerouslySetInnerHTML={{ __html: caseData.scenario }}
        />
      </div>

      {/* EKG Display */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          EKG-Befund
        </h3>
        <div className="overflow-x-auto">
          <EkgRenderer
            pattern={caseData.ekgPattern as EkgPattern}
            width={700}
            height={240}
            showGrid
            showLabel
          />
        </div>
      </div>

      {/* Questions */}
      {!finished ? (
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Frage {currentQ + 1} von {caseData.questions.length}
            </h3>
            <span className="text-xs text-slate-400">
              {Math.round(
                ((currentQ + (revealed[currentQ] ? 1 : 0)) /
                  caseData.questions.length) *
                  100,
              )}
              % abgeschlossen
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {caseData.questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < currentQ
                    ? answers[i] === caseData.questions[i].correctIndex
                      ? 'bg-teal-400'
                      : 'bg-rose-400'
                    : i === currentQ
                      ? 'bg-teal-600'
                      : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <QuestionBlock
            question={caseData.questions[currentQ]}
            qIdx={currentQ}
            userAnswer={answers[currentQ]}
            revealed={!!revealed[currentQ]}
            onAnswer={handleAnswer}
          />

          {revealed[currentQ] && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all duration-200 min-h-[48px]"
              >
                {currentQ < caseData.questions.length - 1
                  ? 'Nächste Frage'
                  : 'Ergebnis anzeigen'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results */
        <div className="space-y-4 mb-6">
          {/* Score */}
          <div
            className={`rounded-xl p-6 text-center ${
              score >= 80
                ? 'bg-teal-50 text-teal-800'
                : score >= 50
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-rose-50 text-rose-800'
            }`}
          >
            <p className="text-4xl font-bold">{score}%</p>
            <p className="text-sm mt-1">
              {score >= 80
                ? 'Hervorragend!'
                : score >= 50
                  ? 'Gut, aber es gibt Verbesserungspotenzial.'
                  : 'Wiederholen Sie den Fall, um sich zu verbessern.'}
            </p>
          </div>

          {/* Explanations for wrong answers */}
          {caseData.questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            if (isCorrect) return null;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-rose-400"
              >
                <p className="text-sm font-medium text-slate-800 mb-1">
                  Frage {i + 1}: {q.question}
                </p>
                <p className="text-sm text-rose-600 mb-1">
                  Ihre Antwort: {q.options[answers[i]]}
                </p>
                <p className="text-sm text-teal-600 mb-1">
                  Richtig: {q.options[q.correctIndex]}
                </p>
                <p className="text-sm text-slate-500">{q.explanation}</p>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Zusammenfassung
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {caseData.zusammenfassung}
            </p>
            {caseData.leitlinienReferenz && (
              <p className="text-xs text-slate-400 mt-3">
                Leitlinienreferenz: {caseData.leitlinienReferenz}
              </p>
            )}
          </div>

          {/* Nav */}
          <div className="flex justify-between">
            <Link
              to="/faelle"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 bg-white shadow-sm hover:shadow-md transition-all duration-200 min-h-[48px] no-underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück zu den Fällen
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helper Components ── */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}

function VitalItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}

function QuestionBlock({
  question,
  qIdx: _qIdx,
  userAnswer,
  revealed,
  onAnswer,
}: {
  question: { question: string; options: string[]; correctIndex: number; explanation: string };
  qIdx: number;
  userAnswer: number | undefined;
  revealed: boolean;
  onAnswer: (idx: number) => void;
}) {
  const isCorrect = userAnswer === question.correctIndex;

  return (
    <div>
      <p className="font-medium text-slate-800 mb-3">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, oIdx) => {
          let optClass =
            'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
          if (revealed) {
            if (oIdx === question.correctIndex) {
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
              onClick={() => onAnswer(oIdx)}
              disabled={revealed}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 min-h-[48px] ${optClass}`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                {revealed && oIdx === question.correctIndex ? (
                  <Check className="w-3.5 h-3.5" />
                ) : revealed && oIdx === userAnswer && !isCorrect ? (
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

      {revealed && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            isCorrect ? 'bg-teal-50 text-teal-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          <p className="font-semibold mb-1">
            {isCorrect ? 'Richtig!' : 'Leider falsch.'}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
