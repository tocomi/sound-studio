# Core

- Single-page local media practice tool: open video/audio, slow down with pitch preserved, register named loop sections for focused practice.
- Product scope and exclusions live in `docs/PRODUCT.md`; UI flows/tone in `docs/DESIGN.md`; architectural invariants in `docs/ARCHITECTURE.md`.
- Read `mem:tech_stack` for framework/build pins, `mem:conventions` for component/state rules, `mem:task_completion` before finishing code changes, and `mem:suggested_commands` for common commands.
- v1 deliberately excludes waveform display, pitch shift/key change, URL import, loop count, file body persistence, DAW/editing/recording features.
- Source map: `src/app.tsx` app shell, `src/components/*` presentational UI, `src/player/use-player.ts` media element wrapper, `src/types.ts` shared data types, global styling in `src/index.css`.