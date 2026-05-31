import type { Preview } from '@storybook/react-vite'

// アプリ本体と同じ Tailwind / ダークトークンを Storybook 上でも適用する。
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-950 p-6 text-neutral-100">
        <Story />
      </div>
    ),
  ],
}

export default preview
