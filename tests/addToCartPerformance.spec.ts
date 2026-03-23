import { test, expect } from "../fixtures/fixturePage"; 
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Add to Cart - Performance Tests", () => {

    test("add-to-cart slows down after 7 items", async ({ menuPage }) => {
        await menuPage.navigate();

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

        // Add the first 7 items
        for (let i = 0; i < 7; i++) {
            const start = performance.now();
            await menuPage.getCoffeeItem(coffees[i]).clickAdd();
            const duration = performance.now() - start;
            durations.push(duration);
        }

        // Add the 8th item (expecting slowdown)
        const startSlow = performance.now();
        await menuPage.getCoffeeItem(coffees[7]).clickAdd();
        const slowDuration = performance.now() - startSlow;

        // Calculate average duration of the first 7 additions
        const avgFastDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
        
        // Slowdown factor (1.5x)
        const slowdownThreshold = 1.5; 
        const expectedMinSlowDuration = avgFastDuration * slowdownThreshold;

        expect(slowDuration).toBeGreaterThanOrEqual(expectedMinSlowDuration);
    });
});