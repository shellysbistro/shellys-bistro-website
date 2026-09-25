import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { business, headerNavigation } from '../src/content.mjs';
import { buildMode, isProduction } from '../src/build-mode.mjs';
import { notFoundPage, pages } from '../src/pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function header(path) {
  const links = headerNavigation.map((item) => {
    const href = item.href || item.path;
    const current = !item.href && item.path === path ? ' aria-current="page"' : '';
    return `<a href="${href}"${current}>${item.label}</a>`;
  }).join('');

  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="wrap site-header__inner">
        <a class="wordmark" href="/" aria-label="Shelly’s Indigenous Bistro home"><img class="wordmark__image" src="/brand/shellys-logo.png" width="602" height="589" alt=""><span class="wordmark__text"><strong>Shelly’s</strong><span>Indigenous Bistro</span></span></a>
        <div class="site-header__mobile-actions"><a class="site-header__mobile-catering" href="/catering/">Catering</a><button class="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button></div>
        <nav id="site-navigation" class="site-nav" aria-label="Main navigation"><a class="site-nav__cta" href="/catering/"${path === '/catering/' ? ' aria-current="page"' : ''}>Catering</a>${links}</nav>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="wrap site-footer__top">
        <div><a class="wordmark wordmark--footer" href="/" aria-label="Shelly’s Indigenous Bistro home"><img class="wordmark__image" src="/brand/shellys-logo.png" width="602" height="589" alt=""><span class="wordmark__text"><strong>Shelly’s</strong><span>Indigenous Bistro</span></span></a><p>Fresh. Local.<br>Indigenous-owned.</p></div>
        <div><h2>Explore</h2><a href="/catering/">Catering</a><a href="/menu/">Food highlights</a><a href="${business.currentMenuUrl}">Menu on Skip</a><a href="/our-story/">Our story</a><a href="/indigenous-ownership/">Indigenous ownership</a><a href="/community/">Community</a><a href="/stories/">Stories from Shelly’s</a></div>
        <div><h2>Find us</h2><p>${business.address}</p><a href="${business.phoneHref}">${business.phoneDisplay}</a><a href="/contact/">Visit &amp; contact</a></div>
      </div>
      <div class="wrap site-footer__bottom"><span>© ${new Date().getFullYear()} Shelly’s Indigenous Bistro</span><span>Made for community in Winnipeg.</span></div>
    </footer>`;
}

function render(page) {
  return `<!doctype html>
<html lang="en-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${isProduction ? '' : '<meta name="robots" content="noindex,nofollow">'}
  <meta name="theme-color" content="#151713">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <link rel="icon" type="image/png" href="/brand/shellys-logo.png">
  <link rel="preload" href="/fonts/Nunito-wght.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <script src="/site.js" defer></script>
</head>
<body>
  ${header(page.path)}
  <main id="main">${page.body}</main>
  ${footer()}
</body>
</html>`;
}

if (dirname(dist) !== root) throw new Error('Refusing to clean a directory outside the project root');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const page of pages) {
  const relative = page.path === '/' ? '' : page.path.slice(1);
  const target = join(dist, relative, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page), 'utf8');
}
await writeFile(join(dist, '404.html'), render(notFoundPage), 'utf8');
await cp(join(root, 'public'), dist, { recursive: true, filter: (source) => !source.endsWith('README.md') });
await cp(join(root, 'src', 'site.css'), join(dist, 'styles.css'));
await cp(join(root, 'src', 'site.js'), join(dist, 'site.js'));
await writeFile(join(dist, 'robots.txt'), isProduction ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n', 'utf8');
console.log(`Built ${pages.length} ${buildMode} pages in ${dist}`);
