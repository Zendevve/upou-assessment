import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { LESSON_ASSESSMENTS } from '../../data/moduleContent';
import {
  AssessmentAnswerValue,
  AssessmentResultSummary,
  gradeAssessment,
  ResultDirection,
  ScreenId,
} from '../../physics/calculations';
import {
  calculateLessonProgress,
  LESSON_PASSING_THRESHOLD_PERCENT,
  LESSON_REQUIREMENTS,
  LessonId,
  LessonProgressRecord,
} from '../../physics/progress';

interface LessonAssessmentProps {
  lessonId: LessonId;
  lessonRecord: LessonProgressRecord;
  onSubmitAssessment: (result: AssessmentResultSummary) => void;
  onNavigate: (screenId: ScreenId) => void;
}

export const LessonAssessment: React.FC<LessonAssessmentProps> = ({
  lessonId,
  lessonRecord,
  onSubmitAssessment,
  onNavigate,
}) => {
  const spec = LESSON_ASSESSMENTS[lessonId];
  const reqMeta = LESSON_REQUIREMENTS[lessonId];
  const progress = calculateLessonProgress(lessonId, lessonRecord);
  const lastResult = lessonRecord.assessment.lastResult;

  const [isRetaking, setIsRetaking] = useState<boolean>(() => !lastResult);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswerValue>>({});
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  const questions = spec.questions;

  const isQuestionAnswered = (qId: string): boolean => {
    const q = questions.find((item) => item.id === qId);
    const a = answers[qId];
    if (!q || !a) return false;
    if (q.type === 'multiple-choice' || q.type === 'true-false-reason') return Boolean(a.choiceId);
    if (q.type === 'numerical') return Boolean(a.numericValue && a.numericValue.trim() !== '');
    if (q.type === 'short-answer') return Boolean(a.textValue && a.textValue.trim() !== '');
    if (q.type === 'numerical-direction') {
      return Boolean(a.numericValue && a.numericValue.trim() !== '' && a.directionValue);
    }
    return false;
  };

  const answeredCount = questions.filter((q) => isQuestionAnswered(q.id)).length;

  const updateAnswer = (qId: string, patch: Partial<AssessmentAnswerValue>) => {
    setSubmitWarning(null);
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), ...patch },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount === 0) {
      setSubmitWarning('Please answer at least one question before submitting your assessment.');
      return;
    }
    const graded = gradeAssessment(questions, answers);
    onSubmitAssessment(graded);
    setIsRetaking(false);
    setSubmitWarning(null);
  };

  const handleStartRetake = () => {
    setAnswers({});
    setSubmitWarning(null);
    setIsRetaking(true);
  };

  const showResults = Boolean(lastResult) && !isRetaking;
  const isLesson5 = lessonId === 'lesson-5';
  const continueLabel = isLesson5
    ? 'Continue to Final Module Assessment'
    : 'Continue to Next Lesson';

  return (
    <section
      aria-labelledby={`lesson-assessment-heading-${lessonId}`}
      className="my-10 space-y-6 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      {/* Header + Lesson Mastery Tracker */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.01em] text-[#2563EB]">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>Required End-of-Lesson Assessment</span>
            </p>
            <h2
              id={`lesson-assessment-heading-${lessonId}`}
              className="mt-1 text-xl font-semibold text-[#172033]"
            >
              {spec.title}
            </h2>
            <p className="mt-1 text-sm text-[#475569]">{spec.description}</p>
          </div>

          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-right">
            <p className="text-[11px] font-medium text-[#64748B]">Lesson Progress</p>
            <p
              data-testid={`lesson-progress-pct-${lessonId}`}
              className="font-mono text-base font-bold text-[#172033] tabular-nums"
            >
              {progress.percentage}%
            </p>
          </div>
        </div>

        {/* Transparent Mastery Checklist */}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm">
          <div
            className={`rounded-md border px-3.5 py-2.5 flex items-center justify-between gap-2 ${
              progress.completedActivitiesCount === progress.totalActivitiesCount
                ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]'
            }`}
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  progress.completedActivitiesCount === progress.totalActivitiesCount
                    ? 'text-[#15803D]'
                    : 'text-[#94A3B8]'
                }`}
                aria-hidden="true"
              />
              Required Activities
            </span>
            <span className="font-mono font-semibold tabular-nums">
              {progress.completedActivitiesCount}/{progress.totalActivitiesCount}
            </span>
          </div>

          <div
            className={`rounded-md border px-3.5 py-2.5 flex items-center justify-between gap-2 ${
              progress.assessmentPassed
                ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]'
            }`}
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  progress.assessmentPassed ? 'text-[#15803D]' : 'text-[#94A3B8]'
                }`}
                aria-hidden="true"
              />
              Lesson Assessment (≥ {LESSON_PASSING_THRESHOLD_PERCENT}%)
            </span>
            <span className="font-mono font-semibold tabular-nums">
              {progress.assessmentPassed
                ? `Passed (${progress.assessmentBestScore ?? 70}%)`
                : lessonRecord.assessment.attempts > 0
                ? `Best: ${progress.assessmentBestScore ?? 0}%`
                : 'Not passed'}
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Completion / Unlock Feedback Banner */}
      {progress.completed && (
        <div
          role="status"
          aria-live="polite"
          className="surface-enter rounded-md border border-[#BBF7D0] bg-[#F0FDF4] p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm sm:text-base font-bold text-[#14532D]">
                {isLesson5
                  ? 'All Lessons Mastered — Final Module Assessment Unlocked!'
                  : `Lesson Complete — ${reqMeta.nextScreenLabel} Unlocked!`}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#166534]">
                {isLesson5
                  ? 'You completed the integrated synthesis practice and passed Lesson 5. Continue to the Final Module Assessment when ready.'
                  : 'You completed every required activity and passed this lesson assessment. Your progress is saved.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(reqMeta.nextScreenId)}
            className="group tactile-press shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] min-h-[44px]"
          >
            <span>{continueLabel}</span>
            <ArrowRight
              className="hover-nudge-right h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {!progress.completed && progress.assessmentPassed && progress.incompleteActivityLabels.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="surface-enter rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-sm text-[#1E3A8A]"
        >
          <p className="font-semibold">
            Assessment passed! Complete the remaining required{' '}
            {progress.incompleteActivityLabels.length === 1 ? 'activity' : 'activities'} above to unlock{' '}
            {reqMeta.nextScreenLabel}:
          </p>
          <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs sm:text-sm">
            {progress.incompleteActivityLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      {!progress.completed &&
        !progress.assessmentPassed &&
        progress.completedActivitiesCount === progress.totalActivitiesCount && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm text-[#92400E]"
          >
            <p className="font-semibold">
              All lesson activities complete! Pass this assessment with at least {LESSON_PASSING_THRESHOLD_PERCENT}% to unlock{' '}
              {reqMeta.nextScreenLabel}.
            </p>
          </div>
        )}

      {/* Assessment Form (Taking / Retaking) */}
      {!showResults && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Answer all {questions.length} questions, then submit to check mastery.</span>
            <span className="font-mono font-medium text-[#172033] tabular-nums">
              {answeredCount} / {questions.length} answered
            </span>
          </div>

          <div className="space-y-5">
            {questions.map((q) => {
              const ans = answers[q.id] || {};
              return (
                <div
                  key={q.id}
                  className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5 space-y-3"
                >
                  <p className="text-xs font-medium text-[#64748B]">
                    Question {q.number} of {questions.length}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-[#172033]">{q.prompt}</p>
                  {q.helperText && <p className="text-xs text-[#475569]">{q.helperText}</p>}

                  {(q.type === 'multiple-choice' || q.type === 'true-false-reason') && q.options && (
                    <fieldset className="space-y-2 pt-1">
                      <legend className="sr-only">Question {q.number} options</legend>
                      {q.options.map((opt) => {
                        const isSelected = ans.choiceId === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`tactile-card flex items-start gap-3 rounded-md border p-3 cursor-pointer min-h-[44px] ${
                              isSelected
                                ? 'border-[#2563EB] bg-[#EFF6FF]'
                                : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`lesson-assess-${lessonId}-${q.id}`}
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => updateAnswer(q.id, { choiceId: opt.id })}
                              className="mt-1 h-4 w-4 accent-[#2563EB]"
                            />
                            <span className="text-sm text-[#172033]">{opt.label}</span>
                          </label>
                        );
                      })}
                    </fieldset>
                  )}

                  {q.type === 'numerical' && (
                    <div className="flex items-center gap-2.5 pt-1">
                      <label htmlFor={`la-num-${q.id}`} className="sr-only">
                        Numeric answer in {q.numericUnit}
                      </label>
                      <input
                        id={`la-num-${q.id}`}
                        type="number"
                        step="any"
                        value={ans.numericValue ?? ''}
                        onChange={(e) => updateAnswer(q.id, { numericValue: e.target.value })}
                        placeholder="Enter number"
                        className="w-40 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] min-h-[44px]"
                      />
                      <span className="font-mono text-sm font-semibold text-[#475569]">
                        {q.numericUnit}
                      </span>
                    </div>
                  )}

                  {q.type === 'numerical-direction' && (
                    <div className="grid gap-3 sm:grid-cols-2 pt-1">
                      <div>
                        <label
                          htmlFor={`la-numdir-${q.id}`}
                          className="block text-xs font-medium text-[#334155]"
                        >
                          Magnitude ({q.numericUnit})
                        </label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            id={`la-numdir-${q.id}`}
                            type="number"
                            step="any"
                            value={ans.numericValue ?? ''}
                            onChange={(e) => updateAnswer(q.id, { numericValue: e.target.value })}
                            placeholder="e.g. 3"
                            className="w-32 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] min-h-[44px]"
                          />
                          <span className="font-mono text-xs font-semibold text-[#475569]">
                            {q.numericUnit}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`la-dir-${q.id}`}
                          className="block text-xs font-medium text-[#334155]"
                        >
                          Direction
                        </label>
                        <select
                          id={`la-dir-${q.id}`}
                          value={ans.directionValue ?? ''}
                          onChange={(e) =>
                            updateAnswer(q.id, {
                              directionValue: e.target.value as ResultDirection,
                            })
                          }
                          className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px]"
                        >
                          <option value="">Select direction...</option>
                          <option value="right">To the right</option>
                          <option value="left">To the left</option>
                          <option value="none">Zero (no direction)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {q.type === 'short-answer' && (
                    <div className="pt-1">
                      <label htmlFor={`la-text-${q.id}`} className="sr-only">
                        Short explanation for question {q.number}
                      </label>
                      <textarea
                        id={`la-text-${q.id}`}
                        rows={2}
                        value={ans.textValue ?? ''}
                        onChange={(e) => updateAnswer(q.id, { textValue: e.target.value })}
                        placeholder="Write 1–2 sentences..."
                        className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {submitWarning && (
            <div
              role="alert"
              className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submitWarning}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="tactile-press rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] min-h-[44px]"
            >
              Submit Lesson Assessment
            </button>
            {lastResult && (
              <button
                type="button"
                onClick={() => setIsRetaking(false)}
                className="tactile-press rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
              >
                View Last Result
              </button>
            )}
          </div>
        </form>
      )}

      {/* Assessment Results Review */}
      {showResults && lastResult && (
        <div className="surface-enter space-y-5">
          <div
            className={`rounded-md border p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4 ${
              lastResult.passedThreshold
                ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                : 'border-[#FECACA] bg-[#FEF2F2]'
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-[#475569]">
                Attempt #{lessonRecord.assessment.attempts}
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-bold text-[#172033] tabular-nums">
                Score: {lastResult.score} / {lastResult.totalQuestions} ({lastResult.percentage}%) —{' '}
                {lastResult.passedThreshold ? 'Passed' : 'Not Passed'}
              </h3>
              {lastResult.passedThreshold ? (
                <p className="mt-1 text-sm text-[#14532D]">
                  Great work! You met the {LESSON_PASSING_THRESHOLD_PERCENT}% passing threshold for this lesson assessment.
                </p>
              ) : progress.assessmentPassed ? (
                <p className="mt-1 text-sm text-[#7F1D1D]">
                  This latest attempt scored below {LESSON_PASSING_THRESHOLD_PERCENT}%, but your previously earned passing score (Best: {progress.assessmentBestScore}%) and lesson unlock remain preserved.
                </p>
              ) : (
                <p className="mt-1 text-sm text-[#7F1D1D]">
                  Score at least {LESSON_PASSING_THRESHOLD_PERCENT}% (3 of 4 questions) to pass this lesson assessment. Review the feedback below and retake anytime.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartRetake}
              className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retake Assessment</span>
            </button>
          </div>

          <div className="space-y-3">
            {lastResult.results.map((item) => {
              const qSpec = questions.find((q) => q.id === item.questionId);
              return (
                <div
                  key={item.questionId}
                  className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#475569]">
                      Question {item.questionNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        item.isCorrect ? 'text-[#15803D]' : 'text-[#B91C1C]'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" aria-hidden="true" />
                          Incorrect
                        </>
                      )}
                    </span>
                  </div>
                  {qSpec && <p className="font-semibold text-[#172033]">{qSpec.prompt}</p>}
                  <p className="text-xs text-[#475569]">
                    Your answer: <strong className="text-[#172033]">{item.learnerAnswerDisplay}</strong>
                  </p>
                  <p className="text-[#334155]">{item.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
