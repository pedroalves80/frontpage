import { defineConfig } from 'vite';
import svgInline from './plugins/svg-inline';

export default defineConfig({
  root: 'src',
  plugins: [svgInline()]
});
