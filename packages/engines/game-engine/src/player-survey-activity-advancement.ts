import { EVENT_TYPES } from "../../../shared/events/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import type {
  ActionAttributeLoadProfileState,
  ActionMetabolicProfileState,
  AshenReefSurveyAuthorityState,
  AshenReefSurveyConsequenceReceiptState,
  AshenReefSurveyMaterialFactsState,
  AshenReefSurveyMaterialVersionsState,
  AshenReefSurveyNormalizedIntentState,
  AshenReefSurveyOwnerInputsState,
  AshenReefSurveyProjectionKind,
  AshenReefSurveyProjectionRepairState,
  AshenReefSurveyReceiptKind,
  AshenReefSurveyResultState,
  AshenReefSurveyStage,
  ChronicleEventState,
  CurrentActivityState,
  GameEventEnvelope,
  NotificationState,
  OperationState,
  PlayerBodyState,
  PlayerSkillState,
  SaveSnapshot,
  UiTone
} from "../../../shared/types/src/index.js";
import {
  applyActionAttributeLoad,
  advancePlayerBodyState,
  loadBodyStateBalanceRule,
  loadStatGrowthBalanceRule,
  resolveSkillRankGainPolicy,
  syncPlayerRuntimeState
} from "../../player-engine/src/index.js";
import {
  ASHEN_REEF_SURVEY_COMMON_RECEIPT_KINDS,
  ASHEN_REEF_SURVEY_FINAL_RECEIPT_KINDS,
  ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE,
  ASHEN_REEF_SURVEY_NON_PROPOSALS,
  createAuthorityId,
  createEmptyAshenReefSurveyAuthority,
  isAshenReefSurveyOwnerInputsState,
  isTargetCampaignSnapshot,
  resolveAshenReefSurveyMetabolicProfile,
  serializeAshenReefSurveyNormalizedIntent
} from "./campaign-rules.js";
import {
  commitPreparedPlayerSurveyCampaignMutation,
  preparePlayerSurveyCampaignMutation,
  type CampaignSessionControl
} from "./campaign-session.js";
import {
  CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION,
  getAshenReefSurveyContent
} from "./ashen-reef-survey-content.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";
import { getCurrentPlayerTravelLocationId } from "./player-travel-rules.js";

export const PLAYER_SURVEY_ADVANCED_EVENT_TYPE = EVENT_TYPES.PLAYER_SURVEY_ADVANCED;

const QUEST_ID = "quest.ashen_reef_survey" as const;
const LOCATION_ID = "location.ashen_reef" as const;
const SECTOR_PREFIX = "gameplay.quest.ashen_reef_survey.sector.";
const RUINS_FLAG = "gameplay.quest.ashen_reef_survey.ruins_confirmed";
const DISCOVERY_FLAG = "gameplay.discovery.stormglass_bloom";
const DISCOVERY_ID = "discovery.stormglass_bloom";
const CODEX_ID = "flora.unknown_bloom";
const OPERATION_ID = "operation.quest.ashen_reef_survey";
const REQUEST_PATTERN = /^survey_request\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

const WATCH_LABELS: Record<number, string> = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

export type PlayerSurveyActivityAdvancementRejectionCode =
  | "malformed_command"
  | "wrong_account"
  | "wrong_player"
  | "wrong_campaign"
  | "wrong_control"
  | "wrong_artifact"
  | "wrong_publication"
  | "stale_revision"
  | "stale_snapshot"
  | "invalid_authority"
  | "survey_quest_missing"
  | "survey_quest_inactive"
  | "survey_quest_untracked"
  | "survey_wrong_location"
  | "survey_progress_incoherent"
  | "survey_discovery_incoherent"
  | "survey_already_complete"
  | "survey_activity_missing"
  | "conflicting_retry"
  | "correction_pending"
  | "recovery_pending"
  | "transition_failed";

export interface PlayerSurveyActivityAdvancementNoticeFacts {
  tone: UiTone;
  title: string;
  detail: string;
}

export interface AcceptedPlayerSurveyActivityAdvancementPlan {
  accepted: true;
  code: "survey_advance_available";
  stage: AshenReefSurveyStage;
  reason: null;
  tickCount: 2;
  metabolicProfile: ActionMetabolicProfileState;
  attributeLoadProfile: ActionAttributeLoadProfileState;
  projectedBodyState: PlayerBodyState;
  timeline: PlayerBodyState[];
  projectedResources: SaveSnapshot["playerState"]["resources"];
  resourceCosts: AshenReefSurveyResultState["resourceCosts"];
  nonProposals: AshenReefSurveyResultState["nonProposals"];
  skill: AshenReefSurveyResultState["skill"];
  materialBefore: AshenReefSurveyMaterialFactsState;
  materialAfter: AshenReefSurveyMaterialFactsState;
  operation: OperationState;
  currentActivityOutcome: CurrentActivityState | null;
  discoveryOutcome: AshenReefSurveyResultState["discoveryOutcome"];
  codexOutcome: AshenReefSurveyResultState["codexOutcome"];
  notification: NotificationState;
  chronicle: ChronicleEventState;
  eventFacts: {
    type: typeof PLAYER_SURVEY_ADVANCED_EVENT_TYPE;
    domain: "player";
    atTick: number;
    playerId: string;
    questId: typeof QUEST_ID;
    stage: AshenReefSurveyStage;
    resultCode: AshenReefSurveyResultState["code"];
  };
  notice: PlayerSurveyActivityAdvancementNoticeFacts;
  materialVersions: AshenReefSurveyMaterialVersionsState;
}

export interface RejectedPlayerSurveyActivityAdvancementPlan {
  accepted: false;
  code: PlayerSurveyActivityAdvancementRejectionCode;
  stage: null;
  reason: string;
  tickCount: 0;
  metabolicProfile: null;
  attributeLoadProfile: null;
  projectedBodyState: null;
  timeline: [];
  projectedResources: null;
  resourceCosts: null;
  nonProposals: null;
  skill: null;
  materialBefore: AshenReefSurveyMaterialFactsState | null;
  materialAfter: null;
  operation: null;
  currentActivityOutcome: null;
  discoveryOutcome: null;
  codexOutcome: null;
  notification: null;
  chronicle: null;
  eventFacts: null;
  notice: PlayerSurveyActivityAdvancementNoticeFacts;
  materialVersions: AshenReefSurveyMaterialVersionsState;
}

export type PlayerSurveyActivityAdvancementPlan =
  | AcceptedPlayerSurveyActivityAdvancementPlan
  | RejectedPlayerSurveyActivityAdvancementPlan;

export interface PlayerSurveyActivityAdvancementCommand {
  version: 1;
  type: "player.activity.survey.advance";
  requestId: string;
  normalizedIntent: AshenReefSurveyNormalizedIntentState;
  canonicalIntent: string;
}

export type PlayerSurveyActivityAdvancementCommandPreparation =
  | {
      kind: "prepared";
      command: PlayerSurveyActivityAdvancementCommand;
      notice: PlayerSurveyActivityAdvancementNoticeFacts;
    }
  | {
      kind: "expected_rejection";
      code: Exclude<PlayerSurveyActivityAdvancementRejectionCode, "transition_failed">;
      notice: PlayerSurveyActivityAdvancementNoticeFacts;
    }
  | {
      kind: "technical_retry";
      code: "transition_failed";
      notice: PlayerSurveyActivityAdvancementNoticeFacts;
    }
  | {
      kind: "unclassified_failure";
      code: "unclassified_failure";
      notice: PlayerSurveyActivityAdvancementNoticeFacts;
    };

export interface PlayerSurveyAdvancedEventPayload extends Record<string, unknown> {
  requestId: string;
  occurrenceId: string;
  resultId: string;
  playerId: string;
  questId: typeof QUEST_ID;
  stage: AshenReefSurveyStage;
  resultCode: AshenReefSurveyResultState["code"];
  projectionPending: boolean;
}

export type PlayerSurveyAdvancedEvent = GameEventEnvelope<PlayerSurveyAdvancedEventPayload> & {
  type: typeof PLAYER_SURVEY_ADVANCED_EVENT_TYPE;
  domain: "player";
};

export interface PlayerSurveyActivityAdvancementResult {
  accepted: boolean;
  duplicate: boolean;
  code: "survey_advanced" | "duplicate" | PlayerSurveyActivityAdvancementRejectionCode;
  requestId: string | null;
  result: AshenReefSurveyResultState | null;
  receipts: AshenReefSurveyConsequenceReceiptState[];
  projectionPending: AshenReefSurveyProjectionKind[];
  notice: PlayerSurveyActivityAdvancementNoticeFacts;
  emittedEvents: PlayerSurveyAdvancedEvent[];
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
}

export interface PlayerSurveyProjectionRepairResult {
  accepted: boolean;
  duplicate: boolean;
  code:
    | "projection_repaired"
    | "projection_already_correct"
    | "projection_retention_expired"
    | "projection_newer_authority"
    | "projection_invalid";
  repair: AshenReefSurveyProjectionRepairState | null;
  emittedEvents: PlayerSurveyAdvancedEvent[];
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
}

export interface PendingPlayerSurveyProjectionRepair {
  resultId: string;
  projectionKind: AshenReefSurveyProjectionKind;
}

export function shouldRetainPlayerSurveyRequestIdentity(
  result: PlayerSurveyActivityAdvancementResult
): boolean {
  return !result.accepted && !result.duplicate && result.code === "transition_failed";
}

export type PlayerSurveySkillPresentation =
  | { status: "applied"; detail: string }
  | { status: "blocked_at_gate"; detail: string }
  | { status: "unchanged"; detail: string };

export function resolvePlayerSurveySkillPresentation(
  skill: Pick<AshenReefSurveyResultState["skill"], "appliedDelta" | "blockedGate">
): PlayerSurveySkillPresentation {
  if (skill.appliedDelta > 0) {
    return { status: "applied", detail: `+${skill.appliedDelta}` };
  }
  if (skill.blockedGate !== null) {
    return {
      status: "blocked_at_gate",
      detail: `blocked at breakthrough gate ${skill.blockedGate}`
    };
  }
  return { status: "unchanged", detail: "unchanged" };
}

