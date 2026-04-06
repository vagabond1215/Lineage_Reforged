import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';

type TooltipSide = 'top' | 'bottom';
type TooltipAlign = 'start' | 'center' | 'end';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  side?: TooltipSide;
  align?: TooltipAlign;
  portal?: boolean;
  offset?: number;
  viewportPadding?: number;
};

export function Tooltip({
  content,
  children,
  className = '',
  panelClassName = '',
  side = 'bottom',
  align = 'center',
  portal = false,
  offset = 8,
  viewportPadding = 16
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLSpanElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [portalStyle, setPortalStyle] = useState<CSSProperties | null>(null);
  const visible = hovered || focused;

  useEffect(() => {
    if (!visible || !portal) {
      setPortalStyle(null);
    }
  }, [visible, portal]);

  useLayoutEffect(() => {
    if (!visible || !portal || typeof window === 'undefined') {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;

      if (!trigger || !panel) {
        return;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const maxLeft = Math.max(
        viewportPadding,
        window.innerWidth - viewportPadding - panelRect.width
      );
      const maxTop = Math.max(
        viewportPadding,
        window.innerHeight - viewportPadding - panelRect.height
      );

      let left =
        align === 'start'
          ? triggerRect.left
          : align === 'end'
            ? triggerRect.right - panelRect.width
            : triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
      let top =
        side === 'top'
          ? triggerRect.top - panelRect.height - offset
          : triggerRect.bottom + offset;

      left = Math.min(maxLeft, Math.max(viewportPadding, left));
      top = Math.min(maxTop, Math.max(viewportPadding, top));

      setPortalStyle({
        left,
        top,
        position: 'fixed',
        visibility: 'visible'
      });
    };

    let frameId: number | null = window.requestAnimationFrame(updatePosition);
    const scheduleUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
    };
  }, [align, offset, portal, side, viewportPadding, visible]);

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setFocused(false);
  };

  const panelBaseClass =
    'pointer-events-none rounded-xl border bg-[color:var(--color-tooltip-bg)] px-3 py-2 text-xs leading-6 text-[color:var(--color-tooltip-text)] shadow-2xl';
  const inlineSideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const inlineAlignClass =
    align === 'start'
      ? 'left-0'
      : align === 'end'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';
  const inlinePanelClass = `${inlineSideClass} ${inlineAlignClass}`;
  const panel = (
    <span
      ref={panelRef}
      className={`${panelBaseClass} ${
        portal ? 'z-[140] w-80 max-w-[min(24rem,calc(100vw-2rem))]' : `absolute z-30 w-80 max-w-[min(24rem,calc(100vw-2rem))] ${inlinePanelClass}`
      } ${panelClassName}`}
      style={
        portal
          ? {
              borderColor: 'var(--color-tooltip-border)',
              ...(portalStyle ?? {
                left: 0,
                position: 'fixed',
                top: 0,
                visibility: 'hidden'
              })
            }
          : { borderColor: 'var(--color-tooltip-border)' }
      }
    >
      {content}
    </span>
  );

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onBlur={handleBlur}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {visible && !portal ? panel : null}
      {visible && portal && typeof document !== 'undefined'
        ? createPortal(panel, document.body)
        : null}
    </span>
  );
}
