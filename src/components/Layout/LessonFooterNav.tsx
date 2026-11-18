import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LESSON_NAV_ITEMS } from '../../data/moduleContent';
import { ScreenId } from '../../physics/calculations';

interface LessonFooterNavProps {
  currentScreen: ScreenId;
  isCompleted: boolean;
  onNavigate: (id: ScreenId) => void;
  onMarkComplete?: () => void;
  completionHint?: string;
}

export const LessonFooterNav: React.FC<LessonFooterNavProps> = ({
  currentScreen,
  isCompleted,
  onNavigate,
  onMarkComplete,
  completionHint,
}) => {
  const index = LESSON_NAV_ITEMS.findIndex((i) => i.id === currentScreen);
  const prevItem = index > 0 ? LESSON_NAV_ITEMS[index - 1] : null;
  const nextItem = index >= 0 && index < LESSON_NAV_ITEMS.length - 1 ? LESSON_NAV_ITEMS[index + 1] : null;

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
              className="inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] hover:bg-[#F5F7FA] min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4 text-[#475569]" aria-hidden="true" />
              <span>Previous: {prevItem.shortLabel}</span>
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onMarkComplete && (
            <button
              type="button"
              onClick={onMarkComplete}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium min-h-[44px] border ${
                isCompleted
                  ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                  : 'border-[#CBD5E1] bg-[#F5F7FA] text-[#172033] hover:bg-slate-200/70'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{isCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}</span>
            </button>
          )}

          {nextItem && (
            <button
              type="button"
              onClick={() => onNavigate(nextItem.id)}
              className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] min-h-[44px]"
            >
              <span>Next: {nextItem.shortLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {!isCompleted && completionHint && (
        <p className="mt-3 text-xs text-[#64748B]">
          Tip: {completionHint}
        </p>
      )}
    </nav>
  );
};
