import {
  AssessmentResultSummary,
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

export interface ModuleProgressState {
  version: 2;
  currentScreen: ScreenId;
  lessons: Record<LessonId, LessonProgressRecord>;
  finalAssessmentUnlocked: boolean;
  finalAssessmentCompleted: boolean;
  assessmentAttempts: number;
  latestAssessment: AssessmentResultSummary | null;
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
    version: 2,
    currentScreen: 'welcome',
    lessons: {
      'lesson-1': createEmptyLessonRecord(true),
      'lesson-2': createEmptyLessonRecord(false),
      'lesson-3': createEmptyLessonRecord(false),
      'lesson-4': createEmptyLessonRecord(false),
      'lesson-5': createEmptyLessonRecord(false),
    },
    finalAssessmentUnlocked: false,
    finalAssessmentCompleted: false,
    assessmentAttempts: 0,
    latestAssessment: null,
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
 * - Lesson 1 is always unlocked.
 * - A lesson is completed iff all its required activities are true AND its assessment is passed.
 * - Once a lesson is unlocked, it stays unlocked (never re-locks on assessment retake).
 * - Each subsequent lesson unlocks when the previous lesson reaches completed === true.
 * - Final Module Assessment unlocks once Lesson 5 is completed.
 * - Ensures currentScreen cannot point to a locked screen.
 */
export function reconcileModuleProgress(state: ModuleProgressState): ModuleProgressState {
  const nextLessons = { ...state.lessons };

  for (let i = 0; i < LESSON_IDS.length; i++) {
    const id = LESSON_IDS[i];
    const existing = nextLessons[id] ?? createEmptyLessonRecord(i === 0);
    const reqIds = new Set(LESSON_REQUIREMENTS[id].requiredActivities.map((a) => a.id));

    // Only keep known required activities for this lesson
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
        // Guard against tampered storage trying to unlock a lesson whose predecessor was never completed
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

  const lesson5Completed = nextLessons['lesson-5'].completed;
  const finalAssessmentUnlocked = lesson5Completed || Boolean(state.finalAssessmentUnlocked && lesson5Completed);
  const finalAssessmentCompleted = Boolean(state.latestAssessment) && finalAssessmentUnlocked;

  const candidate: ModuleProgressState = {
    version: 2,
    currentScreen: state.currentScreen,
    lessons: nextLessons,
    finalAssessmentUnlocked,
    finalAssessmentCompleted,
    assessmentAttempts: Math.max(0, state.assessmentAttempts || 0),
    latestAssessment: state.latestAssessment ?? null,
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
  return false;
}

export function getHighestAccessibleScreen(state: ModuleProgressState): ScreenId {
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

export function attemptNavigate(
  state: ModuleProgressState,
  targetScreen: ScreenId
): { nextState: ModuleProgressState; allowed: boolean; lockReason: string | null } {
  if (canAccessScreen(state, targetScreen)) {
    return {
      nextState: { ...state, currentScreen: targetScreen },
      allowed: true,
      lockReason: null,
    };
  }
  return {
    nextState: state,
    allowed: false,
    lockReason: LOCKED_LESSON_MESSAGE,
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

  return reconcileModuleProgress({
    ...state,
    assessmentAttempts: state.assessmentAttempts + 1,
    latestAssessment: result,
    finalAssessmentCompleted: true,
  });
}

export function calculateOverallModuleProgress(state: ModuleProgressState): {
  completedLessonsCount: number;
  totalTrackableCount: number;
  completedCount: number;
  percentage: number;
} {
  const completedLessonsCount = LESSON_IDS.filter((id) => state.lessons[id]?.completed).length;
  const totalTrackableCount = LESSON_IDS.length + 1; // 5 lessons + Final Module Assessment
  const completedCount = completedLessonsCount + (state.finalAssessmentCompleted ? 1 : 0);
  const percentage = Math.round((completedCount / totalTrackableCount) * 100);

  return {
    completedLessonsCount,
    totalTrackableCount,
    completedCount,
    percentage,
  };
}
