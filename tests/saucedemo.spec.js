const {test, expect} = require('@playwright/test');
const { LogInPage } = require('../pages/LogInPages');
const { InventoryPage } = require('../pages/InventoryPages');
const { CartPage } = require('../pages/CartPages');
const { CheckOutPages } = require('../pages/CheckOutPages');

test.describe('SauceDemo E2E Tests Authentication Test', () => {
    


    test('Valid Login Test', async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.login('standard_user', 'secret_sauce');     
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });
    
    test('Invalid Login Test - Wrong Password', async ({ page }) => {
       const loginPage = new LogInPage(page);
        await loginPage.invalidLogin('standard_user', 'wrong_password');
        const errorMessage = await page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Invalid Login Test - Empty Fields', async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.invalidLogin('', '');
        const errorMessage = await page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    });

    
});

test.describe('SauceDemo E2E Tests Inventory Test', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Add Item to Cart Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.addItemToCart();
        const cartBadge = await page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('1');
    });

    test('Remove Item from Cart Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartBadge = await page.locator('.shopping_cart_badge');
        const cartPage = new CartPage(page);
        await cartPage.removeItem('sauce-labs-backpack');
        await expect(cartBadge).toHaveCount(0);
    });

    test('Cart Page Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.goToCart();
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    });

    test('Cart Item Validation Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const isItemInCart = await cartPage.validateItemInCart('Sauce Labs Backpack');
        await expect(isItemInCart).toBeTruthy();
    });

    test('Cart Item Quantity Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const isQuantityCorrect = await cartPage.validateItemQuantity('Sauce Labs Backpack', 1);
        await expect(isQuantityCorrect).toBeTruthy();
        const itemQuantity = page.locator('.cart_item .cart_quantity');
        await expect(itemQuantity).toHaveText('1');
    });

    test('Checkout Process Test', async ({ page }) => {
        const inventoryPage =  new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.proceedToCheckout();
        const checkoutPages = new CheckOutPages(page);
        await checkoutPages.fillShippingInformation('John', 'Doe', '12345');
        await checkoutPages.completeCheckout();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    });

});
