import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BASE_PLAYER_RESOURCE_MAXIMA,
  type PlayerAttributeKey
} from '../../../../../packages/shared/types/src/index.js';
import { Icon } from '../../components/icons';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';
import {
  CHARACTER_CREATION_STEPS,
  createDefaultCharacterCreationFormState,
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
  getBuildLabel,
  getHeightBandLabel,
  getBackstoryOptionsForSelection,
  getBackstoryStartAccessProfileId,
  getLineageCardArt,
  getLineageIdentityCatalog,
  lineageOptions,
  pathOptions
} from '../characterCreationCatalog.js';
import { buildCharacterCreationPreview } from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import {
  getContinentCardArt,
  getRegionCardArt,
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

const topPillButton =
  'inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-soft)] transition hover:bg-[color:var(--color-creator-card-hover)]';

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

const identitySectionWidthClass = 'w-full max-w-[26.75rem]';

const identityChoiceGridClass = `${identitySectionWidthClass} grid grid-cols-3 gap-3`;

const identityPaletteGridClass =
  `${identitySectionWidthClass} grid grid-cols-9 items-start gap-x-1 gap-y-1.5`;

const selectionOverlayBase =
  'absolute inset-y-0 left-0 z-10 flex w-[54%] max-w-[34rem] items-stretch overflow-hidden opacity-0 translate-x-5 transition duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100';

const continentSelectionOverlayBase =
  'absolute bottom-px left-px top-px z-10 flex items-stretch overflow-hidden rounded-l-[23px]';

const lineageSelectionOverlayBase =
  'absolute inset-y-0 left-0 right-[7rem] z-10 flex items-stretch overflow-hidden';

const CONTINENT_SELECTION_PANEL_WIDTH = 'clamp(13rem, 22%, 18rem)';
const CONTINENT_SELECTION_IMAGE_LEFT = `calc(${CONTINENT_SELECTION_PANEL_WIDTH} + 1px)`;

const ATTRIBUTE_POINT_BUDGET = 10;
const LINEAGE_ART_ROTATION_MS = 7000;
const STEP_UNLOCK_FEEDBACK_MS = 1600;
const SUMMARY_COLLAPSED_STEP_IDS = new Set<CharacterCreationStepId>([
  'continent',
  'region',
  'settlement'
]);

type ResourceBarId = 'hp' | 'mp' | 'stamina';

function parseResourceMetricValue(
  metrics: Array<{ id: string; value: string | null }>,
  id: ResourceBarId
): number | null {
  const metric = metrics.find((entry) => entry.id === id);

  if (!metric?.value) {
    return null;
  }

  const parsedValue = Number.parseInt(metric.value, 10);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

const DEFAULT_RESOURCE_BAR_BASELINE: Record<ResourceBarId, number> = (() => {
  const defaultPreview = buildCharacterCreationPreview(
    createDefaultCharacterCreationFormState('slot-1')
  );

  return {
    hp:
      parseResourceMetricValue(defaultPreview.resourceMetrics, 'hp') ??
      BASE_PLAYER_RESOURCE_MAXIMA.hp,
    mp:
      parseResourceMetricValue(defaultPreview.resourceMetrics, 'mp') ??
      BASE_PLAYER_RESOURCE_MAXIMA.mp,
    stamina:
      parseResourceMetricValue(defaultPreview.resourceMetrics, 'stamina') ??
      BASE_PLAYER_RESOURCE_MAXIMA.stamina
  };
})();

function getResourceBarFillPercent(
  resourceId: ResourceBarId,
  numericValue: number | null
): number {
  if (numericValue === null || Number.isNaN(numericValue)) {
    return 0;
  }

  const baseline = DEFAULT_RESOURCE_BAR_BASELINE[resourceId];

  if (baseline <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (numericValue / (baseline * 2)) * 100));
}

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

function getSelectionOverlayGradientClass(
  tone: 'lineage' | 'continent' | 'region' | 'settlement'
): string {
  switch (tone) {
    case 'lineage':
      return 'bg-[linear-gradient(90deg,rgba(4,9,17,0.96)_0%,rgba(5,10,18,0.96)_22%,rgba(6,11,19,0.88)_40%,rgba(7,12,20,0.62)_58%,rgba(8,14,23,0.3)_78%,rgba(9,16,26,0.08)_92%,rgba(9,16,26,0)_100%)]';
    case 'continent':
      return 'bg-[linear-gradient(90deg,rgba(8,16,14,0.92)_0%,rgba(10,22,18,0.86)_56%,rgba(12,28,22,0.5)_80%,rgba(12,28,22,0.12)_92%,rgba(12,28,22,0)_100%)]';
    case 'region':
      return 'bg-[linear-gradient(90deg,rgba(7,12,20,0.92)_0%,rgba(9,16,28,0.86)_56%,rgba(10,20,32,0.5)_80%,rgba(10,20,32,0.12)_92%,rgba(10,20,32,0)_100%)]';
    case 'settlement':
      return 'bg-[linear-gradient(90deg,rgba(16,12,8,0.92)_0%,rgba(24,16,10,0.86)_56%,rgba(32,18,10,0.5)_80%,rgba(32,18,10,0.12)_92%,rgba(32,18,10,0)_100%)]';
    default:
      return '';
  }
}

function getRegionResourceTone(icon: Parameters<typeof Icon>[0]['name']): {
  wrapper: string;
  icon: string;
} {
  switch (icon) {
    case 'tree':
      return {
        wrapper: 'border-emerald-300/25 bg-emerald-400/12',
        icon: 'text-emerald-100'
      };
    case 'grain':
      return {
        wrapper: 'border-amber-300/25 bg-amber-400/12',
        icon: 'text-amber-100'
      };
    case 'fruit':
      return {
        wrapper: 'border-orange-300/25 bg-orange-400/12',
        icon: 'text-orange-100'
      };
    case 'vegetable':
      return {
        wrapper: 'border-lime-300/25 bg-lime-400/12',
        icon: 'text-lime-100'
      };
    case 'animal':
      return {
        wrapper: 'border-sky-300/25 bg-sky-400/12',
        icon: 'text-sky-100'
      };
    default:
      return {
        wrapper: 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)]',
        icon: 'text-[color:var(--color-text-strong)]'
      };
  }
}

