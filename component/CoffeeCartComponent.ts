import { Locator } from '@playwright/test';
import { CoffeeTypes } from "../data/CoffeeTypes";


export class CoffeeCartComponent {
    readonly root: Locator;

    private readonly nameLabel: Locator;
    private readonly priceLabel: Locator;
    privare readonly 