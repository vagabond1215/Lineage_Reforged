import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  AccountProfileState,
  AccountRunHistoryRecord
} from '../../../../../packages/shared/types/src/index.js';
import { Card } from '../../components/ui/Card';
import {
  CHARACTER_CREATION_STEPS,
  type CharacterCreationFormState,
  type CharacterCreationStepId,
  validateCharacterCreationForm,
  validateCharacterCreationStep
} from '../characterCreationForm.js';
import {
  createDefaultStartingBundleChoiceSelections,
  generateRandomCharacterName,
  getAgeBandRangeLabel,
  getBackstoryOptionsForSelection,
  getLineageIdentityCatalog,
  getRepresentativeHeightCm,
  getStartingBundleTemplate,
  lineageOptions,
  startingBundleOptions
} from '../characterCreationCatalog.js';
import {
  CHARACTER_APPEARANCE_DESCRIPTORS,
  DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS,
  getCharacterAppearanceDescriptor,
  type CharacterAppearanceCategory,
  type CharacterAppearanceDescriptorDefinition,
  validateCharacterAppearanceSelection
} from '../characterCreationAppearance.js';
import { generateRandomCharacterCreationFormState } from '../characterCreationRandomization.js';
import {
  CHARACTER_PROFILE_TRAITS,
  getCharacterProfileTrait,
  type CharacterProfileTraitCategory,
  type CharacterProfileTraitDefinition,
  validateCharacterProfileTraitSelection
} from '../characterCreationProfileTraits.js';
import {
  formatCharacterCreationSexAdjustment
} from '../characterCreationSexProfiles.js';
import {
  buildCharacterPortraitPromptSpec,
  createCharacterPortraitIdentityFingerprint,
  CREATOR_TEST_PORTRAIT_RENDER_PROFILE
} from '../characterPortraitSpec.js';
import {
  beginCharacterPortraitGeneration,
  completeCharacterPortraitGeneration,
  createDeterministicLocalCharacterPortraitProvider,
  EMPTY_CHARACTER_PORTRAIT_UI_STATE,
  markCharacterPortraitIdentityChanged,
  type CharacterPortraitUiState
} from '../characterPortraitProvider.js';
import {
  buildCharacterCreationPreview
} from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import {
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions
} from '../worldSelectionCatalog.js';
import { AppShell, SidebarNav } from './AppShell.js';
import { NoticeBanner } from './NoticeBanner.js';
import { ShellBrandLogo } from './ShellBrandLogo.js';

type Props = {
  form: CharacterCreationFormState;
  accountProfile?: AccountProfileState | null;
  appliedLegacyPreparationIds?: string[];
  appliedLegacyPreparationChoices?: Record<string, string>;
  eligibleHeirSources?: AccountRunHistoryRecord[];
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  pendingOverwriteSlotId: ManualSaveSlotId | null;
  onDismissNotice: () => void;
  onReturnToMainMenu: () => void;
  onChange: (form: Partial<CharacterCreationFormState>) => void;
  onCreateGame: (options?: { hasSelectableBackstories: boolean }) => void;
  onConfirmOverwrite: (options?: { hasSelectableBackstories: boolean }) => void;
  onCancelOverwrite: () => void;
  themeMode: 'dark' | 'light';
  onToggleThemeMode: () => void;
};

const sectionClass =
  'rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-4 sm:p-5';
const chipClass =
  'rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus-ring)]';
const selectedChipClass =
  'border-[color:var(--color-border-active)] bg-[color:var(--color-surface-selected)] text-[color:var(--color-text-strong)]';
const idleChipClass =
  'border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-soft)] hover:bg-[color:var(--color-creator-card-hover)]';
const primaryButtonClass =
  'rounded-xl border border-[color:var(--color-border-active)] bg-[color:var(--color-surface-selected)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-text-strong)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45';
const secondaryButtonClass =
  'rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-creator-card-hover)] disabled:cursor-not-allowed disabled:opacity-45';

