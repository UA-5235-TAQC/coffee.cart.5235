import { Locator, Page } from '@playwright/test';

export class AddToCartModal {
    private page: Page;
    readonly modalContainer: Locator;
    readonly acceptButton: Locator;
    readonly declineButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalContainer = page.locator('[data-cy="add-to-cart-modal"]');
        this.acceptButton = this.modalContainer.locator('button', { hasText: 'Yes' });
        this.declineButton = this.modalContainer.locator('button', { hasText: 'No' });
    }

    /**
     * Clicks the accept button inside the modal
     */
    async accept(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'visible' }); 
        await this.acceptButton.click();
    }

    /**
     * Clicks the decline button inside the modal
     */
    async decline(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'visible' });
        await this.declineButton.click();
    }
}