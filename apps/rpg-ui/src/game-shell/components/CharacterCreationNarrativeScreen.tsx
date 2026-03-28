import { useEffect, useMemo, useRef, useState } from 'react';
import type { PlayerAttributeKey } from '../../../../../packages/shared/types/src/index.js';
import { Icon } from '../../components/icons';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';
import {
  CHARACTER_CREATION_STEPS,
  getNextCharacterCreationStepId,
  getPreviousCharacterCreationStepId,
  type CharacterCreationStepId,
  type CharacterCreationFormState,
  validateCharacterCreationForm,
  validateCharacterCreationStep
} from '../characterCreationForm.js';
import {
  CHARACTER_ATTRIBUTE_ORDER,
  CHARACTER_ATTRIBUTE_PRESENTATIONS,
  getAllocatedCharacterAttributePoints,
  parsePresentedAttributeValues
} from '../characterAttributes.js';
import {
  generateRandomCharacterName,
  getBackstoryOptionsForSelection,
  getBackstoryStartAccessProfileId,
  getLineageIdentityCatalog,
  lineageOptions,
  pathOptions
} from '../characterCreationCatalog.js';
import { buildCharacterCreationPreview } from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import {
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions,
  resolveWorldSelection
} from '../worldSelectionCatalog.js';
import { NoticeBanner } from './NoticeBanner.js';

type Props = {
  form: CharacterCreationFormState;
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  pendingOverwriteSlotId: ManualSaveSlotId | null;
  onDismissNotice: () => void;
  onReturnToMainMenu: () => void;
  onChange: (form: Partial<CharacterCreationFormState>) => void;
  onCreateGame: () => void;
  onConfirmOverwrite: () => void;
  onCancelOverwrite: () => void;
  themeMode: 'dark' | 'light';
  onToggleThemeMode: () => void;
};

const topButton =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-creator-card-hover)]';

const creatorCardBase =
  'rounded-[24px] border bg-[color:var(--color-creator-card)] shadow-[0_18px_42px_var(--color-creator-card-shadow)] backdrop-blur-sm transition';

const creatorCardUnselected =
  'border-[color:var(--color-border)] hover:bg-[color:var(--color-creator-card-hover)]';

const summaryBlockClass =
  'rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] p-4';

const insetBlockClass =
  'rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-creator-card-strong)]';

const textInputClass =
  'w-full rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] px-4 py-3 text-[color:var(--color-text-strong)] outline-none transition placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-border-strong)]';

const selectedSwatchBorder = 'rgba(251,191,36,0.85)';
const ATTRIBUTE_POINT_BUDGET = 10;

function getSelectableCardClass(
  selected: boolean,
  tone: 'lineage' | 'continent' | 'region' | 'settlement' | 'backstory' | 'path' | 'slot'
): string {
  if (!selected) {
    return `${creatorCardBase} ${creatorCardUnselected}`;
  }

  switch (tone) {
    case 'lineage':
      return `${creatorCardBase} border-cyan-400/55 bg-[color:var(--color-creator-card-strong)]`;
    case 'continent':
    case 'region':
    case 'settlement':
      return `${creatorCardBase} border-emerald-400/50 bg-[color:var(--color-creator-card-strong)]`;
    case 'backstory':
      return `${creatorCardBase} border-stone-400/45 bg-[color:var(--color-creator-card-strong)]`;
    case 'path':
      return `${creatorCardBase} border-orange-400/50 bg-[color:var(--color-creator-card-strong)]`;
    case 'slot':
      return `${creatorCardBase} border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card-strong)]`;
    default:
      return `${creatorCardBase} ${creatorCardUnselected}`;
  }
}

