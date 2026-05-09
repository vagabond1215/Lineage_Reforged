export const CASTING_CONDUIT_TAGS = Object.freeze([
  "magic.elemental",
  "magic.divine",
  "magic.healing",
  "magic.enfeebling",
  "magic.enhancing",
  "magic.control",
  "magic.druidic",
  "magic.performance",
  "magic.dark",
  "magic.utility",
  "magic.warding",
  "range.touch",
  "range.short",
  "range.medium",
  "range.long",
  "range.aura",
  "delivery.projectile",
  "delivery.touch",
  "delivery.area",
  "delivery.beam",
  "delivery.self",
  "delivery.ally",
  "delivery.ward",
  "cast.fast",
  "cast.stable",
  "cast.precise",
  "cast.risky",
  "cast.slow",
  "cast.ritual",
  "cast.rhythmic",
  "power.low",
  "power.medium",
  "power.high",
  "control.easy",
  "control.moderate",
  "control.hard"
]);

export const CATALYST_TIERS = Object.freeze([
  "catalyst.none",
  "catalyst.trace",
  "catalyst.small",
  "catalyst.medium",
  "catalyst.large",
  "catalyst.bulk"
]);

export const CONDUIT_ROLES = Object.freeze([
  "primary",
  "secondary",
  "defensive",
  "imbued_projectile",
  "catalyst_support"
]);

const CASTING_CONDUIT_TAG_SET = new Set(CASTING_CONDUIT_TAGS);
const CATALYST_TIER_SET = new Set(CATALYST_TIERS);
const CONDUIT_ROLE_SET = new Set(CONDUIT_ROLES);
const METADATA_IDENTIFIER_PATTERN = /^[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const SPELL_COMPATIBILITY_PROFILE_FIELDS = new Set([
  "requiredTags",
  "preferredTags",
  "discouragedTags",
  "freecastAllowed",
  "catalystFamilies",
  "catalystTiers",
  "notes"
]);
const CONDUIT_PROFILE_FIELDS = new Set(["conduitRole", "castingTags", "notes"]);
const CATALYST_PROFILE_FIELDS = new Set(["tier", "families", "notes"]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateAllowedFields(value, allowedFields, source) {
  const errors = [];
  for (const field of Object.keys(value)) {
    if (!allowedFields.has(field)) {
      errors.push(`${source} has unsupported metadata field '${field}'`);
    }
  }
  return errors;
}

function validateMetadataString(value, source) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [`${source} must be a non-empty string`];
  }
  if (value.includes("*")) {
    return [`${source} must not use broad wildcard namespace '${value}'`];
  }
  if (!METADATA_IDENTIFIER_PATTERN.test(value)) {
    return [`${source} has invalid metadata identifier '${value}'`];
  }
  return [];
}

function validateStringArray(value, source, { minLength = 1, identifiersOnly = false } = {}) {
  const errors = [];
  if (!Array.isArray(value)) {
    return [`${source} must be an array`];
  }
  if (value.length < minLength) {
    errors.push(`${source} must include at least ${minLength} value${minLength === 1 ? "" : "s"}`);
  }
  const seen = new Set();
  for (const [index, entry] of value.entries()) {
    const entrySource = `${source}[${index}]`;
    if (typeof entry !== "string" || entry.trim().length === 0) {
      errors.push(`${entrySource} must be a non-empty string`);
      continue;
    }
    if (seen.has(entry)) {
      errors.push(`${source} repeats '${entry}'`);
    }
    seen.add(entry);
    if (identifiersOnly) {
      errors.push(...validateMetadataString(entry, entrySource));
    }
  }
  return errors;
}

export function validateCastingConduitTag(tag, source) {
  if (typeof tag !== "string" || tag.trim().length === 0) {
    return [`${source} must be a non-empty casting/conduit tag`];
  }
  if (tag.includes("*")) {
    return [`${source} must not use broad wildcard casting/conduit tag '${tag}'`];
  }
  if (!CASTING_CONDUIT_TAG_SET.has(tag)) {
    return [`${source} uses unknown casting/conduit tag '${tag}'`];
  }
  return [];
}

function validateCastingTagArray(value, source, minLength = 1) {
  const errors = validateStringArray(value, source, { minLength });
  if (errors.length > 0) {
    return errors;
  }
  for (const [index, tag] of value.entries()) {
    errors.push(...validateCastingConduitTag(tag, `${source}[${index}]`));
  }
  return errors;
}

function validateRequiredTags(value, source) {
  const errors = [];
  if (!isObject(value)) {
    return [`${source} must be an object with all/any tag requirements`];
  }
  errors.push(...validateAllowedFields(value, new Set(["all", "any"]), source));

  const hasAll = value.all !== undefined;
  const hasAny = value.any !== undefined;
  if (!hasAll && !hasAny) {
    errors.push(`${source} must include all or any requirements`);
  }

  if (hasAll) {
    errors.push(...validateCastingTagArray(value.all, `${source}.all`));
  }
  if (hasAny) {
    if (!Array.isArray(value.any) || value.any.length === 0) {
      errors.push(`${source}.any must be a non-empty array of alternative tag groups`);
    } else {
      for (const [index, group] of value.any.entries()) {
        errors.push(...validateCastingTagArray(group, `${source}.any[${index}]`));
      }
    }
  }
  return errors;
}

