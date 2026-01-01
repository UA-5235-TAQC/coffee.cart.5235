import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";

test.describe("Cart item", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
    await expect.poll(() => menuPage.getItemCount()).toBe(0);
  });

  test("TC-006: Managing the number of items in the cart", async ({ menuPage, cartPage }) => {
    const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();

    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

    let amountOfItemsInCart = 3;
    let expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

    await expect.poll(() => menuPage.getItemCount()).toBe(amountOfItemsInCart);
    await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedTotalPrice);

    await menuPage.clickCartLink();
    await expect(cartPage.itemList).toBeVisible();

    const cartItem = await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);

    await expect(cartItem.container).toBeVisible();

    await expect.poll(() => cartItem.getQuantity()).toBe(amountOfItemsInCart);
    await expect.poll(() => cartItem.getTotalPrice()).toBe(expectedTotalPrice);

    await cartItem.increaseQuantity();

    amountOfItemsInCart += 1;
    expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

    await expect.poll(() => cartItem.getQuantity()).toBe(amountOfItemsInCart);
    await expect.poll(() => cartItem.getTotalPrice()).toBe(expectedTotalPrice);

    await cartItem.decreaseQuantityBy(4);

    await expect(cartItem.container).toBeHidden();
    await expect.poll(() => cartPage.isEmpty()).toBe(true);
  });
});