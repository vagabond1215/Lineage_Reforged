import { useMemo, useState } from "react";
import type { AccountProfileState } from "../../../../../packages/shared/types/src/index.js";
import type { AccountMetaSectionId, LegacyUnlockStateFilter } from "../accountMetaPresentation.js";
import { buildAccountMetaViewModel } from "../accountMetaPresentation.js";

type AccountMetaPanelProps = {
  accountProfile: AccountProfileState;
  activeSection?: AccountMetaSectionId;
  onSectionChange?: (section: AccountMetaSectionId) => void;
  showSectionNav?: boolean;
  frameless?: boolean;
};

const SECTION_ITEMS: Array<{ id: AccountMetaSectionId; label: string }> = [
  { id: "legacy", label: "Legacy" },
  { id: "chronicles", label: "Chronicles" }
];

const LEGACY_STATE_FILTERS: LegacyUnlockStateFilter[] = ["All", "Locked", "Unlocked"];

function buildToggleClass(active: boolean): string {
  return active
    ? "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] text-[color:var(--color-text-strong)] shadow-[0_10px_22px_rgba(15,23,42,0.14)]"
    : "border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-soft)] hover:bg-[color:var(--color-surface-soft)]";
}

function formatUnlockStateLabel(state: "locked" | "unlocked" | "maxed"): string {
  switch (state) {
    case "maxed":
      return "Maxed";
    case "unlocked":
      return "Unlocked";
    case "locked":
      return "Locked";
  }
}

function formatRequirementStateLabel(state: "eligible" | "unmet" | "unsupported"): string {
  switch (state) {
    case "eligible":
      return "Eligible";
    case "unmet":
      return "Unmet";
    case "unsupported":
      return "Future Hook";
  }
}

export function AccountMetaPanel({
  accountProfile,
  activeSection,
  onSectionChange,
  showSectionNav = true,
  frameless = false
}: AccountMetaPanelProps) {
  const meta = useMemo(() => buildAccountMetaViewModel(accountProfile), [accountProfile]);
  const [internalActiveSection, setInternalActiveSection] =
    useState<AccountMetaSectionId>("legacy");
  const [selectedLegacyType, setSelectedLegacyType] = useState("All");
  const [selectedLegacyState, setSelectedLegacyState] =
    useState<LegacyUnlockStateFilter>("All");

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
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {filteredLegacyEntries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg border px-4 py-4 ${
                  entry.isPlaceholder
                    ? "border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] opacity-70"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                    {entry.type}
                  </span>
                  <span className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                    {formatUnlockStateLabel(entry.state)}
                  </span>
                  <span className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                    {formatRequirementStateLabel(entry.requirementState)}
                  </span>
                </div>

                <div className="mt-3 text-base font-semibold text-[color:var(--color-text-strong)]">
                  {entry.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  {entry.description}
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                  {entry.requirementLabel}
                </div>
                <div className="mt-3 grid gap-2 text-xs text-[color:var(--color-text-soft)] sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-[color:var(--color-text-strong)]">
                      Cost:
                    </span>{" "}
                    {entry.costLabel}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--color-text-strong)]">
                      Progress:
                    </span>{" "}
                    {entry.progressLabel}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--color-text-strong)]">
                      Status:
                    </span>{" "}
                    {entry.affordabilityLabel}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--color-text-strong)]">
                      Action:
                    </span>{" "}
                    {entry.purchaseStatusLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const chroniclesContent = (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-5">
        {meta.chronicles.summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-4"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              {stat.label}
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {stat.valueLabel}
            </div>
          </div>
        ))}
      </div>

      {meta.chronicles.tiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-5 text-sm text-[color:var(--color-text-soft)]">
          No chronicles have been recorded yet.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {meta.chronicles.tiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-4"
            >
              <div>
                <div className="text-base font-semibold text-[color:var(--color-text-strong)]">
                  {tile.title}
                </div>
                <div className="mt-1 text-sm text-[color:var(--color-text-soft)]">
                  {tile.originLabel}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                  {tile.fateLabel}
                </span>
                <span className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                  {tile.echoPeakLabel}
                </span>
              </div>

              {tile.legacyGrantedLabel && (
                <div className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                  {tile.legacyGrantedLabel}
                </div>
              )}
            </div>
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
