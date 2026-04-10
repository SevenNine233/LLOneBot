import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      'qrcode': path.resolve(import.meta.dirname, 'node_modules/qrcode/lib/server.js'),
    },
  },
  test: {
    include: ['test/webui/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['test/webui/setup.ts'],
    mockReset: true,
  },
})
