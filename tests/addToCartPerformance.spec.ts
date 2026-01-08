import { test, expect } from "@playwright/test";
import { MenuPage } from "../page/MenuPage";
import env from "../config/env";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Add to Cart - Performance Tests", () => {
    let menuPage: MenuPage;
    const baseClientUrl = env.BASE_CLIENT_URL;

    test.beforeEach(async ({ page }) => {
        await page.goto(baseClientUrl);
        menuPage = new MenuPage(page);
    });

    test("add-to-cart slows down after 7 items", async () => {
        const coffees = [
            CoffeeTypes.Espresso.en,
            CoffeeTypes.Cappuccino.en,
            CoffeeTypes.CafeLatte.en,
            CoffeeTypes.Mocha.en,
            CoffeeTypes.FlatWhite.en,
            CoffeeTypes.Americano.en,
            CoffeeTypes.EspressoMacchiato.en,
            CoffeeTypes.CafeBreve.en
        ];

        const durations: number[] = [];

        //add the first 7 items
        for (let i = 0; i < 7; i++) {
            const start = performance.now();
            await menuPage.getCoffeeItem(coffees[i]).clickAdd();
            const duration = performance.now() - start;
            durations.push(duration);
        }

        // add the 8th item
        const startSlow = performance.now();
        await menuPage.getCoffeeItem(coffees[7]).clickAdd();
        const slowDuration = performance.now() - startSlow;

        // Verify that the 8th item was added slower than the average time of the previous 7
        const avgFastDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        const slowdownThreshold = 1.5; // вимагаємо як мінімум 1.5x сповільнення, щоб уникнути флаків через незначні коливання часу
        const expectedMinSlowDuration = avgFastDuration * slowdownThreshold;
        expect(slowDuration).toBeGreaterThanOrEqual(expectedMinSlowDuration);
    });
});
