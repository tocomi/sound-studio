import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'
import { fn } from 'storybook/test'

import { VolumeControl } from './volume-control.tsx'

const meta = {
  component: VolumeControl,
  args: {
    isMuted: false,
    onMutedToggle: fn(),
    onVolumeChange: fn(),
    volume: 0.8,
  },
  // 音量とミュート状態を story 側で保持し、スライダーとボタンの操作結果を確認できるようにする。
  render: function Render(args) {
    const [volume, setVolume] = useState(args.volume)
    const [isMuted, setIsMuted] = useState(args.isMuted)

    return (
      <VolumeControl
        isMuted={isMuted}
        volume={volume}
        onMutedToggle={() => setIsMuted((muted) => !muted)}
        onVolumeChange={(nextVolume) => {
          setVolume(nextVolume)
          if (nextVolume > 0) {
            setIsMuted(false)
          }
        }}
      />
    )
  },
} satisfies Meta<typeof VolumeControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Muted: Story = {
  args: {
    isMuted: true,
  },
}