const PROFILE_CATEGORY_LABELS: Record<CharacterProfileTraitCategory, string> = {
  'body.frame': 'Body Frame',
  'physical.aptitude': 'Physical Aptitude',
  'physical.condition': 'Physical Condition',
  temperament: 'Temperament',
  cognition: 'Cognition',
  presence: 'Presence'
};

const APPEARANCE_CATEGORY_LABELS: Partial<Record<CharacterAppearanceCategory, string>> = {
  'face.shape': 'Face Shape',
  'face.jaw': 'Jaw',
  'face.cheekbones': 'Cheekbones',
  'face.nose': 'Nose',
  'face.eye_shape': 'Eye Shape',
  'face.brows': 'Brows',
  'complexion.detail': 'Complexion',
  'hair.length': 'Hair Length',
  'hair.texture': 'Hair Texture',
  'hair.density': 'Hair Density',
  'hair.primary_style': 'Hairstyle',
  'facial_hair.primary_style': 'Facial Hair',
  'marking.facial_scar': 'Facial Scars',
  'marking.birthmark': 'Birthmarks',
  'marking.tattoo': 'Tattoos',
  'adornment.piercing': 'Piercings',
  'adornment.identity': 'Adornments'
};

const APPEARANCE_CATEGORY_ORDER = Object.keys(
  APPEARANCE_CATEGORY_LABELS
) as CharacterAppearanceCategory[];

function groupProfileTraits(category: CharacterProfileTraitCategory): CharacterProfileTraitDefinition[] {
  return CHARACTER_PROFILE_TRAITS.filter((entry) => entry.category === category);
}

function groupAppearance(category: CharacterAppearanceCategory): CharacterAppearanceDescriptorDefinition[] {
  return CHARACTER_APPEARANCE_DESCRIPTORS.filter((entry) => entry.category === category);
}

function firstError(errors: Record<string, string | undefined>): string | null {
  return Object.values(errors).find(Boolean) ?? null;
}

