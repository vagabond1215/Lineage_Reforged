import type { ActionOutcomePreviewViewModel } from '../../types';

type ActionOutcomePreviewProps = {
  title: string;
  preview: ActionOutcomePreviewViewModel;
};

const riskClasses: Record<ActionOutcomePreviewViewModel['riskTier'], string> = {
  safe: 'border-emerald-300/20 bg-emerald-200/10 text-emerald-50',
  straining: 'border-amber-300/20 bg-amber-200/10 text-amber-50',
  risky: 'border-rose-300/20 bg-rose-200/10 text-rose-50'
};

export function ActionOutcomePreview({ title, preview }: ActionOutcomePreviewProps) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</div>
        <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.16em] ${riskClasses[preview.riskTier]}`}>
          {preview.riskTier}
        </span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Energy</div>
          <div className="mt-2 text-sm text-slate-100">{preview.energy}</div>
        </div>
        <div className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Hydration</div>
          <div className="mt-2 text-sm text-slate-100">{preview.hydration}</div>
        </div>
        <div className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fatigue</div>
          <div className="mt-2 text-sm text-slate-100">{preview.fatigue}</div>
        </div>
      </div>
      {preview.warnings.length > 0 && (
        <div className="mt-3 space-y-2">
          {preview.warnings.map((warning) => (
            <div key={warning} className="rounded-[16px] border border-amber-300/15 bg-amber-200/8 px-3 py-2 text-sm text-amber-50">
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
