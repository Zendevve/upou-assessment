import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, FileText, RotateCcw, ShieldCheck } from 'lucide-react';
import { ReflectionRecord } from '../../physics/progress';

interface ReflectionActivityProps {
  reflection: ReflectionRecord;
  onChangeReflection: (patch: Partial<ReflectionRecord>) => void;
}

const MIN_CHARS_FOR_SAMPLE = 20;

const GUIDING_QUESTIONS = [
  '1. Describe one stationary or steady-speed object around you where forces are balanced (F_net = 0 N). Which forces are canceling out?',
  '2. Recall a moment in daily life (such as riding a bus, carrying a drink, or pulling clothes off a line) where you observed inertia.',
  '3. Pick a moving object you pushed or pedaled recently: what unbalanced net force accelerated it, and how would increasing its mass change the acceleration?',
  '4. Name one action–reaction force pair from your daily routine and explain why the two forces do not cancel each other.',
];

const SAMPLE_REFLECTION = `1. When my water bottle sits on my study desk, gravity pulls it downward while the desk pushes upward with an equal normal force, giving F_net = 0 N (balanced forces, even though two forces are acting).
2. On the morning bus, when the driver brakes for a stoplight, my backpack slides slightly forward on the floor because its inertia keeps it moving forward while the bus slows beneath it.
3. Riding my bike up to cruising speed takes a forward net force from the road pushing my rear tire (exceeding air resistance and rolling friction). When I carry heavy groceries in my basket, the greater total mass makes my acceleration noticeably smaller for the same pedal push (a = F_net / m).
4. While walking to school, my shoe pushes backward on the sidewalk and the sidewalk pushes forward on my shoe with equal magnitude. They do not cancel because one force acts on the sidewalk and the other acts on me.`;

export const ReflectionActivity: React.FC<ReflectionActivityProps> = ({
  reflection,
  onChangeReflection,
}) => {
  const [showSample, setShowSample] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const trimmed = reflection.text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const canUnlockSample = trimmed.length >= MIN_CHARS_FOR_SAMPLE;

  const formattedTime = reflection.updatedAt
    ? new Date(reflection.updatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const handleToggleSample = () => {
    if (!canUnlockSample) return;
    const next = !showSample;
    setShowSample(next);
    if (next && !reflection.sampleViewed) {
      onChangeReflection({ sampleViewed: true });
    }
  };

  const handleConfirmClear = () => {
    onChangeReflection({ text: '', updatedAt: null });
    setShowSample(false);
    setConfirmClear(false);
  };

  return (
    <section
      id="l5-reflection"
      data-section-id="l5-reflection"
      data-section-label="Physics Around Me Reflection"
      aria-labelledby="reflection-heading"
      className="my-8 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-start gap-2.5">
          <FileText className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 id="reflection-heading" className="text-lg font-semibold text-[#172033]">
              Reflection Activity: “Physics Around Me”
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-[#475569]">
              Optional personal synthesis exercise · Connects Module 1 laws to your own daily observations
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#334155]">
          {trimmed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
              <span>Saved on this device{formattedTime ? ` · ${formattedTime}` : ''}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-[#475569]" aria-hidden="true" />
              <span>Autosaves locally in browser</span>
            </>
          )}
        </span>
      </div>

      <div className="rounded border border-[#E2E8F0] bg-white p-4">
        <p className="text-xs font-semibold text-[#475569]">
          Use these 4 guiding questions to organize your thoughts:
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-[#334155]">
          {GUIDING_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label
            htmlFor="physics-around-me-textarea"
            className="text-sm font-semibold text-[#172033]"
          >
            Your Reflection Notes
          </label>
          <span className="font-mono text-xs text-[#475569] tabular-nums">
            {wordCount} words · Suggested length: ~50–120 words
          </span>
        </div>

        <textarea
          id="physics-around-me-textarea"
          rows={6}
          value={reflection.text}
          onChange={(e) => onChangeReflection({ text: e.target.value })}
          placeholder="Write your observations here using everyday examples of balanced forces, inertia, F_net = ma, and action–reaction pairs..."
          className="mt-2 w-full rounded-md border border-[#CBD5E1] bg-white px-3.5 py-3 text-sm sm:text-base text-[#172033] leading-relaxed"
        />

        <p className="mt-1.5 text-xs text-[#475569]">
          Note: Your notes stay privately saved in this browser’s local storage so you can edit or review them anytime—nothing is sent or submitted to an instructor.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleSample}
            disabled={!canUnlockSample}
            aria-expanded={showSample}
            className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-[#172033] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {showSample ? (
              <EyeOff className="h-4 w-4 text-[#475569]" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            )}
            <span>{showSample ? 'Hide Sample Response' : 'View Sample Response'}</span>
          </button>

          {!canUnlockSample && (
            <span className="text-xs text-[#475569]">
              Write at least {MIN_CHARS_FOR_SAMPLE} characters first to unlock the sample response.
            </span>
          )}
        </div>

        {trimmed.length > 0 && !confirmClear && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Reflection</span>
          </button>
        )}
      </div>

      {confirmClear && (
        <div
          role="alertdialog"
          aria-label="Confirm clearing reflection"
          className="surface-enter rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm"
        >
          <p className="font-medium text-[#991B1B]">
            Clear your saved “Physics Around Me” reflection text?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirmClear}
              className="tactile-press rounded bg-[#B91C1C] px-3 py-1.5 font-medium text-white hover:bg-[#991B1B] min-h-[38px]"
            >
              Confirm Clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="tactile-press rounded border border-[#CBD5E1] bg-white px-3 py-1.5 font-medium text-[#334155] hover:bg-slate-50 min-h-[38px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSample && canUnlockSample && (
        <div className="surface-enter rounded-md border border-[#BFDBFE] bg-[#EFF6FF] p-4 space-y-2 text-sm text-[#172033]">
          <p className="text-xs font-semibold text-[#1E40AF]">
            Sample Student Response (For Comparison Only)
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#334155]">
            {SAMPLE_REFLECTION}
          </p>
        </div>
      )}
    </section>
  );
};
