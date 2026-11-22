import manifest from 'virtual:first-world-a1-assets';

const encoder = new TextEncoder();
// Keep the BOM so the existing loader handles it exactly as it does in Node.
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
let loading;
let sources;

export const sourceIdentity = Object.freeze({
  historicalFingerprint: manifest.historicalFingerprint,
  runtimeFingerprint: manifest.runtimeFingerprint,
  files: manifest.contentPins.length,
});

async function loadSources() {
  const directory = `content/${manifest.runtimeFingerprint.slice('sha256:'.length)}/`;
  const verified = new Map();
  let sourceBytes = 0;
  for (const { path, gitBlobSha1 } of manifest.contentPins) {
    const response = await fetch(new URL(directory + gitBlobSha1 + '.json', document.baseURI));
    if (!response.ok) throw new Error(`First World source unavailable: ${path} (HTTP ${response.status})`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const header = encoder.encode(`blob ${bytes.byteLength}\0`);
    const blob = new Uint8Array(header.byteLength + bytes.byteLength);
    blob.set(header);
    blob.set(bytes, header.byteLength);
    const pin = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', blob)),
      value => value.toString(16).padStart(2, '0')).join('');
    if (pin !== gitBlobSha1) throw new Error(`First World source failed integrity validation: ${path}`);
    verified.set(path, decoder.decode(bytes));
    sourceBytes += bytes.byteLength;
  }
  // Publish the entire verified set once, inside this dedicated browser realm.
  sources = verified;
  return sourceBytes;
}

export const preloadCanonicalContent = () => loading ??= loadSources();

export function readCanonicalText(relativePath) {
  const repositoryPath = relativePath.replace(/^\.\.\/\.\.\/\.\.\//, 'packages/');
  const text = sources?.get(repositoryPath);
  if (text === undefined) throw new Error(`No verified First World source loaded for ${repositoryPath}.`);
  return text;
}

export function readVerifiedTemplate() {
  const text = sources?.get(manifest.templatePath);
  if (text === undefined) throw new Error('No verified First World template loaded.');
  return text;
}

export function freezeCanonical(value) {
  if (value !== null && typeof value === 'object') {
    for (const entry of Object.values(value)) freezeCanonical(entry);
    Object.freeze(value);
  }
  return value;
}
