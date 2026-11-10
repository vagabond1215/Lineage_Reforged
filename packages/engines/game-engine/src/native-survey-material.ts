import { resolveExpectedSurveyOwnerEvidence } from './campaign-rules.js';
import { projectNativeEffectiveWornFromGear } from './native-effective-worn.js';
import type { NativeFreshCampaignSnapshot } from './native-campaign-rules.js';
import {
  prepareNativeSurveySource,
  type NativeSurveySourceIdentity,
  type NativeSurveySourceWitness
} from './native-survey-source.js';

export function canonicalNativeSurveyJson(value: unknown): string {
  const normalize = (entry: unknown): unknown => {
    if (entry === null || typeof entry === 'string' || typeof entry === 'boolean') return entry;
    if (typeof entry === 'number' && Number.isFinite(entry)) return entry;
    if (Array.isArray(entry)) return entry.map(normalize);
    if (entry && typeof entry === 'object' &&
      (Object.getPrototypeOf(entry) === Object.prototype || Object.getPrototypeOf(entry) === null)) {
      return Object.keys(entry).sort().reduce<Record<string, unknown>>((record, key) => {
        record[key] = normalize((entry as Record<string, unknown>)[key]);
        return record;
      }, {});
    }
    throw new TypeError('Native survey material is not JSON-safe.');
  };
  return JSON.stringify(normalize(value));
}

/** Pure v3 material replay against the exact retained source snapshot. No effect is committed. */
export function resolveNativeSurveyMaterialEvidence(
  sourceSnapshot: unknown,
  sourceIdentity: NativeSurveySourceIdentity,
  witness: NativeSurveySourceWitness
) {
  const prepared = prepareNativeSurveySource(sourceSnapshot, sourceIdentity);
  if (!prepared.accepted || canonicalNativeSurveyJson(witness) !== canonicalNativeSurveyJson(prepared.witness)) {
    throw new Error('Native survey source witness conflicts with the current source campaign.');
  }
  const snapshot = sourceSnapshot as NativeFreshCampaignSnapshot;
  const wornResourceModifiers = projectNativeEffectiveWornFromGear(snapshot.playerState.gear).resourceModifiers;
  const { gearRevision: _gearRevision, worn: _worn, ...nonphysical } = prepared.witness.ownerInputs;
  return resolveExpectedSurveyOwnerEvidence(prepared.witness.characterId, prepared.witness.stage, {
    ...nonphysical,
    wornResourceModifiers
  });
}
