import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { PaymentDetailsModalComponent } from "../component";
import { SuccessSnackbarComponent } from "../component";
import { AddToCartModal } from "../component";
import { PromoModal } from "../component";
import { CoffeeTypes, CoffeeValue } from "../data/CoffeeTypes";
import { CartPreviewComponent } from "../component";
import { DISCOUNTED_COFFEE, VALID_EMAIL_1, VALID_NAME_1 } from "../config/env";


test.describe('Test suite by - Yaroslav Prokhorenko', () => { 
    
    test('Test case #34 - Verify Payment details form allows submission \
        with Name in Cyrillic', async ({ menuPage, page }) => {

        const checkout = new PaymentDetailsModalComponent(page);
        const confirmation = new SuccessSnackbarComponent(page);
    
        await menuPage.navigate();
        await menuPage.waitForVisible();
    
        // Add 1 random coffee
        await menuPage.addCoffeeToCart();
    
        // Open payment modal
        await menuPage.showPaymentModal();    
        await checkout.waitForVisible();
        expect(await checkout.isVisible()).toBeTruthy();
    
        // Fill in the modal and submit payment
        await checkout.enterName(VALID_NAME_1);
        await checkout.enterEmail(VALID_EMAIL_1);
        await checkout.togglePromotionAgreement();
        await checkout.submitPayment();
        await checkout.waitForHidden();
    
        // Verify confirmation message occur and payment modal is closed
        await confirmation.waitForVisible();
        expect(await checkout.isVisible()).toBeFalsy();
        expect(await confirmation.isVisible()).toBeTruthy();
    
        // Re-open payment modal
        await confirmation.waitForHidden();
        await menuPage.showPaymentModal();
        await checkout.waitForVisible();
    
        // Get payment data
        const itemCount = await menuPage.getItemCount();
        const name = await checkout.getNameValue();
        const email = await checkout.getEmailValue();
        const checkbox = await checkout.isPromotionChecked();
    
        // Verify cart state and item count = 0
        expect(name).toBeFalsy();
        expect(email).toBeFalsy();
        expect(checkbox).toBeFalsy();
        expect(itemCount).toBe(0);
    });

    test('Test case #32 - Verify state of Payment details modal \
        after closing without submitting', async ({menuPage, page}) => {
            
        const checkout = new PaymentDetailsModalComponent(page);
        const confirmation = new SuccessSnackbarComponent(page);
    
        await menuPage.navigate();
        await menuPage.waitForVisible();
    
        // Open payment modal
        await menuPage.showPaymentModal();    
        await checkout.waitForVisible();
        expect(await checkout.isVisible()).toBeTruthy();
    
        // Fill in and close the payment modal
        await checkout.enterName(VALID_NAME_1);
        await checkout.enterEmail(VALID_EMAIL_1);
        await checkout.togglePromotionAgreement();    
        await checkout.closeModal();
        await checkout.waitForHidden();
    
        // Verify no confirmation message occur and payment modal is closed
        expect(await checkout.isVisible()).toBeFalsy();
        expect(await confirmation.isVisible()).toBeFalsy();
    
        // Re-open the modal and verify data and state remains unchanged
        await menuPage.showPaymentModal();    
        expect(await checkout.getNameValue()).toBe(VALID_NAME_1);
        expect(await checkout.getEmailValue()).toBe(VALID_EMAIL_1);
        expect(await checkout.isPromotionChecked()).toBeTruthy();        
    });     
    
    test('Test case #31 - Ensure promo Mocha offer does not appear after \
        adding three items via right-click “Add item to the cart?” modal',
        async ({ menuPage, page, cartPage }) => {

        const addModal = new AddToCartModal(page);
        const coffee = menuPage.getCoffeeItem(CoffeeTypes.Espresso.en);
        const promo = new PromoModal(page);
    
        await menuPage.navigate();
        await menuPage.waitForVisible();
        
        // Add 3 items 
        for (let i = 0; i < 3; i++) {
            await coffee.hoverItem(); 
            await coffee.rightClick();   
            await addModal.waitForVisible();     
            await addModal.accept();
        }
    
        // Verify promo item modal is appear and item count = 3
        const result = await promo.isVisible();
        const itemCount = await menuPage.getItemCount();
        expect(result).toBeTruthy(); // test failure - Bug
        expect(itemCount).toBe(3);
        
        // Navigate to Cart Page and verify no discounted Mocha is added automatically
        await menuPage.clickCartLink();
        await cartPage.waitForVisible();
        const isExists = await cartPage.getItemByName(DISCOUNTED_COFFEE);
        expect(isExists).toBeNull();
    });
    
    test('Test case #29 - Verify cart link in header displays \
        correct total item count', async ({ menuPage, page}) => {
        const coffee1 = CoffeeTypes.Espresso.en;
        const coffee2 = CoffeeTypes.EspressoMacchiato.en;
        const preview = new CartPreviewComponent(page);
    
        await menuPage.navigate();
        await menuPage.waitForVisible();
        
        // Add 1 coffe
        await menuPage.addCoffeeToCart(coffee1);    
        expect(await menuPage.getItemCount()).toBe(1);
    
        // Add 2 more coffee
        await menuPage.addCoffeeToCart(coffee1);
        await menuPage.addCoffeeToCart(coffee1);
        expect(await menuPage.getItemCount()).toBe(3);
    
        // Add 2 more cups different coffee
        await menuPage.addCoffeeToCart(coffee2);
        await menuPage.addCoffeeToCart(coffee2);
        expect(await menuPage.getItemCount()).toBe(5);
    
        // Remove 1 coffee
        await menuPage.showCheckout();
        await preview.decreaseItemQuantity(coffee2);
        expect(await menuPage.getItemCount()).toBe(4);    
    });    
    
    test('Test case #28 - Verify repeated trigger of “It’s \
        your lucky day!” modal and multiple Mocha additions',
        async ({ menuPage, page, cartPage }) => {

        const addPromo = new PromoModal(page);
        const coffee1 = CoffeeTypes.Americano.en;
        const coffee2 = CoffeeTypes.Cappuccino.en;
        const coffee3 = CoffeeTypes.FlatWhite.en;
    
        // Trigger promo function
        async function promoTrigger(item: CoffeeValue) {
            for (let i = 0; i < 3; i++) {
                await menuPage.addCoffeeToCart(item);
                let count = await menuPage.getItemCount();
                if (count % 3 === 0) {
                    break;
                };           
            };          
        };
    
        // Accept promo function
        async function applyPromo() {
            await addPromo.waitForVisible();
            await addPromo.acceptPromo();  
        };
        
        await menuPage.navigate();    
        await menuPage.waitForVisible();    
    
        // First cycle
        await promoTrigger(coffee1);
        await applyPromo();    
        expect(await menuPage.getItemCount()).toBe(4);
    
        // Second cycle
        await promoTrigger(coffee2);
        await applyPromo();
        expect(await menuPage.getItemCount()).toBe(7);
    
        // Third cycle
        await promoTrigger(coffee3);
        await applyPromo(); 
        expect(await menuPage.getItemCount()).toBe(10);
    
        // Verify 3 'Discounted Mocha' presents in cart
        await menuPage.clickCartLink();
        const mocha = await cartPage.getItemByName(DISCOUNTED_COFFEE);
        expect(await mocha?.getQuantity()).toBe(3);
    });
});
