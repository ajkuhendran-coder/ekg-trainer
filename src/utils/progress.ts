// ============================================================================
// progress.ts - LocalStorage-based progress tracking
// ============================================================================

const STORAGE_KEY = 'ekg-trainer-progress';

export interface ExamResult {
  score: number;
  total: number;
  date: string;
}

export interface ProgressData {
  completedLessons: string[]; // "levelId/lessonId"
  completedCases: Record<string, number>; // caseId -> bestScore
  examResults: ExamResult[];
}

function defaultProgress(): ProgressData {
  return {
    completedLessons: [],
    completedCases: {},
    examResults: [],
  };
}

export function getProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      completedLessons: parsed.completedLessons ?? [],
      completedCases: parsed.completedCases ?? {},
      examResults: parsed.examResults ?? [],
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function markLessonComplete(levelId: string, lessonId: string): void {
  const progress = getProgress();
  const key = `${levelId}/${lessonId}`;
  if (!progress.completedLessons.includes(key)) {
    progress.completedLessons.push(key);
    saveProgress(progress);
  }
}

export function markCaseComplete(caseId: string, score: number): void {
  const progress = getProgress();
  const prev = progress.completedCases[caseId] ?? 0;
  if (score > prev) {
    progress.completedCases[caseId] = score;
    saveProgress(progress);
  }
}

export function getExamResults(): ExamResult[] {
  return getProgress().examResults;
}

export function saveExamResult(score: number, total: number, date: string): void {
  const progress = getProgress();
  progress.examResults.push({ score, total, date });
  saveProgress(progress);
}
