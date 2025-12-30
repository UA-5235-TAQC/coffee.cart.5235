import { CoffeeTypes } from "../data/CoffeeTypes";
import { expect, test } from "../fixtures/fixturePage";
import { BasePage } from "../page/BasePage";

test.describe('Coffee Cart System Tests', () => {

    test("has title", async ({ baseClientUrl, menuPage, cartPage, gitHubPage }) => {
        await menuPage.navigate();

        await expect(await menuPage.getTitleText()).toEqual("Coffee cart");

        await menuPage.clickCartLink();
        await expect(cartPage.instance).toHaveURL(`${baseClientUrl}/cart`);

        await cartPage.clickGitHubLink();
        await expect(gitHubPage.instance).toHaveURL(`${baseClientUrl}/github`);
    });

    test('should process the full promo flow and verify cart', async ({ menuPage, cartPage }) => {
        await menuPage.navigate();

        expect(await menuPage.getTitleText()).toBe('Coffee Cart');

        const espresso = menuPage.getCoffeeItem(CoffeeTypes.Espresso);
        await espresso.clickAdd();

        await menuPage.showPromoModal();

        await expect(menuPage.PromoModal.root).toBeVisible();

        const totalText = await menuPage.getTotalBtnText();
        expect(totalText).toContain('Total:');

        await menuPage.PromoModal.acceptPromo();
        await menuPage.PromoModal.waitForHidden();

        const count = await menuPage.getItemCount();
        expect(count).toBeGreaterThan(1);

        await menuPage.clickCartLink();

        await expect(cartPage.instance).toHaveURL(/.*cart/);
    });
})
