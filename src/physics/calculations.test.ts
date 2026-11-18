import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAcceleration,
  calculateNetForce,
  calculateOverallProgress,
  evaluateConceptualShortAnswer,
  gradeAssessment,
  AssessmentAnswerValue,
} from './calculations';
import { FINAL_ASSESSMENT_QUESTIONS } from '../data/moduleContent';

test('calculateNetForce computes balanced forces accurately', () => {
  const res = calculateNetForce(
    { magnitude: 10, direction: 'right' },
    { magnitude: 10, direction: 'left' }
  );
  assert.equal(res.valid, true);
  assert.equal(res.netMagnitude, 0);
  assert.equal(res.isBalanced, true);
  assert.equal(res.direction, 'none');
});

test('calculateNetForce computes unbalanced forces to the right and left', () => {
  const rightRes = calculateNetForce(
    { magnitude: 15, direction: 'right' },
    { magnitude: 5, direction: 'left' }
  );
  assert.equal(rightRes.valid, true);
  assert.equal(rightRes.netMagnitude, 10);
  assert.equal(rightRes.direction, 'right');
  assert.equal(rightRes.isBalanced, false);

  const leftRes = calculateNetForce(
    { magnitude: 8, direction: 'right' },
    { magnitude: 20, direction: 'left' }
  );
  assert.equal(leftRes.valid, true);
  assert.equal(leftRes.netMagnitude, 12);
  assert.equal(leftRes.direction, 'left');
});

test('calculateNetForce rejects negative magnitudes', () => {
  const res = calculateNetForce(
    { magnitude: -5, direction: 'right' },
    { magnitude: 10, direction: 'left' }
  );
  assert.equal(res.valid, false);
});

test('calculateAcceleration computes F_net / m and validates mass > 0', () => {
  const exA = calculateAcceleration(20, 5);
  assert.equal(exA.valid, true);
  assert.equal(exA.magnitudeMs2, 4);
  assert.equal(exA.direction, 'right');

  const exB = calculateAcceleration(-10, 5);
  assert.equal(exB.valid, true);
  assert.equal(exB.magnitudeMs2, 2);
  assert.equal(exB.direction, 'left');

  const doubleForce = calculateAcceleration(40, 5);
  assert.equal(doubleForce.magnitudeMs2, 8);

  const doubleMass = calculateAcceleration(20, 10);
  assert.equal(doubleMass.magnitudeMs2, 2);

  const zeroMass = calculateAcceleration(20, 0);
  assert.equal(zeroMass.valid, false);

  const negMass = calculateAcceleration(20, -4);
  assert.equal(negMass.valid, false);
});

test('evaluateConceptualShortAnswer requires mention of different objects', () => {
  const groups = FINAL_ASSESSMENT_QUESTIONS[8].requiredConceptKeywords ?? [];
  assert.equal(
    evaluateConceptualShortAnswer('They act on different objects.', groups),
    true
  );
  assert.equal(
    evaluateConceptualShortAnswer('Because the two forces act on separate bodies.', groups),
    true
  );
  assert.equal(
    evaluateConceptualShortAnswer('Because one force is larger than the other.', groups),
    false
  );
});

test('gradeAssessment scores all 10 questions accurately for perfect and partial submissions', () => {
  const perfectAnswers: Record<string, AssessmentAnswerValue> = {
    q1: { choiceId: 'a' },
    q2: { numericValue: '0' },
    q3: { choiceId: 'b' },
    q4: { choiceId: 'c' },
    q5: { numericValue: '3' },
    q6: { choiceId: 'a' },
    q7: { choiceId: 'b' },
    q8: { choiceId: 'a' },
    q9: { textValue: 'Because action and reaction forces act on different objects.' },
    q10: { numericValue: '2', directionValue: 'right' },
  };

  const perfect = gradeAssessment(FINAL_ASSESSMENT_QUESTIONS, perfectAnswers);
  assert.equal(perfect.score, 10);
  assert.equal(perfect.totalQuestions, 10);
  assert.equal(perfect.percentage, 100);
  assert.equal(perfect.passedThreshold, true);

  const partialAnswers: Record<string, AssessmentAnswerValue> = {
    q1: { choiceId: 'a' },
    q2: { numericValue: '0' },
    q3: { choiceId: 'b' },
    q4: { choiceId: 'c' },
    q5: { numericValue: '3' },
    q6: { choiceId: 'a' },
    q7: { choiceId: 'a' }, // wrong
    q8: { choiceId: 'b' }, // wrong
    q9: { textValue: 'They are equal' }, // missing "different objects"
    q10: { numericValue: '2', directionValue: 'left' }, // wrong direction
  };

  const partial = gradeAssessment(FINAL_ASSESSMENT_QUESTIONS, partialAnswers);
  assert.equal(partial.score, 6);
  assert.equal(partial.percentage, 60);
  assert.equal(partial.passedThreshold, false);
});

test('calculateOverallProgress computes percentage without duplicates', () => {
  const prog = calculateOverallProgress(['welcome', 'lesson-1', 'lesson-1', 'lesson-2']);
  assert.equal(prog.completedCount, 3);
  assert.equal(prog.totalCount, 7);
  assert.equal(prog.percentage, 43);
});
