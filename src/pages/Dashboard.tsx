import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Stethoscope,
  GraduationCap,
  ChevronRight,
  Award,
  Activity,
  Check,
} from 'lucide-react';
import { getProgress } from '../utils/progress.ts';
import { LEARNING_LEVELS } from '../data/learningContent.ts';
import { CLINICAL_CASES } from '../data/casesContent.ts';

export default function Dashboard() {
  const progress = useMemo(() => getProgress(), []);

  const totalLessons = LEARNING_LEVELS.reduce(
    (sum, lvl) => sum + lvl.lessons.length,
    0,
  );
  const completedLessonCount = progress.completedLessons.length;
  const completedCaseCount = Object.keys(progress.completedCases).length;
  const totalCases = CLINICAL_CASES.length;

  const avgScore = useMemo(() => {
    const scores = Object.values(progress.completedCases);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [progress.completedCases]);

  const examCount = progress.examResults.length;
  const lastExam =
    progress.examResults.length > 0
      ? progress.examResults[progress.examResults.length - 1]
      : null;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Willkommen zum EKG-Trainer
        </h1>
        <p className="text-slate-500 mt-1 text-base">
          Systematisch EKG-Diagnostik lernen -- speziell für die Anästhesie.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Lektionen"
          value={`${completedLessonCount}/${totalLessons}`}
          icon={<BookOpen className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          label="Fälle gelöst"
          value={`${completedCaseCount}/${totalCases}`}
          icon={<Stethoscope className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          label="Ø Punktzahl"
          value={avgScore > 0 ? `${avgScore}%` : '--'}
          icon={<Award className="w-5 h-5 text-teal-600" />}
        />
        <StatCard
          label="Prüfungen"
          value={String(examCount)}
          icon={<GraduationCap className="w-5 h-5 text-teal-600" />}
        />
      </div>

      {/* Module Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <ModuleCard
          to="/lernen"
          title="Lernen"
          description="Theorie, EKG-Grundlagen und klinische Rhythmusdiagnostik in 3 Leveln"
          icon={<BookOpen className="w-7 h-7" />}
          color="bg-blue-50 text-blue-700"
          progress={
            totalLessons > 0 ? (completedLessonCount / totalLessons) * 100 : 0
          }
        />
        <ModuleCard
          to="/faelle"
          title="Klinische Fälle"
          description="Realistische Fallszenarien aus dem anästhesiologischen Alltag"
          icon={<Stethoscope className="w-7 h-7" />}
          color="bg-emerald-50 text-emerald-700"
          progress={
            totalCases > 0 ? (completedCaseCount / totalCases) * 100 : 0
          }
        />
        <ModuleCard
          to="/pruefung"
          title="Prüfung"
          description="Testen Sie Ihr Wissen mit zufälligen EKG-Diagnosen und Therapiefragen"
          icon={<GraduationCap className="w-7 h-7" />}
          color="bg-purple-50 text-purple-700"
          progress={null}
          extra={
            lastExam
              ? `Letztes Ergebnis: ${lastExam.score}/${lastExam.total}`
              : 'Noch keine Prüfung absolviert'
          }
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          Zuletzt gelernt
        </h2>
        {completedLessonCount === 0 && completedCaseCount === 0 ? (
          <p className="text-slate-400 text-sm">
            Noch keine Aktivität. Starten Sie mit dem Lernmodul!
          </p>
        ) : (
          <ul className="space-y-2">
            {progress.completedLessons.slice(-5).reverse().map((key) => {
              const [levelId, lessonId] = key.split('/');
              const level = LEARNING_LEVELS.find((l) => l.id === levelId);
              const lesson = level?.lessons.find((l) => l.id === lessonId);
              return (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <Check className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="truncate">
                    {lesson?.title ?? key}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ── Stat Card ── */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-teal-50 shrink-0">{icon}</div>
      <div>
        <p className="text-lg font-bold text-slate-900 leading-tight">
          {value}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/* ── Module Card ── */

function ModuleCard({
  to,
  title,
  description,
  icon,
  color,
  progress,
  extra,
}: {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  progress: number | null;
  extra?: string;
}) {
  return (
    <Link
      to={to}
      className="card-hover bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 no-underline"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      {progress !== null && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Fortschritt</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {extra && <p className="text-xs text-slate-400">{extra}</p>}
    </Link>
  );
}
