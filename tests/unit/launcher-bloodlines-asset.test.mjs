import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appShellSource = readFileSync(
  new URL('../../apps/rpg-ui/src/game-shell/components/AppShell.tsx', import.meta.url),
  'utf8'
);

const launcherAssetUrls = [
  '/launcher/bloodlines-inactive-soft.png',
  '/launcher/bloodlines-active-soft.png'
];

function readPngDimensions(relativeUrl) {
  const bytes = readFileSync(
    new URL(`../../apps/rpg-ui/public${relativeUrl}`, import.meta.url)
  );

  assert.deepEqual(
    [...bytes.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `${relativeUrl} must be a PNG`
  );

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

test('Bloodlines uses the launcher artwork contract for both interaction states', () => {
  assert.match(
    appShellSource,
    /bloodlines:\s*\{\s*inactive: '\/launcher\/bloodlines-inactive-soft\.png',\s*active: '\/launcher\/bloodlines-active-soft\.png'\s*\}/
  );

  for (const assetUrl of launcherAssetUrls) {
    assert.deepEqual(readPngDimensions(assetUrl), { width: 700, height: 200 });
  }
});
