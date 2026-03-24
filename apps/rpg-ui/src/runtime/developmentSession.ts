import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { demoSnapshot } from './demoSnapshot.js';
import { createGameSessionState } from './GameSessionContext.js';

export function createDevelopmentGameSessionState(
  snapshot: SaveSnapshot = demoSnapshot
) {
  return createGameSessionState(snapshot);
}
