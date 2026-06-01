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

/**
 * 練習中のグローバルキーボード操作を扱う。
 * Space は練習中の再生/停止として強く予約し、それ以外の操作は入力欄や将来の
 * セクション編集と衝突しないように専用 hook として分けている。
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

      if (isFormTarget(event.target)) {
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
