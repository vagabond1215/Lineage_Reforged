import type { ConsumableEffectPreviewViewModel } from '../../types';

type ConsumableEffectPreviewProps = {
  preview: ConsumableEffectPreviewViewModel;
};

export function ConsumableEffectPreview({ preview }: ConsumableEffectPreviewProps) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Consumable Preview</div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200">
            {preview.contextTag}
          </span>
          {preview.highlightLabel && (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-200/10 px-2 py-1 text-[11px] text-emerald-50">
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
        <div className="hidden w-px bg-white/8 lg:block" />
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Delayed Effect</div>
          <div className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-3 text-sm text-slate-200">
            {preview.delayedRecovery}
          </div>
        </div>
      </div>
    </div>
  );
}
