import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repository, verifyPinnedBytes, verifyWorldSourceV2 } from './first-world-source-pack.mjs';

const manifestPath = 'docs/design/first-world-economy-source-manifest-v3.json';
const requiredPaths = [
  'apps/rpg-ui/build/first-world-owner-source.mjs',
  'apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts',
  'apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts',
  'apps/rpg-ui/src/game-shell/world-source/pilot.ts',
  'apps/rpg-ui/vite.config.ts',
];

export function verifyWorldOwnerSource(read = path => readFileSync(resolve(repository, path))) {
  const parent = verifyWorldSourceV2(read);
  const { format, parentFingerprint, pins, runtimeFingerprint } = JSON.parse(read(manifestPath).toString('utf8'));
  if (format !== 'lineage.first-world-owner-source.v3' || parentFingerprint !== parent.runtimeFingerprint ||
      !Array.isArray(pins) || pins.length !== requiredPaths.length ||
      pins.some((pin, index) => pin.path !== requiredPaths[index] || !/^[a-f0-9]{40}$/.test(pin.gitBlobSha1)))
    throw new Error('Invalid World owner successor source manifest.');
  for (const pin of pins) verifyPinnedBytes(pin, read(pin.path));
  const lines = pins.map(pin => `${pin.path}\t${pin.gitBlobSha1}\n`).join('');
  const measured = 'sha256:' + createHash('sha256').update(format + '\n' + parentFingerprint + '\n' + lines).digest('hex');
  if (measured !== runtimeFingerprint) throw new Error('World owner successor source fingerprint mismatch.');
  return { runtimeFingerprint, parentFingerprint, count: parent.bytes.size + pins.length };
}
