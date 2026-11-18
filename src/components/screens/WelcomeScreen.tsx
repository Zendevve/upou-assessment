import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, Lock } from 'lucide-react';
import { COURSE_INFO, MODULE_OBJECTIVES } from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';
import {
  calculateOverallModuleProgress,
  canAccessScreen,
  ModuleProgressState,
} from '../../physics/progress';

interface WelcomeScreenProps {
  progressState: ModuleProgressState;
  onStartLearning: () => void;
  onNavigate: (id: ScreenId) => void;
  onLockedAttempt: (id: ScreenId) => void;
}

const STAGGER_DELAYS_MS = [0, 35, 65, 90, 110, 125];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  progressState,
  onStartLearning,
  onNavigate,
  onLockedAttempt,
}) => {
  const { completedCount } = calculateOverallModuleProgress(progressState);
  const hasStarted =
    completedCount > 0 ||
    Object.keys(progressState.lessons['lesson-1'].activities).length > 0 ||
    progressState.lessons['lesson-1'].assessment.attempts > 0;

  return (
    <article className="space-y-8">
      {/* Header / Orientation Intro */}
      <header className="border-b border-[#E2E8F0] pb-6">
        <p className="text-xs font-semibold tracking-[0.01em] text-[#2563EB]">
          {COURSE_INFO.courseTitle} · {COURSE_INFO.moduleLabel}
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#172033]">
          {COURSE_INFO.moduleTitle}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#475569]" aria-hidden="true" />
            Estimated time: {COURSE_INFO.estimatedTime}
          </span>
          <span aria-hidden="true">·</span>
          <span>Self-paced independent study</span>
          <span aria-hidden="true">·</span>
          <span>5 Lessons + 10-Question Assessment</span>
        </div>

        <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#334155]">
          {COURSE_INFO.welcomeIntro}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartLearning}
            className="group tactile-press inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-[#1D4ED8] min-h-[44px]"
          >
            <span>{hasStarted ? 'Continue to Lesson 1' : 'Start Learning'}</span>
            <ArrowRight
              className="hover-nudge-right h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

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
                <span className="font-mono text-xs font-bold text-[#2563EB] mt-0.5 tabular-nums">
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
                        ? 'tactile-press text-[#2563EB] hover:underline'
                        : 'text-[#64748B] cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked && <Lock className="h-3 w-3 text-[#94A3B8]" aria-hidden="true" />}
                    <span>{isUnlocked ? `Go to ${targetLesson}` : `${targetLesson} (Locked)`}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Prerequisites & Materials */}
      <section aria-labelledby="welcome-prep-heading" className="grid gap-6 sm:grid-cols-2 border-t border-[#E2E8F0] pt-6">
        <div>
          <h2 id="welcome-prep-heading" className="text-lg font-semibold text-[#172033] flex items-center gap-2">
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

        <div>
          <h2 className="text-lg font-semibold text-[#172033] flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            <span>How This Module Works</span>
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[#334155] list-disc pl-5">
            <li>
              <strong>Sequential mastery progression:</strong> Start with Lesson 1 and unlock each subsequent lesson by completing all interactive activities and scoring at least 70% on that lesson’s assessment. Unlocked lessons stay open for review anytime.
            </li>
            <li>
              <strong>Interactive practice:</strong> Every lesson includes hands-on physics activities and a quick knowledge check with immediate explanations.
            </li>
            <li>
              <strong>Final assessment:</strong> Finish with a 10-question assessment (70% mastery benchmark) with full answer review. Progress is saved locally in your browser without collecting personal information.
            </li>
          </ul>
        </div>
      </section>

      {/* Course Scope Note */}
      <section className="rounded-md border border-[#E2E8F0] bg-[#F5F7FA] p-5 text-sm text-[#334155]">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#172033]">Course Context ({COURSE_INFO.totalCourseTime})</p>
            <p className="mt-1">
              This module is the first part of a three-module introductory physics course. Here we focus on core forces, net force, inertia, and Newton’s three laws. Detailed friction models and multi-dimensional free-body diagrams are introduced briefly as context and explored in full in Module 2.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
