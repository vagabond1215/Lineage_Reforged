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
        className={`rounded-full border p-2 transition ${
          active
            ? 'border-amber-300/30 bg-amber-300/14 text-amber-200'
            : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
        }`}
        aria-label={active ? 'Remove pin' : 'Pin item'}
      >
        <Icon name={active ? 'pinFilled' : 'pin'} className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}
