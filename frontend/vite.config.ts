import react from '@vitejs/plugin-react';
import { resolve } from 'app-root-path';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

import { localhostPort } from '../shared/consts';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'formatjs',
            {
              idInterpolationPattern: '[sha512:contenthash:base64:6]',
              ast: true,
              removeDefaultMessage: false,
            },
          ],
        ],
      },
    }),
    svgrPlugin(),

    // Cannot use `createHtmlPlugin` - assets from public dir not served:
    // https://github.com/vbenjs/vite-plugin-html/issues/94
    // createHtmlPlugin({
    //   inject: {
    //     data: {
    //       appVersion: packageJson.version,
    //     },
    //   },
    // }),
  ],
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
      {
        find: '~',
        replacement: resolve('frontend/src'),
      },
      {
        // https://formatjs.io/docs/guides/advanced-usage#react-intl-without-parser-40-smaller
        find: '@formatjs/icu-messageformat-parser',
        replacement: '@formatjs/icu-messageformat-parser/no-parser',
      },
    ],
  },
  build: {
    outDir: './dist',
    cssCodeSplit: false,
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: localhostPort,
  },
  envDir: '../',
});
