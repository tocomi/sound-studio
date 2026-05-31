type TransportProps = {
  currentTime: number
  duration: number
  isPlaying: boolean
  onPause: () => void
  onPlay: () => void
  onSeek: (time: number) => void
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return '0:00'
  }

  const totalSeconds = Math.max(0, Math.floor(time))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 再生、停止、シーク、時刻表示をまとめて表示する。
 * 練習中に最も頻繁に触る再生操作を一つの面にまとめ、v1 の区間マーカー追加時も
 * シーク周辺の責務を局所化できるようにするために分けている。
 */
export function Transport({
  currentTime,
  duration,
  isPlaying,
  onPause,
  onPlay,
  onSeek,
}: TransportProps) {
  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    onSeek(Number(event.target.value))
  }

  return (
    <section className="rounded-lg border border-studio-border bg-studio-surface p-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          className="grid size-12 touch-manipulation place-items-center rounded-full bg-studio-accent text-sm font-bold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none"
          type="button"
          aria-label={isPlaying ? '停止' : '再生'}
          aria-pressed={isPlaying}
          title={isPlaying ? '停止' : '再生'}
          onClick={isPlaying ? onPause : onPlay}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            {isPlaying ? 'II' : '▶'}
          </span>
        </button>
        <div className="min-w-28 text-sm font-medium text-studio-text-muted tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="relative min-w-56 flex-1">
          <input
            className="range-control w-full touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-border-strong"
            type="range"
            aria-label="再生位置"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(currentTime, duration || currentTime)}
            onChange={handleSeek}
          />
        </div>
      </div>
    </section>
  )
}
