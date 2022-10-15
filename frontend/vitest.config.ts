import { resolve } from 'app-root-path';
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import defaultConfig from '../vitest.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      root: 'frontend',
      include: ['frontend/**/*.test.ts'],
      alias: [{ find: '~', replacement: resolve('frontend/src') }],
      coverage: {
        enabled: false,
      },
    },
  })
);
