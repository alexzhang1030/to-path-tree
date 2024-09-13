import paths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/*'],
    globals: true,
  },
  plugins: [paths()],
})
