import { test, expect } from '@playwright/test';
import { LogInPage } from '../pages/LogInPages.js';
import testData from './data/testData.json' assert { type: 'json' };

for (const account of testData.invalidAccounts) {
  test(`Invalid Login - ${account.user}`, async ({ page }) => {
    const loginPage = new LogInPage(page);
    await loginPage.login(account.user, account.pass);
    const errorText = await loginPage.getErrorMessageText();
    await expect(errorText).toBe(account.expectedError);
  });
}
