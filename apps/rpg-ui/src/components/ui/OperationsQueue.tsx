import type { OperationItem } from '../../types';
import { Card } from './Card';

type OperationsQueueProps = {
  items: OperationItem[];
  accent: string;
};

export function OperationsQueue({ items, accent }: OperationsQueueProps) {
  return (
    <Card title="Operations Queue" eyebrow="Active Processes" accent={accent}>
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[22px] border border-white/8 bg-black/10 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                <p className="mt-1 text-sm text-slate-400">{item.stage}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                {item.priority}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.progress}%`,
                  background: `linear-gradient(90deg, ${accent} 0%, color-mix(in srgb, ${accent} 60%, white) 100%)`
                }}
              />
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Owner</div>
                <div>{item.owner}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">ETA</div>
                <div>{item.eta}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Output</div>
                <div>{item.output}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
