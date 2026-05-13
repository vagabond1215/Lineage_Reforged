import { Icon } from '../icons';
import { Tooltip } from './Tooltip';

type FavoriteButtonProps = {
  active: boolean;
  onToggle: () => void;
};

export function FavoriteButton({ active, onToggle }: FavoriteButtonProps) {
  return (
    <Tooltip content={active ? 'Remove pin' : 'Pin for quick access'}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`forged-icon-button p-2 transition ${
          active
            ? 'forged-tone-accent'
            : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]'
        }`}
        aria-label={active ? 'Remove pin' : 'Pin item'}
      >
        <Icon name={active ? 'pinFilled' : 'pin'} className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}
