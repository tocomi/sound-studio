import { useEffect, useState } from 'react'

type PitchPreservingMediaElement = HTMLMediaElement & {
  mozPreservesPitch?: boolean
  preservesPitch?: boolean
  webkitPreservesPitch?: boolean
}

function setPitchPreservingRate(mediaElement: HTMLMediaElement, playbackRate: number) {
  const pitchPreservingElement = mediaElement as PitchPreservingMediaElement

  pitchPreservingElement.playbackRate = playbackRate
  pitchPreservingElement.preservesPitch = true
  pitchPreservingElement.mozPreservesPitch = true
  pitchPreservingElement.webkitPreservesPitch = true
}

/**
 * メディア要素の再生制御と低頻度な再生状態を扱う。
 * メディア要素への命令的な操作を React UI から切り離し、リアルタイム再生状態が
 * 保存用 state やコンポーネント構造へ広がらないようにするために分けている。
 */
export function usePlayer(mediaElement: HTMLMediaElement | null, playbackRate: number) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!mediaElement) {
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
      return
    }

    function syncCurrentTime() {
      setCurrentTime(mediaElement?.currentTime ?? 0)
    }

    function syncDuration() {
      const mediaDuration = mediaElement?.duration ?? 0
      setDuration(Number.isFinite(mediaDuration) ? mediaDuration : 0)
    }

    function markPlaying() {
      setIsPlaying(true)
    }

    function markPaused() {
      setIsPlaying(false)
    }

    syncCurrentTime()
    syncDuration()
    mediaElement.addEventListener('durationchange', syncDuration)
    mediaElement.addEventListener('loadedmetadata', syncDuration)
    mediaElement.addEventListener('pause', markPaused)
    mediaElement.addEventListener('play', markPlaying)
    mediaElement.addEventListener('timeupdate', syncCurrentTime)

    return () => {
      mediaElement.removeEventListener('durationchange', syncDuration)
      mediaElement.removeEventListener('loadedmetadata', syncDuration)
      mediaElement.removeEventListener('pause', markPaused)
      mediaElement.removeEventListener('play', markPlaying)
      mediaElement.removeEventListener('timeupdate', syncCurrentTime)
    }
  }, [mediaElement])

  useEffect(() => {
    if (mediaElement) {
      setPitchPreservingRate(mediaElement, playbackRate)
    }
  }, [mediaElement, playbackRate])

  async function play() {
    if (!mediaElement) {
      return
    }

    try {
      await mediaElement.play()
    } catch {
      setIsPlaying(false)
    }
  }

  function pause() {
    mediaElement?.pause()
  }

  function seek(nextTime: number) {
    if (!mediaElement) {
      return
    }

    const clampedTime = Math.min(Math.max(nextTime, 0), duration || nextTime)
    mediaElement.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  function seekBy(deltaTime: number) {
    if (!mediaElement) {
      return
    }

    seek(mediaElement.currentTime + deltaTime)
  }

  return {
    currentTime,
    duration,
    isPlaying,
    pause,
    play,
    seek,
    seekBy,
  }
}
