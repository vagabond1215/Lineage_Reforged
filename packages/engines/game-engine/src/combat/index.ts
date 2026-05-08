import type {
  CombatActionState,
  CombatCommandRequestState,
  CombatEncounterState,
  CombatantState,
  GameDelta,
  GameEventEnvelope,
  GameState,
  PlayerState,
  ResolvedSpawnCandidateState,
  SessionState
} from "../../../../shared/types/src/index.js";
import {
  createEmptyCombatFocusDirectives,
  createDefaultCombatTactics
} from "./state.js";
import {
  loadItemContent,
  loadPlayerAbilityContent,
  loadPlayerSpellContent,
  loadSkillContent,
  loadSkillEffectContent,
  loadTitleContent
} from "../../../civilization-engine/src/content.ts";
import { loadCombatFoundationContent } from "./content.js";
import { resolveSkillBand } from "../../../player-engine/src/progression.ts";
import { loadSpawnFoundationContent } from "../../../world-engine/src/spawn/content.js";

type ActionTemplate = {
  actionType: string;
  sourceType: CombatActionState["source"]["sourceType"];
  sourceId: string | null;
  itemId?: string | null;
  skillIds: string[];
  targetShape?: string | undefined;
  maxTargets?: number | undefined;
  weaponSkillId?: string | null;
  defensiveSkillId?: string | null;
  armorSkillId?: string | null;
  shieldSkillId?: string | null;
  spellSchool?: string | null;
  spellTradition?: string | null;
  spellDiscipline?: string | null;
  spellElement?: string | null;
  spellScalingChannels: CombatActionState["source"]["spellScalingChannels"];
  executionTimeTicks: number;
  recoveryTimeTicks: number;
  interruptible: boolean;
  interruptPriority: CombatActionState["interruptPriority"];
  resourceCosts: CombatActionState["resourceCosts"];
  targetDisposition: CombatActionState["targeting"]["targetDisposition"];
  effectChannels: string[];
  resolutionHooks: string[];
  itemHandlingType?: string | null;
  itemProficiencyBand?: string | null;
  critTags: string[];
  weaknessTags: string[];
  titleModifierIds: string[];
};

type PlayerCombatContentCache = {
  skillById: Map<string, ReturnType<typeof loadSkillContent>[number]>;
  abilityById: Map<string, ReturnType<typeof loadPlayerAbilityContent>[number]>;
  spellById: Map<string, ReturnType<typeof loadPlayerSpellContent>[number]>;
  skillEffectById: Map<string, ReturnType<typeof loadSkillEffectContent>[number]>;
  titleById: Map<string, ReturnType<typeof loadTitleContent>[number]>;
  itemById: Map<string, ReturnType<typeof loadItemContent>[number]>;
};

type CombatTickResult = {
  deltas: GameDelta[];
  emittedEvents: GameEventEnvelope[];
  warnings: string[];
};

export type CombatSkillGainCandidateReason =
  | "weapon_attack"
  | "shield_bash"
  | "shield_block"
  | "armor_mitigation";

export type CombatSkillGainCandidate = {
  resolvedActionId: string;
  resolvedActionType: string;
  actorCombatantId: string;
  skillId: string;
  sourceType: "combat_action";
  sourceLabel: string;
  rankDelta: number;
  reason: CombatSkillGainCandidateReason;
  eligible: boolean;
  blockedReason: string | null;
};

type CombatActionFamily = "melee" | "ranged" | "magic" | "shield" | "support";

export type CombatDamagePreview = {
  actionFamily: CombatActionFamily;
  baseDamage: number;
  offensiveStat: number;
  defensiveStat: number;
  skillBonus: number;
  itemBandBonus: number;
  titleBonus: number;
  specialBonus: number;
  statusReduction: number;
  equipmentReduction: number;
  defensiveSkillReduction: number;
  totalReduction: number;
  preReductionAmount: number;
  amount: number;
};

let playerCombatContentCache: PlayerCombatContentCache | null = null;

function loadPlayerCombatContent(): PlayerCombatContentCache {
  if (playerCombatContentCache) {
    return playerCombatContentCache;
  }

  const skills = loadSkillContent();
  const abilities = loadPlayerAbilityContent();
  const spells = loadPlayerSpellContent();
  const skillEffects = loadSkillEffectContent();
  const titles = loadTitleContent();
  const items = loadItemContent();

  playerCombatContentCache = {
    skillById: new Map(skills.map((record) => [record.id, record])),
    abilityById: new Map(abilities.map((record) => [record.id, record])),
    spellById: new Map(spells.map((record) => [record.id, record])),
    skillEffectById: new Map(skillEffects.map((record) => [record.id, record])),
    titleById: new Map(titles.map((record) => [record.id, record])),
    itemById: new Map(items.map((record) => [record.id, record]))
  };

  return playerCombatContentCache;
}

const ACTION_LIBRARY: Record<string, ActionTemplate> = {
  "combat.attack.melee.basic": {
    actionType: "combat.attack.melee.basic",
    sourceType: "basic_attack",
    sourceId: null,
    skillIds: [],
    spellScalingChannels: [],
    executionTimeTicks: 3,
    recoveryTimeTicks: 5,
    interruptible: false,
    interruptPriority: "normal",
    resourceCosts: { stamina: 4 },
    targetDisposition: "enemy",
    effectChannels: ["damage"],
    resolutionHooks: ["damage.melee"],
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  },
  "combat.attack.ranged.basic": {
    actionType: "combat.attack.ranged.basic",
    sourceType: "basic_attack",
    sourceId: null,
    skillIds: [],
    spellScalingChannels: [],
    executionTimeTicks: 4,
    recoveryTimeTicks: 5,
    interruptible: false,
    interruptPriority: "normal",
    resourceCosts: { stamina: 5 },
    targetDisposition: "enemy",
    effectChannels: ["damage", "pressure"],
    resolutionHooks: ["damage.ranged"],
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  },
  "combat.defense.block": {
    actionType: "combat.defense.block",
    sourceType: "item",
    sourceId: "combat.defense.block",
    skillIds: ["skill.combat.defense.shield_handling", "skill.combat.armor.small_shields"],
    defensiveSkillId: "skill.combat.defense.shield_handling",
    shieldSkillId: "skill.combat.armor.small_shields",
    spellScalingChannels: [],
    executionTimeTicks: 1,
    recoveryTimeTicks: 2,
    interruptible: false,
    interruptPriority: "normal",
    resourceCosts: { stamina: 2 },
    targetDisposition: "self",
    effectChannels: ["blockChance", "damageMitigation", "staggerResistance"],
    resolutionHooks: ["defense.shield.small"],
    itemHandlingType: "shield",
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  },
  "combat.interrupt.shield_bash": {
    actionType: "combat.interrupt.shield_bash",
    sourceType: "item",
    sourceId: "combat.interrupt.shield_bash",
    skillIds: ["skill.combat.defense.shield_handling", "skill.combat.armor.small_shields"],
    defensiveSkillId: "skill.combat.defense.shield_handling",
    shieldSkillId: "skill.combat.armor.small_shields",
    spellScalingChannels: [],
    executionTimeTicks: 2,
    recoveryTimeTicks: 6,
    interruptible: false,
    interruptPriority: "high",
    resourceCosts: { stamina: 8 },
    targetDisposition: "enemy",
    effectChannels: ["damage", "interrupt", "stagger"],
    resolutionHooks: ["damage.melee", "interrupt.primary"],
    itemHandlingType: "shield",
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  },
  "combat.attack.magic.elemental": {
    actionType: "combat.attack.magic.elemental",
    sourceType: "scripted",
    sourceId: null,
    skillIds: [],
    spellSchool: "elemental",
    spellScalingChannels: ["power", "accuracy"],
    executionTimeTicks: 5,
    recoveryTimeTicks: 4,
    interruptible: false,
    interruptPriority: "normal",
    resourceCosts: { stamina: 3 },
    targetDisposition: "enemy",
    effectChannels: ["power", "elemental"],
    resolutionHooks: ["damage.magic", "school.elemental"],
    critTags: [],
    weaknessTags: ["elemental"],
    titleModifierIds: []
  },
  "combat.attack.control.primary": {
    actionType: "combat.attack.control.primary",
    sourceType: "scripted",
    sourceId: null,
    skillIds: [],
    spellSchool: "enfeebling",
    spellScalingChannels: ["magnitude", "duration"],
    executionTimeTicks: 4,
    recoveryTimeTicks: 5,
    interruptible: false,
    interruptPriority: "normal",
    resourceCosts: { stamina: 4 },
    targetDisposition: "enemy",
    effectChannels: ["magnitude", "duration", "control"],
    resolutionHooks: ["status.sleep", "school.enfeebling"],
    critTags: [],
    weaknessTags: ["control"],
    titleModifierIds: []
  },
  "spell.cast.elemental.primary": {
    actionType: "spell.cast.elemental.primary",
    sourceType: "spell",
    sourceId: null,
    skillIds: [],
    spellSchool: "elemental",
    spellScalingChannels: ["power", "accuracy"],
    executionTimeTicks: 6,
    recoveryTimeTicks: 4,
    interruptible: true,
    interruptPriority: "normal",
    resourceCosts: { mp: 10, stamina: 2 },
    targetDisposition: "enemy",
    effectChannels: ["power", "accuracy", "elemental"],
    resolutionHooks: ["damage.magic", "school.elemental"],
    critTags: [],
    weaknessTags: ["elemental"],
    titleModifierIds: []
  },
  "spell.cast.enfeebling.primary": {
    actionType: "spell.cast.enfeebling.primary",
    sourceType: "spell",
    sourceId: null,
    skillIds: [],
    spellSchool: "enfeebling",
    spellScalingChannels: ["magnitude", "duration", "accuracy"],
    executionTimeTicks: 7,
    recoveryTimeTicks: 4,
    interruptible: true,
    interruptPriority: "normal",
    resourceCosts: { mp: 14, stamina: 1 },
    targetDisposition: "enemy",
    effectChannels: ["magnitude", "duration", "accuracy"],
    resolutionHooks: ["status.sleep", "school.enfeebling"],
    critTags: [],
    weaknessTags: ["control"],
    titleModifierIds: []
  },
  "spell.cast.enhancing.primary": {
    actionType: "spell.cast.enhancing.primary",
    sourceType: "spell",
    sourceId: null,
    skillIds: [],
    spellSchool: "enhancing",
    spellScalingChannels: ["magnitude", "duration", "barrier"],
    executionTimeTicks: 6,
    recoveryTimeTicks: 3,
    interruptible: true,
    interruptPriority: "normal",
    resourceCosts: { mp: 12, stamina: 1 },
    targetDisposition: "ally",
    effectChannels: ["magnitude", "duration"],
    resolutionHooks: ["buff.protect", "school.enhancing"],
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  },
  "spell.cast.healing.primary": {
    actionType: "spell.cast.healing.primary",
    sourceType: "spell",
    sourceId: null,
    skillIds: [],
    spellSchool: "healing",
    spellScalingChannels: ["power", "healingPower"],
    executionTimeTicks: 5,
    recoveryTimeTicks: 3,
    interruptible: true,
    interruptPriority: "normal",
    resourceCosts: { mp: 12, stamina: 1 },
    targetDisposition: "ally",
    effectChannels: ["power"],
    resolutionHooks: ["heal.hp", "school.healing"],
    critTags: [],
    weaknessTags: [],
    titleModifierIds: []
  }
};

