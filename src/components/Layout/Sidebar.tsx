import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import { CheckCircle2, Circle, RotateCcw, X } from 'lucide-react';
import { COURSE_INFO, LESSON_NAV_ITEMS } from '../../data/moduleContent';
import { calculateOverallProgress, ScreenId } from '../../physics/calculations';
import {
  computePointerVelocity,
  prefersReducedMotion,
  projectMomentum,
  rubberband,
  VelocitySample,
} from '../../utils/fluidMotion';

interface SidebarProps {
  currentScreen: ScreenId;
  completedScreens: ScreenId[];
  onNavigate: (screenId: ScreenId) => void;
  onResetProgress: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  completedScreens,
  onNavigate,
  onResetProgress,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [isRenderedMobile, setIsRenderedMobile] = useState(isOpenMobile);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const animControlsRef = useRef<{ stop?: () => void } | null>(null);
  const scrimControlsRef = useRef<{ stop?: () => void } | null>(null);

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

  const { completedCount, totalCount, percentage } = calculateOverallProgress(completedScreens);

  const stopAnimations = () => {
    animControlsRef.current?.stop?.();
    scrimControlsRef.current?.stop?.();
    animControlsRef.current = null;
    scrimControlsRef.current = null;
  };

  const getLiveTranslateX = (): number => {
    const el = drawerRef.current;
    if (!el) return 0;
    const transform = window.getComputedStyle(el).transform;
    if (!transform || transform === 'none') return 0;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m41;
  };

  // Mount & animate mobile drawer symmetrically along the left edge
  useEffect(() => {
    if (isOpenMobile) {
      setIsRenderedMobile(true);
    }
  }, [isOpenMobile]);

