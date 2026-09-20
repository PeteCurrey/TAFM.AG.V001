import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  test: {
    globals:     true,
    environment: 'node',
    include:     ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    exclude:     ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts', '**/*.config.ts', '.next/'],
    },
  },
})
