import itemCatalog from '../../../../packages/content/base/items/items.json' with { type: 'json' };
import consumableCatalog from '../../../../packages/content/base/items/consumable_profiles.json' with { type: 'json' };
import { applyConsumableToBodyState } from '../../../../packages/engines/player-engine/src/body-state.js';
import { projectNativeEffectiveWorn } from '../../../../packages/engines/game-engine/src/native-effective-worn.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { resolvePlayerResources } from '../../../../packages/shared/types/src/player-resources.js';
import type { ConsumableProfileState, PlayerInventoryState } from '../../../../packages/shared/types/src/index.js';

type NativeUseLocation = { kind: 'bag'; bagId: string; stackIndex: number } |
  { kind: 'overflow'; stackIndex: number };

export type NativeFungibleUseRequest = {
  requestId: string;
  expectedRevision: number;
  expectedInventoryFingerprint: string;
  itemId: string;
  itemKey: string;
  expectedQuantity: number;
  location: NativeUseLocation;
};

export type NativeFungibleUseResult = {
  status: 'accepted' | 'duplicate' | 'stale' | 'invalid';
  snapshot: NativeFreshCampaignSnapshot;
  reason?: string;
};

const items = new Map(itemCatalog.records.map(item => [item.id, item]));
const profiles = new Map((consumableCatalog.records as Array<ConsumableProfileState & { id: string }>).map(profile => [profile.id, profile]));

/** Exact source identity, including bag order and overflow position. */
export function fingerprintNativeInventory(inventory: PlayerInventoryState): string {
  return JSON.stringify(inventory);
}

function validRequest(value: unknown): value is NativeFungibleUseRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const request = value as Record<string, unknown>;
  const location = request.location as Record<string, unknown> | null;
  return typeof request.requestId === 'string' && request.requestId.trim() === request.requestId && !!request.requestId &&
    Number.isSafeInteger(request.expectedRevision) && Number(request.expectedRevision) >= 0 &&
    typeof request.expectedInventoryFingerprint === 'string' && !!request.expectedInventoryFingerprint &&
    typeof request.itemId === 'string' && !!request.itemId && typeof request.itemKey === 'string' && !!request.itemKey &&
    Number.isSafeInteger(request.expectedQuantity) && Number(request.expectedQuantity) > 0 &&
    !!location && Number.isSafeInteger(location.stackIndex) && Number(location.stackIndex) >= 0 &&
    (location.kind === 'overflow' ||
      (location.kind === 'bag' && typeof location.bagId === 'string' && !!location.bagId));
}

function requestFingerprint(request: NativeFungibleUseRequest): string {
  return JSON.stringify([
    request.expectedRevision, request.expectedInventoryFingerprint, request.itemId,
    request.itemKey, request.expectedQuantity, request.location
  ]);
}

/** Candidate v3 action. One source stack is consumed only after exact state validation. */
export function consumeNativeFungible(
  snapshot: NativeFreshCampaignSnapshot,
  request: NativeFungibleUseRequest
): NativeFungibleUseResult {
  if (!isNativeTargetCampaignSnapshot(snapshot) || !validRequest(request)) {
    return { status: 'invalid', snapshot, reason: 'Native campaign or Use request is invalid.' };
  }
  const fingerprint = requestFingerprint(request);
  const prior = snapshot.nativeInventoryUse.receipts.find(receipt => receipt.requestId === request.requestId);
  if (prior) return { status: prior.fingerprint === fingerprint ? 'duplicate' : 'invalid', snapshot };
  if (request.expectedRevision !== snapshot.nativeInventoryUse.revision ||
    request.expectedInventoryFingerprint !== fingerprintNativeInventory(snapshot.playerState.inventory)) {
    return { status: 'stale', snapshot };
  }
  const inventory = snapshot.playerState.inventory;
  const location = request.location;
  const bag = location.kind === 'bag' ? inventory.bags.find(b => b.id === location.bagId) : null;
  const stack = location.kind === 'bag'
    ? bag?.stacks[location.stackIndex] : inventory.overflow[location.stackIndex];
  if (!stack || stack.itemId !== request.itemId || stack.itemKey !== request.itemKey ||
    stack.quantity !== request.expectedQuantity) return { status: 'stale', snapshot };
  const item = items.get(stack.itemId);
  const profile = item?.itemKey === stack.itemKey && item.consumableProfileId
    ? profiles.get(item.consumableProfileId) : null;
  if (!profile) return { status: 'invalid', snapshot, reason: 'Item has no authored consume profile.' };

  const nextInventory: PlayerInventoryState = {
    bags: inventory.bags.map(sourceBag => ({ ...sourceBag, stacks: sourceBag.stacks.map(sourceStack => ({ ...sourceStack })) })),
    overflow: inventory.overflow.map(sourceStack => ({ ...sourceStack }))
  };
  const target = location.kind === 'bag'
    ? nextInventory.bags.find(b => b.id === location.bagId)!.stacks : nextInventory.overflow;
  if (stack.quantity === 1) target.splice(location.stackIndex, 1);
  else target[location.stackIndex] = { ...stack, quantity: stack.quantity - 1 };
  const nextBodyState = applyConsumableToBodyState(snapshot.playerState.bodyState, profile, {
    itemTags: item?.tags ?? [],
    lineageId: snapshot.playerState.coreData.lineageId,
    tick: snapshot.clock.tick,
    day: snapshot.clock.day,
    runDifficulty: snapshot.gameState.runDifficulty
  });
  const wornResourceModifiers = projectNativeEffectiveWorn(snapshot).resourceModifiers;
  const resolved = resolvePlayerResources({
    playerId: snapshot.playerState.playerId,
    attributes: snapshot.playerState.attributes,
    resources: snapshot.playerState.resources,
    originProfile: snapshot.playerState.originProfile,
    resourceRuntime: snapshot.playerState.resourceRuntime,
    bodyState: nextBodyState,
    wornResourceModifiers
  }, [], snapshot.clock.tick);
  const next: NativeFreshCampaignSnapshot = {
    ...snapshot,
    nativeInventoryUse: {
      version: 1,
      revision: snapshot.nativeInventoryUse.revision + 1,
      receipts: [...snapshot.nativeInventoryUse.receipts, { requestId: request.requestId, fingerprint }]
    },
    playerState: {
      ...snapshot.playerState,
      inventory: nextInventory,
      bodyState: nextBodyState,
      resources: resolved.resources,
      resourceRuntime: resolved.resourceRuntime
    }
  };
  if (!isNativeTargetCampaignSnapshot(next)) {
    return { status: 'invalid', snapshot, reason: 'Native campaign failed post-Use admission.' };
  }
  return { status: 'accepted', snapshot: next };
}
