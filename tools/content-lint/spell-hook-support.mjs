import {
  AUTHORED_SPELL_HOOK_SUPPORT,
  CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook
} from "../../packages/shared/types/src/spell-hook-support.js";

export {
  AUTHORED_SPELL_HOOK_SUPPORT,
  CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook
};

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
