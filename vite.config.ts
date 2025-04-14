import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, join } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

const readFile = promisify(fs.readFile);

// Helper: Get all .ts or .js files from src/scripts/
const scriptsDir = resolve(__dirname, 'src/scripts');
const scriptFiles = fs
  .readdirSync(scriptsDir)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

const inputScripts = scriptFiles.reduce((entries, file) => {
  const name = file.replace(/\.(ts|js)$/, '');
  entries[`script/${name}`] = resolve(scriptsDir, file);
  return entries;
}, {} as Record<string, string>);

// Middleware plugin with proper types
const middleware = (): Plugin => {
  return {
    name: 'custom-html-middleware',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!req.url) return next();

          const htmlDir = resolve(__dirname, 'html');
          const reqPath = req.url === '/' ? '/index.html' : req.url;

          if (!reqPath.endsWith('.html')) {
            return next(); // only handle HTML files
          }

          const filePath = join(htmlDir, reqPath);

          if (fs.existsSync(filePath)) {
            try {
              const html = await readFile(filePath, 'utf-8');
              res.setHeader('Content-Type', 'text/html');
              const transformed = await server.transformIndexHtml(req.url, html);
              res.end(transformed);
              return;
            } catch (err: unknown) {
              server.ssrFixStacktrace(err as Error);
              return;
            }
          }

          next();
        }
      );
    },
  };
};

// Vite config
export default defineConfig({
  plugins: [middleware(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'html/popup.html'),
        content: resolve(__dirname, 'html/content.html'),
        ...inputScripts,
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name.startsWith('script/') ? '[name].js' : 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
