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
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: { reporter: ['text', 'lcov'] }, // lcov reporter is used by IDE coverage extensions
    include: ['./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: [
      'test/vitest/setup-vitest.tsx',
      // https://github.com/jest-community/jest-extended/tree/main/examples/typescript/all
      'jest-extended/all',
    ],
    // disable if parsing CSS is slow
    css: true,
  },
})
