import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { join } from "path/posix";


export class CartPage extends BasePage {
    private pageURL: Locator;
    private totalPrice: Locator;
    private totalQuantity: Locator;
    private emptyCartMessage: Locator;
    private cartItem: Locator;
    private checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pageURL = this.page.getByRole('link', { name: 'Cart page' });
        this.totalPrice = this.page.locator('[data-test="checkout"]');
        this.totalQuantity = this.page.getByRole("link", { name: "Cart" })
        this.emptyCartMessage = this.page.getByText('No coffee, go add some.');
        this.cartItem = this.page.locator('xpath=//*[@id="app"]/div[2]/div/ul/li');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
    }

    async navigate(): Promise<void> {
        await this.pageURL.click()
    }
    
    async getItemsList(): Promise<object[]> {
        const itemList: object[] = []
        const count = await this.cartItem.count()

        for (let i = 1; i < count; i++) {                           
            const item = await this.cartItem.nth(i).textContent() 

            if (item) {
                const parsedItem = this.parseCartItem(item)
                itemList.push(parsedItem)   
            }
        }
        
        return itemList
    }

    async getTotalPrice(): Promise<number> {
        const empty = await this.isEmpty()
        if (!empty) {
            let price = (await this.totalPrice.innerText()).split('$')[1] 
            return parseFloat(price)
        }        
        return 0
    }

    async getTotalQuantity(): Promise<number> {
        let quantity = await this.totalQuantity.innerText()
        quantity = quantity.split(' ')[1].replace(/[()]/g, '')
        return Number(quantity)
    }

    async isEmpty(): Promise<boolean> {
        const isVisible = await this.emptyCartMessage.isVisible()   
        const quantity = await this.getTotalQuantity()
        const status = isVisible && quantity === 0
        return status
    }

    async openCheckout(): Promise<void> {
        const button = await this.checkoutButton.click()        
    }

    async getItemByName(itemName: string): Promise<object> {
        const itemLocator = this.cartItem.filter({hasText: itemName}).first()
        const count = await itemLocator.count()   

        if (count === 0) {
            return {}
        }
        
        const item = await itemLocator.textContent() ?? '' 
        const parts = item.split('$')

        if (parts.length < 2) {            
            return {}
        }

        const parsedItem = this.parseCartItem(item)

        return parsedItem
    }

    private parseCartItem(item: string): object {
        interface CartItem {
            title: string;
            price: number;
            quantity: number;
            totalPrice: number;
        }

        const parts = item.split('$')

        let cartItem: CartItem = {
            title: parts[0].trim(),
            price: parseFloat(parts[1].split('x')[0].trim()), 
            quantity: Number(parts[1].split('x')[1].replace(/[+-]/g, '').trim()),
            totalPrice: parseFloat(parts[2].replace('x', '').trim())
        }

        return cartItem
    }
}
