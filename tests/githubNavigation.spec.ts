import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";

test.describe("GitHub navigation", () => {
    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
        await menuPage.waitForVisible();
    });
    test('TC-37: should navigate from header GitHub link to external repository via internal GitHub page', async ({
        page,
        menuPage,
        gitHubPage,
    }) => {
        await menuPage.clickGitHubLink();

        await expect(gitHubPage.isOpened()).resolves.toBeTruthy();

        const repoLink = page.locator('a', { hasText: 'jecfish/coffee-cart' });
        await expect(repoLink).toBeVisible();

        await repoLink.click();

        await page.waitForLoadState('load');
        await expect(page).toHaveURL(/github\.com\/jecfish\/coffee-cart/);
        await expect(page.locator('body')).toContainText('jecfish/coffee-cart');
        
    });
});
