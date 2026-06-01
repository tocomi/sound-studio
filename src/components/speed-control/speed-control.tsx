type SpeedControlProps = {
  playbackRate: number
  onPlaybackRateChange: (playbackRate: number) => void
}

const speedPresets = [0.5, 0.75, 1, 1.25]

/**
 * 再生 speed のプリセット操作を表示する。
 * 練習中に使う速度をボタンへ絞り、グローバル speed とセクション別 speed の保存先を
 * 再生エンジンやセクション一覧へ漏らさないために分けている。
 */
export function SpeedControl({ playbackRate, onPlaybackRateChange }: SpeedControlProps) {
  return (
    <section className="rounded-lg border border-studio-border bg-studio-surface px-4 py-3">
      <div className="flex items-center gap-2.5">
        <p className="text-sm font-semibold text-studio-text">Speed</p>
        <div className="flex flex-wrap gap-1.5">
          {speedPresets.map((speedPreset) => {
            const isSelected = playbackRate === speedPreset

            return (
              <button
                key={speedPreset}
                className={
                  isSelected
                    ? 'h-8 min-w-14 rounded-md bg-studio-accent px-2.5 text-sm font-semibold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
                    : 'h-8 min-w-14 rounded-md border border-studio-border bg-studio-surface-raised px-2.5 text-sm font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
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
      </div>
    </section>
  )
}
