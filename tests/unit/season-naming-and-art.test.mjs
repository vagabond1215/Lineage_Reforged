import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createInitialClock, advanceClock, normalizeSeasonName, getFormalSeasonName } from '../../packages/shared/time/src/index.ts';
import { getSeasonArtworkUrl } from '../../apps/rpg-ui/src/game-shell/seasonArtwork.ts';
import { demoSnapshot } from '../../apps/rpg-ui/src/runtime/demoSnapshot.ts';
import { serializeSnapshot, deserializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

const labels = ['Deepfrost', 'Thaw', 'Waking', 'Swelter', 'Harvest', 'Withering'];
const legacy = { Winter: 'Deepfrost', Spring: 'Waking', Summer: 'Swelter' };

test('calendar names, formal names and six shipped emblems have the same canonical order', () => {
  const calendar = JSON.parse(readFileSync('packages/content/base/world/calendar.json', 'utf8'));
  assert.deepEqual(calendar.seasons, labels);
  assert.equal(createInitialClock().season, 'Deepfrost');
  for (const label of labels) {
    assert.equal(calendar.formalNames[label], `The ${label}`);
    assert.equal(getFormalSeasonName(label), `The ${label}`);
    const url = getSeasonArtworkUrl(label);
    assert.equal(url, `/seasons/season-${label.toLowerCase()}.png`);
    const png = readFileSync(`apps/rpg-ui/public${url}`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  }
});

test('legacy saved season values normalize for display without inventing a season', () => {
  for (const [oldName, currentName] of Object.entries(legacy)) {
    assert.equal(normalizeSeasonName(oldName), currentName);
    assert.equal(getSeasonArtworkUrl(oldName), `/seasons/season-${currentName.toLowerCase()}.png`);
  }
  assert.equal(normalizeSeasonName('not_a_season'), null);
  assert.equal(getSeasonArtworkUrl('not_a_season'), null);
});

test('legacy clock survives SaveSnapshot round trip and advances into canonical season', () => {
  const oldSnapshot = structuredClone(demoSnapshot);
  oldSnapshot.clock = { ...oldSnapshot.clock, month: 1, season: 'Winter' };
  const loaded = deserializeSnapshot(serializeSnapshot(oldSnapshot));
  assert.equal(loaded.clock.season, 'Winter');
  assert.equal(getSeasonArtworkUrl(loaded.clock.season), '/seasons/season-deepfrost.png');
  assert.equal(advanceClock(loaded.clock).season, 'Deepfrost');
});
