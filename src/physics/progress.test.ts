import test from 'node:test';
import assert from 'node:assert/strict';
import {
  attemptNavigate,
  calculateLessonProgress,
  calculateOverallModuleProgress,
  canAccessScreen,
  createInitialModuleProgress,
  getResumeTarget,
  LOCKED_COMPLETION_MESSAGE,
  LOCKED_LESSON_MESSAGE,
  recordActivityCompleted,
  recordFinalAssessmentResult,
  recordLessonAssessmentResult,
  recordReflection,
  recordSectionVisit,
} from './progress';
import { AssessmentResultSummary } from './calculations';
import { sanitizeProgressState } from '../utils/storage';

function makeAssessmentResult(percentage: number): AssessmentResultSummary {
  const passedThreshold = percentage >= 70;
  return {
    score: Math.round((percentage / 100) * 4),
    totalQuestions: 4,
    percentage,
    passedThreshold,
    thresholdPercentage: 70,
    submittedAt: '2026-11-18T00:00:00.000Z',
    results: [],
  };
}

test('fresh session starts with only Welcome and Lesson 1 unlocked', () => {
  const state = createInitialModuleProgress();
  assert.equal(canAccessScreen(state, 'welcome'), true);
  assert.equal(canAccessScreen(state, 'lesson-1'), true);
  assert.equal(canAccessScreen(state, 'lesson-2'), false);
  assert.equal(canAccessScreen(state, 'lesson-3'), false);
  assert.equal(canAccessScreen(state, 'lesson-4'), false);
  assert.equal(canAccessScreen(state, 'lesson-5'), false);
  assert.equal(canAccessScreen(state, 'assessment'), false);
  assert.equal(canAccessScreen(state, 'completion'), false);

  const l1Prog = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1Prog.percentage, 0);
  assert.equal(l1Prog.completed, false);
});

test('attemptNavigate blocks locked lessons and returns required lock message', () => {
  const state = createInitialModuleProgress();
  const attempt = attemptNavigate(state, 'lesson-2');
  assert.equal(attempt.allowed, false);
  assert.equal(attempt.nextState.currentScreen, 'welcome');
  assert.equal(attempt.lockReason, LOCKED_LESSON_MESSAGE);

  const bypassFinal = attemptNavigate(state, 'assessment');
  assert.equal(bypassFinal.allowed, false);
  assert.equal(bypassFinal.lockReason, LOCKED_LESSON_MESSAGE);

  const bypassCompletion = attemptNavigate(state, 'completion');
  assert.equal(bypassCompletion.allowed, false);
  assert.equal(bypassCompletion.lockReason, LOCKED_COMPLETION_MESSAGE);
});

test('lesson progress uses (completedActivities + passedAssessment) / (totalActivities + 1) * 100', () => {
  let state = createInitialModuleProgress();

  // 1 of 2 activities done, no assessment -> 1/3 = 33%
  state = recordActivityCompleted(state, 'lesson-1', 'net-force-calculator');
  let l1 = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1.percentage, 33);
  assert.equal(l1.completed, false);
  assert.equal(canAccessScreen(state, 'lesson-2'), false);

  // 2 of 2 activities done, assessment not passed -> 2/3 = 67%, Lesson 2 still locked
  state = recordActivityCompleted(state, 'lesson-1', 'lesson-1-kc');
  l1 = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1.percentage, 67);
  assert.equal(l1.completed, false);
  assert.equal(canAccessScreen(state, 'lesson-2'), false);

  // Failed assessment (50% < 70%) -> stays 67%, Lesson 2 still locked
  state = recordLessonAssessmentResult(state, 'lesson-1', makeAssessmentResult(50));
  l1 = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1.percentage, 67);
  assert.equal(l1.assessmentPassed, false);
  assert.equal(canAccessScreen(state, 'lesson-2'), false);

  // Passing assessment (75% >= 70%) -> 3/3 = 100%, Lesson 2 unlocks immediately
  state = recordLessonAssessmentResult(state, 'lesson-1', makeAssessmentResult(75));
  l1 = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1.percentage, 100);
  assert.equal(l1.completed, true);
  assert.equal(canAccessScreen(state, 'lesson-2'), true);
});

