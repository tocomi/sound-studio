import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'

import { AppHeader } from './app-header.tsx'

const meta = {
  component: AppHeader,
  args: {
    fileName: null,
    themeMode: 'light',
    onResetMedia: fn(),
    onThemeModeToggle: fn(),
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const NoMedia: Story = {}

export const WithMedia: Story = {
  args: {
    fileName: 'practice-take.mp3',
  },
}
