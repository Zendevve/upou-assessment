import test from 'node:test';
import assert from 'node:assert/strict';
import {
  attemptNavigate,
  calculateLessonProgress,
  calculateOverallModuleProgress,
  canAccessScreen,
  createInitialModuleProgress,
  LOCKED_LESSON_MESSAGE,
  recordActivityCompleted,
  recordFinalAssessmentResult,
  recordLessonAssessmentResult,
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

test('lesson 5 (1 required activity + 1 assessment) calculates 0%, 50%, 100% and unlocks Final Assessment', () => {
  let state = createInitialModuleProgress();
  // Complete lessons 1..4
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

  state = recordFinalAssessmentResult(state, makeAssessmentResult(100));
  const overall = calculateOverallModuleProgress(state);
  assert.equal(overall.completedCount, 6);
  assert.equal(overall.percentage, 100);
});

test('sanitizeProgressState blocks tampered localStorage attempting to unlock skipped lessons or assessment', () => {
  const tampered = {
    version: 2,
    currentScreen: 'lesson-4',
    finalAssessmentUnlocked: true,
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
  assert.equal(sanitized.currentScreen, 'lesson-1');
});

