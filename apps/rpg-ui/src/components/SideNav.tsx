import { Icon } from './icons';
import type { NavItem, TabId } from '../types';

type SideNavProps = {
  items: NavItem[];
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

export function SideNav({ items, activeTab, onChange }: SideNavProps) {
  return (
    <aside className="panel-scroll h-full overflow-auto rounded-[32px] border border-white/10 bg-[color:var(--color-panel-strong)] p-3 shadow-panel backdrop-blur-xl">
      <div className="mb-4 px-3 pt-2">
        <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Navigation</div>
        <h2 className="mt-2 text-lg text-slate-50">RPG Systems</h2>
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-full rounded-[24px] border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-white/20 bg-white/10'
                  : 'border-transparent bg-transparent hover:border-white/10 hover:bg-white/5'
              }`}
              style={
                isActive
                  ? {
                      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${item.accent} 26%, transparent)`
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-black/20"
                  style={{ color: item.accent }}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{item.label}</div>
                  <div className="text-xs leading-5 text-slate-500">{item.hint}</div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
