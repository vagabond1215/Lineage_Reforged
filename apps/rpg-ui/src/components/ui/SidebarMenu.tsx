import type { CSSProperties } from 'react';
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
                className={`forged-list-item w-full px-4 py-2.5 text-left transition ${
                  isActive ? 'is-active' : ''
                }`}
                style={{ '--forged-accent': accent } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">{item.label}</div>
                  {typeof item.count === 'number' && (
                    <span className="forged-chip px-2 py-1 text-[11px]">
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
