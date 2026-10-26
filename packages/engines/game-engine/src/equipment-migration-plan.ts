import type { EquipmentSlotId, EquipmentState, SaveSnapshot } from '../../../shared/types/src/index.js';

// Historical save shape. Keep this list fixed when a later live equipment schema is introduced.
const LEGACY_SLOTS: readonly EquipmentSlotId[] = [
  'slot.weapon.left', 'slot.weapon.right',
  'slot.armor.head', 'slot.armor.shoulder', 'slot.armor.chest', 'slot.armor.arm',
  'slot.armor.hand', 'slot.armor.waist', 'slot.armor.leg', 'slot.armor.foot',
  'slot.accessory.ear', 'slot.accessory.eyes', 'slot.accessory.neck',
  'slot.accessory.arms', 'slot.accessory.fingers', 'slot.accessory.waist',
  'slot.accessory.ankle'
];

const POSITION_TARGETS: Record<EquipmentSlotId, readonly string[]> = {
  'slot.weapon.left': ['slot.weapon.left'],
  'slot.weapon.right': ['slot.weapon.right'],
  'slot.armor.head': ['slot.armor.head'],
  'slot.armor.shoulder': ['slot.armor.shoulder'],
  'slot.armor.chest': ['slot.armor.chest'],
  'slot.armor.arm': ['slot.armor.arm'],
  'slot.armor.hand': ['slot.armor.hand'],
  'slot.armor.waist': ['slot.armor.waist'],
  'slot.armor.leg': ['slot.armor.leg'],
  'slot.armor.foot': ['slot.armor.foot'],
  'slot.accessory.ear': ['slot.accessory.ear.left'],
  'slot.accessory.eyes': ['slot.accessory.eye.left'],
  'slot.accessory.neck': ['slot.accessory.neck'],
  'slot.accessory.arms': ['slot.accessory.arms'],
  'slot.accessory.fingers': ['slot.accessory.ring.left.1', 'slot.accessory.ring.left.2'],
  'slot.accessory.waist': ['slot.accessory.waist'],
  'slot.accessory.ankle': ['slot.accessory.ankle']
};

// A corrupt count must not make a read-only audit allocate an unbounded array.
const MAX_PREVIEW_UNITS_PER_REF = 64;

export type EquipmentMigrationBlockerCode =
  | 'unsupported_legacy_shape'
  | 'invalid_legacy_ref'
  | 'excessive_quantity'
  | 'shared_instance_metadata'
  | 'position_capacity';

export interface EquipmentMigrationBlocker {
  code: EquipmentMigrationBlockerCode;
  legacySlotId: string | null;
}

export interface ProposedEquipmentUnit {
  legacySlotId: EquipmentSlotId;
  legacyUnitIndex: number;
  proposedPositionId: string;
  proposedInstanceId: string;
  itemId: string;
  itemKey: string;
  durability?: number;
  resourceModifiers?: NonNullable<EquipmentState[EquipmentSlotId]>['resourceModifiers'];
}

export interface UnplacedLegacyEquipmentGroup {
  legacySlotId: EquipmentSlotId;
  firstLegacyUnitIndex: number;
  quantity: number;
}

/** Read-only candidate. No caller may treat `candidate` as item-fit or save-migration approval. */
export interface LegacyEquipmentMigrationPlanV1 {
  version: 1;
  activation: 'not_authorized';
  status: 'candidate' | 'blocked';
  sourceSnapshotVersion: string;
  sourceCapturedAtTick: number;
  sourceEquipment: EquipmentState;
  sourceUnitCount: number | null;
  candidateUnits: ProposedEquipmentUnit[];
  unplaced: UnplacedLegacyEquipmentGroup[];
  blockers: EquipmentMigrationBlocker[];
}

function proposedId(snapshot: SaveSnapshot, slotId: EquipmentSlotId, unitIndex: number, itemId: string, itemKey: string): string {
  const identity = [
    snapshot.accountId,
    snapshot.campaignIdentity?.campaignId ?? null,
    snapshot.campaignIdentity?.continuityId ?? null,
    snapshot.playerState.playerId,
    snapshot.capturedAtTick,
    slotId,
    unitIndex,
    itemId,
    itemKey
  ];
  return `legacy-unit.v1.${encodeURIComponent(JSON.stringify(identity))}`;
}

