import React, { useState } from 'react';
import { CheckCircle2, Circle, RotateCcw, X } from 'lucide-react';
import { COURSE_INFO, LESSON_NAV_ITEMS } from '../../data/moduleContent';
import { calculateOverallProgress, ScreenId } from '../../physics/calculations';

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
  const { completedCount, totalCount, percentage } = calculateOverallProgress(completedScreens);

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
            <p className="text-xs font-medium text-[#475569] tracking-tight">
              {COURSE_INFO.courseTitle}
            </p>
            <h2 className="mt-1.5 text-base font-semibold leading-snug text-[#172033]">
              {COURSE_INFO.moduleLabel}: {COURSE_INFO.moduleTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-[#475569] hover:bg-slate-200/70 hover:text-[#172033] min-h-[44px] min-w-[44px]"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Overall Progress */}
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
              className="h-full bg-[#2563EB] transition-[width] duration-200 ease-out"
              style={{ width: `${percentage}%` }}
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
                  className={`group w-full text-left flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors min-h-[44px] ${
                    isCurrent
                      ? 'bg-[#EFF6FF] text-[#172033] border border-[#BFDBFE]'
                      : 'text-[#334155] border border-transparent hover:bg-white hover:border-[#E2E8F0]'
                  }`}
                >
                  <span className="mt-0.5 shrink-0" aria-hidden="true">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                    ) : (
                      <Circle
                        className={`h-4 w-4 ${
                          isCurrent ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                        }`}
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-[#64748B]">
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 hover:text-[#172033] min-h-[40px]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Saved Progress</span>
          </button>
        ) : (
          <div
            className="rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs"
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
                className="flex-1 rounded bg-[#B91C1C] px-2.5 py-1.5 font-medium text-white hover:bg-[#991B1B] min-h-[36px]"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded border border-[#CBD5E1] bg-white px-2.5 py-1.5 font-medium text-[#334155] hover:bg-slate-50 min-h-[36px]"
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

      {/* Mobile slide-over drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Course navigation drawer">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[86vw] max-w-[320px] h-full shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