type SkillApplication = {
  skills: PlayerSkillState[];
  skillId: "skill.knowledge.general_lore" | "skill.resource.identify.flora";
  rankBefore: number;
  rankAfter: number;
  appliedDelta: number;
  blockedGate: number | null;
  requiredBand: string | null;
};

type MaterialApplication = {
  snapshot: SaveSnapshot;
  stage: AshenReefSurveyStage;
  profile: ActionMetabolicProfileState;
  materialVersions: AshenReefSurveyMaterialVersionsState;
  materialBefore: AshenReefSurveyMaterialFactsState;
  materialAfter: AshenReefSurveyMaterialFactsState;
  bodyBefore: PlayerBodyState;
  bodyTimeline: PlayerBodyState[];
  statGrowthBefore: SaveSnapshot["playerState"]["statGrowth"];
  resourcesBefore: SaveSnapshot["playerState"]["resources"];
  resourcesAfterNatural: SaveSnapshot["playerState"]["resources"];
  skill: SkillApplication;
  operationBefore: OperationState | null;
  operationAfter: OperationState;
  questAfter: SaveSnapshot["sessionState"]["questJournal"][number];
  discoveryBefore: SaveSnapshot["playerState"]["discoveryChronicle"]["entries"][number] | null;
  discoveryAfter: SaveSnapshot["playerState"]["discoveryChronicle"]["entries"][number] | null;
  discoveryFlagBefore: boolean;
  codexOutcome: AshenReefSurveyResultState["codexOutcome"];
  currentActivityBefore: CurrentActivityState | null;
  notification: NotificationState;
  chronicle: ChronicleEventState;
  notice: PlayerSurveyActivityAdvancementNoticeFacts;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function formatTickTime(snapshot: SaveSnapshot): string {
  return `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? "Unknown Watch"}`;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function collectOwnerInputs(snapshot: SaveSnapshot): AshenReefSurveyOwnerInputsState {
  const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
  if (!quest || quest.category !== "active" || quest.tracked !== true) {
    throw new Error("Survey owner inputs require the active tracked quest.");
  }
  const relevantSkills = ([
    "skill.knowledge.general_lore",
    "skill.resource.identify.flora"
  ] as const).map(
    (skillId) => clone(snapshot.playerState.skills.find((entry) => entry.id === skillId) ?? null)
  ) as AshenReefSurveyOwnerInputsState["relevantSkills"];
  return {
    clock: clone(snapshot.clock),
    totalPlayTicks: snapshot.playerState.saveMeta.totalPlayTicks,
    lastReputationDecayDay:
      snapshot.playerState.saveMeta.lastReputationDecayDay ?? null,
    questPosture: { category: "active", tracked: true },
    runDifficulty: clone(snapshot.gameState.runDifficulty),
    playerName: snapshot.playerState.coreData.playerName,
    lineageId: snapshot.playerState.coreData.lineageId,
    bodyState: clone(snapshot.playerState.bodyState),
    resources: clone(snapshot.playerState.resources),
    resourceRuntime: clone(snapshot.playerState.resourceRuntime),
    attributes: clone(snapshot.playerState.attributes),
    statGrowth: clone(snapshot.playerState.statGrowth),
    skills: clone(snapshot.playerState.skills),
    relevantSkills,
    progression: clone(snapshot.playerState.progression),
    reputation: clone(snapshot.playerState.reputation),
    originProfile: clone(snapshot.playerState.originProfile),
    equipment: clone(snapshot.playerState.equipment),
    currentActivity: clone(snapshot.sessionState.currentActivity),
    surveyOperation: clone(findOperation(snapshot)),
    stormglassDiscovery: clone(matchingDiscoveries(snapshot)[0] ?? null),
    stormglassCodexEntry: clone(
      snapshot.sessionState.codexEntries.find((entry) => entry.id === CODEX_ID) ?? null
    )
  };
}

function resolveMaterialVersions(): AshenReefSurveyMaterialVersionsState {
  return {
    resolver: 1,
    bodyBalance: loadBodyStateBalanceRule().version,
    statGrowth: loadStatGrowthBalanceRule().version,
    skillPolicy: 1,
    synchronization: 1,
    surveyContent: CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION
  };
}

function findOperation(snapshot: SaveSnapshot): OperationState | null {
  return snapshot.sessionState.operations.find((entry) => entry.id === OPERATION_ID) ?? null;
}

function matchingDiscoveries(snapshot: SaveSnapshot) {
  return snapshot.playerState.discoveryChronicle.entries.filter((entry) => entry.id === DISCOVERY_ID);
}

export function isAshenReefSurveyActivityAdvancementIntent(snapshot: SaveSnapshot): boolean {
  const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
  return snapshot.sessionState.trackedQuestId === QUEST_ID ||
    snapshot.sessionState.currentActivity?.id === "activity.survey.ashen_reef" ||
    (
      quest?.category === "active" &&
      snapshot.sessionState.currentActivity?.id === "activity.return.survey_packet" &&
      snapshot.sessionState.flags.includes(RUINS_FLAG)
    );
}

function resolveCodexRowState(snapshot: SaveSnapshot): AshenReefSurveyMaterialFactsState["codexRowState"] {
  const row = snapshot.sessionState.codexEntries.find((entry) => entry.id === CODEX_ID);
  if (!row) return "source_record_absent";
  return row.locked === false ? "unlocked" : "locked";
}

function collectMaterialFacts(snapshot: SaveSnapshot): AshenReefSurveyMaterialFactsState {
  const sectorFlags = snapshot.sessionState.flags.filter((entry) => entry.startsWith(SECTOR_PREFIX));
  const discoveries = matchingDiscoveries(snapshot);
  return {
    sectorFlags,
    sectorCount: sectorFlags.length,
    ruinsConfirmed: snapshot.sessionState.flags.includes(RUINS_FLAG),
    discoveryEntryState: discoveries.length === 1 ? "matching" : "absent",
    discoveryFlagPresent: snapshot.sessionState.flags.includes(DISCOVERY_FLAG),
    codexRowState: resolveCodexRowState(snapshot),
    operationProgress: findOperation(snapshot)?.progress ?? null,
    currentActivityId: snapshot.sessionState.currentActivity?.id ?? null
  };
}

function expectedStage(sectorCount: number): AshenReefSurveyStage {
  return sectorCount === 0
    ? "sector_1"
    : sectorCount === 1
      ? "sector_2"
      : sectorCount === 2
        ? "sector_3"
        : "ruins_confirmation";
}

function rejectPlan(
  code: PlayerSurveyActivityAdvancementRejectionCode,
  reason: string,
  materialBefore: AshenReefSurveyMaterialFactsState | null = null
): RejectedPlayerSurveyActivityAdvancementPlan {
  return {
    accepted: false,
    code,
    stage: null,
    reason,
    tickCount: 0,
    metabolicProfile: null,
    attributeLoadProfile: null,
    projectedBodyState: null,
    timeline: [],
    projectedResources: null,
    resourceCosts: null,
    nonProposals: null,
    skill: null,
    materialBefore,
    materialAfter: null,
    operation: null,
    currentActivityOutcome: null,
    discoveryOutcome: null,
    codexOutcome: null,
    notification: null,
    chronicle: null,
    eventFacts: null,
    notice: { tone: "warning", title: "Survey unavailable", detail: reason },
    materialVersions: resolveMaterialVersions()
  };
}

function validateSurveyProgress(snapshot: SaveSnapshot): PlayerSurveyActivityAdvancementPlan | null {
  const facts = collectMaterialFacts(snapshot);
  const sectorFlags = facts.sectorFlags;
  const ruinsFlagCount = snapshot.sessionState.flags.filter((entry) => entry === RUINS_FLAG).length;
  if (new Set(sectorFlags).size !== sectorFlags.length || sectorFlags.length > 3) {
    return rejectPlan("survey_progress_incoherent", "Survey progress contains duplicated or unknown sector evidence.", facts);
  }
  const expectedFlags = Array.from(
    { length: sectorFlags.length },
    (_, index) => `${SECTOR_PREFIX}${index + 1}`
  );
  if (JSON.stringify(sectorFlags) !== JSON.stringify(expectedFlags)) {
    return rejectPlan("survey_progress_incoherent", "Survey sectors must be recorded once and in contiguous order.", facts);
  }
  if (facts.ruinsConfirmed && facts.sectorCount !== 3) {
    return rejectPlan("survey_progress_incoherent", "Ruin confirmation cannot precede all three survey sectors.", facts);
  }
  if (ruinsFlagCount > 1) {
    return rejectPlan("survey_progress_incoherent", "Ruin confirmation evidence is duplicated.", facts);
  }
  const discoveries = matchingDiscoveries(snapshot);
  const discoveryFlagCount = snapshot.sessionState.flags.filter((entry) => entry === DISCOVERY_FLAG).length;
  if (
    discoveries.length > 1 ||
    discoveryFlagCount > 1 ||
    discoveries.some(
      (entry) =>
        entry.codexEntryId !== CODEX_ID ||
        entry.category !== "flora" ||
        entry.title !== "Stormglass Bloom" ||
        entry.sourceType !== "survey" ||
        entry.sourceId !== QUEST_ID
    ) ||
    (discoveries.length === 1) !== facts.discoveryFlagPresent
  ) {
    return rejectPlan("survey_discovery_incoherent", "Stormglass discovery evidence is missing, duplicated, or conflicting.", facts);
  }
  if (facts.ruinsConfirmed) {
    return rejectPlan("survey_already_complete", "The Ashen Reef survey packet is already complete.", facts);
  }
  return null;
}

function applySkill(
  snapshot: SaveSnapshot,
  stage: AshenReefSurveyStage
): SkillApplication {
  const skillId = stage === "ruins_confirmation"
    ? "skill.resource.identify.flora" as const
    : "skill.knowledge.general_lore" as const;
  const existing = snapshot.playerState.skills.find((entry) => entry.id === skillId) ?? null;
  const rankBefore = existing?.rank ?? 0;
  const policy = resolveSkillRankGainPolicy({
    skillId,
    currentSkill: existing,
    rankDelta: 1,
    sourceLabel:
      stage === "ruins_confirmation"
        ? "Ashen Reef survey discovery"
        : "Ashen Reef survey sector",
    sourceType: "noncombat"
  });
  if (policy.appliedDelta > 0) {
    if (existing) {
      snapshot.playerState.skills = snapshot.playerState.skills.map((entry) =>
        entry.id === skillId
          ? { ...entry, rank: policy.appliedRank, source: "trained" as const }
          : entry
      );
    } else {
      snapshot.playerState.skills = [
        ...snapshot.playerState.skills,
        { id: skillId, rank: policy.appliedRank, source: "trained" as const }
      ].sort((left, right) => left.id.localeCompare(right.id));
    }
  }
  return {
    skills: snapshot.playerState.skills,
    skillId,
    rankBefore,
    rankAfter: policy.appliedRank,
    appliedDelta: policy.appliedDelta,
    blockedGate: policy.blockedGate,
    requiredBand: policy.requiredBand
  };
}

function buildSurveyOperation(
  snapshot: SaveSnapshot,
  contentVersion: AshenReefSurveyMaterialVersionsState["surveyContent"]
): OperationState {
  const facts = collectMaterialFacts(snapshot);
  const content = getAshenReefSurveyContent(contentVersion);
  return {
    id: OPERATION_ID,
    title: content.operationTitle,
    stage: facts.ruinsConfirmed
      ? "Chart packet ready for harbor turn-in"
      : `Survey sectors logged: ${facts.sectorCount} / 3`,
    progress: facts.ruinsConfirmed ? 100 : facts.sectorCount * 25,
    etaLabel: facts.ruinsConfirmed ? "Ready now" : `${Math.max(1, 4 - facts.sectorCount)} shift(s)`,
    owner: snapshot.playerState.coreData.playerName,
    output: facts.ruinsConfirmed ? "Verified reef chart packet" : "Field chart updates",
    priority: "High"
  };
}

function upsertOperation(operations: OperationState[], operation: OperationState): OperationState[] {
  return operations.some((entry) => entry.id === operation.id)
    ? operations.map((entry) => entry.id === operation.id ? operation : entry)
    : [operation, ...operations];
}

function formatSkillEffect(skill: SkillApplication, label: string): string {
  if (skill.appliedDelta > 0) return `${label} +${skill.appliedDelta}`;
  if (skill.blockedGate !== null) return `${label} progress requires a breakthrough`;
  return `${label} unchanged`;
}

function createProjectionFacts(
  snapshot: SaveSnapshot,
  stage: AshenReefSurveyStage,
  skill: SkillApplication,
  ids: { notification: string; chronicle: string },
  contentVersion: AshenReefSurveyMaterialVersionsState["surveyContent"]
): {
  notification: NotificationState;
  chronicle: ChronicleEventState;
  notice: PlayerSurveyActivityAdvancementNoticeFacts;
} {
  const content = getAshenReefSurveyContent(contentVersion);
  const sector = stage === "sector_1" ? 1 : stage === "sector_2" ? 2 : stage === "sector_3" ? 3 : null;
  if (sector !== null) {
    return {
      notification: {
        id: ids.notification,
        title: "Survey sector logged",
        detail: `Ashen Reef sector ${sector} is now charted and filed into the packet.`,
        timeLabel: formatTickTime(snapshot),
        tone: "success"
      },
      chronicle: {
        id: ids.chronicle,
        category: "discovery",
        title: `Survey sector ${sector} logged at Ashen Reef`,
        timeLabel: formatTickTime(snapshot),
        summary: "The crew marked channels, breakers, and draft-safe approaches for the charter packet.",
        statusLabel: `Sector ${sector} / 3`,
        entities: [snapshot.playerState.coreData.playerName, "Ashen Reef"],
        results: ["Survey packet expanded"],
        statChanges: [formatSkillEffect(skill, "Navigation"), "Stamina -10", "MP -3"],
        tags: ["Exploration", "Survey"]
      },
      notice: {
        tone: "success",
        title: "Survey Progress",
        detail: `Ashen Reef sector ${sector} is now charted.`
      }
    };
  }
  return {
    notification: {
      id: ids.notification,
      title: "Survey packet complete",
      detail: content.completionNotificationDetail,
      timeLabel: formatTickTime(snapshot),
      tone: "accent"
    },
    chronicle: {
      id: ids.chronicle,
      category: "discovery",
      title: "Ashen Reef survey packet completed",
      timeLabel: formatTickTime(snapshot),
      summary: "The crew verified the ruin markers and logged a new flora sample for the reef archive.",
      statusLabel: "Packet complete",
      entities: [snapshot.playerState.coreData.playerName, "Ashen Reef", "Stormglass Bloom"],
      results: ["Chart packet finalized", "New discovery recorded"],
      statChanges: [formatSkillEffect(skill, "Survival"), "Stamina -10", "MP -3"],
      tags: ["Exploration", "Discovery", "Survey"]
    },
    notice: {
      tone: "accent",
      title: "Survey Packet Ready",
      detail: content.completionNoticeDetail
    }
  };
}

function applyMaterialStage(
  sourceSnapshot: SaveSnapshot,
  stage: AshenReefSurveyStage,
  projectionIds: { notification: string; chronicle: string }
): MaterialApplication {
  const nextSnapshot = clone(sourceSnapshot);
  const materialVersions = resolveMaterialVersions();
  const content = getAshenReefSurveyContent(materialVersions.surveyContent);
  const materialBefore = collectMaterialFacts(sourceSnapshot);
  const profile = resolveAshenReefSurveyMetabolicProfile(collectOwnerInputs(sourceSnapshot));
  const bodyBefore = clone(sourceSnapshot.playerState.bodyState);
  const statGrowthBefore = clone(sourceSnapshot.playerState.statGrowth);
  const resourcesBefore = clone(sourceSnapshot.playerState.resources);
  const bodyTimeline: PlayerBodyState[] = [];

  // Keep the legacy two one-tick applications. The body owner divides a profile
  // by step count, so a single two-tick call would change the established cost.
  for (let index = 0; index < 2; index += 1) {
    const nextClock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.clock = nextClock;
    nextSnapshot.capturedAtTick = nextClock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
    nextSnapshot.playerState.bodyState = advancePlayerBodyState(
      nextSnapshot.playerState.bodyState,
      1,
      {
        day: nextClock.day,
        tick: nextClock.tick,
        lineageId: nextSnapshot.playerState.coreData.lineageId,
        runDifficulty: nextSnapshot.gameState.runDifficulty,
        metabolicProfile: profile,
        recoveryContext: null,
        recoveryAssessment: null
      }
    );
    applyActionAttributeLoad(
      nextSnapshot.playerState,
      ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE,
      1,
      nextClock.day,
      nextSnapshot.gameState.runDifficulty
    );
    syncPlayerRuntimeState(
      nextSnapshot.playerState,
      nextClock.tick,
      nextClock.day,
      [],
      nextSnapshot.gameState.runDifficulty
    );
    bodyTimeline.push(clone(nextSnapshot.playerState.bodyState));
  }

  const resourcesAfterNatural = clone(nextSnapshot.playerState.resources);
  nextSnapshot.playerState.resources.stamina.current = clamp(
    nextSnapshot.playerState.resources.stamina.current - 10,
    0,
    nextSnapshot.playerState.resources.stamina.max
  );
  nextSnapshot.playerState.resources.mp.current = clamp(
    nextSnapshot.playerState.resources.mp.current - 3,
    0,
    nextSnapshot.playerState.resources.mp.max
  );

  const operationBefore = clone(findOperation(sourceSnapshot));
  const currentActivityBefore = clone(sourceSnapshot.sessionState.currentActivity);
  const discoveryBefore = clone(matchingDiscoveries(sourceSnapshot)[0] ?? null);
  const discoveryFlagBefore = sourceSnapshot.sessionState.flags.includes(DISCOVERY_FLAG);
  const codexBefore = resolveCodexRowState(sourceSnapshot);
  const skill = applySkill(nextSnapshot, stage);

  if (stage === "sector_1" || stage === "sector_2" || stage === "sector_3") {
    const sector = stage === "sector_1" ? 1 : stage === "sector_2" ? 2 : 3;
    nextSnapshot.sessionState.flags = [
      ...nextSnapshot.sessionState.flags,
      `${SECTOR_PREFIX}${sector}`
    ];
  } else {
    nextSnapshot.sessionState.flags = [...nextSnapshot.sessionState.flags, RUINS_FLAG];
    if (!discoveryBefore) {
      nextSnapshot.playerState.discoveryChronicle.entries = [
        {
          id: DISCOVERY_ID,
          codexEntryId: CODEX_ID,
          category: "flora",
          title: "Stormglass Bloom",
          discoveredAtTick: nextSnapshot.clock.tick,
          discoveredAtLabel: formatTickTime(nextSnapshot),
          regionLabel: content.regionLabel,
          sourceType: "survey",
          sourceId: QUEST_ID,
          notes: [
            "Logged during the Ashen Reef survey while the crew marked ruin shelves.",
            "The petals refract storm light and dry into brittle crystalline veins."
          ]
        },
        ...nextSnapshot.playerState.discoveryChronicle.entries
      ];
      nextSnapshot.playerState.discoveryChronicle.lastUpdatedTick = nextSnapshot.clock.tick;
    }
    if (!discoveryFlagBefore) {
      nextSnapshot.sessionState.flags = [...nextSnapshot.sessionState.flags, DISCOVERY_FLAG];
    }
    nextSnapshot.sessionState.currentActivity = {
      id: "activity.return.survey_packet",
      label: "Returning Chart Packet",
      category: "Contract",
      detail: content.returnActivityDetail
    };
  }

  const operationAfter = buildSurveyOperation(
    nextSnapshot,
    materialVersions.surveyContent
  );
  nextSnapshot.sessionState.operations = upsertOperation(
    nextSnapshot.sessionState.operations,
    operationAfter
  );
  const synchronized = synchronizeGameplaySnapshot(nextSnapshot, {
    ashenReefSurveyContentVersion: materialVersions.surveyContent
  });
  const projectionFacts = createProjectionFacts(
    synchronized,
    stage,
    skill,
    projectionIds,
    materialVersions.surveyContent
  );
  const questAfter = synchronized.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
  if (!questAfter) throw new Error("Survey quest synchronization lost the active quest.");

  const codexAfter = resolveCodexRowState(synchronized);
  const codexOutcome: AshenReefSurveyResultState["codexOutcome"] =
    stage !== "ruins_confirmation"
      ? "not_applicable"
      : codexBefore === "source_record_absent"
        ? "source_record_absent"
        : codexBefore === "unlocked"
          ? "already_unlocked"
          : codexAfter === "unlocked"
            ? "unlocked_existing"
            : (() => { throw new Error("Survey Codex synchronization did not reach its expected state."); })();

  return {
    snapshot: synchronized,
    stage,
    profile,
    materialVersions,
    materialBefore,
    materialAfter: collectMaterialFacts(synchronized),
    bodyBefore,
    bodyTimeline,
    statGrowthBefore,
    resourcesBefore,
    resourcesAfterNatural,
    skill,
    operationBefore,
    operationAfter,
    questAfter,
    discoveryBefore,
    discoveryAfter: clone(matchingDiscoveries(synchronized)[0] ?? null),
    discoveryFlagBefore,
    codexOutcome,
    currentActivityBefore,
    notification: projectionFacts.notification,
    chronicle: projectionFacts.chronicle,
    notice: projectionFacts.notice
  };
}

export function resolvePlayerSurveyActivityAdvancementPlan(
  snapshot: SaveSnapshot
): PlayerSurveyActivityAdvancementPlan {
  const materialVersions = resolveMaterialVersions();
  const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === QUEST_ID);
  if (!quest) return rejectPlan("survey_quest_missing", "The Ashen Reef survey is not available in this session.");
  if (quest.category !== "active") {
    return rejectPlan("survey_quest_inactive", "The Ashen Reef survey is not active.");
  }
  const progressRejection = validateSurveyProgress(snapshot);
  if (progressRejection) return progressRejection;
  if (snapshot.sessionState.trackedQuestId !== QUEST_ID || quest.tracked !== true) {
    return rejectPlan("survey_quest_untracked", "Track the Ashen Reef survey before advancing its field work.");
  }
  if (getCurrentPlayerTravelLocationId(snapshot) !== LOCATION_ID) {
    return rejectPlan("survey_wrong_location", "Travel to Ashen Reef before advancing the survey work.");
  }
  if (!snapshot.sessionState.currentActivity) {
    return rejectPlan("survey_activity_missing", "Set the Ashen Reef survey as the current activity before advancing.");
  }
  if (snapshot.normalDefeatReceipts?.some((receipt) => receipt.posture === "recovery_pending")) {
    return rejectPlan("recovery_pending", "Resolve the pending Normal-defeat recovery before advancing the survey.", collectMaterialFacts(snapshot));
  }
  if (
    snapshot.authorityLedger?.ashenReefSurvey?.corrections.some((correction) =>
      correction.reconciliations.some((entry) => entry.status === "pending")
    )
  ) {
    return rejectPlan("correction_pending", "Survey authority has a pending owner reconciliation.", collectMaterialFacts(snapshot));
  }
  try {
    const materialBefore = collectMaterialFacts(snapshot);
    const stage = expectedStage(materialBefore.sectorCount);
    const preview = applyMaterialStage(snapshot, stage, {
      notification: "notification.survey.preview",
      chronicle: "chronicle.survey.preview"
    });
    return {
      accepted: true,
      code: "survey_advance_available",
      stage,
      reason: null,
      tickCount: 2,
      metabolicProfile: clone(preview.profile),
      attributeLoadProfile: clone(ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE),
      projectedBodyState: preview.snapshot.playerState.bodyState,
      timeline: preview.bodyTimeline,
      projectedResources: preview.snapshot.playerState.resources,
      resourceCosts: { stamina: 10, mp: 3, hp: 0 },
      nonProposals: clone(ASHEN_REEF_SURVEY_NON_PROPOSALS),
      skill: {
        skillId: preview.skill.skillId,
        requestedDelta: 1,
        appliedDelta: preview.skill.appliedDelta,
        blockedGate: preview.skill.blockedGate,
        requiredBand: preview.skill.requiredBand
      },
      materialBefore,
      materialAfter: preview.materialAfter,
      operation: preview.operationAfter,
      currentActivityOutcome: preview.snapshot.sessionState.currentActivity,
      discoveryOutcome:
        stage !== "ruins_confirmation"
          ? "not_applicable"
          : preview.discoveryBefore
            ? "retained_existing"
            : "created",
      codexOutcome: preview.codexOutcome,
      notification: clone(preview.notification),
      chronicle: clone(preview.chronicle),
      eventFacts: {
        type: PLAYER_SURVEY_ADVANCED_EVENT_TYPE,
        domain: "player",
        atTick: preview.snapshot.clock.tick,
        playerId: snapshot.playerState.playerId,
        questId: QUEST_ID,
        stage,
        resultCode: stage === "ruins_confirmation"
          ? "survey_packet_completed"
          : "survey_sector_logged"
      },
      notice: preview.notice,
      materialVersions
    };
  } catch {
    return rejectPlan("transition_failed", "The survey preview could not be resolved safely.", collectMaterialFacts(snapshot));
  }
}

function deriveIds(requestId: string) {
  const match = REQUEST_PATTERN.exec(requestId);
  if (!match) return null;
  const uuid = match[1]!;
  return {
    uuid,
    occurrenceId: `survey_occurrence.${uuid}`,
    resultId: `survey_result.${uuid}`,
    eventId: `event.player.activity.survey.${uuid}`,
    notificationId: `notification.survey.${uuid}`,
    chronicleId: `chronicle.survey.${uuid}`
  };
}

function buildNormalizedIntent(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  plan: AcceptedPlayerSurveyActivityAdvancementPlan
): AshenReefSurveyNormalizedIntentState {
  const identity = snapshot.campaignIdentity;
  if (!identity) throw new Error("Survey command requires campaign identity.");
  return {
    version: 1,
    intent: "advance_ashen_reef_survey_shift",
    accountId: snapshot.accountId,
    campaignId: identity.campaignId,
    sourceContinuityId: identity.continuityId,
    characterId: identity.characterId,
    questId: QUEST_ID,
    activityId: snapshot.sessionState.currentActivity?.id ?? null,
    locationId: LOCATION_ID,
    sourceArtifactId: control.loadedArtifactId,
    sourcePublicationId: control.loadedPublicationId,
    sourceRevision: control.sessionRevision,
    expectedRevision: control.sessionRevision,
    expectedTick: snapshot.clock.tick,
    snapshotFormat: "lineage.save_snapshot.v2",
    stage: plan.stage,
    materialFacts: clone(plan.materialBefore),
    ownerInputs: collectOwnerInputs(snapshot),
    materialVersions: clone(plan.materialVersions)
  };
}

export function createPlayerSurveyActivityAdvancementCommand(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  requestId = createAuthorityId("survey_request")
): PlayerSurveyActivityAdvancementCommand {
  const preparation = preparePlayerSurveyActivityAdvancementCommand(
    snapshot,
    control,
    requestId
  );
  if (preparation.kind !== "prepared") {
    throw new Error(preparation.notice.detail);
  }
  return preparation.command;
}

export function preparePlayerSurveyActivityAdvancementCommand(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  requestId?: string
): PlayerSurveyActivityAdvancementCommandPreparation {
  try {
    return preparePlayerSurveyActivityAdvancementCommandUnchecked(
      snapshot,
      control,
      requestId ?? createAuthorityId("survey_request")
    );
  } catch {
    return {
      kind: "unclassified_failure",
      code: "unclassified_failure",
      notice: {
        tone: "warning",
        title: "Survey not advanced",
        detail: "The campaign-authoritative survey command could not be prepared."
      }
    };
  }
}

function preparePlayerSurveyActivityAdvancementCommandUnchecked(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  requestId: string
): PlayerSurveyActivityAdvancementCommandPreparation {
  const retained = snapshot.authorityLedger?.ashenReefSurvey?.requests.filter(
    (entry) => entry?.requestId === requestId
  ) ?? [];
  if (retained.length === 1) {
    return {
      kind: "prepared",
      command: {
        version: 1,
        type: "player.activity.survey.advance",
        requestId,
        normalizedIntent: clone(retained[0]!.normalizedIntent),
        canonicalIntent: retained[0]!.canonicalIntent
      },
      notice: {
        tone: "neutral",
        title: "Survey result retained",
        detail: "The retained survey request will be resolved before current-state availability checks."
      }
    };
  }
  if (retained.length > 1) {
    return {
      kind: "expected_rejection",
      code: "invalid_authority",
      notice: {
        tone: "warning",
        title: "Survey not advanced",
        detail: "Survey request authority is duplicated."
      }
    };
  }
  if (!isTargetCampaignSnapshot(snapshot)) {
    return {
      kind: "expected_rejection",
      code: "invalid_authority",
      notice: {
        tone: "warning",
        title: "Survey not advanced",
        detail: "The campaign snapshot is not valid survey authority."
      }
    };
  }
  const plan = resolvePlayerSurveyActivityAdvancementPlan(snapshot);
  if (!plan.accepted) {
    if (plan.code !== "transition_failed") {
      return { kind: "expected_rejection", code: plan.code, notice: clone(plan.notice) };
    }
    if (!isAshenReefSurveyOwnerInputsState(collectOwnerInputs(snapshot))) {
      return {
        kind: "expected_rejection",
        code: "invalid_authority",
        notice: {
          tone: "warning",
          title: "Survey not advanced",
          detail: "The survey owner inputs are not valid command authority."
        }
      };
    }
    return { kind: "technical_retry", code: "transition_failed", notice: clone(plan.notice) };
  }
  if (!isAshenReefSurveyOwnerInputsState(collectOwnerInputs(snapshot))) {
    return {
      kind: "expected_rejection",
      code: "invalid_authority",
      notice: {
        tone: "warning",
        title: "Survey not advanced",
        detail: "The survey owner inputs are not valid command authority."
      }
    };
  }
  try {
    const normalizedIntent = buildNormalizedIntent(snapshot, control, plan);
    return {
      kind: "prepared",
      command: {
        version: 1,
        type: "player.activity.survey.advance",
        requestId,
        normalizedIntent,
        canonicalIntent: serializeAshenReefSurveyNormalizedIntent(normalizedIntent)
      },
      notice: {
        tone: "neutral",
        title: "Survey command prepared",
        detail: "The campaign-authoritative survey command is ready for admission."
      }
    };
  } catch {
    return {
      kind: "unclassified_failure",
      code: "unclassified_failure",
      notice: {
        tone: "warning",
        title: "Survey not advanced",
        detail: "The campaign-authoritative survey command could not be prepared."
      }
    };
  }
}

function isCommandShape(value: unknown): value is PlayerSurveyActivityAdvancementCommand {
  if (!value || typeof value !== "object") return false;
  const command = value as Partial<PlayerSurveyActivityAdvancementCommand>;
  return command.version === 1 &&
    command.type === "player.activity.survey.advance" &&
    typeof command.requestId === "string" &&
    REQUEST_PATTERN.test(command.requestId) &&
    typeof command.canonicalIntent === "string" &&
    typeof command.normalizedIntent === "object" &&
    command.normalizedIntent !== null;
}

function rejectedResult(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  code: PlayerSurveyActivityAdvancementRejectionCode,
  requestId: string | null,
  detail: string
): PlayerSurveyActivityAdvancementResult {
  return {
    accepted: false,
    duplicate: false,
    code,
    requestId,
    result: null,
    receipts: [],
    projectionPending: [],
    notice: { tone: "warning", title: "Survey not advanced", detail },
    emittedEvents: [],
    snapshot,
    control
  };
}

function receiptKinds(stage: AshenReefSurveyStage): readonly AshenReefSurveyReceiptKind[] {
  return stage === "ruins_confirmation"
    ? ASHEN_REEF_SURVEY_FINAL_RECEIPT_KINDS
    : ASHEN_REEF_SURVEY_COMMON_RECEIPT_KINDS;
}

function createSurveyEvent(
  ids: NonNullable<ReturnType<typeof deriveIds>>,
  result: AshenReefSurveyResultState,
  projectionPending: boolean
): PlayerSurveyAdvancedEvent {
  return {
    id: ids.eventId,
    type: PLAYER_SURVEY_ADVANCED_EVENT_TYPE,
    domain: "player",
    atTick: result.appliedTick,
    payload: {
      requestId: result.requestId,
      occurrenceId: result.occurrenceId,
      resultId: result.resultId,
      playerId: result.characterId,
      questId: QUEST_ID,
      stage: result.stage,
      resultCode: result.code,
      projectionPending
    }
  };
}

function appendProjectionRows(
  snapshot: SaveSnapshot,
  application: MaterialApplication,
  failures: Set<AshenReefSurveyProjectionKind>,
  resultId: string
): void {
  if (!failures.has("notification")) {
    const insertion = inspectProjectionDestination(
      snapshot,
      snapshot.sessionState.notifications,
      application.notification,
      { appliedTick: snapshot.clock.tick, stableId: resultId },
      "notification",
      8
    );
    if (insertion.code === "inserted") {
      snapshot.sessionState.notifications = insertion.rows;
    } else {
      failures.add("notification");
    }
  }
  if (!failures.has("chronicle")) {
    const insertion = inspectProjectionDestination(
      snapshot,
      snapshot.sessionState.chronicle,
      application.chronicle,
      { appliedTick: snapshot.clock.tick, stableId: resultId },
      "chronicle",
      48
    );
    if (insertion.code === "inserted") {
      snapshot.sessionState.chronicle = insertion.rows;
    } else {
      failures.add("chronicle");
    }
  }
}

function shouldRecordLegacyBaseline(facts: AshenReefSurveyMaterialFactsState): boolean {
  return facts.sectorCount > 0 ||
    facts.ruinsConfirmed ||
    facts.discoveryEntryState === "matching" ||
    facts.discoveryFlagPresent ||
    facts.operationProgress !== null;
}

function buildConsequenceReceipts(
  sourceSnapshot: SaveSnapshot,
  acceptedSnapshot: SaveSnapshot,
  application: MaterialApplication,
  ids: NonNullable<ReturnType<typeof deriveIds>>,
  requestId: string,
  occurrenceId: string,
  continuityId: string,
  sourceRevision: number,
  projectionFailures: ReadonlySet<AshenReefSurveyProjectionKind>
): AshenReefSurveyConsequenceReceiptState[] {
  const identity = acceptedSnapshot.campaignIdentity!;
  const base = {
    version: 1 as const,
    requestId,
    occurrenceId,
    resultId: ids.resultId,
    accountId: acceptedSnapshot.accountId,
    campaignId: identity.campaignId,
    continuityId,
    characterId: identity.characterId,
    sourceRevision,
    stage: application.stage,
    appliedTick: acceptedSnapshot.clock.tick
  };
  const receipts: AshenReefSurveyConsequenceReceiptState[] = [];
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.time_advance`,
    owner: "shared_time",
    kind: "time_advance",
    posture: "applied",
    effect: {
      startClock: clone(sourceSnapshot.clock),
      endClock: clone(acceptedSnapshot.clock),
      tickCount: 2,
      totalPlayTicksBefore: sourceSnapshot.playerState.saveMeta.totalPlayTicks,
      totalPlayTicksAfter: acceptedSnapshot.playerState.saveMeta.totalPlayTicks
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.body_advance`,
    owner: "player_body",
    kind: "body_advance",
    posture: "applied",
    effect: {
      profile: clone(application.profile),
      before: clone(application.bodyBefore),
      after: clone(acceptedSnapshot.playerState.bodyState),
      timeline: clone(application.bodyTimeline)
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.attribute_load`,
    owner: "player_stat_growth",
    kind: "attribute_load",
    posture: "applied",
    effect: {
      profile: clone(ASHEN_REEF_SURVEY_ATTRIBUTE_PROFILE),
      before: clone(application.statGrowthBefore),
      after: clone(acceptedSnapshot.playerState.statGrowth),
      applications: 2
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.resource_cost`,
    owner: "player_resources",
    kind: "resource_cost",
    posture: "applied",
    effect: {
      before: clone(application.resourcesBefore),
      afterNaturalResolution: clone(application.resourcesAfterNatural),
      after: clone(acceptedSnapshot.playerState.resources),
      explicitStaminaCost: 10,
      explicitMpCost: 3
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.skill_progress`,
    owner: "player_skill",
    kind: "skill_progress",
    posture: application.skill.blockedGate === null ? "applied" : "blocked_at_gate",
    effect: {
      skillId: application.skill.skillId,
      requestedDelta: 1,
      appliedDelta: application.skill.appliedDelta,
      rankBefore: application.skill.rankBefore,
      rankAfter: application.skill.rankAfter,
      blockedGate: application.skill.blockedGate,
      requiredBand: application.skill.requiredBand
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.survey_progress`,
    owner: "player_activity.survey",
    kind: "survey_progress",
    posture: "applied",
    effect: {
      before: clone(application.materialBefore),
      after: clone(application.materialAfter)
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.quest_progress_sync`,
    owner: "quest_journal_sync",
    kind: "quest_progress_sync",
    posture: "applied",
    effect: {
      questId: QUEST_ID,
      category: "active",
      tracked: true,
      statusLabel: application.questAfter.statusLabel ?? "In progress",
      objectives: clone(application.questAfter.objectives)
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.survey_operation`,
    owner: "survey_operation",
    kind: "survey_operation",
    posture: "applied",
    effect: {
      before: clone(application.operationBefore),
      after: clone(application.operationAfter)
    }
  });
  if (application.stage === "ruins_confirmation") {
    if (!application.discoveryAfter || !acceptedSnapshot.sessionState.currentActivity) {
      throw new Error("Final survey owner consequences are incomplete.");
    }
    receipts.push({
      ...base,
      receiptId: `survey_consequence.${ids.uuid}.player_discovery`,
      owner: "player_discovery",
      kind: "player_discovery",
      posture: "applied",
      effect: {
        before: clone(application.discoveryBefore),
        after: clone(application.discoveryAfter)
      }
    });
    receipts.push({
      ...base,
      receiptId: `survey_consequence.${ids.uuid}.discovery_flag`,
      owner: "survey_discovery_compatibility",
      kind: "discovery_flag",
      posture: "applied",
      effect: { before: application.discoveryFlagBefore, after: true }
    });
    receipts.push({
      ...base,
      receiptId: `survey_consequence.${ids.uuid}.codex_visibility_projection`,
      owner: "codex_visibility_sync",
      kind: "codex_visibility_projection",
      posture: "applied",
      effect: {
        codexEntryId: CODEX_ID,
        outcome: application.codexOutcome as Exclude<AshenReefSurveyResultState["codexOutcome"], "not_applicable">
      }
    });
    receipts.push({
      ...base,
      receiptId: `survey_consequence.${ids.uuid}.activity_transition`,
      owner: "activity_state",
      kind: "activity_transition",
      posture: "applied",
      effect: {
        before: clone(application.currentActivityBefore),
        after: clone(acceptedSnapshot.sessionState.currentActivity)
      }
    });
  }
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.notification_projection`,
    owner: "survey_notification_projection",
    kind: "notification_projection",
    posture: projectionFailures.has("notification") ? "projection_pending" : "applied",
    effect: {
      projectionId: ids.notificationId,
      row: clone(application.notification),
      cap: 8
    }
  });
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.chronicle_projection`,
    owner: "survey_chronicle_projection",
    kind: "chronicle_projection",
    posture: projectionFailures.has("chronicle") ? "projection_pending" : "applied",
    effect: {
      projectionId: ids.chronicleId,
      row: clone(application.chronicle),
      cap: 48
    }
  });
  const eventPayload: PlayerSurveyAdvancedEventPayload = {
    requestId,
    occurrenceId,
    resultId: ids.resultId,
    playerId: identity.characterId,
    questId: QUEST_ID,
    stage: application.stage,
    resultCode:
      application.stage === "ruins_confirmation"
        ? "survey_packet_completed"
        : "survey_sector_logged",
    projectionPending: projectionFailures.size > 0
  };
  receipts.push({
    ...base,
    receiptId: `survey_consequence.${ids.uuid}.event_projection`,
    owner: "survey_event_projection",
    kind: "event_projection",
    posture: projectionFailures.has("event") ? "projection_pending" : "applied",
    effect: {
      projectionId: ids.eventId,
      eventType: PLAYER_SURVEY_ADVANCED_EVENT_TYPE,
      payload: eventPayload
    }
  });
  return receipts;
}

