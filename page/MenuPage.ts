import {Locator, Page} from "@playwright/test";
import {BasePage} from "./BasePage";
import {
    CoffeeCartComponent,
    AddToCartModal,
    PaymentDetailsModalComponent,
    PromoModal,
    SuccessSnackbarComponent, CartPreviewComponent
} from "../component";
import {StringUtils} from "../utils/stringUtils";
import {CoffeeValue, CoffeeTypes} from "../data/CoffeeTypes";

export class MenuPage extends BasePage {
    protected ConfirmModal: AddToCartModal;
    protected PaymentModal: PaymentDetailsModalComponent;
    protected PromoModal: PromoModal;
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
        this.itemsList = page.locator('ul');
    }

    async navigate(): Promise<void> {
        await this.page.goto("/");
    }

    async isVisible(): Promise<boolean> {
        return this.page.isVisible("");
    }

    async waitForVisible(): Promise<void> {
    }

    async waitForHidden(): Promise<void> {
    }

    async getTotalBtnText(): Promise<string> {
        const text = await this.totalBtn.textContent();
        return text?.trim() || (() => {
            throw new Error("Total button text is missing or empty");
        })();
    }

    async getTotalBtnPrice(): Promise<number> {
        return StringUtils.extractNumbers(await this.getTotalBtnText());
    }

    getCoffeeItem(name: CoffeeValue): CoffeeCartComponent {
        const dataTestValue = StringUtils.nameToDataTest(name);
        const itemLocator = this.itemsList.locator('li').filter({
            has: this.page.locator(`[data-test="${dataTestValue}"]`)
        });

        return new CoffeeCartComponent(itemLocator);
    }

    async addCoffeeToCart(): Promise<void>;
    async addCoffeeToCart(coffee: CoffeeValue): Promise<void>;
    async addCoffeeToCart(coffee?: CoffeeValue): Promise<void> { // empty parameter = random coffee
        let coffeeName: CoffeeValue;

        if (coffee) {
            coffeeName = coffee;
        } else {
            const allCoffees = Object.values(CoffeeTypes);
            coffeeName = allCoffees[Math.floor(Math.random() * allCoffees.length)]['en'];
        }

        const coffeeItem = this.getCoffeeItem(coffeeName);
        await coffeeItem.clickAdd();
    }

    async showConfirmModal(): Promise<void>;
    async showConfirmModal(coffee: CoffeeValue): Promise<void>;

    async showConfirmModal(coffee?: CoffeeValue): Promise<void> { // empty parameter = random coffee 
        let coffeeName: CoffeeValue;
        if (coffee) {
            coffeeName = coffee;
        } else {
            const allCoffees = Object.values(CoffeeTypes);
            coffeeName = allCoffees[Math.floor(Math.random() * allCoffees.length)]['en'];
        }
        const coffeeItem = this.getCoffeeItem(coffeeName);
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

    async showPaymentModal(): Promise<PaymentDetailsModalComponent> {
        await this.totalBtn.waitFor({state: 'visible', timeout: 5000});
        await this.totalBtn.scrollIntoViewIfNeeded();
        await this.totalBtn.click();
        await this.PaymentModal.waitForVisible();
        return this.PaymentModal;
    }

    async showCheckout(): Promise<void> {
        await this.totalBtn.hover();
    }

    get promoModal(): PromoModal {
        return this.PromoModal;
    }

    get paymentModal(): PaymentDetailsModalComponent {
        return this.PaymentModal;
    }

    get successSnackbar(): SuccessSnackbarComponent {
        return this.SuccessSnackbar;
    }

    async reloadPage(): Promise<void> {
        await this.page.reload();
    }

    async addToLocalStorage(coffee: string) {
        await this.page.evaluate((c) => {
            const current = JSON.parse(localStorage.getItem('cart') || '[]');
            current.push(c);
            localStorage.setItem('cart', JSON.stringify(current));
        }, coffee);
    }

    async getLocalStorage(key: string) {
        return this.page.evaluate((k) => localStorage.getItem(k), key);
    }
}
