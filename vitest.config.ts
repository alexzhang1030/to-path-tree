import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/*'],
    globals: true,
    alias: {
      '@': 'src',
    },
  },
})
