describe('input-email', () => {
	beforeAll(async () => {
		await browser.url('/src/input-email/');

	});
	describe('Default state', () => {
		let component, error, input;

		beforeAll(async () => {
			component = await browser.$('foo-input-email.hydrated');
			await component.waitForExist();

			error = await component.shadow$('.foo-input-email__error');
			input = await component.shadow$('input');
		});

		it('should render', async () => {
			expect(await component.isDisplayed()).toBe(true);
		});

		it('should not show an error if empty and untouched', async () => {
			expect(await component.isDisplayed()).toBe(true);
			expect(await error.isDisplayed()).toBe(false);
		});

		it('should show an error when entering an invalid value', async () => {
			await input.click();
			await browser.keys('John Doe');
			await browser.keys(['Tab']);
			expect(await error.isDisplayed()).toBe(true);
		});

		it('should not show an error when entering a valid value', async () => {
			await input.clearValue();
			await input.click();
			await browser.keys('john@doe.com');
			await browser.keys(['Tab']);
			expect(await error.isDisplayed()).toBe(false);
		})
	});

	describe('Invalid state', () => {
		let component, error, input;

		beforeAll(async () => {
			component = await browser.$('#prefilled-invalid');
			await component.waitForExist();

			error = await component.shadow$('.foo-input-email__error');
			input = await component.shadow$('input');
		});

		it('should not show an error when entering valid value', async () => {
			expect(await error.isDisplayed()).toBe(true);
			await input.clearValue();
			await input.click();
			await browser.keys('john@doe.com');
			await browser.keys(['Tab']);
			expect(await error.isDisplayed()).toBe(false);
		});
	})
});
