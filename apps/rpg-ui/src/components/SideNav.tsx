import { Icon } from './icons';
import { Tooltip } from './ui/Tooltip';
import type { NavItem, TabId } from '../types';

type SideNavProps = {
  items: NavItem[];
  activeTab: TabId | null;
  onChange: (tab: TabId) => void;
};

export function SideNav({ items, activeTab, onChange }: SideNavProps) {
  return (
    <aside className="panel-scroll h-full overflow-auto pr-1">
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <Tooltip key={item.id} content={item.hint} className="flex w-full">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`w-full rounded-[28px] border px-3 py-3 text-left transition ${
                  isActive
                    ? 'border-white/24 bg-white/10 opacity-100'
                    : 'border-white/12 bg-white/[0.03] opacity-80 hover:opacity-100'
                }`}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 24px color-mix(in srgb, ${item.accent} 26%, transparent), inset 0 0 0 1px color-mix(in srgb, ${item.accent} 30%, transparent)`
                      }
                    : undefined
                }
              >
                <div
                  className={`flex min-h-[86px] flex-col items-center justify-center gap-3 rounded-[22px] border px-3 py-4 text-center transition ${
                    isActive
                      ? 'border-white/12 bg-black/20 text-slate-50'
                      : 'border-white/8 bg-black/15 text-slate-300 hover:bg-black/20'
                  }`}
                  style={{
                    color: isActive ? 'white' : item.accent
                  }}
                >
                  <Icon name={item.icon} className="h-6 w-6" />
                  <div className="text-sm font-semibold text-current">{item.label}</div>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