function formatAttributeTradeoff(
  adjustments: Partial<Record<PlayerAttributeKey, number>>
): { positive: string | null; negative: string | null } {
  const positive = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;

    if (value <= 0) {
      return [];
    }

    return [`+${value} ${attributeKey}`];
  });
  const negative = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;

    if (value >= 0) {
      return [];
    }

    return [`${value} ${attributeKey}`];
  });

  return {
    positive: positive.length > 0 ? positive.join(' / ') : null,
    negative: negative.length > 0 ? negative.join(' / ') : null
  };
}

function getSexSummaryLabel(
  sexId: CharacterCreationFormState['sexId']
): 'Male' | 'Female' | null {
  if (sexId === 'male') {
    return 'Male';
  }

  if (sexId === 'female') {
    return 'Female';
  }

  return null;
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
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [showAlternateLineageArt, setShowAlternateLineageArt] = useState(false);
  const preview = buildCharacterCreationPreview(form);
  const identityCatalog = getLineageIdentityCatalog(form.lineageId);
  const selectedLineageArt = getLineageCardArt(form.lineageId);
  const activeOutlineColor =
    themeMode === 'dark' ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.88)';
  const activeOutlineShadow =
    themeMode === 'dark'
      ? '0 0 0 1px rgba(255,255,255,0.22), 0 0 22px rgba(255,255,255,0.16)'
      : '0 0 0 1px rgba(0,0,0,0.18), 0 0 18px rgba(0,0,0,0.12)';
  const activeOutlineStyle = {
    borderColor: activeOutlineColor,
    boxShadow: activeOutlineShadow
  };
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
  const regionSelectionLocked = form.continentId.trim().length === 0;
  const settlementSelectionLocked = form.regionId.trim().length === 0;
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
  const [recentlyUnlockedStepIds, setRecentlyUnlockedStepIds] = useState<
    CharacterCreationStepId[]
  >([]);
  const previousMaxUnlockedRef = useRef(maxUnlocked);
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
  const summaryIdentityRows = [
    { label: 'Height', value: getHeightBandLabel(form.heightBandId) ?? 'Pending' },
    { label: 'Build', value: getBuildLabel(form.buildId) ?? 'Pending' },
    { label: 'Sex', value: getSexSummaryLabel(form.sexId) ?? 'Pending' },
    { label: 'Race', value: preview.lineageLabel ?? 'Pending' }
  ];
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

  useEffect(() => {
    setSummaryVisible(!SUMMARY_COLLAPSED_STEP_IDS.has(currentStepId));
  }, [currentStepId]);

  useEffect(() => {
    setShowAlternateLineageArt(false);

    if (
      currentStepId !== 'lineage' ||
      form.lineageId.trim().length === 0 ||
      !selectedLineageArt?.secondaryImageUrl
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setShowAlternateLineageArt((current) => !current);
    }, LINEAGE_ART_ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [currentStepId, form.lineageId, selectedLineageArt?.secondaryImageUrl]);

  useEffect(() => {
    const previousMaxUnlocked = previousMaxUnlockedRef.current;
    previousMaxUnlockedRef.current = maxUnlocked;

    if (maxUnlocked <= previousMaxUnlocked) {
      return;
    }

    const newlyUnlocked = CHARACTER_CREATION_STEPS.slice(
      previousMaxUnlocked + 1,
      maxUnlocked + 1
    ).map((step) => step.id);

    if (newlyUnlocked.length === 0) {
      return;
    }

    setRecentlyUnlockedStepIds((current) =>
      Array.from(new Set([...current, ...newlyUnlocked]))
    );

    const timeoutId = window.setTimeout(() => {
      setRecentlyUnlockedStepIds((current) =>
        current.filter((stepId) => !newlyUnlocked.includes(stepId))
      );
    }, STEP_UNLOCK_FEEDBACK_MS);

    return () => window.clearTimeout(timeoutId);
  }, [maxUnlocked]);

  const getStepDependencyLock = (stepId: CharacterCreationStepId) => {
    if (stepId === 'region' && regionSelectionLocked) {
      return {
        locked: true,
        redirectStep: 'continent' as CharacterCreationStepId
      };
    }

    if (stepId === 'settlement' && settlementSelectionLocked) {
      return {
        locked: true,
        redirectStep: 'region' as CharacterCreationStepId
      };
    }

    return {
      locked: false,
      redirectStep: null
    };
  };

  const goToStep = (stepId: CharacterCreationStepId) => {
    const dependencyLock = getStepDependencyLock(stepId);
    setCurrentStepId(dependencyLock.redirectStep ?? stepId);
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

  const setSelection = (nextForm: Partial<CharacterCreationFormState>) => {
    onChange(nextForm);
    setShowValidation(false);
  };

  const advanceSelectionStep = (stepId: CharacterCreationStepId) => {
    const following = getNextCharacterCreationStepId(stepId);
    if (following) {
      goToStep(following);
    }
  };

  const getSelectionAdvanceLabel = (stepId: CharacterCreationStepId) =>
    stepId === 'settlement' ? 'Confirm' : 'Next';

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

  const renderStatList = (
    values: Array<{ id: string; label: string; value: string | null }>,
    options?: {
      compact?: boolean;
      className?: string;
      frame?: boolean;
    }
  ) => {
    const content = (
      <div className={options?.compact ? 'space-y-1.5' : 'space-y-2.5'}>
        {values.map((value) => (
          <div
            key={value.id}
            className={`grid grid-cols-[auto_minmax(0,1fr)] items-center border-b border-[color:var(--color-border)] last:border-b-0 ${
              options?.compact
                ? 'gap-x-1.5 pb-1 last:pb-0'
                : 'gap-x-3 pb-2.5 last:pb-0'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">
              {value.label}
            </div>
            <div className="justify-self-end text-sm font-semibold text-[color:var(--color-text-strong)]">
              {value.value ?? 'Pending'}
            </div>
          </div>
        ))}
      </div>
    );

    if (options?.frame === false) {
      return <div className={options?.className ?? ''}>{content}</div>;
    }

    return (
      <div
        className={`${insetBlockClass} ${
          options?.compact ? 'px-2.5 py-2.5' : 'px-3 py-3'
        } ${options?.className ?? ''}`}
      >
        {content}
      </div>
    );
  };

  const renderResourceBars = (
    values: Array<{ id: string; label: string; value: string | null }>,
    options?: {
      className?: string;
      frame?: boolean;
    }
  ) => {
    const parsedValues = values.map((value) => {
      const numericValue =
        value.value === null ? null : Number.parseInt(value.value, 10);
      const normalizedValue =
        numericValue === null || Number.isNaN(numericValue) ? null : numericValue;

      return {
        ...value,
        numericValue: normalizedValue,
        fillPercent:
          normalizedValue === null
            ? 0
            : getResourceBarFillPercent(value.id as ResourceBarId, normalizedValue)
      };
    });

    const content = (
      <div className="space-y-3">
        {parsedValues.map((value) => {
          const tone =
            value.id === 'hp'
              ? {
                  labelClass: 'text-rose-200/85',
                  fill:
                    'linear-gradient(90deg, rgba(248,113,113,0.9) 0%, rgba(251,191,191,0.95) 100%)',
                  shadow: '0 0 18px rgba(248,113,113,0.24)'
                }
              : value.id === 'mp'
                ? {
                    labelClass: 'text-sky-200/85',
                    fill:
                      'linear-gradient(90deg, rgba(96,165,250,0.9) 0%, rgba(191,219,254,0.95) 100%)',
                    shadow: '0 0 18px rgba(96,165,250,0.24)'
                  }
                : {
                    labelClass: 'text-emerald-200/85',
                    fill:
                      'linear-gradient(90deg, rgba(74,222,128,0.88) 0%, rgba(209,250,229,0.95) 100%)',
                    shadow: '0 0 18px rgba(74,222,128,0.24)'
                  };

          return (
            <div key={value.id}>
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${tone.labelClass}`}
              >
                {value.label}: {value.value ?? 'Pending'}
              </div>
              <div className="relative mt-1.5 h-5 overflow-hidden rounded-[6px] border border-[color:var(--color-border)] bg-black/20">
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/12" />
                <div
                  className="h-full rounded-[4px] transition-[width] duration-500"
                  style={{
                    width: `${value.fillPercent}%`,
                    background: tone.fill,
                    boxShadow: tone.shadow
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );

    if (options?.frame === false) {
      return <div className={options.className ?? ''}>{content}</div>;
    }

    return <div className={`${summaryBlockClass} ${options?.className ?? ''}`}>{content}</div>;
  };

  const swatches = (
    title: string,
    options: NonNullable<typeof identityCatalog>['skinToneOptions'],
    selectedId: string,
    key: 'skinToneId' | 'hairColorId' | 'eyeColorId'
  ) => (
    <div className={identitySectionWidthClass}>
      <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
        {title}
      </div>
      <div className={identityPaletteGridClass}>
        {options.map((option) => {
          const selected = option.id === selectedId;
          const opacityClass = !selectedId
            ? 'opacity-100'
            : selected
              ? 'opacity-100'
              : 'opacity-35 hover:opacity-100 focus-visible:opacity-100';
          return (
            <Tooltip
              key={option.id}
              content={
                <span className="block text-center">
                  <span className="font-semibold text-slate-50">{option.label}</span>
                  <span className="mt-1 block text-slate-300">{option.description}</span>
                </span>
              }
              panelClassName="w-44 text-center leading-5"
            >
              <button
                type="button"
                onClick={() =>
                  onChange({ [key]: option.id } as Partial<CharacterCreationFormState>)
                }
                className={`h-11 w-11 rounded-full border-[3px] transition ${opacityClass}`}
                style={{
                  backgroundColor:
                    option.swatch?.background ?? 'var(--color-creator-card)',
                  borderColor: selected
                    ? activeOutlineColor
                    : option.swatch?.border ?? 'rgba(255,255,255,0.28)',
                  boxShadow: selected
                    ? activeOutlineShadow
                    : 'none'
                }}
                aria-label={`${title}: ${option.label}`}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );

  let mainContent = <div />;

  if (currentStepId === 'lineage') {
    mainContent = (
      <div className="space-y-4">
        {lineageOptions.map((option) => {
          const statRows = parsePresentedAttributeValues(option.notes[0] ?? '');
          const art = getLineageCardArt(option.id);
          const selected = form.lineageId === option.id;
          const lineagePrimaryImageUrl = art?.imageUrl;
          const lineageSecondaryImageUrl = art?.secondaryImageUrl ?? null;
          const activeLineageImageUrl =
            selected && showAlternateLineageArt && lineageSecondaryImageUrl
              ? lineageSecondaryImageUrl
              : lineagePrimaryImageUrl;

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'lineage'
              )} group relative overflow-hidden ${selected ? 'lineage-card-selected min-h-[30rem]' : ''}`}
              style={selected ? activeOutlineStyle : undefined}
            >
              <button
                type="button"
                onClick={() => {
                  if (selected) {
                    return;
                  }

                  setSelection({
                    lineageId: option.id,
                    heightBandId: form.heightBandId || 'normal',
                    buildId: form.buildId || 'average',
                    hairColorId: '',
                    eyeColorId: '',
                    skinToneId: '',
                    backgroundId: ''
                  });
                }}
                className={`block h-full w-full text-left ${selected ? 'pb-20' : 'p-5'}`}
              >
                {art && (
                  <>
                    {selected ? (
                      <>
                        {lineagePrimaryImageUrl && (
                          <div
                            className="lineage-card-image-base absolute inset-0 transition-opacity duration-700"
                            style={{
                              backgroundImage: `url(${lineagePrimaryImageUrl})`,
                              opacity: showAlternateLineageArt && lineageSecondaryImageUrl ? 0 : 1
                            }}
                          />
                        )}
                        {lineageSecondaryImageUrl && (
                          <div
                            className="lineage-card-image-base absolute inset-0 transition-opacity duration-700"
                            style={{
                              backgroundImage: `url(${lineageSecondaryImageUrl})`,
                              backgroundPosition:
                                art.secondaryBackgroundPosition ?? art.backgroundPosition,
                              opacity: showAlternateLineageArt ? 1 : 0
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-no-repeat opacity-30 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-80"
                        style={{
                          backgroundImage: `url(${activeLineageImageUrl})`,
                          backgroundPosition: art.backgroundPosition ?? 'center center'
                        }}
                      />
                    )}
                    {!selected && (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(7,12,20,0.96)_0%,rgba(8,14,24,0.88)_38%,rgba(10,18,28,0.66)_66%,rgba(8,14,24,0.9)_100%)] transition duration-300 group-hover:opacity-65" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_28%)] transition duration-300 group-hover:opacity-90" />
                      </>
                    )}
                  </>
                )}
                {!selected && (
                  <div className="relative z-10 min-h-[12rem] pr-[7.1rem] transition duration-200 group-hover:opacity-0">
                    <div>
                      <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                        {option.label}
                      </div>
                      <div className="mt-4 text-sm leading-7 text-[color:var(--color-text-soft)]">
                        {option.description}
                      </div>
                    </div>
                  </div>
                )}
                {selected && (
                  <div className={`${lineageSelectionOverlayBase} lineage-card-overlay`}>
                    <div
                      className={`lineage-card-overlay-surface relative h-full w-full ${getSelectionOverlayGradientClass(
                        'lineage'
                      )}`}
                    >
                      <div className="flex h-full items-start px-5 py-6">
                        <div className="w-[40%] min-w-[17rem] pr-8">
                          <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                            {option.label}
                          </div>
                          <div className="mt-4 text-[13px] leading-7 text-[color:var(--color-text-soft)]">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </button>
              <div
                className={`absolute inset-y-0 right-0 z-20 flex w-[7rem] flex-col justify-between bg-[rgba(4,9,17,0.98)] px-2.5 pb-3 pt-1.5 ${
                  selected
                    ? 'border-l border-l-white/85'
                    : 'border-l border-l-[color:var(--color-border)]'
                }`}
              >
                <div className="space-y-px">
                  {statRows.map((row) => (
                    <div
                      key={`${option.id}.${row.key}.rail`}
                      className="grid min-h-[1.2rem] grid-cols-[minmax(0,1fr)_1.7rem] items-center gap-x-1 pb-0.5 pt-0 first:pt-0"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] leading-none text-[color:var(--color-muted-strong)]">
                        {row.key}
                      </div>
                      <div className="w-[1.7rem] justify-self-end text-right text-[11px] font-semibold tracking-[0.14em] leading-none text-[color:var(--color-text-strong)]">
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => advanceSelectionStep('lineage')}
                    className="rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(4,9,17,0.92)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-strong)] transition hover:bg-[rgba(8,16,28,0.98)]"
                  >
                    {getSelectionAdvanceLabel('lineage')}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (currentStepId === 'identity' && identityCatalog) {
    mainContent = (
      <div className="space-y-6">
        <div className={`${identitySectionWidthClass} flex flex-wrap items-end gap-3`}>
          <label className="min-w-0 flex-1">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Name
            </span>
            <input
              value={form.playerName}
              onChange={(event) => onChange({ playerName: event.target.value })}
              className={textInputClass}
            />
          </label>
          <div className="flex items-center gap-2.5 self-end pb-px">
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
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-creator-card-hover)]"
              title="Random name"
            >
              <Icon name="dice" className="h-5 w-5" />
            </button>
            {([
              {
                id: 'male',
                symbol: '\u2642',
                tip: 'Male. No attribute change.'
              },
              {
                id: 'female',
                symbol: '\u2640',
                tip: 'Female. +1 AGI, -1 STR.'
              }
            ] as const).map((sex) => (
              <Tooltip key={sex.id} content={<span>{sex.tip}</span>}>
                <button
                  type="button"
                  onClick={() => onChange({ sexId: sex.id })}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-4 text-xl font-semibold leading-none transition ${
                    form.sexId === sex.id
                      ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                      : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.sexId === sex.id ? activeOutlineStyle : undefined}
                  aria-label={sex.id === 'male' ? 'Male' : 'Female'}
                >
                  {sex.symbol}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Height
          </div>
          <div className={identityChoiceGridClass}>
            {identityCatalog.heightBands.map((option) => {
              const tradeoff = formatAttributeTradeoff(option.attributeAdjustments);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ heightBandId: option.id })}
                  className={`flex h-[70px] min-h-[70px] flex-col items-center justify-center rounded-[18px] border px-3 py-2 text-center transition ${
                    form.heightBandId === option.id
                      ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                      : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.heightBandId === option.id ? activeOutlineStyle : undefined}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
                    <div className="text-[15px] font-semibold leading-[1.02]">{option.label}</div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] text-[color:var(--color-text-soft)] ${
                        tradeoff.positive ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.positive ?? '\u00A0'}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] text-[color:var(--color-text-soft)] ${
                        tradeoff.negative ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.negative ?? '\u00A0'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Build
          </div>
          <div className={identityChoiceGridClass}>
            {identityCatalog.buildOptions.map((option) => {
              const tradeoff = formatAttributeTradeoff(option.attributeAdjustments);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ buildId: option.id })}
                  className={`flex h-[70px] min-h-[70px] flex-col items-center justify-center rounded-[18px] border px-3 py-2 text-center transition ${
                    form.buildId === option.id
                      ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                      : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.buildId === option.id ? activeOutlineStyle : undefined}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
                    <div className="text-[15px] font-semibold leading-[1.02]">{option.label}</div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] text-[color:var(--color-text-soft)] ${
                        tradeoff.positive ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.positive ?? '\u00A0'}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] text-[color:var(--color-text-soft)] ${
                        tradeoff.negative ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.negative ?? '\u00A0'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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
      <div className="grid gap-4">
        {continents.map((option) => {
          const art = getContinentCardArt(option.id);
          const selected = form.continentId === option.id;
          const continentImageUrl = selected
            ? art?.selectedImageUrl ?? art?.imageUrl
            : art?.imageUrl;
          const continentBackgroundPosition = selected
            ? art?.selectedBackgroundPosition ?? art?.backgroundPosition ?? 'center center'
            : art?.backgroundPosition ?? 'center center';

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'continent'
              )} group relative overflow-hidden ${selected ? 'min-h-[28rem]' : ''}`}
              style={selected ? activeOutlineStyle : undefined}
            >
              <button
                type="button"
                onClick={() => {
                  if (selected) {
                    return;
                  }

                  setSelection({
                    continentId: option.id,
                    regionId: '',
                    startingSettlementId: '',
                    backgroundId: ''
                  });
                }}
                className={`block h-full w-full text-left ${selected ? 'pb-20' : 'p-5'}`}
              >
                {art && (
                  <>
                    <div
                      className={`absolute bg-no-repeat transition duration-500 ease-out ${
                        selected
                          ? 'bottom-px right-px top-px opacity-100'
                          : 'inset-y-0 right-0 bg-cover opacity-28 group-hover:scale-[1.03] group-hover:opacity-80'
                      }`}
                      style={{
                        backgroundImage: `url(${continentImageUrl})`,
                        left: selected ? CONTINENT_SELECTION_IMAGE_LEFT : 0,
                        backgroundPosition: continentBackgroundPosition,
                        backgroundSize: selected ? 'cover' : undefined
                      }}
                    />
                    {!selected && (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(8,16,14,0.95)_0%,rgba(10,22,18,0.88)_42%,rgba(10,20,28,0.58)_72%,rgba(8,16,14,0.88)_100%)] transition duration-300 group-hover:opacity-65" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_28%)] transition duration-300 group-hover:opacity-90" />
                      </>
                    )}
                  </>
                )}
                {selected && (
                  <div
                    className={`${continentSelectionOverlayBase} bg-[rgba(8,16,14,0.96)]`}
                    style={{ width: CONTINENT_SELECTION_PANEL_WIDTH }}
                  >
                    <div className="flex h-full flex-col px-4 py-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                          {option.label}
                        </div>
                        <span
                          className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
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
                      <div className="mt-4 text-sm leading-7 text-[color:var(--color-text-soft)]">
                        {option.description}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`relative z-10 transition duration-200 ${
                    selected
                      ? 'min-h-[28rem] w-full'
                      : 'group-hover:opacity-0'
                  }`}
                >
                  {!selected && (
                    <>
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
                    </>
                  )}
                </div>
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('continent')}
                  className="absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(8,16,14,0.84)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-strong)] transition hover:bg-[rgba(10,22,18,0.94)]"
                >
                  {getSelectionAdvanceLabel('continent')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  } else if (currentStepId === 'region') {
    mainContent = regionSelectionLocked ? (
      <Card>
        <div className="space-y-4">
          <div className="text-sm leading-7 text-[color:var(--color-text-soft)]">
            Choose a continent before selecting a region.
          </div>
          <button
            type="button"
            onClick={() => goToStep('continent')}
            className={topPillButton}
          >
            Choose Continent
          </button>
        </div>
      </Card>
    ) : (
      <div className="grid gap-4">
        {regions.map((option) => {
          const art = getRegionCardArt(option.id);
          const selected = form.regionId === option.id;

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'region'
              )} group relative overflow-hidden ${selected ? 'min-h-[22rem]' : ''}`}
              style={selected ? activeOutlineStyle : undefined}
            >
              <button
                type="button"
                onClick={() => {
                  if (selected) {
                    return;
                  }

                  setSelection({
                    regionId: option.id,
                    startingSettlementId: '',
                    backgroundId: ''
                  });
                }}
                className={`block h-full w-full p-5 text-left ${selected ? 'pb-20' : ''}`}
              >
                <div
                  className={`absolute inset-0 transition duration-300 ${
                    art
                      ? selected
                        ? 'opacity-100'
                        : 'bg-cover bg-no-repeat opacity-24 group-hover:scale-[1.03] group-hover:opacity-82'
                      : 'opacity-0'
                  }`}
                  style={
                    art
                      ? {
                          backgroundImage: `url(${art.imageUrl})`,
                          backgroundPosition: art.backgroundPosition ?? 'center center'
                        }
                      : undefined
                  }
                />
                <div
                  className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.16),transparent_24%),linear-gradient(132deg,rgba(7,12,20,0.94),rgba(10,18,28,0.72))] transition duration-300 ${
                    art
                      ? selected
                        ? 'opacity-74 group-hover:opacity-42'
                        : 'opacity-70 group-hover:opacity-46'
                      : selected
                        ? 'opacity-92 group-hover:opacity-34'
                        : 'opacity-24 group-hover:opacity-72'
                  }`}
                />
                <div
                  className={`relative z-10 transition duration-200 ${
                    selected ? 'min-h-[22rem]' : 'group-hover:opacity-0'
                  }`}
                >
                  {!selected && (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                          {option.label}
                        </div>
                        {option.resourceIcons.length > 0 && (
                          <div className="flex flex-wrap justify-end gap-2">
                            {option.resourceIcons.map((resource) => {
                              const tone = getRegionResourceTone(resource.icon);

                              return (
                                <Tooltip
                                  key={`${option.id}.${resource.icon}`}
                                  content={
                                    <span className="block text-left">
                                      <span className="font-semibold text-slate-50">
                                        {resource.label}
                                      </span>
                                      <span className="mt-1 block text-slate-300">
                                        {resource.description}
                                      </span>
                                    </span>
                                  }
                                  panelClassName="w-56 max-w-[min(14rem,calc(100vw-2rem))] text-left leading-5"
                                >
                                  <span
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${tone.wrapper}`}
                                    aria-label={resource.label}
                                  >
                                    <Icon
                                      name={resource.icon}
                                      className={`h-[18px] w-[18px] ${tone.icon}`}
                                    />
                                  </span>
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div
                        className={`${insetBlockClass} mt-4 px-4 py-4 text-sm leading-7 text-[color:var(--color-text-soft)]`}
                      >
                        {option.descriptionParagraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${option.id}.paragraph.${paragraphIndex}`}
                            className={paragraphIndex === 0 ? '' : 'mt-3'}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {selected && (
                  <div className={selectionOverlayBase}>
                    <div
                      className={`h-full w-full px-5 py-5 pr-14 backdrop-blur-xl ${getSelectionOverlayGradientClass(
                        'region'
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                          {option.label}
                        </div>
                        {option.resourceIcons.length > 0 && (
                          <div className="flex flex-wrap justify-end gap-2">
                            {option.resourceIcons.map((resource) => {
                              const tone = getRegionResourceTone(resource.icon);

                              return (
                                <Tooltip
                                  key={`${option.id}.${resource.icon}.selected`}
                                  content={
                                    <span className="block text-left">
                                      <span className="font-semibold text-slate-50">
                                        {resource.label}
                                      </span>
                                      <span className="mt-1 block text-slate-300">
                                        {resource.description}
                                      </span>
                                    </span>
                                  }
                                  panelClassName="w-56 max-w-[min(14rem,calc(100vw-2rem))] text-left leading-5"
                                >
                                  <span
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${tone.wrapper}`}
                                    aria-label={resource.label}
                                  >
                                    <Icon
                                      name={resource.icon}
                                      className={`h-[18px] w-[18px] ${tone.icon}`}
                                    />
                                  </span>
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-sm leading-7 text-[color:var(--color-text-soft)]">
                        {option.descriptionParagraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${option.id}.paragraph.selected.${paragraphIndex}`}
                            className={paragraphIndex === 0 ? '' : 'mt-3'}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('region')}
                  className="absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(7,12,20,0.84)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-strong)] transition hover:bg-[rgba(10,18,28,0.94)]"
                >
                  {getSelectionAdvanceLabel('region')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  } else if (currentStepId === 'settlement') {
    mainContent = settlementSelectionLocked ? (
      <Card>
        <div className="space-y-4">
          <div className="text-sm leading-7 text-[color:var(--color-text-soft)]">
            Choose a region before selecting a settlement.
          </div>
          <button
            type="button"
            onClick={() => goToStep('region')}
            className={topPillButton}
          >
            Choose Region
          </button>
        </div>
      </Card>
    ) : (
      <div className="grid gap-4">
        {settlements.map((option) => {
          const selected = form.startingSettlementId === option.id;

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'settlement'
              )} group relative overflow-hidden ${selected ? 'min-h-[22rem]' : ''}`}
              style={selected ? activeOutlineStyle : undefined}
            >
              <button
                type="button"
                onClick={() => {
                  if (selected) {
                    return;
                  }

                  setSelection({
                    startingSettlementId: option.id,
                    backgroundId: ''
                  });
                }}
                className={`block h-full w-full p-5 text-left ${selected ? 'pb-20' : ''}`}
              >
                <div
                  className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(248,113,113,0.14),transparent_22%),linear-gradient(132deg,rgba(16,12,8,0.94),rgba(28,18,10,0.72))] transition duration-300 ${
                    selected ? 'opacity-92 group-hover:opacity-34' : 'opacity-24 group-hover:opacity-72'
                  }`}
                />
                <div
                  className={`relative z-10 transition duration-200 ${
                    selected ? 'min-h-[22rem]' : 'group-hover:opacity-0'
                  }`}
                >
                  {!selected && (
                    <>
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
                    </>
                  )}
                </div>
                {selected && (
                  <div className={selectionOverlayBase}>
                    <div
                      className={`h-full w-full px-5 py-5 pr-14 backdrop-blur-xl ${getSelectionOverlayGradientClass(
                        'settlement'
                      )}`}
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
                    </div>
                  </div>
                )}
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('settlement')}
                  className="absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] bg-[rgba(16,12,8,0.84)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-strong)] transition hover:bg-[rgba(28,18,10,0.94)]"
                >
                  {getSelectionAdvanceLabel('settlement')}
                </button>
              )}
            </div>
          );
        })}
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
            style={form.backgroundId === option.id ? activeOutlineStyle : undefined}
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
            style={form.classId === option.id ? activeOutlineStyle : undefined}
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
                  {row.attributeKey} - {row.label}
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
          <div className="grid gap-3 sm:grid-cols-2">
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
                  style={slot.id === form.saveSlotId ? activeOutlineStyle : undefined}
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
    <div ref={containerRef} className="h-screen overflow-auto pb-6">
      <div
        className="sticky top-0 z-30 border-b border-[color:var(--color-border)] shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(17, 23, 34, 0.84), rgba(8, 12, 19, 0.66)), radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(212, 173, 85, 0.08), transparent 28%)'
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
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
            <div className="flex items-center justify-self-end gap-2">
              <button
                type="button"
                onClick={() => setSummaryVisible((current) => !current)}
                aria-pressed={summaryVisible}
                className={`${topPillButton} min-w-[7.4rem] ${
                  summaryVisible
                    ? 'bg-amber-200/14 text-[color:var(--color-accent-contrast)]'
                    : ''
                }`}
                style={summaryVisible ? activeOutlineStyle : undefined}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={onToggleThemeMode}
                className={topButton}
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
        </div>
      </div>
      {notice && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <NoticeBanner notice={notice} onDismiss={onDismissNotice} />
        </div>
      )}
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-4 px-4 pt-4 sm:px-6">
        <div
          className={`grid flex-1 gap-4 ${
            summaryVisible
              ? 'xl:grid-cols-[144px_minmax(0,1fr)_204px]'
              : 'xl:grid-cols-[144px_minmax(0,1fr)]'
          }`}
        >
          <div className="sticky top-20 flex flex-col items-start gap-1">
            {CHARACTER_CREATION_STEPS.map((step, index) => {
              const dependencyLock = getStepDependencyLock(step.id);
              const disabled = index > maxUnlocked || dependencyLock.locked;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => !disabled && goToStep(step.id)}
                  disabled={disabled}
                  className="grid w-full grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[16px] px-0 py-1.5 text-left transition disabled:cursor-not-allowed"
                >
                  {(() => {
                    const locked = disabled;
                    const active = step.id === currentStepId;
                    const complete = validations[step.id].isValid;
                    const recentlyUnlocked = recentlyUnlockedStepIds.includes(step.id);
                    const circleClass = active
                      ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                      : locked
                        ? 'border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-muted)]'
                        : complete
                          ? 'border-emerald-300/70 bg-emerald-200/16 text-[color:var(--color-accent-contrast)] shadow-[0_0_18px_rgba(74,222,128,0.18)]'
                          : 'border-sky-300/55 bg-sky-200/12 text-[color:var(--color-accent-contrast)]';
                    const labelClass = locked
                      ? 'text-[color:var(--color-muted)]'
                      : 'text-[color:var(--color-text-soft)]';

                    return (
                      <>
                        <span
                          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[4px] text-sm font-semibold transition ${
                            recentlyUnlocked && !active && !locked
                              ? 'animate-pulse shadow-[0_0_0_1px_rgba(134,239,172,0.26),0_0_18px_rgba(134,239,172,0.22)]'
                              : ''
                          } ${circleClass}`}
                          style={active ? activeOutlineStyle : undefined}
                        >
                          {index + 1}
                          {locked && (
                            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] text-[color:var(--color-muted)]">
                              <Icon name="lock" className="h-3 w-3" />
                            </span>
                          )}
                        </span>
                        <span className={`text-[11px] uppercase tracking-[0.14em] ${labelClass}`}>
                          {step.label}
                        </span>
                      </>
                    );
                  })()}
                </button>
              );
            })}
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
          {summaryVisible && (
            <div className="space-y-4 xl:sticky xl:top-20">
              <Card accent="var(--color-world)">
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-semibold text-[color:var(--color-text-strong)]">
                      {preview.characterName}
                    </div>
                    <div className="mt-3 border-t-2 border-[color:var(--color-border-strong)] pt-3">
                      <div className="space-y-1.5">
                      {summaryIdentityRows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-b border-[color:var(--color-border)] pb-1 last:border-b-0 last:pb-0"
                        >
                          <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-muted-strong)]">
                            {row.label}
                          </div>
                          <div className="justify-self-end text-right text-sm text-[color:var(--color-text-soft)]">
                            {row.value}
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t-2 border-[color:var(--color-border-strong)] pt-3">
                    {renderStatList(preview.attributeMetrics, {
                      compact: true,
                      frame: false
                    })}
                  </div>
                  <div className="border-t-2 border-[color:var(--color-border-strong)] pt-3">
                    {renderResourceBars(preview.resourceMetrics, {
                      frame: false
                    })}
                  </div>
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
          )}
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
