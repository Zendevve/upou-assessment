import test from 'node:test';
import assert from 'node:assert/strict';
import { computePointerVelocity, projectMomentum, rubberband } from './fluidMotion';

test('projectMomentum projects proportional displacement in direction of velocity', () => {
  const forward = projectMomentum(1000, 0.99);
  const backward = projectMomentum(-1000, 0.99);
  assert.ok(forward > 0);
  assert.equal(backward, -forward);
  assert.equal(projectMomentum(0), 0);
});

test('rubberband resists progressively past boundary and never exceeds dimension', () => {
  const small = rubberband(20, 200, 0.55);
  const large = rubberband(400, 200, 0.55);
  const negative = rubberband(-50, 200, 0.55);

  assert.ok(small > 0 && small < 20);
  assert.ok(large > small && large < 200);
  assert.ok(negative < 0 && negative > -50);
  assert.equal(rubberband(0, 200), 0);
});

test('computePointerVelocity calculates px/s from recent pointer samples', () => {
  const samples = [
    { x: 100, y: 50, time: 1000 },
    { x: 130, y: 50, time: 1050 },
    { x: 160, y: 50, time: 1100 },
  ];
  const { vx, vy } = computePointerVelocity(samples, 1100);
  assert.equal(Math.round(vx), 600);
  assert.equal(vy, 0);
});
