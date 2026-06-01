import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'
import { fn } from 'storybook/test'

import { Transport } from './transport.tsx'

const meta = {
  component: Transport,
  args: {
    currentTime: 42,
    duration: 213,
    isLoopEnabled: true,
    isPlaying: false,
    sectionMarkers: [
      {
        end: 38,
        id: 'intro',
        isActive: false,
        name: 'Intro',
        start: 12,
      },
      {
        end: 126,
        id: 'solo',
        isActive: true,
        name: 'Solo',
        start: 92,
      },
    ],
    seekStepSeconds: 2,
    onLoopToggle: fn(),
    onPause: fn(),
    onPlay: fn(),
    onSeek: fn(),
    onSeekBackward: fn(),
    onSeekForward: fn(),
    onSeekStepSecondsChange: fn(),
  },
  // 再生位置と再生状態を story 側で保持し、再生／シーク操作が反映される状態を見せる。
  render: function Render(args) {
    const [currentTime, setCurrentTime] = useState(args.currentTime)
    const [isLoopEnabled, setIsLoopEnabled] = useState(args.isLoopEnabled)
    const [isPlaying, setIsPlaying] = useState(args.isPlaying)
    const [seekStepSeconds, setSeekStepSeconds] = useState(args.seekStepSeconds)

    function seekBy(deltaTime: number) {
      setCurrentTime((time) => Math.min(Math.max(time + deltaTime, 0), args.duration))
    }

    return (
      <Transport
        currentTime={currentTime}
        duration={args.duration}
        isLoopEnabled={isLoopEnabled}
        isPlaying={isPlaying}
        sectionMarkers={args.sectionMarkers}
        seekStepSeconds={seekStepSeconds}
        onLoopToggle={() => setIsLoopEnabled((enabled) => !enabled)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onSeek={setCurrentTime}
        onSeekBackward={() => seekBy(-seekStepSeconds)}
        onSeekForward={() => seekBy(seekStepSeconds)}
        onSeekStepSecondsChange={setSeekStepSeconds}
      />
    )
  },
} satisfies Meta<typeof Transport>

export default meta
type Story = StoryObj<typeof meta>

export const Paused: Story = {}

export const Playing: Story = {
  args: {
    isPlaying: true,
  },
}

export const Start: Story = {
  args: {
    currentTime: 0,
  },
}
