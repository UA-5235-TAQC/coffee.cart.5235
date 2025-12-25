import { Page, Locator } from "@playwright/test";

export class PaymentDetailsModalComponent {
    readonly page: Page;
    readonly modalContainer: Locator;
    readonly modalHeader: Locator;
    readonly title: Locator;
    readonly closeButton: Locator;
    readonly descriptionText: Locator;
    readonly paymentForm: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly promotionCheckbox: Locator;
    readonly promotionLabel: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalContainer = page.locator('div.modal-content.size');
        this.modalHeader = this.modalContainer.locator('section');
        this.title = this.modalHeader.locator('h1', { hasText: 'Payment details' });
        this.closeButton = this.modalHeader.locator('button.close');
        this.descriptionText = this.modalContainer.locator('p');
        this.paymentForm = this.modalContainer.locator('form[aria-label="Payment form"]');
        this.nameInput = this.paymentForm.locator('input#name');
        this.emailInput = this.paymentForm.locator('input#email');
        this.promotionCheckbox = this.paymentForm.locator('input#promotion');
        this.promotionLabel = this.paymentForm.locator('label#promotion-label');
        this.submitButton = this.paymentForm.locator('button#submit-payment');
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
