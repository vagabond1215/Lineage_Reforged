# Native-v3 exact-master HTTP response-path isolation

Date: 2026-11-11 (America/New_York). Unversioned diagnostic on fetched synchronized `master`/`origin/master` `097970f4e5266c2862d09b4cbfe80cded8adcc26`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`.

**Decision: `LOOPBACK_TCP_ACCESS_BLOCKED_IN_EXECUTION_ENVIRONMENT; EXACT_MASTER_BROWSER_GATE_OPEN`.** The tracked worktree was clean before the diagnostic; unrelated untracked worktrees were preserved. No security control was disabled and no server was exposed beyond `127.0.0.1`.

One interactive `pwsh -NoExit` PTY retained two registered task-owned Node processes across commands under process-control session `exact-master-http-isolation-20261111`:

| Server | PID | UTC start | Bind | Process-control state |
| --- | ---: | --- | --- | --- |
| Exact-master Vite development | 14932 | `2026-11-11T17:59:30.8514444Z` | `127.0.0.1:5214` strict | Live |
| Minimal `node:http` returning `200`, `x-diagnostic-server: minimal-node`, `minimal-node-ok` | 23160 | `2026-11-11T17:59:30.9937162Z` | `127.0.0.1:5215` | Live |

An elevated port query attributed both `Listen` sockets to the corresponding exact PIDs. Direct `curl.exe --noproxy '*'` requests to Vite and the minimal server each timed out after six and five seconds respectively: exit 28, HTTP code `000`, connection time `0.000000`, and no response headers. Separate bounded direct `TcpClient.ConnectAsync` attempts to each address were still incomplete and unconnected after three seconds. The tested command context had no `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, or `NO_PROXY` environment value in either case variant; proxy values were not printed. Thus the failure occurs before either server's HTTP response handler and is shared by Vite and the minimal server. The exact host network policy causing the timeout is not established.

No browser verification was attempted because no actual HTTP response was established. Development-v3 and compiled-preview-v2 ordinary-entry gates remain open; source or listener evidence does not satisfy them. `HOLD_SELECTED_ATOMIC_ACTIVATION` and `HOLD_STAGING_PUBLICATION` remain. No gameplay, real account/Save, hosted Site, Game-version, PR or branch action occurred.

`StopSession` reported both PIDs `stopped-after-escalation`; subsequent status showed zero live registered processes and exact PID checks found neither. CIM process-tree inspection remained unavailable. The PTY exited and the temporary minimal-server script was removed. The next trigger is an approved execution/browser environment where a task-owned loopback server yields a real HTTP response without weakening security controls; then rerun the two exact-master browser gates.