function mapPreparationRejection(
  reason: Extract<ReturnType<typeof preparePlayerSurveyCampaignMutation>, { accepted: false }>["reason"]
): PlayerSurveyActivityAdvancementRejectionCode {
  switch (reason) {
    case "wrong_account": return "wrong_account";
    case "wrong_campaign": return "wrong_campaign";
    case "wrong_artifact": return "wrong_artifact";
    case "wrong_publication": return "wrong_publication";
    case "stale_revision": return "stale_revision";
    case "wrong_continuity": return "wrong_control";
    case "recovery_pending": return "recovery_pending";
    case "invalid_authority": return "invalid_authority";
  }
}

export function executePlayerSurveyActivityAdvancementCommand(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  commandValue: unknown,
  options: {
    failOwner?: Exclude<
      AshenReefSurveyReceiptKind,
      "notification_projection" | "chronicle_projection" | "event_projection"
    >;
    failProjections?: AshenReefSurveyProjectionKind[];
  } = {}
): PlayerSurveyActivityAdvancementResult {
  if (!isCommandShape(commandValue)) {
    return rejectedResult(snapshot, control, "malformed_command", null, "The survey command is malformed.");
  }
  const command = commandValue;
  const ids = deriveIds(command.requestId)!;
  let serializedCommandIntent: string;
  try {
    serializedCommandIntent = serializeAshenReefSurveyNormalizedIntent(command.normalizedIntent);
  } catch {
    return rejectedResult(snapshot, control, "malformed_command", command.requestId, "The survey command intent is not serializable.");
  }

  const rawRequests = snapshot.authorityLedger?.ashenReefSurvey?.requests;
  const rawMatches = Array.isArray(rawRequests)
    ? rawRequests.filter((entry) => entry?.requestId === command.requestId)
    : [];
  if (rawMatches.length > 1) {
    return rejectedResult(snapshot, control, "invalid_authority", command.requestId, "Survey request authority is duplicated.");
  }
  if (rawMatches.length === 1) {
    if (!isTargetCampaignSnapshot(snapshot)) {
      return rejectedResult(snapshot, control, "invalid_authority", command.requestId, "Persisted survey authority is incomplete or conflicting.");
    }
    const retained = rawMatches[0]!;
    if (
      command.canonicalIntent !== retained.canonicalIntent ||
      serializedCommandIntent !== retained.canonicalIntent
    ) {
      return rejectedResult(snapshot, control, "conflicting_retry", command.requestId, "That survey request id was reused with different material intent.");
    }
    const result = snapshot.authorityLedger!.ashenReefSurvey!.results.find(
      (entry) => entry.requestId === command.requestId
    )!;
    const receipts = snapshot.authorityLedger!.ashenReefSurvey!.consequenceReceipts.filter(
      (entry) => entry.resultId === result.resultId
    );
    return {
      accepted: false,
      duplicate: true,
      code: "duplicate",
      requestId: command.requestId,
      result: clone(result),
      receipts: clone(receipts),
      projectionPending: listPendingPlayerSurveyProjectionRepairs(snapshot)
        .filter((entry) => entry.resultId === result.resultId)
        .map((entry) => entry.projectionKind),
      notice: {
        tone: "neutral",
        title: "Survey result already accepted",
        detail: "The original survey result is retained; no effect or projection was repeated."
      },
      emittedEvents: [],
      snapshot,
      control
    };
  }

  if (!isTargetCampaignSnapshot(snapshot)) {
    return rejectedResult(snapshot, control, "invalid_authority", command.requestId, "The campaign snapshot is not valid survey authority.");
  }

  if (
    control.acceptedMutationIds.includes(command.requestId) ||
    control.retainedMutationResults.some((entry) => entry.mutationId === command.requestId)
  ) {
    return rejectedResult(snapshot, control, "conflicting_retry", command.requestId, "Transient campaign state conflicts with the missing durable survey request.");
  }
  let canonicalIntent: string;
  try {
    canonicalIntent = serializeAshenReefSurveyNormalizedIntent(command.normalizedIntent);
  } catch {
    return rejectedResult(snapshot, control, "malformed_command", command.requestId, "The survey command intent is malformed.");
  }
  if (
    command.canonicalIntent !== canonicalIntent ||
    serializedCommandIntent !== canonicalIntent
  ) {
    return rejectedResult(snapshot, control, "malformed_command", command.requestId, "The survey command intent is not canonically serialized.");
  }
  const identity = snapshot.campaignIdentity!;
  const intent = command.normalizedIntent;
  if (intent.accountId !== snapshot.accountId) {
    return rejectedResult(snapshot, control, "wrong_account", command.requestId, "The survey request belongs to another account.");
  }
  if (intent.characterId !== snapshot.playerState.playerId || intent.characterId !== identity.characterId) {
    return rejectedResult(snapshot, control, "wrong_player", command.requestId, "The survey request belongs to another character.");
  }
  if (intent.campaignId !== identity.campaignId) {
    return rejectedResult(snapshot, control, "wrong_campaign", command.requestId, "The survey request belongs to another campaign.");
  }
  if (control.accountId !== snapshot.accountId || control.campaignId !== identity.campaignId) {
    return rejectedResult(snapshot, control, "wrong_control", command.requestId, "Campaign control does not match the survey snapshot.");
  }
  if (intent.sourceArtifactId !== control.loadedArtifactId) {
    return rejectedResult(snapshot, control, "wrong_artifact", command.requestId, "The survey request targets another loaded artifact.");
  }
  if (intent.sourcePublicationId !== control.loadedPublicationId) {
    return rejectedResult(snapshot, control, "wrong_publication", command.requestId, "The survey request targets another loaded publication.");
  }
  if (
    intent.sourceRevision !== control.sessionRevision ||
    intent.expectedRevision !== control.sessionRevision
  ) {
    return rejectedResult(snapshot, control, "stale_revision", command.requestId, "The survey request targets a stale campaign revision.");
  }
  if (intent.sourceContinuityId !== identity.continuityId) {
    return rejectedResult(snapshot, control, "wrong_control", command.requestId, "The survey request targets another continuity.");
  }
  if (snapshot.capturedAtTick !== snapshot.clock.tick || intent.expectedTick !== snapshot.clock.tick) {
    return rejectedResult(snapshot, control, "stale_snapshot", command.requestId, "The survey request no longer targets the current snapshot tick.");
  }
  const plan = resolvePlayerSurveyActivityAdvancementPlan(snapshot);
  if (!plan.accepted) {
    return rejectedResult(snapshot, control, plan.code, command.requestId, plan.reason);
  }
  let expectedCanonicalIntent: string;
  try {
    expectedCanonicalIntent = serializeAshenReefSurveyNormalizedIntent(
      buildNormalizedIntent(snapshot, control, plan)
    );
  } catch {
    return rejectedResult(
      snapshot,
      control,
      "invalid_authority",
      command.requestId,
      "The current survey owner inputs are not valid command authority."
    );
  }
  if (expectedCanonicalIntent !== command.canonicalIntent) {
    return rejectedResult(snapshot, control, "stale_snapshot", command.requestId, "The survey request no longer matches the current material state.");
  }

  let preparation: ReturnType<typeof preparePlayerSurveyCampaignMutation>;
  try {
    preparation = preparePlayerSurveyCampaignMutation(control, {
      mutationId: command.requestId,
      sourceArtifactId: intent.sourceArtifactId,
      sourcePublicationId: intent.sourcePublicationId,
      sourceRevision: intent.sourceRevision,
      sourceSnapshot: snapshot
    });
  } catch {
    return rejectedResult(snapshot, control, "transition_failed", command.requestId, "Survey campaign preparation failed safely.");
  }
  if (!preparation.accepted) {
    return rejectedResult(
      snapshot,
      control,
      mapPreparationRejection(preparation.reason),
      command.requestId,
      `Survey campaign preparation failed: ${preparation.reason}.`
    );
  }

  try {
    if (options.failOwner) throw new Error(`Injected ${options.failOwner} owner failure.`);
    const projectionFailures = new Set(options.failProjections ?? []);
    const application = applyMaterialStage(
      preparation.candidateSnapshot,
      plan.stage,
      { notification: ids.notificationId, chronicle: ids.chronicleId }
    );
    if (
      !projectionRowsEqual(application.materialBefore, intent.materialFacts) ||
      !projectionRowsEqual(application.materialVersions, intent.materialVersions)
    ) throw new Error("Prepared survey state diverged from the normalized request.");

    appendProjectionRows(application.snapshot, application, projectionFailures, ids.resultId);
    const occurrenceId = ids.occurrenceId;
    const receipts = buildConsequenceReceipts(
      snapshot,
      application.snapshot,
      application,
      ids,
      command.requestId,
      occurrenceId,
      preparation.acceptedContinuityId,
      intent.sourceRevision,
      projectionFailures
    );
    const requiredReceiptIds = receiptKinds(plan.stage).map(
      (kind) => `survey_consequence.${ids.uuid}.${kind}`
    );
    const result: AshenReefSurveyResultState = {
      version: 1,
      resultId: ids.resultId,
      requestId: command.requestId,
      occurrenceId,
      accountId: snapshot.accountId,
      campaignId: identity.campaignId,
      continuityId: preparation.acceptedContinuityId,
      characterId: identity.characterId,
      questId: QUEST_ID,
      code: plan.stage === "ruins_confirmation" ? "survey_packet_completed" : "survey_sector_logged",
      stage: plan.stage,
      startTick: snapshot.clock.tick,
      appliedTick: application.snapshot.clock.tick,
      tickCount: 2,
      materialBefore: clone(application.materialBefore),
      materialAfter: clone(application.materialAfter),
      resourceCosts: { stamina: 10, mp: 3, hp: 0 },
      nonProposals: clone(plan.nonProposals),
      skill: {
        skillId: application.skill.skillId,
        requestedDelta: 1,
        appliedDelta: application.skill.appliedDelta,
        blockedGate: application.skill.blockedGate,
        requiredBand: application.skill.requiredBand
      },
      discoveryOutcome:
        plan.stage !== "ruins_confirmation"
          ? "not_applicable"
          : application.discoveryBefore
            ? "retained_existing"
            : "created",
      codexOutcome: application.codexOutcome,
      operation: clone(application.operationAfter),
      currentActivityOutcome: clone(application.snapshot.sessionState.currentActivity),
      requiredReceiptIds,
      projectionIds: {
        event: ids.eventId,
        notification: ids.notificationId,
        chronicle: ids.chronicleId
      },
      synchronizationVersion: 1,
      synchronizationPostcondition: "coherent",
      notice: clone(application.notice)
    };

    const existingAuthority = application.snapshot.authorityLedger?.ashenReefSurvey;
    const authority: AshenReefSurveyAuthorityState = existingAuthority
      ? clone(existingAuthority)
      : createEmptyAshenReefSurveyAuthority();
    if (
      authority.requests.length === 0 &&
      !authority.legacyBaseline &&
      shouldRecordLegacyBaseline(application.materialBefore)
    ) {
      authority.legacyBaseline = {
        version: 1,
        baselineId: `survey_legacy_baseline.${preparation.sourceContinuityId}`,
        accountId: snapshot.accountId,
        campaignId: identity.campaignId,
        continuityId: preparation.sourceContinuityId,
        characterId: identity.characterId,
        sourceArtifactId: intent.sourceArtifactId,
        sourcePublicationId: intent.sourcePublicationId,
        sourceRevision: intent.sourceRevision,
        observedAtTick: snapshot.clock.tick,
        materialFacts: clone(application.materialBefore)
      };
    }
    authority.requests.push({
      version: 1,
      normalizationVersion: 1,
      requestId: command.requestId,
      normalizedIntent: clone(intent),
      canonicalIntent: command.canonicalIntent,
      acceptedContinuityId: preparation.acceptedContinuityId,
      occurrenceId,
      posture: "admitted"
    });
    authority.occurrences.push({
      version: 1,
      occurrenceId,
      requestId: command.requestId,
      accountId: snapshot.accountId,
      campaignId: identity.campaignId,
      continuityId: preparation.acceptedContinuityId,
      characterId: identity.characterId,
      stage: plan.stage,
      acceptedStartTick: snapshot.clock.tick,
      sourceArtifactId: intent.sourceArtifactId,
      sourcePublicationId: intent.sourcePublicationId,
      sourceRevision: intent.sourceRevision,
      materialVersions: clone(intent.materialVersions)
    });
    authority.results.push(result);
    authority.consequenceReceipts.push(...receipts);
    application.snapshot.authorityLedger = {
      ...application.snapshot.authorityLedger!,
      ashenReefSurvey: authority
    };
    if (!isTargetCampaignSnapshot(application.snapshot)) {
      throw new Error("Completed survey authority failed deep validation.");
    }

    const admission = commitPreparedPlayerSurveyCampaignMutation(
      control,
      snapshot,
      preparation,
      application.snapshot,
      result.resultId
    );
    if (!admission.accepted) {
      return rejectedResult(snapshot, control, "transition_failed", command.requestId, "Survey campaign commit failed atomically.");
    }
    const event = createSurveyEvent(ids, result, projectionFailures.size > 0);
    return {
      accepted: true,
      duplicate: false,
      code: "survey_advanced",
      requestId: command.requestId,
      result: clone(result),
      receipts: clone(receipts),
      projectionPending: [...projectionFailures],
      notice: clone(application.notice),
      emittedEvents: projectionFailures.has("event") ? [] : [event],
      snapshot: admission.snapshot,
      control: admission.control
    };
  } catch {
    return rejectedResult(snapshot, control, "transition_failed", command.requestId, "The survey transition failed before acceptance; no state was changed.");
  }
}

