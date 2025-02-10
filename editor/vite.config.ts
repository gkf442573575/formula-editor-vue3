import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import dts from 'vite-plugin-dts'

const pkg = require('./package.json')

const banner = `/**
 * ${pkg.name} - ${pkg.version}
 * (c) ${pkg.author}©2024
 * @license ${pkg.license}
 */`

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'vue',
        'lodash-es',
        'codemirror',
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/lang-javascript',
        '@codemirror/theme-one-dark',
        '@codemirror/autocomplete',
        'vue-codemirror'
      ],
      output: {
        banner
      }
    }
  },
  plugins: [vue(), dts()]
})
