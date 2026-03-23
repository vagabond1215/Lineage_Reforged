import type { DetailGroup } from '../../types';
import { toneClasses } from '../../utils';
import { Card } from './Card';

type DetailCardProps = {
  title: string;
  summary: string;
  groups: DetailGroup[];
  accent: string;
  className?: string;
};

export function DetailCard({
  title,
  summary,
  groups,
  accent,
  className = 'panel-scroll h-full overflow-auto'
}: DetailCardProps) {
  return (
    <Card title={title} accent={accent} className={className}>
      <p className="mb-5 text-sm leading-6 text-slate-300">{summary}</p>
      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.title} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
            <h4 className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">{group.title}</h4>
            <div className="space-y-3">
              {group.entries.map((entry) => (
                <div key={`${group.title}-${entry.label}`} className="space-y-1">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {entry.label}
                  </div>
                  <div
                    className={`inline-flex rounded-full border px-3 py-1.5 text-sm ${toneClasses(entry.tone)}`}
                  >
                    {entry.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
