import type { PlayerInventoryState } from '../../../shared/types/src/index.js';
import {
  deriveGearBagCapacities,
  validateGearOwner,
  type GearFit,
  type GearOwner
} from './gear-instance-owner.js';

/** Candidate epoch identity. SaveManager does not admit this format yet. */
export const CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION = 'lineage.save_snapshot.v3' as const;

/** Physical fields only; the target campaign/Save schema is still separate. */
export type NativeGearPlayerPhysicalState = {
  gear: GearOwner;
  inventory: PlayerInventoryState;
  equipment?: never;
};

export type NativeGearPhysicalSnapshotBoundary = {
  snapshotVersion: typeof CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION;
  playerState: NativeGearPlayerPhysicalState;
  sessionState: { flags: string[] };
};

export type CanonicalPhysicalItem = {
  id: string;
  itemKey: string;
  itemClass: string;
};

type BoundaryResult = { ok: true } | { ok: false; reason: string };
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.trim() === value;
const nonnegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const positiveInteger = (value: unknown): value is number =>
  nonnegativeInteger(value) && value > 0;
const accepted: BoundaryResult = { ok: true };
const reject = (reason: string): BoundaryResult => ({ ok: false, reason });
const fungibleClasses = new Set(['commodity', 'consumable', 'quest']);
const durableClasses = new Set(['weapon', 'armor', 'clothing', 'accessory', 'tool']);

/**
 * Checks only the new physical item boundary. It does not admit a complete
 * SaveSnapshot, publish an artifact, or convert an obsolete development save.
 */
export function validateNativeGearPhysicalBoundary(
  value: unknown,
  fits: readonly GearFit[],
  catalog: readonly CanonicalPhysicalItem[]
): BoundaryResult {
  if (!record(value) || value.snapshotVersion !== CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION) {
    return reject('Incompatible development save; start a new campaign.');
  }
  if (!record(value.playerState) || !record(value.sessionState)) {
    return reject('Native player or session state is missing.');
  }
  if ('equipment' in value.playerState) {
    return reject('Parallel equipment map is not allowed in the native format.');
  }
  const flags = value.sessionState.flags;
  if (!Array.isArray(flags) || !flags.every(flag => typeof flag === 'string')) {
    return reject('Session flags are malformed.');
  }
  if (flags.some(flag => flag.startsWith('ui.character.item-stash.'))) {
    return reject('Legacy item stash flags are not allowed in the native format.');
  }

  if (!Array.isArray(catalog) || !catalog.every(item => record(item) &&
    nonblank(item.id) && nonblank(item.itemKey) && item.id === `item.${item.itemKey}` &&
    nonblank(item.itemClass)) || new Set(catalog.map(item => item.id)).size !== catalog.length) {
    return reject('Canonical item metadata is invalid.');
  }
  const byId = new Map(catalog.map(item => [item.id, item]));
  const inventory = value.playerState.inventory;
  if (!record(inventory) || !Array.isArray(inventory.bags) || !Array.isArray(inventory.overflow)) {
    return reject('Native fungible inventory is malformed.');
  }
  const bagIds = new Set<string>();
  const validatedBags: { id: string; slotCapacity: number; stacks: unknown[] }[] = [];
  for (const bag of inventory.bags) {
    if (!record(bag) || !nonblank(bag.id) || bagIds.has(bag.id) ||
      !nonblank(bag.label) || !nonnegativeInteger(bag.slotCapacity) ||
      !Array.isArray(bag.stacks) || bag.stacks.length > bag.slotCapacity) {
      return reject('Native inventory bag identity or capacity is invalid.');
    }
    bagIds.add(bag.id);
    validatedBags.push({ id: bag.id, slotCapacity: bag.slotCapacity, stacks: bag.stacks });
  }
  const stacks = [...inventory.bags.flatMap(bag => bag.stacks), ...inventory.overflow];
  for (const stack of stacks) {
    if (!record(stack) || !nonblank(stack.itemId) || !nonblank(stack.itemKey) ||
      !positiveInteger(stack.quantity)) {
      return reject('Fungible stack identity or quantity is invalid.');
    }
    const item = byId.get(stack.itemId);
    if (!item || item.itemKey !== stack.itemKey) {
      return reject('Fungible stack has no matching canonical item.');
    }
    if (!fungibleClasses.has(item.itemClass)) {
      return reject('Only fungible commodity, consumable or quest cargo may use inventory stacks.');
    }
  }
  const gear = value.playerState.gear;
  const capacities = deriveGearBagCapacities({ bags: validatedBags });
  const validity = validateGearOwner(gear, fits, capacities);
  if (!validity.ok) return reject(`Native gear graph is invalid: ${validity.reason}`);
  for (const instance of (gear as GearOwner).instances) {
    const item = byId.get(instance.itemId);
    if (!item || item.itemKey !== instance.itemKey || !durableClasses.has(item.itemClass)) {
      return reject('Gear instance has no matching canonical durable item.');
    }
  }
  return accepted;
}
