import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Lock,
  RotateCcw,
} from 'lucide-react';
import {
  COURSE_INFO,
  COURSE_OVERVIEW_DETAILS,
  LESSON_NAV_ITEMS,
  MODULE_OBJECTIVES,
} from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';
import {
  calculateLessonProgress,
  calculateOverallModuleProgress,
  canAccessScreen,
  getResumeTarget,
  LESSON_IDS,
  ModuleProgressState,
} from '../../physics/progress';

interface WelcomeScreenProps {
  progressState: ModuleProgressState;
  onStartLearning: () => void;
  onResumeLearning: () => void;
  onNavigate: (id: ScreenId) => void;
  onLockedAttempt: (id: ScreenId) => void;
  onOpenReference: () => void;
  onRestartCourse: () => void;
}

const STAGGER_DELAYS_MS = [0, 35, 65, 90, 110, 125];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  progressState,
  onStartLearning,
  onResumeLearning,
  onNavigate,
  onLockedAttempt,
  onOpenReference,
  onRestartCourse,
}) => {
  const [confirmRestart, setConfirmRestart] = useState(false);

  const { completedLessonsCount, percentage } = calculateOverallModuleProgress(progressState);
  const resume = getResumeTarget(progressState);
  const resumeNav = LESSON_NAV_ITEMS.find((i) => i.id === resume.screenId);

  return (
    <article className="space-y-8">
      {/* Header / Orientation Intro */}
      <header className="border-b border-[#E2E8F0] pb-6">
        <p className="text-xs font-semibold tracking-[0.01em] text-[#1D4ED8]">
          {COURSE_INFO.courseTitle} · {COURSE_INFO.moduleLabel}
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#172033]">
          {COURSE_INFO.moduleTitle}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#475569]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#475569]" aria-hidden="true" />
            Estimated duration: 2 hours
          </span>
          <span aria-hidden="true">·</span>
          <span>{COURSE_OVERVIEW_DETAILS.audienceLabel}</span>
          <span aria-hidden="true">·</span>
          <span>5 Lessons + 10-Question Assessment</span>
        </div>

        <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#334155]">
          {COURSE_INFO.welcomeIntro}
        </p>

        {/* Primary CTA Actions: Start or Resume Learning + Glossary */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {resume.hasStarted ? (
            <button
              type="button"
              onClick={onResumeLearning}
              className="group tactile-press inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#1D4ED8] min-h-[44px]"
            >
              <span>
                {progressState.moduleCompleted
                  ? 'View Module Completion'
                  : `Resume Learning: ${resumeNav?.shortLabel ?? 'Lesson 1'}`}
              </span>
              <ArrowRight
                className="hover-nudge-right h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                aria-hidden="true"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartLearning}
              className="group tactile-press inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#1D4ED8] min-h-[44px]"
            >
              <span>Start Learning</span>
              <ArrowRight
                className="hover-nudge-right h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                aria-hidden="true"
              />
            </button>
          )}

          {resume.hasStarted && !progressState.moduleCompleted && (
            <button
              type="button"
              onClick={onStartLearning}
              className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              <span>Review Lesson 1</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenReference}
            className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
          >
            <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span>Glossary & Formulas</span>
          </button>
        </div>

        {resume.hasStarted && resume.sectionLabel && !progressState.moduleCompleted && (
          <p className="mt-2.5 text-xs text-[#475569]">
            Saved bookmark in {resumeNav?.shortLabel}: <strong className="text-[#172033]">{resume.sectionLabel}</strong>
          </p>
        )}
      </header>

      {/* Real-World Opening Scenario + Why It Matters */}
      <section
        aria-labelledby="opening-scenario-heading"
        className="rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-5 sm:p-6 space-y-3"
      >
        <h2 id="opening-scenario-heading" className="text-lg sm:text-xl font-semibold text-[#172033]">
          {COURSE_OVERVIEW_DETAILS.openingScenarioTitle}
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[#334155]">
          {COURSE_OVERVIEW_DETAILS.openingScenarioBody}
        </p>
        <p className="text-sm text-[#1E3A8A] border-t border-[#BFDBFE] pt-3">
          <strong>Why it matters in everyday life:</strong> {COURSE_OVERVIEW_DETAILS.whyItMatters}
        </p>
      </section>

      {/* Progress Overview Panel (shown whenever learner has started or wants quick overview) */}
      {resume.hasStarted && (
        <section
          aria-labelledby="welcome-progress-heading"
          className="rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="welcome-progress-heading" className="text-lg font-semibold text-[#172033]">
                Your Module Progress Overview
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                {completedLessonsCount} of {LESSON_IDS.length} lessons completed · Overall module progress{' '}
                <strong className="font-mono text-[#172033]">{percentage}%</strong>
                {progressState.bestFinalAssessmentScore !== null && (
                  <>
                    {' '}
                    · Best Final Assessment:{' '}
                    <strong className="font-mono text-[#172033]">
                      {progressState.bestFinalAssessmentScore}%
                    </strong>
                  </>
                )}
              </p>
            </div>

            {progressState.moduleCompleted && (
              <button
                type="button"
                onClick={() => onNavigate('completion')}
                className="tactile-press inline-flex items-center gap-1.5 rounded-md bg-[#15803D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#166534] min-h-[40px]"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Completion Summary</span>
              </button>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {LESSON_IDS.map((id) => {
              const nav = LESSON_NAV_ITEMS.find((i) => i.id === id)!;
              const summary = calculateLessonProgress(id, progressState.lessons[id]);
              return (
                <div
                  key={id}
                  className="rounded border border-[#E2E8F0] bg-white p-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#172033] truncate">
                      {nav.shortLabel}: {nav.title}
                    </p>
                    <p className="text-xs text-[#475569] tabular-nums">
                      {summary.completed
                        ? 'Completed (100%)'
                        : summary.unlocked
                        ? `In progress (${summary.percentage}%)`
                        : 'Locked'}
                    </p>
                  </div>
                  {summary.unlocked ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(id)}
                      className="tactile-press shrink-0 rounded border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-medium text-[#1D4ED8] hover:bg-[#EFF6FF] min-h-[36px]"
                    >
                      {summary.completed ? 'Review' : 'Open'}
                    </button>
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-[#475569]" aria-label="Locked" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-3">
            <span className="text-xs text-[#475569]">
              Reflection (“Physics Around Me”):{' '}
              <strong className="text-[#172033]">
                {progressState.reflection.text.trim() ? 'Saved locally' : 'Not written yet'}
              </strong>
            </span>

            {!confirmRestart ? (
              <button
                type="button"
                onClick={() => setConfirmRestart(true)}
                className="tactile-press inline-flex items-center gap-1.5 rounded border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] hover:bg-slate-50 min-h-[38px]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restart Course</span>
              </button>
            ) : (
              <div
                role="alertdialog"
                aria-label="Confirm restart course"
                className="flex flex-wrap items-center gap-2 text-xs"
              >
                <span className="font-medium text-[#991B1B]">Clear all progress?</span>
                <button
                  type="button"
                  onClick={() => {
                    onRestartCourse();
                    setConfirmRestart(false);
                  }}
                  className="tactile-press rounded bg-[#B91C1C] px-2.5 py-1.5 font-medium text-white hover:bg-[#991B1B] min-h-[36px]"
                >
                  Confirm Restart
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRestart(false)}
                  className="tactile-press rounded border border-[#CBD5E1] bg-white px-2.5 py-1.5 font-medium text-[#334155] min-h-[36px]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Learning Objectives */}
      <section aria-labelledby="welcome-objectives-heading">
        <h2 id="welcome-objectives-heading" className="text-xl font-semibold text-[#172033]">
          What You Will Learn (Module Objectives)
        </h2>
        <p className="mt-1.5 text-sm text-[#475569]">
          By the end of Module 1, you will be able to:
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {MODULE_OBJECTIVES.map((obj, idx) => {
            const targetLesson =
              obj.lessonId === 'lesson-1'
                ? 'Lesson 1'
                : obj.lessonId === 'lesson-2'
                ? 'Lesson 2'
                : obj.lessonId === 'lesson-3'
                ? 'Lesson 3'
                : obj.lessonId === 'lesson-4'
                ? 'Lesson 4'
                : 'Lesson 5';
            const isUnlocked = canAccessScreen(progressState, obj.lessonId);
            return (
              <li
                key={obj.number}
                style={{ animationDelay: `${STAGGER_DELAYS_MS[idx] ?? 125}ms` }}
                className="stagger-item rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-start gap-3"
              >
                <span className="font-mono text-xs font-bold text-[#1D4ED8] mt-0.5 tabular-nums">
                  0{obj.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#172033]">{obj.text}</p>
                  <button
                    type="button"
                    onClick={() =>
                      isUnlocked ? onNavigate(obj.lessonId) : onLockedAttempt(obj.lessonId)
                    }
                    aria-disabled={!isUnlocked ? 'true' : undefined}
                    tabIndex={!isUnlocked ? -1 : 0}
                    className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
                      isUnlocked
                        ? 'tactile-press text-[#1D4ED8] hover:underline'
                        : 'text-[#475569] cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked && <Lock className="h-3 w-3 text-[#475569]" aria-hidden="true" />}
                    <span>{isUnlocked ? `Go to ${targetLesson}` : `${targetLesson} (Locked)`}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Short Study Guide: How Lessons, Activities, Assessments, and Progress Work */}
      <section aria-labelledby="welcome-guide-heading" className="border-t border-[#E2E8F0] pt-6 space-y-4">
        <h2 id="welcome-guide-heading" className="text-xl font-semibold text-[#172033] flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
          <span>How Lessons, Activities, Assessments, and Progress Work</span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COURSE_OVERVIEW_DETAILS.studyGuideSteps.map((step) => (
            <div key={step.title} className="rounded-md border border-[#E2E8F0] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#172033]">{step.title}</h3>
              <p className="mt-1 text-sm text-[#475569]">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prerequisites, Materials & Course Scope Note */}
      <section className="grid gap-6 sm:grid-cols-2 border-t border-[#E2E8F0] pt-6">
        <div>
          <h2 className="text-lg font-semibold text-[#172033] flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span>Prerequisite Knowledge & Materials</span>
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[#334155] list-disc pl-5">
            <li>Introductory arithmetic (addition, subtraction, multiplication, and division).</li>
            <li>Basic familiarity with speed, distance, and direction.</li>
            <li>
              <strong>Materials:</strong> A basic calculator (optional) and paper for scratch calculations.
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-[#E2E8F0] bg-[#F5F7FA] p-5 text-sm text-[#334155]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#172033]">Course Context ({COURSE_INFO.totalCourseTime})</p>
              <p className="mt-1">
                This module is the first part of a three-module introductory physics course. Here we focus on core forces, net force, inertia, and Newton’s three laws. Detailed friction models and multi-dimensional free-body diagrams are introduced briefly as context and explored in full in Module 2.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
