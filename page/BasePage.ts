import { Locator, Page } from "@playwright/test";
import { StringUtils } from "../utils/stringUtils";

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

    async navigate(path: string = "/"): Promise<void> {
        await this.page.goto(path);
    }

    async isVisible(): Promise<boolean> {
        return await this.page.isVisible('body');

    }

    async waitForVisible(): Promise<void> {
        await this.page.waitForSelector('body', { state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.page.waitForSelector('body', { state: 'hidden' });
    }

    async clickMenuLink() {
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

    public get instance(): Page {
        //getter for Page object
        return this.page;
    }

    async getItemCount(): Promise<number> {
        const text = await this.cartPageLink.textContent();
        return StringUtils.extractNumbers(text ?? "0");
    }
}
