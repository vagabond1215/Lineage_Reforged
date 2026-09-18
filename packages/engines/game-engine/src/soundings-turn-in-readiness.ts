import type { SaveSnapshot, UiTone } from "../../../shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "./campaign-rules.js";
import { SOUNDINGS_QUEST_ID } from "./soundings-turn-in-authority.js";
import { getCurrentPlayerTravelLocationId } from "./player-travel-rules.js";
import { listPendingPlayerSurveyProjectionRepairs } from "./player-survey-activity-advancement.js";

export interface SoundingsTurnInReadiness {
  accepted: boolean;
  code: string;
  reason: string;
  notice: { tone: UiTone; title: string; detail: string };
}
export function resolvePlayerSoundingsTurnIn(snapshot: SaveSnapshot): SoundingsTurnInReadiness {
  const response = (accepted: boolean, code: string, reason: string): SoundingsTurnInReadiness => ({ accepted, code, reason, notice: { tone: accepted ? "success" : "warning", title: accepted ? "Submit Soundings — 5 gold" : "Soundings submission unavailable", detail: reason } });
  try {
    if (!isTargetCampaignSnapshot(snapshot)) return response(false, "invalid_authority", "Retained campaign or survey authority is malformed or conflicting.");
    const quests = snapshot.sessionState.questJournal.filter(q => q.id === SOUNDINGS_QUEST_ID);
    if (quests.length === 0) return response(false, "quest_missing", "Soundings is not in this campaign's quest journal.");
    if (quests.length !== 1) return response(false, "invalid_authority", "Soundings journal identity is duplicated.");
    if (snapshot.authorityLedger?.soundingsTurnIn?.requests.length || quests[0]!.category === "completed") return response(false, "already_consumed", "Soundings has already been completed. This contract pays once per campaign.");
    if (quests[0]!.category !== "active") return response(false, "quest_not_active", "Accept Soundings before submitting its survey packet.");
    const survey = snapshot.authorityLedger?.ashenReefSurvey;
    if (survey && listPendingPlayerSurveyProjectionRepairs(snapshot).length > 0) return response(false, "correction_pending", "Required survey projection repair remains pending.");
    if (survey?.corrections.some(c => c.reconciliations.some(r => r.status === "pending")) || survey?.consequenceReceipts.some(r => r.posture === "projection_pending" && !survey.projectionRepairs.some(p => p.receiptId === r.receiptId))) return response(false, "correction_pending", "Required survey correction or projection repair remains pending.");
    if (!survey || survey.requests.length !== 4 || survey.occurrences.length !== 4 || survey.results.length !== 4 || survey.consequenceReceipts.length !== 48 || survey.results.map(r => r.stage).join(",") !== "sector_1,sector_2,sector_3,ruins_confirmation" || !survey.results[3]!.materialAfter.ruinsConfirmed) return response(false, "incomplete_survey", "Complete all four authoritative survey shifts before submitting the packet.");
    if (getCurrentPlayerTravelLocationId(snapshot) !== "settlement.starfall_port" || snapshot.playerState.location.settlementId !== "settlement.starfall_port") return response(false, "wrong_location", "Survey packet ready. Return to the Starfall Harbormaster's Office in Starfall Port to submit it for 5 gold.");
    return response(true, "soundings_turn_in_available", "Submit the completed survey packet at the Starfall Harbormaster's Office. Contract completion and 5 gold are immediate.");
  } catch { return response(false, "invalid_authority", "Retained campaign or survey authority is malformed or conflicting."); }
}
