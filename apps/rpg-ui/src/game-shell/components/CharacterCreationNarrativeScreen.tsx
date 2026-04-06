import { useEffect, useMemo, useRef, useState, type WheelEvent } from 'react';
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
  createDefaultStartingBundleChoiceSelections,
  generateRandomCharacterName,
  getAgeBandLabel,
  getAgeBandRangeLabel,
  getStartingBundleTemplate,
  getBuildLabel,
  getHeightBandLabel,
  getBackstoryOptionsForSelection,
  getLineageCardArt,
  getLineageIdentityCatalog,
  lineageOptions,
  startingBundleOptions
} from '../characterCreationCatalog.js';
import { buildCharacterCreationPreview } from '../newGameSnapshot.js';
import type { GameShellNotice, ManualSaveSlotId, SaveSlotSummary } from '../state.js';
import {
  getContinentCardArt,
  getRegionCardArt,
  getSettlementCardArt,
  getWorldContinentOptions,
  getWorldRegionOptions,
  getWorldSettlementOptions,
  resolveWorldSelection,
  type WorldRegionOption,
  type WorldRegionResourceIcon
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
const identitySectionDividerClass =
  `${identitySectionWidthClass} h-px bg-[color:var(--color-border)]/80`;

const identityPaletteGridClass =
  `${identitySectionWidthClass} grid grid-cols-9 items-start gap-x-1 gap-y-1.5`;

const continentSelectionOverlayBase =
  'absolute inset-y-0 left-0 z-10 flex items-stretch overflow-hidden rounded-l-[24px]';

const lineageSelectionOverlayBase =
  'absolute inset-y-0 left-0 right-[7rem] z-10 flex items-stretch overflow-hidden';

const CONTINENT_SELECTION_PANEL_WIDTH = 'clamp(16rem, 28%, 21rem)';
const CONTINENT_SELECTION_IMAGE_LEFT = CONTINENT_SELECTION_PANEL_WIDTH;
const REGION_SELECTION_PANEL_WIDTH = 'clamp(16rem, 26%, 21rem)';
const REGION_SELECTION_IMAGE_LEFT = REGION_SELECTION_PANEL_WIDTH;
const COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS = 'min-h-[14rem]';

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
  tone: 'lineage' | 'continent' | 'region' | 'settlement' | 'backstory' | 'starting_bundle' | 'slot'
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
    case 'starting_bundle':
      return `${creatorCardBase} border-orange-400/50 bg-[color:var(--color-creator-card-strong)]`;
    case 'slot':
      return `${creatorCardBase} border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card-strong)]`;
    default:
      return `${creatorCardBase} ${creatorCardUnselected}`;
  }
}

function getSelectionOverlayGradientClass(
  tone: 'lineage' | 'continent' | 'region' | 'settlement',
  themeMode: 'dark' | 'light'
): string {
  if (themeMode === 'light') {
    switch (tone) {
      case 'lineage':
        return 'bg-[linear-gradient(90deg,rgba(244,248,255,0.98)_0%,rgba(240,245,252,0.96)_24%,rgba(235,241,249,0.88)_42%,rgba(227,236,247,0.64)_60%,rgba(220,230,243,0.28)_80%,rgba(217,227,241,0.08)_92%,rgba(217,227,241,0)_100%)]';
      case 'continent':
        return 'bg-[linear-gradient(90deg,rgba(240,248,244,0.96)_0%,rgba(234,243,239,0.92)_56%,rgba(224,237,230,0.5)_80%,rgba(224,237,230,0.12)_92%,rgba(224,237,230,0)_100%)]';
      case 'region':
        return 'bg-[linear-gradient(90deg,rgba(244,248,255,0.97)_0%,rgba(236,242,251,0.92)_56%,rgba(226,235,247,0.52)_80%,rgba(226,235,247,0.12)_92%,rgba(226,235,247,0)_100%)]';
      case 'settlement':
        return 'bg-[linear-gradient(90deg,rgba(246,248,252,0.97)_0%,rgba(239,243,249,0.92)_56%,rgba(228,236,246,0.52)_80%,rgba(228,236,246,0.12)_92%,rgba(228,236,246,0)_100%)]';
      default:
        return '';
    }
  }

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

function getDifficultyBadgeClass(tone: 'success' | 'warning' | 'danger'): string {
  if (tone === 'success') {
    return 'border border-emerald-950/35 ring-1 ring-[color:var(--color-border-strong)] bg-emerald-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]';
  }

  if (tone === 'warning') {
    return 'border border-amber-950/30 ring-1 ring-[color:var(--color-border-strong)] bg-amber-400 text-slate-950 shadow-[0_10px_24px_rgba(245,158,11,0.22)]';
  }

  return 'border border-rose-950/35 ring-1 ring-[color:var(--color-border-strong)] bg-rose-500 text-white shadow-[0_10px_24px_rgba(244,63,94,0.24)]';
}

function getOpaqueDifficultyBadgeClass(tone: 'success' | 'warning' | 'danger'): string {
  return getDifficultyBadgeClass(tone);
}

function getRegionResourceTone(resourceTone: string | undefined): {
  wrapper: string;
  icon: string;
} {
  switch (resourceTone) {
    case 'timber':
    case 'tree':
      return {
        wrapper: 'border-emerald-300/25 bg-emerald-400/12',
        icon: 'text-emerald-100'
      };
    case 'fieldCrops':
    case 'grain':
      return {
        wrapper: 'border-amber-300/25 bg-amber-400/12',
        icon: 'text-amber-100'
      };
    case 'orchards':
    case 'fruit':
      return {
        wrapper: 'border-orange-300/25 bg-orange-400/12',
        icon: 'text-orange-100'
      };
    case 'gardenProduce':
    case 'vegetable':
      return {
        wrapper: 'border-lime-300/25 bg-lime-400/12',
        icon: 'text-lime-100'
      };
    case 'fishAndGame':
    case 'animal':
      return {
        wrapper: 'border-sky-300/25 bg-sky-400/12',
        icon: 'text-sky-100'
      };
    case 'livestock':
      return {
        wrapper: 'border-cyan-300/25 bg-cyan-400/12',
        icon: 'text-cyan-100'
      };
    case 'ore':
      return {
        wrapper: 'border-stone-300/25 bg-stone-300/12',
        icon: 'text-stone-100'
      };
    case 'stone':
      return {
        wrapper: 'border-slate-300/25 bg-slate-400/12',
        icon: 'text-slate-100'
      };
    default:
      return {
        wrapper: 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)]',
        icon: 'text-[color:var(--color-text-strong)]'
      };
  }
}

