import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const previewUrl = 'https://shellys-catering-menu-khwoj3xrj-richardtrippy-9144s-projects.vercel.app/?_vercel_share=K57t6jr6PpZm5FTpLVTuJghpBnzVKA4r';

function inIsolatedProject(callback) {
  const project = mkdtempSync(join(root, '.build-mode-test-'));
  try {
    for (const directory of ['src', 'scripts', 'public']) {
      cpSync(join(root, directory), join(project, directory), { recursive: true });
    }
    return callback(project);
  } finally {
    if (dirname(project) !== root) throw new Error('Refusing to remove a test directory outside the project root');
    rmSync(project, { recursive: true, force: true });
  }
}

function build(project, overrides = {}) {
  const env = { ...process.env };
  delete env.SHELLY_BUILD_MODE;
  delete env.SHELLY_CATERING_URL;
  Object.assign(env, overrides);
  return spawnSync(process.execPath, [join(project, 'scripts', 'build.mjs')], {
    cwd: project,
    env,
    encoding: 'utf8',
    timeout: 30_000
  });
}

function page(project, path = '') {
  return readFileSync(join(project, 'dist', path, 'index.html'), 'utf8');
}

test('default review build retains preview link, noindex and visible photo labels', () => inIsolatedProject((project) => {
  const result = build(project, { SHELLY_CATERING_URL: 'https://orders.example.org/catering/' });
  assert.equal(result.status, 0, result.stderr);
  const home = page(project);
  assert.match(home, /<meta name="robots" content="noindex,nofollow">/);
  assert.ok(home.includes(previewUrl));
  assert.match(home, /Photo coming soon/);
  assert.equal(readFileSync(join(project, 'dist', 'robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n');
}));

test('production build requires an explicit stable catering URL and preserves the last build on failure', () => inIsolatedProject((project) => {
  assert.equal(build(project).status, 0);
  const reviewHome = page(project);
  const rejectedUrls = [
    undefined,
    previewUrl,
    'https://shellys-catering-menu-khwoj3xrj-richardtrippy-9144s-projects.vercel.app/',
    'https://shellys-bistro-testers-inky.vercel.app/',
    'https://orders.example.org/catering/?token=abc',
    'https://orders.example.org/preview/',
    'https://orders.example.org/share/abc123',
    'http://orders.example.org/catering/',
    'https://localhost/catering/',
    'https://user:secret@orders.example.org/catering/'
  ];
  for (const url of rejectedUrls) {
    const result = build(project, {
      SHELLY_BUILD_MODE: 'production',
      ...(url === undefined ? {} : { SHELLY_CATERING_URL: url })
    });
    assert.notEqual(result.status, 0, `Accepted unsuitable catering URL: ${url}`);
    assert.match(result.stderr, /SHELLY_CATERING_URL/);
    assert.equal(page(project), reviewHome, 'A failed build must leave the existing output untouched');
  }
  const unknownMode = build(project, { SHELLY_BUILD_MODE: 'live' });
  assert.notEqual(unknownMode.status, 0);
  assert.match(unknownMode.stderr, /SHELLY_BUILD_MODE/);
}));

test('production build is indexable, uses stable catering URL and keeps unlabelled photo spaces', () => inIsolatedProject((project) => {
  const stableUrl = 'https://orders.example.org/catering/';
  const result = build(project, {
    SHELLY_BUILD_MODE: 'production',
    SHELLY_CATERING_URL: stableUrl
  });
  assert.equal(result.status, 0, result.stderr);
  for (const path of ['', 'menu', 'catering', 'our-story', 'indigenous-ownership', 'community', 'stories', 'contact']) {
    const html = page(project, path);
    assert.doesNotMatch(html, /noindex|Photo coming soon|_vercel_share/);
    assert.ok(!html.includes(previewUrl));
    assert.match(html, /<main id="main">/);
  }
  assert.ok(page(project, 'catering').includes(stableUrl));
  assert.match(page(project), /class="photo-slot__pending"/);
  assert.match(page(project, 'menu'), /class="food-flashcard__pending"/);
  assert.match(page(project, 'community'), /data-photo-slot="communityFeeding"/);
  assert.equal(readFileSync(join(project, 'dist', 'robots.txt'), 'utf8'), 'User-agent: *\nAllow: /\n');
  const notFound = readFileSync(join(project, 'dist', '404.html'), 'utf8');
  assert.doesNotMatch(notFound, /noindex|Photo coming soon/);

  const knownProductionAlias = build(project, {
    SHELLY_BUILD_MODE: 'production',
    SHELLY_CATERING_URL: 'https://shellys-catering-menu.vercel.app/'
  });
  assert.equal(knownProductionAlias.status, 0, knownProductionAlias.stderr);
  assert.ok(page(project, 'catering').includes('https://shellys-catering-menu.vercel.app/'));
}));
