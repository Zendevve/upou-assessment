import {
  AssessmentResultSummary,
  FORMATIVE_MASTERY_THRESHOLD_PERCENT,
  MODULE_SCREEN_IDS,
  ScreenId,
} from './calculations';

export const LESSON_IDS = [
  'lesson-1',
  'lesson-2',
  'lesson-3',
  'lesson-4',
  'lesson-5',
] as const;

export type LessonId = (typeof LESSON_IDS)[number];

export const LOCKED_LESSON_MESSAGE =
  'Complete the previous lesson and pass its assessment to unlock this lesson.';

export const LOCKED_COMPLETION_MESSAGE =
  'Complete all 5 lessons and pass the Final Module Assessment (70% or higher) to unlock the Module Completion summary.';

export const LESSON_PASSING_THRESHOLD_PERCENT = 70;

export interface ActivityRequirementMeta {
  id: string;
  label: string;
}

export const LESSON_REQUIREMENTS: Record<
  LessonId,
  {
    requiredActivities: ActivityRequirementMeta[];
    nextScreenId: ScreenId;
    nextScreenLabel: string;
  }
> = {
  'lesson-1': {
    requiredActivities: [
      { id: 'net-force-calculator', label: 'Net Force Calculator (create both a balanced and an unbalanced case)' },
      { id: 'lesson-1-kc', label: 'Lesson 1 Quick Knowledge Check' },
    ],
    nextScreenId: 'lesson-2',
    nextScreenLabel: "Lesson 2: Newton's First Law and Inertia",
  },
  'lesson-2': {
    requiredActivities: [
      { id: 'inertia-bus-scenario', label: 'Braking Bus Inertia Scenario (explore both stages & solve)' },
      { id: 'lesson-2-kc', label: 'Lesson 2 Quick Knowledge Check' },
    ],
    nextScreenId: 'lesson-3',
    nextScreenLabel: "Lesson 3: Newton's Second Law",
  },
  'lesson-3': {
    requiredActivities: [
      { id: 'second-law-simulator', label: 'Second Law Simulator (run/test at least 2 distinct force-mass cases)' },
      { id: 'lesson-3-kc', label: 'Lesson 3 Practice Question' },
    ],
    nextScreenId: 'lesson-4',
    nextScreenLabel: "Lesson 4: Newton's Third Law",
  },
  'lesson-4': {
    requiredActivities: [
      { id: 'action-reaction-identifier', label: 'Action–Reaction Identifier (solve all 3 scenarios)' },
      { id: 'lesson-4-kc', label: 'Lesson 4 Quick Knowledge Check' },
    ],
    nextScreenId: 'lesson-5',
    nextScreenLabel: 'Lesson 5: Putting the Laws Together',
  },
  'lesson-5': {
    requiredActivities: [
      { id: 'integrated-synthesis', label: '5-Step Integrated Synthesis Practice (verify all 5 steps)' },
    ],
    nextScreenId: 'assessment',
    nextScreenLabel: 'Final Module Assessment',
  },
};

export interface LessonAssessmentRecord {
  score: number | null; // Highest earned score (%) so passing credit is never erased
  latestScore: number | null;
  passed: boolean;
  attempts: number;
  lastResult: AssessmentResultSummary | null;
}

export interface LessonProgressRecord {
  activities: Record<string, boolean>;
  assessment: LessonAssessmentRecord;
  completed: boolean;
  unlocked: boolean;
}

export interface SectionBookmark {
  sectionId: string;
  sectionLabel: string;
  updatedAt: string;
}

export interface ReflectionRecord {
  text: string;
  updatedAt: string | null;
  sampleViewed: boolean;
}

export interface ModuleProgressState {
  version: 3;
  currentScreen: ScreenId;
  lastActiveLesson: LessonId | null;
  lastVisitedSections: Partial<Record<ScreenId, SectionBookmark>>;
  visitedSectionIds: Partial<Record<LessonId, string[]>>;
  lessons: Record<LessonId, LessonProgressRecord>;
  finalAssessmentUnlocked: boolean;
  finalAssessmentCompleted: boolean;
  finalAssessmentPassed: boolean;
  bestFinalAssessmentScore: number | null;
  assessmentAttempts: number;
  latestAssessment: AssessmentResultSummary | null;
  moduleCompleted: boolean;
  reflection: ReflectionRecord;
}

