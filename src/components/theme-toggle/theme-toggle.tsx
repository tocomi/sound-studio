import { cn } from '@/lib/cn.ts'
import type { ThemeMode } from '@/theme/use-theme.ts'

type ThemeToggleProps = {
  themeMode: ThemeMode
  onThemeModeToggle: () => void
}

/**
 * ライト/ダークテーマの切り替え UI を表示する。
 * テーマ制御の見た目とアクセシビリティ属性を App から分け、画面構成側に
 * トグルの内部表現が漏れないようにするために分けている。
 */
export function ThemeToggle({ themeMode, onThemeModeToggle }: ThemeToggleProps) {
  const isDark = themeMode === 'dark'

  return (
    <button
      className="relative grid h-9 w-20 touch-manipulation grid-cols-2 rounded-full border border-studio-border bg-studio-surface-muted p-1 text-sm font-semibold text-studio-text-soft transition hover:border-studio-border-strong focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-page focus-visible:outline-none motion-reduce:transition-none"
      type="button"
      aria-label={themeMode === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
      aria-pressed={themeMode === 'dark'}
      title={themeMode === 'light' ? 'Dark mode' : 'Light mode'}
      onClick={onThemeModeToggle}
    >
      <span
        className={cn(
          'absolute top-[3px] left-1 h-7 w-9 rounded-full bg-studio-accent transition-transform motion-reduce:transition-none',
          isDark ? 'translate-x-9' : 'translate-x-0',
        )}
      />
      <span
        className={cn(
          'relative z-10 grid place-items-center',
          isDark ? 'text-studio-text-soft' : 'text-studio-accent-contrast',
        )}
        aria-hidden="true"
      >
        ☼
      </span>
      <span
        className={cn(
          'relative z-10 grid place-items-center',
          isDark ? 'text-studio-accent-contrast' : 'text-studio-text-soft',
        )}
        aria-hidden="true"
      >
        ☾
      </span>
    </button>
  )
}
