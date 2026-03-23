import type { SidebarItem } from '../../types';
import { Card } from './Card';

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
      <div className="space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${
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
              {item.description && <div className="mt-1 text-sm text-slate-500">{item.description}</div>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
