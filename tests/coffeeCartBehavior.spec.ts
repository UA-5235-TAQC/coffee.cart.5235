import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePagesComponents";
import { CoffeeTypes } from "../data/CoffeeTypes";
import { TestDataBuilder } from "../data";

let name: string;
let email: string;
let cyrillicName = TestDataBuilder.validNames()[5];

test.beforeEach("Navigate to Coffee Cart", async({menuPage}) => {    
    ({ name, email } = TestDataBuilder.validPaymentDetails());
    await menuPage.navigate();
    await menuPage.waitForVisible();
});

test.describe('Coffee cart app behaviour', () => { 
    
    test('Verify Payment details form allows submission \
        with Name in Cyrillic', async ({ menuPage, paymentModal, snackbar }) => {    

        await test.step("Add 1 random coffe and open payment modal", async() => {
            await menuPage.addCoffeeToCart();
            await menuPage.showPaymentModal();    
            await paymentModal.waitForVisible();
            expect(await paymentModal.isVisible()).toBeTruthy();            
        });

        await test.step("Fill in the modal and submit payment", async() => {            
            await paymentModal.enterName(cyrillicName);
            await paymentModal.enterEmail(email);
            await paymentModal.togglePromotionAgreement();
            await paymentModal.submitPayment();
            await paymentModal.waitForHidden();
        });    

        await test.step("Verify confirmation message and payment modal is closed", async() => {
            await snackbar.waitForVisible();
            expect(await paymentModal.isVisible()).toBeFalsy();
            expect(await snackbar.isVisible()).toBeTruthy();
        });    

        await test.step("Re-open payment modal", async() => {
            await snackbar.waitForHidden();
            await menuPage.showPaymentModal();
            await paymentModal.waitForVisible();
        });    

        await test.step("Get payment data, verify cart state and item count", async() => {
            const itemCount = await menuPage.getItemCount();
            const name = await paymentModal.getNameValue();
            const email = await paymentModal.getEmailValue();
            const checkbox = await paymentModal.isPromotionChecked();

            expect(name).toBeFalsy();
            expect(email).toBeFalsy();
            expect(checkbox).toBeFalsy();
            expect(itemCount).toBe(0);
        });
    });

    test('Verify state of Payment details modal \
        after closing without submitting', async ({menuPage, paymentModal, snackbar }) => {

        await test.step("Open payment modal", async() => {
            await menuPage.showPaymentModal();    
            await paymentModal.waitForVisible();
            expect(await paymentModal.isVisible()).toBeTruthy();
        });    

        await test.step("Fill in and close the payment modal", async() => {            
            await paymentModal.enterName(name);
            await paymentModal.enterEmail(email);
            await paymentModal.togglePromotionAgreement();    
            await paymentModal.closeModal();
            await paymentModal.waitForHidden();
        });    

        await test.step("Verify no confirmation message and payment modal is closed", async() => {
            expect(await paymentModal.isVisible()).toBeFalsy();
            expect(await snackbar.isVisible()).toBeFalsy();
        });    

        await test.step("Re-open the modal and verify data and state remains unchanged", async() => {
            await menuPage.showPaymentModal();    
            expect(await paymentModal.getNameValue()).toBe(name);
            expect(await paymentModal.getEmailValue()).toBe(email);
            expect(await paymentModal.isPromotionChecked()).toBeTruthy();        
        });
    });

    test('Ensure promo Mocha offer does not appear after \
        adding three items via right-click “Add item to the cart?” modal',
        async ({ menuPage, cartPage, addToCartModal, promoModal }) => {

            await test.step("Add 3 coffee items via context menu", async() => {
                const coffee = menuPage.getCoffeeItem(CoffeeTypes.Espresso.en);
                for (let i = 0; i < 3; i++) {
                    await coffee.rightClick();
                    await addToCartModal.accept();
                }
            });

            await test.step("Verify promo item modal is NOT visible and item count = 3", async() => {
                const isPromoVisible = await promoModal.isVisible();
                const itemCount = await menuPage.getItemCount();

                // ВИПРАВЛЕНО: Ми очікуємо, що модалка НЕ з'явиться (false)
                expect(isPromoVisible).toBeFalsy();
                expect(itemCount).toBe(3);
            });

            await test.step("Verify no discounted Mocha is added automatically to the cart", async() => {
                await menuPage.clickCartLink();
                await cartPage.waitForVisible();
                const mochaItem = await cartPage.getItemByName(CoffeeTypes.Mocha.en);

                // Перевіряємо, що Mocha не додалася як акційний товар
                expect(mochaItem).toBeNull();
            });
        });
    
    test('Verify cart link in header displays \
        correct total item count', async ({ menuPage, cartPreview}) => {
        
        await test.step("Add 1 espresso and verify count", async() => {
            await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);    
            expect(await menuPage.getItemCount()).toBe(1);
        });
        
        await test.step("Add 2 more espresso cups and verify count", async() => {        
            await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
            await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
            expect(await menuPage.getItemCount()).toBe(3);
        });
        
        await test.step("Add 2 espresso macchiato cups and verify count", async() => {  
            await menuPage.addCoffeeToCart(CoffeeTypes.EspressoMacchiato.en);
            await menuPage.addCoffeeToCart(CoffeeTypes.EspressoMacchiato.en);
            expect(await menuPage.getItemCount()).toBe(5);
        });

        await test.step("Remove 1 espresso macciato and verify total products count", async() => {  
            await menuPage.showCheckout();
            await cartPreview.decreaseItemQuantity(CoffeeTypes.EspressoMacchiato.en);
            expect(await menuPage.getItemCount()).toBe(4);  
        }); 
    });    
    
    test('Verify repeated trigger of “It’s your lucky day!” modal \
        and multiple Mocha additions', async ({ menuPage, cartPage, promoModal }) => {            
        
        await test.step("Add 3 americano and accept promo coffee", async() => {
            await menuPage.triggerPromo(CoffeeTypes.Americano.en);
            await promoModal.acceptPromo();    
            expect(await menuPage.getItemCount()).toBe(4);
        });
    
        await test.step("Add 3 cappuccino and accept promo coffee", async() => {
            await menuPage.triggerPromo(CoffeeTypes.Cappuccino.en);
            await promoModal.acceptPromo();  
            expect(await menuPage.getItemCount()).toBe(7);
        });    
        
        await test.step("Add 3 flat white and accept promo coffee", async() => {
            await menuPage.triggerPromo(CoffeeTypes.FlatWhite.en);
            await promoModal.acceptPromo();  
            expect(await menuPage.getItemCount()).toBe(10);
        });      
        
        await test.step("Verify 3 discounted mocha successfuly added to a cart", async() => {
            await menuPage.clickCartLink();
            const mocha = await cartPage.getItemByName(CoffeeTypes.Mocha.en);
            expect(await mocha?.getQuantity()).toBe(3);
        }); 
    });
});