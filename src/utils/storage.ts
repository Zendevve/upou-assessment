import {
  AssessmentResultSummary,
  MODULE_SCREEN_IDS,
  ScreenId,
} from '../physics/calculations';
import {
  createEmptyLessonRecord,
  createInitialModuleProgress,
  isLessonId,
  LESSON_IDS,
  LessonId,
  LessonProgressRecord,
  ModuleProgressState,
  reconcileModuleProgress,
  ReflectionRecord,
  SectionBookmark,
} from '../physics/progress';

const STORAGE_KEY = 'physics_everyday_life_module_1_v2';

let memoryFallback: ModuleProgressState | null = null;

export function createInitialProgressState(): ModuleProgressState {
  return createInitialModuleProgress();
}

function isValidScreenId(value: unknown): value is ScreenId {
  return typeof value === 'string' && (MODULE_SCREEN_IDS as readonly string[]).includes(value);
}

function sanitizeAssessmentRecord(raw: unknown): LessonProgressRecord['assessment'] {
  if (!raw || typeof raw !== 'object') {
    return {
      score: null,
      latestScore: null,
      passed: false,
      attempts: 0,
      lastResult: null,
    };
  }
  const obj = raw as Record<string, unknown>;
  const score =
    typeof obj.score === 'number' && Number.isFinite(obj.score) && obj.score >= 0 && obj.score <= 100
      ? Math.round(obj.score)
      : null;
  const latestScore =
    typeof obj.latestScore === 'number' &&
    Number.isFinite(obj.latestScore) &&
    obj.latestScore >= 0 &&
    obj.latestScore <= 100
      ? Math.round(obj.latestScore)
      : score;
  const passed = Boolean(obj.passed);
  const attempts =
    typeof obj.attempts === 'number' && Number.isFinite(obj.attempts) && obj.attempts >= 0
      ? Math.floor(obj.attempts)
      : 0;
  const lastResult =
    obj.lastResult && typeof obj.lastResult === 'object'
      ? (obj.lastResult as AssessmentResultSummary)
      : null;

  return {
    score,
    latestScore,
    passed,
    attempts,
    lastResult,
  };
}

function sanitizeLastVisitedSections(raw: unknown): Partial<Record<ScreenId, SectionBookmark>> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Partial<Record<ScreenId, SectionBookmark>> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!isValidScreenId(key) || !val || typeof val !== 'object') continue;
    const item = val as Record<string, unknown>;
    if (typeof item.sectionId === 'string' && typeof item.sectionLabel === 'string') {
      out[key] = {
        sectionId: item.sectionId,
        sectionLabel: item.sectionLabel,
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : '',
      };
    }
  }
  return out;
}

function sanitizeReflection(raw: unknown): ReflectionRecord {
  if (!raw || typeof raw !== 'object') {
    return { text: '', updatedAt: null, sampleViewed: false };
  }
  const obj = raw as Record<string, unknown>;
  return {
    text: typeof obj.text === 'string' ? obj.text : '',
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : null,
    sampleViewed: Boolean(obj.sampleViewed),
  };
}

export function sanitizeProgressState(raw: unknown): ModuleProgressState {
  const fallback = createInitialProgressState();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const obj = raw as Record<string, unknown>;
  const currentScreen = isValidScreenId(obj.currentScreen) ? obj.currentScreen : 'welcome';
  const rawLessons =
    obj.lessons && typeof obj.lessons === 'object' ? (obj.lessons as Record<string, unknown>) : {};

  const lessons = {} as Record<LessonId, LessonProgressRecord>;

  for (let i = 0; i < LESSON_IDS.length; i++) {
    const id = LESSON_IDS[i];
    const rawRec = rawLessons[id];
    if (!rawRec || typeof rawRec !== 'object') {
      lessons[id] = createEmptyLessonRecord(i === 0);
      continue;
    }
    const recObj = rawRec as Record<string, unknown>;
    const rawActs =
      recObj.activities && typeof recObj.activities === 'object'
        ? (recObj.activities as Record<string, unknown>)
        : {};
    const activities: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(rawActs)) {
      if (v === true) activities[k] = true;
    }

    lessons[id] = {
      activities,
      assessment: sanitizeAssessmentRecord(recObj.assessment),
      completed: Boolean(recObj.completed),
      unlocked: i === 0 ? true : Boolean(recObj.unlocked),
    };
  }

  const assessmentAttempts =
    typeof obj.assessmentAttempts === 'number' &&
    Number.isFinite(obj.assessmentAttempts) &&
    obj.assessmentAttempts >= 0
      ? Math.floor(obj.assessmentAttempts)
      : 0;

  const latestAssessment =
    obj.latestAssessment && typeof obj.latestAssessment === 'object'
      ? (obj.latestAssessment as AssessmentResultSummary)
      : null;

  const bestFinalAssessmentScore =
    typeof obj.bestFinalAssessmentScore === 'number' &&
    Number.isFinite(obj.bestFinalAssessmentScore) &&
    obj.bestFinalAssessmentScore >= 0 &&
    obj.bestFinalAssessmentScore <= 100
      ? Math.round(obj.bestFinalAssessmentScore)
      : latestAssessment?.percentage ?? null;

  const lastActiveLesson =
    typeof obj.lastActiveLesson === 'string' && isLessonId(obj.lastActiveLesson)
      ? obj.lastActiveLesson
      : isLessonId(currentScreen)
      ? currentScreen
      : null;

  return reconcileModuleProgress({
    version: 3,
    currentScreen,
    lastActiveLesson,
    lastVisitedSections: sanitizeLastVisitedSections(obj.lastVisitedSections),
    lessons,
    finalAssessmentUnlocked: Boolean(obj.finalAssessmentUnlocked),
    finalAssessmentCompleted: Boolean(obj.finalAssessmentCompleted),
    finalAssessmentPassed: Boolean(obj.finalAssessmentPassed),
    bestFinalAssessmentScore,
    assessmentAttempts,
    latestAssessment,
    moduleCompleted: Boolean(obj.moduleCompleted),
    reflection: sanitizeReflection(obj.reflection),
  });
}

export function loadProgressState(): ModuleProgressState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return sanitizeProgressState(JSON.parse(serialized));
      }
    }
  } catch {
    // Graceful fallback when localStorage is unavailable or blocked
  }
  return memoryFallback ? sanitizeProgressState(memoryFallback) : createInitialProgressState();
}

export function saveProgressState(state: ModuleProgressState): void {
  const sanitized = sanitizeProgressState(state);
  memoryFallback = sanitized;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch {
    // Graceful fallback when localStorage quota is exceeded or disabled
  }
}

export function resetProgressState(): ModuleProgressState {
  const fresh = createInitialProgressState();
  memoryFallback = fresh;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  return fresh;
}
