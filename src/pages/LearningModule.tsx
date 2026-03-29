import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Check, BookOpen } from 'lucide-react';
import { LEARNING_LEVELS } from '../data/learningContent.ts';
import { getProgress } from '../utils/progress.ts';

export default function LearningModule() {
  const progress = useMemo(() => getProgress(), []);
  const [openLevel, setOpenLevel] = useState<string | null>(
    LEARNING_LEVELS[0]?.id ?? null,
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-blue-600" />
          Lernmodule
        </h1>
        <p className="text-slate-500 mt-1 text-base">
          Systematisch vom Grundlagen-EKG bis zur perioperativen
          Rhythmusdiagnostik.
        </p>
      </div>

      <div className="space-y-4">
        {LEARNING_LEVELS.map((level) => {
          const isOpen = openLevel === level.id;
          const completedInLevel = level.lessons.filter((les) =>
            progress.completedLessons.includes(`${level.id}/${les.id}`),
          ).length;
          const pct =
            level.lessons.length > 0
              ? (completedInLevel / level.lessons.length) * 100
              : 0;

          return (
            <div
              key={level.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Level Header */}
              <button
                onClick={() =>
                  setOpenLevel(isOpen ? null : level.id)
                }
                className="w-full flex items-center gap-4 p-5 text-left transition-colors duration-200 hover:bg-slate-50 min-h-[56px]"
              >
                <span className="text-2xl shrink-0">{level.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {level.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                    {level.description}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {completedInLevel}/{level.lessons.length}
                    </span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="border-t border-slate-100">
                  {level.lessons.map((lesson, idx) => {
                    const done = progress.completedLessons.includes(
                      `${level.id}/${lesson.id}`,
                    );
                    return (
                      <Link
                        key={lesson.id}
                        to={`/lernen/${level.id}/${lesson.id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-50 last:border-b-0 no-underline"
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                            done
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {done ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {lesson.subtitle}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
