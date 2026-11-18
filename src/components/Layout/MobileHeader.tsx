import React from 'react';
import { BookOpen, Menu } from 'lucide-react';
import { LESSON_NAV_ITEMS } from '../../data/moduleContent';
import {
  calculateOverallModuleProgress,
  ModuleProgressState,
} from '../../physics/progress';

interface MobileHeaderProps {
  progressState: ModuleProgressState;
  onOpenMenu: () => void;
  onOpenReference: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  progressState,
  onOpenMenu,
  onOpenReference,
}) => {
  const currentItem =
    LESSON_NAV_ITEMS.find((item) => item.id === progressState.currentScreen) ??
    LESSON_NAV_ITEMS[0];
  const { percentage } = calculateOverallModuleProgress(progressState);

  return (
    <header className="mobile-topbar translucent-chrome lg:hidden sticky top-0 z-30">
      <div className="flex items-center justify-between gap-2.5 px-3 sm:px-4 py-2.5">
        <button
          type="button"
          onClick={onOpenMenu}
          className="tactile-press inline-flex items-center gap-2 rounded-md border border-[#CBD5E1]/90 bg-white/90 px-3 py-2 text-xs font-medium text-[#172033] hover:bg-white min-h-[44px] shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
          aria-label="Open lesson navigation menu"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs tracking-[0.01em] text-[#475569]">
            Module 1 · {currentItem.shortLabel}
          </p>
          <p className="truncate text-sm font-semibold text-[#172033] tracking-[-0.008em]">
            {currentItem.title}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenReference}
            aria-label="Open Glossary and Formula Reference"
            className="tactile-press inline-flex items-center justify-center rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-2 text-[#1E40AF] hover:bg-[#DBEAFE] min-h-[44px] min-w-[44px]"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
    </header>
  );
};

