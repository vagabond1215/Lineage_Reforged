import type { IconName } from '../types';

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  const shared = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
    className
  };

  switch (name) {
    case 'character':
      return (
        <svg {...shared}>
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'world':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 10h17" />
          <path d="M6 6.5c2.5 1.8 4 4.8 4 8.5s-1.5 6.7-4 8.5" />
          <path d="M18 6.5c-2.5 1.8-4 4.8-4 8.5s1.5 6.7 4 8.5" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...shared}>
          <path d="M4 15h4l2-7 4 12 2-5h4" />
        </svg>
      );
    case 'codex':
      return (
        <svg {...shared}>
          <path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 0-3 3Z" />
          <path d="M6 4v16a3 3 0 0 1 3-3h9" />
        </svg>
      );
    case 'quests':
      return (
        <svg {...shared}>
          <path d="M6 4h9l3 3v13H6Z" />
          <path d="M15 4v4h4" />
          <path d="m9 15 2 2 4-5" />
        </svg>
      );
    case 'chronicle':
      return (
        <svg {...shared}>
          <path d="M8 4v16" />
          <path d="M16 4v16" />
          <path d="M5 8h14" />
          <path d="M5 16h14" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...shared}>
          <path d="M15 18H9" />
          <path d="M18 16H6l1.2-1.4A4.5 4.5 0 0 0 8 11.7V10a4 4 0 1 1 8 0v1.7a4.5 4.5 0 0 0 .8 2.6Z" />
        </svg>
      );
    case 'search':
      return (
        <svg {...shared}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...shared}>
          <path d="m14 4 6 6-3 1-3 7-4-4-7 3 7-7 1-3Z" />
        </svg>
      );
    case 'pinFilled':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="m14.8 3.3 5.9 5.9-3.3 1.1-3.2 7.6-4.8-4.8-7.6 3.2 8.7-8.7 1.1-3.3Z" />
        </svg>
      );
    case 'mapPin':
      return (
        <svg {...shared}>
          <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'coin':
      return (
        <svg {...shared}>
          <ellipse cx="12" cy="7" rx="6.5" ry="3.5" />
          <path d="M5.5 7v7c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5V7" />
          <path d="M5.5 10.5c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...shared}>
          <path d="M12 20s-7-4.7-7-10.3A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 2.7C19 15.3 12 20 12 20Z" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...shared}>
          <path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...shared}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...shared}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7.8A4 4 0 0 1 12 4a4 4 0 0 1 4 3.8V10" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...shared}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );
    case 'queue':
      return (
        <svg {...shared}>
          <rect x="4" y="5" width="16" height="3" rx="1.5" />
          <rect x="4" y="10.5" width="16" height="3" rx="1.5" />
          <rect x="4" y="16" width="10" height="3" rx="1.5" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...shared}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...shared}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'star':
      return (
        <svg {...shared}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="2.8" />
          <path d="M12 2.9v2.2" />
          <path d="M12 18.9v2.2" />
          <path d="m4.9 4.9 1.6 1.6" />
          <path d="m17.5 17.5 1.6 1.6" />
          <path d="M2.9 12h2.2" />
          <path d="M18.9 12h2.2" />
          <path d="m4.9 19.1 1.6-1.6" />
          <path d="m17.5 6.5 1.6-1.6" />
          <path d="m9.5 4.4 1-1.8" />
          <path d="m13.5 21.4 1-1.8" />
          <path d="m4.4 9.5-1.8-1" />
          <path d="m21.4 13.5-1.8-1" />
          <path d="m4.4 14.5-1.8 1" />
          <path d="m21.4 10.5-1.8 1" />
          <path d="m9.5 19.6 1 1.8" />
          <path d="m13.5 2.6 1 1.8" />
        </svg>
      );
    case 'closeCircle':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6" />
          <path d="m15 9-6 6" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...shared}>
          <path d="M5 7h14" />
          <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
          <path d="M7.2 7.8 8 19a2 2 0 0 0 2 1.8h4a2 2 0 0 0 2-1.8l.8-11.2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case 'arrowLeft':
      return (
        <svg {...shared}>
          <path d="m15 6-6 6 6 6" />
          <path d="M9 12h10" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...shared}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4" />
          <path d="M12 19.1v2.4" />
          <path d="m5.4 5.4 1.7 1.7" />
          <path d="m16.9 16.9 1.7 1.7" />
          <path d="M2.5 12h2.4" />
          <path d="M19.1 12h2.4" />
          <path d="m5.4 18.6 1.7-1.7" />
          <path d="m16.9 7.1 1.7-1.7" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...shared}>
          <path d="M16.7 4.8a7.8 7.8 0 1 0 2.5 14.8A8.7 8.7 0 0 1 16.7 4.8Z" />
        </svg>
      );
    case 'dice':
      return (
        <svg {...shared}>
          <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
          <circle cx="9" cy="9" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="9" cy="15" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'tree':
      return (
        <svg {...shared}>
          <path d="M12 4 7.5 9.5h2.4L7 13h2.7L8 17h8l-1.7-4H17l-2.9-3.5h2.4Z" />
          <path d="M12 17v4" />
        </svg>
      );
    case 'grain':
      return (
        <svg {...shared}>
          <path d="M12 4v16" />
          <path d="M9.5 6.2c-1.5.5-2.6 1.8-3.1 3.3 1.6-.1 3-.9 3.9-2.2" />
          <path d="M14.5 7.2c1.6.1 3 1 3.9 2.2-1.6.2-3-.6-3.9-1.8" />
          <path d="M9.3 10.2c-1.8.1-3.3 1-4.3 2.5 1.9.2 3.6-.5 4.7-1.9" />
          <path d="M14.7 11.1c1.8.1 3.3 1 4.3 2.5-1.9.2-3.6-.5-4.7-1.9" />
          <path d="M9.6 14.6c-1.4.2-2.6 1-3.4 2.2 1.5.2 2.9-.3 3.8-1.3" />
          <path d="M14.4 15.4c1.4.2 2.6 1 3.4 2.2-1.5.2-2.9-.3-3.8-1.3" />
        </svg>
      );
    case 'fruit':
      return (
        <svg {...shared}>
          <path d="M12 8c2.9-2.8 7.4-1.6 8 2.5.7 4.8-3 8.5-8 8.5s-8.7-3.7-8-8.5C4.6 6.4 9.1 5.2 12 8Z" />
          <path d="M12 8c-.2-1.9.5-3.7 1.9-5" />
          <path d="M12 8c-1.8-.8-3.9-.8-5.7 0" />
        </svg>
      );
    case 'vegetable':
      return (
        <svg {...shared}>
          <path d="M12 7c3.8 0 6.6 3 6.2 6.7-.4 3.4-3.2 5.8-6.2 5.8s-5.8-2.4-6.2-5.8C5.4 10 8.2 7 12 7Z" />
          <path d="M12 7c-.2-1.8.4-3.7 1.7-5" />
          <path d="M10.8 5.4C9 4.9 7.1 5 5.4 5.9" />
          <path d="M13.4 5.5c1.7-.7 3.7-.7 5.2.2" />
        </svg>
      );
    case 'animal':
      return (
        <svg {...shared}>
          <path d="M7.2 11.2a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z" />
          <path d="M16.8 11.2a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z" />
          <path d="M12 19c3.9 0 6.8-2.3 6.8-5.1 0-2.1-1.7-3.6-4.2-3.6-1.1 0-1.8.4-2.6 1.1-.8-.7-1.5-1.1-2.6-1.1-2.5 0-4.2 1.5-4.2 3.6C5.2 16.7 8.1 19 12 19Z" />
          <circle cx="10" cy="14.2" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="14" cy="14.2" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
