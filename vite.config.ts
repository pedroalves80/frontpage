import { defineConfig } from 'vite';
import injectHTML from './plugins/html-inject';
import svgInline from './plugins/svg-inline';
import postcssCustomMedia from 'postcss-custom-media';

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  build: {
    assetsDir: 'compiledassets',
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020' // Can up this in future if needed
  },
  plugins: [svgInline(), injectHTML()],
  css: {
    postcss: {
      plugins: [postcssCustomMedia]
    }
  }
});
