import { Locator } from '@playwright/test';
import { BasePage } from '../page/BasePage';
import { IngredientValue } from '../data/IngredientTypes';


export class IngredientComponent extends BasePage {
    navigate(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    private readonly rootElement: Locator;

    constructor(rootElement: Locator) {
        super(rootElement.page());
        this.rootElement = rootElement;
    }

    getIngredientByName(name: IngredientValue): Locator {
        return this.rootElement.locator(`text="${name}"`);
    }
    async getName(): Promise<string> {
        return (await this.rootElement.innerText()).trim();
    }

    async isVisible(): Promise<boolean> {
        return await this.rootElement.isVisible();
    }

    async getColor(): Promise<string> {
        return await this.rootElement.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });
    }
}
