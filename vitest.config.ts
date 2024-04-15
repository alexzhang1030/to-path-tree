import { defineConfig } from 'vitest/config'
import paths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    includeSource: ['src/*'],
    globals: true,
  },
  plugins: [paths()],
})
