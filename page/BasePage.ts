import { Locator, Page } from "@playwright/test";
import { StringUtils } from '../utils/stringUtils';

export abstract class BasePage {
    protected page: Page; //page should be protected according POM principles
    protected menuPageLink: Locator;
    protected cartPageLink: Locator;
    protected gitHubPageLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuPageLink = page.getByLabel("Menu page");
        this.cartPageLink = page.getByLabel("Cart page");
        this.gitHubPageLink = page.getByLabel("GitHub page");
    }
    async clickMenuLink () {
        await this.menuPageLink.click();
    }
    async clickCartLink() {
        await this.cartPageLink.click();
    }
    async clickGitHubLink() {
        await this.gitHubPageLink.click();
    }
    async getTitleText() {
        return await this.page.title();
    }

    async getItemCount(): Promise<number> {
        const text = await this.cartPageLink.textContent();
        return StringUtils.extractNumbers(text ?? ""); // Return an empty string if there is no text
    }

    public get instance(): Page {   //getter for Page object
        if (!this.page) throw new Error("Page not initialized!");
        return this.page;
    }

    abstract navigate(): Promise<void>;
}
