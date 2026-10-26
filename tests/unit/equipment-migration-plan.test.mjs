import test from 'node:test';
import assert from 'node:assert/strict';
import { demoSnapshot } from '../../apps/rpg-ui/src/runtime/demoSnapshot.ts';
import { serializeSnapshot, deserializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { planLegacyEquipmentMigration } from '../../packages/engines/game-engine/src/equipment-migration-plan.ts';
import { initializeTargetCampaignSnapshot, validateAshenReefSurveyAuthority } from '../../packages/engines/game-engine/src/campaign-rules.ts';

function legacySnapshot(overrides = {}) {
  const snapshot = structuredClone(demoSnapshot);
  for (const slotId of Object.keys(snapshot.playerState.equipment)) snapshot.playerState.equipment[slotId] = null;
  Object.assign(snapshot.playerState.equipment, overrides);
  return snapshot;
}

function item(itemId, quantity = 1, durability) {
  return {
    itemId,
    itemKey: itemId.slice('item.'.length),
    quantity,
    ...(durability === undefined ? {} : { durability })
  };
}

test('single legacy Ear, Eyes and Fingers refs receive deterministic left-position proposals without changing the save', () => {
  const snapshot = legacySnapshot({
    'slot.accessory.ear': item('item.pearl_earring', 1, 0.73),
    'slot.accessory.eyes': item('item.tracking_lens', 1, 0.91),
    'slot.accessory.fingers': item('item.iron_ring', 1, 0.64)
  });
  const before = serializeSnapshot(snapshot);
  const plan = planLegacyEquipmentMigration(snapshot);

  assert.equal(plan.version, 1);
  assert.equal(plan.activation, 'not_authorized');
  assert.equal(plan.status, 'candidate');
  assert.deepEqual(plan.blockers, []);
  assert.deepEqual(
    plan.candidateUnits.map(({ legacySlotId, proposedPositionId }) => [legacySlotId, proposedPositionId]),
    [
      ['slot.accessory.ear', 'slot.accessory.ear.left'],
      ['slot.accessory.eyes', 'slot.accessory.eye.left'],
      ['slot.accessory.fingers', 'slot.accessory.ring.left.1']
    ]
  );
  assert.deepEqual(plan.candidateUnits.map((unit) => unit.durability), [0.73, 0.91, 0.64]);
  assert.equal(new Set(plan.candidateUnits.map((unit) => unit.proposedInstanceId)).size, 3);
  assert.deepEqual(planLegacyEquipmentMigration(snapshot), plan, 'repeated planning is idempotent');
  assert.deepEqual(planLegacyEquipmentMigration(deserializeSnapshot(before)), plan, 'SaveSnapshot round trip is stable');
  assert.deepEqual(JSON.parse(JSON.stringify(plan)), plan, 'the plan itself is serializable');
  assert.equal(serializeSnapshot(snapshot), before, 'the planner never mutates current worn state or history');
});

test('legacy multiple Ear and Fingers units retain excess quantity and shared durability when per-copy provenance is unknown', () => {
  const snapshot = legacySnapshot({
    'slot.accessory.ear': item('item.pearl_earring', 2, 0.47),
    'slot.accessory.fingers': item('item.iron_ring', 3, 0.62)
  });
  const before = serializeSnapshot(snapshot);
  const plan = planLegacyEquipmentMigration(snapshot);

  assert.equal(plan.status, 'blocked');
  assert.deepEqual(
    plan.candidateUnits.map(({ proposedPositionId }) => proposedPositionId),
    ['slot.accessory.ear.left', 'slot.accessory.ring.left.1', 'slot.accessory.ring.left.2']
  );
  assert.equal(plan.unplaced.reduce((total, group) => total + group.quantity, 0), 2);
  assert.equal(plan.sourceUnitCount, plan.candidateUnits.length + plan.unplaced.reduce((total, group) => total + group.quantity, 0));
  assert.ok(plan.blockers.some((blocker) => blocker.code === 'shared_instance_metadata'));
  assert.ok(plan.blockers.some((blocker) => blocker.code === 'position_capacity'));
  assert.deepEqual(plan.sourceEquipment['slot.accessory.ear'], item('item.pearl_earring', 2, 0.47));
  assert.deepEqual(plan.sourceEquipment['slot.accessory.fingers'], item('item.iron_ring', 3, 0.62));
  assert.equal(serializeSnapshot(snapshot), before, 'blocked planning preserves all original quantity and durability');
});

test('invalid legacy quantity fails closed without inventing physical instances', () => {
  const snapshot = legacySnapshot({ 'slot.accessory.ear': item('item.pearl_earring', 0, 0.5) });
  const before = serializeSnapshot(snapshot);
  const plan = planLegacyEquipmentMigration(snapshot);
  assert.equal(plan.status, 'blocked');
  assert.ok(plan.blockers.some((blocker) => blocker.code === 'invalid_legacy_ref'));
  assert.equal(plan.candidateUnits.length, 0);
  assert.equal(plan.sourceUnitCount, null);
  assert.equal(serializeSnapshot(snapshot), before);
});

test('planning does not alter historical survey witness bytes, current combat equipment or resources', () => {
  const snapshot = initializeTargetCampaignSnapshot(structuredClone(demoSnapshot), { source: 'developer_fixture' });
  assert.equal(validateAshenReefSurveyAuthority(snapshot), true);
  const before = serializeSnapshot(snapshot);
  const equipmentBefore = structuredClone(snapshot.playerState.equipment);
  const resourcesBefore = structuredClone(snapshot.playerState.resources);
  const historicalBefore = JSON.stringify(snapshot.authorityLedger?.ashenReefSurvey ?? null);
  const plan = planLegacyEquipmentMigration(snapshot);
  assert.equal(plan.status, 'candidate');
  assert.deepEqual(snapshot.playerState.equipment, equipmentBefore);
  assert.deepEqual(snapshot.playerState.resources, resourcesBefore);
  assert.equal(JSON.stringify(snapshot.authorityLedger?.ashenReefSurvey ?? null), historicalBefore);
  assert.equal(serializeSnapshot(snapshot), before);
  assert.equal(validateAshenReefSurveyAuthority(snapshot), true);
});
