import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CoffeeCartComponent } from "../component/CoffeeCartComponent";
import { AddToCartModal } from "../component/AddToCartModal";
import { PaymentDetailsModalComponent } from "../component/PaymentDetailsModalComponent";
import { PromoModalComponent } from "../component/PromoModalComponent";
import { SuccessSnackbarComponent } from "../component/SuccessSnackbarComponent";
import { CartPreviewComponent } from "../component/CartPreviewComponent";
import { StringUtils } from "../utils/stringUtils";
import { CoffeeTypes } from "../data/CoffeeTypes";

export  class MenuPage extends BasePage {
    public readonly coffee: CoffeeCartComponent;  
    public readonly ConfirmModal: AddToCartModal;     
    public readonly PaymentModal: PaymentDetailsModalComponent; 
    public readonly PromoModal: PromoModalComponent; 
    public readonly SuccessSnackbar: SuccessSnackbarComponent; 
    public readonly CartPreview: CartPreviewComponent; 
    public readonly totalBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.coffee = new CoffeeCartComponent(page);
        this.ConfirmModal = new AddToCartModal(page);
        this.PaymentModal = new PaymentDetailsModalComponent(page);
        this.PromoModal = new PromoModalComponent(page);
        this.SuccessSnackbar = new SuccessSnackbarComponent(page);
        this.CartPreview = new CartPreviewComponent(page);
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

    getCoffeeLocator(name: CoffeeTypes): Locator {
        return this.page.locator('ul > li').filter({
            has: this.page.locator('h4', { hasText: new RegExp(`^${name}`) })
        });
    }
    
    async addRandomCoffeeToCart() {
        const coffeeNames = Object.values(CoffeeTypes);
        const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
        const coffeeItem = this.getCoffeeLocator(randomName); 
        await coffeeItem.click();
    }

     async showConfirmModal() {
        const coffeeNames = Object.values(CoffeeTypes);
        const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
        const coffeeItem = this.getCoffeeLocator(randomName); 
        await coffeeItem.click({ button: 'right' });
    }

    async showPromoModal() {
        const coffeeNames = Object.values(CoffeeTypes);

        for (let i = 0; i < 3; i++) {
            const randomName = coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
            const coffeeItem = this.getCoffeeLocator(randomName);
            await coffeeItem.click();
        }
    }

    async showPaymentModal(): Promise<void> {
        await this.totalBtn.click();
    }

    async showCheckout() { await this.totalBtn.hover(); }
}
