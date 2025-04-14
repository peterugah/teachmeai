import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, join } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

const readFile = promisify(fs.readFile);

// ✅ Use "src/scripts" as source
const scriptsDir = resolve(__dirname, 'src/scripts');
const scriptFiles = fs
  .readdirSync(scriptsDir)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'));

// ✅ Output to "scripts/" in dist (instead of "script/")
const inputScripts = scriptFiles.reduce((entries, file) => {
  const name = file.replace(/\.(ts|tsx)$/, '');
  entries[`scripts/${name}`] = resolve(scriptsDir, file);
  return entries;
}, {} as Record<string, string>);

// ✅ Middleware to serve HTML from /html in dev
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
            }
          }

          next();
        }
      );
    },
  };
};

// ✅ Full Vite config
export default defineConfig({

  plugins: [middleware(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'html/popup.html'),
        content: resolve(__dirname, 'html/content.html'),
        ...inputScripts, // <- scripts/ from src/scripts

      },
      output: {
        format: 'es', // 👈 key for real ESM
        entryFileNames: (chunk) =>
          chunk.name.startsWith('scripts/') ? '[name].js' : 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },

});
