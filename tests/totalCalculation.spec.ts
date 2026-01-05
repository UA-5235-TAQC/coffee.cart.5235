import { test, expect } from "@playwright/test";
import { MenuPage } from "../page/MenuPage";
import { CartPage } from "../page/CartPage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Coffee Cart - Total Calculation", () => {
    let menuPage: MenuPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        menuPage = new MenuPage(page);
        cartPage = new CartPage(page);
        await menuPage.navigate();
    });

    test("valid calculation of total after adding multiple coffee types", async () => {


        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

        const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
        const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();

        const expectedTotal = espressoPrice + cappuccinoPrice;
        const displayedTotal = await menuPage.getTotalBtnPrice();

        expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
    });
});
