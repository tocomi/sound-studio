import { useEffect, useState } from 'react'

import { AppHeader } from '@/components/app-header/app-header.tsx'
import { EmptyState } from '@/components/empty-state/empty-state.tsx'
import { MediaStage } from '@/components/media-stage/media-stage.tsx'
import { SectionList } from '@/components/section-list/section-list.tsx'
import { SpeedControl } from '@/components/speed-control/speed-control.tsx'
import { Transport } from '@/components/transport/transport.tsx'
import { VolumeControl } from '@/components/volume-control/volume-control.tsx'
import { useKeyboardShortcuts } from '@/player/use-keyboard-shortcuts.ts'
import { usePlayer } from '@/player/use-player.ts'
import { useVolumePreference } from '@/player/use-volume-preference.ts'
import { DEFAULT_SEEK_STEP_SECONDS } from '@/settings/file-settings-defaults.ts'
import { useFileSettingsActions, useFileSettingsState } from '@/state/file-settings-provider.tsx'
import { selectedSection } from '@/state/file-settings-reducer.ts'
import { useTheme } from '@/theme/use-theme.ts'

/**
 * アプリ全体の読込状態と再生画面を組み立てる。
 * ファイル選択・メディア要素・再生 UI の境界をここで束ねることで、v1 の保存状態や
 * セクション状態を追加するときも画面全体の流れを一箇所で追えるようにする。
 */
function App() {
  const [mediaElement, setMediaElement] = useState<HTMLMediaElement | null>(null)
  const fileSettingsState = useFileSettingsState()
  const fileSettingsActions = useFileSettingsActions()
  const { fileSettings, isLoopEnabled, loadedMedia } = fileSettingsState
  const activeSection = selectedSection(fileSettingsState)
  const playbackRate = activeSection?.speed ?? fileSettings?.globalSpeed ?? 1
  const seekStepSeconds = fileSettings?.seekStepSeconds ?? DEFAULT_SEEK_STEP_SECONDS
  const sectionMarkers =
    fileSettings?.sections.map((section) => ({
      end: section.end,
      id: section.id,
      isActive: section.id === activeSection?.id,
      name: section.name,
      start: section.start,
    })) ?? []
  const loopRange =
    activeSection && isLoopEnabled ? { start: activeSection.start, end: activeSection.end } : null
  const { themeMode, toggleThemeMode } = useTheme()
  const volumePreference = useVolumePreference()
  const player = usePlayer(
    mediaElement,
    playbackRate,
    volumePreference.volume,
    volumePreference.isMuted,
    loopRange,
  )

  useKeyboardShortcuts({
    isEnabled: Boolean(mediaElement),
    isPlaying: player.isPlaying,
    seekStepSeconds,
    onPause: player.pause,
    onPlay: player.play,
    onSeekBy: player.seekBy,
    onVolumeChangeBy: volumePreference.changeVolumeBy,
  })

  useEffect(() => {
    return () => {
      if (loadedMedia) {
        URL.revokeObjectURL(loadedMedia.url)
      }
    }
  }, [loadedMedia])

  function loadFile(file: File) {
    setMediaElement(null)
    fileSettingsActions.loadFile(file)
  }

  function resetMedia() {
    setMediaElement(null)
    fileSettingsActions.clearFile()
  }

  function changePlaybackRate(nextPlaybackRate: number) {
    if (activeSection) {
      fileSettingsActions.updateSection(
        activeSection.id,
        { speed: nextPlaybackRate },
        player.duration,
      )
      return
    }

    fileSettingsActions.setGlobalSpeed(nextPlaybackRate)
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
            <div className="flex min-w-0 flex-col gap-3">
              <MediaStage
                currentTime={player.currentTime}
                duration={player.duration}
                loadedMedia={loadedMedia}
                mediaElement={mediaElement}
                onMediaElementChange={setMediaElement}
              />
              <Transport
                currentTime={player.currentTime}
                duration={player.duration}
                isLoopEnabled={isLoopEnabled}
                isPlaying={player.isPlaying}
                sectionMarkers={sectionMarkers}
                seekStepSeconds={seekStepSeconds}
                onLoopToggle={fileSettingsActions.toggleLoop}
                onPause={player.pause}
                onPlay={player.play}
                onSeek={player.seek}
                onSeekBackward={() => player.seekBy(-seekStepSeconds)}
                onSeekForward={() => player.seekBy(seekStepSeconds)}
                onSeekStepSecondsChange={fileSettingsActions.setSeekStepSeconds}
              />
              <div className="grid gap-3 lg:grid-cols-[max-content_minmax(18rem,1fr)]">
                <SpeedControl
                  playbackRate={playbackRate}
                  onPlaybackRateChange={changePlaybackRate}
                />
                <VolumeControl
                  isMuted={volumePreference.isMuted}
                  volume={volumePreference.volume}
                  onMutedToggle={volumePreference.toggleMuted}
                  onVolumeChange={volumePreference.changeVolume}
                />
              </div>
            </div>
            <SectionList
              currentTime={player.currentTime}
              duration={player.duration}
              isLoopEnabled={isLoopEnabled}
              onSectionActivated={(start) => {
                player.seek(start)
                void player.play()
              }}
            />
          </section>
        ) : (
          <EmptyState onFileSelected={loadFile} />
        )}
      </div>
    </main>
  )
}

export default App
