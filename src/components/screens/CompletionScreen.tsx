import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { COURSE_INFO, LESSON_NAV_ITEMS, MODULE_OBJECTIVES } from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';
import {
  calculateLessonProgress,
  LESSON_IDS,
  ModuleProgressState,
} from '../../physics/progress';

interface CompletionScreenProps {
  progressState: ModuleProgressState;
  onNavigate: (id: ScreenId) => void;
  onRestartModule: () => void;
  onOpenReference: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  progressState,
  onNavigate,
  onRestartModule,
  onOpenReference,
}) => {
  const [confirmRestart, setConfirmRestart] = useState(false);

  const completedLessonsCount = LESSON_IDS.filter(
    (id) => progressState.lessons[id]?.completed
  ).length;
  const bestScore = progressState.bestFinalAssessmentScore ?? progressState.latestAssessment?.percentage ?? 0;
  const latestScore = progressState.latestAssessment?.percentage ?? bestScore;
  const reflectionText = progressState.reflection.text.trim();

  return (
    <article className="space-y-8">
      {/* Header & Academic Completion Seal */}
      <header className="rounded-md border border-[#BBF7D0] bg-[#F0FDF4] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Clean SVG Academic Seal */}
          <div className="shrink-0">
            <svg
              viewBox="0 0 72 72"
              className="h-16 w-16"
              role="img"
              aria-label="Module 1 completion seal"
            >
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="#FFFFFF"
                stroke="#15803D"
                strokeWidth="2.5"
              />
              <circle
                cx="36"
                cy="36"
                r="26"
                fill="#F0FDF4"
                stroke="#86EFAC"
                strokeWidth="1.5"
              />
              <path
                d="M24 37l8 8 16-18"
                fill="none"
                stroke="#15803D"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.01em] text-[#15803D]">
              {COURSE_INFO.courseTitle} · {COURSE_INFO.moduleLabel}
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#172033]">
              Module 1 Complete: {COURSE_INFO.moduleTitle}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#334155]">
              Well done! You completed all five lessons, hands-on interactive exercises, and passed the Final Module Assessment. You now have a strong conceptual and quantitative toolkit for forces, inertia, acceleration, and interaction pairs.
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3 border-t border-[#BBF7D0] pt-5 text-sm">
          <div className="rounded border border-[#BBF7D0] bg-white px-4 py-3">
            <span className="text-xs font-medium text-[#475569]">Lessons Completed</span>
            <p className="mt-0.5 font-mono text-lg font-bold text-[#15803D] tabular-nums">
              {completedLessonsCount} / {LESSON_IDS.length}
            </p>
          </div>
          <div className="rounded border border-[#BBF7D0] bg-white px-4 py-3">
            <span className="text-xs font-medium text-[#475569]">Final Assessment Score</span>
            <p className="mt-0.5 font-mono text-lg font-bold text-[#172033] tabular-nums">
              Best: {bestScore}%
            </p>
            <p className="text-xs font-mono text-[#475569] tabular-nums">
              Latest attempt: {latestScore}%
            </p>
          </div>
          <div className="rounded border border-[#BBF7D0] bg-white px-4 py-3">
            <span className="text-xs font-medium text-[#475569]">Module Status</span>
            <p className="mt-0.5 font-semibold text-[#15803D]">
              Mastery Benchmark Met
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#475569]">
          Self-paced study record saved locally in your browser. This summary tracks personal learning progress only and is not an official certificate or institutional accreditation.
        </p>
      </header>

      {/* Individual Lesson Statuses */}
      <section aria-labelledby="completion-lessons-heading" className="space-y-3">
        <h2 id="completion-lessons-heading" className="text-xl font-semibold text-[#172033]">
          Lesson-by-Lesson Completion Record
        </h2>
        <div className="grid gap-2.5">
          {LESSON_IDS.map((id) => {
            const nav = LESSON_NAV_ITEMS.find((item) => item.id === id)!;
            const summary = calculateLessonProgress(id, progressState.lessons[id]);
            return (
              <div
                key={id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#172033]">
                      {nav.shortLabel}: {nav.title}
                    </p>
                    <p className="text-xs text-[#475569]">
                      Activities {summary.completedActivitiesCount}/{summary.totalActivitiesCount} · Best quiz score:{' '}
                      <span className="font-mono font-semibold">{summary.assessmentBestScore ?? 100}%</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="tactile-press rounded border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-50 min-h-[38px]"
                >
                  Review {nav.shortLabel}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Concepts Covered */}
      <section aria-labelledby="completion-concepts-heading" className="space-y-3">
        <h2 id="completion-concepts-heading" className="text-xl font-semibold text-[#172033]">
          Key Concepts Mastered
        </h2>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {MODULE_OBJECTIVES.map((obj) => (
            <li
              key={obj.number}
              className="rounded-md border border-[#E2E8F0] bg-white p-3.5 text-sm text-[#334155] flex items-start gap-2.5"
            >
              <span className="font-mono text-xs font-bold text-[#1D4ED8] mt-0.5">
                0{obj.number}
              </span>
              <span>{obj.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Reflection Activity Reminder */}
      <section
        aria-labelledby="completion-reflection-heading"
        className="rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-5 space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="completion-reflection-heading" className="text-base font-semibold text-[#172033] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span>Personal Reflection: “Physics Around Me”</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('lesson-5')}
            className="tactile-press text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            {reflectionText ? 'View or Edit in Lesson 5 →' : 'Complete Optional Reflection in Lesson 5 →'}
          </button>
        </div>
        {reflectionText ? (
          <p className="rounded border border-[#E2E8F0] bg-white p-3 text-sm text-[#334155] whitespace-pre-line">
            {reflectionText}
          </p>
        ) : (
          <p className="text-sm text-[#475569]">
            You haven’t written notes for the optional “Physics Around Me” reflection in Lesson 5 yet. Consider adding a quick observation about forces in your daily routine whenever you revisit Lesson 5.
          </p>
        )}
      </section>

      {/* Actions */}
      <section className="border-t border-[#E2E8F0] pt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('lesson-1')}
            className="tactile-press inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] min-h-[44px]"
          >
            <span>Review Lessons</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
          >
            <span>View My Progress</span>
          </button>

          <button
            type="button"
            onClick={onOpenReference}
            className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
          >
            <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span>Glossary & Formulas</span>
          </button>

          {!confirmRestart && (
            <button
              type="button"
              onClick={() => setConfirmRestart(true)}
              className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Restart Module</span>
            </button>
          )}
        </div>

        {confirmRestart && (
          <div
            role="alertdialog"
            aria-label="Confirm restarting module"
            className="surface-enter rounded-md border border-[#FECACA] bg-[#FEF2F2] p-4 flex flex-wrap items-center justify-between gap-3 text-sm"
          >
            <p className="font-medium text-[#991B1B]">
              Restart Module 1 from the beginning? This clears all saved lesson progress, assessment scores, and reflection notes.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onRestartModule();
                  setConfirmRestart(false);
                }}
                className="tactile-press rounded bg-[#B91C1C] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#991B1B] min-h-[40px]"
              >
                Confirm Restart
              </button>
              <button
                type="button"
                onClick={() => setConfirmRestart(false)}
                className="tactile-press rounded border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 min-h-[40px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </article>
  );
};
