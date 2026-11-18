import React from 'react';
import { Menu } from 'lucide-react';
import { LESSON_NAV_ITEMS } from '../../data/moduleContent';
import { calculateOverallProgress, ScreenId } from '../../physics/calculations';

interface MobileHeaderProps {
  currentScreen: ScreenId;
  completedScreens: ScreenId[];
  onOpenMenu: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentScreen,
  completedScreens,
  onOpenMenu,
}) => {
  const currentItem = LESSON_NAV_ITEMS.find((item) => item.id === currentScreen) ?? LESSON_NAV_ITEMS[0];
  const { percentage } = calculateOverallProgress(completedScreens);

  return (
    <header className="mobile-topbar lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex items-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#172033] hover:bg-slate-50 min-h-[44px] shrink-0"
          aria-label="Open lesson navigation menu"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-[#64748B]">
            Module 1 · {currentItem.shortLabel}
          </p>
          <p className="truncate text-sm font-semibold text-[#172033]">
            {currentItem.title}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="font-mono text-xs font-medium text-[#2563EB] tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
    </header>
  );
};
