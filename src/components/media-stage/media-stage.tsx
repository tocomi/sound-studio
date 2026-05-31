import type { LoadedMedia } from '@/types.ts'

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
    <section className="overflow-hidden rounded-lg border border-studio-border bg-studio-surface-raised">
      {loadedMedia.kind === 'video' ? (
        <div className="relative bg-studio-media">
          <video
            className="aspect-video h-full w-full bg-black object-contain"
            controls={false}
            ref={onMediaElementChange}
            src={loadedMedia.url}
          />
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
            {/* 装飾用のバー。本物の波形表示は意図的に future scope として扱う。 */}
            <div className="mx-auto mt-8 flex h-16 max-w-sm items-end justify-center gap-1.5">
              {Array.from({ length: 21 }, (_, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-studio-border-strong"
                  style={{ height: `${22 + Math.abs(Math.sin(index * 1.7)) * 42}px` }}
                />
              ))}
            </div>
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
