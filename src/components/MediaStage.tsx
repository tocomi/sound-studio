import type { LoadedMedia } from '../types.ts'

type MediaStageProps = {
  loadedMedia: LoadedMedia
  onMediaElementChange: (mediaElement: HTMLMediaElement | null) => void
}

/**
 * 読み込んだ動画または音声の表示領域を描画する。
 * 動画と音声の表示差分をこの境界に閉じ込め、再生制御側をメディア種別から独立させるために分けている。
 */
export function MediaStage({ loadedMedia, onMediaElementChange }: MediaStageProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-black">
      {loadedMedia.kind === 'video' ? (
        <video
          className="aspect-video h-full w-full bg-black object-contain"
          controls={false}
          ref={onMediaElementChange}
          src={loadedMedia.url}
        />
      ) : (
        <div className="grid min-h-72 place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_55%)] px-6 py-12">
          <div className="w-full max-w-lg text-center">
            <p className="text-sm font-medium text-cyan-300">音声ファイル</p>
            <p className="wrap-break-words mt-3 text-2xl font-semibold text-white">
              {loadedMedia.file.name}
            </p>
            <audio
              className="mt-8 w-full"
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
