import {test, expect} from '@playwright/test';
import {CartPage} from '../pages/CartPages.js';
import {InventoryPage} from '../pages/InventoryPages.js';
import {CheckOutPage} from '../pages/CheckOutPages.js';

test.describe('Checkout Process for Autheticanted User',()=>{

    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async({page})=>{

        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckOutPage(page);
        
        await page.goto('https://www.saucedemo.com/inventory.html');
        await inventoryPage.addItemToCart();
    })
    test('Adding Item to Cart',async({page})=>{
        
        const badgeCount = await inventoryPage.getCartBadgeCount();
        await expect(badgeCount).toBe(1);
    })

    test('Verifying Item in Cart',async({page})=>{
        await inventoryPage.goToCart();
        const isItemInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
        await expect(isItemInCart).toBeTruthy();
    })

    test('Checkout Process', async({page})=>{
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInformation('John','Doe','12345');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        const successMessage = page.locator('.complete-header');
        await expect(successMessage).toHaveText('Thank you for your order!');
    })
})