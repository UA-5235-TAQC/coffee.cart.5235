import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CoffeeCartComponent } from "../component/CoffeeCartComponent";
import { AddToCartModal } from "../component/AddToCartModal";
import { PaymentDetailsModalComponent } from "../component/PaymentDetailsModalComponent";
import { PromoModal } from "../component/PromoModalComponent";
import { SuccessSnackbarComponent } from "../component/SuccessSnackbarComponent";
import { CartPreviewComponent } from "../component/CartPreviewComponent";
import { StringUtils } from "../utils/stringUtils";
import { CoffeeType, CoffeeTypes } from "../data/CoffeeTypes";

export  class MenuPage extends BasePage {
    protected ConfirmModal: AddToCartModal;     
    protected PaymentModal: PaymentDetailsModalComponent; 
    public PromoModal: PromoModal; 
    protected SuccessSnackbar: SuccessSnackbarComponent; 
    protected CartPreview: CartPreviewComponent; 
    protected totalBtn: Locator;
    protected itemsList: Locator;

    constructor(page: Page) {
        super(page);
        this.ConfirmModal = new AddToCartModal(page);
        this.PaymentModal = new PaymentDetailsModalComponent(page);
        this.PromoModal = new PromoModal(page);
        this.SuccessSnackbar = new SuccessSnackbarComponent(page);
        this.CartPreview = new CartPreviewComponent(page);
        this.totalBtn = page.getByLabel('Proceed to checkout');
        this.itemsList = page.getByLabel('Proceed to checkout');
        this.itemsList = page.locator('ul');
    }
    async navigate(): Promise<void> {
        await this.page.goto("/");
    }

    async getTotalBtnText(): Promise<string> {
        const text = await this.totalBtn.textContent();
        return text?.trim() || (() => { throw new Error("Total button text is missing or empty"); })();
    }

    async getTotalBtnPrice(): Promise<number> {
        return StringUtils.extractNumbers(await this.getTotalBtnText());
    }

    getCoffeeItem(name: CoffeeType): CoffeeCartComponent {
        const itemLocator = this.itemsList.locator('li').filter({
            has: this.page.locator('h4', { hasText: new RegExp(`^${name}`) })
        });

        return new CoffeeCartComponent(itemLocator);
    }
    
async addCoffeeToCart(): Promise<void>; 
async addCoffeeToCart(coffee: CoffeeType): Promise<void>;

async addCoffeeToCart(coffee?: CoffeeType): Promise<void> { // empty parameter = random coffee
    let coffeeType: CoffeeType;

    if (coffee) {
        coffeeType = coffee;
    } else {
        const allCoffees = Object.values(CoffeeTypes);
        coffeeType = allCoffees[Math.floor(Math.random() * allCoffees.length)];
    }

    const coffeeItem = this.getCoffeeItem(coffeeType); 
    await coffeeItem.clickAdd();
}

    async showConfirmModal(): Promise<void>; 
    async showConfirmModal(coffee: CoffeeType): Promise<void>; 

    async showConfirmModal(coffee?: CoffeeType): Promise<void> { // empty parameter = random coffee 
        let coffeeType: CoffeeType;
        if (coffee) {
            coffeeType = coffee;
        } else {
            const allCoffees = Object.values(CoffeeTypes);
            coffeeType = allCoffees[Math.floor(Math.random() * allCoffees.length)];
        }
        const coffeeItem = this.getCoffeeItem(coffeeType);
        await coffeeItem.rightClick();
    }

   async showPromoModal() {
        let attempts = 0;
        const maxAttempts = 10;
        while (!(await this.PromoModal.isVisible()) && attempts < maxAttempts) {
            await this.addCoffeeToCart();
            attempts++;
        }
        try {
            await this.PromoModal.waitForVisible();
        } catch (e) {
           throw new Error(`Promo modal did not appear... Original error: ${(e as Error).message}`);
        }
    }

    async showPaymentModal(): Promise<void> {
        await this.totalBtn.click();
    }

    async showCheckout() { await this.totalBtn.hover(); }
}
