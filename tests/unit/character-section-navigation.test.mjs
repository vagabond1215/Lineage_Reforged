import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextCharacterSectionIndex } from '../../apps/rpg-ui/src/features/characterSectionNavigation.ts';

test('Character section keys move focus within the bounded horizontal strip', () => {
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 7), 1);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 4, 7), 3);
  assert.equal(getNextCharacterSectionIndex('Home', 6, 7), 0);
  assert.equal(getNextCharacterSectionIndex('End', 2, 7), 6);
  assert.equal(getNextCharacterSectionIndex('ArrowLeft', 0, 7), 0);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 6, 7), 6);
  assert.equal(getNextCharacterSectionIndex('Tab', 3, 7), null);
  assert.equal(getNextCharacterSectionIndex('ArrowRight', 0, 0), null);
});
