import itemCatalog from '../../../../packages/content/base/items/items.json' with { type: 'json' };
import fitCatalog from '../../../../packages/content/base/items/equipment_fit_profiles.json' with { type: 'json' };
import type { AccountProfileState, PlayerInventoryState } from '../../../../packages/shared/types/src/index.js';
import {
  createGearOwner,
  deriveGearBagCapacities,
  grantGear,
  getWornGear,
  validateGearFits,
  type GearFit,
  type GearOwner
} from '../../../../packages/engines/game-engine/src/gear-instance-owner.js';
import {
  CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION
} from '../../../../packages/engines/game-engine/src/native-gear-physical-boundary.js';
import { createNativeFungibleUseLedger } from '../../../../packages/engines/game-engine/src/native-fungible-use-ledger.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { getStartingBundleSelectedStacks } from './characterCreationCatalog.js';
import type { CharacterCreationFormState } from './characterCreationForm.js';
import { applyLegacyPreparationBonuses } from './legacyPreparationApplication.js';
import { resolveNativeStartingResourceState } from './nativeStartingResources.js';
import { createNewGameSnapshot } from './newGameSnapshot.js';

const fits = fitCatalog.records as GearFit[];
const fitById = new Map(fits.map(fit => [fit.itemId, fit]));
const itemById = new Map(itemCatalog.records.map(item => [item.id, item]));
const fungibleClasses = new Set(['commodity', 'consumable', 'quest']);
const durableClasses = new Set(['weapon', 'armor', 'clothing', 'accessory', 'tool']);

/** Grants from canonical creator selections, never from the v2 equipment map. */
function buildNativeStarterPhysicalState(
  form: CharacterCreationFormState,
  preparationIds: string[],
  preparationChoices: Record<string, string>
): { gear: GearOwner; inventory: PlayerInventoryState } {
  if (!validateGearFits(fits)) throw new Error('Native starter fit profiles are invalid.');
  const sourceStacks = getStartingBundleSelectedStacks(
    form.startingBundleId, form.startingBundleChoiceSelections
  );
  const prepared = applyLegacyPreparationBonuses({
    preparationIds,
    preparationChoices,
    currency: { gold: 0, silver: 0, copper: 0 },
    inventory: {
      bags: [{ id: 'bag.traveler_satchel', label: 'Traveler Satchel', slotCapacity: 20,
        stacks: sourceStacks.map(stack => ({ ...stack })) }],
      overflow: []
    }
  });
  const source = [...prepared.inventory.bags.flatMap(bag => bag.stacks), ...prepared.inventory.overflow];
  const inventory: PlayerInventoryState = {
    bags: [{ id: 'bag.traveler_satchel', label: 'Traveler Satchel', slotCapacity: 20, stacks: [] }],
    overflow: []
  };
  const durable: { itemId: string; itemKey: string; quantity: number }[] = [];
  for (const stack of source) {
    const item = itemById.get(stack.itemId);
    if (!item || item.itemKey !== stack.itemKey || !Number.isSafeInteger(stack.quantity) || stack.quantity < 1) {
      throw new Error(`Native creator grant is not a canonical positive item stack: ${stack.itemId}`);
    }
    if (fungibleClasses.has(item.itemClass)) {
      const bag = inventory.bags[0]!;
      if (bag.stacks.length < bag.slotCapacity) bag.stacks.push({ ...stack });
      else inventory.overflow.push({ ...stack });
    } else if (durableClasses.has(item.itemClass) && fitById.has(item.id)) {
      durable.push({ ...stack });
    } else {
      throw new Error(`Native creator has no physical owner for ${item.id}.`);
    }
  }
  const capacities = deriveGearBagCapacities(inventory);
  let gear = createGearOwner();
  let ordinal = 0;
  for (const stack of durable) {
    const fit = fitById.get(stack.itemId)!;
    for (let unit = 0; unit < stack.quantity; unit += 1) {
      const freeSlot = fit.slots.find(slot =>
        !getWornGear(gear).some(worn => worn.location.kind === 'worn' && worn.location.slotId === slot)
      );
      const bag = capacities[0]!;
      const bagUsed = gear.instances.filter(item => item.location.kind === 'bag' && item.location.bagId === bag.bagId).length;
      const location = freeSlot ? { kind: 'worn' as const, slotId: freeSlot } :
        bagUsed + bag.fungibleSlots < bag.slotCapacity ?
          { kind: 'bag' as const, bagId: bag.bagId } : { kind: 'overflow' as const };
      const result = grantGear(gear, {
        requestId: `creator.grant.${ordinal++}`,
        expectedRevision: gear.revision,
        itemId: stack.itemId,
        itemKey: stack.itemKey,
        durability: 1,
        location
      }, fits, capacities);
      if (result.status !== 'accepted') throw new Error(`Native creator grant failed: ${result.reason}`);
      gear = result.state;
    }
  }
  return { gear, inventory };
}

/** Unselected native-epoch creator successor. It shares nonphysical creator setup. */
export function createNativeNewGameSnapshot(
  form: CharacterCreationFormState,
  accountId: string,
  options: {
    appliedLegacyPreparationIds?: string[];
    appliedLegacyPreparationChoices?: Record<string, string>;
    accountProfile?: AccountProfileState | null;
    hasSelectableBackstories?: boolean;
    sourceRunId?: string;
    crossLineageStart?: boolean;
  } = {}
): NativeFreshCampaignSnapshot {
  // The existing creator supplies world, identity, progression and quest offer.
  // Its physical map/inventory and resource result are discarded unread.
  const source = createNewGameSnapshot(form, accountId, options);
  const physical = buildNativeStarterPhysicalState(
    form,
    options.appliedLegacyPreparationIds ?? [],
    options.appliedLegacyPreparationChoices ?? {}
  );
  const { equipment: _discardedEquipment, inventory: _discardedInventory, ...nonPhysicalPlayer } = source.playerState;
  const native: NativeFreshCampaignSnapshot = {
    ...source,
    snapshotVersion: CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION,
    nativeInventoryUse: createNativeFungibleUseLedger(),
    playerState: { ...nonPhysicalPlayer, ...physical }
  };
  const startingResources = resolveNativeStartingResourceState(native.playerState, native.clock.tick);
  native.playerState.resources = startingResources.resources;
  native.playerState.resourceRuntime = startingResources.resourceRuntime;
  if (!isNativeTargetCampaignSnapshot(native)) {
    throw new Error('Native fresh campaign failed complete candidate admission.');
  }
  return native;
}
