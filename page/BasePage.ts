import { Locator, Page } from "@playwright/test";
import { StringUtils } from '../utils/stringUtils';
import { Base } from '../Base';

export abstract class BasePage extends Base {
    protected menuPageLink: Locator;
    protected cartPageLink: Locator;
    protected gitHubPageLink: Locator;

    constructor(page: Page) {
        super(page);
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
        return StringUtils.extractNumbers(text ?? ""); // Return 0 if there is no text
    }

    public get instance(): Page {   //getter for Page object
        return this.page;
    }
}
