/**
 * Apple Designing Fluid Interfaces (WWDC 2018) utilities translated for the web:
 * - Exponential momentum projection
 * - Progressive rubber-banding at boundaries
 * - Pointer velocity tracking over a recent sample window
 */

export interface VelocitySample {
  x: number;
  y: number;
  time: number;
}

/**
 * Apple's exponential-decay momentum projection function.
 * decelerationRate ~ 0.998 for normal scroll feel; 0.99 for snappier drawers/cards.
 */
export function projectMomentum(
  initialVelocityPxPerSec: number,
  decelerationRate = 0.996
): number {
  if (!Number.isFinite(initialVelocityPxPerSec) || decelerationRate >= 1 || decelerationRate <= 0) {
    return 0;
  }
  return ((initialVelocityPxPerSec / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive rubber-band resistance past a boundary.
 * Returns a damped displacement with the same sign as overshoot.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (!Number.isFinite(overshoot) || !Number.isFinite(dimension) || dimension <= 0) {
    return 0;
  }
  if (overshoot === 0) return 0;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * Computes instantaneous pointer velocity (px/s) from recent samples (within ~100ms).
 */
export function computePointerVelocity(
  samples: VelocitySample[],
  now?: number
): { vx: number; vy: number } {
  if (samples.length < 2) {
    return { vx: 0, vy: 0 };
  }
  const latest = samples[samples.length - 1];
  const cutoff = (now ?? latest.time) - 110;

  let anchor = samples[0];
  for (let i = samples.length - 1; i >= 0; i--) {
    if (samples[i].time >= cutoff) {
      anchor = samples[i];
    } else {
      break;
    }
  }

  const dtMs = latest.time - anchor.time;
  if (dtMs <= 4) {
    // Fall back to previous sample if latest timestamps are nearly identical
    const prev = samples[samples.length - 2];
    const fallbackDt = latest.time - prev.time;
    if (fallbackDt <= 0) return { vx: 0, vy: 0 };
    return {
      vx: ((latest.x - prev.x) / fallbackDt) * 1000,
      vy: ((latest.y - prev.y) / fallbackDt) * 1000,
    };
  }

  return {
    vx: ((latest.x - anchor.x) / dtMs) * 1000,
    vy: ((latest.y - anchor.y) / dtMs) * 1000,
  };
}

/**
 * Checks whether the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Critically damped exponential decay step toward target (dt in seconds).
 * Frame-rate independent: value approaches target smoothly and snaps when within epsilon.
 */
export function stepDampedSettle(
  current: number,
  target: number,
  dtSec: number,
  speed = 18,
  epsilon = 0.2
): { value: number; settled: boolean } {
  if (!Number.isFinite(current) || !Number.isFinite(target) || dtSec <= 0) {
    return { value: target, settled: true };
  }
  const delta = target - current;
  if (Math.abs(delta) <= epsilon) {
    return { value: target, settled: true };
  }
  const factor = 1 - Math.exp(-speed * Math.min(0.05, dtSec));
  const next = current + delta * factor;
  if (Math.abs(target - next) <= epsilon) {
    return { value: target, settled: true };
  }
  return { value: next, settled: false };
}

