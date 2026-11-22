const encoder = new TextEncoder();
// The canonical bytes include BOMs that the existing loader handles.
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

export function createCanonicalWorldContent(manifest, assetUrl) {
  let loading;
  let sources;

  async function load() {
    const verified = new Map();
    let byteCount = 0;
    for (const { path, gitBlobSha1 } of manifest.contentPins) {
      const response = await fetch(assetUrl(gitBlobSha1), { redirect: 'error' });
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
      byteCount += bytes.byteLength;
    }
    // No source is visible to the engine until the complete version is verified.
    sources = verified;
    return byteCount;
  }

  function read(path) {
    const text = sources?.get(path);
    if (text === undefined) throw new Error(`No verified First World source loaded for ${path}.`);
    return text;
  }

  return Object.freeze({
    preloadCanonicalContent: () => loading ??= load(),
    readCanonicalText: relativePath => read(relativePath.replace(/^\.\.\/\.\.\/\.\.\//, 'packages/')),
    readVerifiedTemplate: () => read(manifest.templatePath),
  });
}

export function freezeCanonical(value) {
  if (value !== null && typeof value === 'object') {
    for (const entry of Object.values(value)) freezeCanonical(entry);
    Object.freeze(value);
  }
  return value;
}
