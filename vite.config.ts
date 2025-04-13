import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';

// Helper: Get all .ts or .js files from src/scripts/
const scriptsDir = resolve(__dirname, 'src/scripts');
const scriptFiles = fs
  .readdirSync(scriptsDir)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

const inputScripts = scriptFiles.reduce((entries, file) => {
  const name = file.replace(/\.(ts|js)$/, '');
  entries[`script/${name}`] = resolve(scriptsDir, file); // --> dist/script/<name>.js
  return entries;
}, {} as Record<string, string>);

// Vite config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
        content: resolve(__dirname, 'public/content.html'),
        ...inputScripts,
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name.startsWith('script/')) {
            return '[name].js';
          }
          return 'assets/[name].js'; // default
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
