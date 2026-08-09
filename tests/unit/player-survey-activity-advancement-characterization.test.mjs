import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import { initializeTargetCampaignSnapshot } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { createCampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import {
  createPlayerSurveyActivityAdvancementCommand,
  executePlayerSurveyActivityAdvancementCommand
} from "../../packages/engines/game-engine/src/player-survey-activity-advancement.ts";

const QUEST_ID = "quest.ashen_reef_survey";
const SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const RUINS_FLAG = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const DISCOVERY_FLAG = "gameplay.discovery.stormglass_bloom";

function createStageSnapshot(stage) {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.sessionState.trackedQuestId = QUEST_ID;
  snapshot.sessionState.questJournal = snapshot.sessionState.questJournal.map((entry) => ({
    ...entry,
    category: entry.id === QUEST_ID ? "active" : entry.category,
    tracked: entry.id === QUEST_ID
  }));
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.starfall_port",
    siteLabel: "Ashen Reef"
  };
  snapshot.sessionState.flags = snapshot.sessionState.flags.filter(
    (flag) => !flag.startsWith(SECTOR_PREFIX) && flag !== RUINS_FLAG && flag !== DISCOVERY_FLAG
  );
  snapshot.playerState.discoveryChronicle.entries =
    snapshot.playerState.discoveryChronicle.entries.filter(
      (entry) => entry.id !== "discovery.stormglass_bloom"
    );
  for (let sector = 1; sector < stage; sector += 1) {
    snapshot.sessionState.flags.push(`${SECTOR_PREFIX}${sector}`);
  }
  return initializeTargetCampaignSnapshot(snapshot, { source: "developer_fixture" });
}

function advanceSurvey(snapshot, ordinal) {
  const identity = snapshot.campaignIdentity;
  const control = createCampaignSessionControl({
    accountId: snapshot.accountId,
    campaignId: identity.campaignId,
    artifactId: `artifact.characterization.${ordinal}`,
    publicationId: `publication.characterization.${ordinal}`,
    artifactRevision: 1,
    continuityId: identity.continuityId,
    headArtifactId: `artifact.characterization.${ordinal}`,
    headRevision: 1
  });
  const command = createPlayerSurveyActivityAdvancementCommand(
    snapshot,
    control,
    `survey_request.00000000-0000-4000-8000-00000000000${ordinal}`
  );
  return executePlayerSurveyActivityAdvancementCommand(snapshot, control, command);
}

function surveyFlags(snapshot) {
  return snapshot.sessionState.flags.filter(
    (flag) => flag.startsWith(SECTOR_PREFIX) || flag === RUINS_FLAG || flag === DISCOVERY_FLAG
  );
}

