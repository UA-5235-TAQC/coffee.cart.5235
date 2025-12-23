import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
    public page: Page;
    protected menuPageLink: Locator;
    protected cartPageLink: Locator;
    protected gitHubPageLink: Locator;
    protected title: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuPageLink = page.getByRole("link", { name: "Menu" });
        this.cartPageLink = page.getByRole("link", { name: "Cart" });
        this.gitHubPageLink = page.getByRole("link", { name: "GitHub" });
        this.title = page.locator("xpath=/html/head/title");
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
        return await this.title.textContent();
    }

    abstract navigate(): Promise<void>;
}
