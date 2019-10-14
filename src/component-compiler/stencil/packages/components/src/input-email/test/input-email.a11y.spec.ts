import * as axe from 'axe-core';

describe('input-email a11y', () => {
  beforeAll(async () => {
    await browser.url('/src/input-email/');
  });

  it('should be accessible', async () => {
      await browser.execute(axe.source)

      // https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
      const options = { runOnly: ['wcag2a', 'wcag2aa'] };
      // run inside browser and get results
      const results = await browser.executeAsync((options, done) => {
        const axe = (window as any).axe;
        axe.run(document, options, function(err, results) {
          if (err) throw err;
          done(results);
        });
      }, options);

      if (results.violations.length) {
        const failureNodes = results.violations.reduce((aggregator, violation) => {
          const { html, failureSummary } = violation.nodes[0];
          return [...aggregator, { html, failureSummary }];
        }, []);
        console.log(JSON.stringify(failureNodes, null, 2))
        fail();
      }

      expect(results.violations.length).toBe(0);
  })
});
