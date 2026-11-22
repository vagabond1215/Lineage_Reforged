import { preloadCanonicalContent, readVerifiedTemplate, sourceIdentity } from './canonical-content.mjs';
import { measureWorldEconomy } from './probe.mjs';

// Dedicated candidate-only browser entry. No account database or creation caller.
window.measureFirstWorldA1 = async identity => {
  const sourceBytes = await preloadCanonicalContent();
  return {
    source: { ...sourceIdentity, bytes: sourceBytes },
    result: await measureWorldEconomy(readVerifiedTemplate(), identity),
  };
};