type OrderedSurveyProjectionKind = "notification" | "chronicle";

type ProjectionAuthorityKey = {
  appliedTick: number;
  stableId: string;
};

type ProjectionDestinationInspection<T extends { id: string }> =
  | { code: "already_correct"; observed: null; rows: T[] }
  | { code: "inserted"; observed: "missing"; rows: T[] }
  | { code: "replaced"; observed: "malformed"; rows: T[] }
  | { code: "reordered"; observed: "misordered"; rows: T[] }
  | { code: "retention_expired"; observed: "missing"; rows: T[] }
  | { code: "invalid"; observed: null; rows: T[] };

function canonicalProjectionValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalProjectionValue);
  if (typeof value !== "object" || value === null) return value;
  return Object.keys(value as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = canonicalProjectionValue((value as Record<string, unknown>)[key]);
      return result;
    }, {});
}

function projectionRowsEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalProjectionValue(left)) === JSON.stringify(canonicalProjectionValue(right));
}

function compareProjectionAuthority(left: ProjectionAuthorityKey, right: ProjectionAuthorityKey): number {
  if (left.appliedTick !== right.appliedTick) return left.appliedTick > right.appliedTick ? -1 : 1;
  return left.stableId < right.stableId ? -1 : left.stableId > right.stableId ? 1 : 0;
}

