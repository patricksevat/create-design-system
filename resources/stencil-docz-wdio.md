# Stencil & Docz & WDIO

## Development

There are two ways to develop components with Stencil and Docz:

1. Using Docz dev server as primary development tool

<details>
<summary>Using this workflow</summary>

### Workflow
*  Start Stencil dev server: `cd packages/components && yarn start` 
    This will open up a browser tab which you can close.
* Open a second terminal windows and start the Docz dev server: `cd packages/portal && yarn start`
    This will open up a browser tab with Docz dev server, it will initially show a blank page. 
    Check your terminal when you can refresh and start developing.
* Go to your component page in your browser
* Any changes you make to `packages/components/src/*.{tsx,scss,mdx}` will hot reload the Docz dev server

### Pros
* Very integrated development approach
    * Immediately see if your changes make the documentation outdated
    * Easy to check if other components (molecules, design patterns) that use your
    change component are affected
* Visually more attractive dev environment than Stencil dev server

### Cons
* Slightly slower than using Stencil dev server
* If you add a new component you need to restart the Docz dev server
* it requires to have the component directory to have `docz/*.mdx` file

</details>

2. Using Stencil dev server as primary development tool

<details>
<summary>Using this workflow</summary>

### Workflow
* Start Stencil dev server: `cd packages/components && yarn start` 
* This will open a browser tab which loads `packages/component/index.html`
* Click on your component
* You will be redirected to `/src/component/index.html`
* Make the changes you need
* Start the Docz dev server `cd packages/portal && yarn start --no-sym-link`
* Verify all docs are up to date

### Pros
* Faster than the integrated approach
* No need for symlinks
        
### Cons
* Have to start up Docz server every time you change your component to verify docs
* Restart Docz server if you make changes to your .mdx file

</details>
    
## Testing

### Unit tests
* Run unit tests by executing `$ yarn test` in `packages/components`
    * This will run all `*.spec.ts` files
* Unit tests are written using Jest 
[following the guidelines from the Stencil Docs](https://stenciljs.com/docs/unit-testing)

### End-to-end (e2e), visual, a11y
For e2e, visual and accessibility visual tests we use utilize the [WebdriverIO](https://webdriver.io) (wdio) tooling
  
<details>
    <summary>Why move away from Stencil e2e tests?</summary>
    
We move away from the guidelines by Stencil and utilize the [WebdriverIO](https://webdriver.io) (wdio) tooling. The main reason is that we are able to 
share our setup for these tests and that Wdio is battle tested, where Stencil's Visual tests are experimental 
and Stencil does not provide any A11y testing out of the box
    
</details>

The generated configuration works out of the box using wdio v5 and related packages needed for testing
on Chrome, including Visual Regression and Accessibility tests. However, Wdio does not stop there. browse 
[their documentation](https://webdriver.io/docs/gettingstarted.html) to finetune it to your needs (more browsers, Browserstack, CI integration and much more)

#### Running e2e tests

#### Running a11y tests

#### Running visual regression tests

## Committing

TODO

## Deploying to production

### Create production builds

#### Stencil production build

Run `$ yarn build` in `packages/components`.

This will create a production build in `packages/components/dist` and 
make loaders (entry points) available in `packages/components/loader`.

#### Docz production build

Run `$ yarn build` in `packages/portal` 
(❗ this assumes that you have ran `yarn start` before, TODO)

#### Using your Stencil build in React/Angular/Vue/Vanilla

Please see the [official documentation](https://stenciljs.com/docs/overview) 