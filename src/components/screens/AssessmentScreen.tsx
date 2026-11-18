import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Printer,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { FINAL_ASSESSMENT_QUESTIONS, LESSON_NAV_ITEMS } from '../../data/moduleContent';
import {
  AssessmentAnswerValue,
  AssessmentResultSummary,
  FORMATIVE_MASTERY_THRESHOLD_PERCENT,
  gradeAssessment,
  ResultDirection,
  ScreenId,
} from '../../physics/calculations';
import { LessonHeader } from '../common/Blocks';

interface AssessmentScreenProps {
  completedScreens: ScreenId[];
  assessmentAttempts: number;
  latestAssessment: AssessmentResultSummary | null;
  onSubmitAssessment: (result: AssessmentResultSummary) => void;
  onNavigate: (id: ScreenId) => void;
}

type ViewMode = 'taking' | 'confirm' | 'results';

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  completedScreens,
  assessmentAttempts,
  latestAssessment,
  onSubmitAssessment,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(latestAssessment ? 'results' : 'taking');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswerValue>>({});

  const questions = FINAL_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ.id] || {};

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
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), ...patch },
    }));
  };

  const handleConfirmSubmit = () => {
    const graded = gradeAssessment(questions, answers);
    onSubmitAssessment(graded);
    setViewMode('results');
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setViewMode('taking');
  };

  const completedLessonsCount = completedScreens.filter((id) => id.startsWith('lesson-')).length;

  return (
    <article>
      <LessonHeader
        breadcrumbLabel="Final Assessment"
        title="Final Module Assessment"
        duration="20 min"
        objectiveTag="Objectives 1–6"
        isCompleted={Boolean(latestAssessment)}
      />

      {/* Taking Questions One at a Time */}
      {viewMode === 'taking' && (
        <div className="mt-6 space-y-6">
          {/* Assessment Info & Progress */}
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-[#172033] tabular-nums">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="font-mono text-[#475569] tabular-nums">
                {answeredCount} of {questions.length} answered
              </span>
            </div>

            {/* Question Navigator Dots / Numbers */}
            <nav aria-label="Assessment question index" className="mt-3 flex flex-wrap gap-1.5">
              {questions.map((q, idx) => {
                const active = idx === currentIndex;
                const answered = isQuestionAnswered(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Question ${q.number}${answered ? ', answered' : ', unanswered'}`}
                    aria-current={active ? 'step' : undefined}
                    className={`h-9 w-9 rounded-md font-mono text-xs font-semibold border transition-colors ${
                      active
                        ? 'border-[#2563EB] bg-[#2563EB] text-white'
                        : answered
                        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                        : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-100'
                    }`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Active Question Card */}
          <section
            aria-labelledby="assessment-question-heading"
            className="rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
          >
            <p className="text-xs font-medium text-[#64748B]">
              Question {currentQ.number} · Aligns with Objective {currentQ.objectiveNumber}
            </p>
            <h2
              id="assessment-question-heading"
              className="mt-2 text-lg sm:text-xl font-semibold text-[#172033] leading-snug"
            >
              {currentQ.prompt}
            </h2>
            {currentQ.helperText && (
              <p className="mt-1.5 text-sm text-[#475569]">{currentQ.helperText}</p>
            )}

            <div className="mt-5">
              {(currentQ.type === 'multiple-choice' || currentQ.type === 'true-false-reason') &&
                currentQ.options && (
                  <fieldset className="space-y-2.5">
                    <legend className="sr-only">Answer choices for question {currentQ.number}</legend>
                    {currentQ.options.map((opt) => {
                      const isSelected = currentAnswer.choiceId === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 rounded-md border p-3.5 cursor-pointer transition-colors min-h-[44px] ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#EFF6FF]'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`assess-${currentQ.id}`}
                            value={opt.id}
                            checked={isSelected}
                            onChange={() => updateAnswer(currentQ.id, { choiceId: opt.id })}
                            className="mt-1 h-4 w-4 accent-[#2563EB]"
                          />
                          <span className="text-sm sm:text-base text-[#172033]">{opt.label}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}

              {currentQ.type === 'numerical' && (
                <div>
                  <label htmlFor={`num-${currentQ.id}`} className="block text-sm font-medium text-[#334155]">
                    Numeric Answer ({currentQ.numericUnit})
                  </label>
                  <div className="mt-2 flex items-center gap-2.5">
                    <input
                      id={`num-${currentQ.id}`}
                      type="number"
                      step="any"
                      value={currentAnswer.numericValue ?? ''}
                      onChange={(e) => updateAnswer(currentQ.id, { numericValue: e.target.value })}
                      placeholder="Enter number"
                      className="w-40 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2.5 font-mono text-base text-[#172033] min-h-[44px]"
                    />
                    <span className="font-mono text-sm font-semibold text-[#475569]">
                      {currentQ.numericUnit}
                    </span>
                  </div>
                </div>
              )}

              {currentQ.type === 'short-answer' && (
                <div>
                  <label htmlFor={`text-${currentQ.id}`} className="block text-sm font-medium text-[#334155]">
                    Your Explanation
                  </label>
                  <textarea
                    id={`text-${currentQ.id}`}
                    rows={3}
                    value={currentAnswer.textValue ?? ''}
                    onChange={(e) => updateAnswer(currentQ.id, { textValue: e.target.value })}
                    placeholder="Write 1–2 sentences explaining why they do not cancel..."
                    className="mt-2 w-full rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm sm:text-base text-[#172033]"
                  />
                </div>
              )}

              {currentQ.type === 'numerical-direction' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`num-dir-${currentQ.id}`} className="block text-sm font-medium text-[#334155]">
                      Acceleration Magnitude ({currentQ.numericUnit})
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id={`num-dir-${currentQ.id}`}
                        type="number"
                        step="any"
                        value={currentAnswer.numericValue ?? ''}
                        onChange={(e) => updateAnswer(currentQ.id, { numericValue: e.target.value })}
                        placeholder="e.g. 2"
                        className="w-36 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2.5 font-mono text-base text-[#172033] min-h-[44px]"
                      />
                      <span className="font-mono text-sm font-semibold text-[#475569]">
                        {currentQ.numericUnit}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`dir-select-${currentQ.id}`} className="block text-sm font-medium text-[#334155]">
                      Direction of Acceleration
                    </label>
                    <select
                      id={`dir-select-${currentQ.id}`}
                      value={currentAnswer.directionValue ?? ''}
                      onChange={(e) =>
                        updateAnswer(currentQ.id, {
                          directionValue: e.target.value as ResultDirection,
                        })
                      }
                      className="mt-2 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#172033] min-h-[44px]"
                    >
                      <option value="">Select direction...</option>
                      <option value="right">To the right</option>
                      <option value="left">To the left</option>
                      <option value="none">Zero acceleration (no direction)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Question Navigation Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous Question</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] min-h-[44px]"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewMode('confirm')}
                  className="inline-flex items-center gap-2 rounded-md bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] min-h-[44px]"
                >
                  <span>Review & Submit Assessment</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Allow jumping straight to submit confirmation anytime */}
          {currentIndex < questions.length - 1 && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setViewMode('confirm')}
                className="text-xs font-medium text-[#2563EB] hover:underline"
              >
                Finish and review before submitting ({answeredCount}/{questions.length} answered)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pre-Submission Confirmation */}
      {viewMode === 'confirm' && (
        <section
          aria-labelledby="confirm-submit-heading"
          className="mt-6 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-6 space-y-4"
        >
          <h2 id="confirm-submit-heading" className="text-xl font-semibold text-[#172033]">
            Confirm Assessment Submission
          </h2>
          <p className="text-sm sm:text-base text-[#334155]">
            You have answered <strong className="font-mono tabular-nums">{answeredCount}</strong> out of{' '}
            <strong className="font-mono tabular-nums">{questions.length}</strong> questions.
          </p>

          {answeredCount < questions.length && (
            <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm text-[#92400E] flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Some questions are still unanswered</p>
                <p className="mt-0.5">
                  Unanswered questions:{' '}
                  {questions
                    .filter((q) => !isQuestionAnswered(q.id))
                    .map((q) => `Q${q.number}`)
                    .join(', ')}
                  . You can return to complete them or submit as is.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] min-h-[44px]"
            >
              Submit Final Assessment
            </button>
            <button
              type="button"
              onClick={() => setViewMode('taking')}
              className="rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              Return to Questions
            </button>
          </div>
        </section>
      )}

      {/* Results, Answer Review & Module Completion Summary */}
      {viewMode === 'results' && latestAssessment && (
        <div className="mt-6 space-y-8">
          {/* Completion & Score Summary Banner */}
          <section
            aria-labelledby="assessment-score-heading"
            className={`rounded-md border p-6 ${
              latestAssessment.passedThreshold
                ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                : 'border-[#FDE68A] bg-[#FFFBEB]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award
                  className={`h-7 w-7 shrink-0 mt-0.5 ${
                    latestAssessment.passedThreshold ? 'text-[#15803D]' : 'text-[#B45309]'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold text-[#475569]">
                    Module 1 Completion Summary · Attempt #{assessmentAttempts}
                  </p>
                  <h2 id="assessment-score-heading" className="mt-1 text-2xl font-bold text-[#172033] tabular-nums">
                    Score: {latestAssessment.score} / {latestAssessment.totalQuestions} ({latestAssessment.percentage}%)
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-[#334155]">
                    {latestAssessment.passedThreshold ? (
                      <>
                        <strong>Formative Mastery Benchmark Met (≥ {FORMATIVE_MASTERY_THRESHOLD_PERCENT}%):</strong>{' '}
                        You demonstrated solid understanding across force concepts and Newton’s three laws. Review any missed items below before moving forward.
                      </>
                    ) : (
                      <>
                        <strong>Suggested Review Recommended (Below {FORMATIVE_MASTERY_THRESHOLD_PERCENT}% Benchmark):</strong>{' '}
                        This {FORMATIVE_MASTERY_THRESHOLD_PERCENT}% target is a formative self-check guide, not a barrier. You have completed the assessment—review the explanations below and revisit any highlighted lessons to strengthen your understanding, or retry anytime.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="no-print flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] min-h-[44px]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>Retry Assessment</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>Print Summary</span>
                </button>
              </div>
            </div>

            {/* Module Progress Summary Strip */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3 border-t border-black/10 pt-4 text-xs sm:text-sm">
              <div className="rounded bg-white/80 border border-[#E2E8F0] px-3.5 py-2.5">
                <span className="text-[#64748B]">Lessons Completed</span>
                <p className="mt-0.5 font-mono font-semibold text-[#172033] tabular-nums">
                  {completedLessonsCount} / 5 lessons
                </p>
              </div>
              <div className="rounded bg-white/80 border border-[#E2E8F0] px-3.5 py-2.5">
                <span className="text-[#64748B]">Assessment Attempts</span>
                <p className="mt-0.5 font-mono font-semibold text-[#172033] tabular-nums">
                  {assessmentAttempts}
                </p>
              </div>
              <div className="rounded bg-white/80 border border-[#E2E8F0] px-3.5 py-2.5">
                <span className="text-[#64748B]">Course Continuity</span>
                <p className="mt-0.5 font-medium text-[#172033]">
                  Ready for Module 2 (Friction & FBDs)
                </p>
              </div>
            </div>
          </section>

          {/* Question-by-Question Answer Review */}
          <section aria-labelledby="answer-review-heading" className="space-y-4">
            <h3 id="answer-review-heading" className="text-xl font-semibold text-[#172033]">
              Answer Review & Explanations
            </h3>

            {latestAssessment.results.map((item) => {
              const qSpec = questions.find((q) => q.id === item.questionId)!;
              const lessonNav = LESSON_NAV_ITEMS.find((l) => l.id === item.lessonReferenceId);
              return (
                <div
                  key={item.questionId}
                  className="rounded-md border border-[#E2E8F0] bg-white p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-xs font-medium text-[#64748B]">
                      Question {item.questionNumber} · Objective {item.objectiveNumber}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
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

                  <p className="text-sm sm:text-base font-semibold text-[#172033]">
                    {qSpec.prompt}
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2 text-sm">
                    <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <span className="text-xs font-medium text-[#64748B]">Your Answer</span>
                      <p className="mt-0.5 text-[#172033]">{item.learnerAnswerDisplay}</p>
                    </div>
                    <div className="rounded border border-[#BBF7D0] bg-[#F0FDF4] p-3">
                      <span className="text-xs font-medium text-[#15803D]">Expected Answer</span>
                      <p className="mt-0.5 font-medium text-[#14532D]">{item.correctAnswerDisplay}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#334155]">{item.explanation}</p>

                  {lessonNav && (
                    <div className="no-print pt-1">
                      <button
                        type="button"
                        onClick={() => onNavigate(lessonNav.id)}
                        className="text-xs font-medium text-[#2563EB] hover:underline"
                      >
                        Revisit {lessonNav.shortLabel}: {lessonNav.title} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      )}
    </article>
  );
};
