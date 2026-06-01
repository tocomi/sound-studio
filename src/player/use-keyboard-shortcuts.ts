import { useEffect } from 'react'

type UseKeyboardShortcutsParams = {
  isEnabled: boolean
  isPlaying: boolean
  seekStepSeconds: number
  onPause: () => void
  onPlay: () => void
  onSeekBy: (deltaTime: number) => void
  onVolumeChangeBy: (deltaVolume: number) => void
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

function isSeekShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return target.closest('[data-shortcut-arrows="seek"]') !== null
}

/**
 * 練習中のグローバルキーボード操作を扱う。
 * Space と再生バー上の左右キーは練習操作として強く予約し、それ以外の操作は
 * 入力欄や将来のセクション編集と衝突しないように専用 hook として分けている。
 */
export function useKeyboardShortcuts({
  isEnabled,
  isPlaying,
  seekStepSeconds,
  onPause,
  onPlay,
  onSeekBy,
  onVolumeChangeBy,
}: UseKeyboardShortcutsParams) {
  useEffect(() => {
    if (!isEnabled) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        if (isPlaying) {
          onPause()
        } else {
          onPlay()
        }
        return
      }

      if (event.defaultPrevented) {
        return
      }

      if (event.key === 'ArrowLeft') {
        if (isFormTarget(event.target) && !isSeekShortcutTarget(event.target)) {
          return
        }

        event.preventDefault()
        onSeekBy(-seekStepSeconds)
        return
      }

      if (event.key === 'ArrowRight') {
        if (isFormTarget(event.target) && !isSeekShortcutTarget(event.target)) {
          return
        }

        event.preventDefault()
        onSeekBy(seekStepSeconds)
        return
      }

      if (isFormTarget(event.target)) {
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        onVolumeChangeBy(0.05)
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        onVolumeChangeBy(-0.05)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEnabled, isPlaying, onPause, onPlay, onSeekBy, onVolumeChangeBy, seekStepSeconds])
}
