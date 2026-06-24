export class LogInPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://www.saucedemo.com/';
        this.userNameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async login(username, password) {
        await this.goto();
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessageText() {
        return this.errorMessage.textContent();
    }
}
        