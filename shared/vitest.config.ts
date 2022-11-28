import { resolve } from 'app-root-path';
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import defaultConfig from '../vitest.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      include: ['shared/**/*.test.ts'],
      alias: [{ find: '~', replacement: resolve('shared') }],
      coverage: {
        include: [
          '!**/removeDateStringOffset.ts', // uncovered line -- istanbul bug?
          '!**/getPersonalDevDomain.ts',
          '!**/index.ts',
          '**/utils/**',
          '!**/__mocks__/**',
          '!backend/**',
          '!frontend/**',
        ],
      },
    },
  })
);
