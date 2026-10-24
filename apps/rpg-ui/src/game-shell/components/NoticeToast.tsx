import { useEffect, useRef, useState } from 'react';
import type { GameShellNotice } from '../state.js';
import { NoticeBanner } from './NoticeBanner.js';

type NoticeToastProps = {
  notice: GameShellNotice;
  identity: GameShellNotice | string | null;
  onDismiss: () => void;
};

export function getNoticeAutoDismissMs(notice: GameShellNotice): number | null {
  const requested = notice.autoDismissMs;
  if (requested === null) return null;
  return typeof requested === 'number' && Number.isFinite(requested) && requested > 0
    ? requested
    : 8000;
}

export function NoticeToast({ notice, identity, onDismiss }: NoticeToastProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  const duration = getNoticeAutoDismissMs(notice);

  useEffect(() => {
    if (!identity || duration === null || hovered || focused) return;
    const timeoutId = window.setTimeout(() => dismissRef.current(), duration);
    return () => window.clearTimeout(timeoutId);
  }, [identity, duration, hovered, focused]);

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[70] max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto"
      role={notice.tone === 'danger' ? 'alert' : 'status'}
      aria-live={notice.tone === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="pointer-events-auto">
        <NoticeBanner notice={notice} onDismiss={onDismiss} />
      </div>
    </div>
  );
}
