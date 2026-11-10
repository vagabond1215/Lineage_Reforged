const deployedV2Origin = 'https://lineage-reforged-preview.vagabond1215.chatgpt.site';

/** Build identity check only; the hosting layer must restrict who can reach staging. */
export function validateNativeStagingOrigin(value: string): string {
  let parsed: URL;
  try { parsed = new URL(value); }
  catch { throw new Error('Native staging requires an absolute HTTPS origin.'); }
  if (parsed.protocol !== 'https:' || parsed.origin !== value || parsed.origin === deployedV2Origin ||
      parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash)
    throw new Error('Native staging requires a distinct exact HTTPS origin without path or credentials.');
  return value;
}
/** Disposable local preview only. Production builds always require the HTTPS target above. */
export function validateNativeStagingPreviewOrigin(value: string): string {
  let parsed: URL;
  try { parsed = new URL(value); }
  catch { throw new Error('Native staging preview requires an exact loopback origin.'); }
  if (parsed.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(parsed.hostname) ||
      !parsed.port || parsed.origin !== value || parsed.pathname !== '/' || parsed.search || parsed.hash)
    throw new Error('Native staging preview requires an exact loopback origin with a port.');
  return value;
}
