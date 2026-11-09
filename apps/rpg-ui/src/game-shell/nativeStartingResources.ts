import {
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerResources
} from '../../../../packages/shared/types/src/index.js';
import type { NativeFreshCampaignSnapshot } from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { projectNativeEffectiveWornFromGear } from '../../../../packages/engines/game-engine/src/native-effective-worn.js';
import { fillCoreResourcesToMax } from './newGameResourceInitialization.js';

type NativePlayer = NativeFreshCampaignSnapshot['playerState'];
type StartingInputs = Pick<NativePlayer,
  'playerId' | 'attributes' | 'bodyState' | 'originProfile' | 'resources' | 'resourceRuntime' | 'gear'>;

/** Native creator resource initialization reads the graph, never the old slot map. */
export function resolveNativeStartingResourceState(player: StartingInputs, tick: number) {
  // The source creator already resolved its v2 resource scaffold. Retain only
  // authored runtime modifiers; rebuild current values, history and breakdown.
  const wornResourceModifiers = projectNativeEffectiveWornFromGear(player.gear).resourceModifiers;
  const resolved = resolvePlayerResources({
    playerId: player.playerId,
    attributes: player.attributes,
    bodyState: player.bodyState,
    originProfile: player.originProfile,
    resources: {
      hp: { current: player.originProfile.resolvedResourceMaxima.hp, max: player.originProfile.resolvedResourceMaxima.hp },
      mp: { current: player.originProfile.resolvedResourceMaxima.mp, max: player.originProfile.resolvedResourceMaxima.mp },
      stamina: { current: player.originProfile.resolvedResourceMaxima.stamina, max: player.originProfile.resolvedResourceMaxima.stamina },
      xp: { ...player.resources.xp }
    },
    resourceRuntime: {
      ...createEmptyPlayerResourceRuntimeState(),
      modifiers: player.resourceRuntime.modifiers.map(modifier => ({ ...modifier }))
    },
    wornResourceModifiers
  }, [], tick);
  fillCoreResourcesToMax(resolved.resources);
  return { resources: resolved.resources, resourceRuntime: resolved.resourceRuntime };
}