/**
 * Inspect an old 17-slot record without mutating the live equipment, inventory,
 * clock or immutable Ashen Reef survey witnesses. Proposed IDs and positions
 * cannot be equipped or saved as live state until the instance/location owner exists.
 */
export function planLegacyEquipmentMigration(snapshot: SaveSnapshot): LegacyEquipmentMigrationPlanV1 {
  const sourceEquipment = structuredClone(snapshot.playerState.equipment);
  const candidateUnits: ProposedEquipmentUnit[] = [];
  const unplaced: UnplacedLegacyEquipmentGroup[] = [];
  const blockers: EquipmentMigrationBlocker[] = [];
  let sourceUnitCount: number | null = 0;
  const keys = Object.keys(sourceEquipment);
  const legacyKeys = new Set<string>(LEGACY_SLOTS);
  if (keys.length !== LEGACY_SLOTS.length || keys.some((key) => !legacyKeys.has(key))) {
    blockers.push({ code: 'unsupported_legacy_shape', legacySlotId: null });
    return {
      version: 1, activation: 'not_authorized', status: 'blocked',
      sourceSnapshotVersion: snapshot.snapshotVersion,
      sourceCapturedAtTick: snapshot.capturedAtTick,
      sourceEquipment, sourceUnitCount: null, candidateUnits, unplaced, blockers
    };
  }

  for (const slotId of LEGACY_SLOTS) {
    const item = sourceEquipment[slotId];
    if (item === null) continue;
    if (
      !item || typeof item.itemId !== 'string' || item.itemId.length === 0 ||
      typeof item.itemKey !== 'string' || item.itemKey.length === 0 ||
      !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
      (item.durability !== undefined && (!Number.isFinite(item.durability) || item.durability < 0)) ||
      (item.resourceModifiers !== undefined && !Array.isArray(item.resourceModifiers))
    ) {
      blockers.push({ code: 'invalid_legacy_ref', legacySlotId: slotId });
      sourceUnitCount = null;
      continue;
    }
    if (sourceUnitCount !== null) {
      sourceUnitCount = Number.isSafeInteger(sourceUnitCount + item.quantity)
        ? sourceUnitCount + item.quantity
        : null;
    }
    if (item.quantity > MAX_PREVIEW_UNITS_PER_REF) {
      blockers.push({ code: 'excessive_quantity', legacySlotId: slotId });
      unplaced.push({ legacySlotId: slotId, firstLegacyUnitIndex: 0, quantity: item.quantity });
      continue;
    }
    const positions = POSITION_TARGETS[slotId];
    const placedCount = Math.min(item.quantity, positions.length);
    if (item.quantity > 1 && (item.durability !== undefined || item.resourceModifiers !== undefined)) {
      // One old scalar cannot be assigned to several distinct physical copies.
      blockers.push({ code: 'shared_instance_metadata', legacySlotId: slotId });
    }
    for (let unitIndex = 0; unitIndex < placedCount; unitIndex += 1) {
      const unit: ProposedEquipmentUnit = {
        legacySlotId: slotId,
        legacyUnitIndex: unitIndex,
        proposedPositionId: positions[unitIndex]!,
        proposedInstanceId: proposedId(snapshot, slotId, unitIndex, item.itemId, item.itemKey),
        itemId: item.itemId,
        itemKey: item.itemKey
      };
      if (item.quantity === 1) {
        if (item.durability !== undefined) unit.durability = item.durability;
        if (item.resourceModifiers !== undefined) unit.resourceModifiers = structuredClone(item.resourceModifiers);
      }
      candidateUnits.push(unit);
    }
    if (item.quantity > positions.length) {
      blockers.push({ code: 'position_capacity', legacySlotId: slotId });
      unplaced.push({
        legacySlotId: slotId,
        firstLegacyUnitIndex: placedCount,
        quantity: item.quantity - placedCount
      });
    }
  }

  return {
    version: 1,
    activation: 'not_authorized',
    status: blockers.length === 0 ? 'candidate' : 'blocked',
    sourceSnapshotVersion: snapshot.snapshotVersion,
    sourceCapturedAtTick: snapshot.capturedAtTick,
    sourceEquipment,
    sourceUnitCount,
    candidateUnits,
    unplaced,
    blockers
  };
}