test('passing assessment without completing all activities does NOT unlock next lesson', () => {
  let state = createInitialModuleProgress();
  state = recordLessonAssessmentResult(state, 'lesson-1', makeAssessmentResult(100));

  const l1 = calculateLessonProgress('lesson-1', state.lessons['lesson-1']);
  assert.equal(l1.assessmentPassed, true);
  assert.equal(l1.percentage, 33); // 1 / 3
  assert.equal(l1.completed, false);
  assert.equal(canAccessScreen(state, 'lesson-2'), false);
});

test('retaking a passed assessment and scoring below 70% preserves passed status and unlocked lessons', () => {
  let state = createInitialModuleProgress();
  state = recordActivityCompleted(state, 'lesson-1', 'net-force-calculator');
  state = recordActivityCompleted(state, 'lesson-1', 'lesson-1-kc');
  state = recordLessonAssessmentResult(state, 'lesson-1', makeAssessmentResult(100));

  assert.equal(state.lessons['lesson-1'].completed, true);
  assert.equal(state.lessons['lesson-2'].unlocked, true);

  // Retake and fail
  state = recordLessonAssessmentResult(state, 'lesson-1', makeAssessmentResult(25));
  assert.equal(state.lessons['lesson-1'].assessment.passed, true);
  assert.equal(state.lessons['lesson-1'].assessment.score, 100);
  assert.equal(state.lessons['lesson-1'].assessment.latestScore, 25);
  assert.equal(state.lessons['lesson-1'].completed, true);
  assert.equal(state.lessons['lesson-2'].unlocked, true);
});

test('lesson 5 unlocks Final Assessment and >=70% on Final Assessment unlocks Completion screen', () => {
  let state = createInitialModuleProgress();
  for (const [id, acts] of [
    ['lesson-1', ['net-force-calculator', 'lesson-1-kc']],
    ['lesson-2', ['inertia-bus-scenario', 'lesson-2-kc']],
    ['lesson-3', ['second-law-simulator', 'lesson-3-kc']],
    ['lesson-4', ['action-reaction-identifier', 'lesson-4-kc']],
  ] as const) {
    for (const act of acts) {
      state = recordActivityCompleted(state, id, act);
    }
    state = recordLessonAssessmentResult(state, id, makeAssessmentResult(100));
  }

  assert.equal(canAccessScreen(state, 'lesson-5'), true);
  assert.equal(canAccessScreen(state, 'assessment'), false);

  state = recordActivityCompleted(state, 'lesson-5', 'integrated-synthesis');
  let l5 = calculateLessonProgress('lesson-5', state.lessons['lesson-5']);
  assert.equal(l5.percentage, 50);
  assert.equal(canAccessScreen(state, 'assessment'), false);

  state = recordLessonAssessmentResult(state, 'lesson-5', makeAssessmentResult(75));
  l5 = calculateLessonProgress('lesson-5', state.lessons['lesson-5']);
  assert.equal(l5.percentage, 100);
  assert.equal(l5.completed, true);
  assert.equal(canAccessScreen(state, 'assessment'), true);
  assert.equal(canAccessScreen(state, 'completion'), false);

  // Scoring 60% (<70%) does NOT unlock Completion screen
  state = recordFinalAssessmentResult(state, makeAssessmentResult(60));
  assert.equal(state.finalAssessmentPassed, false);
  assert.equal(state.moduleCompleted, false);
  assert.equal(canAccessScreen(state, 'completion'), false);
  assert.equal(calculateOverallModuleProgress(state).completedCount, 5);

  // Scoring 80% (>=70%) unlocks Completion screen
  state = recordFinalAssessmentResult(state, makeAssessmentResult(80));
  assert.equal(state.finalAssessmentPassed, true);
  assert.equal(state.bestFinalAssessmentScore, 80);
  assert.equal(state.moduleCompleted, true);
  assert.equal(canAccessScreen(state, 'completion'), true);
  const overall = calculateOverallModuleProgress(state);
  assert.equal(overall.completedCount, 6);
  assert.equal(overall.percentage, 100);

  // Retaking Final Assessment with lower score preserves completion & best score
  state = recordFinalAssessmentResult(state, makeAssessmentResult(40));
  assert.equal(state.finalAssessmentPassed, true);
  assert.equal(state.bestFinalAssessmentScore, 80);
  assert.equal(state.moduleCompleted, true);
  assert.equal(canAccessScreen(state, 'completion'), true);
});