export interface LessonProgressSummary {
  lessonId: LessonId;
  completedActivitiesCount: number;
  totalActivitiesCount: number;
  incompleteActivityLabels: string[];
  assessmentPassed: boolean;
  assessmentBestScore: number | null;
  assessmentLatestScore: number | null;
  completedRequirements: number;
  totalRequirements: number;
  percentage: number;
  completed: boolean;
  unlocked: boolean;
}

export function isLessonId(id: string): id is LessonId {
  return (LESSON_IDS as readonly string[]).includes(id);
}

export function createEmptyLessonRecord(unlocked: boolean): LessonProgressRecord {
  return {
    activities: {},
    assessment: {
      score: null,
      latestScore: null,
      passed: false,
      attempts: 0,
      lastResult: null,
    },
    completed: false,
    unlocked,
  };
}

export function createInitialModuleProgress(): ModuleProgressState {
  return {
    version: 3,
    currentScreen: 'welcome',
    lastActiveLesson: null,
    lastVisitedSections: {},
    visitedSectionIds: {},
    lessons: {
      'lesson-1': createEmptyLessonRecord(true),
      'lesson-2': createEmptyLessonRecord(false),
      'lesson-3': createEmptyLessonRecord(false),
      'lesson-4': createEmptyLessonRecord(false),
      'lesson-5': createEmptyLessonRecord(false),
    },
    finalAssessmentUnlocked: false,
    finalAssessmentCompleted: false,
    finalAssessmentPassed: false,
    bestFinalAssessmentScore: null,
    assessmentAttempts: 0,
    latestAssessment: null,
    moduleCompleted: false,
    reflection: {
      text: '',
      updatedAt: null,
      sampleViewed: false,
    },
  };
}

/**
 * Exact transparent calculation from specification:
 * Lesson Progress = (Completed Required Activities + Passed Assessment) / (Total Required Activities + 1) × 100
 */
export function calculateLessonProgress(
  lessonId: LessonId,
  record: LessonProgressRecord
): LessonProgressSummary {
  const reqs = LESSON_REQUIREMENTS[lessonId].requiredActivities;
  const totalActivitiesCount = reqs.length;

  const incompleteActivityLabels: string[] = [];
  let completedActivitiesCount = 0;

  for (const act of reqs) {
    if (record.activities[act.id] === true) {
      completedActivitiesCount += 1;
    } else {
      incompleteActivityLabels.push(act.label);
    }
  }

  const assessmentPassed = Boolean(record.assessment.passed);
  const completedRequirements = completedActivitiesCount + (assessmentPassed ? 1 : 0);
  const totalRequirements = totalActivitiesCount + 1;
  const percentage = Math.round((completedRequirements / totalRequirements) * 100);
  const completed = completedActivitiesCount === totalActivitiesCount && assessmentPassed;

  return {
    lessonId,
    completedActivitiesCount,
    totalActivitiesCount,
    incompleteActivityLabels,
    assessmentPassed,
    assessmentBestScore: record.assessment.score,
    assessmentLatestScore: record.assessment.latestScore,
    completedRequirements,
    totalRequirements,
    percentage,
    completed,
    unlocked: record.unlocked,
  };
}

/**
 * Reconciles completion and sequential unlock invariants across the entire module.
 */
