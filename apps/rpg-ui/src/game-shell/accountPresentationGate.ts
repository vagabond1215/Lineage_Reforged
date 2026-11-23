/** Ephemeral presentation opt-in; never a stored account or Save preference. */
export function isAccountPresentationEnabled(
  development: boolean, welcomeEnabled: boolean, hostname: string, search: string
): boolean {
  return development && welcomeEnabled &&
    (hostname === '127.0.0.1' || hostname === 'localhost') &&
    new URLSearchParams(search).get('accountPresentation') === '1';
}

export function isWorldPresentationEnabled(
  development: boolean, welcomeEnabled: boolean, hostname: string, search: string
): boolean {
  return isAccountPresentationEnabled(development, welcomeEnabled, hostname, search) &&
    new URLSearchParams(search).get('worldPresentation') === '1';
}

export function isCompiledWorldReviewEntry(
  production: boolean, mode: string, ownerCompiled: boolean, hostname: string, pathname: string
): boolean {
  return production && mode === 'world-owner-review' && ownerCompiled &&
    (hostname === '127.0.0.1' || hostname === 'localhost') &&
    (pathname === '/' || pathname === '/index.html');
}

export function hasWorldReviewOptIn(search: string): boolean {
  const query = new URLSearchParams(search);
  return ['welcomeL1', 'accountPresentation', 'worldPresentation'].every(flag => {
    const values = query.getAll(flag);
    return values.length === 1 && values[0] === '1';
  });
}

export type SplashUiVersion = 'classic' | 'preview';

export function canSelectSplashUiVersion(
  nativeDevelopmentEntry: boolean, hostname: string, stagingEntry: boolean, qaEntry: boolean
): boolean {
  return nativeDevelopmentEntry && !stagingEntry && !qaEntry &&
    (hostname === '127.0.0.1' || hostname === 'localhost');
}

/** Build the replacement URL from the current origin and entry path. */
export function splashUiVersionUrl(current: URL, version: SplashUiVersion): URL {
  const target = new URL(current);
  const previewFlags = ['welcomeL1', 'accountPresentation', 'worldPresentation'];
  if (version === 'preview') {
    for (const flag of previewFlags) {
      const values = target.searchParams.getAll(flag);
      if (values.length !== 1 || values[0] !== '1') target.searchParams.set(flag, '1');
    }
  } else {
    for (const flag of [...previewFlags, 'familyPresentation']) {
      if (target.searchParams.has(flag)) target.searchParams.delete(flag);
    }
  }
  return target;
}
