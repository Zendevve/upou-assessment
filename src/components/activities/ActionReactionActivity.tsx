import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { THIRD_LAW_SCENARIOS } from '../../data/moduleContent';
import { ThirdLawDiagram } from '../diagrams/ThirdLawDiagrams';

interface ActionReactionActivityProps {
  isCompleted?: boolean;
  onAllScenariosCompleted?: () => void;
}

interface ScenarioSelection {
  objectA: string;
  objectB: string;
  reactionDir: string;
  nonCancelReason: string;
  submitted: boolean;
  passed: boolean;
}

export const ActionReactionActivity: React.FC<ActionReactionActivityProps> = ({
  isCompleted = false,
  onAllScenariosCompleted,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, ScenarioSelection>>({});

  const scenario = THIRD_LAW_SCENARIOS[activeIndex];
  const current = selections[scenario.id] ?? {
    objectA: '',
    objectB: '',
    reactionDir: '',
    nonCancelReason: '',
    submitted: false,
    passed: false,
  };

  const completedCount = THIRD_LAW_SCENARIOS.filter((s) => selections[s.id]?.passed).length;

  const updateField = (field: keyof Omit<ScenarioSelection, 'submitted' | 'passed'>, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [scenario.id]: {
        ...(prev[scenario.id] ?? {
          objectA: '',
          objectB: '',
          reactionDir: '',
          nonCancelReason: '',
          submitted: false,
          passed: false,
        }),
        [field]: value,
        submitted: false,
      },
    }));
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect =
      current.objectA === scenario.correctObjectA &&
      current.objectB === scenario.correctObjectB &&
      current.reactionDir === scenario.correctReactionDirectionId &&
      current.nonCancelReason === scenario.correctNonCancelReasonId;

    const updated: Record<string, ScenarioSelection> = {
      ...selections,
      [scenario.id]: {
        ...current,
        submitted: true,
        passed: isCorrect,
      },
    };
    setSelections(updated);

    const nextCompletedCount = THIRD_LAW_SCENARIOS.filter((s) => updated[s.id]?.passed).length;
    if (nextCompletedCount === THIRD_LAW_SCENARIOS.length && onAllScenariosCompleted) {
      onAllScenariosCompleted();
    }
  };

  const handleResetScenario = () => {
    setSelections((prev) => ({
      ...prev,
      [scenario.id]: {
        objectA: '',
        objectB: '',
        reactionDir: '',
        nonCancelReason: '',
        submitted: false,
        passed: false,
      },
    }));
  };

  const allFieldsChosen =
    Boolean(current.objectA) &&
    Boolean(current.objectB) &&
    Boolean(current.reactionDir) &&
    Boolean(current.nonCancelReason);

  return (
    <section
      aria-labelledby="activity-4-title"
      className="my-8 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.01em] text-[#2563EB]">Interactive Activity 4</p>
          <h3 id="activity-4-title" className="mt-1 text-lg font-semibold text-[#172033]">
            Action–Reaction Force Pair Identifier
          </h3>
          <p className="mt-1 text-sm text-[#475569]">
            Analyze all three real-world scenarios by identifying the two interacting objects, the reaction force direction, and why the pair does not cancel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs font-medium text-[#475569] tabular-nums">
            {isCompleted ? THIRD_LAW_SCENARIOS.length : completedCount} / {THIRD_LAW_SCENARIOS.length} scenarios solved
          </p>
          {isCompleted && (
            <span className="surface-enter inline-flex items-center gap-1 rounded border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-xs font-semibold text-[#15803D]">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Activity Completed
            </span>
          )}
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Third law scenarios">
        {THIRD_LAW_SCENARIOS.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isDone = selections[item.id]?.passed;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(idx)}
              className={`tactile-press inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs sm:text-sm font-medium min-h-[40px] ${
                isActive
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] shadow-[0_1px_2px_rgba(37,99,235,0.08)]'
                  : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-slate-100'
              }`}
            >
              {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />}
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario Prompt + Diagram */}
      <div key={scenario.id} className="surface-enter mt-5 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm sm:text-base font-medium text-[#172033]">{scenario.context}</p>
          <div className="mt-3">
            <ThirdLawDiagram type={scenario.diagramType} />
          </div>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label htmlFor={`obj-a-${scenario.id}`} className="block text-xs font-semibold text-[#334155]">
              1. Which object exerts the action force?
            </label>
            <select
              id={`obj-a-${scenario.id}`}
              value={current.objectA}
              onChange={(e) => updateField('objectA', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px] transition-colors duration-150"
            >
              <option value="">Select object exerting the force...</option>
              {scenario.objectAOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`obj-b-${scenario.id}`} className="block text-xs font-semibold text-[#334155]">
              2. Which object experiences that action force?
            </label>
            <select
              id={`obj-b-${scenario.id}`}
              value={current.objectB}
              onChange={(e) => updateField('objectB', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px] transition-colors duration-150"
            >
              <option value="">Select object experiencing the force...</option>
              {scenario.objectBOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`dir-${scenario.id}`} className="block text-xs font-semibold text-[#334155]">
              3. What is the reaction force and its direction?
            </label>
            <select
              id={`dir-${scenario.id}`}
              value={current.reactionDir}
              onChange={(e) => updateField('reactionDir', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px] transition-colors duration-150"
            >
              <option value="">Select reaction force direction...</option>
              {scenario.reactionDirectionOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`reason-${scenario.id}`} className="block text-xs font-semibold text-[#334155]">
              4. Why do the action and reaction forces not cancel each other?
            </label>
            <select
              id={`reason-${scenario.id}`}
              value={current.nonCancelReason}
              onChange={(e) => updateField('nonCancelReason', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px] transition-colors duration-150"
            >
              <option value="">Select explanation...</option>
              {scenario.nonCancelReasonOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={!allFieldsChosen}
              className="tactile-press rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px]"
            >
              Check Force Pair
            </button>
            <button
              type="button"
              onClick={handleResetScenario}
              className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-3.5 py-2 text-sm font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset Scenario
            </button>
          </div>
        </form>
      </div>

      {current.submitted && (
        <div
          key={`${scenario.id}-${current.passed ? 'ok' : 'no'}`}
          role="status"
          aria-live="polite"
          className={`surface-enter mt-5 rounded-md border p-4 text-sm flex items-start gap-3 ${
            current.passed
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#7F1D1D]'
          }`}
        >
          {current.passed ? (
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {current.passed ? 'Accurate Force Pair Identification' : 'Check One or More Selections'}
            </p>
            {current.passed ? (
              <p className="mt-1">{scenario.explanation}</p>
            ) : (
              <ul className="mt-1.5 list-disc pl-4 space-y-1">
                {current.objectA !== scenario.correctObjectA && (
                  <li>Re-check which object initiates the push or pull in the description.</li>
                )}
                {current.objectB !== scenario.correctObjectB && (
                  <li>Re-check which object receives that initial push or pull.</li>
                )}
                {current.reactionDir !== scenario.correctReactionDirectionId && (
                  <li>The reaction force acts in the opposite direction on the first object.</li>
                )}
                {current.nonCancelReason !== scenario.correctNonCancelReasonId && (
                  <li>Remember: action and reaction forces act on different objects, so they cannot cancel.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
