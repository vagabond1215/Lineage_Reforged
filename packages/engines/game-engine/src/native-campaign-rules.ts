import items from '../../../content/base/items/items.json' with { type: 'json' };
import fitProfiles from '../../../content/base/items/equipment_fit_profiles.json' with { type: 'json' };
import type { EquipmentState, NativeGearSaveSnapshot, SaveSnapshot } from '../../../shared/types/src/index.js';
import type { GearFit, GearOwner } from './gear-instance-owner.js';
import { isTargetCampaignSnapshot, TARGET_SNAPSHOT_FORMAT } from './campaign-rules.js';
import {
  validateNativeGearPhysicalBoundary
} from './native-gear-physical-boundary.js';

/** Fresh campaigns only. Survey receipts require a separate native witness version. */
export type NativeFreshCampaignSnapshot = NativeGearSaveSnapshot<GearOwner>;

const emptyLegacyProjection: EquipmentState = {
  'slot.weapon.left': null, 'slot.weapon.right': null,
  'slot.armor.head': null, 'slot.armor.shoulder': null,
  'slot.armor.chest': null, 'slot.armor.arm': null,
  'slot.armor.hand': null, 'slot.armor.waist': null,
  'slot.armor.leg': null, 'slot.armor.foot': null,
  'slot.accessory.ear': null, 'slot.accessory.eyes': null,
  'slot.accessory.neck': null, 'slot.accessory.arms': null,
  'slot.accessory.fingers': null, 'slot.accessory.waist': null,
  'slot.accessory.ankle': null
};

const fits = fitProfiles.records as GearFit[];

export function isNativeTargetCampaignSnapshot(value: unknown): value is NativeFreshCampaignSnapshot {
  if (!validateNativeGearPhysicalBoundary(value, fits, items.records).ok) return false;
  try {
    const snapshot = value as NativeFreshCampaignSnapshot;
    const survey = snapshot.authorityLedger?.ashenReefSurvey;
    // A v2 survey witness must never be admitted as native historical evidence.
    if (survey && (survey.requests.length > 0 || survey.occurrences.length > 0 ||
      survey.results.length > 0 || survey.consequenceReceipts.length > 0 ||
      survey.projectionRepairs.length > 0 || survey.corrections.length > 0)) return false;

    // Existing nonphysical campaign checks are reused through an ephemeral read-only
    // projection. No v2 equipment map is sourced from or stored beside native gear.
    const { gear: _gear, ...nonPhysicalPlayer } = snapshot.playerState;
    const legacyValidationView: SaveSnapshot = {
      ...snapshot,
      snapshotVersion: TARGET_SNAPSHOT_FORMAT,
      playerState: { ...nonPhysicalPlayer, equipment: emptyLegacyProjection }
    };
    return isTargetCampaignSnapshot(legacyValidationView);
  } catch {
    return false;
  }
}
