import { useEffect, useLayoutEffect, useState } from 'react'
import { EmptyState } from './components/empty-state/empty-state.tsx'
import { MediaStage } from './components/media-stage/media-stage.tsx'
import { SpeedControl } from './components/speed-control/speed-control.tsx'
import { ThemeToggle, type ThemeMode } from './components/theme-toggle/theme-toggle.tsx'
import { Transport } from './components/transport/transport.tsx'
import { useKeyboardShortcuts } from './player/use-keyboard-shortcuts.ts'
import { usePlayer } from './player/use-player.ts'
import type { LoadedMedia } from './types.ts'

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * アプリ全体の読込状態と再生画面を組み立てる。
 * ファイル選択、メディア要素、再生 UI の境界をここで束ねることで、v1 の保存状態や
 * セクション状態を追加するときも画面全体の流れを一箇所で追えるようにする。
 */
function App() {
  const [loadedMedia, setLoadedMedia] = useState<LoadedMedia | null>(null)
  const [mediaElement, setMediaElement] = useState<HTMLMediaElement | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [seekStepSeconds, setSeekStepSeconds] = useState(5)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode)
  const player = usePlayer(mediaElement, playbackRate)

  useKeyboardShortcuts({
    isEnabled: Boolean(mediaElement),
    isPlaying: player.isPlaying,
    seekStepSeconds,
    onPause: player.pause,
    onPlay: player.play,
    onSeekBy: player.seekBy,
  })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  useEffect(() => {
    return () => {
      if (loadedMedia) {
        URL.revokeObjectURL(loadedMedia.url)
      }
    }
  }, [loadedMedia])

  function loadFile(file: File) {
    const kind = file.type.startsWith('video/') ? 'video' : 'audio'

    setMediaElement(null)
    setLoadedMedia({
      file,
      kind,
      url: URL.createObjectURL(file),
    })
    setPlaybackRate(1)
  }

  function resetMedia() {
    setMediaElement(null)
    setLoadedMedia(null)
    setPlaybackRate(1)
  }

  function toggleThemeMode() {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light')
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-studio-page text-studio-text">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-studio-border pb-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-studio-text-soft uppercase">
              pitch-safe practice deck
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-studio-text">
              Sound Studio
            </h1>
            {loadedMedia ? (
              <p className="mt-2 max-w-[min(44rem,100%)] truncate text-sm text-studio-text-muted">
                {loadedMedia.file.name}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {loadedMedia ? (
              <button
                className="touch-manipulation rounded-md border border-studio-border bg-studio-surface-raised px-3 py-2 text-sm font-medium text-studio-accent transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-page focus-visible:outline-none motion-reduce:transition-none"
                type="button"
                onClick={resetMedia}
              >
                別のファイルを開く
              </button>
            ) : null}
            <ThemeToggle themeMode={themeMode} onThemeModeToggle={toggleThemeMode} />
          </div>
        </header>

        {loadedMedia ? (
          <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="flex min-w-0 flex-col gap-4">
              <MediaStage loadedMedia={loadedMedia} onMediaElementChange={setMediaElement} />
              <Transport
                currentTime={player.currentTime}
                duration={player.duration}
                isPlaying={player.isPlaying}
                seekStepSeconds={seekStepSeconds}
                onPause={player.pause}
                onPlay={player.play}
                onSeek={player.seek}
                onSeekBackward={() => player.seekBy(-seekStepSeconds)}
                onSeekForward={() => player.seekBy(seekStepSeconds)}
                onSeekStepSecondsChange={setSeekStepSeconds}
              />
              <SpeedControl playbackRate={playbackRate} onPlaybackRateChange={setPlaybackRate} />
            </div>
            <aside className="flex min-h-72 flex-col rounded-lg border border-studio-border bg-studio-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-studio-text">セクション</h2>
                <span className="rounded-full bg-studio-surface-muted px-2 py-1 text-xs text-studio-text-muted">
                  0
                </span>
              </div>
              <div className="mt-5 grid flex-1 place-items-center rounded-md border border-dashed border-studio-border bg-studio-surface-muted px-4 py-8 text-center">
                <div>
                  <p className="text-sm font-medium text-studio-text-muted">未登録</p>
                  <p className="mt-2 text-xs text-studio-text-soft">A / B loop points</p>
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <EmptyState onFileSelected={loadFile} />
        )}
      </div>
    </main>
  )
}

export default App
