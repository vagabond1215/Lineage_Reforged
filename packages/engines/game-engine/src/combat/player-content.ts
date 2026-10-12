import itemsJson from "../../../../content/base/items/items.json" with { type: "json" };
import skillsJson from "../../../../content/base/player/skills.json" with { type: "json" };
import abilitiesJson from "../../../../content/base/player/abilities.json" with { type: "json" };
import spellsJson from "../../../../content/base/player/spells.json" with { type: "json" };
import skillEffectsJson from "../../../../content/base/player/skill_effects.json" with { type: "json" };
import titlesJson from "../../../../content/base/player/titles.json" with { type: "json" };
import type {
  ItemContentRecord,
  SkillContentRecord,
  PlayerAbilityContentRecord,
  PlayerSpellContentRecord,
  SkillEffectContentRecord,
  TitleContentRecord
} from "../../../civilization-engine/src/content.js";

// Static imports keep the selected browser caller on the same authored content as Node.
export const loadItemContent = (): ItemContentRecord[] => itemsJson.records as ItemContentRecord[];
export const loadSkillContent = (): SkillContentRecord[] => skillsJson.records as SkillContentRecord[];
export const loadPlayerAbilityContent = (): PlayerAbilityContentRecord[] => abilitiesJson.records as PlayerAbilityContentRecord[];
export const loadPlayerSpellContent = (): PlayerSpellContentRecord[] => spellsJson.records as PlayerSpellContentRecord[];
export const loadSkillEffectContent = (): SkillEffectContentRecord[] => skillEffectsJson.records as SkillEffectContentRecord[];
export const loadTitleContent = (): TitleContentRecord[] => titlesJson.records as TitleContentRecord[];
