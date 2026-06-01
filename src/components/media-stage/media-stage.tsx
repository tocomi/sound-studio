import type { LoadedMedia } from '@/types.ts'
import { useWaveformPeaks } from '@/waveform/use-waveform-peaks.ts'

import { WaveformDisplay } from '../waveform-display/waveform-display.tsx'

type MediaStageProps = {
  currentTime: number
  duration: number
  loadedMedia: LoadedMedia
  mediaElement: HTMLMediaElement | null
  onMediaElementChange: (mediaElement: HTMLMediaElement | null) => void
}

/**
 * 読み込んだ動画または音声の表示領域を描画する。
 * 動画と音声の表示差分をこの境界に閉じ込め、再生制御側をメディア種別から独立させるために分けている。
 */
export function MediaStage({
  currentTime,
  duration,
  loadedMedia,
  mediaElement,
  onMediaElementChange,
}: MediaStageProps) {
  const waveform = useWaveformPeaks(loadedMedia.file)

  return (
    <section className="overflow-hidden rounded-lg border border-studio-border bg-studio-surface-raised">
      {loadedMedia.kind === 'video' ? (
        <div className="bg-studio-media">
          <video
            className="aspect-video h-full w-full bg-black object-contain"
            controls={false}
            ref={onMediaElementChange}
            src={loadedMedia.url}
          />
          <div className="bg-studio-surface-muted px-4 py-3">
            <WaveformDisplay
              className="mt-0 h-20 max-w-none"
              currentTime={currentTime}
              duration={duration}
              error={waveform.error}
              isLoading={waveform.isLoading}
              mediaElement={mediaElement}
              peaks={waveform.peaks}
            />
          </div>
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center bg-studio-surface-muted px-6 py-12">
          <div className="w-full max-w-lg text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-studio-text-soft uppercase">
              audio file
            </p>
            <p className="wrap-break-words mt-3 text-2xl font-semibold text-studio-text">
              {loadedMedia.file.name}
            </p>
            <WaveformDisplay
              currentTime={currentTime}
              duration={duration}
              error={waveform.error}
              isLoading={waveform.isLoading}
              mediaElement={mediaElement}
              peaks={waveform.peaks}
            />
            <audio
              className="sr-only"
              controls={false}
              ref={onMediaElementChange}
              src={loadedMedia.url}
            />
          </div>
        </div>
      )}
    </section>
  )
}
