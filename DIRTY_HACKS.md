# Stencil related
* Can't rename `test` script to `test:unit`, due to [#1609](https://github.com/ionic-team/stencil/issues/1609)
* Nasty, including `@types/jasmine` clashes with Jest, fixed by requiring jest in types in wdio.conf.js. TODO research more: https://stackoverflow.com/questions/31322525/confusing-duplicate-identifier-typescript-error-message

# WDIO related
* No TypeScript support yet for wdio-image-comparison-service so all visual.spec files are .js, not .ts

# Docz related
* [Component Shortcodes](https://www.docz.site/docs/gatsby-theme#adding-component-shortcodes) does not work as expected, 
so copied over whole gatsby-theme-docz/src/components/index.js

### Not filty at all (just documenting change)
* Had to modify `portal/src/gatsby-theme-docz/base/Seo.js` to add the Stencil `<script>`-tags
* importing global styles in `portal/src/gatsby-browser.js`
* Adding some lines to `portal/package.json` to make lerna monorepo play nicely with Docz.
[Now officially documented](https://www.docz.site/docs/usage-in-monorepo)

### Eww, dude, that's nasty
* In order to get the HMR in docz working when stencil --dev updates the bundle I had to create an artificial import for all components in gatsby.browser.js (see copyDist.ts.ejs)
❗ Only needed if you want to dev in portal, will increase bundle size (but not in prod)
* All `packages/components/src/**.*.mdx` files need to reside in their own `docs` directory.
Is needed to create a symlink so HMR will work on .mdx files. I could not symlink the whole `packages/components/*/` directory
as that would make lerna complain about packages with the same name.
