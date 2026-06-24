import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPages.js';

test('Cart is visible for authenticated user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  const inventoryPage = new InventoryPage(page);
  const badgeCount = await inventoryPage.getCartBadgeCount();
  await expect(badgeCount).toBeGreaterThanOrEqual(0);
  await expect(inventoryPage.cartLink).toBeVisible();
});
