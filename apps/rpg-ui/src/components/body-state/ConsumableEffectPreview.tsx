import type { ConsumableEffectPreviewViewModel } from '../../types';

type ConsumableEffectPreviewProps = {
  preview: ConsumableEffectPreviewViewModel;
};

export function ConsumableEffectPreview({ preview }: ConsumableEffectPreviewProps) {
  return (
    <div className="forged-subpanel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Consumable Preview</div>
        <div className="flex flex-wrap gap-2">
          <span className="forged-chip px-2 py-1 text-[11px]">
            {preview.contextTag}
          </span>
          {preview.highlightLabel && (
            <span className="rounded-full border border-[color:var(--color-tone-success-border)] bg-[color:var(--color-tone-success-bg)] px-2 py-1 text-[11px] text-[color:var(--color-tone-success-text)]">
              {preview.highlightLabel}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Immediate Effects</div>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>Energy</span>
              <span className="text-slate-100">{preview.immediateEffects.energy}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Protein</span>
              <span className="text-slate-100">{preview.immediateEffects.protein}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Hydration</span>
              <span className="text-slate-100">{preview.immediateEffects.hydration}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Intoxication</span>
              <span className="text-slate-100">{preview.immediateEffects.intoxication}</span>
            </div>
          </div>
        </div>
        <div className="hidden w-px bg-[color:var(--color-border-soft)] lg:block" />
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Delayed Effect</div>
          <div className="forged-list-item px-3 py-3 text-sm text-slate-200">
            {preview.delayedRecovery}
          </div>
        </div>
      </div>
    </div>
  );
}
