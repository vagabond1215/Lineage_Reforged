export const RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS = Object.freeze([
  "damage.magic",
  "damage.ranged",
  "heal.hp",
  "interrupt.primary",
  "status.bind",
  "status.stagger",
  "buff.protect",
  "buff.ward",
  "buff.anthem",
  "mobility.shadow_step",
  "support.berry"
]);

export const CLASSIFIER_SPELL_RESOLUTION_HOOKS = Object.freeze([
  "school.control",
  "school.elemental",
  "school.enfeebling",
  "school.enhancing",
  "school.healing",
  "school.ranged",
  "school.utility",
  "tradition.druidic",
  "discipline.ninjutsu",
  "discipline.performance",
  "element.air",
  "element.earth",
  "element.fire",
  "element.ice",
  "element.light",
  "element.lightning",
  "element.shadow",
  "element.water"
]);

export const DEFERRED_SPELL_RESOLUTION_HOOKS = Object.freeze([
  "buff.bless",
  "buff.charge",
  "buff.ember_spikes",
  "buff.grace",
  "buff.haste",
  "buff.haze",
  "buff.march",
  "buff.preserve",
  "buff.regeneration",
  "buff.thornskin",
  "buff.veil",
  "buff.war_song",
  "buff.warmth",
  "buff.waterbreath",
  "debuff.blind",
  "debuff.curse",
  "debuff.dirge",
  "debuff.discord",
  "debuff.soaked",
  "field.smoke",
  "restore.mp",
  "restore.stamina",
  "status.burn",
  "status.slow",
  "utility.mirror",
  "utility.speak_beast",
  "utility.speak_plant"
]);

export const DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS = Object.freeze([
  "generated_item.druidic.berry"
]);

const RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOK_SET = new Set(RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS);
const CLASSIFIER_SPELL_RESOLUTION_HOOK_SET = new Set(CLASSIFIER_SPELL_RESOLUTION_HOOKS);
const DEFERRED_SPELL_RESOLUTION_HOOK_SET = new Set(DEFERRED_SPELL_RESOLUTION_HOOKS);
const DEFERRED_SPELL_ITEM_GENERATION_HOOK_ID_SET = new Set(DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS);

export function classifySpellResolutionHook(hook) {
  if (RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOK_SET.has(hook)) {
    return "runtime";
  }
  if (CLASSIFIER_SPELL_RESOLUTION_HOOK_SET.has(hook)) {
    return "classifier";
  }
  if (DEFERRED_SPELL_RESOLUTION_HOOK_SET.has(hook)) {
    return "deferred";
  }
  return "unknown";
}

export function classifySpellItemGenerationHookId(hookId) {
  return DEFERRED_SPELL_ITEM_GENERATION_HOOK_ID_SET.has(hookId) ? "deferred" : "unknown";
}

export function validateSpellResolutionHooks({ hooks, source }) {
  const errors = [];
  for (const hook of hooks ?? []) {
    if (classifySpellResolutionHook(hook) === "unknown") {
      errors.push(`${source} uses unknown spell resolution hook '${hook}'`);
    }
  }
  return errors;
}

export function validateSpellItemGenerationHooks({ hooks, source }) {
  const errors = [];
  for (const [index, hook] of (hooks ?? []).entries()) {
    const hookId = hook?.generatedItemId;
    if (typeof hookId !== "string" || hookId.trim().length === 0) {
      errors.push(`${source}[${index}] is missing generatedItemId`);
      continue;
    }
    if (classifySpellItemGenerationHookId(hookId) === "unknown") {
      errors.push(`${source}[${index}] uses unknown spell item-generation hook '${hookId}'`);
    }
  }
  return errors;
}

export function assertKnownSpellResolutionHooks(input) {
  const errors = validateSpellResolutionHooks(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}

export function assertKnownSpellItemGenerationHooks(input) {
  const errors = validateSpellItemGenerationHooks(input);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}
