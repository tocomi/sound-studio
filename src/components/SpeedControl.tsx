type SpeedControlProps = {
  playbackRate: number
  onPlaybackRateChange: (playbackRate: number) => void
}

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
    <section className="rounded-lg border border-white/10 bg-neutral-900/80 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-neutral-200" htmlFor="speed-control">
          Speed
        </label>
        <input
          className="min-w-56 flex-1 touch-manipulation accent-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          id="speed-control"
          type="range"
          min="0.25"
          max="1.5"
          step="0.05"
          value={playbackRate}
          onChange={handlePlaybackRateChange}
        />
        <output
          className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-sm font-semibold text-cyan-200 tabular-nums"
          htmlFor="speed-control"
        >
          {playbackRate.toFixed(2)}x
        </output>
      </div>
    </section>
  )
}