function resolveProjectionAuthorityKey(
  snapshot: SaveSnapshot,
  id: string,
  kind: OrderedSurveyProjectionKind,
  targetId: string,
  targetKey: ProjectionAuthorityKey
): { code: "known"; key: ProjectionAuthorityKey } | { code: "opaque" } | { code: "invalid" } {
  if (id === targetId) return { code: "known", key: targetKey };
  const matches = snapshot.authorityLedger?.ashenReefSurvey?.results.filter(
    (entry) => entry.projectionIds[kind] === id
  ) ?? [];
  if (matches.length > 1) return { code: "invalid" };
  if (matches.length === 1) {
    return {
      code: "known",
      key: { appliedTick: matches[0]!.appliedTick, stableId: matches[0]!.resultId }
    };
  }
  return { code: "opaque" };
}

function placeOrderedProjectionRows<T extends { id: string }>(
  original: Array<{ row: T; key: ProjectionAuthorityKey | null }>
): T[] {
  const knownSlots = original
    .map((entry, index) => entry.key === null ? -1 : index)
    .filter((index) => index >= 0);
  const orderedKnownRows = original
    .filter((entry): entry is { row: T; key: ProjectionAuthorityKey } => entry.key !== null)
    .sort((left, right) => compareProjectionAuthority(left.key, right.key))
    .map((entry) => entry.row);
  const nextRows = original.map((entry) => entry.row);
  knownSlots.forEach((slot, index) => {
    nextRows[slot] = orderedKnownRows[index]!;
  });
  return nextRows;
}