export function reconcileModuleProgress(state: ModuleProgressState): ModuleProgressState {
  const nextLessons = { ...state.lessons };

  for (let i = 0; i < LESSON_IDS.length; i++) {
    const id = LESSON_IDS[i];
    const existing = nextLessons[id] ?? createEmptyLessonRecord(i === 0);
    const reqIds = new Set(LESSON_REQUIREMENTS[id].requiredActivities.map((a) => a.id));

    const cleanedActivities: Record<string, boolean> = {};
    for (const key of Object.keys(existing.activities || {})) {
      if (reqIds.has(key) && existing.activities[key] === true) {
        cleanedActivities[key] = true;
      }
    }

    const allActivitiesDone = LESSON_REQUIREMENTS[id].requiredActivities.every(
      (a) => cleanedActivities[a.id] === true
    );
    const assessmentPassed = Boolean(existing.assessment?.passed);
    const completed = allActivitiesDone && assessmentPassed;

    let unlocked = i === 0 ? true : Boolean(existing.unlocked);
    if (i > 0) {
      const prevId = LESSON_IDS[i - 1];
      if (nextLessons[prevId].completed) {
        unlocked = true;
      } else if (!existing.completed) {
        unlocked = nextLessons[prevId].completed;
      }
    }

    nextLessons[id] = {
      activities: cleanedActivities,
      assessment: {
        score: existing.assessment?.score ?? null,
        latestScore: existing.assessment?.latestScore ?? existing.assessment?.score ?? null,
        passed: assessmentPassed,
        attempts: Math.max(0, existing.assessment?.attempts ?? 0),
        lastResult: existing.assessment?.lastResult ?? null,
      },
      completed,
      unlocked,
    };
  }

  const allLessonsCompleted = LESSON_IDS.every((id) => nextLessons[id].completed);
  const lesson5Completed = nextLessons['lesson-5'].completed;
  const finalAssessmentUnlocked = lesson5Completed;

  const latestPct = state.latestAssessment?.percentage ?? null;
  const derivedPassedFromLatest =
    latestPct !== null && latestPct >= FORMATIVE_MASTERY_THRESHOLD_PERCENT;
  const finalAssessmentPassed =
    finalAssessmentUnlocked &&
    (Boolean(state.finalAssessmentPassed) || derivedPassedFromLatest);
  const finalAssessmentCompleted = finalAssessmentPassed;

  const bestFinalAssessmentScore =
    state.bestFinalAssessmentScore !== null
      ? latestPct !== null
        ? Math.max(state.bestFinalAssessmentScore, latestPct)
        : state.bestFinalAssessmentScore
      : latestPct;

  const moduleCompleted = allLessonsCompleted && finalAssessmentPassed;

  const safeLastActiveLesson =
    state.lastActiveLesson &&
    isLessonId(state.lastActiveLesson) &&
    nextLessons[state.lastActiveLesson]?.unlocked
      ? state.lastActiveLesson
      : null;

  const safeVisitedSectionIds: Partial<Record<LessonId, string[]>> = {};
  if (state.visitedSectionIds && typeof state.visitedSectionIds === 'object') {
    for (const id of LESSON_IDS) {
      const list = state.visitedSectionIds[id];
      if (Array.isArray(list) && nextLessons[id]?.unlocked) {
        const unique = Array.from(
          new Set(list.filter((sec): sec is string => typeof sec === 'string' && sec.trim().length > 0))
        );
        if (unique.length > 0) {
          safeVisitedSectionIds[id] = unique;
        }
      }
    }
  }

  const candidate: ModuleProgressState = {
    version: 3,
    currentScreen: state.currentScreen,
    lastActiveLesson: safeLastActiveLesson,
    lastVisitedSections: state.lastVisitedSections ?? {},
    visitedSectionIds: safeVisitedSectionIds,
    lessons: nextLessons,
    finalAssessmentUnlocked,
    finalAssessmentCompleted,
    finalAssessmentPassed,
    bestFinalAssessmentScore,
    assessmentAttempts: Math.max(0, state.assessmentAttempts || 0),
    latestAssessment: state.latestAssessment ?? null,
    moduleCompleted,
    reflection: {
      text: typeof state.reflection?.text === 'string' ? state.reflection.text : '',
      updatedAt:
        typeof state.reflection?.updatedAt === 'string' ? state.reflection.updatedAt : null,
      sampleViewed: Boolean(state.reflection?.sampleViewed),
    },
  };

  if (!canAccessScreen(candidate, candidate.currentScreen)) {
    candidate.currentScreen = getHighestAccessibleScreen(candidate);
  }

  return candidate;
}

/**
 * Central access check enforced across sidebar clicks, footer controls, URL params, and history navigation.
 */
