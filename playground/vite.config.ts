/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'vue-fit-next': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      importMode: 'sync',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
      ],
      dts: true,
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
