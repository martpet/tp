import { resolve } from 'app-root-path';
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import defaultConfig from '../vitest.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      include: ['common/**/*.test.ts'],
      alias: [{ find: '~', replacement: resolve('common') }],
      coverage: {
        include: ['**/utils/**', '!**/index.ts', '!**/__mocks__/**', '!backend/**'],
      },
    },
  })
);
