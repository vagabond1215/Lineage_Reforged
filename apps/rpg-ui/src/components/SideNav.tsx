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
    <aside className="gameplay-side-nav panel-scroll h-full overflow-x-auto overflow-y-hidden">
      <nav className="gameplay-domain-list flex w-max gap-1">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <Tooltip key={item.id} content={item.hint} className="gameplay-domain-tooltip flex shrink-0">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`gameplay-domain-button forged-list-item w-full px-1 py-1 text-left transition ${
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
                  className={`gameplay-domain-content flex min-h-[2.25rem] flex-row items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-center transition ${
                    isActive
                      ? 'border-[color:var(--color-border-active)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-text-primary)]'
                      : 'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]'
                  }`}
                >
                  <span
                    className="gameplay-domain-icon inline-flex h-5 w-5 items-center justify-center rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-overlay)]"
                    style={{
                      color: item.accent
                    }}
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="gameplay-domain-label text-xs font-semibold">{item.label}</div>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
