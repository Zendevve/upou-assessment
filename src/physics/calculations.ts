export type HorizontalDirection = 'right' | 'left';
export type ResultDirection = 'right' | 'left' | 'none';

export interface ForceInput {
  magnitude: number;
  direction: HorizontalDirection;
}

export interface NetForceResult {
  valid: boolean;
  error?: string;
  signedForceA: number;
  signedForceB: number;
  signedNetForce: number;
  netMagnitude: number;
  direction: ResultDirection;
  isBalanced: boolean;
  directionLabel: string;
  motionSummary: string;
  equationText: string;
}

export interface AccelerationResult {
  valid: boolean;
  error?: string;
  netForceN: number;
  massKg: number;
  accelerationMs2: number;
  magnitudeMs2: number;
  direction: ResultDirection;
  directionLabel: string;
  substitutionText: string;
  relationshipExplanation: string;
}

export const MODULE_SCREEN_IDS = [
  'welcome',
  'lesson-1',
  'lesson-2',
  'lesson-3',
  'lesson-4',
  'lesson-5',
  'assessment',
  'completion',
] as const;

export type ScreenId = (typeof MODULE_SCREEN_IDS)[number];

export const TRACKABLE_COMPLETION_IDS = [
  'welcome',
  'lesson-1',
  'lesson-2',
  'lesson-3',
  'lesson-4',
  'lesson-5',
  'assessment',
] as const;

export interface AssessmentAnswerValue {
  choiceId?: string;
  numericValue?: string;
  directionValue?: ResultDirection;
  textValue?: string;
}

export interface AssessmentQuestionSpec {
  id: string;
  number: number;
  type: 'multiple-choice' | 'true-false-reason' | 'numerical' | 'short-answer' | 'numerical-direction';
  objectiveNumber: number;
  lessonReferenceId: ScreenId;
  prompt: string;
  helperText?: string;
  options?: Array<{
    id: string;
    label: string;
    feedback: string;
  }>;
  correctChoiceId?: string;
  correctNumericValue?: number;
  numericTolerance?: number;
  numericUnit?: string;
  correctDirection?: ResultDirection;
  requiredConceptKeywords?: string[][];
  modelAnswer: string;
  correctExplanation: string;
  incorrectExplanation: string;
}

export interface GradedQuestionResult {
  questionId: string;
  questionNumber: number;
  isCorrect: boolean;
  learnerAnswerDisplay: string;
  correctAnswerDisplay: string;
  explanation: string;
  objectiveNumber: number;
  lessonReferenceId: ScreenId;
}

export interface AssessmentResultSummary {
  score: number;
  totalQuestions: number;
  percentage: number;
  passedThreshold: boolean;
  thresholdPercentage: number;
  submittedAt: string;
  results: GradedQuestionResult[];
}

export interface ModuleProgressState {
  currentScreen: ScreenId;
  completedScreens: ScreenId[];
  completedActivities: string[];
  assessmentAttempts: number;
  latestAssessment: AssessmentResultSummary | null;
}

/**
 * Calculates 1D horizontal net force using right as positive (+) and left as negative (-).
 */
