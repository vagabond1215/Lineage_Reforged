import type { TagTone } from '../types.js';

type CombatDeltaLike = {
  kind?: unknown;
  payload?: unknown;
};

export type CombatSkillGainMessageItem = {
  id: string;
  title: string;
  detail: string;
  message: string;
  tone: TagTone;
  encounterId: string | null;
  source: 'combat_delta';
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '') || 'message'
  );
}

function resolveTone(message: string): TagTone {
  return message.toLowerCase().includes('requires a breakthrough') ? 'warning' : 'success';
}

function resolveTitle(message: string): string {
  return resolveTone(message) === 'warning' ? 'Training Paused' : 'Training Improved';
}

export function buildCombatSkillGainMessageItems(
  deltas: Iterable<CombatDeltaLike>
): CombatSkillGainMessageItem[] {
  const items: CombatSkillGainMessageItem[] = [];
  const seenKeys = new Set<string>();

  for (const delta of deltas) {
    if (delta.kind !== 'combat' || !isRecord(delta.payload)) {
      continue;
    }

    const messages = delta.payload.skillGainMessages;
    if (!Array.isArray(messages)) {
      continue;
    }

    const encounterId =
      typeof delta.payload.encounterId === 'string' ? delta.payload.encounterId : null;

    for (const message of messages) {
      if (typeof message !== 'string') {
        continue;
      }

      const normalizedMessage = message.trim();
      if (!normalizedMessage) {
        continue;
      }

      const dedupeKey = `${encounterId ?? 'unknown'}:${normalizedMessage}`;
      if (seenKeys.has(dedupeKey)) {
        continue;
      }
      seenKeys.add(dedupeKey);

      items.push({
        id: `combat.skill_gain.${encounterId ?? 'unknown'}.${slugify(normalizedMessage)}`,
        title: resolveTitle(normalizedMessage),
        detail: normalizedMessage,
        message: normalizedMessage,
        tone: resolveTone(normalizedMessage),
        encounterId,
        source: 'combat_delta'
      });
    }
  }

  return items;
}
