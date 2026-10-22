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
    <aside className="panel-scroll h-full overflow-x-auto overflow-y-hidden xl:overflow-y-auto xl:overflow-x-hidden xl:pr-1">
      <nav className="flex w-max gap-1 xl:block xl:w-auto xl:space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <Tooltip key={item.id} content={item.hint} className="flex shrink-0 xl:w-full">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`forged-list-item w-full px-1 py-1 text-left transition xl:px-2.5 xl:py-2.5 ${
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
                  className={`flex min-h-[2.25rem] flex-row items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-center transition xl:min-h-[86px] xl:flex-col xl:gap-3 xl:px-3 xl:py-4 ${
                    isActive
                      ? 'border-[color:var(--color-border-active)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-text-primary)]'
                      : 'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]'
                  }`}
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-overlay)] xl:h-9 xl:w-9"
                    style={{
                      color: item.accent
                    }}
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="text-xs font-semibold xl:text-sm">{item.label}</div>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
