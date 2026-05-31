import { useEffect, useState } from 'react'
import { EmptyState } from './components/empty-state/empty-state.tsx'
import { MediaStage } from './components/media-stage/media-stage.tsx'
import { SpeedControl } from './components/speed-control/speed-control.tsx'
import { Transport } from './components/transport/transport.tsx'
import { usePlayer } from './player/use-player.ts'
import type { LoadedMedia } from './types.ts'

/**
 * アプリ全体の読込状態と再生画面を組み立てる。
 * ファイル選択、メディア要素、再生 UI の境界をここで束ねることで、v1 の保存状態や
 * セクション状態を追加するときも画面全体の流れを一箇所で追えるようにする。
 */
function App() {
  const [loadedMedia, setLoadedMedia] = useState<LoadedMedia | null>(null)
  const [mediaElement, setMediaElement] = useState<HTMLMediaElement | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const player = usePlayer(mediaElement, playbackRate)

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

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-white">Sound Studio</h1>
          </div>
          {loadedMedia ? (
            <button
              className="touch-manipulation rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-neutral-200 transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none motion-reduce:transition-none"
              type="button"
              onClick={resetMedia}
            >
              別のファイルを開く
            </button>
          ) : null}
        </header>

        {loadedMedia ? (
          <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="flex min-w-0 flex-col gap-4">
              <MediaStage loadedMedia={loadedMedia} onMediaElementChange={setMediaElement} />
              <Transport
                currentTime={player.currentTime}
                duration={player.duration}
                isPlaying={player.isPlaying}
                onPause={player.pause}
                onPlay={player.play}
                onSeek={player.seek}
              />
              <SpeedControl playbackRate={playbackRate} onPlaybackRateChange={setPlaybackRate} />
            </div>
            <aside className="rounded-lg border border-white/10 bg-neutral-900/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-neutral-100">セクション</h2>
                <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
                  v1
                </span>
              </div>
              <div className="mt-5 rounded-md border border-dashed border-white/10 px-4 py-8 text-sm leading-6 text-neutral-400">
                セクションのマーカー表示と区間ループは、v0 の再生コントロールを確認してから
                追加します。
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
