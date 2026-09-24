import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const requested = decodeURIComponent(url.pathname);
    const file = resolve(root, `.${requested}`, requested.endsWith('/') ? 'index.html' : '');
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const info = await stat(file);
    const target = info.isDirectory() ? join(file, 'index.html') : file;
    const data = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'X-Robots-Tag': 'noindex, nofollow' });
    response.end(data);
  } catch {
    const notFound = await readFile(join(root, '404.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' }).end(notFound);
  }
}).listen(port, '127.0.0.1', () => console.log(`Shelly’s review site: http://127.0.0.1:${port}`));
