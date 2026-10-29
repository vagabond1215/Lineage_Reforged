import itemCatalog from '../../../../packages/content/base/items/items.json' with { type: 'json' };
import fitCatalog from '../../../../packages/content/base/items/equipment_fit_profiles.json' with { type: 'json' };
import consumableCatalog from '../../../../packages/content/base/items/consumable_profiles.json' with { type: 'json' };
import { GEAR_SLOT_IDS, type GearFit, type GearItemInstance, type GearSlotId } from
  '../../../../packages/engines/game-engine/src/gear-instance-owner.js';
import { projectNativeEffectiveWorn } from '../../../../packages/engines/game-engine/src/native-effective-worn.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from
  '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { InventoryStack } from '../../../../packages/shared/types/src/index.js';
import { fingerprintNativeInventory } from './nativeFungibleActions.js';
import { admitNativeFungibleSessionAction, admitNativeGearSessionAction,
  type NativeSessionItemActionResult } from './nativeSessionItemActions.js';

const items = new Map(itemCatalog.records.map(item => [item.id, item]));
const fits = new Map((fitCatalog.records as GearFit[]).map(fit => [fit.itemId, fit]));
const consumableProfiles = new Set(consumableCatalog.records.map(profile => profile.id));

export type NativeGearPresentation = GearItemInstance & { name: string; eligibleSlots: readonly GearSlotId[] };
export type NativeFungiblePresentation = InventoryStack & {
  name: string;
  location: { kind: 'bag'; bagId: string; stackIndex: number } | { kind: 'overflow'; stackIndex: number };
  expectedRevision: number;
  expectedInventoryFingerprint: string;
  canUse: boolean;
  useUnavailableReason?: string;
};

/** The v3 reader never creates a v2 equipment map or a second item store. */
export function readNativeSelectedCharacter(value: unknown) {
  if (!isNativeTargetCampaignSnapshot(value)) throw new Error('Native campaign is not admitted.');
  const snapshot = value;
  const describeGear = (instance: GearItemInstance): NativeGearPresentation => {
    const item = items.get(instance.itemId);
    const fit = fits.get(instance.itemId);
    if (!item || item.itemKey !== instance.itemKey || !fit || fit.itemKey !== instance.itemKey)
      throw new Error('Physical gear lacks canonical content or fit.');
    return { ...instance, location: { ...instance.location }, name: item.name,
      eligibleSlots: [...fit.slots] };
  };
  const gear = snapshot.playerState.gear.instances.map(describeGear);
  const inventoryFingerprint = fingerprintNativeInventory(snapshot.playerState.inventory);
  const bySlot = new Map(gear.filter(item => item.location.kind === 'worn')
    .map(item => [(item.location as { kind: 'worn'; slotId: GearSlotId }).slotId, item]));
  const describeStack = (stack: InventoryStack, location: NativeFungiblePresentation['location']): NativeFungiblePresentation => {
    const item = items.get(stack.itemId);
    if (!item || item.itemKey !== stack.itemKey) throw new Error('Fungible stack lacks canonical content.');
    const canUse = !!item.consumableProfileId && consumableProfiles.has(item.consumableProfileId);
    return { ...stack, name: item.name, location, canUse,
      expectedRevision: snapshot.nativeInventoryUse.revision,
      expectedInventoryFingerprint: inventoryFingerprint,
      ...(!canUse ? { useUnavailableReason: 'No authored consumable effect.' } : {}) };
  };
  return {
    playerName: snapshot.playerState.coreData.playerName,
    attributes: { ...snapshot.playerState.attributes },
    gearRevision: snapshot.playerState.gear.revision,
    slots: GEAR_SLOT_IDS.map(slotId => ({ slotId, item: bySlot.get(slotId) ?? null })),
    carriedGear: gear.filter(item => item.location.kind !== 'worn'),
    fungibleStacks: [
      ...snapshot.playerState.inventory.bags.flatMap(bag => bag.stacks.map((stack, stackIndex) =>
        describeStack(stack, { kind: 'bag', bagId: bag.id, stackIndex }))),
      ...snapshot.playerState.inventory.overflow.map((stack, stackIndex) =>
        describeStack(stack, { kind: 'overflow', stackIndex }))
    ],
    effectiveWorn: projectNativeEffectiveWorn(snapshot)
  };
}

export type NativeSelectedItemCommand =
  | { kind: 'gear'; expectedRevision: number; itemInstanceId: string;
      destination: { kind: 'worn'; slotId: GearSlotId } | { kind: 'carried' } }
  | { kind: 'use'; target: Pick<NativeFungiblePresentation,
      'itemId' | 'itemKey' | 'quantity' | 'location' | 'expectedRevision' | 'expectedInventoryFingerprint'> };

/** Caller must retain and apply both returned authorities. A stale selection cannot retarget Use. */
export function admitNativeSelectedItemCommand(
  snapshot: NativeFreshCampaignSnapshot,
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>,
  command: NativeSelectedItemCommand,
  requestId: string
): NativeSessionItemActionResult {
  if (command.kind === 'gear') return admitNativeGearSessionAction(snapshot, control, {
    requestId, expectedRevision: command.expectedRevision,
    itemInstanceId: command.itemInstanceId, destination: command.destination
  });
  const { target } = command;
  return admitNativeFungibleSessionAction(snapshot, control, {
    requestId, expectedRevision: target.expectedRevision,
    expectedInventoryFingerprint: target.expectedInventoryFingerprint,
    itemId: target.itemId, itemKey: target.itemKey, expectedQuantity: target.quantity,
    location: target.location
  });
}
