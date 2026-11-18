import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCount, pluralizeNoun } from './formatters';

test('pluralizeNoun selects singular for 1 and plural for 0 or >= 2', () => {
  assert.equal(pluralizeNoun(0, 'word', 'words'), 'words');
  assert.equal(pluralizeNoun(1, 'word', 'words'), 'word');
  assert.equal(pluralizeNoun(2, 'word', 'words'), 'words');
  assert.equal(pluralizeNoun(1, 'activity', 'activities'), 'activity');
  assert.equal(pluralizeNoun(3, 'activity', 'activities'), 'activities');
});

test('formatCount pairs numeric count with pluralized noun', () => {
  assert.equal(formatCount(0, 'word', 'words'), '0 words');
  assert.equal(formatCount(1, 'word', 'words'), '1 word');
  assert.equal(formatCount(42, 'word', 'words'), '42 words');
});
