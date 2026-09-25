import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { business, cateringSections, communityExamples, communityThemes, impactFigures, menuHighlights, navigation, photoSlots } from '../src/content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const htmlFor = (path) => readFileSync(join(dist, path === '/' ? '' : path.slice(1), 'index.html'), 'utf8');
const sourceFor = (path) => readFileSync(join(root, 'src', path), 'utf8');

test('every planned page has unique metadata, a main heading and review index controls', () => {
  const titles = new Set();
  for (const page of navigation) {
    const html = htmlFor(page.path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `Missing title on ${page.path}`);
    assert.ok(!titles.has(title), `Duplicate title: ${title}`);
    titles.add(title);
    assert.match(html, /<main id="main">/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${page.path} needs one H1`);
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.match(html, /<a class="skip-link" href="#main">/);
    assert.ok(!html.includes('[CLIENT INPUT REQUIRED'), `${page.path} leaks an internal placeholder`);
  }
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /Disallow: \/$/m);
});

test('every internal navigation and content link has a generated destination', () => {
  for (const page of navigation) {
    const html = htmlFor(page.path);
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      if (!href.startsWith('/')) continue;
      const [pathname, fragment] = href.split('#');
      const target = join(dist, pathname.slice(1), pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(target), `${page.path} links to missing ${href}`);
      if (fragment) {
        const targetHtml = readFileSync(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${fragment}"`), `${page.path} links to missing section ${href}`);
      }
    }
  }
});

test('external actions use safe, explicit destinations', () => {
  assert.match(business.currentMenuUrl, /^https:\/\//);
  assert.equal(business.currentMenuUrl, 'https://www.skipthedishes.com/shellys-indigenous-bistro');
  assert.match(business.cateringRequestUrl, /^https:\/\//);

  for (const page of navigation) {
    const html = htmlFor(page.path);
    for (const [, beforeHref, href, afterHref] of html.matchAll(/<a\b([^>]*?)\bhref="([^"]+)"([^>]*)>/g)) {
      // This loop intentionally validates the rendered HTML, not just content constants.
      assert.ok(href !== '#', `${page.path} contains a placeholder link`);
      assert.ok(!href.startsWith('javascript:'), `${page.path} contains a script URL`);
      if (/^https?:\/\//.test(href)) assert.ok(href.startsWith('https://'), `${page.path} contains a non-HTTPS external link`);
      const attributes = `${beforeHref} ${afterHref}`;
      if (/target="_blank"/.test(attributes)) {
        assert.match(attributes, /rel="[^"]*noopener/, `${page.path} opens a new tab without noopener`);
      }
    }
  }

  assert.ok(htmlFor('/menu/').includes(business.currentMenuUrl));
  assert.ok(htmlFor('/catering/').includes(business.cateringRequestUrl));
  for (const page of navigation) {
    const html = htmlFor(page.path);
    assert.match(html, /<nav[^>]*>[\s\S]*?<a href="https:\/\/www\.skipthedishes\.com\/shellys-indigenous-bistro">Menu on Skip<\/a>/);
    assert.ok(!html.includes('winnipegeat.ca'), `${page.path} still points at the old menu`);
  }
});

test('the playful Nunito font is bundled and used throughout the site', () => {
  const css = sourceFor('site.css');
  assert.match(css, /@font-face\s*\{[^}]*font-family:\s*"Nunito"/);
  assert.match(css, /--display:\s*"Nunito"/);
  assert.match(css, /--font:\s*"Nunito"/);
  assert.ok(existsSync(join(dist, 'fonts', 'Nunito-wght.ttf')));
  assert.ok(existsSync(join(dist, 'fonts', 'OFL.txt')));
  assert.doesNotMatch(css, /Georgia|Times New Roman|Avenir Next/);
});

test('the supplied logo and confirmed contact number appear consistently', () => {
  const logo = readFileSync(join(root, 'public', 'brand', 'shellys-logo.png'));
  assert.deepEqual(readFileSync(join(dist, 'brand', 'shellys-logo.png')), logo);
  assert.equal(business.phoneDisplay, '(431) 441-0887');
  assert.equal(business.phoneHref, 'tel:+14314410887');
  for (const page of navigation) {
    const html = htmlFor(page.path);
    assert.equal((html.match(/class="wordmark__image" src="\/brand\/shellys-logo\.png"/g) || []).length, 2);
    assert.match(html, /<link rel="icon" type="image\/png" href="\/brand\/shellys-logo\.png">/);
    assert.ok(html.includes(business.phoneDisplay), `Confirmed phone missing from ${page.path}`);
    assert.ok(html.includes(business.phoneHref), `Tap-to-call phone missing from ${page.path}`);
    assert.doesNotMatch(html, /204\) 774-3559|\+12047743559/);
  }
  assert.ok(!existsSync(join(dist, 'photos', 'README.md')), 'Internal photo instructions should not be deployed');
});

