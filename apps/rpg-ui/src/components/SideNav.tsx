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
      <nav className="gameplay-domain-list flex w-max" aria-label="Gameplay destinations">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <Tooltip key={item.id} content={item.hint} className="gameplay-domain-tooltip flex shrink-0">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`gameplay-domain-button w-full text-left transition ${isActive ? 'is-active' : ''}`}
                style={
                  isActive
                    ? {
                        '--forged-accent': item.accent
                      } as CSSProperties
                    : undefined
                }
              >
                <div className="gameplay-domain-content flex min-h-[2.25rem] flex-row items-center justify-center gap-1.5 px-2 py-1 text-center transition">
                  <span
                    className="gameplay-domain-icon inline-flex h-5 w-5 items-center justify-center"
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
