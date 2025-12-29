import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartItem } from "../models/cart-item"


export class CartPage extends BasePage {    
    private totalQuantity: Locator;
    private emptyCartMessage: Locator;
    private cartItem: Locator;
    private checkoutButton: Locator;

    constructor(page: Page) {
        super(page);        
        this.totalQuantity = this.page.getByRole("link", { name: "Cart" })
        this.emptyCartMessage = this.page.getByText('No coffee, go add some.');
        this.cartItem = this.page.locator('xpath=//*[@id="app"]/div[2]/div/ul/li');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
    }

    async navigate(): Promise<void> {
        await this.page.goto("/cart");
    }
    
    async getItemsList(): Promise<CartItem[]> {
        const itemList: CartItem[] = []
        const count = await this.cartItem.count()

        for (let i = 1; i < count; i++) {                           
            const item = await this.cartItem.nth(i).textContent()

            if (item) {
                const parsedItem = this.parseCartItem(item)
                if (parsedItem) {
                    itemList.push(parsedItem)   
                }
            }
        }
        
        return itemList
    }

    async getTotalPrice(): Promise<number> {
        const empty = await this.isEmpty()
        if (!empty) {
            const price = (await this.checkoutButton.innerText()).split('$')[1] 
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
        await this.checkoutButton.click()        
    }

    async getItemByName(itemName: string): Promise<CartItem | null> {
        const itemLocator = this.cartItem.filter({hasText: itemName}).first()
        const count = await itemLocator.count()   

        if (count === 0) {
            return null
        }
        
        const item = await itemLocator.textContent() ?? '' 
        const parsedItem = this.parseCartItem(item)

        return parsedItem
    }

    private parseCartItem(item: string): CartItem | null {
        const parts = item.split('$')

        if (parts.length === 3) {
            let cartItem: CartItem = {
                title: parts[0].trim(),
                price: parseFloat(parts[1].split('x')[0].trim()), 
                quantity: Number(parts[1].split('x')[1].replace(/[+-]/g, '').trim()),
                totalPrice: parseFloat(parts[2].replace('x', '').trim())
            }
            return cartItem
        }

        return null
    }
}
