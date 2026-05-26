import type { AccountProfileState } from "../../../../packages/shared/types/src/index.js";
import type { CharacterCreationFormState } from "./characterCreationForm.js";
import {
  createDefaultStartingBundleChoiceSelections,
  generateRandomCharacterName,
  getBackstoryOptionsForSelection,
  getLineageIdentityCatalog,
  getStartingBundleTemplate,
  lineageOptions,
  startingBundleOptions,
  type StarterBackstoryPresentation
} from "./characterCreationCatalog.js";
import {
  getDefaultWorldSelection,
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions
} from "./worldSelectionCatalog.js";

export interface GenerateRandomCharacterCreationFormStateInput {
  currentForm: CharacterCreationFormState;
  accountProfile?: AccountProfileState | null;
  rng?: () => number;
  backstoryOptions?: readonly Pick<StarterBackstoryPresentation, "id" | "selectable">[];
}

function pickRandomValue<T>(values: readonly T[], rng: () => number): T | null {
  if (values.length === 0) {
    return null;
  }

  const index = Math.min(values.length - 1, Math.floor(rng() * values.length));
  return values[index] ?? null;
}

function randomizeBundleChoices(
  startingBundleId: string,
  rng: () => number
): Record<string, string> {
  const bundle = getStartingBundleTemplate(startingBundleId);
  const defaults = createDefaultStartingBundleChoiceSelections(startingBundleId);

  return Object.fromEntries(
    bundle.choiceGroups.map((group) => {
      const selected = pickRandomValue(group.options, rng);
      return [group.id, selected?.itemId ?? defaults[group.id] ?? ""];
    })
  );
}

export function generateRandomCharacterCreationFormState({
  currentForm,
  accountProfile = null,
  rng = Math.random,
  backstoryOptions
}: GenerateRandomCharacterCreationFormStateInput): CharacterCreationFormState {
  const lineage = pickRandomValue(lineageOptions, rng) ?? lineageOptions[0];
  const lineageId = (lineage?.id ?? currentForm.lineageId) || "lineage.human";
  const identityCatalog =
    getLineageIdentityCatalog(lineageId) ?? getLineageIdentityCatalog("lineage.human");
  const nextSex = pickRandomValue(["male", "female"] as const, rng) ?? "male";
  const selectableBackstories =
    (backstoryOptions ??
      getBackstoryOptionsForSelection(lineageId, null, {
        ...(accountProfile ? { accountProfile } : {}),
        ...(accountProfile?.accountId ? { accountId: accountProfile.accountId } : {})
      })
    ).filter((option) => option.selectable);
  const selectedBackstory = pickRandomValue(selectableBackstories, rng);
  const backstoryId = selectedBackstory?.id ?? "";

  const continents = getWorldContinentOptions();
  const selectedContinent = pickRandomValue(continents, rng);
  const regions = selectedContinent ? getWorldRegionOptions(selectedContinent.id) : [];
  const selectedRegion = pickRandomValue(regions, rng);
  const settlements =
    selectedContinent && selectedRegion
      ? getWorldSettlementOptions({
          continentId: selectedContinent.id,
          regionId: selectedRegion.id,
          backstoryId
        }).filter((settlement) => settlement.access.accessStatus === "allowed")
      : [];
  const selectedSettlement = pickRandomValue(settlements, rng);
  const fallbackWorld = selectedSettlement ? null : getDefaultWorldSelection(backstoryId);
  const startingBundle =
    pickRandomValue(startingBundleOptions, rng) ?? startingBundleOptions[0];
  const startingBundleId = startingBundle?.id ?? currentForm.startingBundleId;

  return {
    ...currentForm,
    playerName: generateRandomCharacterName(lineageId, nextSex, rng),
    sexId: nextSex,
    lineageId,
    ageBandId: pickRandomValue(identityCatalog?.ageBands ?? [], rng)?.id ?? "prime",
    heightBandId: pickRandomValue(identityCatalog?.heightBands ?? [], rng)?.id ?? "normal",
    physiqueId:
      pickRandomValue(identityCatalog?.physiqueOptions ?? [], rng)?.id ?? "stocky",
    natureId:
      pickRandomValue(identityCatalog?.natureOptions ?? [], rng)?.id ?? "disciplined",
    focusId: pickRandomValue(identityCatalog?.focusOptions ?? [], rng)?.id ?? "balanced",
    hairColorId:
      pickRandomValue(identityCatalog?.hairColorOptions ?? [], rng)?.id ?? "",
    eyeColorId:
      pickRandomValue(identityCatalog?.eyeColorOptions ?? [], rng)?.id ?? "",
    skinToneId:
      pickRandomValue(identityCatalog?.skinToneOptions ?? [], rng)?.id ?? "",
    continentId: selectedContinent?.id ?? fallbackWorld?.continentId ?? "",
    regionId: selectedRegion?.id ?? fallbackWorld?.regionId ?? "",
    startingSettlementId: selectedSettlement?.id ?? fallbackWorld?.settlementId ?? "",
    backstoryId,
    startingBundleId,
    startingBundleChoiceSelections: startingBundleId
      ? randomizeBundleChoices(startingBundleId, rng)
      : {},
    sourceRunId: ""
  };
}
