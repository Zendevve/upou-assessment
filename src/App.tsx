import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileHeader } from './components/Layout/MobileHeader';
import { ReferenceLibraryModal } from './components/common/ReferenceLibraryModal';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { Lesson1Forces } from './components/screens/Lesson1Forces';
import { Lesson2FirstLaw } from './components/screens/Lesson2FirstLaw';
import { Lesson3SecondLaw } from './components/screens/Lesson3SecondLaw';
import { Lesson4ThirdLaw } from './components/screens/Lesson4ThirdLaw';
import { Lesson5Synthesis } from './components/screens/Lesson5Synthesis';
import { AssessmentScreen } from './components/screens/AssessmentScreen';
import { CompletionScreen } from './components/screens/CompletionScreen';
import {
  AssessmentResultSummary,
  MODULE_SCREEN_IDS,
  ScreenId,
} from './physics/calculations';
import {
  attemptNavigate,
  canAccessScreen,
  getResumeTarget,
  LESSON_IDS,
  LessonId,
  LOCKED_COMPLETION_MESSAGE,
  LOCKED_LESSON_MESSAGE,
  ModuleProgressState,
  recordActivityCompleted,
  recordFinalAssessmentResult,
  recordLessonAssessmentResult,
  recordReflection,
  recordSectionVisit,
  ReflectionRecord,
} from './physics/progress';
import {
  loadProgressState,
  resetProgressState,
  saveProgressState,
} from './utils/storage';

function isValidScreenId(value: string | null): value is ScreenId {
  return Boolean(value && (MODULE_SCREEN_IDS as readonly string[]).includes(value));
}

