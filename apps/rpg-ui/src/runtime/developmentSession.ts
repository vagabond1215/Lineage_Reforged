import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { createDefaultAccountProfileState } from '../../../../packages/engines/game-engine/src/legacy-account.js';
import { demoSnapshot } from './demoSnapshot.js';
import { createGameSessionState } from './GameSessionContext.js';

export function createDevelopmentGameSessionState(
  snapshot: SaveSnapshot = demoSnapshot
) {
  return createGameSessionState(createDefaultAccountProfileState(), snapshot);
}
