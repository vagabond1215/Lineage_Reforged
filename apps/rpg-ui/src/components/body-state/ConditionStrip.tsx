import { useState } from 'react';
import type { ConditionStripViewModel } from '../../types';
import { BodyStatePill } from './BodyStatePill';

type ConditionStripProps = {
  strip: ConditionStripViewModel;
};

export function ConditionStrip({ strip }: ConditionStripProps) {
  const [secondaryExpanded, setSecondaryExpanded] = useState(
    strip.secondary.some((pill) => pill.severity !== 'normal')
  );
  const allStable = [...strip.primary, ...strip.secondary].every((pill) => pill.severity === 'normal');
  const shouldShowExpanded = strip.expandedByDefault;
  const shouldShowSecondary = secondaryExpanded || strip.secondary.some((pill) => pill.severity !== 'normal');

  if (allStable && !shouldShowExpanded) {
    return (
      <div className="rounded-full border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
        {strip.collapsedLabel}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {strip.primary.map((pill) => (
          <BodyStatePill key={pill.id} pill={pill} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSecondaryExpanded((current) => !current)}
          className="rounded-full border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)] transition hover:bg-[color:var(--color-surface-selected)]"
        >
          {shouldShowSecondary ? 'Hide Secondary' : 'More Condition'}
        </button>
      </div>
      {shouldShowSecondary && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {strip.secondary.map((pill) => (
            <BodyStatePill key={pill.id} pill={pill} />
          ))}
        </div>
      )}
    </div>
  );
}
