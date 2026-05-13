import { useState } from 'react';
import type { NotificationItem } from '../types';
import { toneClasses } from '../utils';
import { Icon } from './icons';

type NotificationBellProps = {
  items: NotificationItem[];
};

export function NotificationBell({ items }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const topBarButtonClass =
    'forged-icon-button p-3 text-[color:var(--color-text-primary)]';

  return (
    <div className="relative z-[110]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`relative ${topBarButtonClass}`}
        aria-label="Open notifications"
      >
        <Icon name="bell" className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 rounded-full bg-[color:var(--color-action-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-action-primary-text)]">
          {items.length}
        </span>
      </button>
      {open && (
        <div className="forged-overlay absolute right-0 top-[calc(100%+12px)] z-[120] w-80 max-w-[calc(100vw-2rem)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base text-[color:var(--color-text-primary)]">Notifications</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)]"
            >
              Close
            </button>
          </div>
          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <article
                key={item.id}
                className="forged-subpanel p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {item.title}
                  </h4>
                  <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses(item.type)}`}>
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
