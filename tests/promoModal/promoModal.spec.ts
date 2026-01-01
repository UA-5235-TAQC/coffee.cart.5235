import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";

test.describe("Promo Modal", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
    await expect.poll(() => menuPage.getItemCount()).toBe(0);
  });

  test("TC-011: Checking the functionality of the Promotional Offer", async ({ menuPage }) => {
    const { promoModal } = menuPage;

    // Add 3 coffees to trigger and accept the promo modal
    // NOTE: can't use showPromoModal() method here, as we need to know what coffees are added to cart to check total later
    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Americano.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
    
    await promoModal.waitForVisible();
    await promoModal.acceptPromo();
    await promoModal.waitForHidden();

    const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
    const americanoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Americano.en).getPrice();
    const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();
    const mochaPrice = await menuPage.getCoffeeItem(CoffeeTypes.Mocha.en).getPrice();

    const promoCoffeeDiscount = 0.5; // 50% discount
    const promoCoffeePrice = mochaPrice * promoCoffeeDiscount;

    let amountOfItemsInCart = 4;
    let expectedTotal = espressoPrice + americanoPrice + cappuccinoPrice + promoCoffeePrice;

    await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedTotal);
    await expect.poll(() => menuPage.getItemCount()).toBe(amountOfItemsInCart);

    // Add another 2 coffees and skip the promo
    await menuPage.addCoffeeToCart(CoffeeTypes.CafeBreve.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.FlatWhite.en);

    await promoModal.waitForVisible();
    await promoModal.skipPromo();
    await promoModal.waitForHidden();

    const cafeBreve = menuPage.getCoffeeItem(CoffeeTypes.CafeBreve.en);
    const flatWhite = menuPage.getCoffeeItem(CoffeeTypes.FlatWhite.en);

    const cafeBrevePrice = await cafeBreve.getPrice();
    const flatWhitePrice = await flatWhite.getPrice();

    amountOfItemsInCart += 2;
    expectedTotal += cafeBrevePrice + flatWhitePrice;

    await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedTotal);
    await expect.poll(() => menuPage.getItemCount()).toBe(amountOfItemsInCart);

    // Add another 3 coffees and skip the promo by adding 1 more coffee
    await menuPage.addCoffeeToCart(CoffeeTypes.CafeLatte.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.EspressoConPanna.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.EspressoMacchiato.en);

    await promoModal.waitForVisible();
    await menuPage.addCoffeeToCart(CoffeeTypes.Mocha.en);
    await promoModal.waitForHidden();

    const cafeLattePrice = await menuPage.getCoffeeItem(CoffeeTypes.CafeLatte.en).getPrice();
    const espressoConPannaPrice = await menuPage.getCoffeeItem(CoffeeTypes.EspressoConPanna.en).getPrice();
    const espressoMacchiatoPrice = await menuPage.getCoffeeItem(CoffeeTypes.EspressoMacchiato.en).getPrice();

    amountOfItemsInCart += 4;
    expectedTotal += cafeLattePrice + espressoConPannaPrice + espressoMacchiatoPrice + mochaPrice;

    await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedTotal);
    await expect.poll(() => menuPage.getItemCount()).toBe(amountOfItemsInCart);
  });
});