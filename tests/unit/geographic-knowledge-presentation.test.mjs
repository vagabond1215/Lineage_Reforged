import test from "node:test";
import assert from "node:assert/strict";
import {
  getGeographicKnowledgeSectionLabel,
  getGeographicKnowledgeTierLabel,
  isVisibleGeographicKnowledgeLevel
} from "../../apps/rpg-ui/src/runtime/geographicKnowledgePresentation.ts";

test("geographic knowledge tier labels follow the approved player-facing ladder", () => {
  assert.equal(getGeographicKnowledgeTierLabel(0), "Unaware");
  assert.equal(getGeographicKnowledgeTierLabel(1), "Unfamiliar");
  assert.equal(getGeographicKnowledgeTierLabel(2), "Familiar");
  assert.equal(getGeographicKnowledgeTierLabel(3), "Knowledgeable");
  assert.equal(getGeographicKnowledgeTierLabel(4), "Seasoned");
  assert.equal(getGeographicKnowledgeTierLabel(5), "Intimate");
  assert.equal(getGeographicKnowledgeTierLabel(9), "Intimate");
});

test("geographic knowledge visibility hides unaware entries by default", () => {
  assert.equal(isVisibleGeographicKnowledgeLevel(0), false);
  assert.equal(isVisibleGeographicKnowledgeLevel(1), true);
});

test("geographic knowledge section labels stay context-led", () => {
  assert.equal(getGeographicKnowledgeSectionLabel("continent"), "Known Lands");
  assert.equal(getGeographicKnowledgeSectionLabel("region"), "Known Regions");
  assert.equal(getGeographicKnowledgeSectionLabel("settlement"), "Known Settlements");
});
