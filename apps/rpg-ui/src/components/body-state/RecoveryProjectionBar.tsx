import type { RecoveryProjectionViewModel } from '../../types';

type RecoveryProjectionBarProps = {
  projection: RecoveryProjectionViewModel;
};

export function RecoveryProjectionBar({ projection }: RecoveryProjectionBarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {projection.windows.map((window) => (
        <div key={window.id} className="rounded-[18px] border border-white/8 bg-black/10 p-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{window.label}</div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Energy</span>
              <span className="text-slate-100">{window.energy}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Fatigue</span>
              <span className="text-slate-100">{window.fatigue}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