export function CharacterCreationNarrativeScreen({
  form,
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentStepId, setCurrentStepId] =
    useState<CharacterCreationStepId>('lineage');
  const [showValidation, setShowValidation] = useState(false);
  const preview = buildCharacterCreationPreview(form);
  const identityCatalog = getLineageIdentityCatalog(form.lineageId);
  const continents = getWorldContinentOptions();
  const regions = getWorldRegionOptions(form.continentId);
  const settlements = getWorldSettlementOptions({
    continentId: form.continentId,
    regionId: form.regionId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  });
  const selectedWorld = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    classId: form.classId,
    backgroundId: getBackstoryStartAccessProfileId(form.backgroundId)
  });
  const backstories = getBackstoryOptionsForSelection(form.lineageId, selectedWorld);
  const validations = useMemo(
    () =>
      Object.fromEntries(
        CHARACTER_CREATION_STEPS.map((step) => [
          step.id,
          validateCharacterCreationStep(form, step.id)
        ])
      ) as Record<CharacterCreationStepId, ReturnType<typeof validateCharacterCreationStep>>,
    [form]
  );
  const currentValidation = validations[currentStepId];
  const fullValidation = validateCharacterCreationForm(form);
  const currentIndex = CHARACTER_CREATION_STEPS.findIndex(
    (step) => step.id === currentStepId
  );
  const firstInvalid = CHARACTER_CREATION_STEPS.findIndex(
    (step) => !validations[step.id].isValid
  );
  const maxUnlocked =
    firstInvalid === -1
      ? CHARACTER_CREATION_STEPS.length - 1
      : Math.max(firstInvalid, currentIndex);
  const previousStepId = getPreviousCharacterCreationStepId(currentStepId);
  const selectedSlot = slots.find((slot) => slot.id === form.saveSlotId) ?? null;
  const needsOverwrite =
    selectedSlot?.kind === 'manual' &&
    selectedSlot.hasSave &&
    pendingOverwriteSlotId === selectedSlot.id;
  const allocatedAttributePoints = getAllocatedCharacterAttributePoints(
    form.attributeAllocation
  );
  const remainingAttributePoints =
    ATTRIBUTE_POINT_BUDGET - allocatedAttributePoints;
  const previewAttributeMap = new Map(
    preview.attributeMetrics.map((metric) => [metric.label as PlayerAttributeKey, metric])
  );

  const allocationRows = CHARACTER_ATTRIBUTE_ORDER.map((attributeKey) => {
    const presentation = CHARACTER_ATTRIBUTE_PRESENTATIONS[attributeKey];
    const allocated = form.attributeAllocation[attributeKey] ?? 0;
    const metricValue = previewAttributeMap.get(attributeKey)?.value ?? null;
    const finalValue =
      metricValue === null ? null : Number.parseInt(metricValue, 10);
    const baseValue =
      finalValue === null || Number.isNaN(finalValue) ? null : finalValue - allocated;

    return {
      ...presentation,
      attributeKey,
      allocated,
      baseValue,
      finalValue:
        baseValue === null || Number.isNaN(baseValue) ? null : baseValue + allocated
    };
  });

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepId]);

  const goToStep = (stepId: CharacterCreationStepId) => {
    setCurrentStepId(stepId);
    setShowValidation(false);
  };

  const choose = (
    stepId: CharacterCreationStepId,
    currentValue: string,
    nextValue: string,
    nextForm: Partial<CharacterCreationFormState>,
    nextStep?: CharacterCreationStepId
  ) => {
    if (
      currentValue === nextValue &&
      currentStepId === stepId &&
      validations[stepId].isValid
    ) {
      const following = getNextCharacterCreationStepId(stepId);
      if (following) {
        goToStep(following);
      }
      return;
    }

    onChange(nextForm);
    setShowValidation(false);
    if (nextStep && currentValue !== nextValue) {
      goToStep(nextStep);
    }
  };

  const updateAttributeAllocation = (
    attributeKey: PlayerAttributeKey,
    delta: -1 | 1
  ) => {
    const currentValue = form.attributeAllocation[attributeKey] ?? 0;

    if (delta < 0 && currentValue <= 0) {
      return;
    }

    if (delta > 0 && remainingAttributePoints <= 0) {
      return;
    }

    onChange({
      attributeAllocation: {
        ...form.attributeAllocation,
        [attributeKey]: currentValue + delta
      }
    });
    setShowValidation(false);
  };

  const renderMetricRows = (
    values: Array<{ id: string; label: string; value: string | null }>
  ) => (
    <div className={summaryBlockClass}>
      <div className="space-y-3">
        {values.map((value) => (
          <div
            key={value.id}
            className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-3 last:border-b-0 last:pb-0"
          >
            <div className="text-sm text-[color:var(--color-text-soft)]">
              {value.label}
            </div>
            <div className="text-base font-semibold text-[color:var(--color-text-strong)]">
              {value.value ?? 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMetricTiles = (
    values: Array<{ id: string; label: string; value: string | null }>,
    columnsClassName: string
  ) => (
    <div className={summaryBlockClass}>
      <div className={`grid gap-2 ${columnsClassName}`}>
        {values.map((value) => (
          <div
            key={value.id}
            className={`${insetBlockClass} px-3 py-2 text-center`}
          >
            <div className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">
              {value.label}
            </div>
            <div className="mt-1 text-base font-semibold text-[color:var(--color-text-strong)]">
              {value.value ?? 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const swatches = (
    title: string,
    options: NonNullable<typeof identityCatalog>['skinToneOptions'],
    selectedId: string,
    key: 'skinToneId' | 'hairColorId' | 'eyeColorId'
  ) => (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange({ [key]: option.id } as Partial<CharacterCreationFormState>)
              }
              className="min-w-[50px] rounded-full border px-2 py-1.5 text-[10px] font-semibold transition hover:opacity-100"
              style={{
                backgroundColor:
                  option.swatch?.background ?? 'var(--color-creator-card)',
                color: option.swatch?.foreground ?? 'var(--color-text-strong)',
                borderColor: selected
                  ? selectedSwatchBorder
                  : option.swatch?.border ?? 'var(--color-border)',
                opacity: selected ? 1 : 0.34
              }}
              title={option.description}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  let mainContent = <div />;

  if (currentStepId === 'lineage') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {lineageOptions.map((option) => {
          const statRows = parsePresentedAttributeValues(option.notes[0] ?? '');
          const lineageNote = option.notes[1] ?? null;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                choose('lineage', form.lineageId, option.id, {
                  lineageId: option.id,
                  heightBandId: '',
                  hairColorId: '',
                  eyeColorId: '',
                  skinToneId: '',
                  backgroundId: ''
                })
              }
              className={`${getSelectableCardClass(
                form.lineageId === option.id,
                'lineage'
              )} p-5 text-left`}
            >
              <div className="gap-5 md:grid md:grid-cols-[148px_minmax(0,1fr)]">
                <div className={`${insetBlockClass} p-3`}>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                    Base Attributes
                  </div>
                  <div className="space-y-2">
                    {statRows.map((row) => (
                      <div
                        key={`${option.id}.${row.key}`}
                        className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] pb-2 text-sm last:border-b-0 last:pb-0"
                      >
                        <span className="font-semibold text-[color:var(--color-text-soft)]">
                          {row.key}
                        </span>
                        <span className="text-[color:var(--color-text-strong)]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                    {option.label}
                  </div>
                  {lineageNote && (
                    <div className="mt-2 text-sm text-[color:var(--color-muted-strong)]">
                      {lineageNote}
                    </div>
                  )}
                  <div className="mt-4 text-sm leading-7 text-[color:var(--color-text-soft)]">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  } else if (currentStepId === 'identity' && identityCatalog) {
    mainContent = (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="max-w-[18rem] flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Name
            </span>
            <input
              value={form.playerName}
              onChange={(event) => onChange({ playerName: event.target.value })}
              className={textInputClass}
            />
          </label>
          <button
            type="button"
            onClick={() =>
              onChange({
                playerName: generateRandomCharacterName(
                  form.lineageId || 'lineage.human',
                  form.sexId
                )
              })
            }
            className={topButton}
            title="Random name"
          >
            <Icon name="dice" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-3">
          {([
            { id: 'male', text: 'M', tip: 'Male' },
            { id: 'female', text: 'F', tip: 'Female' }
          ] as const).map((sex) => (
            <Tooltip key={sex.id} content={<span>{sex.tip}</span>}>
              <button
                type="button"
                onClick={() => onChange({ sexId: sex.id })}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-4 text-base font-semibold ${
                  form.sexId === sex.id
                    ? 'border-amber-300/85 bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                    : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                }`}
              >
                {sex.text}
              </button>
            </Tooltip>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {identityCatalog.heightBands.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange({ heightBandId: option.id })}
              className={`min-w-[104px] rounded-full border px-4 py-2 text-sm font-semibold ${
                form.heightBandId === option.id
                  ? 'border-amber-300/85 bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                  : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {swatches(
          'Skin Color',
          identityCatalog.skinToneOptions,
          form.skinToneId,
          'skinToneId'
        )}
        {swatches(
          'Hair Color',
          identityCatalog.hairColorOptions,
          form.hairColorId,
          'hairColorId'
        )}
        {swatches(
          'Eye Color',
          identityCatalog.eyeColorOptions,
          form.eyeColorId,
          'eyeColorId'
        )}
      </div>
    );
  } else if (currentStepId === 'identity') {
    mainContent = (
      <Card>
        <div className="text-sm leading-7 text-[color:var(--color-text-soft)]">
          Choose a lineage first to unlock the identity palettes for this step.
        </div>
      </Card>
    );
  } else if (currentStepId === 'continent') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {continents.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              choose('continent', form.continentId, option.id, {
                continentId: option.id,
                regionId: '',
                startingSettlementId: '',
                backgroundId: ''
              })
            }
            className={`${getSelectableCardClass(
              form.continentId === option.id,
              'continent'
            )} p-5 text-left`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                {option.label}
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                  option.difficultyTone === 'success'
                    ? 'border-emerald-400/35 bg-emerald-300/15 text-[color:var(--color-accent-contrast)]'
                    : option.difficultyTone === 'warning'
                      ? 'border-amber-400/35 bg-amber-300/15 text-[color:var(--color-accent-contrast)]'
                      : 'border-rose-400/35 bg-rose-300/15 text-[color:var(--color-accent-contrast)]'
                }`}
              >
                {option.difficultyLabel}
              </span>
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    );
  } else if (currentStepId === 'region') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {regions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              choose('region', form.regionId, option.id, {
                regionId: option.id,
                startingSettlementId: '',
                backgroundId: ''
              })
            }
            className={`${getSelectableCardClass(
              form.regionId === option.id,
              'region'
            )} p-5 text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                {option.label}
              </div>
              <div className="flex gap-1 text-[color:var(--color-text-soft)]">
                {option.resourceIcons.map((icon) => (
                  <Icon key={`${option.id}.${icon}`} name={icon} className="h-4 w-4" />
                ))}
              </div>
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              {option.description}
            </div>
            <div className={`${insetBlockClass} mt-4 px-3 py-3 text-sm leading-7 text-[color:var(--color-text-soft)]`}>
              {option.resourceNarrative}
            </div>
          </button>
        ))}
      </div>
    );
  } else if (currentStepId === 'settlement') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {settlements.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              choose('settlement', form.startingSettlementId, option.id, {
                startingSettlementId: option.id,
                backgroundId: ''
              })
            }
            className={`${getSelectableCardClass(
              form.startingSettlementId === option.id,
              'settlement'
            )} p-5 text-left`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                {option.label}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                Pop {option.populationSize}
              </div>
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              {option.description}
            </div>
            <div className={`${insetBlockClass} mt-4 px-3 py-3 text-sm leading-7 text-[color:var(--color-text-soft)]`}>
              <p>{option.landRestriction.propertyNarrative}</p>
              <p className="mt-2 text-[color:var(--color-text-strong)]">
                {option.landRestriction.currentStanding}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  } else if (currentStepId === 'backstory') {
    mainContent = (
      <div className="space-y-3">
        {backstories.map((option) => (
          <div
            key={option.id}
            className={getSelectableCardClass(
              form.backgroundId === option.id,
              'backstory'
            )}
          >
            <button
              type="button"
              onClick={() =>
                choose('backstory', form.backgroundId, option.id, {
                  backgroundId: option.id
                })
              }
              className="w-full px-5 py-4 text-left"
            >
              <div className="text-lg font-semibold text-[color:var(--color-text-strong)]">
                {option.label}
              </div>
              <div className="mt-2 text-sm leading-7 text-[color:var(--color-text-soft)]">
                {option.hookLine}
              </div>
            </button>
            {form.backgroundId === option.id && (
              <div className="border-t border-[color:var(--color-border)] px-5 py-4">
                <div className="space-y-4 text-sm leading-7 text-[color:var(--color-text-soft)]">
                  <p>{option.narrativeParagraphs[0]}</p>
                  <p>{option.narrativeParagraphs[1]}</p>
                </div>
                <div className="mt-4 space-y-2">
                  {option.varianceLines.map((line) => (
                    <div
                      key={`${option.id}.${line}`}
                      className={`${insetBlockClass} px-3 py-3 text-sm leading-7 text-[color:var(--color-text-soft)]`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else if (currentStepId === 'path') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {pathOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              choose('path', form.classId, option.id, { classId: option.id })
            }
            className={`${getSelectableCardClass(
              form.classId === option.id,
              'path'
            )} p-5 text-left`}
          >
            <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
              {option.label}
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    );
  } else if (currentStepId === 'attributes') {
    mainContent = (
      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                  Points To Spend
                </div>
                <div className="mt-1 text-2xl font-semibold text-[color:var(--color-text-strong)]">
                  {Math.max(remainingAttributePoints, 0)}
                </div>
              </div>
              <div className="text-sm leading-6 text-[color:var(--color-text-soft)]">
                Distribute all {ATTRIBUTE_POINT_BUDGET} discretionary points before the final review.
              </div>
            </div>
            <div className="space-y-3">
              {allocationRows.map((row) => (
                <div
                  key={row.attributeKey}
                  className={`${insetBlockClass} px-4 py-4`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="min-w-[3rem] text-lg font-semibold text-[color:var(--color-text-strong)]">
                          {row.attributeKey}
                        </div>
                        <div className="text-sm text-[color:var(--color-text-soft)]">
                          Current {row.baseValue ?? 'Pending'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start lg:self-auto">
                      <button
                        type="button"
                        onClick={() => updateAttributeAllocation(row.attributeKey, -1)}
                        disabled={row.allocated <= 0}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-lg text-[color:var(--color-text-strong)] transition disabled:cursor-not-allowed disabled:opacity-35"
                        title={`Lower ${row.attributeKey}`}
                      >
                        -
                      </button>
                      <div className="min-w-[5.5rem] rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] px-4 py-2 text-center text-base font-semibold text-[color:var(--color-text-strong)]">
                        {row.finalValue ?? 'Pending'}
                      </div>
                      <button
                        type="button"
                        onClick={() => updateAttributeAllocation(row.attributeKey, 1)}
                        disabled={remainingAttributePoints <= 0}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-lg text-[color:var(--color-text-strong)] transition disabled:cursor-not-allowed disabled:opacity-35"
                        title={`Raise ${row.attributeKey}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div className="grid gap-3 lg:grid-cols-2">
            {allocationRows.map((row) => (
              <div
                key={`${row.attributeKey}.description`}
                className={`${insetBlockClass} px-4 py-4`}
              >
                <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                  {row.attributeKey} · {row.label}
                </div>
                <div className="mt-2 text-sm leading-7 text-[color:var(--color-text-soft)]">
                  {row.shortEffect} {row.gameplayEffect}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  } else {
    mainContent = (
      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className={`${summaryBlockClass} text-sm leading-7 text-[color:var(--color-text-soft)]`}>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                  Opening Summary
                </div>
                <div className="mt-3">{preview.reviewNarrative}</div>
              </div>
              <div className={`${summaryBlockClass} text-sm leading-7 text-[color:var(--color-text-soft)]`}>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                  Land Access
                </div>
                <div className="mt-3">{preview.startingAccessDetail}</div>
              </div>
            </div>
            {showValidation && !fullValidation.isValid && (
              <div className="rounded-[20px] border border-rose-300/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
                Complete the remaining selections before beginning the campaign.
              </div>
            )}
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            {slots
              .filter((slot) => slot.kind === 'manual')
              .map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() =>
                    onChange({ saveSlotId: slot.id as ManualSaveSlotId })
                  }
                  className={`${getSelectableCardClass(
                    slot.id === form.saveSlotId,
                    'slot'
                  )} w-full p-4 text-left`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                      {slot.label}
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                      {slot.hasSave ? 'Occupied' : 'New Game'}
                    </div>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    {slot.hasSave
                      ? `${slot.playerName} | ${slot.lastSavedLabel}`
                      : 'A clean slot ready for this campaign.'}
                  </div>
                </button>
              ))}
          </div>
        </Card>
        {needsOverwrite && (
          <Card>
            <div className="space-y-4">
              <div className="rounded-[20px] border border-rose-300/20 bg-rose-200/10 p-4 text-sm leading-6 text-rose-100">
                {selectedSlot?.label} already holds a saved campaign. Confirm only if
                you intend to replace that data.
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onConfirmOverwrite}
                  className="rounded-full border border-rose-300/35 bg-rose-200/14 px-4 py-2 text-sm text-[color:var(--color-accent-contrast)]"
                >
                  Confirm Overwrite
                </button>
                <button
                  type="button"
                  onClick={onCancelOverwrite}
                  className={`${topButton} w-auto px-4 text-sm`}
                >
                  Keep Existing Save
                </button>
              </div>
            </div>
          </Card>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!fullValidation.isValid) {
                setShowValidation(true);
                return;
              }
              onCreateGame();
            }}
            disabled={needsOverwrite}
            className="rounded-full border border-amber-300/35 bg-amber-200/14 px-5 py-3 text-sm font-semibold text-[color:var(--color-accent-contrast)] disabled:opacity-50"
          >
            Begin Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen overflow-auto px-4 pb-6 pt-4 sm:px-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-4">
        <div className="sticky top-0 z-30 rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-4 py-3 shadow-panel backdrop-blur-xl">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => previousStepId && goToStep(previousStepId)}
                disabled={!previousStepId}
                className={`${topButton} disabled:cursor-not-allowed disabled:opacity-40`}
                title="Previous step"
              >
                <Icon name="arrowLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onReturnToMainMenu}
                className={topButton}
                title="Return to main menu"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
            </div>
            <div className="justify-self-center text-center">
              <Tooltip
                content={
                  <span>
                    Choose the blood in your veins, the face you show the world,
                    the city that raised you, the past that shaped you, the path
                    you will claim, and the 10 stat points that define your first
                    real strengths.
                  </span>
                }
              >
                <button
                  type="button"
                  className="text-lg font-semibold tracking-[0.04em] text-[color:var(--color-text-strong)]"
                >
                  Forge A New Character
                </button>
              </Tooltip>
            </div>
            <button
              type="button"
              onClick={onToggleThemeMode}
              className={`${topButton} justify-self-end`}
              title={
                themeMode === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              <Icon
                name={themeMode === 'dark' ? 'sun' : 'moon'}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
        {notice && <NoticeBanner notice={notice} onDismiss={onDismissNotice} />}
        <div className="grid flex-1 gap-4 xl:grid-cols-[88px_minmax(0,1fr)_320px]">
          <div className="sticky top-20 flex flex-col items-center gap-2">
            {CHARACTER_CREATION_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => index <= maxUnlocked && goToStep(step.id)}
                disabled={index > maxUnlocked}
                className="flex flex-col items-center gap-1.5 text-center disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-[4px] text-sm font-semibold ${
                    step.id === currentStepId
                      ? 'border-amber-300/85 bg-amber-200/18 text-[color:var(--color-accent-contrast)] shadow-[0_0_22px_rgba(251,191,36,0.35)]'
                      : validations[step.id].isValid
                        ? 'border-emerald-300/75 bg-emerald-200/18 text-[color:var(--color-accent-contrast)] opacity-100'
                        : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)] opacity-45'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-soft)]">
                  {step.label}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {mainContent}
            {showValidation &&
              !currentValidation.isValid &&
              currentStepId !== 'review' && (
                <div className="text-sm text-rose-300">
                  {currentValidation.errors.attributeAllocation ??
                    'Complete the required choices on this step before moving on.'}
                </div>
              )}
          </div>
          <div className="space-y-4 xl:sticky xl:top-20">
            <Card accent="var(--color-world)">
              <div className="space-y-4">
                <div className={summaryBlockClass}>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                    Character Name
                  </div>
                  <div className="mt-2 text-xl text-[color:var(--color-text-strong)]">
                    {preview.characterName}
                  </div>
                </div>
                {renderMetricRows(preview.identityMetrics)}
                {renderMetricTiles(preview.resourceMetrics, 'grid-cols-3')}
                {renderMetricTiles(preview.attributeMetrics, 'grid-cols-3')}
                {preview.isResolved && preview.starterSkills.length > 0 && (
                  <div>{renderTags('Starting Skills', preview.starterSkills)}</div>
                )}
                {preview.isResolved && preview.starterTraits.length > 0 && (
                  <div>{renderTags('Starting Traits', preview.starterTraits)}</div>
                )}
                {preview.isResolved && preview.starterGear.length > 0 && (
                  <div>{renderTags('Equipped Gear', preview.starterGear)}</div>
                )}
                {preview.isResolved && preview.walletLabel && (
                  <div>{renderTags('Funds', [preview.walletLabel])}</div>
                )}
                {preview.isResolved && preview.starterPack.length > 0 && (
                  <div>{renderTags('Starter Pack', preview.starterPack)}</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  function renderTags(title: string, values: string[]) {
    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
          {title}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={`${title}.${value}`}
              className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] px-3 py-1.5 text-sm text-[color:var(--color-text-soft)]"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  }
}
