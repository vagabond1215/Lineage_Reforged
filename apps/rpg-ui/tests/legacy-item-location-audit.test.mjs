import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { demoSnapshot } from '../src/runtime/demoSnapshot.ts';
import { deserializeSnapshot, serializeSnapshot } from '../../../packages/shared/persistence/src/index.ts';

async function withAudit(run) {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ auditLegacyItemLocations }, state] = await Promise.all([
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-item-location-audit.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts')
    ]);
    await run(auditLegacyItemLocations, state);
  } finally {
    await vite.close();
  }
}

test('ordinary unequip produces a legacy metadata stash that cannot be assigned durable instance identity', async () => {
  await withAudit((auditLegacyItemLocations, { buildEquipmentEntries, unequipItem }) => {
    const source = structuredClone(demoSnapshot);
    source.playerState.inventory.bags[0].stacks.push({
      itemId: 'item.composite_bow', itemKey: 'composite_bow', quantity: 1
    });
    const entry = buildEquipmentEntries(source).find((candidate) => candidate.slotId === 'slot.weapon.right');
    assert.ok(entry?.item?.durability !== undefined);
    const result = unequipItem(source, entry);
    assert.equal(result.notice.tone, 'success');
    assert.equal(result.snapshot.playerState.inventory.bags[0].stacks.find(
      (stack) => stack.itemId === 'item.composite_bow'
    )?.quantity, 2, 'ordinary action merges a worn copy with an indistinguishable carried copy');
    const saved = serializeSnapshot(result.snapshot);
    const audit = auditLegacyItemLocations(deserializeSnapshot(saved));
    assert.equal(audit.activation, 'not_authorized');
    assert.equal(audit.status, 'blocked');
    assert.ok(audit.blockers.some((blocker) => blocker.code === 'legacy_stash_metadata'));
    assert.deepEqual(auditLegacyItemLocations(deserializeSnapshot(saved)), audit);
    assert.equal(serializeSnapshot(result.snapshot), saved);
    assert.equal(source.playerState.equipment['slot.weapon.right']?.durability, entry.item.durability);
  });
});

test('bag and overflow quantities are enumerated without duplicating locations or inventing persistent ids', async () => {
  await withAudit((auditLegacyItemLocations) => {
    const snapshot = structuredClone(demoSnapshot);
    for (const slotId of Object.keys(snapshot.playerState.equipment)) snapshot.playerState.equipment[slotId] = null;
    snapshot.playerState.inventory.bags = [{
      id: 'bag.one', label: 'One', slotCapacity: 3,
      stacks: [{ itemId: 'item.composite_bow', itemKey: 'composite_bow', quantity: 2 }]
    }];
    snapshot.playerState.inventory.overflow = [{ itemId: 'item.composite_bow', itemKey: 'composite_bow', quantity: 1 }];
    const before = serializeSnapshot(snapshot);
    const audit = auditLegacyItemLocations(snapshot);
    assert.equal(audit.status, 'structural_candidate');
    assert.equal(audit.sourceUnitCount, 3);
    assert.deepEqual(audit.units.map((unit) => unit.location.kind), ['bag', 'bag', 'overflow']);
    assert.deepEqual(audit.units.map((unit) => unit.unitIndex), [0, 1, 0]);
    assert.ok(audit.units.every((unit) => !('instanceId' in unit)));
    assert.deepEqual(auditLegacyItemLocations(deserializeSnapshot(before)), audit);
    assert.equal(serializeSnapshot(snapshot), before);
  });
});

test('duplicate bag ids and malformed counts block activation while preserving the source', async () => {
  await withAudit((auditLegacyItemLocations) => {
    const snapshot = structuredClone(demoSnapshot);
    snapshot.playerState.inventory.bags.push({
      id: snapshot.playerState.inventory.bags[0].id,
      label: 'Duplicate', slotCapacity: 1,
      stacks: [{ itemId: 'item.iron_ring', itemKey: 'iron_ring', quantity: 0 }]
    });
    const before = serializeSnapshot(snapshot);
    const audit = auditLegacyItemLocations(snapshot);
    assert.equal(audit.status, 'blocked');
    assert.equal(audit.sourceUnitCount, null);
    assert.ok(audit.blockers.some((blocker) => blocker.code === 'duplicate_bag_id'));
    assert.ok(audit.blockers.some((blocker) => blocker.code === 'invalid_stack'));
    assert.equal(serializeSnapshot(snapshot), before);
  });
});

test('malformed admitted inventory containers fail closed without a partial unit proposal', async () => {
  await withAudit((auditLegacyItemLocations) => {
    const snapshot = structuredClone(demoSnapshot);
    snapshot.playerState.inventory.bags = null;
    const before = serializeSnapshot(snapshot);
    const audit = auditLegacyItemLocations(snapshot);
    assert.equal(audit.status, 'blocked');
    assert.equal(audit.sourceUnitCount, null);
    assert.deepEqual(audit.units, []);
    assert.ok(audit.blockers.some((blocker) => blocker.code === 'invalid_inventory_shape'));
    assert.equal(serializeSnapshot(snapshot), before);
  });
});

test('malformed admitted equipment shape fails closed before legacy slot planning', async () => {
  await withAudit((auditLegacyItemLocations) => {
    const snapshot = structuredClone(demoSnapshot);
    snapshot.playerState.equipment = null;
    const before = serializeSnapshot(snapshot);
    const audit = auditLegacyItemLocations(snapshot);
    assert.equal(audit.status, 'blocked');
    assert.equal(audit.sourceUnitCount, null);
    assert.deepEqual(audit.units, []);
    assert.ok(audit.blockers.some((blocker) => blocker.code === 'invalid_equipment_shape'));
    assert.equal(serializeSnapshot(snapshot), before);
  });
});
