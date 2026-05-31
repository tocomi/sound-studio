import { useEffect, useState } from 'react'

import { AppHeader } from '@/components/app-header/app-header.tsx'
import { EmptyState } from '@/components/empty-state/empty-state.tsx'
import { MediaStage } from '@/components/media-stage/media-stage.tsx'
import { SectionList } from '@/components/section-list/section-list.tsx'
import { SpeedControl } from '@/components/speed-control/speed-control.tsx'
import { Transport } from '@/components/transport/transport.tsx'
import { useKeyboardShortcuts } from '@/player/use-keyboard-shortcuts.ts'
import { usePlayer } from '@/player/use-player.ts'
import { useTheme } from '@/theme/use-theme.ts'
import type { LoadedMedia } from '@/types.ts'

/**
 * アプリ全体の読込状態と再生画面を組み立てる。
 * ファイル選択・メディア要素・再生 UI の境界をここで束ねることで、v1 の保存状態や
 * セクション状態を追加するときも画面全体の流れを一箇所で追えるようにする。
 */
function App() {
  const [loadedMedia, setLoadedMedia] = useState<LoadedMedia | null>(null)
  const [mediaElement, setMediaElement] = useState<HTMLMediaElement | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [seekStepSeconds, setSeekStepSeconds] = useState(5)
  const { themeMode, toggleThemeMode } = useTheme()
  const player = usePlayer(mediaElement, playbackRate)

  useKeyboardShortcuts({
    isEnabled: Boolean(mediaElement),
    isPlaying: player.isPlaying,
    seekStepSeconds,
    onPause: player.pause,
    onPlay: player.play,
    onSeekBy: player.seekBy,
  })

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
    <main className="min-h-dvh overflow-hidden bg-studio-page text-studio-text">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8">
        <AppHeader
          fileName={loadedMedia?.file.name ?? null}
          themeMode={themeMode}
          onResetMedia={resetMedia}
          onThemeModeToggle={toggleThemeMode}
        />

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
            <SectionList />
          </section>
        ) : (
          <EmptyState onFileSelected={loadFile} />
        )}
      </div>
    </main>
  )
}

export default App
