import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },

  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../../packages/shared/'),
    },
  },

  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/entry/content.tsx'),
        popup: resolve(__dirname, 'src/entry/popup.tsx'),
        background: resolve(__dirname, 'src/entry/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    target: 'esnext',
    cssCodeSplit: false,
  },

  server: {
    fs: {
      allow: ['..'],
    },
  },
}));
