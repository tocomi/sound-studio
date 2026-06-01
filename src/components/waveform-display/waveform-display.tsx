import { useEffect, useRef } from 'react'

import { cn } from '@/lib/cn.ts'

type WaveformDisplayProps = {
  className?: string
  currentTime: number
  duration: number
  error: string | null
  isLoading: boolean
  mediaElement: HTMLMediaElement | null
  peaks: number[]
}

const DETAIL_WINDOW_SECONDS = 5

function cssColor(canvas: HTMLCanvasElement, customProperty: string) {
  return getComputedStyle(canvas).getPropertyValue(customProperty).trim()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function visibleWaveformWindow(currentTime: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return {
      end: DETAIL_WINDOW_SECONDS,
      start: 0,
    }
  }

  const windowDuration = Math.min(DETAIL_WINDOW_SECONDS, duration)
  const start = clamp(currentTime - windowDuration / 2, 0, Math.max(0, duration - windowDuration))

  return {
    end: start + windowDuration,
    start,
  }
}

function visiblePeaks(peaks: number[], windowStart: number, windowEnd: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0 || peaks.length === 0) {
    return peaks
  }

  const peakDuration = duration / peaks.length
  const startIndex = clamp(Math.floor(windowStart / peakDuration), 0, peaks.length - 1)
  const endIndex = clamp(Math.ceil(windowEnd / peakDuration), startIndex + 1, peaks.length)

  return peaks.slice(startIndex, endIndex)
}

function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: number[],
  currentTime: number,
  duration: number,
) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const pixelRatio = window.devicePixelRatio || 1
  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  const drawingContext = context

  const canvasWidth = Math.floor(width * pixelRatio)
  const canvasHeight = Math.floor(height * pixelRatio)

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  }

  drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  drawingContext.clearRect(0, 0, width, height)

  const centerY = height / 2
  const visibleWindow = visibleWaveformWindow(currentTime, duration)
  const windowDuration = Math.max(visibleWindow.end - visibleWindow.start, 1)
  const windowPeaks = visiblePeaks(peaks, visibleWindow.start, visibleWindow.end, duration)
  const barGap = 2
  const barWidth = Math.max(1, width / Math.max(windowPeaks.length, 1) - barGap)
  const minBarHeight = 2
  const playheadX = clamp(((currentTime - visibleWindow.start) / windowDuration) * width, 0, width)
  const mutedColor = cssColor(canvas, '--studio-border-strong')
  const activeColor = cssColor(canvas, '--studio-accent')

  function drawBars(color: string) {
    drawingContext.fillStyle = color

    windowPeaks.forEach((peak, index) => {
      const barHeight = Math.max(minBarHeight, peak * (height - 8))
      const x = index * (barWidth + barGap)
      const y = centerY - barHeight / 2

      drawingContext.beginPath()
      drawingContext.roundRect(x, y, barWidth, barHeight, barWidth / 2)
      drawingContext.fill()
    })
  }

  drawingContext.globalAlpha = 0.32
  drawBars(mutedColor)
  drawingContext.globalAlpha = 0.95
  drawingContext.save()
  drawingContext.rect(0, 0, playheadX, height)
  drawingContext.clip()
  drawBars(activeColor)
  drawingContext.restore()
  drawingContext.globalAlpha = 1
  drawingContext.strokeStyle = activeColor
  drawingContext.lineWidth = 2
  drawingContext.beginPath()
  drawingContext.moveTo(playheadX, 6)
  drawingContext.lineTo(playheadX, height - 6)
  drawingContext.stroke()
}

/**
 * 解析済みピークを canvas に描画する。
 * 音声の見た目だけを担当させ、再生制御や保存状態と波形描画を結合させないために独立させている。
 */
export function WaveformDisplay({
  className,
  currentTime,
  duration,
  error,
  isLoading,
  mediaElement,
  peaks,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hasWaveform = peaks.length > 0

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || peaks.length === 0) {
      return
    }

    const activeCanvas = canvas
    let animationFrameId = 0

    function renderWaveform() {
      const mediaDuration = mediaElement?.duration ?? duration
      const nextDuration = Number.isFinite(mediaDuration) ? mediaDuration : duration
      const nextCurrentTime = mediaElement?.currentTime ?? currentTime

      drawWaveform(activeCanvas, peaks, nextCurrentTime, nextDuration)
    }

    function animateWaveform() {
      renderWaveform()

      if (mediaElement && !mediaElement.paused && !mediaElement.ended) {
        animationFrameId = requestAnimationFrame(animateWaveform)
        return
      }

      animationFrameId = 0
    }

    function startAnimation() {
      if (animationFrameId === 0) {
        animationFrameId = requestAnimationFrame(animateWaveform)
      }
    }

    renderWaveform()

    const resizeObserver = new ResizeObserver(() => {
      renderWaveform()
    })

    resizeObserver.observe(activeCanvas)
    mediaElement?.addEventListener('play', startAnimation)
    mediaElement?.addEventListener('seeked', renderWaveform)
    mediaElement?.addEventListener('timeupdate', renderWaveform)

    if (mediaElement && !mediaElement.paused && !mediaElement.ended) {
      startAnimation()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      mediaElement?.removeEventListener('play', startAnimation)
      mediaElement?.removeEventListener('seeked', renderWaveform)
      mediaElement?.removeEventListener('timeupdate', renderWaveform)
    }
  }, [currentTime, duration, mediaElement, peaks])

  return (
    <div
      className={cn(
        'relative mx-auto mt-8 h-24 w-full max-w-xl overflow-hidden rounded-md border border-studio-border bg-studio-surface',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className={hasWaveform ? 'block h-full w-full' : 'hidden'}
        aria-label="波形"
        role="img"
      />
      {hasWaveform ? null : (
        <div className="grid h-full place-items-center px-4 text-center text-sm font-medium text-studio-text-muted">
          {error ? '波形を表示できません' : isLoading ? '波形を解析中' : '波形を準備中'}
        </div>
      )}
    </div>
  )
}
