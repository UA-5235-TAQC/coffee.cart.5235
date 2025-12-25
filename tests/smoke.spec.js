const { test, expect } = require('@playwright/test');

test('Home page opens', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');
    await expect(page).toHaveTitle(/Coffee/);
});