import type {
  ActionAttributeLoadProfileState,
  ActionMetabolicProfileState,
  AshenReefSurveyAuthorityState,
  AshenReefSurveyMaterialFactsState,
  AshenReefSurveyNormalizedIntentState,
  AshenReefSurveyOwnerInputsState,
  AshenReefSurveyReceiptKind,
  CampaignIdentityState,
  CampaignRulesState,
  RunDifficultyState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import { resolvePlayerResources } from "../../../shared/types/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import {
  advancePlayerBodyState,
  applyActionAttributeLoad,
  applyAttributeTensionToActionProfile,
  resolveSkillRankGainPolicy,
  syncPlayerBodyState,
  syncPlayerStatGrowth
} from "../../player-engine/src/index.js";

export const TARGET_SNAPSHOT_FORMAT = "lineage.save_snapshot.v2";
export const CAMPAIGN_RULES_VERSION = 2 as const;
export const STAKES_POLICY_REVISION = 1 as const;

const SURVEY_SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const SURVEY_REQUEST_PREFIX = "survey_request.";
const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const SURVEY_REQUEST_PATTERN = new RegExp(`^${SURVEY_REQUEST_PREFIX}${UUID_PATTERN}$`, "i");
const SURVEY_CORRECTION_PATTERN = new RegExp(`^survey_correction\\.${UUID_PATTERN}$`, "i");
const SURVEY_RELEVANT_SKILL_IDS = [
  "skill.knowledge.general_lore",
  "skill.resource.identify.flora"
] as const;

const SURVEY_SHIFT_PROFILE: ActionMetabolicProfileState = {
  intensity: "high",
  fatigueGain: 14,
  energyDemand: 16,
  hydrationDemand: 12,
  highIntensityLoad: 2
};

export const ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE: ActionAttributeLoadProfileState = {
  intensity: "high",
  sourceTag: "survey",
  weights: {
    AGI: 0.7,
    CON: 0.6,
    VIT: 0.4,
    WIS: 0.3
  },
  meaningfulInteraction: true
};

export const ASHEN_REEF_SURVEY_COMMON_RECEIPT_KINDS = [
  "time_advance",
  "body_advance",
  "attribute_load",
  "resource_cost",
  "skill_progress",
  "survey_progress",
  "quest_progress_sync",
  "survey_operation",
  "notification_projection",
  "chronicle_projection",
  "event_projection"
] as const satisfies readonly AshenReefSurveyReceiptKind[];

export const ASHEN_REEF_SURVEY_FINAL_RECEIPT_KINDS = [
  "time_advance",
  "body_advance",
  "attribute_load",
  "resource_cost",
  "skill_progress",
  "survey_progress",
  "quest_progress_sync",
  "survey_operation",
  "player_discovery",
  "discovery_flag",
  "codex_visibility_projection",
  "activity_transition",
  "notification_projection",
  "chronicle_projection",
  "event_projection"
] as const satisfies readonly AshenReefSurveyReceiptKind[];

const SURVEY_RECEIPT_OWNERS: Record<AshenReefSurveyReceiptKind, string> = {
  time_advance: "shared_time",
  body_advance: "player_body",
  attribute_load: "player_stat_growth",
  resource_cost: "player_resources",
  skill_progress: "player_skill",
  survey_progress: "player_activity.survey",
  quest_progress_sync: "quest_journal_sync",
  survey_operation: "survey_operation",
  player_discovery: "player_discovery",
  discovery_flag: "survey_discovery_compatibility",
  codex_visibility_projection: "codex_visibility_sync",
  activity_transition: "activity_state",
  notification_projection: "survey_notification_projection",
  chronicle_projection: "survey_chronicle_projection",
  event_projection: "survey_event_projection"
};

