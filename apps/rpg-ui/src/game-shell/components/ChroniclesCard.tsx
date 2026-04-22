import type { AccountProfileState } from "../../../../../packages/shared/types/src/index.js";
import { Card } from "../../components/ui/Card";
import { buildChroniclesSummary } from "../achievementChroniclesPresentation.js";

type ChroniclesCardProps = {
  accountProfile: AccountProfileState;
  accent?: string;
};

export function ChroniclesCard({
  accountProfile,
  accent = "var(--color-codex)"
}: ChroniclesCardProps) {
  const summary = buildChroniclesSummary(accountProfile);

  return (
    <Card title="Chronicles" accent={accent}>
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Unlocked
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {summary.unlockedCountLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              Account-wide milestones already entered into the ledger.
            </div>
          </div>

          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Total Entries
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {summary.totalCountLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              The current breadth of the account chronicle catalog.
            </div>
          </div>

          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Category Coverage
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {summary.categoryCoverageLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              Distinct callings represented in the unlocked record.
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Recent Chronicle Unlocks
          </div>

          {summary.emptyState ? (
            <div className="mt-3 text-sm text-[color:var(--color-text-soft)]">
              {summary.emptyState}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {summary.recentUnlocks.map((unlock) => (
                <div
                  key={unlock.id}
                  className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                        {unlock.title}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--color-text-soft)]">
                        {unlock.recordedAtLabel}
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold text-[color:var(--color-text-strong)]">
                      {unlock.rarityLabel}
                    </div>
                  </div>
                  {unlock.rewardLabel && (
                    <div className="mt-2 text-xs text-[color:var(--color-text-soft)]">
                      Reward: {unlock.rewardLabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
