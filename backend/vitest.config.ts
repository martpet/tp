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
      alias: [
        {
          find: 'lambda-layer',
          replacement: resolve(
            'backend/src/constructs/utils/lambdaLayers/code/main-layer'
          ),
        },
        {
          find: '~',
          replacement: resolve('backend/src'),
        },
      ],
      coverage: {
        include: [
          'backend/**constructs**',
          'backend/**/handlers/**',
          'backend/**/lambda/**',
          'backend/**/utils/**',
          '!backend/**/constructs/utils/**',
          '!backend/**/constructs/Api/utils/testHelpers/**',
          '!backend/**/index.ts',
          '!backend/**/__mocks__/**',
          '!backend/shared/**',
          '!backend/**/checkLocalEnvVars.ts',
          '!backend/**/findExistingFingerprints.ts',
        ],
      },
    },
  })
);
