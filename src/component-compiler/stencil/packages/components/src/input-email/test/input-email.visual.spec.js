describe('input-email visual regression', () => {
	beforeEach( async () => {
		await browser.url('/src/input-email/');
	});

	it('should compare successful with a baseline', async () => {
		await expect(await browser.checkScreen('input-email', { /* some options*/ })).toEqual(0);
	})
})
