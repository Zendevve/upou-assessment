import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { BusInertiaDiagram } from '../diagrams/BusInertiaDiagram';

interface InertiaScenarioProps {
  onCompleted?: () => void;
}

const SCENARIO_OPTIONS = [
  {
    id: 'inertia-force',
    label: 'A forward "inertia force" suddenly pushes the passenger toward the front of the bus.',
    isCorrect: false,
    feedback:
      'Incorrect. Inertia is not a force! Nothing pushes the passenger forward when the brakes are applied.',
  },
  {
    id: 'maintain-velocity',
    label:
      'The bus slows down due to the braking force, while the passenger’s body tends to continue moving at its previous forward velocity.',
    isCorrect: true,
    feedback:
      'Correct! Before braking, both the bus and the passenger move forward together. The brakes act on the bus to slow it down, while the passenger’s upper body resists changing velocity (inertia) and keeps moving forward relative to the slowing bus.',
  },
  {
    id: 'gravity-forward',
    label: 'Earth’s gravity suddenly shifts direction and pulls the passenger horizontally forward.',
    isCorrect: false,
    feedback:
      'Incorrect. Gravity always pulls downward toward Earth’s center, not horizontally forward.',
  },
  {
    id: 'air-push',
    label: 'Air inside the bus rushes from the back window and pushes the passenger forward.',
    isCorrect: false,
    feedback:
      'Incorrect. The apparent forward motion is caused by the passenger’s own inertia maintaining their original forward velocity as the bus decelerates.',
  },
];

export const InertiaScenario: React.FC<InertiaScenarioProps> = ({ onCompleted }) => {
  const [phase, setPhase] = useState<'cruising' | 'braking'>('braking');
  const [selectedId, setSelectedId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = SCENARIO_OPTIONS.find((o) => o.id === selectedId);
  const isCorrect = Boolean(submitted && selectedOption?.isCorrect);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSubmitted(true);
    if (SCENARIO_OPTIONS.find((o) => o.id === selectedId)?.isCorrect && onCompleted) {
      onCompleted();
    }
  };

  const handleRetry = () => {
    setSelectedId('');
    setSubmitted(false);
  };

  return (
    <section
      aria-labelledby="activity-2-title"
      className="my-8 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      <div className="border-b border-[#E2E8F0] pb-4">
        <p className="text-xs font-semibold text-[#2563EB]">Interactive Activity 2</p>
        <h3 id="activity-2-title" className="mt-1 text-lg font-semibold text-[#172033]">
          Inertia Scenario: The Braking Bus
        </h3>
        <p className="mt-1 text-sm text-[#475569]">
          Switch between the two moments below to compare the motion of the bus and the standing passenger, then answer the scenario question.
        </p>
      </div>

      {/* Phase switcher */}
      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Bus motion stage">
        <button
          type="button"
          onClick={() => setPhase('cruising')}
          aria-pressed={phase === 'cruising'}
          className={`rounded-md border px-3.5 py-2 text-xs sm:text-sm font-medium min-h-[40px] ${
            phase === 'cruising'
              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]'
              : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-slate-100'
          }`}
        >
          1. Before Braking (Constant Velocity)
        </button>
        <button
          type="button"
          onClick={() => setPhase('braking')}
          aria-pressed={phase === 'braking'}
          className={`rounded-md border px-3.5 py-2 text-xs sm:text-sm font-medium min-h-[40px] ${
            phase === 'braking'
              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]'
              : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-slate-100'
          }`}
        >
          2. Bus Suddenly Brakes
        </button>
      </div>

      <div className="mt-4">
        <BusInertiaDiagram phase={phase} />
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <p className="text-sm sm:text-base font-semibold text-[#172033]">
          Why does a standing passenger tend to move forward relative to the bus when the bus suddenly brakes?
        </p>

        <fieldset className="mt-3 space-y-2">
          <legend className="sr-only">Select the best physics explanation</legend>
          {SCENARIO_OPTIONS.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 rounded-md border p-3.5 cursor-pointer transition-colors min-h-[44px] ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="bus-inertia-scenario"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => {
                    setSelectedId(opt.id);
                    if (submitted) setSubmitted(false);
                  }}
                  className="mt-1 h-4 w-4 accent-[#2563EB]"
                />
                <span className="text-sm text-[#172033]">{opt.label}</span>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!selectedId}
            className="rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px]"
          >
            Check Explanation
          </button>

          {submitted && (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-medium text-[#172033] hover:bg-slate-50 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try Another Choice
            </button>
          )}
        </div>
      </form>

      {submitted && selectedOption && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border p-4 text-sm flex items-start gap-3 ${
            isCorrect
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#7F1D1D]'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {isCorrect ? 'Correct Explanation' : 'Misconception Check'}
            </p>
            <p className="mt-1">{selectedOption.feedback}</p>
          </div>
        </div>
      )}
    </section>
  );
};
