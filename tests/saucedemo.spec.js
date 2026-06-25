import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises'; // Make sure fs is imported!
import { LogInPage } from '../pages/LogInPages.js';
import { InventoryPage } from '../pages/InventoryPages.js';
import { CartPage } from '../pages/CartPages.js';
import { CheckOutPage } from '../pages/CheckOutPages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loginDataPath = path.join(__dirname, 'data', 'loginData.json');
const loginData = JSON.parse(await fs.readFile(loginDataPath, 'utf8'));


test.describe('SauceDemo E2E Tests Authentication Test', () => {

    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LogInPage(page);
        await page.goto('https://www.saucedemo.com/');
    });

    test('Valid Login Test', async ({ page }) => {

        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('text=Products')).toBeVisible();
        await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    });

    for (const account of loginData.invalidAccounts) {
        test(`Invalid Login Test - ${account.user}`, async ({ page }) => {
            await loginPage.login(account.user, account.pass);
            const errorText = await loginPage.getErrorMessageText();
            await expect(errorText).toBe(account.expectedError);
        });
    }

    test('Invalid Login Test - Empty Fields', async ({ page }) => {
        await loginPage.login('', '');
        const errorText = await loginPage.getErrorMessageText();
        await expect(errorText).toBe('Epic sadface: Username is required');
    });
});


test.describe('SauceDemo Shopping Suite', () => {

    let loginPage;
    let inventoryPage;
    let cartPage;
   
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LogInPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
       
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test.describe('Inventory Page Actions', () => {
        test('Add Item to Cart Test', async ({ page }) => {
            await inventoryPage.addItemToCart();
            const badgeCount = await inventoryPage.getCartBadgeCount();
            await expect(badgeCount).toBe(1);
        });

        test('Cart Page Navigation Test', async ({ page }) => {
            await inventoryPage.goToCart();
            await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        });
    });

    test.describe('Cart & Checkout Operations', () => {
        
        test.beforeEach(async ({ page }) => {
            await inventoryPage.addItemToCart();
            await inventoryPage.goToCart();
        });

        test('Remove Item from Cart Test', async ({ page }) => {
            await cartPage.removeItem('sauce-labs-backpack');
            const badgeCount = await cartPage.getCartBadgeCount();
            await expect(badgeCount).toBe(0);
        });

        test('Cart Item Validation Test', async ({ page }) => {
            const isItemInCart = await cartPage.isItemInCart('Sauce Labs Backpack');
            await expect(isItemInCart).toBeTruthy();
        });

        test('Cart Item Quantity Test', async ({ page }) => {
            const quantity = await cartPage.getItemQuantity('Sauce Labs Backpack');
            await expect(quantity).toBe(1);
        });

        test('Checkout Process Test', async ({ page }) => {
            const checkoutPage = new CheckOutPage(page);
            await cartPage.proceedToCheckout();
            await checkoutPage.fillShippingInformation('John', 'Doe', '12345');
            await checkoutPage.continueCheckout();
            await checkoutPage.finishCheckout();
            await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        });
    });
});