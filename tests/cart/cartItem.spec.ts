import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";

test.describe("Cart item", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();

    const cartItemCount = await menuPage.getItemCount();

    expect(cartItemCount).toBe(0);
  });

  test("TC-006: Managing the number of items in the cart", async ({ menuPage, cartPage }) => {
    const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();

    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

    let amountOfItemsInCart = 3;
    let expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

    const cartItemCount = await menuPage.getItemCount();
    const totalBtnPrice = await menuPage.getTotalBtnPrice();

    expect(cartItemCount).toBe(amountOfItemsInCart);
    expect(totalBtnPrice).toBe(expectedTotalPrice);

    await menuPage.clickCartLink();
    await expect(cartPage.itemList).toBeVisible();

    const cartItem = await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);

    await expect(cartItem.container).toBeVisible();

    const cartItemQuantity = await cartItem.getQuantity();
    const cartItemTotalPrice = await cartItem.getTotalPrice();

    expect(cartItemQuantity).toBe(amountOfItemsInCart);
    expect(cartItemTotalPrice).toBe(expectedTotalPrice);

    await cartItem.increaseQuantity();

    amountOfItemsInCart += 1;
    expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

    const updatedCartItemQuantity = await cartItem.getQuantity();
    const updatedCartItemTotalPrice = await cartItem.getTotalPrice();

    expect(updatedCartItemQuantity).toBe(amountOfItemsInCart);
    expect(updatedCartItemTotalPrice).toBe(expectedTotalPrice);

    await cartItem.decreaseQuantityBy(4);

    const isCartEmpty = await cartPage.isEmpty();

    await expect(cartItem.container).toBeHidden();
    expect(isCartEmpty).toBe(true);
  });
});