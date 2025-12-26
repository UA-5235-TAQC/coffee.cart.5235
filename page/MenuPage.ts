import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CoffeeCartComponent } from "../component/CoffeeCartComponent";
import { StringUtils } from "../utils/stringUtils";
import { CoffeeTypes } from "../data/CoffeeTypes";

export  class MenuPage extends BasePage {
    protected coffee: CoffeeCartComponent;     
    protected totalBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.coffee = new CoffeeCartComponent(page);
        this.totalBtn = page.getByLabel('Proceed to checkout');
    }
    async navigate(): Promise<void> {
        await this.page.goto("/");
    }

    async getTotalBtnText(): Promise<string> {
        const text = await this.totalBtn.textContent();
        return text?.trim() ?? "";
    }

    async getTotalBtnPrice(): Promise<number> {
        return StringUtils.extractNumbers(await this.getTotalBtnText());
    }

    async addRandomCoffeeToCart() {
        const coffeeNames = Object.values(CoffeeTypes);
        const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
        const coffeeItem = this.coffee.get(randomName); //change on real method
        await coffeeItem.click();
    }

     async showConfirmModal() {
        const coffeeNames = Object.values(CoffeeTypes);
        const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
        const coffeeItem = this.coffee.get(randomName); //change on real method
        await coffeeItem.click({ button: 'right' });
    }

    async showPromoModal() {
        const coffeeNames = Object.values(CoffeeTypes);

        for (let i = 0; i < 3; i++) {
            const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
            const coffeeItem = this.coffee.get(randomName); //change on real method
            await coffeeItem.click();
        }
    }

    async showCheckout() { await this.totalBtn.hover(); }
}
