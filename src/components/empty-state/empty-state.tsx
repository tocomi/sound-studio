type EmptyStateProps = {
  onFileSelected: (file: File) => void
}

/**
 * ファイル未読込時の選択 UI を表示する。
 * 未読込時の入口を単一の行動に絞り、練習開始までの迷いを減らすために分けている。
 */
export function EmptyState({ onFileSelected }: EmptyStateProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      onFileSelected(selectedFile)
    }
  }

  return (
    <section className="grid flex-1 place-items-center">
      <label className="flex w-full max-w-2xl cursor-pointer flex-col items-center gap-5 rounded-lg border border-dashed border-cyan-300/30 bg-neutral-900/70 px-8 py-16 text-center transition focus-within:border-cyan-200/70 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:ring-offset-2 focus-within:ring-offset-neutral-950 hover:border-cyan-200/70 hover:bg-neutral-900 motion-reduce:transition-none">
        <span className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-neutral-950">
          動画/音源を選択
        </span>
        <input
          className="sr-only"
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
        />
      </label>
    </section>
  )
}
