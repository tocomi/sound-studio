import { useEffect, useState } from 'react'

const volumeStorageKey = 'ss:volume'
const mutedStorageKey = 'ss:muted'
const defaultVolume = 0.8

function readNumberPreference(key: string, fallbackValue: number) {
  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallbackValue
    }

    const parsedValue = Number(storedValue)

    if (!Number.isFinite(parsedValue)) {
      return fallbackValue
    }

    return Math.min(Math.max(parsedValue, 0), 1)
  } catch {
    return fallbackValue
  }
}

function readBooleanPreference(key: string, fallbackValue: boolean) {
  try {
    const storedValue = window.localStorage.getItem(key)

    if (storedValue === null) {
      return fallbackValue
    }

    return storedValue === 'true'
  } catch {
    return fallbackValue
  }
}

/**
 * 音量とミュート状態をブラウザに保存して扱う。
 * 音量はファイルやセクションに紐づかない再生環境の設定なので、セクション状態から分けて
 * プレイヤー寄りの小さな preference として閉じ込めている。
 */
export function useVolumePreference() {
  const [volume, setVolume] = useState(() => readNumberPreference(volumeStorageKey, defaultVolume))
  const [isMuted, setIsMuted] = useState(() => readBooleanPreference(mutedStorageKey, false))

  useEffect(() => {
    try {
      window.localStorage.setItem(volumeStorageKey, volume.toString())
    } catch {
      // 保存できなくても再生操作は続けられるので、UI 側へ例外を広げない。
    }
  }, [volume])

  useEffect(() => {
    try {
      window.localStorage.setItem(mutedStorageKey, isMuted.toString())
    } catch {
      // 保存できなくても再生操作は続けられるので、UI 側へ例外を広げない。
    }
  }, [isMuted])

  function changeVolume(nextVolume: number) {
    const clampedVolume = Math.min(Math.max(nextVolume, 0), 1)

    setVolume(clampedVolume)
    if (clampedVolume > 0) {
      setIsMuted(false)
    }
  }

  function toggleMuted() {
    setIsMuted((muted) => !muted)
  }

  function changeVolumeBy(deltaVolume: number) {
    changeVolume(volume + deltaVolume)
  }

  return {
    changeVolume,
    changeVolumeBy,
    isMuted,
    toggleMuted,
    volume,
  }
}
