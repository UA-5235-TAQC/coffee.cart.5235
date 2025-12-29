import { Locator } from '@playwright/test';

export enum Ingredient {
  Espresso = 'espresso',
  SteamedMilk = 'steamed milk',
  MilkFoam = 'milk foam',
  WhippedCream = 'whipped cream',
  ChocolateSyrup = 'chocolate syrup',
  Water = 'water',
  SteamedCream = 'steamed cream'
}
export class IngredientComponent {
  private readonly rootElement: Locator;

  constructor(rootElement: Locator) {
    this.rootElement = rootElement;
  }
  getIngredientByName(name: string): Locator {
    return this.rootElement.locator(`text='${name}'`);
  }

  async getName(): Promise<string> {
    const text = await this.rootElement.innerText();
    return text.trim();
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
