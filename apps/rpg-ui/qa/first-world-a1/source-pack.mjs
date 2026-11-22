import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const repository = fileURLToPath(new URL('../../../../', import.meta.url));
const manifestPin = {
  path: 'docs/design/first-world-default-chronicle-scenario-source-manifest-v1.json',
  gitBlobSha1: '8dd06caec702c439ed36b59ac24c146b266adffb',
};
const historicalFingerprint = 'sha256:9482870a7784f877bb8c789f65f29dea8fd62a18392381dc1ffd7a3f7e2659eb';
export const loaderPath = 'packages/engines/civilization-engine/src/content.js';
const registryPin = {
  path: 'apps/rpg-ui/src/game-shell/firstWorldDurableRegistry.ts',
  gitBlobSha1: 'cf58c82d4703b6fbc209e7701233881cdad415f3',
};

const digest = (algorithm, bytes) => createHash(algorithm).update(bytes).digest('hex');
const blobDigest = bytes => createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex');
const fingerprint = pins => 'sha256:' + digest('sha256',
  pins.map(pin => `${pin.path}\t${pin.gitBlobSha1}\n`).sort().join(''));

export function verifyPinnedBytes(pin, raw) {
  if (blobDigest(raw) === pin.gitBlobSha1) return raw;
  // A Windows text checkout may encode canonical LF as CRLF. Accept only an
  // exact pin match after reversing that conversion, retaining the BOM.
  const canonical = Buffer.from(raw.toString('latin1').replaceAll('\r\n', '\n'), 'latin1');
  if (blobDigest(canonical) === pin.gitBlobSha1) return canonical;
  throw new Error(`First World source does not match its pin: ${pin.path}`);
}

export function verifySourcePack(read = path => readFileSync(resolve(repository, path))) {
  const manifest = JSON.parse(verifyPinnedBytes(manifestPin, read(manifestPin.path)).toString('utf8'));
  const contentPins = manifest.pinnedSourceFiles;
  const originalPins = [...contentPins, ...manifest.pinnedAlgorithmFiles, ...manifest.pinnedJavaScriptEntrypoints];
  if (originalPins.length !== 41 || new Set(originalPins.map(pin => pin.path)).size !== 41 ||
      fingerprint(originalPins) !== historicalFingerprint ||
      manifest.provenance.pinnedFullSourceSetFingerprint !== historicalFingerprint) {
    throw new Error('First World source manifest does not match the published 41-pin contract.');
  }
  const pins = [...originalPins, registryPin];
  const bytes = new Map(pins.map(pin => [pin.path, verifyPinnedBytes(pin, read(pin.path))]));
  return {
    bytes,
    contentPins,
    historicalFingerprint,
    runtimeFingerprint: fingerprint(pins),
    templatePath: contentPins[0].path,
  };
}
