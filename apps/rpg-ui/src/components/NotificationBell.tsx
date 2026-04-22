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
    'rounded-full border border-slate-400/25 bg-[rgba(54,63,75,0.9)] p-3 text-slate-100 shadow-[0_10px_24px_rgba(2,6,23,0.22)] transition hover:border-slate-300/32 hover:bg-[rgba(69,80,95,0.96)]';

  return (
    <div className="relative z-[110]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`relative ${topBarButtonClass}`}
        aria-label="Open notifications"
      >
        <Icon name="bell" className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 rounded-full bg-amber-300 px-1.5 py-0.5 text-[10px] font-semibold text-slate-950">
          {items.length}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[120] w-80 max-w-[calc(100vw-2rem)] rounded-[24px] border border-white/10 bg-slate-950/96 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base text-slate-50">Notifications</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-400 transition hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <article key={item.id} className="rounded-[20px] border border-white/8 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                  <span className={`rounded-full border px-2 py-1 text-[11px] ${toneClasses(item.type)}`}>
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
