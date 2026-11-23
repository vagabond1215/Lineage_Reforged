import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { repository, verifyPinnedBytes, verifyWorldSourceV2 } from './first-world-source-pack.mjs';
import { verifyWorldOwnerSource } from './first-world-owner-source.mjs';

const manifestPath = 'docs/design/first-world-typescript-source-manifest-v4.json';
const historyRoot = 'docs/design/first-world-source-history';
const engineRoot = 'packages/engines/civilization-engine/src';
const enginePaths = ['economy', 'runtime-economy', 'settlement-simulation', 'spatial-world', 'transport-runtime']
  .map(name => `${engineRoot}/${name}.ts`);
const workerPath = 'apps/rpg-ui/build/first-world-source-worker.mjs';
const configPath = 'apps/rpg-ui/vite.config.ts';
const archivedPaths = new Set([...enginePaths, workerPath, configPath]);
const successorPaths = [...archivedPaths, 'apps/rpg-ui/build/first-world-source-v4.mjs',
  'packages/shared/types/src/contracts.ts'].sort();

const readCurrent = path => readFileSync(resolve(repository, path));

/** Versions 1–3 verify the original bytes at their original logical paths. */
export function historicalWorldSourceReader(read = readCurrent) {
  return path => read(archivedPaths.has(path) ? `${historyRoot}/${basename(path)}.source` : path);
}

export function verifyWorldSourceV4(read = readCurrent) {
  const historicalRead = historicalWorldSourceReader(read);
  const historicalSource = verifyWorldSourceV2(historicalRead);
  const owner = verifyWorldOwnerSource(historicalRead);
  const manifest = JSON.parse(read(manifestPath).toString('utf8'));
  const { format, parentFingerprint, pins, sourceFingerprint } = manifest;
  if (format !== 'lineage.first-world-typescript-source.v4' ||
      parentFingerprint !== owner.runtimeFingerprint ||
      !Array.isArray(pins) || pins.length !== successorPaths.length ||
      pins.some((pin, index) => pin.path !== successorPaths[index] ||
        !/^[a-f0-9]{40}$/.test(pin.gitBlobSha1))) {
    throw new Error('Invalid First World TypeScript successor source manifest.');
  }

  const bytes = new Map(historicalSource.bytes);
  const workerPaths = new Set([...enginePaths, workerPath]);
  for (const pin of pins) {
    const canonical = verifyPinnedBytes(pin, read(pin.path));
    if (workerPaths.has(pin.path)) bytes.set(pin.path, canonical);
  }

  const lines = pins.map(pin => `${pin.path}\t${pin.gitBlobSha1}\n`).join('');
  const measured = 'sha256:' + createHash('sha256')
    .update(format + '\n' + parentFingerprint + '\n' + lines).digest('hex');
  if (measured !== sourceFingerprint) throw new Error('First World TypeScript successor fingerprint mismatch.');

  // This is build provenance only. Projection-equivalent repairs use the
  // existing V2 economy and V3 owner bindings, including the retained seed.
  return { sourceFingerprint, owner, count: pins.length, workerSource: { ...historicalSource, bytes } };
}
