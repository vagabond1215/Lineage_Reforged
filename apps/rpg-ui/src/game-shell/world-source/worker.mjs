import { prepareWorldSourceCandidate } from './candidate.mjs';
import { preloadCanonicalContent, readVerifiedTemplate, source } from './worker-content.mjs';

self.onmessage = async ({ data }) => {
  try {
    const sourceBytes = await preloadCanonicalContent();
    const value = await prepareWorldSourceCandidate(source, readVerifiedTemplate(), data);
    self.postMessage({ ok: true, value: { ...value, sourceBytes } });
  } catch (error) {
    self.postMessage({ ok: false, message: error instanceof Error ? error.message : String(error) });
  }
};
