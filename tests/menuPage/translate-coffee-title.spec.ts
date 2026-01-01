import {expect} from "@playwright/test";
import {test} from "../../fixtures/fixturePage";
import {CoffeeTypes} from "../../data/CoffeeTypes";

test.describe("TC-17: Translate coffee title to Chinese by double-clicking", () => {

    test.beforeEach(async ({menuPage}) => {
        // Preconditions: The cart is empty
        await menuPage.navigate();
        await expect.poll(() => menuPage.getItemCount()).toBe(0);
    });

    test("Translate coffee title to Chinese via double-click", async ({menuPage}) => {
        // Step 1: Open the website
        // Already done in beforeEach
        // Step 2: Identify any coffee item on the page (Espresso)
        const espresso = menuPage.getCoffeeItem(CoffeeTypes.Espresso.en);
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 3: Double-click on the coffee title text
        await espresso.doubleClickName();

        // Step 4: Verify that the coffee title is translated to Chinese
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.zh);

        // Step 5: Double-click the same coffee title again
        await espresso.doubleClickName();

        // Step 6: Verify that the coffee title is displayed in the original language
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 7: Single-click the coffee title
        await espresso.clickName();
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);

        // Step 8: Double-click on another coffee title (Cappuccino)
        const cappuccino = menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en);
        await cappuccino.doubleClickName();

        // Step 9: Verify that the coffee title is translated to Chinese
        expect(await cappuccino.getName()).toBe(CoffeeTypes.Cappuccino.zh);

        // Step 10: Refresh the page
        await menuPage.reloadPage();

        // Verify titles after reload
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);
        expect(await cappuccino.getName()).toBe(CoffeeTypes.Cappuccino.en);
    });
});
