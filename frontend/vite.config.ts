import react from '@vitejs/plugin-react';
import { resolve } from 'app-root-path';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

import { localhostPort } from '../shared/consts';

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),

    // Assets from public dir not served when using createHtmlPlugin
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
