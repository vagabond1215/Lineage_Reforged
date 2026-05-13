import type { ReadinessCardViewModel, RecoveryProjectionViewModel } from '../../types';
import { RecoveryProjectionBar } from './RecoveryProjectionBar';

type ReadinessCardProps = {
  readiness: ReadinessCardViewModel;
  projection: RecoveryProjectionViewModel;
};

export function ReadinessCard({ readiness, projection }: ReadinessCardProps) {
  return (
    <div className="forged-card space-y-4 p-5">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="forged-subpanel p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Condition</div>
          <div className="mt-2 text-xl text-slate-50">{readiness.overallCondition}</div>
        </div>
        <div className="forged-subpanel p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Stamina Regen</div>
          <div className="mt-2 text-xl text-slate-50">{readiness.staminaRegenLabel}</div>
        </div>
        <div className="forged-subpanel p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Recovery</div>
          <div className="mt-2 text-xl text-slate-50">{readiness.recoveryLabel}</div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="forged-subpanel p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Primary Issues</div>
          <div className="mt-3 space-y-3">
            {readiness.primaryIssues.length === 0 && (
              <div className="forged-list-item px-3 py-3 text-sm text-slate-300">
                No urgent condition pressure.
              </div>
            )}
            {readiness.primaryIssues.map((issue) => (
              <div key={issue.id} className="forged-list-item px-3 py-3">
                <div className="text-sm font-semibold text-slate-100">{issue.label}</div>
                <div className="mt-1 text-sm text-slate-400">{issue.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="forged-subpanel p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Recommended Actions</div>
          <div className="mt-3 space-y-3">
            {readiness.recommendedActions.length === 0 && (
              <div className="forged-list-item px-3 py-3 text-sm text-slate-300">
                Stay the course.
              </div>
            )}
            {readiness.recommendedActions.map((action) => (
              <div key={action.id} className="forged-list-item px-3 py-3">
                <div className="text-sm font-semibold text-slate-100">{action.label}</div>
                <div className="mt-1 text-sm text-slate-400">{action.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="forged-subpanel p-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Recovery Projection</div>
        <div className="mt-3">
          <RecoveryProjectionBar projection={projection} />
        </div>
      </div>
    </div>
  );
}
