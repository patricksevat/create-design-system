const path = require('path');

exports.config = {
  runner: 'local',
  specs: [
    './src/**/*.e2e.spec.ts',
    './src/**/*.visual.spec.ts',
    // './src/**/*.a11y.spec.ts',
  ],
  exclude: [],
  maxInstances: 5,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--headless',
        '--disable-gpu',
        '--allow-insecure-localhost'
      ]
    }
  }],
  logLevel: 'warn',
  bail: 0,
  deprecationWarnings: true,
  baseUrl: 'http://localhost:3333',
  waitForTimeout: 10000,
  framework: 'jasmine',
  outputDir: './.tmp',
  services: [
    'selenium-standalone',
    ['image-comparison', {
      baselineFolder: path.join(process.cwd(), './baseline-images/'),
      formatImageName: '{tag}-{logName}-{width}x{height}',
      screenshotPath: path.join(process.cwd(), '.tmp'),
      savePerInstance: true,
      autoSaveBaseline: true,
      blockOutStatusBar: true,
      blockOutToolBar: true,
    }]
  ],
  reporters: [
    'spec'
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000,
  },
  afterTest: function (test) {
    if (test.passed) {
      return;
    }
    const browserName = browser.capabilities.browserName;
    const timestamp = new Date().toJSON().replace(/:/g, '-');
    const filename = 'ERR_' + browserName + '_' + timestamp + '.png';
    const filePath = path.join(outputDir, filename);
    console.log('Saving screenshot as ' + filePath);
    browser.saveScreenshot(filePath);
  },
  before() {
    require('ts-node').register({
      files: true,
      compilerOptions: {
        "baseUrl": ".",
        "paths": {
          "*": [ "./*" ],
          "src/*": ["./src/*"]
        },
        "types": ["node", "webdriverio", "@wdio/jasmine-framework", "jest"]
      }
    });
  },
}
