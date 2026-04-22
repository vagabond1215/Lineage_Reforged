import test from "node:test";
import assert from "node:assert/strict";

const { CHARACTER_ATTRIBUTE_ORDER } = await import("../../apps/rpg-ui/src/game-shell/characterAttributes.ts");
const {
  getFocusOptions,
  getNatureOptions,
  getPhysiqueOptions
} = await import("../../apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts");
const {
  resolveCharacterCreationAttributes,
  resolveGeneratedProfilePointDistribution
} = await import("../../apps/rpg-ui/src/game-shell/characterCreationMath.ts");

function sumPlayerAttributes(attributes) {
  return CHARACTER_ATTRIBUTE_ORDER.reduce((total, attributeKey) => total + attributes[attributeKey], 0);
}

test("every physique/nature/focus combination resolves deterministically to a 100-total character", () => {
  for (const physique of getPhysiqueOptions()) {
    for (const nature of getNatureOptions()) {
      for (const focus of getFocusOptions()) {
        const params = {
          lineageId: "lineage.human",
          sexId: "male",
          ageBandId: "prime",
          heightBandId: "normal",
          physiqueId: physique.id,
          natureId: nature.id,
          focusId: focus.id,
          backstoryId: "backstory.local_hero"
        };

        const first = resolveCharacterCreationAttributes(params);
        const second = resolveCharacterCreationAttributes(params);

        assert.deepEqual(
          first.errors,
          [],
          `${physique.id} / ${nature.id} / ${focus.id}: ${first.errors.join(" | ")}`
        );
        assert.deepEqual(first, second);
        assert.equal(sumPlayerAttributes(first.baseAttributes), 90);
        assert.equal(sumPlayerAttributes(first.generatedProfilePoints), 10);
        assert.equal(sumPlayerAttributes(first.finalAttributes), 100);

        for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
          assert.ok(first.generatedProfilePoints[attributeKey] >= 0, `${physique.id}/${nature.id}/${focus.id} ${attributeKey}`);
          assert.ok(Number.isInteger(first.generatedProfilePoints[attributeKey]));
          assert.ok(first.finalAttributes[attributeKey] >= 1, `${physique.id}/${nature.id}/${focus.id} ${attributeKey}`);
        }
      }
    }
  }
});

test("remainder ties inside epsilon resolve by canonical stat order", () => {
  const distribution = resolveGeneratedProfilePointDistribution({
    STR: 0.1333334,
    DEX: 0.13333335,
    AGI: 0.1333333,
    CON: 0.1,
    VIT: 0.1,
    INT: 0.1,
    WIS: 0.1,
    SPT: 0.1,
    CHA: 0.1
  });

  assert.deepEqual(distribution, {
    STR: 2,
    DEX: 1,
    AGI: 1,
    CON: 1,
    VIT: 1,
    INT: 1,
    WIS: 1,
    SPT: 1,
    CHA: 1
  });
});
