# Docz related

### Not filty at all (just documenting change)
* Had to modify `portal/src/gatsby-theme-docz/base/Seo.js` to add the Stencil `<script>`-tags
* importing global styles in `portal/src/gatsby-browser.js`
* Adding some lines to `portal/package.json` to make lerna monorepo play nicely with Docz. 
[Now officially documented](https://www.docz.site/docs/usage-in-monorepo)
* Adding a webpack plugin to reload gatsby on file changes in stencil dist folder TODO FIGURE OUT HOW TO SEND WEBSOCKET NOTIFICATION checout https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/utils/webpack.config.js

### Eww, dude, that's nasty
* Had to overwrite `"scheduler": "^0.15.0"` to `portal/package.json` (https://github.com/pedronauck/docz/issues/1000)
* In order to get the HMR in docz working when stencil --dev updates the bundle I had to create an artificial import for all components in gatsby.browser.js (see createSymLink.ts.ejs)
❗ Only needed if you want to dev in portal, will increase bundle size (but not in prod)
* All `packages/components/src/**.*.mdx` files need to reside in their own `docs` directory. 
Is needed to create a symlink so HMR will work on .mdx files. I could not symlink the whole `packages/components/*/` directory
as that would make lerna complain about packages with the same name.

### 🤮🤮🤮
* Adding the `allow-scripts` value to the `<iframe sandbox>` attribute in 
`portal/src/gatsby-theme-docz/components/Playground/IframeWrapper.js`.

❗❗❗ `allow-scripts` on iframes is [STRONGLY DISCOURAGED](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox). 
If you have any user generated content in your .mdx files, **YOU SHOULD NOT USE THIS SOLUTION 🚨** ❗❗❗

* Overwriting `gatsby-theme-docz/src/Header/index.js`, `gatsby-theme-docz/src/NavLink/index.js`, see [#985](https://github.com/pedronauck/docz/issues/985)
    * Adding `@emotion/core` and `ramda` packages because they are needed in these shadowed components

*  Adding the stencil `<script>` tag to the `<iframe srcdoc>` attribute in 
                                                                        `portal/src/gatsby-theme-docz/components/Playground/IframeWrapper.js`.

This is needed to make sure we can use Stencil's Webcomponents in an iframe context (which has its own `window` context)

 