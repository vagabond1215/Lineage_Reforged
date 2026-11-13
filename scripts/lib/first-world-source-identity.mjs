/**
 * Verify the audited Git blob without treating platform text checkout EOL
 * translation as a change to the canonical source. Only exact bytes or a
 * *pure CRLF/LF conversion* are allowed. Any changed character/feature holds.
 */
import {createHash} from 'node:crypto';

export function gitBlobSha(input) {
  const bytes = Buffer.from(input);
  return createHash('sha1')
    .update('blob ' + bytes.length + String.fromCharCode(0))
    .update(bytes)
    .digest('hex');
}

export function verifyAuditedTextBlob(input, expectedSha) {
  if (!/^[a-f0-9]{40}$/.test(expectedSha ?? ''))
    throw Error('Invalid audited Git blob SHA');
  const bytes = Buffer.from(input);
  const rawSha = gitBlobSha(bytes);
  if (rawSha === expectedSha)
    return {verifiedSha: expectedSha, checkoutSha: rawSha, mode: 'exact_bytes'};

  const text = bytes.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(bytes))
    throw Error('Geometry source contains non-UTF8 bytes; refuse checkout equivalence');

  const alternatives = [
    ['checkout_crlf_to_lf', text.replace(/\r\n/g, '\n')],
    ['checkout_lf_to_crlf', text.replace(/(?<!\r)\n/g, '\r\n')],
  ];
  for (const [mode, normalized] of alternatives) {
    if (normalized === text) continue;
    if (gitBlobSha(Buffer.from(normalized, 'utf8')) === expectedSha)
      return {verifiedSha: expectedSha, checkoutSha: rawSha, mode};
  }

  throw Error('Geometry blob changed from audited PR #78 head; rebase evidence before proceeding');
}
