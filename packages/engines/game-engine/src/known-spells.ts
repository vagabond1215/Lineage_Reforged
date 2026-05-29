export type KnownSpellOwnerScope = "character";
export type KnownSpellAcquisitionRoute = "training_event";
export type KnownSpellAvailabilityState = "available" | "blocked";

export interface KnownSpellRecordState {
  knownSpellId: string;
  ownerScope: KnownSpellOwnerScope;
  ownerId: string;
  characterId: string;
  spellId: string;
  acquisitionRoute: KnownSpellAcquisitionRoute;
  acquiredAt: string;
  availability: KnownSpellAvailabilityState;
  blockedReason?: string;
}

export type KnownSpellCatalogEntry = string | { id?: unknown };

export type KnownSpellValidationIssueCode =
  | "invalid_record"
  | "missing_known_spell_id"
  | "missing_owner_scope"
  | "unsupported_owner_scope"
  | "missing_owner_id"
  | "missing_character_id"
  | "owner_character_mismatch"
  | "character_context_mismatch"
  | "missing_spell_id"
  | "unknown_spell_id"
  | "missing_acquisition_route"
  | "unsupported_acquisition_route"
  | "missing_acquired_at"
  | "missing_availability"
  | "unsupported_availability";

export interface KnownSpellValidationIssue {
  code: KnownSpellValidationIssueCode;
  field: string;
  message: string;
}

export interface KnownSpellValidationResult {
  ok: boolean;
  issues: KnownSpellValidationIssue[];
  record?: KnownSpellRecordState;
}

export interface ValidateKnownSpellRecordParams {
  record: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  characterId?: string | null;
}

export interface CreateKnownSpellRecordParams {
  knownSpellId: string;
  ownerId: string;
  characterId: string;
  spellId: string;
  acquiredAt: string;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  availability?: KnownSpellAvailabilityState;
  blockedReason?: string;
}

export interface CharacterKnowsSpellParams {
  records: Iterable<unknown>;
  characterId: string;
  spellId: string;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
}

export const KNOWN_SPELL_OWNER_SCOPES = ["character"] as const satisfies readonly KnownSpellOwnerScope[];
export const KNOWN_SPELL_ACQUISITION_ROUTES = ["training_event"] as const satisfies readonly KnownSpellAcquisitionRoute[];
export const KNOWN_SPELL_AVAILABILITY_STATES = ["available", "blocked"] as const satisfies readonly KnownSpellAvailabilityState[];

