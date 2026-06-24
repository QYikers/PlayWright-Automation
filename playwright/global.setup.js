import { test, expect } from '@playwright/test';

const STORAGE_STATE_PATH = 'playwright/.auth/user.json';

test('Generate SauceDemo authenticated state', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('text=Products')).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