test('confirmed postal code and catering inbox are available without changing the request handoff', () => {
  const contact = htmlFor('/contact/');
  const catering = htmlFor('/catering/');
  assert.equal(business.address, '1364 Main Street, Winnipeg, MB R2W 3T8');
  assert.match(business.directionsUrl, /R2W\+3T8$/);
  assert.ok(contact.includes(business.address));
  assert.ok(contact.includes(business.directionsUrl));
  assert.equal(business.cateringEmail, 'Catering@ShellysBistro.com');
  assert.equal(business.cateringEmailHref, 'mailto:Catering@ShellysBistro.com');
  for (const html of [contact, catering]) {
    assert.ok(html.includes(`href="${business.cateringEmailHref}"`));
    assert.ok(html.includes(business.cateringEmail));
    assert.ok(html.includes(business.cateringRequestUrl));
  }
});

test('homepage ingredient scene is decorative and stops for reduced motion', () => {
  const home = htmlFor('/');
  assert.match(home, /class="hero__art" aria-hidden="true"/);
  assert.match(home, /class="hero__ingredients"/);
  const ingredientTags = [...home.matchAll(/<svg\b[^>]*class="ingredient ingredient--[^"]+"[^>]*>/g)].map(([tag]) => tag);
  assert.equal(ingredientTags.length, 3, 'Homepage should contain the three ingredient illustrations');
  for (const tag of ingredientTags) assert.match(tag, /focusable="false"/, 'Decorative SVGs should not receive keyboard focus');

  const css = sourceFor('site.css');
  assert.match(css, /@keyframes\s+ingredient-arrive\s*\{/);
  const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reducedMotion, /\.ingredient\s*\{[^}]*animation:\s*none\s*!important/);
});

test('mobile navigation remains available without JavaScript', () => {
  const html = htmlFor('/');
  const css = sourceFor('site.css');
  const js = sourceFor('site.js');
  assert.match(html, /<nav id="site-navigation" class="site-nav"/);
  assert.match(js, /document\.documentElement\.classList\.add\(['"]has-js['"]\)/);

  const responsiveRules = css.match(/@media\s*\(max-width:\s*\d+px\)\s*\{[\s\S]*?\n\}/g) || [];
  const mobileNavigation = responsiveRules.find((block) => block.includes('.has-js .site-nav {'));
  assert.ok(mobileNavigation, 'Expected responsive navigation rules');
  assert.match(mobileNavigation, /\.menu-toggle\s*\{[^}]*display:\s*none/);
  assert.match(mobileNavigation, /\.site-nav\s*\{[^}]*display:\s*flex/);
  assert.match(mobileNavigation, /\.has-js \.site-nav\s*\{[^}]*display:\s*none/);
  assert.match(mobileNavigation, /\.has-js \.site-nav\.is-open\s*\{[^}]*display:\s*flex/);
});

test('menu highlights are present without invented prices or allergen labels', () => {
  const menu = htmlFor('/menu/');
  for (const item of menuHighlights) assert.ok(menu.includes(item.name), `Missing ${item.name}`);
  assert.doesNotMatch(menu, /\$\d|gluten.free|allergen.free|vegan|halal/i);
  assert.ok(menu.includes(business.currentMenuUrl));
});

test('catering handoff describes a request and does not promise payment or booking', () => {
  const catering = htmlFor('/catering/');
  assert.ok(catering.includes(business.cateringRequestUrl));
  assert.match(catering, /No payment is taken when you submit it\./);
  assert.match(catering, /final pricing with you\./);
  assert.doesNotMatch(catering, /book now|pay now|reservation confirmed/i);
});

test('the final catering menu is complete, price-accurate and available as flashcards', () => {
  const catering = htmlFor('/catering/');
  assert.equal(cateringSections.length, 10);
  assert.equal(cateringSections.reduce((total, section) => total + section.items.length, 0), 41);
  assert.equal((catering.match(/<details class="catering-menu-card"/g) || []).length, cateringSections.length);
  for (const section of cateringSections) {
    assert.ok(catering.includes(section.title.replaceAll('&', '&amp;')), `Missing catering section ${section.title}`);
    for (const item of section.items) assert.ok(catering.includes(item.name.replaceAll('&', '&amp;')), `Missing catering item ${item.name}`);
  }
  for (const amount of ['Small $30 · Medium $48 · Large $69', 'Small $63 · Medium $93 · Large $132', '$10.50 per person', '$1.50 per person']) {
    assert.ok(catering.includes(amount), `Missing documented catering price ${amount}`);
  }
  assert.match(catering, /Delivery cost is quoted by location|delivery cost is quoted by location/);
  assert.doesNotMatch(catering, /bison stew|assorted bannock tray|hamburger beef/i);
});

test('catering copy reflects owner feedback without mixing breakfast wraps into sweets', () => {
  const catering = htmlFor('/catering/');
  assert.match(catering, /Shelly’s brings your favourites to your gathering\./);
  for (const title of ['Corporate &amp; Government', 'Indigenous Organizations', 'Traditional Feasts', 'Conferences &amp; Training', 'Weddings &amp; Family', 'Schools &amp; Youth', 'Emergency &amp; Large-Volume', 'Individually Packaged']) {
    assert.ok(catering.includes(`<h3>${title}</h3>`), `Missing title-cased catering heading: ${title}`);
  }
  const breakfast = cateringSections.find((section) => section.title === 'Breakfast catering');
  const wraps = cateringSections.find((section) => section.title === 'Breakfast Wraps');
  assert.ok(breakfast);
  assert.ok(wraps?.items.some((item) => item.name === 'Breakfast Wraps'));
  assert.match(catering, /1 selection/);
  assert.doesNotMatch(catering, /1 selections/);
  assert.ok(breakfast.items.every((item) => !/breakfast wraps/i.test(item.description || '')));
  assert.ok(catering.includes('Chicken Alfredo'));
  assert.doesNotMatch(catering, /Chicken Broccoli Alfredo|Made in-house\./);
  assert.ok(cateringSections.find((section) => section.title === 'Desserts')?.items.some((item) => item.name === 'Rice Pudding' && !item.description));
});

test('catering cards carry a restrained floral-red outline', () => {
  const css = sourceFor('site.css');
  assert.match(css, /--flower-red:\s*#b12d3d;/);
  assert.match(css, /\.catering-paths article\s*\{[^}]*border:\s*2px solid var\(--flower-red\)/);
  assert.match(css, /\.catering-menu-card\s*\{[^}]*border:\s*2px solid var\(--flower-red\)/);
});

test('floral-red accents connect key pages without replacing dark-surface gold CTAs', () => {
  const css = sourceFor('site.css');
  for (const selector of [
    '.site-nav a:not(.site-nav__cta)::after',
    '.signature--featured',
    '.menu-list > .food-flashcard:first-child',
    '.story-teasers article:first-child',
    '.impact-list li:nth-child(2)',
    '.contact-panel__phone'
  ]) {
    assert.ok(css.includes(selector), `Missing brand-red touchpoint: ${selector}`);
  }
  assert.match(css, /\.section--cream \.button--primary, \.section--butter \.button--primary, \.section--sage \.button--primary\s*\{[^}]*background: var\(--flower-red\)/);
  assert.match(css, /\.button--primary\s*\{[^}]*background: var\(--gold\)/);

  const luminance = (hex) => {
    const channels = hex.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };
  const contrast = (a, b) => {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
  };
  for (const background of ['#fffaf1', '#f7f2e9', '#e3ebdf', '#ffffff']) {
    assert.ok(contrast('#b12d3d', background) >= 4.5, `Red text is too low-contrast on ${background}`);
  }
});

test('footer uses the approved short brand line', () => {
  assert.match(htmlFor('/catering/'), /Fresh\. Local\.<br>Indigenous-owned\./);
});

test('Shelly and Vince stories, ownership and community content from the plan are present', () => {
  const story = htmlFor('/our-story/');
  assert.match(story, /Shelly Kanfer/);
  assert.match(story, /bookkeeper/);
  assert.match(story, /husband passed away in 2017/);
  assert.match(story, /Vince Bignell/);
  assert.match(story, /April 17, 2023/);
  assert.doesNotMatch(story, /Proposed opening for review|not a verified quotation from Vince/);
  const ownership = htmlFor('/indigenous-ownership/');
  assert.match(ownership, /Mathias Colomb First Nation/);
  assert.match(ownership, /Indigenous employment/);
  const community = htmlFor('/community/');
  for (const phrase of ['Lunch-bag programs for evacuees', 'Food that reaches further', '1.2M+', '10,000+', '120,000+']) {
    assert.ok(community.includes(phrase), `Community page is missing ${phrase}`);
  }
  assert.match(htmlFor('/stories/'), /Why the bistro is named Shelly’s/);
});

test('visitor copy contains no internal planning or approval instructions', () => {
  for (const page of navigation) {
    const html = htmlFor(page.path);
    assert.doesNotMatch(html, /content plan|supplied (?:document|plan)|draft example|before public launch|owner sign-off|website review preview|local website review|not a verified quotation|being confirmed for this new site/i, `${page.path} contains planning copy`);
  }
});

test('Catering leads the header and Skip is a single secondary header link', () => {
  for (const page of navigation) {
    const html = htmlFor(page.path);
    const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)?.[1];
    assert.ok(header, `Missing header on ${page.path}`);
    assert.match(header, /class="site-header__mobile-catering" href="\/catering\/"/);
    assert.match(header, /<nav[^>]*><a class="site-nav__cta" href="\/catering\/"/);
    assert.equal((header.match(/Menu on Skip/g) || []).length, 1, `Duplicate Skip header links on ${page.path}`);
  }
});

test('there are no directional arrows anywhere in the rendered site', () => {
  for (const page of navigation) {
    const html = htmlFor(page.path);
    assert.doesNotMatch(html, /[↗→↓←↑]/, `Arrow remains on ${page.path}`);
    for (const [, label] of html.matchAll(/<a class="button [^"]+"[^>]*>([\s\S]*?)<\/a>/g)) {
      assert.doesNotMatch(label, /↗/, `Button arrow remains on ${page.path}`);
    }
    const cateringButton = html.match(/<a class="site-nav__cta"[^>]*>([\s\S]*?)<\/a>/)?.[1];
    assert.ok(cateringButton, `Missing header Catering button on ${page.path}`);
    assert.doesNotMatch(cateringButton, /↗/, `Header Catering arrow remains on ${page.path}`);
  }
});

test('food highlights and homepage favourites open as native flashcards', () => {
  const menu = htmlFor('/menu/');
  const home = htmlFor('/');
  assert.equal((menu.match(/<details class="food-flashcard"/g) || []).length, menuHighlights.length);
  assert.equal((home.match(/<details class="signature [^"]*signature--flash"/g) || []).length, 2);
  for (const item of menuHighlights) {
    assert.ok(menu.includes(`<span class="food-flashcard__title" role="heading" aria-level="3">${item.name}</span>`));
    assert.ok(menu.includes(item.description));
  }
  assert.match(menu, /<summary class="food-flashcard__front" aria-label="Three Sisters Soup food card">/);
  assert.match(menu, /Close food card/);
  assert.match(sourceFor('site.css'), /@keyframes flashcard-open/);
  assert.match(sourceFor('site.css'), /\.food-flashcard__back, \.signature__back, \.catering-menu-card__inside \{ animation: none !important; \}/);
  assert.match(sourceFor('site.js'), /event\.key !== 'Escape' \|\| !card\.open/);
});

test('community themes and draft examples are photo-ready native flashcards', () => {
  const community = htmlFor('/community/');
  const cards = [...communityThemes, ...communityExamples];
  assert.equal((community.match(/<details class="food-flashcard community-flashcard/g) || []).length, cards.length);
  assert.equal((community.match(/name="community-theme"/g) || []).length, communityThemes.length);
  assert.equal((community.match(/name="community-example"/g) || []).length, communityExamples.length);
  for (const item of cards) {
    assert.ok(community.includes(`<span class="food-flashcard__title" role="heading" aria-level="3">${item.title}</span>`));
    assert.ok(community.includes(item.description));
    assert.ok(community.includes(`data-photo-slot="${item.photoKey}"`));
  }
  assert.match(community, /Open story card/);
  assert.match(community, /Community in action/);
  assert.doesNotMatch(community, /Draft example only|Stories to develop/);
  assert.match(sourceFor('site.css'), /\.community-flashcard \.food-flashcard__photo/);
});

test('impact figures keep people and donated meals separate, with annualized math', () => {
  const community = htmlFor('/community/');
  assert.equal(impactFigures.peopleFedAnnualFloor, 1_200_000);
  assert.equal(impactFigures.donatedMealsMonthlyFloor * 12, 120_000);
  assert.match(community, /<strong>1\.2M\+<\/strong><span>people fed each year<\/span>/);
  assert.match(community, /<strong>10,000\+<\/strong><span>meals donated each month<\/span>/);
  assert.match(community, /<strong>120,000\+<\/strong><span>meals a year at this pace<\/span>/);
  assert.match(community, /Calculated from more than 10,000 donated monthly/);
});

test('photo slots stay labelled until approved originals are supplied', () => {
  const expected = Object.keys(photoSlots);
  const rendered = navigation.map(({ path }) => htmlFor(path)).join('\n');
  for (const key of expected) {
    assert.ok(rendered.includes(`data-photo-slot="${key}"`), `Photo slot ${key} is not rendered`);
    const slot = photoSlots[key];
    if (slot.src) {
      assert.match(slot.src, /^\/photos\/[^"<>]+$/);
      assert.ok(slot.alt?.trim(), `Approved photo ${key} needs descriptive alt text`);
      assert.ok(existsSync(join(dist, slot.src.slice(1))), `Approved photo ${key} is missing from the build`);
      assert.ok(rendered.includes(`src="${slot.src}" alt="${slot.alt}"`), `Approved photo ${key} is not rendered`);
    } else {
      assert.ok(rendered.includes(`data-photo-slot="${key}"`), `Missing placeholder ${key}`);
    }
  }
  if (expected.some((key) => !photoSlots[key].src)) assert.match(rendered, /Photo coming soon/);
});

test('review build contains a useful 404 and the supplied floral asset', () => {
  const notFound = readFileSync(join(dist, '404.html'), 'utf8');
  assert.match(notFound, /Page not found/);
  assert.match(notFound, /Return home/);
  assert.ok(existsSync(join(dist, 'brand', 'flowers.webp')));
});