test("legacy Ashen Reef survey stages preserve the exact intended material mutation path", () => {
  for (let stage = 1; stage <= 4; stage += 1) {
    const source = createStageSnapshot(stage);
    const sourceBytes = JSON.stringify(source);
    const sourceTick = source.clock.tick;
    const sourcePlayTicks = source.playerState.saveMeta.totalPlayTicks;
    const result = advanceSurvey(source, stage);
    const next = result.snapshot;

    assert.equal(result.accepted, true);
    assert.equal(JSON.stringify(source), sourceBytes, `stage ${stage} mutates its source`);
    assert.notEqual(next, source);
    assert.equal(next.clock.tick, sourceTick + 2);
    assert.equal(next.capturedAtTick, next.clock.tick);
    assert.equal(next.playerState.saveMeta.totalPlayTicks, sourcePlayTicks + 2);

    // These values prove two one-tick full-profile body applications, two stat-load
    // applications, natural resource resolution per tick, and then the explicit costs.
    assert.deepEqual(next.playerState.resources, {
      hp: { current: 185, max: 214 },
      mp: { current: 121, max: 132 },
      stamina: { current: 161, max: 171 },
      xp: { current: 12480, total: 184400, toNextLevel: 14000 }
    });
    assert.equal(next.playerState.bodyState.lastAdvancedTick, sourceTick + 2);
    assert.equal(next.playerState.bodyState.energyReserve.quick, 39.0753);
    assert.equal(next.playerState.bodyState.energyReserve.stored, 63.497279999999996);
    assert.equal(next.playerState.bodyState.hydrationLevel, 35.312);
    assert.equal(next.playerState.bodyState.fatigue, 59.812528);
    assert.equal(next.playerState.bodyState.dailyEnergyDemand, 30.642);
    assert.equal(next.playerState.bodyState.dailyHighIntensityLoad, 5);
    assert.deepEqual(next.playerState.statGrowth.load, {
      STR: 0,
      DEX: 0,
      AGI: 6.1323,
      CON: 7.0538,
      VIT: 0.7924,
      WIS: 4.1913,
      INT: 0,
      SPT: 0,
      CHA: 0
    });
    assert.deepEqual(next.playerState.statGrowth.dailyVarietySources, {
      STR: [],
      DEX: [],
      AGI: ["survey"],
      CON: ["survey"],
      VIT: ["survey"],
      WIS: ["survey"],
      INT: [],
      SPT: [],
      CHA: []
    });

    const expectedFlags = Array.from({ length: Math.min(stage, 3) }, (_, index) =>
      `${SECTOR_PREFIX}${index + 1}`
    );
    if (stage === 4) expectedFlags.push(RUINS_FLAG, DISCOVERY_FLAG);
    assert.deepEqual(surveyFlags(next), expectedFlags);

    const operation = next.sessionState.operations.find(
      (entry) => entry.id === "operation.quest.ashen_reef_survey"
    );
    assert.deepEqual(operation, {
      id: "operation.quest.ashen_reef_survey",
      title: "Ashen Reef Survey",
      stage:
        stage === 4
          ? "Chart packet ready for harbor turn-in"
          : `Survey sectors logged: ${stage} / 3`,
      progress: stage * 25,
      etaLabel: stage === 4 ? "Ready now" : `${4 - stage} shift(s)`,
      owner: "Arden Voss",
      output: stage === 4 ? "Verified reef chart packet" : "Field chart updates",
      priority: "High"
    });

    const skillId =
      stage === 4 ? "skill.resource.identify.flora" : "skill.knowledge.general_lore";
    const skill = next.playerState.skills.find((entry) => entry.id === skillId);
    assert.equal(skill?.rank, stage === 4 ? 1 : 8);
    assert.equal(skill?.source, "trained");

    const notification = next.sessionState.notifications[0];
    const chronicle = next.sessionState.chronicle[0];
    assert.deepEqual(
      {
        title: notification.title,
        detail: notification.detail,
        tone: notification.tone,
        timeLabel: notification.timeLabel
      },
      stage === 4
        ? {
            title: "Survey packet complete",
            detail:
              "All sectors and ruin markers are logged. Return to Saltmere for payment and codex credit.",
            tone: "accent",
            timeLabel: "Day 1, High Sun"
          }
        : {
            title: "Survey sector logged",
            detail: `Ashen Reef sector ${stage} is now charted and filed into the packet.`,
            tone: "success",
            timeLabel: "Day 1, High Sun"
          }
    );
    assert.equal(
      chronicle.title,
      stage === 4
        ? "Ashen Reef survey packet completed"
        : `Survey sector ${stage} logged at Ashen Reef`
    );
    assert.equal(chronicle.statusLabel, stage === 4 ? "Packet complete" : `Sector ${stage} / 3`);
    assert.deepEqual(chronicle.statChanges, [
      stage === 4 ? "Survival +1" : "Navigation +1",
      "Stamina -10",
      "MP -3"
    ]);

    const quest = next.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
    assert.deepEqual(quest.objectives, [
      `Survey reef lanes: ${Math.min(stage, 3)} / 3 sectors complete`,
      `Confirm ruin markers: ${stage === 4 ? "complete" : "pending"}`,
      "Return chart packet to Saltmere Harbor Office"
    ]);
    assert.equal(next.sessionState.notifications.length, Math.min(8, source.sessionState.notifications.length + 1));
    assert.equal(next.sessionState.chronicle.length, Math.min(48, source.sessionState.chronicle.length + 1));

    const discovery = next.playerState.discoveryChronicle.entries.find(
      (entry) => entry.id === "discovery.stormglass_bloom"
    );
    const codex = next.sessionState.codexEntries.find(
      (entry) => entry.id === "flora.unknown_bloom"
    );
    if (stage === 4) {
      assert.deepEqual(discovery, {
        id: "discovery.stormglass_bloom",
        codexEntryId: "flora.unknown_bloom",
        category: "flora",
        title: "Stormglass Bloom",
        discoveredAtTick: sourceTick + 2,
        discoveredAtLabel: "Day 1, High Sun",
        regionLabel: "Glasswater",
        sourceType: "survey",
        sourceId: QUEST_ID,
        notes: [
          "Logged during the Ashen Reef survey while the crew marked ruin shelves.",
          "The petals refract storm light and dry into brittle crystalline veins."
        ]
      });
      assert.equal(codex.locked, false);
      assert.equal(codex.title, "Stormglass Bloom");
      assert.equal(next.sessionState.currentActivity.id, "activity.return.survey_packet");
      assert.equal(
        next.sessionState.worldRecords.find((entry) => entry.id === "route.aurelis_starfall_port")?.status,
        "Risk: charted"
      );
      assert.equal(
        next.sessionState.worldRecords.find((entry) => entry.id === "travel.scout_starfall_port")?.status,
        "Survey complete"
      );
    } else {
      assert.equal(discovery, undefined);
      assert.equal(codex.locked, true);
      assert.equal(next.sessionState.currentActivity.id, source.sessionState.currentActivity.id);
    }
  }
});
