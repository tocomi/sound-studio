# Task Completion

- Before committing or handing off substantial code changes, run `pnpm lint` and `pnpm format`; AGENTS.md explicitly asks these before commits.
- Run `pnpm typecheck` or `pnpm build` when TypeScript/API surface changes. Prefer `pnpm build` for final verification when time permits.
- For UI changes, inspect in a real browser at Vite dev URL and check desktop/mobile layouts for overflow or illegible controls.
- If tooling cannot run because of sandbox/network/environment issues, report the skipped command and reason.