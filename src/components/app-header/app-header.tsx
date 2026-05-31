import { ThemeToggle } from '../theme-toggle/theme-toggle.tsx'
import type { ThemeMode } from '../../theme/use-theme.ts'

type AppHeaderProps = {
  fileName: string | null
  themeMode: ThemeMode
  onResetMedia: () => void
  onThemeModeToggle: () => void
}

/**
 * アプリ名・読込中ファイル名・全体操作（別ファイルを開く / テーマ切替）を並べた最上部のヘッダー。
 * 画面全体で常に出るアプリのクロムを一箇所にまとめ、App を画面合成だけに保つために分けている。
 */
export function AppHeader({
  fileName,
  themeMode,
  onResetMedia,
  onThemeModeToggle,
}: AppHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-studio-border pb-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.22em] text-studio-text-soft uppercase">
          pitch-safe practice deck
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-studio-text">
          Sound Studio
        </h1>
        {fileName ? (
          <p className="mt-2 max-w-[min(44rem,100%)] truncate text-sm text-studio-text-muted">
            {fileName}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {fileName ? (
          <button
            className="touch-manipulation rounded-md border border-studio-border bg-studio-surface-raised px-3 py-2 text-sm font-medium text-studio-accent transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-page focus-visible:outline-none motion-reduce:transition-none"
            type="button"
            onClick={onResetMedia}
          >
            別のファイルを開く
          </button>
        ) : null}
        <ThemeToggle themeMode={themeMode} onThemeModeToggle={onThemeModeToggle} />
      </div>
    </header>
  )
}