export function calculateNetForce(forceA: ForceInput, forceB: ForceInput): NetForceResult {
  if (
    !Number.isFinite(forceA.magnitude) ||
    !Number.isFinite(forceB.magnitude) ||
    forceA.magnitude < 0 ||
    forceB.magnitude < 0
  ) {
    return {
      valid: false,
      error: 'Force magnitudes must be zero or positive numbers (in newtons).',
      signedForceA: 0,
      signedForceB: 0,
      signedNetForce: 0,
      netMagnitude: 0,
      direction: 'none',
      isBalanced: true,
      directionLabel: 'Invalid input',
      motionSummary: 'Enter valid non-negative force values to evaluate the net force.',
      equationText: '',
    };
  }

  const signedForceA = forceA.direction === 'right' ? forceA.magnitude : -forceA.magnitude;
  const signedForceB = forceB.direction === 'right' ? forceB.magnitude : -forceB.magnitude;
  const rawNet = signedForceA + signedForceB;
  const signedNetForce = Math.round(rawNet * 100) / 100;
  const netMagnitude = Math.abs(signedNetForce);
  const isBalanced = netMagnitude === 0;

  let direction: ResultDirection = 'none';
  let directionLabel = 'Balanced (No net direction)';
  let motionSummary =
    'The forces are balanced (F_net = 0 N). If the object is at rest, it stays at rest; if it is already moving, it keeps moving at constant velocity.';

  if (signedNetForce > 0) {
    direction = 'right';
    directionLabel = 'to the right';
    motionSummary = `The forces are unbalanced. A net force of ${formatNum(netMagnitude)} N acts to the right, so the object accelerates to the right.`;
  } else if (signedNetForce < 0) {
    direction = 'left';
    directionLabel = 'to the left';
    motionSummary = `The forces are unbalanced. A net force of ${formatNum(netMagnitude)} N acts to the left, so the object accelerates to the left.`;
  }

  const signA = signedForceA >= 0 ? `+${formatNum(signedForceA)} N` : `${formatNum(signedForceA)} N`;
  const signB = signedForceB >= 0 ? `+ ${formatNum(signedForceB)} N` : `- ${formatNum(Math.abs(signedForceB))} N`;
  const equationText = `F_net = (${signA}) ${signB} = ${signedNetForce > 0 ? '+' : ''}${formatNum(signedNetForce)} N`;

  return {
    valid: true,
    signedForceA,
    signedForceB,
    signedNetForce,
    netMagnitude,
    direction,
    isBalanced,
    directionLabel,
    motionSummary,
    equationText,
  };
}

/**
 * Calculates acceleration from net force (N) and mass (kg) using Newton's Second Law: a = F_net / m.
 * Rejects zero or negative mass.
 */
export function calculateAcceleration(netForceN: number, massKg: number): AccelerationResult {
  if (!Number.isFinite(massKg) || massKg <= 0) {
    return {
      valid: false,
      error: 'Mass must be greater than 0 kg. An object with zero or negative mass is not physically valid.',
      netForceN,
      massKg,
      accelerationMs2: 0,
      magnitudeMs2: 0,
      direction: 'none',
      directionLabel: 'Invalid mass',
      substitutionText: 'a = F_net / m (undefined when m ≤ 0 kg)',
      relationshipExplanation: 'Enter a positive mass greater than 0 kg to compute acceleration.',
    };
  }

  if (!Number.isFinite(netForceN)) {
    return {
      valid: false,
      error: 'Net force must be a valid number in newtons.',
      netForceN: 0,
      massKg,
      accelerationMs2: 0,
      magnitudeMs2: 0,
      direction: 'none',
      directionLabel: 'Invalid force',
      substitutionText: '',
      relationshipExplanation: 'Enter a valid net force value.',
    };
  }

  const rawAcc = netForceN / massKg;
  const accelerationMs2 = Math.round(rawAcc * 100) / 100;
  const magnitudeMs2 = Math.abs(accelerationMs2);

  let direction: ResultDirection = 'none';
  let directionLabel = 'Zero acceleration (constant velocity)';

  if (accelerationMs2 > 0) {
    direction = 'right';
    directionLabel = 'to the right';
  } else if (accelerationMs2 < 0) {
    direction = 'left';
    directionLabel = 'to the left';
  }

  const substitutionText = `a = ${formatNum(netForceN)} N / ${formatNum(massKg)} kg = ${formatNum(magnitudeMs2)} m/s²${
    direction === 'none' ? '' : ` ${directionLabel}`
  }`;

  let relationshipExplanation = '';
  if (netForceN === 0) {
    relationshipExplanation =
      'With zero net force, acceleration is 0 m/s². Consistent with Newton’s First Law, the object’s velocity does not change.';
  } else {
    relationshipExplanation = `Acceleration (${formatNum(magnitudeMs2)} m/s²) points ${directionLabel}, matching the net force direction. Increasing net force increases acceleration; increasing mass decreases acceleration.`;
  }

  return {
    valid: true,
    netForceN,
    massKg,
    accelerationMs2,
    magnitudeMs2,
    direction,
    directionLabel,
    substitutionText,
    relationshipExplanation,
  };
}

/**
 * Evaluates a learner's short-answer conceptual response by checking required concept groups.
 * Each inner array represents synonyms/phrases where at least one match satisfies that concept group.
 */
