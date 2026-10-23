export function getNextCharacterSectionIndex(key: string, index: number, count: number): number | null {
  if (count === 0) return null;
  if (key === 'ArrowRight') return Math.min(index + 1, count - 1);
  if (key === 'ArrowLeft') return Math.max(index - 1, 0);
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}
