import test from "node:test";
import assert from "node:assert/strict";
import { validateAuthoredReputationAwards } from "../../packages/engines/civilization-engine/src/content.ts";

test("fame awards reject notoriety fields", () => {
  assert.throws(
    () =>
      validateAuthoredReputationAwards("quest_templates.records[0](quest.test)", [
        {
          axis: "fame",
          branchId: "civic",
          categoryId: "theft",
          directEarnedScope: "local",
          baseValue: 4,
          originSettlementIds: ["settlement.aurelis"]
        }
      ]),
    /must not mix fame and notoriety fields/i
  );
});

test("notoriety awards reject branchId payloads", () => {
  assert.throws(
    () =>
      validateAuthoredReputationAwards("quest_templates.records[0](quest.test)", [
        {
          axis: "notoriety",
          branchId: "civic",
          categoryId: "theft",
          severity: "minor",
          directEarnedScope: "local",
          baseValue: 4,
          originSettlementIds: ["settlement.aurelis"],
          exposureRequirement: "witnessed_or_reported",
          attributionRequired: true,
          allowCredibleLink: false
        }
      ]),
    /must not use branchId on notoriety awards/i
  );
});

test("notoriety awards require severity", () => {
  assert.throws(
    () =>
      validateAuthoredReputationAwards("quest_templates.records[0](quest.test)", [
        {
          axis: "notoriety",
          categoryId: "theft",
          directEarnedScope: "local",
          baseValue: 4,
          originSettlementIds: ["settlement.aurelis"],
          exposureRequirement: "witnessed_or_reported",
          attributionRequired: true,
          allowCredibleLink: false
        }
      ]),
    /severity must be a supported notoriety severity/i
  );
});

test("fame awards reject invalid branches for scope", () => {
  assert.throws(
    () =>
      validateAuthoredReputationAwards("quest_templates.records[0](quest.test)", [
        {
          axis: "fame",
          branchId: "mythic",
          directEarnedScope: "local",
          baseValue: 4,
          originSettlementIds: ["settlement.aurelis"]
        }
      ]),
    /is not valid for local fame/i
  );
});

test("non-world awards require at least one origin settlement", () => {
  assert.throws(
    () =>
      validateAuthoredReputationAwards("quest_templates.records[0](quest.test)", [
        {
          axis: "fame",
          branchId: "civic",
          directEarnedScope: "regional",
          baseValue: 4,
          originSettlementIds: []
        }
      ]),
    /must contain at least one settlement id/i
  );
});
