import manifest, { assetUrls } from 'virtual:first-world-v2-assets';
import { createCanonicalWorldContent } from './canonical-content.mjs';
export { freezeCanonical } from './canonical-content.mjs';

export const source = manifest;
export const { preloadCanonicalContent, readCanonicalText, readVerifiedTemplate } =
  createCanonicalWorldContent(manifest, pin => assetUrls[pin]);
