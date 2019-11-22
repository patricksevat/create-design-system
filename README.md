# Create-design-system

## General usage

1. Create a new folder (for example `my-design-system`):
    `$ mkdir my-design-system`
2. Run this command and answers the prompts: `npx create-design-system-cli`
3. Check the develop flow for your tools of choice

| Tool combination | Resources |
|---|---|
| Stencil / Docz / WDIO | [Documentation](/resources/stencil-docz-wdio.md)

# TODO

* Make Docz look nice
    * Make Props table look nice
* Create production build (strip dynamic imports!)
* Create `packages/portal` `yarn start --no-sym-link` option
* Update generated README
    * How to run tests
    * How to see your components
    * How to see your components in docz
* Add script that runs portal and stencil parallel
* Add GIFs to main README
* check npx commnd (ts to js compilation maybe?)
* reload docz on css changes
* rename package to create-stencil-design-system
* add gifs
* add links to litElement, litHtml, openWC
* build storybook dist
* storybook HMR with Stencil updates
