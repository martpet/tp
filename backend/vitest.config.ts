import { resolve } from 'app-root-path';
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import defaultConfig from '../vitest.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      root: 'backend',
      include: ['backend/**/*.test.ts'],
      alias: [{ find: '~', replacement: resolve('backend/src') }],
      coverage: {
        include: [
          '**constructs**',
          '**/handlers/**',
          '**/lambda/**',
          '**/utils/**',
          '!**/constructs/utils/**',
          '!**/index.ts',
          '!**/__mocks__/**',
          '!shared/**',
          '!**/checkLocalEnvVars.ts',
        ],
      },
    },
  })
);
