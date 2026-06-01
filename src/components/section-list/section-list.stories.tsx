import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileSettingsProvider } from '@/state/file-settings-provider.tsx'

import { SectionList } from './section-list.tsx'

const meta = {
  component: SectionList,
  decorators: [
    (Story) => (
      <FileSettingsProvider>
        <Story />
      </FileSettingsProvider>
    ),
  ],
} satisfies Meta<typeof SectionList>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    currentTime: 0,
    duration: 0,
    isLoopEnabled: true,
    onSectionActivated: () => {},
  },
}
