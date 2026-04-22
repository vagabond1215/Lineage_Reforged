import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources
} from "../../packages/shared/types/src/index.js";
import {
  createDefaultPlayerBodyState,
  createPlayerProgressionState
} from "../../packages/engines/player-engine/src/index.ts";

const EMPTY_EQUIPMENT = {
  "slot.weapon.left": null,
  "slot.weapon.right": null,
  "slot.armor.head": null,
  "slot.armor.shoulder": null,
  "slot.armor.chest": null,
  "slot.armor.arm": null,
  "slot.armor.hand": null,
  "slot.armor.waist": null,
  "slot.armor.leg": null,
  "slot.armor.foot": null,
  "slot.accessory.ear": null,
  "slot.accessory.eyes": null,
  "slot.accessory.neck": null,
  "slot.accessory.arms": null,
  "slot.accessory.fingers": null,
  "slot.accessory.waist": null,
  "slot.accessory.ankle": null
};

function createResourceState(attributes) {
  const coreData = {
    lineageId: "lineage.human",
    classId: null,
    sexId: "male"
  };
  const progression = createPlayerProgressionState({
    legacyGrowth: {
      resourceGrowthLevel: 1,
      classLevel: 0,
      unspentAttributePoints: 0,
      unspentSkillPoints: 0
    }
  });
  const originProfile = resolvePlayerOriginProfile(coreData, progression);
  const bodyState = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: coreData.lineageId
  });

  return {
    playerId: "player.preview",
    attributes,
    resources: {
      hp: {
        current: originProfile.resolvedResourceMaxima.hp,
        max: originProfile.resolvedResourceMaxima.hp
      },
      mp: {
        current: originProfile.resolvedResourceMaxima.mp,
        max: originProfile.resolvedResourceMaxima.mp
      },
      stamina: {
        current: originProfile.resolvedResourceMaxima.stamina,
        max: originProfile.resolvedResourceMaxima.stamina
      },
      xp: {
        current: 0,
        total: 0,
        toNextLevel: 100
      }
    },
    originProfile,
    equipment: EMPTY_EQUIPMENT,
    resourceRuntime: createEmptyPlayerResourceRuntimeState(),
    bodyState
  };
}

test("resource maxima respond to attribute changes in the shared resolver", () => {
  const baselineState = createResourceState({
    STR: 10,
    DEX: 10,
    AGI: 10,
    CON: 10,
    VIT: 10,
    WIS: 10,
    INT: 10,
    SPT: 10,
    CHA: 10
  });
  const improvedState = createResourceState({
    STR: 10,
    DEX: 10,
    AGI: 11,
    CON: 12,
    VIT: 9,
    WIS: 10,
    INT: 11,
    SPT: 12,
    CHA: 10
  });

  const baseline = resolvePlayerResources(baselineState, [], 0);
  const improved = resolvePlayerResources(improvedState, [], 0);

  assert.equal(baseline.resources.hp.max, 120);
  assert.equal(baseline.resources.mp.max, 60);
  assert.equal(
    baseline.resources.stamina.max,
    Math.round(
      improvedState.originProfile.resolvedResourceMaxima.stamina *
        baselineState.bodyState.resolved.staminaMaxMultiplier
    )
  );

  assert.equal(improved.resources.hp.max, 124);
  assert.equal(improved.resources.mp.max, 72);
  assert.equal(
    improved.resources.stamina.max,
    Math.round(
      (improvedState.originProfile.resolvedResourceMaxima.stamina + 6) *
        improvedState.bodyState.resolved.staminaMaxMultiplier
    )
  );
  assert.ok(improved.resources.stamina.max > baseline.resources.stamina.max);
});
