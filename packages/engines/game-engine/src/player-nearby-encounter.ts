import { serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import type { ResolvedSpawnCandidateState, SaveSnapshot } from "../../../shared/types/src/index.js";
import { resolveSpawnCandidates } from "../../world-engine/src/spawn/index.js";
import { admitCampaignMutation, type CampaignSessionControl } from "./campaign-session.js";
import { createAuthorityId } from "./campaign-rules.js";
import { createEncounterFromSpawnCandidate, listLegalPlayerCombatCommands, queueManualCombatCommand, tickCombatFoundation } from "./combat/index.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";
import { hasPendingNormalDefeat } from "./normal-defeat.js";
import { nearbyExplorationCatalog } from "./player-nearby-exploration.js";

export interface NearbyEncounterAdmissionCommand {
  version: 1;
  type: "player.encounter.admit";
  requestId: string;
  candidate: ResolvedSpawnCandidateState;
  sourceArtifactId: string;
  sourceRevision: number;
  sourceContinuityId: string;
  sourceSnapshot: string;
}
export interface NearbyEncounterStepCommand {
  version: 1;
  type: "player.encounter.step";
  requestId: string;
  encounterId: string;
  actorCombatantId: string;
  sourceArtifactId: string;
  sourceRevision: number;
  sourceSnapshot: string;
  expectedTick: number;
  actionType: string;
  targetId: string | null;
}
export type NearbyEncounterOutcome = {
  accepted: boolean;
  duplicate: boolean;
  code: string;
  message: string;
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
};

function outcome(snapshot: SaveSnapshot, control: CampaignSessionControl, code: string, message: string,
  accepted = false, duplicate = false): NearbyEncounterOutcome {
  return { accepted, duplicate, code, message, snapshot, control };
}
function same(left: unknown, right: unknown): boolean { return JSON.stringify(left) === JSON.stringify(right); }
function sourceCoherent(snapshot: SaveSnapshot, control: CampaignSessionControl): boolean {
  return !!snapshot.campaignIdentity && snapshot.accountId === control.accountId &&
    snapshot.campaignIdentity.campaignId === control.campaignId &&
    (snapshot.campaignIdentity.continuityId === (control.pendingContinuityId ?? control.loadedContinuityId)) &&
    snapshot.capturedAtTick === snapshot.clock.tick;
}
function ledger(snapshot: SaveSnapshot) {
  snapshot.authorityLedger ??= { version: 1, entries: [] };
  snapshot.authorityLedger.nearbyEncounters ??= { version: 1, admissions: [], commands: [] };
  return snapshot.authorityLedger.nearbyEncounters;
}
function validLedger(snapshot: SaveSnapshot): boolean {
  const value = snapshot.authorityLedger?.nearbyEncounters;
  if (!value) return true;
  if (value.version !== 1 || !Array.isArray(value.admissions) || !Array.isArray(value.commands)) return false;
  const requestIds = new Set<string>();
  const encounters = new Set<string>();
  for (const entry of value.admissions) {
    if (!entry || typeof entry.requestId !== "string" || !entry.candidate ||
        entry.requestId !== `encounter.admit.${entry.candidate.id}` ||
        entry.encounterId !== `${entry.candidate.encounterTemplateId}.${entry.admittedAtTick}` ||
        entry.admittedAtTick !== entry.candidate.selectedAtTick ||
        typeof entry.sourceArtifactId !== "string" || !Number.isSafeInteger(entry.sourceRevision) ||
        typeof entry.sourceContinuityId !== "string" || requestIds.has(entry.requestId) ||
        encounters.has(entry.encounterId)) return false;
    requestIds.add(entry.requestId);
    encounters.add(entry.encounterId);
  }
  for (const entry of value.commands) {
    if (!entry || typeof entry.requestId !== "string" || !entry.requestId ||
        typeof entry.encounterId !== "string" || !encounters.has(entry.encounterId) ||
        typeof entry.actorCombatantId !== "string" || typeof entry.sourceArtifactId !== "string" ||
        !Number.isSafeInteger(entry.sourceRevision) || !Number.isSafeInteger(entry.expectedTick) ||
        typeof entry.actionType !== "string" ||
        (entry.targetId !== null && typeof entry.targetId !== "string") ||
        !["active", "allies_victorious", "enemies_victorious"].includes(entry.result) ||
        requestIds.has(entry.requestId)) return false;
    requestIds.add(entry.requestId);
  }
  return true;
}
function candidateMatchesSource(snapshot: SaveSnapshot, candidate: ResolvedSpawnCandidateState): boolean {
  const context = snapshot.worldState.nearbyExplorationContext;
  const authored = nearbyExplorationCatalog.contexts.find((entry) => entry.id === context?.actionContextId);
  const region = nearbyExplorationCatalog.regions.find((entry) => entry.id === authored?.localRegionId);
  if (!context || !authored || authored.actionType !== "player.explore.nearby" ||
      authored.originSettlementId !== snapshot.playerState.location.settlementId ||
      snapshot.playerState.regionId !== context.regionId || context.regionId !== authored.localRegionId ||
      context.settlementId !== authored.originSettlementId || context.siteId !== null ||
      context.worldHexId !== authored.originWorldHexId ||
      context.worldHexEdgeId !== authored.worldHexEdgeId ||
      !same(context.habitatTags, authored.habitatTags) ||
      context.hazardSource !== authored.hazardSource ||
      context.hazardPressure !== region?.simulationProfile?.hazardPressure ||
      context.sourceActionId !== candidate.sourceActionId ||
      candidate.actionContextId !== authored.id || candidate.worldHexEdgeId !== authored.worldHexEdgeId ||
      candidate.hazardSource !== context.hazardSource || candidate.selectionVersion !== "ordinary.v1" ||
      candidate.selectedAtTick !== snapshot.clock.tick || candidate.disposition !== "hostile" ||
      !snapshot.sessionState.knownLocations.some((location) => location.known &&
        location.settlementId === authored.originSettlementId && location.regionId === context.regionId)) return false;
  const selectionKey = `${snapshot.campaignIdentity!.campaignId}:${candidate.sourceActionId}:${authored.id}:${authored.worldHexEdgeId}:ordinary.v1`;
  const resolved = resolveSpawnCandidates({ ...snapshot.worldState, encounterContext: context },
    snapshot.clock.tick, 0, { strict: true, selectionKey });
  return resolved.length > 0 && same(resolved[0], candidate);
}

export function createNearbyEncounterAdmissionCommand(snapshot: SaveSnapshot, control: CampaignSessionControl): NearbyEncounterAdmissionCommand | null {
  const candidate = snapshot.worldState.nearbyExplorationCandidate;
  if (!candidate || !snapshot.campaignIdentity) return null;
  return { version: 1, type: "player.encounter.admit", requestId: `encounter.admit.${candidate.id}`,
    candidate: structuredClone(candidate), sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision, sourceContinuityId: snapshot.campaignIdentity.continuityId,
    sourceSnapshot: serializeSnapshot(snapshot) };
}

export function admitNearbyEncounter(snapshot: SaveSnapshot, control: CampaignSessionControl, input: unknown,
  validateNativeSnapshot?: (snapshot: SaveSnapshot) => boolean): NearbyEncounterOutcome {
  const command = input as NearbyEncounterAdmissionCommand | null;
  if (!command || command.version !== 1 || command.type !== "player.encounter.admit" ||
      typeof command.requestId !== "string" || !command.candidate ||
      typeof command.candidate.id !== "string" || command.requestId !== `encounter.admit.${command.candidate.id}` ||
      typeof command.sourceArtifactId !== "string" || !Number.isSafeInteger(command.sourceRevision) ||
      typeof command.sourceContinuityId !== "string" || typeof command.sourceSnapshot !== "string")
    return outcome(snapshot, control, "malformed_command", "Encounter request is malformed.");
  if (!sourceCoherent(snapshot, control) || !validLedger(snapshot)) return outcome(snapshot, control, "invalid_authority", "Campaign authority is inconsistent.");
  const retained = snapshot.authorityLedger?.nearbyEncounters?.admissions.find((entry) => entry.requestId === command.requestId);
  if (retained) {
    if (!same(retained.candidate, command.candidate) || retained.sourceArtifactId !== command.sourceArtifactId ||
        retained.sourceRevision !== command.sourceRevision || retained.sourceContinuityId !== command.sourceContinuityId)
      return outcome(snapshot, control, "request_conflict", "Encounter request conflicts with its retained admission.");
    if (snapshot.gameState.activeEncounter?.encounterId !== retained.encounterId &&
        !snapshot.authorityLedger?.nearbyEncounters?.commands.some((entry) =>
          entry.encounterId === retained.encounterId && entry.result !== "active"))
      return outcome(snapshot, control, "invalid_authority", "Encounter admission has no active or resolved witness.");
    return outcome(snapshot, control, "duplicate", "Encounter was already admitted.", false, true);
  }
  if (hasPendingNormalDefeat(snapshot)) return outcome(snapshot, control, "recovery_pending", "Complete recovery first.");
  if (snapshot.gameState.activeEncounter) return outcome(snapshot, control, "active_encounter", "An encounter is already active.");
  if (command.sourceArtifactId !== control.loadedArtifactId || command.sourceRevision !== control.sessionRevision ||
      command.sourceContinuityId !== snapshot.campaignIdentity?.continuityId || command.sourceSnapshot !== serializeSnapshot(snapshot))
    return outcome(snapshot, control, "stale_snapshot", "Exploration changed before encounter admission.");
  if (!same(snapshot.worldState.nearbyExplorationCandidate, command.candidate) || !candidateMatchesSource(snapshot, command.candidate))
    return outcome(snapshot, control, "invalid_candidate", "The authored encounter candidate is missing or mismatched.");
  try {
    const next = structuredClone(snapshot);
    const encounter = createEncounterFromSpawnCandidate(next.gameState, next.playerState, command.candidate, next.clock.tick);
    if (!encounter) return outcome(snapshot, control, "invalid_candidate", "The authored encounter could not be built.");
    next.gameState.activeEncounter = encounter;
    next.worldState.nearbyExplorationCandidate = null;
    ledger(next).admissions.push({ requestId: command.requestId, candidate: structuredClone(command.candidate),
      sourceArtifactId: command.sourceArtifactId, sourceRevision: command.sourceRevision,
      sourceContinuityId: command.sourceContinuityId, encounterId: encounter.encounterId,
      admittedAtTick: next.clock.tick });
    next.sessionState.currentActivity = { id: `activity.encounter.${encounter.encounterId}`,
      label: "Nearby encounter", category: "Combat", detail: "Hostile foes are nearby." };
    const proposed = synchronizeGameplaySnapshot(next);
    const admission = admitCampaignMutation(control, { mutationId: command.requestId,
      sourceArtifactId: command.sourceArtifactId, sourceRevision: command.sourceRevision,
      ownerKind: "nearby_encounter", accepted: true, sourceSnapshot: snapshot, proposedSnapshot: proposed,
      resultId: encounter.encounterId,
      ...(snapshot.snapshotVersion === 'lineage.save_snapshot.v3' && validateNativeSnapshot
        ? { validateNativeSnapshot } : {}) });
    return admission.accepted
      ? outcome(admission.snapshot, admission.control, "encounter_admitted", "A nearby encounter has begun.", true)
      : outcome(snapshot, control, admission.reason, "Campaign admission declined the encounter.");
  } catch { return outcome(snapshot, control, "transition_failed", "Encounter admission failed without changing the campaign."); }
}

export function createNearbyEncounterStepCommand(snapshot: SaveSnapshot, control: CampaignSessionControl,
  actionType: string, targetId: string | null, requestId = createAuthorityId("encounter_step")): NearbyEncounterStepCommand | null {
  const encounter = snapshot.gameState.activeEncounter;
  if (!encounter) return null;
  const actor = encounter.combatants.find((item) => item.kind === "player" && item.disposition === "ally");
  if (!actor) return null;
  return { version: 1, type: "player.encounter.step", requestId, encounterId: encounter.encounterId,
    actorCombatantId: actor.id,
    sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
    sourceSnapshot: serializeSnapshot(snapshot), expectedTick: snapshot.clock.tick, actionType, targetId };
}

export function executeNearbyEncounterStep(snapshot: SaveSnapshot, control: CampaignSessionControl, input: unknown,
  validateNativeSnapshot?: (snapshot: SaveSnapshot) => boolean): NearbyEncounterOutcome {
  const command = input as NearbyEncounterStepCommand | null;
  if (!command || command.version !== 1 || command.type !== "player.encounter.step" ||
      typeof command.requestId !== "string" || !command.requestId || typeof command.encounterId !== "string" ||
      typeof command.actorCombatantId !== "string" ||
      typeof command.sourceArtifactId !== "string" || !Number.isSafeInteger(command.sourceRevision) ||
      typeof command.sourceSnapshot !== "string" || !Number.isSafeInteger(command.expectedTick) ||
      typeof command.actionType !== "string" || (command.targetId !== null && typeof command.targetId !== "string"))
    return outcome(snapshot, control, "malformed_command", "Combat command is malformed.");
  if (!sourceCoherent(snapshot, control) || !validLedger(snapshot)) return outcome(snapshot, control, "invalid_authority", "Campaign authority is inconsistent.");
  const retained = snapshot.authorityLedger?.nearbyEncounters?.commands.find((entry) => entry.requestId === command.requestId);
  if (retained) {
    if (retained.encounterId !== command.encounterId || retained.actorCombatantId !== command.actorCombatantId ||
        retained.sourceArtifactId !== command.sourceArtifactId ||
        retained.sourceRevision !== command.sourceRevision || retained.expectedTick !== command.expectedTick ||
        retained.actionType !== command.actionType || retained.targetId !== command.targetId)
      return outcome(snapshot, control, "request_conflict", "Combat request conflicts with its retained command.");
    return outcome(snapshot, control, "duplicate", "Combat command was already applied.", false, true);
  }
  if (hasPendingNormalDefeat(snapshot)) return outcome(snapshot, control, "recovery_pending", "Complete recovery first.");
  const encounter = snapshot.gameState.activeEncounter;
  if (!encounter || encounter.encounterId !== command.encounterId || encounter.state !== "active" || encounter.paused)
    return outcome(snapshot, control, "no_active_encounter", "The encounter is no longer active.");
  const player = encounter.combatants.find((item) => item.kind === "player" && item.disposition === "ally");
  if (!player || command.actorCombatantId !== player.id)
    return outcome(snapshot, control, "wrong_actor", "The combat command belongs to another actor.");
  if (command.sourceArtifactId !== control.loadedArtifactId || command.sourceRevision !== control.sessionRevision ||
      command.sourceSnapshot !== serializeSnapshot(snapshot) || command.expectedTick !== snapshot.clock.tick)
    return outcome(snapshot, control, "stale_snapshot", "Combat changed before this command.");
  const legal = command.actionType === "combat.advance" && command.targetId === null ? null :
    listLegalPlayerCombatCommands(encounter).find((item) => item.actionType === command.actionType && item.targetId === command.targetId);
  if (command.actionType !== "combat.advance" && !legal) return outcome(snapshot, control, "illegal_command", "That action or target is unavailable.");
  if (command.actionType === "combat.advance" && command.targetId !== null) return outcome(snapshot, control, "illegal_command", "Advance cannot select a target.");
  try {
    const next = structuredClone(snapshot);
    const active = next.gameState.activeEncounter!;
    if (legal) {
      const actor = active.combatants.find((item) => item.kind === "player" && item.disposition === "ally")!;
      queueManualCombatCommand(active, { actorCombatantId: actor.id, actionType: legal.actionType,
        targetIds: [legal.targetId], sourceType: legal.sourceType, sourceId: legal.sourceId, queueMode: "append" });
    }
    next.clock = advanceClock(next.clock, 1);
    next.capturedAtTick = next.clock.tick;
    next.playerState.saveMeta.totalPlayTicks += 1;
    tickCombatFoundation(next.gameState, next.playerState, [], next.clock.tick);
    const history = next.gameState.combatHistory[next.gameState.combatHistory.length - 1];
    const result = !next.gameState.activeEncounter && history?.encounterId === command.encounterId
      ? history.result : "active";
    if (result === "active" || result === "allies_victorious" || result === "enemies_victorious") {
      ledger(next).commands.push({ requestId: command.requestId, encounterId: command.encounterId,
        actorCombatantId: command.actorCombatantId,
        sourceArtifactId: command.sourceArtifactId, sourceRevision: command.sourceRevision,
        expectedTick: command.expectedTick, actionType: command.actionType,
        targetId: command.targetId, result });
    } else return outcome(snapshot, control, "invalid_outcome", "Combat returned an unsupported outcome.");
    if (result !== "active") next.sessionState.currentActivity = { id: `activity.encounter.result.${command.encounterId}`,
      label: result === "allies_victorious" ? "Encounter won" : "Encounter lost",
      category: "Combat", detail: result === "allies_victorious" ? "The foes were defeated." : "The player was defeated." };
    const proposed = synchronizeGameplaySnapshot(next);
    const admission = admitCampaignMutation(control, { mutationId: command.requestId,
      sourceArtifactId: command.sourceArtifactId, sourceRevision: command.sourceRevision,
      ownerKind: "nearby_encounter", accepted: true, sourceSnapshot: snapshot, proposedSnapshot: proposed,
      resultId: `result.${command.requestId}`,
      ...(snapshot.snapshotVersion === 'lineage.save_snapshot.v3' && validateNativeSnapshot
        ? { validateNativeSnapshot } : {}) });
    return admission.accepted
      ? outcome(admission.snapshot, admission.control, result, result === "active" ? "Combat advanced one beat." :
        result === "allies_victorious" ? "The foes were defeated." : "Defeated under Normal Stakes; recovery was applied or is pending.", true)
      : outcome(snapshot, control, admission.reason, "Campaign admission declined the combat step.");
  } catch { return outcome(snapshot, control, "transition_failed", "Combat step failed without changing the campaign."); }
}
