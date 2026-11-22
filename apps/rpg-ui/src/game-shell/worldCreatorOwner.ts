import manifest from '../../../../docs/design/first-world-economy-source-manifest-v3.json';
import type { CompactPilotWorld, WorldPilotCreateInput } from './world-source/pilot.js';
import type { CleanEpochAccountStore } from './cleanEpochAccountStore.js';
import type { WorldLibraryCard } from './worldPresentationState.js';

const scenario = 'world_scenario.first_world.chronicle_default_v1';
type World = Awaited<ReturnType<CleanEpochAccountStore['listChronicleWorlds']>>[number];
type Created = Awaited<ReturnType<CleanEpochAccountStore['createChronicleWorld']>>;
type Reopened = Awaited<ReturnType<CleanEpochAccountStore['reopenChronicleWorld']>>;
export type WorldAccountScope = { accountId: string; generation: number };

function isScopedPilot(world: World, scope: WorldAccountScope): world is CompactPilotWorld {
  return world.version === 2 && world.accountId === scope.accountId &&
    world.accountLifecycleGeneration === scope.generation &&
    world.binding.sourceFingerprint === manifest.runtimeFingerprint &&
    world.binding.economySourceFingerprint === manifest.parentFingerprint &&
    world.binding.scenario.id === scenario && world.binding.scenario.version === 1 &&
    world.binding.rules.progressionMode === 'chronicle' && world.binding.rules.worldKind === 'individual' &&
    world.binding.rules.difficulty === 'mortal' && world.binding.rules.stakes === 'normal' &&
    world.binding.rules.hardcore === false;
}

export function projectWorldCard(world: World, scope: WorldAccountScope): WorldLibraryCard {
  if (!isScopedPilot(world, scope)) throw new Error('The retained World is outside the verified pilot.');
  const { progressionMode, worldKind, difficulty } = world.binding.rules;
  return { worldInstanceId: world.worldInstanceId, displayName: world.displayName, createdAt: world.createdAt,
    scenario: world.binding.scenario, rules: { progressionMode, worldKind, difficulty } };
}

export function confirmWorldCreation(
  committed: Created | null, reopened: Reopened, listed: World, scope: WorldAccountScope, request: WorldPilotCreateInput
): WorldLibraryCard {
  const card = projectWorldCard(listed, scope);
  if (!reopened || !isScopedPilot(reopened.world, scope) || reopened.receipt.version !== 2 ||
      reopened.receipt.state !== 'COMMITTED' || reopened.receipt.accountId !== scope.accountId ||
      reopened.receipt.accountLifecycleGeneration !== scope.generation ||
      reopened.world.creationIntentId !== request.creationIntentId ||
      reopened.world.worldInstanceId !== request.proposedWorldInstanceId ||
      reopened.world.displayName !== request.displayName ||
      reopened.receipt.expectedAccountRevision !== request.expectedAccountRevision ||
      reopened.receipt.creationIntentId !== reopened.world.creationIntentId ||
      reopened.receipt.worldInstanceId !== reopened.world.worldInstanceId ||
      reopened.receipt.initialDisplayName !== reopened.world.displayName ||
      reopened.receipt.projectionFingerprint !== reopened.projectionFingerprint ||
      reopened.world.projectionFingerprint !== reopened.projectionFingerprint ||
      JSON.stringify(reopened.world) !== JSON.stringify(listed) ||
      (committed && ((committed.status !== 'committed' && committed.status !== 'same_source_retry') ||
        JSON.stringify(committed.world) !== JSON.stringify(reopened.world) ||
        JSON.stringify(committed.receipt) !== JSON.stringify(reopened.receipt))))
    throw new Error('The World and its creation receipt did not match verified readback.');
  return card;
}