test('resume target, section bookmarking, and reflection persistence work deterministically', () => {
  let state = createInitialModuleProgress();
  assert.equal(getResumeTarget(state).hasStarted, false);
  assert.equal(getResumeTarget(state).screenId, 'lesson-1');

  state = attemptNavigate(state, 'lesson-1').nextState;
  state = recordSectionVisit(state, 'lesson-1', 'l1-combining', '2. Combining Forces');
  state = recordReflection(state, { text: 'My bike accelerates forward when the road pushes back.' });

  const resume = getResumeTarget(state);
  assert.equal(resume.hasStarted, true);
  assert.equal(resume.screenId, 'lesson-1');
  assert.equal(resume.sectionId, 'l1-combining');
  assert.equal(resume.sectionLabel, '2. Combining Forces');
  assert.ok(state.reflection.updatedAt);
});

test('sanitizeProgressState blocks tampered localStorage attempting to unlock skipped lessons or completion', () => {
  const tampered = {
    version: 2,
    currentScreen: 'completion',
    finalAssessmentUnlocked: true,
    finalAssessmentCompleted: true,
    moduleCompleted: true,
    lessons: {
      'lesson-1': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: true },
      'lesson-2': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: true },
      'lesson-3': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: true },
      'lesson-4': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: true },
      'lesson-5': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: true },
    },
  };

  const sanitized = sanitizeProgressState(tampered);
  assert.equal(canAccessScreen(sanitized, 'lesson-1'), true);
  assert.equal(canAccessScreen(sanitized, 'lesson-2'), false);
  assert.equal(canAccessScreen(sanitized, 'lesson-3'), false);
  assert.equal(canAccessScreen(sanitized, 'lesson-4'), false);
  assert.equal(canAccessScreen(sanitized, 'assessment'), false);
  assert.equal(canAccessScreen(sanitized, 'completion'), false);
  assert.equal(sanitized.currentScreen, 'lesson-1');
});

test('sanitizeProgressState non-destructively upgrades v2 progress to v3', () => {
  const v2Stored = {
    version: 2,
    currentScreen: 'lesson-2',
    finalAssessmentUnlocked: false,
    finalAssessmentCompleted: false,
    assessmentAttempts: 0,
    latestAssessment: null,
    lessons: {
      'lesson-1': {
        activities: { 'net-force-calculator': true, 'lesson-1-kc': true },
        assessment: { passed: true, score: 100, latestScore: 100, attempts: 1, lastResult: null },
        completed: true,
        unlocked: true,
      },
      'lesson-2': {
        activities: {},
        assessment: { passed: false, score: null, latestScore: null, attempts: 0, lastResult: null },
        completed: false,
        unlocked: true,
      },
      'lesson-3': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: false },
      'lesson-4': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: false },
      'lesson-5': { activities: {}, assessment: { passed: false, score: null }, completed: false, unlocked: false },
    },
  };

  const migrated = sanitizeProgressState(v2Stored);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.lessons['lesson-1'].completed, true);
  assert.equal(migrated.lessons['lesson-2'].unlocked, true);
  assert.equal(migrated.lastActiveLesson, 'lesson-2');
  assert.equal(migrated.reflection.text, '');
  assert.deepEqual(migrated.visitedSectionIds, {});
});

test('visitedSectionIds records unlocked section visits without inflating lesson mastery percentage and rejects locked lessons', () => {
  let state = createInitialModuleProgress();
  state = recordSectionVisit(state, 'lesson-1', 'l1-intro', '1.1.1 Introduction & Objectives');
  state = recordSectionVisit(state, 'lesson-1', 'l1-what-is-force', '1.1.2 What Is a Force?');
  // Duplicate visit should not duplicate IDs
  state = recordSectionVisit(state, 'lesson-1', 'l1-intro', '1.1.1 Introduction & Objectives');
  // Locked lesson visit must be ignored
  state = recordSectionVisit(state, 'lesson-2', 'l2-first-law', "1.2.2 Newton's First Law");

  assert.deepEqual(state.visitedSectionIds['lesson-1'], ['l1-intro', 'l1-what-is-force']);
  assert.equal(state.visitedSectionIds['lesson-2'], undefined);
  assert.equal(calculateLessonProgress('lesson-1', state.lessons['lesson-1']).percentage, 0);

  const sanitized = sanitizeProgressState({
    ...state,
    visitedSectionIds: {
      'lesson-1': ['l1-intro', 'l1-what-is-force'],
      'lesson-2': ['l2-first-law'],
    },
  });
  assert.deepEqual(sanitized.visitedSectionIds['lesson-1'], ['l1-intro', 'l1-what-is-force']);
  assert.equal(sanitized.visitedSectionIds['lesson-2'], undefined);
});