const ACTION_PACKAGE_LIBRARY: Record<string, string> = {
  melee_skirmisher: "combat.attack.melee.basic",
  melee_brute: "combat.attack.melee.basic",
  ranged_harrier: "combat.attack.ranged.basic",
  disruptor_bash: "combat.interrupt.shield_bash",
  elemental_burst: "combat.attack.magic.elemental",
  enfeebling_burst: "combat.attack.control.primary",
  support_ward: "spell.cast.enhancing.primary",
  healing_cast: "spell.cast.healing.primary"
};

function hashText(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function isRangedWeaponSkillId(skillId: string | null | undefined): boolean {
  return skillId === "skill.combat.weapon.archery" || skillId === "skill.combat.weapon.throwing";
}

function resolveActionTypeFamily(actionType: string): string {
  switch (actionType) {
    case "combat.attack.melee.basic":
    case "combat.melee.primary":
    case "combat.melee.improvised":
      return "combat.family.melee";
    case "combat.attack.ranged.basic":
    case "combat.ranged.primary":
      return "combat.family.ranged";
    case "armor.handling.cloth":
    case "combat.armor.cloth":
      return "combat.family.armor.cloth";
    case "armor.handling.light":
    case "combat.armor.light":
      return "combat.family.armor.light";
    case "armor.handling.medium":
    case "combat.armor.medium":
      return "combat.family.armor.medium";
    case "armor.handling.heavy":
    case "combat.armor.heavy":
      return "combat.family.armor.heavy";
    case "armor.handling.plate":
    case "combat.armor.plate":
      return "combat.family.armor.plate";
    default:
      return actionType;
  }
}

function getAttribute(combatant: CombatantState, attribute: keyof NonNullable<CombatantState["attributes"]>): number {
  return combatant.attributes[attribute] ?? 10;
}

function resolveShieldSkillId(skillIds: string[]): string | null {
  return skillIds.find((skillId) => skillId.startsWith("skill.combat.armor.") && skillId.endsWith("_shields")) ?? null;
}

function getBiasWeight(bias: "avoid" | "low" | "normal" | "high" | "critical"): number {
  switch (bias) {
    case "avoid":
      return -2;
    case "low":
      return -0.5;
    case "high":
      return 1.5;
    case "critical":
      return 3;
    default:
      return 0;
  }
}

function isManualOverrideActive(encounter: CombatEncounterState, combatantId: string): boolean {
  return encounter.manualOverrides.some(
    (entry) =>
      entry.actorCombatantId === combatantId &&
      (entry.suspendAiUntilTick ?? -1) >= encounter.currentTimeTick
  );
}

function canPayCosts(combatant: CombatantState, action: CombatActionState): boolean {
  return (
    combatant.resources.hp.current >= (action.resourceCosts.hp ?? 0) &&
    combatant.resources.mp.current >= (action.resourceCosts.mp ?? 0) &&
    combatant.resources.stamina.current >= (action.resourceCosts.stamina ?? 0)
  );
}

function hasValidEnemyTarget(encounter: CombatEncounterState, action: CombatActionState): boolean {
  const actor = findCombatant(encounter, action.actorCombatantId);
  if (!actor) {
    return false;
  }

  return action.targeting.targetIds.some((targetId) => {
    const target = findCombatant(encounter, targetId);
    return target !== null && target.teamId !== actor.teamId && !target.defeated && !target.incapacitated;
  });
}

export function deriveCombatSkillGainCandidates(
  encounter: CombatEncounterState,
  action: CombatActionState
): CombatSkillGainCandidate[] {
  if (!["recovering", "resolved"].includes(action.lifecycle)) {
    return [];
  }

  if (!["combat.melee.primary", "combat.ranged.primary"].includes(action.actionType)) {
    return [];
  }

  const weaponSkillId = action.source.weaponSkillId;
  if (!weaponSkillId || action.source.itemHandlingType !== "weapon") {
    return [];
  }

  const hasDamageHook =
    action.resolutionHooks.includes("damage.melee") || action.resolutionHooks.includes("damage.ranged");
  if (!hasDamageHook || !hasValidEnemyTarget(encounter, action)) {
    return [];
  }

  return [
    {
      resolvedActionId: action.id,
      resolvedActionType: action.actionType,
      actorCombatantId: action.actorCombatantId,
      skillId: weaponSkillId,
      sourceType: "combat_action",
      sourceLabel: "combat.skill_gain.weapon_attack",
      rankDelta: 1,
      reason: "weapon_attack",
      eligible: true,
      blockedReason: null
    }
  ];
}

function resolveSkillIdentity(skillIds: string[]) {
  return {
    weaponSkillId: skillIds.find((skillId) => skillId.startsWith("skill.combat.weapon.")) ?? null,
    defensiveSkillId: skillIds.find((skillId) => skillId.startsWith("skill.combat.defense.")) ?? null,
    armorSkillId:
      skillIds.find((skillId) => skillId.startsWith("skill.combat.armor.") && !skillId.endsWith("_shields")) ?? null,
    shieldSkillId: resolveShieldSkillId(skillIds)
  };
}

function resolveGrantedActionTemplate(actor: CombatantState, actionType: string): ActionTemplate | null {
  const titleModifierIds = actor.hooks.titleMilestoneGrants.map((grant) => grant.titleId);

  const abilityGrant = actor.hooks.abilityActionGrants.find((grant) => grant.actionType === actionType);
  if (abilityGrant) {
    const skillIdentity = resolveSkillIdentity(abilityGrant.governingSkillIds);
    return {
      actionType: abilityGrant.actionType,
      sourceType: abilityGrant.category === "reaction" ? "reaction" : "ability",
      sourceId: abilityGrant.abilityId,
      skillIds: abilityGrant.governingSkillIds,
      targetShape: abilityGrant.targetProfile.shape,
      maxTargets: abilityGrant.targetProfile.maxTargets,
      weaponSkillId: skillIdentity.weaponSkillId,
      defensiveSkillId: skillIdentity.defensiveSkillId,
      armorSkillId: skillIdentity.armorSkillId,
      shieldSkillId: skillIdentity.shieldSkillId,
      spellScalingChannels: [],
      executionTimeTicks: abilityGrant.activation.executionTimeTicks,
      recoveryTimeTicks: abilityGrant.activation.recoveryTimeTicks,
      interruptible: abilityGrant.activation.interruptible,
      interruptPriority: abilityGrant.category === "reaction" ? "high" : "normal",
      resourceCosts: abilityGrant.activation.costs,
      targetDisposition: abilityGrant.targetProfile.disposition,
      effectChannels: abilityGrant.effectChannels,
      resolutionHooks: abilityGrant.resolutionHooks,
      critTags: abilityGrant.combatTags.filter((tag) => tag.includes("crit")),
      weaknessTags: abilityGrant.combatTags.filter((tag) => tag.includes("debuff") || tag.includes("interrupt")),
      titleModifierIds
    };
  }

  const spellGrant = actor.hooks.spellActionGrants.find((grant) => grant.actionType === actionType);
  if (spellGrant) {
    return {
      actionType: spellGrant.actionType,
      sourceType: "spell",
      sourceId: spellGrant.spellId,
      skillIds: [spellGrant.governingSkillId],
      targetShape: spellGrant.targetProfile.shape,
      maxTargets: spellGrant.targetProfile.maxTargets,
      spellSchool: spellGrant.school,
      spellTradition: spellGrant.tradition ?? null,
      spellDiscipline: spellGrant.discipline ?? null,
      spellElement: spellGrant.element ?? null,
      spellScalingChannels: spellGrant.scalingChannels,
      executionTimeTicks: spellGrant.activation.executionTimeTicks,
      recoveryTimeTicks: spellGrant.activation.recoveryTimeTicks,
      interruptible: spellGrant.activation.interruptible,
      interruptPriority: "normal",
      resourceCosts: spellGrant.activation.costs,
      targetDisposition: spellGrant.targetProfile.disposition,
      effectChannels: spellGrant.effectTags,
      resolutionHooks: spellGrant.resolutionHooks,
      critTags: spellGrant.effectTags.filter((tag) => tag.includes("crit")),
      weaknessTags: spellGrant.effectTags.filter((tag) => tag === "elemental" || tag === "control"),
      titleModifierIds
    };
  }

  const itemGrant = actor.hooks.itemUseProfileGrants.find((grant) => matchesGrantActionType(grant.actionType, actionType));
  if (itemGrant) {
    const skillIds = Array.from(
      new Set([
        itemGrant.primarySkillId,
        ...(itemGrant.supportSkillIds ?? []),
        itemGrant.proficiencySkillId ?? null,
        ...(itemGrant.hybridSkillIds ?? [])
      ].filter((skillId): skillId is string => Boolean(skillId)))
    );
    const skillIdentity = resolveSkillIdentity(skillIds);
    return {
      actionType: itemGrant.actionType,
      sourceType: itemGrant.handlingType === "weapon" ? "weapon_profile" : "item",
      sourceId: itemGrant.actionType,
      itemId: itemGrant.itemId,
      skillIds,
      targetShape: itemGrant.targetProfile?.shape,
      maxTargets: itemGrant.targetProfile?.maxTargets,
      weaponSkillId:
        itemGrant.handlingType === "weapon" || itemGrant.handlingType === "hybrid" ? skillIdentity.weaponSkillId : null,
      defensiveSkillId: itemGrant.handlingType === "shield" ? itemGrant.primarySkillId : skillIdentity.defensiveSkillId,
      armorSkillId: itemGrant.handlingType === "armor" ? itemGrant.primarySkillId : skillIdentity.armorSkillId,
      shieldSkillId:
        itemGrant.handlingType === "shield"
          ? skillIdentity.shieldSkillId ?? itemGrant.proficiencySkillId ?? null
          : skillIdentity.shieldSkillId,
      spellScalingChannels: [],
      executionTimeTicks: itemGrant.activation?.executionTimeTicks ?? 3,
      recoveryTimeTicks: itemGrant.activation?.recoveryTimeTicks ?? 4,
      interruptible: itemGrant.activation?.interruptible ?? false,
      interruptPriority: itemGrant.actionType.includes("interrupt") ? "high" : "normal",
      resourceCosts: itemGrant.activation?.costs ?? { stamina: 4 },
      targetDisposition: itemGrant.targetProfile?.disposition ?? "enemy",
      effectChannels: itemGrant.effectChannels,
      resolutionHooks: itemGrant.resolutionHooks ?? [],
      itemHandlingType: itemGrant.handlingType ?? null,
      itemProficiencyBand: itemGrant.proficiencyBand ?? null,
      critTags: itemGrant.combatTags?.filter((tag) => tag.includes("crit")) ?? [],
      weaknessTags: itemGrant.combatTags?.filter((tag) => tag.includes("interrupt") || tag.includes("improvised")) ?? [],
      titleModifierIds
    };
  }

  return null;
}

function getActionTemplate(actor: CombatantState, actionType: string): ActionTemplate {
  return resolveGrantedActionTemplate(actor, actionType) ?? ACTION_LIBRARY[actionType] ?? ACTION_LIBRARY["combat.attack.melee.basic"]!;
}

function resolveSkillEffectValue(scaling: CombatantState["hooks"]["skillEffectGrants"][number]["scaling"], rank: number): number {
  const base = scaling.base ?? 0;
  if (scaling.mode === "per_rank") {
    return roundTo(base + (scaling.perRank ?? 0) * Math.max(0, rank));
  }
  return roundTo(base);
}

function buildActionDescriptorTags(action: CombatActionState): string[] {
  const tags = new Set<string>();
  if (action.source.weaponSkillId) {
    const weaponFamily = action.source.weaponSkillId.split(".").at(-1);
    if (weaponFamily) {
      tags.add(`weapon.${weaponFamily}`);
    }
  }
  if (action.source.defensiveSkillId) {
    const defenseFamily = action.source.defensiveSkillId.split(".").at(-1);
    if (defenseFamily) {
      tags.add(`defense.${defenseFamily}`);
    }
  }
  if (action.source.armorSkillId) {
    const armorFamily = action.source.armorSkillId.split(".").at(-1);
    if (armorFamily) {
      tags.add(`armor.${armorFamily}`);
    }
  }
  if (action.source.shieldSkillId) {
    const shieldFamily = action.source.shieldSkillId.split(".").at(-1);
    if (shieldFamily) {
      tags.add(`armor.${shieldFamily}`);
      tags.add(`shield.${shieldFamily}`);
    }
  }
  if (action.source.itemHandlingType) {
    tags.add(action.source.itemHandlingType);
  }
  if (action.source.spellSchool) {
    tags.add(`school.${action.source.spellSchool}`);
  }
  if (action.source.spellTradition) {
    tags.add(`tradition.${action.source.spellTradition}`);
  }
  if (action.source.spellDiscipline) {
    tags.add(`discipline.${action.source.spellDiscipline}`);
  }
  if (action.source.spellElement) {
    tags.add(`element.${action.source.spellElement}`);
  }
  return [...tags];
}

function matchesGrantActionType(grantActionType: string | null, actionType: string): boolean {
  if (!grantActionType) {
    return true;
  }
  if (grantActionType === actionType) {
    return true;
  }
  if (resolveActionTypeFamily(grantActionType) === resolveActionTypeFamily(actionType)) {
    return true;
  }
  return grantActionType === "spell.cast" && actionType.startsWith("spell.");
}

function matchesGrantActionTags(grantActionTags: string[], action: CombatActionState): boolean {
  if (grantActionTags.length === 0) {
    return true;
  }
  const actionTags = new Set(buildActionDescriptorTags(action));
  return grantActionTags.some((tag) => actionTags.has(tag));
}

function sumSkillEffectGrantValues(
  actor: CombatantState,
  action: CombatActionState,
  effectChannels: string[] = [],
  resolutionHooks: string[] = []
): number {
  const effectChannelSet = new Set(effectChannels);
  const resolutionHookSet = new Set(resolutionHooks);
  return actor.hooks.skillEffectGrants.reduce((total, grant) => {
    if (!matchesGrantActionType(grant.actionType, action.actionType) || !matchesGrantActionTags(grant.actionTags, action)) {
      return total;
    }
    if (effectChannelSet.size > 0 && effectChannelSet.has(grant.effectChannel)) {
      return total + grant.resolvedValue;
    }
    if (resolutionHookSet.size > 0 && grant.resolutionHooks.some((hook) => resolutionHookSet.has(hook))) {
      return total + grant.resolvedValue;
    }
    return total;
  }, 0);
}

function resolveItemBandBonus(proficiencyBand: string | null | undefined): number {
  switch (proficiencyBand) {
    case "clumsy":
      return -1;
    case "familiar":
      return 0.5;
    case "proficient":
      return 1.25;
    case "skilled":
      return 2.25;
    case "mastery":
      return 3.5;
    default:
      return 0;
  }
}

function resolveMitigationFromStatuses(combatant: CombatantState): number {
  const mitigation = combatant.statusEffects.reduce((total, status) => {
    if (!status.magnitude) {
      return total;
    }
    if (status.tags.some((tag) => ["defense", "ward", "formation", "stance"].includes(tag))) {
      return total + status.magnitude;
    }
    return total;
  }, 0);
  return clamp(mitigation, 0, 0.55);
}

function resolveActionFamily(action: CombatActionState): CombatActionFamily {
  const isMagic = action.resolutionHooks.includes("damage.magic") || action.source.spellSchool != null;
  const isRanged = action.resolutionHooks.includes("damage.ranged") || isRangedWeaponSkillId(action.source.weaponSkillId);
  const isShield = action.source.itemHandlingType === "shield" || action.source.shieldSkillId != null;
  if (isMagic) {
    return "magic";
  }
  if (isRanged) {
    return "ranged";
  }
  if (isShield) {
    return "shield";
  }
  if (
    action.resolutionHooks.includes("damage.melee") ||
    action.actionType.includes("melee") ||
    action.targeting.targetDisposition === "enemy"
  ) {
    return "melee";
  }
  return "support";
}

function resolveActionStatPair(
  action: CombatActionState,
  actor: CombatantState
): { family: CombatActionFamily; base: number; offensiveStat: number } {
  const family = resolveActionFamily(action);
  switch (family) {
    case "magic":
      return {
        family,
        base: 13,
        offensiveStat:
          getAttribute(actor, "INT") +
          Math.max(getAttribute(actor, "SPT"), getAttribute(actor, "WIS")) +
          Math.min(getAttribute(actor, "SPT"), getAttribute(actor, "WIS")) * 0.2
      };
    case "ranged":
      return {
        family,
        base: 10,
        offensiveStat: getAttribute(actor, "DEX") + getAttribute(actor, "AGI") + getAttribute(actor, "WIS") * 0.2
      };
    case "shield":
      return {
        family,
        base: 8,
        offensiveStat: getAttribute(actor, "STR") + getAttribute(actor, "CON") + getAttribute(actor, "WIS") * 0.15
      };
    case "melee":
      return {
        family,
        base: 9,
        offensiveStat: getAttribute(actor, "STR") + getAttribute(actor, "DEX") + getAttribute(actor, "AGI") * 0.15
      };
    default:
      return {
        family,
        base: 9,
        offensiveStat: getAttribute(actor, "WIS") + getAttribute(actor, "CHA")
      };
  }
}

function resolveDefensiveStat(action: CombatActionState, target: CombatantState): number {
  const family = resolveActionFamily(action);
  if (family === "magic") {
    return (
      getAttribute(target, "CON") * 0.55 +
      getAttribute(target, "VIT") * 0.55 +
      getAttribute(target, "WIS") * 0.45 +
      getAttribute(target, "SPT") * 0.35
    );
  }
  if (family === "ranged") {
    return (
      getAttribute(target, "CON") +
      getAttribute(target, "VIT") +
      getAttribute(target, "AGI") * 0.25 +
      getAttribute(target, "WIS") * 0.15
    );
  }
  return (
    getAttribute(target, "CON") +
    getAttribute(target, "VIT") +
    getAttribute(target, "AGI") * 0.18 +
    getAttribute(target, "WIS") * 0.12
  );
}

function getArmorHandlingActionTypes(grant: CombatantState["hooks"]["armorHandlingGrants"][number]): string[] {
  const tags = new Set([...grant.combatTags, ...grant.resolutionHooks]);
  if (tags.has("armor.cloth_armor")) {
    return ["armor.handling.cloth", "combat.armor.cloth"];
  }
  if (tags.has("armor.light_armor")) {
    return ["armor.handling.light", "combat.armor.light"];
  }
  if (tags.has("armor.medium_armor")) {
    return ["armor.handling.medium", "combat.armor.medium"];
  }
  if (tags.has("armor.heavy_armor")) {
    return ["armor.handling.heavy", "combat.armor.heavy"];
  }
  if (tags.has("armor.plate_armor")) {
    return ["armor.handling.plate", "combat.armor.plate"];
  }
  if (grant.handlingType === "shield") {
    return ["combat.defense.block", "combat.interrupt.shield_bash"];
  }
  return [];
}

function getHandlingBaseReduction(grant: CombatantState["hooks"]["armorHandlingGrants"][number]): number {
  const tags = new Set([...grant.combatTags, ...grant.resolutionHooks]);
  if (grant.handlingType === "shield") {
    if (tags.has("shield.large") || tags.has("armor.large_shields")) {
      return 0.055;
    }
    if (tags.has("shield.medium") || tags.has("armor.medium_shields")) {
      return 0.04;
    }
    return 0.025;
  }
  if (tags.has("armor.plate_armor")) {
    return 0.06;
  }
  if (tags.has("armor.heavy_armor")) {
    return 0.05;
  }
  if (tags.has("armor.medium_armor")) {
    return 0.035;
  }
  if (tags.has("armor.light_armor")) {
    return 0.02;
  }
  if (tags.has("armor.cloth_armor")) {
    return 0.0125;
  }
  return 0;
}

function resolveBandReductionBonus(proficiencyBand: string | null | undefined): number {
  switch (proficiencyBand) {
    case "clumsy":
      return -0.005;
    case "proficient":
      return 0.005;
    case "skilled":
      return 0.01;
    case "mastery":
      return 0.015;
    default:
      return 0;
  }
}

function matchesAnyActionType(grantActionType: string | null, actionTypes: string[]): boolean {
  return actionTypes.length === 0 || actionTypes.some((actionType) => matchesGrantActionType(grantActionType, actionType));
}

function matchesAnyGrantTag(grantTags: string[], handlingTags: Set<string>): boolean {
  return grantTags.length === 0 || grantTags.some((tag) => handlingTags.has(tag));
}

function addShieldHandlingAliases(tags: Set<string>): Set<string> {
  if (tags.has("shield.small")) {
    tags.add("armor.small_shields");
  }
  if (tags.has("shield.medium")) {
    tags.add("armor.medium_shields");
  }
  if (tags.has("shield.large")) {
    tags.add("armor.large_shields");
  }
  if (tags.has("shield")) {
    tags.add("defense.shield_handling");
  }
  return tags;
}

function resolveHandlingSkillReduction(
  combatant: CombatantState,
  handlingGrant: CombatantState["hooks"]["armorHandlingGrants"][number],
  incomingHooks: string[]
): number {
  const actionTypes = getArmorHandlingActionTypes(handlingGrant);
  const handlingTags = addShieldHandlingAliases(new Set([...handlingGrant.combatTags, ...handlingGrant.resolutionHooks]));
  const incomingHookSet = new Set(incomingHooks);
  const defensiveChannels = new Set(["blockChance", "damageMitigation", "mitigation", "barrier", "evasion"]);
  const total = combatant.hooks.skillEffectGrants.reduce((sum, grant) => {
    if (!defensiveChannels.has(grant.effectChannel)) {
      return sum;
    }
    if (!matchesAnyActionType(grant.actionType, actionTypes)) {
      return sum;
    }
    if (!matchesAnyGrantTag(grant.actionTags, handlingTags) && !matchesAnyGrantTag(grant.combatTags, handlingTags)) {
      return sum;
    }
    if (
      grant.resolutionHooks.length > 0 &&
      incomingHookSet.size > 0 &&
      !grant.resolutionHooks.some((hook) => incomingHookSet.has(hook))
    ) {
      return sum;
    }
    return sum + grant.resolvedValue;
  }, 0);
  return total * 0.08;
}

function resolveEquipmentReduction(target: CombatantState, incomingHooks: string[]): number {
  const reduction = target.hooks.armorHandlingGrants.reduce((total, grant) => {
    const baseReduction = getHandlingBaseReduction(grant);
    const bandReduction = resolveBandReductionBonus(grant.proficiencyBand);
    const skillReduction = resolveHandlingSkillReduction(target, grant, incomingHooks);
    return total + Math.max(0, baseReduction + bandReduction + skillReduction);
  }, 0);
  return clamp(reduction, 0, 0.35);
}

function resolveDefensiveSkillReduction(target: CombatantState, incomingHooks: string[]): number {
  const incomingHookSet = new Set(incomingHooks);
  const defensiveChannels = new Set(["damageMitigation", "mitigation", "barrier", "evasion", "tempo", "blockChance"]);
  const passiveDefenseTags = new Set(["defense.evasion", "defense.parrying", "defense.guard"]);
  const total = target.hooks.skillEffectGrants.reduce((sum, grant) => {
    if (!defensiveChannels.has(grant.effectChannel)) {
      return sum;
    }
    const tags = [...grant.actionTags, ...grant.combatTags];
    if (!tags.some((tag) => passiveDefenseTags.has(tag))) {
      return sum;
    }
    if (
      grant.resolutionHooks.length > 0 &&
      incomingHookSet.size > 0 &&
      !grant.resolutionHooks.some((hook) => incomingHookSet.has(hook))
    ) {
      return sum;
    }
    return sum + grant.resolvedValue;
  }, 0);
  return clamp(total * 0.035, 0, 0.12);
}

export function resolveCombatDamagePreview(
  action: CombatActionState,
  actor: CombatantState,
  target: CombatantState
): CombatDamagePreview {
  const { family, base, offensiveStat } = resolveActionStatPair(action, actor);
  const skillBonus =
    sumSkillEffectGrantValues(
      actor,
      action,
      ["damage", "power", "pressure", "armorBreak", "penetration", "critChance", "guardPressure"],
      action.resolutionHooks
    ) * 10;
  const itemBandBonus = resolveItemBandBonus(action.source.itemProficiencyBand);
  const titleBonus = action.source.titleModifierIds.length * 0.6;
  const specialBonus =
    action.source.weaknessTags.length * 0.5 +
    action.source.critTags.length * 0.75 +
    (action.resolutionHooks.includes("execute.helpless") ? (target.incapacitated ? 8 : -3) : 0);
  const defensiveStat = resolveDefensiveStat(action, target);
  const statusReduction = resolveMitigationFromStatuses(target);
  const equipmentReduction = resolveEquipmentReduction(target, action.resolutionHooks);
  const defensiveSkillReduction = resolveDefensiveSkillReduction(target, action.resolutionHooks);
  const totalReduction = clamp(statusReduction + equipmentReduction + defensiveSkillReduction, 0, 0.55);
  const preReductionAmount = Math.max(
    1,
    base +
      offensiveStat * 0.18 +
      (actor.threatRating ?? 1) * 0.75 +
      skillBonus +
      itemBandBonus +
      titleBonus +
      specialBonus -
      defensiveStat * 0.1
  );
  return {
    actionFamily: family,
    baseDamage: base,
    offensiveStat: roundTo(offensiveStat),
    defensiveStat: roundTo(defensiveStat),
    skillBonus: roundTo(skillBonus),
    itemBandBonus: roundTo(itemBandBonus),
    titleBonus: roundTo(titleBonus),
    specialBonus: roundTo(specialBonus),
    statusReduction: roundTo(statusReduction),
    equipmentReduction: roundTo(equipmentReduction),
    defensiveSkillReduction: roundTo(defensiveSkillReduction),
    totalReduction: roundTo(totalReduction),
    preReductionAmount: roundTo(preReductionAmount),
    amount: Math.max(1, Math.round(preReductionAmount * (1 - totalReduction)))
  };
}

function resolveDamageAmount(action: CombatActionState, actor: CombatantState, target: CombatantState): number {
  return resolveCombatDamagePreview(action, actor, target).amount;
}

function resolveHealingAmount(action: CombatActionState, actor: CombatantState, target: CombatantState): number {
  const healingStat = getAttribute(actor, "WIS") + getAttribute(actor, "SPT") + getAttribute(actor, "INT") * 0.1;
  const healingBonus =
    sumSkillEffectGrantValues(actor, action, ["healingPower", "power", "magnitude"], ["heal.hp"]) * 10 +
    action.source.titleModifierIds.length * 0.75;
  const urgencyBonus = (1 - target.resources.hp.current / Math.max(1, target.resources.hp.max)) * 2;
  return Math.max(4, Math.round(12 + healingStat * 0.16 + healingBonus + urgencyBonus));
}

function buildStatusEffectFromHook(
  hook: string,
  target: CombatantState,
  source: CombatActionState["source"],
  currentTimeTick: number,
  magnitude = 0
): CombatantState["statusEffects"][number] | null {
  const definitions: Record<
    string,
    {
      label: string;
      duration: number;
      tags: string[];
      sourceType: string;
      defaultMagnitude?: number;
    }
  > = {
    "status.bind": { label: "Bound", duration: 10, tags: ["debuff", "control", "bind"], sourceType: "spell", defaultMagnitude: 0.08 },
    "status.sleep": { label: "Sleep", duration: 12, tags: ["debuff", "control", "sleep"], sourceType: "spell", defaultMagnitude: 0.1 },
    "status.hamstrung": {
      label: "Hamstrung",
      duration: 10,
      tags: ["debuff", "slow", "hamstrung"],
      sourceType: "ability",
      defaultMagnitude: 0.1
    },
    "status.pinned": { label: "Pinned", duration: 8, tags: ["debuff", "control", "pinned"], sourceType: "ability", defaultMagnitude: 0.08 },
    "status.prone": { label: "Prone", duration: 6, tags: ["debuff", "control", "prone"], sourceType: "ability", defaultMagnitude: 0.08 },
    "status.stagger": { label: "Staggered", duration: 4, tags: ["debuff", "interrupt", "stagger"], sourceType: "ability", defaultMagnitude: 0.06 },
    "status.stun": { label: "Stunned", duration: 4, tags: ["debuff", "control", "stun"], sourceType: "ability", defaultMagnitude: 0.1 },
    "debuff.disabled": { label: "Disabled", duration: 8, tags: ["debuff", "disabled"], sourceType: "ability", defaultMagnitude: 0.08 },
    "buff.protect": { label: "Protect", duration: 16, tags: ["buff", "defense", "ward"], sourceType: "spell", defaultMagnitude: 0.12 },
    "buff.ward": { label: "Ward", duration: 16, tags: ["buff", "defense", "ward"], sourceType: "spell", defaultMagnitude: 0.12 },
    "buff.anthem": { label: "Battle Anthem", duration: 18, tags: ["buff", "support", "tempo"], sourceType: "spell", defaultMagnitude: 0.1 },
    "defense.shield.small": {
      label: "Shield Block",
      duration: 6,
      tags: ["buff", "defense", "shield", "block"],
      sourceType: "item",
      defaultMagnitude: 0.08
    },
    "defense.shield.medium": {
      label: "Shield Block",
      duration: 7,
      tags: ["buff", "defense", "shield", "block"],
      sourceType: "item",
      defaultMagnitude: 0.1
    },
    "defense.shield.large": {
      label: "Shield Block",
      duration: 8,
      tags: ["buff", "defense", "shield", "block"],
      sourceType: "item",
      defaultMagnitude: 0.12
    },
    "stance.defensive": { label: "Defensive Stance", duration: 14, tags: ["buff", "defense", "stance"], sourceType: "ability", defaultMagnitude: 0.12 },
    "stance.brace": { label: "Brace", duration: 10, tags: ["buff", "stance", "counter"], sourceType: "ability", defaultMagnitude: 0.08 },
    "command.pressure": { label: "Press the Attack", duration: 12, tags: ["buff", "command", "offense"], sourceType: "ability", defaultMagnitude: 0.1 },
    "command.formation": {
      label: "Hold Formation",
      duration: 12,
      tags: ["buff", "command", "formation", "defense"],
      sourceType: "ability",
      defaultMagnitude: 0.1
    },
    "command.fall_back": { label: "Fall Back", duration: 10, tags: ["buff", "command", "withdrawal"], sourceType: "ability", defaultMagnitude: 0.08 },
    "mobility.shadow_step": { label: "Shadow Step", duration: 8, tags: ["buff", "mobility", "stealth"], sourceType: "spell", defaultMagnitude: 0.08 },
    "support.berry": { label: "Berry Call", duration: 16, tags: ["buff", "support", "berry"], sourceType: "spell", defaultMagnitude: 0.08 }
  };
  const definition = definitions[hook];
  if (!definition) {
    return null;
  }
  return {
    id: `${target.id}.status.${hook.replaceAll(".", "_")}.${currentTimeTick}`,
    label: definition.label,
    sourceType: definition.sourceType,
    sourceId: source.sourceId,
    stacks: 1,
    magnitude: roundTo(Math.max(magnitude, definition.defaultMagnitude ?? 0)),
    startedAtTick: currentTimeTick,
    expiresAtTick: currentTimeTick + definition.duration,
    tags: definition.tags
  };
}

function applyStatusHook(
  target: CombatantState,
  action: CombatActionState,
  hook: string,
  currentTimeTick: number,
  magnitude = 0
): void {
  const status = buildStatusEffectFromHook(hook, target, action.source, currentTimeTick, magnitude);
  if (!status) {
    return;
  }
  target.statusEffects = [...target.statusEffects, status];
}

function resolveActionTargets(encounter: CombatEncounterState, action: CombatActionState): CombatantState[] {
  return action.targeting.targetIds
    .map((targetId) => findCombatant(encounter, targetId))
    .filter((target): target is CombatantState => target !== null && !target.defeated);
}

function resolveActionPackageActionType(packageId: string): string {
  return ACTION_PACKAGE_LIBRARY[packageId] ?? "combat.attack.melee.basic";
}

function buildSpeedMultiplier(combatant: CombatantState): number {
  const agi = combatant.attributes.AGI ?? 10;
  const dex = combatant.attributes.DEX ?? 10;
  const pressure = clamp((agi + dex - 20) / 100, -0.2, 0.25);
  return clamp((1 - pressure) * combatant.hooks.actionTimeMultiplier, 0.55, 1.35);
}

function buildRecoveryMultiplier(combatant: CombatantState): number {
  return clamp(combatant.hooks.recoveryTimeMultiplier, 0.55, 1.35);
}

function createCombatAction(
  encounter: CombatEncounterState,
  actor: CombatantState,
  actionType: string,
  targetIds: string[],
  manualOverride: boolean
): CombatActionState {
  const template = getActionTemplate(actor, actionType);
  const speedMultiplier = buildSpeedMultiplier(actor);
  const recoveryMultiplier = buildRecoveryMultiplier(actor);
  const executionTimeTicks = Math.max(1, Math.round(template.executionTimeTicks * speedMultiplier));
  const recoveryTimeTicks = Math.max(1, Math.round(template.recoveryTimeTicks * recoveryMultiplier));
  const actionId = `${encounter.encounterId}.action.${encounter.nextActionOrdinal}`;
  encounter.nextActionOrdinal += 1;

  return {
    id: actionId,
    actionType: template.actionType,
    actorCombatantId: actor.id,
    targeting: {
      targetIds,
      primaryTargetId: targetIds[0] ?? null,
      targetDisposition: template.targetDisposition
    },
    queuedAtTick: encounter.currentTimeTick,
    startedAtTick: null,
    resolvesAtTick: null,
    recoveryEndsAtTick: null,
    executionTimeTicks,
    recoveryTimeTicks,
    interruptible: template.interruptible,
    interruptPriority: template.interruptPriority,
    resourceCosts: template.resourceCosts,
    manualOverride,
    lifecycle: "queued",
    source: {
      sourceType: template.sourceType,
      sourceId: template.sourceId,
      itemId: template.itemId ?? actor.equipment.mainHandItemId ?? null,
      skillIds: template.skillIds,
      weaponSkillId: template.weaponSkillId ?? null,
      defensiveSkillId: template.defensiveSkillId ?? null,
      armorSkillId: template.armorSkillId ?? null,
      shieldSkillId: template.shieldSkillId ?? null,
      spellSchool: template.spellSchool ?? null,
      spellTradition: template.spellTradition ?? null,
      spellDiscipline: template.spellDiscipline ?? null,
      spellElement: template.spellElement ?? null,
      spellScalingChannels: template.spellScalingChannels,
      effectChannels: template.effectChannels,
      itemHandlingType: template.itemHandlingType ?? null,
      itemProficiencyBand: template.itemProficiencyBand ?? null,
      critTags: template.critTags,
      weaknessTags: template.weaknessTags,
      titleModifierIds: template.titleModifierIds
    },
    resolutionHooks: template.resolutionHooks
  };
}

function deriveActorPreference(playerState: PlayerState, actorId: string) {
  return playerState.combatProfile.memberPreferences.find((entry) => entry.actorId === actorId) ?? null;
}

function buildPlayerHooks(playerState: PlayerState): CombatantState["hooks"] {
  const content = loadPlayerCombatContent();
  const skillIds = playerState.skills.map((entry) => entry.id);
  const spellIds = playerState.spells.map((entry) => entry.id);
  const abilityIds = playerState.abilities.map((entry) => entry.id);
  const traitIds = playerState.traits.map((entry) => entry.id);
  const itemIds = Object.values(playerState.equipment).flatMap((item) => (item?.itemId ? [item.itemId] : []));
  const skillRankById = new Map(playerState.skills.map((entry) => [entry.id, entry.rank]));
  const skillEffectGrants: CombatantState["hooks"]["skillEffectGrants"] = [];
  const tacticalGrants: CombatantState["hooks"]["tacticalGrants"] = [];

  for (const skillEntry of playerState.skills) {
    const skillRecord = content.skillById.get(skillEntry.id);
    if (!skillRecord) {
      continue;
    }

    for (const skillEffectId of skillRecord.combatHooks.skillEffectIds) {
      const skillEffect = content.skillEffectById.get(skillEffectId);
      if (!skillEffect) {
        continue;
      }
      for (const channel of skillEffect.channels) {
        skillEffectGrants.push({
          skillEffectId,
          skillId: skillEntry.id,
          resolvedValue: resolveSkillEffectValue(channel.scaling, skillEntry.rank),
          actionType: channel.actionType ?? null,
          actionTags: channel.actionTags ?? [],
          grantType: channel.grantType ?? "passive_bonus",
          effectChannel: channel.effectChannel,
          scaling: channel.scaling,
          combatTags: channel.combatTags ?? [],
          resolutionHooks: channel.resolutionHooks ?? []
        });
      }
    }

    if ((skillRecord.combatHooks.tacticalTags ?? []).length > 0) {
      tacticalGrants.push({
        skillId: skillEntry.id,
        tags: skillRecord.combatHooks.tacticalTags,
        sourceType: "skill",
        sourceId: skillEntry.id
      });
    }
  }

  const itemUseProfileGrants: CombatantState["hooks"]["itemUseProfileGrants"] = [];
  const armorHandlingGrants: CombatantState["hooks"]["armorHandlingGrants"] = [];
  for (const itemId of itemIds) {
    const itemRecord = content.itemById.get(itemId);
    if (!itemRecord) {
      continue;
    }
    for (const profile of itemRecord.useProfiles ?? []) {
      const proficiencyBand = profile.proficiencySkillId
        ? resolveSkillBand(skillRankById.get(profile.proficiencySkillId) ?? 1).id
        : null;
      itemUseProfileGrants.push({
        itemId,
        ...profile,
        proficiencyBand
      });
      const handlingType = profile.handlingType;
      if (
        (handlingType === "shield" || handlingType === "armor" || handlingType === "hybrid") &&
        profile.proficiencySkillId
      ) {
        armorHandlingGrants.push({
          itemId,
          handlingType,
          proficiencySkillId: profile.proficiencySkillId,
          proficiencyBand,
          hybridSkillIds: profile.hybridSkillIds ?? [],
          combatTags: profile.combatTags ?? [],
          resolutionHooks: profile.resolutionHooks ?? []
        });
      }
    }
  }

  const spellActionGrants = playerState.spells
    .map((spellEntry) => {
      const record = content.spellById.get(spellEntry.id);
      if (!record) {
        return null;
      }
      const grant: CombatantState["hooks"]["spellActionGrants"][number] = {
        spellId: record.id,
        actionType: record.castProfile.actionType,
        governingSkillId: record.governingSkillId,
        school: record.school,
        effectTags: record.effectTags,
        scalingChannels: record.scalingChannels as CombatantState["hooks"]["spellActionGrants"][number]["scalingChannels"],
        targetProfile: record.targetProfile,
        activation: record.castProfile,
        resolutionHooks: record.resolutionHooks,
        itemGenerationHooks: record.itemGenerationHooks ?? []
      };
      if (record.tradition !== undefined) {
        grant.tradition = record.tradition;
      }
      if (record.discipline !== undefined) {
        grant.discipline = record.discipline;
      }
      if (record.element !== undefined) {
        grant.element = record.element;
      }
      return grant;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const abilityActionGrants = playerState.abilities
    .map((abilityEntry) => {
      const record = content.abilityById.get(abilityEntry.id);
      if (!record || !record.activation) {
        return null;
      }
      const targetConditions = (record.requirements.targetConditionsAny ?? []).map((condition) =>
        `${condition.scope}:${condition.condition}${condition.qualifier ? `:${condition.qualifier}` : ""}`
      );
      if (record.category === "command" || record.category === "tactical") {
        tacticalGrants.push({
          skillId: record.governingSkillIds[0] ?? record.id,
          tags: record.combatTags,
          sourceType: "ability",
          sourceId: record.id
        });
      }
      return {
        abilityId: record.id,
        actionType: record.activation.actionType,
        category: record.category as CombatantState["hooks"]["abilityActionGrants"][number]["category"],
        governingSkillIds: record.governingSkillIds,
        targetProfile: record.targetProfile,
        activation: record.activation,
        effectChannels: record.effectChannels,
        combatTags: record.combatTags,
        resolutionHooks: record.resolutionHooks,
        targetConditions
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const titleMilestoneGrants = playerState.titles.map((titleEntry) => {
    const titleRecord = content.titleById.get(titleEntry.id);
    const title = titleRecord
      ? {
          ...titleEntry,
          trackId: titleRecord.trackId,
          family: titleRecord.family,
          sourceSkillId: titleRecord.sourceSkillId
        }
      : titleEntry;
    tacticalGrants.push({
      skillId: title.sourceSkillId ?? title.id,
      tags: [title.trackId, title.family],
      sourceType: "title",
      sourceId: title.id
    });
    return {
      titleId: title.id,
      trackId: title.trackId,
      family: title.family,
      sourceSkillId: title.sourceSkillId,
      threshold: title.milestone.threshold,
      masteryTrialId: title.milestone.trialId ?? null,
      effects: title.effects
    };
  });

  return {
    skillIds,
    spellIds,
    abilityIds,
    traitIds,
    itemIds,
    skillEffectGrants,
    itemUseProfileGrants,
    armorHandlingGrants,
    spellActionGrants,
    abilityActionGrants,
    titleMilestoneGrants,
    tacticalGrants,
    roleModifierIds: [],
    actionTimeMultiplier: 1,
    recoveryTimeMultiplier: 1
  };
}

function resolvePlayerThreatRating(playerState: PlayerState): number {
  const combatSkillRanks = playerState.skills
    .filter(
      (skill) => skill.id.startsWith("skill.combat.") || skill.id.startsWith("skill.magic.")
    )
    .map((skill) => skill.rank);
  const dominantSkillRank = combatSkillRanks.length > 0 ? Math.max(...combatSkillRanks) : 0;
  const coreCombatAttributes =
    playerState.attributes.STR +
    playerState.attributes.DEX +
    playerState.attributes.AGI +
    playerState.attributes.CON +
    playerState.attributes.VIT +
    playerState.attributes.INT +
    playerState.attributes.WIS +
    playerState.attributes.SPT +
    playerState.attributes.CHA;
  const learnedPressure = playerState.abilities.length * 1.5 + playerState.spells.length * 1.5;

  return Math.max(
    1,
    Math.round(dominantSkillRank / 8 + coreCombatAttributes / 30 + learnedPressure)
  );
}

function buildPlayerCombatant(playerState: PlayerState, encounterId: string): CombatantState {
  const actorId = `actor.${playerState.playerId}`;
  const preference = deriveActorPreference(playerState, playerState.playerId);
  return {
    id: `${encounterId}.combatant.player`,
    displayName: playerState.coreData.playerName,
    kind: "player",
    disposition: "ally",
    teamId: "allies",
    sourceRefs: {
      playerId: playerState.playerId
    },
    attributes: playerState.attributes,
    resources: {
      hp: { ...playerState.resources.hp },
      mp: { ...playerState.resources.mp },
      stamina: { ...playerState.resources.stamina }
    },
    statusEffects: playerState.activeEffects.map((effectId, index) => ({
      id: `${playerState.playerId}.status.${index + 1}`,
      label: effectId,
      sourceType: "player_effect",
      sourceId: effectId,
      stacks: 1,
      startedAtTick: 0,
      tags: []
    })),
    incapacitated: false,
    defeated: playerState.resources.hp.current <= 0,
    roleId: preference?.defaultRoleId ?? "flexible_adaptive",
    controlMode: preference?.defaultControlMode ?? "manual",
    tacticsPresetId: preference?.tacticsPresetId ?? null,
    tactics: preference?.tactics ?? createDefaultCombatTactics(preference?.defaultRoleId ?? "flexible_adaptive"),
    targetPreferences: preference?.tactics.targetPreferences ?? [],
    focusDirectives: preference?.tactics.focusDirectives ?? createEmptyCombatFocusDirectives(),
    timing: {
      readyAtTick: 0,
      currentActionId: null,
      recoveryEndsAtTick: null,
      channelEndsAtTick: null,
      interruptWindowEndsAtTick: null,
      queuedActionIds: [],
      lastCompletedActionId: null
    },
    equipment: {
      mainHandItemId: playerState.equipment["slot.weapon.right"]?.itemId ?? null,
      offHandItemId: playerState.equipment["slot.weapon.left"]?.itemId ?? null,
      armorItemIds: Object.values(playerState.equipment)
        .flatMap((item) => (item?.itemId ? [item.itemId] : []))
    },
    hooks: buildPlayerHooks(playerState),
    threatRating: resolvePlayerThreatRating(playerState)
  };
}

function buildMonsterCombatant(
  encounterId: string,
  encounterTemplateId: string,
  spawnProfileId: string,
  monsterId: string,
  ordinal: number,
  difficultyTier: number
): CombatantState | null {
  const spawnContent = loadSpawnFoundationContent();
  const combatContent = loadCombatFoundationContent();
  const monster = spawnContent.monsterById.get(monsterId);
  if (!monster) {
    return null;
  }

  const presetId = `preset.enemy.${monster.defaultRole}`;
  const preset = combatContent.presetById.get(presetId);
  const hpMax = monster.combatProfile.baseHp + monster.difficultyScalingHooks.hpPerTier * difficultyTier;
  const mpMax = monster.combatProfile.baseMp + monster.difficultyScalingHooks.mpPerTier * difficultyTier;
  const staminaMax =
    monster.combatProfile.baseStamina + monster.difficultyScalingHooks.staminaPerTier * difficultyTier;
  const accuracy =
    monster.combatProfile.baseAccuracy + monster.difficultyScalingHooks.accuracyPerTier * difficultyTier;
  const defense =
    monster.combatProfile.baseDefense + monster.difficultyScalingHooks.defensePerTier * difficultyTier;
  const evasion = monster.combatProfile.baseEvasion;
  const actionTimeMultiplier = clamp(
    1 - monster.difficultyScalingHooks.actionTimeMultiplierPerTier * difficultyTier,
    0.55,
    1.25
  );
  const recoveryTimeMultiplier = clamp(
    1 - monster.difficultyScalingHooks.recoveryMultiplierPerTier * difficultyTier,
    0.55,
    1.25
  );

  return {
    id: `${encounterId}.combatant.enemy.${ordinal}`,
    displayName: monster.name,
    kind: "enemy",
    disposition: "enemy",
    teamId: "enemies",
    sourceRefs: {
      monsterId: monster.id,
      encounterTemplateId,
      spawnProfileId
    },
    attributes: {
      DEX: accuracy,
      AGI: Math.round((monster.combatProfile.baseAttackSpeed * 2 + evasion) / 3),
      CON: defense,
      VIT: monster.combatProfile.baseRecoverySpeed,
      WIS: evasion
    },
    resources: {
      hp: { current: hpMax, max: hpMax },
      mp: { current: mpMax, max: mpMax },
      stamina: { current: staminaMax, max: staminaMax }
    },
    statusEffects: [],
    incapacitated: false,
    defeated: false,
    roleId: monster.defaultRole,
    controlMode: "ai",
    tacticsPresetId: preset?.id ?? null,
    tactics: preset?.tactics ?? createDefaultCombatTactics(monster.defaultRole),
    targetPreferences: preset?.tactics.targetPreferences ?? [],
    focusDirectives: preset?.tactics.focusDirectives ?? createEmptyCombatFocusDirectives(),
    timing: {
      readyAtTick: 0,
      currentActionId: null,
      recoveryEndsAtTick: null,
      channelEndsAtTick: null,
      interruptWindowEndsAtTick: null,
      queuedActionIds: [],
      lastCompletedActionId: null
    },
    equipment: {
      mainHandItemId: null,
      offHandItemId: null,
      armorItemIds: []
    },
    hooks: {
      skillIds: [],
      spellIds: [],
      abilityIds: [],
      traitIds: [],
      itemIds: [],
      skillEffectGrants: [],
      itemUseProfileGrants: [],
      armorHandlingGrants: [],
      spellActionGrants: [],
      abilityActionGrants: [],
      titleMilestoneGrants: [],
      tacticalGrants: [],
      roleModifierIds: monster.actionPackageIds,
      actionTimeMultiplier,
      recoveryTimeMultiplier
    },
    threatRating: monster.combatProfile.threatRating + difficultyTier
  };
}

export function createEncounterFromSpawnCandidate(
  gameState: GameState,
  playerState: PlayerState,
  candidate: ResolvedSpawnCandidateState,
  tick: number
): CombatEncounterState | null {
  const spawnContent = loadSpawnFoundationContent();
  const template = spawnContent.encounterTemplateById.get(candidate.encounterTemplateId);
  if (!template) {
    return null;
  }

  const encounterId = `${template.id}.${tick}`;
  const playerCombatant = buildPlayerCombatant(playerState, encounterId);
  const enemyCombatants: CombatantState[] = [];

  let ordinal = 1;
  for (const member of template.members) {
    const range = member.maxCount - member.minCount + 1;
    const count =
      member.minCount +
      (range <= 1 ? 0 : hashText(`${candidate.id}:${member.monsterId}`) % range);
    for (let index = 0; index < count; index += 1) {
      const combatant = buildMonsterCombatant(
        encounterId,
        template.id,
        candidate.spawnProfileId,
        member.monsterId,
        ordinal,
        candidate.difficultyTier
      );
      ordinal += 1;
      if (combatant) {
        enemyCombatants.push(combatant);
      }
    }
  }

  if (enemyCombatants.length === 0) {
    return null;
  }

  gameState.party.leaderCombatantId = playerCombatant.id;
  const existingPlayerMember = gameState.party.members.find((entry) => entry.actorId === playerState.playerId);
  if (existingPlayerMember) {
    existingPlayerMember.combatantId = playerCombatant.id;
    existingPlayerMember.roleId = playerCombatant.roleId;
    existingPlayerMember.controlMode = playerCombatant.controlMode;
    existingPlayerMember.tacticsPresetId = playerCombatant.tacticsPresetId;
  } else {
    gameState.party.members = [
      ...gameState.party.members,
      {
        combatantId: playerCombatant.id,
        actorId: playerState.playerId,
        displayName: playerState.coreData.playerName,
        kind: "player",
        roleId: playerCombatant.roleId,
        controlMode: playerCombatant.controlMode,
        tacticsPresetId: playerCombatant.tacticsPresetId
      }
    ];
  }

  return {
    encounterId,
    encounterTemplateId: template.id,
    spawnProfileId: candidate.spawnProfileId,
    state: "active",
    area: {
      regionId: candidate.regionId,
      settlementId: candidate.settlementId,
      siteId: candidate.siteId,
      worldHexId: candidate.worldHexId,
      habitatTags: candidate.habitatTags,
      hazardPressure: candidate.hazardPressure
    },
    currentTimeTick: tick,
    alliedCombatantIds: [playerCombatant.id],
    alliedGuestCombatantIds: [],
    enemyCombatantIds: enemyCombatants.map((entry) => entry.id),
    teams: [
      { id: "allies", disposition: "ally", combatantIds: [playerCombatant.id] },
      { id: "enemies", disposition: "enemy", combatantIds: enemyCombatants.map((entry) => entry.id) }
    ],
    combatants: [playerCombatant, ...enemyCombatants],
    actions: [],
    nextActionOrdinal: 1,
    pauseAllowed: gameState.mode.combatPauseAllowed,
    paused: false,
    targeting: {
      currentPlayerTargetId: enemyCombatants[0]?.id ?? null,
      focusTargetIds: [],
      ignoreTargetIds: [],
      priorityTargetIds: [],
      deprioritizedTargetIds: []
    },
    manualOverrides: [],
    outcome: null
  };
}

function findCombatant(encounter: CombatEncounterState, combatantId: string): CombatantState | null {
  return encounter.combatants.find((entry) => entry.id === combatantId) ?? null;
}

function findFirstLivingTarget(encounter: CombatEncounterState, disposition: "ally" | "enemy"): CombatantState | null {
  const targetIds =
    disposition === "ally" ? encounter.alliedCombatantIds : encounter.enemyCombatantIds;
  return (
    targetIds
      .map((combatantId) => findCombatant(encounter, combatantId))
      .find((combatant) => combatant !== null && !combatant.defeated && !combatant.incapacitated) ?? null
  );
}

function listLivingTargets(encounter: CombatEncounterState, disposition: "ally" | "enemy"): CombatantState[] {
  const targetIds = disposition === "ally" ? encounter.alliedCombatantIds : encounter.enemyCombatantIds;
  return targetIds
    .map((combatantId) => findCombatant(encounter, combatantId))
    .filter((combatant): combatant is CombatantState => combatant !== null && !combatant.defeated && !combatant.incapacitated);
}

function resolveRelativeTargetDisposition(
  actor: CombatantState,
  targetDisposition: ActionTemplate["targetDisposition"]
): "ally" | "enemy" | "self" {
  if (targetDisposition === "self") {
    return "self";
  }
  if (actor.disposition === "enemy") {
    return targetDisposition === "ally" ? "enemy" : "ally";
  }
  return targetDisposition === "ally" ? "ally" : "enemy";
}

function buildCandidateActionTypes(actor: CombatantState): string[] {
  const actionTypes = new Set<string>();

  for (const grant of actor.hooks.itemUseProfileGrants) {
    actionTypes.add(grant.actionType);
  }
  for (const grant of actor.hooks.spellActionGrants) {
    actionTypes.add(grant.actionType);
  }
  for (const grant of actor.hooks.abilityActionGrants) {
    actionTypes.add(grant.actionType);
  }
  for (const packageId of actor.hooks.roleModifierIds) {
    actionTypes.add(resolveActionPackageActionType(packageId));
  }

  if (actionTypes.size === 0) {
    actionTypes.add("combat.attack.melee.basic");
  }

  return [...actionTypes];
}

function scoreActionType(encounter: CombatEncounterState, actor: CombatantState, actionType: string): number {
  const template = getActionTemplate(actor, actionType);
  const defaults = createDefaultCombatTactics(actor.roleId);
  const preferences = actor.tactics?.preferences ?? defaults.preferences;
  const spellPreferences = actor.tactics?.spellPreferences ?? defaults.spellPreferences;
  const mpRatio = actor.resources.mp.max > 0 ? actor.resources.mp.current / actor.resources.mp.max : 1;
  const staminaRatio = actor.resources.stamina.max > 0 ? actor.resources.stamina.current / actor.resources.stamina.max : 1;
  const alliedDisposition = actor.disposition === "enemy" ? "enemy" : "ally";
  const woundedAllies = listLivingTargets(encounter, alliedDisposition).filter(
    (target) => target.resources.hp.current / Math.max(1, target.resources.hp.max) < 0.8
  );
  const castableEnemy = encounter.actions.some(
    (action) =>
      action.actorCombatantId !== actor.id &&
      action.interruptible &&
      ["executing", "channeling"].includes(action.lifecycle) &&
      (action.resolvesAtTick ?? Number.MAX_SAFE_INTEGER) > encounter.currentTimeTick
  );

  const isSpell = template.sourceType === "spell" || template.spellSchool !== undefined;
  const isHealing = template.resolutionHooks.includes("heal.hp") || template.spellSchool === "healing";
  const isEnhancing =
    template.resolutionHooks.includes("buff.protect") ||
    template.spellSchool === "enhancing" ||
    template.actionType.startsWith("ability.command.");
  const isEnfeebling = template.resolutionHooks.includes("status.sleep") || template.spellSchool === "enfeebling";
  const isInterrupt = template.resolutionHooks.includes("interrupt.primary") || template.effectChannels.includes("interrupt");
  const isRanged =
    isRangedWeaponSkillId(template.weaponSkillId) ||
    template.actionType.includes("ranged") ||
    template.effectChannels.includes("pressure");
  const isMagic = isSpell || template.resolutionHooks.includes("damage.magic");
  const isMelee = !isMagic && !isRanged && template.targetDisposition === "enemy";

  let score = 10;
  if (isHealing) {
    score += getBiasWeight(preferences.favorHealingUrgency) * 2;
    score += woundedAllies.length > 0 ? 10 : -8;
  } else if (isEnhancing && template.targetDisposition === "ally") {
    score += getBiasWeight(preferences.favorEnhancing) + getBiasWeight(preferences.favorConservation);
    score += woundedAllies.length > 0 ? 1 : -1;
  } else if (isEnfeebling) {
    score += getBiasWeight(preferences.favorMagicEngagement) + getBiasWeight(preferences.favorEnfeebling);
    score += castableEnemy ? 2 : 0;
    score += spellPreferences.debuffPriority === "critical" ? 3 : 0;
  } else if (isInterrupt) {
    score += getBiasWeight(preferences.favorInterrupts) * 2 + getBiasWeight(preferences.favorMeleeEngagement);
    score += castableEnemy ? 8 : -3;
  } else if (isMagic) {
    score += getBiasWeight(preferences.favorMagicEngagement) + getBiasWeight(preferences.favorDamage);
    score += getBiasWeight(preferences.favorWeaknessExploitation);
    score += template.spellSchool && spellPreferences.preferredSchools.includes(template.spellSchool) ? 2 : 0;
  } else if (isRanged) {
    score += getBiasWeight(preferences.favorRangedEngagement) + getBiasWeight(preferences.favorDamage) + 0.5;
  } else if (isMelee) {
    score += getBiasWeight(preferences.favorMeleeEngagement) + getBiasWeight(preferences.favorDamage);
  }

  if (template.resourceCosts.mp && mpRatio <= spellPreferences.resourceConservationThresholds.mpRatio) {
    score -= Math.max(1, getBiasWeight(preferences.favorConservation) * 2 + 2);
  }
  if (template.resourceCosts.stamina && staminaRatio <= spellPreferences.resourceConservationThresholds.staminaRatio) {
    score -= Math.max(1, getBiasWeight(preferences.favorConservation) + 1);
  }

  if (actor.roleId === "healer" && isHealing) {
    score += 8;
  }
  if (actor.roleId === "support_buffer" && isEnhancing) {
    score += 6;
  }
  if (actor.roleId === "disruptor" && isInterrupt) {
    score += 6;
  }
  if (actor.roleId === "ranged_pressure" && isRanged) {
    score += 5;
  }

  return score;
}

function scoreTargetByRule(
  encounter: CombatEncounterState,
  actor: CombatantState,
  target: CombatantState,
  actionType: string
): number {
  const actionTemplate = getActionTemplate(actor, actionType);
  let score = 0;
  const hpRatio = target.resources.hp.current / Math.max(1, target.resources.hp.max);
  const mpRatio = target.resources.mp.current / Math.max(1, target.resources.mp.max);
  const staminaRatio = target.resources.stamina.current / Math.max(1, target.resources.stamina.max);

  if (actor.focusDirectives.focusTargetIds.includes(target.id)) {
    score += 16;
  }
  if (actor.focusDirectives.ignoreTargetIds.includes(target.id)) {
    score -= 100;
  }
  if (actor.focusDirectives.priorityTargetIds.includes(target.id)) {
    score += 12;
  }
  if (actor.focusDirectives.deprioritizedTargetIds.includes(target.id)) {
    score -= 8;
  }
  if (encounter.targeting.currentPlayerTargetId === target.id) {
    score += 3;
  }

  if (actionTemplate.targetDisposition === "ally") {
    score += (1 - hpRatio) * 20;
  } else {
    score += (1 - hpRatio) * 5;
  }

  for (const preference of actor.targetPreferences) {
    if (preference.actionTypes && !preference.actionTypes.includes(actionType)) {
      continue;
    }

    switch (preference.rule) {
      case "lowest_hp":
        score += (1 - hpRatio) * preference.weight;
        break;
      case "highest_hp":
        score += hpRatio * preference.weight;
        break;
      case "lowest_mp":
        score += (1 - mpRatio) * preference.weight;
        break;
      case "highest_mp":
        score += mpRatio * preference.weight;
        break;
      case "lowest_stamina":
        score += (1 - staminaRatio) * preference.weight;
        break;
      case "highest_stamina":
        score += staminaRatio * preference.weight;
        break;
      case "lowest_max_hp":
        score += (1 / Math.max(1, target.resources.hp.max)) * 100 * preference.weight;
        break;
      case "highest_max_hp":
        score += (target.resources.hp.max / 100) * preference.weight;
        break;
      case "lowest_max_mp":
        score += (1 / Math.max(1, target.resources.mp.max)) * 100 * preference.weight;
        break;
      case "highest_max_mp":
        score += (target.resources.mp.max / 100) * preference.weight;
        break;
      case "lowest_max_stamina":
        score += (1 / Math.max(1, target.resources.stamina.max)) * 100 * preference.weight;
        break;
      case "highest_max_stamina":
        score += (target.resources.stamina.max / 100) * preference.weight;
        break;
      case "highest_threat":
        score += target.threatRating * preference.weight;
        break;
      case "currently_casting":
        score += target.timing.currentActionId ? preference.weight * 2 : 0;
        break;
      case "easiest_to_interrupt":
        score +=
          target.timing.currentActionId &&
          (target.timing.interruptWindowEndsAtTick ?? -1) >= encounter.currentTimeTick
            ? preference.weight * 2
            : 0;
        break;
      case "focus_current_player_target":
        score += encounter.targeting.currentPlayerTargetId === target.id ? preference.weight * 2 : 0;
        break;
      case "ignore_specific_targets":
        score += preference.sourceTargetIds?.includes(target.id) ? -100 : 0;
        break;
      case "melee_focus":
        score += actionType.includes("melee") ? preference.weight : 0;
        break;
      case "melee_ignore":
        score += actionType.includes("melee") ? -preference.weight : 0;
        break;
      case "ranged_focus":
        score += actionType.includes("ranged") ? preference.weight : 0;
        break;
      case "ranged_ignore":
        score += actionType.includes("ranged") ? -preference.weight : 0;
        break;
      case "magic_focus":
        score += (actionType.startsWith("spell.") || actionTemplate.spellSchool) ? preference.weight : 0;
        break;
      case "magic_ignore":
        score += (actionType.startsWith("spell.") || actionTemplate.spellSchool) ? -preference.weight : 0;
        break;
      default:
        break;
    }
  }

  return score;
}

function chooseAiActionType(encounter: CombatEncounterState, actor: CombatantState): string {
  const actionTypes = buildCandidateActionTypes(actor);
  return (
    actionTypes
      .map((actionType) => ({ actionType, score: scoreActionType(encounter, actor, actionType) }))
      .sort((left, right) => right.score - left.score)[0]?.actionType ?? "combat.attack.melee.basic"
  );
}

function chooseAiTargetIds(encounter: CombatEncounterState, actor: CombatantState, actionType: string): string[] {
  const template = getActionTemplate(actor, actionType);
  const relativeDisposition = resolveRelativeTargetDisposition(actor, template.targetDisposition);
  if (relativeDisposition === "self") {
    return [actor.id];
  }

  const rankedTargets = listLivingTargets(encounter, relativeDisposition)
    .map((candidate) => ({
      candidate,
      score: scoreTargetByRule(encounter, actor, candidate, actionType)
    }))
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.candidate);

  if (rankedTargets.length === 0) {
    const fallbackTarget = findFirstLivingTarget(encounter, relativeDisposition);
    return fallbackTarget ? [fallbackTarget.id] : [];
  }

  const targetLimit = Math.max(1, template.maxTargets ?? 1);
  const shouldMultiTarget = targetLimit > 1 && ["party", "line", "arc"].includes(template.targetShape ?? "");
  const primaryTarget = rankedTargets[0];
  if (!primaryTarget) {
    return [];
  }
  return shouldMultiTarget ? rankedTargets.slice(0, targetLimit).map((target) => target.id) : [primaryTarget.id];
}

function queueAction(encounter: CombatEncounterState, action: CombatActionState): void {
  encounter.actions.push(action);
  const actor = findCombatant(encounter, action.actorCombatantId);
  if (!actor) {
    return;
  }
  actor.timing.queuedActionIds = [...actor.timing.queuedActionIds, action.id];
}

function applyCosts(combatant: CombatantState, action: CombatActionState): void {
  combatant.resources.hp.current = clamp(
    combatant.resources.hp.current - (action.resourceCosts.hp ?? 0),
    0,
    combatant.resources.hp.max
  );
  combatant.resources.mp.current = clamp(
    combatant.resources.mp.current - (action.resourceCosts.mp ?? 0),
    0,
    combatant.resources.mp.max
  );
  combatant.resources.stamina.current = clamp(
    combatant.resources.stamina.current - (action.resourceCosts.stamina ?? 0),
    0,
    combatant.resources.stamina.max
  );
}

function markCombatantDefeated(combatant: CombatantState): void {
  if (combatant.resources.hp.current <= 0) {
    combatant.resources.hp.current = 0;
    combatant.incapacitated = true;
    combatant.defeated = true;
  }
}

function interruptTarget(encounter: CombatEncounterState, target: CombatantState): boolean {
  const currentActionId = target.timing.currentActionId;
  if (!currentActionId) {
    return false;
  }
  const currentAction = encounter.actions.find((entry) => entry.id === currentActionId);
  if (!currentAction || !currentAction.interruptible) {
    return false;
  }
  if ((target.timing.interruptWindowEndsAtTick ?? -1) < encounter.currentTimeTick) {
    return false;
  }

  currentAction.lifecycle = "interrupted";
  target.timing.currentActionId = null;
  target.timing.channelEndsAtTick = null;
  target.timing.interruptWindowEndsAtTick = null;
  target.timing.recoveryEndsAtTick = encounter.currentTimeTick + 1;
  return true;
}

function resolveAction(encounter: CombatEncounterState, action: CombatActionState): void {
  const actor = findCombatant(encounter, action.actorCombatantId);
  if (!actor || actor.defeated) {
    action.lifecycle = "cancelled";
    return;
  }

  const targets = resolveActionTargets(encounter, action);
  const primaryTarget = targets[0] ?? null;
  const statusMagnitude =
    sumSkillEffectGrantValues(actor, action, ["magnitude", "barrier", "tempo", "duration", "statusChance", "stagger"], action.resolutionHooks) * 0.5;

  if (action.resolutionHooks.includes("interrupt.primary") && primaryTarget) {
    interruptTarget(encounter, primaryTarget);
  }

  if (action.resolutionHooks.includes("heal.hp")) {
    for (const target of targets) {
      target.resources.hp.current = clamp(target.resources.hp.current + resolveHealingAmount(action, actor, target), 0, target.resources.hp.max);
    }
  } else if (
    action.resolutionHooks.includes("damage.melee") ||
    action.resolutionHooks.includes("damage.ranged") ||
    action.resolutionHooks.includes("damage.magic")
  ) {
    for (const target of targets) {
      target.resources.hp.current = clamp(
        target.resources.hp.current - resolveDamageAmount(action, actor, target),
        0,
        target.resources.hp.max
      );
      markCombatantDefeated(target);
    }
  }

  for (const target of targets) {
    for (const hook of action.resolutionHooks) {
      if (
        [
          "heal.hp",
          "damage.melee",
          "damage.ranged",
          "damage.magic",
          "interrupt.primary"
        ].includes(hook) ||
        hook.startsWith("school.") ||
        hook.startsWith("element.") ||
        hook.startsWith("tradition.") ||
        hook.startsWith("discipline.")
      ) {
        continue;
      }
      applyStatusHook(target, action, hook, encounter.currentTimeTick, statusMagnitude);
    }
  }

  if (action.resolutionHooks.includes("command.focus_target") && primaryTarget) {
    encounter.targeting.currentPlayerTargetId = primaryTarget.id;
    for (const combatant of encounter.combatants) {
      if (combatant.disposition === actor.disposition) {
        combatant.focusDirectives.priorityTargetIds = [...new Set([...combatant.focusDirectives.priorityTargetIds, primaryTarget.id])];
      }
    }
  }

  action.lifecycle = "recovering";
}

function startReadyActions(encounter: CombatEncounterState): void {
  for (const combatant of encounter.combatants) {
    if (
      combatant.defeated ||
      combatant.incapacitated ||
      combatant.statusEffects.some((status) => status.tags.includes("control"))
    ) {
      continue;
    }
    if (combatant.timing.currentActionId) {
      continue;
    }
    if (combatant.timing.readyAtTick > encounter.currentTimeTick) {
      continue;
    }
    const queuedActionId = combatant.timing.queuedActionIds[0];
    if (!queuedActionId) {
      continue;
    }
    const action = encounter.actions.find((entry) => entry.id === queuedActionId);
    if (!action || action.lifecycle !== "queued") {
      continue;
    }

    if (!canPayCosts(combatant, action)) {
      action.lifecycle = "cancelled";
      combatant.timing.queuedActionIds = combatant.timing.queuedActionIds.slice(1);
      continue;
    }

    applyCosts(combatant, action);
    action.startedAtTick = encounter.currentTimeTick;
    action.resolvesAtTick = encounter.currentTimeTick + action.executionTimeTicks;
    action.recoveryEndsAtTick = action.resolvesAtTick + action.recoveryTimeTicks;
    action.lifecycle = action.interruptible ? "channeling" : "executing";
    combatant.timing.currentActionId = action.id;
    combatant.timing.channelEndsAtTick = action.interruptible ? action.resolvesAtTick : null;
    combatant.timing.interruptWindowEndsAtTick = action.interruptible
      ? encounter.currentTimeTick + Math.max(1, Math.floor(action.executionTimeTicks / 2))
      : null;
    combatant.timing.recoveryEndsAtTick = action.recoveryEndsAtTick;
    combatant.timing.queuedActionIds = combatant.timing.queuedActionIds.slice(1);
  }
}

function queueAiActions(encounter: CombatEncounterState): void {
  for (const combatant of encounter.combatants) {
    if (
      combatant.controlMode !== "ai" ||
      combatant.defeated ||
      combatant.incapacitated ||
      combatant.statusEffects.some((status) => status.tags.includes("control")) ||
      isManualOverrideActive(encounter, combatant.id)
    ) {
      continue;
    }
    if (combatant.timing.currentActionId || combatant.timing.queuedActionIds.length > 0) {
      continue;
    }
    if (combatant.timing.readyAtTick > encounter.currentTimeTick) {
      continue;
    }
    const actionType = chooseAiActionType(encounter, combatant);
    const targetIds = chooseAiTargetIds(encounter, combatant, actionType);
    if (targetIds.length === 0) {
      continue;
    }
    queueAction(encounter, createCombatAction(encounter, combatant, actionType, targetIds, false));
  }
}

function resolveFinishedActions(encounter: CombatEncounterState): void {
  for (const action of encounter.actions) {
    if (!["executing", "channeling"].includes(action.lifecycle)) {
      continue;
    }
    if ((action.resolvesAtTick ?? Number.MAX_SAFE_INTEGER) > encounter.currentTimeTick) {
      continue;
    }
    resolveAction(encounter, action);
  }
}

function finalizeRecoveries(encounter: CombatEncounterState): void {
  for (const combatant of encounter.combatants) {
    const currentActionId = combatant.timing.currentActionId;
    if (!currentActionId) {
      continue;
    }
    const action = encounter.actions.find((entry) => entry.id === currentActionId);
    if (!action || action.lifecycle !== "recovering") {
      continue;
    }
    if ((action.recoveryEndsAtTick ?? Number.MAX_SAFE_INTEGER) > encounter.currentTimeTick) {
      continue;
    }
    action.lifecycle = "resolved";
    combatant.timing.currentActionId = null;
    combatant.timing.readyAtTick = encounter.currentTimeTick + 1;
    combatant.timing.recoveryEndsAtTick = null;
    combatant.timing.channelEndsAtTick = null;
    combatant.timing.interruptWindowEndsAtTick = null;
    combatant.timing.lastCompletedActionId = action.id;
  }
}

function expireStatusEffects(encounter: CombatEncounterState): void {
  for (const combatant of encounter.combatants) {
    combatant.statusEffects = combatant.statusEffects.filter(
      (status) => status.expiresAtTick === undefined || status.expiresAtTick === null || status.expiresAtTick > encounter.currentTimeTick
    );
  }
}

function evaluateEncounterOutcome(encounter: CombatEncounterState) {
  const livingAllies = encounter.alliedCombatantIds.some((id) => {
    const combatant = findCombatant(encounter, id);
    return combatant !== null && !combatant.defeated;
  });
  const livingEnemies = encounter.enemyCombatantIds.some((id) => {
    const combatant = findCombatant(encounter, id);
    return combatant !== null && !combatant.defeated;
  });

  if (!livingAllies) {
    encounter.outcome = {
      result: "enemies_victorious",
      endedAtTick: encounter.currentTimeTick,
      reason: "All allied combatants were incapacitated."
    };
    encounter.state = "resolved";
  } else if (!livingEnemies) {
    encounter.outcome = {
      result: "allies_victorious",
      endedAtTick: encounter.currentTimeTick,
      reason: "All enemy combatants were defeated."
    };
    encounter.state = "resolved";
  }
}

export function queueManualCombatCommand(
  encounter: CombatEncounterState,
  request: CombatCommandRequestState
): CombatEncounterState {
  const actor = findCombatant(encounter, request.actorCombatantId);
  if (!actor) {
    return encounter;
  }

  if (request.queueMode === "replace") {
    for (const queuedId of actor.timing.queuedActionIds) {
      const queuedAction = encounter.actions.find((entry) => entry.id === queuedId);
      if (queuedAction && queuedAction.lifecycle === "queued") {
        queuedAction.lifecycle = "cancelled";
      }
    }
    actor.timing.queuedActionIds = [];
  }

  actor.controlMode = "manual";
  const action = createCombatAction(encounter, actor, request.actionType, request.targetIds, true);
  action.source.sourceType = request.sourceType;
  action.source.sourceId = request.sourceId;
  queueAction(encounter, action);
  encounter.manualOverrides = [
    ...encounter.manualOverrides.filter((entry) => entry.actorCombatantId !== actor.id),
    {
      actorCombatantId: actor.id,
      forcedTargetIds: request.targetIds,
      forcedControlMode: "manual",
      suspendAiUntilTick: encounter.currentTimeTick + 2
    }
  ];
  return encounter;
}

function syncEncounterToPlayerState(encounter: CombatEncounterState, playerState: PlayerState): void {
  const playerCombatant = encounter.combatants.find((combatant) => combatant.kind === "player");
  if (!playerCombatant) {
    return;
  }

  playerState.resources.hp.current = playerCombatant.resources.hp.current;
  playerState.resources.mp.current = playerCombatant.resources.mp.current;
  playerState.resources.stamina.current = playerCombatant.resources.stamina.current;
  playerState.activeEffects = playerCombatant.statusEffects.map((status) => status.label);
}

function syncSessionCombatUi(
  encounter: CombatEncounterState,
  sessionState: SessionState | undefined,
  tick: number
): void {
  if (!sessionState) {
    return;
  }

  if (sessionState.combatUi.selectedEnemyTargetId) {
    encounter.targeting.currentPlayerTargetId = sessionState.combatUi.selectedEnemyTargetId;
  }

  const stagedCommand = sessionState.combatUi.stagedCommand;
  if (!stagedCommand) {
    return;
  }

  queueManualCombatCommand(encounter, stagedCommand);
  sessionState.combatUi.lastIssuedCommand = {
    actorCombatantId: stagedCommand.actorCombatantId,
    issuedAtTick: tick,
    actionType: stagedCommand.actionType,
    targetIds: stagedCommand.targetIds,
    overrideApplied: true
  };
  sessionState.combatUi.stagedCommand = null;
}

function clearEncounterBindings(gameState: GameState): void {
  gameState.party.leaderCombatantId = null;
  gameState.party.members = gameState.party.members.map((member) => ({
    ...member,
    combatantId: null
  }));
}

export function tickCombatFoundation(
  gameState: GameState,
  playerState: PlayerState,
  spawnCandidates: ResolvedSpawnCandidateState[],
  tick: number,
  sessionState?: SessionState
): CombatTickResult {
  const deltas: GameDelta[] = [];
  const emittedEvents: GameEventEnvelope[] = [];

  if (!gameState.activeEncounter) {
    const candidate = spawnCandidates[0] ?? null;
    if (candidate) {
      const encounter = createEncounterFromSpawnCandidate(gameState, playerState, candidate, tick);
      if (encounter) {
        gameState.activeEncounter = encounter;
        syncEncounterToPlayerState(encounter, playerState);
        deltas.push({
          kind: "combat",
          payload: {
            encounterId: encounter.encounterId,
            state: encounter.state,
            regionId: encounter.area.regionId,
            enemyCount: encounter.enemyCombatantIds.length,
            alliedCount: encounter.alliedCombatantIds.length
          }
        });
        emittedEvents.push({
          id: `combat.encounter.started:${encounter.encounterId}`,
          type: "combat.encounter.started",
          domain: "game",
          atTick: tick,
          payload: {
            encounterId: encounter.encounterId,
            encounterTemplateId: encounter.encounterTemplateId,
            spawnProfileId: encounter.spawnProfileId,
            regionId: encounter.area.regionId
          }
        });
      }
    }
    return {
      deltas,
      emittedEvents,
      warnings: []
    };
  }

  const encounter = gameState.activeEncounter;
  encounter.currentTimeTick = tick;
  syncSessionCombatUi(encounter, sessionState, tick);
  encounter.manualOverrides = encounter.manualOverrides.filter(
    (entry) => (entry.suspendAiUntilTick ?? Number.MAX_SAFE_INTEGER) >= tick
  );

  if (encounter.pauseAllowed && encounter.paused) {
    deltas.push({
      kind: "combat",
      payload: {
        encounterId: encounter.encounterId,
        state: "paused"
      }
    });
    syncEncounterToPlayerState(encounter, playerState);
    return { deltas, emittedEvents, warnings: [] };
  }

  queueAiActions(encounter);
  startReadyActions(encounter);
  resolveFinishedActions(encounter);
  finalizeRecoveries(encounter);
  expireStatusEffects(encounter);
  evaluateEncounterOutcome(encounter);
  syncEncounterToPlayerState(encounter, playerState);

  deltas.push({
    kind: "combat",
    payload: {
      encounterId: encounter.encounterId,
      state: encounter.state,
      queuedActions: encounter.actions.filter((entry) => entry.lifecycle === "queued").length,
      executingActions: encounter.actions.filter((entry) =>
        ["executing", "channeling", "recovering"].includes(entry.lifecycle)
      ).length,
      defeatedEnemies: encounter.enemyCombatantIds.filter((combatantId) => {
        const combatant = findCombatant(encounter, combatantId);
        return combatant?.defeated;
      }).length
    }
  });

  if (encounter.state === "resolved" && encounter.outcome) {
    gameState.combatHistory = [
      ...gameState.combatHistory,
      {
        encounterId: encounter.encounterId,
        encounterTemplateId: encounter.encounterTemplateId ?? null,
        regionId: encounter.area.regionId,
        result: encounter.outcome.result,
        endedAtTick: encounter.outcome.endedAtTick
      }
    ].slice(-24);
    emittedEvents.push({
      id: `combat.encounter.ended:${encounter.encounterId}`,
      type: "combat.encounter.ended",
      domain: "game",
      atTick: tick,
      payload: {
        encounterId: encounter.encounterId,
        result: encounter.outcome.result,
        endedAtTick: encounter.outcome.endedAtTick,
        reason: encounter.outcome.reason
      }
    });
    clearEncounterBindings(gameState);
    gameState.activeEncounter = null;
  }

  return {
    deltas,
    emittedEvents,
    warnings: []
  };
}
