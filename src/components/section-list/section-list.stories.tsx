import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionList } from './section-list.tsx'

const meta = {
  component: SectionList,
} satisfies Meta<typeof SectionList>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
