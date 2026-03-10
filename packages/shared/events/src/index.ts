import type { DomainKey, GameEventEnvelope } from "../../types/src/index.js";

export const EVENT_TYPES = {
  WEATHER_SHIFT: "weather.shift",
  MARKET_PRICE_UPDATED: "market.price.updated",
  PLAYER_LEVEL_UP: "player.level.up",
  QUEST_COMPLETED: "quest.completed"
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