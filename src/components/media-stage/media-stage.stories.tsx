import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { MediaStage } from './media-stage.tsx'

const meta = {
  component: MediaStage,
  args: {
    onMediaElementChange: fn(),
  },
} satisfies Meta<typeof MediaStage>

export default meta
type Story = StoryObj<typeof meta>

export const Video: Story = {
  args: {
    loadedMedia: {
      file: new File([], 'lesson.mp4', { type: 'video/mp4' }),
      kind: 'video',
      url: '',
    },
  },
}

export const Audio: Story = {
  args: {
    loadedMedia: {
      file: new File([], 'practice-track.mp3', { type: 'audio/mpeg' }),
      kind: 'audio',
      url: '',
    },
  },
}
