import type { ActionOutcomePreviewViewModel } from '../../types';

type ActionOutcomePreviewProps = {
  title: string;
  preview: ActionOutcomePreviewViewModel;
};

const riskClasses: Record<ActionOutcomePreviewViewModel['riskTier'], string> = {
  safe: 'border-[color:var(--color-tone-success-border)] bg-[color:var(--color-tone-success-bg)] text-[color:var(--color-tone-success-text)]',
  straining: 'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] text-[color:var(--color-tone-warning-text)]',
  risky: 'border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] text-[color:var(--color-tone-danger-text)]'
};

export function ActionOutcomePreview({ title, preview }: ActionOutcomePreviewProps) {
  return (
    <div className="forged-subpanel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</div>
        <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.16em] ${riskClasses[preview.riskTier]}`}>
          {preview.riskTier}
        </span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="forged-list-item px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Energy</div>
          <div className="mt-2 text-sm text-slate-100">{preview.energy}</div>
        </div>
        <div className="forged-list-item px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Hydration</div>
          <div className="mt-2 text-sm text-slate-100">{preview.hydration}</div>
        </div>
        <div className="forged-list-item px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fatigue</div>
          <div className="mt-2 text-sm text-slate-100">{preview.fatigue}</div>
        </div>
      </div>
      {preview.warnings.length > 0 && (
        <div className="mt-3 space-y-2">
          {preview.warnings.map((warning) => (
            <div key={warning} className="rounded-lg border border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] px-3 py-2 text-sm text-[color:var(--color-tone-warning-text)]">
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
