import type { DomainKey, GameEventEnvelope } from "../../types/src/index.js";

export const EVENT_TYPES = {
  WEATHER_SHIFT: "weather.shift",
  SPAWN_CANDIDATE_RESOLVED: "spawn.candidate.resolved",
  MARKET_PRICE_UPDATED: "market.price.updated",
  ECONOMY_LEDGER_UPDATED: "economy.ledger.updated",
  PLAYER_LEVEL_UP: "player.level.up",
  PLAYER_RESOURCE_CHANGE: "player.resource.change",
  PLAYER_RESOURCE_MODIFIER_APPLIED: "player.resource.modifier.applied",
  PLAYER_RESOURCE_MODIFIER_REMOVED: "player.resource.modifier.removed",
  PLAYER_TRAVEL_COMPLETED: "player.travel.completed",
  PLAYER_QUEST_ACCEPTED: "player.quest.accepted",
  COMBAT_ENCOUNTER_STARTED: "combat.encounter.started",
  COMBAT_ACTION_QUEUED: "combat.action.queued",
  COMBAT_ACTION_RESOLVED: "combat.action.resolved",
  COMBATANT_DEFEATED: "combat.combatant.defeated",
  COMBAT_ENCOUNTER_ENDED: "combat.encounter.ended",
  QUEST_COMPLETED: "quest.completed",
  QUEST_BOARD_REFRESHED: "quest.board.refreshed"
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export function createEvent(
  type: EventType,
  domain: DomainKey,
  atTick: number,
  payload: Record<string, unknown>
): GameEventEnvelope {
  return {
    id: `${type}:${domain}:${atTick}`,
    type,
    domain,
    atTick,
    payload
  };
}
