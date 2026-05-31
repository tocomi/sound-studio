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
    <section className="rounded-lg border border-white/10 bg-neutral-900/80 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          className="grid size-11 touch-manipulation place-items-center rounded-full bg-cyan-300 text-sm font-bold text-neutral-950 transition hover:bg-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:outline-none motion-reduce:transition-none"
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
        <div className="min-w-28 text-sm text-neutral-300 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="relative min-w-56 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-neutral-800" />
          <input
            className="relative z-10 w-full touch-manipulation accent-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
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
