import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextCharacterSectionIndex } from '../../apps/rpg-ui/src/features/characterSectionNavigation.ts';

test('Character section keys move focus within the bounded horizontal strip', () => {
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 9), 1);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 4, 9), 3);
  assert.equal(getNextCharacterSectionIndex('Home', 7, 9), 0);
  assert.equal(getNextCharacterSectionIndex('End', 2, 9), 8);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 0, 9), 0);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 8, 9), 8);
  assert.equal(getNextCharacterSectionIndex('Tab', 3, 9), null);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 0), null);
});
