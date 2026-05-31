import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'react', 'import'],
  env: {
    browser: true,
    es2024: true,
  },
  categories: {
    correctness: 'error',
  },
  ignorePatterns: ['node_modules/**', 'dist/**', '.claude/**'],
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn',
    eqeqeq: 'error',
  },
})
