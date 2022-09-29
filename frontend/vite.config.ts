import react from '@vitejs/plugin-react';
import { resolve } from 'app-root-path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgrPlugin from 'vite-plugin-svgr';

import { localhostPort } from '../common/consts';
import packageJson from '../package.json';

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    createHtmlPlugin({
      inject: {
        data: {
          appVersion: packageJson.version,
        },
      },
    }),
  ],
  resolve: {
    alias: [{ find: '~', replacement: resolve('frontend/src') }],
  },
  build: {
    outDir: './dist',
    cssCodeSplit: false,
    target: 'esnext',
  },
  server: {
    port: localhostPort,
  },
  envDir: '../',
});
