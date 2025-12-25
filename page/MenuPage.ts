import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
//import { PromoModal } from "./component/PromoModal";
//import { CoffeeCartComponent } from "./component/CoffeeCartComponent";
//import { IngredientComponent } from "./component/IngredientComponent";
import { StringUtils } from "../utils/stringUtils";
import { CoffeeTypes } from "../data/CoffeeTypes";

export  class MenuPage extends BasePage {
    //protected readonly ingredients: IngredientComponent;
    //protected readonly promoModal: PromoModal;
    //protected readonly coffee: CoffeeCartComponent;
    //protected readonly addToCartModal: AddToCartModal;     
    protected totalBtn: Locator;

    constructor(page: Page) {
        super(page);
        //this.ingredients = new IngredientComponent(page);
        //this.promoModal = new PromoModal(page);
        //this.coffee = new CoffeeCartComponent(page);
        //this.addToCartModal = new AddToCartModal(page);
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
        //const coffee = this.getCoffeeItem(randomName); //change on real method
        //await coffee.click();
    }

     async showConfirmModal() {
        const coffeeNames = Object.values(CoffeeTypes);
        const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
        //const coffee = this.getCoffeeItem(randomName); change on real method
        //await coffee.root.click({ button: 'right' });
    }

    async showPromoModal() {
        const coffeeNames = Object.values(CoffeeTypes);

        for (let i = 0; i < 3; i++) {
            const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
            //const coffee = this.getCoffeeItem(randomName);
            //await coffee.root.click();
        }
    }
}
