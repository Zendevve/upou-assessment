import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  calculateNetForce,
  formatNum,
  HorizontalDirection,
} from '../../physics/calculations';
import { rubberband } from '../../utils/fluidMotion';

interface NetForceCalculatorProps {
  isCompleted?: boolean;
  onCompleted?: () => void;
}

const MAX_SLIDER_FORCE = 50;
const MAX_ARROW_PX = 115;

export const NetForceCalculator: React.FC<NetForceCalculatorProps> = ({
  isCompleted = false,
  onCompleted,
}) => {
  const [forceAMag, setForceAMag] = useState<string>('15');
  const [forceADir, setForceADir] = useState<HorizontalDirection>('right');
  const [forceBMag, setForceBMag] = useState<string>('5');
  const [forceBDir, setForceBDir] = useState<HorizontalDirection>('left');
  const [draggingWhich, setDraggingWhich] = useState<'A' | 'B' | null>(null);
  const [overshootPx, setOvershootPx] = useState<{ A: number; B: number }>({ A: 0, B: 0 });
  const [exploredBalanced, setExploredBalanced] = useState<boolean>(isCompleted);
  const [exploredUnbalanced, setExploredUnbalanced] = useState<boolean>(isCompleted);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragMetaRef = useRef<{
    which: 'A' | 'B';
    pointerId: number;
    grabOffsetN: number;
  } | null>(null);

  const parsedA = forceAMag.trim() === '' ? NaN : Number(forceAMag);
  const parsedB = forceBMag.trim() === '' ? NaN : Number(forceBMag);

  const result = calculateNetForce(
    { magnitude: parsedA, direction: forceADir },
    { magnitude: parsedB, direction: forceBDir }
  );

  const evaluateInteraction = (
    aMagVal: string,
    aDirVal: HorizontalDirection,
    bMagVal: string,
    bDirVal: HorizontalDirection
  ) => {
    const aNum = aMagVal.trim() === '' ? NaN : Number(aMagVal);
    const bNum = bMagVal.trim() === '' ? NaN : Number(bMagVal);
    const nextRes = calculateNetForce(
      { magnitude: aNum, direction: aDirVal },
      { magnitude: bNum, direction: bDirVal }
    );
    if (!nextRes.valid) return;

    const nextBal = exploredBalanced || nextRes.isBalanced;
    const nextUnbal = exploredUnbalanced || !nextRes.isBalanced;
    if (nextRes.isBalanced && !exploredBalanced) setExploredBalanced(true);
    if (!nextRes.isBalanced && !exploredUnbalanced) setExploredUnbalanced(true);
    if (nextBal && nextUnbal && onCompleted) {
      onCompleted();
    }
  };

  const applyPreset = (
    aMag: number,
    aDir: HorizontalDirection,
    bMag: number,
    bDir: HorizontalDirection
  ) => {
    const aStr = String(aMag);
    const bStr = String(bMag);
    setForceAMag(aStr);
    setForceADir(aDir);
    setForceBMag(bStr);
    setForceBDir(bDir);
    evaluateInteraction(aStr, aDir, bStr, bDir);
  };

  const handleReset = () => {
    setForceAMag('15');
    setForceADir('right');
    setForceBMag('5');
    setForceBDir('left');
  };

  // Scale arrow length visually (max 115px at 50N+)
  const scaleArrow = (mag: number, extraRubber = 0) => {
    if (!Number.isFinite(mag) || mag <= 0) return 0;
    const base = Math.min(MAX_ARROW_PX, Math.max(20, (mag / MAX_SLIDER_FORCE) * MAX_ARROW_PX));
    return Math.max(0, base + extraRubber);
  };

  // Convert clientX in SVG coordinate space (0..440) to signed force centered around crate edges (180..260)
  const clientXToSvgX = (clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 220;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0) return 220;
    return ((clientX - rect.left) / rect.width) * 440;
  };

  const svgXToSignedForce = (svgX: number): number => {
    // Crate spans x=180..260; dragging right of 260 yields +N, left of 180 yields -N
    if (svgX >= 260) {
      return ((svgX - 260) / MAX_ARROW_PX) * MAX_SLIDER_FORCE;
    }
    if (svgX <= 180) {
      return -(((180 - svgX) / MAX_ARROW_PX) * MAX_SLIDER_FORCE);
    }
    // Inside crate zone (180..260): smoothly map to [-5..+5] around center 220 so crossing 0 feels continuous
    return ((svgX - 220) / 40) * 5;
  };

  const startHandleDrag = (which: 'A' | 'B') => (e: React.PointerEvent<SVGCircleElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture unavailable
    }

    const currentSigned =
      which === 'A'
        ? (Number.isFinite(parsedA) ? parsedA : 0) * (forceADir === 'right' ? 1 : -1)
        : (Number.isFinite(parsedB) ? parsedB : 0) * (forceBDir === 'right' ? 1 : -1);

    const pointerSigned = svgXToSignedForce(clientXToSvgX(e.clientX));
    dragMetaRef.current = {
      which,
      pointerId: e.pointerId,
      grabOffsetN: currentSigned - pointerSigned,
    };
    setDraggingWhich(which);
  };

  const moveHandleDrag = (e: React.PointerEvent<SVGCircleElement>) => {
    const meta = dragMetaRef.current;
    if (!meta || meta.pointerId !== e.pointerId) return;

    const rawSigned = svgXToSignedForce(clientXToSvgX(e.clientX)) + meta.grabOffsetN;
    const clampedSigned = Math.max(-MAX_SLIDER_FORCE, Math.min(MAX_SLIDER_FORCE, rawSigned));
    const roundedMag = Math.round(Math.abs(clampedSigned));
    const nextDir: HorizontalDirection = clampedSigned >= 0 ? 'right' : 'left';

    // Progressive rubber-band visual extension when dragged past +-50 N
    const excessN = Math.abs(rawSigned) - MAX_SLIDER_FORCE;
    const rubberPx = excessN > 0 ? rubberband((excessN / MAX_SLIDER_FORCE) * MAX_ARROW_PX, 28, 0.55) : 0;

    if (meta.which === 'A') {
      const nextMagStr = String(roundedMag);
      const effectiveDir = roundedMag > 0 ? nextDir : forceADir;
      setForceAMag(nextMagStr);
      if (roundedMag > 0) setForceADir(nextDir);
      setOvershootPx((prev) => ({ ...prev, A: rubberPx }));
      evaluateInteraction(nextMagStr, effectiveDir, forceBMag, forceBDir);
    } else {
      const nextMagStr = String(roundedMag);
      const effectiveDir = roundedMag > 0 ? nextDir : forceBDir;
      setForceBMag(nextMagStr);
      if (roundedMag > 0) setForceBDir(nextDir);
      setOvershootPx((prev) => ({ ...prev, B: rubberPx }));
      evaluateInteraction(forceAMag, forceADir, nextMagStr, effectiveDir);
    }
  };

  const endHandleDrag = (e: React.PointerEvent<SVGCircleElement>) => {
    const meta = dragMetaRef.current;
    if (!meta || meta.pointerId !== e.pointerId) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    dragMetaRef.current = null;
    setDraggingWhich(null);
    setOvershootPx({ A: 0, B: 0 });
  };

  const arrowALen = result.valid ? scaleArrow(parsedA, overshootPx.A) : 0;
  const arrowBLen = result.valid ? scaleArrow(parsedB, overshootPx.B) : 0;
  const netArrowLen = result.valid ? scaleArrow(result.netMagnitude) : 0;

  return (
    <section
      aria-labelledby="activity-1-title"
      className="my-8 rounded-md border border-[#CBD5E1] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.01em] text-[#2563EB]">Interactive Activity 1</p>
          <h3 id="activity-1-title" className="mt-1 text-lg font-semibold text-[#172033]">
            Net Force Calculator
          </h3>
          <p className="mt-1 text-sm text-[#475569]">
            To complete this activity, test both a <strong>balanced (0 N)</strong> case and an <strong>unbalanced (≠ 0 N)</strong> case by dragging arrows, using presets, or adjusting inputs.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                isCompleted || exploredBalanced ? 'text-[#15803D]' : 'text-[#64748B]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Balanced (0 N) tested
            </span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                isCompleted || exploredUnbalanced ? 'text-[#15803D]' : 'text-[#64748B]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Unbalanced (≠ 0 N) tested
            </span>
            {isCompleted && (
              <span className="surface-enter rounded border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-semibold text-[#15803D]">
                Activity Completed
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="tactile-press inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#172033] hover:bg-slate-100 min-h-[40px]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#64748B]">Try presets:</span>
        <button
          type="button"
          onClick={() => applyPreset(10, 'right', 10, 'left')}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Balanced (10 N right, 10 N left)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(15, 'right', 5, 'left')}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Unbalanced (15 N right, 5 N left)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(8, 'right', 20, 'left')}
          className="tactile-press rounded border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-1.5 text-xs font-medium text-[#172033] hover:bg-slate-200/70 min-h-[36px]"
        >
          Leftward Net (8 N right, 20 N left)
        </button>
      </div>

      {/* Two-zone layout: Visual Stage + Control Inputs */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Visual Vector Stage */}
        <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col justify-between">
          <svg
            ref={svgRef}
            viewBox="0 0 440 200"
            className="w-full h-auto rounded border border-[#E2E8F0] bg-white select-none touch-pan-y"
            role="img"
            aria-label={
              result.valid
                ? `Force diagram showing Force A of ${formatNum(parsedA)} newtons ${forceADir} and Force B of ${formatNum(parsedB)} newtons ${forceBDir}, resulting in net force ${formatNum(result.netMagnitude)} newtons ${result.directionLabel}`
                : 'Force diagram awaiting valid inputs'
            }
          >
            {/* Floor */}
            <line x1="20" y1="126" x2="420" y2="126" stroke="#CBD5E1" strokeWidth="2" />

            {/* Crate */}
            <rect x="180" y="62" width="80" height="64" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
            <text x="220" y="99" textAnchor="middle" fontSize="13" fontWeight="600" fill="#172033">
              Object
            </text>

            {/* Force A Vector + Direct Drag Handle */}
            {result.valid && arrowALen > 0 && (
              <g>
                {forceADir === 'right' ? (
                  <>
                    <line x1="260" y1="80" x2={260 + arrowALen} y2="80" stroke="#2563EB" strokeWidth="3.5" />
                    <polygon
                      points={`${268 + arrowALen},80 ${257 + arrowALen},73 ${257 + arrowALen},87`}
                      fill="#2563EB"
                    />
                    <text
                      x={260 + arrowALen / 2}
                      y="68"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#1D4ED8"
                    >
                      F1: {formatNum(parsedA)} N
                    </text>
                    <circle
                      cx={264 + arrowALen}
                      cy="80"
                      r={draggingWhich === 'A' ? 12 : 10}
                      fill={draggingWhich === 'A' ? 'rgba(37,99,235,0.22)' : 'rgba(37,99,235,0.08)'}
                      stroke="#2563EB"
                      strokeOpacity={draggingWhich === 'A' ? 0.65 : 0.25}
                      strokeWidth="1.5"
                      className="cursor-grab active:cursor-grabbing touch-none"
                      onPointerDown={startHandleDrag('A')}
                      onPointerMove={moveHandleDrag}
                      onPointerUp={endHandleDrag}
                      onPointerCancel={endHandleDrag}
                    />
                  </>
                ) : (
                  <>
                    <line x1="180" y1="80" x2={180 - arrowALen} y2="80" stroke="#2563EB" strokeWidth="3.5" />
                    <polygon
                      points={`${172 - arrowALen},80 ${183 - arrowALen},73 ${183 - arrowALen},87`}
                      fill="#2563EB"
                    />
                    <text
                      x={180 - arrowALen / 2}
                      y="68"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#1D4ED8"
                    >
                      F1: {formatNum(parsedA)} N
                    </text>
                    <circle
                      cx={176 - arrowALen}
                      cy="80"
                      r={draggingWhich === 'A' ? 12 : 10}
                      fill={draggingWhich === 'A' ? 'rgba(37,99,235,0.22)' : 'rgba(37,99,235,0.08)'}
                      stroke="#2563EB"
                      strokeOpacity={draggingWhich === 'A' ? 0.65 : 0.25}
                      strokeWidth="1.5"
                      className="cursor-grab active:cursor-grabbing touch-none"
                      onPointerDown={startHandleDrag('A')}
                      onPointerMove={moveHandleDrag}
                      onPointerUp={endHandleDrag}
                      onPointerCancel={endHandleDrag}
                    />
                  </>
                )}
              </g>
            )}

            {/* Force B Vector + Direct Drag Handle */}
            {result.valid && arrowBLen > 0 && (
              <g>
                {forceBDir === 'right' ? (
                  <>
                    <line x1="260" y1="106" x2={260 + arrowBLen} y2="106" stroke="#B91C1C" strokeWidth="3.5" />
                    <polygon
                      points={`${268 + arrowBLen},106 ${257 + arrowBLen},99 ${257 + arrowBLen},113`}
                      fill="#B91C1C"
                    />
                    <text
                      x={260 + arrowBLen / 2}
                      y="120"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#B91C1C"
                    >
                      F2: {formatNum(parsedB)} N
                    </text>
                    <circle
                      cx={264 + arrowBLen}
                      cy="106"
                      r={draggingWhich === 'B' ? 12 : 10}
                      fill={draggingWhich === 'B' ? 'rgba(185,28,28,0.2)' : 'rgba(185,28,28,0.07)'}
                      stroke="#B91C1C"
                      strokeOpacity={draggingWhich === 'B' ? 0.65 : 0.25}
                      strokeWidth="1.5"
                      className="cursor-grab active:cursor-grabbing touch-none"
                      onPointerDown={startHandleDrag('B')}
                      onPointerMove={moveHandleDrag}
                      onPointerUp={endHandleDrag}
                      onPointerCancel={endHandleDrag}
                    />
                  </>
                ) : (
                  <>
                    <line x1="180" y1="106" x2={180 - arrowBLen} y2="106" stroke="#B91C1C" strokeWidth="3.5" />
                    <polygon
                      points={`${172 - arrowBLen},106 ${183 - arrowBLen},99 ${183 - arrowBLen},113`}
                      fill="#B91C1C"
                    />
                    <text
                      x={180 - arrowBLen / 2}
                      y="120"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#B91C1C"
                    >
                      F2: {formatNum(parsedB)} N
                    </text>
                    <circle
                      cx={176 - arrowBLen}
                      cy="106"
                      r={draggingWhich === 'B' ? 12 : 10}
                      fill={draggingWhich === 'B' ? 'rgba(185,28,28,0.2)' : 'rgba(185,28,28,0.07)'}
                      stroke="#B91C1C"
                      strokeOpacity={draggingWhich === 'B' ? 0.65 : 0.25}
                      strokeWidth="1.5"
                      className="cursor-grab active:cursor-grabbing touch-none"
                      onPointerDown={startHandleDrag('B')}
                      onPointerMove={moveHandleDrag}
                      onPointerUp={endHandleDrag}
                      onPointerCancel={endHandleDrag}
                    />
                  </>
                )}
              </g>
            )}

            {/* Resultant Net Force Row */}
            <line x1="20" y1="146" x2="420" y2="146" stroke="#E2E8F0" strokeWidth="1" />
            {result.valid && (
              <g>
                {result.isBalanced ? (
                  <text x="220" y="176" textAnchor="middle" fontSize="13" fontWeight="600" fill="#15803D">
                    Net Force (F_net) = 0 N · Forces are balanced
                  </text>
                ) : result.direction === 'right' ? (
                  <>
                    <text x="40" y="176" fontSize="12" fontWeight="600" fill="#172033">
                      Result (F_net):
                    </text>
                    <line x1="150" y1="172" x2={150 + netArrowLen} y2="172" stroke="#15803D" strokeWidth="4" />
                    <polygon
                      points={`${158 + netArrowLen},172 ${147 + netArrowLen},165 ${147 + netArrowLen},179`}
                      fill="#15803D"
                    />
                    <text x={168 + netArrowLen} y="176" fontSize="12" fontWeight="700" fill="#15803D">
                      {formatNum(result.netMagnitude)} N right
                    </text>
                  </>
                ) : (
                  <>
                    <text x="395" y="176" textAnchor="end" fontSize="12" fontWeight="600" fill="#172033">
                      :Result (F_net)
                    </text>
                    <line x1="290" y1="172" x2={290 - netArrowLen} y2="172" stroke="#15803D" strokeWidth="4" />
                    <polygon
                      points={`${282 - netArrowLen},172 ${293 - netArrowLen},165 ${293 - netArrowLen},179`}
                      fill="#15803D"
                    />
                    <text x={274 - netArrowLen} y="176" textAnchor="end" fontSize="12" fontWeight="700" fill="#15803D">
                      {formatNum(result.netMagnitude)} N left
                    </text>
                  </>
                )}
              </g>
            )}
          </svg>

          {/* Calculated Summary Readout */}
          {result.valid ? (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-md border p-4 transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                result.isBalanced
                  ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                  : 'border-[#BFDBFE] bg-[#EFF6FF]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#475569]">Calculated Net Force</span>
                <span className="font-mono text-sm font-bold text-[#172033] tabular-nums">
                  {formatNum(result.netMagnitude)} N {result.isBalanced ? '(Balanced)' : result.directionLabel}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-xs text-[#334155] tabular-nums">
                {result.equationText}
              </p>
              <p className="mt-2 text-sm text-[#172033] flex items-start gap-2">
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    result.isBalanced ? 'text-[#15803D]' : 'text-[#2563EB]'
                  }`}
                  aria-hidden="true"
                />
                <span>{result.motionSummary}</span>
              </p>
            </div>
          ) : (
            <div
              role="alert"
              className="surface-enter mt-4 rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-sm text-[#991B1B]"
            >
              {result.error}
            </div>
          )}
        </div>

        {/* Force Controls */}
        <div className="space-y-4">
          {/* Force 1 Control */}
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <label htmlFor="force-1-input" className="block text-sm font-semibold text-[#172033]">
              Force 1 (N)
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="force-1-input"
                type="number"
                min={0}
                max={100}
                step={1}
                value={forceAMag}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceAMag(val);
                  evaluateInteraction(val, forceADir, forceBMag, forceBDir);
                }}
                className="w-24 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] tabular-nums min-h-[44px]"
              />
              <input
                type="range"
                aria-label="Force 1 slider in newtons"
                min={0}
                max={50}
                step={1}
                value={Number.isFinite(parsedA) ? Math.min(50, Math.max(0, parsedA)) : 0}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceAMag(val);
                  evaluateInteraction(val, forceADir, forceBMag, forceBDir);
                }}
                className="physics-slider flex-1"
              />
            </div>

            <div className="mt-3 flex items-center gap-2" role="group" aria-label="Force 1 direction">
              <button
                type="button"
                onClick={() => {
                  setForceADir('left');
                  evaluateInteraction(forceAMag, 'left', forceBMag, forceBDir);
                }}
                aria-pressed={forceADir === 'left'}
                className={`tactile-press flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium min-h-[40px] ${
                  forceADir === 'left'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Left (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setForceADir('right');
                  evaluateInteraction(forceAMag, 'right', forceBMag, forceBDir);
                }}
                aria-pressed={forceADir === 'right'}
                className={`tactile-press flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium min-h-[40px] ${
                  forceADir === 'right'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A]'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50'
                }`}
              >
                Right (+)
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Force 2 Control */}
          <div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <label htmlFor="force-2-input" className="block text-sm font-semibold text-[#172033]">
              Force 2 (N)
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="force-2-input"
                type="number"
                min={0}
                max={100}
                step={1}
                value={forceBMag}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceBMag(val);
                  evaluateInteraction(forceAMag, forceADir, val, forceBDir);
                }}
                className="w-24 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-sm text-[#172033] tabular-nums min-h-[44px]"
              />
              <input
                type="range"
                aria-label="Force 2 slider in newtons"
                min={0}
                max={50}
                step={1}
                value={Number.isFinite(parsedB) ? Math.min(50, Math.max(0, parsedB)) : 0}
                onChange={(e) => {
                  const val = e.target.value;
                  setForceBMag(val);
                  evaluateInteraction(forceAMag, forceADir, val, forceBDir);
                }}
                className="physics-slider flex-1"
              />
            </div>

            <div className="mt-3 flex items-center gap-2" role="group" aria-label="Force 2 direction">
              <button
                type="button"
                onClick={() => {
                  setForceBDir('left');
                  evaluateInteraction(forceAMag, forceADir, forceBMag, 'left');
                }}
                aria-pressed={forceBDir === 'left'}
                className={`tactile-press flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium min-h-[40px] ${
                  forceBDir === 'left'
                    ? 'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B]'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Left (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setForceBDir('right');
                  evaluateInteraction(forceAMag, forceADir, forceBMag, 'right');
                }}
                aria-pressed={forceBDir === 'right'}
                className={`tactile-press flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium min-h-[40px] ${
                  forceBDir === 'right'
                    ? 'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B]'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50'
                }`}
              >
                Right (+)
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="text-xs text-[#64748B]">
            Convention: Forces to the right are positive (<span className="font-mono">+</span>) and forces to the left are negative (<span className="font-mono">-</span>).
          </p>
        </div>
      </div>
    </section>
  );
};
