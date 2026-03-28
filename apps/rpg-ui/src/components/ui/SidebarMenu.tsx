import type { SidebarItem } from '../../types';
import { Card } from './Card';
import { Tooltip } from './Tooltip';

type SidebarMenuProps = {
  title: string;
  items: SidebarItem[];
  activeId: string;
  onChange: (id: string) => void;
  accent: string;
};

export function SidebarMenu({ title, items, activeId, onChange, accent }: SidebarMenuProps) {
  return (
    <Card title={title} accent={accent} className="panel-scroll h-full overflow-auto">
      <div className="space-y-1.5">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <Tooltip key={item.id} content={item.description ?? item.label} className="flex w-full">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`w-full rounded-[18px] border px-4 py-2.5 text-left transition ${
                  isActive
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-100">{item.label}</div>
                  {typeof item.count === 'number' && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
}