export function evaluateConceptualShortAnswer(
  text: string,
  requiredGroups: string[][]
): boolean {
  const normalized = text.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  if (!normalized) {
    return false;
  }
  return requiredGroups.every((group) =>
    group.some((keyword) => normalized.includes(keyword.toLowerCase()))
  );
}

export const FORMATIVE_MASTERY_THRESHOLD_PERCENT = 70;

export function gradeAssessment(
  questions: AssessmentQuestionSpec[],
  answers: Record<string, AssessmentAnswerValue>
): AssessmentResultSummary {
  const results: GradedQuestionResult[] = questions.map((q) => {
    const ans = answers[q.id] || {};
    let isCorrect = false;
    let learnerAnswerDisplay = 'No answer provided';
    let explanation = q.incorrectExplanation;

    if (q.type === 'multiple-choice' || q.type === 'true-false-reason') {
      const selectedOption = q.options?.find((opt) => opt.id === ans.choiceId);
      if (selectedOption) {
        learnerAnswerDisplay = selectedOption.label;
        isCorrect = selectedOption.id === q.correctChoiceId;
        explanation = selectedOption.feedback;
      }
    } else if (q.type === 'numerical') {
      const raw = (ans.numericValue ?? '').trim();
      if (raw !== '') {
        const parsed = Number(raw);
        learnerAnswerDisplay = `${raw}${q.numericUnit ? ` ${q.numericUnit}` : ''}`;
        if (Number.isFinite(parsed) && q.correctNumericValue !== undefined) {
          const tol = q.numericTolerance ?? 0.05;
          isCorrect = Math.abs(parsed - q.correctNumericValue) <= tol;
          explanation = isCorrect ? q.correctExplanation : q.incorrectExplanation;
        }
      }
    } else if (q.type === 'numerical-direction') {
      const raw = (ans.numericValue ?? '').trim();
      const dir = ans.directionValue;
      const numLabel = raw !== '' ? `${raw} ${q.numericUnit ?? ''}`.trim() : 'No number';
      const dirLabel =
        dir === 'right'
          ? 'to the right'
          : dir === 'left'
          ? 'to the left'
          : dir === 'none'
          ? 'no direction (0)'
          : 'no direction selected';
      if (raw !== '' || dir) {
        learnerAnswerDisplay = `${numLabel}, ${dirLabel}`;
      }
      if (raw !== '' && dir) {
        const parsed = Number(raw);
        const tol = q.numericTolerance ?? 0.05;
        const numOk =
          Number.isFinite(parsed) &&
          q.correctNumericValue !== undefined &&
          Math.abs(parsed - q.correctNumericValue) <= tol;
        const dirOk = dir === q.correctDirection;
        isCorrect = numOk && dirOk;
        explanation = isCorrect ? q.correctExplanation : q.incorrectExplanation;
      }
    } else if (q.type === 'short-answer') {
      const raw = (ans.textValue ?? '').trim();
      if (raw !== '') {
        learnerAnswerDisplay = raw;
        isCorrect = evaluateConceptualShortAnswer(raw, q.requiredConceptKeywords ?? []);
        explanation = isCorrect ? q.correctExplanation : q.incorrectExplanation;
      }
    }

    return {
      questionId: q.id,
      questionNumber: q.number,
      isCorrect,
      learnerAnswerDisplay,
      correctAnswerDisplay: q.modelAnswer,
      explanation,
      objectiveNumber: q.objectiveNumber,
      lessonReferenceId: q.lessonReferenceId,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return {
    score,
    totalQuestions,
    percentage,
    passedThreshold: percentage >= FORMATIVE_MASTERY_THRESHOLD_PERCENT,
    thresholdPercentage: FORMATIVE_MASTERY_THRESHOLD_PERCENT,
    submittedAt: new Date().toISOString(),
    results,
  };
}

export function calculateOverallProgress(completedScreens: ScreenId[]): {
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  const uniqueValid = new Set(
    completedScreens.filter((id) => (TRACKABLE_COMPLETION_IDS as readonly string[]).includes(id))
  );
  const totalCount = TRACKABLE_COMPLETION_IDS.length;
  const completedCount = uniqueValid.size;
  const percentage = Math.round((completedCount / totalCount) * 100);
  return { completedCount, totalCount, percentage };
}

export function formatNum(n: number): string {
  if (Object.is(n, -0)) return '0';
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
}