function validateCatalystTier(value, source) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [`${source} must be a non-empty catalyst tier`];
  }
  if (value.includes("*")) {
    return [`${source} must not use broad wildcard catalyst tier '${value}'`];
  }
  if (!CATALYST_TIER_SET.has(value)) {
    return [`${source} uses unknown catalyst tier '${value}'`];
  }
  return [];
}

function validateCatalystTiers(value, source) {
  const errors = validateStringArray(value, source, { minLength: 1 });
  if (errors.length > 0) {
    return errors;
  }
  for (const [index, tier] of value.entries()) {
    errors.push(...validateCatalystTier(tier, `${source}[${index}]`));
  }
  return errors;
}

export function validateSpellCompatibilityProfile({ profile, source }) {
  const errors = [];
  if (!isObject(profile)) {
    return [`${source} must be an object`];
  }

  errors.push(...validateAllowedFields(profile, SPELL_COMPATIBILITY_PROFILE_FIELDS, source));

  if (profile.requiredTags === undefined) {
    errors.push(`${source} must define requiredTags`);
  } else {
    errors.push(...validateRequiredTags(profile.requiredTags, `${source}.requiredTags`));
  }

  if (profile.preferredTags !== undefined) {
    errors.push(...validateCastingTagArray(profile.preferredTags, `${source}.preferredTags`));
  }
  if (profile.discouragedTags !== undefined) {
    errors.push(...validateCastingTagArray(profile.discouragedTags, `${source}.discouragedTags`));
  }
  if (profile.freecastAllowed !== undefined && typeof profile.freecastAllowed !== "boolean") {
    errors.push(`${source}.freecastAllowed must be boolean`);
  }
  if (profile.catalystFamilies !== undefined) {
    errors.push(
      ...validateStringArray(profile.catalystFamilies, `${source}.catalystFamilies`, {
        minLength: 1,
        identifiersOnly: true
      })
    );
  }
  if (profile.catalystTiers !== undefined) {
    errors.push(...validateCatalystTiers(profile.catalystTiers, `${source}.catalystTiers`));
  }
  if (profile.notes !== undefined && (typeof profile.notes !== "string" || profile.notes.trim().length === 0)) {
    errors.push(`${source}.notes must be a non-empty string`);
  }

  return errors;
}

export function validateItemConduitProfile({ profile, source }) {
  const errors = [];
  if (!isObject(profile)) {
    return [`${source} must be an object`];
  }

  errors.push(...validateAllowedFields(profile, CONDUIT_PROFILE_FIELDS, source));

  if (profile.conduitRole !== undefined) {
    if (!CONDUIT_ROLE_SET.has(profile.conduitRole)) {
      errors.push(`${source}.conduitRole uses unknown conduit role '${String(profile.conduitRole)}'`);
    }
  }
  if (profile.castingTags === undefined) {
    errors.push(`${source} must define castingTags`);
  } else {
    errors.push(...validateCastingTagArray(profile.castingTags, `${source}.castingTags`));
  }
  if (profile.notes !== undefined && (typeof profile.notes !== "string" || profile.notes.trim().length === 0)) {
    errors.push(`${source}.notes must be a non-empty string`);
  }

  return errors;
}

export function validateItemCatalystProfile({ profile, source }) {
  const errors = [];
  if (!isObject(profile)) {
    return [`${source} must be an object`];
  }

  errors.push(...validateAllowedFields(profile, CATALYST_PROFILE_FIELDS, source));

  if (profile.tier === undefined) {
    errors.push(`${source} must define tier`);
  } else {
    errors.push(...validateCatalystTier(profile.tier, `${source}.tier`));
  }
  if (profile.families !== undefined) {
    errors.push(
      ...validateStringArray(profile.families, `${source}.families`, {
        minLength: 1,
        identifiersOnly: true
      })
    );
  }
  if (profile.notes !== undefined && (typeof profile.notes !== "string" || profile.notes.trim().length === 0)) {
    errors.push(`${source}.notes must be a non-empty string`);
  }

  return errors;
}

export function validateItemMagicMetadata({ record, source }) {
  const errors = [];
  if (record.conduitProfile !== undefined) {
    errors.push(
      ...validateItemConduitProfile({
        profile: record.conduitProfile,
        source: `${source}.conduitProfile`
      })
    );
  }
  if (record.catalystProfile !== undefined) {
    errors.push(
      ...validateItemCatalystProfile({
        profile: record.catalystProfile,
        source: `${source}.catalystProfile`
      })
    );
  }
  return errors;
}

export function assertValidSpellCompatibilityProfile(input) {
  const errors = validateSpellCompatibilityProfile(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}

export function assertValidItemMagicMetadata(input) {
  const errors = validateItemMagicMetadata(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}
