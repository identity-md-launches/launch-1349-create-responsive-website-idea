import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` makes every asset URL in dist/ relative, so the export works
// from a gateway subpath, an ENS name, or a plain `file://` open.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
