export interface ICliOptions {
  templateConfig: {
    description: string,
    name: string,
    prefix: string,
    prefixPascalCase: string
  }
  componentCompiler: ComponentCompiler,
  documentationProvider: DocumentationProvider,
  testingFramework: TestingFramework
}

export enum ComponentCompiler {
  stencil = "stencil",
  // svelte = "svelte",
  // litElement = "litElement",
  // polymer = "polymer",
}

export enum DocumentationProvider {
  docz = "docz",
  storybook = "storybook",
}

export enum TestingFramework {
  // wdio = "webdriverIO",
  jest = "Jest",
  // cypress = "cypress",
}
