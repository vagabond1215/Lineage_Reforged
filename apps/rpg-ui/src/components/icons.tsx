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
    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