const KNOWN_SPELL_OWNER_SCOPE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_OWNER_SCOPES);
const KNOWN_SPELL_ACQUISITION_ROUTE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_ACQUISITION_ROUTES);
const KNOWN_SPELL_AVAILABILITY_STATE_SET: ReadonlySet<string> = new Set(KNOWN_SPELL_AVAILABILITY_STATES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function createIssue(
  code: KnownSpellValidationIssueCode,
  field: string,
  message: string
): KnownSpellValidationIssue {
  return { code, field, message };
}

export function collectKnownSpellCatalogIds(
  spellCatalog: Iterable<KnownSpellCatalogEntry>
): Set<string> {
  const ids = new Set<string>();
  for (const entry of spellCatalog) {
    const id = normalizeString(typeof entry === "string" ? entry : entry.id);
    if (id) {
      ids.add(id);
    }
  }
  return ids;
}

function validateKnownSpellRecordWithCatalog(
  record: unknown,
  spellCatalogIds: ReadonlySet<string>,
  characterIdContext: string | null
): KnownSpellValidationResult {
  const issues: KnownSpellValidationIssue[] = [];

  if (!isRecord(record)) {
    return {
      ok: false,
      issues: [
        createIssue(
          "invalid_record",
          "record",
          "Known-spell records must be plain objects."
        )
      ]
    };
  }

  const knownSpellId = normalizeString(record.knownSpellId);
  const ownerScope = normalizeString(record.ownerScope);
  const ownerId = normalizeString(record.ownerId);
  const characterId = normalizeString(record.characterId);
  const spellId = normalizeString(record.spellId);
  const acquisitionRoute = normalizeString(record.acquisitionRoute);
  const acquiredAt = normalizeString(record.acquiredAt);
  const availability = normalizeString(record.availability);
  const blockedReason = normalizeString(record.blockedReason);

  if (!knownSpellId) {
    issues.push(createIssue("missing_known_spell_id", "knownSpellId", "knownSpellId is required."));
  }

  if (!ownerScope) {
    issues.push(createIssue("missing_owner_scope", "ownerScope", "ownerScope is required."));
  } else if (!KNOWN_SPELL_OWNER_SCOPE_SET.has(ownerScope)) {
    issues.push(
      createIssue(
        "unsupported_owner_scope",
        "ownerScope",
        `Known-spell ownerScope '${ownerScope}' is not supported by this helper boundary.`
      )
    );
  }

  if (!ownerId) {
    issues.push(createIssue("missing_owner_id", "ownerId", "ownerId is required."));
  }

  if (!characterId) {
    issues.push(createIssue("missing_character_id", "characterId", "characterId is required."));
  }

  if (ownerId && characterId && ownerId !== characterId) {
    issues.push(
      createIssue(
        "owner_character_mismatch",
        "ownerId",
        "character-scoped known-spell records must use the same ownerId and characterId."
      )
    );
  }

  if (characterIdContext && characterId && characterId !== characterIdContext) {
    issues.push(
      createIssue(
        "character_context_mismatch",
        "characterId",
        `Known-spell record characterId '${characterId}' does not match '${characterIdContext}'.`
      )
    );
  }

  if (characterIdContext && ownerId && ownerId !== characterIdContext) {
    issues.push(
      createIssue(
        "character_context_mismatch",
        "ownerId",
        `Known-spell record ownerId '${ownerId}' does not match '${characterIdContext}'.`
      )
    );
  }

  if (!spellId) {
    issues.push(createIssue("missing_spell_id", "spellId", "spellId is required."));
  } else if (!spellCatalogIds.has(spellId)) {
    issues.push(
      createIssue(
        "unknown_spell_id",
        "spellId",
        `Known-spell record references unknown spellId '${spellId}'.`
      )
    );
  }

  if (!acquisitionRoute) {
    issues.push(
      createIssue("missing_acquisition_route", "acquisitionRoute", "acquisitionRoute is required.")
    );
  } else if (!KNOWN_SPELL_ACQUISITION_ROUTE_SET.has(acquisitionRoute)) {
    issues.push(
      createIssue(
        "unsupported_acquisition_route",
        "acquisitionRoute",
        `Known-spell acquisitionRoute '${acquisitionRoute}' is not supported by this helper boundary.`
      )
    );
  }

  if (!acquiredAt) {
    issues.push(createIssue("missing_acquired_at", "acquiredAt", "acquiredAt is required."));
  }

  if (!availability) {
    issues.push(createIssue("missing_availability", "availability", "availability is required."));
  } else if (!KNOWN_SPELL_AVAILABILITY_STATE_SET.has(availability)) {
    issues.push(
      createIssue(
        "unsupported_availability",
        "availability",
        `Known-spell availability '${availability}' is not supported by this helper boundary.`
      )
    );
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    issues: [],
    record: {
      knownSpellId: knownSpellId as string,
      ownerScope: "character",
      ownerId: ownerId as string,
      characterId: characterId as string,
      spellId: spellId as string,
      acquisitionRoute: "training_event",
      acquiredAt: acquiredAt as string,
      availability: availability as KnownSpellAvailabilityState,
      ...(blockedReason ? { blockedReason } : {})
    }
  };
}

export function validateKnownSpellRecord(
  params: ValidateKnownSpellRecordParams
): KnownSpellValidationResult {
  return validateKnownSpellRecordWithCatalog(
    params.record,
    collectKnownSpellCatalogIds(params.spellCatalog),
    normalizeString(params.characterId) ?? null
  );
}

export function createKnownSpellRecord(
  params: CreateKnownSpellRecordParams
): KnownSpellValidationResult {
  const record: KnownSpellRecordState = {
    knownSpellId: params.knownSpellId,
    ownerScope: "character",
    ownerId: params.ownerId,
    characterId: params.characterId,
    spellId: params.spellId,
    acquisitionRoute: "training_event",
    acquiredAt: params.acquiredAt,
    availability: params.availability ?? "available",
    ...(params.blockedReason ? { blockedReason: params.blockedReason } : {})
  };

  return validateKnownSpellRecord({
    record,
    spellCatalog: params.spellCatalog,
    characterId: params.characterId
  });
}

export function characterKnowsSpell(params: CharacterKnowsSpellParams): boolean {
  const characterId = normalizeString(params.characterId);
  const spellId = normalizeString(params.spellId);
  if (!characterId || !spellId) {
    return false;
  }

  const spellCatalogIds = collectKnownSpellCatalogIds(params.spellCatalog);
  if (!spellCatalogIds.has(spellId)) {
    return false;
  }

  for (const record of params.records) {
    const result = validateKnownSpellRecordWithCatalog(record, spellCatalogIds, characterId);
    if (
      result.ok &&
      result.record?.characterId === characterId &&
      result.record.spellId === spellId &&
      result.record.availability === "available"
    ) {
      return true;
    }
  }

  return false;
}
