import type { EquipmentSlotId, InventoryStack, SaveSnapshot } from '../../../shared/types/src/index.js';
import { planLegacyEquipmentMigration } from './equipment-migration-plan.js';

const STASH_PREFIX = 'ui.character.item-stash.';
const MAX_AUDIT_UNITS = 256;

export type LegacyPhysicalLocation =
  | { kind: 'equipped'; slotId: EquipmentSlotId }
  | { kind: 'bag'; bagId: string; bagIndex: number; stackIndex: number }
  | { kind: 'overflow'; stackIndex: number };

export interface LegacyPhysicalUnitRow {
  itemId: string;
  itemKey: string;
  unitIndex: number;
  location: LegacyPhysicalLocation;
}

export type LegacyLocationBlockerCode =
  | 'invalid_equipment_shape'
  | 'legacy_equipment_blocked'
  | 'legacy_stash_metadata'
  | 'duplicate_bag_id'
  | 'invalid_bag_id'
  | 'invalid_inventory_shape'
  | 'invalid_stack'
  | 'excessive_quantity';

export interface LegacyLocationBlocker {
  code: LegacyLocationBlockerCode;
  source: string;
}

/** Structural inventory of old physical units, not a new live item or location owner. */
export interface LegacyItemLocationAuditV1 {
  version: 1;
  activation: 'not_authorized';
  status: 'structural_candidate' | 'blocked';
  sourceSnapshotVersion: string;
  sourceEquipment: unknown;
  sourceInventory: SaveSnapshot['playerState']['inventory'];
  sourceStashFlags: string[];
  sourceUnitCount: number | null;
  units: LegacyPhysicalUnitRow[];
  blockers: LegacyLocationBlocker[];
}

function validStack(value: InventoryStack | null | undefined): value is InventoryStack {
  return !!value && typeof value.itemId === 'string' && value.itemId.length > 0 &&
    typeof value.itemKey === 'string' && value.itemKey.length > 0 &&
    Number.isSafeInteger(value.quantity) && value.quantity > 0;
}

/**
 * Counts current equipped, bag and overflow units without minting durable IDs.
 * Legacy UI stash flags are item-type keyed, so they cannot establish which
 * physical copy owns the stashed durability or modifiers after compaction.
 */
export function auditLegacyItemLocations(snapshot: SaveSnapshot): LegacyItemLocationAuditV1 {
  const rawEquipment: unknown = structuredClone(snapshot.playerState.equipment);
  if (!rawEquipment || typeof rawEquipment !== 'object' || Array.isArray(rawEquipment)) {
    return {
      version: 1,
      activation: 'not_authorized',
      status: 'blocked',
      sourceSnapshotVersion: snapshot.snapshotVersion,
      sourceEquipment: rawEquipment,
      sourceInventory: structuredClone(snapshot.playerState.inventory),
      sourceStashFlags: [],
      sourceUnitCount: null,
      units: [],
      blockers: [{ code: 'invalid_equipment_shape', source: 'playerState.equipment' }]
    };
  }
  const equipmentPlan = planLegacyEquipmentMigration(snapshot);
  const sourceEquipment = equipmentPlan.sourceEquipment;
  const sourceInventory = structuredClone(snapshot.playerState.inventory);
  const sourceStashFlags = snapshot.sessionState.flags.filter((flag) => flag.startsWith(STASH_PREFIX));
  const units: LegacyPhysicalUnitRow[] = [];
  const blockers: LegacyLocationBlocker[] = [];
  let sourceUnitCount: number | null = 0;

  if (equipmentPlan.status === 'blocked') {
    blockers.push({ code: 'legacy_equipment_blocked', source: 'playerState.equipment' });
  }
  for (const flag of sourceStashFlags) {
    blockers.push({ code: 'legacy_stash_metadata', source: flag.slice(0, STASH_PREFIX.length) });
  }

  if (
    !sourceInventory || !Array.isArray(sourceInventory.bags) ||
    !Array.isArray(sourceInventory.overflow) ||
    sourceInventory.bags.some((bag) => !bag || !Array.isArray(bag.stacks))
  ) {
    blockers.push({ code: 'invalid_inventory_shape', source: 'playerState.inventory' });
    return {
      version: 1,
      activation: 'not_authorized',
      status: 'blocked',
      sourceSnapshotVersion: snapshot.snapshotVersion,
      sourceEquipment,
      sourceInventory,
      sourceStashFlags,
      sourceUnitCount: null,
      units,
      blockers
    };
  }

  const append = (item: InventoryStack, location: LegacyPhysicalLocation, source: string): void => {
    if (!validStack(item)) {
      sourceUnitCount = null;
      blockers.push({ code: 'invalid_stack', source });
      return;
    }
    if (sourceUnitCount !== null) {
      const nextCount = sourceUnitCount + item.quantity;
      sourceUnitCount = Number.isSafeInteger(nextCount) ? nextCount : null;
    }
    if (item.quantity > MAX_AUDIT_UNITS || units.length + item.quantity > MAX_AUDIT_UNITS) {
      blockers.push({ code: 'excessive_quantity', source });
      return;
    }
    for (let unitIndex = 0; unitIndex < item.quantity; unitIndex += 1) {
      units.push({ itemId: item.itemId, itemKey: item.itemKey, unitIndex, location });
    }
  };

  for (const [slotId, item] of Object.entries(sourceEquipment)) {
    if (item !== null) append(item, { kind: 'equipped', slotId: slotId as EquipmentSlotId }, slotId);
  }
  const bagIds = new Set<string>();
  for (const [bagIndex, bag] of sourceInventory.bags.entries()) {
    if (typeof bag.id !== 'string' || bag.id.length === 0) {
      blockers.push({ code: 'invalid_bag_id', source: `bag.${bagIndex}` });
    } else if (bagIds.has(bag.id)) {
      blockers.push({ code: 'duplicate_bag_id', source: `bag.${bagIndex}` });
    } else {
      bagIds.add(bag.id);
    }
    for (const [stackIndex, stack] of bag.stacks.entries()) {
      append(stack, { kind: 'bag', bagId: bag.id, bagIndex, stackIndex }, `bag.${bagIndex}.${stackIndex}`);
    }
  }
  for (const [stackIndex, stack] of sourceInventory.overflow.entries()) {
    append(stack, { kind: 'overflow', stackIndex }, `overflow.${stackIndex}`);
  }

  return {
    version: 1,
    activation: 'not_authorized',
    status: blockers.length === 0 ? 'structural_candidate' : 'blocked',
    sourceSnapshotVersion: snapshot.snapshotVersion,
    sourceEquipment,
    sourceInventory,
    sourceStashFlags,
    sourceUnitCount,
    units,
    blockers
  };
}