export function canAccessScreen(state: ModuleProgressState, screenId: ScreenId): boolean {
  if (!(MODULE_SCREEN_IDS as readonly string[]).includes(screenId)) {
    return false;
  }
  if (screenId === 'welcome') {
    return true;
  }
  if (isLessonId(screenId)) {
    return Boolean(state.lessons[screenId]?.unlocked);
  }
  if (screenId === 'assessment') {
    return Boolean(state.finalAssessmentUnlocked);
  }
  if (screenId === 'completion') {
    return Boolean(state.moduleCompleted);
  }
  return false;
}

export function getHighestAccessibleScreen(state: ModuleProgressState): ScreenId {
  if (state.moduleCompleted) {
    return 'completion';
  }
  if (state.finalAssessmentUnlocked) {
    return 'assessment';
  }
  for (let i = LESSON_IDS.length - 1; i >= 0; i--) {
    const id = LESSON_IDS[i];
    if (state.lessons[id]?.unlocked) {
      return id;
    }
  }
  return 'lesson-1';
}

export function getResumeTarget(state: ModuleProgressState): {
  screenId: ScreenId;
  sectionId?: string;
  sectionLabel?: string;
  hasStarted: boolean;
} {
  if (state.moduleCompleted) {
    return {
      screenId: 'completion',
      hasStarted: true,
    };
  }

  const targetScreen: ScreenId =
    state.lastActiveLesson && canAccessScreen(state, state.lastActiveLesson)
      ? state.lastActiveLesson
      : state.finalAssessmentUnlocked
      ? 'assessment'
      : getHighestAccessibleScreen(state);

  const hasAnyProgress =
    state.lastActiveLesson !== null ||
    state.assessmentAttempts > 0 ||
    Boolean(state.reflection.text.trim()) ||
    LESSON_IDS.some(
      (id) =>
        Object.keys(state.lessons[id].activities).length > 0 ||
        state.lessons[id].assessment.attempts > 0
    );

  const bookmark = state.lastVisitedSections[targetScreen];
  return {
    screenId: hasAnyProgress ? targetScreen : 'lesson-1',
    sectionId: bookmark?.sectionId,
    sectionLabel: bookmark?.sectionLabel,
    hasStarted: hasAnyProgress,
  };
}

export function attemptNavigate(
  state: ModuleProgressState,
  targetScreen: ScreenId
): { nextState: ModuleProgressState; allowed: boolean; lockReason: string | null } {
  if (canAccessScreen(state, targetScreen)) {
    return {
      nextState: {
        ...state,
        currentScreen: targetScreen,
        lastActiveLesson: isLessonId(targetScreen) ? targetScreen : state.lastActiveLesson,
      },
      allowed: true,
      lockReason: null,
    };
  }
  return {
    nextState: state,
    allowed: false,
    lockReason:
      targetScreen === 'completion' ? LOCKED_COMPLETION_MESSAGE : LOCKED_LESSON_MESSAGE,
  };
}

export function recordSectionVisit(
  state: ModuleProgressState,
  screenId: ScreenId,
  sectionId: string,
  sectionLabel: string
): ModuleProgressState {
  if (!canAccessScreen(state, screenId)) {
    return state;
  }
  const existing = state.lastVisitedSections[screenId];
  const prevVisited = isLessonId(screenId) ? state.visitedSectionIds?.[screenId] ?? [] : [];
  const alreadyRecordedInList = !isLessonId(screenId) || prevVisited.includes(sectionId);

  if (
    existing?.sectionId === sectionId &&
    existing?.sectionLabel === sectionLabel &&
    alreadyRecordedInList
  ) {
    return state;
  }

  const nextVisitedSectionIds =
    isLessonId(screenId) && !alreadyRecordedInList
      ? {
          ...state.visitedSectionIds,
          [screenId]: [...prevVisited, sectionId],
        }
      : state.visitedSectionIds;

  return {
    ...state,
    lastActiveLesson: isLessonId(screenId) ? screenId : state.lastActiveLesson,
    lastVisitedSections: {
      ...state.lastVisitedSections,
      [screenId]: {
        sectionId,
        sectionLabel,
        updatedAt: new Date().toISOString(),
      },
    },
    visitedSectionIds: nextVisitedSectionIds,
  };
}

