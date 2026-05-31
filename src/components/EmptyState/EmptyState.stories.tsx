import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { EmptyState } from './EmptyState.tsx'

const meta = {
  component: EmptyState,
  args: {
    onFileSelected: fn(),
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
