# Conventions

- Components and hooks need concise JSDoc explaining what they do and why that unit/responsibility boundary exists.
- Match existing TypeScript/React naming and comment density; keep files scoped by concern (`MediaStage`, `Transport`, `SpeedControl`, etc.).
- State model: sections are always arrays, from v1 onward. Use the documented `Section`/`FileSettings` shapes.
- Playback realtime state such as `currentTime` belongs inside `usePlayer`/media element flows, not high-frequency React state.
- Persistent settings use localStorage; file identity key is `size + lastModified`, never filename. Filename is display-only.
- UI tone: dark, quiet, practice-focused, no waveform/key-shift/future features unless explicitly approved.