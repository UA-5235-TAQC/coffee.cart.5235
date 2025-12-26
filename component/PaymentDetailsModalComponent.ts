import { Page, Locator } from "@playwright/test";

export class PaymentDetailsModalComponent {
    protected modalContainer: Locator;
    protected title: Locator;
    protected closeButton: Locator;
    protected descriptionText: Locator;
    protected nameInput: Locator;
    protected emailInput: Locator;
    protected promotionCheckbox: Locator;
    protected promotionLabel: Locator;
    protected submitButton: Locator;

    constructor(page: Page) {
        const modal = page.locator('div.modal-content.size');
        const header = modal.locator('section');
        const form = modal.locator('form[aria-label="Payment form"]');

        this.modalContainer = modal;
        this.title = header.locator('h1', { hasText: 'Payment details' });
        this.closeButton = header.locator('button.close');
        this.descriptionText = modal.locator('p');

        this.nameInput = form.locator('input#name');
        this.emailInput = form.locator('input#email');
        this.promotionCheckbox = form.locator('input#promotion');
        this.promotionLabel = form.locator('label#promotion-label');
        this.submitButton = form.locator('button#submit-payment');
    }

    async isModalVisible(): Promise<boolean> {
        return this.modalContainer.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'hidden' });
    }

    async getTitle(): Promise<string | null> {
        return this.title.textContent();
    }

    async getDescription(): Promise<string | null> {
        return this.descriptionText.textContent();
    }

    async closeModal(): Promise<void> {
        await this.closeButton.click();
    }

    async enterName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async getNameValue(): Promise<string> {
        return this.nameInput.inputValue();
    }

    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async getEmailValue(): Promise<string> {
        return this.emailInput.inputValue();
    }

    async togglePromotionAgreement(): Promise<void> {
        await this.promotionCheckbox.click();
    }

    async isPromotionChecked(): Promise<boolean> {
        return this.promotionCheckbox.isChecked();
    }

    async getPromotionLabelText(): Promise<string | null> {
        return this.promotionLabel.textContent();
    }

    async clickPromotionLabel(): Promise<void> {
        await this.promotionLabel.click();
    }

    async submitPayment(): Promise<void> {
        await this.submitButton.click();
    }
}