function handleContainedScrollWheel(event: WheelEvent<HTMLDivElement>) {
  const container = event.currentTarget;

  if (container.scrollHeight <= container.clientHeight) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  container.scrollTop += event.deltaY;
}

function routeContainedScrollWheel(
  event: WheelEvent<HTMLDivElement>,
  container: HTMLDivElement | null
) {
  if (!container || container.scrollHeight <= container.clientHeight) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  container.scrollTop += event.deltaY;
  container.focus({ preventScroll: true });
}

function renderRegionResourceIcons(
  option: {
    id: string;
    resourceIcons: WorldRegionResourceIcon[];
  },
  keySuffix: string,
  variant: 'preview' | 'selected',
  wrapperClassName = 'mt-3 flex flex-wrap gap-1'
) {
  if (option.resourceIcons.length === 0) {
    return null;
  }

  const imageSizeClass = variant === 'selected' ? 'h-[84px] w-[84px]' : 'h-[52px] w-[52px]';
  const iconSizeClass = variant === 'selected' ? 'h-[60px] w-[60px]' : 'h-[35px] w-[35px]';
  const visualClass =
    variant === 'selected' ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)]' : '';

  return (
    <div className={wrapperClassName}>
      {option.resourceIcons.map((resource) => {
        const tone = getRegionResourceTone(resource.tone ?? resource.icon);

        return (
          <Tooltip
            key={`${option.id}.${resource.label}.${keySuffix}`}
            content={
              <span className="block text-left">
                <span className="font-semibold text-[color:var(--color-text-strong)]">
                  {resource.label}
                </span>
                <span className="mt-1 block text-[color:var(--color-text-soft)]">
                  {resource.description}
                </span>
              </span>
            }
            align="start"
            panelClassName="w-56 max-w-[min(14rem,calc(100vw-2rem))] text-left leading-5"
            portal
            side="bottom"
          >
            <span
              className={`inline-flex ${imageSizeClass} cursor-help items-center justify-center`}
              aria-label={resource.label}
              tabIndex={0}
            >
              {resource.imageUrl ? (
                <img
                  src={resource.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className={`${imageSizeClass} ${visualClass} object-contain`}
                />
              ) : resource.icon ? (
                <Icon
                  name={resource.icon}
                  className={`${iconSizeClass} ${tone.icon} ${visualClass}`}
                />
              ) : null}
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
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

function pickRandomValue<T>(values: readonly T[]): T | null {
  if (values.length === 0) {
    return null;
  }

  return values[Math.floor(Math.random() * values.length)] ?? null;
}

function formatIdentityNarrativeSummary(
  form: Pick<
    CharacterCreationFormState,
    'sexId' | 'ageBandId' | 'heightBandId' | 'buildId'
  >,
  lineageLabel: string | null
): string {
  const heightLabel = (getHeightBandLabel(form.heightBandId) ?? 'unshaped').toLowerCase();
  const ageLabel = (getAgeBandLabel(form.ageBandId) ?? 'ageless').toLowerCase();
  const raceLabel = (lineageLabel ?? 'wanderer').toLowerCase();
  const sexLabel = (getSexSummaryLabel(form.sexId) ?? 'soul').toLowerCase();
  const buildLabel = (getBuildLabel(form.buildId) ?? 'unfinished').toLowerCase();
  const article = /^[aeiou]/i.test(heightLabel) ? 'An' : 'A';

  return `${article} ${heightLabel} ${ageLabel} ${raceLabel} ${sexLabel} with a ${buildLabel} build.`;
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
  const selectedRegionDescriptionRef = useRef<HTMLDivElement | null>(null);
  const selectedSettlementDescriptionRef = useRef<HTMLDivElement | null>(null);
  const [currentStepId, setCurrentStepId] =
    useState<CharacterCreationStepId>('lineage');
  const [showValidation, setShowValidation] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [showAlternateLineageArt, setShowAlternateLineageArt] = useState(false);
  const preview = buildCharacterCreationPreview(form);
  const identityCatalog = getLineageIdentityCatalog(form.lineageId);
  const selectedLineageArt = getLineageCardArt(form.lineageId);
  const activeOutlineColor =
    themeMode === 'dark' ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.82)';
  const activeOutlineShadow =
    themeMode === 'dark'
      ? '0 0 0 1px rgba(255,255,255,0.22), 0 0 22px rgba(255,255,255,0.16)'
      : '0 0 0 1px rgba(15,23,42,0.14), 0 0 18px rgba(96,165,250,0.18)';
  const activeOutlineStyle = {
    borderColor: activeOutlineColor,
    boxShadow: activeOutlineShadow
  };
  const imageCardTitleClass = 'text-[color:var(--color-text-strong)]';
  const imageCardBodyClass = 'text-[color:var(--color-text-soft)]';
  const imageCardMetaClass = 'text-[color:var(--color-muted-strong)]';
  const lightSurfaceButtonClass =
    'bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-creator-card-hover)]';
  const collapsedSettlementMetaBadgeClass =
    themeMode === 'dark'
      ? 'border-white/12 bg-[rgba(8,12,18,0.68)] text-[color:var(--color-text-strong)]'
      : 'border-slate-500/20 bg-[rgba(255,255,255,0.78)] text-[color:var(--color-text-strong)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]';
  const selectedSettlementMetaBadgeClass =
    themeMode === 'dark'
      ? 'border-white/12 bg-[rgba(12,18,28,0.84)] text-[color:var(--color-text-strong)]'
      : 'border-slate-500/25 bg-[rgba(248,250,252,0.94)] text-[color:var(--color-text-strong)] shadow-[0_10px_24px_rgba(15,23,42,0.1)]';
  const selectedSettlementArtFadeClass =
    themeMode === 'dark'
      ? 'bg-[linear-gradient(180deg,rgba(8,12,18,0.04)_0%,rgba(8,12,18,0.06)_46%,rgba(8,12,18,0.34)_74%,rgba(8,12,18,0.84)_100%)]'
      : 'bg-[linear-gradient(180deg,rgba(248,250,252,0.02)_0%,rgba(248,250,252,0.04)_46%,rgba(226,232,240,0.26)_74%,rgba(226,232,240,0.76)_100%)]';
  const selectedIdentityControlClass =
    themeMode === 'dark'
      ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
      : 'border-[color:var(--color-border-strong)] bg-[rgba(220,231,246,0.96)] text-[color:var(--color-text-strong)] shadow-[0_14px_30px_rgba(96,165,250,0.14)]';
  const selectedIdentityMetaClass =
    themeMode === 'dark'
      ? 'text-[color:var(--color-text-soft)]'
      : 'text-[color:var(--color-text-strong)]';
  const unselectedIdentityMetaClass =
    themeMode === 'dark'
      ? 'text-[color:var(--color-text-soft)]'
      : 'text-[color:var(--color-text-soft)]';
  const selectedContinentPanelClass = 'bg-[color:var(--color-creator-card-strong)]';
  const selectedRegionPanelSurfaceClass = 'bg-[color:var(--color-creator-card-strong)]';
  const selectedTextPanelEdgeClass =
    themeMode === 'dark'
      ? 'border-r border-white/15'
      : 'border-r border-slate-600/30';
  const lineageRailSurfaceClass = 'bg-[color:var(--color-creator-card-strong)]';
  const collapsedHoverLabelSurfaceClass =
    'pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center overflow-hidden rounded-l-[24px] opacity-0 -translate-x-6 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100';
  const collapsedStandardHoverLabelSurfaceClass = 'w-[15rem] max-w-[56%]';
  const collapsedHoverLabelTextClass =
    'w-full pl-5 pr-6 text-[24px] font-semibold leading-tight text-[color:var(--color-text-strong)]';
  const collapsedLineageHoverLabelSurfaceClass = 'w-[14.5rem] max-w-[calc(100%-7rem)]';
  const inactiveIdentitySwatchBorderColor =
    themeMode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(71,85,105,0.28)';
  const topBarBackground =
    themeMode === 'dark'
      ? 'linear-gradient(135deg, rgba(17, 23, 34, 0.84), rgba(8, 12, 19, 0.66)), radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(212, 173, 85, 0.08), transparent 28%)'
      : 'linear-gradient(135deg, rgba(248, 251, 255, 0.96), rgba(228, 236, 248, 0.9)), radial-gradient(circle at top left, rgba(96, 165, 250, 0.14), transparent 36%), radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.08), transparent 28%)';
  const continents = getWorldContinentOptions();
  const regions = getWorldRegionOptions(form.continentId);
  const settlements = getWorldSettlementOptions({
    continentId: form.continentId,
    regionId: form.regionId,
    backstoryId: form.backstoryId
  });
  const selectedWorld = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    backstoryId: form.backstoryId
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
  const summaryCharacterName = preview.characterName.trim() || 'Unnamed Wanderer';
  const summaryIdentityNarrative = formatIdentityNarrativeSummary(
    form,
    preview.lineageLabel
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

  const randomizeIdentitySelection = () => {
    if (!identityCatalog) {
      return;
    }

    const nextSex = pickRandomValue(['male', 'female'] as const) ?? 'male';
    const nextAgeBandId = pickRandomValue(identityCatalog.ageBands)?.id ?? 'prime_age';
    const nextHeightBandId = pickRandomValue(identityCatalog.heightBands)?.id ?? 'normal';
    const nextBuildId = pickRandomValue(identityCatalog.buildOptions)?.id ?? 'average';
    const nextSkinToneId =
      pickRandomValue(identityCatalog.skinToneOptions)?.id ?? form.skinToneId;
    const nextHairColorId =
      pickRandomValue(identityCatalog.hairColorOptions)?.id ?? form.hairColorId;
    const nextEyeColorId =
      pickRandomValue(identityCatalog.eyeColorOptions)?.id ?? form.eyeColorId;

    setSelection({
      playerName: generateRandomCharacterName(form.lineageId || 'lineage.human', nextSex),
      sexId: nextSex,
      ageBandId: nextAgeBandId,
      heightBandId: nextHeightBandId,
      buildId: nextBuildId,
      skinToneId: nextSkinToneId,
      hairColorId: nextHairColorId,
      eyeColorId: nextEyeColorId
    });
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
              ? themeMode === 'light'
                ? {
                    labelClass: 'text-rose-700',
                    fill:
                      'linear-gradient(90deg, rgba(248,113,113,0.9) 0%, rgba(251,191,191,0.95) 100%)',
                    shadow: '0 0 18px rgba(248,113,113,0.24)'
                  }
                : {
                    labelClass: 'text-rose-200/85',
                    fill:
                      'linear-gradient(90deg, rgba(248,113,113,0.9) 0%, rgba(251,191,191,0.95) 100%)',
                    shadow: '0 0 18px rgba(248,113,113,0.24)'
                  }
              : value.id === 'mp'
                ? themeMode === 'light'
                  ? {
                      labelClass: 'text-sky-700',
                      fill:
                        'linear-gradient(90deg, rgba(96,165,250,0.9) 0%, rgba(191,219,254,0.95) 100%)',
                      shadow: '0 0 18px rgba(96,165,250,0.24)'
                    }
                  : {
                      labelClass: 'text-sky-200/85',
                      fill:
                        'linear-gradient(90deg, rgba(96,165,250,0.9) 0%, rgba(191,219,254,0.95) 100%)',
                      shadow: '0 0 18px rgba(96,165,250,0.24)'
                    }
                : themeMode === 'light'
                  ? {
                      labelClass: 'text-emerald-700',
                      fill:
                        'linear-gradient(90deg, rgba(74,222,128,0.88) 0%, rgba(209,250,229,0.95) 100%)',
                      shadow: '0 0 18px rgba(74,222,128,0.24)'
                    }
                  : {
                      labelClass: 'text-emerald-200/85',
                      fill:
                        'linear-gradient(90deg, rgba(74,222,128,0.88) 0%, rgba(209,250,229,0.95) 100%)',
                      shadow: '0 0 18px rgba(74,222,128,0.24)'
                    };
          const lightModeLabelStyle =
            themeMode === 'light'
              ? {
                  textShadow:
                    '0 1px 0 rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.35)'
                }
              : undefined;

          return (
            <div key={value.id}>
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${tone.labelClass}`}
                style={lightModeLabelStyle}
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
                  <span className="font-semibold text-[color:var(--color-text-strong)]">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[color:var(--color-text-soft)]">
                    {option.description}
                  </span>
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
                    : option.swatch?.border ?? inactiveIdentitySwatchBorderColor,
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
              )} group relative overflow-hidden ${
                selected
                  ? 'lineage-card-selected min-h-[30rem]'
                  : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
              }`}
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
                    ageBandId: form.ageBandId || 'prime_age',
                    heightBandId: form.heightBandId || 'normal',
                    buildId: form.buildId || 'average',
                    hairColorId: '',
                    eyeColorId: '',
                    skinToneId: ''
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
                      <>
                        <div
                          className="selector-card-ambient-art absolute inset-0 opacity-28 transition duration-500 ease-out group-hover:opacity-36"
                          style={{
                            backgroundImage: `url(${activeLineageImageUrl})`,
                            backgroundPosition: art.backgroundPosition ?? 'center center'
                          }}
                        />
                        <div
                          className="selector-card-width-art absolute inset-0 opacity-100 transition duration-500 ease-out group-hover:scale-[1.01]"
                          style={{
                            backgroundImage: `url(${activeLineageImageUrl})`,
                            backgroundPosition: art.backgroundPosition ?? 'center center'
                          }}
                        />
                      </>
                    )}
                    {!selected && (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.18)_100%)] transition duration-300 group-hover:opacity-90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.1),transparent_28%)] transition duration-300 group-hover:opacity-95" />
                      </>
                    )}
                  </>
                )}
                {!selected && (
                  <div
                    className={`${collapsedHoverLabelSurfaceClass} ${collapsedLineageHoverLabelSurfaceClass} ${getSelectionOverlayGradientClass(
                      'lineage',
                      themeMode
                    )}`}
                  >
                    <div className={collapsedHoverLabelTextClass}>
                      {option.label}
                    </div>
                  </div>
                )}
                {selected && (
                  <div className={`${lineageSelectionOverlayBase} lineage-card-overlay`}>
                    <div
                      className={`lineage-card-overlay-surface relative h-full w-full ${getSelectionOverlayGradientClass(
                        'lineage',
                        themeMode
                      )}`}
                    >
                      <div className="flex h-full items-start px-5 py-6">
                        <div className="w-[40%] min-w-[17rem] pr-8">
                          <div className={`text-xl font-semibold ${imageCardTitleClass}`}>
                            {option.label}
                          </div>
                          <div className={`mt-4 text-[13px] leading-7 ${imageCardBodyClass}`}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </button>
              <div
                className={`absolute inset-y-0 right-0 z-20 flex w-[7rem] flex-col justify-between ${lineageRailSurfaceClass} ${
                  selected ? 'px-2 pb-2.5 pt-1' : 'px-2.5 pb-3 pt-1.5'
                } ${
                  selected
                    ? themeMode === 'dark'
                      ? 'border-l border-l-white/85'
                      : 'border-l border-l-[color:var(--color-border-strong)]'
                    : 'border-l border-l-[color:var(--color-border)]'
                }`}
              >
                <div className={selected ? 'space-y-0.5' : 'space-y-px'}>
                  {statRows.map((row) => (
                    <div
                      key={`${option.id}.${row.key}.rail`}
                      className={`grid items-center first:pt-0 ${
                        selected
                          ? 'min-h-[1.35rem] grid-cols-[minmax(0,1fr)_1.95rem] gap-x-0.5 py-px'
                          : 'min-h-[1.2rem] grid-cols-[minmax(0,1fr)_1.7rem] gap-x-1 pb-0.5 pt-0'
                      }`}
                    >
                      <div
                        className={`font-semibold uppercase leading-none text-[color:var(--color-muted-strong)] ${
                          selected ? 'text-[14px] tracking-[0.1em]' : 'text-[11px] tracking-[0.14em]'
                        }`}
                      >
                        {row.key}
                      </div>
                      <div
                        className={`justify-self-end text-right font-semibold leading-none text-[color:var(--color-text-strong)] ${
                          selected
                            ? 'w-[1.95rem] text-[14px] tracking-[0.1em]'
                            : 'w-[1.7rem] text-[11px] tracking-[0.14em]'
                        }`}
                      >
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => advanceSelectionStep('lineage')}
                    className={`rounded-full border border-[color:var(--color-border-strong)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      themeMode === 'dark'
                        ? 'bg-[rgba(4,9,17,0.92)] text-[color:var(--color-text-strong)] hover:bg-[rgba(8,16,28,0.98)]'
                        : lightSurfaceButtonClass
                    }`}
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
      <div className="space-y-3">
        <div className={`${identityChoiceGridClass} justify-items-center`}>
          <div className="col-start-2">
            <button
              type="button"
              onClick={randomizeIdentitySelection}
              className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-creator-card-hover)]"
              title="Randomize name, sex, age, height, build, and coloration"
              aria-label="Randomize name, sex, age, height, build, and coloration"
            >
              <Icon name="dice" className="h-14 w-14" />
            </button>
          </div>
        </div>
        <div className={identitySectionDividerClass} />
        <div className={`${identitySectionWidthClass} flex flex-wrap items-end gap-3`}>
          <label className="min-w-0 flex-1">
            <input
              value={form.playerName}
              onChange={(event) => onChange({ playerName: event.target.value })}
              placeholder="Name"
              aria-label="Character name"
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
                      ? selectedIdentityControlClass
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
        <div className={identitySectionDividerClass} />
        <div className="space-y-2">
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
                      ? selectedIdentityControlClass
                      : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.heightBandId === option.id ? activeOutlineStyle : undefined}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
                    <div className="text-[15px] font-semibold leading-[1.02]">{option.label}</div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.heightBandId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
                        tradeoff.positive ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.positive ?? '\u00A0'}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.heightBandId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
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
        <div className={identitySectionDividerClass} />
        <div className="space-y-2">
          <div className={identityChoiceGridClass}>
            {identityCatalog.ageBands.map((option) => {
              const tradeoff = formatAttributeTradeoff(option.attributeAdjustments);
              const ageRangeLabel =
                getAgeBandRangeLabel(form.lineageId, form.sexId, option.id) ?? 'Age range pending';

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ ageBandId: option.id })}
                  className={`flex h-[92px] min-h-[92px] flex-col items-center justify-center rounded-[18px] border px-3 py-2 text-center transition ${
                    form.ageBandId === option.id
                      ? selectedIdentityControlClass
                      : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.ageBandId === option.id ? activeOutlineStyle : undefined}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
                    <div className="text-[15px] font-semibold leading-[1.02]">{option.label}</div>
                    <div
                      className={`text-[10px] tracking-[0.08em] leading-[1.05] ${
                        form.ageBandId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      }`}
                    >
                      {ageRangeLabel}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.ageBandId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
                        tradeoff.positive ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.positive ?? '\u00A0'}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.ageBandId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
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
        <div className={identitySectionDividerClass} />
        <div className="space-y-2">
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
                      ? selectedIdentityControlClass
                      : 'border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] text-[color:var(--color-text-strong)]'
                  }`}
                  style={form.buildId === option.id ? activeOutlineStyle : undefined}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-center">
                    <div className="text-[15px] font-semibold leading-[1.02]">{option.label}</div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.buildId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
                        tradeoff.positive ? '' : 'opacity-0'
                      }`}
                    >
                      {tradeoff.positive ?? '\u00A0'}
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-[0.12em] leading-[1.02] ${
                        form.buildId === option.id
                          ? selectedIdentityMetaClass
                          : unselectedIdentityMetaClass
                      } ${
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
            ? art?.selectedBackgroundPosition ?? 'right bottom'
            : art?.backgroundPosition ?? 'center center';

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'continent'
              )} group relative overflow-hidden ${
                selected ? 'min-h-[28rem]' : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
              }`}
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
                    startingSettlementId: ''
                  });
                }}
                className={`block h-full w-full text-left ${selected ? 'pb-20' : ''}`}
              >
                {art && (
                  <>
                    {!selected && (
                      <div
                        className="selector-card-ambient-art absolute inset-0 opacity-26 transition duration-500 ease-out group-hover:opacity-34"
                        style={{
                          backgroundImage: `url(${continentImageUrl})`,
                          backgroundPosition: continentBackgroundPosition
                        }}
                      />
                    )}
                    <div
                      className={`absolute transition duration-500 ease-out ${
                        selected ? 'selector-card-fitted-art' : 'selector-card-width-art'
                      } ${
                        selected
                          ? 'bottom-px right-px top-px opacity-100'
                          : 'inset-0 opacity-100 group-hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundImage: `url(${continentImageUrl})`,
                        left: selected ? CONTINENT_SELECTION_IMAGE_LEFT : 0,
                        backgroundPosition: continentBackgroundPosition
                      }}
                    />
                    {!selected && (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.14)_100%)] transition duration-300 group-hover:opacity-90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_28%)] transition duration-300 group-hover:opacity-95" />
                      </>
                    )}
                  </>
                )}
                {selected && (
                  <div
                    className={`${continentSelectionOverlayBase} ${selectedContinentPanelClass} ${selectedTextPanelEdgeClass}`}
                    style={{ width: CONTINENT_SELECTION_PANEL_WIDTH }}
                  >
                    <div className="flex h-full flex-col px-5 py-5">
                      <div className="text-[1.35rem] font-semibold leading-tight text-[color:var(--color-text-strong)]">
                        {option.label}
                      </div>
                      <div className="mt-4 text-[15px] leading-7 text-[color:var(--color-text-soft)]">
                        {option.description}
                      </div>
                    </div>
                  </div>
                )}
                <span
                  className={`absolute right-5 top-5 z-20 inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                    selected
                      ? getOpaqueDifficultyBadgeClass(option.difficultyTone)
                      : getDifficultyBadgeClass(option.difficultyTone)
                  }`}
                >
                  {option.difficultyLabel}
                </span>
                <div
                  className={`relative z-10 transition duration-200 ${
                    selected
                      ? 'min-h-[28rem] w-full'
                      : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
                  }`}
                >
                  {!selected && (
                    <div
                      className={`${collapsedHoverLabelSurfaceClass} ${collapsedStandardHoverLabelSurfaceClass} ${getSelectionOverlayGradientClass(
                        'continent',
                        themeMode
                      )}`}
                    >
                      <div className={collapsedHoverLabelTextClass}>
                        {option.label}
                      </div>
                    </div>
                  )}
                </div>
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('continent')}
                  className={`absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    themeMode === 'dark'
                      ? 'bg-[rgba(8,16,14,0.84)] text-[color:var(--color-text-strong)] hover:bg-[rgba(10,22,18,0.94)]'
                      : lightSurfaceButtonClass
                  }`}
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
          const regionBackgroundPosition = art?.backgroundPosition ?? 'center center';
          const regionSelectedBackgroundPosition =
            art?.selectedBackgroundPosition ?? 'right center';
          const selectedRegionPanelClass = art
            ? 'absolute inset-y-0 left-0 z-10 flex items-stretch overflow-hidden rounded-l-[24px]'
            : 'absolute inset-px z-10 flex items-stretch rounded-[23px]';
          const regionCardContent = (
            <>
              {art && (
                <>
                  {!selected && (
                    <div
                      className="selector-card-ambient-art absolute inset-0 opacity-24 transition duration-500 ease-out group-hover:opacity-34"
                      style={{
                        backgroundImage: `url(${art.imageUrl})`,
                        backgroundPosition: regionBackgroundPosition
                      }}
                    />
                  )}
                  <div
                    className={`absolute transition duration-500 ease-out ${
                      selected ? 'selector-card-fitted-art' : 'selector-card-width-art'
                    } ${
                      selected
                        ? 'bottom-px right-px top-px opacity-100'
                        : 'inset-0 opacity-100 group-hover:scale-[1.01]'
                    }`}
                    style={{
                      backgroundImage: `url(${art.imageUrl})`,
                      left: selected ? REGION_SELECTION_IMAGE_LEFT : 0,
                      backgroundPosition: selected
                        ? regionSelectedBackgroundPosition
                        : regionBackgroundPosition
                    }}
                  />
                  {!selected && (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.14)_100%)] transition duration-300 group-hover:opacity-90" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.16),transparent_24%)] transition duration-300 group-hover:opacity-94" />
                    </>
                  )}
                </>
              )}
              {selected && (
                <>
                  <div
                    className={`${selectedRegionPanelClass} ${selectedRegionPanelSurfaceClass} ${
                      art ? selectedTextPanelEdgeClass : ''
                    }`}
                    style={art ? { width: REGION_SELECTION_PANEL_WIDTH } : undefined}
                    onMouseEnter={() => {
                      selectedRegionDescriptionRef.current?.focus({ preventScroll: true });
                    }}
                    onWheelCapture={(event) => {
                      routeContainedScrollWheel(event, selectedRegionDescriptionRef.current);
                    }}
                  >
                    <div className="flex h-full min-h-0 flex-col px-4 py-5">
                      <div className="text-xl font-semibold leading-tight text-[color:var(--color-text-strong)]">
                        {option.label}
                      </div>
                      {(!art || option.resourceIcons.length === 0) &&
                        renderRegionResourceIcons(
                          option,
                          'selected',
                          'selected',
                          'mt-2 -mx-2.5 flex flex-nowrap items-center gap-0'
                        )}
                      <div
                        className="region-description-scroll mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain text-sm leading-7 text-[color:var(--color-text-soft)] outline-none"
                        ref={selectedRegionDescriptionRef}
                        tabIndex={0}
                        aria-label={`${option.label} description`}
                        onMouseEnter={(event) => {
                          event.currentTarget.focus({ preventScroll: true });
                        }}
                        onWheelCapture={handleContainedScrollWheel}
                      >
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
                  {art && option.resourceIcons.length > 0 && (
                    <div
                      className="absolute top-4 z-20"
                      style={{ left: `calc(${REGION_SELECTION_IMAGE_LEFT} + 0.75rem)` }}
                    >
                      {renderRegionResourceIcons(
                        option,
                        'selected-image',
                        'selected',
                        'flex flex-nowrap items-center gap-0'
                      )}
                    </div>
                  )}
                  <span
                    className={`absolute right-4 top-4 z-20 inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${getOpaqueDifficultyBadgeClass(
                      option.difficultyTone
                    )}`}
                  >
                    {option.difficultyLabel}
                  </span>
                </>
              )}
              <div
                className={`relative z-10 transition duration-200 ${
                  selected
                    ? 'pointer-events-none min-h-[28rem] w-full'
                    : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
                }`}
              >
                {!selected && (
                  <>
                    {option.resourceIcons.length > 0 && (
                      <div className="absolute left-4 top-3 z-20">
                        {renderRegionResourceIcons(
                          option,
                          'preview',
                          'preview',
                          'flex shrink-0 flex-nowrap items-center gap-0.5'
                        )}
                      </div>
                    )}
                    <span
                      className={`absolute right-4 top-4 z-20 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${getDifficultyBadgeClass(
                        option.difficultyTone
                      )}`}
                    >
                      {option.difficultyLabel}
                    </span>
                    <div
                      className={`${collapsedHoverLabelSurfaceClass} ${collapsedStandardHoverLabelSurfaceClass} ${getSelectionOverlayGradientClass(
                        'region',
                        themeMode
                      )}`}
                    >
                      <div className={collapsedHoverLabelTextClass}>
                        {option.label}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          );

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'region'
              )} group relative overflow-hidden ${
                selected ? 'min-h-[28rem]' : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
              }`}
              style={selected ? activeOutlineStyle : undefined}
            >
              {selected ? (
                <div className="relative h-full w-full pb-20 text-left">{regionCardContent}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelection({
                      regionId: option.id,
                      startingSettlementId: ''
                    });
                  }}
                  className="block h-full w-full text-left"
                >
                  {regionCardContent}
                </button>
              )}
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('region')}
                  className={`absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    themeMode === 'dark'
                      ? 'bg-[rgba(7,12,20,0.84)] text-[color:var(--color-text-strong)] hover:bg-[rgba(10,18,28,0.94)]'
                      : lightSurfaceButtonClass
                  }`}
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
          const art = getSettlementCardArt(option.id);
          const selected = form.startingSettlementId === option.id;
          const settlementBackgroundPosition = art?.backgroundPosition ?? 'center center';
          const settlementSelectedBackgroundPosition =
            art?.selectedBackgroundPosition ?? 'center center';
          const selectedSettlementPanelClass = art
            ? 'absolute inset-y-0 left-0 z-10 flex items-stretch overflow-hidden rounded-l-[24px]'
            : 'absolute inset-px z-10 overflow-hidden rounded-[23px]';
          const settlementCardContent = (
            <>
              {art ? (
                <>
                  {!selected && (
                    <div
                      className="selector-card-ambient-art absolute inset-0 opacity-24 transition duration-500 ease-out group-hover:opacity-34"
                      style={{
                        backgroundImage: `url(${art.imageUrl})`,
                        backgroundPosition: settlementBackgroundPosition,
                        backgroundSize: art.backgroundSize
                      }}
                    />
                  )}
                  <div
                    className={`absolute transition duration-500 ease-out ${
                      selected ? 'selector-card-fitted-art' : 'selector-card-width-art'
                    } ${
                      selected
                        ? 'bottom-px right-px top-px opacity-100'
                        : 'inset-0 opacity-100 group-hover:scale-[1.01]'
                    }`}
                    style={{
                      backgroundImage: `url(${art.imageUrl})`,
                      left: selected ? REGION_SELECTION_IMAGE_LEFT : 0,
                      backgroundPosition: selected
                        ? settlementSelectedBackgroundPosition
                        : settlementBackgroundPosition,
                      backgroundSize: selected
                        ? art.selectedBackgroundSize
                        : art.backgroundSize
                    }}
                  />
                  {!selected && (
                    <>
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.14)_100%)] transition duration-300 group-hover:opacity-90" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(248,113,113,0.14),transparent_24%)] transition duration-300 group-hover:opacity-94" />
                    </>
                  )}
                  {selected && (
                    <div
                      className={`absolute bottom-px right-px top-px z-[1] ${selectedSettlementArtFadeClass}`}
                      style={{ left: REGION_SELECTION_IMAGE_LEFT }}
                    />
                  )}
                </>
              ) : (
                <div
                  className={`absolute inset-0 transition duration-300 ${
                    themeMode === 'dark'
                      ? 'bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(248,113,113,0.14),transparent_22%),linear-gradient(132deg,rgba(16,12,8,0.94),rgba(28,18,10,0.72))]'
                      : 'bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(129,140,248,0.14),transparent_22%),linear-gradient(132deg,rgba(236,242,250,0.94),rgba(217,226,240,0.78))]'
                  } ${
                    selected ? 'opacity-92' : 'opacity-26 group-hover:opacity-76'
                  }`}
                />
              )}
              {selected && (
                <div
                  className={`${selectedSettlementPanelClass} ${selectedRegionPanelSurfaceClass} ${
                    art ? selectedTextPanelEdgeClass : ''
                  }`}
                  style={art ? { width: REGION_SELECTION_PANEL_WIDTH } : undefined}
                  onMouseEnter={() => {
                    selectedSettlementDescriptionRef.current?.focus({
                      preventScroll: true
                    });
                  }}
                  onWheelCapture={(event) => {
                    routeContainedScrollWheel(
                      event,
                      selectedSettlementDescriptionRef.current
                    );
                  }}
                >
                  <div className="flex h-full min-h-[28rem] flex-col px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`text-xl font-semibold ${imageCardTitleClass}`}>
                          {option.label}
                        </div>
                        <div
                          className={`mt-1 text-[11px] uppercase tracking-[0.16em] ${imageCardMetaClass}`}
                        >
                          {option.settlementType} / {option.tradeRole} /{' '}
                          {option.developmentLevel}
                        </div>
                      </div>
                      {!art && (
                        <span
                          className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${selectedSettlementMetaBadgeClass}`}
                        >
                          Pop {option.populationSize}
                        </span>
                      )}
                    </div>
                    {(!art || option.resourceIcons.length === 0) &&
                      renderRegionResourceIcons(
                        option,
                        'selected',
                        'selected',
                        'mt-2 -mx-2.5 flex flex-nowrap items-center gap-0'
                      )}
                    <div
                      className={`mt-4 min-h-0 flex-1 space-y-4 text-sm leading-7 text-[color:var(--color-text-soft)] ${
                        art
                          ? 'region-description-scroll overflow-y-auto overscroll-contain pr-1 outline-none'
                          : 'overflow-y-auto overscroll-contain pr-1'
                      }`}
                      ref={selectedSettlementDescriptionRef}
                      tabIndex={0}
                      aria-label={`${option.label} description`}
                      onMouseEnter={(event) => {
                        event.currentTarget.focus({ preventScroll: true });
                      }}
                      onWheelCapture={handleContainedScrollWheel}
                    >
                      <p>{option.description}</p>
                      <div
                        className={`grid gap-2 text-[11px] uppercase tracking-[0.16em] ${imageCardMetaClass}`}
                      >
                        <div>{option.dominantIndustries.join(' / ')}</div>
                        <div>{option.keyResources.join(' / ')}</div>
                      </div>
                      <div
                        className={`${insetBlockClass} px-3 py-3 text-sm leading-7 text-[color:var(--color-text-soft)]`}
                      >
                        <p>{option.landRestriction.propertyNarrative}</p>
                        <p className="mt-2 text-[color:var(--color-text-strong)]">
                          {option.landRestriction.currentStanding}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {selected && art && option.resourceIcons.length > 0 && (
                <div
                  className="absolute top-4 z-20"
                  style={{ left: `calc(${REGION_SELECTION_IMAGE_LEFT} + 0.75rem)` }}
                >
                  {renderRegionResourceIcons(
                    option,
                    'selected-image',
                    'selected',
                    'flex flex-nowrap items-center gap-0'
                  )}
                </div>
              )}
              {selected && art && (
                <span
                  className={`absolute right-4 top-4 z-20 inline-flex shrink-0 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${selectedSettlementMetaBadgeClass}`}
                >
                  Pop {option.populationSize}
                </span>
              )}
              <div
                className={`relative z-10 transition duration-200 ${
                  selected
                    ? 'pointer-events-none min-h-[28rem] w-full'
                    : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
                }`}
              >
                {!selected && (
                  <>
                    {option.resourceIcons.length > 0 && (
                      <div className="absolute left-4 top-3 z-20">
                        {renderRegionResourceIcons(
                          option,
                          'preview',
                          'preview',
                          'flex shrink-0 flex-nowrap items-center gap-0.5'
                        )}
                      </div>
                    )}
                    <span
                      className={`absolute right-4 top-4 z-20 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] backdrop-blur-sm ${collapsedSettlementMetaBadgeClass}`}
                    >
                      Pop {option.populationSize}
                    </span>
                    <div
                      className={`${collapsedHoverLabelSurfaceClass} ${collapsedStandardHoverLabelSurfaceClass} ${getSelectionOverlayGradientClass(
                        'settlement',
                        themeMode
                      )}`}
                    >
                      <div className={collapsedHoverLabelTextClass}>
                        {option.label}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          );

          return (
            <div
              key={option.id}
              className={`${getSelectableCardClass(
                selected,
                'settlement'
              )} group relative overflow-hidden ${
                selected ? 'min-h-[28rem]' : COLLAPSED_SHOWCASE_CARD_MIN_HEIGHT_CLASS
              }`}
              style={selected ? activeOutlineStyle : undefined}
            >
              {selected ? (
                <div className="relative h-full w-full pb-20 text-left">
                  {settlementCardContent}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelection({ startingSettlementId: option.id });
                  }}
                  className="block h-full w-full text-left"
                >
                  {settlementCardContent}
                </button>
              )}
              {selected && (
                <button
                  type="button"
                  onClick={() => advanceSelectionStep('settlement')}
                  className={`absolute bottom-5 right-5 z-20 rounded-full border border-[color:var(--color-border-strong)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    themeMode === 'dark'
                      ? 'bg-[rgba(16,12,8,0.84)] text-[color:var(--color-text-strong)] hover:bg-[rgba(28,18,10,0.94)]'
                      : lightSurfaceButtonClass
                  }`}
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
              form.backstoryId === option.id,
              'backstory'
            )}
            style={form.backstoryId === option.id ? activeOutlineStyle : undefined}
          >
            <button
              type="button"
              onClick={() =>
                choose('backstory', form.backstoryId, option.id, {
                  backstoryId: option.id
                })
              }
              className="w-full px-5 py-4 text-left"
            >
              <div className="text-lg font-semibold text-[color:var(--color-text-strong)]">
                {option.label}
              </div>
              <div className="mt-2 text-sm leading-7 text-[color:var(--color-text-soft)]">
                {option.summaryText}
              </div>
            </button>
            {form.backstoryId === option.id && (
              <div className="border-t border-[color:var(--color-border)] px-5 py-4">
                <div className="text-sm leading-7 text-[color:var(--color-text-soft)]">
                  {option.detailText}
                </div>
                <div className="mt-4 space-y-3">
                  {option.startingSkillLabels.length > 0 && (
                    <div>{renderTags('Starting Skills', option.startingSkillLabels)}</div>
                  )}
                  {option.startingKnowledgeLabels.length > 0 && (
                    <div>{renderTags('Starting Knowledge', option.startingKnowledgeLabels)}</div>
                  )}
                  {option.startingAbilityLabels.length > 0 && (
                    <div>{renderTags('Starting Ability', option.startingAbilityLabels)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else if (currentStepId === 'starting_bundle') {
    mainContent = (
      <div className="grid gap-4 xl:grid-cols-2">
        {startingBundleOptions.map((option) => {
          const bundle = getStartingBundleTemplate(option.id);

          return (
                <div
                  key={option.id}
                  className={getSelectableCardClass(
                    form.startingBundleId === option.id,
                    'starting_bundle'
                  )}
                  style={form.startingBundleId === option.id ? activeOutlineStyle : undefined}
                >
                  <button
                    type="button"
                    onClick={() =>
                      choose('starting_bundle', form.startingBundleId, option.id, {
                        startingBundleId: option.id,
                        startingBundleChoiceSelections:
                          createDefaultStartingBundleChoiceSelections(option.id)
                      })
                    }
                    className="w-full px-5 py-5 text-left"
                  >
                    <div className="text-xl font-semibold text-[color:var(--color-text-strong)]">
                      {option.label}
                    </div>
                    <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
                      {option.description}
                    </div>
                    <div className="mt-4 space-y-3">
                      {bundle.fixedItemLabels.length > 0 && (
                        <div>{renderTags('Fixed Items', bundle.fixedItemLabels)}</div>
                      )}
                      {bundle.choiceGroups.length > 0 &&
                        bundle.choiceGroups.map((group) => (
                          <div key={group.id}>{renderTags(group.label, group.optionLabels)}</div>
                        ))}
                      <div>
                        {renderTags('Funds', [
                          `${bundle.startingCurrency.gold}g ${bundle.startingCurrency.silver}s ${bundle.startingCurrency.copper}c`
                        ])}
                      </div>
                    </div>
                  </button>
                  {form.startingBundleId === option.id && bundle.choiceGroups.length > 0 && (
                    <div className="border-t border-[color:var(--color-border)] px-5 py-4">
                      <div className="space-y-4">
                        {bundle.choiceGroups.map((group) => (
                          <div key={group.id} className="space-y-2">
                            <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                              {group.label}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.options.map((stack, index) => {
                                const selectedChoice =
                                  form.startingBundleChoiceSelections[group.id] === stack.itemId;
                                const optionLabel =
                                  group.optionLabels[index] ?? stack.itemKey;

                                return (
                                  <button
                                    key={`${group.id}.${stack.itemId}`}
                                    type="button"
                                    onClick={() =>
                                      setSelection({
                                        startingBundleChoiceSelections: {
                                          ...form.startingBundleChoiceSelections,
                                          [group.id]: stack.itemId
                                        }
                                      })
                                    }
                                    className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                                      selectedChoice
                                        ? selectedIdentityControlClass
                                        : `border-[color:var(--color-border)] bg-[color:var(--color-creator-card)] ${
                                            themeMode === 'dark'
                                              ? 'text-[color:var(--color-text-soft)] hover:bg-[color:var(--color-creator-card-hover)]'
                                              : 'text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-creator-card-hover)]'
                                          }`
                                    }`}
                                  >
                                    {optionLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                        <div className="min-w-0 text-sm text-[color:var(--color-text-soft)]">
                          {row.inlineEffect}
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
        className={`sticky top-0 z-30 border-b border-[color:var(--color-border)] backdrop-blur-2xl ${
          themeMode === 'dark'
            ? 'shadow-[0_18px_48px_rgba(0,0,0,0.32)]'
            : 'shadow-[0_18px_38px_rgba(51,65,85,0.12)]'
        }`}
        style={{
          background: topBarBackground
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
                    the city that raised you, the past that shaped you, the
                    starter bundle you carry, and the 10 stat points that define
                    your first real strengths.
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
                      ? themeMode === 'dark'
                        ? 'bg-amber-200/18 text-[color:var(--color-accent-contrast)]'
                        : 'bg-[rgba(220,231,246,0.96)] text-[color:var(--color-text-strong)]'
                      : locked
                        ? 'border-[color:var(--color-border-strong)] bg-[color:var(--color-creator-card)] text-[color:var(--color-muted)]'
                        : complete
                          ? themeMode === 'dark'
                            ? 'border-emerald-300/70 bg-emerald-200/16 text-[color:var(--color-accent-contrast)] shadow-[0_0_18px_rgba(74,222,128,0.18)]'
                            : 'border-emerald-400/70 bg-[rgba(209,250,229,0.96)] text-[color:var(--color-text-strong)] shadow-[0_0_18px_rgba(74,222,128,0.16)]'
                          : themeMode === 'dark'
                            ? 'border-sky-300/55 bg-sky-200/12 text-[color:var(--color-accent-contrast)]'
                            : 'border-sky-400/55 bg-[rgba(219,234,254,0.94)] text-slate-700 shadow-[0_0_18px_rgba(96,165,250,0.14)]';
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
                    Object.values(currentValidation.errors)[0] ??
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
                      {summaryCharacterName}
                    </div>
                    <div className="mt-3 border-t-2 border-[color:var(--color-border-strong)] pt-3">
                      <div className="text-sm leading-6 text-[color:var(--color-text-soft)]">
                        {summaryIdentityNarrative}
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
                  {preview.isResolved && preview.starterKnowledge.length > 0 && (
                    <div>{renderTags('Starting Knowledge', preview.starterKnowledge)}</div>
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
