import { defineConfig } from 'vite';
import injectHTML from './plugins/html-inject';
import svgInline from './plugins/svg-inline';

export default defineConfig({
  root: 'src',
  plugins: [svgInline(), injectHTML()]
});
