import type { AccountProfileState } from "../../../../../packages/shared/types/src/index.js";
import { Card } from "../../components/ui/Card";
import { buildLegacyLedgerSummary } from "../legacyLedgerPresentation.js";

type LegacyLedgerCardProps = {
  accountProfile: AccountProfileState;
  accent?: string;
};

export function LegacyLedgerCard({
  accountProfile,
  accent = "var(--color-chronicle)"
}: LegacyLedgerCardProps) {
  const ledger = buildLegacyLedgerSummary(accountProfile);

  return (
    <Card title="Legacy Ledger" eyebrow={ledger.displayName} accent={accent}>
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Current Legacy
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {ledger.currentLegacyLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              The account ledger currently held in reserve.
            </div>
          </div>

          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Lifetime Earned
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {ledger.lifetimeLegacyLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              The full tally recorded to this wayfarer ledger.
            </div>
          </div>

          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
              Unlock Count
            </div>
            <div className="mt-2 text-3xl text-[color:var(--color-text-strong)]">
              {ledger.unlockCountLabel}
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-text-soft)]">
              Permanent marks already recorded in this ledger.
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
            Recent Transactions
          </div>

          {ledger.emptyState ? (
            <div className="mt-3 text-sm text-[color:var(--color-text-soft)]">
              {ledger.emptyState}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {ledger.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                        {transaction.summary}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--color-text-soft)]">
                        {transaction.recordedAtLabel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                        {transaction.amountLabel}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--color-text-soft)]">
                        {transaction.balanceLabel}
                      </div>
                    </div>
                  </div>
                  {transaction.unlockLabel && (
                    <div className="mt-2 text-xs text-[color:var(--color-text-soft)]">
                      {transaction.unlockLabel}
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
