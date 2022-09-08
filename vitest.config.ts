import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    setupFiles: 'setupTests.ts',
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text'],
      skipFull: true,
      reportsDirectory: 'coverage',
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
});