function mergeOrderedProjectionRows<T extends { id: string }>(
  original: Array<{ row: T; key: ProjectionAuthorityKey | null }>
): T[] {
  const orderedKnownRows = original
    .filter((entry): entry is { row: T; key: ProjectionAuthorityKey } => entry.key !== null)
    .sort((left, right) => compareProjectionAuthority(left.key, right.key))
    .map((entry) => entry.row);
  const opaqueRows = original.filter((entry) => entry.key === null).map((entry) => entry.row);
  return [...orderedKnownRows, ...opaqueRows];
}

function inspectProjectionDestination<T extends { id: string }>(
  snapshot: SaveSnapshot,
  rows: readonly T[],
  expectedRow: T,
  targetKey: ProjectionAuthorityKey,
  kind: OrderedSurveyProjectionKind,
  cap: number,
  preserveOpaqueSlots = false
): ProjectionDestinationInspection<T> {
  const unchanged = [...rows];
  if (!Number.isSafeInteger(cap) || cap < 1 || rows.length > cap) {
    return { code: "invalid", observed: null, rows: unchanged };
  }
  if (typeof expectedRow.id !== "string" || expectedRow.id.trim() !== expectedRow.id || expectedRow.id.length === 0) {
    return { code: "invalid", observed: null, rows: unchanged };
  }
  const ids = rows.map((entry) => entry?.id);
  if (
    ids.some((id) => typeof id !== "string" || id.trim() !== id || id.length === 0) ||
    new Set(ids).size !== ids.length
  ) {
    return { code: "invalid", observed: null, rows: unchanged };
  }

  const matchingIndex = rows.findIndex((entry) => entry.id === expectedRow.id);
  const matchingRowIsExact = matchingIndex >= 0 &&
    projectionRowsEqual(rows[matchingIndex], expectedRow);
  const descriptors: Array<{ row: T; key: ProjectionAuthorityKey | null }> = [];
  for (let index = 0; index < rows.length; index += 1) {
    const original = rows[index]!;
    const row = index === matchingIndex && !matchingRowIsExact
      ? clone(expectedRow)
      : original;
    const resolution = resolveProjectionAuthorityKey(
      snapshot,
      row.id,
      kind,
      expectedRow.id,
      targetKey
    );
    if (resolution.code === "invalid") {
      return { code: "invalid", observed: null, rows: unchanged };
    }
    descriptors.push({ row, key: resolution.code === "known" ? resolution.key : null });
  }

  if (matchingIndex < 0) {
    if (rows.length >= cap && descriptors.some((entry) => entry.key === null)) {
      return { code: "retention_expired", observed: "missing", rows: unchanged };
    }
    descriptors.push({ row: clone(expectedRow), key: targetKey });
  }

  let nextRows = preserveOpaqueSlots
    ? placeOrderedProjectionRows(descriptors)
    : mergeOrderedProjectionRows(descriptors);

  if (nextRows.length > cap) {
    if (descriptors.some((entry) => entry.key === null)) {
      return { code: "retention_expired", observed: "missing", rows: unchanged };
    }
    nextRows = nextRows.slice(0, cap);
    if (!nextRows.some((entry) => entry.id === expectedRow.id)) {
      return { code: "retention_expired", observed: "missing", rows: unchanged };
    }
  }

  if (matchingIndex < 0) {
    return { code: "inserted", observed: "missing", rows: nextRows };
  }
  if (!matchingRowIsExact) {
    return { code: "replaced", observed: "malformed", rows: nextRows };
  }
  return projectionRowsEqual(rows, nextRows)
    ? { code: "already_correct", observed: null, rows: unchanged }
    : { code: "reordered", observed: "misordered", rows: nextRows };
}

