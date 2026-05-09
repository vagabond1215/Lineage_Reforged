import {
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook
} from "./spell-hook-support.mjs";

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

export const CATALYST_FAMILIES = Object.freeze([
  "arcane",
  "elemental",
  "fire",
  "water",
  "air",
  "earth",
  "ice",
  "light",
  "lightning",
  "shadow",
  "divine",
  "sanctified",
  "fuel",
  "heat",
  "binding",
  "botanical",
  "herb",
  "seed",
  "flower",
  "living_plant"
]);

export const SPELL_COMPATIBILITY_STATUSES = Object.freeze([
  "ready",
  "partial",
  "deferred",
  "placeholder"
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
const CATALYST_FAMILY_SET = new Set(CATALYST_FAMILIES);
const SPELL_COMPATIBILITY_STATUS_SET = new Set(SPELL_COMPATIBILITY_STATUSES);
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

const DAGGER_CONDUIT_TAGS = new Set([
  "magic.elemental",
  "magic.enfeebling",
  "magic.dark",
  "magic.utility",
  "range.touch",
  "range.short",
  "delivery.touch",
  "delivery.projectile",
  "cast.fast",
  "cast.precise",
  "cast.risky",
  "power.low",
  "control.easy",
  "control.moderate"
]);

const SWORD_CONDUIT_TAGS = new Set([
  "magic.elemental",
  "magic.warding",
  "magic.divine",
  "magic.enfeebling",
  "range.touch",
  "range.short",
  "range.medium",
  "delivery.touch",
  "delivery.projectile",
  "delivery.area",
  "cast.precise",
  "cast.stable",
  "cast.slow",
  "power.low",
  "power.medium",
  "control.moderate"
]);

const PROJECTILE_CONDUIT_TAGS = new Set([
  "magic.elemental",
  "magic.enfeebling",
  "magic.dark",
  "magic.utility",
  "range.touch",
  "range.short",
  "range.medium",
  "range.long",
  "delivery.projectile",
  "cast.fast",
  "cast.precise",
  "cast.stable",
  "power.low",
  "power.medium",
  "control.easy",
  "control.moderate"
]);

const STAFF_CONDUIT_TAGS = new Set([
  "magic.elemental",
  "magic.divine",
  "magic.healing",
  "magic.enfeebling",
  "magic.enhancing",
  "magic.control",
  "magic.druidic",
  "magic.dark",
  "magic.utility",
  "magic.warding",
  "range.short",
  "range.medium",
  "range.long",
  "delivery.projectile",
  "delivery.area",
  "delivery.beam",
  "delivery.self",
  "delivery.ally",
  "delivery.ward",
  "cast.stable",
  "cast.slow",
  "cast.precise",
  "cast.ritual",
  "power.medium",
  "power.high",
  "control.moderate",
  "control.hard"
]);

const FOCUS_CONDUIT_TAGS = new Set([
  "magic.elemental",
  "magic.divine",
  "magic.healing",
  "magic.enfeebling",
  "magic.enhancing",
  "magic.control",
  "magic.druidic",
  "magic.dark",
  "magic.utility",
  "magic.warding",
  "range.touch",
  "range.short",
  "range.medium",
  "delivery.projectile",
  "delivery.touch",
  "delivery.self",
  "delivery.ally",
  "delivery.ward",
  "cast.fast",
  "cast.stable",
  "cast.precise",
  "cast.risky",
  "power.low",
  "power.medium",
  "control.easy",
  "control.moderate"
]);

const RELIC_CONDUIT_TAGS = new Set([
  "magic.divine",
  "magic.healing",
  "magic.warding",
  "magic.enhancing",
  "range.touch",
  "range.short",
  "range.aura",
  "delivery.self",
  "delivery.ally",
  "delivery.ward",
  "cast.stable",
  "cast.ritual",
  "power.low",
  "power.medium",
  "control.easy",
  "control.moderate"
]);

const SHIELD_CONDUIT_TAGS = new Set([
  "magic.divine",
  "magic.warding",
  "range.touch",
  "range.short",
  "range.aura",
  "delivery.self",
  "delivery.ally",
  "delivery.ward",
  "cast.stable",
  "cast.slow",
  "power.low",
  "power.medium",
  "control.easy",
  "control.moderate"
]);

const CATALYST_SUPPORT_CONDUIT_TAGS = new Set([
  "magic.druidic",
  "magic.healing",
  "magic.enhancing",
  "magic.utility",
  "range.touch",
  "range.short",
  "delivery.touch",
  "delivery.self",
  "delivery.ally",
  "cast.stable",
  "cast.precise",
  "power.low",
  "control.easy",
  "control.moderate"
]);

const CONDUIT_POLICIES = Object.freeze({
  dagger: {
    label: "dagger/knife",
    allowedTags: DAGGER_CONDUIT_TAGS,
    allowedRoles: new Set(["primary", "secondary"]),
    requiredAnyTags: [
      ["range.touch", "range.short"],
      ["delivery.touch", "delivery.projectile"]
    ]
  },
  sword: {
    label: "sword",
    allowedTags: SWORD_CONDUIT_TAGS,
    allowedRoles: new Set(["primary", "secondary"]),
    requiredAnyTags: [
      ["range.touch", "range.short", "range.medium"],
      ["delivery.touch", "delivery.projectile", "delivery.area"]
    ]
  },
  projectile: {
    label: "projectile weapon",
    allowedTags: PROJECTILE_CONDUIT_TAGS,
    allowedRoles: new Set(["imbued_projectile"]),
    requiredAnyTags: [["delivery.projectile"]]
  },
  staff: {
    label: "staff",
    allowedTags: STAFF_CONDUIT_TAGS,
    allowedRoles: new Set(["primary", "secondary"])
  },
  focus: {
    label: "focus",
    allowedTags: FOCUS_CONDUIT_TAGS,
    allowedRoles: new Set(["primary", "secondary", "catalyst_support"])
  },
  relic: {
    label: "relic/charm",
    allowedTags: RELIC_CONDUIT_TAGS,
    allowedRoles: new Set(["primary", "secondary", "defensive"])
  },
  shield: {
    label: "shield/sigil board",
    allowedTags: SHIELD_CONDUIT_TAGS,
    allowedRoles: new Set(["defensive"])
  },
  catalyst_support: {
    label: "catalyst support",
    allowedTags: CATALYST_SUPPORT_CONDUIT_TAGS,
    allowedRoles: new Set(["secondary", "catalyst_support"])
  }
});

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

function normalizeText(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizedStringSet(values) {
  if (!Array.isArray(values)) {
    return new Set();
  }
  return new Set(values.filter((value) => typeof value === "string").map((value) => value.trim().toLowerCase()));
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

export function validateCatalystFamily(family, source) {
  if (typeof family !== "string" || family.trim().length === 0) {
    return [`${source} must be a non-empty catalyst family`];
  }
  if (family.includes("*")) {
    return [`${source} must not use broad wildcard catalyst family '${family}'`];
  }
  if (!CATALYST_FAMILY_SET.has(family)) {
    return [`${source} uses unknown catalyst family '${family}'`];
  }
  return [];
}

export function validateSpellCompatibilityStatus(status, source) {
  if (typeof status !== "string" || status.trim().length === 0) {
    return [`${source} must be a non-empty compatibilityStatus`];
  }
  if (!SPELL_COMPATIBILITY_STATUS_SET.has(status)) {
    return [`${source} uses unknown compatibilityStatus '${status}'`];
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

function validateCatalystFamilies(value, source) {
  const errors = validateStringArray(value, source, { minLength: 1 });
  if (errors.length > 0) {
    return errors;
  }
  for (const [index, family] of value.entries()) {
    errors.push(...validateCatalystFamily(family, `${source}[${index}]`));
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

function classifyConduitItemFamily(record, profile) {
  const id = normalizeText(record.id);
  const itemKey = normalizeText(record.itemKey);
  const name = normalizeText(record.name);
  const itemClass = normalizeText(record.itemClass);
  const itemBranch = normalizeText(record.itemBranch);
  const itemSubBranch = normalizeText(record.itemSubBranch);
  const roles = normalizedStringSet(record.roles);
  const tags = normalizedStringSet(record.tags);
  const text = [id, itemKey, name, itemClass, itemBranch, itemSubBranch, ...roles, ...tags].join(" ");

  if (profile?.conduitRole === "catalyst_support" || itemBranch === "pouch" || itemKey.includes("herb_pouch")) {
    return "catalyst_support";
  }
  if (itemBranch === "shield" || itemSubBranch.includes("shield") || itemKey.includes("shield")) {
    return "shield";
  }
  if (itemSubBranch === "staff" || itemKey.includes("staff") || name.includes("staff")) {
    return "staff";
  }
  if (
    itemBranch === "range" ||
    itemBranch === "ranged" ||
    itemBranch === "thrown" ||
    itemSubBranch === "bow" ||
    itemSubBranch === "crossbow" ||
    text.includes("throwing_") ||
    text.includes("thrown_")
  ) {
    return "projectile";
  }
  if (itemSubBranch === "dagger" || itemSubBranch.includes("knife") || itemKey.includes("dagger") || itemKey.includes("knife")) {
    return "dagger";
  }
  if (itemSubBranch.includes("sword") || itemKey.includes("sword") || name.includes("sword")) {
    return "sword";
  }
  if (itemSubBranch === "focus" || itemKey.includes("focus") || tags.has("focus")) {
    return "focus";
  }
  if (itemSubBranch === "relic" || itemKey.includes("relic") || itemKey.includes("charm") || tags.has("relic") || tags.has("charm")) {
    return "relic";
  }
  return "unknown";
}

function validateConduitPolicy({ record, profile, source }) {
  const errors = [];
  const itemFamily = classifyConduitItemFamily(record, profile);
  const policy = CONDUIT_POLICIES[itemFamily];
  if (policy === undefined) {
    return [`${source} is on an unsupported conduit item family; add an explicit item-family policy before tagging this record`];
  }

  if (profile.conduitRole !== undefined && !policy.allowedRoles.has(profile.conduitRole)) {
    errors.push(`${source}.conduitRole '${profile.conduitRole}' is not allowed for ${policy.label} conduit profiles`);
  }

  const castingTags = Array.isArray(profile.castingTags) ? profile.castingTags : [];
  for (const tag of castingTags) {
    if (!policy.allowedTags.has(tag)) {
      errors.push(`${source}.castingTags uses '${tag}', which is not allowed for ${policy.label} conduit profiles`);
    }
  }

  for (const requiredGroup of policy.requiredAnyTags ?? []) {
    if (!requiredGroup.some((tag) => castingTags.includes(tag))) {
      errors.push(`${source}.castingTags must include one of ${requiredGroup.join(", ")} for ${policy.label} conduit profiles`);
    }
  }

  return errors;
}

function isPlausibleCatalystRecord(record) {
  const itemClass = normalizeText(record.itemClass);
  const itemBranch = normalizeText(record.itemBranch);
  const itemSubBranch = normalizeText(record.itemSubBranch);
  const itemKey = normalizeText(record.itemKey);
  const name = normalizeText(record.name);
  const roles = normalizedStringSet(record.roles);
  const tags = normalizedStringSet(record.tags);
  const processingGroups = normalizedStringSet(record.processingGroups);
  const text = [itemKey, name, itemBranch, itemSubBranch, ...roles, ...tags, ...processingGroups].join(" ");

  if (itemClass === "weapon" || itemClass === "armor") {
    return false;
  }
  if (roles.has("performance") || tags.has("performance") || tags.has("voice")) {
    return false;
  }
  if (itemBranch === "arcane" && itemSubBranch === "vessel") {
    return true;
  }
  if (itemClass === "commodity" && (itemBranch === "mineral" || itemBranch === "flora" || itemBranch === "fuel")) {
    return true;
  }
  if (roles.has("reagent") || roles.has("material") || roles.has("fuel")) {
    return itemClass === "commodity" || itemBranch === "alchemy" || itemBranch === "arcane";
  }
  return /\b(crystal|cluster|vessel|reagent|catalyst|oil|coal|charcoal|herb|seed|flower|plant|flame|torch)\b/.test(text);
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
    errors.push(...validateCatalystFamilies(profile.catalystFamilies, `${source}.catalystFamilies`));
  }
  if (profile.catalystTiers !== undefined) {
    errors.push(...validateCatalystTiers(profile.catalystTiers, `${source}.catalystTiers`));
  }
  if (profile.notes !== undefined && (typeof profile.notes !== "string" || profile.notes.trim().length === 0)) {
    errors.push(`${source}.notes must be a non-empty string`);
  }

  return errors;
}

function collectNonReadySpellHooks(record) {
  const hooks = [];
  for (const hook of record.resolutionHooks ?? []) {
    const hookType = classifySpellResolutionHook(hook);
    if (hookType !== "runtime" && hookType !== "classifier") {
      hooks.push(`resolutionHooks '${hook}'`);
    }
  }
  for (const hook of record.itemGenerationHooks ?? []) {
    const hookId = hook?.generatedItemId;
    const hookType = classifySpellItemGenerationHookId(hookId);
    if (hookType !== "runtime" && hookType !== "classifier") {
      hooks.push(`itemGenerationHooks '${String(hookId)}'`);
    }
  }
  return hooks;
}

export function validateSpellMagicMetadata({ record, source }) {
  const errors = [];
  if (!isObject(record)) {
    return [`${source} must be an object`];
  }

  if (record.compatibilityStatus === undefined) {
    errors.push(`${source} must define compatibilityStatus`);
  } else {
    errors.push(...validateSpellCompatibilityStatus(record.compatibilityStatus, `${source}.compatibilityStatus`));
  }

  if (record.compatibilityProfile !== undefined) {
    errors.push(
      ...validateSpellCompatibilityProfile({
        profile: record.compatibilityProfile,
        source: `${source}.compatibilityProfile`
      })
    );
  }

  if (record.compatibilityStatus === "ready") {
    if (record.compatibilityProfile === undefined) {
      errors.push(`${source} with compatibilityStatus 'ready' must define compatibilityProfile`);
    }
    const nonReadyHooks = collectNonReadySpellHooks(record);
    if (nonReadyHooks.length > 0) {
      errors.push(
        `${source} with compatibilityStatus 'ready' must not depend on deferred or unknown spell hooks: ${nonReadyHooks.join(", ")}`
      );
    }
  }

  return errors;
}

export function validateItemConduitProfile({ record, profile, source }) {
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
  if (Array.isArray(profile.castingTags)) {
    errors.push(...validateConduitPolicy({ record, profile, source }));
  }

  return errors;
}

export function validateItemCatalystProfile({ record, profile, source }) {
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
    errors.push(...validateCatalystFamilies(profile.families, `${source}.families`));
  }
  if (profile.notes !== undefined && (typeof profile.notes !== "string" || profile.notes.trim().length === 0)) {
    errors.push(`${source}.notes must be a non-empty string`);
  }
  if (!isPlausibleCatalystRecord(record)) {
    errors.push(`${source} is only allowed on plausible catalyst, material, reagent, fuel, or vessel records`);
  }

  return errors;
}

export function validateItemMagicMetadata({ record, source }) {
  const errors = [];
  if (record.conduitProfile !== undefined) {
    errors.push(
      ...validateItemConduitProfile({
        record,
        profile: record.conduitProfile,
        source: `${source}.conduitProfile`
      })
    );
  }
  if (record.catalystProfile !== undefined) {
    errors.push(
      ...validateItemCatalystProfile({
        record,
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

export function assertValidSpellMagicMetadata(input) {
  const errors = validateSpellMagicMetadata(input);
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
