import { useMemo, useState } from "react";
import type { AccountProfileState } from "../../../../../packages/shared/types/src/index.js";
import type {
  AccountMetaSectionId,
  ChronicleFilterId,
  ChronicleEstateViewModel,
  ChronicleTileViewModel,
  LegacyUnlockEntryViewModel,
  LegacyUnlockStateFilter
} from "../accountMetaPresentation.js";
import { buildAccountMetaViewModel } from "../accountMetaPresentation.js";

type AccountMetaPanelProps = {
  accountProfile: AccountProfileState;
  activeSection?: AccountMetaSectionId;
  onSectionChange?: (section: AccountMetaSectionId) => void;
  onPurchaseUnlock?: ((unlockId: string) => void) | undefined;
  onSelectPreparation?: ((unlockId: string) => void) | undefined;
  onSetPreparationChoice?: ((unlockId: string, choiceId: string) => void) | undefined;
  onRemovePreparation?: ((unlockId: string) => void) | undefined;
  showSectionNav?: boolean;
  frameless?: boolean;
};

const SECTION_ITEMS: Array<{ id: AccountMetaSectionId; label: string }> = [
  { id: "legacy", label: "Legacy" },
  { id: "chronicles", label: "Chronicles" }
];

const LEGACY_STATE_FILTERS: LegacyUnlockStateFilter[] = ["All", "Locked", "Unlocked"];

const badgeBaseClass =
  "rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]";
const mutedBadgeClass = `${badgeBaseClass} border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-panel)] text-[color:var(--color-text-muted)]`;
const echoBadgeClass = `${badgeBaseClass} border-[color:var(--color-echo-accent)] bg-[color:var(--color-surface-panel)] text-[color:var(--color-echo-accent)]`;
const prestigeBadgeClass = `${badgeBaseClass} border-[color:var(--color-prestige-accent)] bg-[color:var(--color-surface-panel)] text-[color:var(--color-prestige-accent)]`;
const softChipClass =
  "rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs text-[color:var(--color-text-primary)]";
const subduedChipClass =
  "rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-xs text-[color:var(--color-text-secondary)]";
const secondaryActionButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-action-secondary)] px-3 py-1 text-xs font-semibold text-[color:var(--color-action-secondary-text)] transition hover:bg-[color:var(--color-surface-selected)]";
const primaryActionButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-[color:var(--color-border-active)] bg-[color:var(--color-action-primary)] px-3 py-1 text-xs font-semibold text-[color:var(--color-action-primary-text)] transition hover:brightness-105";

function buildToggleClass(active: boolean): string {
  return active
    ? "border-[color:var(--color-border-active)] bg-[color:var(--color-surface-selected)] text-[color:var(--color-text-primary)] shadow-panel"
    : "border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-panel)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]";
}

function buildRenownDepthClass(depth: number): string {
  switch (depth) {
    case 1:
      return "md:ml-5";
    case 2:
      return "md:ml-10";
    case 3:
      return "md:ml-16";
    default:
      return "";
  }
}