export function CharacterCreationScreen({
  form,
  accountProfile = null,
  appliedLegacyPreparationIds = [],
  appliedLegacyPreparationChoices = {},
  slots,
  notice,
  pendingOverwriteSlotId,
  onDismissNotice,
  onReturnToMainMenu,
  onChange,
  onCreateGame,
  onConfirmOverwrite,
  onCancelOverwrite,
  themeMode,
  onToggleThemeMode
}: Props) {
  const [currentStepId, setCurrentStepId] = useState<CharacterCreationStepId>('lineage');
  const [showAdvancedAppearance, setShowAdvancedAppearance] = useState(false);
  const [portraitState, setPortraitState] = useState<CharacterPortraitUiState>(
    EMPTY_CHARACTER_PORTRAIT_UI_STATE
  );
  const identityCatalog = useMemo(
    () => getLineageIdentityCatalog(form.lineageId),
    [form.lineageId]
  );
  const provider = useMemo(() => createDeterministicLocalCharacterPortraitProvider(), []);
  const backstoryOptions = useMemo(
    () =>
      getBackstoryOptionsForSelection(form.lineageId, null, {
        ...(accountProfile ? { accountProfile } : {}),
        ...(accountProfile?.accountId ? { accountId: accountProfile.accountId } : {})
      }).filter((entry) => entry.selectable),
    [accountProfile, form.lineageId]
  );
  const hasSelectableBackstories = backstoryOptions.length > 0;
  const continents = useMemo(() => getWorldContinentOptions(), []);
  const regions = useMemo(
    () => getWorldRegionOptions(form.continentId),
    [form.continentId]
  );
  const settlements = useMemo(
    () =>
      getWorldSettlementOptions({
        continentId: form.continentId,
        regionId: form.regionId,
        backstoryId: form.backstoryId
      }),
    [form.backstoryId, form.continentId, form.regionId]
  );
  const preview = useMemo(
    () =>
      buildCharacterCreationPreview(form, {
        accountProfile,
        appliedLegacyPreparationIds,
        appliedLegacyPreparationChoices,
        hasSelectableBackstories
      }),
    [
      accountProfile,
      appliedLegacyPreparationChoices,
      appliedLegacyPreparationIds,
      form,
      hasSelectableBackstories
    ]
  );

  const portraitPromptSpec = useMemo(() => {
    if (!identityCatalog || (form.sexId !== 'male' && form.sexId !== 'female')) return null;
    const ageBandId = form.ageBandId || 'prime';
    const skin = identityCatalog.skinToneOptions.find((entry) => entry.id === form.skinToneId);
    const hair = identityCatalog.hairColorOptions.find((entry) => entry.id === form.hairColorId);
    const eyes = identityCatalog.eyeColorOptions.find((entry) => entry.id === form.eyeColorId);
    if (!skin || !hair || !eyes) return null;
    if (!validateCharacterProfileTraitSelection(form.profileTraitIds, form.lineageId).isValid) return null;
    if (
      !validateCharacterAppearanceSelection(form.appearanceDescriptorIds, {
        sexId: form.sexId,
        lineageId: form.lineageId
      }).isValid
    ) return null;

    return buildCharacterPortraitPromptSpec({
      lineageId: form.lineageId,
      sexId: form.sexId,
      ageBandId,
      heightCm: getRepresentativeHeightCm(form.lineageId, form.heightBandId),
      profileTraitIds: form.profileTraitIds,
      appearanceDescriptorIds: form.appearanceDescriptorIds,
      skinToneId: skin.id,
      skinToneLabel: skin.label,
      hairColorId: hair.id,
      hairColorLabel: hair.label,
      eyeColorId: eyes.id,
      eyeColorLabel: eyes.label,
      renderProfileId: CREATOR_TEST_PORTRAIT_RENDER_PROFILE.id
    });
  }, [form, identityCatalog]);
  const portraitFingerprint = portraitPromptSpec
    ? createCharacterPortraitIdentityFingerprint(portraitPromptSpec)
    : null;
  const portraitFingerprintRef = useRef<string | null>(portraitFingerprint);

  useEffect(() => {
    portraitFingerprintRef.current = portraitFingerprint;
    if (portraitFingerprint) {
      setPortraitState((current) =>
        markCharacterPortraitIdentityChanged(current, portraitFingerprint)
      );
    }
  }, [portraitFingerprint]);

  const fullValidation = validateCharacterCreationForm(form, {
    accountProfile,
    hasSelectableBackstories
  });
  const stepValidation = validateCharacterCreationStep(form, currentStepId, {
    accountProfile,
    hasSelectableBackstories
  });
  const currentStepIndex = CHARACTER_CREATION_STEPS.findIndex(
    (entry) => entry.id === currentStepId
  );

  const setSelection = (next: Partial<CharacterCreationFormState>) => onChange(next);

  const chooseLineage = (lineageId: string) => {
    const catalog = getLineageIdentityCatalog(lineageId);
    setSelection({
      lineageId,
      hairColorId: catalog?.hairColorOptions[0]?.id ?? '',
      eyeColorId: catalog?.eyeColorOptions[0]?.id ?? '',
      skinToneId: catalog?.skinToneOptions[0]?.id ?? '',
      appearanceDescriptorIds: [...DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS]
    });
  };

  const chooseSex = (sexId: 'male' | 'female') => {
    const filtered = form.appearanceDescriptorIds.filter((id) => {
      const descriptor = getCharacterAppearanceDescriptor(id);
      return !descriptor?.allowedSexIds || descriptor.allowedSexIds.includes(sexId);
    });
    setSelection({ sexId, appearanceDescriptorIds: filtered });
  };

  const toggleProfileTrait = (entry: CharacterProfileTraitDefinition) => {
    const selected = form.profileTraitIds.includes(entry.id);
    if (selected) {
      if (entry.category === 'body.frame') return;
      setSelection({
        profileTraitIds: form.profileTraitIds.filter((id) => id !== entry.id)
      });
      return;
    }

    let next = [...form.profileTraitIds];
    if (entry.category === 'body.frame') {
      next = next.filter((id) => getCharacterProfileTrait(id)?.category !== 'body.frame');
      next.push(entry.id);
    } else {
      if (next.length >= 6) return;
      const categoryCount = next.filter(
        (id) => getCharacterProfileTrait(id)?.category === entry.category
      ).length;
      if (categoryCount >= 2) return;
      next.push(entry.id);
    }
    setSelection({ profileTraitIds: next });
  };

  const toggleAppearance = (entry: CharacterAppearanceDescriptorDefinition) => {
    const selected = form.appearanceDescriptorIds.includes(entry.id);
    if (selected) {
      if (entry.category === 'hair.length') return;
      setSelection({
        appearanceDescriptorIds: form.appearanceDescriptorIds.filter((id) => id !== entry.id)
      });
      return;
    }

    let next = [...form.appearanceDescriptorIds];
    if (entry.exclusiveGroupId) {
      next = next.filter(
        (id) => getCharacterAppearanceDescriptor(id)?.exclusiveGroupId !== entry.exclusiveGroupId
      );
    }
    next.push(entry.id);
    const contextSex = form.sexId === 'female' ? 'female' : 'male';
    const validation = validateCharacterAppearanceSelection(next, {
      sexId: contextSex,
      lineageId: form.lineageId
    });
    if (!validation.isValid) return;
    setSelection({ appearanceDescriptorIds: next });
  };

  const randomizeIdentity = () => {
    const randomized = generateRandomCharacterCreationFormState({
      currentForm: form,
      accountProfile
    });
    setSelection({
      playerName: randomized.playerName,
      sexId: randomized.sexId,
      ageBandId: randomized.ageBandId,
      heightBandId: randomized.heightBandId,
      profileTraitIds: randomized.profileTraitIds,
      appearanceDescriptorIds: randomized.appearanceDescriptorIds,
      hairColorId: randomized.hairColorId,
      eyeColorId: randomized.eyeColorId,
      skinToneId: randomized.skinToneId
    });
  };

  const generatePortrait = async () => {
    if (!portraitPromptSpec || !portraitFingerprint) return;
    const start = beginCharacterPortraitGeneration(portraitState, portraitPromptSpec);
    setPortraitState(start.state);
    const result = await provider.generateCharacterPortrait({
      promptSpec: portraitPromptSpec,
      renderProfile: CREATOR_TEST_PORTRAIT_RENDER_PROFILE
    });
    setPortraitState((current) =>
      completeCharacterPortraitGeneration({
        state: current,
        requestId: start.requestId,
        requestFingerprint: start.requestFingerprint,
        currentIdentityFingerprint: portraitFingerprintRef.current ?? start.requestFingerprint,
        result
      })
    );
  };

  const goPrevious = () => {
    const previous = CHARACTER_CREATION_STEPS[currentStepIndex - 1];
    if (previous) setCurrentStepId(previous.id);
  };

  const goNext = () => {
    if (!stepValidation.isValid) return;
    let nextIndex = currentStepIndex + 1;
    if (
      CHARACTER_CREATION_STEPS[nextIndex]?.id === 'backstory' &&
      !hasSelectableBackstories
    ) {
      nextIndex += 1;
    }
    const next = CHARACTER_CREATION_STEPS[nextIndex];
    if (next) setCurrentStepId(next.id);
  };

  const renderPalette = (
    label: string,
    key: 'hairColorId' | 'eyeColorId' | 'skinToneId',
    options: NonNullable<typeof identityCatalog>['hairColorOptions']
  ) => (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((entry) => {
          const selected = form[key] === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelection({ [key]: entry.id } as Partial<CharacterCreationFormState>)}
              className={`${chipClass} ${selected ? selectedChipClass : idleChipClass}`}
              title={entry.description}
            >
              <span
                className="mr-2 inline-block h-3 w-3 rounded-full border border-black/20 align-middle"
                style={{ background: entry.swatch?.background ?? 'currentColor' }}
                aria-hidden="true"
              />
              {entry.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  let mainContent: React.ReactNode;

  if (currentStepId === 'lineage') {
    mainContent = (
      <div className="grid gap-3 lg:grid-cols-2">
        {lineageOptions.map((entry) => {
          const selected = form.lineageId === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={selected}
              onClick={() => chooseLineage(entry.id)}
              className={`${sectionClass} text-left transition ${selected ? 'ring-2 ring-[color:var(--color-border-active)]' : 'hover:bg-[color:var(--color-creator-card-hover)]'}`}
            >
              <div className="text-lg font-semibold text-[color:var(--color-text-strong)]">{entry.label}</div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div>
            </button>
          );
        })}
      </div>
    );
  } else if (currentStepId === 'identity' && identityCatalog) {
    const profileValidation = validateCharacterProfileTraitSelection(form.profileTraitIds, form.lineageId);
    const primaryAppearanceCategories = new Set<CharacterAppearanceCategory>([
      'face.shape', 'complexion.detail', 'hair.length', 'hair.texture', 'hair.primary_style',
      'facial_hair.primary_style', 'marking.facial_scar'
    ]);
    const visibleAppearanceCategories = APPEARANCE_CATEGORY_ORDER.filter(
      (category) => showAdvancedAppearance || primaryAppearanceCategories.has(category)
    );

    mainContent = (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <section className={sectionClass}>
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-[14rem] flex-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Name</span>
                <input
                  value={form.playerName}
                  onChange={(event) => setSelection({ playerName: event.target.value })}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2.5 text-[color:var(--color-text-strong)]"
                />
              </label>
              <button type="button" onClick={() => setSelection({ playerName: generateRandomCharacterName(form.lineageId, form.sexId) })} className={secondaryButtonClass}>Random Name</button>
              <button type="button" onClick={randomizeIdentity} className={secondaryButtonClass}>Randomize Identity</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Sex</div>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((sexId) => (
                    <button
                      key={sexId}
                      type="button"
                      aria-pressed={form.sexId === sexId}
                      onClick={() => chooseSex(sexId)}
                      className={`${chipClass} flex-1 ${form.sexId === sexId ? selectedChipClass : idleChipClass}`}
                    >
                      <span className="font-semibold">{sexId === 'male' ? 'Male' : 'Female'}</span>
                      <span className="mt-1 block text-xs opacity-80">{formatCharacterCreationSexAdjustment(form.lineageId, sexId)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Height</div>
                <div className="flex gap-2">
                  {identityCatalog.heightBands.map((entry) => (
                    <button key={entry.id} type="button" aria-pressed={form.heightBandId === entry.id} onClick={() => setSelection({ heightBandId: entry.id })} className={`${chipClass} flex-1 ${form.heightBandId === entry.id ? selectedChipClass : idleChipClass}`}>{entry.label}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Age</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {identityCatalog.ageBands.map((entry) => (
                  <button key={entry.id} type="button" aria-pressed={form.ageBandId === entry.id} onClick={() => setSelection({ ageBandId: entry.id })} className={`${chipClass} ${form.ageBandId === entry.id ? selectedChipClass : idleChipClass}`}>
                    <span className="font-semibold">{entry.label}</span>
                    <span className="mt-1 block text-xs opacity-80">{getAgeBandRangeLabel(form.lineageId, form.sexId, entry.id)}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Profile Traits</h2>
                <p className="mt-1 text-sm text-[color:var(--color-text-soft)]">Choose exactly six. One Body Frame is required; the remaining choices balance physical and mental/social tendencies.</p>
              </div>
              <div className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-soft)]" aria-live="polite">{form.profileTraitIds.length}/6</div>
            </div>
            {!profileValidation.isValid && (
              <div className="mt-3 text-sm text-[color:var(--color-tone-warning-text)]" role="status">{profileValidation.errors[0]}</div>
            )}
            {profileValidation.warnings.length > 0 && (
              <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">{profileValidation.warnings.join(' ')}</div>
            )}
            <div className="mt-4 space-y-4">
              {(Object.keys(PROFILE_CATEGORY_LABELS) as CharacterProfileTraitCategory[]).map((category) => (
                <div key={category}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">{PROFILE_CATEGORY_LABELS[category]}</div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {groupProfileTraits(category).map((entry) => {
                      const selected = form.profileTraitIds.includes(entry.id);
                      return (
                        <button key={entry.id} type="button" aria-pressed={selected} onClick={() => toggleProfileTrait(entry)} className={`${chipClass} ${selected ? selectedChipClass : idleChipClass}`}>
                          <span className="font-semibold">{entry.label}</span>
                          <span className="mt-1 block text-xs leading-5 opacity-80">{entry.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Coloration</h2>
            <div className="mt-4 space-y-4">
              {renderPalette('Skin Color', 'skinToneId', identityCatalog.skinToneOptions)}
              {renderPalette('Hair Color', 'hairColorId', identityCatalog.hairColorOptions)}
              {renderPalette('Eye Color', 'eyeColorId', identityCatalog.eyeColorOptions)}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Appearance</h2>
                <p className="mt-1 text-sm text-[color:var(--color-text-soft)]">These choices affect the portrait only. They never alter attributes.</p>
              </div>
              <button type="button" onClick={() => setShowAdvancedAppearance((value) => !value)} className={secondaryButtonClass}>{showAdvancedAppearance ? 'Hide Additional Features' : 'Additional Features'}</button>
            </div>
            <div className="mt-4 space-y-4">
              {visibleAppearanceCategories.map((category) => {
                const entries = groupAppearance(category).filter((entry) => !entry.allowedSexIds || (form.sexId && entry.allowedSexIds.includes(form.sexId)));
                if (entries.length === 0) return null;
                return (
                  <div key={category}>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">{APPEARANCE_CATEGORY_LABELS[category]}</div>
                    <div className="flex flex-wrap gap-2">
                      {entries.map((entry) => {
                        const selected = form.appearanceDescriptorIds.includes(entry.id);
                        return <button key={entry.id} type="button" aria-pressed={selected} onClick={() => toggleAppearance(entry)} className={`${chipClass} ${selected ? selectedChipClass : idleChipClass}`}>{entry.label}</button>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className={sectionClass}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Character Portrait</h2>
              {(portraitState.status === 'stale' || portraitState.status === 'failed_regeneration') && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-tone-warning-text)]">Outdated</span>}
            </div>
            <div className="mt-3 aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
              {portraitState.assetRef ? (
                <img src={portraitState.assetRef} alt="Generated character portrait preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[color:var(--color-text-soft)]">Hips-up portrait preview. Hands are excluded by the test render profile.</div>
              )}
            </div>
            {portraitState.errorMessage && <div className="mt-3 text-sm text-[color:var(--color-tone-danger-text)]" role="status">{portraitState.errorMessage}</div>}
            <button
              type="button"
              onClick={generatePortrait}
              disabled={!portraitPromptSpec || portraitState.status === 'generating' || portraitState.status === 'regenerating'}
              aria-busy={portraitState.status === 'generating' || portraitState.status === 'regenerating'}
              className={`${primaryButtonClass} mt-3 w-full`}
            >
              {portraitState.status === 'generating' || portraitState.status === 'regenerating'
                ? 'Generating...'
                : portraitState.assetRef
                  ? 'Regenerate Portrait'
                  : portraitState.status === 'failed_first'
                    ? 'Retry Portrait'
                    : 'Generate Portrait'}
            </button>
            <p className="mt-2 text-xs leading-5 text-[color:var(--color-muted-strong)]">Prototype uses a local deterministic proof provider. Character creation remains valid without a portrait.</p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Live Attributes</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {preview.attributeMetrics.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-2 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-strong)]">{entry.label}</div>
                  <div className="mt-1 text-lg font-semibold text-[color:var(--color-text-strong)]">{entry.value ?? '-'}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    );
  } else if (currentStepId === 'continent') {
    mainContent = (
      <div className="grid gap-3 lg:grid-cols-2">
        {continents.map((entry) => <button key={entry.id} type="button" aria-pressed={form.continentId === entry.id} onClick={() => setSelection({ continentId: entry.id, regionId: '', startingSettlementId: '' })} className={`${sectionClass} text-left ${form.continentId === entry.id ? 'ring-2 ring-[color:var(--color-border-active)]' : ''}`}><div className="font-semibold text-[color:var(--color-text-strong)]">{entry.label}</div><div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div></button>)}
      </div>
    );
  } else if (currentStepId === 'region') {
    mainContent = (
      <div className="grid gap-3 lg:grid-cols-2">
        {regions.map((entry) => <button key={entry.id} type="button" aria-pressed={form.regionId === entry.id} onClick={() => setSelection({ regionId: entry.id, startingSettlementId: '' })} className={`${sectionClass} text-left ${form.regionId === entry.id ? 'ring-2 ring-[color:var(--color-border-active)]' : ''}`}><div className="font-semibold text-[color:var(--color-text-strong)]">{entry.label}</div><div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div></button>)}
      </div>
    );
  } else if (currentStepId === 'settlement') {
    mainContent = (
      <div className="grid gap-3 lg:grid-cols-2">
        {settlements.map((entry) => <button key={entry.id} type="button" disabled={entry.access.accessStatus !== 'allowed'} aria-pressed={form.startingSettlementId === entry.id} onClick={() => setSelection({ startingSettlementId: entry.id })} className={`${sectionClass} text-left disabled:opacity-45 ${form.startingSettlementId === entry.id ? 'ring-2 ring-[color:var(--color-border-active)]' : ''}`}><div className="flex justify-between gap-3"><span className="font-semibold text-[color:var(--color-text-strong)]">{entry.label}</span><span className="text-xs uppercase tracking-[0.12em] text-[color:var(--color-muted-strong)]">{entry.access.accessStatus}</span></div><div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div></button>)}
      </div>
    );
  } else if (currentStepId === 'backstory') {
    mainContent = backstoryOptions.length === 0 ? (
      <Card><div className="text-sm text-[color:var(--color-text-soft)]">No selectable backstory package is currently available. This step will be skipped.</div></Card>
    ) : (
      <div className="grid gap-3 lg:grid-cols-2">
        {backstoryOptions.map((entry) => <button key={entry.id} type="button" aria-pressed={form.backstoryId === entry.id} onClick={() => setSelection({ backstoryId: entry.id })} className={`${sectionClass} text-left ${form.backstoryId === entry.id ? 'ring-2 ring-[color:var(--color-border-active)]' : ''}`}><div className="font-semibold text-[color:var(--color-text-strong)]">{entry.label}</div><div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div></button>)}
      </div>
    );
  } else if (currentStepId === 'starting_bundle') {
    mainContent = (
      <div className="space-y-3">
        {startingBundleOptions.map((entry) => {
          const selected = form.startingBundleId === entry.id;
          const bundle = selected ? getStartingBundleTemplate(entry.id) : null;
          return (
            <div key={entry.id} className={`${sectionClass} ${selected ? 'ring-2 ring-[color:var(--color-border-active)]' : ''}`}>
              <button type="button" aria-pressed={selected} onClick={() => setSelection({ startingBundleId: entry.id, startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(entry.id) })} className="w-full text-left">
                <div className="font-semibold text-[color:var(--color-text-strong)]">{entry.label}</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">{entry.description}</div>
              </button>
              {bundle && bundle.choiceGroups.map((group) => (
                <label key={group.id} className="mt-3 block text-sm text-[color:var(--color-text-soft)]">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-strong)]">{group.label}</span>
                  <select
                    value={form.startingBundleChoiceSelections[group.id] ?? ''}
                    onChange={(event) => setSelection({ startingBundleChoiceSelections: { ...form.startingBundleChoiceSelections, [group.id]: event.target.value } })}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-[color:var(--color-text-strong)]"
                  >
                    {group.options.map((option) => <option key={option.itemId} value={option.itemId}>{option.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
          );
        })}
      </div>
    );
  } else {
    mainContent = (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">Review Character</h2>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">{preview.reviewNarrative}</div>
          </section>
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Identity</h2>
            <div className="mt-3 space-y-2">
              {preview.identityMetrics.map((entry) => <div key={entry.id} className="flex justify-between gap-4 border-b border-[color:var(--color-border)] pb-2 text-sm last:border-0"><span className="text-[color:var(--color-text-soft)]">{entry.label}</span><span className="text-right font-semibold text-[color:var(--color-text-strong)]">{entry.value ?? '-'}</span></div>)}
            </div>
          </section>
          <section className={sectionClass}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Save Slot</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {slots.map((slot) => <button key={slot.id} type="button" aria-pressed={form.saveSlotId === slot.id} onClick={() => setSelection({ saveSlotId: slot.id })} className={`${chipClass} ${form.saveSlotId === slot.id ? selectedChipClass : idleChipClass}`}><span className="font-semibold">{slot.label}</span><span className="mt-1 block text-xs opacity-80">{slot.hasSave ? 'Will overwrite' : 'Empty'}</span></button>)}
            </div>
          </section>
          {!fullValidation.isValid && <div role="alert" className="text-sm text-[color:var(--color-tone-warning-text)]">{firstError(fullValidation.errors as Record<string, string | undefined>)}</div>}
          <button type="button" disabled={!fullValidation.isValid} onClick={() => onCreateGame({ hasSelectableBackstories })} className={`${primaryButtonClass} w-full`}>Begin Campaign</button>
        </div>
        <section className={`${sectionClass} xl:sticky xl:top-4 xl:self-start`}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">Final Attributes</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {preview.attributeMetrics.map((entry) => <div key={entry.id} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-2 text-center"><div className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-muted-strong)]">{entry.label}</div><div className="text-lg font-semibold text-[color:var(--color-text-strong)]">{entry.value ?? '-'}</div></div>)}
          </div>
        </section>
      </div>
    );
  }

  const stepItems = CHARACTER_CREATION_STEPS.map((step) => ({
    id: step.id,
    label: step.label,
    detail: step.id === 'backstory' && !hasSelectableBackstories ? 'Skipped' : step.description,
    active: currentStepId === step.id,
    disabled: step.id === 'backstory' && !hasSelectableBackstories,
    onSelect: () => setCurrentStepId(step.id)
  }));

  return (
    <AppShell
      brand={<ShellBrandLogo />}
      title="Forge a Character"
      subtitle="Canonical traits shape the character. Portraits only depict those choices."
      sidebar={<SidebarNav items={stepItems} label="Character creation steps" />}
      primaryActions={
        <div className="flex gap-2">
          <button type="button" onClick={onToggleThemeMode} className={secondaryButtonClass}>{themeMode === 'dark' ? 'Light' : 'Dark'}</button>
          <button type="button" onClick={onReturnToMainMenu} className={secondaryButtonClass}>Main Menu</button>
        </div>
      }
      notice={notice ? <NoticeBanner notice={notice} onDismiss={onDismissNotice} /> : undefined}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">{CHARACTER_CREATION_STEPS[currentStepIndex]?.label}</div>
            <div className="mt-1 text-sm text-[color:var(--color-text-soft)]">{CHARACTER_CREATION_STEPS[currentStepIndex]?.description}</div>
          </div>
          <div className="text-xs text-[color:var(--color-muted-strong)]">Step {currentStepIndex + 1} of {CHARACTER_CREATION_STEPS.length}</div>
        </div>
        {mainContent}
        {currentStepId !== 'review' && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={goPrevious} disabled={currentStepIndex <= 0} className={secondaryButtonClass}>Back</button>
            <div className="min-w-0 flex-1 text-center text-sm text-[color:var(--color-tone-warning-text)]" aria-live="polite">{stepValidation.isValid ? '' : firstError(stepValidation.errors as Record<string, string | undefined>)}</div>
            <button type="button" onClick={goNext} disabled={!stepValidation.isValid} className={primaryButtonClass}>Next</button>
          </div>
        )}
      </div>

      {pendingOverwriteSlotId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="overwrite-title">
            <h2 id="overwrite-title" className="text-lg font-semibold text-[color:var(--color-text-strong)]">Overwrite existing save?</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">The selected slot already contains a campaign. Confirm to replace the address with this new character.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={onCancelOverwrite} className={secondaryButtonClass}>Cancel</button>
              <button type="button" onClick={() => onConfirmOverwrite({ hasSelectableBackstories })} className={primaryButtonClass}>Confirm Overwrite</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
