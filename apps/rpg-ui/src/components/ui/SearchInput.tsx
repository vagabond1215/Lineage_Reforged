import { Icon } from '../icons';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <label className="forged-input flex items-center gap-3 px-3 py-2 text-sm text-[color:var(--color-text-secondary)]">
      <Icon name="search" className="h-4 w-4 text-[color:var(--color-text-muted)]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-muted)]"
      />
    </label>
  );
}
