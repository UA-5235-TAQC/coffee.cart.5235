import { Page, Locator } from '@playwright/test';

export class PromoModal {
  protected page: Page;
  protected modal: Locator;
  protected acceptButton: Locator;
  protected skipButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('.promo');
    this.acceptButton = page.locator('button:has-text("Yes, of course!")');
    this.skipButton = page.locator('button:has-text("Nah, I\'ll skip.")');
  }

  async acceptPromo() {
    await this.acceptButton.click();
  }

  async skipPromo() {
    await this.skipButton.click();
  }
}