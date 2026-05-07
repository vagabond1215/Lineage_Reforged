export const RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNELS = Object.freeze([
  "damage",
  "power",
  "pressure",
  "armorBreak",
  "penetration",
  "critChance",
  "guardPressure",
  "healingPower",
  "magnitude",
  "barrier",
  "tempo",
  "duration",
  "statusChance",
  "stagger",
  "blockChance",
  "damageMitigation",
  "mitigation",
  "evasion",
  "interrupt"
]);

export const DESCRIPTIVE_COMBAT_EFFECT_CHANNELS = Object.freeze([
  "accuracy",
  "accuracyPenalty",
  "evasionPenalty",
  "counter",
  "control",
  "execution",
  "manaEfficiency",
  "charges",
  "penaltyReduction",
  "recoveryWindow",
  "reposition",
  "slow",
  "staggerResistance",
  "stun",
  "threat"
]);

export const UTILITY_ONLY_ITEM_EFFECT_CHANNELS = Object.freeze([
  "yield",
  "wasteReduction",
  "timeEfficiency"
]);

export const RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOKS = Object.freeze([
  "damage.melee",
  "damage.ranged",
  "damage.magic",
  "heal.hp",
  "interrupt.primary",
  "execute.helpless",
  "status.bind",
  "status.sleep",
  "status.hamstrung",
  "status.pinned",
  "status.prone",
  "status.stagger",
  "status.stun",
  "debuff.disabled",
  "buff.protect",
  "buff.ward",
  "buff.anthem",
  "defense.shield.small",
  "defense.shield.medium",
  "defense.shield.large",
  "stance.defensive",
  "stance.brace",
  "command.pressure",
  "command.formation",
  "command.fall_back",
  "command.focus_target",
  "mobility.shadow_step",
  "support.berry"
]);

export const DESCRIPTIVE_COMBAT_RESOLUTION_HOOKS = Object.freeze([
  "armor.cloth_armor",
  "armor.light_armor",
  "armor.medium_armor",
  "armor.plate_armor",
  "armor.pierce",
  "armor.sunder",
  "control.grapple",
  "crit.backstab",
  "crit.headshot",
  "focus.channeling",
  "guard.overhead",
  "guard.split",
  "pressure.arc",
  "pressure.volley",
  "reach.lunge",
  "reaction.riposte",
  "reposition.pull",
  "setup.feint",
  "tempo.quick",
  "tool.extraction",
  "weapon.archery",
  "weapon.axe",
  "weapon.dagger",
  "weapon.polearm",
  "weapon.staff",
  "weapon.sword"
]);

const RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNEL_SET = new Set(RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNELS);
const DESCRIPTIVE_COMBAT_EFFECT_CHANNEL_SET = new Set(DESCRIPTIVE_COMBAT_EFFECT_CHANNELS);
const UTILITY_ONLY_ITEM_EFFECT_CHANNEL_SET = new Set(UTILITY_ONLY_ITEM_EFFECT_CHANNELS);
const RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOK_SET = new Set(RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOKS);
const DESCRIPTIVE_COMBAT_RESOLUTION_HOOK_SET = new Set(DESCRIPTIVE_COMBAT_RESOLUTION_HOOKS);

export function isUtilityOnlyItemUseProfile(profile) {
  return typeof profile?.actionType === "string" && profile.actionType.startsWith("utility.");
}

export function validateCombatEffectChannels({
  channels,
  source,
  allowUtilityOnlyItemChannels = false
}) {
  const errors = [];
  for (const channel of channels ?? []) {
    if (UTILITY_ONLY_ITEM_EFFECT_CHANNEL_SET.has(channel)) {
      if (!allowUtilityOnlyItemChannels) {
        errors.push(`${source} uses utility-only item channel '${channel}' outside a utility item profile`);
      }
      continue;
    }
    if (
      !RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNEL_SET.has(channel) &&
      !DESCRIPTIVE_COMBAT_EFFECT_CHANNEL_SET.has(channel)
    ) {
      errors.push(`${source} uses unsupported combat effect channel '${channel}'`);
    }
  }
  return errors;
}

export function validateCombatResolutionHooks({ hooks, source }) {
  const errors = [];
  for (const hook of hooks ?? []) {
    if (
      !RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOK_SET.has(hook) &&
      !DESCRIPTIVE_COMBAT_RESOLUTION_HOOK_SET.has(hook)
    ) {
      errors.push(`${source} uses unsupported combat resolution hook '${hook}'`);
    }
  }
  return errors;
}

export function assertSupportedCombatEffectChannels(input) {
  const errors = validateCombatEffectChannels(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}

export function assertSupportedCombatResolutionHooks(input) {
  const errors = validateCombatResolutionHooks(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}
