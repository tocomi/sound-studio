type SpeedControlProps = {
  playbackRate: number
  onPlaybackRateChange: (playbackRate: number) => void
}

const speedPresets = [0.5, 0.75, 1, 1.25]

/**
 * 再生 speed の調整 UI を表示する。
 * v1 でグローバル speed とセクション別 speed に分かれても、速度調整 UI の責務を
 * 再生エンジンやセクション一覧へ漏らさないために分けている。
 */
export function SpeedControl({ playbackRate, onPlaybackRateChange }: SpeedControlProps) {
  function handlePlaybackRateChange(event: React.ChangeEvent<HTMLInputElement>) {
    onPlaybackRateChange(Number(event.target.value))
  }

  return (
    <section className="rounded-lg border border-studio-border bg-studio-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-studio-text" htmlFor="speed-control">
          Speed
        </label>
        <div className="flex flex-wrap gap-2">
          {speedPresets.map((speedPreset) => {
            const isSelected = playbackRate === speedPreset

            return (
              <button
                key={speedPreset}
                className={
                  isSelected
                    ? 'h-9 min-w-16 rounded-md bg-studio-accent px-3 text-sm font-semibold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
                    : 'h-9 min-w-16 rounded-md border border-studio-border bg-studio-surface-raised px-3 text-sm font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
                }
                type="button"
                aria-pressed={isSelected}
                onClick={() => onPlaybackRateChange(speedPreset)}
              >
                {speedPreset.toFixed(speedPreset % 1 === 0 ? 0 : 2)}x
              </button>
            )
          })}
        </div>
        <input
          className="range-control min-w-56 flex-1 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-border-strong"
          id="speed-control"
          type="range"
          min="0.25"
          max="1.5"
          step="0.05"
          value={playbackRate}
          onChange={handlePlaybackRateChange}
        />
        <output
          className="min-w-16 rounded-md bg-studio-surface-muted px-3 py-2 text-center text-sm font-semibold text-studio-text tabular-nums"
          htmlFor="speed-control"
        >
          {playbackRate.toFixed(2)}x
        </output>
      </div>
    </section>
  )
}
