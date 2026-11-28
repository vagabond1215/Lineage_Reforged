import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const repository = fileURLToPath(new URL('../../../', import.meta.url));
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
const pinLines = pins => pins.map(pin => `${pin.path}\t${pin.gitBlobSha1}\n`).sort().join('');
const fingerprint = pins => 'sha256:' + digest('sha256', pinLines(pins));
const readRepository = path => readFileSync(resolve(repository, path));

export function verifyPinnedBytes(pin, raw) {
  if (blobDigest(raw) === pin.gitBlobSha1) return raw;
  // A Windows text checkout may encode canonical LF as CRLF. Accept only an
  // exact pin match after reversing that conversion, retaining the BOM.
  const canonical = Buffer.from(raw.toString('latin1').replaceAll('\r\n', '\n'), 'latin1');
  if (blobDigest(canonical) === pin.gitBlobSha1) return canonical;
  throw new Error(`First World source does not match its pin: ${pin.path}`);
}

export function verifySourcePack(read = readRepository) {
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
    pins,
    contentPins,
    historicalFingerprint,
    runtimeFingerprint: fingerprint(pins),
    templatePath: contentPins[0].path,
  };
}

export function verifyWorldSourceV2(read = readRepository) {
  const previous = verifySourcePack(read);
  const manifest = JSON.parse(read('docs/design/first-world-economy-source-manifest-v2.json').toString('utf8'));
  const { format, scenario, loaderVersion, compactVersion, previousFingerprint, implementationPins } = manifest;
  if (format !== 'lineage.first-world-economy-source.v2' || loaderVersion !== 2 || compactVersion !== 1 ||
      scenario?.id !== 'world_scenario.first_world.chronicle_default_v1' || scenario?.version !== 1 ||
      previousFingerprint !== previous.runtimeFingerprint || !Array.isArray(implementationPins)) {
    throw new Error('Incompatible First World v2 source manifest.');
  }
  const bytes = new Map(previous.bytes);
  for (const pin of implementationPins) {
    if (typeof pin.path !== 'string' || !/^apps\/rpg-ui\/(?:build|src\/game-shell\/world-source)\/[\w.-]+$/.test(pin.path) ||
        !/^[a-f0-9]{40}$/.test(pin.gitBlobSha1) || bytes.has(pin.path))
      throw new Error('Invalid or duplicate First World v2 manifest pin.');
    bytes.set(pin.path, verifyPinnedBytes(pin, read(pin.path)));
  }
  for (const name of ['first-world-browser-loader.mjs', 'first-world-source-pack.mjs', 'first-world-source-worker.mjs']) {
    if (!bytes.has(`apps/rpg-ui/build/${name}`)) throw new Error(`Missing First World v2 build pin: ${name}`);
  }
  const runtimeFingerprint = 'sha256:' + digest('sha256',
    JSON.stringify([format, loaderVersion, compactVersion, scenario.id, scenario.version, previousFingerprint]) +
    '\n' + pinLines([...previous.pins, ...implementationPins]));
  if (manifest.runtimeFingerprint !== runtimeFingerprint) throw new Error('First World v2 fingerprint mismatch.');
  return { ...previous, bytes, runtimeFingerprint, format, scenario, loaderVersion, compactVersion };
}
