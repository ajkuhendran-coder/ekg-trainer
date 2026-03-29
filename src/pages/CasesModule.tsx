import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ChevronRight, Check, Star } from 'lucide-react';
import {
  CLINICAL_CASES,
  CASE_CATEGORIES,
  type CaseCategory,
} from '../data/casesContent.ts';
import { getProgress } from '../utils/progress.ts';

type FilterCategory = CaseCategory | 'alle';

export default function CasesModule() {
  const progress = useMemo(() => getProgress(), []);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('alle');
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return CLINICAL_CASES.filter((c) => {
      if (activeCategory !== 'alle' && c.category !== activeCategory)
        return false;
      if (difficultyFilter !== null && c.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [activeCategory, difficultyFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Stethoscope className="w-7 h-7 text-emerald-600" />
          Klinische Fälle
        </h1>
        <p className="text-slate-500 mt-1 text-base">
          Perioperative EKG-Szenarien aus dem anästhesiologischen Alltag.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        <FilterTab
          active={activeCategory === 'alle'}
          onClick={() => setActiveCategory('alle')}
          label="Alle"
        />
        {CASE_CATEGORIES.map((cat) => (
          <FilterTab
            key={cat.id}
            active={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            label={`${cat.icon} ${cat.label}`}
          />
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 mb-6">
        <span className="text-xs text-slate-400 self-center mr-1">
          Schwierigkeit:
        </span>
        {[null, 1, 2, 3].map((d) => (
          <button
            key={d ?? 'all'}
            onClick={() => setDifficultyFilter(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 min-h-[32px] ${
              difficultyFilter === d
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {d === null ? 'Alle' : `${'★'.repeat(d)}${'☆'.repeat(3 - d)}`}
          </button>
        ))}
      </div>

      {/* Cases Grid */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-8">
          Keine Fälle mit diesen Filtern gefunden.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((caseItem) => {
            const bestScore = progress.completedCases[caseItem.id];
            const isDone = bestScore !== undefined;
            const catInfo = CASE_CATEGORIES.find(
              (c) => c.id === caseItem.category,
            );

            return (
              <Link
                key={caseItem.id}
                to={`/faelle/${caseItem.id}`}
                className="card-hover bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 no-underline"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {caseItem.title}
                    </h3>
                    <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {catInfo?.icon} {catInfo?.label}
                    </span>
                  </div>
                  {isDone && (
                    <span className="shrink-0 w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Difficulty Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= caseItem.difficulty
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {caseItem.difficulty === 1
                      ? 'Leicht'
                      : caseItem.difficulty === 2
                        ? 'Mittel'
                        : 'Schwer'}
                  </span>
                </div>

                {/* Best score */}
                {isDone && (
                  <p className="text-xs text-teal-600 font-medium">
                    Beste Punktzahl: {bestScore}%
                  </p>
                )}

                <div className="flex justify-end">
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 min-h-[44px] ${
        active
          ? 'bg-teal-600 text-white shadow-sm'
          : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
      }`}
    >
      {label}
    </button>
  );
}
