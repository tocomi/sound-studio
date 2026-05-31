import { useLayoutEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light'

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * ライト/ダークテーマの状態と DOM への反映をまとめて扱う。
 * 初期値の判定・トグル・`data-theme` の書き込みを一箇所へ集約し、App の画面合成から
 * テーマ制御の詳細とその所有する型（ThemeMode）を切り離すために分けている。
 */
export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  function toggleThemeMode() {
    setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { themeMode, toggleThemeMode }
}
