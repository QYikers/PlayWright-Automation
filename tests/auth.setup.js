const {test: setup, expect} = require('@playwright/test');
const path = require('path');
const authFile = path.join(__dirname, './playwright/.auth/user.json');


setup('Automatica Authenticatiion',async ({page})=>{
    await page.goto('https://practice.expandtesting.com/notes/app/login');
    await page.fill('input[name=email]','testuser_1767533699274@example.com');
    await page.fill('input[name=password]','TestPassword');
    await page.click('button[type=submit]');

    await expect(page.getByText('Logout')).toBeVisible();
    await page.context().storageState({path:authFile});
})