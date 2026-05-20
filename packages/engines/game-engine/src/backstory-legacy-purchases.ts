import type {
  AccountProfileState,
  LegacyUnlockDefinitionState,
  LegacyUnlockScope
} from "../../../shared/types/src/index.js";
import { hasFamilyUnlock } from "./account-family.js";
import { hasLegacyUnlock } from "./legacy-account.js";
import {
  isBackstoryLegacyUnlockDefinition,
  isNonLiveBackstoryLegacyUnlockDefinition
} from "./legacy-unlocks.js";

const SUPPORTED_ACCOUNT_SCOPE: LegacyUnlockScope = "account";
const SUPPORTED_FAMILY_SCOPE: LegacyUnlockScope = "family";

export type ResolveOwnedBackstoryLegacyPurchaseIdsParams = {
  profile: AccountProfileState;
  legacyUnlockDefinitions: readonly LegacyUnlockDefinitionState[];
  familyId?: string | null;
  regionId?: string | null;
};

export type OwnedBackstoryLegacyPurchaseIdResolution = {
  legacyPurchaseIds: string[];
  accountUnlockIds: string[];
  familyUnlockIds: string[];
  unsupportedScopeUnlockIds: string[];
  warnings: string[];
};

export function isBackstoryLegacyPurchaseDefinition(
  definition: Pick<LegacyUnlockDefinitionState, "tags">
): boolean {
  return isBackstoryLegacyUnlockDefinition(definition);
}

function pushUnique(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}

function markUnsupported(
  resolution: OwnedBackstoryLegacyPurchaseIdResolution,
  unlockId: string,
  scope: LegacyUnlockScope,
  reason: string
): void {
  pushUnique(resolution.unsupportedScopeUnlockIds, unlockId);
  resolution.warnings.push(`${unlockId} uses unsupported ${scope} scope: ${reason}`);
}

function hasAnyFamilyUnlock(profile: AccountProfileState, unlockId: string): boolean {
  return profile.families.familyUnlocks.some((unlock) => unlock.unlockId === unlockId);
}

export function resolveOwnedBackstoryLegacyPurchaseIds(
  params: ResolveOwnedBackstoryLegacyPurchaseIdsParams
): OwnedBackstoryLegacyPurchaseIdResolution {
  const resolution: OwnedBackstoryLegacyPurchaseIdResolution = {
    legacyPurchaseIds: [],
    accountUnlockIds: [],
    familyUnlockIds: [],
    unsupportedScopeUnlockIds: [],
    warnings: []
  };
  const familyId = params.familyId ?? null;
  const regionId = params.regionId ?? null;

  for (const definition of params.legacyUnlockDefinitions) {
    if (!isBackstoryLegacyPurchaseDefinition(definition)) {
      continue;
    }

    if (isNonLiveBackstoryLegacyUnlockDefinition(definition)) {
      const accountOwned = hasLegacyUnlock(params.profile, definition.id);
      const familyOwnedAnywhere = hasAnyFamilyUnlock(params.profile, definition.id);

      if (accountOwned || familyOwnedAnywhere) {
        pushUnique(resolution.unsupportedScopeUnlockIds, definition.id);
        resolution.warnings.push(
          `${definition.id} is a Backstory Legacy purchase definition that is not live.`
        );
      }
      continue;
    }

    const scope = definition.scope ?? SUPPORTED_ACCOUNT_SCOPE;
    const accountOwned = hasLegacyUnlock(params.profile, definition.id);
    const familyOwnedForContext =
      familyId !== null && hasFamilyUnlock(params.profile.families, familyId, definition.id);
    const familyOwnedAnywhere = hasAnyFamilyUnlock(params.profile, definition.id);

    if (scope === SUPPORTED_ACCOUNT_SCOPE) {
      if (accountOwned) {
        pushUnique(resolution.accountUnlockIds, definition.id);
        pushUnique(resolution.legacyPurchaseIds, definition.id);
      }
      continue;
    }

    if (scope === SUPPORTED_FAMILY_SCOPE) {
      if (familyOwnedForContext) {
        pushUnique(resolution.familyUnlockIds, definition.id);
        pushUnique(resolution.legacyPurchaseIds, definition.id);
      } else if (familyOwnedAnywhere && familyId === null) {
        resolution.warnings.push(
          `${definition.id} is family-scoped and requires an explicit family id.`
        );
      }

      if (accountOwned) {
        markUnsupported(
          resolution,
          definition.id,
          scope,
          "family-scoped backstory purchases must be owned by a matching family"
        );
      }
      continue;
    }

    if (accountOwned || familyOwnedForContext || (familyId === null && familyOwnedAnywhere)) {
      const reason =
        scope === "region" && regionId !== null
          ? "regional scoped purchase storage is not implemented"
          : "scoped backstory purchase storage is not implemented";
      markUnsupported(resolution, definition.id, scope, reason);
    }
  }

  return resolution;
}
