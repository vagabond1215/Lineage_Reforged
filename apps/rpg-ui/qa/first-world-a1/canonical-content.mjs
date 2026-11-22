import manifest from 'virtual:first-world-a1-assets';
import { createCanonicalWorldContent } from '../../src/game-shell/world-source/canonical-content.mjs';
export { freezeCanonical } from '../../src/game-shell/world-source/canonical-content.mjs';

export const sourceIdentity = Object.freeze({
  historicalFingerprint: manifest.historicalFingerprint,
  runtimeFingerprint: manifest.runtimeFingerprint,
  files: manifest.contentPins.length,
});
export const { preloadCanonicalContent, readCanonicalText, readVerifiedTemplate } = createCanonicalWorldContent(
  manifest, pin => new URL(`content/${manifest.runtimeFingerprint.slice(7)}/${pin}.json`, document.baseURI));
