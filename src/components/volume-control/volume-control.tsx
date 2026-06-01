type VolumeControlProps = {
  isMuted: boolean
  onMutedToggle: () => void
  onVolumeChange: (volume: number) => void
  volume: number
}

function VolumeIcon({ isMuted, volume }: Pick<VolumeControlProps, 'isMuted' | 'volume'>) {
  if (isMuted || volume === 0) {
    return (
      <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="m17 9 4 4m0-4-4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M16 8.5a5 5 0 0 1 0 7m2.5-9.5a8 8 0 0 1 0 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

/**
 * グローバルな音量とミュート操作を表示する。
 * 音量は練習対象の区間ではなく再生環境に属する設定なので、SpeedControl とは分けた
 * 独立コンポーネントとして扱い、後続のセクション速度保存と責務が混ざらないようにする。
 */
export function VolumeControl({
  isMuted,
  onMutedToggle,
  onVolumeChange,
  volume,
}: VolumeControlProps) {
  const visibleVolume = isMuted ? 0 : volume
  const volumePercent = Math.round(volume * 100)

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    onVolumeChange(Number(event.target.value))
  }

  return (
    <section className="rounded-lg border border-studio-border bg-studio-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          className={
            isMuted
              ? 'grid size-9 touch-manipulation place-items-center rounded-md border border-studio-border bg-studio-surface-muted text-studio-text-soft transition hover:border-studio-border-strong hover:bg-studio-surface-raised focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
              : 'grid size-9 touch-manipulation place-items-center rounded-md bg-studio-accent text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none motion-reduce:transition-none'
          }
          type="button"
          aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
          aria-pressed={isMuted}
          title={isMuted ? 'ミュート解除' : 'ミュート'}
          onClick={onMutedToggle}
        >
          <VolumeIcon isMuted={isMuted} volume={volume} />
        </button>
        <label className="text-sm font-semibold text-studio-text" htmlFor="volume-control">
          Vol
        </label>
        <input
          className="range-control min-w-56 flex-1 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-studio-border-strong"
          id="volume-control"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={visibleVolume}
          onChange={handleVolumeChange}
        />
        <output
          className="min-w-16 rounded-md bg-studio-surface-muted px-3 py-1.5 text-center text-sm font-semibold text-studio-text tabular-nums"
          htmlFor="volume-control"
        >
          {volumePercent}%
        </output>
      </div>
    </section>
  )
}
