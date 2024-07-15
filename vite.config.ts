import { defineConfig } from 'vite'
import {name, version} from './package.json';

export default defineConfig({
  build: {
    copyPublicDir: false,
    minify: 'terser',
    terserOptions:{
      compress:{
        // keep_fnames: true,
        // keep_classnames: true,
      },
      mangle: {
        // properties: {
        //   // regex: /^_/,
        //   debug: false,
        // },
        reserved: ['createTOC'],
        // keep_classnames: true,
        // keep_fnames: true,
      }
    },
    lib: {
      entry: './src/table-of-contents.ts',
      name: 'table-of-contents',
      fileName: (format) => `table-of-contents.${format}.js`,
      formats: ['es','umd'],
    },
    rollupOptions: {
      output: {
        banner: `/*! ${name} - v${version} */\n`,
        globals: {
          'createTOC': 'createTOC',
        },
      },
    }
  }
})