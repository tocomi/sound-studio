import { useState } from 'react'
import { cn } from '@/lib/cn.ts'

type EmptyStateProps = {
  onFileSelected: (file: File) => void
}

function isPlayableMedia(file: File) {
  return file.type.startsWith('audio/') || file.type.startsWith('video/')
}

/**
 * ファイル未読込時の選択 UI を表示する。
 * 未読込時の入口を単一の行動に絞り、練習開始までの迷いを減らすために分けている。
 */
export function EmptyState({ onFileSelected }: EmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (selectedFile && isPlayableMedia(selectedFile)) {
      onFileSelected(selectedFile)
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)

    const selectedFile = event.dataTransfer.files[0]

    if (selectedFile && isPlayableMedia(selectedFile)) {
      onFileSelected(selectedFile)
    }
  }

  return (
    <section className="grid flex-1 place-items-center py-10">
      <label
        className={cn(
          'group relative flex w-full max-w-3xl cursor-pointer flex-col items-center overflow-hidden rounded-lg border px-8 py-16 text-center transition focus-within:ring-2 focus-within:ring-studio-border-strong focus-within:ring-offset-2 focus-within:ring-offset-studio-page focus-within:outline-none motion-reduce:transition-none',
          isDragging
            ? 'border-studio-border-strong bg-studio-surface-muted'
            : 'border-dashed border-studio-border bg-studio-surface focus-within:border-studio-border-strong hover:border-studio-border-strong hover:bg-studio-surface-raised',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="grid size-16 place-items-center rounded-full border border-studio-border bg-studio-page text-2xl text-studio-accent">
          ♪
        </span>
        <span className="mt-6 text-2xl font-semibold text-studio-text">練習ファイルを開く</span>
        <span className="mt-2 text-sm text-studio-text-soft">audio / video</span>
        <span className="mt-8 rounded-md bg-studio-accent px-4 py-2 text-sm font-semibold text-studio-accent-contrast transition group-hover:bg-studio-accent-hover">
          ファイルを選択
        </span>
        <input
          className="absolute inset-0 cursor-pointer opacity-0"
          type="file"
          aria-label="練習ファイルを開く"
          accept="audio/*,video/*"
          onChange={handleFileChange}
        />
      </label>
    </section>
  )
}
