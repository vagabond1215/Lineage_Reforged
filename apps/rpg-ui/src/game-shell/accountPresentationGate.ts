/** Ephemeral presentation opt-in; never a stored account or Save preference. */
export function isAccountPresentationEnabled(
  development: boolean, welcomeEnabled: boolean, hostname: string, search: string
): boolean {
  return development && welcomeEnabled &&
    (hostname === '127.0.0.1' || hostname === 'localhost') &&
    new URLSearchParams(search).get('accountPresentation') === '1';
}
