import React from 'react';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { LESSON_NAV_ITEMS } from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';

interface LessonFooterNavProps {
  currentScreen: ScreenId;
  isCompleted: boolean;
  isNextLocked: boolean;
  onNavigate: (id: ScreenId) => void;
  onLockedNextAttempt: () => void;
  completionHint?: string;
}

export const LessonFooterNav: React.FC<LessonFooterNavProps> = ({
  currentScreen,
  isCompleted,
  isNextLocked,
  onNavigate,
  onLockedNextAttempt,
  completionHint,
}) => {
  const index = LESSON_NAV_ITEMS.findIndex((i) => i.id === currentScreen);
  const prevItem = index > 0 ? LESSON_NAV_ITEMS[index - 1] : null;
  const nextItem =
    index >= 0 && index < LESSON_NAV_ITEMS.length - 1 ? LESSON_NAV_ITEMS[index + 1] : null;

  return (
    <nav
      aria-label="Lesson sequence navigation"
      className="no-print mt-12 border-t border-[#E2E8F0] pt-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {prevItem ? (
            <button
              type="button"
              onClick={() => onNavigate(prevItem.id)}
              className="group tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] min-h-[44px]"
            >
              <ArrowLeft
                className="hover-nudge-left h-4 w-4 text-[#475569] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                aria-hidden="true"
              />
              <span>Previous: {prevItem.shortLabel}</span>
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {nextItem && (
            <button
              type="button"
              onClick={() => (isNextLocked ? onLockedNextAttempt() : onNavigate(nextItem.id))}
              aria-disabled={isNextLocked ? 'true' : undefined}
              className={`group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium min-h-[44px] ${
                isNextLocked
                  ? 'border border-[#CBD5E1] bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                  : 'tactile-press bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
              }`}
            >
              {isNextLocked && <Lock className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />}
              <span>
                {isNextLocked ? `Locked: ${nextItem.shortLabel}` : `Next: ${nextItem.shortLabel}`}
              </span>
              {!isNextLocked && (
                <ArrowRight
                  className="hover-nudge-right h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </div>
      </div>

      {!isCompleted && completionHint && (
        <p className="mt-3 text-xs text-[#64748B]">{completionHint}</p>
      )}
    </nav>
  );
};
