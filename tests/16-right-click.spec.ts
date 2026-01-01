import { test, expect } from '@playwright/test';
import { MenuPage } from '../page/MenuPage';
import { AddToCartModal } from '../component/AddToCartModal';

test.describe('TC-16: Context Menu Functionality', () => {
    let menuPage: MenuPage;
    let addToCartModal: AddToCartModal;

    test.beforeEach(async ({ page }) => {
        menuPage = new MenuPage(page);
        addToCartModal = new AddToCartModal(page);
        await menuPage.navigate();
    });

    test('Add coffee to cart using right-click context menu dialog', async ({ page }) => {
        const initialCount = await menuPage.getItemCount();
        expect(initialCount).toBe(0); // Verify that cart counter shows 0
        await menuPage.showConfirmModal('Espresso\\s*\\$' as any); // Right-click on the coffee icon
        await addToCartModal.waitForVisible();
        await addToCartModal.accept();
        await addToCartModal.waitForHidden();
        const updatedCount = await menuPage.getItemCount();
        expect(updatedCount).toBe(1); // Verify cart counter is updated to 1
        await menuPage.clickCartLink(); // Open Cart page
        await expect(page).toHaveURL(/.*cart/); // Verify Cart page opens
        await expect(page.locator('ul').filter({ hasText: 'Total' })).toContainText('Espresso'); // Verify the specific item is listed in the cart
    });
});