type SurveyProjectionRepairInspection =
  | { code: "invalid" | "already_correct" | "retention_terminal" | "newer_authority" }
  | {
      code: "actionable";
      result: AshenReefSurveyResultState;
      receipt: AshenReefSurveyConsequenceReceiptState;
      priorRepairs: AshenReefSurveyProjectionRepairState[];
      observed: "missing" | "malformed" | "misordered";
      outcome: AshenReefSurveyProjectionRepairState["outcome"];
      rows: NotificationState[] | ChronicleEventState[] | null;
    };

function inspectPlayerSurveyProjectionRepair(
  snapshot: SaveSnapshot,
  resultId: string,
  projectionKind: AshenReefSurveyProjectionKind
): SurveyProjectionRepairInspection {
  const authority = snapshot.authorityLedger?.ashenReefSurvey;
  if (!authority) return { code: "invalid" };
  const resultMatches = authority.results.filter((entry) => entry.resultId === resultId);
  if (resultMatches.length !== 1) return { code: "invalid" };
  const result = resultMatches[0]!;
  if (
    authority.corrections.some(
      (entry) =>
        entry.supersededResultId === resultId ||
        entry.reconciliations.some((reconciliation) => reconciliation.status === "pending")
    )
  ) return { code: "newer_authority" };

  const receiptKind = `${projectionKind}_projection` as
    | "notification_projection"
    | "chronicle_projection"
    | "event_projection";
  const receiptMatches = authority.consequenceReceipts.filter(
    (entry) => entry.resultId === resultId && entry.kind === receiptKind
  );
  if (receiptMatches.length !== 1) return { code: "invalid" };
  const receipt = receiptMatches[0]!;
  const priorRepairs = authority.projectionRepairs.filter(
    (entry) => entry.resultId === resultId && entry.projectionKind === projectionKind
  );
  const latestRepair = priorRepairs[priorRepairs.length - 1];
  if (latestRepair?.outcome === "retention_expired") return { code: "retention_terminal" };

  if (projectionKind === "event") {
    if (
      receipt.kind !== "event_projection" ||
      receipt.posture !== "projection_pending" ||
      latestRepair?.outcome === "event_reemitted"
    ) return { code: "already_correct" };
    return {
      code: "actionable",
      result,
      receipt,
      priorRepairs,
      observed: "missing",
      outcome: "event_reemitted",
      rows: null
    };
  }

  if (projectionKind === "notification") {
    if (receipt.kind !== "notification_projection") return { code: "invalid" };
    const destination = inspectProjectionDestination(
      snapshot,
      snapshot.sessionState.notifications,
      receipt.effect.row,
      { appliedTick: result.appliedTick, stableId: result.resultId },
      "notification",
      receipt.effect.cap,
      true
    );
    if (destination.code === "invalid") return { code: "invalid" };
    if (destination.code === "already_correct") return { code: "already_correct" };
    return {
      code: "actionable",
      result,
      receipt,
      priorRepairs,
      observed: destination.observed,
      outcome: destination.code === "retention_expired" ? "retention_expired" : destination.code,
      rows: destination.rows
    };
  }

  if (receipt.kind !== "chronicle_projection") return { code: "invalid" };
  const destination = inspectProjectionDestination(
    snapshot,
    snapshot.sessionState.chronicle,
    receipt.effect.row,
    { appliedTick: result.appliedTick, stableId: result.resultId },
    "chronicle",
    receipt.effect.cap,
    true
  );
  if (destination.code === "invalid") return { code: "invalid" };
  if (destination.code === "already_correct") return { code: "already_correct" };
  return {
    code: "actionable",
    result,
    receipt,
    priorRepairs,
    observed: destination.observed,
    outcome: destination.code === "retention_expired" ? "retention_expired" : destination.code,
    rows: destination.rows
  };
}

