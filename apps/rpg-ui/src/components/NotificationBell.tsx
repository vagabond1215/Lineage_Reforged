import { useEffect, useRef } from 'react';
import type { NotificationItem } from '../types';
import { toneClasses } from '../utils';
import { Icon } from './icons';

type NotificationBellProps = {
  items: NotificationItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function NotificationBell({ items, open, onToggle, onClose }: NotificationBellProps) {
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, onClose]);
  const topBarButtonClass =
    'forged-icon-button p-3 text-[color:var(--color-text-primary)]';

  return (
    <div className="relative z-[110]">
      <button
        ref={trigger}
        type="button"
        onClick={onToggle}
        className={`relative ${topBarButtonClass}`}
        aria-label="Open notifications"
        aria-expanded={open}
        aria-controls="top-bar-notification-detail"
      >
        <Icon name="bell" className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 rounded-full bg-[color:var(--color-action-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-action-primary-text)]">
          {items.length}
        </span>
      </button>
      {open && (
        <div ref={panel} id="top-bar-notification-detail" role="region" aria-label="Notifications" tabIndex={-1}
          onKeyDown={(event) => { if (event.key === 'Escape') { onClose(); trigger.current?.focus(); } }}
          className="forged-overlay absolute right-0 top-[calc(100%+12px)] z-[120] max-h-[calc(100vh-6rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base text-[color:var(--color-text-primary)]">Notifications</h3>
            <button
              type="button"
              onClick={() => { onClose(); trigger.current?.focus(); }}
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
