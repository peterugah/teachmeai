import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin()
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/entry/content.tsx'),
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'scripts/content.js',
        inlineDynamicImports: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    target: 'esnext',
    cssCodeSplit: false
  },
});
