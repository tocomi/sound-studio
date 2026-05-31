import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { SpeedControl } from './SpeedControl.tsx'

const meta = {
  component: SpeedControl,
  args: {
    playbackRate: 1,
    onPlaybackRateChange: fn(),
  },
  // 制御コンポーネントなので playbackRate を story 側で保持し、操作が反映される状態を見せる。
  render: function Render(args) {
    const [playbackRate, setPlaybackRate] = useState(args.playbackRate)

    return <SpeedControl playbackRate={playbackRate} onPlaybackRateChange={setPlaybackRate} />
  },
} satisfies Meta<typeof SpeedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Slowed: Story = {
  args: {
    playbackRate: 0.5,
  },
}
