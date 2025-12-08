export class LogInPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://www.saucedemo.com/';
        this.userNameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        
    }

    async login(username, password) {
        await this.page.goto(this.url);
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async invalidLogin(username, password) {
        await this.page.goto(this.url);
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
        