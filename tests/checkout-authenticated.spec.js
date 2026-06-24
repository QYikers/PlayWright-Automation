import {test, expect} from '@playwright/test';
import {CartPage} from '../pages/CartPages.js';
import {InventoryPage} from '../pages/InventoryPages.js';
import {CheckOutPage} from '../pages/CheckOutPages.js';

test.describe('Checkout Process for Autheticanted User',()=>{
    test.beforeEach(async({page})=>{
        await page.goto('https://www.saucedemo.com/inventory.html');

    })
    test('Adding Item to Cart',async({page})=>{
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        const badgeCount = await inventoryPage.getCartBadgeCount();
        await expect(badgeCount).toBe(1);
    })

    test('Verifying Item in Cart',async({page})=>{
       
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const isItemInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
        await expect(isItemInCart).toBeTruthy();
    })

    test('Checkout Process', async({page})=>{
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.proceedToCheckout();
        const checkoutPage = new CheckOutPage(page);
        await checkoutPage.fillShippingInformation('John','Doe','12345');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        const successMessage = page.locator('.complete-header');
        await expect(successMessage).toHaveText('Thank you for your order!');
    })
})