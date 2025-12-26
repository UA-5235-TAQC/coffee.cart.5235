import { test, expect } from '@playwright/test';
import { CartPreviewComponent } from '../component/cartPreview';
import env from '../config/env';

test.describe('CartPreview - Smoke Tests', () => {
  let cartPreview: CartPreviewComponent;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    cartPreview = new CartPreviewComponent(page);
  });

  test('cart preview initially hidden', async () => {
    await expect(cartPreview.cartPreviewContainer).toBeHidden();
  });

  test('cart preview is showed on hover', async () => {
    await cartPreview.addProduct('Espresso');
    await cartPreview.openCartPreview();
    await expect(cartPreview.cartPreviewContainer).toBeVisible();
  });

  test('remove item from cart when quantity reaches zero', async () => {
    const itemName = 'Espresso';

    await cartPreview.addProduct(itemName);
    await cartPreview.decreaseItemQuantity(itemName);

    await expect(cartPreview.cartPreviewContainer).toBeHidden();
  });

  test('total updates when increasing item quantity', async () => {
    await cartPreview.addProduct('Espresso');
    const initialTotal = await cartPreview.getTotalAmount();

    await cartPreview.increaseItemQuantity('Espresso');
    const newTotal = await cartPreview.getTotalAmount();

    expect(newTotal).toBeCloseTo(initialTotal * 2, 1);
  });
});
