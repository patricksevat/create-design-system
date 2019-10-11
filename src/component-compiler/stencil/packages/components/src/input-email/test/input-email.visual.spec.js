describe('input-email visual regression', () => {
  beforeEach( async () => {
    await browser.url('/src/input-email/');
  });

  it('should compare successful with a baseline', async () => {
    // options: https://github.com/wswebcreation/wdio-image-comparison-service/blob/master/docs/OPTIONS.md#method-options
    const options = {};
    await expect(await browser.checkScreen('input-email', options)).toEqual(0);
  })
})
