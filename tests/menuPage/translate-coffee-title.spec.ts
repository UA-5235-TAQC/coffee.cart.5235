import {expect} from "@playwright/test";
import {test} from "../../fixtures/fixturePage";
import {CoffeeTypes} from "../../data/CoffeeTypes";

test.describe("TC-17: Translate coffee title to Chinese by double-clicking", () => {

    test.beforeEach(async ({menuPage}) => {
        // Preconditions: Open the website
        await menuPage.navigate();
        // The cart is empty
        await expect.poll(() => menuPage.getItemCount()).toBe(0);
    });

    test("Translate coffee title to Chinese via double-click", async ({menuPage}) => {
        // Step 1: Identify Espresso item on the page
        const espresso = menuPage.getCoffeeItem(CoffeeTypes.Espresso.en);
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 2: Double-click on the coffee title text
        await espresso.doubleClickName();

        // Step 3: Verify that the coffee title is translated to Chinese
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.zh);

        // Step 4: Double-click the same coffee title again
        await espresso.doubleClickName();

        // Step 5: Verify that the coffee title is displayed in the original language
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 6: Single-click the coffee title
        await espresso.clickName();
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 7: Double-click on Cappuccino coffee title
        const cappuccino = menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en);
        await cappuccino.doubleClickName();

        // Step 8: Verify that the coffee title is translated to Chinese
        expect(await cappuccino.getName()).toBe(CoffeeTypes.Cappuccino.zh);

        // Step 9: Refresh the page
        await menuPage.reloadPage();

        // Verify titles after reload
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);
        expect(await cappuccino.getName()).toBe(CoffeeTypes.Cappuccino.en);
    });
});