  useEffect(() => {
    if (!isRenderedMobile) return;
    const drawerEl = drawerRef.current;
    const scrimEl = scrimRef.current;
    if (!drawerEl || !scrimEl) return;

    const reduced = prefersReducedMotion();
    stopAnimations();

    if (isOpenMobile) {
      const width = drawerEl.getBoundingClientRect().width || 300;
      if (reduced) {
        drawerEl.style.transform = 'translateX(0px)';
        drawerEl.style.opacity = '0';
        scrimEl.style.opacity = '0';
        animControlsRef.current = animate(drawerEl, { opacity: 1 }, { duration: 0.16 });
        scrimControlsRef.current = animate(scrimEl, { opacity: 1 }, { duration: 0.16 });
      } else {
        const currentX = getLiveTranslateX();
        const startX = currentX < -1 ? currentX : -width;
        drawerEl.style.transform = `translateX(${startX}px)`;
        drawerEl.style.opacity = '1';
        scrimEl.style.opacity = String(Math.max(0, Math.min(1, 1 + startX / width)));

        animControlsRef.current = animate(
          drawerEl,
          { transform: 'translateX(0px)' },
          { type: 'spring', bounce: 0, duration: 0.34 }
        );
        scrimControlsRef.current = animate(
          scrimEl,
          { opacity: 1 },
          { duration: 0.24, ease: [0.23, 1, 0.32, 1] }
        );
      }
    } else {
      const width = drawerEl.getBoundingClientRect().width || 300;
      if (reduced) {
        animControlsRef.current = animate(drawerEl, { opacity: 0 }, { duration: 0.14 });
        const scrimOut = animate(scrimEl, { opacity: 0 }, { duration: 0.14 });
        scrimControlsRef.current = scrimOut;
        scrimOut.finished.then(() => {
          setIsRenderedMobile(false);
        });
      } else {
        // Exit slightly faster than enter (Emil: asymmetric enter/exit timing)
        animControlsRef.current = animate(
          drawerEl,
          { transform: `translateX(${-width}px)` },
          { duration: 0.22, ease: [0.23, 1, 0.32, 1] }
        );
        scrimControlsRef.current = animate(
          scrimEl,
          { opacity: 0 },
          { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
        );
        animControlsRef.current &&
          (animControlsRef.current as { finished?: Promise<unknown> }).finished?.then(() => {
            if (!isOpenMobile) {
              setIsRenderedMobile(false);
            }
          });
      }
    }
  }, [isOpenMobile, isRenderedMobile]);

  // Escape key closes mobile drawer
  useEffect(() => {
    if (!isOpenMobile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleDrawerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Allow interactive controls inside to handle taps normally unless user drags horizontally
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (prefersReducedMotion()) return;
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    // Multi-touch protection
    if (dragStateRef.current.active) return;

    const liveX = getLiveTranslateX();
    stopAnimations();

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
    const scrimEl = scrimRef.current;
    if (!drawerEl || !scrimEl) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    // 10px gesture disambiguation hysteresis
    if (!drag.lockedAxis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical scroll inside nav list — cancel horizontal drawer drag
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

    const width = drawerEl.getBoundingClientRect().width || 300;
    const rawOffset = drag.initialOffsetX + dx;
    // Progressive rubber-banding if pulled past open edge (rightward > 0)
    const offset = rawOffset > 0 ? rubberband(rawOffset, width * 0.45, 0.55) : Math.max(-width, rawOffset);

    drag.currentOffsetX = offset;
    drag.samples.push({ x: e.clientX, y: e.clientY, time: performance.now() });
    if (drag.samples.length > 8) drag.samples.shift();

    // Update transform directly on element (avoid CSS variable recalc across children)
    drawerEl.style.transform = `translateX(${offset}px)`;
    scrimEl.style.opacity = String(Math.max(0, Math.min(1, 1 + offset / width)));
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
    const scrimEl = scrimRef.current;
    if (!drawerEl || !scrimEl) return;

    try {
      if (drawerEl.hasPointerCapture(e.pointerId)) {
        drawerEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const width = drawerEl.getBoundingClientRect().width || 300;
    const { vx } = computePointerVelocity(drag.samples);
    // Apple momentum projection to decide commit (close) vs snap back (open)
    const projectedX = drag.currentOffsetX + projectMomentum(vx, 0.99);
    const shouldClose = projectedX < -width * 0.42 || vx < -450;

    if (shouldClose) {
      animControlsRef.current = animate(
        drawerEl,
        { transform: `translateX(${-width}px)` },
        { type: 'spring', bounce: 0, duration: 0.28, velocity: vx }
      );
      scrimControlsRef.current = animate(scrimEl, { opacity: 0 }, { duration: 0.2 });
      onCloseMobile();
    } else {
      animControlsRef.current = animate(
        drawerEl,
        { transform: 'translateX(0px)' },
        { type: 'spring', bounce: 0, duration: 0.32, velocity: vx }
      );
      scrimControlsRef.current = animate(scrimEl, { opacity: 1 }, { duration: 0.2 });
    }
  };

  const handleSelect = (id: ScreenId) => {
    onNavigate(id);
    onCloseMobile();
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setConfirmReset(false);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#F5F7FA] border-r border-[#E2E8F0] text-[#172033]">
      {/* Course & Module Identity */}
      <div className="px-5 pt-6 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[#475569] tracking-[0.01em]">
              {COURSE_INFO.courseTitle}
            </p>
            <h2 className="mt-1.5 text-base font-semibold leading-snug text-[#172033]">
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
        <div className="mt-5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-[#475569]">Module Progress</span>
            <span className="font-mono font-medium text-[#172033] tabular-nums">
              {completedCount}/{totalCount} · {percentage}%
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-[#E2E8F0]"
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

      {/* Lesson Navigation List */}
      <nav aria-label="Module lessons" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {LESSON_NAV_ITEMS.map((item) => {
            const isCurrent = currentScreen === item.id;
            const isCompleted = completedScreens.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`group tactile-press w-full text-left flex items-start gap-3 rounded-md px-3 py-2.5 min-h-[44px] border ${
                    isCurrent
                      ? 'bg-[#EFF6FF] text-[#172033] border-[#BFDBFE] shadow-[0_1px_2px_rgba(37,99,235,0.08)]'
                      : 'text-[#334155] border-transparent hover:bg-white hover:border-[#E2E8F0]'
                  }`}
                >
                  <span className="mt-0.5 shrink-0" aria-hidden="true">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                    ) : (
                      <Circle
                        className={`h-4 w-4 transition-colors duration-150 ${
                          isCurrent ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                        }`}
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs tracking-[0.008em] text-[#64748B]">
                      {item.shortLabel} · {item.duration}
                      {isCompleted ? ' · Completed' : ''}
                    </span>
                    <span
                      className={`mt-0.5 block text-sm leading-snug ${
                        isCurrent ? 'font-semibold text-[#1E3A8A]' : 'font-medium text-[#172033]'
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Utility: Safe Progress Reset */}
      <div className="border-t border-[#E2E8F0] px-4 py-4">
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
        className="hidden lg:block lg:w-[296px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen"
      >
        {sidebarContent}
      </aside>

      {/* Mobile slide-over drawer with 1:1 pointer tracking, momentum projection & symmetric exit */}
      {isRenderedMobile && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Course navigation drawer"
        >
          <div
            ref={scrimRef}
            className="fixed inset-0 bg-slate-900/45"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            onPointerDown={handleDrawerPointerDown}
            onPointerMove={handleDrawerPointerMove}
            onPointerUp={handleDrawerPointerEnd}
            onPointerCancel={handleDrawerPointerEnd}
            className="relative z-10 w-[86vw] max-w-[320px] h-full shadow-2xl touch-pan-y"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
