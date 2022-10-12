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
          '!**/getPersonalDevDomain.ts',
          '**/utils/**',
          '!**/index.ts',
          '!**/__mocks__/**',
          '!backend/**',
        ],
      },
    },
  })
);