export function repairPlayerSurveyActivityProjection(
  snapshot: SaveSnapshot,
  control: CampaignSessionControl,
  resultId: string,
  projectionKind: AshenReefSurveyProjectionKind
): PlayerSurveyProjectionRepairResult {
  const invalid = (code: PlayerSurveyProjectionRepairResult["code"] = "projection_invalid"):
    PlayerSurveyProjectionRepairResult => ({
      accepted: false,
      duplicate: false,
      code,
      repair: null,
      emittedEvents: [],
      snapshot,
      control
    });
  try {
    if (!isTargetCampaignSnapshot(snapshot)) return invalid();
    const inspection = inspectPlayerSurveyProjectionRepair(snapshot, resultId, projectionKind);
    if (inspection.code === "invalid") return invalid();
    if (inspection.code === "newer_authority") return invalid("projection_newer_authority");
    if (inspection.code === "already_correct") {
      return { ...invalid("projection_already_correct"), duplicate: true };
    }
    if (inspection.code === "retention_terminal") {
      return { ...invalid("projection_retention_expired"), duplicate: true };
    }
    if (inspection.code !== "actionable") return invalid();

    const { result, receipt, priorRepairs, observed, outcome } = inspection;
    const ordinal = priorRepairs.length + 1;
    const ids = deriveIds(result.requestId);
    if (!ids) return invalid();
    const repairId = `survey_projection_repair.${ids.uuid}.${projectionKind}.${ordinal}`;
    let preparation: ReturnType<typeof preparePlayerSurveyCampaignMutation>;
    try {
      preparation = preparePlayerSurveyCampaignMutation(control, {
        mutationId: repairId,
        sourceArtifactId: control.loadedArtifactId,
        sourcePublicationId: control.loadedPublicationId,
        sourceRevision: control.sessionRevision,
        sourceSnapshot: snapshot
      });
    } catch {
      return invalid();
    }
    if (!preparation.accepted) return invalid();
    const candidate = preparation.candidateSnapshot;
    const preparedInspection = inspectPlayerSurveyProjectionRepair(candidate, resultId, projectionKind);
    if (
      preparedInspection.code !== "actionable" ||
      preparedInspection.receipt.receiptId !== receipt.receiptId ||
      preparedInspection.priorRepairs.length !== priorRepairs.length ||
      preparedInspection.observed !== observed ||
      preparedInspection.outcome !== outcome
    ) return invalid();

    if (
      projectionKind === "notification" &&
      receipt.kind === "notification_projection" &&
      outcome !== "retention_expired" &&
      preparedInspection.rows !== null
    ) {
      candidate.sessionState.notifications = preparedInspection.rows as NotificationState[];
    }
    if (
      projectionKind === "chronicle" &&
      receipt.kind === "chronicle_projection" &&
      outcome !== "retention_expired" &&
      preparedInspection.rows !== null
    ) {
      candidate.sessionState.chronicle = preparedInspection.rows as ChronicleEventState[];
    }

    const repair: AshenReefSurveyProjectionRepairState = {
      version: 1,
      repairId,
      requestId: result.requestId,
      resultId,
      receiptId: receipt.receiptId,
      campaignId: result.campaignId,
      continuityId: preparation.acceptedContinuityId,
      characterId: result.characterId,
      projectionKind,
      ordinal,
      observed,
      outcome,
      appliedTick: candidate.clock.tick
    };
    candidate.authorityLedger!.ashenReefSurvey!.projectionRepairs.push(repair);
    if (!isTargetCampaignSnapshot(candidate)) return invalid();
    const admission = commitPreparedPlayerSurveyCampaignMutation(
      control,
      snapshot,
      preparation,
      candidate,
      `survey_projection_repair_result.${ids.uuid}.${projectionKind}.${ordinal}`
    );
    if (!admission.accepted) return invalid();
    const emittedEvents: PlayerSurveyAdvancedEvent[] =
      projectionKind === "event" && receipt.kind === "event_projection"
        ? [{
            id: result.projectionIds.event,
            type: PLAYER_SURVEY_ADVANCED_EVENT_TYPE,
            domain: "player",
            atTick: result.appliedTick,
            payload: receipt.effect.payload as unknown as PlayerSurveyAdvancedEventPayload
          }]
        : [];
    return {
      accepted: true,
      duplicate: false,
      code: outcome === "retention_expired" ? "projection_retention_expired" : "projection_repaired",
      repair,
      emittedEvents,
      snapshot: admission.snapshot,
      control: admission.control
    };
  } catch {
    return invalid();
  }
}

export function listPendingPlayerSurveyProjectionRepairs(
  snapshot: SaveSnapshot
): PendingPlayerSurveyProjectionRepair[] {
  try {
    if (!isTargetCampaignSnapshot(snapshot)) return [];
    const authority = snapshot.authorityLedger?.ashenReefSurvey;
    if (!authority) return [];
    return authority.consequenceReceipts
      .filter(
        (receipt) =>
          receipt.kind === "notification_projection" ||
          receipt.kind === "chronicle_projection" ||
          receipt.kind === "event_projection"
      )
      .map((receipt) => ({
        resultId: receipt.resultId,
        projectionKind: receipt.kind.replace("_projection", "") as AshenReefSurveyProjectionKind
      }))
      .filter(
        (candidate) =>
          inspectPlayerSurveyProjectionRepair(
            snapshot,
            candidate.resultId,
            candidate.projectionKind
          ).code === "actionable"
      );
  } catch {
    return [];
  }
}
