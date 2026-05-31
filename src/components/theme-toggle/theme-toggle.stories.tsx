import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { ThemeToggle, type ThemeMode } from './theme-toggle.tsx'

const meta = {
  component: ThemeToggle,
  args: {
    onThemeModeToggle: fn(),
    themeMode: 'light',
  },
  // テーマ状態を story 側で保持し、トグル操作に合わせてノブと aria 状態が変わる様子を見せる。
  render: function Render(args) {
    const [themeMode, setThemeMode] = useState<ThemeMode>(args.themeMode)

    return (
      <ThemeToggle
        themeMode={themeMode}
        onThemeModeToggle={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
      />
    )
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {}

export const Dark: Story = {
  args: {
    themeMode: 'dark',
  },
}