export function recordReflection(
  state: ModuleProgressState,
  patch: Partial<ReflectionRecord>
): ModuleProgressState {
  const nextText = patch.text !== undefined ? patch.text : state.reflection.text;
  const nextSampleViewed =
    patch.sampleViewed !== undefined ? patch.sampleViewed : state.reflection.sampleViewed;
  const nextUpdatedAt =
    patch.updatedAt !== undefined
      ? patch.updatedAt
      : patch.text !== undefined
      ? nextText.trim()
        ? new Date().toISOString()
        : null
      : state.reflection.updatedAt;

  return {
    ...state,
    reflection: {
      text: nextText,
      updatedAt: nextUpdatedAt,
      sampleViewed: nextSampleViewed,
    },
  };
}

export function recordActivityCompleted(
  state: ModuleProgressState,
  lessonId: LessonId,
  activityId: string
): ModuleProgressState {
  if (!canAccessScreen(state, lessonId)) {
    return state;
  }
  const isRequired = LESSON_REQUIREMENTS[lessonId].requiredActivities.some(
    (a) => a.id === activityId
  );
  if (!isRequired) {
    return state;
  }

  const lesson = state.lessons[lessonId];
  if (lesson.activities[activityId] === true) {
    return state;
  }

  const updated: ModuleProgressState = {
    ...state,
    lastActiveLesson: lessonId,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...lesson,
        activities: {
          ...lesson.activities,
          [activityId]: true,
        },
      },
    },
  };

  return reconcileModuleProgress(updated);
}

/**
 * Records a per-lesson assessment attempt.
 * Preserves previously earned `passed: true` and highest `score` if the learner retakes and scores lower.
 */
export function recordLessonAssessmentResult(
  state: ModuleProgressState,
  lessonId: LessonId,
  result: AssessmentResultSummary
): ModuleProgressState {
  if (!canAccessScreen(state, lessonId)) {
    return state;
  }

  const lesson = state.lessons[lessonId];
  const previouslyPassed = Boolean(lesson.assessment.passed);
  const passedNow = result.percentage >= LESSON_PASSING_THRESHOLD_PERCENT;
  const bestScore =
    lesson.assessment.score === null
      ? result.percentage
      : Math.max(lesson.assessment.score, result.percentage);

  const updated: ModuleProgressState = {
    ...state,
    lastActiveLesson: lessonId,
    lessons: {
      ...state.lessons,
      [lessonId]: {
        ...lesson,
        assessment: {
          score: bestScore,
          latestScore: result.percentage,
          passed: previouslyPassed || passedNow,
          attempts: lesson.assessment.attempts + 1,
          lastResult: result,
        },
      },
    },
  };

  return reconcileModuleProgress(updated);
}

export function recordFinalAssessmentResult(
  state: ModuleProgressState,
  result: AssessmentResultSummary
): ModuleProgressState {
  if (!canAccessScreen(state, 'assessment')) {
    return state;
  }

  const passedNow = result.percentage >= FORMATIVE_MASTERY_THRESHOLD_PERCENT;
  const bestScore =
    state.bestFinalAssessmentScore === null
      ? result.percentage
      : Math.max(state.bestFinalAssessmentScore, result.percentage);

  return reconcileModuleProgress({
    ...state,
    assessmentAttempts: state.assessmentAttempts + 1,
    latestAssessment: result,
    finalAssessmentPassed: state.finalAssessmentPassed || passedNow,
    finalAssessmentCompleted: state.finalAssessmentPassed || passedNow,
    bestFinalAssessmentScore: bestScore,
  });
}

export function calculateOverallModuleProgress(state: ModuleProgressState): {
  completedLessonsCount: number;
  totalTrackableCount: number;
  completedCount: number;
  percentage: number;
} {
  const completedLessonsCount = LESSON_IDS.filter((id) => state.lessons[id]?.completed).length;
  const totalTrackableCount = LESSON_IDS.length + 1; // 5 lessons + Final Module Assessment passed
  const completedCount = completedLessonsCount + (state.finalAssessmentPassed ? 1 : 0);
  const percentage = Math.round((completedCount / totalTrackableCount) * 100);

  return {
    completedLessonsCount,
    totalTrackableCount,
    completedCount,
    percentage,
  };
}
