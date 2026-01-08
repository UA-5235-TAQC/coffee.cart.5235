import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Coffee Cart - Total Calculation", () => {

    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
    });

    test("valid calculation of total after adding multiple coffee types", async ({ menuPage }) => {
        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

        const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
        const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();

        const expectedTotal = espressoPrice + cappuccinoPrice;
        const displayedTotal = await menuPage.getTotalBtnPrice();

        expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
    });
});
