import type { ListItem } from '../../types';
import { toneClasses } from '../../utils';
import { Icon } from '../icons';
import { Card } from './Card';
import { FavoriteButton } from './FavoriteButton';

type SelectionListProps = {
  title: string;
  items: ListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
  accent: string;
  emptyMessage: string;
};

export function SelectionList({
  title,
  items,
  selectedId,
  onSelect,
  pinnedIds,
  onTogglePin,
  accent,
  emptyMessage
}: SelectionListProps) {
  return (
    <Card title={title} accent={accent} className="panel-scroll h-full overflow-auto">
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
            {emptyMessage}
          </div>
        )}
        {items.map((item) => {
          const isActive = item.id === selectedId;
          const isPinned = pinnedIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-white/20 bg-white/10'
                  : 'border-white/8 bg-black/10 hover:border-white/15 hover:bg-white/6'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-slate-100">
                      {item.title}
                    </h4>
                    {item.locked && <Icon name="lock" className="h-3.5 w-3.5 text-slate-500" />}
                  </div>
                  {item.subtitle && <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>}
                </div>
                <FavoriteButton active={isPinned} onToggle={() => onTogglePin(item.id)} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {item.meta && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                    {item.meta}
                  </span>
                )}
                {item.status && (
                  <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses('accent')}`}>
                    {item.status}
                  </span>
                )}
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {item.description && <p className="mt-3 text-sm text-slate-400">{item.description}</p>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
