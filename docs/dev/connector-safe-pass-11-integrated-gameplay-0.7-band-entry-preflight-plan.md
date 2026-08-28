# Connector-Safe Pass 11 - Integrated Gameplay 0.7 Band-Entry Preflight Plan

Date: 2026-08-27

Status: ACTIVE

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only repository inspection

Source head: `2e2dfbb8451646711ca36ea9fc0616cbce6da156`

Protected active route: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

## Purpose

Prepare exact-head evidence for the installed docs-first `0.7.x` band-entry decision without deciding `BAND_ENTRY_READY` or `BAND_ENTRY_NOT_READY`.

## Questions

1. What are the exact accepted `0.7.0` entry criteria?
2. Which accepted current owners and tests are candidate evidence for each criterion?
3. Which claims were independently accepted by `0.6.11.1` and may be treated as accepted predecessor authority?
4. Which criteria still require fresh local executable verification in the band-entry decision?
5. Which protected historical readiness findings are stale, superseded, or still useful?
6. Which later-band requirements must not be imported into the `0.7` gate?
7. What is the smallest executable validation set capable of checking current gate facts without rerunning unrelated broad suites?
8. What Connector-prepared facts can Codex delta-check rather than rediscover?

## Success Criteria

- every `0.7.0` criterion receives an authority/evidence/candidate-status row;
- no final band-entry result is issued;
- accepted predecessor evidence is separated from claims requiring local re-verification;
- later `0.8.x`/`0.9.x`/`1.0.0` criteria are explicitly excluded;
- active prompt is unchanged;
- no production, schema, content, test, save, migration, dependency, branch, or PR mutation occurs.

## Expected Output

- `docs/dev/connector-preflight-integrated-gameplay-0.7-band-entry-evidence-packet.md`;
- completion appendix in this plan.
