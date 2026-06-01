import { Gauge, LockKeyhole, Repeat2, Upload } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/cn.ts'

type EmptyStateProps = {
  onFileSelected: (file: File) => void
}

function isPlayableMedia(file: File) {
  return file.type.startsWith('audio/') || file.type.startsWith('video/')
}

/**
 * ファイル未読込時の選択 UI とアプリの用途説明を表示する。
 * 最初の画面で「練習用」「ローカル完結」を伝え、安心してファイルを開ける入口にするために分けている。
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
    <section className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:gap-8 lg:py-10">
      <div className="max-w-2xl">
        <p className="mt-5 max-w-xl text-xl leading-8 text-studio-text-muted">
          Sound Studio
          は、手元の動画や音声を開いて、名前付きの区間を登録しながら反復練習するためのツールです。
        </p>
        <div className="mt-5 grid gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3">
          <div className="flex gap-3 rounded-lg border border-studio-border bg-studio-surface px-4 py-3 sm:block sm:py-4">
            <Gauge
              className="mt-0.5 size-5 shrink-0 text-studio-accent sm:mt-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-studio-text sm:mt-3">音程維持</p>
              <p className="mt-1 hidden text-sm leading-6 text-studio-text-soft sm:block">
                速度を落としてもピッチを変えずに再生します。
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-studio-border bg-studio-surface px-4 py-3 sm:block sm:py-4">
            <Repeat2
              className="mt-0.5 size-5 shrink-0 text-studio-accent sm:mt-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-studio-text sm:mt-3">区間ループ</p>
              <p className="mt-1 hidden text-sm leading-6 text-studio-text-soft sm:block">
                難所だけを切り出して、何度も繰り返せます。
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-studio-border bg-studio-surface px-4 py-3 sm:block sm:py-4">
            <LockKeyhole
              className="mt-0.5 size-5 shrink-0 text-studio-accent sm:mt-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-studio-text sm:mt-3">ローカル完結</p>
              <p className="mt-1 hidden text-sm leading-6 text-studio-text-soft sm:block">
                ファイル本体はアップロードも保存もしません。
              </p>
            </div>
          </div>
        </div>
      </div>
      <label
        className={cn(
          'group relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-lg border px-8 py-8 text-center transition focus-within:ring-2 focus-within:ring-studio-border-strong focus-within:ring-offset-2 focus-within:ring-offset-studio-page focus-within:outline-none motion-reduce:transition-none sm:py-14',
          isDragging
            ? 'border-studio-border-strong bg-studio-surface-muted'
            : 'border-dashed border-studio-border bg-studio-surface focus-within:border-studio-border-strong hover:border-studio-border-strong hover:bg-studio-surface-raised',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="grid size-12 place-items-center rounded-full border border-studio-border bg-studio-page text-xl text-studio-accent sm:size-16 sm:text-2xl">
          ♪
        </span>
        <span className="mt-4 text-2xl font-semibold text-studio-text sm:mt-6">ファイルを開く</span>
        <span className="mt-1 max-w-72 text-sm leading-6 text-studio-text-soft sm:mt-2">
          動画または音声ファイルをドラッグ＆ドロップできます。
        </span>
        <span className="mt-5 inline-flex items-center gap-2 rounded-md bg-studio-accent px-4 py-2 text-sm font-semibold text-studio-accent-contrast transition group-hover:bg-studio-accent-hover sm:mt-8">
          <Upload className="size-4" aria-hidden="true" />
          ファイルを選択
        </span>
        <span className="mt-4 text-xs text-studio-text-soft">audio / video · ブラウザ内で再生</span>
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
