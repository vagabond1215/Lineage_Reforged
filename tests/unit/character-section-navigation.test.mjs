import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextCharacterSectionIndex } from '../../apps/rpg-ui/src/features/characterSectionNavigation.ts';

test('Character section keys move focus within the bounded horizontal strip', () => {
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 10), 1);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 4, 10), 3);
  assert.equal(getNextCharacterSectionIndex('Home', 7, 10), 0);
  assert.equal(getNextCharacterSectionIndex('End', 2, 10), 9);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 0, 10), 0);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 9, 10), 9);
  assert.equal(getNextCharacterSectionIndex('Tab', 3, 10), null);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 0), null);
});
