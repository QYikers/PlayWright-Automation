const {test, expect} = require('@playwright/test');
const { beforeEach } = require('node:test');

test.describe('SauceDemo E2E Tests Authentication Test', () => {
    


    test('Valid Login Test', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });
    
    test('Invalid Login Test - Wrong Password', async ({ page }) => {
         await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'wrong_password');
        await page.click('#login-button');
        const errorMessage = await page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Invalid Login Test - Empty Fields', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.click('#login-button');
        const errorMessage = await page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    });

    
});

test.describe('SauceDemo E2E Tests Inventory Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Add Item to Cart Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        const cartBadge = await page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('1');
    });

    test('Remove Item from Cart Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        await page.click('[data-test="remove-sauce-labs-backpack"]');
        const cartBadge = await page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveCount(0);
    });

    test('Cart Page Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    });

    test('Cart Item Validation Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        const cartItem = await page.locator('.cart_item');
        await expect(cartItem).toBeVisible();
        const itemName = await cartItem.locator('.inventory_item_name');
        await expect(itemName).toHaveText('Sauce Labs Backpack');
    });

    test('Cart Item Quantity Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        const cartItem = await page.locator('.cart_item');
        const itemQuantity = await cartItem.locator('.cart_quantity');
        await expect(itemQuantity).toHaveText('1');
    });

    test('Checkout Process Test', async ({ page }) => {
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        await page.click('[data-test="checkout"]');
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
        await page.fill('[data-test="firstName"]', 'John');
        await page.fill('[data-test="lastName"]', 'Doe');
        await page.fill('[data-test="postalCode"]', '12345');
        await page.click('[data-test="continue"]');
        await page.click('[data-test="finish"]');
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    });

});
