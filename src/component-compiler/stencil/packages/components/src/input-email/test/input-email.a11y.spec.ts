import * as axe from 'axe-core';

describe('input-email a11y', () => {
  beforeAll(async () => {
    await browser.url('/src/input-email/');
  });

  it('should be accessible', async () => {
      await browser.execute(axe.source);

      // https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
      const options = { runOnly: ['wcag2a', 'wcag2aa'] };
      // run inside browser and get results
      const results = await browser.executeAsync((opts, done) => {
        const globalAxe = (window as any).axe;
        globalAxe.run(document, opts, (err, res) => {
          if (err) throw err;
          done(res);
        });
      }, options);

      if (results.violations.length) {
        const failureNodes = results.violations.reduce((aggregator, violation) => {
          const { html, failureSummary } = violation.nodes[0];
          return [...aggregator, { html, failureSummary }];
        }, []);
        console.log(JSON.stringify(failureNodes, null, 2));
        fail();
      }

      expect(results.violations.length).toBe(0);
  });
});
