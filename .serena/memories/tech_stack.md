# Tech Stack

- TypeScript + React 19. React Compiler is enabled; avoid defensive/manual `useMemo`/`useCallback` unless there is a concrete need.
- Vite app, Storybook available for components.
- Package manager: pnpm only. Node/pnpm are pinned by mise: Node 24.16.0, pnpm 10.22.0.
- Native media elements are the audio engine. Do not add wavesurfer.js, Web Audio DSP, or external state libraries for v1.
- Tooling: tsgo for typecheck/build, oxlint for lint, oxfmt for formatting, lefthook pre-commit runs lint + format check.