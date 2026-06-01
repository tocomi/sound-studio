import { useEffect, useState } from 'react'

import { createWaveformPeaks } from './waveform-peaks.ts'

type WaveformPeaksState = {
  error: string | null
  isLoading: boolean
  peaks: number[]
}

type AudioContextWindow = Window & {
  webkitAudioContext?: typeof AudioContext
}

const MAX_WAVEFORM_PEAK_COUNT = 120_000
const MIN_WAVEFORM_PEAK_COUNT = 240
const WAVEFORM_PEAKS_PER_SECOND = 80

function waveformPeakCount(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return MIN_WAVEFORM_PEAK_COUNT
  }

  return Math.min(
    Math.max(Math.ceil(duration * WAVEFORM_PEAKS_PER_SECOND), MIN_WAVEFORM_PEAK_COUNT),
    MAX_WAVEFORM_PEAK_COUNT,
  )
}

/**
 * ローカル音声ファイルを表示用の波形ピークへ変換する。
 * 再生は media element に任せたまま、重いデコード処理を waveform レイヤーへ閉じ込めるために分けている。
 */
export function useWaveformPeaks(file: File | null) {
  const [state, setState] = useState<WaveformPeaksState>({
    error: null,
    isLoading: false,
    peaks: [],
  })

  useEffect(() => {
    if (!file) {
      setState({ error: null, isLoading: false, peaks: [] })
      return
    }

    const AudioContextClass =
      window.AudioContext ?? (window as AudioContextWindow).webkitAudioContext

    if (!AudioContextClass) {
      setState({
        error: 'waveform-audio-context-unavailable',
        isLoading: false,
        peaks: [],
      })
      return
    }

    let isActive = true
    const activeFile = file
    const audioContext = new AudioContextClass()

    async function loadPeaks() {
      setState({ error: null, isLoading: true, peaks: [] })

      try {
        const arrayBuffer = await activeFile.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        const peaks = createWaveformPeaks(audioBuffer, waveformPeakCount(audioBuffer.duration))

        if (isActive) {
          setState({ error: null, isLoading: false, peaks })
        }
      } catch {
        if (isActive) {
          setState({
            error: 'waveform-decode-failed',
            isLoading: false,
            peaks: [],
          })
        }
      } finally {
        void audioContext.close()
      }
    }

    void loadPeaks()

    return () => {
      isActive = false
    }
  }, [file])

  return state
}