function LegacyUnlockCard({
  entry,
  onPurchaseUnlock,
  onSelectPreparation,
  onSetPreparationChoice,
  onRemovePreparation
}: {
  entry: LegacyUnlockEntryViewModel;
  onPurchaseUnlock?: ((unlockId: string) => void) | undefined;
  onSelectPreparation?: ((unlockId: string) => void) | undefined;
  onSetPreparationChoice?: ((unlockId: string, choiceId: string) => void) | undefined;
  onRemovePreparation?: ((unlockId: string) => void) | undefined;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-4 ${
        entry.isPlaceholder
          ? "border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] opacity-70"
          : "border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
      } ${entry.renownTier ? buildRenownDepthClass(entry.renownDepth) : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-base font-semibold text-[color:var(--color-text-strong)]">
          {entry.title}
        </div>
        {entry.statusTagLabel ? (
          <span className={`shrink-0 ${mutedBadgeClass}`}>
            {entry.statusTagLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
        Prestige Cost
      </div>
      <div className="mt-1 text-sm font-semibold text-[color:var(--color-text-strong)]">
        {entry.costLabel}
      </div>

      <div className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
        {entry.description}
      </div>

      {entry.preparationChoiceOptions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.preparationChoiceOptions.map((option) => (
            <button
              key={`${entry.id}.${option.id}`}
              type="button"
              disabled={option.disabled || !onSetPreparationChoice}
              onClick={() => onSetPreparationChoice?.(entry.id, option.id)}
              className={`inline-flex min-h-9 items-center justify-center rounded-md border px-3 py-1 text-xs font-semibold transition ${
                option.isSelected
                  ? "border-[color:var(--color-border-active)] bg-[color:var(--color-action-primary)] text-[color:var(--color-action-primary-text)]"
                  : "border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-selected)]"
              } ${
                option.disabled && !option.isSelected
                  ? "cursor-not-allowed opacity-45 hover:bg-[color:var(--color-surface-muted)]"
                  : ""
              }`}
              aria-pressed={option.isSelected}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {entry.requiresLabel ? (
          <div className="text-xs font-medium text-[color:var(--color-muted-strong)]">
            Requires: {entry.requiresLabel}
          </div>
        ) : (
          <div />
        )}

        {entry.canRemovePreparation && onRemovePreparation ? (
          <button
            type="button"
            onClick={() => onRemovePreparation(entry.id)}
            className={secondaryActionButtonClass}
          >
            Remove
          </button>
        ) : entry.canSelectPreparation && onSelectPreparation ? (
          <button
            type="button"
            onClick={() => onSelectPreparation(entry.id)}
            className={primaryActionButtonClass}
          >
            Select
          </button>
        ) : entry.catalogCanPurchase && onPurchaseUnlock ? (
          <button
            type="button"
            onClick={() => onPurchaseUnlock(entry.id)}
            className={primaryActionButtonClass}
          >
            {entry.purchaseButtonLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ChronicleTileCard({ tile }: { tile: ChronicleTileViewModel }) {
  const originLine =
    tile.originLabel === "Unknown Origin"
      ? tile.lineageLabel
      : `${tile.lineageLabel} / ${tile.originLabel}`;

  return (
    <div
      className={`rounded-lg border px-4 py-4 ${
        tile.isDeleted
          ? "border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] opacity-85"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[color:var(--color-text-strong)]">
            {tile.title}
          </div>
          <div className="mt-1 text-sm text-[color:var(--color-text-soft)]">{originLine}</div>
        </div>
        <span className={`shrink-0 ${mutedBadgeClass}`}>
          {tile.statusTagLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={echoBadgeClass}>
          {tile.echoPeakLabel}
        </span>
        {tile.prestigeEarnedLabel ? (
          <span className={prestigeBadgeClass}>
            {tile.prestigeEarnedLabel}
          </span>
        ) : null}
        {tile.durationLabel ? (
          <span className={mutedBadgeClass}>
            {tile.durationLabel}
          </span>
        ) : null}
      </div>

      {tile.deedLabels.length > 0 || tile.moreDeedsLabel ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tile.deedLabels.map((label) => (
            <span
              key={`${tile.id}.${label}`}
              className={softChipClass}
            >
              {label}
            </span>
          ))}
          {tile.moreDeedsLabel ? (
            <span className={subduedChipClass}>
              {tile.moreDeedsLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      {tile.lineageCueLabels.length > 0 || tile.authorityNoteLabel ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tile.lineageCueLabels.map((label) => (
            <span
              key={`${tile.id}.${label}`}
              className={mutedBadgeClass}
            >
              {label}
            </span>
          ))}
          {tile.authorityNoteLabel ? (
            <span className="text-xs text-[color:var(--color-text-soft)]">
              {tile.authorityNoteLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function EstatePreviewPanel({ estate }: { estate: ChronicleEstateViewModel }) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
            Estate Claims
          </div>
          <div className="mt-1 text-xs text-[color:var(--color-text-soft)]">
            {estate.noteLabel}
          </div>
        </div>
        <span className={mutedBadgeClass}>
          Preview
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {estate.summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-2"
          >
            <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
              {stat.label}
            </div>
            <div className="mt-1 text-lg text-[color:var(--color-text-strong)]">
              {stat.valueLabel}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {estate.claimTiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-2 text-xs text-[color:var(--color-text-soft)]"
          >
            <span className="font-semibold text-[color:var(--color-text-strong)]">
              {tier.label}
            </span>
            <span> / {tier.accessLabel}</span>
            <span> / {tier.costLabel}</span>
            {tier.requirementLabel ? <span> / {tier.requirementLabel}</span> : null}
            <span> / {tier.stateLabel}</span>
          </div>
        ))}
      </div>

      {estate.emptyLabel ? (
        <div className="mt-3 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-3 text-sm text-[color:var(--color-text-soft)]">
          {estate.emptyLabel}
        </div>
      ) : estate.previewRows.length > 0 ? (
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {estate.previewRows.map((row) => (
            <div
              key={row.id}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[color:var(--color-text-strong)]">
                    {row.title}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--color-text-soft)]">
                    {row.detailLabel} / {row.sourceLabel}
                    {row.claimantLabel ? ` / ${row.claimantLabel}` : ""}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-md border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                    row.isLocked
                      ? "border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]"
                      : "border-[color:var(--color-border-active)] bg-[color:var(--color-action-primary)] text-[color:var(--color-action-primary-text)]"
                  }`}
                >
                  {row.statusLabel}
                </span>
              </div>
              {row.lockedReasonLabel ? (
                <div className="mt-2 text-xs text-[color:var(--color-muted-strong)]">
                  {row.lockedReasonLabel}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {estate.overflowLabel ? (
        <div className="mt-2 text-xs text-[color:var(--color-muted-strong)]">
          {estate.overflowLabel}
        </div>
      ) : null}
    </div>
  );
}

export function AccountMetaPanel({
  accountProfile,
  activeSection,
  onSectionChange,
  onPurchaseUnlock,
  onSelectPreparation,
  onSetPreparationChoice,
  onRemovePreparation,
  showSectionNav = true,
  frameless = false
}: AccountMetaPanelProps) {
  const meta = useMemo(() => buildAccountMetaViewModel(accountProfile), [accountProfile]);
  const [internalActiveSection, setInternalActiveSection] =
    useState<AccountMetaSectionId>("legacy");
  const [selectedLegacyType, setSelectedLegacyType] = useState("All");
  const [selectedLegacyState, setSelectedLegacyState] =
    useState<LegacyUnlockStateFilter>("All");
  const [selectedChronicleFilter, setSelectedChronicleFilter] =
    useState<ChronicleFilterId>("recent");

  const resolvedActiveSection = activeSection ?? internalActiveSection;
  const setResolvedActiveSection = (section: AccountMetaSectionId) => {
    if (onSectionChange) {
      onSectionChange(section);
      return;
    }

    setInternalActiveSection(section);
  };

  const filteredLegacyEntries = useMemo(() => {
    return meta.legacy.unlockEntries.filter((entry) => {
      if (selectedLegacyType !== "All" && entry.type !== selectedLegacyType) {
        return false;
      }

      if (selectedLegacyState === "Locked" && entry.state !== "locked") {
        return false;
      }

      if (
        selectedLegacyState === "Unlocked" &&
        entry.state !== "unlocked" &&
        entry.state !== "maxed"
      ) {
        return false;
      }

      return true;
    });
  }, [meta.legacy.unlockEntries, selectedLegacyState, selectedLegacyType]);

  const legacyEntryGroups = useMemo(() => {
    const renownEntries = filteredLegacyEntries
      .filter((entry) => entry.renownTier !== null)
      .sort(
        (left, right) =>
          left.renownDepth - right.renownDepth || left.title.localeCompare(right.title)
      );
    const standardEntries = filteredLegacyEntries.filter((entry) => entry.renownTier === null);

    return { renownEntries, standardEntries };
  }, [filteredLegacyEntries]);

  const selectedChronicleFilterView =
    meta.chronicles.filters.find((filter) => filter.id === selectedChronicleFilter) ??
    meta.chronicles.filters[0];
  const filteredChronicleTiles = useMemo(
    () =>
      meta.chronicles.tiles.filter((tile) => tile.filterIds.includes(selectedChronicleFilter)),
    [meta.chronicles.tiles, selectedChronicleFilter]
  );

  const legacyContent = (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Current Prestige
          </div>
          <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
            {meta.legacy.currentPrestigeLabel}
          </div>
        </div>
        <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Lifetime Prestige
          </div>
          <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
            {meta.legacy.lifetimePrestigeLabel}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {meta.legacy.unlockTypeTabs.map((tab) => {
              const active = selectedLegacyType === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedLegacyType(tab)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${buildToggleClass(active)}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {selectedLegacyType === "Preparations" ? (
            <div className="rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-panel)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text-primary)]">
              {meta.legacy.preparationCapacityLabel}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {LEGACY_STATE_FILTERS.map((filter) => {
              const active = selectedLegacyState === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedLegacyState(filter)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${buildToggleClass(active)}`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredLegacyEntries.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-5 text-sm text-[color:var(--color-text-soft)]">
            No unlocks match this filter yet.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {legacyEntryGroups.standardEntries.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {legacyEntryGroups.standardEntries.map((entry) => (
                  <LegacyUnlockCard
                    key={entry.id}
                    entry={entry}
                    onPurchaseUnlock={onPurchaseUnlock}
                    onSelectPreparation={onSelectPreparation}
                    onSetPreparationChoice={onSetPreparationChoice}
                    onRemovePreparation={onRemovePreparation}
                  />
                ))}
              </div>
            ) : null}

            {legacyEntryGroups.renownEntries.length > 0 ? (
              <details
                open
                className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] p-3"
              >
                <summary className="cursor-pointer select-none px-1 py-1 text-sm font-semibold text-[color:var(--color-text-strong)]">
                  Geographic Renown
                </summary>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {legacyEntryGroups.renownEntries.map((entry) => (
                    <LegacyUnlockCard
                      key={entry.id}
                      entry={entry}
                      onPurchaseUnlock={onPurchaseUnlock}
                      onSelectPreparation={onSelectPreparation}
                      onSetPreparationChoice={onSetPreparationChoice}
                      onRemovePreparation={onRemovePreparation}
                    />
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );

  const chroniclesContent = (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {meta.chronicles.summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-3 py-3"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              {stat.label}
            </div>
            <div className="mt-1 text-2xl text-[color:var(--color-text-strong)]">
              {stat.valueLabel}
            </div>
          </div>
        ))}
      </div>

      <EstatePreviewPanel estate={meta.chronicles.estate} />

      <div className="flex flex-wrap gap-2">
        {meta.chronicles.filters.map((filter) => {
          const active = selectedChronicleFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedChronicleFilter(filter.id)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${buildToggleClass(active)}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredChronicleTiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-5 text-sm text-[color:var(--color-text-soft)]">
          {selectedChronicleFilterView?.emptyLabel ?? "No Chronicle records yet."}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {filteredChronicleTiles.map((tile) => (
            <ChronicleTileCard key={tile.id} tile={tile} />
          ))}
        </div>
      )}
    </div>
  );

  const content = resolvedActiveSection === "legacy" ? legacyContent : chroniclesContent;

  return (
    <section
      className={
        frameless
          ? "min-w-0"
          : "rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-panel backdrop-blur-xl"
      }
    >
      {showSectionNav ? (
        <div className="grid gap-4 md:grid-cols-[7rem_minmax(0,1fr)]">
          <aside className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] p-2">
            <nav className="flex gap-2 md:flex-col">
              {SECTION_ITEMS.map((item) => {
                const active = resolvedActiveSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setResolvedActiveSection(item.id)}
                    className={`w-full rounded-md border px-3 py-3 text-sm font-semibold transition ${buildToggleClass(active)}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">{content}</div>
        </div>
      ) : (
        <div className="min-w-0">{content}</div>
      )}
    </section>
  );
}
