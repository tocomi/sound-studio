import { Repeat2 } from 'lucide-react'

type TransportProps = {
  currentTime: number
  duration: number
  isLoopEnabled: boolean
  isPlaying: boolean
  seekStepSeconds: number
  onLoopToggle: (enabled?: boolean) => void
  onPause: () => void
  onPlay: () => void
  onSeek: (time: number) => void
  onSeekBackward: () => void
  onSeekForward: () => void
  onSeekStepSecondsChange: (seekStepSeconds: number) => void
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
  isLoopEnabled,
  isPlaying,
  seekStepSeconds,
  onLoopToggle,
  onPause,
  onPlay,
  onSeek,
  onSeekBackward,
  onSeekForward,
  onSeekStepSecondsChange,
}: TransportProps) {
  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    onSeek(Number(event.target.value))
  }

  function handleSeekStepChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextSeekStepSeconds = Number(event.target.value)

    if (Number.isFinite(nextSeekStepSeconds)) {
      onSeekStepSecondsChange(Math.min(Math.max(nextSeekStepSeconds, 1), 30))
    }
  }

  return (
    <section className="rounded-lg border border-studio-border bg-studio-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          className="grid size-10 touch-manipulation place-items-center rounded-full bg-studio-accent text-sm font-bold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none"
          type="button"
          aria-label={isPlaying ? '停止' : '再生'}
          aria-pressed={isPlaying}
          title={isPlaying ? '停止' : '再生'}
          onClick={isPlaying ? onPause : onPlay}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {isPlaying ? 'II' : '▶'}
          </span>
        </button>
        <div className="min-w-24 text-sm font-medium text-studio-text-muted tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="relative min-w-40 flex-1">
          <input
            className="range-control w-full touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-border-strong"
            type="range"
            data-shortcut-arrows="seek"
            aria-label="再生位置"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(currentTime, duration || currentTime)}
            onChange={handleSeek}
          />
        </div>
        <div className="flex h-9 items-center overflow-hidden rounded-md border border-studio-border bg-studio-surface-raised">
          <button
            className="grid h-9 w-10 touch-manipulation place-items-center border-r border-studio-border text-sm font-bold text-studio-text-muted transition hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none focus-visible:ring-inset motion-reduce:transition-none"
            type="button"
            aria-label={`${seekStepSeconds}秒戻る`}
            title={`← ${seekStepSeconds}秒戻る`}
            onClick={onSeekBackward}
          >
            <span aria-hidden="true" className="leading-none">
              ←
            </span>
          </button>
          <label className="flex h-9 items-center gap-1.5 px-2 text-sm font-medium text-studio-text-muted">
            <input
              className="w-9 bg-transparent text-center font-semibold text-studio-text tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-border-strong"
              type="number"
              name="seek-step-seconds"
              autoComplete="off"
              inputMode="numeric"
              min="1"
              max="30"
              step="1"
              aria-label="巻き戻し・早送りの秒数"
              value={seekStepSeconds}
              onChange={handleSeekStepChange}
            />
            <span>sec</span>
          </label>
          <button
            className="grid h-9 w-10 touch-manipulation place-items-center border-l border-studio-border text-sm font-bold text-studio-text-muted transition hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none focus-visible:ring-inset motion-reduce:transition-none"
            type="button"
            aria-label={`${seekStepSeconds}秒進む`}
            title={`→ ${seekStepSeconds}秒進む`}
            onClick={onSeekForward}
          >
            <span aria-hidden="true" className="leading-none">
              →
            </span>
          </button>
        </div>
        <button
          className={
            isLoopEnabled
              ? 'flex h-9 touch-manipulation items-center gap-1.5 rounded-md bg-studio-accent px-3 text-sm font-semibold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
              : 'flex h-9 touch-manipulation items-center gap-1.5 rounded-md border border-studio-border bg-studio-surface-raised px-3 text-sm font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
          }
          type="button"
          aria-label={isLoopEnabled ? '区間ループをOFFにする' : '区間ループをONにする'}
          aria-pressed={isLoopEnabled}
          title={isLoopEnabled ? 'Loop ON' : 'Loop OFF'}
          onClick={() => onLoopToggle()}
        >
          <Repeat2 aria-hidden="true" size={16} strokeWidth={2.2} />
          <span>Loop</span>
        </button>
      </div>
    </section>
  )
}