function parseRequestedScreenFromLocation(): {
  requestedScreen: ScreenId | null;
  hasExplicitScreenParam: boolean;
} {
  if (typeof window === 'undefined') {
    return { requestedScreen: null, hasExplicitScreenParam: false };
  }
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen');
  if (screenParam !== null) {
    return {
      requestedScreen: isValidScreenId(screenParam) ? screenParam : null,
      hasExplicitScreenParam: true,
    };
  }
  const hashId = window.location.hash.replace(/^#/, '');
  if (hashId) {
    return {
      requestedScreen: isValidScreenId(hashId) ? hashId : null,
      hasExplicitScreenParam: true,
    };
  }
  if (params.get('autostart') === '1') {
    return { requestedScreen: 'lesson-1', hasExplicitScreenParam: false };
  }
  return { requestedScreen: null, hasExplicitScreenParam: false };
}

function buildUrlForScreen(screenId: ScreenId): string {
  const url = new URL(window.location.href);
  url.searchParams.set('screen', screenId);
  url.hash = '';
  return `${url.pathname}${url.search}`;
}

export default function App() {
  const [initialBoot] = useState<{
    progress: ModuleProgressState;
    initialLockNotice: string | null;
  }>(() => {
    const loaded = loadProgressState();
    if (typeof window === 'undefined') {
      return { progress: loaded, initialLockNotice: null };
    }

    const { requestedScreen, hasExplicitScreenParam } = parseRequestedScreenFromLocation();
    if (requestedScreen) {
      const check = attemptNavigate(loaded, requestedScreen);
      if (check.allowed) {
        return { progress: check.nextState, initialLockNotice: null };
      }
      window.history.replaceState(
        { screenId: loaded.currentScreen },
        '',
        buildUrlForScreen(loaded.currentScreen)
      );
      return {
        progress: loaded,
        initialLockNotice: check.lockReason ?? LOCKED_LESSON_MESSAGE,
      };
    }

    if (hasExplicitScreenParam) {
      window.history.replaceState(
        { screenId: loaded.currentScreen },
        '',
        buildUrlForScreen(loaded.currentScreen)
      );
    }

    return { progress: loaded, initialLockNotice: null };
  });

  const [progress, setProgress] = useState<ModuleProgressState>(initialBoot.progress);
  const [lockNotice, setLockNotice] = useState<string | null>(initialBoot.initialLockNotice);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [pendingScrollSectionId, setPendingScrollSectionId] = useState<string | null>(null);

  const mainRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    saveProgressState(progress);
  }, [progress]);

  // Smoothly scroll to a bookmarked section when resuming learning
  useEffect(() => {
    if (!pendingScrollSectionId) return;
    const targetId = pendingScrollSectionId;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setPendingScrollSectionId(null);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pendingScrollSectionId, progress.currentScreen]);

  // Automatically record visible lesson sections for accurate "Resume Learning" bookmarks
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const container = mainRef.current;
    if (!container) return;

    const sectionEls = Array.from(
      container.querySelectorAll<HTMLElement>('[data-section-id]')
    );
    if (sectionEls.length === 0) return;

    const currentScreen = progress.currentScreen;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        const target = visible.target as HTMLElement;
        const sectionId = target.dataset.sectionId;
        const sectionLabel = target.dataset.sectionLabel;
        if (sectionId && sectionLabel) {
          setProgress((prev) =>
            prev.currentScreen === currentScreen
              ? recordSectionVisit(prev, currentScreen, sectionId, sectionLabel)
              : prev
          );
        }
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0.05 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [progress.currentScreen]);

  // Enforce sequential locking on browser Back/Forward history navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = (event: PopStateEvent) => {
      const fromState =
        event.state && typeof event.state.screenId === 'string' && isValidScreenId(event.state.screenId)
          ? event.state.screenId
          : null;
      const { requestedScreen } = parseRequestedScreenFromLocation();
      const target = fromState ?? requestedScreen ?? 'welcome';

      const current = progressRef.current;
      const check = attemptNavigate(current, target);
      if (check.allowed) {
        setProgress(check.nextState);
        setLockNotice(null);
      } else {
        setLockNotice(check.lockReason ?? LOCKED_LESSON_MESSAGE);
        window.history.replaceState(
          { screenId: current.currentScreen },
          '',
          buildUrlForScreen(current.currentScreen)
        );
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showLockedNotice = useCallback((targetScreen?: ScreenId) => {
    setLockNotice(
      targetScreen === 'completion' ? LOCKED_COMPLETION_MESSAGE : LOCKED_LESSON_MESSAGE
    );
  }, []);

  const navigateTo = useCallback((screenId: ScreenId, scrollSectionId?: string) => {
    const check = attemptNavigate(progressRef.current, screenId);
    if (!check.allowed) {
      setLockNotice(check.lockReason ?? LOCKED_LESSON_MESSAGE);
      return;
    }
    setLockNotice(null);
    setProgress(check.nextState);
    if (typeof window !== 'undefined' && screenId !== progressRef.current.currentScreen) {
      window.history.pushState({ screenId }, '', buildUrlForScreen(screenId));
    }
    if (scrollSectionId) {
      setPendingScrollSectionId(scrollSectionId);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const handleStartLearning = useCallback(() => {
    navigateTo('lesson-1');
  }, [navigateTo]);

  const handleResumeLearning = useCallback(() => {
    const target = getResumeTarget(progressRef.current);
    navigateTo(target.screenId, target.sectionId);
  }, [navigateTo]);

  const handleActivityCompleted = useCallback((lessonId: LessonId, activityId: string) => {
    setProgress((prev) => recordActivityCompleted(prev, lessonId, activityId));
  }, []);

  const handleLessonAssessmentSubmitted = useCallback(
    (lessonId: LessonId, result: AssessmentResultSummary) => {
      setProgress((prev) => recordLessonAssessmentResult(prev, lessonId, result));
    },
    []
  );

  const handleSubmitFinalAssessment = useCallback((result: AssessmentResultSummary) => {
    setProgress((prev) => recordFinalAssessmentResult(prev, result));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleChangeReflection = useCallback((patch: Partial<ReflectionRecord>) => {
    setProgress((prev) => recordReflection(prev, patch));
  }, []);

  const handleResetProgress = useCallback(() => {
    const fresh = resetProgressState();
    setProgress(fresh);
    setLockNotice(null);
    setPendingScrollSectionId(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(
        { screenId: fresh.currentScreen },
        '',
        buildUrlForScreen(fresh.currentScreen)
      );
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const completedLessonsCount = LESSON_IDS.filter(
    (id) => progress.lessons[id]?.completed
  ).length;

  return (
    <div className="min-h-screen bg-white text-[#172033] flex flex-col lg:flex-row">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to lesson content
      </a>

      <Sidebar
        progressState={progress}
        lockNotice={lockNotice}
        onNavigate={(id) => navigateTo(id)}
        onLockedAttempt={(targetId) => showLockedNotice(targetId)}
        onResetProgress={handleResetProgress}
        onOpenReference={() => setIsReferenceOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader
          progressState={progress}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          onOpenReference={() => setIsReferenceOpen(true)}
        />

        <main
          ref={mainRef}
          id="main-content"
          className="flex-1 w-full max-w-[880px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
        >
          {lockNotice && (
            <div
              role="status"
              aria-live="polite"
              data-testid="locked-lesson-banner"
              className="surface-enter mb-6 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#B45309]" aria-hidden="true" />
                <span className="font-medium">{lockNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setLockNotice(null)}
                aria-label="Dismiss lock message"
                className="tactile-press rounded p-1 text-[#92400E] hover:bg-[#FEF3C7]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div key={progress.currentScreen} className="screen-enter">
            {progress.currentScreen === 'welcome' && (
              <WelcomeScreen
                progressState={progress}
                onStartLearning={handleStartLearning}
                onResumeLearning={handleResumeLearning}
                onNavigate={(id) => navigateTo(id)}
                onLockedAttempt={(targetId) => showLockedNotice(targetId)}
                onOpenReference={() => setIsReferenceOpen(true)}
                onRestartCourse={handleResetProgress}
              />
            )}

            {progress.currentScreen === 'lesson-1' && (
              <Lesson1Forces
                lessonRecord={progress.lessons['lesson-1']}
                isNextLocked={!canAccessScreen(progress, 'lesson-2')}
                onNavigate={(id) => navigateTo(id)}
                onActivityCompleted={(actId) => handleActivityCompleted('lesson-1', actId)}
                onAssessmentSubmitted={(res) => handleLessonAssessmentSubmitted('lesson-1', res)}
                onLockedNextAttempt={() => showLockedNotice('lesson-2')}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}

            {progress.currentScreen === 'lesson-2' && (
              <Lesson2FirstLaw
                lessonRecord={progress.lessons['lesson-2']}
                isNextLocked={!canAccessScreen(progress, 'lesson-3')}
                onNavigate={(id) => navigateTo(id)}
                onActivityCompleted={(actId) => handleActivityCompleted('lesson-2', actId)}
                onAssessmentSubmitted={(res) => handleLessonAssessmentSubmitted('lesson-2', res)}
                onLockedNextAttempt={() => showLockedNotice('lesson-3')}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}

            {progress.currentScreen === 'lesson-3' && (
              <Lesson3SecondLaw
                lessonRecord={progress.lessons['lesson-3']}
                isNextLocked={!canAccessScreen(progress, 'lesson-4')}
                onNavigate={(id) => navigateTo(id)}
                onActivityCompleted={(actId) => handleActivityCompleted('lesson-3', actId)}
                onAssessmentSubmitted={(res) => handleLessonAssessmentSubmitted('lesson-3', res)}
                onLockedNextAttempt={() => showLockedNotice('lesson-4')}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}

            {progress.currentScreen === 'lesson-4' && (
              <Lesson4ThirdLaw
                lessonRecord={progress.lessons['lesson-4']}
                isNextLocked={!canAccessScreen(progress, 'lesson-5')}
                onNavigate={(id) => navigateTo(id)}
                onActivityCompleted={(actId) => handleActivityCompleted('lesson-4', actId)}
                onAssessmentSubmitted={(res) => handleLessonAssessmentSubmitted('lesson-4', res)}
                onLockedNextAttempt={() => showLockedNotice('lesson-5')}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}

            {progress.currentScreen === 'lesson-5' && (
              <Lesson5Synthesis
                lessonRecord={progress.lessons['lesson-5']}
                reflection={progress.reflection}
                isNextLocked={!canAccessScreen(progress, 'assessment')}
                onNavigate={(id) => navigateTo(id)}
                onActivityCompleted={(actId) => handleActivityCompleted('lesson-5', actId)}
                onAssessmentSubmitted={(res) => handleLessonAssessmentSubmitted('lesson-5', res)}
                onLockedNextAttempt={() => showLockedNotice('assessment')}
                onChangeReflection={handleChangeReflection}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}

            {progress.currentScreen === 'assessment' && (
              <AssessmentScreen
                completedLessonsCount={completedLessonsCount}
                assessmentAttempts={progress.assessmentAttempts}
                latestAssessment={progress.latestAssessment}
                moduleCompleted={progress.moduleCompleted}
                onSubmitAssessment={handleSubmitFinalAssessment}
                onNavigate={(id) => navigateTo(id)}
              />
            )}

            {progress.currentScreen === 'completion' && (
              <CompletionScreen
                progressState={progress}
                onNavigate={(id) => navigateTo(id)}
                onRestartModule={handleResetProgress}
                onOpenReference={() => setIsReferenceOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      <ReferenceLibraryModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </div>
  );
}