export function createEmptyAshenReefSurveyAuthority(): AshenReefSurveyAuthorityState {
  return {
    version: 1,
    requests: [],
    occurrences: [],
    results: [],
    consequenceReceipts: [],
    projectionRepairs: [],
    corrections: []
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function surveySkillRank(
  inputs: AshenReefSurveyOwnerInputsState,
  skillId: (typeof SURVEY_RELEVANT_SKILL_IDS)[number]
): number {
  return inputs.relevantSkills.find((entry) => entry?.id === skillId)?.rank ?? 0;
}

export function resolveAshenReefSurveyMetabolicProfile(
  inputs: AshenReefSurveyOwnerInputsState
): ActionMetabolicProfileState {
  const attributeAverage =
    (inputs.attributes.AGI + inputs.attributes.WIS + inputs.attributes.INT) / 3;
  const skillAverage =
    SURVEY_RELEVANT_SKILL_IDS.reduce(
      (total, skillId) => total + surveySkillRank(inputs, skillId),
      0
    ) / SURVEY_RELEVANT_SKILL_IDS.length;
  const attributeBonus = Math.max(0, (attributeAverage - 10) * 0.0125);
  const skillBonus = Math.max(0, skillAverage * 0.004);
  const efficiencyMitigation = clamp(attributeBonus + skillBonus, 0, 0.3);
  const tensionPerformance = applyAttributeTensionToActionProfile(
    inputs.attributes,
    { sourceTag: "survey" }
  );
  const tensionStrain = 1 / Math.max(0.5, tensionPerformance);
  return {
    ...SURVEY_SHIFT_PROFILE,
    fatigueGain: Number(
      (SURVEY_SHIFT_PROFILE.fatigueGain * (1 - efficiencyMitigation) * tensionStrain).toFixed(3)
    ),
    energyDemand: Number(
      (SURVEY_SHIFT_PROFILE.energyDemand * (1 - efficiencyMitigation * 0.5) * tensionStrain).toFixed(3)
    ),
    hydrationDemand: Number(
      (SURVEY_SHIFT_PROFILE.hydrationDemand * (1 - efficiencyMitigation * 0.35) * tensionStrain).toFixed(3)
    )
  };
}

function resolveExpectedSurveyOwnerEvidence(
  characterId: string,
  stage: AshenReefSurveyAuthorityState["results"][number]["stage"],
  inputs: AshenReefSurveyOwnerInputsState
) {
  const profile = resolveAshenReefSurveyMetabolicProfile(inputs);
  let clock = clone(inputs.clock);
  let bodyState = clone(inputs.bodyState);
  let statGrowth = clone(inputs.statGrowth);
  let resources = clone(inputs.resources);
  let resourceRuntime = clone(inputs.resourceRuntime);
  const bodyTimeline: typeof inputs.bodyState[] = [];

  for (let index = 0; index < 2; index += 1) {
    clock = advanceClock(clock, 1);
    bodyState = advancePlayerBodyState(bodyState, 1, {
      day: clock.day,
      tick: clock.tick,
      lineageId: inputs.lineageId,
      runDifficulty: inputs.runDifficulty,
      metabolicProfile: profile,
      recoveryContext: null,
      recoveryAssessment: null
    });
    const statOwner = {
      attributes: clone(inputs.attributes),
      bodyState,
      coreData: { lineageId: inputs.lineageId } as SaveSnapshot["playerState"]["coreData"],
      statGrowth
    };
    applyActionAttributeLoad(
      statOwner,
      ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE,
      1,
      clock.day,
      inputs.runDifficulty
    );
    syncPlayerStatGrowth(statOwner, clock.day);
    statGrowth = statOwner.statGrowth;
    const bodyOwner = {
      bodyState,
      coreData: { lineageId: inputs.lineageId } as SaveSnapshot["playerState"]["coreData"]
    } as SaveSnapshot["playerState"];
    syncPlayerBodyState(bodyOwner, clock.tick, clock.day, inputs.runDifficulty);
    bodyState = bodyOwner.bodyState;
    const resourceResolution = resolvePlayerResources(
      {
        playerId: characterId,
        attributes: inputs.attributes,
        resources,
        originProfile: inputs.originProfile,
        equipment: inputs.equipment,
        resourceRuntime,
        bodyState
      },
      [],
      clock.tick
    );
    resources = resourceResolution.resources;
    resourceRuntime = resourceResolution.resourceRuntime;
    bodyTimeline.push(clone(bodyState));
  }

  const resourcesAfterNatural = clone(resources);
  resources.stamina.current = clamp(
    resources.stamina.current - 10,
    0,
    resources.stamina.max
  );
  resources.mp.current = clamp(resources.mp.current - 3, 0, resources.mp.max);
  const skillId = stage === "ruins_confirmation"
    ? "skill.resource.identify.flora" as const
    : "skill.knowledge.general_lore" as const;
  const currentSkill = inputs.relevantSkills.find((entry) => entry?.id === skillId) ?? null;
  const skillPolicy = resolveSkillRankGainPolicy({
    skillId,
    currentSkill,
    rankDelta: 1,
    sourceLabel:
      stage === "ruins_confirmation"
        ? "Ashen Reef survey discovery"
        : "Ashen Reef survey sector",
    sourceType: "noncombat"
  });
  return {
    profile,
    endClock: clock,
    bodyBefore: clone(inputs.bodyState),
    bodyAfter: bodyState,
    bodyTimeline,
    statGrowthBefore: clone(inputs.statGrowth),
    statGrowthAfter: statGrowth,
    resourcesBefore: clone(inputs.resources),
    resourcesAfterNatural,
    resourcesAfter: resources,
    skill: {
      skillId,
      requestedDelta: 1 as const,
      appliedDelta: skillPolicy.appliedDelta,
      rankBefore: currentSkill?.rank ?? 0,
      rankAfter: skillPolicy.appliedRank,
      blockedGate: skillPolicy.blockedGate,
      requiredBand: skillPolicy.requiredBand
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isExactNonblank(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}

function hasUniqueStrings(values: readonly string[]): boolean {
  return values.every(isExactNonblank) && new Set(values).size === values.length;
}

function isJsonSafe(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  const valid = Array.isArray(value)
    ? value.every((entry) => isJsonSafe(entry, seen))
    : Object.entries(value).every(
        ([key, entry]) => key.length > 0 && entry !== undefined && isJsonSafe(entry, seen)
      );
  seen.delete(value);
  return valid;
}

function surveyRequestUuid(requestId: string): string | null {
  return SURVEY_REQUEST_PATTERN.test(requestId)
    ? requestId.slice(SURVEY_REQUEST_PREFIX.length)
    : null;
}

function validateSurveyMaterialFacts(value: unknown): value is AshenReefSurveyMaterialFactsState {
  if (!isRecord(value) || !Array.isArray(value.sectorFlags)) return false;
  const sectorCount = value.sectorCount;
  if (!Number.isInteger(sectorCount) || Number(sectorCount) < 0 || Number(sectorCount) > 3) {
    return false;
  }
  const expectedFlags = Array.from(
    { length: Number(sectorCount) },
    (_, index) => `${SURVEY_SECTOR_PREFIX}${index + 1}`
  );
  if (JSON.stringify(value.sectorFlags) !== JSON.stringify(expectedFlags)) return false;
  if (typeof value.ruinsConfirmed !== "boolean") return false;
  if (value.ruinsConfirmed && sectorCount !== 3) return false;
  if (value.discoveryEntryState !== "absent" && value.discoveryEntryState !== "matching") return false;
  if (typeof value.discoveryFlagPresent !== "boolean") return false;
  if ((value.discoveryEntryState === "matching") !== value.discoveryFlagPresent) return false;
  if (
    value.codexRowState !== "source_record_absent" &&
    value.codexRowState !== "locked" &&
    value.codexRowState !== "unlocked"
  ) return false;
  const expectedProgress = value.ruinsConfirmed ? 100 : Number(sectorCount) * 25;
  if (value.operationProgress !== null && value.operationProgress !== expectedProgress) return false;
  if (value.currentActivityId !== null && !isExactNonblank(value.currentActivityId)) return false;
  return true;
}

function validateSurveyOwnerInputs(value: unknown): value is AshenReefSurveyOwnerInputsState {
  if (!isRecord(value) || !isRecord(value.clock) || !isRecord(value.questPosture)) return false;
  const clock = value.clock;
  const skills = value.skills;
  const relevantSkills = value.relevantSkills;
  if (!Array.isArray(skills) || !Array.isArray(relevantSkills)) return false;
  return (
    Number.isInteger(clock.tick) && Number(clock.tick) >= 0 &&
    Number.isInteger(clock.subday) && Number(clock.subday) >= 1 &&
    Number.isInteger(clock.day) && Number(clock.day) >= 1 &&
    Number.isInteger(clock.month) && Number(clock.month) >= 1 &&
    Number.isInteger(clock.year) && Number(clock.year) >= 1 &&
    isExactNonblank(clock.season) &&
    Number.isInteger(value.totalPlayTicks) && Number(value.totalPlayTicks) >= 0 &&
    (value.lastReputationDecayDay === null ||
      (Number.isInteger(value.lastReputationDecayDay) && Number(value.lastReputationDecayDay) >= 0)) &&
    value.questPosture.category === "active" &&
    value.questPosture.tracked === true &&
    isRecord(value.runDifficulty) &&
    (value.runDifficulty.tier === "easy" ||
      value.runDifficulty.tier === "normal" ||
      value.runDifficulty.tier === "hard" ||
      value.runDifficulty.tier === "brutal") &&
    typeof value.runDifficulty.hardcore === "boolean" &&
    isExactNonblank(value.playerName) &&
    isExactNonblank(value.lineageId) &&
    isRecord(value.bodyState) &&
    isRecord(value.resources) &&
    isRecord(value.resourceRuntime) &&
    isRecord(value.attributes) &&
    isRecord(value.statGrowth) &&
    skills.every(
      (entry) => isRecord(entry) &&
        isExactNonblank(entry.id) &&
        Number.isInteger(entry.rank) &&
        Number(entry.rank) >= 0 &&
        (entry.source === "innate" || entry.source === "trained")
    ) &&
    new Set(skills.map((entry) => isRecord(entry) ? entry.id : null)).size === skills.length &&
    relevantSkills.length === 2 &&
    relevantSkills.every(
      (entry, index) => entry === null ||
        (isRecord(entry) &&
          entry.id === SURVEY_RELEVANT_SKILL_IDS[index] &&
          Number.isInteger(entry.rank) &&
          Number(entry.rank) >= 0 &&
          (entry.source === "innate" || entry.source === "trained"))
    ) &&
    relevantSkills.every(
      (entry, index) => deepEqual(
        entry,
        skills.find(
          (skill) => isRecord(skill) && skill.id === SURVEY_RELEVANT_SKILL_IDS[index]
        ) ?? null
      )
    ) &&
    isRecord(value.progression) &&
    isRecord(value.reputation) &&
    isRecord(value.originProfile) &&
    isRecord(value.equipment) &&
    (value.currentActivity === null ||
      (isRecord(value.currentActivity) && isExactNonblank(value.currentActivity.id))) &&
    (value.surveyOperation === null ||
      (isRecord(value.surveyOperation) &&
        value.surveyOperation.id === "operation.quest.ashen_reef_survey")) &&
    (value.stormglassDiscovery === null ||
      (isRecord(value.stormglassDiscovery) &&
        value.stormglassDiscovery.id === "discovery.stormglass_bloom" &&
        value.stormglassDiscovery.codexEntryId === "flora.unknown_bloom" &&
        value.stormglassDiscovery.category === "flora" &&
        value.stormglassDiscovery.title === "Stormglass Bloom" &&
        value.stormglassDiscovery.sourceType === "survey" &&
        value.stormglassDiscovery.sourceId === "quest.ashen_reef_survey")) &&
    (value.stormglassCodexEntry === null ||
      (isRecord(value.stormglassCodexEntry) &&
        value.stormglassCodexEntry.id === "flora.unknown_bloom" &&
        typeof value.stormglassCodexEntry.locked === "boolean"))
  );
}

function normalizeSurveyIntentForCanonical(
  value: AshenReefSurveyNormalizedIntentState
): AshenReefSurveyNormalizedIntentState {
  return {
    version: 1,
    intent: "advance_ashen_reef_survey_shift",
    accountId: value.accountId,
    campaignId: value.campaignId,
    sourceContinuityId: value.sourceContinuityId,
    characterId: value.characterId,
    questId: "quest.ashen_reef_survey",
    activityId: value.activityId,
    locationId: "location.ashen_reef",
    sourceArtifactId: value.sourceArtifactId,
    sourcePublicationId: value.sourcePublicationId,
    sourceRevision: value.sourceRevision,
    expectedRevision: value.expectedRevision,
    expectedTick: value.expectedTick,
    snapshotFormat: TARGET_SNAPSHOT_FORMAT,
    stage: value.stage,
    materialFacts: {
      sectorFlags: [...value.materialFacts.sectorFlags],
      sectorCount: value.materialFacts.sectorCount,
      ruinsConfirmed: value.materialFacts.ruinsConfirmed,
      discoveryEntryState: value.materialFacts.discoveryEntryState,
      discoveryFlagPresent: value.materialFacts.discoveryFlagPresent,
      codexRowState: value.materialFacts.codexRowState,
      operationProgress: value.materialFacts.operationProgress,
      currentActivityId: value.materialFacts.currentActivityId
    },
    ownerInputs: clone(value.ownerInputs),
    materialVersions: {
      resolver: 1,
      bodyBalance: value.materialVersions.bodyBalance,
      statGrowth: value.materialVersions.statGrowth,
      skillPolicy: 1,
      synchronization: 1,
      surveyContent: 1
    }
  };
}

export function serializeAshenReefSurveyNormalizedIntent(
  value: AshenReefSurveyNormalizedIntentState
): string {
  return JSON.stringify(normalizeSurveyIntentForCanonical(value));
}

function validateMaterialVersions(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.resolver === 1 &&
    Number.isInteger(value.bodyBalance) &&
    Number(value.bodyBalance) > 0 &&
    Number.isInteger(value.statGrowth) &&
    Number(value.statGrowth) > 0 &&
    value.skillPolicy === 1 &&
    value.synchronization === 1 &&
    value.surveyContent === 1
  );
}

function validateSurveyIntent(value: unknown): value is AshenReefSurveyNormalizedIntentState {
  if (!isRecord(value)) return false;
  return (
    value.version === 1 &&
    value.intent === "advance_ashen_reef_survey_shift" &&
    isExactNonblank(value.accountId) &&
    isExactNonblank(value.campaignId) &&
    isExactNonblank(value.sourceContinuityId) &&
    isExactNonblank(value.characterId) &&
    value.questId === "quest.ashen_reef_survey" &&
    (value.activityId === null || isExactNonblank(value.activityId)) &&
    value.locationId === "location.ashen_reef" &&
    isExactNonblank(value.sourceArtifactId) &&
    isExactNonblank(value.sourcePublicationId) &&
    Number.isInteger(value.sourceRevision) &&
    Number(value.sourceRevision) >= 0 &&
    Number.isInteger(value.expectedRevision) &&
    Number(value.expectedRevision) >= 0 &&
    value.expectedRevision === value.sourceRevision &&
    Number.isInteger(value.expectedTick) &&
    Number(value.expectedTick) >= 0 &&
    value.snapshotFormat === TARGET_SNAPSHOT_FORMAT &&
    (value.stage === "sector_1" || value.stage === "sector_2" || value.stage === "sector_3" || value.stage === "ruins_confirmation") &&
    validateSurveyMaterialFacts(value.materialFacts) &&
    validateSurveyOwnerInputs(value.ownerInputs) &&
    value.ownerInputs.clock.tick === value.expectedTick &&
    value.activityId === (value.ownerInputs.currentActivity?.id ?? null) &&
    value.materialFacts.currentActivityId === value.activityId &&
    value.materialFacts.operationProgress === (value.ownerInputs.surveyOperation?.progress ?? null) &&
    (value.materialFacts.discoveryEntryState === "matching") ===
      (value.ownerInputs.stormglassDiscovery !== null) &&
    value.materialFacts.codexRowState ===
      (value.ownerInputs.stormglassCodexEntry === null
        ? "source_record_absent"
        : value.ownerInputs.stormglassCodexEntry.locked === false
          ? "unlocked"
          : "locked") &&
    validateMaterialVersions(value.materialVersions) &&
    JSON.stringify(value) === serializeAshenReefSurveyNormalizedIntent(
      value as unknown as AshenReefSurveyNormalizedIntentState
    )
  );
}

function expectedSurveyStage(facts: AshenReefSurveyMaterialFactsState): string | null {
  if (facts.ruinsConfirmed) return null;
  if (facts.sectorCount === 0) return "sector_1";
  if (facts.sectorCount === 1) return "sector_2";
  if (facts.sectorCount === 2) return "sector_3";
  if (facts.sectorCount === 3) return "ruins_confirmation";
  return null;
}

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function expectedSurveyMaterialAfter(
  before: AshenReefSurveyMaterialFactsState,
  stage: AshenReefSurveyAuthorityState["results"][number]["stage"]
): AshenReefSurveyMaterialFactsState {
  if (stage === "ruins_confirmation") {
    return {
      ...clone(before),
      ruinsConfirmed: true,
      discoveryEntryState: "matching",
      discoveryFlagPresent: true,
      codexRowState:
        before.codexRowState === "source_record_absent"
          ? "source_record_absent"
          : "unlocked",
      operationProgress: 100,
      currentActivityId: "activity.return.survey_packet"
    };
  }
  const sector = stage === "sector_1" ? 1 : stage === "sector_2" ? 2 : 3;
  return {
    ...clone(before),
    sectorFlags: [...before.sectorFlags, `${SURVEY_SECTOR_PREFIX}${sector}`],
    sectorCount: sector,
    operationProgress: sector * 25
  };
}

function expectedSurveyOperation(
  request: AshenReefSurveyAuthorityState["requests"][number],
  result: AshenReefSurveyAuthorityState["results"][number]
) {
  const complete = result.stage === "ruins_confirmation";
  const sectors = result.materialAfter.sectorCount;
  return {
    id: "operation.quest.ashen_reef_survey",
    title: "Ashen Reef Survey",
    stage: complete
      ? "Chart packet ready for harbor turn-in"
      : `Survey sectors logged: ${sectors} / 3`,
    progress: complete ? 100 : sectors * 25,
    etaLabel: complete ? "Ready now" : `${Math.max(1, 4 - sectors)} shift(s)`,
    owner: request.normalizedIntent.ownerInputs.playerName,
    output: complete ? "Verified reef chart packet" : "Field chart updates",
    priority: "High"
  };
}

function formatSurveyTickTime(clock: AshenReefSurveyOwnerInputsState["clock"]): string {
  const watch = clock.subday === 1
    ? "Dawn Watch"
    : clock.subday === 2
      ? "High Sun"
      : clock.subday === 3
        ? "Dusk Watch"
        : clock.subday === 4
          ? "Night Watch"
          : "Unknown Watch";
  return `Day ${clock.day}, ${watch}`;
}

function expectedSurveyProjectionFacts(
  request: AshenReefSurveyAuthorityState["requests"][number],
  result: AshenReefSurveyAuthorityState["results"][number],
  projectionPending: boolean
) {
  const endClock = advanceClock(request.normalizedIntent.ownerInputs.clock, 2);
  const timeLabel = formatSurveyTickTime(endClock);
  const skillLabel = result.stage === "ruins_confirmation" ? "Survival" : "Navigation";
  const skillEffect = result.skill.appliedDelta > 0
    ? `${skillLabel} +${result.skill.appliedDelta}`
    : result.skill.blockedGate !== null
      ? `${skillLabel} progress requires a breakthrough`
      : `${skillLabel} unchanged`;
  const sector = result.stage === "sector_1"
    ? 1
    : result.stage === "sector_2"
      ? 2
      : result.stage === "sector_3"
        ? 3
        : null;
  const notification = sector === null
    ? {
        id: result.projectionIds.notification,
        title: "Survey packet complete",
        detail: "All sectors and ruin markers are logged. Return to Saltmere for payment and codex credit.",
        timeLabel,
        tone: "accent"
      }
    : {
        id: result.projectionIds.notification,
        title: "Survey sector logged",
        detail: `Ashen Reef sector ${sector} is now charted and filed into the packet.`,
        timeLabel,
        tone: "success"
      };
  const chronicle = sector === null
    ? {
        id: result.projectionIds.chronicle,
        category: "discovery",
        title: "Ashen Reef survey packet completed",
        timeLabel,
        summary: "The crew verified the ruin markers and logged a new flora sample for the reef archive.",
        statusLabel: "Packet complete",
        entities: [request.normalizedIntent.ownerInputs.playerName, "Ashen Reef", "Stormglass Bloom"],
        results: ["Chart packet finalized", "New discovery recorded"],
        statChanges: [skillEffect, "Stamina -10", "MP -3"],
        tags: ["Exploration", "Discovery", "Survey"]
      }
    : {
        id: result.projectionIds.chronicle,
        category: "discovery",
        title: `Survey sector ${sector} logged at Ashen Reef`,
        timeLabel,
        summary: "The crew marked channels, breakers, and draft-safe approaches for the charter packet.",
        statusLabel: `Sector ${sector} / 3`,
        entities: [request.normalizedIntent.ownerInputs.playerName, "Ashen Reef"],
        results: ["Survey packet expanded"],
        statChanges: [skillEffect, "Stamina -10", "MP -3"],
        tags: ["Exploration", "Survey"]
      };
  const notice = sector === null
    ? {
        tone: "accent",
        title: "Survey Packet Ready",
        detail: "Return to Saltmere Harbor Office to turn in the completed chart packet."
      }
    : {
        tone: "success",
        title: "Survey Progress",
        detail: `Ashen Reef sector ${sector} is now charted.`
      };
  return {
    notification,
    chronicle,
    notice,
    eventPayload: {
      requestId: result.requestId,
      occurrenceId: result.occurrenceId,
      resultId: result.resultId,
      playerId: result.characterId,
      questId: "quest.ashen_reef_survey",
      stage: result.stage,
      resultCode: result.code,
      projectionPending
    }
  };
}

function expectedSurveyDiscovery(
  request: AshenReefSurveyAuthorityState["requests"][number],
  result: AshenReefSurveyAuthorityState["results"][number]
) {
  const retained = request.normalizedIntent.ownerInputs.stormglassDiscovery;
  if (retained) return clone(retained);
  const endClock = advanceClock(request.normalizedIntent.ownerInputs.clock, 2);
  return {
    id: "discovery.stormglass_bloom",
    codexEntryId: "flora.unknown_bloom",
    category: "flora",
    title: "Stormglass Bloom",
    discoveredAtTick: result.appliedTick,
    discoveredAtLabel: formatSurveyTickTime(endClock),
    regionLabel: "Glasswater",
    sourceType: "survey",
    sourceId: "quest.ashen_reef_survey",
    notes: [
      "Logged during the Ashen Reef survey while the crew marked ruin shelves.",
      "The petals refract storm light and dry into brittle crystalline veins."
    ]
  };
}

function validateResultTransition(
  result: AshenReefSurveyAuthorityState["results"][number],
  request: AshenReefSurveyAuthorityState["requests"][number]
): boolean {
  if (!validateSurveyMaterialFacts(result.materialBefore) || !validateSurveyMaterialFacts(result.materialAfter)) {
    return false;
  }
  if (expectedSurveyStage(result.materialBefore) !== result.stage) return false;
  if (!deepEqual(result.materialAfter, expectedSurveyMaterialAfter(result.materialBefore, result.stage))) {
    return false;
  }
  const expectedOwner = resolveExpectedSurveyOwnerEvidence(
    result.characterId,
    result.stage,
    request.normalizedIntent.ownerInputs
  );
  const expectedCurrentActivity = result.stage === "ruins_confirmation"
    ? {
        id: "activity.return.survey_packet",
        label: "Returning Chart Packet",
        category: "Contract",
        detail: "The field chart is complete and ready to be taken back to Saltmere Harbor Office."
      }
    : request.normalizedIntent.ownerInputs.currentActivity;
  const expectedDiscoveryOutcome = result.stage !== "ruins_confirmation"
    ? "not_applicable"
    : request.normalizedIntent.ownerInputs.stormglassDiscovery
      ? "retained_existing"
      : "created";
  const expectedCodexOutcome = result.stage !== "ruins_confirmation"
    ? "not_applicable"
    : result.materialBefore.codexRowState === "source_record_absent"
      ? "source_record_absent"
      : result.materialBefore.codexRowState === "unlocked"
        ? "already_unlocked"
        : "unlocked_existing";
  return (
    result.code === (result.stage === "ruins_confirmation" ? "survey_packet_completed" : "survey_sector_logged") &&
    deepEqual(result.resourceCosts, { stamina: 10, mp: 3, hp: 0 }) &&
    deepEqual(result.skill, {
      skillId: expectedOwner.skill.skillId,
      requestedDelta: 1,
      appliedDelta: expectedOwner.skill.appliedDelta,
      blockedGate: expectedOwner.skill.blockedGate,
      requiredBand: expectedOwner.skill.requiredBand
    }) &&
    result.discoveryOutcome === expectedDiscoveryOutcome &&
    result.codexOutcome === expectedCodexOutcome &&
    deepEqual(result.operation, expectedSurveyOperation(request, result)) &&
    deepEqual(result.currentActivityOutcome, expectedCurrentActivity) &&
    deepEqual(result.notice, expectedSurveyProjectionFacts(request, result, false).notice)
  );
}

function validateReceiptEffect(
  receipt: AshenReefSurveyAuthorityState["consequenceReceipts"][number],
  result: AshenReefSurveyAuthorityState["results"][number],
  request: AshenReefSurveyAuthorityState["requests"][number],
  projectionPending: boolean
): boolean {
  if (!isRecord(receipt.effect) || !isJsonSafe(receipt.effect)) return false;
  const inputs = request.normalizedIntent.ownerInputs;
  const expectedOwner = resolveExpectedSurveyOwnerEvidence(result.characterId, result.stage, inputs);
  const projections = expectedSurveyProjectionFacts(request, result, projectionPending);
  switch (receipt.kind) {
    case "time_advance":
      return deepEqual(receipt.effect.startClock, inputs.clock) &&
        deepEqual(receipt.effect.endClock, expectedOwner.endClock) &&
        receipt.effect.tickCount === 2 &&
        receipt.effect.totalPlayTicksBefore === inputs.totalPlayTicks &&
        receipt.effect.totalPlayTicksAfter === inputs.totalPlayTicks + 2;
    case "body_advance":
      return deepEqual(receipt.effect.profile, expectedOwner.profile) &&
        deepEqual(receipt.effect.before, expectedOwner.bodyBefore) &&
        deepEqual(receipt.effect.after, expectedOwner.bodyAfter) &&
        deepEqual(receipt.effect.timeline, expectedOwner.bodyTimeline);
    case "attribute_load":
      return receipt.effect.applications === 2 &&
        deepEqual(receipt.effect.profile, ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE) &&
        deepEqual(receipt.effect.before, expectedOwner.statGrowthBefore) &&
        deepEqual(receipt.effect.after, expectedOwner.statGrowthAfter);
    case "resource_cost":
      return receipt.effect.explicitStaminaCost === 10 &&
        receipt.effect.explicitMpCost === 3 &&
        deepEqual(receipt.effect.before, expectedOwner.resourcesBefore) &&
        deepEqual(receipt.effect.afterNaturalResolution, expectedOwner.resourcesAfterNatural) &&
        deepEqual(receipt.effect.after, expectedOwner.resourcesAfter);
    case "skill_progress":
      return deepEqual(receipt.effect, expectedOwner.skill) &&
        (receipt.posture === "blocked_at_gate"
          ? expectedOwner.skill.appliedDelta === 0 && expectedOwner.skill.blockedGate !== null
          : receipt.posture === "applied" && expectedOwner.skill.blockedGate === null);
    case "survey_progress":
      return deepEqual(receipt.effect.before, result.materialBefore) &&
        deepEqual(receipt.effect.after, result.materialAfter);
    case "quest_progress_sync": {
      const sectors = result.materialAfter.sectorCount;
      const ruins = result.materialAfter.ruinsConfirmed;
      return deepEqual(receipt.effect, {
        questId: "quest.ashen_reef_survey",
        category: "active",
        tracked: true,
        statusLabel: "Tracked",
        objectives: [
          `Survey reef lanes: ${sectors} / 3 sectors complete`,
          `Confirm ruin markers: ${ruins ? "complete" : "pending"}`,
          "Return chart packet to Saltmere Harbor Office"
        ]
      });
    }
    case "survey_operation":
      return deepEqual(receipt.effect.before, inputs.surveyOperation) &&
        deepEqual(receipt.effect.after, expectedSurveyOperation(request, result));
    case "player_discovery":
      return result.stage === "ruins_confirmation" &&
        deepEqual(receipt.effect.before, inputs.stormglassDiscovery) &&
        deepEqual(receipt.effect.after, expectedSurveyDiscovery(request, result));
    case "discovery_flag":
      return result.stage === "ruins_confirmation" &&
        deepEqual(receipt.effect, {
          before: result.materialBefore.discoveryFlagPresent,
          after: true
        });
    case "codex_visibility_projection":
      return result.stage === "ruins_confirmation" &&
        deepEqual(receipt.effect, {
          codexEntryId: "flora.unknown_bloom",
          outcome: result.codexOutcome
        });
    case "activity_transition":
      return result.stage === "ruins_confirmation" &&
        deepEqual(receipt.effect.before, inputs.currentActivity) &&
        deepEqual(receipt.effect.after, result.currentActivityOutcome);
    case "notification_projection":
      return receipt.effect.cap === 8 &&
        receipt.effect.projectionId === result.projectionIds.notification &&
        deepEqual(receipt.effect.row, projections.notification);
    case "chronicle_projection":
      return receipt.effect.cap === 48 &&
        receipt.effect.projectionId === result.projectionIds.chronicle &&
        deepEqual(receipt.effect.row, projections.chronicle);
    case "event_projection":
      return receipt.effect.projectionId === result.projectionIds.event &&
        receipt.effect.eventType === "player.activity.survey.advanced" &&
        deepEqual(receipt.effect.payload, projections.eventPayload);
  }
}

function requiresSurveyLegacyBaseline(facts: AshenReefSurveyMaterialFactsState): boolean {
  return facts.sectorCount > 0 ||
    facts.ruinsConfirmed ||
    facts.discoveryEntryState === "matching" ||
    facts.discoveryFlagPresent ||
    facts.operationProgress !== null;
}

function isSequentialSurveyHistory(
  prior: AshenReefSurveyMaterialFactsState,
  next: AshenReefSurveyMaterialFactsState
): boolean {
  return deepEqual(prior.sectorFlags, next.sectorFlags) &&
    prior.sectorCount === next.sectorCount &&
    prior.ruinsConfirmed === next.ruinsConfirmed &&
    prior.discoveryEntryState === next.discoveryEntryState &&
    prior.discoveryFlagPresent === next.discoveryFlagPresent &&
    prior.operationProgress === next.operationProgress;
}

function validateAshenReefSurveyAuthorityUnsafe(snapshot: SaveSnapshot): boolean {
  const authority = snapshot.authorityLedger?.ashenReefSurvey;
  if (authority === undefined) return true;
  if (!isJsonSafe(authority)) return false;
  if (
    authority.version !== 1 ||
    !Array.isArray(authority.requests) ||
    !Array.isArray(authority.occurrences) ||
    !Array.isArray(authority.results) ||
    !Array.isArray(authority.consequenceReceipts) ||
    !Array.isArray(authority.projectionRepairs) ||
    !Array.isArray(authority.corrections)
  ) return false;

  const identity = snapshot.campaignIdentity;
  if (!identity) return false;
  const parentByChild = new Map<string, string>();
  const forkByChild = new Map<
    string,
    NonNullable<SaveSnapshot["authorityLedger"]>["entries"][number]
  >();
  for (const entry of snapshot.authorityLedger?.entries ?? []) {
    if (entry.kind !== "continuity_fork") continue;
    if (
      !isExactNonblank(entry.parentContinuityId) ||
      !isExactNonblank(entry.childContinuityId) ||
      entry.parentContinuityId === entry.childContinuityId ||
      parentByChild.has(entry.childContinuityId)
    ) return false;
    parentByChild.set(entry.childContinuityId, entry.parentContinuityId);
    forkByChild.set(entry.childContinuityId, entry);
  }
  if (identity.parentContinuityId) {
    if (
      !isExactNonblank(identity.parentContinuityId) ||
      identity.parentContinuityId === identity.continuityId ||
      (parentByChild.has(identity.continuityId) &&
        parentByChild.get(identity.continuityId) !== identity.parentContinuityId)
    ) return false;
    parentByChild.set(identity.continuityId, identity.parentContinuityId);
  }
  const reachableContinuities = new Set<string>();
  let continuityCursor: string | undefined = identity.continuityId;
  while (continuityCursor !== undefined) {
    if (reachableContinuities.has(continuityCursor)) return false;
    reachableContinuities.add(continuityCursor);
    continuityCursor = parentByChild.get(continuityCursor);
  }

  if (authority.legacyBaseline !== undefined) {
    const baseline = authority.legacyBaseline;
    if (
      baseline.version !== 1 ||
      baseline.baselineId !== `survey_legacy_baseline.${baseline.continuityId}` ||
      baseline.accountId !== snapshot.accountId ||
      baseline.campaignId !== identity.campaignId ||
      baseline.characterId !== identity.characterId ||
      !reachableContinuities.has(baseline.continuityId) ||
      !isExactNonblank(baseline.sourceArtifactId) ||
      !isExactNonblank(baseline.sourcePublicationId) ||
      !Number.isInteger(baseline.sourceRevision) ||
      baseline.sourceRevision < 0 ||
      !Number.isInteger(baseline.observedAtTick) ||
      baseline.observedAtTick < 0 ||
      !validateSurveyMaterialFacts(baseline.materialFacts)
    ) return false;
  }

  const requestIds = authority.requests.map((entry) => entry.requestId);
  const occurrenceIds = authority.occurrences.map((entry) => entry.occurrenceId);
  const resultIds = authority.results.map((entry) => entry.resultId);
  const receiptIds = authority.consequenceReceipts.map((entry) => entry.receiptId);
  const repairIds = authority.projectionRepairs.map((entry) => entry.repairId);
  const correctionIds = authority.corrections.map((entry) => entry.correctionId);
  if (
    !hasUniqueStrings(requestIds) ||
    !hasUniqueStrings(occurrenceIds) ||
    !hasUniqueStrings(resultIds) ||
    !hasUniqueStrings(receiptIds) ||
    !hasUniqueStrings(repairIds) ||
    !hasUniqueStrings(correctionIds)
  ) return false;
  if (
    requestIds.length !== occurrenceIds.length ||
    requestIds.length !== resultIds.length
  ) return false;
  if (authority.legacyBaseline !== undefined && requestIds.length === 0) return false;

  let priorFacts: AshenReefSurveyMaterialFactsState | null = null;
  for (let index = 0; index < authority.requests.length; index += 1) {
    const request = authority.requests[index]!;
    const occurrence = authority.occurrences[index]!;
    const result = authority.results[index]!;
    const uuid = surveyRequestUuid(request.requestId);
    if (!uuid || request.version !== 1 || request.normalizationVersion !== 1 || request.posture !== "admitted") return false;
    if (!validateSurveyIntent(request.normalizedIntent)) return false;
    if (request.canonicalIntent !== serializeAshenReefSurveyNormalizedIntent(request.normalizedIntent)) return false;
    if (index === 0) {
      const baselineRequired = requiresSurveyLegacyBaseline(request.normalizedIntent.materialFacts);
      if (baselineRequired !== (authority.legacyBaseline !== undefined)) return false;
      if (authority.legacyBaseline) {
        const baseline = authority.legacyBaseline;
        if (
          baseline.continuityId !== request.normalizedIntent.sourceContinuityId ||
          baseline.sourceArtifactId !== request.normalizedIntent.sourceArtifactId ||
          baseline.sourcePublicationId !== request.normalizedIntent.sourcePublicationId ||
          baseline.sourceRevision !== request.normalizedIntent.sourceRevision ||
          baseline.observedAtTick !== request.normalizedIntent.expectedTick ||
          !deepEqual(baseline.materialFacts, request.normalizedIntent.materialFacts)
        ) return false;
      }
    }
    if (
      request.normalizedIntent.accountId !== snapshot.accountId ||
      request.normalizedIntent.campaignId !== identity.campaignId ||
      request.normalizedIntent.characterId !== identity.characterId ||
      request.acceptedContinuityId !== occurrence.continuityId ||
      !reachableContinuities.has(request.normalizedIntent.sourceContinuityId) ||
      !reachableContinuities.has(request.acceptedContinuityId) ||
      (request.normalizedIntent.sourceContinuityId !== request.acceptedContinuityId &&
        (
          parentByChild.get(request.acceptedContinuityId) !== request.normalizedIntent.sourceContinuityId ||
          forkByChild.get(request.acceptedContinuityId)?.sourceId !== request.requestId ||
          forkByChild.get(request.acceptedContinuityId)?.forkedFromArtifactId !==
            request.normalizedIntent.sourceArtifactId ||
          forkByChild.get(request.acceptedContinuityId)?.forkedFromPublicationId !==
            request.normalizedIntent.sourcePublicationId
        )) ||
      request.occurrenceId !== `survey_occurrence.${uuid}` ||
      occurrence.occurrenceId !== request.occurrenceId ||
      occurrence.requestId !== request.requestId ||
      occurrence.version !== 1 ||
      occurrence.accountId !== snapshot.accountId ||
      occurrence.campaignId !== identity.campaignId ||
      occurrence.characterId !== identity.characterId ||
      occurrence.stage !== request.normalizedIntent.stage ||
      occurrence.acceptedStartTick !== request.normalizedIntent.expectedTick ||
      occurrence.sourceArtifactId !== request.normalizedIntent.sourceArtifactId ||
      occurrence.sourcePublicationId !== request.normalizedIntent.sourcePublicationId ||
      occurrence.sourceRevision !== request.normalizedIntent.sourceRevision ||
      JSON.stringify(occurrence.materialVersions) !== JSON.stringify(request.normalizedIntent.materialVersions)
    ) return false;
    if (
      result.version !== 1 ||
      result.resultId !== `survey_result.${uuid}` ||
      result.requestId !== request.requestId ||
      result.occurrenceId !== occurrence.occurrenceId ||
      result.accountId !== snapshot.accountId ||
      result.campaignId !== identity.campaignId ||
      result.continuityId !== occurrence.continuityId ||
      result.characterId !== identity.characterId ||
      result.questId !== "quest.ashen_reef_survey" ||
      result.stage !== occurrence.stage ||
      result.startTick !== occurrence.acceptedStartTick ||
      result.appliedTick !== result.startTick + 2 ||
      result.tickCount !== 2 ||
      result.projectionIds.event !== `event.player.activity.survey.${uuid}` ||
      result.projectionIds.notification !== `notification.survey.${uuid}` ||
      result.projectionIds.chronicle !== `chronicle.survey.${uuid}` ||
      result.synchronizationVersion !== 1 ||
      result.synchronizationPostcondition !== "coherent" ||
      !isExactNonblank(result.notice.title) ||
      !isExactNonblank(result.notice.detail) ||
      !Number.isInteger(result.skill.appliedDelta) ||
      result.skill.appliedDelta < 0 ||
      result.skill.appliedDelta > 1 ||
      result.skill.requestedDelta !== 1 ||
      !validateResultTransition(result, request) ||
      JSON.stringify(result.materialBefore) !== JSON.stringify(request.normalizedIntent.materialFacts) ||
      (priorFacts !== null && !isSequentialSurveyHistory(priorFacts, result.materialBefore))
    ) return false;

    const expectedKinds = result.stage === "ruins_confirmation"
      ? ASHEN_REEF_SURVEY_FINAL_RECEIPT_KINDS
      : ASHEN_REEF_SURVEY_COMMON_RECEIPT_KINDS;
    const expectedIds = expectedKinds.map((kind) => `survey_consequence.${uuid}.${kind}`);
    if (JSON.stringify(result.requiredReceiptIds) !== JSON.stringify(expectedIds)) return false;
    const receipts = authority.consequenceReceipts.filter((entry) => entry.resultId === result.resultId);
    if (receipts.length !== expectedKinds.length) return false;
    const projectionPending = receipts.some((entry) => entry.posture === "projection_pending");
    for (let receiptIndex = 0; receiptIndex < expectedKinds.length; receiptIndex += 1) {
      const kind = expectedKinds[receiptIndex]!;
      const receipt = receipts[receiptIndex]!;
      if (
        receipt.receiptId !== expectedIds[receiptIndex] ||
        receipt.kind !== kind ||
        receipt.owner !== SURVEY_RECEIPT_OWNERS[kind] ||
        receipt.version !== 1 ||
        receipt.requestId !== request.requestId ||
        receipt.occurrenceId !== occurrence.occurrenceId ||
        receipt.resultId !== result.resultId ||
        receipt.accountId !== snapshot.accountId ||
        receipt.campaignId !== identity.campaignId ||
        receipt.continuityId !== occurrence.continuityId ||
        receipt.characterId !== identity.characterId ||
        receipt.sourceRevision !== request.normalizedIntent.sourceRevision ||
        receipt.stage !== result.stage ||
        receipt.appliedTick !== result.appliedTick ||
        (receipt.posture !== "applied" &&
          receipt.posture !== "blocked_at_gate" &&
          receipt.posture !== "projection_pending") ||
        (receipt.posture === "blocked_at_gate" && receipt.kind !== "skill_progress") ||
        (receipt.posture === "projection_pending" &&
          receipt.kind !== "notification_projection" &&
          receipt.kind !== "chronicle_projection" &&
          receipt.kind !== "event_projection") ||
        !validateReceiptEffect(receipt, result, request, projectionPending)
      ) return false;
    }
    priorFacts = result.materialAfter;
  }
  const canonicalReceiptIds = authority.results.flatMap((result) => result.requiredReceiptIds);
  if (JSON.stringify(receiptIds) !== JSON.stringify(canonicalReceiptIds)) return false;
  const receiptTuples = authority.consequenceReceipts.map(
    (entry) => `${entry.resultId}|${entry.owner}|${entry.kind}`
  );
  if (new Set(receiptTuples).size !== receiptTuples.length) return false;

  const repairOrdinals = new Map<string, number>();
  const terminalRepairs = new Set<string>();
  for (const repair of authority.projectionRepairs) {
    const result = authority.results.find((entry) => entry.resultId === repair.resultId);
    const receipt = authority.consequenceReceipts.find((entry) => entry.receiptId === repair.receiptId);
    if (!result || !receipt || repair.version !== 1) return false;
    const uuid = surveyRequestUuid(result.requestId);
    const expectedKind = `${repair.projectionKind}_projection`;
    const ordinalKey = `${repair.resultId}|${repair.projectionKind}`;
    const expectedOrdinal = (repairOrdinals.get(ordinalKey) ?? 0) + 1;
    if (
      !uuid ||
      repair.requestId !== result.requestId ||
      receipt.resultId !== result.resultId ||
      receipt.kind !== expectedKind ||
      repair.campaignId !== identity.campaignId ||
      !reachableContinuities.has(repair.continuityId) ||
      repair.characterId !== identity.characterId ||
      terminalRepairs.has(ordinalKey) ||
      repair.ordinal !== expectedOrdinal ||
      repair.repairId !== `survey_projection_repair.${uuid}.${repair.projectionKind}.${repair.ordinal}` ||
      (repair.observed !== "missing" && repair.observed !== "malformed") ||
      (repair.outcome !== "inserted" && repair.outcome !== "replaced" && repair.outcome !== "retention_expired" && repair.outcome !== "event_reemitted") ||
      (repair.projectionKind === "event" &&
        (receipt.posture !== "projection_pending" ||
          repair.observed !== "missing" ||
          repair.outcome !== "event_reemitted")) ||
      (repair.projectionKind !== "event" && repair.outcome === "event_reemitted") ||
      (repair.outcome === "replaced" && repair.observed !== "malformed") ||
      ((repair.outcome === "inserted" || repair.outcome === "retention_expired") &&
        repair.observed !== "missing") ||
      !Number.isInteger(repair.appliedTick) ||
      repair.appliedTick < result.appliedTick
    ) return false;
    repairOrdinals.set(ordinalKey, expectedOrdinal);
    if (repair.outcome === "event_reemitted" || repair.outcome === "retention_expired") {
      terminalRepairs.add(ordinalKey);
    }
  }

  const correctionEdges = new Map<string, string>();
  const correctedResultIds = new Set<string>();
  let priorCorrectionKey = "";
  for (const correction of authority.corrections) {
    const correctionKey = `${String(correction.createdAtTick).padStart(16, "0")}|${correction.correctionId}`;
    if (
      correction.version !== 1 ||
      !SURVEY_CORRECTION_PATTERN.test(correction.correctionId) ||
      correction.campaignId !== identity.campaignId ||
      !reachableContinuities.has(correction.continuityId) ||
      correction.characterId !== identity.characterId ||
      !resultIds.includes(correction.supersededResultId) ||
      (correction.replacementResultId !== null && !resultIds.includes(correction.replacementResultId)) ||
      correction.replacementResultId === correction.supersededResultId ||
      !isExactNonblank(correction.reason) ||
      !hasUniqueStrings(correction.evidenceIds) ||
      !Number.isInteger(correction.createdAtTick) ||
      correction.createdAtTick < 0 ||
      !Array.isArray(correction.reconciliations) ||
      correction.reconciliations.length === 0 ||
      correctedResultIds.has(correction.supersededResultId) ||
      priorCorrectionKey > correctionKey
    ) return false;
    correctedResultIds.add(correction.supersededResultId);
    priorCorrectionKey = correctionKey;
    const reconciliationTuples = correction.reconciliations.map((entry) => `${entry.owner}|${entry.kind}`);
    if (new Set(reconciliationTuples).size !== reconciliationTuples.length) return false;
    const supersededReceipts = authority.consequenceReceipts.filter(
      (entry) => entry.resultId === correction.supersededResultId
    );
    const supersededTuples = supersededReceipts.map((entry) => `${entry.owner}|${entry.kind}`);
    if (
      !deepEqual(reconciliationTuples, supersededTuples) ||
      correction.reconciliations.some(
        (entry) =>
          !supersededReceipts.some(
            (receipt) => receipt.owner === entry.owner && receipt.kind === entry.kind
          ) ||
          (entry.status !== "pending" && entry.status !== "confirmed_no_change" && entry.status !== "superseded") ||
          (entry.evidenceId !== undefined && !isExactNonblank(entry.evidenceId))
      )
    ) return false;
    if (correction.replacementResultId !== null) {
      if (correctionEdges.has(correction.supersededResultId)) return false;
      correctionEdges.set(correction.supersededResultId, correction.replacementResultId);
    }
  }
  for (const start of correctionEdges.keys()) {
    const seen = new Set<string>();
    let cursor: string | undefined = start;
    while (cursor !== undefined) {
      if (seen.has(cursor)) return false;
      seen.add(cursor);
      cursor = correctionEdges.get(cursor);
    }
  }

  const liveFlags = snapshot.sessionState.flags.filter((entry) => entry.startsWith(SURVEY_SECTOR_PREFIX));
  if (new Set(liveFlags).size !== liveFlags.length) return false;
  const latest = authority.results[authority.results.length - 1];
  if (latest) {
    const ruinsFlags = snapshot.sessionState.flags.filter(
      (entry) => entry === "gameplay.quest.ashen_reef_survey.ruins_confirmed"
    );
    const discoveryFlags = snapshot.sessionState.flags.filter(
      (entry) => entry === "gameplay.discovery.stormglass_bloom"
    );
    const ruins = ruinsFlags.length === 1;
    const discoveryFlag = discoveryFlags.length === 1;
    const matchingDiscoveries = snapshot.playerState.discoveryChronicle.entries.filter(
      (entry) => entry.id === "discovery.stormglass_bloom"
    );
    if (
      JSON.stringify(liveFlags) !== JSON.stringify(latest.materialAfter.sectorFlags) ||
      ruinsFlags.length > 1 ||
      discoveryFlags.length > 1 ||
      ruins !== latest.materialAfter.ruinsConfirmed ||
      discoveryFlag !== latest.materialAfter.discoveryFlagPresent ||
      matchingDiscoveries.length !== (latest.materialAfter.discoveryEntryState === "matching" ? 1 : 0) ||
      matchingDiscoveries.some(
        (entry) =>
          entry.codexEntryId !== "flora.unknown_bloom" ||
          entry.category !== "flora" ||
          entry.title !== "Stormglass Bloom" ||
          entry.sourceType !== "survey" ||
          entry.sourceId !== "quest.ashen_reef_survey"
      )
    ) return false;
  }
  return true;
}

function validateAshenReefSurveyAuthority(snapshot: SaveSnapshot): boolean {
  try {
    return validateAshenReefSurveyAuthorityUnsafe(snapshot);
  } catch {
    return false;
  }
}

export function createAuthorityId(scope: string): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  if (typeof randomUUID !== "function") {
    throw new Error(`Cannot create ${scope}: crypto.randomUUID() is unavailable.`);
  }

  return `${scope}.${randomUUID.call(globalThis.crypto)}`;
}

export function mapLegacyDifficulty(
  value: RunDifficultyState | null | undefined
): CampaignRulesState["difficultyPreset"] {
  switch (value?.tier) {
    case "easy":
      return "favored";
    case "hard":
    case "brutal":
      return "forsaken";
    case "normal":
    default:
      return "mortal";
  }
}

export function createCampaignRules(params: {
  source: CampaignRulesState["source"];
  legacyDifficulty?: RunDifficultyState | null;
  recordedAt?: string;
}): CampaignRulesState {
  const legacyDifficulty = params.legacyDifficulty ?? null;
  const difficultyPreset = mapLegacyDifficulty(legacyDifficulty);

  return {
    version: CAMPAIGN_RULES_VERSION,
    policyRevision: STAKES_POLICY_REVISION,
    difficultyPreset,
    worldRules: "heroic_world",
    stakesRules: "normal_stakes",
    source: params.source,
    overrides:
      legacyDifficulty?.tier === "brutal"
        ? [
            {
              owner: "difficulty",
              key: "legacy_brutal",
              value: true,
              source:
                params.source === "developer_fixture"
                  ? "developer_fixture"
                  : "legacy_migration",
              basePreset: "forsaken",
              rulesVersion: CAMPAIGN_RULES_VERSION
            }
          ]
        : [],
    ...(params.source === "legacy_migration"
      ? {
          migration: {
            source: "legacy_v6" as const,
            sourceDifficulty:
              legacyDifficulty?.tier ?? "missing_or_invalid",
            legacyHardcore: legacyDifficulty?.hardcore === true,
            migratedAt: params.recordedAt ?? new Date().toISOString(),
            targetRulesVersion: CAMPAIGN_RULES_VERSION
          }
        }
      : {})
  };
}

export function createCampaignIdentity(
  characterId: string
): CampaignIdentityState {
  return {
    campaignId: createAuthorityId("campaign"),
    continuityId: createAuthorityId("continuity"),
    characterId
  };
}

export function initializeTargetCampaignSnapshot(
  snapshot: SaveSnapshot,
  params: {
    source: CampaignRulesState["source"];
    identity?: CampaignIdentityState;
    recordedAt?: string;
  }
): SaveSnapshot {
  const identity =
    params.identity ?? createCampaignIdentity(snapshot.playerState.playerId);

  return {
    ...snapshot,
    snapshotVersion: TARGET_SNAPSHOT_FORMAT,
    campaignRules: createCampaignRules({
      source: params.source,
      legacyDifficulty: snapshot.gameState.runDifficulty,
      ...(params.recordedAt ? { recordedAt: params.recordedAt } : {})
    }),
    campaignIdentity: identity,
    authorityLedger: snapshot.authorityLedger
      ? {
          ...snapshot.authorityLedger,
          ashenReefSurvey:
            snapshot.authorityLedger.ashenReefSurvey ??
            createEmptyAshenReefSurveyAuthority()
        }
      : {
          version: 1,
          entries: [],
          ashenReefSurvey: createEmptyAshenReefSurveyAuthority()
        },
    normalDefeatReceipts: snapshot.normalDefeatReceipts ?? []
  };
}

export function isTargetCampaignSnapshot(
  snapshot: SaveSnapshot
): boolean {
  const rules = snapshot.campaignRules;
  return (
    snapshot.snapshotVersion === TARGET_SNAPSHOT_FORMAT &&
    rules?.version === CAMPAIGN_RULES_VERSION &&
    rules.policyRevision === STAKES_POLICY_REVISION &&
    (rules.difficultyPreset === "favored" ||
      rules.difficultyPreset === "mortal" ||
      rules.difficultyPreset === "forsaken") &&
    rules.worldRules === "heroic_world" &&
    rules.stakesRules === "normal_stakes" &&
    (rules.source === "new_campaign" ||
      rules.source === "legacy_migration" ||
      rules.source === "developer_fixture") &&
    Array.isArray(rules.overrides) &&
    rules.overrides.every(
      (override) =>
        override.owner === "difficulty" &&
        override.key === "legacy_brutal" &&
        override.value === true &&
        (override.source === "legacy_migration" ||
          override.source === "developer_fixture") &&
        override.basePreset === "forsaken" &&
        override.rulesVersion === CAMPAIGN_RULES_VERSION
    ) &&
    (rules.source !== "legacy_migration" ||
      (rules.migration?.source === "legacy_v6" &&
        rules.migration.targetRulesVersion ===
          CAMPAIGN_RULES_VERSION &&
        typeof rules.migration.legacyHardcore === "boolean" &&
        typeof rules.migration.migratedAt === "string")) &&
    snapshot.campaignIdentity?.characterId === snapshot.playerState.playerId &&
    snapshot.campaignIdentity.campaignId.length > 0 &&
    snapshot.campaignIdentity.continuityId.length > 0 &&
    snapshot.authorityLedger?.version === 1 &&
    Array.isArray(snapshot.authorityLedger.entries) &&
    Array.isArray(snapshot.normalDefeatReceipts) &&
    validateAshenReefSurveyAuthority(snapshot)
  );
}
