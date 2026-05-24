import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ACCOUNT_META_PANEL_SOURCE = new URL(
  "../../apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx",
  import.meta.url
);

function readAccountMetaSource() {
  return readFileSync(ACCOUNT_META_PANEL_SOURCE, "utf8");
}

function extractRunEndSummaryComponent(source) {
  const start = source.indexOf("function ChronicleRunEndSummaryPanel");
  const end = source.indexOf("function BloodlinesFamilyCard");

  assert.notEqual(start, -1, "expected ChronicleRunEndSummaryPanel in AccountMetaPanel");
  assert.notEqual(end, -1, "expected BloodlinesFamilyCard after run-end summary panel");

  return source.slice(start, end);
}

test("account meta Chronicles surface renders run-end summary rows from projection output", () => {
  const source = readAccountMetaSource();

  assert.match(source, /buildChronicleRunEndSummaryViewModel/);
  assert.match(source, /ChronicleRunEndSummaryPanel/);
  assert.match(source, /ChronicleRunEndRowGrid/);
  assert.match(source, /Run-End Summary/);
  assert.match(source, /summary\.identityRows/);
  assert.match(source, /summary\.originRows/);
  assert.match(source, /summary\.survivalRows/);
  assert.match(source, /summary\.progressionRows/);
  assert.match(source, /summary\.deedRows/);
  assert.match(source, /summary\.payoutRows/);
  assert.match(source, /summary\.estateRows/);
  assert.match(source, /summary\.continuityRows/);
  assert.match(source, /summary\.slotRows/);
  assert.match(source, /summary\.warningLabels\.map/);
});

test("run-end summary UI is read-only and exposes no forbidden action paths", () => {
  const componentSource = extractRunEndSummaryComponent(readAccountMetaSource());

  for (const forbidden of [
    /<button/,
    /onClick/,
    /commandId/,
    /actionId/,
    /Claim Estate/,
    /Claim Payout/,
    /Transfer/,
    /Bequest/,
    /Heirloom/,
    /Chronicle Mark/,
    /Lineage Seal/,
    /Family Prestige/,
    /resolveRunLegacyPayout/
  ]) {
    assert.doesNotMatch(componentSource, forbidden);
  }
});

test("account meta passes no stale lifecycle result context into the projection", () => {
  const source = readAccountMetaSource();

  assert.match(source, /runRecord: selectedChronicleRunRecord/);
  assert.doesNotMatch(source, /lifecycleResult/);
  assert.doesNotMatch(source, /clearedSlotIds/);
  assert.doesNotMatch(source, /retainedSlotIds/);
  assert.doesNotMatch(source, /rewardTransactionId/);
});

test("existing account meta sections remain and no run-end mutation callbacks are added", () => {
  const source = readAccountMetaSource();

  assert.match(source, /\{ id: "legacy", label: "Legacy" \}/);
  assert.match(source, /\{ id: "chronicles", label: "Chronicles" \}/);
  assert.match(source, /\{ id: "bloodlines", label: "Bloodlines" \}/);
  assert.match(source, /onPurchaseUnlock\?: \(\(unlockId: string\) => void\) \| undefined/);
  assert.match(source, /onSelectPreparation\?: \(\(unlockId: string\) => void\) \| undefined/);
  assert.doesNotMatch(source, /onRunEnd/);
  assert.doesNotMatch(source, /onPayout/);
  assert.doesNotMatch(source, /onEstate/);
  assert.doesNotMatch(source, /onChronicleMark/);
  assert.doesNotMatch(source, /onLineageSeal/);
});
