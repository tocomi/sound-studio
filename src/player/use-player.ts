import { useEffect, useState } from 'react'

type PitchPreservingMediaElement = HTMLMediaElement & {
  mozPreservesPitch?: boolean
  preservesPitch?: boolean
  webkitPreservesPitch?: boolean
}

type LoopRange = {
  start: number
  end: number
}

/** playbackRate をセットしつつ、ブラウザ間の差異を吸収しながら音程保持を有効にする。 */
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
export function usePlayer(
  mediaElement: HTMLMediaElement | null,
  playbackRate: number,
  volume: number,
  isMuted: boolean,
  loopRange: LoopRange | null = null,
) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const loopStart = loopRange?.start ?? null
  const loopEnd = loopRange?.end ?? null

  /**
   * メディア要素のイベントを購読して React state と同期する。
   * mediaElement が差し替わるたびに旧リスナーを解除して新要素に張り直す。
   */
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

  /**
   * playbackRate が変わるたびにメディア要素へ即時反映する。
   * preservesPitch 設定は変速しても音程を保つために毎回セットする。
   */
  useEffect(() => {
    if (mediaElement) {
      setPitchPreservingRate(mediaElement, playbackRate)
    }
  }, [mediaElement, playbackRate])

  /**
   * 音量・ミュートをメディア要素へ反映する。
   * volume / isMuted は localStorage 由来なので初回マウント時にも正しい値をセットするために useEffect で同期する。
   */
  useEffect(() => {
    if (!mediaElement) {
      return
    }

    mediaElement.volume = Math.min(Math.max(volume, 0), 1)
    mediaElement.muted = isMuted
  }, [isMuted, mediaElement, volume])

  /**
   * loopRange が有効な間、rAF で currentTime を監視してループ折り返しを行う。
   * timeupdate はブラウザの発火頻度が低く折り返しが遅れるため rAF で高頻度チェックしている。
   */
  useEffect(() => {
    if (!mediaElement || loopStart === null || loopEnd === null || loopStart >= loopEnd) {
      return
    }

    let animationFrameId = 0
    const loopMediaElement = mediaElement
    const activeLoopStart = loopStart
    const activeLoopEnd = loopEnd

    function monitorLoopRange() {
      if (loopMediaElement.currentTime >= activeLoopEnd) {
        loopMediaElement.currentTime = activeLoopStart
        setCurrentTime(activeLoopStart)
      }

      animationFrameId = requestAnimationFrame(monitorLoopRange)
    }

    animationFrameId = requestAnimationFrame(monitorLoopRange)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [loopEnd, loopStart, mediaElement])

  /** 再生を開始する。ブラウザの自動再生ポリシーで拒否された場合は isPlaying を false に戻す。 */
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

  /** 再生を一時停止する。 */
  function pause() {
    mediaElement?.pause()
  }

  /** 指定した絶対時間（秒）にシークする。0 〜 duration の範囲にクランプする。 */
  function seek(nextTime: number) {
    if (!mediaElement) {
      return
    }

    const clampedTime = Math.min(Math.max(nextTime, 0), duration || nextTime)
    mediaElement.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  /** 現在位置から相対秒数だけシークする。負値で巻き戻し、正値で早送り。 */
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
