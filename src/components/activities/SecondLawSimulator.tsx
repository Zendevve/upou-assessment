import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw } from 'lucide-react';
import { calculateAcceleration, formatNum } from '../../physics/calculations';
import {
  computePointerVelocity,
  prefersReducedMotion,
  rubberband,
  VelocitySample,
} from '../../utils/fluidMotion';

interface SecondLawSimulatorProps {
  isCompleted?: boolean;
  onCompleted?: () => void;
}

const MIN_PCT = 12;
const MAX_PCT = 88;
const SVG_WIDTH = 480;

export const SecondLawSimulator: React.FC<SecondLawSimulatorProps> = ({
  isCompleted = false,
  onCompleted,
}) => {
  const [forceInput, setForceInput] = useState<string>('20');
  const [massInput, setMassInput] = useState<string>('5');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cartOffsetPct, setCartOffsetPct] = useState<number>(50); // 12..88% along track
  const [velocityMs, setVelocityMs] = useState<number>(0);
  const [isDraggingCart, setIsDraggingCart] = useState<boolean>(false);
  const [testedConfigs, setTestedConfigs] = useState<string[]>([]);
  const [observedMotion, setObservedMotion] = useState<boolean>(isCompleted);

  const parsedForce = forceInput.trim() === '' ? NaN : Number(forceInput);
  const parsedMass = massInput.trim() === '' ? NaN : Number(massInput);
  const calc = calculateAcceleration(parsedForce, parsedMass);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    grabOffsetPct: number;
    samples: VelocitySample[];
  } | null>(null);

  useEffect(() => {
    if (!isPlaying || !calc.valid || isDraggingCart) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }

    if (prefersReducedMotion()) {
      setIsPlaying(false);
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min(0.05, (timestamp - lastTimeRef.current) / 1000);
      lastTimeRef.current = timestamp;

      setVelocityMs((prevV) => {
        const nextV = prevV + calc.accelerationMs2 * dt;
        setCartOffsetPct((prevPos) => {
          let nextPos = prevPos + nextV * dt * 5;
          if (nextPos > MAX_PCT) nextPos = MIN_PCT;
          if (nextPos < MIN_PCT) nextPos = MAX_PCT;
          return nextPos;
        });
        return Math.max(-25, Math.min(25, nextV));
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, calc.valid, calc.accelerationMs2, isDraggingCart]);

  const recordExperiment = (
    nextForceStr: string,
    nextMassStr: string,
    motionTriggered = false
  ) => {
    const fNum = nextForceStr.trim() === '' ? NaN : Number(nextForceStr);
    const mNum = nextMassStr.trim() === '' ? NaN : Number(nextMassStr);
    const nextCalc = calculateAcceleration(fNum, mNum);

    let nextConfigs = testedConfigs;
    if (nextCalc.valid) {
      const key = `${formatNum(fNum)}:${formatNum(mNum)}`;
      if (!testedConfigs.includes(key)) {
        nextConfigs = [...testedConfigs, key];
        setTestedConfigs(nextConfigs);
      }
    }

    const nextMotion = observedMotion || motionTriggered;
    if (motionTriggered && !observedMotion) {
      setObservedMotion(true);
    }

    if (nextConfigs.length >= 2 && nextMotion && onCompleted) {
      onCompleted();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setForceInput('20');
    setMassInput('5');
    setCartOffsetPct(50);
    setVelocityMs(0);
  };

  const applyPreset = (f: number, m: number) => {
    const fStr = String(f);
    const mStr = String(m);
    setIsPlaying(false);
    setForceInput(fStr);
    setMassInput(mStr);
    setCartOffsetPct(50);
    setVelocityMs(0);
    recordExperiment(fStr, mStr, false);
  };

  const clientXToTrackPct = (clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 50;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0) return 50;
    return ((clientX - rect.left) / rect.width) * 100;
  };

  // Direct manipulation on the cart (interruptible, grab-offset aware, rubber-banded edges, velocity handoff)
  const handleCartPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const pointerPct = clientXToTrackPct(e.clientX);
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      grabOffsetPct: cartOffsetPct - pointerPct,
      samples: [{ x: e.clientX, y: e.clientY, time: performance.now() }],
    };

    // Interrupt active playback immediately and grab the live cart position
    setIsDraggingCart(true);
    setIsPlaying(false);
    setVelocityMs(0);
    recordExperiment(forceInput, massInput, true);
  };

  const handleCartPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.active || drag.pointerId !== e.pointerId) return;

    const rawPct = clientXToTrackPct(e.clientX) + drag.grabOffsetPct;
    let nextPct = rawPct;
    if (rawPct < MIN_PCT) {
      nextPct = MIN_PCT + rubberband(rawPct - MIN_PCT, 10, 0.55);
    } else if (rawPct > MAX_PCT) {
      nextPct = MAX_PCT + rubberband(rawPct - MAX_PCT, 10, 0.55);
    }

    drag.samples.push({ x: e.clientX, y: e.clientY, time: performance.now() });
    if (drag.samples.length > 8) drag.samples.shift();

    setCartOffsetPct(nextPct);
  };

  const handleCartPointerEnd = (e: React.PointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.active || drag.pointerId !== e.pointerId) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const { vx } = computePointerVelocity(drag.samples);
    const svgWidthPx = svgRef.current?.getBoundingClientRect().width || SVG_WIDTH;
    // Convert px/s to track %/s -> m/s (matching `nextV * dt * 5`)
    const pctPerSec = (vx / svgWidthPx) * 100;
    const handoffVelocityMs = Math.max(-18, Math.min(18, pctPerSec / 5));

    dragRef.current = null;
    setIsDraggingCart(false);

    // Clamp cleanly back inside track if released inside rubber-band zone
    setCartOffsetPct((p) => Math.max(MIN_PCT, Math.min(MAX_PCT, p)));

    // If learner flicked the cart while valid, hand off velocity seamlessly into playback
    if (calc.valid && Math.abs(vx) > 220 && !prefersReducedMotion()) {
      setVelocityMs(handoffVelocityMs);
      setIsPlaying(true);
    }
  };

  const clampedForceSlider = Number.isFinite(parsedForce)
    ? Math.max(-50, Math.min(50, parsedForce))
    : 0;
  const clampedMassSlider = Number.isFinite(parsedMass)
    ? Math.max(1, Math.min(20, parsedMass))
    : 1;

  // Box size scales slightly with mass for visual clarity (38px to 68px)
  const boxSize = calc.valid ? Math.min(68, Math.max(38, 34 + parsedMass * 1.7)) : 46;
  const forceArrowLen = calc.valid ? Math.min(95, Math.abs(parsedForce) * 1.9) : 0;
  const accBarRatio = calc.valid ? Math.min(1, calc.magnitudeMs2 / 15) : 0;

  // Position cart relative to SVG center (240) using GPU transform translateX
  const baseCenterX = SVG_WIDTH / 2;
  const cartTranslateX = ((cartOffsetPct - 50) / 100) * SVG_WIDTH;
  const boxX = baseCenterX - boxSize / 2;
  const boxY = 128 - boxSize;

  return (
    <section
      aria-labelledby="activity-3-title"
      className="my-8 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.01em] text-[#2563EB]">Interactive Activity 3</p>
          <h3 id="activity-3-title" className="mt-1 text-lg font-semibold text-[#172033]">
            Newton’s Second Law Simulator (F_net = ma)
          </h3>
          <p className="mt-1 text-sm text-[#475569]">
            Test at least 2 different force–mass combinations and observe the motion (press Run Motion or drag the box) to complete this activity.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                isCompleted || testedConfigs.length >= 2 ? 'text-[#15803D]' : 'text-[#64748B]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {isCompleted ? '2/2' : `${Math.min(2, testedConfigs.length)}/2`} combinations tested
            </span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                isCompleted || observedMotion ? 'text-[#15803D]' : 'text-[#64748B]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Motion observed
            </span>
            {isCompleted && (
              <span className="surface-enter rounded border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-semibold text-[#15803D]">
                Activity Completed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!calc.valid || calc.accelerationMs2 === 0}
            onClick={() => {
              setIsPlaying((p) => !p);
              recordExperiment(forceInput, massInput, true);
            }}
            className="tactile-press inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-45 disabled:cursor-not-allowed min-h-[40px]"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                Pause Motion
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Run Motion
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#172033] hover:bg-slate-100 min-h-[40px]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Experiment presets */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#64748B]">Compare cases:</span>
        <button
          type="button"
          onClick={() => applyPreset(20, 5)}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Baseline (20 N, 5 kg)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(40, 5)}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Double Force (40 N, 5 kg)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(20, 10)}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Double Mass (20 N, 10 kg)
        </button>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Left/Top Stage */}
        <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col justify-between">
          <div>
            {/* Track Visual */}
            <svg
              ref={svgRef}
              viewBox="0 0 480 175"
              className="w-full h-auto rounded border border-[#E2E8F0] bg-white select-none touch-pan-y"
              role="img"
              aria-label={
                calc.valid
                  ? `Simulation track: ${formatNum(parsedMass)} kilogram object with net force ${formatNum(parsedForce)} newtons producing acceleration ${formatNum(calc.magnitudeMs2)} meters per second squared ${calc.directionLabel}`
                  : 'Simulation track awaiting valid mass greater than 0 kilograms'
              }
            >
              {/* Reference ticks */}
              {[80, 160, 240, 320, 400].map((x) => (
                <line key={x} x1={x} y1="128" x2={x} y2="136" stroke="#CBD5E1" strokeWidth="1.5" />
              ))}
              {/* Ground Track */}
              <line x1="20" y1="128" x2="460" y2="128" stroke="#64748B" strokeWidth="2.5" />

              {/* GPU-translated Interactive Cart Group */}
              <g
                onPointerDown={handleCartPointerDown}
                onPointerMove={handleCartPointerMove}
                onPointerUp={handleCartPointerEnd}
                onPointerCancel={handleCartPointerEnd}
                className="cursor-grab active:cursor-grabbing touch-none"
                style={{
                  transform: `translateX(${cartTranslateX}px)`,
                  transition: isDraggingCart || isPlaying ? 'none' : 'transform 220ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                {/* Generous touch hit-target (>= 58px SVG units) */}
                <rect
                  x={boxX - 10}
                  y={boxY - 10}
                  width={boxSize + 20}
                  height={boxSize + 20}
                  fill="transparent"
                />
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxSize}
                  height={boxSize}
                  rx="4"
                  fill={isDraggingCart ? '#DBEAFE' : '#EFF6FF'}
                  stroke="#1E40AF"
                  strokeWidth="2"
                />
                <text
                  x={baseCenterX}
                  y={boxY + boxSize / 2 + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#172033"
                >
                  {calc.valid ? `${formatNum(parsedMass)} kg` : '? kg'}
                </text>

                {/* Net Force Vector */}
                {calc.valid && forceArrowLen > 0 && (
                  <g>
                    {parsedForce > 0 ? (
                      <>
                        <line
                          x1={baseCenterX + boxSize / 2}
                          y1={boxY + boxSize / 2}
                          x2={baseCenterX + boxSize / 2 + forceArrowLen}
                          y2={boxY + boxSize / 2}
                          stroke="#2563EB"
                          strokeWidth="3.5"
                        />
                        <polygon
                          points={`${baseCenterX + boxSize / 2 + forceArrowLen + 8},${boxY + boxSize / 2} ${
                            baseCenterX + boxSize / 2 + forceArrowLen - 3
                          },${boxY + boxSize / 2 - 6} ${baseCenterX + boxSize / 2 + forceArrowLen - 3},${
                            boxY + boxSize / 2 + 6
                          }`}
                          fill="#2563EB"
                        />
                        <text
                          x={baseCenterX + boxSize / 2 + forceArrowLen / 2}
                          y={boxY + boxSize / 2 - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="#1D4ED8"
                        >
                          {formatNum(parsedForce)} N
                        </text>
                      </>
                    ) : (
                      <>
                        <line
                          x1={baseCenterX - boxSize / 2}
                          y1={boxY + boxSize / 2}
                          x2={baseCenterX - boxSize / 2 - forceArrowLen}
                          y2={boxY + boxSize / 2}
                          stroke="#B91C1C"
                          strokeWidth="3.5"
                        />
                        <polygon
                          points={`${baseCenterX - boxSize / 2 - forceArrowLen - 8},${boxY + boxSize / 2} ${
                            baseCenterX - boxSize / 2 - forceArrowLen + 3
                          },${boxY + boxSize / 2 - 6} ${baseCenterX - boxSize / 2 - forceArrowLen + 3},${
                            boxY + boxSize / 2 + 6
                          }`}
                          fill="#B91C1C"
                        />
                        <text
                          x={baseCenterX - boxSize / 2 - forceArrowLen / 2}
                          y={boxY + boxSize / 2 - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill="#B91C1C"
                        >
                          {formatNum(Math.abs(parsedForce))} N
                        </text>
                      </>
                    )}
                  </g>
                )}

                {/* Acceleration Vector above box */}
                {calc.valid && calc.magnitudeMs2 > 0 && (
                  <g>
                    {calc.direction === 'right' ? (
                      <>
                        <line
                          x1={baseCenterX - 18}
                          y1={boxY - 14}
                          x2={baseCenterX + 22}
                          y2={boxY - 14}
                          stroke="#15803D"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${baseCenterX + 29},${boxY - 14} ${baseCenterX + 19},${boxY - 19} ${
                            baseCenterX + 19
                          },${boxY - 9}`}
                          fill="#15803D"
                        />
                      </>
                    ) : (
                      <>
                        <line
                          x1={baseCenterX + 18}
                          y1={boxY - 14}
                          x2={baseCenterX - 22}
                          y2={boxY - 14}
                          stroke="#15803D"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${baseCenterX - 29},${boxY - 14} ${baseCenterX - 19},${boxY - 19} ${
                            baseCenterX - 19
                          },${boxY - 9}`}
                          fill="#15803D"
                        />
                      </>
                    )}
                    <text
                      x={baseCenterX}
                      y={boxY - 24}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#15803D"
                    >
                      a = {formatNum(calc.magnitudeMs2)} m/s²
                    </text>
                  </g>
                )}
              </g>

              <text x="240" y="158" textAnchor="middle" fontSize="11" fill="#64748B">
                {isDraggingCart
                  ? 'Release or flick the box to launch it along the track'
                  : isPlaying
                  ? `Instantaneous speed: ${formatNum(Math.abs(velocityMs))} m/s`
                  : 'Press "Run Motion" or drag/flick the box along the track'}
              </text>
            </svg>
          </div>

          {/* Live Readout Panel */}
          {calc.valid ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-md border border-[#E2E8F0] bg-white p-4 space-y-3"
            >
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                  <p className="text-xs text-[#64748B]">Net Force</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-[#172033] tabular-nums">
                    {formatNum(Math.abs(parsedForce))} N {parsedForce > 0 ? 'right' : parsedForce < 0 ? 'left' : ''}
                  </p>
                </div>
                <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                  <p className="text-xs text-[#64748B]">Mass</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-[#172033] tabular-nums">
                    {formatNum(parsedMass)} kg
                  </p>
                </div>
                <div className="rounded border border-[#BBF7D0] bg-[#F0FDF4] p-2.5">
                  <p className="text-xs text-[#15803D] font-medium">Acceleration</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-[#15803D] tabular-nums">
                    {formatNum(calc.magnitudeMs2)} m/s²
                  </p>
                </div>
              </div>

              {/* Acceleration magnitude bar (GPU-composited scaleX) */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#475569]">
                  <span>Acceleration Magnitude</span>
                  <span className="font-medium text-[#172033]">Direction: {calc.directionLabel}</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-sm bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full w-full origin-left bg-[#15803D] transition-transform duration-180 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ transform: `scaleX(${accBarRatio})` }}
                  />
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-3">
                <p className="font-mono text-xs sm:text-sm font-medium text-[#172033] tabular-nums">
                  {calc.substitutionText}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
                  {calc.relationshipExplanation}
                </p>
              </div>
            </div>
          ) : (
            <div
              role="alert"
              className="surface-enter mt-4 rounded-md border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
            >
              <p className="font-semibold">Invalid Simulation Input</p>
              <p className="mt-1">{calc.error}</p>
            </div>
          )}
        </div>

        {/* Right/Bottom Control Deck */}
        <div className="space-y-4">
          {/* Applied Net Force Control */}
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sim-force-input" className="text-sm font-semibold text-[#172033]">
                Applied Net Force (N)
              </label>
              <span className="font-mono text-xs text-[#475569] tabular-nums">
                {Number.isFinite(parsedForce)
                  ? parsedForce > 0
                    ? `${formatNum(parsedForce)} N right`
                    : parsedForce < 0
                    ? `${formatNum(Math.abs(parsedForce))} N left`
                    : '0 N (Balanced)'
                  : 'Enter value'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <input
                id="sim-force-input"
                type="number"
                min={-50}
                max={50}
                step={1}
                value={forceInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceInput(val);
                  recordExperiment(val, massInput, false);
                }}
                className="w-24 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] tabular-nums min-h-[44px]"
              />
              <input
                type="range"
                aria-label="Applied net force slider from minus 50 to plus 50 newtons"
                min={-50}
                max={50}
                step={1}
                value={clampedForceSlider}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceInput(val);
                  recordExperiment(val, massInput, false);
                }}
                className="physics-slider flex-1"
              />
            </div>
            <p className="mt-2 text-xs text-[#64748B]">
              Negative values push left (-50 N to -1 N); positive values push right (+1 N to +50 N).
            </p>
          </div>

          {/* Mass Control */}
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sim-mass-input" className="text-sm font-semibold text-[#172033]">
                Object Mass (kg)
              </label>
              <span className="font-mono text-xs text-[#475569] tabular-nums">
                {calc.valid ? `${formatNum(parsedMass)} kg` : 'Must be > 0 kg'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <input
                id="sim-mass-input"
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={massInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setMassInput(val);
                  recordExperiment(forceInput, val, false);
                }}
                aria-invalid={!calc.valid}
                className={`w-24 rounded-md border bg-white px-3 py-2 font-mono text-sm text-[#172033] tabular-nums min-h-[44px] transition-colors duration-150 ${
                  !calc.valid ? 'border-[#B91C1C]' : 'border-[#CBD5E1]'
                }`}
              />
              <input
                type="range"
                aria-label="Object mass slider in kilograms"
                min={1}
                max={20}
                step={1}
                value={clampedMassSlider}
                onChange={(e) => {
                  const val = e.target.value;
                  setMassInput(val);
                  recordExperiment(forceInput, val, false);
                }}
                className="physics-slider flex-1"
              />
            </div>
            <p className="mt-2 text-xs text-[#64748B]">
              Mass must be positive (greater than 0 kg). Try keeping net force constant and doubling mass.
            </p>
          </div>

          {/* Key Investigation Prompts */}
          <div className="rounded-md border border-[#E2E8F0] bg-white p-4 text-xs sm:text-sm text-[#334155]">
            <p className="font-semibold text-[#172033]">Guided Experiments to Try</p>
            <ul className="mt-2 space-y-1.5 list-disc pl-4">
              <li>Keep mass at 5 kg and raise force from 20 N to 40 N. Notice acceleration doubles.</li>
              <li>Keep force at 20 N and increase mass from 5 kg to 10 kg. Notice acceleration halves.</li>
              <li>Set net force to 0 N. Acceleration drops to 0 m/s².</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
