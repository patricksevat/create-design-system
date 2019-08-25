describe('input-email visual regression', () => {
	beforeEach( async () => {
		await browser.url('/src/button/');
	});

	it('should compare successful with a baseline', async () => {
		await expect(await browser.checkScreen('button', { })).toEqual(0);
	})
})
