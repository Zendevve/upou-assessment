import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

interface IntegratedSynthesisActivityProps {
  onCompleted: () => void;
}

export const IntegratedSynthesisActivity: React.FC<IntegratedSynthesisActivityProps> = ({
  onCompleted,
}) => {
  const [forcesChoice, setForcesChoice] = useState('');
  const [netForceInput, setNetForceInput] = useState('');
  const [netForceDir, setNetForceDir] = useState('');
  const [accInput, setAccInput] = useState('');
  const [lawChoice, setLawChoice] = useState('');
  const [motionChoice, setMotionChoice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const forcesOk = forcesChoice === '15r-5l';
  const netMagOk = netForceInput.trim() !== '' && Math.abs(Number(netForceInput) - 10) <= 0.05;
  const netDirOk = netForceDir === 'right';
  const accOk = accInput.trim() !== '' && Math.abs(Number(accInput) - 2) <= 0.05;
  const lawOk = lawChoice === 'second';
  const motionOk = motionChoice === 'accel-right';

  const allCorrect = forcesOk && netMagOk && netDirOk && accOk && lawOk && motionOk;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (allCorrect) {
      onCompleted();
    }
  };

  const handleReset = () => {
    setForcesChoice('');
    setNetForceInput('');
    setNetForceDir('');
    setAccInput('');
    setLawChoice('');
    setMotionChoice('');
    setSubmitted(false);
  };

  return (
    <section
      aria-labelledby="synthesis-activity-title"
      className="my-8 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      <div className="border-b border-[#E2E8F0] pb-4">
        <p className="text-xs font-semibold tracking-[0.01em] text-[#2563EB]">Guided Synthesis Practice</p>
        <h3 id="synthesis-activity-title" className="mt-1 text-lg font-semibold text-[#172033]">
          Step-by-Step Analysis: Applying All Concepts Together
        </h3>
        <p className="mt-1 text-sm text-[#475569]">
          Complete each of the five steps below for the 5 kg box scenario before checking your full interpretation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Step 1 */}
        <div>
          <label htmlFor="synth-step-1" className="block text-sm font-semibold text-[#172033]">
            Step 1: Identify the horizontal forces acting on the box
          </label>
          <select
            id="synth-step-1"
            value={forcesChoice}
            onChange={(e) => {
              setForcesChoice(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px]"
          >
            <option value="">Choose the horizontal forces...</option>
            <option value="15r-5l">Applied push of 15 N to the right, and friction of 5 N to the left</option>
            <option value="15r-5r">Applied push of 15 N to the right, and friction of 5 N to the right</option>
            <option value="20r">A single combined force of 20 N to the right</option>
          </select>
        </div>

        {/* Step 2 */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="synth-step-2-mag" className="block text-sm font-semibold text-[#172033]">
              Step 2a: Horizontal net force magnitude (N)
            </label>
            <input
              id="synth-step-2-mag"
              type="number"
              step="any"
              placeholder="e.g. 10"
              value={netForceInput}
              onChange={(e) => {
                setNetForceInput(e.target.value);
                if (submitted) setSubmitted(false);
              }}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="synth-step-2-dir" className="block text-sm font-semibold text-[#172033]">
              Step 2b: Net force direction
            </label>
            <select
              id="synth-step-2-dir"
              value={netForceDir}
              onChange={(e) => {
                setNetForceDir(e.target.value);
                if (submitted) setSubmitted(false);
              }}
              className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px]"
            >
              <option value="">Select direction...</option>
              <option value="right">To the right</option>
              <option value="left">To the left</option>
              <option value="none">Balanced (0 N)</option>
            </select>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <label htmlFor="synth-step-3" className="block text-sm font-semibold text-[#172033]">
            Step 3: Determine the box’s acceleration (m/s²)
          </label>
          <input
            id="synth-step-3"
            type="number"
            step="any"
            placeholder="Use a = F_net / m (with m = 5 kg)"
            value={accInput}
            onChange={(e) => {
              setAccInput(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className="mt-1.5 w-full sm:w-64 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] min-h-[44px]"
          />
        </div>

        {/* Step 4 */}
        <div>
          <label htmlFor="synth-step-4" className="block text-sm font-semibold text-[#172033]">
            Step 4: Which law directly connects net force, mass, and acceleration here?
          </label>
          <select
            id="synth-step-4"
            value={lawChoice}
            onChange={(e) => {
              setLawChoice(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px]"
          >
            <option value="">Select Newton’s law...</option>
            <option value="first">Newton’s First Law (Law of Inertia)</option>
            <option value="second">Newton’s Second Law (F_net = ma)</option>
            <option value="third">Newton’s Third Law (Action–Reaction)</option>
          </select>
        </div>

        {/* Step 5 */}
        <div>
          <label htmlFor="synth-step-5" className="block text-sm font-semibold text-[#172033]">
            Step 5: Explain the resulting motion of the box
          </label>
          <select
            id="synth-step-5"
            value={motionChoice}
            onChange={(e) => {
              setMotionChoice(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            className="mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] min-h-[44px]"
          >
            <option value="">Select resulting motion...</option>
            <option value="accel-right">
              The box accelerates to the right at 2 m/s² horizontally, with zero vertical acceleration.
            </option>
            <option value="constant-vel">
              The box moves at constant velocity because friction cancels part of the push.
            </option>
            <option value="accel-up">
              The box accelerates upward and to the right because normal force acts upward.
            </option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="tactile-press rounded-md bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] min-h-[44px]"
          >
            Check 5-Step Solution
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] hover:bg-slate-50 min-h-[44px]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Steps
          </button>
        </div>
      </form>

      {submitted && (
        <div
          key={allCorrect ? 'synth-ok' : 'synth-err'}
          role="status"
          aria-live="polite"
          className={`surface-enter mt-5 rounded-md border p-4 text-sm flex items-start gap-3 ${
            allCorrect
              ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
              : 'border-[#FECACA] bg-[#FEF2F2] text-[#7F1D1D]'
          }`}
        >
          {allCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {allCorrect ? 'Complete 5-Step Analysis Verified' : 'Review Highlighted Steps'}
            </p>
            {allCorrect ? (
              <p className="mt-1">
                Well done! Applied force (15 N right) minus friction (5 N left) gives F_net = 10 N right. By Newton’s Second Law, a = 10 N / 5 kg = 2 m/s² to the right, while balanced vertical forces keep vertical acceleration at zero.
              </p>
            ) : (
              <ul className="mt-1.5 list-disc pl-4 space-y-1">
                {!forcesOk && <li>Step 1: Friction opposes motion, so it acts to the left (opposite the 15 N rightward push).</li>}
                {(!netMagOk || !netDirOk) && (
                  <li>Step 2: Subtract opposing horizontal forces: 15 N right − 5 N left = 10 N to the right.</li>
                )}
                {!accOk && <li>Step 3: Divide horizontal net force (10 N) by mass (5 kg) to get 2 m/s².</li>}
                {!lawOk && <li>Step 4: F_net = ma is Newton’s Second Law.</li>}
                {!motionOk && (
                  <li>
                    Step 5: With a nonzero horizontal net force, the box accelerates horizontally to the right while vertical forces remain balanced.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
