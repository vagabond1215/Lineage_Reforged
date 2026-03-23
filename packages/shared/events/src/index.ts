import type { DomainKey, GameEventEnvelope } from "../../types/src/index.js";

export const EVENT_TYPES = {
  WEATHER_SHIFT: "weather.shift",
  MARKET_PRICE_UPDATED: "market.price.updated",
  ECONOMY_LEDGER_UPDATED: "economy.ledger.updated",
  PLAYER_LEVEL_UP: "player.level.up",
  PLAYER_RESOURCE_CHANGE: "player.resource.change",
  PLAYER_RESOURCE_MODIFIER_APPLIED: "player.resource.modifier.applied",
  PLAYER_RESOURCE_MODIFIER_REMOVED: "player.resource.modifier.removed",
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
