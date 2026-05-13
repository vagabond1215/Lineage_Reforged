import type { CSSProperties } from 'react';
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
                className={`forged-list-item w-full px-2.5 py-2.5 text-left transition ${
                  isActive
                    ? 'is-active opacity-100'
                    : 'opacity-95'
                }`}
                style={
                  isActive
                    ? {
                        '--forged-accent': item.accent
                      } as CSSProperties
                    : undefined
                }
              >
                <div
                  className={`flex min-h-[86px] flex-col items-center justify-center gap-3 rounded-md border px-3 py-4 text-center transition ${
                    isActive
                      ? 'border-[color:var(--color-border-active)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-text-primary)]'
                      : 'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]'
                  }`}
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-overlay)]"
                    style={{
                      color: item.accent
                    }}
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
