import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import {
  preparePlayerSoundingsTurnInCommand,
  executePlayerSoundingsTurnInCommand
} from '../../../../packages/engines/game-engine/src/player-soundings-turn-in.js';

type Preparation = ReturnType<typeof preparePlayerSoundingsTurnInCommand>;
export type SoundingsTurnInCommand = Extract<Preparation, { kind: 'prepared' }>['command'];
type Result = ReturnType<typeof executePlayerSoundingsTurnInCommand>;
export interface SoundingsTurnInCallerOutcome {
  kind: 'accepted' | 'terminal_result' | 'technical_retry' | 'expected_rejection';
  result: Result | null;
  notice: Result['notice'];
}

export function submitSoundingsTurnInCaller(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  requestId: string,
  cache: Map<string, SoundingsTurnInCommand>
): { outcome: SoundingsTurnInCallerOutcome; acceptedState: { snapshot: SaveSnapshot; control: CampaignSessionControl } | null } {
  let command = cache.get(requestId);
  if (!command) {
    const preparation = preparePlayerSoundingsTurnInCommand(snapshot, control, requestId);
    if (preparation.kind !== 'prepared') {
      cache.delete(requestId);
      return { outcome: { kind: 'expected_rejection', result: null, notice: preparation.notice }, acceptedState: null };
    }
    command = preparation.command;
    cache.set(requestId, command);
  }
  const result = executePlayerSoundingsTurnInCommand(snapshot, control, command);
  const retry = !result.accepted && result.code === 'transition_failed';
  if (!retry) cache.delete(requestId);
  return {
    outcome: { kind: result.accepted ? 'accepted' : retry ? 'technical_retry' : 'terminal_result', result, notice: result.notice },
    acceptedState: result.accepted ? { snapshot: result.snapshot, control: result.control } : null
  };
}
