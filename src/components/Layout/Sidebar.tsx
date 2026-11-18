import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  Lock,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  COURSE_INFO,
  LESSON_NAV_ITEMS,
  LESSON_SECTIONS,
  LessonSectionNavItem,
} from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';
import {
  calculateLessonProgress,
  calculateOverallModuleProgress,
  canAccessScreen,
  isLessonId,
  LESSON_IDS,
  LessonId,
  LOCKED_COMPLETION_MESSAGE,
  LOCKED_LESSON_MESSAGE,
  ModuleProgressState,
} from '../../physics/progress';
import {
  computePointerVelocity,
  prefersReducedMotion,
  projectMomentum,
  rubberband,
  VelocitySample,
} from '../../utils/fluidMotion';

interface SidebarProps {
  progressState: ModuleProgressState;
  activeSectionId: string | null;
  lockNotice: string | null;
  onNavigate: (screenId: ScreenId) => void;
  onNavigateSection: (lessonId: LessonId, sectionId: string, sectionLabel: string) => void;
  onLockedAttempt: (targetScreen: ScreenId) => void;
  onResetProgress: () => void;
  onOpenReference: () => void;
  isOpenMobile: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
}

const RING_RADIUS = 9;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const LessonProgressRing: React.FC<{
  percentage: number;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  label: string;
}> = ({ percentage, isCompleted, isLocked, isCurrent, label }) => {
  const clamped = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - clamped / 100);

  if (isLocked) {
    return (
      <span
        role="img"
        aria-label={`${label}: Locked`}
        className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#E2E8F0]/70 text-[#475569]"
      >
        <Lock className="h-3 w-3" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`${label} progress: ${clamped}%`}
      className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r={RING_RADIUS}
          fill={isCompleted ? '#F0FDF4' : 'none'}
          stroke={isCompleted ? '#15803D' : isCurrent ? '#BFDBFE' : '#CBD5E1'}
          strokeWidth="2.5"
        />
        {clamped > 0 && !isCompleted && (
          <circle
            cx="12"
            cy="12"
            r={RING_RADIUS}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 12 12)"
            className="transition-[stroke-dashoffset] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
        )}
      </svg>
      {isCompleted && (
        <Check className="absolute h-3.5 w-3.5 text-[#15803D]" strokeWidth={2.5} aria-hidden="true" />
      )}
    </span>
  );
};

