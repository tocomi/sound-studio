export type WaveformAudioBuffer = {
  duration: number
  length: number
  numberOfChannels: number
  getChannelData: (channel: number) => Float32Array
}

/**
 * AudioBuffer を固定本数のピーク列へ間引く。
 * デコード結果の巨大なサンプル列を view が扱いやすい小さな表示データへ変換するために分けている。
 */
export function createWaveformPeaks(audioBuffer: WaveformAudioBuffer, peakCount = 240) {
  const normalizedPeakCount = Math.max(1, Math.floor(peakCount))
  const sampleCount = audioBuffer.length
  const channelCount = audioBuffer.numberOfChannels

  if (sampleCount <= 0 || channelCount <= 0) {
    return Array.from({ length: normalizedPeakCount }, () => 0)
  }

  const samplesPerPeak = Math.max(1, Math.ceil(sampleCount / normalizedPeakCount))
  const peaks = Array.from({ length: normalizedPeakCount }, (_, peakIndex) => {
    const startSample = peakIndex * samplesPerPeak
    const endSample = Math.min(startSample + samplesPerPeak, sampleCount)
    let peak = 0

    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const channelData = audioBuffer.getChannelData(channelIndex)

      for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
        peak = Math.max(peak, Math.abs(channelData[sampleIndex] ?? 0))
      }
    }

    return peak
  })
  const maxPeak = Math.max(...peaks)

  if (maxPeak <= 0) {
    return peaks
  }

  return peaks.map((peak) => peak / maxPeak)
}
