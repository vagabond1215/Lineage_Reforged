import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Icon } from "../../components/icons";
import type {
  LauncherAccountDeletionResult,
  LauncherAuthResult,
  LocalAccountPickerEntry
} from "../launcherAuthManager.js";
import type { GameShellNotice } from "../state.js";
import { NoticeBanner } from "./NoticeBanner.js";

type LocalAccountAccessScreenProps = {
  mode: "pick_account" | "create_first_account";
  accounts: LocalAccountPickerEntry[];
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onSignIn: (options: {
    accountId: string;
    password: string;
    stayLoggedIn: boolean;
  }) => Promise<LauncherAuthResult>;
  onDeleteAccount: (options: {
    accountId: string;
    password: string;
  }) => Promise<LauncherAccountDeletionResult>;
  onCreateAccount: (options: {
    displayName: string;
    password: string;
    confirmPassword: string;
    stayLoggedIn: boolean;
  }) => Promise<LauncherAuthResult>;
  themeMode: "dark" | "light";
  onToggleThemeMode: () => void;
};

function formatLastPlayedAt(lastPlayedAt: string | undefined): string {
  if (!lastPlayedAt) {
    return "No journey recorded yet.";
  }

  const parsed = new Date(lastPlayedAt);

  if (Number.isNaN(parsed.valueOf())) {
    return "No journey recorded yet.";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(parsed);
}

export function LocalAccountAccessScreen({
  mode,
  accounts,
  notice,
  onDismissNotice,
  onSignIn,
  onDeleteAccount,
  onCreateAccount,
  themeMode,
  onToggleThemeMode
}: LocalAccountAccessScreenProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(mode === "create_first_account");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const [createStayLoggedIn, setCreateStayLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "create_first_account") {
      setShowCreateForm(true);
      return;
    }

    setShowCreateForm(false);
  }, [mode]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.accountId === selectedAccountId) ?? null,
    [accounts, selectedAccountId]
  );
  const headerButtonClass =
    "inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)]";

  const resetAccountForm = () => {
    setPassword("");
    setStayLoggedIn(false);
  };

  const resetCreateForm = () => {
    setDisplayName("");
    setCreatePassword("");
    setCreateConfirmPassword("");
    setCreateStayLoggedIn(false);
  };

  const handleSelectAccount = (accountId: string) => {
    setShowCreateForm(false);
    setSelectedAccountId((current) => (current === accountId ? null : accountId));
    resetAccountForm();
  };

  const handleShowCreateForm = () => {
    setSelectedAccountId(null);
    resetAccountForm();
    setShowCreateForm(true);
  };

  const handleHideCreateForm = () => {
    if (mode === "create_first_account") {
      return;
    }

    resetCreateForm();
    setShowCreateForm(false);
  };

  const submitSelectedAccount = async () => {
    if (!selectedAccount || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await onSignIn({
        accountId: selectedAccount.accountId,
        password,
        stayLoggedIn
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitAccountDeletion = async () => {
    if (!selectedAccount || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await onDeleteAccount({
        accountId: selectedAccount.accountId,
        password
      });
      resetAccountForm();
      setSelectedAccountId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const submitCreateAccount = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await onCreateAccount({
        displayName,
        password: createPassword,
        confirmPassword: createConfirmPassword,
        stayLoggedIn: createStayLoggedIn
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-auto p-4 sm:p-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-4">
        <div className="sticky top-0 z-30">
          <div className="rounded-[30px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 shadow-panel backdrop-blur-xl">
            <div className="relative flex min-h-[3.75rem] items-center justify-between gap-3">
              <div className="z-10 flex min-w-[10rem] items-center">
                {mode === "pick_account" ? (
                  showCreateForm ? (
                    <button
                      type="button"
                      onClick={handleHideCreateForm}
                      className={`${headerButtonClass} px-4 py-2 text-sm font-medium`}
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleShowCreateForm}
                      className={`${headerButtonClass} px-4 py-2 text-sm font-medium`}
                    >
                      Create Account
                    </button>
                  )
                ) : (
                  <div className="h-11 w-[9rem]" aria-hidden="true" />
                )}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <h1 className="text-center text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.06em] text-[color:var(--color-text-strong)]">
                  Account Login
                </h1>
              </div>

              <div className="z-10 flex min-w-[10rem] justify-end">
                <button
                  type="button"
                  onClick={onToggleThemeMode}
                  className={`${headerButtonClass} h-11 w-11`}
                  aria-label={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <Icon
                    name={themeMode === "dark" ? "sun" : "moon"}
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {notice && <NoticeBanner notice={notice} onDismiss={onDismissNotice} />}

        <div className="flex-1 space-y-4">
          {showCreateForm ? (
            <Card title="Create Account" accent="var(--color-world)">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                      Display Name
                    </div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="w-full rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-4 py-3 text-[color:var(--color-text-strong)] outline-none transition focus:border-[color:var(--color-border-strong)]"
                      placeholder="Wayfarer Account"
                      autoComplete="nickname"
                    />
                  </label>
                  <label className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                      Password
                    </div>
                    <input
                      type="password"
                      value={createPassword}
                      onChange={(event) => setCreatePassword(event.target.value)}
                      className="w-full rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-4 py-3 text-[color:var(--color-text-strong)] outline-none transition focus:border-[color:var(--color-border-strong)]"
                      autoComplete="new-password"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                      Confirm Password
                    </div>
                    <input
                      type="password"
                      value={createConfirmPassword}
                      onChange={(event) => setCreateConfirmPassword(event.target.value)}
                      className="w-full rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-4 py-3 text-[color:var(--color-text-strong)] outline-none transition focus:border-[color:var(--color-border-strong)]"
                      autoComplete="new-password"
                    />
                  </label>
                </div>

                <label className="flex items-center gap-3 text-sm text-[color:var(--color-text-soft)]">
                  <input
                    type="checkbox"
                    checked={createStayLoggedIn}
                    onChange={(event) => setCreateStayLoggedIn(event.target.checked)}
                    className="h-4 w-4 rounded border border-[color:var(--color-border-strong)]"
                  />
                  <span>Stay signed in</span>
                </label>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={submitCreateAccount}
                    disabled={submitting}
                    className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card accent="var(--color-world)">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {accounts.map((account) => {
                    const active = selectedAccountId === account.accountId;

                    return (
                      <button
                        key={account.accountId}
                        type="button"
                        onClick={() => handleSelectAccount(account.accountId)}
                        className={`flex min-h-[8.75rem] flex-col justify-between rounded-[24px] border p-5 text-left transition ${
                          active
                            ? "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] shadow-[0_18px_34px_rgba(15,23,42,0.12)]"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] hover:bg-[color:var(--color-surface-strong)]"
                        }`}
                      >
                        <div className="text-lg font-semibold text-[color:var(--color-text-strong)]">
                          {account.displayName}
                        </div>
                        <div className="text-sm text-[color:var(--color-text-soft)]">
                          {formatLastPlayedAt(account.lastPlayedAt)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {selectedAccount && (
                <Card
                  title={selectedAccount.displayName}
                  accent="var(--color-chronicle)"
                >
                  <div className="space-y-4">
                    <label className="block space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                        Password
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-4 py-3 text-[color:var(--color-text-strong)] outline-none transition focus:border-[color:var(--color-border-strong)]"
                        autoComplete="current-password"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-sm text-[color:var(--color-text-soft)]">
                      <input
                        type="checkbox"
                        checked={stayLoggedIn}
                        onChange={(event) => setStayLoggedIn(event.target.checked)}
                        className="h-4 w-4 rounded border border-[color:var(--color-border-strong)]"
                      />
                      <span>Stay signed in</span>
                    </label>

                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={submitAccountDeletion}
                        disabled={submitting}
                        className="rounded-full border border-rose-400/35 bg-rose-100/80 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-200/85 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete Account
                      </button>
                      <button
                        type="button"
                        onClick={submitSelectedAccount}
                        disabled={submitting}
                        className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Log In
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
