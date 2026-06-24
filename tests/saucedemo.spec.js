import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { LogInPage } from '../pages/LogInPages.js';
import { InventoryPage } from '../pages/InventoryPages.js';
import { CartPage } from '../pages/CartPages.js';
import { CheckOutPage } from '../pages/CheckOutPages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loginDataPath = path.join(__dirname, 'data', 'loginData.json');
const loginData = JSON.parse(await fs.readFile(loginDataPath, 'utf8'));

test.describe('SauceDemo E2E Tests Authentication Test', () => {
    test('Valid Login Test', async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        // Functional assertions instead of a visual snapshot
        await expect(page.locator('text=Products')).toBeVisible();
        await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    });

    for (const account of loginData.invalidAccounts) {
        test(`Invalid Login Test - ${account.user}`, async ({ page }) => {
            const loginPage = new LogInPage(page);
            await loginPage.login(account.user, account.pass);
            const errorText = await loginPage.getErrorMessageText();
            await expect(errorText).toBe(account.expectedError);
        });
    }

    test('Invalid Login Test - Empty Fields', async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.login('', '');
        const errorText = await loginPage.getErrorMessageText();
        await expect(errorText).toBe('Epic sadface: Username is required');
    });
});

test.describe('SauceDemo E2E Tests Inventory Test', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LogInPage(page);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Add Item to Cart Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        const badgeCount = await inventoryPage.getCartBadgeCount();
        await expect(badgeCount).toBe(1);
    });

    test('Remove Item from Cart Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.removeItem('sauce-labs-backpack');
        const badgeCount = await cartPage.getCartBadgeCount();
        await expect(badgeCount).toBe(0);
    });

    test('Cart Page Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goToCart();
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    });

    test('Cart Item Validation Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const isItemInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
        await expect(isItemInCart).toBeTruthy();
    });

    test('Cart Item Quantity Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const quantity = await cartPage.getItemQuantity('Sauce Labs Backpack');
        await expect(quantity).toBe(1);
    });

    test('Checkout Process Test', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.proceedToCheckout();
        const checkoutPage = new CheckOutPage(page);
        await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    })
});
