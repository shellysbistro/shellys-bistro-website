# Shelly’s Indigenous Bistro website

Source code for Shelly’s Indigenous Bistro’s eight-page website. This is a static, dependency-free Node.js build with responsive layouts, accessible navigation and interactive food and community cards.

The [Vercel tester website](https://shellys-bistro-testers-inky.vercel.app/) is public for review, but the site is configured `noindex`. Its catering-request buttons open a separately shared catering catalogue preview; the SkipTheDishes ordering listing remains a separate destination.

## Run locally

Requires Node.js 22 or newer.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Visit `http://127.0.0.1:4173/`. Run `node --test tests/site.test.mjs` after building, or `npm run check`.

## Edit the site

- Business details, navigation, menu highlights and photo slots: `src/content.mjs`
- Page copy and sections: `src/pages.mjs`
- Styles and interactions: `src/site.css` and `src/site.js`
- Approved original images: `public/photos/` (then connect each image in `src/content.mjs` with descriptive alt text)

Vercel serves only the generated `dist/` output. It is intentionally excluded from Git. The supplied circular logo is in `public/brand/shellys-logo.png`; the floral accent and open-licensed Nunito font are also bundled under `public/`.

## Vercel

The site is deployed to the `shellys-bistro-testers` Vercel project. `vercel.json` selects the **Other** framework, runs `node scripts/build.mjs`, and serves `dist/`. This deployment was made with the Vercel CLI; GitHub pushes will not automatically deploy until the Vercel project is connected to this repository. Keep `noindex` and do not connect a final production domain until the owner approves the final content, photography, menu and business details.
