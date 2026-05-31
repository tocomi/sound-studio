import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Transport } from './transport.tsx'

const meta = {
  component: Transport,
  args: {
    currentTime: 42,
    duration: 213,
    isPlaying: false,
    onPause: fn(),
    onPlay: fn(),
    onSeek: fn(),
  },
  // 再生位置と再生状態を story 側で保持し、再生／シーク操作が反映される状態を見せる。
  render: function Render(args) {
    const [currentTime, setCurrentTime] = useState(args.currentTime)
    const [isPlaying, setIsPlaying] = useState(args.isPlaying)

    return (
      <Transport
        currentTime={currentTime}
        duration={args.duration}
        isPlaying={isPlaying}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onSeek={setCurrentTime}
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
