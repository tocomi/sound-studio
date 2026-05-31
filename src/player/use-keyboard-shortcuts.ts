import { useEffect } from 'react'

type UseKeyboardShortcutsParams = {
  isEnabled: boolean
  isPlaying: boolean
  seekStepSeconds: number
  onPause: () => void
  onPlay: () => void
  onSeekBy: (deltaTime: number) => void
}

function isFormTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable ||
    target.getAttribute('role') === 'textbox'
  )
}

function isActivationTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return target.closest('a,button,[role="button"],summary') !== null
}

/**
 * 練習中のグローバルキーボード操作を扱う。
 * 再生 UI の各ボタンから独立した入口を一箇所にまとめ、入力欄や将来のセクション編集と
 * ショートカットの衝突を避けるために専用 hook として分けている。
 */
export function useKeyboardShortcuts({
  isEnabled,
  isPlaying,
  seekStepSeconds,
  onPause,
  onPlay,
  onSeekBy,
}: UseKeyboardShortcutsParams) {
  useEffect(() => {
    if (!isEnabled) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || isFormTarget(event.target)) {
        return
      }

      if (event.code === 'Space') {
        if (isActivationTarget(event.target)) {
          return
        }

        event.preventDefault()
        if (isPlaying) {
          onPause()
        } else {
          onPlay()
        }
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onSeekBy(-seekStepSeconds)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onSeekBy(seekStepSeconds)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEnabled, isPlaying, onPause, onPlay, onSeekBy, seekStepSeconds])
}
