/** Fresh-format consumable request receipts; v2 save records are not converted. */
export type NativeFungibleUseLedger = {
  version: 1;
  revision: number;
  receipts: { requestId: string; fingerprint: string }[];
};

export function createNativeFungibleUseLedger(): NativeFungibleUseLedger {
  return { version: 1, revision: 0, receipts: [] };
}

export function isNativeFungibleUseLedger(value: unknown): value is NativeFungibleUseLedger {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const ledger = value as Record<string, unknown>;
  if (Object.keys(ledger).sort().join(',') !== 'receipts,revision,version' ||
    ledger.version !== 1 || !Number.isSafeInteger(ledger.revision) || Number(ledger.revision) < 0 ||
    !Array.isArray(ledger.receipts) || ledger.receipts.length !== ledger.revision) return false;
  const ids = new Set<string>();
  for (const raw of ledger.receipts) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
    const receipt = raw as Record<string, unknown>;
    if (Object.keys(receipt).sort().join(',') !== 'fingerprint,requestId' ||
      typeof receipt.requestId !== 'string' || !receipt.requestId.trim() ||
      receipt.requestId !== receipt.requestId.trim() || ids.has(receipt.requestId) ||
      typeof receipt.fingerprint !== 'string' || !receipt.fingerprint) return false;
    ids.add(receipt.requestId);
  }
  return true;
}
