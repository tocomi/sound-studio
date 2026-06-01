import { describe, expect, it } from 'vitest'

import { createWaveformPeaks, type WaveformAudioBuffer } from './waveform-peaks.ts'

function audioBufferStub(channels: number[][]): WaveformAudioBuffer {
  return {
    duration: 1,
    get length() {
      return channels[0]?.length ?? 0
    },
    numberOfChannels: channels.length,
    getChannelData: (channel) => Float32Array.from(channels[channel] ?? []),
  }
}

describe('createWaveformPeaks', () => {
  it('splits channel data into normalized peak buckets', () => {
    const peaks = createWaveformPeaks(audioBufferStub([[0, 0.5, -1, 0.25]]), 2)

    expect(peaks).toEqual([0.5, 1])
  })

  it('uses the loudest value across channels for each bucket', () => {
    const peaks = createWaveformPeaks(
      audioBufferStub([
        [0, 0.2, 0.3, 0.1],
        [0.4, 0.1, 0.6, 0.1],
      ]),
      2,
    )

    expect(peaks[0]).toBeCloseTo(0.4 / 0.6)
    expect(peaks[1]).toBe(1)
  })

  it('returns silence when the buffer has no samples', () => {
    const peaks = createWaveformPeaks(audioBufferStub([]), 3)

    expect(peaks).toEqual([0, 0, 0])
  })
})