const SectionStatusIndicator: React.FC<{
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
}> = ({ isLocked, isCompleted, isActive }) => {
  if (isLocked) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#E2E8F0]/75 text-[#64748B]"
      >
        <Lock className="h-2.5 w-2.5" />
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          isActive
            ? 'border-[#2563EB] bg-[#EFF6FF] text-[#15803D]'
            : 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
        }`}
      >
        <Check className="h-2.5 w-2.5" strokeWidth={2.75} />
      </span>
    );
  }

  if (isActive) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#2563EB] bg-white"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
    />
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  progressState,
  activeSectionId,
  lockNotice,
  onNavigate,
  onNavigateSection,
  onLockedAttempt,
  onResetProgress,
  onOpenReference,
  isOpenMobile,
  onOpenMobile,
  onCloseMobile,
}) => {
  const currentScreen = progressState.currentScreen;

  const [confirmReset, setConfirmReset] = useState(false);
  const [isRenderedMobile, setIsRenderedMobile] = useState(isOpenMobile);
  const [isModuleExpanded, setIsModuleExpanded] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Partial<Record<LessonId, boolean>>>(() =>
    isLessonId(currentScreen) ? { [currentScreen]: true } : {}
  );

  const prevScreenRef = useRef<ScreenId>(currentScreen);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const drawerWidthRef = useRef<number>(300);
  const animControlsRef = useRef<{ stop?: () => void } | null>(null);
  const opacityControlsRef = useRef<{ stop?: () => void } | null>(null);
  const gestureSpringInFlightRef = useRef<'open' | 'close' | null>(null);
  const isOpenMobileRef = useRef(isOpenMobile);
  isOpenMobileRef.current = isOpenMobile;

  // Single source of truth for drawer horizontal position + linked scrim opacity
  const drawerX = useMotionValue(0);
  const drawerOpacity = useMotionValue(1);
  const scrimOpacity = useTransform([drawerX, drawerOpacity], ([x, op]: number[]) => {
    const w = drawerWidthRef.current || 300;
    return Math.max(0, Math.min(1, 1 + x / w)) * op;
  });

  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    initialOffsetX: number;
    currentOffsetX: number;
    lockedAxis: 'horizontal' | 'vertical' | null;
    samples: VelocitySample[];
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    initialOffsetX: 0,
    currentOffsetX: 0,
    lockedAxis: null,
    samples: [],
  });

  // Expand only the newly active lesson when switching screens into a lesson
  useEffect(() => {
    if (prevScreenRef.current !== currentScreen) {
      prevScreenRef.current = currentScreen;
      if (isLessonId(currentScreen)) {
        setIsModuleExpanded(true);
        setExpandedLessons({ [currentScreen]: true });
      }
    }
  }, [currentScreen]);

  const { completedLessonsCount, completedCount, totalTrackableCount, percentage } =
    calculateOverallModuleProgress(progressState);

  const stopAnimations = () => {
    animControlsRef.current?.stop?.();
    opacityControlsRef.current?.stop?.();
    animControlsRef.current = null;
    opacityControlsRef.current = null;
  };

  useEffect(() => {
    if (isOpenMobile) {
      setIsRenderedMobile(true);
    }
  }, [isOpenMobile]);

  // Keep active section visible when mobile drawer opens
  useEffect(() => {
    if (!isOpenMobile || !isRenderedMobile) return;
    const timer = window.setTimeout(() => {
      const activeEl = mobileNavRef.current?.querySelector<HTMLElement>('[data-active-nav="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isOpenMobile, isRenderedMobile]);

  useEffect(() => {
    if (!isRenderedMobile) return;
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    // Preserve in-flight pointer release spring velocity without overwriting it
    if (isOpenMobile && gestureSpringInFlightRef.current === 'open') {
      return;
    }
    if (!isOpenMobile && gestureSpringInFlightRef.current === 'close') {
      return;
    }
    gestureSpringInFlightRef.current = null;

    const width = drawerEl.getBoundingClientRect().width || 300;
    drawerWidthRef.current = width;
    const reduced = prefersReducedMotion();
    stopAnimations();

    if (isOpenMobile) {
      if (reduced) {
        drawerX.set(0);
        drawerOpacity.set(0);
        opacityControlsRef.current = animate(drawerOpacity, 1, {
          duration: 0.14,
          ease: [0.23, 1, 0.32, 1],
        });
      } else {
        const currentX = drawerX.get();
        if (currentX >= -1) {
          drawerX.set(-width);
        }
        drawerOpacity.set(1);

        animControlsRef.current = animate(drawerX, 0, {
          type: 'spring',
          bounce: 0,
          duration: 0.3,
        });
      }
    } else {
      if (reduced) {
        const fadeOut = animate(drawerOpacity, 0, {
          duration: 0.12,
          ease: [0.23, 1, 0.32, 1],
        });
        opacityControlsRef.current = fadeOut;
        fadeOut.finished.then(() => {
          if (!isOpenMobileRef.current && !dragStateRef.current.active) {
            setIsRenderedMobile(false);
          }
        });
      } else {
        const exitAnim = animate(drawerX, -width, {
          duration: 0.2,
          ease: [0.32, 0.72, 0, 1],
        });
        animControlsRef.current = exitAnim;
        exitAnim.finished.then(() => {
          if (!isOpenMobileRef.current && !dragStateRef.current.active) {
            setIsRenderedMobile(false);
          }
        });
      }
    }
  }, [isOpenMobile, isRenderedMobile, drawerX, drawerOpacity]);

  useEffect(() => {
    if (!isOpenMobile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        gestureSpringInFlightRef.current = null;
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleDrawerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;
    if (dragStateRef.current.active) return;

    drawerWidthRef.current = drawerEl.getBoundingClientRect().width || 300;
    gestureSpringInFlightRef.current = null;
    const liveX = drawerX.get();
    stopAnimations();
    drawerOpacity.set(1);

    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialOffsetX: liveX,
      currentOffsetX: liveX,
      lockedAxis: null,
      samples: [{ x: e.clientX, y: e.clientY, time: performance.now() }],
    };
  };

  const handleDrawerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.lockedAxis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.active = false;
        drag.pointerId = null;
        return;
      }
      drag.lockedAxis = 'horizontal';
      try {
        drawerEl.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable
      }
    }

    const width = drawerWidthRef.current || 300;
    const rawOffset = drag.initialOffsetX + dx;
    const offset =
      rawOffset > 0 ? rubberband(rawOffset, width * 0.45, 0.55) : Math.max(-width, rawOffset);

    drag.currentOffsetX = offset;
    drag.samples.push({ x: e.clientX, y: e.clientY, time: performance.now() });
    if (drag.samples.length > 8) drag.samples.shift();

    drawerX.set(offset);
  };

  const handleDrawerPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    const wasHorizontal = drag.lockedAxis === 'horizontal';
    drag.active = false;
    drag.pointerId = null;
    drag.lockedAxis = null;

    if (!wasHorizontal) return;
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    try {
      if (drawerEl.hasPointerCapture(e.pointerId)) {
        drawerEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const width = drawerWidthRef.current || 300;
    const reduced = prefersReducedMotion();
    const { vx } = computePointerVelocity(drag.samples);
    const projectedX = drag.currentOffsetX + (reduced ? 0 : projectMomentum(vx, 0.99));
    const shouldClose = reduced
      ? drag.currentOffsetX < -width * 0.42
      : projectedX < -width * 0.42 || vx < -450;

    if (shouldClose) {
      gestureSpringInFlightRef.current = 'close';
      const closeAnim = reduced
        ? animate(drawerX, -width, { duration: 0.14, ease: [0.23, 1, 0.32, 1] })
        : animate(drawerX, -width, { type: 'spring', bounce: 0, duration: 0.28, velocity: vx });
      animControlsRef.current = closeAnim;
      closeAnim.finished.then(() => {
        if (gestureSpringInFlightRef.current === 'close') {
          gestureSpringInFlightRef.current = null;
        }
        if (!isOpenMobileRef.current && !dragStateRef.current.active) {
          setIsRenderedMobile(false);
        }
      });
      onCloseMobile();
    } else {
      gestureSpringInFlightRef.current = 'open';
      const openAnim = reduced
        ? animate(drawerX, 0, { duration: 0.14, ease: [0.23, 1, 0.32, 1] })
        : animate(drawerX, 0, { type: 'spring', bounce: 0.14, duration: 0.32, velocity: vx });
      animControlsRef.current = openAnim;
      openAnim.finished.then(() => {
        if (gestureSpringInFlightRef.current === 'open') {
          gestureSpringInFlightRef.current = null;
        }
      });
      if (!isOpenMobileRef.current) {
        onOpenMobile();
      }
    }
  };

  const handleSelectScreen = (id: ScreenId, isLocked: boolean) => {
    if (isLocked) {
      onLockedAttempt(id);
      return;
    }
    if (isLessonId(id)) {
      setIsModuleExpanded(true);
      setExpandedLessons((prev) => (prev[id] ? prev : { [id]: true }));
    }
    onNavigate(id);
    onCloseMobile();
  };

  const handleSelectSection = (
    lessonId: LessonId,
    section: LessonSectionNavItem,
    isLocked: boolean
  ) => {
    if (isLocked) {
      onLockedAttempt(lessonId);
      return;
    }
    setIsModuleExpanded(true);
    setExpandedLessons((prev) => ({ ...prev, [lessonId]: true }));
    onNavigateSection(lessonId, section.id, `${section.number} ${section.title}`);
    onCloseMobile();
  };

  const toggleLessonExpanded = (lessonId: LessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setConfirmReset(false);
    onCloseMobile();
  };

  const isSectionCompleted = (lessonId: LessonId, section: LessonSectionNavItem): boolean => {
    const record = progressState.lessons[lessonId];
    if (!record.unlocked) return false;
    if (section.kind === 'activity' && section.activityId) {
      return record.activities[section.activityId] === true;
    }
    if (section.kind === 'assessment') {
      return Boolean(record.assessment.passed);
    }
    if (record.completed) return true;
    return Boolean(progressState.visitedSectionIds?.[lessonId]?.includes(section.id));
  };

  const renderTopLevelItem = (id: 'welcome' | 'assessment' | 'completion') => {
    const item = LESSON_NAV_ITEMS.find((nav) => nav.id === id);
    if (!item) return null;

    const isCurrent = currentScreen === item.id;
    const isUnlocked = canAccessScreen(progressState, item.id);
    const isLocked = !isUnlocked;

    let itemPct = 0;
    let itemCompleted = false;
    if (item.id === 'welcome') {
      itemCompleted = currentScreen !== 'welcome' || completedCount > 0;
      itemPct = itemCompleted ? 100 : 0;
    } else if (item.id === 'assessment') {
      itemCompleted = progressState.finalAssessmentPassed;
      itemPct = itemCompleted ? 100 : 0;
    } else if (item.id === 'completion') {
      itemCompleted = progressState.moduleCompleted;
      itemPct = itemCompleted ? 100 : 0;
    }

    const statusLabel = isLocked
      ? 'Locked'
      : itemCompleted
      ? 'Completed'
      : item.id === 'welcome'
      ? 'Overview'
      : `${itemPct}%`;

    const lockHint = item.id === 'completion' ? LOCKED_COMPLETION_MESSAGE : LOCKED_LESSON_MESSAGE;
    const buttonAriaLabel = isLocked
      ? `${item.title} — Locked. ${lockHint}`
      : `${item.title} — ${statusLabel}`;

    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => handleSelectScreen(item.id, isLocked)}
          aria-current={isCurrent ? 'page' : undefined}
          aria-disabled={isLocked ? 'true' : undefined}
          aria-label={buttonAriaLabel}
          data-active-nav={isCurrent ? 'true' : undefined}
          data-screen-id={item.id}
          data-locked={isLocked ? 'true' : 'false'}
          data-progress-percent={itemPct}
          className={`group w-full text-left flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] border transition-colors duration-150 ${
            isLocked
              ? 'border-transparent bg-slate-100/70 text-[#475569] cursor-not-allowed'
              : isCurrent
              ? 'tactile-press bg-[#EFF6FF] text-[#172033] border-[#BFDBFE] shadow-[0_1px_2px_rgba(37,99,235,0.08)]'
              : 'tactile-press text-[#334155] border-transparent hover:bg-white hover:border-[#E2E8F0]'
          }`}
        >
          <LessonProgressRing
            percentage={itemPct}
            isCompleted={itemCompleted}
            isLocked={isLocked}
            isCurrent={isCurrent}
            label={item.title}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-[#475569] tracking-[0.008em]">
              {item.shortLabel} · {item.duration} · {statusLabel}
            </span>
            <span
              className={`mt-0.5 block text-sm leading-snug ${
                isLocked
                  ? 'font-medium text-[#475569]'
                  : isCurrent
                  ? 'font-semibold text-[#1E3A8A]'
                  : 'font-medium text-[#172033]'
              }`}
            >
              {item.title}
            </span>
          </span>
        </button>
      </li>
    );
  };

  const renderLessonAccordion = (lessonId: LessonId) => {
    const item = LESSON_NAV_ITEMS.find((nav) => nav.id === lessonId);
    if (!item) return null;

    const isCurrent = currentScreen === lessonId;
    const isUnlocked = canAccessScreen(progressState, lessonId);
    const isLocked = !isUnlocked;
    const summary = calculateLessonProgress(lessonId, progressState.lessons[lessonId]);
    const isExpanded = Boolean(expandedLessons[lessonId]);
    const sections = LESSON_SECTIONS[lessonId];

    const statusLabel = isLocked
      ? 'Locked'
      : summary.completed
      ? 'Completed'
      : `${summary.percentage}%`;

    const displayNumber = item.lessonNumber ?? item.shortLabel;
    const buttonAriaLabel = isLocked
      ? `${displayNumber} ${item.title} — Locked. ${LOCKED_LESSON_MESSAGE}`
      : `${displayNumber} ${item.title} — ${summary.percentage}% complete`;

    return (
      <li key={lessonId}>
        <div>
          {/* Level 2 Header: Two sibling buttons (navigate + toggle chevron) */}
          <div
            className={`flex items-stretch gap-0.5 rounded-md border transition-colors duration-150 ${
              isLocked
                ? 'border-transparent bg-slate-100/70'
                : isCurrent
                ? 'border-[#BFDBFE] bg-[#EFF6FF] shadow-[0_1px_2px_rgba(37,99,235,0.06)]'
                : 'border-transparent hover:bg-white hover:border-[#E2E8F0]'
            }`}
          >
            <button
              type="button"
              onClick={() => handleSelectScreen(lessonId, isLocked)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-disabled={isLocked ? 'true' : undefined}
              aria-label={buttonAriaLabel}
              data-screen-id={lessonId}
              data-locked={isLocked ? 'true' : 'false'}
              data-progress-percent={summary.percentage}
              data-active-nav={isCurrent && (!isExpanded || !activeSectionId) ? 'true' : undefined}
              className={`min-w-0 flex-1 text-left flex items-center gap-2.5 rounded-l-md pl-2.5 pr-1.5 py-2 min-h-[44px] ${
                isLocked ? 'cursor-not-allowed text-[#475569]' : 'tactile-press text-[#172033]'
              }`}
            >
              <LessonProgressRing
                percentage={summary.percentage}
                isCompleted={summary.completed}
                isLocked={isLocked}
                isCurrent={isCurrent}
                label={`${displayNumber} ${item.title}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium text-[#475569] tabular-nums">
                  {displayNumber} · {item.duration} · {statusLabel}
                </span>
                <span
                  className={`mt-0.5 block text-[13.5px] leading-snug ${
                    isLocked
                      ? 'font-medium text-[#475569]'
                      : isCurrent
                      ? 'font-semibold text-[#1E3A8A]'
                      : 'font-medium text-[#172033]'
                  }`}
                >
                  {item.title}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleLessonExpanded(lessonId)}
              aria-expanded={isExpanded}
              aria-controls={`sections-${lessonId}`}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${displayNumber} ${item.title} sections`}
              data-testid={`toggle-${lessonId}`}
              className="tactile-press inline-flex items-center justify-center rounded-r-md px-2 text-[#475569] hover:text-[#172033] hover:bg-slate-200/50 min-w-[36px] min-h-[44px]"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Level 3: Nested Lesson Sections */}
          {isExpanded && (
            <ul
              id={`sections-${lessonId}`}
              aria-label={`${displayNumber} ${item.title} sections`}
              className="accordion-reveal ml-[22px] mt-1 mb-1.5 border-l border-[#CBD5E1] pl-3 space-y-0.5"
            >
              {sections.map((section) => {
                const isSecActive = isCurrent && activeSectionId === section.id;
                const isSecDone = isSectionCompleted(lessonId, section);

                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSection(lessonId, section, isLocked)}
                      aria-current={isSecActive ? 'location' : undefined}
                      aria-disabled={isLocked ? 'true' : undefined}
                      data-section-nav-id={section.id}
                      data-section-completed={isSecDone ? 'true' : 'false'}
                      data-active-nav={isSecActive ? 'true' : undefined}
                      className={`w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 min-h-[38px] text-xs transition-colors duration-150 ${
                        isLocked
                          ? 'text-[#64748B] cursor-not-allowed'
                          : isSecActive
                          ? 'tactile-press bg-white text-[#1E3A8A] font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                          : 'tactile-press text-[#334155] hover:bg-white/80 hover:text-[#172033]'
                      }`}
                    >
                      <span className="mt-[1px] shrink-0">
                        <SectionStatusIndicator
                          isLocked={isLocked}
                          isCompleted={isSecDone}
                          isActive={isSecActive}
                        />
                      </span>
                      <span className="min-w-0 flex-1 flex items-start gap-1.5 leading-snug">
                        <span className="font-mono text-[11px] text-[#64748B] tabular-nums shrink-0 mt-[1px]">
                          {section.number}
                        </span>
                        <span>{section.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </li>
    );
  };

  const renderSidebarBody = (navRef: React.RefObject<HTMLElement | null>, isMobile = false) => (
    <div className="flex h-full flex-col bg-[#F5F7FA] border-r border-[#E2E8F0] text-[#172033]">
      {/* Course & Module Identity */}
      <div
        className={`px-5 pb-4 border-b border-[#E2E8F0] ${
          isMobile ? 'pt-[calc(1.25rem+env(safe-area-inset-top,0px))]' : 'pt-5'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[#475569] tracking-[0.01em]">
              {COURSE_INFO.courseTitle}
            </p>
            <h2 className="mt-1 text-base font-semibold leading-snug text-[#172033]">
              {COURSE_INFO.moduleLabel}: {COURSE_INFO.moduleTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden tactile-press inline-flex items-center justify-center rounded-md p-2 text-[#475569] hover:bg-slate-200/70 hover:text-[#172033] min-h-[44px] min-w-[44px]"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Overall Progress (GPU-composited scaleX) */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-[#475569]">Module Progress</span>
            <span className="font-mono font-medium text-[#172033] tabular-nums">
              {completedCount}/{totalTrackableCount} · {percentage}%
            </span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-sm bg-[#E2E8F0]"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall module progress: ${percentage} percent`}
          >
            <div
              className="h-full w-full origin-left bg-[#2563EB] transition-transform duration-250 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `scaleX(${percentage / 100})` }}
            />
          </div>
        </div>
      </div>

      {/* 3-Level Nested Course Navigation */}
      <nav
        ref={navRef}
        aria-label="Course outline and lessons"
        className="nav-scroll-fade flex-1 overflow-y-auto px-3 py-3.5"
      >
        {lockNotice && (
          <div
            role="status"
            aria-live="polite"
            className="surface-enter mb-3 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5 text-xs text-[#92400E] flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-[#B45309] mt-0.5" aria-hidden="true" />
            <span>{lockNotice}</span>
          </div>
        )}

        <ul className="space-y-1.5">
          {/* Level 1: Course Orientation */}
          {renderTopLevelItem('welcome')}

          {/* Level 1: Expandable Module 1 Group */}
          <li className="pt-1.5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setIsModuleExpanded((prev) => !prev)}
              aria-expanded={isModuleExpanded}
              aria-controls="module-1-lessons"
              data-testid="toggle-module-1"
              className="tactile-press w-full text-left flex items-center justify-between gap-2 rounded-md px-3 py-2 min-h-[44px] hover:bg-white/80"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium text-[#475569] tabular-nums">
                  {completedLessonsCount}/5 lessons · 2 hrs
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-[#172033] leading-snug">
                  Module 1: Forces and Motion
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#475569] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  isModuleExpanded ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {isModuleExpanded && (
              <ul
                id="module-1-lessons"
                aria-label="Module 1 lessons"
                className="accordion-reveal mt-1.5 space-y-1"
              >
                {LESSON_IDS.map((lessonId) => renderLessonAccordion(lessonId))}
              </ul>
            )}
          </li>

          {/* Level 1: Final Module Assessment & Completion Summary */}
          <li className="pt-1 border-t border-[#E2E8F0] list-none" aria-hidden="true" />
          {renderTopLevelItem('assessment')}
          {renderTopLevelItem('completion')}
        </ul>
      </nav>

      {/* Footer Utility: Reference Library & Safe Progress Reset */}
      <div
        className={`border-t border-[#E2E8F0] px-4 pt-3.5 space-y-2 ${
          isMobile ? 'pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]' : 'pb-3.5'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            onOpenReference();
            onCloseMobile();
          }}
          className="tactile-press w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#1E40AF] hover:bg-[#DBEAFE] min-h-[40px]"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Glossary & Formulas</span>
        </button>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="tactile-press w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 hover:text-[#172033] min-h-[40px]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Saved Progress</span>
          </button>
        ) : (
          <div
            className="surface-enter origin-bottom rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs"
            role="alertdialog"
            aria-label="Confirm reset progress"
          >
            <p className="font-medium text-[#991B1B]">
              Clear all completed lessons and assessment scores?
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="tactile-press flex-1 rounded bg-[#B91C1C] px-2.5 py-1.5 font-medium text-white hover:bg-[#991B1B] min-h-[36px]"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="tactile-press flex-1 rounded border border-[#CBD5E1] bg-white px-2.5 py-1.5 font-medium text-[#334155] hover:bg-slate-50 min-h-[36px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        aria-label="Course navigation"
        className="hidden lg:block lg:w-[308px] lg:shrink-0 lg:sticky lg:top-0 lg:h-[100dvh]"
      >
        {renderSidebarBody(desktopNavRef, false)}
      </aside>

      {/* Mobile slide-over drawer with 1:1 pointer tracking, momentum projection & symmetric exit */}
      {isRenderedMobile && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Course navigation drawer"
        >
          <motion.div
            style={{ opacity: scrimOpacity }}
            className="fixed inset-0 bg-slate-900/45"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            style={{ x: drawerX, opacity: drawerOpacity }}
            onPointerDown={handleDrawerPointerDown}
            onPointerMove={handleDrawerPointerMove}
            onPointerUp={handleDrawerPointerEnd}
            onPointerCancel={handleDrawerPointerEnd}
            className="relative z-10 w-[86vw] max-w-[330px] h-[100dvh] shadow-2xl touch-pan-y"
          >
            {renderSidebarBody(mobileNavRef, true)}
          </motion.div>
        </div>
      )}
    </>
  );
};
