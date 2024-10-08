import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  envPrefix: ['VITE', 'NEXT'],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: process.env.SILENT_TESTS ? ['lcov'] : ['text', 'lcov'],
    }, // lcov reporter is used by IDE coverage extensions
    include: [
      './**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '!./**/*.integration.{test,spec}.*', // Exclude integration tests
    ],
    setupFiles: ['test/vitest/setup-vitest.tsx', 'test/vitest/setup-msw.ts'],
    // disable if parsing CSS is slow
    css: true,
    server: {
      deps: {
        /*
        Some dependencies like next-usequerystate ship code in ESM format.
        We need this inline option to ensure that they are correctly transformed.
        More info:
        https://vitest.dev/config/#server-deps-inline
        https://github.com/vitest-dev/vitest/issues/4745
        */
        inline: ['next-usequerystate'],
      },
    },
  },
})
