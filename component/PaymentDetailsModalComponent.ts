import { Page, Locator } from "@playwright/test";
import { Base } from "../Base";

export class PaymentDetailsModalComponent extends Base {
    protected root: Locator;
    protected title: Locator;
    protected closeButton: Locator;
    protected descriptionText: Locator;
    protected nameInput: Locator;
    protected emailInput: Locator;
    protected promotionCheckbox: Locator;
    protected promotionLabel: Locator;
    protected submitButton: Locator;

    constructor(page: Page) {
        super(page);

        this.root = this.page.locator("div.modal-content.size");
        const headerSection = this.root.locator('section');
        const form = this.root.locator('form[aria-label="Payment form"]');

        this.title = headerSection.locator('h1', { hasText: 'Payment details' });
        this.closeButton = headerSection.locator('button.close');
        this.descriptionText = this.root.locator('p').first();

        this.nameInput = form.locator('input#name');
        this.emailInput = form.locator('input#email');
        this.promotionCheckbox = form.locator('input#promotion');
        this.promotionLabel = form.locator('label#promotion-label');
        this.submitButton = form.locator('button#submit-payment');
    }

    async isVisible(): Promise<boolean> {
        return this.root.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.root.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.root.waitFor({ state: 'hidden' });
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

    get pageInstance(): Page {
        return this.page;
    }
}
